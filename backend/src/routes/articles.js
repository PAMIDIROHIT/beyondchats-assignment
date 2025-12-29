/**
 * Article Routes
 * Defines RESTful API endpoints for article operations
 */

import express from 'express';
import { body } from 'express-validator';
import {
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    getArticleStats
} from '../controllers/articleController.js';

const router = express.Router();

// Validation middleware for creating/updating articles
const articleValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 500 })
        .withMessage('Title cannot exceed 500 characters'),

    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required'),

    body('sourceUrl')
        .trim()
        .notEmpty()
        .withMessage('Source URL is required')
        .isURL()
        .withMessage('Source URL must be valid'),

    body('author')
        .optional()
        .trim(),

    body('imageUrl')
        .optional()
        .trim()
        .isURL()
        .withMessage('Image URL must be valid'),

    body('publishedDate')
        .optional()
        .isISO8601()
        .withMessage('Published date must be a valid date')
];

/**
 * @route   GET /api/articles/stats
 * @desc    Get statistics about articles
 * @access  Public
 */
router.get('/stats', getArticleStats);

/**
 * @route   GET /api/articles
 * @desc    Get all articles with pagination
 * @query   page, limit, isUpdated
 * @access  Public
 */
router.get('/', getAllArticles);

/**
 * @route   GET /api/articles/:id
 * @desc    Get single article by ID
 * @access  Public
 */
router.get('/:id', getArticleById);

/**
 * @route   POST /api/articles
 * @desc    Create new article
 * @access  Public
 */
router.post('/', articleValidation, createArticle);

/**
 * @route   PUT /api/articles/:id
 * @desc    Update article by ID
 * @access  Public
 */
router.put('/:id', updateArticle);

/**
 * @route   DELETE /api/articles/:id
 * @desc    Delete article by ID
 * @access  Public
 */
router.delete('/:id', deleteArticle);

export default router;
