import React, { useMemo, useState } from 'react';
import type { Customer } from '../../types/customer';
import type { CustomScheduleItemInput, PaymentDetailsInput, ProcessSaleResult, SaleType } from '../../types/sales';
import { SalesService } from '../../services/salesService';
import type { CartItem } from '../../pages/POSWizard';

interface PaymentProcessorProps {
  accountId: number | null;
  customer: Customer | null;
  cart: CartItem[];
  saleType: SaleType;
  downPayment: number;
  schedule: CustomScheduleItemInput[];
  total: number;
  onResult: (res: ProcessSaleResult | null) => void;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  accountId,
  customer,
  cart,
  saleType,
  downPayment,
  schedule,
  total,
  onResult,
}) => {
  const [deduct, setDeduct] = useState<number>(0);
  const netTotalForFull = useMemo(() => Math.max(total - (deduct || 0), 0), [total, deduct]);
  const amountNow = useMemo(() => {
    if (saleType === 'full_payment') return netTotalForFull;
    if (saleType === 'installment_with_down') return (downPayment || 0);
    // pure_installment
    return 0;
  }, [saleType, netTotalForFull, downPayment]);
  const [method, setMethod] = useState<string>('cash');
  const [tendered, setTendered] = useState<number>(amountNow);
  const change = Math.max(0, Math.round((tendered - amountNow) * 100) / 100);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canProcess = useMemo(() => {
    if (!accountId || !customer) return false;
    if (cart.length === 0) return false;
    if (amountNow > 0 && tendered < amountNow) return false;
    if (saleType === 'installment_with_down' || saleType === 'pure_installment') {
      const remaining = saleType === 'pure_installment' ? total : Math.max(total - (downPayment || 0), 0);
      const sum = schedule.reduce((s, it) => s + it.amount, 0);
      if (Math.round(sum * 100) !== Math.round(remaining * 100)) return false;
    }
    return true;
  }, [accountId, customer, cart.length, amountNow, tendered, saleType, schedule, total, downPayment]);

  // Keep tendered synced with amount due for convenience when it changes
  React.useEffect(() => {
    setTendered(amountNow);
  }, [amountNow, saleType]);

  const handleProcess = async () => {
    setError(null);
    if (!accountId || !customer) {
      setError('Missing account or customer context.');
      return;
    }
    setLoading(true);
    const p_items = cart.map((ci) => ({
      product_id: ci.product.id,
      quantity: ci.quantity,
      unit_price: ci.product.price,
      total: Math.round(ci.product.price * ci.quantity * 100) / 100,
    }));

    const payment: PaymentDetailsInput = {
      amount: Math.round(amountNow * 100) / 100,
      tendered: Math.round(tendered * 100) / 100,
      method,
      change,
      deduct: saleType === 'full_payment' ? Math.round((deduct || 0) * 100) / 100 : undefined,
      net_amount: saleType === 'full_payment' ? Math.round(netTotalForFull * 100) / 100 : undefined,
    };

    const { data, error } = await SalesService.processSale({
      p_account_id: accountId,
      p_customer_id: customer.id,
      p_sale_type: saleType,
      p_items,
      p_payment: payment,
      p_installment_plan_id: null,
      p_custom_schedule: (saleType === 'installment_with_down' || saleType === 'pure_installment') ? schedule : null,
      p_created_at: new Date().toISOString(),
    });

    setLoading(false);
    if (error) {
      setError(error);
      onResult(null);
    } else {
      onResult(data);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Sale Type</span>
            <span className="text-sm font-medium text-gray-900">
              {saleType === 'full_payment' && 'Full Payment'}
              {saleType === 'installment_with_down' && 'Installment + Down'}
              {saleType === 'pure_installment' && 'Pure Installment'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Cart Total</span>
            <span className="text-sm font-semibold">${total.toFixed(2)}</span>
          </div>
          {saleType === 'full_payment' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Deduct</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                  value={deduct}
                  onChange={(e) => setDeduct(Math.max(0, parseFloat(e.target.value || '0')))}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Net Due</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50"
                  value={`$${netTotalForFull.toFixed(2)}`}
                  readOnly
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Amount Due Now</span>
            <span className="text-sm font-semibold">${amountNow.toFixed(2)}</span>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Payment Method</label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Tendered</label>
              <input
                type="number"
                min={0}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
                value={tendered}
                onChange={(e) => setTendered(parseFloat(e.target.value || '0'))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Change</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50"
                value={`$${change.toFixed(2)}`}
                readOnly
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            className="w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={!canProcess || loading}
            onClick={handleProcess}
          >
            {loading ? 'Processing...' : 'Process Payment'}
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Customer</span><span className="font-medium">{customer?.full_name ?? '-'}</span></div>
          <div className="flex justify-between"><span>Items</span><span className="font-medium">{cart.length}</span></div>
          {saleType === 'installment_with_down' && (
            <div className="flex justify-between"><span>Down Payment</span><span className="font-medium">${(downPayment || 0).toFixed(2)}</span></div>
          )}
          {(saleType === 'installment_with_down' || saleType === 'pure_installment') && (
            <div className="flex justify-between"><span>Installments</span><span className="font-medium">{schedule.length}</span></div>
          )}
        </div>
        <div className="mt-3 border-t pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessor;
