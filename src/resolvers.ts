import axios from "axios";
import config from "config";
import {
    ConvertCurrencyResponse,
    AutoCompleteResponse,
    ApiError,
    ConvertedCurrencyPrice,
    AutoCompleteMatch,
    AdjustedStockPrice,
    AdjustedStockPriceResponse,
} from "./api.types";
import { standardize } from "./utils";

const ALPHA_API_KEY = config.get("alphaAdvantage.apiKey");

export const convertCurrency = async (
    fromCurrency = "bitcoin",
    toCurrency = "cad"
): Promise<ConvertCurrencyResponse> => {
    const errors: ApiError[] = [];
    const prices = [];
    let status = 200;

    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${ALPHA_API_KEY}`;
    const response = await axios.get(url);
    if (response.data["Error Message"]) {
        errors.push({
            message: `Cannot convert ${fromCurrency} to ${toCurrency}. Please check that they exist.`,
        });
        status = 400;
    } else {
        const toCurrencyPrice: string =
            response.data["Realtime Currency Exchange Rate"]["9. Ask Price"];
        const date: string =
            response.data["Realtime Currency Exchange Rate"][
                "6. Last Refreshed"
            ];
        const price: ConvertedCurrencyPrice = {
            fromCurrency,
            toCurrency,
            price: toCurrencyPrice,
            date,
        };
        prices.push(price);
    }

    return {
        prices,
        status,
        errors,
    };
};

export const autoCompleteSymbol = async(
    symbol: string
): Promise<AutoCompleteResponse> => {
    const errors: ApiError[] = [];
    const matches: AutoCompleteMatch[] = [];
    let status = 200;

    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${ALPHA_API_KEY}`;
    const response = await axios.get(url);
    if (response.data["Error Message"]) {
        errors.push({
            message: `Cannot auto complete the symbol ${symbol}. Please try again later`,
        });
        status = 400;
    } else if (response.data["Note"]) {
        errors.push({
            message: "Server has reached max auto complete limit for API. Please try again in 1 minute."
        });
        status = 400;
    } else {
        response.data["bestMatches"].forEach((val:object, i: number) => {
            const standardizedMatchObject: AutoCompleteMatch = standardize(val);
            matches.push(standardizedMatchObject);
        });
    }

    return {
        matches,
        status,
        errors,
    };
}

export const getAdjustedStockPrice = async(
    symbol: string
): Promise<AdjustedStockPriceResponse> => {
    const errors: ApiError[] = [];
    const adjustedStockPrices: AdjustedStockPrice[] = [];
    let status = 200;

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${ALPHA_API_KEY}`;
    const response = await axios.get(url);
    if (response.data["Error Message"]) {
        errors.push({
            message: `Cannot find the symbol ${symbol}. Please try again later`,
        });
        status = 400;
    } else if (response.data["Note"]) { 
        errors.push({
            message: `Server has reached max query limit for API. Please try again later`,
        });
        status = 400;
    } else {
        const dates = Object.keys(response.data["Time Series (Daily)"]);
        Object.values(response.data["Time Series (Daily)"]).reverse().forEach((val: object, i: number) => {
            const standardedPriceObject: AdjustedStockPrice = standardize(val);
            standardedPriceObject["date"] = dates[i];
            adjustedStockPrices.push(standardedPriceObject);
        });
        adjustedStockPrices.reverse();
    }

    return {
        adjustedStockPrices,
        status,
        errors
    };
}

export const resolvers = {
    Query: {
        convertCurrency: (
            obj: object,
            args: { fromCurrency: string; toCurrency: string }
        ) => {
            const { fromCurrency, toCurrency } = args;
            return convertCurrency(fromCurrency, toCurrency);
        },
        autoCompleteSymbol: (
            obj: object,
            args: { symbol: string }
        ) => {
            const { symbol } = args;
            return autoCompleteSymbol(symbol);
        },
        adjustedStockPrice: (
            obj: object,
            args: { symbol: string }
        ) => {
            const { symbol } = args;
            return getAdjustedStockPrice(symbol);
        }
    },
};
