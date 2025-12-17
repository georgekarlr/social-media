import React from 'react';
import { Property } from '../../types/properties';
import { Tenant } from '../../types/tenants';
import { FrequencyType } from '../../types/leases';

type Props = {
  createdLeaseId: number | null;
  property: Property | null;
  tenant: Tenant | null;
  startDate: string;
  endDate: string;
  rentAmount: string;
  frequency: FrequencyType;
};

const LeaseSubmissionStep: React.FC<Props> = ({
  createdLeaseId,
  property,
  tenant,
  startDate,
  endDate,
  rentAmount,
  frequency,
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Created</h2>
      <p className="text-gray-500 mb-4">Your lease was created successfully.</p>

      <div className="p-4 border rounded-lg bg-green-50 border-green-200 text-green-800">
        {createdLeaseId ? (
          <div className="font-medium">Lease created successfully! ID: {createdLeaseId}</div>
        ) : (
          <div className="font-medium">Lease creation completed.</div>
        )}
      </div>
    </div>
  );
};

export default LeaseSubmissionStep;
