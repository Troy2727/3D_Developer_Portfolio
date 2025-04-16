# GitHub Actions Workflows

This project uses GitHub Actions for continuous integration, security scanning, and deployment.

## Available Workflows

### 1. Continuous Integration (CI)

The CI workflow runs on every push to the main branch and on pull requests. It:
- Sets up Node.js
- Installs dependencies
- Runs linting
- Builds the project
- Uploads build artifacts

### 2. CodeQL Analysis

The CodeQL Analysis workflow runs security scanning on your JavaScript code:
- Runs on pushes to main, pull requests, and weekly
- Identifies potential security vulnerabilities
- Reports findings in the Security tab of your GitHub repository

### 3. Deployment to Vercel

The deployment workflow automatically deploys your site to Vercel when you push to the main branch:
- Builds your project
- Deploys to Vercel production environment

## Setting Up Vercel Deployment

To set up the Vercel deployment workflow, you need to add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Add the following secrets:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

### How to get Vercel credentials:

1. **Vercel Token**:
   - Go to your Vercel account settings
   - Navigate to "Tokens"
   - Create a new token with "Full Account" scope

2. **Organization and Project ID**:
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel link` in your project directory
   - Find the IDs in the `.vercel/project.json` file that gets created

## Customizing Workflows

You can customize these workflows by editing the YAML files in the `.github/workflows/` directory:
- `ci.yml`: Continuous Integration workflow
- `codeql-analysis.yml`: CodeQL Analysis workflow
- `deploy.yml`: Vercel deployment workflow
