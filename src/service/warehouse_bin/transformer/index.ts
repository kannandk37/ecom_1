import { WarehouseBin } from "../../../entity/warehouse_bin";
import { warehouseResponseDatumToWarehouseEntity } from "../../warehouse/transformer";

export function warehouseBinResponseDatumToWarehouseBinEntity(raw: any): WarehouseBin {
    let warehouseBin = new WarehouseBin();

    if (raw === null || raw === undefined) {
        return warehouseBin = null;
    }

    if (raw.id) {
        warehouseBin.id = raw.id;
    }

    if (raw.warehouse) {
        warehouseBin.warehouse = warehouseResponseDatumToWarehouseEntity(warehouseBin.warehouse);
    }

    if (raw.binCode) {
        warehouseBin.binCode = raw.binCode;
    }

    if (raw.aisle) {
        warehouseBin.aisle = raw.aisle;
    }

    if (raw.rack) {
        warehouseBin.rack = raw.rack;
    }

    if (raw.level) {
        warehouseBin.level = raw.level;
    }

    if (raw.position) {
        warehouseBin.position = raw.position;
    }

    if (raw.maxUnits !== undefined) {
        warehouseBin.maxUnits = raw.maxUnits;
    }

    if (raw.isActive !== undefined) {
        warehouseBin.isActive = raw.isActive;
    }

    return warehouseBin;
}

export function warehouseBinResponseDataToWarehouseBinEntities(raws: any[]): WarehouseBin[] {
    if (!raws || raws.length === 0) {
        return [];
    }

    return raws.map(warehouseBinResponseDatumToWarehouseBinEntity);
}