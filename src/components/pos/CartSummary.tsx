import React from 'react';
import type { CartItem } from '../../pages/POSWizard';

interface CartSummaryProps {
  cart: CartItem[];
  onChangeQty: (productId: number, qty: number) => void;
  onRemove: (productId: number) => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ cart, onChangeQty, onRemove }) => {
  const subtotal = cart.reduce((s, ci) => s + ci.product.price * ci.quantity, 0);

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Cart</h3>
      {cart.length === 0 ? (
        <div className="text-sm text-gray-500">No items added yet.</div>
      ) : (
        <div className="space-y-3">
          {cart.map((ci) => (
            <div key={ci.product.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{ci.product.name}</div>
                <div className="text-xs text-gray-500">${ci.product.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  className="w-16 px-2 py-1 border border-gray-200 rounded-md"
                  value={ci.quantity}
                  onChange={(e) => onChangeQty(ci.product.id, parseInt(e.target.value || '1', 10))}
                />
                <div className="w-20 text-right text-sm font-medium">${(ci.product.price * ci.quantity).toFixed(2)}</div>
                <button
                  className="px-2 py-1 text-xs rounded-md bg-red-50 text-red-700 hover:bg-red-100"
                  onClick={() => onRemove(ci.product.id)}
                >Remove</button>
              </div>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSummary;
