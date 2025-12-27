# GearGuard: Ultimate Maintenance Tracker

## Introduction
The **GearGuard: Ultimate Maintenance Tracker** is a full-stack web application designed to help users track equipment maintenance, schedules, and service history. Built with **React, TypeScript, Node.js, Express, PostgreSQL, and Prisma**, this application provides a comprehensive solution for managing equipment lifecycle and maintenance records.

## Problem Statement
Equipment owners often struggle with:
- Forgotten maintenance schedules leading to equipment failure
- No centralized record of maintenance activities
- Difficulty tracking maintenance costs over time
- Poor visibility into equipment health status
- Lost warranty information due to missing service records

GearGuard solves these problems by providing a centralized platform for equipment management and maintenance tracking.

---

## Features

- **User Authentication**  
  - Secure registration and login with JWT-based authentication  
  - Password encryption using bcrypt  
  - Persistent sessions with token-based authentication  
  - Auto-login functionality

- **Equipment Management**  
  - Add, update, and delete equipment  
  - Categorize equipment (Vehicle, Machinery, Tools, Electronics, Other)  
  - Track purchase dates and equipment status  
  - Add custom notes for each equipment  
  - Visual status indicators (Good, Warning, Critical, Maintenance)

- **Maintenance Tracking**  
  - Log maintenance activities with detailed descriptions  
  - Track maintenance types (Routine, Repair, Inspection, Emergency)  
  - Record maintenance costs  
  - Complete maintenance history for each equipment  
  - Automatic update of last maintenance date

- **Dashboard Analytics**  
  - Real-time statistics of total equipment  
  - Equipment health status overview  
  - Upcoming maintenance alerts with countdown  
  - Recent activity feed  
  - Color-coded warnings for overdue maintenance

- **Responsive Design**  
  - Mobile-friendly interface  
  - Modern UI built with Tailwind CSS  
  - Smooth animations and transitions  
  - Intuitive navigation

- **Data Management**  
  - PostgreSQL database for reliable data storage  
  - Prisma ORM for type-safe database operations  
  - Automatic cascade deletes for data integrity  
  - Indexed queries for optimal performance

---

## Tech Stack

### Frontend
- React 18 (with Vite + TypeScript)  
- Tailwind CSS for styling  
- Axios for HTTP requests  
- Lucide React for icons  
- React Hooks for state management

### Backend
- Node.js with Express.js  
- TypeScript for type safety  
- PostgreSQL database  
- Prisma ORM for database operations  
- JWT for authentication  
- Bcrypt.js for password hashing  
- Zod for schema validation  
- CORS middleware for cross-origin support

---

## Project Structure

```
gearguard-app/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── equipment.controller.ts
│   │   │   └── maintenance.controller.ts
│   │   ├── middleware/         # Auth & validation middleware
│   │   │   ├── auth.middleware.ts
│   │   │   └── validate.middleware.ts
│   │   ├── routes/             # API route definitions
│   │   │   ├── auth.routes.ts
│   │   │   ├── equipment.routes.ts
│   │   │   └── maintenance.routes.ts
│   │   ├── schemas/            # Zod validation schemas
│   │   │   ├── auth.schema.ts
│   │   │   ├── equipment.schema.ts
│   │   │   └── maintenance.schema.ts
│   │   └── server.ts           # Express app entry point
│   ├── prisma/                 # Prisma schema & migrations
│   │   └── schema.prisma
│   ├── .env                    # Environment variables
│   ├── package.json            # Backend dependencies
│   └── tsconfig.json           # TypeScript configuration
│
└── frontend/
    ├── src/
    │   ├── App.tsx             # Main application component
    │   ├── main.tsx            # React DOM entry point
    │   └── index.css           # Global styles with Tailwind
    ├── package.json            # Frontend dependencies
    ├── tailwind.config.js      # Tailwind configuration
    └── vite.config.ts          # Vite configuration
```

---

## Getting Started

Follow the steps below to set up the project locally.

### Clone the repository
```bash
git clone https://github.com/yourusername/gearguard.git
cd gearguard
```

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:  
   Create a `.env` file in `backend/` with the following:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/gearguard"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=3000
   ```
   Replace `username` and `password` with your PostgreSQL credentials.

4. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

6. Start the backend server:
   ```bash
   npm run dev
   ```

By default, the API runs at: **http://localhost:3000**

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend will run at: **http://localhost:5173**

---

## API Endpoints

Base URL: `http://localhost:3000/api`

### Authentication
| Method | Endpoint              | Description          | Auth Required |
|--------|-----------------------|----------------------|---------------|
| POST   | `/auth/register`      | Register a new user  | No            |
| POST   | `/auth/login`         | Login and get token  | No            |

**Register Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Equipment Management
All equipment endpoints require authentication. Include JWT token in header:
```
Authorization: Bearer <your-jwt-token>
```

