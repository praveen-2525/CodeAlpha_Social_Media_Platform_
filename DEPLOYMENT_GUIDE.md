# Deployment Guide - MERN Social Media Platform

This guide walks you through deploying the MERN stack social media application to production environments.

---

## 1. Database Setup: MongoDB Atlas
MongoDB Atlas provides a managed cloud database.
1. Sign up/Log in at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new project, then build a **Shared Cluster** (free tier).
3. Under **Database Access**, create a user with read/write privileges.
4. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) for hosting providers.
5. In **Clusters**, click **Connect** -> **Connect your application** and copy the URI.
6. Replace `<password>` in the connection string with your database user's password. This is your `MONGO_URI`.

---

## 2. Image Hosting Setup: Cloudinary
Cloudinary is used for uploading and optimization of images.
1. Sign up/Log in at [Cloudinary](https://cloudinary.com).
2. Navigate to your **Dashboard**.
3. Copy your:
   - **Cloud Name** (`CLOUDINARY_CLOUD_NAME`)
   - **API Key** (`CLOUDINARY_API_KEY`)
   - **API Secret** (`CLOUDINARY_API_SECRET`)

---

## 3. Backend Deployment: Render
We will deploy the Node.js/Express backend to Render.
1. Sign up/Log in at [Render](https://render.com).
2. Click **New** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following options:
   - **Name**: `socialize-backend`
   - **Root Directory**: `backend` (or leave empty if repository contains only backend, but since this is a mono-repo, set to `backend`)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click **Advanced** and add the following Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `mongodb+srv://...` (Your Atlas URI)
   - `JWT_SECRET`: `your-secure-jwt-key`
   - `CLOUDINARY_CLOUD_NAME`: `your-cloud-name`
   - `CLOUDINARY_API_KEY`: `your-api-key`
   - `CLOUDINARY_API_SECRET`: `your-api-secret`
6. Deploy the web service. Copy your service's URL (e.g. `https://socialize-backend.onrender.com`).

---

## 4. Frontend Deployment: Vercel
We will deploy the Vite/React frontend to Vercel.
1. Install Vercel CLI globally or use the Vercel Dashboard at [Vercel](https://vercel.com).
2. Connect your GitHub repository.
3. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the following Environment Variable:
   - `VITE_API_URL`: `https://socialize-backend.onrender.com/api` (The backend URL you copied from Render)
5. Deploy. Vercel will build and serve your static React application.

---

## 5. Security & Configuration Checklists
- **CORS Configuration**: Verify that your backend `server.js` allowed origins array includes your deployed Vercel domain.
- **Environment variables**: Double check that no secrets/keys are pushed to public git repositories. Add `.env` to `.gitignore`.
- **JWT Key**: Ensure `JWT_SECRET` in production is a long, cryptographically strong random string.
