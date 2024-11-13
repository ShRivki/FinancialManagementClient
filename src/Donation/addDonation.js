import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete } from '@mui/material';
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { addDonation } from '../Services/donationService';
import UserAddEdit from '../User/userAddEdit'; // ייבוא רכיב הוספת משתמש
import { currencyOptions, fundraiserOptions } from '../constants.js'
const schema = yup.object({
    donorId: yup.number().required('תורם נדרש').min(1, 'מזהה תורם חייב להיות מספר חיובי'),
    amount: yup.number().required('סכום נדרש').positive('הסכום חייב להיות חיובי').typeError('הסכום חייב להיות מספר'),
    currency: yup.number().required('מטבע נדרש').oneOf([0, 1, 2, 3], 'מטבע לא חוקי'),
    fundraiser: yup.number().required('קמפיין נדרש').oneOf([0, 1, 2, 3], 'קמפיין לא חוקי').default(3),
    notes: yup.string().max(255, 'הערות לא יכולות לעלות על 255 תווים').default("גג"), 
}).required();

const AddDonation = ({ open, handleClose, initialValues = {} }) => {
    const dispatch = useDispatch();
    const users = useSelector(state => state.User.users);
    const [userDialogOpen, setDonationDialogOpen] = useState(false); // מצב לניהול פתיחת רכיב הוספת משתמש
    const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: initialValues,
        mode: 'onChange',
    });

    const [selectedDonor, setSelectedDonor] = useState(initialValues.donorId || "");
    const [selectedCurrency, setSelectedCurrency] = useState(initialValues.currency || "");
    const [selectedFundraiser, setSelectedFundraiser] = useState(initialValues.fundraiser || "");

    useEffect(() => {
        setValue("donorId", selectedDonor);
        setValue("currency", selectedCurrency);
        setValue("fundraiser", selectedFundraiser);
    }, [selectedDonor, selectedCurrency, selectedFundraiser, setValue]);

    useEffect(() => {
        if (!isValid) {
            console.log("Form validation errors:", errors);
        }
    }, [isValid, errors]);

    const onSubmit = (data) => {
        // כאן נוודא ש-currency הוא מספר ולא מחרוזת
        data.currency = parseInt(data.currency, 10);
        data.fundraiser = parseInt(data.fundraiser, 10);
        dispatch(addDonation(data));
        handleClose();
    };

    const handleOpenDonationDialog = () => {
        setDonationDialogOpen(true);
    };

    const handleCloseDonationDialog = () => {
        setDonationDialogOpen(false);
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>הוספת תרומה</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 600, margin: '0 auto' }}>
                    <DialogContent>
                        <Autocomplete
                            options={users}
                            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                            onChange={(event, newValue) => {
                                setSelectedDonor(newValue?.id || "");
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="תורם" variant="outlined" fullWidth error={!!errors.donorId} helperText={errors.donorId?.message} sx={{ mb: 2 }} />
                            )}
                            value={users.find(user => user.id === selectedDonor)}
                        />
                        <Button onClick={handleOpenDonationDialog} variant="text" sx={{ mb: 2 }}>
                            הוסף משתמש חדש
                        </Button>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <TextField label="סכום תרומה" variant="outlined" fullWidth type="number" {...register("amount")}
                                error={!!errors.amount}
                                helperText={errors.amount?.message}
                                InputProps={{ inputProps: { min: 0 } }} // מגביל למספרים חיוביים
                                sx={{ flexGrow: 1 }} // תופס מקום מלא
                            />
                            <Autocomplete
                                options={currencyOptions}
                                getOptionLabel={(option) => option.label}
                                onChange={(event, newValue) => {
                                    setSelectedCurrency(newValue?.value || 0);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="מטבע" variant="outlined" error={!!errors.currency} helperText={errors.currency?.message} />
                                )}
                                value={currencyOptions.find(option => option.value === selectedCurrency)}
                                sx={{ width: 120 }} // רוחב צר
                            />
                        </div>
                        <br />
                        <Autocomplete
                            options={fundraiserOptions}
                            getOptionLabel={(option) => option.label}
                            onChange={(event, newValue) => {
                                setSelectedFundraiser(newValue?.value || 0);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="מתרים" variant="outlined" fullWidth error={!!errors.fundraiser} helperText={errors.fundraiser?.message} sx={{ mb: 2 }} />
                            )}
                            value={fundraiserOptions.find(option => option.value === selectedFundraiser)}
                        />
                        <TextField label="הערות" variant="outlined" fullWidth {...register("notes")} sx={{ mb: 2 }} />
                        <p>{errors.notes?.message}</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            ביטול
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disabled={!isValid}>
                            הוספת תרומה
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <UserAddEdit open={userDialogOpen} handleClose={handleCloseDonationDialog} />
        </div>
    );
};

export default AddDonation;
