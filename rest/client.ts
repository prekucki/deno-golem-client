type NodeInfo = {
    identity: string;
    name?: string;
    role: "manager";
};

export default class WebClient {
    private _rpcUrl: string;
    private _appKey: string;

    constructor(appKey: string, rpcUrl: string) {
        this._appKey = appKey;
        this._rpcUrl = rpcUrl;
    }

    async get(path: string): Promise<Response> {
        const url = `${this._rpcUrl}${path}`;
        return await fetch(url, {
            headers: {
                authorization: `Bearer ${this._appKey}`,
            },
        });
    }

    async post(path: string, body: any): Promise<Response> {
        const url = `${this._rpcUrl}${path}`;
        return await fetch(url, {
            method: "POST",
            headers: {
                authorization: `Bearer ${this._appKey}`,
                ["content-type"]: "application/json",
            },
            body: JSON.stringify(body),
        });
    }

    async delete(path: string): Promise<Response> {
        const url = `${this._rpcUrl}${path}`;
        return await fetch(url, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${this._appKey}`,
            },
        });
    }

    public async identity(): Promise<NodeInfo> {
        const r = await this.get("me");
        return await r.json() as NodeInfo;
    }
}
