# Task Management App

This repository contains the source code for a task management application with separate frontend and backend projects.

## Prerequisites

- Node.js (https://nodejs.org/)
- npm (comes with Node.js)
- Yarn (https://yarnpkg.com/)

## Installation

To install the dependencies for both the frontend and backend projects, run the following command in the root directory:

```bash
npm run install-all
```

To install the dependencies for the frontend project only, run:

```bash
npm run install-frontend
```

To install the dependencies for the backend project only, run:

```bash
npm run install-backend
```

## Environment Variables

The project uses environment variables to configure various settings. Create a .env file in the root directory and add the following variables:

### Backend Environment Variables

```bash
# backend .env
DATABASE_URL=postgresql://postgres:password@db:5432/nestdb
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/redirect
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables

```bash
# frontend .env
VITE_BACKEND_URL=http://localhost:3000
```

## Running the Application

To start both the frontend and backend projects together, run the following command in the root directory:

```bash
npm run start-all
```

To start the frontend project only, run:

```bash
npm run start-frontend
```

To start the backend project only, run:

```bash
npm run start-backend
```

## Running with Docker

Build the Docker images:

```bash
docker-compose build
```


Start the containers:

```bash
docker-compose up
```

The frontend will be available at http://localhost:5173 and the backend at http://localhost:3000.



## Project Structure

- frontend/: Contains the frontend source code.
- backend/: Contains the backend source code.
