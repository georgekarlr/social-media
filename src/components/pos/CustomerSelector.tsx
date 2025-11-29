import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import type { Customer } from '../../types/customer';
import { CustomersService } from '../../services/customerService';

interface CustomerSelectorProps {
  selected: Customer | null;
  onSelect: (c: Customer) => void;
}

const CustomerSelector: React.FC<CustomerSelectorProps> = ({ selected, onSelect }) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await CustomersService.getCustomers({ p_search_term: search, p_limit: 24 });
    if (error) setError(error);
    else setCustomers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedId = selected?.id ?? null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search customers by name, phone, or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') fetchCustomers(); }}
          />
        </div>
        <button
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          onClick={fetchCustomers}
        >
          Search
        </button>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <div className="text-gray-500">Loading customers...</div>}
        {!loading && customers.map((c) => (
          <div
            key={c.id}
            className={[
              'border rounded-lg p-4 flex flex-col gap-1 cursor-pointer transition-colors',
              selectedId === c.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'
            ].join(' ')}
            role="button"
            tabIndex={0}
            aria-pressed={selectedId === c.id}
            onClick={() => onSelect(c)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(c); } }}
          >
            <div className="font-medium text-gray-900">{c.full_name}</div>
            {c.phone && <div className="text-sm text-gray-600">{c.phone}</div>}
            {c.email && <div className="text-sm text-gray-600">{c.email}</div>}
            {selectedId === c.id && (
              <div className="mt-2 text-xs inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 border border-green-200 w-fit">Selected</div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-800">
          Selected: <span className="font-medium">{selected.full_name}</span>
        </div>
      )}
    </div>
  );
};

export default CustomerSelector;
