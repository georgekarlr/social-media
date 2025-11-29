// types/sales.ts

// --- Generic Response Wrapper ---
export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}

// --- Enum Types ---
// Adjust based on your actual Postgres enum 'ins_sale_type'
// New canonical values requested by backend: full_payment, installment_with_down, pure_installment
export type SaleType = 'full_payment' | 'installment_with_down' | 'pure_installment';

// --- JSON Input Structures ---

/** Structure for p_items JSONB array */
export interface OrderItemInput {
    product_id: number;
    quantity: number;
    unit_price: number;
    total?: number; // Optional: SQL can calculate this, but good to pass if frontend calculated it
}

/** Structure for p_payment JSONB object */
export interface PaymentDetailsInput {
    amount: number;      // The actual amount being paid right now (Down Payment or Full)
    tendered: number;    // Cash handed by customer
    method: string;      // 'cash', 'card', 'transfer', etc.
    change?: number;     // Optional: (tendered - amount)
}

/** Structure for p_custom_schedule JSONB array */
export interface CustomScheduleItemInput {
    due_date: string; // YYYY-MM-DD
    amount: number;
}

// --- Main Parameter Interface ---

export interface ProcessSaleParams {
    p_account_id: number;
    p_customer_id: number;
    p_sale_type: SaleType;
    p_items: OrderItemInput[];
    p_payment: PaymentDetailsInput;

    // Optional Installment configurations
    p_installment_plan_id?: number | null;
    p_custom_schedule?: CustomScheduleItemInput[] | null;

    // Optional override for sale date
    p_created_at?: string; // ISO 8601 string
}

// --- Return Value Interface ---

export interface ProcessSaleResult {
    new_order_id: number;
    status: string;
}