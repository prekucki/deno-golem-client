import { Command, CommandGroup, string } from "https://deno.land/x/clay/mod.ts";
import { BigDenary } from "https://deno.land/x/bigdenary/mod.ts";
import WebClient from '../rest/client.ts'

type CmdConfig = {
    appKey: string | null,
    url:string | null
}

type Allocation = {
    allocationId: string,
    address: string,
    paymentPlatform: string,
    totalAmount: string | number,
    spentAmount: string | number,
    remainingAmount: string | number,
    timestamp: string,
    timeout: string | undefined,
    makeDeposit: boolean,
}

function resolveClient(config : CmdConfig) : WebClient {
    const decode = (v : string | null, env : string, message : string, default_value : string | null = null) : string => {
        if (v !== null) {
            return v;
        }
        const de = Deno.env.get(env);
        if (de !== undefined) {
            return de;
        }
        if (default_value) {
            return default_value;
        }
        throw new Error(message);
    }

    const appKey = decode(config.appKey, "YAGNA_APPKEY", "expected api-key");
    const apiUrl = decode(config.url, "YAGNA_API_URL", "expected api url", 'http://127.0.0.1:7465/');
    return new WebClient(appKey, apiUrl);
}
async function main() {

    const list = new Command("list allocations")
        .optional(string, "appKey", { flags: ["k", "app-key"], description: "Golem REST server authorization token" })
        .optional(string, "url", { flags: ["url"], description: "api url" });


    const clean = new Command("clean allocations")
        .optional(string, "appKey", { flags: ["k", "app-key"], description: "Golem REST server authorization token" })
        .optional(string, "url", { flags: ["url"], description: "api url" });


    const manage = new CommandGroup("A simple example.")
        .subcommand("list", list)
        .subcommand("clean", clean)

    const args = manage.run();

    if (args.list) {
        const client = resolveClient(args.list);
        const result = await client.get('payment-api/v1/allocations');
        const allocations = (await result.json()) as Allocation[];
        console.table(allocations.map((a)=> {
            return {
                allocationId: a.allocationId,
                timestamp: a.timestamp,
                timeout: a.timeout,
                spentAmount: new BigDenary(a.spentAmount).toString(),
                paymentPlatform: a.paymentPlatform
                    .replace("erc20-", "")
                    .replace("-tglm", "")
            }
        }));
    }
    if (args.clean) {
        const client = resolveClient(args.clean);
        const result = await client.get('payment-api/v1/allocations');
        const allocations = (await result.json()) as Allocation[];
        const now = new Date().toUTCString();
        for (let allocation of allocations) {
            if (allocation.timeout && new Date(allocation.timeout).toUTCString() < now) {
                console.log('dropping', allocation.allocationId, 'timeout=', allocation.timeout);
                const b = await client.delete(`payment-api/v1/allocations/${allocation.allocationId}`);
                console.log('status', b.status);
            }
        }

    }


}


await main();