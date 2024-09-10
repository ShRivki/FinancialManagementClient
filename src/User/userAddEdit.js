import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addUser, editUser } from "../Services/userService";
import { useDispatch } from 'react-redux';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const schema = yup.object({
    identity: yup.string().required('Required field').matches(/^\d{9}$/, 'תעודת הזהות חייבת להכיל 9 ספרות בדיוק'),
    firstName: yup.string().required('Required field').matches(/^.{3,}$/, 'שם חייב להכיל לפחות 3 תווים'),
    lastName: yup.string().required('Required field').matches(/^.{3,}$/, 'שם חייב להכיל לפחות 3 תווים'),
    address: yup.string().required('Required field').matches(/^.{3,}$/, 'הכתובת חייבת להכיל לפחות 3 תווים ויכולה להכיל אותיות ומספרים'),
    phone: yup.string().required('Required field').matches(/^\d{9,10}$/, 'מספר הטלפון חייב להכיל 9 או 10 ספרות בדיוק'),
    phone2: yup.string().nullable().test('is-valid-phone', 'מספר הטלפון חייב להכיל 9 או 10 ספרות בדיוק', value => !value || /^\d{9,10}$/.test(value)),
    email: yup.string().required('Required field').email('אימייל חייב להיות תקני'),
}).required();

const UserAddEdit = ({ open, handleClose, initialValues = {} }) => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: initialValues,
        mode: 'onChange',
    });

useEffect(() => {
  if (initialValues && Object.keys(initialValues).length > 0) {
    reset(initialValues);
  }
}, [initialValues, reset]);


    const onSubmit = (data) => {
        alert("scd")
        if (initialValues.identity) {
            dispatch(editUser(data));
        } else {
            dispatch(addUser(data));
        }
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{initialValues.identity ? "Update User" : "Add User"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 600, margin: '0 auto' }}>
                <DialogContent>
                    <TextField label="תעודת זהות" variant="outlined" fullWidth {...register("identity")} sx={{ mb: 2 }} />
                    <p>{errors.identity?.message}</p>
                    <TextField label="שם פרטי" variant="outlined" fullWidth {...register("firstName")} sx={{ mb: 2 }} />
                    <p>{errors.firstName?.message}</p>
                    <TextField label="שם משפחה" variant="outlined" fullWidth {...register("lastName")} sx={{ mb: 2 }} />
                    <p>{errors.lastName?.message}</p>
                    <TextField label="מייל" variant="outlined" fullWidth {...register("email")} sx={{ mb: 2 }} />
                    <p>{errors.email?.message}</p>
                    <TextField label="כתובת" variant="outlined" fullWidth {...register("address")} sx={{ mb: 2 }} />
                    <p>{errors.address?.message}</p>
                    <TextField label="פלאפון 1" variant="outlined" fullWidth {...register("phone")} sx={{ mb: 2 }} />
                    <p>{errors.phone?.message}</p>
                    <TextField label="פלאפון 2" variant="outlined" fullWidth {...register("phone2")} sx={{ mb: 2 }} />
                    <p>{errors.phone2?.message}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary" disabled={!isValid}>
                        {initialValues.identity ? "Update User" : "Add User"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UserAddEdit;
