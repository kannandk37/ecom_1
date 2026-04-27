import axios from "axios";
import { LocalStorage } from "../storage";

const axiosinstance = axios.create({
    baseURL: 'https://ecom-api-orcin-beta.vercel.app/api',
    // baseURL: 'http://localhost:5000/api',

    timeout: 9000,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Header":
            "Origin, Content-Type, X-Requested-With, Accept, Access-Control-Allow-Credentials, Access-Control-Allow-Headers, Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods": "POST,GET,OPTIONS,PUT,DELETE",
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

axiosinstance.interceptors.request.use(
    async (config) => {
        const token = await new LocalStorage().getToken('token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

axiosinstance.interceptors.response.use(
    (response) => {
        if (response.data?.statusCode === 201) {
            // Emitter.dispatch('success', response.data.message);
        }
        if (response.data?.statusCode === 202) {
            // Emitter.dispatch('success', response.data.message);
        }
        if (response.data?.statusCode == 409) {
            // Emitter.dispatch('already exists', response.data.message);
        }
        return response.data;
    },
    (error) => {
        if (error.response?.data?.statusCode === 401) {
            // Emitter.dispatch('errorStatus401', error.response);
        }
        if (error.response?.data?.statusCode === 401) {

        }
        if (error.response) {
            // Emitter.dispatch('error', error.response.data.error);
        }
        return Promise.reject(error);
    }
);

export default axiosinstance;