import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Dialog, DialogActions, Tooltip, Checkbox, Autocomplete, ListItemText } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { addLoan, editLoan } from "../Services/loanService";
import { fetchDepositGuaranteeAmount } from "../Services/userService.js";
import UserAddEdit from '../User/userAddEdit';
import WarningIcon from '@mui/icons-material/Warning';
import { currencyOptions } from '../constants.js'
import { paymentMethodsOptions } from '../constants.js'


const LoanAddEdit = () => {
    const location = useLocation();
    const state = location.state || {};
    const schema = yup.object({
        borrowerId: yup.number().required("שדה חובה").min(1),
        amount: yup.number("ערך מספרי").required("שדה חובה").min(1, 'סכום חייב להיות חיובי').typeError('סכום חייב להיות מספר תקין'),
        currency: yup.number().oneOf([0, 1, 2, 3], 'מטבע לא חוקי').transform((value) => (value === undefined || value === null ? 0 : value)).default(0),
        paymentMethods: yup.array().of(yup.number()).min(1, 'חייב לבחור לפחות שיטת תשלום אחת'),
        guarantees: yup.array().of(yup.object({ guarantorId: yup.number().required().min(1) })),
        depositGuarantee: yup.array().of(yup.object({ depositUserId: yup.number().required().min(1) })),
        frequency: yup.number("ערך מספרי").required("שדה חובה").min(1, 'סכום חייב להיות חיובי').typeError('סכום חייב להיות מספר תקין'),
        totalPayments: yup.number().required("שדה חובה").min(1),
        repaymentDate: yup.date().required("שדה חובה")
            .min(state.borrower?.id ? new Date(1999, 0, 1) : new Date(), "תאריך ההחזר חייב להיות עתידי")

    }).required();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const users = useSelector(state => state.User.users);
    // const [selectedBorrower, setSelectedBorrower] = useState(state?.borrower?.id|| "");
    const [balanceGuaranteeAmounts, setbalanceGuaranteeAmounts] = useState({});
    const [addUser, setaddUser] = useState(false);
    const [guarantorsSelected, setGuarantorsSelected] = useState([]);
    const [selectedPayments, setSelectedPayments] = useState([]);
    // const [customFrequency, setCustomFrequency] = useState('');
    // const [isCustomFrequency, setIsCustomFrequency] = useState(false);

    const { register, handleSubmit, control, setValue, watch, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            borrowerId: state.borrower?.id ? parseInt(state.borrower.id, 10) : "",
            amount: state.amount || "",
            currency: state.currency != null ? parseInt(state.currency, 10) : null,
            frequency: state.frequency != null ? parseInt(state.frequency, 10) : "",
            totalPayments: state.totalPayments || "",
            repaymentDate: state.repaymentDate?.split('T')[0] || "",
            guarantees: state.guarantees?.map(g => ({ guarantorId: parseInt(g.guarantor?.id, 10) })) || [],
            depositGuarantee: state.depositGuarantee?.map(g => ({ depositUserId: parseInt(g.depositUser?.id, 10) })) || [],
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
        const fetchAllGuaranteeAmounts = async () => {
            const amounts = {};
            for (const user of users) {
                const amount = await fetchDepositGuaranteeAmount(user.id);
                amounts[user.id] = amount || 0;
            }
            setbalanceGuaranteeAmounts(amounts);
        };

        fetchAllGuaranteeAmounts();
    }, [users]);

    useEffect(() => {
        const guarantorsId = watch('guarantees').map(x => +x.guarantorId);
        const depositGuaranteeId = watch('depositGuarantee').map(x => +x.depositUserId);
        // const borrowerId = watch('borrowerId');
        const arr = [];
        setGuarantorsSelected(arr.concat(guarantorsId, depositGuaranteeId));
    }, [watch('borrowerId'), watch('guarantees'), watch('depositGuarantee')]);


    const onSubmit = (data) => {
        console.log(selectedPayments);
        const paymentMethodsValue = selectedPayments.reduce((acc, current) => acc + current, 0);
        const repaymentDate = new Date(data.repaymentDate);
        data.repaymentDate = new Date(Date.UTC(repaymentDate.getFullYear(), repaymentDate.getMonth(), repaymentDate.getDate()));
        const formattedData = {
            ...data,
            paymentMethods: paymentMethodsValue
        };
        console.log(formattedData)
        state?.borrower?.id ? dispatch(editLoan(formattedData, state.id, navigate)) : dispatch(addLoan(formattedData, navigate));
    };
    const renderSelectField = (label, name, options, { multiple = false, renderValue } = {}) => (
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>{label}</InputLabel>
            <Select
                label={label}
                multiple={multiple}
                value={watch(name) || 0}
                {...register(name)}
                onChange={(e) => {
                    const value = multiple ? e.target.value : parseInt(e.target.value, 10);
                    setValue(name, value);
                }}
                renderValue={renderValue}
            >

                {/* {!multiple && <MenuItem value={null} disabled>בחר {label}</MenuItem>} */}
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
    const renderAutocompleteField = ({ label, name, options, onChange, value, error, helperText }) => (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => option.name}
            onChange={(e, v) => onChange(v)}
            value={value}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    variant="outlined"
                    fullWidth
                    error={error}
                    helperText={helperText}
                    sx={{ mb: 2 }}
                />
            )}
        />
    );


    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 600, margin: '0 auto' }}>
                {renderSelectField("לווה", "borrowerId", users.map(user => ({ id: user.id, name: `${user.firstName} ${user.lastName} ${user.identity}`, isReliable: user.isReliable })))}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField label="סכום" variant="outlined" fullWidth type="number" {...register("amount")} sx={{ flex: 1 }} />
                    {errors.amount?.message && <p>{errors.amount?.message}</p>}
                    <Box sx={{ width: 120 }}>
                        {renderSelectField("מטבע", "currency", currencyOptions.map(c => ({ id: c.value, name: c.label })))}
                    </Box>
                </Box>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>שיטת תשלום</InputLabel>
                    <Select label="שיטת תשלום" multiple value={selectedPayments} onChange={handlePaymentChange}
                        renderValue={(selected) => selected.map(id => paymentMethodsOptions.find(option => option.id === id)?.name).join(', ')}>
                        {paymentMethodsOptions.map(option => (
                            <MenuItem key={option.id} value={option.id}>
                                <Checkbox checked={selectedPayments.includes(option.id)} /> <ListItemText primary={option.name} /> </MenuItem>))}
                    </Select>
                    {errors.paymentMethods?.message && <p>{errors.paymentMethods?.message}</p>}
                </FormControl>
                <TextField label="תדירות החזר בחודשים" variant="outlined" fullWidth type="number" {...register("frequency")} sx={{ mb: 2 }} />
                {errors.frequency?.message && <p>{errors.frequency?.message}</p>}
                <TextField label="מספר תשלומים" variant="outlined" fullWidth type="number" {...register("totalPayments")} sx={{ mb: 2 }} />
                {errors.totalPayments?.message && <p>{errors.totalPayments?.message}</p>}
                <TextField label="תאריך החזר" variant="outlined" fullWidth type="date" {...register("repaymentDate")} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
                {errors.repaymentDate?.message && <p>{errors.repaymentDate?.message}</p>}
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
                <Button onClick={() => setaddUser(true)} variant="text" sx={{ mb: 2 }}>
                    הוסף ערב חדש
                </Button>
                <InputLabel>ערבים על הפקדות</InputLabel>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    {depositGuaranteeFields.map((item, index) => (
                        <Box key={item.id} sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {renderSelectField("מפקיד", `depositGuarantee.${index}.depositUserId`, users.map(user => ({ id: user.id, name: `${user.firstName} ${user.lastName}  יתרה: ${balanceGuaranteeAmounts[user.id]}`, isReliable: user.isReliable })))}
                            <Button onClick={() => removeDepositGuarantee(index)} color="error">הסר</Button>
                        </Box>
                    ))}
                    <Button onClick={(e) => { e.preventDefault(); appendDepositGuarantee({}); }} variant="outlined" sx={{ mb: 2 }}>הוסף ערב</Button>
                </FormControl>
                <Button onClick={() => setaddUser(true)} variant="text" sx={{ mb: 2 }}>
                    הוסף ערב על הפקדה חדש
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={() => navigate('/')} color="secondary">ביטול</Button>
                    <Button type="submit" variant="contained" color="primary" >
                        {state.borrower?.id ? "עדכן הלוואה" : "הוסף הלוואה"}
                    </Button>
                </Box>
            </form>
            <Dialog open={addUser} onClose={() => setaddUser(false)}>
                <UserAddEdit open={addUser} handleClose={() => setaddUser(false)} />
                <DialogActions>
                    <Button onClick={() => setaddUser(false)} color="secondary">ביטול</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default LoanAddEdit;
