import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertiesService } from '../services/propertiesService';
import { TenantsService } from '../services/tenantsService';
import { LeasesService } from '../services/leasesService';
import type { Property } from '../types/properties';
import type { Tenant } from '../types/tenants';
import type { CreateLeaseParams, FrequencyType } from '../types/leases';
import { Calendar, CheckCircle2, Home, Loader2, User } from 'lucide-react';
import { SelectPropertyStep, SelectTenantStep, LeaseTermsStep, LeaseSubmissionStep } from '../components/lease-wizard';

type WizardStep = 1 | 2 | 3 | 4;

const frequencyOptions: { label: string; value: FrequencyType }[] = [
  { label: 'Minute', value: 'minute' },
  { label: 'Hour', value: 'hour' },
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
];

const LeaseWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>(1);

  // Data loading
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loadingProps, setLoadingProps] = useState(false);
  const [loadingTenants, setLoadingTenants] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Selections
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);

  // Terms
  const [startDate, setStartDate] = useState(''); // datetime-local string
  const [endDate, setEndDate] = useState('');     // datetime-local string
  const [paymentCount, setPaymentCount] = useState<string>('');
  const [rentAmount, setRentAmount] = useState('');
  const [frequency, setFrequency] = useState<FrequencyType>('month');

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdLeaseId, setCreatedLeaseId] = useState<number | null>(null);

  // Reset wizard selections/inputs (but not createdLeaseId)
  const resetForm = () => {
    setSelectedPropertyId(null);
    setSelectedTenantId(null);
    setStartDate('');
    setEndDate('');
    setPaymentCount('');
    setRentAmount('');
    setFrequency('month');
  };

  useEffect(() => {
    // Load properties and tenants up-front
    const load = async () => {
      setLoadError(null);
      setLoadingProps(true);
      const propsRes = await PropertiesService.getProperties();
      setLoadingProps(false);
      if (propsRes.error) {
        setLoadError(propsRes.error);
      } else {
        setProperties(propsRes.data || []);
      }

      setLoadingTenants(true);
      const tenantsRes = await TenantsService.getTenants();
      setLoadingTenants(false);
      if (tenantsRes.error) {
        setLoadError((prev) => prev ?? tenantsRes.error);
      } else {
        setTenants(tenantsRes.data || []);
      }
    };
    load();
  }, []);

  const selectedProperty = useMemo(
    () => properties.find((p) => p.id === selectedPropertyId) || null,
    [properties, selectedPropertyId]
  );
  const selectedTenant = useMemo(
    () => tenants.find((t) => t.id === selectedTenantId) || null,
    [tenants, selectedTenantId]
  );

  const canGoNext = useMemo(() => {
    if (step === 1) return selectedPropertyId !== null;
    if (step === 2) return selectedTenantId !== null;
    if (step === 3) {
      const amount = Number(rentAmount);
      const count = Number(paymentCount);
      const isInt = Number.isInteger(count) && count >= 1;
      return (
        !!startDate &&
        !!endDate &&
        !Number.isNaN(amount) &&
        amount > 0 &&
        !!frequency &&
        isInt
      );
    }
    return true;
  }, [step, selectedPropertyId, selectedTenantId, startDate, endDate, rentAmount, frequency, paymentCount]);

  // Utilities for date arithmetic
  function toDate(d: string): Date | null {
    if (!d) return null;
    // d is expected to be a datetime-local string (no timezone). Treat as local.
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  function toDatetimeLocal(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  function addMonths(date: Date, months: number): Date {
    const d = new Date(date.getTime());
    const day = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + months);
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, lastDay));
    return d;
  }

  function addYears(date: Date, years: number): Date {
    return addMonths(date, years * 12);
  }

  function addDays(date: Date, days: number): Date {
    const d = new Date(date.getTime());
    d.setDate(d.getDate() + days);
    return d;
  }

  function addMinutes(date: Date, minutes: number): Date {
    const d = new Date(date.getTime());
    d.setMinutes(d.getMinutes() + minutes);
    return d;
  }

  function addHours(date: Date, hours: number): Date {
    return addMinutes(date, hours * 60);
  }

  function addWeeks(date: Date, weeks: number): Date {
    return addDays(date, weeks * 7);
  }

  function calculateEndDate(start: string, freq: FrequencyType, countStr: string): string {
    const startDt = toDate(start);
    const count = Number(countStr);
    if (!startDt || !Number.isFinite(count) || count < 1) return '';

    let endExclusive: Date;
    switch (freq) {
      case 'minute':
        endExclusive = addMinutes(startDt, count);
        break;
      case 'hour':
        endExclusive = addHours(startDt, count);
        break;
      case 'day':
        endExclusive = addDays(startDt, count);
        break;
      case 'week':
        endExclusive = addWeeks(startDt, count);
        break;
      case 'month':
        endExclusive = addMonths(startDt, count);
        break;
      case 'year':
        endExclusive = addYears(startDt, count);
        break;
      default:
        endExclusive = addMonths(startDt, count);
    }
    // Inclusive end is one millisecond before the next period starts
    const inclusive = new Date(endExclusive.getTime() - 1);
    return toDatetimeLocal(inclusive);
  }

  // Auto-calculate end date whenever drivers change
  useEffect(() => {
    const calculated = calculateEndDate(startDate, frequency, paymentCount);
    setEndDate(calculated);
  }, [startDate, frequency, paymentCount]);

  const handleSubmit = async () => {
    if (!selectedPropertyId || !selectedTenantId) return;

    setSubmitting(true);
    setSubmitError(null);
    // Convert datetime-local (local time) to ISO string for backend
    const startIso = startDate ? new Date(startDate).toISOString() : '';
    const endIso = endDate ? new Date(endDate).toISOString() : '';
    const params: CreateLeaseParams = {
      p_property_id: selectedPropertyId,
      p_tenant_id: selectedTenantId,
      p_start_date: startIso,
      p_end_date: endIso,
      p_rent_amount: Number(rentAmount),
      p_frequency: frequency,
      p_created_at: new Date().toISOString(),
    };

    const res = await LeasesService.createLease(params);
    setSubmitting(false);
    if (res.error) {
      setSubmitError(res.error);
      return;
    }
    setCreatedLeaseId(res.data || null);
    // After successful creation: advance to final step and reset form data
    // so the wizard is ready for a new lease.
    resetForm();
    setStep(4);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Lease Wizard</h1>
        <p className="text-gray-500">Follow the steps to create a new lease.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-4 mb-6 text-sm">
        <StepBadge active={step === 1} completed={step > 1} icon={Home} label="Property" />
        <div className="flex-1 h-px bg-gray-200" />
        <StepBadge active={step === 2} completed={step > 2} icon={User} label="Tenant" />
        <div className="flex-1 h-px bg-gray-200" />
        <StepBadge active={step === 3} completed={step > 3} icon={Calendar} label="Terms" />
        <div className="flex-1 h-px bg-gray-200" />
        <StepBadge active={step === 4} completed={false} icon={CheckCircle2} label="Created" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        {loadError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
            {loadError}
          </div>
        )}

        {step === 1 && (
          <SelectPropertyStep
            properties={properties}
            loading={loadingProps}
            selectedId={selectedPropertyId}
            onSelect={setSelectedPropertyId}
          />
        )}

        {step === 2 && (
          <SelectTenantStep
            tenants={tenants}
            loading={loadingTenants}
            selectedId={selectedTenantId}
            onSelect={setSelectedTenantId}
          />
        )}

        {step === 3 && (
          <LeaseTermsStep
            property={selectedProperty}
            tenant={selectedTenant}
            startDate={startDate}
            endDate={endDate}
            paymentCount={paymentCount}
            rentAmount={rentAmount}
            frequency={frequency}
            frequencyOptions={frequencyOptions}
            onChange={{ setStartDate, setEndDate, setPaymentCount, setRentAmount, setFrequency }}
          />
        )}

        {step === 4 && (
          <LeaseSubmissionStep
            createdLeaseId={createdLeaseId}
            property={selectedProperty}
            tenant={selectedTenant}
            startDate={startDate}
            endDate={endDate}
            rentAmount={rentAmount}
            frequency={frequency}
          />
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          {/* Hide Back on final step */}
          {step < 4 ? (
            <button
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setStep((s) => (s > 1 ? ((s - 1) as WizardStep) : s))}
              disabled={step === 1 || submitting}
              type="button"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 && (
            <button
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              onClick={() => {
                if (step === 3) {
                  handleSubmit();
                } else {
                  setStep((s) => ((s + 1) as WizardStep));
                }
              }}
              disabled={!canGoNext || submitting}
              type="button"
            >
              {submitting && step === 3 ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Submitting...
                </>
              ) : step === 3 ? (
                'Create Lease'
              ) : (
                'Next'
              )}
            </button>
          )}

          {step === 4 && (
            <div className="flex items-center gap-2">
              <button
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                type="button"
                onClick={() => {
                  // Start a new lease creation flow
                  setCreatedLeaseId(null);
                  resetForm();
                  setStep(1);
                }}
              >
                Create lease again
              </button>
              <button
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                type="button"
                onClick={() => navigate('/leases')}
              >
                Go to listing page
              </button>
            </div>
          )}
        </div>

        {submitError && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
            {submitError}
          </div>
        )}
      </div>
    </div>
  );
};

function StepBadge({
  active,
  completed,
  icon: Icon,
  label,
}: {
  active: boolean;
  completed: boolean;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${active ? 'text-blue-600' : 'text-gray-500'}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center border ${
          active ? 'border-blue-600 bg-blue-50' : completed ? 'border-green-600 bg-green-50' : 'border-gray-300 bg-white'
        }`}
      >
        <Icon size={16} className={completed ? 'text-green-600' : active ? 'text-blue-600' : 'text-gray-500'} />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

// extracted Step* components moved to src/components/lease-wizard

export default LeaseWizard;
