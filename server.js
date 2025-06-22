const stripe = require("stripe");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const mysql = require("mysql2");
const mysql2 = require("mysql2/promise");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(
	session({
		secret: "your_secret_key",
		resave: false,
		saveUninitialized: true,
	})
);
dbConfig = {
	host: "localhost",
	user: "root",

	database: "square",
};

const con = mysql.createConnection({
	host: "localhost",
	user: "root",

	database: "square",
});

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use((req, res, next) => {
	// Initialize session cart and count if they don't exist
	if (!req.session.cart) {
		req.session.cart = [];
	}
	if (req.session.count === undefined) {
		req.session.count = req.session.cart.length;
	}
	next();
});

app.use((req, res, next) => {
	res.locals.flash = req.session.flash;
	delete req.session.flash; // Clear after displaying
	next();
});

app.listen(3000, () => {
	console.log("Server running on port http://localhost:3000 ");
});
//localhost:3000
app.get("/", function (req, res) {
	console.log("connected to db successfully...");
	con.query("SELECT * FROM products", (err, result) => {
		if (err) {
			console.error("Error fetching data from the database:", err);
			return;
		} else {
			req.session.cartCount = req.session.cart.length;
			res.render("pages/index", {
				result: result,
				user: req.session.user,
				count: req.session.count,
			});

			console.log("got items from db succesfully");
		}
	});
});
app.get("/index", function (req, res) {
	con.query("SELECT * FROM products", (err, result) => {
		if (err) {
			console.error("Error fetching data from the database:", err);
			return;
		} else {
			req.session.count = req.session.cart.length;
			res.render("pages/index", {
				result: result,
				user: req.session.user,
				count: req.session.count,
			});
			console.log("got items from db succesfully");
		}
	});
});

app.get("/product_info", function (req, res) {
	const infos = req.session.productInfo;

	if (!infos) {
		console.log(infos);
		return res.redirect("/"); // If no product info in session, redirect to home
	}
	req.session.count = req.session.cart.length;
	res.render("pages/product_info", {
		product: infos,
		user: req.session.user,
		count: req.session.count,
	});
});
app.post("/product_info", function (req, res) {
	req.session.productInfo = {
		id: req.body.id,
		img: req.body.img,
		title: req.body.title,
		price: req.body.price,
	};
	req.session.count = req.session.cart.length;
	res.redirect("/product_info");
});

function isProductInCart(cart, id) {
	cart.forEach((c) => {
		if (c.id == id) return true;
	});
	return false;
}

function calculatetotal(cart, req) {
	let total = 0;
	for (let i = 0; i < cart.length; i++) {
		total += cart[i].price * cart[i].quantity;
	}
	req.session.total = total;
	return total;
}
app.get("/cart", function (req, res) {
	// Initialize cart and total if not already set

	if (!req.session.total) {
		req.session.total = 0; // Initialize as 0
	}

	let cart = req.session.cart;
	let total = req.session.total;

	req.session.count = req.session.cart.length;
	res.render("pages/cart", {
		cart: cart,
		total: total,
		user: req.session.user,
		count: req.session.count,
	});
});

app.post("/quan", (req, res) => {
	req.session.quantity = parseInt(req.body);
});

app.post("/add", function (req, res) {
	if (req.session.user) {
		const id = req.body.id;
		const price = parseFloat(req.body.price);
		const name = req.body.title;
		const quantity = req.body.quantity;
		const img = req.body.img;

		const product = {
			id: id,
			price: price,
			name: name,
			quantity: quantity,
			img: img,
		};

		// Initialize cart if it doesn't exist
		if (!req.session.cart) {
			req.session.cart = [];
		}

		const cart = req.session.cart;

		if (!isProductInCart(cart, product.id)) {
			cart.push(product);
		} else {
			// Update quantity of the existing product
			cart.forEach((item) => {
				if (item.id === product.id) {
					item.quantity += product.quantity; // Increment quantity
				}
			});
		}

		calculatetotal(cart, req);
		req.session.count = req.session.cart.length;
		res.redirect("/cart");
	} else {
		req.session.count = req.session.cart.length;
		req.session.flash = { type: "fail", message: "Login to place an order" };
		res.redirect("/login");
	}
});

app.post("/fastadd", function (req, res) {
	if (req.session.user) {
		const id = req.body.id;
		const price = parseFloat(req.body.price);
		const name = req.body.title;

		const quantity = req.body.quantity;
		const img = req.body.img;

		const product = {
			id: id,
			price: price,
			name: name,
			quantity: quantity,
			img: img,
		};
		console.log(product);

		// Initialize cart if it doesn't exist
		if (!req.session.cart) {
			req.session.cart = [];
		}

		const cart = req.session.cart;

		if (!isProductInCart(cart, product.id)) {
			cart.push(product);
		} else {
			// Update quantity of the existing product
			cart.forEach((item) => {
				if (item.id === product.id) {
					item.quantity += product.quantity; // Increment quantity
				}
			});
		}
		req.session.count = req.session.cart.length;
		calculatetotal(cart, req);
		req.session.flash = { type: "success", message: "Item added to cart !" };
		res.redirect("/");
	} else {
		req.session.count = req.session.cart.length;
		req.session.flash = { type: "fail", message: "Login to place an order" };
		res.redirect("/login");
	}
});

