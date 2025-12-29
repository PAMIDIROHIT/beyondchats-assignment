/**
 * Home Page
 * Displays grid of all articles with pagination and filtering
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ArticleCard from '../components/ArticleCard';
import { getArticles, getArticleStats } from '../services/api';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalArticles: 0,
    });
    const [filter, setFilter] = useState('all'); // 'all', 'updated', 'not-updated'

    // Fetch statistics
    useEffect(() => {
        fetchStats();
    }, []);

    // Fetch articles
    useEffect(() => {
        fetchArticles(pagination.currentPage);
    }, [pagination.currentPage, filter]);

    const fetchStats = async () => {
        try {
            const response = await getArticleStats();
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const fetchArticles = async (page) => {
        try {
            setLoading(true);

            const filterParam = filter === 'updated' ? true : filter === 'not-updated' ? false : null;
            const response = await getArticles(page, 12, filterParam);

            setArticles(response.data || []);
            setPagination(response.pagination || {});

            if (response.data && response.data.length === 0 && page === 1) {
                toast.error('No articles found. Please run the scraper first.');
            }

        } catch (error) {
            console.error('Failed to fetch articles:', error);
            toast.error('Failed to load articles. Please check if the backend is running.');
            setArticles([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    // Loading skeleton
    const LoadingSkeleton = () => (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
                            BeyondChats Article Optimizer
                        </h1>
                        <p className="text-xl text-primary-100 mb-8 animate-slide-up">
                            Compare original articles with AI-optimized versions powered by Google Gemini
                        </p>

                        {/* Statistics */}
                        {stats && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                                <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-4">
                                    <div className="text-3xl font-bold">{stats.total}</div>
                                    <div className="text-primary-100 text-sm">Total Articles</div>
                                </div>
                                <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-4">
                                    <div className="text-3xl font-bold">{stats.updated}</div>
                                    <div className="text-primary-100 text-sm">AI Optimized</div>
                                </div>
                                <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-4">
                                    <div className="text-3xl font-bold">{stats.updatePercentage}%</div>
                                    <div className="text-primary-100 text-sm">Optimization Rate</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Filter Buttons */}
                <div className="flex flex-wrap items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                        Articles
                        {pagination.totalArticles > 0 && (
                            <span className="text-gray-500 text-lg ml-2">
                                ({pagination.totalArticles})
                            </span>
                        )}
                    </h2>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleFilterChange('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'all'
                                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => handleFilterChange('updated')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'updated'
                                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Optimized
                        </button>
                        <button
                            onClick={() => handleFilterChange('not-updated')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'not-updated'
                                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Original Only
                        </button>
                    </div>
                </div>

                {/* Articles Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <LoadingSkeleton key={n} />
                        ))}
                    </div>
                ) : articles.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Articles Found</h3>
                        <p className="text-gray-600 mb-6">
                            {filter !== 'all'
                                ? `No ${filter.replace('-', ' ')} articles available.`
                                : 'Start by running the scraper to fetch articles from BeyondChats.'}
                        </p>
                        <button
                            onClick={() => handleFilterChange('all')}
                            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                        >
                            View All Articles
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Articles Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {articles.map((article) => (
                                <ArticleCard key={article._id} article={article} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={!pagination.hasPrev}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${pagination.hasPrev
                                            ? 'bg-white text-gray-700 hover:bg-gray-50'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    Previous
                                </button>

                                {[...Array(pagination.totalPages)].map((_, index) => {
                                    const pageNum = index + 1;
                                    // Show only 5 pages at a time
                                    if (
                                        pageNum === 1 ||
                                        pageNum === pagination.totalPages ||
                                        Math.abs(pageNum - pagination.currentPage) <= 1
                                    ) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`px-4 py-2 rounded-lg font-medium transition-all ${pageNum === pagination.currentPage
                                                        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    } else if (Math.abs(pageNum - pagination.currentPage) === 2) {
                                        return <span key={pageNum}>...</span>;
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={!pagination.hasNext}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${pagination.hasNext
                                            ? 'bg-white text-gray-700 hover:bg-gray-50'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
