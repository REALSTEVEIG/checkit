# **Order and Chat Management API**

A backend project built with TypeScript and NestJS, offering APIs for managing orders, a real-time chat system, and user authentication.

---

## **Features**
- **Authentication**: JWT-based authentication with role-based access (Admin/Regular users).
- **Order Management**: Create, update, and fetch orders. 
- **Chat System**: Real-time chat with WebSocket and persistent message storage.
- **API Documentation**: Swagger and Postman documentation available.

---

## **Getting Started**

### **1. Clone the Repository**
```bash
git clone <repository_url>
cd <repository_directory>
```

### **2. Set Up Environment Variables**
Create a `.env` file in the project root:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/checkit
JWT_SECRET=default_secret
```

### **3. Install Dependencies**
```bash
npm install
```

### **4. Run the Application**
- **Development**: 
  ```bash
  npm run dev
  ```
- **Production**:
  ```bash
  npm run start
  ```

---

## **API Documentation**
- **Swagger**: [http://localhost:3000/api](http://localhost:3000/api)  
- **Postman**: [View Documentation](https://documenter.getpostman.com/view/25652727/2sAYJ7gJx8)

---

## **Database**
This project uses PostgreSQL with Prisma ORM. Ensure your database connection string is correctly set in the `.env` file.  

Run migrations with:
```bash
npx prisma migrate dev
```

---

## **Testing**
Run tests with:
```bash
npm run test
```

---

## **Core Functionality**
### **Authentication**
- User login with JWT token generation.
- Role-based access (Admin, Regular user).

### **Order Management**
- Create orders.
- Admin-only order status updates (e.g., Review ➔ Processing ➔ Completed).
- Fetch orders by user.

### **Chat System**
- Real-time chat with WebSocket.
- Persistent chat history.
- Admins can close chat rooms.

---

## **Contributing**
1. Fork the repository.  
2. Create a new branch.  
3. Make your changes and open a pull request.

