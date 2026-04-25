import { Category } from "../../../entity/category";

export function categoryResponseDatumToCategoryEntity(responDatum: any): Category {
    let category = new Category();

    if (responDatum === null) {
        return category = null;
    }

    if (responDatum.id) {
        category.id = responDatum.id;
    }

    if (responDatum.name) {
        category.name = responDatum.name;
    }

    if (responDatum.description) {
        category.description = responDatum.description;
    }

    if (responDatum.subCategory) {
        category.subCategory = categoryResponseDatumToCategoryEntity(responDatum.subCategory);
    }

    if (responDatum.image) {
        category.image = responDatum.image;
    }

    return category;
}

export function categoriesResponseDataToCategoriesEntities(responData: any[]): Category[] {
    if (!responData || responData.length === 0) {
        return [];
    }
    return responData.map(categoryResponseDatumToCategoryEntity);
}