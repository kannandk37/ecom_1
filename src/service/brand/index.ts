import { AxiosInstance } from "axios";
import axiosinstance from "..";
import { brandsResponseDataToBrandsEntities, brandResponseDatumToBrandEntity } from "./transformer";
import { Brand } from "../../entity/brand";
import { Product } from "../../entity/product";
import { productsResponseDataToProductsEntities } from "../product/transformer";

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

    async getByCategoryId(categoryId: string): Promise<Brand[]> {
        try {
            let response = await this.axiosInstance.get(`/brands/category/${categoryId}`);
            return brandsResponseDataToBrandsEntities(response.data as any);
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

    async getBrandsWithProducts(): Promise<{ brand: Brand, products: Product[] }[]> {
        try {
            let response = await this.axiosInstance.get('/brands/brandswithproducts');
            let result: { brand: Brand, products: Product[] }[] = [];
            if (response.data?.length) {
                for (const brandInfo of response.data) {
                    let brand = await brandResponseDatumToBrandEntity(brandInfo.brand);
                    let products = await productsResponseDataToProductsEntities(brandInfo.products);
                    result.push({
                        brand: brand,
                        products: products
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

// const productIds: string[] = ['101', '102', '103'];
// const params = new URLSearchParams();

// // Append each ID under the same 'productIds' key
// productIds.forEach(id => params.append('productIds', id));

// // Sends: https://example.com
// fetch(`https://example.com{params.toString()}`)
//   .then(res => res.json())
//   .then(data => console.log('Products:', data))
//   .catch(err => console.error('Error:', err));