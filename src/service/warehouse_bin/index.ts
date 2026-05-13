import { AxiosInstance } from "axios";
import axiosinstance from "..";
import { WarehouseBin } from "../../entity/warehouse_bin";
import { warehouseBinResponseDataToWarehouseBinEntities } from "./transformer";

export class WarehouseBinService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async getWarehouseBinsByWareHouseId(warehouseId: string): Promise<WarehouseBin[]> {
        try {
            let response = await this.axiosInstance.get(`/warehousebins/warehouse/${warehouseId}`);
            return warehouseBinResponseDataToWarehouseBinEntities(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}