export interface ApiError {
    message: string;
}

export interface Price {
    fromCurrency: string;
    toCurrency: string;
    price: string;
    date: string;
}

export interface ApiResponse {
    status: number;
    prices: Price[] | [];
    errors: ApiError[] | [];
}

