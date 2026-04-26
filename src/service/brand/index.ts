import { AxiosInstance } from "axios";
import axiosinstance from "..";
import { brandsResponseDataToBrandsEntities, brandResponseDatumToBrandEntity } from "./transformer";
import { Brand } from "../../entity/brand";

export class BrandService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async create(brand: Brand): Promise<Brand> {
        try {
            let response = await this.axiosInstance.post('/brands', { brand })
            return brandResponseDatumToBrandEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async get(): Promise<Brand[]> {
        try {
            let response = await this.axiosInstance.get('/brands');
            return brandsResponseDataToBrandsEntities(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getById(id: string): Promise<Brand> {
        try {
            let response = await this.axiosInstance.get(`/brands/${id}`);
            return brandResponseDatumToBrandEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getByCategoryId(categoryId: string): Promise<Brand> {
        try {
            let response = await this.axiosInstance.get(`/brands/category/${categoryId}`);
            return brandResponseDatumToBrandEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateById(id: string, brand: Brand): Promise<Brand> {
        try {
            let response = await this.axiosInstance.put(`/brands/${id}`, { brand: brand });
            return brandResponseDatumToBrandEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}