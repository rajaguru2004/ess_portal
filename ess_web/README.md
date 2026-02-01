# ESS Portal Admin Panel

A comprehensive Next.js admin panel for the ESS Portal backend. Manages master data, user management, and attendance reporting.

## Features

- **Authentication**: JWT-based login system
- **Master Data Management**: Roles, Departments, Shifts, Leave Types, Holidays, Designations
- **Leave Policy Configuration**: Link roles with leave types
- **User Management**: Create and manage users
- **Attendance Reporting**: View attendance logs with photos

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Credentials

- Username: `admin`
- Password: `AdminPassword123!`

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- React Hook Form + Zod
- Axios
- shadcn/ui components
