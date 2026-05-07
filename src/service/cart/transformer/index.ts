import { Cart } from "../../../entity/cart";
import { cartItemsResponseDataToCartItemsEntities } from "../../cart_item/transformer";
import { userResponseDatumToUserEntity } from "../../user/transformer";

export function cartResponseDatumToCartEntity(raw: any): Cart {
    let cart = new Cart();

    if (raw === null) {
        return cart = null;
    }

    if (raw.id) {
        cart.id = raw.id;
    }

    if (raw.user) {
        cart.user = userResponseDatumToUserEntity(raw.user);
    }

    if (raw?.cartItems && raw?.cartItems?.length > 0) {
        cart.cartItems = cartItemsResponseDataToCartItemsEntities(raw.cartItems);
    }

    if (raw?.appliedPromocode) {
        cart.appliedPromocode = raw.appliedPromocode
    }

    if (raw.isActive != undefined) {
        cart.isActive = raw.isActive
    }

    return cart;
}

export function cartsResponseDataToCartsEntities(raws: any[]): Cart[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map(cartResponseDatumToCartEntity);
}