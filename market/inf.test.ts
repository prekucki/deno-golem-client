import { Spec } from "./base.ts";
import { InfVm } from "./inf.ts";

Deno.test("encode vm", () => {
    console.log(new InfVm() instanceof Spec);
    const output = InfVm.encode({
        runtime: "vm",
        cores: 5,
        threads: 5,
        mem: 0.5,
    });
    console.table(output);
    output["golem.inf.cpu.cores"] += 5;
    delete output["golem.inf.storage.gib"];
    console.table(output);
    console.table(
        InfVm.encode({ runtime: "vm", cores: 0, threads: 0, mem: 0 }),
    );
    console.log("rt", InfVm.key("runtime"));
});
