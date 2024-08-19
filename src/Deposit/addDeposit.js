import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete } from '@mui/material';
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { addDeposit } from '../Services/depositService';
import UserAddEdit from '../User/userAddEdit';

const schema = yup.object({
    depositorId: yup.number().required('מפקיד נדרש').min(1, 'מפקיד חייב להיות מספר חיובי'),
    amount: yup.number().required('סכום נדרש').min(0, 'הסכום חייב להיות מספר שאינו שלילי'),
    dateOfMaturity: yup.date().required('תאריך חובה').min(new Date(), 'תאריך התפוגה לא יכול להיות לפני התאריך הנוכחי').typeError('תאריך לא חוקי'),
    notes: yup.string().notRequired().max(255, 'הערות לא יכולות לחרוג מ-255 תווים'),
}).required();

const AddDeposit = ({ open, handleClose, initialValues = {} }) => {
    const dispatch = useDispatch();
    const users = useSelector(state => state.User.users);
    const [depositDialogOpen, setDepositDialogOpen] = useState(false);
    const [selectedDepositor, setSelectedDepositor] = useState(initialValues.depositorId || "");
    const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: initialValues,
        mode: 'onChange',
    });

    useEffect(() => {
        setValue("depositorId", selectedDepositor);
    }, [selectedDepositor, setValue]);

    const onSubmit = (data) => {
        const formattedDateOfMaturity = new Date(data.dateOfMaturity).toISOString();
    
        // יצירת אובייקט נתונים מעודכן עם התאריך בפורמט ISO
        const formattedData = { 
            ...data, 
            dateOfMaturity: formattedDateOfMaturity 
        };
        dispatch(addDeposit(formattedData));    
        handleClose();
    };

    const handleOpenDepositDialog = () => {
        setDepositDialogOpen(true);
    };

    const handleCloseDepositDialog = () => {
        setDepositDialogOpen(false);
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>הוספת הפקדה</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 600, margin: '0 auto' }}>
                    <DialogContent>
                        <Autocomplete
                            options={users}
                            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                            onChange={(event, newValue) => {
                                setSelectedDepositor(newValue?.id || "");
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="מפקיד" variant="outlined" fullWidth error={!!errors.depositorId} helperText={errors.depositorId?.message} sx={{ mb: 2 }} />
                            )}
                            value={users.find(user => user.id === selectedDepositor)}
                        />
                        <Button onClick={handleOpenDepositDialog} variant="text" sx={{ mb: 2 }}>
                            הוספת משתמש חדש
                        </Button>
                        <TextField label="סכום הפקדה" variant="outlined" fullWidth {...register("amount")} sx={{ mb: 2 }} />
                        <p>{errors.amount?.message}</p>
                        <TextField label="תאריך פרעון" variant="outlined" type='date' fullWidth {...register("dateOfMaturity")} sx={{ mb: 2 }} />
                        <p>{errors.dateOfMaturity?.message}</p>
                        <TextField label="הערות" variant="outlined" fullWidth {...register("notes")} sx={{ mb: 2 }} />
                        <p>{errors.notes?.message}</p>
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
            <UserAddEdit open={depositDialogOpen} handleClose={handleCloseDepositDialog} />
        </div>
    );
};

export default AddDeposit;
