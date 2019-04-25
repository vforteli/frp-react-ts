export interface IOrderModel {
    orderId: number;
    AddressName: string;
    AddressAttention: string;
    AddressReferencePerson: string;
    AddressReference: string;
    AddressStreet: string;
    AddressZip: string;
    AddressState: string;
    AddressCity: string;
    AddressCountry: string;
    OrderID: number;
    CurrencyId: string;
    Locale: string;
    Vat: number;
    TermofPayment: number;
    Notes: string;
    Number: number;
    NumberPrefix: number;
    // Orderlines: undefined,
}

export interface IOrderListModel {
    invoice_id: number;
    date_invoiced: string;
    date_created: string;
    TotalsumExcludingVAT: number;
    hold: boolean;
    status: number;
    address_name: string;
    CustomerType: string;
    CurrencyName: string;
    // Orderlines: undefined,
}
