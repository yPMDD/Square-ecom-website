

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
