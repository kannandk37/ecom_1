export class Category {
    id?: string;
    name?: string;
    description?: string;
    subCategory?: Category; // Used here as Parent Category reference
    image?: string;
}