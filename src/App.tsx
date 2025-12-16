import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PersonaProtectedRoute from './components/PersonaProtectedRoute'
import Layout from './components/layout/Layout'
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import PlaceholderPage from './pages/PlaceholderPage'
import PersonaManagement from './pages/PersonaManagement'
import {
    BarChart3,
    TrendingUpIcon, ShoppingCart, Users,
} from 'lucide-react'
import RentDashboard from "./pages/Dashboard.tsx";
import PropertiesManager from "./pages/PropertiesManager.tsx";

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
                                    <RentDashboard/>
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/lease-wizard" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PlaceholderPage
                                        title="Lease Wizard"
                                        description="Create leases"
                                        icon={ShoppingCart}
                                    />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />
                    <Route path="/leases" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PlaceholderPage
                                        title="Leases"
                                        description="Leases"
                                        icon={TrendingUpIcon}
                                    />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/management/tenants" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PlaceholderPage
                                        title="Tenants"
                                        description="Tenants"
                                        icon={Users}
                                    />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/management/properties" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PropertiesManager/>
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
                                        description="Analytics"
                                        icon={BarChart3}
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