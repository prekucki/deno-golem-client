import { PropSet } from "./base.ts";

export class DemandBuilder {
    private _props: PropSet = {};
    private _constraints: string[] = [];

    get properties(): PropSet {
        return this._props;
    }

    get constraints(): string {
        const constraints = this._constraints;
        switch (constraints.length) {
            case 0:
                return "(&)";
            case 1:
                return constraints[0];
            default:
                return `(&${constraints.join("\n\t")})`;
        }
    }

    ensure(clause: string) {
        this._constraints.push(clause);
    }

    add<T extends PropSet>(props: T) {
        this._props = { ...this._props, ...props };
    }
}
