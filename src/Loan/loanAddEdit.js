import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Dialog, DialogActions, Tooltip ,Checkbox, ListItemText} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { addLoan, editLoan } from "../Services/loanService";
import UserAddEdit from '../User/userAddEdit';
import WarningIcon from '@mui/icons-material/Warning';
import { currencyOptions } from '../constants.js'
import {paymentMethodsOptions}from '../constants.js'
const schema = yup.object({
    borrowerId: yup.number().required().min(1),
    amount: yup.number().required().min(1),
    currency: yup.number().required('מטבע נדרש').oneOf([0, 1, 2,3], 'מטבע לא חוקי'),
    paymentMethods: yup.array().of(yup.number()).min(1, 'חייב לבחור לפחות שיטת תשלום אחת'),
    guarantees: yup.array().of(yup.object({ guarantorId: yup.number().required().min(1) })),
    depositGuarantee: yup.array().of(yup.object({ depositId: yup.number().required().min(1) })),
    frequency: yup.string().required(),
    totalPayments: yup.number().required().min(1),
    repaymentDate: yup.date().required().min(new Date()),
}).required();

const LoanAddEdit = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const users = useSelector(state => state.User.users);
    const deposits = useSelector(state => state.Deposits.deposits);
    const location = useLocation();
    const state = location.state || {};
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [guarantorsSelected, setGuarantorsSelected] = useState([]);
    const [selectedPayments, setSelectedPayments] = useState([]);
    const { register, handleSubmit, control, setValue, watch, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            borrowerId: state.borrower?.id || "",
            amount: state.amount || "",
            currency: state.currency || null, // שים לב לערך ברירת המחדל null
            frequency: state.frequency || "",
            totalPayments: state.totalPayments || "",
            repaymentDate: state.repaymentDate?.split('T')[0] || "",
            guarantees: state.guarantees?.map(g => ({ guarantorId: g.guarantor?.id || "" })) || [],
            depositGuarantee: state.depositGuarantee?.map(g => ({ guarantorId: g.guarantor?.id || "" })) || [],
        },
        mode: 'onChange',
    });
    const handlePaymentChange = (event) => {
        const { value } = event.target;
        setSelectedPayments(typeof value === 'string' ? value.split(',') : value);
    };
    const { fields: guaranteeFields, append: appendGuarantee, remove: removeGuarantee } = useFieldArray({
        control,
        name: "guarantees"
    });

    const { fields: depositGuaranteeFields, append: appendDepositGuarantee, remove: removeDepositGuarantee } = useFieldArray({
        control,
        name: "depositGuarantee"
    });
    useEffect(() => {
        const guarantorsId = watch('guarantees').map(x => +x.guarantorId);
        const borrowerId = watch('borrowerId');
        if (borrowerId) guarantorsId.push(+borrowerId);
        setGuarantorsSelected(guarantorsId);
    }, [watch('borrowerId'), watch('guarantees')]);

    const onSubmit = (data) => {
        const frequencyDays = { '1': 1, '7': 7, '30': 30, '90': 90, '180': 180, '365': 365 };
        const paymentMethodsValue = selectedPayments.reduce((acc, current) => acc + current, 0);
        const repaymentDate = new Date(data.repaymentDate);
        data.repaymentDate = new Date(Date.UTC(repaymentDate.getFullYear(), repaymentDate.getMonth(), repaymentDate.getDate()));
        data.frequency = frequencyDays[data.frequency] || 0;
        const formattedData = { 
            ...data, 
            paymentMethods: paymentMethodsValue // שולח את הערך המקודד של אמצעי התשלום
        };
        state.borrower?.id ? dispatch(editLoan(formattedData, state.borrower.id)) : dispatch(addLoan(formattedData, navigate));
    };

    const renderSelectField = (label, name, options) => (
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>{label}</InputLabel>
            <Select
                label={label}
                value={watch(name) ?? 0} // שימוש ב-null במקום 0
                {...register(name)}
                onChange={(e) => setValue(name, parseInt(e.target.value, 10))} // המרה למספר
            >
                <MenuItem value={null} disabled>בחר {label}</MenuItem>
                {options.map(option => (
                    <MenuItem key={option.id} value={option.id} disabled={guarantorsSelected.includes(option.id)}>
                        {option.name}
                        {option.isReliable === false && (
                            <Tooltip title="משתמש לא אמין">
                                <WarningIcon color="warning" sx={{ ml: 1 }} />
                            </Tooltip>
                        )}
                    </MenuItem>
                ))}
            </Select>

            {errors[name]?.message && <p>{errors[name]?.message}</p>}
        </FormControl>
    );

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 600, margin: '0 auto' }}>
                {renderSelectField("לווה", "borrowerId", users.map(user => ({ id: user.id, name: `${user.firstName} ${user.lastName} ${user.identity}`, isReliable: user.isReliable })))}
                <TextField label="סכום" variant="outlined" fullWidth type="number" {...register("amount")} sx={{ mb: 2 }} />
                {renderSelectField("מטבע", "currency", currencyOptions.map(c => ({ id: c?.value, name: c.label })))}
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                            <InputLabel>שיטת תשלום</InputLabel>
                            <Select
                                label="שיטת תשלום"
                                multiple
                                value={selectedPayments}
                                onChange={handlePaymentChange}
                                renderValue={(selected) => selected.map(id => paymentMethodsOptions.find(option => option.id === id)?.name).join(', ')}
                            >
                                {paymentMethodsOptions.map(option => (
                                    <MenuItem key={option.id} value={option.id}>
                                        <Checkbox checked={selectedPayments.includes(option.id)} />
                                        <ListItemText primary={option.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.paymentMethods?.message && <p>{errors.paymentMethods?.message}</p>}
                        </FormControl>
                {renderSelectField("תדירות", "frequency", [{ id: '1', name: 'יום' }, { id: '7', name: 'שבוע' }, { id: '30', name: 'חודש' }, { id: '90', name: '3 חודשים' }, { id: '180', name: '6 חודשים' }, { id: '365', name: 'שנה' }])}
                <TextField label="מספר תשלומים" variant="outlined" fullWidth type="number" {...register("totalPayments")} sx={{ mb: 2 }} />
                <TextField label="תאריך החזר" variant="outlined" fullWidth type="date" {...register("repaymentDate")} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
                <InputLabel>ערבים</InputLabel>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    {guaranteeFields.map((item, index) => (
                        <Box key={item.id} sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {renderSelectField("ערב", `guarantees.${index}.guarantorId`, users.map(user => ({ id: user.id, name: `${user.firstName} ${user.lastName}`, isReliable: user.isReliable })))}
                            <Button onClick={() => removeGuarantee(index)} color="error">הסר</Button>
                        </Box>
                    ))}
                    <Button onClick={(e) => { e.preventDefault(); appendGuarantee({}); }} variant="outlined" sx={{ mb: 2 }}>הוסף ערב</Button>
                </FormControl>
                <Button onClick={() => setUserDialogOpen(true)} variant="text" sx={{ mb: 2 }}>
                    הוסף ערב חדש
                </Button>
                <InputLabel>ערבות הפקדה</InputLabel>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    {depositGuaranteeFields.map((item, index) => (
                        <Box key={item.id} sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {renderSelectField("הפקדה", `depositGuarantee.${index}.depositId`, deposits.map( deposit=> ({ id: deposit.id, name: `${deposit.amount} ${deposit.depositor.lastName} id:${deposit.id}` })))}
                            <Button onClick={() => removeDepositGuarantee(index)} color="error">הסר</Button>
                        </Box>
                    ))}
                    <Button onClick={(e) => { e.preventDefault(); appendDepositGuarantee({}) }} variant="outlined" sx={{ mb: 2 }}>הוסף הפקדה</Button>
                </FormControl>
             
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={() => navigate('/')} color="secondary">ביטול</Button>
                    <Button type="submit" variant="contained" color="primary" disabled={!isValid}>
                        {state.borrower?.id ? "עדכן הלוואה" : "הוסף הלוואה"}
                    </Button>
                </Box>
            </form>
            <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)}>
                <UserAddEdit open={userDialogOpen} handleClose={() => setUserDialogOpen(false)} />
                <DialogActions>
                    <Button onClick={() => setUserDialogOpen(false)} color="secondary">ביטול</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default LoanAddEdit;
