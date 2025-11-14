# Expense Management System

An end-to-end Expense Management platform with:
- **Backend**: ASP.NET Core Web API (C#) with layered architecture (Controllers → Services → Repositories → EF Core/DbContext)
- **Frontend**: React (CRA) with component-based pages for Employee, Manager, and Finance roles
- **Automation**: SpecFlow BDD tests (UI with Selenium WebDriver + API health checks)

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Database Setup](#database-setup)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Port Configuration](#port-configuration)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **.NET 8 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js 18+** and **npm** - [Download here](https://nodejs.org/)
- **PostgreSQL 12+** - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/downloads)
- **Modern browser** (Chrome/Edge) for UI and UI tests
- **IDE** (optional): Visual Studio, Visual Studio Code, or Rider

---

## Project Structure

```
Expense-Management-System/
├── FinanceManagementApp/
│   ├── backend/
│   │   └── FinanceManagement/           # ASP.NET Core Web API
│   │       ├── Controllers/             # HTTP endpoints
│   │       ├── Services/                # Business logic
│   │       ├── Repositories/            # Data access layer
│   │       ├── Models/                  # Domain entities
│   │       ├── DTOs/                    # Data transfer objects
│   │       ├── Data/                    # DbContext and database config
│   │       ├── Validators/              # Input validation
│   │       ├── Migrations/              # EF Core migrations
│   │       └── appsettings.json         # Configuration
│   └── frontend/
│       └── finance-management/          # React app
│           ├── src/
│           │   ├── components/          # React components
│           │   │   ├── Employee/        # Employee role components
│           │   │   ├── Manager/         # Manager role components
│           │   │   └── Finance/         # Finance role components
│           │   └── config.js            # API configuration
│           └── package.json
└── FinanceManagement.Automation/         # SpecFlow + Selenium tests
    ├── Features/                        # BDD feature files
    ├── Steps/                           # Step definitions
    └── PageObjects/                     # Page object models
```

---

## Database Setup

### 1. Install PostgreSQL

Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/).

### 2. Create Database

Open PostgreSQL command line (psql) or pgAdmin and run:

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE finance_db;

-- Verify database creation
\l
```

### 3. Configure Connection String

The database connection string is configured in:
- **File**: `FinanceManagementApp/backend/FinanceManagement/appsettings.json`

**Default Configuration:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=finance_db;Username=postgres;Password=Cookie@1439;Pooling=true;"
  }
}
```

**⚠️ Important**: Update the password in `appsettings.json` to match your PostgreSQL password.

**For Production**: Use environment variables or User Secrets instead of hardcoding passwords:
```bash
# Using User Secrets (recommended for development)
cd FinanceManagementApp/backend/FinanceManagement
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=finance_db;Username=postgres;Password=YourPassword;Pooling=true;"
```

### 4. Apply Database Migrations

Navigate to the backend directory and run migrations:

```bash
cd FinanceManagementApp/backend/FinanceManagement

# Install EF Core tools (if not already installed)
dotnet tool install --global dotnet-ef

# Create initial migration (if migrations don't exist)
dotnet ef migrations add InitialCreate

# Apply migrations to database
dotnet ef database update
```

**Note**: If migrations already exist, skip the `migrations add` step and just run `dotnet ef database update`.

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd FinanceManagementApp/backend/FinanceManagement
```

### 2. Restore Dependencies

```bash
dotnet restore
```

### 3. Verify Configuration

Check that `appsettings.json` has the correct database connection string (see [Database Setup](#database-setup)).

### 4. Run the Backend

```bash
dotnet run
```

The API will start on:
- **HTTP**: `http://localhost:5063`
- **HTTPS**: `https://localhost:7086`

**Swagger UI** will be available at:
- `http://localhost:5063/swagger` (HTTP)
- `https://localhost:7086/swagger` (HTTPS)

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd FinanceManagementApp/frontend/finance-management
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Base URL

The frontend is configured to connect to the backend API. The API base URL is set in:
- **File**: `src/config.js`

**Default Configuration:**
```javascript
export const API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:5063";
```

