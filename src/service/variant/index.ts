import { AxiosInstance } from "axios";
import axiosinstance from "..";
import { Variant } from "../../entity/variant";
import { variantResponseDatumToVariantEntity, variantsResponseDataToVariantsEntities } from "./transformer";


export class VariantService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async create(variant: Variant): Promise<Variant> {
        try {
            let response = await this.axiosInstance.post('/variants', { variant })
            return variantResponseDatumToVariantEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async get(): Promise<Variant[]> {
        try {
            let response = await this.axiosInstance.get('/variants');
            return variantsResponseDataToVariantsEntities(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getById(id: string): Promise<Variant> {
        try {
            let response = await this.axiosInstance.get(`/variants/${id}`);
            return variantResponseDatumToVariantEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getByProductId(productId: string): Promise<Variant> {
        try {
            let response = await this.axiosInstance.get(`/variants/product/${productId}`);
            return variantResponseDatumToVariantEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateById(id: string, variant: Variant): Promise<Variant> {
        try {
            let response = await this.axiosInstance.put(`/variants/${id}`, { variant: variant });
            return variantResponseDatumToVariantEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}