/**
 * Main App Component
 * Handles routing and global layout
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ArticleComparison from './pages/ArticleComparison';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Toast Notifications */}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            duration: 4000,
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />

                {/* Navigation */}
                <Navbar />

                {/* Main Routes */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/article/:id" element={<ArticleComparison />} />

                    {/* 404 Route */}
                    <Route
                        path="*"
                        element={
                            <div className="min-h-screen flex items-center justify-center">
                                <div className="text-center">
                                    <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                                    <p className="text-xl text-gray-600 mb-6">Page not found</p>
                                    <a
                                        href="/"
                                        className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow inline-block"
                                    >
                                        Go Home
                                    </a>
                                </div>
                            </div>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
