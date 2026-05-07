import { Product } from "../product";
import { Variant } from "../variant";

export class CartItem {
    id?: string;
    product?: Product;
    variant?: Variant;
    quantity?: number;
}