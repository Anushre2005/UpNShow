# Portfolio MERN Application

A full-stack MERN (MongoDB, Express, React, Node.js) based Portfolio Management System that allows users to create an account, manage their portfolio items, upload files, and share a public view of their work using usernames.

---

## 🚀 Features

### ✅ User Authentication

* User Signup and Login
* JWT-based authentication
* Secure password hashing (bcrypt)

### ✅ Portfolio Management

* Add portfolio items
* Edit existing items
* Delete items
* Toggle public/private visibility

### ✅ File Upload Support

* Upload PDFs, images, documents from laptop
* Files stored in backend `/uploads` directory

### ✅ Public Portfolio View

* View any user's public portfolio by selecting their username
* No MongoDB ID exposure

### ✅ Deployment Ready

* Backend deployed on **Render**
* Frontend deployed on **Vercel**

---

## 🛠 Technology Stack

### Frontend

* React
* React Router DOM
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Multer (file upload)
* JWT
* bcrypt

---

## 📁 Project Structure

```
wp-mini-project/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── styles.css
│   └── package.json
│
└── README.md
```

---

## 🔗 API Endpoints

### Authentication

* POST /api/auth/register
* POST /api/auth/login
* GET /api/auth/me
* GET /api/usernames

### Portfolio

* POST /api/portfolio
* GET /api/portfolio
* GET /api/portfolio/user/:username
* PUT /api/portfolio/:id
* DELETE /api/portfolio/:id

Total: **9 API Endpoints**

---

## ⚙️ Local Setup Instructions

### 1️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Run backend:

```
npm start
```

---

### 2️⃣ Frontend Setup

```
cd frontend
npm install
```

Create `.env` file:

```
VITE_API_URL=http://localhost:3000/api
```

Run frontend:

```
npm run dev
```

---

## 🌍 Deployment

### Backend (Render)

* Create Web Service
* Root Directory: backend
* Build Command: npm install
* Start Command: node server.js

Environment Variables:

```
MONGO_URI = your_mongodb_uri
JWT_SECRET = your_secret
CLIENT_URL = https://your-vercel-url
```

---

### Frontend (Vercel)

* Root Directory: frontend
* Framework: Vite / React
* Env Variable:

```
VITE_API_URL = https://your-render-url/api
```

---

## 🔐 Middleware Used

| Middleware   | Purpose                              |
| ------------ | ------------------------------------ |
| JWT Auth     | Protect routes                       |
| Multer       | Handle file uploads                  |
| CORS         | Allow frontend-backend communication |
| express.json | Parse JSON data                      |

---

## ⚛ React Hooks Used

* useState
* useEffect
* useNavigate
* useParams

Total Hook Calls: 24

---

## 👨‍💻 How It Works

1. User signs up or logs in
2. JWT token is issued
3. User accesses portfolio dashboard
4. User adds/uploads portfolio items
5. Public users can view shared portfolios via username dropdown

---

## 🧪 Testing Checklist

* Signup working ✅
* Login working ✅
* File upload ✅
* Edit/Delete ✅
* Public view ✅
* Dropdown username ✅

---

## 📌 Future Improvements

* Cloud storage integration (Cloudinary / Firebase)
* Admin panel
* User profile customization
* Theme selection
* Analytics dashboard

---

## 👥 Developed By

### 📝 Project Note

This is my **first complete full-stack web development project**, where I designed, developed, and integrated both the backend and frontend from scratch. The project demonstrates my learning journey in connecting server-side logic with client-side interfaces, handling database operations, implementing authentication, and ensuring smooth communication between frontend and backend using RESTful APIs.

It reflects my practical understanding of end-to-end web development, including deployment and real-world integration practices.

---

## 👥 Developed By

Mini Project - MERN Stack Portfolio System

---

## ✅ Conclusion

This project demonstrates a complete MERN stack implementation with authentication, secure APIs, real-time CRUD operations, and professional deployment practices suitable for academic and real-world use.

---

Feel free to fork, modify and enhance this project 🚀
