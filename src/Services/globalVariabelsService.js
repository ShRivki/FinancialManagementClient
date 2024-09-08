import * as actiontype from '../Store/actions'
import axios from "axios";


const URL = 'https://localhost:7030/api/GlobalVariables';

export const getGlobalVariables = () => {
    return async dispatch => {
        try {
            const res = await axios.get(URL);
            console.log(res.data)
            dispatch({ type: actiontype.GET_GLOBAL_VARIABELS, data: res.data });
        } catch (error) {
            console.error(error);
        }
    }
}