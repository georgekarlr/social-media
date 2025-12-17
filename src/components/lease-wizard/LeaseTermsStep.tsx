import React from 'react';
import { Property } from '../../types/properties';
import { Tenant } from '../../types/tenants';
import { FrequencyType } from '../../types/leases';

type FrequencyOption = { label: string; value: FrequencyType };

type Props = {
  property: Property | null;
  tenant: Tenant | null;
  startDate: string;
  endDate: string;
  paymentCount: string;
  rentAmount: string;
  frequency: FrequencyType;
  frequencyOptions: FrequencyOption[];
  onChange: {
    setStartDate: (v: string) => void;
    setEndDate: (v: string) => void;
    setPaymentCount: (v: string) => void;
    setRentAmount: (v: string) => void;
    setFrequency: (v: FrequencyType) => void;
  };
};

const LeaseTermsStep: React.FC<Props> = ({
  property,
  tenant,
  startDate,
  endDate,
  paymentCount,
  rentAmount,
  frequency,
  frequencyOptions,
  onChange,
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Step 3: Lease Terms</h2>
      <p className="text-gray-500 mb-4">Confirm details and set the lease terms.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="text-sm text-gray-500">Property</div>
          <div className="p-3 border rounded-lg">
            {property ? (
              <>
                <div className="font-medium text-gray-900">{property.name}</div>
                <div className="text-sm text-gray-600">{property.address}</div>
              </>
            ) : (
              <div className="text-gray-500 text-sm">Not selected</div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-500">Tenant</div>
          <div className="p-3 border rounded-lg">
            {tenant ? (
              <>
                <div className="font-medium text-gray-900">{tenant.full_name}</div>
                {tenant.email && <div className="text-sm text-gray-600">{tenant.email}</div>}
              </>
            ) : (
              <div className="text-gray-500 text-sm">Not selected</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={startDate}
            onChange={(e) => onChange.setStartDate(e.target.value)}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
            <span className="text-xs text-gray-400">Auto-calculated</span>
          </div>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            value={endDate}
            onChange={(e) => onChange.setEndDate(e.target.value)}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Payments</label>
          <input
            type="number"
            min="1"
            step="1"
            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 12"
            value={paymentCount}
            onChange={(e) => onChange.setPaymentCount(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rent Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
            value={rentAmount}
            onChange={(e) => onChange.setRentAmount(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Billing Frequency</label>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={frequency}
            onChange={(e) => onChange.setFrequency(e.target.value as FrequencyType)}
          >
            {frequencyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default LeaseTermsStep;
