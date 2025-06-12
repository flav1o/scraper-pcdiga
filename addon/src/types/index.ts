export type Store = 'PC_DIGA' | 'WORTEN'

export interface PriceHistoryPoint {
    date: Date
    price: number
    discountPrice?: number | null
    store: Store
}

export interface PriceHistory {
    productId: string
    history: PriceHistoryPoint[]
} 