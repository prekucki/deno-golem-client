// deno-lint-ignore-file ban-unused-ignore no-explicit-any

export type PropValue = number | boolean | string | number[] | string[];
export type PropSet = { [key: string]: PropValue };

export class Property<V extends PropValue, K extends string> {
    constructor(readonly key: K, readonly v: V | undefined = undefined) {
    }

    static String<K extends string>(key: K) {
        return new Property<string, K>(key);
    }

    static StringArray<K extends string>(key: K) {
        return new Property<string[], K>(key);
    }

    static Number<K extends string>(key: K) {
        return new Property<number, K>(key);
    }

    static NumberArray<K extends string>(key: K) {
        return new Property<number[], K>(key);
    }

    static Bool<K extends string>(key: K) {
        return new Property<number, K>(key);
    }
}

export class Spec {
    static encode<T extends typeof Spec>(
        this: T,
        v: Data<InstanceType<T>>,
    ): OutputData<InstanceType<T>> {
        return encode(this, v) as any;
    }

    protected static _instance<T extends typeof Spec>(this: T) {
        if ("_created_instance" in this) {
            return (this as any)["_created_instance"];
        }
        const me = new this();
        (this as any)["_created_instance"] = me;
        return me;
    }

    static key<T extends typeof Spec>(
        this: T,
        name: keyof InstanceType<T>,
    ): string {
        const spec: any = this._instance();
        const it = spec[name];
        if (it instanceof Property) {
            return it.key;
        }
        return "";
    }
}

type PropType<T> = T extends Property<infer R, string> ? R : never;
type PropKey<T> = T extends Property<PropValue, infer K> ? K : never;
export type Data<T> = {
    [key in keyof T]: PropType<T[key]>;
};
type OutputData<T> = {
    [key in keyof T as PropKey<T[key]>]: PropType<T[key]>;
};

/**
 * Encodes json to property set.
 *
 * @param t mapping spec.
 * @param spec data to be mapped.
 */
function encode<T extends Spec>(
    t: { new (): T },
    spec: Data<T>,
): OutputData<T> {
    const rv: any = {};
    const encoder = (t as any)._instance();
    for (const key of Object.keys(encoder)) {
        if (key in spec && key in encoder) {
            const outputKey = (encoder as any)[key].key;
            rv[outputKey] = (spec as any)[key];
        }
    }
    return rv as OutputData<T>;
}

export class NodeInfo extends Spec {
    nodeName? = Property.String("golem.node.id.name");
    subnet? = Property.String("golem.node.debug.subnet");
}

export class Activity extends Spec {
    expiration? = Property.Number("golem.srv.comp.expiration");
    multiActivity? = Property.Bool("golem.srv.caps.multi-activity");
}
