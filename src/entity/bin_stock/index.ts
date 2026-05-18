import { DateTime } from "luxon";
import { Inventory } from "../inventory";
import { Product } from "../product";
import { Variant } from "../variant";
import { WarehouseBin } from "../warehouse_bin";

export class BinStock {
    id?: string;
    bin?: WarehouseBin;
    product?: Product;
    variant?: Variant;
    inventory?: Inventory;
    qtyOnHand?: number;
    batchNumber?: string;
    expiryDate?: DateTime;
    lastCountedAt?: Date;
}