import { AxiosInstance, AxiosResponse } from "axios";
import axiosinstance from "..";
import { Category } from "../../entity/category";
import { categoriesResponseDataToCategoriesEntities, categoryResponseDatumToCategoryEntity } from "./transformer";
import { Brand } from "../../entity/brand";
import { Product } from "../../entity/product";
import { brandsResponseDataToBrandsEntities } from "../brand/transformer";
import { productsResponseDataToProductsEntities } from "../product/transformer";

export class CategoryService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axiosinstance;
    }

    async create(category: Category): Promise<Category> {
        try {
            let response = await this.axiosInstance.post('/categories', {
                category
            })
            return categoryResponseDatumToCategoryEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async get(): Promise<Category[]> {
        try {
            let response = await this.axiosInstance.get('/categories');
            return categoriesResponseDataToCategoriesEntities(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getCategoriesWithBrandsAndProducts(): Promise<{ catgeory: Category, brands: Brand[], products: Product[] }[]> {
        try {
            let response = await this.axiosInstance.get('/categories/categorieswithbrandsandproducts');
            let result: { catgeory: Category, brands: Brand[], products: Product[] }[] = [];
            if (response.data?.length) {
                for (const catgeoryInfo of response.data) {
                    let category = await categoryResponseDatumToCategoryEntity(catgeoryInfo.catgeory);
                    let brands = await brandsResponseDataToBrandsEntities(catgeoryInfo.brands);
                    let products = await productsResponseDataToProductsEntities(catgeoryInfo.products);
                    result.push({
                        catgeory: category,
                        brands: brands,
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

    async getById(id: string): Promise<Category> {
        try {
            let response = await this.axiosInstance.get(`/categories/${id}`);
            return categoryResponseDatumToCategoryEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getBySubCategoryId(subCategoryId: string): Promise<Category> {
        try {
            let response = await this.axiosInstance.get(`/categories/subCategory/${subCategoryId}`);
            return categoryResponseDatumToCategoryEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateById(id: string, category: Category): Promise<Category> {
        try {
            let response = await this.axiosInstance.put(`/categories/${id}`, { category: category });
            return categoryResponseDatumToCategoryEntity(response.data as any);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}