import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete } from '@mui/material';
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { addDonation } from '../Services/donationService';
import UserAddEdit from '../User/userAddEdit'; // ייבוא רכיב הוספת משתמש

const schema = yup.object({
    donorId: yup.number().required('Donor is required').min(1, 'Donor ID must be a positive number'),
    amount: yup.number().required('Amount is required').min(0, 'Amount must be a non-negative number'),
    notes: yup.string().notRequired().max(255, 'Notes cannot exceed 255 characters'),
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

    useEffect(() => {
        setValue("donorId", selectedDonor);
    }, [selectedDonor, setValue]);

    const onSubmit = (data) => {
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
                <DialogTitle>addDonation</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 600, margin: '0 auto' }}>
                    <DialogContent>
                        <Autocomplete
                            options={users}
                            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                            onChange={(event, newValue) => {
                                setSelectedDonor(newValue?.id || "");
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="תורם"  variant="outlined" fullWidth error={!!errors.donorId}  helperText={errors.donorId?.message} sx={{ mb: 2 }}/>
                            )}
                            value={users.find(user => user.id === selectedDonor)}
                        />
                        <Button onClick={handleOpenDonationDialog} variant="text" sx={{ mb: 2 }}>
                            הוספת משתמש חדש
                        </Button>
                        <TextField label="סכום תרומה" variant="outlined" fullWidth {...register("amount")} sx={{ mb: 2 }}/>
                        <p>{errors.amount?.message}</p>
                        <TextField label="הערות" variant="outlined" fullWidth {...register("notes")} sx={{ mb: 2 }}/>
                        <p>{errors.notes?.message}</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Cancel
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
