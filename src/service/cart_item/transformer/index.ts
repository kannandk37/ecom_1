import { CartItem } from "../../../entity/cart_items";
import { productResponseDatumToProductEntity } from "../../product/transformer";
import { variantResponseDatumToVariantEntity } from "../../variant/transformer";

export function cartItemResponseDatumToCartItemEntity(raw: any): CartItem {
    let cartItem = new CartItem();

    if (raw === null) {
        return cartItem = null;
    }

    if (raw.id) {
        cartItem.id = raw.id;
    }

    if (raw.product) {
        cartItem.product = productResponseDatumToProductEntity(raw.product);
    }

    if (raw.variant) {
        cartItem.variant = variantResponseDatumToVariantEntity(raw.variant);
    }

    if (raw.quantity) {
        cartItem.quantity = raw.quantity;
    }

    return cartItem;
}

export function cartItemsResponseDataToCartItemsEntities(raws: any[]): CartItem[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map(cartItemResponseDatumToCartItemEntity);
}