### 4. Run the Frontend

```bash
npm start
```

The React app will start on:
- **URL**: `http://localhost:3000`

The browser should open automatically. If not, navigate to `http://localhost:3000` manually.

---

## Port Configuration

### Default Ports

| Service | Protocol | Port | URL |
|---------|----------|------|-----|
| **Frontend (React)** | HTTP | 3000 | `http://localhost:3000` |
| **Backend API (HTTP)** | HTTP | 5063 | `http://localhost:5063` |
| **Backend API (HTTPS)** | HTTPS | 7086 | `https://localhost:7086` |
| **PostgreSQL** | TCP | 5432 | `localhost:5432` |

### Changing Ports

#### Backend Ports

Edit `FinanceManagementApp/backend/FinanceManagement/Properties/launchSettings.json`:

```json
{
  "profiles": {
    "http": {
      "applicationUrl": "http://localhost:YOUR_PORT"
    },
    "https": {
      "applicationUrl": "https://localhost:YOUR_HTTPS_PORT;http://localhost:YOUR_HTTP_PORT"
    }
  }
}
```

#### Frontend Port

Create a `.env` file in `FinanceManagementApp/frontend/finance-management/`:

```bash
PORT=3001
REACT_APP_API_BASE=http://localhost:5063
```

Then restart the frontend server.

#### PostgreSQL Port

Update the connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=YOUR_PORT;Database=finance_db;Username=postgres;Password=YourPassword;Pooling=true;"
    }
}
```

---

## Environment Variables

### Backend Environment Variables

Set via `appsettings.Development.json` or environment variables:

```bash
# Example: Set connection string via environment variable
export ConnectionStrings__DefaultConnection="Host=localhost;Port=5432;Database=finance_db;Username=postgres;Password=YourPassword;Pooling=true;"
```

### Frontend Environment Variables

Create a `.env` file in `FinanceManagementApp/frontend/finance-management/`:

```bash
# API Base URL
REACT_APP_API_BASE=http://localhost:5063
# OR
REACT_APP_API_BASE_URL=http://localhost:5063

# Frontend Port (optional)
PORT=3000
```

**Note**: After changing environment variables, restart the development server.

---

## Running the Application

### Quick Start (All Services)

1. **Start PostgreSQL** (ensure it's running on port 5432)

2. **Start Backend** (Terminal 1):
   ```bash
   cd FinanceManagementApp/backend/FinanceManagement
   dotnet restore
   dotnet ef database update  # Only needed on first run or after migrations
   dotnet run
   ```

3. **Start Frontend** (Terminal 2):
   ```bash
   cd FinanceManagementApp/frontend/finance-management
   npm install  # Only needed on first run
   npm start
   ```

4. **Access the Application**:
   - Frontend: `http://localhost:3000`
   - Backend API Swagger: `http://localhost:5063/swagger`

### Verify Setup

1. **Backend Health Check**: Visit `http://localhost:5063/swagger` - you should see the Swagger UI
2. **Frontend**: Visit `http://localhost:3000` - you should see the login page
3. **Database**: Verify connection by checking backend logs for any database errors

---

## Testing

### Automation Tests (SpecFlow + Selenium)

Navigate to the automation test project:

```bash
cd FinanceManagement.Automation
```

#### Run All Tests

```bash
dotnet restore
dotnet test
```

#### Run Specific Test Categories

```bash
# Run only UI tests
dotnet test --filter TestCategory=UI

# Run only API tests
dotnet test --filter TestCategory=API
```

#### Prerequisites for UI Tests

- Backend must be running on `http://localhost:5063`
- Frontend must be running on `http://localhost:3000`
- Chrome or Edge browser must be installed

#### Test Configuration

Edit `FinanceManagement.Automation/Config/appsettings.json` to configure:
- Test URLs
- Browser settings (headless mode)
- Timeouts

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors

**Error**: `Npgsql.NpgsqlException: Connection refused`

**Solutions**:
- Verify PostgreSQL is running: `pg_isready` or check services
- Verify connection string in `appsettings.json`
- Check PostgreSQL port (default: 5432)
- Ensure database `finance_db` exists
- Verify username and password are correct

