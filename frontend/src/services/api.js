/**
 * API Service
 * Handles all HTTP requests to the backend API
 */

import axios from 'axios';

// Base API URL - use environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for debugging
apiClient.interceptors.request.use(
    (config) => {
        console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.config.url}`, response.status);
        return response;
    },
    (error) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);

        const customError = {
            message: error.response?.data?.message || error.message || 'An error occurred',
            status: error.response?.status,
            data: error.response?.data,
        };

        return Promise.reject(customError);
    }
);

/**
 * Get all articles with pagination
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @param {boolean} isUpdated - Filter by update status
 * @returns {Promise<Object>} Articles and pagination info
 */
export const getArticles = async (page = 1, limit = 10, isUpdated = null) => {
    try {
        const params = { page, limit };
        if (isUpdated !== null) {
            params.isUpdated = isUpdated;
        }

        const response = await apiClient.get('/articles', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get single article by ID
 * @param {string} id - Article ID
 * @returns {Promise<Object>} Article data
 */
export const getArticleById = async (id) => {
    try {
        const response = await apiClient.get(`/articles/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Create new article
 * @param {Object} articleData - Article data
 * @returns {Promise<Object>} Created article
 */
export const createArticle = async (articleData) => {
    try {
        const response = await apiClient.post('/articles', articleData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Update article
 * @param {string} id - Article ID
 * @param {Object} updates - Update data
 * @returns {Promise<Object>} Updated article
 */
export const updateArticle = async (id, updates) => {
    try {
        const response = await apiClient.put(`/articles/${id}`, updates);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Delete article
 * @param {string} id - Article ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteArticle = async (id) => {
    try {
        const response = await apiClient.delete(`/articles/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get article statistics
 * @returns {Promise<Object>} Statistics
 */
export const getArticleStats = async () => {
    try {
        const response = await apiClient.get('/articles/stats');
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Health check
 * @returns {Promise<Object>} Health status
 */
export const healthCheck = async () => {
    try {
        const response = await apiClient.get('/health');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    getArticleStats,
    healthCheck,
};
