import { AxiosInstance } from "axios";
import axiosinstance from "..";
import { Inventory } from "../../entity/inventory";
import { BinStock } from "../../entity/bin_stock";
import { StockLedger } from "../../entity/stock_ledger";
import { Product } from "../../entity/product";
import { Warehouse } from "../../entity/warehouse";
import { WarehouseBin } from "../../entity/warehouse_bin";
import { Variant } from "../../entity/variant";
import { inventoryResponseDatumToInventoryEntity } from "./transformer";


export class InventoryService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async createInventory(inventory: Inventory ): Promise<Inventory> {
        try {
            let response = await this.axiosInstance.post('/inventories/addProduct', { inventory });
            return response.data as any;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async inventoryByWarehouseAndProduct(warehouseId: string, productId: string): Promise<Inventory> {
        try {
            let response = await this.axiosInstance.get(`/inventories/warehouse/${warehouseId}/product/${productId}`);
            return inventoryResponseDatumToInventoryEntity(response.data);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async adjustStock(inventory: Inventory, binStock: BinStock, stockLedger: StockLedger, canDelete: boolean): Promise<Inventory> {
        try {
            let response = await this.axiosInstance.post(`/inventories/adjust`, { inventory, binStock, stockLedger, canDelete });
            return inventoryResponseDatumToInventoryEntity(response.data);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async wasteStock(inventory: Inventory, binStock: BinStock, stockLedger: StockLedger): Promise<Inventory> {
        try {
            let response = await this.axiosInstance.post(`/inventories/waste`, { inventory, binStock, stockLedger });
            return inventoryResponseDatumToInventoryEntity(response.data);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}