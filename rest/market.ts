import WebClient from "./client.ts";

type PropertySet = {
    [key: string]: number | string | Array<string> | Array<number>;
};

type DemandOfferBase = {
    properties: PropertySet;
    constraints: string;
};

type Demand = DemandOfferBase & {
    demandId: string;
    requestorId: string;
    timestamp: string;
};

type Offer = DemandOfferBase & {
    offerId: string;
    providerId: string;
    timestamp: string;
};

type Proposal = DemandOfferBase & {
    proposalId: string;
    issuerId: string;
    state: ProposalState;
    timestamp: string;
};

type ProposalState = "Initial" | "Draft" | "Rejected" | "Accepted" | "Expired";

type AgreementProposal = {
    proposalId: string;
    validTo: string;
};

type Agreement = {
    agreementId: string;
    demand: Demand;
    offer: Offer;
    validTo: string;
    state: AgreementState;
    timestamp: string;
    appSessionId: string | null;
};

type AgreementState =
    | "Proposal"
    | "Pending"
    | "Cancelled"
    | "Rejected"
    | "Approved"
    | "Expired"
    | "Terminated";

type ProposalEvent = {
    eventType: "ProposalEvent";
    eventDate: string;
    proposal: Proposal;
};

type ProposalRejectedEvent = {
    eventType: "ProposalRejectedEvent";
};

const MARKET_BASE = "market-api/v1/";

export class MarketApi {
    private readonly _client: WebClient;

    constructor(client: WebClient) {
        this._client = client;
    }

    async offers(): Promise<Array<Offer>> {
        const resp = await this._client.get(`${MARKET_BASE}offers`);
        if (resp.status == 200) {
            return await resp.json();
        }

        throw new Error(`invalid response: ${resp.statusText}`);
    }
}
