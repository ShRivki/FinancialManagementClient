import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addUser, editUser } from "../Services/userService";
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, FormControlLabel } from '@mui/material'; // ייבוא של FormControlLabel ו־Checkbox
 const isIsraeliIdValid = id => /^\d{9}$/.test(id) && id.split('').reduce((acc, val, i) => acc + (parseInt(val) * (i % 2 === 0 ? 1 : 2)).toString().split('').reduce((a, b) => a + parseInt(b), 0), 0) % 10 === 0;


const UserAddEdit = ({ open, handleClose, initialValues = {} }) => {
    const schema = yup.object({
        identity: yup.string().required('שדה חובה').matches(/^\d{9}$/, '9 ספרות בדיוק').test('is-valid-id', 'מספר הזהות אינו תקין', value => isIsraeliIdValid(value)).test('is-unique', 'מספר זהות קיים כבר', value => isIdentityUnique(value)),
        firstName: yup.string().required('שדה חובה').matches(/^.{2,}$/, 'שם חייב להכיל לפחות 2 תווים'),
        lastName: yup.string().required('שדה חובה').matches(/^.{2,}$/, 'שם חייב להכיל לפחות 2 תווים'),
        address: yup.string().required('שדה חובה').matches(/^.{3,}$/, 'הכתובת חייבת להכיל לפחות 3 תווים ויכולה להכיל אותיות ומספרים'),
        phone: yup.string().required('שדה חובה').matches(/^\d{9,10}$/, ' 9/ 10 ספרות בדיוק'),
        phone2: yup.string().nullable().test('is-valid-phone', '9/ 10 ספרות בדיוק', value => !value || /^\d{9,10}$/.test(value)),
        email: yup.string().email('אימייל חייב להיות תקני'),
        isReliable: yup.boolean().default(true) // שדה אמינות המשתמש
    }).required();

    const users = useSelector(state => state.User.users); // העברת ה־useSelector פנימה לקומפוננטה

    // יצירת פונקציה לבדוק אם מספר הזהות קיים
    const isIdentityUnique = (identity) => {
        return !users.some(user => user.identity === identity && user.identity !== initialValues?.identity);
    };
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { ...initialValues, isReliable: initialValues.isReliable || false },
        mode: 'onChange',
    });
    const isIsraeliIdValid = (idNumber) => {
        if (!/^\d{9}$/.test(idNumber)) {
          return false; // וידוא שהקלט כולל בדיוק 9 ספרות
        }

        let total = 0;
        for (let i = 0; i < 9; i++) {
          let digit = parseInt(idNumber[i], 10) * (i % 2 === 0 ? 1 : 2);
          total += digit > 9 ? digit - 9 : digit; // סיכום ספרות דו-ספרתיות
        }

        return total % 10 === 0; // בדיקה אם הסכום מתחלק ב-10
    };

    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            reset({ ...initialValues, isReliable: initialValues.isReliable || false });
        }
    }, [initialValues, reset]);

    const showConfirmationAndContinue = (message, existingUser) => {
        const confirm = window.confirm(message);
        return confirm; 
    };

    const onSubmit = (data) => {
        const existingUserByEmail = users.find(user => user.email === data.email && user.id !== initialValues.id);
        const existingUserByPhone = users.find(user => 
            ((user.phone && user.phone === data.phone) || 
            (user.phone2 && user.phone2 === data.phone2) || 
            (user.phone2 && user.phone2 === data.phone) || 
            (user.phone && user.phone === data.phone2)) && 
            user.id !== initialValues.id
        );

        if (existingUserByEmail && !showConfirmationAndContinue(`המייל כבר קיים במערכת עם המשתמש: ${existingUserByEmail.firstName} ${existingUserByEmail.lastName}. האם אתה רוצה להמשיך?`)) {
            return; // לא להמשיך אם המייל קיים והמשתמש לחץ על ביטול
        }

        if (existingUserByPhone && !showConfirmationAndContinue(`מספר הטלפון כבר קיים במערכת עם המשתמש: ${existingUserByPhone.firstName} ${existingUserByPhone.lastName}. האם אתה רוצה להמשיך?`)) {
            return; // לא להמשיך אם הטלפון קיים והמשתמש לחץ על ביטול
        }
        if (initialValues.id) {
            dispatch(editUser(data));
        } else {
            dispatch(addUser(data));
        }
        handleClose();
    };


    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{initialValues.identity ? "עדכון משתמש" : "הוספת משתמש"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 600, margin: '0 auto' }}>
                <DialogContent>
                    <TextField label="תעודת זהות" variant="outlined" fullWidth {...register("identity")} sx={{ mb: 2 }}/>
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
                    <FormControlLabel
                        control={
                            <Checkbox
                                {...register("isReliable")}
                                defaultChecked={initialValues.isReliable||true} // הגדרת מצב הצ'קבוקס
                            />
                        }
                        label="האם המשתמש אמין"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary" disabled={!isValid}>
                        {initialValues.identity ? "עדכון" : "הוספה"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UserAddEdit;
// import React from 'react';
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useDispatch, useSelector } from 'react-redux';
// import { addUser, editUser } from "../Services/userService";
// import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, FormControlLabel, Box, Typography } from '@mui/material';

