import axios, { AxiosRequestConfig } from "axios";
import { LocalStorage } from "../storage";
import { EmailAccountService } from "./email_account";

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
        const path = config.url;
        const urlData = path.split('/').pop();

        const token = urlData == 'refreshtoken' ? await new LocalStorage().getRefreshToken() : await new LocalStorage().getToken();

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
        }
        if (response.data?.statusCode === 202) {
        }
        if (response.data?.statusCode == 409) {
        }
        return response.data;
    },
    async (error) => {
        if (error.response?.data?.statusCode === 401) {
            if (error.response.data.error == 'Not authorized, token failed') {
                const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

                let response = await new EmailAccountService().refreshToken(await new LocalStorage().getRefreshToken() || '');
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: 'Bearer ' + response.data.token,
                };
                return axiosinstance(originalRequest);
            }
        }
        if (error.response?.data?.statusCode === 403) {

        }
        if (error.response) {
        }
        return Promise.reject(error);
    }
);

export default axiosinstance;