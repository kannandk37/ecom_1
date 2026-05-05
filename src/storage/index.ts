import { Profile } from "../entity/profile";
import { Role } from "../entity/role";
import { User } from "../entity/user";

const storage = localStorage;

export class LocalStorage {

    async storeToken(token: string) {
        return await storage.setItem('token', token);
    }

    async getToken(token: string) {
        return await storage.getItem('token');
    }

    async storeUser(user: User) {
        return await storage.setItem('user', JSON.stringify(user));
    }

    async getUser() {
        let data = await storage.getItem('user');
        if (data) {
            return JSON.parse(data) as User
        } else {
            return null;
        }
    }


    async storeRole(role: Role) {
        return await storage.setItem('role', JSON.stringify(role));
    }

    async getrRole() {
        let data = await storage.getItem('role');
        if (data) {
            return JSON.parse(data) as Role
        } else {
            return null;
        }
    }

    async storeProfile(profile: Profile) {
        return await storage.setItem('profile', JSON.stringify(profile));
    }

    async getProfile() {
        let data = await storage.getItem('profile');
        if (data) {
            return JSON.parse(data) as Profile
        } else {
            return null;
        }
    }

} 