import React from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import { logIn } from "../Services/userService";

// Yup validation schema
const schema = yup.object({
    UserName: yup.string().required('שדה חובה'),
    Password: yup.string().required('שדה חובה').min(3, 'סיסמא חייבת להכיל לפחות 3 תווים'),
}).required();

const LogIn = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => {
        logIn(data, navigate);
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: '#e3f2fd',
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h5" sx={{ mb: 2, color: '#004d40' }}>
                    התחברות
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                    <TextField
                        {...register("UserName")}
                        label="שם משתמש"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!errors.UserName}
                        helperText={errors.UserName?.message}
                    />
                    <TextField
                        {...register("Password")}
                        label="סיסמא"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!errors.Password}
                        helperText={errors.Password?.message}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 2, bgcolor: '#004d40', '&:hover': { bgcolor: '#00332e' } }}
                        fullWidth
                    >
                        התחבר
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default LogIn;