app.post("/cart/delete", function (req, res) {
	const productId = req.body.id;

	if (req.session.cart) {
		// Remove the product with the matching ID
		req.session.cart = req.session.cart.filter(
			(product) => product.id !== productId
		);

		calculatetotal(req.session.cart, req);
	}
	req.session.count = req.session.cart.length;
	req.session.flash = { type: "success", message: "Item removed from cart !" };
	res.redirect("/cart");
});

app.get("/checkout", (req, res) => {
	// let haveacc = req.session.haveacc;
	// if(haveacc){
	//   res.render('pages/checkout')
	// }
	// else{
	//     res.redirect('pages/umustsignup');
	// }
	res.render("pages/checkout");
});
app.post("/place_order", (req, res) => {});

const domain = process.env.domain;
const stripegateway = stripe(process.env.stripe_api);

app.post("/checkout", async (req, res) => {
	const lineItems = req.session.cart.map((item) => {
		const unitAmount = Math.round(parseFloat(item.price) * 100);
		if (isNaN(unitAmount)) {
			throw new Error(`Invalid price for item: ${JSON.stringify(item)}`);
		}

		const imgs = `${item.img}`;
		console.log("item-price", item.price);
		if (!item.img) {
			console.error("Missing image for item:", item);
		}
		console.log("inutAmount", unitAmount);
		return {
			price_data: {
				currency: "MAD",
				product_data: {
					name: item.name,
					images: [imgs],
				},
				unit_amount: unitAmount,
			},
			quantity: item.quantity,
		};
	});

	console.log("lineItems:", lineItems);

	//create checkout session
	const session = await stripegateway.checkout.sessions.create({
		payment_method_types: ["card"],
		mode: "payment",
		success_url: `${domain}/success`,
		cancel_url: `${domain}/cart`,
		line_items: lineItems,
	});
	console.log(session.url);
	res.redirect(session.url);
});

//succes get
app.get("/success", async (req, res) => {
	try {
		const conn = {
			host: "localhost",
			user: "test",
			password: "test",
			database: "square",
		};
		let connection = await mysql2.createConnection(conn);

		// Ensure session variables exist
		if (!req.session.user || !req.session.cart) {
			req.session.flash = {
				type: "error",
				message: "Session expired. Try again!",
			};
			req.session.count = req.session.cart.length;
			return res.redirect("/");
		}

		// Insert order
		const [result] = await connection.execute(
			"INSERT INTO orders (user_id, cost, name, email) VALUES (?, ?, ?, ?)",
			[
				req.session.user.id,
				req.session.total,
				req.session.user.user,
				req.session.user.email, // Changed from req.session.email
			]
		);

		// Insert order items
		for (const item of req.session.cart) {
			await connection.execute(
				`INSERT INTO orders_items (order_id, product_id, product_name, product_price, product_img, product_quantity) 
				 VALUES (?, ?, ?, ?, ?, ?)`,
				[
					result.insertId,
					item.id,
					item.name,
					item.price,
					item.img,
					item.quantity,
				]
			);
		}

		// Clear session data
		req.session.cart = [];
		req.session.total = 0;

		// Set success message
		req.session.flash = { type: "success", message: "Payment successful!" };

		// Close connection
		await connection.end();
		req.session.count = req.session.cart.length;
		// Redirect to homepage
		res.redirect("/");
	} catch (error) {
		console.error("Error processing order:", error);
		req.session.flash = {
			type: "error",
			message: "An error occurred. Please try again.",
		};
		req.session.count = req.session.cart.length;
		res.redirect("/");
	}
});

