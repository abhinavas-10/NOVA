<div align="center">

# NØVA

### Premium Fashion E-Commerce Platform

A modern full-stack fashion e-commerce application built with React, TypeScript, Django, and Django REST Framework.

</div>

---

## 🌐 Live Demo

### Frontend

https://nova-fashion-house.vercel.app/

### Backend API

https://nova-backend-hg36.onrender.com/api/products/

---

## 📖 About The Project

**NØVA** is a modern full-stack fashion e-commerce platform focused on premium streetwear and contemporary fashion.

The application allows users to explore different fashion collections, view product details, manage their wishlist and shopping cart, authenticate their accounts, and manage orders.

The frontend communicates with a Django REST API backend to provide dynamic product data and e-commerce functionality.

---

## ✨ Features

### 🛍️ Product Experience

- Premium fashion product catalog
- Men's collection
- Women's collection
- Unisex collection
- Streetwear collection
- Sneakers collection
- Accessories collection
- New Drops section
- Coming Soon products
- Product search and filtering
- Product detail pages
- Product image gallery
- Hover image preview
- Product variants
- Size and color selection

### ❤️ User Features

- User authentication
- Wishlist management
- Shopping cart
- Add and remove products
- Quantity management
- Order management

### ⚙️ Technical Features

- Django REST API
- Dynamic product data
- Product image management
- Cloud-based media storage
- Responsive design
- RESTful API architecture
- Frontend and backend deployment

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | User Interface |
| TypeScript | Type Safety |
| Vite | Frontend Build Tool |
| Tailwind CSS | Styling |
| TanStack Router | Client-side Routing |
| Lucide React | Icons |

### Backend

| Technology | Purpose |
|---|---|
| Python | Backend Language |
| Django | Web Framework |
| Django REST Framework | REST API |
| JWT | Authentication |
| Gunicorn | Production Server |

### Database & Storage

| Technology | Purpose |
|---|---|
| MySQL | Local Database |
| PostgreSQL | Production Database |
| Cloudinary | Product Image Storage |

### Deployment

| Platform | Purpose |
|---|---|
| Vercel | Frontend Deployment |
| Render | Backend Deployment |
| GitHub | Version Control |

---

## 📂 Project Structure

```text
NOVA/
│
├── backend/
│   │
│   ├── cart/                    # Shopping cart functionality
│   ├── config/                  # Django project configuration
│   ├── members/                 # User authentication and accounts
│   ├── orders/                  # Order management
│   ├── products/                # Products and categories
│   ├── wishlist/                # Wishlist functionality
│   │
│   ├── media/                   # Product media files
│   ├── staticfiles/             # Django static files
│   ├── manage.py
│   └── requirements.txt
│
├── public/
│   ├── coming-soon.png
│   └── nova-logo.png
│
├── src/
│   ├── components/              # Reusable React components
│   ├── lib/                     # Utility functions
│   ├── routes/                  # Application routes
│   ├── services/                # API services
│   ├── store/                   # Application state management
│   └── types/                   # TypeScript types
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🔌 API Integration

The React frontend communicates with the Django REST API.

Example API endpoint:

```text
GET /api/products/
```

Production API:

```text
https://nova-backend-hg36.onrender.com/api/products/
```

---

## 💻 Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/abhinavas-10/NOVA.git
```

```bash
cd NOVA
```

---

## 🎨 Frontend Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:8080
```

---

## ⚙️ Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

### Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file and configure your database settings.

Run migrations:

```bash
python manage.py migrate
```

Start the Django server:

```bash
python manage.py runserver
```

The backend will run on:

```text
http://127.0.0.1:8000
```

---

## 🚀 Deployment

### Frontend

The React frontend is deployed on **Vercel**.

**Live Website:**

https://nova-fashion-house.vercel.app/

### Backend

The Django REST API is deployed on **Render**.

**API:**

https://nova-backend-hg36.onrender.com/api/products/

---

## 📸 Main Modules

- Home Page
- New Drops
- Men's Collection
- Women's Collection
- Unisex Collection
- Product Details
- Wishlist
- Shopping Cart
- Authentication
- Orders

---

## 🔮 Future Improvements

- Payment gateway integration
- Product reviews and ratings
- Admin analytics dashboard
- Order tracking
- Email notifications
- Discount and coupon system
- Improved inventory management
- Recommendation system
- AI-powered fashion recommendations

---

## 👨‍💻 Author

**Abhinav A S**

- GitHub: https://github.com/abhinavas-10

---

<div align="center">

### ⭐ If you like this project, consider giving it a star!

Built with ❤️ using React, TypeScript, Django, and Django REST Framework.

</div>
