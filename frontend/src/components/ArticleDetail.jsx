/**
 * ArticleDetail Component
 * Displays full article with metadata
 */

import React from 'react';

const ArticleDetail = ({ article }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const defaultImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop';

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header Image */}
            <div className="h-64 md:h-96 overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
                <img
                    src={article.imageUrl || defaultImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = defaultImage;
                    }}
                />
            </div>

            {/* Content */}
            <div className="p-6 md:p-10">
                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {article.title}
                </h1>

                {/* Metadata */}
                <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center mr-6 mb-2">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{article.author || 'Unknown Author'}</span>
                    </div>

                    <div className="flex items-center mr-6 mb-2">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>{formatDate(article.publishedDate || article.createdAt)}</span>
                    </div>

                    {article.isUpdated && (
                        <div className="flex items-center mb-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-white">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                AI Optimized
                            </span>
                        </div>
                    )}
                </div>

                {/* Source Link */}
                {article.sourceUrl && (
                    <a
                        href={article.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-6"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Original Source
                    </a>
                )}
            </div>
        </div>
    );
};

export default ArticleDetail;
