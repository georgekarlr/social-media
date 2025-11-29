import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import type { Customer, UpdateCustomerParams, CustomerFormInput } from '../types/customer';
import {CustomersService} from "../services/customerService.ts";
import CustomerTable from "../components/customer/CustomerTable.tsx";
import Modal from "../components/ui/Modal.tsx";
import {CustomerForm} from "../components/customer/CustomerForm.tsx";
import {useAuth} from "../contexts/AuthContext.tsx";

const CustomerPage: React.FC = () => {
    // ... (Auth and State logic remains exactly the same as previous step) ...
    // ... For brevity, I'm skipping the duplicated logic lines here ...
    // ... Assume `useAuth`, `useState`, `fetchCustomers` etc. are here ...

    const { persona } = useAuth();
    const accountId = persona?.id ?? null;
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await CustomersService.getCustomers({
            p_search_term: searchTerm,
            p_limit: 50
        });
        if (error) setErrorMsg(error);
        else setCustomers(data);
        setIsLoading(false);
    }, [searchTerm, accountId]);

    useEffect(() => {
        const timer = setTimeout(fetchCustomers, 300);
        return () => clearTimeout(timer);
    }, [fetchCustomers]);

    // ... (Handlers: handleCreateOrUpdate, confirmDelete, etc. remain the same) ...
    const handleCreateOrUpdate = async (formData: CustomerFormInput | UpdateCustomerParams) => {
        // ... same logic as previous step ...
        setIsLoading(true);
        let result;
        if ('p_customer_id' in formData) {
            result = await CustomersService.updateCustomer(formData as UpdateCustomerParams);
        } else {
            if (!accountId) { setErrorMsg("Not logged in"); setIsLoading(false); return; }
            result = await CustomersService.createCustomer({ ...formData, p_account_id: accountId });
        }
        if (result.error) setErrorMsg(result.error);
        else { await fetchCustomers(); closeForm(); }
        setIsLoading(false);
    };

    const confirmDelete = async () => {
        if (!customerToDelete) return;
        setIsLoading(true);
        const { error } = await CustomersService.deleteCustomer(customerToDelete.id);
        if (error) setErrorMsg(error);
        else { await fetchCustomers(); setCustomerToDelete(null); }
        setIsLoading(false);
    };

    const openCreate = () => { setEditingCustomer(null); setIsFormOpen(true); setErrorMsg(null); };
    const openEdit = (c: Customer) => { setEditingCustomer(c); setIsFormOpen(true); setErrorMsg(null); };
    const closeForm = () => { setIsFormOpen(false); setEditingCustomer(null); setErrorMsg(null); };


    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 lg:p-12 font-sans text-gray-800">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header: Stacked on mobile, Row on desktop */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Customers</h1>
                    </div>

                    <button
                        onClick={openCreate}
                        disabled={!accountId}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 disabled:bg-gray-400 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all font-medium active:scale-95"
                    >
                        <Plus size={18} />
                        Add Customer
                    </button>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                        <p className="text-sm">{errorMsg}</p>
                    </div>
                )}

                {/* Toolbar: Full width search on mobile */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Responsive Table / Card Grid */}
                <CustomerTable
                    customers={customers}
                    isLoading={isLoading && !isFormOpen && !customerToDelete}
                    onEdit={openEdit}
                    onDeleteClick={(c) => setCustomerToDelete(c)}
                />

                {/* Modals remain mostly the same but ensure they fit mobile screens */}
                <Modal
                    isOpen={isFormOpen}
                    onClose={closeForm}
                    title={editingCustomer ? "Update Customer" : "New Customer"}
                >
                    <CustomerForm
                        initialData={editingCustomer}
                        onSave={handleCreateOrUpdate}
                        onCancel={closeForm}
                        isSubmitting={isLoading}
                    />
                </Modal>

                <Modal
                    isOpen={!!customerToDelete}
                    onClose={() => setCustomerToDelete(null)}
                    title="Confirm Deletion"
                >
                    <div className="space-y-4">
                        <div className="bg-red-50 p-4 rounded-lg flex gap-3 items-start">
                            <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-red-900">Are you sure?</h4>
                                <p className="text-sm text-red-800 mt-1">
                                    You are about to delete <strong>{customerToDelete?.full_name}</strong>.
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                            <button
                                onClick={() => setCustomerToDelete(null)}
                                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default CustomerPage;