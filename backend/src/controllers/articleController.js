/**
 * Article Controller
 * Handles business logic for article CRUD operations
 */

import Article from '../models/Article.js';

/**
 * Get all articles with pagination
 * @route GET /api/articles?page=1&limit=10
 */
export const getAllArticles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const isUpdated = req.query.isUpdated;

        // Build filter
        const filter = {};
        if (isUpdated !== undefined) {
            filter.isUpdated = isUpdated === 'true';
        }

        console.log(`📖 Fetching articles - Page: ${page}, Limit: ${limit}`);

        const result = await Article.getPaginated(page, limit, filter);

        res.status(200).json({
            success: true,
            data: result.articles,
            pagination: result.pagination
        });

    } catch (error) {
        console.error('❌ Error fetching articles:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch articles',
            error: error.message
        });
    }
};

/**
 * Get single article by ID
 * @route GET /api/articles/:id
 */
export const getArticleById = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`🔍 Fetching article with ID: ${id}`);

        const article = await Article.findById(id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        res.status(200).json({
            success: true,
            data: article
        });

    } catch (error) {
        console.error('❌ Error fetching article:', error);

        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid article ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to fetch article',
            error: error.message
        });
    }
};

/**
 * Create new article
 * @route POST /api/articles
 */
export const createArticle = async (req, res) => {
    try {
        const articleData = req.body;

        console.log('✍️  Creating new article:', articleData.title);

        const article = await Article.create(articleData);

        res.status(201).json({
            success: true,
            message: 'Article created successfully',
            data: article
        });

    } catch (error) {
        console.error('❌ Error creating article:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create article',
            error: error.message
        });
    }
};

/**
 * Update article by ID
 * @route PUT /api/articles/:id
 */
export const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        console.log(`📝 Updating article with ID: ${id}`);

        const article = await Article.findByIdAndUpdate(
            id,
            { ...updates, lastUpdated: new Date() },
            {
                new: true, // Return updated document
                runValidators: true // Run schema validators
            }
        );

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Article updated successfully',
            data: article
        });

    } catch (error) {
        console.error('❌ Error updating article:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid article ID format'
            });
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update article',
            error: error.message
        });
    }
};

/**
 * Delete article by ID
 * @route DELETE /api/articles/:id
 */
export const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`🗑️  Deleting article with ID: ${id}`);

        const article = await Article.findByIdAndDelete(id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Article deleted successfully',
            data: article
        });

    } catch (error) {
        console.error('❌ Error deleting article:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid article ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to delete article',
            error: error.message
        });
    }
};

/**
 * Get articles statistics
 * @route GET /api/articles/stats
 */
export const getArticleStats = async (req, res) => {
    try {
        const [total, updated, notUpdated] = await Promise.all([
            Article.countDocuments(),
            Article.countDocuments({ isUpdated: true }),
            Article.countDocuments({ isUpdated: false })
        ]);

        res.status(200).json({
            success: true,
            data: {
                total,
                updated,
                notUpdated,
                updatePercentage: total > 0 ? ((updated / total) * 100).toFixed(2) : 0
            }
        });

    } catch (error) {
        console.error('❌ Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
};
