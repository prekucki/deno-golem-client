import { Data, Property, Spec } from "./base.ts";

export enum BillingScheme {
    PAYU = "payu",
}

export enum Counter {
    TIME = "golem.usage.duration_sec",
    CPU = "golem.usage.cpu_sec",
    STORAGE = "golem.usage.storage_gib",
    MAXMEM = "golem.usage.gib",
}

export class ComBase extends Spec {
    scheme = Property.String("golem.com.scheme");
    priceModel = Property.String("golem.com.pricing.model");
}

export class ComLinear extends ComBase {
    priceModel = new Property("golem.com.pricing.model", "linear");
    coeffs = Property.NumberArray("golem.com.pricing.model.linear.coeffs");
    usages = Property.StringArray("golem.com.usage.vector");
}

export function unpackPrices(decoded: Data<ComLinear>) {
    const fixedPrice = decoded.coeffs[0];
    const priceFor = Object.fromEntries(
        decoded.usages.map((usage, idx) => [usage, decoded.coeffs[idx + 1]]),
    );
    return { fixedPrice, priceFor };
}
