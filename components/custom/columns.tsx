"use client";

import {ColumnDef} from "@tanstack/react-table"

export type Coin = {
    cmc_rank: number;
    name: string;
    symbol: string;
    quote: {
        USD: {
            market_cap: number;
            price: number;
            percent_change_24h: number;
        };
    };
};

const formatCurrency = (amount: number): string => {
    const USDollar = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });
    return USDollar.format(amount)
}

const formatPercentage = (number: number): string => {
    const percentage = new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return percentage.format(number)
}

const formatMarketCap = (value: number): string => {
    if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(2)} Bn`;
    } else if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(2)} Mn`;
    } else {
        return `${value}`;
    }
};

export const columns: ColumnDef<Coin>[] = [
    {
        accessorKey: "cmc_rank",
        header: ({column}) => {
            return (
                <div
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    #
                    <span className="ml-2">{column.getIsSorted() === "asc" ? "▲" : "▼"}</span>
                </div>
            )
        },
        cell: ({row}) => <div>#{row.getValue("cmc_rank")}</div>,
    },
    {
        accessorKey: "symbol",
        header: ({column}) => {
            return (
                <div
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <span className="ml-2">{column.getIsSorted() === "asc" ? "▲" : "▼"}</span>
                </div>
            )
        },
        cell: ({row}) => {
            const symbol = row.original.symbol
            const marketCap = row.original.quote.USD.market_cap

            return (
                <div className="font-medium flex items-center gap-2">
                    <img
                        src={`/coin-icons/${symbol.toLowerCase()}.svg`}
                        className="h-7 rounded-full"
                        alt={''}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/cmc_logo.jpg"

                            // TODO Not working
                        }}
                    />

                    <div>
                        {symbol}

                        <div className="text-gray-500 text-xs">
                            {formatMarketCap(marketCap)}
                        </div>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "quote.USD.price",
        header: ({column}) => {
            return (
                <div
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
                    <span className="ml-2">{column.getIsSorted() === "asc" ? "▲" : "▼"}</span>
                </div>
            )
        },
        cell: ({row}) => {
            const price = row.original.quote.USD.price
            return (
                <div className="text-right text-sm">
                    {formatCurrency(price)}
                </div>
            );
        },
    },
    {
        accessorKey: "quote.USD.percent_change_24h",
        header: ({column}) => {
            return (
                <div
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    24h %
                    <span className="ml-2">{column.getIsSorted() === "asc" ? "▲" : "▼"}</span>
                </div>
            )
        },
        cell: ({row}) => {
            const percentChange = row.original.quote.USD.percent_change_24h
            const isPositive = percentChange >= 0

            return (
                <div className="text-center">
                    <span
                        className={`text-xs p-1 rounded ${
                            isPositive ? "text-green-500 bg-green-900" : "text-red-500 bg-red-900"
                        }`}
                    >
                    {isPositive ? "▲" : "▼"}
                        <span className="ml-1">{formatPercentage(percentChange)}</span>
                </span>
                </div>
            );
        },
    },
];
