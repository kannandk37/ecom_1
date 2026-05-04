import { AxiosInstance } from "axios";
import axiosinstance from "..";
import { Role } from "../../entity/role";
import { rolesResponseDataToRolesEntities } from "./transformer";


export class RoleService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async get(): Promise<Role[]> {
        try {
            let response = await this.axiosInstance.get('/roles');
            return rolesResponseDataToRolesEntities(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}