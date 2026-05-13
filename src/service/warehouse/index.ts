import { AxiosInstance } from "axios";
import axiosinstance from "..";
import { Warehouse } from "../../entity/warehouse";
import { WarehouseBin } from "../../entity/warehouse_bin";
import { warehouseResponseDatumToWarehouseEntity } from "./transformer";

export class WarehouseService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async createWarehouseAndEssentials(warehouse: Warehouse, warehouse_bin: WarehouseBin): Promise<Warehouse> {
        try {
            let response = await this.axiosInstance.post('/warehouses', {warehouse, warehouse_bin});
            return warehouseResponseDatumToWarehouseEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getWarehouseById(id: string): Promise<Warehouse>{
        try {
            let response = await this.axiosInstance.get(`/warehouses/${id}`);
            return warehouseResponseDatumToWarehouseEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateWarehouseAndEssentialsById(id: string, warehouse: Warehouse, warehouse_bin: WarehouseBin): Promise<Warehouse>{
        try {
            let response = await this.axiosInstance.put(`/warehouses/${id}`, {warehouse, warehouse_bin});
            return warehouseResponseDatumToWarehouseEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}