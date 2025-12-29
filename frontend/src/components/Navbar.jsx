/**
 * Navbar Component
 * Professional navigation bar with gradient background
 */

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Brand */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <span className="text-2xl font-bold gradient-text">BC</span>
                        </div>
                        <div>
                            <h1 className="text-white text-xl font-bold tracking-tight">
                                BeyondChats
                            </h1>
                            <p className="text-primary-100 text-xs">
                                Article Optimization Platform
                            </p>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-6">
                        <Link
                            to="/"
                            className="text-white hover:text-primary-100 font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <a
                            href="https://beyondchats.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-primary-100 font-medium transition-colors"
                        >
                            BeyondChats
                        </a>
                        <a
                            href="https://github.com/PAMIDIROHIT"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-md hover:shadow-lg"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
