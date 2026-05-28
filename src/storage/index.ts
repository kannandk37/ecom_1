import { Cart } from "../entity/cart";
import { Profile } from "../entity/profile";
import { Role } from "../entity/role";
import { User } from "../entity/user";
import { Wishlist } from "../entity/wishlist";

const storage = localStorage;
const session = sessionStorage;

export class LocalStorage {

    async storeToken(token: string, keepMeLoggedIn: boolean) {
        if(keepMeLoggedIn) {
            return await storage.setItem('token', token);
        } else {
            return await session.setItem('token', token);
        }
    }

    async getToken() {
        return await storage.getItem('token') ?? await session.getItem('token');
    }

    async clearToken() {
        await storage.removeItem('token');
        await session.removeItem('token');
        return 
    }

    async storeRefreshToken(refreshToken: string, keepMeLoggedIn: boolean) {
        if(keepMeLoggedIn) {
            return await storage.setItem('refreshtoken', refreshToken);
        } else {
            return await session.setItem('refreshtoken', refreshToken);
        }
    }

    async getRefreshToken() {
        return await storage.getItem('refreshtoken') ?? await session.getItem('refreshtoken');
    }

    async clearRefreshToken() {
        await storage.removeItem('refreshtoken');
        await session.removeItem('refreshtoken');
        return 
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

    async storeWishlists(wishlists: Wishlist[]) {
        return await storage.setItem('wishlists', JSON.stringify(wishlists));
    }

    async getWishlists() {
        let data = await storage.getItem('wishlists');
        if (data) {
            return JSON.parse(data) as Wishlist[]
        } else {
            return [];
        }
    }

    async clearWishlists() {
        return await storage.removeItem('wishlists');
    }

} 