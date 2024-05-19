import { Command, CommandGroup, string } from "https://deno.land/x/clay/mod.ts";
import { BigDenary } from "https://deno.land/x/bigdenary/mod.ts";
import WebClient from "../rest/client.ts";

type CmdConfig = {
    appKey: string | null;
    url: string | null;
};

type Invoice = {
    invoiceId: string;
    issuerId: string;
    recipientId: string;
    payeeAddr: string;
    spentAmount: string | number;
    payerAddr: string;
    paymentPlatform: string;
    timestamp: string;
    agreementId: string;
    amount: string;
    paymentDueDate: string;
    status: string;
};

function resolveClient(config: CmdConfig): WebClient {
    const decode = (
        v: string | null,
        env: string,
        message: string,
        default_value: string | null = null,
    ): string => {
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
    };

    const appKey = decode(config.appKey, "YAGNA_APPKEY", "expected api-key");
    const apiUrl = decode(
        config.url,
        "YAGNA_API_URL",
        "expected api url",
        "http://127.0.0.1:7465/",
    );
    return new WebClient(appKey, apiUrl);
}
async function main() {
    const list = new Command("list invoices")
        .optional(string, "appKey", {
            flags: ["k", "app-key"],
            description: "Golem REST server authorization token",
        })
        .optional(string, "url", { flags: ["url"], description: "api url" });

    const reject = new Command("reject invoice")
        .optional(string, "appKey", {
            flags: ["k", "app-key"],
            description: "Golem REST server authorization token",
        })
        .optional(string, "url", { flags: ["url"], description: "api url" })
        .required(string, "invoiceId");

    const manage = new CommandGroup("A simple example.")
        .subcommand("list", list)
        .subcommand("reject", reject);

    const args = manage.run();

    if (args.list) {
        const client = resolveClient(args.list);
        const result = await client.get("payment-api/v1/invoices");
        const allocations = (await result.json()) as Invoice[];
        console.log(JSON.stringify(allocations, null, 4));

        console.table(allocations.map((a) => {
            return {
                invoiceId: a.invoiceId,
                status: a.status,
                issuerId: a.issuerId,
                timestamp: a.timestamp,
                paymentDueDate: a.paymentDueDate,
                amount: new BigDenary(a.amount).toString(),
                paymentPlatform: a.paymentPlatform
                    .replace("erc20-", "")
                    .replace("-tglm", ""),
            };
        }));
    }
    if (args.reject) {
        const client = resolveClient(args.reject);
        const { invoiceId } = args.reject;

        const result = await client.post(
            `payment-api/v1/invoices/${invoiceId}/reject`,
            {
                rejectionReason: "INCORRECT_AMOUNT",
                totalAmountAccepted: 0,
                message: "rejected by admin",
            },
        );

        console.log(await result.text());
    }
}

await main();
