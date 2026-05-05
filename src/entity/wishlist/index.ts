import { Product } from "../product";
import { User } from "../user";
import { Variant } from "../variant";

export class Wishlist {
    id?: string;
    user?: User;
    product?: Product;
    variant?: Variant;
    createdAt?: Date;
}
