/**
 * ArticleCard Component
 * Displays article preview with image, title, author, and excerpt
 */

import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
    // Format date to readable string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Get excerpt from content (first 150 characters)
    const getExcerpt = (content) => {
        if (!content) return '';
        const plainText = content.replace(/<[^>]+>/g, '');
        return plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
    };

    // Default placeholder image
    const defaultImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop';

    return (
        <Link to={`/article/${article._id}`}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden card-hover cursor-pointer h-full flex flex-col">
                {/* Image */}
                <div className="h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
                    <img
                        src={article.imageUrl || defaultImage}
                        alt={article.title}
                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = defaultImage;
                        }}
                    />
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    {/* Update Badge */}
                    {article.isUpdated && (
                        <div className="mb-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-sm">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                AI Optimized
                            </span>
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                        {article.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span>{article.author || 'Unknown Author'}</span>
                        </div>
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span>{formatDate(article.publishedDate || article.createdAt)}</span>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm line-clamp-3 flex-1 mb-4">
                        {getExcerpt(article.content)}
                    </p>

                    {/* Read More Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-primary-600 font-semibold text-sm flex items-center group">
                            Read More
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>

                        {/* Reference Count */}
                        {article.references && article.references.length > 0 && (
                            <span className="text-xs text-gray-400 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                </svg>
                                {article.references.length} refs
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ArticleCard;