| Method | Endpoint                | Description                     | Auth Required |
|--------|-------------------------|---------------------------------|---------------|
| POST   | `/equipment`            | Add new equipment               | Yes           |
| GET    | `/equipment`            | Get all user equipment          | Yes           |
| GET    | `/equipment/upcoming`   | Get upcoming maintenance items  | Yes           |
| GET    | `/equipment/:id`        | Get equipment by ID             | Yes           |
| PUT    | `/equipment/:id`        | Update equipment details        | Yes           |
| DELETE | `/equipment/:id`        | Delete equipment                | Yes           |

**Create Equipment Request:**
```json
{
  "name": "Toyota Camry",
  "category": "Vehicle",
  "purchaseDate": "2023-01-15T00:00:00.000Z",
  "nextMaintenance": "2024-02-01T00:00:00.000Z",
  "status": "GOOD",
  "notes": "Company vehicle"
}
```

### Maintenance Logs
| Method | Endpoint                            | Description                         | Auth Required |
|--------|-------------------------------------|-------------------------------------|---------------|
| POST   | `/maintenance`                      | Create maintenance log              | Yes           |
| GET    | `/maintenance`                      | Get all maintenance logs            | Yes           |
| GET    | `/maintenance/equipment/:equipmentId` | Get logs for specific equipment   | Yes           |
| DELETE | `/maintenance/:id`                  | Delete maintenance log              | Yes           |

**Create Maintenance Log Request:**
```json
{
  "equipmentId": "uuid-here",
  "type": "ROUTINE",
  "description": "Oil change and filter replacement",
  "cost": 89.99,
  "date": "2024-01-15T00:00:00.000Z"
}
```

### Query Parameters

**Equipment Filtering:**
- `?category=Vehicle` - Filter by category
- `?status=GOOD` - Filter by status

**Maintenance Log Filtering:**
- `?startDate=2024-01-01T00:00:00.000Z` - Filter logs after date
- `?endDate=2024-12-31T00:00:00.000Z` - Filter logs before date
- `?type=ROUTINE` - Filter by maintenance type

### Error Handling
All error responses follow this format:
```json
{
  "error": "Error message here",
  "details": [
    {
      "path": "body.email",
      "message": "Invalid email address"
    }
  ]
}
```

---

## Database Schema

### User Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `name` (String)
- `password` (String, Hashed)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Equipment Table
- `id` (UUID, Primary Key)
- `name` (String)
- `category` (String)
- `purchaseDate` (DateTime, Optional)
- `lastMaintenance` (DateTime, Optional)
- `nextMaintenance` (DateTime, Optional)
- `status` (Enum: GOOD, WARNING, CRITICAL, MAINTENANCE)
- `notes` (String, Optional)
- `userId` (UUID, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### MaintenanceLog Table
- `id` (UUID, Primary Key)
- `type` (Enum: ROUTINE, REPAIR, INSPECTION, EMERGENCY)
- `description` (String)
- `cost` (Float, Optional)
- `date` (DateTime)
- `equipmentId` (UUID, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Relationships
- One User has many Equipment (One-to-Many)
- One Equipment has many MaintenanceLogs (One-to-Many)
- Cascade delete enabled (deleting equipment removes all its maintenance logs)

---

## Security Features

### Backend Security
- Password hashing with bcrypt (10 salt rounds)
- JWT-based authentication with 7-day expiration
- Input validation using Zod schemas
- SQL injection protection via Prisma ORM
- Authorization middleware on protected routes
- User data isolation (users can only access their own data)
- CORS enabled for secure cross-origin requests

### Frontend Security
- JWT tokens stored in localStorage
- Automatic token injection via Axios interceptors
- Tokens cleared on logout
- Confirmation dialogs for destructive actions
- No sensitive data exposed in error messages

---

## Development Scripts

### Backend
```bash
npm run dev              # Start development server with nodemon
npm run build            # Compile TypeScript to JavaScript
npm start                # Run compiled production code
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
```

### Frontend
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## Use Cases

1. **Personal Use**
   - Track car maintenance schedules
   - Manage home appliances and equipment
   - Keep records for warranty claims

2. **Small Business**
   - Manage company vehicle fleet
   - Track tool and machinery maintenance
   - Monitor equipment health status

3. **Property Management**
   - Schedule HVAC maintenance
   - Track elevator inspections
   - Manage generator service records

4. **IT Department**
   - Monitor server maintenance
   - Track hardware warranty dates
   - Manage equipment replacement cycles

---

## Future Enhancements

- Email notifications for upcoming maintenance
- File upload support for receipts and manuals
- PDF/CSV export functionality
- Analytics dashboard with cost trends
- Mobile application (React Native)
- Team collaboration features
- Calendar integration (Google Calendar)
- Barcode/QR code scanning
- Service provider directory
- Warranty expiration tracking


