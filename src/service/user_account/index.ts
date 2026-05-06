import { AxiosInstance, AxiosResponse } from "axios";
import axiosinstance from "..";
import { userResponseDatumToUserEntity } from "../user/transformer";
import { roleResponseDatumToRoleEntity } from "../role/transformer";
import { profileResponseDatumToProfileEntity } from "../profile/transformer";
import { LocalStorage } from "../../storage";

export class UserAccountService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async signUp(name: string, mobile: string, email: string, password: string): Promise<AxiosResponse<any>> {
        try {
            let response: any = await this.axiosInstance.post('/signup', {
                name: name,
                mobile: mobile,
                email: email,
                password: password
            })
            let user = await userResponseDatumToUserEntity(response.data.user);
            let role = await roleResponseDatumToRoleEntity(response.data.role);
            let profile = await profileResponseDatumToProfileEntity(response.data.profile);

            let storagePersistor = new LocalStorage();
            await storagePersistor.storeToken(response.data.token);
            await storagePersistor.storeUser(user);
            await storagePersistor.storeRole(role);
            await storagePersistor.storeProfile(profile);

            response.user = user;
            response.role = role;
            response.profile = profile;

            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async loginIn(email: string, password: string): Promise<AxiosResponse<any>> {
        try {
            let response: any = await this.axiosInstance.post('/login', { email: email, password: password });

            let user = await userResponseDatumToUserEntity(response.data.user);
            let role = await roleResponseDatumToRoleEntity(response.data.role);
            let profile = await profileResponseDatumToProfileEntity(response.data.profile);

            let storagePersistor = new LocalStorage();
            await storagePersistor.storeToken(response.data.token);
            await storagePersistor.storeUser(user);
            await storagePersistor.storeRole(role);
            await storagePersistor.storeProfile(profile);

            response.user = user;
            response.role = role;
            response.profile = profile;

            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}