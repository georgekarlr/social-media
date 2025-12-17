import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PersonaProtectedRoute from './components/PersonaProtectedRoute'
import Layout from './components/layout/Layout'
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import PersonaManagement from './pages/PersonaManagement'
import RentDashboard from "./pages/Dashboard.tsx";
import PropertiesManager from "./pages/PropertiesManager.tsx";
import TenantsManager from "./pages/TenantsManager.tsx";
import LeaseWizard from "./pages/LeaseWizard.tsx";
import LeasesManager from "./pages/LeasesManager.tsx";
import AnalyticsDashboard from "./pages/AnalyticsDashboard.tsx";

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
                                    <LeaseWizard/>
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />
                    <Route path="/leases" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <LeasesManager/>
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    <Route path="/management/tenants" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <TenantsManager/>
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
                                    <AnalyticsDashboard/>
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