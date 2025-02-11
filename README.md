# Event Management System Frontend

This is the frontend application for the Event Management System built with Next.js 13+, using the App Router and TypeScript.

## Credentials

- Admin:
- email: <hello_swsiss@gmail.com>
- password: #$4j~!!_2PX4,?B

- User:
- email: <new_user@gmail.com>
- password: TqvF4k=_n8RZgvV

## Getting Started

### Prerequisites

- Node.js 19.0 or later
- Yarn package manager (recommended) or npm

### Installation

1. Clone the repository
2. Navigate to the frontend directory:

```bash
cd frontend
```

1. Install dependencies:

```bash
yarn install
```

### Development

To start the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:3000`

### Build

To create a production build:

```bash
yarn build
```

To start the production server:

```bash
yarn start
```

## Project Structure

```text
frontend/
├── src/
│   ├── app/                 # Next.js 13 App Router pages
│   │   ├── (auth)/         # Authentication related pages
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # User dashboard pages
│   │   └── events/         # Event related pages
│   ├── components/         # Reusable React components
│   ├── lib/                # Utility functions and shared logic
│   └── types/              # TypeScript type definitions
├── public/                 # Static files
└── .env                    # Environment variables (create from .env.example)
```

## Features

- Next.js 13+ App Router
- TypeScript support
- API Routes for backend communication
- Authentication system
- Admin dashboard
- Event management interface
- Real-time updates using WebSocket

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication
NEXT_PUBLIC_AUTH_URL=http://localhost:8000/auth

# WebSocket
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

## Available Scripts

- `yarn dev`: Start development server
- `yarn build`: Create production build
- `yarn start`: Start production server
- `yarn lint`: Run ESLint
- `yarn type-check`: Run TypeScript compiler check
- `yarn test`: Run tests (when implemented)

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details