#### 2. Frontend Cannot Connect to Backend

**Error**: `Network Error` or `Failed to fetch`

**Solutions**:
- Verify backend is running on `http://localhost:5063`
- Check CORS configuration in `Program.cs` (should allow `http://localhost:3000`)
- Verify API base URL in `src/config.js` matches backend URL
- Check browser console for detailed error messages

#### 3. Port Already in Use

**Error**: `Address already in use` or `EADDRINUSE`

**Solutions**:
- **Backend**: Change port in `launchSettings.json` or kill the process using the port
- **Frontend**: Change `PORT` in `.env` file or kill the process using port 3000
- **PostgreSQL**: Check if another PostgreSQL instance is running

**Find and kill process on port**:
```bash
# macOS/Linux
lsof -ti:5063 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :5063
taskkill /PID <PID> /F
```

#### 4. Migration Errors

**Error**: `No migrations found` or migration errors

**Solutions**:
- Create initial migration: `dotnet ef migrations add InitialCreate`
- Apply migrations: `dotnet ef database update`
- If database exists with different schema, consider dropping and recreating:
  ```bash
  # ⚠️ WARNING: This will delete all data
  dotnet ef database drop
  dotnet ef database update
  ```

#### 5. npm Install Errors

**Error**: `npm ERR!` or dependency conflicts

**Solutions**:
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- Use Node.js 18+ (check version: `node --version`)

#### 6. CORS Errors

**Error**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solutions**:
- Verify CORS is configured in `Program.cs`:
  ```csharp
  policy.WithOrigins("http://localhost:3000")
  ```
- Ensure backend is running
- Check that frontend URL matches the CORS allowed origin

#### 7. Selenium Test Failures

**Error**: Browser doesn't start or tests fail

**Solutions**:
- Ensure Chrome/Edge is installed and up to date
- Verify backend and frontend are running before tests
- Check `Config/appsettings.json` for correct URLs
- Try running tests in non-headless mode for debugging

---

## Architecture Overview

### Backend Architecture

**Layered Architecture**:
1. **Controllers** → Handle HTTP requests/responses
2. **Services** → Business logic and orchestration
3. **Repositories** → Data access abstraction
4. **DbContext** → Entity Framework Core database access

**Request Flow**:
```
Client → Controller → Service → Repository → DbContext → Database
                ↓
            Validation
                ↓
            DTO Mapping
```

### Frontend Architecture

**Component Structure**:
- Role-based components (`Employee/`, `Manager/`, `Finance/`)
- Shared components and utilities
- API calls via `fetch` using `API_BASE` from `config.js`

**Data Flow**:
```
Component → API Call (fetch) → Backend API → Database
                ↓
        State Update
                ↓
        UI Re-render
```

---

## API Endpoints

### Authentication
- `POST /api/account/login` - User login

### Employee
- `GET /api/employee/*` - Employee-specific endpoints

### Manager
- `GET /api/manager/*` - Manager-specific endpoints
- `POST /api/manager/approve` - Approve expenses

### Finance
- `GET /api/finance/*` - Finance admin endpoints
- `GET /api/finance/reports` - Generate reports

### Reimbursements
- `GET /api/reimbursements` - List reimbursements
- `POST /api/reimbursements` - Create expense
- `PUT /api/reimbursements/{id}` - Update expense

**Full API Documentation**: Visit `http://localhost:5063/swagger` when backend is running.

---

## Development Tips

1. **Hot Reload**: Both frontend (React) and backend (ASP.NET Core) support hot reload during development
2. **Swagger**: Use Swagger UI (`/swagger`) to test API endpoints
3. **Browser DevTools**: Use browser console and network tab to debug frontend issues
4. **Logging**: Check backend console output for detailed error messages
5. **Database Tools**: Use pgAdmin or DBeaver to inspect database directly

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Support

For issues and questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review backend logs and browser console
- Open an issue on GitHub

---

**Happy Coding! 🚀**
