import axios from '../utils/axiosConfig';
import { 
    ONEDRIVE_LOGIN_SUCCESS, 
    ONEDRIVE_LOGIN_FAIL, 
    UPLOAD_DOCUMENT_SUCCESS, 
    UPLOAD_DOCUMENT_FAIL 
} from './types';

export const onedriveLogin = () => async dispatch => {
    try {
        window.location.href = `${process.env.REACT_APP_API_URL}/onedrive/login/`;
        dispatch({
            type: ONEDRIVE_LOGIN_SUCCESS
        });
    } catch (err) {
        dispatch({
            type: ONEDRIVE_LOGIN_FAIL
        });
        throw err;
    }
};

export const uploadDocument = (file) => async dispatch => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/onedrive/upload`, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        dispatch({
            type: UPLOAD_DOCUMENT_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: UPLOAD_DOCUMENT_FAIL
        });
        throw err;
    }
};