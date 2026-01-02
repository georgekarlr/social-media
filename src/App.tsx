import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PersonaProtectedRoute from './components/PersonaProtectedRoute'
import Layout from './components/layout/Layout'
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import PersonaManagement from './pages/PersonaManagement'
import InventoryDashboard from "./pages/InventoryDashboard.tsx";
import CategoriesManager from "./pages/CategoriesManager.tsx";
import ProductsManager from "./pages/ProductsManager.tsx";

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
                                    <InventoryDashboard/>
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />


                    <Route path="/management/categories" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <CategoriesManager/>
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