// Route for handling POST requests
app.post("/register", async (req, res) => {
	const { user: username, email, mdp } = req.body;

	const conn = {
		host: "localhost",
		user: "test",
		password: "test",
		database: "square",
	};

	let connection;
	try {
		// Establish database connection
		connection = await mysql2.createConnection(conn);

		// Check if the email already exists
		const [emailExists] = await connection.execute(
			"SELECT email FROM users WHERE email = ?",
			[email]
		);

		if (emailExists.length > 0) {
			req.session.flash = { type: "fail", message: "Email already exists" };
			return res.redirect("/signup");
		}

		// Check if the username already exists
		const [userExists] = await connection.execute(
			"SELECT user FROM users WHERE user = ?",
			[username]
		);

		if (userExists.length > 0) {
			req.session.flash = { type: "fail", message: "Username already exists" };
			return res.redirect("/signup");
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(mdp, 10);

		// Insert new user into the database
		const [result] = await connection.execute(
			"INSERT INTO users (user, email, mdp) VALUES (?, ?, ?)",
			[username, email, hashedPassword]
		);

		const [rows] = await connection.execute(
			"SELECT * FROM users WHERE email = ?",
			[email]
		);

		req.session.email = email;
		req.session.user = rows[0];
		if (result.affectedRows > 0) {
			let WelcoemMsg = "Welcome " + username;
			req.session.flash = { type: "success", message: WelcoemMsg };
			return res.redirect("/");
		} else {
			req.session.flash = {
				type: "fail",
				message: "Registration failed try again ",
			};
			return res.redirect("/signup");
		}
	} catch (err) {
		console.error("Server error:", err);
		return res.status(500).send("Server error.");
	} finally {
		// Ensure the database connection is always closed
		if (connection) {
			await connection.end();
		}
	}
});

app.get("/signup", (req, res) => {
	res.render("pages/signup");
});

app.get("/login", (req, res) => {
	res.render("pages/login");
});

app.post("/login", async (req, res) => {
	const email = req.body.email;
	const mdp = req.body.mdp;

	const conn = {
		host: "localhost",
		user: "test",
		password: "test",
		database: "square",
	};

	try {
		const connection = await mysql2.createConnection(conn);

		const [rows] = await connection.execute(
			"SELECT * FROM users WHERE email = ?",
			[email]
		);

		if (rows.length > 0) {
			const user = rows[0];
			const hashedPassword = user.mdp;
			req.session.user = user;
			console.log(user);
			console.log(req.session.user);
			let WelcomeMsg = "Welcome " + user.user;
			// Verify the password
			const isPasswordValid = await bcrypt.compare(mdp, hashedPassword);
			if (isPasswordValid && user.user == "admin") {
				req.session.count = req.session.cart.length;
				req.session.flash = { type: "success", message: WelcomeMsg };
				res.redirect("/dashboard");
			} else if (isPasswordValid) {
				req.session.count = req.session.cart.length;
				req.session.flash = { type: "success", message: WelcomeMsg };
				res.redirect("/");
			} else {
				req.session.count = req.session.cart.length;
				req.session.flash = { type: "fail", message: "Password invalid" };
				res.redirect("/login");
			}
		} else {
			// Email not found
			req.session.count = req.session.cart.length;
			req.session.flash = { type: "fail", message: "Email invalid" };
			res.redirect("/login");
		}

		// Close the connection
		await connection.end();
	} catch (error) {
		console.error("Database error:", error);
		res.status(500).send("Database error");
	}
});

app.get("/login", (req, res) => {
	res.render("pages/login");
});
app.get("/profile", async (req, res) => {
	if (!req.session.cart) {
		req.session.cart = []; // Initialize cart if undefined
	}
	req.session.cartCount = req.session.cart.length;
	// Initialize userInfo
	let userInfo = {};
	if (req.session.user) {
		const date = req.session.user.regi_time;

		userInfo = {
			id: req.session.user.id, // Ensure this is the correct property
			user: req.session.user.user,
			email: req.session.user.email,
			regi_time: date.substring(0, 10),
		};
	}

	// Check if user is logged in
	if (!req.session.user) {
		return res.status(401).send("User not logged in or session expired");
	}

	// Database connection
	const conn = {
		host: "localhost",
		user: "test",
		password: "test",
		database: "square",
	};

	let connection;
	let orders_items = []; // Declare orders_items here

	try {
		connection = await mysql2.createConnection(conn);

		// Fetch user orders
		const [orders] = await connection.execute(
			"SELECT * FROM orders WHERE user_id = ?",
			[userInfo.id]
		);

		// Fetch items for each order
		for (const order of orders) {
			const [items] = await connection.execute(
				"SELECT * FROM orders_items WHERE order_id = ?",
				[order.id]
			);
			orders_items.push(...items);
		}

		// Render the profile page
		res.render("pages/profile", {
			user: userInfo,
			orders: orders,
			items: orders_items,
			count: req.session.cartCount,
		});
	} catch (error) {
		console.error("Error fetching profile data:", error);
		res.status(500).send("Internal Server Error");
	} finally {
		// Close the database connection
		if (connection) {
			await connection.end();
		}
	}
});

app.get("/logout", (req, res) => {
	req.session.user = false;
	console.log("logging out");
	req.session.flash = { type: "success", message: "You have logged out !" };
	res.redirect("/index");
});

app.get("/dashboard", (req, res) => {
	req.session.count = req.session.cart.length;
	res.render("pages/dashboard", {
		user: req.session.user,
		count: req.session.count,
	});
	console.log("ADMIN logged in");
});
