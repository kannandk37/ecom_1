import { AxiosInstance } from "axios";
import axiosinstance from "..";
import { User } from "../../entity/user";
import { UserAccount } from "../../entity/user_account";
import { Role } from "../../entity/role";
import { Profile } from "../../entity/profile";


export class UserService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async create(user: User, role: Role, profile: Profile, userAccount: UserAccount): Promise<User> {
        try {
            let response = await this.axiosInstance.post('/users/onboarding', {
                user,
                role,
                profile,
                userAccount
            });
            return (response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateById(id: string, user: User, role: Role, profile: Profile, userAccount: UserAccount): Promise<User> {
        try {
            let response = await this.axiosInstance.put(`/users/${id}/user`, {
                user,
                role,
                profile,
                userAccount
            });
            return (response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}