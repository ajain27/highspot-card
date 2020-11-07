export interface CardData {
    attributes?: string;
    collectible: string
    cost?: number
    id: string;
    imageUrl: string;
    name: string;
    rarity: string;
    set: {
        id: string;
        name: string;
        _self: string;
    }
    text: string;
    type: string;
    unique?: boolean
}