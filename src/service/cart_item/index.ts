import { AxiosInstance } from "axios";
import axiosinstance from "..";
import { CartItem } from "../../entity/cart_item";
import { cartItemResponseDatumToCartItemEntity } from "./transformer";


export class CartItemService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async updateById(id: string, cartItem: CartItem): Promise<CartItem> {
        try {
            let response = await this.axiosInstance.put(`/cartitems/${id}`, { cartItem: cartItem });
            return cartItemResponseDatumToCartItemEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}