import { AxiosInstance, AxiosResponse } from "axios";
import axiosinstance from "..";
import { LocalStorage } from "../../storage";

export class EmailAccountService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async refreshToken(refreshtoken: string): Promise<AxiosResponse<any>> {
        try {
            let response: any = await this.axiosInstance.post('/emailaccounts/refreshtoken', { refreshToken: refreshtoken });
            let storagePersistor = new LocalStorage();

            await storagePersistor.storeToken(response.data.accessToken);
            await storagePersistor.storeRefreshToken(response.data.refreshToken);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };
}