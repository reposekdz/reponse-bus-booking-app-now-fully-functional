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
2.  Create a new database named `gobus`.
    ```sql
    CREATE DATABASE gobus;
    ```

### Step 4: Configure Environment Variables
1.  Create a new file named `.env` in the `backend` directory.
2.  Copy the following content into it. Replace the placeholder values if your MySQL setup is different.

    ```env
    # Server Configuration
    PORT=5000

    # Database Configuration
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=gobus

    # JWT Configuration
    JWT_SECRET=your_super_secret_jwt_key
    JWT_EXPIRES_IN=30d
    ```

### Step 5: Build and Start the Server
The `start` script is configured to automatically build the project first.

```bash
npm start
```

Your backend server should now be running on `http://localhost:5000`.

### Step 6: (Optional) Seed the Database
To populate the database with initial sample data (users, companies, trips, etc.), run the following command in a separate terminal:

```bash
curl -X POST http://localhost:5000/api/v1/debug/seed
```
This will execute the seeding script, making the application fully interactive with pre-loaded data.

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

### Step 3: Run the Development Server
This command will start the Vite development server, which will automatically proxy API requests to your backend.

```bash
npm run dev
```

Your frontend application should now be accessible at **http://localhost:3000**. The app is now fully functional.

### Production Build (For Reference)
To create a production-optimized build of the frontend:
```bash
# Build the application
npm run build

# Preview the production build locally
npm run preview
```
The optimized files will be located in the `dist` folder.
