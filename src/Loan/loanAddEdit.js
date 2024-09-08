import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { addLoan, editLoan } from "../Services/loanService";
import UserAddEdit from '../User/userAddEdit';

const schema = yup.object({
    borrowerId: yup.number().required().min(1),
    amount: yup.number().required().min(1),
    guarantees: yup.array().of(yup.object({ guarantorId: yup.number().required().min(1) })),
    frequency: yup.string().required(),
    totalPayments: yup.number().required().min(1),
    repaymentDate: yup.date().required().min(new Date()),
}).required();

const LoanAddEdit = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const users = useSelector(state => state.User.users);
    const location = useLocation();
    const state = location.state || {};
    const [userDialogOpen, setUserDialogOpen] = useState(false);

    const { register, handleSubmit, control, setValue, watch, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            borrowerId: state.borrower?.id || "",
            amount: state.amount || "",
            frequency: state.frequency || "",
            totalPayments: state.totalPayments || "",
            repaymentDate: state.repaymentDate?.split('T')[0] || "",
            guarantees: state.guarantees?.map(g => ({ guarantorId: g.guarantor?.id || "" })) || [],
        },
        mode: 'onChange',
    });

    const { fields, append, remove } = useFieldArray({ control, name: "guarantees" });
    const [guarantorsSelected, setGuarantorsSelected] = useState([]);

    useEffect(() => {
        const guarantorsId = watch('guarantees').map(x => +x.guarantorId);
        const borrowerId = watch('borrowerId');
        if (borrowerId) guarantorsId.push(+borrowerId);
        setGuarantorsSelected(guarantorsId);
    }, [watch, fields]);

    const onSubmit = (data) => {
        const frequencyDays = { '1': 1, '7': 7, '30': 30, '90': 90, '180': 180, '365': 365 };
        data.frequency = frequencyDays[data.frequency] || 0;
        state.borrower?.id ? dispatch(editLoan(data, state.borrower.id)) : dispatch(addLoan(data,navigate));
    };

    const renderSelectField = (label, name, options) => (
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>{label}</InputLabel>
            <Select label={label} value={watch(name) || ""} {...register(name)} onChange={e => setValue(name, e.target.value)}>
                {options.map(option => (
                    <MenuItem key={option.id} value={option.id} disabled={guarantorsSelected.includes(option.id)}>
                        {option.name}
                    </MenuItem>
                ))}
            </Select>
            {errors[name]?.message && <p>{errors[name]?.message}</p>}
        </FormControl>
    );

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 600, margin: '0 auto' }}>
                {renderSelectField("לווה", "borrowerId", users.map(user => ({ id: user.id, name: `${user.firstName} ${user.lastName}` })))}
                <TextField label="סכום" variant="outlined" fullWidth type="number" {...register("amount")} sx={{ mb: 2 }} />
                {renderSelectField("תדירות", "frequency", [{ id: '1', name: 'יום' }, { id: '7', name: 'שבוע' }, { id: '30', name: 'חודש' }, { id: '90', name: '3 חודשים' }, { id: '180', name: '6 חודשים' }, { id: '365', name: 'שנה' }])}
                <TextField label="מספר תשלומים" variant="outlined" fullWidth type="number" {...register("totalPayments")} sx={{ mb: 2 }} />
                <TextField label="תאריך החזר" variant="outlined" fullWidth type="date" {...register("repaymentDate")} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
               
                <InputLabel>ערבים</InputLabel>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    {fields.map((item, index) => (
                        <Box key={item.id} sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {renderSelectField("ערב", `guarantees.${index}.guarantorId`, users.map(user => ({ id: user.id, name: `${user.firstName} ${user.lastName}` })))}
                            <Button onClick={() => remove(index)} color="error">הסר</Button>
                        </Box>
                    ))}
                    <Button onClick={(e) => { e.preventDefault(); append({}); }} variant="outlined" sx={{ mb: 2 }}>הוסף ערב</Button>
                </FormControl>
                <Button onClick={() => setUserDialogOpen(true)} variant="text" sx={{ mb: 2 }}>
                    הוסף ערב חדש
                </Button>
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
