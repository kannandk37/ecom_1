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

            // let token = response.data.token;
            // let refreshToken = response.data.refreshToken;

            let storagePersistor = new LocalStorage();
            // await storagePersistor.storeToken(token);
            // await storagePersistor.storeRefreshToken(refreshToken);
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

            // let token = response.data.token;
            // let refreshToken = response.data.refreshToken;

            let storagePersistor = new LocalStorage();
            // await storagePersistor.storeToken(token);
            // await storagePersistor.storeRefreshToken(refreshToken);
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

    async enterpriseLoginIn(email: string, password: string): Promise<AxiosResponse<any>> {
        try {
            let response: any = await this.axiosInstance.post('/enterpriselogin', { email: email, password: password });

            let user = await userResponseDatumToUserEntity(response.data.user);
            let role = await roleResponseDatumToRoleEntity(response.data.role);
            let profile = await profileResponseDatumToProfileEntity(response.data.profile);

            // for reference
            // let token = response.data.token;
            // let refreshToken = response.data.refreshToken;

            let storagePersistor = new LocalStorage();

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

    async resetPassword(email: string, password: string) {
        try {
            let response: any = await this.axiosInstance.post('/reset-password', { email, password });

            let user = await userResponseDatumToUserEntity(response.data.user);
            let role = await roleResponseDatumToRoleEntity(response.data.role);
            let profile = await profileResponseDatumToProfileEntity(response.data.profile);

            // let token = response.data.token;
            // let refreshToken = response.data.refreshToken;

            let storagePersistor = new LocalStorage();
            // await storagePersistor.storeToken(token, true);
            // await storagePersistor.storeRefreshToken(refreshToken, true);
            
            await storagePersistor.storeUser(user);
            await storagePersistor.storeRole(role);
            await storagePersistor.storeProfile(profile);

            response.user = user;
            response.role = role;
            response.profile = profile;

            return response;
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    }
}