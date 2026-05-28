import { AxiosInstance } from "axios";
import axiosinstance from "..";
import { profileResponseDatumToProfileEntity, profilesResponseDataToProfilesEntities } from "./transformer";
import { Profile } from "../../entity/profile";


export class ProfileService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async get(): Promise<Profile[]> {
        try {
            let response = await this.axiosInstance.get(`/profiles`);
            return (profilesResponseDataToProfilesEntities(response.data));
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getById(id: string): Promise<Profile> {
        try {
            let response = await this.axiosInstance.get(`/profiles/${id}`);
            return (profileResponseDatumToProfileEntity(response.data));
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getByEmail(email: string): Promise<Profile> {
        try {
            let response = await this.axiosInstance.get(`/profiles/email/${email}`);
            return (profileResponseDatumToProfileEntity(response.data));
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getStaffs(): Promise<Profile[]> {
        try {
            let response = await this.axiosInstance.get(`/profiles/staffs`);
            return (profilesResponseDataToProfilesEntities(response.data));
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // async create(user: User, role: Role, profile: Profile, userAccount: UserAccount): Promise<User> {
    //     try {
    //         let response = await this.axiosInstance.post('/users/onboarding', {
    //             user,
    //             role,
    //             profile,
    //             userAccount
    //         });
    //         return (await userResponseDatumToUserEntity(response.data));
    //     } catch (error) {
    //         console.log(error);
    //         throw error;
    //     }
    // }

    // async updateById(id: string, user: User, role: Role, profile: Profile, userAccount: UserAccount): Promise<User> {
    //     try {
    //         let response = await this.axiosInstance.put(`/users/${id}/user`, {
    //             user,
    //             role,
    //             profile,
    //             userAccount
    //         });
    //         return (userResponseDatumToUserEntity(response.data));
    //     } catch (error) {
    //         console.log(error);
    //         throw error;
    //     }
    // }

}