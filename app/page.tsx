import axios from "axios"
import {Coin, columns} from "@/components/custom/columns"
import {DataTable} from "@/components/custom/dataTable"

const COIN_MARKET_CAP_KEY = process.env.COIN_MARKET_CAP_KEY

async function getData(): Promise<Coin[]> {
    let results = []
    try {
        const {data} = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': COIN_MARKET_CAP_KEY,
            },
        })

        results = data.data
    } catch (err) {
        console.error(err)
    }

    return results
}

export default async function Home() {
    const data = await getData();

    return (
        <div className="container mx-auto py-4 px-2 md:py-8 md:px-4 md:flex md:justify-center">
            <div className="md:max-w-7xl">
                <DataTable columns={columns} data={data}/>
            </div>
        </div>
    )
}
