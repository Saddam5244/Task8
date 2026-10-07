# TaskFlow Pro - Fullstack To-Do List Application

A production-ready fullstack To-Do List application built with **Node.js**, **Express.js**, **MongoDB**, and **React**.

> 🚀 **Live Deployed Application**: [https://task8-e5d60.web.app](https://task8-e5d60.web.app)  

---

## Table of Contents

1. **Project Architecture**

2. **Part 1: Backend API**

   * Folder Structure
   * Environment Variables
   * Backend Setup & Run
   * API Endpoints
   * Controller, Service & Route Structure
   * Error Handling & Validation
   * Testing with Postman
   * Challenges & Solutions

3. **Part 2: Frontend Integration**

   * Features & API Integration
   * Frontend Setup & Run
   * Environment Variables
   * Challenges & Solutions
   * Important Design Decisions

4. **Deployment**

   * Deploy Frontend on Firebase
   * Deploy Backend on Render
   * Deploy Frontend on Netlify

---

## Project Architecture

```
Task8/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection handler
│   │   ├── controllers/
│   │   │   └── taskController.js     # Request/response logic
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js       # Centralized 404 & error handlers
│   │   │   └── validation.js         # Input validation & ObjectId checks
│   │   ├── models/
│   │   │   └── taskModel.js          # Mongoose Task schema
│   │   ├── routes/
│   │   │   └── taskRoutes.js         # REST route definitions
│   │   ├── services/
│   │   │   └── taskService.js        # Business logic & database operations
│   │   ├── app.js                    # Express app configuration
│   │   └── server.js                 # Server entry point
│   ├── .env.example                  # Backend env template
│   ├── package.json
│   ├── postman_collection.json       # Postman collection for automated testing
│   └── test-api.js                   # Automated test script
├── frontend/
│   ├── public/
│   │   └── _redirects                # Netlify SPA redirect rules
│   ├── src/
│   │   ├── api/
│   │   │   └── taskApi.js            # Axios client with centralized error formatting
│   │   ├── components/
│   │   │   ├── AlertBanner.jsx       # Dynamic success/error alerts
│   │   │   ├── FilterBar.jsx         # Status tabs, priority filter & sorting
│   │   │   ├── Navbar.jsx            # Header with task statistics
│   │   │   ├── SearchBar.jsx         # Debounced task search input
│   │   │   ├── TaskFormModal.jsx     # Add / Edit task modal with validation
│   │   │   └── TaskItem.jsx          # Task card with status toggle & actions
│   │   ├── App.jsx                   # Main application state & UI logic
│   │   ├── index.css                 # Custom styling (glassmorphism & dark theme)
│   │   └── main.jsx
│   ├── .env.example                  # Frontend env template
│   ├── netlify.toml                  # Netlify deployment configuration
│   └── package.json
├── .gitignore
└── README.md
```

---

## Part 1: Backend API (Node.js, Express, MongoDB)

### Backend Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/todolist_db
NODE_ENV=development
```

### Setup & Run Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   Or production mode:
   ```bash
   npm start
   ```
4. Run automated backend tests:
   ```bash
   npm test
   ```

### API Endpoints Reference

| Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status | None |
| `GET` | `/api/tasks` | Get all tasks (supports search & filter) | `?search=keyword&status=pending&priority=high&sortBy=createdAt&order=desc` |
| `GET` | `/api/tasks/:id` | Get single task by ID | Route param: `:id` |
| `POST` | `/api/tasks` | Create a new task | `{ "title": "Task 1", "description": "...", "priority": "high", "dueDate": "2026-10-10" }` |
| `PUT` | `/api/tasks/:id` | Update task details | `{ "title": "Updated", "description": "...", "priority": "medium" }` |
| `PATCH`| `/api/tasks/:id/status` | Update task status | `{ "status": "completed" }` (`pending`, `in-progress`, `completed`) |
| `DELETE`| `/api/tasks/:id` | Delete task | Route param: `:id` |

### Controller-Service-Route Pattern

The backend follows a simple layered structure:

* **Routes:** Defines API URLs and connects them to controllers.
* **Middlewares:** Checks user input, task IDs, title, status, and priority before processing the request.
* **Controllers:** Receives the request, calls the service, and sends the response.
* **Services:** Contains the main business logic, database operations, searching, and sorting.
* **Models:** Defines the MongoDB database structure and data rules using Mongoose.

### Error Handling & Validation

* **Error Handler:** Handles common errors and sends proper error messages.
* **Input Validation:** Checks required fields and makes sure the data is valid.
* **Title:** Maximum 120 characters.
* **Description:** Maximum 1000 characters.
* **Status:** Only `pending`, `in-progress`, or `completed` are allowed.
* Invalid task IDs and duplicate data are also handled properly.

### Testing with Postman

A Postman collection is provided in:

`backend/postman_collection.json`

To test the APIs:

1. Open **Postman**.
2. Click **Import**.
3. Select `backend/postman_collection.json`.
4. Use the default API URL:
   `http://localhost:5000/api`
5. Run the requests one by one.

The collection tests:

* Check if the server is running
* Create a task
* Get all tasks
* Search tasks
* Filter tasks by status
* Get a task by ID
* Update task details
* Update task status
* Check input validation
* Delete a task


### Challenges Faced & Solutions (Part 1)

1. **Searching Tasks Easily**

   * **Challenge:** Exact search did not work well for partial words or different letter cases.
   * **Solution:** Used MongoDB regex search on both task title and description. This allows users to search using partial words and different cases.

2. **Handling Invalid Task IDs**

   * **Challenge:** Invalid task IDs could cause MongoDB errors.
   * **Solution:** Added middleware to check whether the task ID is a valid MongoDB ObjectID before processing the request.

---

## Part 2: Frontend Integration (React & Axios)

### Frontend Features & Integration

* **Axios API:** Used Axios to connect the React frontend with the backend APIs and handle API errors.
* **Task List:** Tasks are automatically updated in the UI when a task is added, updated, or deleted.
* **Status Update:** Users can change the task status directly from the task list.
* **Search:** Users can search tasks by title or description. Search requests are delayed by 300ms to avoid unnecessary API calls.
* **Filters:** Tasks can be filtered by:

  * Status: All, Pending, In Progress, Completed
  * Priority: High, Medium, Low
* **Sorting:** Tasks can be sorted by:

  * Newest
  * Oldest
  * Due Date
* **Loading & Error Handling:** Loading indicators are shown while data is being fetched, and error/success messages are displayed when needed.
* **Form Validation:** Users cannot submit a task with an empty title.

### Setup & Run Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The application runs on `http://localhost:5173`.
4. Build for production:
   ```bash
   npm run build
   ```

### Frontend Environment Variables
Create a `.env` file in the `frontend/` directory:
```env
# Point to your local or deployed backend API
VITE_API_BASE_URL=http://localhost:5000/api
```

### Challenges Faced & Solutions (Part 2)
1. **Flickering & API request storms during search typing**:
   - *Challenge*: Triggering an API request on every keystroke generated excessive network traffic and race conditions.
   - *Solution*: Implemented a 300ms debounce hook via `useEffect`, delaying the search query trigger until the user finishes typing.
2. **Maintaining UI responsiveness during server latency**:
   - *Challenge*: Waiting for server response before updating checkbox status caused perceptible lag.
   - *Solution*: Implemented optimistic UI updates for status toggles, reverting back to the original state with an error banner if the server request fails.

### Architectural Decisions Made During Enhancement
1. **Layered API abstraction**: Kept API calls outside of UI components inside `src/api/taskApi.js`. This separates concerns and makes backend endpoint changes transparent to UI components.
2. **Unified Modal for Create & Edit**: Used a single modal component (`TaskFormModal`) configured dynamically based on whether an `editingTask` object is present, avoiding code duplication.
3. **Vanilla CSS Design System**: Built a custom design token system in `index.css` featuring dark mode, glassmorphism, responsive flex/grid layouts, and subtle micro-interactions without heavy external CSS frameworks.

---

## Deployment Guide (Firebase, Render & Netlify)

### Deploying Frontend to Firebase Hosting
The frontend is pre-configured with `firebase.json` and `.firebaserc` pointing to project `task8-e5d60`.
- **Live URL**: [https://task8-e5d60.web.app](https://task8-e5d60.web.app)
- **Deploy steps**:
  ```bash
  cd frontend
  npm run build
  cd ..
  firebase deploy --only hosting
  ```

### Deploying Backend to Render
1. Push your repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New > Web Service**.
3. Connect your GitHub repository.
4. Set the following options:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables in Render:
   - `MONGODB_URI`: *Your MongoDB Atlas connection URI*
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or leave default assigned by Render)

---
