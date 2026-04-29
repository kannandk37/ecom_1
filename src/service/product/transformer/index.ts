
import { Duration, Label, Product, SpecValue, Unit, Storage } from "../../../entity/product";
import { brandResponseDatumToBrandEntity } from "../../brand/transformer";
import { categoryResponseDatumToCategoryEntity } from "../../category/transformer";
import { variantsResponseDataToVariantsEntities } from "../../variant/transformer";

export function productResponseDatumToProductEntity(raw: any): Product {
    let product = new Product();

    if (raw === null) {
        return product = null;
    }

    if (raw.id) {
        product.id = raw.id;
    }

    if (raw.title) {
        product.title = raw.title;
    }

    if (raw.name) {
        product.name = raw.name;
    }

    if (raw.description) {
        product.description = raw.description;
    }

    if (raw.price) {
        product.price = raw.price;
    }

    if (raw.shortDescription) {
        product.shortDescription = raw.shortDescription;
    }

    if (raw.category) {
        product.category = categoryResponseDatumToCategoryEntity(raw.category);
    }

    if (raw.brand) {
        product.brand = brandResponseDatumToBrandEntity(raw.brand);
    }

    if (raw.variants) {
        product.variants = variantsResponseDataToVariantsEntities(raw.variants);
    }

    if (raw.price) {
        product.price = raw.price;
    }

    if (raw.weight) {
        product.weight = raw.weight;
    }

    if (raw.unit) {
        product.unit = raw.unit as Unit;
    }

    if (raw.images) {
        product.images = raw.images;
    }

    if (raw.features) {
        product.features = raw.features;
    }

    if (raw.specs) {
        product.specs = transformSpecs(raw.specs);
    }

    if (raw.slug) {
        product.slug = raw.slug;
    }

    if (raw.averageRating) {
        product.averageRating = raw.averageRating;
    }

    return product;
}

export function productsResponseDataToProductsEntities(raws: any[]): Product[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map((raw) => productResponseDatumToProductEntity(raw));
}


function rawSpecToSpecValue(raw: any): SpecValue | null {
    if (!raw || !raw.label || raw.value === undefined) return null;

    switch (raw.label) {

        case Label.ORIGIN: {
            if (typeof raw.value !== 'string' || !raw.value.trim()) return null;
            const spec: Extract<SpecValue, { label: Label.ORIGIN }> = {
                label: Label.ORIGIN,
                value: raw.value.trim()
            };
            return spec;
        }

        case Label.STORAGE: {
            if (!Object.values(Storage).includes(raw.value)) return null;
            const spec: Extract<SpecValue, { label: Label.STORAGE }> = {
                label: Label.STORAGE,
                value: raw.value as Storage
            };
            return spec;
        }

        case Label.SHELF_LIFE: {
            if (typeof raw.value === 'object' && raw.value !== null) {
                const qty  = Number(raw.value.quantity);
                const unit = raw.value.unit as Duration;
                if (!qty || qty < 1 || !Object.values(Duration).includes(unit)) return null;
                const spec: Extract<SpecValue, { label: Label.SHELF_LIFE }> = {
                    label: Label.SHELF_LIFE,
                    value: { quantity: qty, unit }
                };
                return spec;
            }
            if (typeof raw.value === 'string') {
                const [qtyStr, unit] = raw.value.trim().split(' ');
                const qty = Number(qtyStr);
                if (!qty || qty < 1 || !Object.values(Duration).includes(unit as Duration)) return null;
                const spec: Extract<SpecValue, { label: Label.SHELF_LIFE }> = {
                    label: Label.SHELF_LIFE,
                    value: { quantity: qty, unit: unit as Duration }
                };
                return spec;
            }
            return null;
        }

        default:
            return null;
    }
}

export function transformSpecs(rawSpecs: any[]): SpecValue[] {
    if (!Array.isArray(rawSpecs) || rawSpecs.length === 0) return [];

    const seen = new Set<string>();
    const results: SpecValue[] = [];

    for (const raw of rawSpecs) {
        const spec = rawSpecToSpecValue(raw);
        if (!spec) continue;
        if (seen.has(spec.label)) continue;
        seen.add(spec.label);
        results.push(spec);
    }

    return results;
}