# Calendar Hub - Productivity Dashboard

## Overview

Calendar Hub is a productivity-focused calendar dashboard application that integrates with Google Calendar to provide insights into time allocation, meeting analytics, and productivity metrics. The application features a modern React frontend with a clean, Google-inspired design system and an Express.js backend that handles Google OAuth authentication and calendar data synchronization.

The system is designed as a full-stack web application that helps users visualize their calendar data through various charts and metrics, categorize events (focus time, meetings, presentations, admin work, breaks), and track productivity patterns over time.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **Styling**: Tailwind CSS with custom CSS variables for Google-inspired color palette
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for both client and server code
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Google OAuth 2.0 integration for secure calendar access
- **API Design**: RESTful endpoints with JSON responses
- **Development Setup**: Hot reload support with Vite middleware integration

### Data Storage
- **Primary Database**: PostgreSQL with three main entities:
  - `users`: User accounts with Google OAuth tokens
  - `calendars`: Connected Google calendars with metadata
  - `events`: Calendar events with productivity categorization
- **Schema Management**: Drizzle Kit for database migrations and schema versioning
- **Connection**: Neon Database serverless PostgreSQL for cloud deployment
- **Data Validation**: Zod schemas for runtime type checking and API validation

### Authentication & Authorization
- **OAuth Provider**: Google OAuth 2.0 with calendar read permissions
- **Scope Access**: Google Calendar API and user profile information
- **Token Management**: Secure storage of access and refresh tokens with automatic renewal
- **Session Handling**: Cookie-based session management with connect-pg-simple for PostgreSQL session storage

### External Dependencies
- **Google APIs**: Google Calendar API for calendar data synchronization and Google OAuth2 API for user authentication
- **Database Provider**: Neon Database for managed PostgreSQL hosting
- **UI Framework**: Radix UI for accessible component primitives
- **Chart Libraries**: Custom chart components built with SVG for productivity visualizations
- **Development Tools**: Replit integration for cloud development environment with cartographer plugin for enhanced debugging

The application follows a monorepo structure with shared TypeScript schemas between client and server, ensuring type consistency across the full stack. The architecture emphasizes developer experience with hot reload, comprehensive TypeScript coverage, and modern tooling while maintaining a clean separation of concerns between presentation, business logic, and data persistence layers.