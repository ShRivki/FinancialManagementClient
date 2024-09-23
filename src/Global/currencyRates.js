import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../constants.js';
import { useDispatch } from 'react-redux';
import {setCurrencyRates}from '../Store/actions';
const CurrencyRates = () => {
    const [rates, setRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await axios.get(`${URL}GlobalVariables/rates`);
                const data = response.data;
                setRates(data);
                dispatch(setCurrencyRates(data)); // Dispatch ל-redux את הנתונים
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRates();
    }, [dispatch]);

    if (loading) return <p>טעינה...</p>;
    if (error) return <p>שגיאה: {error}</p>;
    if (!rates) return <p>אין נתונים זמינים</p>;

    const { usdRate, eurRate, gbpRate } = rates;

    return (
        <div>
            <h1>שערי חליפין</h1>
            <ul>
                <li><strong>$:</strong> {usdRate} ₪</li>
                <li><strong>€:</strong> {eurRate} ₪</li>
                <li><strong>£:</strong> {gbpRate} ₪</li>
            </ul>
        </div>
    );
};

export default CurrencyRates;
