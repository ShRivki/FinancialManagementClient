import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import * as actiontype from '../Store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { BASIC_URL } from '../constants';
const EmailSender = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [sendToAll, setSendToAll] = useState(false);
    const users = useSelector(state => state.User.users);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [files, setFiles] = useState([]);
    
    const userOptions = users.map(user => ({
        label: `${user.firstName} ${user.lastName} - ${user.email}`,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
    }));

    // פונקציה לסינון אפשרויות על פי שם פרטי, שם משפחה או מייל
    const filterOptions = (options, { inputValue }) => {
        const lowerInput = inputValue.toLowerCase();
        return options.filter(option =>
            option.firstName.toLowerCase().includes(lowerInput) ||
            option.lastName.toLowerCase().includes(lowerInput) ||
            option.email.toLowerCase().includes(lowerInput)
        );
    };
    const onSubmit = async (data) => {
        try {
            dispatch(actiontype.startLoading());
            const formattedBody = data.body.replace(/\n/g, '<br>');
            const emailData = new FormData();
            const emailRequest = {
                subject: data.subject,
                body: formattedBody,
                toEmails: sendToAll ? users.map(user => user.email) : [data.toEmail]
            };
            emailData.append('emailRequestJson', JSON.stringify(emailRequest));
    
            // הוסף את הקבצים ל-FormData רק אם יש קבצים
            files.forEach((file) => {
                emailData.append('attachments', file);
            });            
            for (let [key, value] of emailData.entries()) {
                console.log(key, value);
            }         
    console.log(emailData)
            const response = await axios.post(`${BASIC_URL}/GlobalVariables/send-email`, emailData);
    
            if (response.status === 200) {
                setMessage('ההודעה נשלחה בהצלחה!');
                setMessageType('success');
            } else {
                setMessage('שגיאה בשליחת ההודעה.');
                setMessageType('error');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'שגיאה במהלך השליחה.';
            setMessage(errorMessage);
            setMessageType('error');
        } finally {
            dispatch(actiontype.endLoading());
        }
    };
    
    
    const handleCheckboxChange = (event) => {
        setSendToAll(event.target.checked);
        setValue('toEmail', ''); 
    };

    const handleFileChange = (event) => {
        setFiles([...event.target.files]);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', backgroundColor: '#e3f2fd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ color: '#004d40', textAlign: 'center' }}>שלח מייל</h2>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="sendToAll" style={{ color: '#004d40', fontWeight: 'bold' }}>
                        <input
                            type="checkbox"
                            id="sendToAll"
                            checked={sendToAll}
                            onChange={handleCheckboxChange}
                            style={{ marginRight: '8px' }}
                        />
                        שלח הודעה לכל המשתמשים
                    </label>
                </div>
                {!sendToAll && (
                    <div>
                        <label htmlFor="toEmail" style={{ color: '#004d40', fontWeight: 'bold' }}>כתובת מייל:</label>
                        <Autocomplete
                            freeSolo
                            options={userOptions}
                            filterOptions={filterOptions}
                            getOptionLabel={(option) => option.label}
                            onInputChange={(event, newValue) => {
                                setValue('toEmail', newValue);
                            }}
                            onChange={(event, selectedOption) => {
                                if (selectedOption) {
                                    setValue('toEmail', selectedOption.email); 
                                } else {
                                    setValue('toEmail', ''); 
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    id="toEmail"
                                    {...register('toEmail', { required: sendToAll ? false : 'הכתובת חובה' })}
                                    placeholder="הכנס או בחר כתובת מייל"
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #00796b', outline: 'none', color: '#004d40' }}
                                    error={!!errors.toEmail}
                                    helperText={errors.toEmail ? errors.toEmail.message : ''}
                                />
                            )}
                        />
                    </div>
                )}
                <div>
                    <label htmlFor="subject" style={{ color: '#004d40', fontWeight: 'bold' }}>נושא:</label>
                    <input
                        type="text"
                        id="subject"
                        {...register('subject', { required: 'נושא חובה' })}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #00796b', outline: 'none', color: '#004d40' }}
                    />
                    {errors.subject && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.subject.message}</p>}
                </div>
                <div>
                    <label htmlFor="body" style={{ color: '#004d40', fontWeight: 'bold' }}>גוף ההודעה:</label>
                    <textarea
                        id="body"
                        {...register('body', { required: 'גוף ההודעה חובה' })}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #00796b', outline: 'none', color: '#004d40', resize: 'vertical' }}
                    />
                    {errors.body && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.body.message}</p>}
                </div>
                <div>
                    <label htmlFor="attachments" style={{ color: '#004d40', fontWeight: 'bold' }}>הוסף קובץ:</label>
                    <input
                        type="file"
                        id="attachments"
                        multiple
                        onChange={handleFileChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #00796b', outline: 'none', color: '#004d40' }}
                    />
                </div>
                <button
                    type="submit"
                    style={{ backgroundColor: '#004d40', color: '#fff', padding: '10px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s' }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#00796b'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#004d40'}
                >
                    שלח מייל
                </button>
            </form>
            {message && (
                <p style={{ color: messageType === 'success' ? '#004d40' : 'red', textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default EmailSender;
