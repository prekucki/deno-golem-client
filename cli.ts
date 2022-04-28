import WebClient from "./rest/client.ts";
import { MarketApi } from "./rest/market.ts";

async function main() {
    const appKey = Deno.env.get("YAGNA_APPKEY");
    if (!appKey) {
        console.error("missing YAGNA_APPKEY");
        return;
    }
    const client = new WebClient(appKey, "http://127.0.0.1:7465/");
    const me = await client.identity();
    console.log(me.identity, me.name);

    const market = new MarketApi(client);

    console.table(await market.offers(), [
        "offerId",
        "providerId",
        "timestamp",
    ]);
}

await main();
