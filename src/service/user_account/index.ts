import { AxiosInstance, AxiosResponse } from "axios";
import axiosinstance from "..";

class UserAccountService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async signUp(name: string, mobile: string, email: string, password: string): Promise<AxiosResponse<any>> {
        try {
            let response = await this.axiosInstance.post('/useraccounts/signup', {
                name: name,
                mobile: mobile,
                email: email,
                password: password
            })
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async loginIn(email: string, password: string): Promise<AxiosResponse<any>> {
        try {
            let response = await this.axiosInstance.post('/useraccounts/login', { email: email, password: password })
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}