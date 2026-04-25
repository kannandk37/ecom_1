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

    async getUser(user: User) {
        return await storage.getItem('user');
    }


    async storeRole(role: Role) {
        return await storage.setItem('role', JSON.stringify(role));
    }

    async getrRole(role: Role) {
        return await storage.getItem('role');
    }

    async storeProfile(profile: Profile) {
        return await storage.setItem('profile', JSON.stringify(profile));
    }

    async getProfile(profile: Profile) {
        return await storage.getItem('profile');
    }

} 