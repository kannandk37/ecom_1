import { Cart } from "../entity/cart";
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

    async clearToken() {
        return await storage.removeItem('token');
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

    async clearUser() {
        return await storage.removeItem('user');
    }

    async storeRole(role: Role) {
        return await storage.setItem('role', JSON.stringify(role));
    }

    async getRole() {
        let data = await storage.getItem('role');
        if (data) {
            return JSON.parse(data) as Role
        } else {
            return null;
        }
    }

    async clearRole() {
        return await storage.removeItem('role');
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

    async clearProfile() {
        return await storage.removeItem('profile');
    }

    async storeCart(cart: Cart) {
        return await storage.setItem('cart', JSON.stringify(cart));
    }

    async getCart() {
        let data = await storage.getItem('cart');
        if (data) {
            return JSON.parse(data) as Cart
        } else {
            return null;
        }
    }

    async clearCart() {
        return await storage.removeItem('cart');
    }

} 