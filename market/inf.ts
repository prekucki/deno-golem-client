import { Property, Spec } from "./base.ts";

export class InfBase extends Spec {
    cores = Property.Number("golem.inf.cpu.cores");
    threads = Property.Number("golem.inf.cpu.threads");
    runtime = Property.String("golem.runtime.name");
    mem = Property.Number("golem.inf.mem.gib");
    storage? = Property.Number("golem.inf.storage.gib");
    capabilities? = new Property<string[], "golem.runtime.capabilities">(
        "golem.runtime.capabilities",
    );
}

export class InfVm extends InfBase {
    runtime = new Property("golem.runtime.name", "vm");
}
