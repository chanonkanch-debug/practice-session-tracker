# Practice Session Tracker (Backend API)

## Problem Statement
As a music hobbyist, I struggle with ineffective practice sessions. I often:
- Copy pieces from YouTube without learning to read music
- Practice without structure or time constraints
- Don't track progress or identify weak areas
- Lose motivation without clear goals

This leads to slow improvement in core skills like music theory, note reading, and technique.

## Solution
A practice tracking API that helps musicians:
- Log structured practice sessions
- Track time spent and progress over time
- Identify patterns in their practice
- Build consistent practice habits with statistics and streaks

## MVP Features (v1.0)
- **User Authentication**: Register, login, JWT-based auth
- **Practice Sessions**: Create, read, update, delete sessions
- **Session Details**: Date, duration, instrument, pieces/skills practiced, tempo, notes
- **Practice History**: View all sessions, filter by date/instrument
- **Statistics**: Total time, practice streaks, most practiced items

## Future Features (v2.0+)
- Practice goals and reminders
- Piece library with progress tracking
- Skill categorization (scales, sight-reading, repertoire)
- Music file upload with AI-powered recommendations (***)
- Practice quality self-assessment
- Weekly/monthly progress reports

## Tech Stack
- Node.js + Express
- PostgreSQL
- JWT Authentication

## API Endpoints (Planned)

# Tools
https://chanonkanch.atlassian.net/jira/software/projects/SCRUM/boards/1 - Sprint Tracker
https://docs.google.com/document/d/1YKFNZU7Tqn61gFlygp8R2GU2ws6wPrn2vwslOwfF3H4/edit?tab=t.0 - Sprint Guide

https://supabase.com/dashboard/project/vaqxumzdsbexlhmuuwdi/database/schemas - Database
https://github.com/chanonkanch-debug/practice-session-tracker - Version Control

# INFO FOR MYSELF
STEP 1: Environmental Setup
- Node.js
- PostgreSQL
- Postman (Focusing on backend developement)
- Git

STEP 2: Project Initialization
**Created project structure:**
```
practice-session-tracker/
├── src/
│   ├── config/          # Database config, environment variables
│   ├── models/          # Database models (User, Session, etc.)
│   ├── controllers/     # Business logic for each route
│   ├── routes/          # API route definitions
│   ├── middleware/      # Auth middleware, error handlers
│   └── utils/           # Helper functions
├── .env                 # Environment variables (DON'T commit this)
├── .gitignore
├── package.json
├── README.md
└── server.js            # Entry point


### **src/config/** (Configuration Files)
**What it does:** Centralizes all configuration logic.
**Contains:**
```
config/
├── database.js      # Database connection setup
├── auth.js          # JWT configuration
└── constants.js     # App-wide constants

### **src/models/** (Data Models)
**What it does:** Defines how you interact with database tables.
**Contains:**
```
models/
├── User.js
├── PracticeSession.js
└── SessionItem.js
**Key concept:** Your model is the ONLY place that writes SQL queries for users. If you need to find a user anywhere in your app, you call `User.findByEmail()` - you don't write the SQL query again.

### **src/controllers/** (Business Logic)
**What it does:** Contains the actual logic that handles requests.
**Contains:**
```
controllers/
├── authController.js
├── sessionController.js
└── statsController.js
**Key concept:** Controllers use models to interact with data, then send responses.

### **src/routes/** (API Route Definitions)
**What it does:** Maps URLs to controller functions.
**Contains:**
```
routes/
├── authRoutes.js
├── sessionRoutes.js
└── statsRoutes.js
**Key concept:** Routes are just traffic directors. They say "if someone POSTs to /register, send them to authController.register". They don't contain logic themselves.

### **src/middleware/** (Middleware Functions)
**What it does:** Code that runs BEFORE your controller (intercepts requests).
**Contains:**
```
middleware/
├── authMiddleware.js    # Verify JWT tokens
├── errorHandler.js      # Global error handling
└── validation.js        # Input validation
**Key concept:** Middleware is like a security checkpoint - it checks things before letting requests through to controllers.

### **src/utils/** (Helper Functions)
**What it does:** Reusable utility functions that don't fit elsewhere.
**Contains:**
```
utils/
├── dateHelpers.js       # Date formatting, calculations
├── validators.js        # Input validation functions
└── responseFormatter.js # Standardize API responses
**Key concept:** If you find yourself writing the same code twice, it probably belongs in utils.

1. **Request comes in:** `POST /api/sessions` with JSON data
2. **server.js** receives it and routes it to session routes
3. **routes/sessionRoutes.js** says "send this to sessionController.create, but run authMiddleware first"
4. **middleware/authMiddleware.js** checks if user is logged in (valid JWT)
   - If not: Returns 401 error, stops here
   - If yes: Adds userId to request, continues
5. **controllers/sessionController.js** runs:
   - Validates input data (maybe using utils/validators.js)
   - Calls `PracticeSession.create()` from models
6. **models/PracticeSession.js** runs the SQL query using database config
7. **controllers/sessionController.js** sends response back to user
```
Request → server.js → routes → middleware → controller → model → database
                                                ↓
                                            Response