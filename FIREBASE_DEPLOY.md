## Firebase Deployment Guide

This document outlines the steps required to build and deploy the React application to Firebase Hosting.

### Prerequisites

Before starting, ensure you have the [Firebase CLI](https://github.com/firebase/firebase-tools) installed (sudo may be required):

```bash
npm install -g firebase-tools
```

You must also be authenticated:

```bash
firebase login
```

### Project Configuration

The project uses a`firebase.json` configuration optimized for Single Page Applications (SPA). Key features include:
*   **Rewrites**: All navigation requests are redirected to`index.html` to support client-side routing (React Router).
*   **Caching**: Aggressive caching headers for assets generated with unique hashes.
*   **Clean URLs**: Trailing slashes are removed for better SEO.

### Deployment Process

Follow these steps to deploy a new version to production:


#### 1. Build the Project
Generate the production-ready static files in the`dist` directory:

```bash
npm run build
```

#### 2. Local Preview (Optional but Recommended)
Test the production build locally using the Firebase emulator to verify headers and routing:

```bash
firebase emulators:start --only hosting
```

#### 3. Deploy
Upload the files to Firebase Hosting:

```bash
firebase deploy --only hosting
```

### Troubleshooting

#### Routes returning 404 on refresh
If manual refreshes on sub-pages (e.g.,`/dashboard`) return a 404 error, ensure the`rewrites` section in`firebase.json` is present:

```json
"rewrites": [ { "source": "**", "destination": "/index.html" } ]
```

#### Assets not updating
If you deploy a new version but see old content, it might be due to the service worker or browser cache. The current`firebase.json` uses`max-age=31536000` for hashed assets, which is safe for new builds. For the`index.html`, Firebase default behavior is to use a short cache to ensure immediate updates.

### Useful Commands Reference

| | Command | Description | |
| --- | --- |
|`firebase hosting:sites:list`| | List all sites in the Firebase project. | |
|`firebase hosting:channel:deploy <name>`| | Deploy to a temporary preview channel. | |
|`firebase output:logout`| | Log out from the current CLI session. | |
|`firebase hosting:disable`| | Stop serving the site immediately. | |