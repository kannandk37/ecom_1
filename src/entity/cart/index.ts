import { CartItem } from "../cart_item";
import { User } from "../user";

export class Cart {
    id?: string;
    user?: User;
    cartItems?: CartItem[];
    appliedPromocode?: string;
    isActive?: boolean;
}