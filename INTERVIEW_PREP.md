# Interview Prep Q&A - MERN Social Media Platform

Use these standard questions and answers to prepare for internship/portfolio reviews.

---

### Q1: How did you implement user authentication, and how is it secured?
**A**: Authentication is implemented using **JSON Web Tokens (JWT)** and **bcryptjs** for security:
1. **Password Hashing**: We never store plain-text passwords. In the `User` schema, we use a Mongoose `pre-save` hook to automatically hash passwords with a salt factor of 10 using `bcryptjs` before they are written to MongoDB.
2. **JWT Generation**: Upon registration or login, the backend generates a signed JWT token containing the user's MongoDB ID, set to expire in 30 days.
3. **Protected Routes**: We created a custom `protect` Express middleware. It intercepts requests, extracts the JWT from the `Authorization: Bearer <token>` header, verifies the token, and attaches the user document to the `req.user` object. If the token is missing or invalid, it triggers a 401 response.
4. **Client-Side Storage**: The frontend stores the token in `localStorage` and uses an Axios request interceptor to automatically attach it to all outgoing API calls.

---

### Q2: How are follow relationships modeled in the database, and why did you choose this approach?
**A**: Follow relationships are modeled as self-referencing **Many-to-Many** arrays of ObjectIds in the `User` schema:
```javascript
followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
```
**Rationale**:
For a mini social media platform, placing followers/following arrays directly in the `User` document is optimal. It simplifies follow queries: checking if User A follows User B is a fast array check (`currentUser.following.includes(targetUser._id)`). Populating lists is done in a single query using Mongoose's `.populate()`.
*Note: In massive scale production systems (like Twitter), this is typically moved to a separate relational join table or a graph database to avoid exceeding MongoDB's 16MB document limit.*

---

### Q3: How does the image upload feature work using Cloudinary and Multer?
**A**: To avoid storing binary files directly on the server, we use **Multer** and **Cloudinary**:
1. **Multer Memory Storage**: Multer is configured to receive files via `multipart/form-data` and store them temporarily in system memory as a Buffer stream.
2. **Buffer Streaming to Cloudinary**: We write the file buffer into a Cloudinary upload stream. This transfers the file directly from memory to Cloudinary's servers without writing any files to the backend server's local disk, making it highly compatible with serverless/read-only hosting platforms (like Render or Heroku).
3. **Database Reference**: Once Cloudinary completes the upload, it returns a secure URL (`secure_url`), which we save as a string property inside our Mongoose `Post` or `User` schema.

---

### Q4: How is dark mode managed and persisted?
**A**: Dark mode is managed using React's **Context API** (`ThemeContext`) and **Bootstrap 5.3's** native color mode support:
1. **Bootstrap 5.3 theme**: Bootstrap 5.3 supports switching themes via the `data-bs-theme` attribute (e.g. `data-bs-theme="dark"`).
2. **React State**: The `ThemeContext` toggles the value of the theme state between `light` and `dark`.
3. **DOM Manipulation**: Inside a `useEffect` hook in `ThemeContext`, we dynamically call `document.documentElement.setAttribute('data-bs-theme', theme)` whenever the theme changes, updating all Bootstrap colors globally.
4. **Persistence**: The chosen theme is cached in `localStorage` and read during context initialization to ensure the setting persists across page refreshes.

---

### Q5: How did you implement pagination for the Home Feed?
**A**: To prevent slow query responses as posts grow, we implemented **Limit-Offset Pagination**:
1. The client requests the feed with query parameters `page` and `limit` (e.g., `/api/posts/feed?page=1&limit=5`).
2. The backend uses Mongoose query chain operators `.skip((page - 1) * limit)` and `.limit(limit)` to fetch only the requested slice of posts.
3. The backend returns the subset of posts, along with metadata: `currentPage`, `totalPages`, and a boolean flag `hasMore`.
4. The frontend keeps track of the current page and appends new posts to the state when the user clicks "Load More" to create an infinite feed experience.
