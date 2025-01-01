# Backend API for Order and Chat Management

## Overview
This backend project provides APIs for managing orders, a real-time chat system, and user authentication. It is built using TypeScript and NestJS and follows best practices for API development.

## Features
- **Authentication**: JWT-based authentication with role-based access control.
- **Order Management**:
  - Create orders.
  - Update order statuses (Admin only).
  - Fetch orders by user.
- **Chat System**:
  - Real-time chat using WebSocket.
  - Back messaging using http.
  - Chat rooms automatically created for each order.
  - Admins can close chat rooms with a summary.
  - Persistent message storage.
- **Documentation**:
  - Swagger: Access at [http://localhost:3000/api](http://localhost:3000/api).
  - Postman: [View Documentation](https://documenter.getpostman.com/view/25652727/2sAYJ7gJx8).

## Getting Started

### Clone the Repository
```bash
git clone <repository_url>
cd <repository_directory>
```

### Environment Variables
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/checkit
JWT_SECRET=default_secret
```

### Install Dependencies
```bash
npm install
```

### Run the Application
#### Development Mode:
```bash
npm run dev
```
#### Production Mode:
```bash
npm run start
```

### API Documentation
- **Swagger**: [http://localhost:3000/api](http://localhost:3000/api).
- **Postman**: [Documentation Link](https://documenter.getpostman.com/view/25652727/2sAYJ7gJx8).

## Database
This project uses PostgreSQL with Prisma ORM. Ensure the database connection string is correctly set in the `.env` file. Use the following command to apply migrations:
```bash
npx prisma migrate dev
```

## Tests
```bash
npn run test
```

## Key Functionalities
1. **Authentication**
   - Login to obtain a JWT token.
   - Role-based access for users (Admin and Regular users).

2. **Order Management**
   - Create orders (Regular users).
   - Update order status: Review ➔ Processing ➔ Completed (Admins).
   - Fetch user-specific orders.

3. **Chat System**
   - Real-time communication using WebSocket.
   - Chat history is saved persistently.
   - Only Admins can close chat rooms.

4. **Testing**
   - Integration tests (coverage required as per the technical requirements).

## Contributing
1. Fork the repository.
2. Create a new branch for your feature/bug fix.
3. Commit changes and open a pull request.

