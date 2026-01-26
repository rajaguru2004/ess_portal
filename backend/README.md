# ESS Portal Backend

Node.js backend API for ESS Portal built with Express, Prisma ORM, and PostgreSQL.

## 🚀 Features

- **Express.js** - Fast, minimalist web framework
- **Prisma ORM** - Modern database toolkit
- **PostgreSQL** - Powerful relational database
- **Docker** - Containerized deployment
- **Security** - Helmet, CORS, compression middleware
- **Error Handling** - Comprehensive error handling
- **Hot Reload** - Nodemon for development

## 📋 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL (or use Docker)
- npm or yarn

## 🛠️ Installation

### Option 1: Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start PostgreSQL** (if not using Docker):
```bash
# Make sure PostgreSQL is running on port 5432
```

4. **Generate Prisma Client:**
```bash
npm run prisma:generate
```

5. **Run database migrations:**
```bash
npm run prisma:migrate
```

6. **Start development server:**
```bash
npm run dev
```

The server will start at `http://localhost:3000`

### Option 2: Docker Development

1. **Build and start services:**
```bash
docker-compose up --build
```

This will start:
- PostgreSQL on port 5432
- Backend API on port 3000

2. **Stop services:**
```bash
docker-compose down
```

3. **Stop and remove volumes:**
```bash
docker-compose down -v
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Prisma client configuration
│   ├── middleware/
│   │   └── errorHandler.js      # Error handling middleware
│   ├── routes/
│   │   └── index.js             # Main routes
│   └── index.js                 # Application entry point
├── prisma/
│   └── schema.prisma            # Database schema
├── .env.example                 # Environment variables template
├── .gitignore
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:push` - Push schema changes to database
- `npm run prisma:seed` - Seed database with initial data

## 🗄️ Database

### Prisma Commands

**Create a migration:**
```bash
npx prisma migrate dev --name migration_name
```

**Apply migrations in production:**
```bash
npx prisma migrate deploy
```

**Reset database:**
```bash
npx prisma migrate reset
```

**Open Prisma Studio:**
```bash
npm run prisma:studio
```

### Adding Models

Edit `prisma/schema.prisma` to add new models, then run:
```bash
npm run prisma:migrate
```

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | Secret key for JWT tokens | - |
| `JWT_EXPIRY` | JWT token expiration time | `24h` |
| `CORS_ORIGIN` | Allowed CORS origins | `*` |

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns server health status and uptime.

### API Information
```
GET /
```
Returns API information and available endpoints.

### API v1
```
GET /api/v1
```
Base endpoint for v1 API routes.

## 🐳 Docker

### Development
```bash
docker-compose up
```

### Production Build
```bash
docker build -t ess-portal-backend --target production .
docker run -p 3000:3000 --env-file .env ess-portal-backend
```

### Docker Compose Commands
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Execute commands in running container
docker-compose exec backend npm run prisma:studio

# Rebuild services
docker-compose up --build

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

## 🧪 Testing

Access the health endpoint:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "ESS Portal API is running",
  "timestamp": "2026-01-26T12:00:00.000Z",
  "uptime": 123.45,
  "environment": "development"
}
```

## 📝 Next Steps

1. **Add Authentication:**
   - Create auth routes in `src/routes/auth.js`
   - Implement JWT middleware
   - Add user registration/login endpoints

2. **Add Business Logic:**
   - Create controllers in `src/controllers/`
   - Create services in `src/services/`
   - Add route handlers

3. **Expand Database Schema:**
   - Add models for Employee, Attendance, Leave, etc.
   - Create relationships between models
   - Add migrations

4. **Add Validation:**
   - Install validation library (e.g., Joi, express-validator)
   - Add request validation middleware

5. **Add Testing:**
   - Install testing framework (e.g., Jest)
   - Write unit and integration tests

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## 📄 License

ISC
