import React from 'react';
import { Property } from '../../types/properties';
import { Loader2 } from 'lucide-react';

type Props = {
  properties: Property[];
  loading: boolean;
  selectedId: number | null;
  onSelect: (id: number) => void;
};

const SelectPropertyStep: React.FC<Props> = ({ properties, loading, selectedId, onSelect }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Step 1: Select Property</h2>
      <p className="text-gray-500 mb-4">Choose a property for this lease.</p>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="animate-spin" size={16} /> Loading properties...
        </div>
      ) : properties.length === 0 ? (
        <div className="p-3 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200">
          No properties found. Please add a property first.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {properties.map((p) => {
            const isDisabled = p.status === 'occupied';
            return (
              <button
                key={p.id}
                type="button"
                aria-disabled={isDisabled}
                disabled={isDisabled}
                onClick={() => {
                  if (!isDisabled) onSelect(p.id);
                }}
                className={`text-left p-4 rounded-lg border transition-colors ${
                  isDisabled
                    ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                    : selectedId === p.id
                    ? 'border-blue-600 bg-blue-50 cursor-pointer'
                    : 'border-gray-200 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">{p.name}</div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      p.status === 'vacant'
                        ? 'text-green-700 bg-green-50 border-green-200'
                        : 'text-gray-700 bg-gray-50 border-gray-200'
                    }`}
                  >
                    {String(p.status)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">{p.address}</div>
                {p.city && (
                  <div className="text-xs text-gray-500">
                    {p.city}
                    {p.state ? `, ${p.state}` : ''} {p.zip_code || ''}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-2">Market rent: ${p.market_rent}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SelectPropertyStep;
