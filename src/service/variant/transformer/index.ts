import { productResponseDatumToProductEntity } from "../../product/transformer";
import { Unit, Variant, VariantGrade, VariantType } from "../../../entity/variant";

export function variantResponseDatumToVariantEntity(raw: any): Variant {
    let variant = new Variant();

    if (raw === null) {
        return variant = null;
    }

    if (raw.id) {
        variant.id = raw.id;
    }

    if (raw.name) {
        variant.name = raw.name;
    }

    if (raw.product) {
        variant.product = productResponseDatumToProductEntity(raw.product);
    }

    if (raw.type) {
        variant.type = raw.type as VariantType;
    }

    if (raw.grade) {
        variant.grade = raw.grade as VariantGrade;
    }

    if (raw.price) {
        variant.price = raw.price;
    }

    if (raw.weight) {
        variant.weight = raw.weight;
    }

    if (raw.unit) {
        variant.unit = raw.unit as Unit;
    }

    if (raw.images) {
        variant.images = raw.images;
    }

    if (raw.sku) {
        variant.sku = raw.sku;
    }

    return variant;
}

export function variantsResponseDataToVariantsEntities(raws: any[]): Variant[] {
    if (!raws || raws.length === 0) {
        return [];
    }

    return raws.map(variantResponseDatumToVariantEntity);
}