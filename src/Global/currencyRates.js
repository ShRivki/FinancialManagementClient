import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {getGlobalVariables} from '../Services/globalVariabelsService.js'

export const useCurrencyRates = () => {
    return useSelector(state => state.GlobalVariables.currencyRates);
};

const CurrencyRates = () => {
    // const [rates, setRates] = useState(null); 
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(rates)
        const fetchRates = async () => {
            try {
               await dispatch(getGlobalVariables());
            } catch (err) {
                setError(err.message);
                // setLoading(false);
            }
        };

        fetchRates();
        
    }, [dispatch]);
    const rates= useSelector(state => state.GlobalVariables.currencyRates);
    // useEffect(() => {
    //     console.log(rates)
    //     dispatch(getGlobalVariables());
    // }, [dispatch]);

    // if (loading) return <p>טעינה...</p>;
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
