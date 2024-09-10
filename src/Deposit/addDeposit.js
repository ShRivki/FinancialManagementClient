import React from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { addDeposit } from '../Services/depositService';
import UserAddEdit from '../User/userAddEdit';
import { currencyOptions } from '../constants.js';

const schema = yup.object({
    depositorId: yup.number().required('מפקיד נדרש').min(1, 'מפקיד חייב להיות מספר חיובי'),
    amount: yup.number().required('סכום נדרש').min(0, 'הסכום חייב להיות מספר שאינו שלילי'),
    currency: yup.number().required('מטבע נדרש').oneOf([0, 1, 2], 'מטבע לא חוקי'),
    dateOfMaturity: yup.date().required('תאריך חובה').min(new Date(), 'תאריך התפוגה לא יכול להיות לפני התאריך הנוכחי').typeError('תאריך לא חוקי'),
    notes: yup.string().notRequired().max(255, 'הערות לא יכולות לחרוג מ-255 תווים'),
}).required();

const AddDeposit = ({ open, handleClose, initialValues = {} }) => {
    const dispatch = useDispatch();
    const users = useSelector(state => state.User.users);
    const [depositDialogOpen, setDepositDialogOpen] = React.useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: initialValues,
        mode: 'onChange',
    });

    const onSubmit = (data) => {
        const formattedDateOfMaturity = new Date(data.dateOfMaturity).toISOString();
        const formattedData = { 
            ...data, 
            dateOfMaturity: formattedDateOfMaturity 
        };
        dispatch(addDeposit(formattedData));    
        handleClose();
    };

    const renderSelectField = (label, name, options) => (
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>{label}</InputLabel>
            <Select
                label={label}
                {...register(name)}
                onChange={(e) => setValue(name, parseInt(e.target.value, 10))}
                value={watch(name) || 0} // השתמש ב-0 במקרה שאין ערך
            >
                {options.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.name}
                    </MenuItem>
                ))}
            </Select>
            {errors[name]?.message && <p>{errors[name]?.message}</p>}
        </FormControl>
    );

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>הוספת הפקדה</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 600, margin: '0 auto' }}>
                    <DialogContent>
                        {renderSelectField("מפקיד", "depositorId", users.map(user => ({ id: user.id, name: `${user.firstName} ${user.lastName} ${user.identity}` })))}
                        <Button onClick={() => setDepositDialogOpen(true)} variant="text" sx={{ mb: 2 }}>
                            הוספת משתמש חדש
                        </Button>
                        <TextField label="סכום הפקדה" variant="outlined" fullWidth {...register("amount")} sx={{ mb: 2 }} />
                        {errors.amount?.message && <p>{errors.amount?.message}</p>}
                        {renderSelectField("מטבע", "currency", currencyOptions.map(c => ({ id: c?.value, name: c.label })))}
                        <TextField label="תאריך פרעון" variant="outlined" type='date' fullWidth {...register("dateOfMaturity")} sx={{ mb: 2 }} />
                        {errors.dateOfMaturity?.message && <p>{errors.dateOfMaturity?.message}</p>}
                        <TextField label="הערות" variant="outlined" fullWidth {...register("notes")} sx={{ mb: 2 }} />
                        {errors.notes?.message && <p>{errors.notes?.message}</p>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            ביטול
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disabled={!isValid}>
                            הוספת הפקדה
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <UserAddEdit open={depositDialogOpen} handleClose={() => setDepositDialogOpen(false)} />
        </div>
    );
};

export default AddDeposit;
