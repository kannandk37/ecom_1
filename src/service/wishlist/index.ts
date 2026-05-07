import { AxiosInstance } from "axios";
import axiosinstance from "..";
import { Wishlist } from "../../entity/wishlist";
import { wishlistResponseDatumToWishlistEntity, wishlistsResponseDataToWishlistsEntities } from "./transformer";
import { Variant } from "../../entity/variant";
import { Product } from "../../entity/product";
import { User } from "../../entity/user";

export class WishListService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async toggle(userId: string, productId: string, variantId?: string): Promise<Wishlist> {
        try {
            let response = await this.axiosInstance.post('/wishlists/toggle', { userId, productId, variantId })
            return wishlistResponseDatumToWishlistEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getByUserId(userId: string): Promise<Wishlist[]> {
        try {
            let response = await this.axiosInstance.get(`/wishlists/user/${userId}`);
            return wishlistsResponseDataToWishlistsEntities(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async checkIfProductIsInUserWishlistByUserIdProductIdVariantId(user: User, product: Product, variant: Variant): Promise<Wishlist> {
        try {
            let url = `/wishlists/check?user=${user.id}&product=${product.id}&variant=${variant.id}`;
            let response = await this.axiosInstance.get(url);
            return wishlistResponseDatumToWishlistEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}