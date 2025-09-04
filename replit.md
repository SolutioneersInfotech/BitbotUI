# Overview

TradePro is a comprehensive commodities trading platform built with React frontend and Express.js backend. The application provides users with real-time market data, technical analysis tools, portfolio management, and trading capabilities for various commodities including precious metals (Gold, Silver) and energy products (Oil, Natural Gas). The platform features a modern dark-themed trading interface with subscription-based access tiers and integrated customer support.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built using React with TypeScript, utilizing a modern component-based architecture:

- **UI Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **Styling**: Tailwind CSS with custom design system and shadcn/ui components
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Build Tool**: Vite for fast development and optimized production builds

The frontend follows a modular structure with separate concerns for trading components, UI components, hooks, and utilities. Protected routes ensure authenticated access to trading features.

## Backend Architecture
The server-side is built on Node.js with Express.js following RESTful API principles:

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js for HTTP server and middleware
- **Authentication**: Passport.js with local strategy and session-based auth
- **Session Management**: Express sessions with PostgreSQL store for persistence
- **Password Security**: Node.js crypto module with scrypt for secure password hashing
- **API Design**: RESTful endpoints with proper HTTP status codes and error handling

## Database Layer
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations:

- **Database**: PostgreSQL via Neon serverless hosting
- **ORM**: Drizzle ORM with TypeScript integration
- **Schema**: Comprehensive schema covering users, portfolios, trades, commodities, technical indicators, support tickets, and trading strategies
- **Migrations**: Drizzle Kit for database schema management and versioning
- **Connection**: Connection pooling with @neondatabase/serverless for optimal performance

## Key Data Models
- **Users**: Authentication and subscription management
- **Portfolios**: User account balances and performance tracking
- **Trades**: Long/short positions with P&L calculations
- **Commodities**: Market data for Gold, Silver, Oil, Natural Gas
- **Technical Indicators**: RSI, MACD, SMA, EMA calculations
- **Trading Strategies**: User-configurable trading algorithms
- **Support Tickets**: Customer service and issue tracking

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for frontend state management
- **Node.js Backend**: Express.js, TypeScript execution via tsx
- **Database**: PostgreSQL via Neon, Drizzle ORM, connection pooling
- **Authentication**: Passport.js with local strategy, express-session
- **Validation**: Zod for runtime type checking and validation

## UI and Styling Dependencies
- **Design System**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Icons**: Lucide React for consistent iconography
- **Charts**: Chart.js for financial data visualization
- **Carousel**: Embla Carousel for interactive UI elements

## Development and Build Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Development**: Replit-specific plugins for runtime error handling
- **Type Checking**: TypeScript with strict configuration
- **Database Tools**: Drizzle Kit for migrations and schema management
- **Session Storage**: connect-pg-simple for PostgreSQL session store

## Utility Libraries
- **Date Handling**: date-fns for date manipulation and formatting
- **Class Management**: clsx and tailwind-merge for conditional styling
- **Form Handling**: React Hook Form with Hookform resolvers
- **Unique IDs**: nanoid for generating unique identifiers
- **WebSocket**: ws for real-time data connections (Neon requirement)