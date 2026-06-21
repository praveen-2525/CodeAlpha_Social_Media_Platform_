# Testing Guide - MERN Social Media Platform

This guide outlines the procedure for testing the API routes and frontend features.

---

## 1. Automated API Testing (via cURL)

To verify the backend behaves correctly, open your terminal and run these commands sequentially. Ensure the backend server is running on `http://localhost:5000`.

### A. Health Check
```bash
curl -X GET http://localhost:5000/api/health
```

### B. User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "tester1", "email": "tester1@test.com", "password": "password123"}'
```
*Note: Copy the `token` and `_id` values returned in the response for subsequent commands.*

### C. User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "tester1@test.com", "password": "password123"}'
```

### D. Create a Post (Text only)
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"caption": "My first test post caption!"}'
```
*Note: Copy the post `_id` returned.*

### E. Like a Post
```bash
curl -X POST http://localhost:5000/api/posts/<POST_ID>/like \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### F. Add a Comment
```bash
curl -X POST http://localhost:5000/api/comments/<POST_ID> \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"text": "Automated comment validation test"}'
```

---

## 2. Manual Verification Workflow

Follow these steps on the web application to check all elements of the UI and database integration.

### Step 1: Registration and Profile Setup
1. Open the app in your browser (`http://localhost:5173`).
2. Go to **Sign Up** and create account `user1` (`user1@test.com`).
3. Click on the profile photo in the navbar to visit your **Profile Page**.
4. Click **Edit Profile**, upload a profile picture, fill in the **Bio**, and click **Save Changes**. Verify the profile page updates instantly.

### Step 2: Content Creation and Feed
1. Return to the **Home Feed** page.
2. In the post composer, type a caption and click the **Photo** button. Select a local image and verify the image preview appears.
3. Click **Share** and verify the post appears immediately at the top of your feed.
4. Compose a text-only post and verify it loads correctly.

### Step 3: Social Interactions (Multi-User testing)
1. Open an incognito browser window (or clear site cookies) and sign up as `user2` (`user2@test.com`).
2. Use the search bar in the navbar to search for `user1`. Verify autofill suggestions appear in the dropdown.
3. Click on `user1` to navigate to their profile.
4. Click **Follow** and check that the followers count increments.
5. Click **Followers** on the profile header to open the modal, verifying that `user2` appears in the list.
6. Go to the **Home Feed** as `user2`. You should see `user1`'s posts.
7. Click the **Heart (Like)** button. The likes counter should increment.
8. Click **Comments** and write a comment. Confirm it displays in the list.

### Step 4: Dark Mode
1. Click the **Theme (Moon/Sun)** icon in the navbar.
2. Confirm the background changes to a dark tone, typography color changes, and all cards/buttons preserve beautiful contrasts.
3. Refresh the page to verify that your theme choice persists (via `localStorage`).
