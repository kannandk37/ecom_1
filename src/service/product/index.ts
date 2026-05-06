import { AxiosInstance } from "axios";
import axiosinstance from "..";
import { Product } from "../../entity/product";
import { productResponseDatumToProductEntity, productsResponseDataToProductsEntities } from "./transformer";


export class ProductService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async create(product: Product): Promise<Product> {
        try {
            let response = await this.axiosInstance.post('/products', { product })
            return productResponseDatumToProductEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async get(): Promise<Product[]> {
        try {
            let response = await this.axiosInstance.get('/products');
            return productsResponseDataToProductsEntities(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getById(id: string): Promise<Product> {
        try {
            let response = await this.axiosInstance.get(`/products/${id}`);
            return productResponseDatumToProductEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getByCategoryId(categoryId: string): Promise<Product[]> {
        try {
            let response = await this.axiosInstance.get(`/products/category/${categoryId}`);
            return productsResponseDataToProductsEntities(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getByName(search: string) {
        try {
            let url = search ? `/products?name=${search}` : `/products`
            let response = await this.axiosInstance.get(url);
            return productsResponseDataToProductsEntities(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateById(id: string, product: Product): Promise<Product> {
        try {
            let response = await this.axiosInstance.put(`/products/${id}`, { product: product });
            return productResponseDatumToProductEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}