export type Ingredient = {
    id: number;
    name: string;
    perishability: number | null;
}

export type PantryItem = {
    id: number;
    ingredient: Ingredient;
    image?: string;
    expiration?: string;
    quantity: number;
}

export type Pantry = {
    id: number;
    name: string;
    items: PantryItem[];
}


