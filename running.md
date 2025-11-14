# Running the GoBus Application

This guide provides step-by-step instructions to get the GoBus platform running locally on your machine. The application consists of a Node.js/Express backend and a React/Vite frontend.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: Version 18.x or later.
- **npm**: Should be included with your Node.js installation.
- **MySQL**: A running MySQL server instance. You can use a local installation (like XAMPP, WAMP, MAMP) or a Docker container.

---

## 1. Backend Setup

The backend server connects to the database and provides the API for the application.

### Step 1: Navigate to the Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set up the Database
1.  Start your MySQL server.
2.  Create a new database named `gobus`. You can do this via a GUI tool like phpMyAdmin or by running the following SQL command:
    ```sql
    CREATE DATABASE gobus;
    ```

### Step 4: Configure Environment Variables
1.  In the `backend` directory, copy the example environment file:
    ```bash
    cp .env.example .env
    ```
2.  Open the newly created `.env` file and fill in your MySQL server details. The default values are set for a standard local setup with no password. **You must set a `JWT_SECRET`**.

    ```env
    # ...
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=gobus

    JWT_SECRET=your_super_secret_jwt_key_here
    # ...
    ```

### Step 5: Build and Start the Server for Development
The `dev` script uses `nodemon` to watch for changes and automatically restart the server.

```bash
npm run dev
```

Your backend server should now be running on `http://localhost:5000`.

### Step 6: Seed the Database
To populate the database with initial sample data (users, companies, trips, etc.), run the following command in a separate terminal. This only needs to be done once.

```bash
curl -X POST http://localhost:5000/api/v1/debug/seed
```
This will wipe any existing data and execute the seeding script, making the application fully interactive with pre-loaded data.

---

## 2. Frontend Setup

The frontend is a Vite-powered React application.

### Step 1: Navigate to the Root Directory
If you are in the `backend` directory, go back to the root.
```bash
cd ..
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
1.  Copy the example environment file:
    ```bash
    cp .env.example .env.local
    ```
2.  Open the newly created `.env.local` file and add your VAPID public key. You can generate one using `npx web-push generate-vapid-keys`.

    ```env
    # Replace with your actual VAPID public key
    VITE_VAPID_PUBLIC_KEY=YOUR_VAPID_PUBLIC_KEY_HERE
    ```

### Step 4: Run the Development Server
This command will start the Vite development server, which will automatically proxy API requests to your backend.

```bash
npm run dev
```

Your frontend application should now be accessible at **http://localhost:3000**. The app is now fully functional for development.

---

## 3. Deployment

To run the application in a production-like environment, you need to build the frontend and have the backend serve the static files.

### Step 1: Build the Frontend
Navigate to the project root directory and run the build command.

```bash
# From the root directory
npm run build
```
This will create an optimized build of the React application in a `dist` folder at the project root.

### Step 2: Prepare Backend for Serving
1.  Create a `public` directory inside the `backend` folder if it doesn't exist.
    ```bash
    # From the root directory
    mkdir -p backend/public
    ```
2.  Copy the contents of the frontend's `dist` folder into the `backend/public` folder.
    ```bash
    # On macOS/Linux
    cp -r dist/* backend/public/

    # On Windows (Command Prompt)
    xcopy dist backend/public /E /I /Y
    ```

### Step 3: Run the Backend in Production Mode
Navigate to the `backend` directory and use the `start` script. It is configured to build the TypeScript code and run the server in production mode.

```bash
cd backend
npm start
```

Your unified application is now running on `http://localhost:5000`. The backend will handle all API requests under `/api/v1` and serve the React application for all other routes.
