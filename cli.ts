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

    const nets = await (await client.get('net-api/v1/net')).json();
    console.log('nets', nets);
    console.table(nets);

    const net_id = nets[0].id;
    let r = await (await client.get(`net-api/v1/net/${net_id}/listen-tcp/80`)).json();
    console.log('listent', r);

    /*const market = new MarketApi(client);

    console.table(await market.offers(), [
        "offerId",
        "providerId",
        "timestamp",
    ]);
*/

}

main().then(function () {});