// const formFields = [
//     { name: 'identity', label: 'תעודת זהות' },
//     { name: 'firstName', label: 'שם פרטי' },
//     { name: 'lastName', label: 'שם משפחה' },
//     { name: 'email', label: 'מייל' },
//     { name: 'address', label: 'כתובת' },
//     { name: 'phone', label: 'פלאפון 1' },
//     { name: 'phone2', label: 'פלאפון 2' }
// ];

// const isIsraeliIdValid = id => /^\d{9}$/.test(id) && id.split('').reduce((acc, val, i) => acc + (parseInt(val) * (i % 2 === 0 ? 1 : 2)).toString().split('').reduce((a, b) => a + parseInt(b), 0), 0) % 10 === 0;

// const checkExistingUser = (type, data, field, users, initialValues) => {
//     if(data[field]=="")
//         return true;
//     const existingUser = users.find(user => (type === 'email' ? user.email === data.email : (user.phone === data[field] || user.phone2 === data[field])) && user.id !== initialValues.id);
//     return existingUser ? window.confirm(`ה${type === 'email' ? 'מייל' : 'טלפון'} כבר קיים במערכת עם המשתמש: ${existingUser.firstName} ${existingUser.lastName}. האם אתה רוצה להמשיך?`) : true;
// };

// const UserAddEdit = ({ open, handleClose, initialValues = {} }) => {
//     const dispatch = useDispatch();
//     const users = useSelector(state => state.User.users);

//     const schema = yup.object({
//         identity: yup.string().required('שדה חובה').matches(/^\d{9}$/, 'תעודת הזהות חייבת להכיל 9 ספרות בדיוק').test('is-valid-id', 'מספר הזהות אינו תקין', value => isIsraeliIdValid(value))
//             .test('is-unique', 'מספר זהות קיים כבר', value => !users.some(user => user.id === value && user.id !== initialValues?.id)),
//         firstName: yup.string().required('שדה חובה').matches(/^.{3,}$/, 'שם חייב להכיל לפחות 3 תווים'),
//         lastName: yup.string().required('שדה חובה').matches(/^.{3,}$/, 'שם חייב להכיל לפחות 3 תווים'),
//         address: yup.string().required('שדה חובה').matches(/^.{3,}$/, 'הכתובת חייבת להכיל לפחות 3 תווים'),
//         phone: yup.string().required('שדה חובה').matches(/^\d{9,10}$/, 'מספר הטלפון חייב להכיל 9 או 10 ספרות'),
//         phone2: yup.string().nullable().test('phone2-valid', 'מספר הטלפון חייב להכיל 9 או 10 ספרות', value => !value || /^\d{9,10}$/.test(value)),
//         email: yup.string().email('אימייל חייב להיות תקני'),
//         isReliable: yup.boolean().default(true)
//     });

//     const { register, handleSubmit, formState: { errors, isValid } } = useForm({
//         resolver: yupResolver(schema),
//         defaultValues: { ...initialValues, isReliable: initialValues.isReliable ?? true },
//         mode: 'onChange'
//     });

//     const onSubmit = (data) => {
//         if (checkExistingUser('email', data, null, users, initialValues))
//             if (checkExistingUser('phone', data, 'phone', users, initialValues))
//                 if (checkExistingUser('phone', data, 'phone2', users, initialValues)) {
//                     dispatch(initialValues.identity ? editUser(data) : addUser(data));
//                     handleClose();
//                 }
//                 else{
//                     return;
//                 }
     
//     };

//     const FormTextField = ({ name, label }) => (
//         <Box sx={{ mb: 2 }}>
//             <TextField label={label} variant="outlined" fullWidth {...register(name)} error={!!errors[name]} />
//             {errors[name] && <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>{errors[name].message}</Typography>}
//         </Box>
//     );

//     return (
//         <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//             <DialogTitle>{initialValues.identity ? "עדכון משתמש" : "הוספת משתמש"}</DialogTitle>
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <DialogContent>
//                     {formFields.map(field => <FormTextField key={field.name} name={field.name} label={field.label} />)}
//                     <FormControlLabel control={<Checkbox {...register("isReliable")} defaultChecked={initialValues.isReliable ?? true} />} label="האם המשתמש אמין" />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} color="secondary">ביטול</Button>
//                     <Button type="submit" variant="contained" color="primary" disabled={!isValid}>{initialValues.identity ? "עדכון" : "הוספה"}</Button>
//                 </DialogActions>
//             </form>
//         </Dialog>
//     );
// };

// export default UserAddEdit;
