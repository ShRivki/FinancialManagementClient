import React, { useState ,useEffect} from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, MenuItem, Select, InputLabel, Autocomplete,FormControl, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, ListItemText, Box } from '@mui/material';
import { addDeposit } from '../Services/depositService';
import UserAddEdit from '../User/userAddEdit';
import { currencyOptions } from '../constants.js';
import { paymentMethodsOptions } from '../constants.js'
const schema = yup.object({
    depositorId: yup.number().required('מפקיד נדרש').min(1, 'מפקיד חייב להיות מספר חיובי'),
    amount: yup.number().required('סכום נדרש').min(0, 'הסכום חייב להיות מספר שאינו שלילי'),
    currency: yup.number().required('מטבע נדרש').oneOf([0, 1, 2, 3], 'מטבע לא חוקי'),
    dateOfMaturity: yup.date().nullable().min(new Date(), 'תאריך התפוגה לא יכול להיות לפני התאריך הנוכחי').typeError('תאריך לא חוקי'),
    paymentMethods: yup.array().of(yup.number()).min(1, 'חייב לבחור לפחות שיטת תשלום אחת'),
    notes: yup.string().max(255, 'הערות לא יכולות לחרוג מ-255 תווים'),
}).required();

const AddDeposit = ({ open, handleClose, initialValues = {} }) => {
    const dispatch = useDispatch();
    const users = useSelector(state => state.User.users);
    const [depositDialogOpen, setDepositDialogOpen] = React.useState(false);
    const [selectedPayments, setSelectedPayments] = useState([]);

    const [selectedDepositor, setSelectedDepositor] = useState(initialValues.depositorId || "");
    const { register, handleSubmit, setValue, watch, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: initialValues,
        mode: 'onChange',
    });

    const handlePaymentChange = (event) => {
        const { value } = event.target;
        setSelectedPayments(typeof value === 'string' ? value.split(',') : value);
    };
    useEffect(() => {
        setValue("depositorId", selectedDepositor);
    }, [selectedDepositor, setValue]);

    const onSubmit = (data) => {
        const formattedDateOfMaturity = new Date(data.dateOfMaturity).toISOString();
        const paymentMethodsValue = selectedPayments.reduce((acc, current) => acc + current, 0); // סוכם את ערכי ה-enum

        const formattedData = {
            ...data,
            dateOfMaturity: formattedDateOfMaturity,
            paymentMethods: paymentMethodsValue // שולח את הערך המקודד של אמצעי התשלום
        };
        console.log(formattedData)
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
                    <Autocomplete
                            options={users}
                            getOptionLabel={({ firstName, lastName, identity }) => `${firstName} ${lastName} ${identity}`}
                            onChange={(e, v) => setSelectedDepositor(v?.id || "")}
                            value={users.find(u => u.id === selectedDepositor)}
                            renderInput={(params) => (
                                <TextField {...params} label="מפקיד" variant="outlined" fullWidth error={!!errors.depositorId} helperText={errors.depositorId?.message} sx={{ mb: 2 }} />
                            )}
                        />
                        {/* {renderSelectField("מפקיד", "depositorId", users.map(user => ({ id: user.id, name: `${user.firstName} ${user.lastName} ${user.identity}` })))} */}
                        <Button onClick={() => setDepositDialogOpen(true)} variant="text" sx={{ mb: 2 }}>
                            הוספת משתמש חדש
                        </Button>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField label="סכום הפקדה" variant="outlined" fullWidth {...register("amount")} />
                            {errors.amount?.message && <p style={{ margin: 0, color: 'red', fontSize: '0.875rem' }}>{errors.amount.message}</p>}
                            <Box sx={{ minWidth: 120 }}>
                                {renderSelectField("מטבע", "currency", currencyOptions.map(c => ({ id: c.value, name: c.label })))}
                            </Box>
                        </Box>
                        <TextField label="תאריך פרעון" variant="outlined" type='date' fullWidth {...register("dateOfMaturity")} sx={{ mb: 2 }} />
                        {errors.dateOfMaturity?.message && <p>{errors.dateOfMaturity?.message}</p>}

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
