import { AxiosInstance } from "axios";
import axiosinstance from "..";
import { WarehouseBin } from "../../entity/warehouse_bin";
import { warehousesBinResponseDataToWarehousesBinEntities } from "./transformer";
import { Warehouse } from "../../entity/warehouse";
import { Product } from "../../entity/product";
import { Variant } from "../../entity/variant";

export class WarehouseBinService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async getWarehouseBinsByWareHouseId(warehouseId: string): Promise<WarehouseBin[]> {
        try {
            let response = await this.axiosInstance.get(`/warehousebins/warehouse/${warehouseId}`);
            return warehousesBinResponseDataToWarehousesBinEntities(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async allocateWarehouseBins(warehouse: Warehouse, product: Product, quantity: number, variant: Variant): Promise<{
        success: boolean,
        allocations: WarehouseBin[],
        totalAllocated: number,
        shortfall: number,
        transferSuggestions: WarehouseBin[],
    }> {
        try {
            let response = await this.axiosInstance.post(`/warehousebins/allocate`, { warehouse, product, quantity, variant });
            return response.data as {
                success: boolean,
                allocations: WarehouseBin[],
                totalAllocated: number,
                shortfall: number,
                transferSuggestions: WarehouseBin[],
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}