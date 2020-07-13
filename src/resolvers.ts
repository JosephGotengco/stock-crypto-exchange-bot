import axios from "axios";
import config from "config";
import { ApiResponse, ApiError, Price } from "./api.types";

const ALPHA_API_KEY = config.get("alphaAdvantage.apiKey");

export const getCryptoCurrencyPrice = async (
    fromCurrency = "bitcoin",
    toCurrency = "cad"
): Promise<ApiResponse> => {
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
        const price: Price = {
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

export const resolvers = {
    Query: {
        getCryptoCurrencyPrice: (
            obj: object,
            args: { fromCurrency: string; toCurrency: string }
        ) => {
            const { fromCurrency, toCurrency } = args;
            return getCryptoCurrencyPrice(fromCurrency, toCurrency);
        },
    },
};
