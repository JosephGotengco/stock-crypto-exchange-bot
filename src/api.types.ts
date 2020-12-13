export interface ApiError {
    message: string;
}

export interface ConvertedCurrencyPrice {
    fromCurrency: string;
    toCurrency: string;
    price: string;
    date: string;
}

export interface ConvertCurrencyResponse {
    status: number;
    prices: ConvertedCurrencyPrice[] | [];
    errors: ApiError[] | [];
}

export interface AutoCompleteMatch {
    symbol: string;
    name: string;
    type: string;
    region: string;
    marketOpen: number;
    marketClose: number;
    timezone: string;
    currency: string;
    matchScore: number;
}
export interface AutoCompleteResponse {
    status: number;
    matches: AutoCompleteMatch[] | [];
    errors: ApiError[] | [];
}

export interface AdjustedStockPrice {
    open: string;
    high: string;
    low: string;
    close: string;
    adjusted_close: string;
    volume: string;
    dividend_amount: string
    split_coefficient: string;
    date: string;
}

export interface AdjustedStockPriceResponse {
    status: number;
    adjustedStockPrices: AdjustedStockPrice[] | [];
    errors: ApiError[] | [];
}