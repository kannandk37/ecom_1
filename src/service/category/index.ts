import { AxiosInstance, AxiosResponse } from "axios";
import axiosinstance from "..";
import { Category } from "../../entity/category";
import { categoriesResponseDataToCategoriesEntities, categoryResponseDatumToCategoryEntity } from "./transformer";

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