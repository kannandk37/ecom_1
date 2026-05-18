import { Product } from "../product";
import { Variant } from "../variant";
import { Warehouse } from "../warehouse";
import { WarehouseBin } from "../warehouse_bin";

export enum ReorderStatus {
    NONE = 'none',
    TRIGGERED = 'triggered',
    RECEIVED = 'received'
}

export class Inventory {
    id?: string;
    product?: Product;
    variant?: Variant;
    warehouse?: Warehouse;
    warehouseBins: WarehouseBin[];
    qtyOnHand?: number;
    qtyReserved?: number;
    qtyCommitted?: number;
    // qtyAvailable    — compute on read: qtyOnHand - qtyReserved - qtyCommitted
    reorderPoint?: number;
    reorderQty?: number;
    reorderOrderedQty?: number;  // qty placed with vendor in reorder phase A — cleared after RECEIVED
    maxStockLevel?: number;
    reorderStatus?: ReorderStatus;
    lastMovementAt?: Date;
    updatedAt?: Date;
}