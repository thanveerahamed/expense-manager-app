import axios from 'axios';

import {auth} from '../../common/firebase/firebase';

export const getToken = async (): Promise<string> => {
    const authToken = await auth.currentUser?.getIdToken();

    if (authToken === undefined) {
        throw new Error('Token is undefined.');
    }

    return authToken;
};

const getDefaultHeaders = async () => {
    const token = await getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token,
    };
};

export const apiGet = async <T>(
    url: string,
    params: Record<string, string> = {},
) => {
    const response = await axios.get<T>(url, {
        headers: await getDefaultHeaders(),
        params,
    });

    return response.data;
};

export const apiPost = async <T>(url: string, data: any) => {
    const response = await axios.post<T>(url, data, {
        headers: await getDefaultHeaders(),
    });

    return response.data;
};

export const apiPut = async <T>(url: string, data: any) => {
    const response = await axios.put<T>(url, data, {
        headers: await getDefaultHeaders(),
    });

    return response.data;
};

export const apiDelete = async <T>(url: string) => {
    const response = await axios.delete<T>(url, {
        headers: await getDefaultHeaders(),
    });

    return response.data;
};
