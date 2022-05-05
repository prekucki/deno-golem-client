import { ComLinear, Counter, unpackPrices } from "./com.ts";
import { Data } from "./base.ts";

Deno.test("test linear encode", () => {
    const input: Data<ComLinear> = {
        priceModel: "linear",
        scheme: "payu",
        usages: [Counter.CPU, Counter.TIME],
        coeffs: [0, 0, 0],
    };
    const offerPart = ComLinear.encode(input);
    console.group("init");
    console.log(JSON.stringify(offerPart, undefined, 2));
    console.log(unpackPrices(input));
    console.table(ComLinear.prototype);
    console.table(ComLinear.key("priceModel"));
    console.groupEnd();
});
