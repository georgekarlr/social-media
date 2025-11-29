import React, { useEffect, useState } from 'react';
import { Search, Package } from 'lucide-react';
import { ProductsService } from '../../services/productService';
import type { Product } from '../../types/products';

interface ProductPickerProps {
  onAdd: (product: Product) => void;
}

const ProductPicker: React.FC<ProductPickerProps> = ({ onAdd }) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await ProductsService.getProducts({ p_search_term: search, p_limit: 50 });
    if (error) setError(error);
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search products by name or SKU"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') fetchProducts(); }}
          />
        </div>
        <button
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          onClick={fetchProducts}
        >Search</button>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      {loading ? (
        <div className="text-gray-500">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-gray-100 text-gray-600"><Package size={18} /></div>
                <div>
                  <div className="font-medium text-gray-900">{p.name}</div>
                  <div className="text-xs text-gray-500">SKU: {p.sku || '-'}</div>
                  <div className="text-sm text-gray-700">Stock: {p.stock_quantity}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">${p.price.toFixed(2)}</div>
                <button
                  className="mt-2 px-3 py-1.5 rounded-md bg-gray-900 text-white hover:bg-black text-sm"
                  onClick={() => onAdd(p)}
                >Add</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPicker;
