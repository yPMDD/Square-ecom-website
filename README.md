# 🟦 Square — E-commerce Platform

**Square** is a full-stack e-commerce platform built using **Node.js**, **Express.js**, **MySQL**, and modern frontend tools like **Tailwind CSS** and **Alpine.js**.  
It offers a clean, responsive UI and essential features for building your own online store or learning full-stack web development.

---

## ✨ Features

- 🔍 **Product Search & Filtering** — Find products quickly by category or keyword  
- 🛒 **Cart Management** — Add, remove, and update cart items with real-time feedback  
- 💳 **Stripe Payments Integration** — Secure checkout with real Stripe API integration  
- 📦 **Backend Built with Express.js** — Modular and scalable API structure  
- 🎨 **Tailwind & Alpine.js Frontend** — Lightweight, responsive UI with modern design practices

---

## ⚙️ Tech Stack

- **Frontend**: Tailwind CSS, Alpine.js  
- **Backend**: Node.js, Express.js  
- **Database**: MySQL  
- **Payments**: Stripe API

---
## 📸 Demo Screenshots

### 🏠 Homepage
![Homepage](./public/assets/squareHomePage.png)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/square.git
cd square

# Install backend dependencies
npm install

# Configure your MySQL DB and .env file
cp .env.example .env
# Add your DB credentials and Stripe keys
```



## Create the Tables that you will need
```bash
-- USERS table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user VARCHAR(255),
    email VARCHAR(255),
    mdp VARCHAR(255),
    regl_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS table
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(255),
    name VARCHAR(255),
    price DECIMAL(10, 2),
    inStock BOOLEAN,
    quantity INT,
    image TEXT
);

-- ORDERS table
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    cost DECIMAL(10, 2),
    name VARCHAR(255),
    email VARCHAR(255),
    city VARCHAR(255),
    address TEXT,
    phone VARCHAR(20),
    date DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ORDERS_ITEMS table
CREATE TABLE orders_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT,
    product_id BIGINT,
    product_name VARCHAR(255),
    product_price DECIMAL(10, 2),
    product_img VARCHAR(255),
    product_quantity INT,
    order_date DATETIME,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```


## Run the backend server
```bash
node server.js

# Visit your app at http://localhost:3000
```
