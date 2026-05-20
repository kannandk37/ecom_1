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

    async createInventory(): Promise<Inventory> {
        try {
            let inventory = new Inventory();

            let warehouse = new Warehouse();
            warehouse.id = '6a0c10ad1e30cedd46e1daa9';

            let warehouseBins = [
                { id: '6a0c10ad1e30cedd46e1daaa', currentStock: 200 },
                { id: '6a0c10ad1e30cedd46e1daab', currentStock: 200 },
                { id: '6a0c10ad1e30cedd46e1daac', currentStock: 100 }
            ]

            let product = new Product();
            product.id = '69fadb7794c834ede01df7f0'

            inventory.product = product;
            inventory.variant = new Variant();
            inventory.warehouse = warehouse;
            inventory.qtyOnHand = 500;
            inventory.warehouseBins = warehouseBins;
            inventory.qtyReserved = 50;
            inventory.maxStockLevel = 2500;

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

    async adjustStock(inventory: Inventory, binStock: BinStock, stockLedger: StockLedger): Promise<Inventory> {
        try {
            let response = await this.axiosInstance.post(`/inventories/adjust`, { inventory, binStock, stockLedger });
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