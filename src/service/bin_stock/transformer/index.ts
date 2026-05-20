import { DateTime } from "luxon";
import { BinStock } from "../../../entity/bin_stock";
import { warehouseBinResponseDatumToWarehouseBinEntity } from "../../warehouse_bin/transformer";
import { productResponseDatumToProductEntity } from "../../product/transformer";
import { variantResponseDatumToVariantEntity } from "../../variant/transformer";
import { inventoryResponseDatumToInventoryEntity } from "../../inventory/transformer";

export function binStockResponseDatumToBinStockEntity(raw: any): BinStock {
    let binStock = new BinStock();

    if (raw === null || raw === undefined) {
        return binStock = null;
    }

    if (raw.id) {
        binStock.id = raw.id;
    }

    if (raw.bin) {
        binStock.bin = warehouseBinResponseDatumToWarehouseBinEntity(raw.bin);
    }

    if (raw.product) {
        binStock.product = productResponseDatumToProductEntity(raw.product);
    }

    if (raw.variant) {
        binStock.variant = variantResponseDatumToVariantEntity(raw.variant);
    }

    if (raw.inventory) {
        binStock.inventory = inventoryResponseDatumToInventoryEntity(raw.inventory);
    }

    if (raw.qtyOnHand !== undefined) {
        binStock.qtyOnHand = raw.qtyOnHand;
    }

    if (raw.batchNumber) {
        binStock.batchNumber = raw.batchNumber;
    }

    if (raw.expiryDate) {
        binStock.expiryDate = DateTime.fromISO(raw.expiryDate);
    }

    if (raw.lastCountedAt) {
        binStock.lastCountedAt = DateTime.fromISO(raw.lastCountedAt);
    }

    return binStock;
}

export function binStocksResponseDataToBinStocksEntities(raws: any[]): BinStock[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map(binStockResponseDatumToBinStockEntity);
}