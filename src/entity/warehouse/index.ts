import { Address } from "../address";
import { User } from "../user";

export enum WarehouseType {
    OWN = "own",
    RENTED = "rented",
}

export enum WarehouseStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    MAINTENANCE = "maintenance",
}

export enum CapacityUnit {
    UNITS = "units",
    //   CUBIC_METERS = "cubic_meters",
    //   PALLETS = "pallets",
}

export class Warehouse {
    id?: string;
    code?: string;
    name?: string;
    type?: WarehouseType;
    status?: WarehouseStatus;
    address?: Address;
    totalCapacity?: number;
    capacityUnit?: CapacityUnit;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
    operator?: User;
}

export class WarehouseBin {
    id?: string;
    warehouse?: Warehouse;
    binCode?: string;
    aisle?: string;
    rack?: string;
    level?: string;
    maxUnits?: number;
    isActive?: boolean;
}