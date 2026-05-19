import { Inventory, ReorderStatus } from "../../../entity/inventory";
import { productResponseDatumToProductEntity } from "../../product/transformer";
import { variantResponseDatumToVariantEntity } from "../../variant/transformer";
import { warehouseResponseDatumToWarehouseEntity } from "../../warehouse/transformer";
import { warehousesBinResponseDataToWarehousesBinEntities } from "../../warehouse_bin/transformer";

export function inventoryResponseDatumToInventoryEntity(raw: any): Inventory {
    let inventory = new Inventory();

    if (raw === null || raw === undefined) {
        return inventory = null;
    }

    if (raw.id) {
        inventory.id = raw.id;
    }

    if (raw.product) {
        inventory.product = productResponseDatumToProductEntity(raw.product);
    }

    if (raw.variant) {
        inventory.variant = variantResponseDatumToVariantEntity(raw.variant);
    }

    if (raw.warehouse) {
        inventory.warehouse = warehouseResponseDatumToWarehouseEntity(raw.warehouse);
    }

    if (raw.warehouseBins?.length > 0) {
        inventory.warehouseBins = warehousesBinResponseDataToWarehousesBinEntities(raw.warehouseBins);
    }

    if (raw.reorderPoint !== undefined) {
        inventory.reorderPoint = raw.reorderPoint;
    }

    if (raw.reorderQty !== undefined) {
        inventory.reorderQty = raw.reorderQty;
    }

    if (raw.maxStockLevel !== undefined) {
        inventory.maxStockLevel = raw.maxStockLevel;
    }

    if (raw.qtyOnHand !== undefined) {
        inventory.qtyOnHand = raw.qtyOnHand;
    }

    if (raw.qtyReserved !== undefined) {
        inventory.qtyReserved = raw.qtyReserved;
    }

    if (raw.qtyCommitted !== undefined) {
        inventory.qtyCommitted = raw.qtyCommitted;
    }

    if (raw.reorderOrderedQty !== undefined) {
        inventory.reorderOrderedQty = raw.reorderOrderedQty;
    }

    if (raw.reorderStatus) {
        inventory.reorderStatus = raw.reorderStatus as ReorderStatus;
    }

    if (raw.lastMovementAt) {
        inventory.lastMovementAt = raw.lastMovementAt;
    }

    if (raw.updatedAt) {
        inventory.updatedAt = raw.updatedAt;
    }

    return inventory;
}

export function inventoryResponseDataToInventoryEntities(raws: any[]): Inventory[] {
    if (!raws || raws.length === 0) {
        return [];
    }

    return raws.map(inventoryResponseDatumToInventoryEntity);
}