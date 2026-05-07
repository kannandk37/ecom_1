import { AxiosInstance } from "axios";
import axiosinstance from "..";
import { Cart } from "../../entity/cart";
import { cartResponseDatumToCartEntity } from "./transformer";


export class CartService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async create(cart: Cart): Promise<Cart> {
        try {
            let response = await this.axiosInstance.post('/carts/add', { cart: cart })
            return cartResponseDatumToCartEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getById(id: string): Promise<Cart> {
        try {
            let response = await this.axiosInstance.get(`/carts/${id}`);
            return cartResponseDatumToCartEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getMyCart(): Promise<Cart> {
        try {
            let response = await this.axiosInstance.get(`/carts/me`);
            return cartResponseDatumToCartEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deleteCartItemFromCartByCartIdandCartItemId(id: string, cartItemId: string): Promise<Cart> {
        try {
            let response = await this.axiosInstance.delete(`/carts/${id}/items/${cartItemId}`);
            return cartResponseDatumToCartEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async clearMyCart(): Promise<boolean> {
        try {
            let response = await this.axiosInstance.delete(`/carts/clear`);
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}