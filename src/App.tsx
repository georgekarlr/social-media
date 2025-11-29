import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PersonaProtectedRoute from './components/PersonaProtectedRoute'
import Layout from './components/layout/Layout'
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import PlaceholderPage from './pages/PlaceholderPage'
import PersonaManagement from './pages/PersonaManagement'
import CustomerPage from "./pages/CustomerPage.tsx";
import {
    BarChart3,
    FileText,
    Mail,
    Calendar,
    Settings,
    ShoppingCart,
    TrendingUp,
    ClipboardList,
    CheckCircle2,
    CalendarClock,
    AlertTriangle,
    History,
    Receipt,
    RotateCcw
} from 'lucide-react'
import ProductsManager from "./pages/ProductsManager.tsx";
import POSWizard from './pages/POSWizard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/signup" element={<SignupForm />} />

                    {/* Protected routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <Dashboard />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <Profile />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/analytics" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PlaceholderPage
                                        title="Analytics"
                                        description="View detailed analytics and insights about your data."
                                        icon={BarChart3}
                                    />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/documents" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PlaceholderPage
                                        title="Documents"
                                        description="Manage and organize your documents and files."
                                        icon={FileText}
                                    />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    {/* New navigation routes */}
                    <Route path="/pos" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    {/* POS Wizard */}
                                    <POSWizard />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/sales" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PlaceholderPage
                                        title="Sales"
                                        description="View and manage sales performance."
                                        icon={TrendingUp}
                                    />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    {/* Management */}
                    <Route path="/management/customers" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <CustomerPage/>
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/management/products" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <ProductsManager/>
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/management/plans" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PlaceholderPage
                                        title="Plans"
                                        description="Configure and manage installment plans."
                                        icon={ClipboardList}
                                    />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    {/* Installments */}
                    <Route path="/installments/active-loans" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PlaceholderPage
                                        title="Active Loans"
                                        description="Overview of all active installment loans."
                                        icon={CheckCircle2}
                                    />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/installments/due-calendar" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PlaceholderPage
                                        title="Due Calendar"
                                        description="Calendar view for upcoming due payments."
                                        icon={CalendarClock}
                                    />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/installments/overdue" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PlaceholderPage
                                        title="Overdue"
                                        description="List of overdue payments and accounts."
                                        icon={AlertTriangle}
                                    />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    {/* Finance */}
                    <Route path="/finance/order-history" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PlaceholderPage
                                        title="Order History"
                                        description="Review historical orders and transactions."
                                        icon={History}
                                    />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/finance/payments-log" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PlaceholderPage
                                        title="Payments Log"
                                        description="Detailed log of received payments."
                                        icon={Receipt}
                                    />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/finance/refunds" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PlaceholderPage
                                        title="Refunds"
                                        description="Manage and review refunds."
                                        icon={RotateCcw}
                                    />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/messages" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PlaceholderPage
                                        title="Messages"
                                        description="Send and receive messages with your team."
                                        icon={Mail}
                                    />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/calendar" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PlaceholderPage
                                        title="Calendar"
                                        description="Schedule and manage your events and appointments."
                                        icon={Calendar}
                                    />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/settings" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PlaceholderPage
                                        title="Settings"
                                        description="Configure your application settings and preferences."
                                        icon={Settings}
                                    />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/persona-management" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PersonaManagement />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    {/* Redirect root to dashboard */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App