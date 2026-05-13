import { CapacityUnit, Warehouse, WarehouseStatus, WarehouseType } from "../../../entity/warehouse";
import { addressResponseDatumToAddressEntity } from "../../address/transformer";
import { userResponseDatumToUserEntity } from "../../user/transformer";

export function warehouseResponseDatumToWarehouseEntity(response: any): Warehouse {
    let warehouse = new Warehouse();

    if (response === null || response === undefined) {
        return warehouse = null;
    }

    if (response.id) {
        warehouse.id = response.id;
    }

    if (response.code) {
        warehouse.code = response.code;
    }

    if (response.name) {
        warehouse.name = response.name;
    }

    if (response.type) {
        warehouse.type = response.type as WarehouseType;
    }

    if (response.status) {
        warehouse.status = response.status as WarehouseStatus;
    }

    if (response.address) {
        warehouse.address = addressResponseDatumToAddressEntity(response.address);
    }

    if (response.totalCapacity !== undefined) {
        warehouse.totalCapacity = response.totalCapacity;
    }

    if (response.image) {
        warehouse.image = response.image;
    }

    if (response.capacityUnit) {
        warehouse.capacityUnit = response.capacityUnit as CapacityUnit;
    }

    if (response.operator) {
        warehouse.operator = userResponseDatumToUserEntity(response.operator);
    }

    return warehouse;
}

export function warehouseResponseDataToWarehouseEntity(responses: any[]): Warehouse[] {
    if (!responses || responses.length === 0) {
        return [];
    }

    return responses.map(warehouseResponseDatumToWarehouseEntity);
}