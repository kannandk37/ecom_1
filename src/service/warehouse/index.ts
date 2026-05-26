import { AxiosInstance } from "axios";
import axiosinstance from "..";
import { Warehouse } from "../../entity/warehouse";
import { WarehouseBin } from "../../entity/warehouse_bin";
import { warehouseResponseDatumToWarehouseEntity, warehousesResponseDataToWarehousesEntities } from "./transformer";
import { warehousesBinResponseDataToWarehousesBinEntities } from "../warehouse_bin/transformer";

export class WarehouseService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async createWarehouseAndEssentials(warehouse: Warehouse, warehouseBins: WarehouseBin[]): Promise<Warehouse> {
        try {
            let response = await this.axiosInstance.post('/warehouses', { warehouse, warehouseBins });
            return warehouseResponseDatumToWarehouseEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getWarehouseById(id: string): Promise<Warehouse> {
        try {
            let response = await this.axiosInstance.get(`/warehouses/${id}`);
            return warehouseResponseDatumToWarehouseEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateWarehouseAndEssentialsById(id: string, warehouse: Warehouse, warehouse_bin: WarehouseBin): Promise<Warehouse> {
        try {
            let response = await this.axiosInstance.put(`/warehouses/${id}`, { warehouse, warehouse_bin });
            return warehouseResponseDatumToWarehouseEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAllWarehouses(): Promise<Warehouse[]> {
        try {
            let response = await this.axiosInstance.get(`/warehouses`);
            return warehousesResponseDataToWarehousesEntities(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAllWarehousesWithDetails(): Promise<{
        warehouse: Warehouse,
        warehouseBins: WarehouseBin[],
        totalWareHouseBins: number;
        totalCapacitySpace: number;
        totalAvailableSpace: number;
        totalOccupiedSpace: number;
        noOfProducts: number
    }[]> {
        try {
            let response = await this.axiosInstance.get(`/warehouses/details`);
            let result: {
                warehouse: Warehouse,
                warehouseBins: WarehouseBin[],
                totalWareHouseBins: number;
                totalCapacitySpace: number;
                totalAvailableSpace: number;
                totalOccupiedSpace: number;
                noOfProducts: number
            }[] = [];
            if (response?.data?.length > 0) {
                for (const warehouseInfo of response.data) {
                    let warehouse = await warehouseResponseDatumToWarehouseEntity(warehouseInfo.warehouse);
                    let warehouseBins = await warehousesBinResponseDataToWarehousesBinEntities(warehouseInfo.warehouseBins);
                    let totalWareHouseBins = warehouseInfo.totalWareHouseBins;
                    let totalCapacitySpace = warehouseInfo.totalCapacitySpace;
                    let totalAvailableSpace = warehouseInfo.totalAvailableSpace;
                    let totalOccupiedSpace = warehouseInfo.totalOccupiedSpace;
                    let noOfProducts = warehouseInfo.noOfProducts;
                    result.push({
                        warehouse: warehouse,
                        warehouseBins: warehouseBins,
                        totalWareHouseBins: totalWareHouseBins,
                        totalCapacitySpace: totalCapacitySpace,
                        totalAvailableSpace: totalAvailableSpace,
                        totalOccupiedSpace: totalOccupiedSpace,
                        noOfProducts: noOfProducts
                    })
                }
            }
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}