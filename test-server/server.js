const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'saucedemo-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 3600000 }
}));

// Users
const users = {
  'standard_user': { password: 'secret_sauce', name: 'Standard User' },
  'locked_out_user': { password: 'secret_sauce', name: 'Locked Out User', locked: true },
  'problem_user': { password: 'secret_sauce', name: 'Problem User' },
  'performance_glitch_user': { password: 'secret_sauce', name: 'Performance Glitch User' },
  'error_user': { password: 'secret_sauce', name: 'Error User' },
  'visual_user': { password: 'secret_sauce', name: 'Visual User' }
};

// Products
const products = [
  { id: 'sauce-labs-backpack', name: 'Sauce Labs Backpack', price: 29.99, desc: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.', img: 'sauce-backpack-1200x1500.jpg' },
  { id: 'sauce-labs-bike-light', name: 'Sauce Labs Bike Light', price: 9.99, desc: 'A red light is not the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.', img: 'bike-light-1200x1500.jpg' },
  { id: 'sauce-labs-bolt-t-shirt', name: 'Sauce Labs Bolt T-Shirt', price: 15.99, desc: 'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% combed ring-spun cotton, heather gray with red bolt.', img: 'bolt-shirt-1200x1500.jpg' },
  { id: 'sauce-labs-fleece-jacket', name: 'Sauce Labs Fleece Jacket', price: 49.99, desc: 'It is not every day you come across a midweight fleece jacket that can stand up to the elements. You stay warm and dry no matter what.', img: 'fleece-jacket-1200x1500.jpg' },
  { id: 'sauce-labs-onesie', name: 'Sauce Labs Onesie', price: 7.99, desc: 'Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, 100% combed ring-spun cotton.', img: 'onesie-1200x1500.jpg' },
  { id: 'test.allthethings()-t-shirt-(red)', name: 'Test.allTheThings() T-Shirt (Red)', price: 15.99, desc: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft, 100% cotton.', img: 'red-shirt-1200x1500.jpg' }
];

// Helper: Check auth
function requireAuth(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/');
}

// Routes
app.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/inventory.html');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (!user) {
    return res.render('index', { error: 'Username and password do not match any user in this service' });
  }
  if (user.locked) {
    return res.render('index', { error: 'Sorry, this user has been locked out.' });
  }
  if (user.password !== password) {
    return res.render('index', { error: 'Username and password do not match any user in this service' });
  }

  req.session.user = { username, name: user.name };
  res.redirect('/inventory.html');
});

app.get('/inventory.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'inventory.html'));
});

app.get('/cart.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.get('/checkout-step-one.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkout-step-one.html'));
});

app.get('/checkout-step-two.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkout-step-two.html'));
});

app.get('/checkout-complete.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkout-complete.html'));
});

// API endpoints for cart
app.post('/api/cart/add', requireAuth, (req, res) => {
  const { itemId } = req.body;
  if (!req.session.cart) req.session.cart = [];
  const product = products.find(p => p.id === itemId);
  if (product) {
    req.session.cart.push(product);
  }
  res.json({ success: true, count: req.session.cart.length });
});

app.post('/api/cart/remove', requireAuth, (req, res) => {
  const { itemId } = req.body;
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter(p => p.id !== itemId);
  }
  res.json({ success: true, count: req.session.cart.length });
});

app.get('/api/cart', requireAuth, (req, res) => {
  res.json({ items: req.session.cart || [], count: (req.session.cart || []).length });
});

app.post('/api/cart/clear', requireAuth, (req, res) => {
  req.session.cart = [];
  res.json({ success: true });
});

// Checkout
app.post('/checkout-step-one.html', requireAuth, (req, res) => {
  const { firstName, lastName, postalCode } = req.body;
  if (!firstName || !lastName || !postalCode) {
    return res.sendFile(path.join(__dirname, 'public', 'checkout-step-one.html')); // Will show error via JS
  }
  req.session.checkout = { firstName, lastName, postalCode };
  res.redirect('/checkout-step-two.html');
});

app.post('/checkout-step-two.html', requireAuth, (req, res) => {
  req.session.checkout = { ...req.session.checkout, payment: 'SauceCard #31337', shipping: 'FREE PONY EXPRESS DELIVERY!' };
  res.redirect('/checkout-complete.html');
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Reset
app.post('/reset', requireAuth, (req, res) => {
  req.session.cart = [];
  res.redirect('/inventory.html');
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`SauceDemo mock server running on http://localhost:${PORT}`);
});