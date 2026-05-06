import { Wishlist } from "../../../entity/wishlist";
import { productResponseDatumToProductEntity } from "../../product/transformer";
import { userResponseDatumToUserEntity } from "../../user/transformer";
import { variantResponseDatumToVariantEntity } from "../../variant/transformer";

export function wishlistResponseDatumToWishlistEntity(raw: any): Wishlist {
    let wishlist = new Wishlist();

    if (raw === null || raw === undefined) {
        return wishlist = null;
    }

    if (raw.id) {
        wishlist.id = raw.id;
    }

    if (raw.user) {
        wishlist.user = userResponseDatumToUserEntity(raw.user);
    }

    if (raw.product) {
        wishlist.product = productResponseDatumToProductEntity(raw.product);
    }

    if (raw.variant) {
        wishlist.variant = variantResponseDatumToVariantEntity(raw.variant);
    }

    return wishlist;
}

export function wishlistsResponseDataToWishlistsEntities(raws: any[]): Wishlist[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map(wishlistResponseDatumToWishlistEntity);
}
