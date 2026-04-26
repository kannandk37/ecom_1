import { Brand } from "../../../entity/brand";
import { categoryResponseDatumToCategoryEntity } from "../../category/transformer";

export function brandResponseDatumToBrandEntity(raw: any): Brand {
    let brand = new Brand();

    if (raw === null) {
        return brand = null;
    }

    if (raw.id) {
        brand.id = raw.id;
    }

    if (raw.name) {
        brand.name = raw.name;
    }

    if (raw.description) {
        brand.description = raw.description;
    }

    if (raw.category) {
        brand.category = categoryResponseDatumToCategoryEntity(raw.category);
    }

    if (raw.image) {
        brand.image = raw.image;
    }

    return brand;
}

export function brandsResponseDataToBrandsEntities(raws: any[]): Brand[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map((raw) => brandResponseDatumToBrandEntity(raw));
}