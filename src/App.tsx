import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/layout/Layout'
import FeedPage from './pages/FeedPage'
import ExplorePage from './pages/ExplorePage'
import LibraryPage from './pages/LibraryPage'
import PlaceholderPage from './pages/PlaceholderPage'
import UserProfilePage from './pages/UserProfilePage'
import { 
    Library, 
    Search, 
    Trophy, 
    Bell, 
    User, 
    Settings 
} from 'lucide-react'

function App() {
    console.log('App rendering')
    return (
        <AuthProvider>
            <ToastProvider>
                <Router>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/signup" element={<SignupForm />} />

                        {/* Private routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <FeedPage />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />

                        {/* Placeholder routes for navigation items */}
                        <Route path="/library" element={
                            <ProtectedRoute><Layout><LibraryPage /></Layout></ProtectedRoute>
                        } />
                        <Route path="/explore" element={
                            <ProtectedRoute><Layout><ExplorePage /></Layout></ProtectedRoute>
                        } />
                        <Route path="/leaderboard" element={
                            <ProtectedRoute><Layout><PlaceholderPage title="Leaderboard" description="See how you rank against other learners." icon={Trophy} /></Layout></ProtectedRoute>
                        } />
                        <Route path="/notifications" element={
                            <ProtectedRoute><Layout><PlaceholderPage title="Notifications" description="Stay updated on your learning activity." icon={Bell} /></Layout></ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute><Layout><PlaceholderPage title="Profile" description="Manage your account and study stats." icon={User} /></Layout></ProtectedRoute>
                        } />
                        {/* Public profile by username */}
                        <Route path="/u/:username" element={
                            <ProtectedRoute>
                                <Layout>
                                    <UserProfilePage />
                                </Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/settings" element={
                            <ProtectedRoute><Layout><PlaceholderPage title="Settings" description="Customize your learning experience." icon={Settings} /></Layout></ProtectedRoute>
                        } />

                        {/* Redirect root to dashboard */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        
                        {/* Catch all */}
                        <Route path="*" element={
                            <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#fee2e2' }}>
                                <h1 style={{ color: '#dc2626' }}>404 - Page Not Found</h1>
                                <p>The path <code>{window.location.pathname}</code> does not match any routes.</p>
                                <a href="/login" style={{ color: '#2563eb', fontWeight: 'bold' }}>Go to Login</a>
                            </div>
                        } />
                    </Routes>
                </Router>
            </ToastProvider>
        </AuthProvider>
    )
}

export default App