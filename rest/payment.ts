import WebClient from "./client.ts";

const PAYMENT_BASE = "payment-api/v1/";

export class PaymentApi {
    private readonly _client: WebClient;

    constructor(client: WebClient) {
        this._client = client;
    }

    public async getDebitNotes(
        query: { afterTimestamp?: Date | string; maxItems?: number } = {},
    ): Promise<DebitNote[]> {
        const resp = await this._client.get(`${PAYMENT_BASE}debitNotes`);
        if (resp.status == 200) {
            return await resp.json() as DebitNote[];
        }
    }
}

type DebitNote = {
    debitNoteId: string;
    issuerId: string;
    recipientId: string;
    payeeAddr: string;
    payerAddr: string;
    paymentPlatform: string;
    previousDebitNoteId?: string | null;
    // date-time
    timestamp: string;
    agreementId: string;
    activityId: string;
    totalAmountDue: string | number;
    usageCounterVector?: object[] | null;
    paymentDueDate?: string | null;
    status: DocumentStatus;
};

type Invoice = {
    invoiceId: string;
    issuerId: string;
    recipientId: string;
    payeeAddr: string;
    payerAddr: string;
    paymentPlatform: string;
    // date-time
    timestamp: string;
    agreementId: string;
    activityIds: string[];
    amount: string | number;
    paymentDueDate?: string | null;
    status: DocumentStatus;
};

type DocumentStatus =
    | "ISSUED"
    | "RECEIVED"
    | "ACCEPTED"
    | "REJECTED"
    | "FAILED"
    | "SETTLED"
    | "CANCELLED";
