# Deployment Guide for PawWalker

This document provides detailed instructions for deploying the PawWalker application to GitHub Pages.

## Prerequisites

- GitHub account
- Git installed on your local machine
- Node.js and npm installed

## GitHub Pages Deployment

### Automatic Deployment with GitHub Actions

The repository is configured to automatically deploy to GitHub Pages using GitHub Actions whenever changes are pushed to the main branch.

1. **Enable GitHub Pages in your repository**:
   - Go to your GitHub repository
   - Navigate to Settings > Pages
   - Under "Source", select "GitHub Actions"

2. **Push your changes to the main branch**:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

3. **Monitor the deployment**:
   - Go to the "Actions" tab in your GitHub repository
   - You should see a workflow running for the deployment
   - Once completed, your site will be available at `https://[username].github.io/dog-walker-app/`

### Manual Deployment

You can also deploy manually using the gh-pages package:

1. **Install the gh-pages package** (already added to devDependencies):
   ```bash
   cd client
   npm install --save-dev gh-pages
   ```

2. **Deploy to GitHub Pages**:
   ```bash
   cd client
   npm run deploy
   ```

3. **Verify the deployment**:
   - Check your GitHub repository's Settings > Pages
   - Your site should be available at `https://[username].github.io/dog-walker-app/`

## Testing Deployment Locally

Before deploying to GitHub Pages, you can test the production build locally:

1. **Run the test-deploy script**:
   ```bash
   cd client
   ./test-deploy.sh
   ```

2. **Open your browser** and navigate to the URL shown in the terminal (usually http://localhost:5000)

3. **Test the application** to ensure everything works as expected in production mode

## Troubleshooting

### 404 Errors on Page Refresh

If you encounter 404 errors when refreshing pages or accessing direct URLs, check that:

1. The 404.html file is correctly set up in the public directory
2. The redirect script is properly included in index.html
3. The `pathSegmentsToKeep` variable in 404.html is set to 1 for GitHub project pages

### Base Path Issues

If assets are not loading correctly:

1. Verify that the `base` path in vite.config.ts is set correctly to `/dog-walker-app/`
2. Check that all asset references use relative paths or respect the base path

### API Calls Not Working

In demo mode, API calls are intercepted and mock data is returned. If this is not working:

1. Verify that the `VITE_DEMO_MODE` environment variable is set to `true` in .env.production
2. Check that the mock service interceptor is properly set up in the application

## Demo Mode vs. Full Stack Deployment

### Demo Mode (Current Configuration)

- Frontend only deployment to GitHub Pages
- Uses mock data and simulated API responses
- No backend server required
- Limited to demonstration purposes

### Full Stack Deployment (Future Option)

To deploy the full application with a working backend:

1. Deploy the backend to a hosting service (Heroku, Render, Railway, etc.)
2. Update the `VITE_API_URL` in .env.production to point to your hosted backend
3. Set `VITE_DEMO_MODE` to `false` in .env.production
4. Deploy the frontend to GitHub Pages as described above

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router with GitHub Pages](https://create-react-app.dev/docs/deployment/#notes-on-client-side-routing)
