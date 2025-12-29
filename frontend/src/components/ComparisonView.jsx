/**
 * ComparisonView Component
 * Side-by-side comparison of original and updated article content
 */

import React, { useState } from 'react';

const ComparisonView = ({ article }) => {
    const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side' or 'toggle'
    const [showOriginal, setShowOriginal] = useState(true);

    if (!article) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No article data available</p>
            </div>
        );
    }

    const hasUpdatedContent = article.isUpdated && article.updatedContent;

    // Format content with proper paragraphs
    const formatContent = (content) => {
        if (!content) return '';
        return content.split('\n\n').map((para, idx) => (
            <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                {para}
            </p>
        ));
    };

    return (
        <div className="space-y-6">
            {/* View Mode Toggle */}
            {hasUpdatedContent && (
                <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span className="font-semibold text-gray-700">View Mode:</span>
                    </div>

                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('side-by-side')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'side-by-side'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Side by Side
                        </button>
                        <button
                            onClick={() => setViewMode('toggle')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'toggle'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Toggle
                        </button>
                    </div>
                </div>
            )}

            {/* Content Display */}
            {viewMode === 'side-by-side' ? (
                /* Side-by-Side View */
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Original Content */}
                    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                        <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Original Article</h3>
                                <p className="text-sm text-gray-500">From BeyondChats</p>
                            </div>
                        </div>
                        <div className="prose prose-sm max-w-none">
                            {formatContent(article.content)}
                        </div>
                    </div>

                    {/* Updated Content */}
                    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl shadow-lg p-6 md:p-8">
                        <div className="flex items-center mb-6 pb-4 border-b border-primary-200">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 7H7v6h6V7z" />
                                    <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Optimized Article</h3>
                                <p className="text-sm text-primary-600 font-medium">AI-Enhanced Content</p>
                            </div>
                        </div>
                        <div className="prose prose-sm max-w-none">
                            {hasUpdatedContent ? (
                                formatContent(article.updatedContent)
                            ) : (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium mb-2">Not yet optimized</p>
                                    <p className="text-sm text-gray-400">Run the update script to generate AI-optimized content</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                /* Toggle View */
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${showOriginal
                                    ? 'bg-blue-100'
                                    : 'bg-gradient-to-br from-primary-500 to-secondary-500'
                                }`}>
                                <svg className={`w-5 h-5 ${showOriginal ? 'text-blue-600' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {showOriginal ? 'Original Article' : 'Optimized Article'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {showOriginal ? 'From BeyondChats' : 'AI-Enhanced Content'}
                                </p>
                            </div>
                        </div>

                        {hasUpdatedContent && (
                            <button
                                onClick={() => setShowOriginal(!showOriginal)}
                                className="flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                Show {showOriginal ? 'Optimized' : 'Original'}
                            </button>
                        )}
                    </div>

                    <div className="prose prose-sm max-w-none">
                        {showOriginal ? (
                            formatContent(article.content)
                        ) : hasUpdatedContent ? (
                            formatContent(article.updatedContent)
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 mb-4">No optimized content available</p>
                                <button
                                    onClick={() => setShowOriginal(true)}
                                    className="text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    View Original Article
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* References Section */}
            {article.references && article.references.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">References</h3>
                            <p className="text-sm text-gray-500">Articles used for optimization</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {article.references.map((ref, index) => (
                            <a
                                key={index}
                                href={ref.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-primary-50 hover:to-secondary-50 transition-all hover:shadow-md group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-1">
                                            <span className="text-xs font-semibold text-gray-500 mr-2">
                                                Reference {index + 1}
                                            </span>
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                                            {ref.title || 'Untitled Reference'}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1 truncate">
                                            {ref.url}
                                        </p>
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComparisonView;
