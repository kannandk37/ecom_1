import { AxiosInstance } from "axios";
import axiosinstance from "..";
import { BinStock } from "../../entity/bin_stock";
import { binStocksResponseDataToBinStocksEntities } from "./transformer";

export class BinStockService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async binStocksByWarehouseBinAndProduct(warehouseBinId: string, productId: string): Promise<BinStock[]> {
        try {
            let response = await this.axiosInstance.get(`/binstocks/warehousebin/${warehouseBinId}/product/${productId}`);
            return binStocksResponseDataToBinStocksEntities(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}