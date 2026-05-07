import { CartItem } from "../cart_items";
import { User } from "../user";

export class Cart {
    id?: string;
    user?: User;
    cartItems?: CartItem[];
    appliedPromocode?: string;
    isActive?: boolean;
}