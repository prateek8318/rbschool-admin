# RB School Admin

A comprehensive school management system built with React, TypeScript, and Vite. This admin dashboard provides a modern interface for managing various aspects of school operations including students, teachers, classes, attendance, exams, fees, and announcements.

## Features

- **Dashboard**: Overview with key metrics and statistics
- **Student Management**: Add, edit, and manage student records
- **Teacher Management**: Faculty administration and management
- **Class Management**: Organize and manage academic classes
- **Attendance Tracking**: Monitor and record student attendance
- **Exam Management**: Schedule and manage examinations
- **Fee Management**: Track and manage student fees and payments
- **Announcements**: Create and manage school announcements
- **Settings**: System configuration and preferences

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack React Query
- **UI Components**: Custom components with Lucide React icons
- **Charts**: Recharts for data visualization
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/prateek8318/rbschool-admin.git
   cd rbschool-admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Update .env with your API endpoints and configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── api/           # API configuration and endpoints
├── components/    # Reusable UI components
├── pages/         # Page components
├── router/        # Routing configuration
├── store/         # State management
├── types/         # TypeScript type definitions
└── assets/        # Static assets
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=your_api_base_url
VITE_APP_NAME=RB School Admin
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
