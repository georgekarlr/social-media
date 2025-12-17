import React from 'react';
import { Tenant } from '../../types/tenants';
import { Loader2 } from 'lucide-react';

type Props = {
  tenants: Tenant[];
  loading: boolean;
  selectedId: number | null;
  onSelect: (id: number) => void;
};

const SelectTenantStep: React.FC<Props> = ({ tenants, loading, selectedId, onSelect }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Step 2: Select Tenant</h2>
      <p className="text-gray-500 mb-4">Choose the tenant who will sign this lease.</p>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="animate-spin" size={16} /> Loading tenants...
        </div>
      ) : tenants.length === 0 ? (
        <div className="p-3 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200">
          No tenants found. Please add a tenant first.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tenants.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={`text-left p-4 rounded-lg border transition-colors ${
                selectedId === t.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-gray-900">{t.full_name}</div>
              {t.email && <div className="text-sm text-gray-600 mt-1">{t.email}</div>}
              {t.phone && <div className="text-xs text-gray-500">{t.phone}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectTenantStep;
