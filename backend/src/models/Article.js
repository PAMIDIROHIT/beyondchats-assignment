/**
 * Article Model Schema
 * Defines the structure for articles in MongoDB
 */

import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
    {
        // Original article data from BeyondChats
        title: {
            type: String,
            required: [true, 'Article title is required'],
            trim: true,
            maxlength: [500, 'Title cannot exceed 500 characters']
        },

        content: {
            type: String,
            required: [true, 'Article content is required'],
        },

        author: {
            type: String,
            default: 'Unknown Author',
            trim: true
        },

        publishedDate: {
            type: Date,
            default: Date.now
        },

        sourceUrl: {
            type: String,
            required: [true, 'Source URL is required'],
            trim: true
        },

        imageUrl: {
            type: String,
            default: null,
            trim: true
        },

        // Updated article data from LLM optimization
        isUpdated: {
            type: Boolean,
            default: false
        },

        updatedContent: {
            type: String,
            default: null
        },

        // References to articles used for optimization
        references: [
            {
                title: {
                    type: String,
                    trim: true
                },
                url: {
                    type: String,
                    trim: true
                }
            }
        ],

        // Metadata
        scrapedAt: {
            type: Date,
            default: Date.now
        },

        lastUpdated: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
        collection: 'articles'
    }
);

// Indexes for better query performance
articleSchema.index({ title: 1 });
articleSchema.index({ publishedDate: -1 });
articleSchema.index({ isUpdated: 1 });
articleSchema.index({ createdAt: -1 });

// Virtual for excerpt (first 200 characters of content)
articleSchema.virtual('excerpt').get(function () {
    if (!this.content) return '';
    return this.content.substring(0, 200) + (this.content.length > 200 ? '...' : '');
});

// Method to mark article as updated
articleSchema.methods.markAsUpdated = function (updatedContent, references) {
    this.isUpdated = true;
    this.updatedContent = updatedContent;
    this.references = references;
    this.lastUpdated = new Date();
    return this.save();
};

// Static method to get paginated articles
articleSchema.statics.getPaginated = async function (page = 1, limit = 10, filter = {}) {
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
        this.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        this.countDocuments(filter)
    ]);

    return {
        articles,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalArticles: total,
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        }
    };
};

const Article = mongoose.model('Article', articleSchema);

export default Article;
