import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const EmailSender = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const onSubmit = async (data) => {
        try {
            const response = await axios.post("https://localhost:7030/api/GlobalVariables/send-email", data);

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
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', backgroundColor: '#e3f2fd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ color: '#004d40', textAlign: 'center' }}>שלח מייל</h2>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="toEmail" style={{ color: '#004d40', fontWeight: 'bold' }}>כתובת מייל:</label>
                    <input
                        type="email"
                        id="toEmail"
                        {...register('toEmail', { required: 'הכתובת חובה' })}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #00796b', outline: 'none', color: '#004d40' }}
                    />
                    {errors.toEmail && <p style={{ color: 'red', fontSize: '0.9em' }}>{errors.toEmail.message}</p>}
                </div>
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
