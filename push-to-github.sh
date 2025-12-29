#!/bin/bash

# GitHub Push Script
# Creates a new repository and pushes code to GitHub

echo "🚀 BeyondChats - GitHub Repository Setup"
echo "========================================"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Please install it from: https://cli.github.com/"
    echo ""
    echo "Or create repository manually:"
    echo "1. Go to https://github.com/new"
    echo "2. Create repository named 'beyondchats-assignment' (public)"
    echo "3. Run these commands:"
    echo ""
    echo "   git remote add origin https://github.com/PAMIDIROHIT/beyondchats-assignment.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    exit 1
fi

# Login check
if ! gh auth status &> /dev/null; then
    echo "Please login to GitHub first:"
    echo "  gh auth login"
    exit 1
fi

# Create repository
echo "📝 Creating GitHub repository..."
gh repo create beyondchats-assignment \
    --public \
    --description "Full-stack article optimization platform using AI - BeyondChats Assignment" \
    --confirm

# Rename branch to main
echo "🔄 Renaming branch to main..."
git branch -M main

# Add remote and push
echo "📤 Pushing code to GitHub..."
git remote add origin https://github.com/PAMIDIROHIT/beyondchats-assignment.git
git push -u origin main

echo ""
echo "✅ Repository created and code pushed successfully!"
echo "🌐 Visit: https://github.com/PAMIDIROHIT/beyondchats-assignment"
echo ""
