const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;
app.set("view engine", "ejs");
app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Final1', { useNewUrlParser: true, useUnifiedTopology: true });

// Define User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  age: String,
  gender: String,
  country: String,
  isAdmin: Boolean,
  email: String
});

const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    timestamp: { type: Date, default: Date.now },
    picture1: String,
    picture2: String,
    picture3: String,
  });
  
const Item = mongoose.model('Item', itemSchema);

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Routes
app.get('/', (req, res) => {
  res.render('Registration');
});
app.get('/item', (req, res) => {
  res.render('add-items');
});

app.get('/auth', (req, res) => {
    res.render('Auth');
  });

  app.get('/api', (req, res) => {
    res.render('Apis');
  });

  app.get('/api2', (req, res) => {
    res.render('Apis2');
  });
  app.get('/api3', (req, res) => {
    res.render('Apis3');
  });

  app.get('/rega', (req, res) => {
    res.render('Registera');
  });

  app.get('/loga', (req, res) => {
    res.render('logina');
  });

  app.get('/api1', (req, res) => {
    res.render('api1');
  });

  app.get('/main', async (req, res) => {
    const items = await Item.find();
    res.render('Main', { items});
  });


// Registration as user
app.post('/register', async (req, res) => {
  const { username, password, firstname, lastname, age, gender, country, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, firstname, lastname, age, gender, country, isAdmin: false , email});
    await user.save();
    const items = await Item.find();
   const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'xgod2281337322@gmail.com',
        pass: 'luyb pnnd trxa oobj'
      }
    });
    const mailOptions = {
      from: 'xgod2281337322@gmail.com',
      to: email,
      subject: "Registration",
      text: "You are registered"
   };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
       console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.render('Main', { items, user: req.session.user });
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});


//Registration as admin
app.post('/registera', async (req, res) => {
  const { username, password, firstname, lastname, age, gender, country, secret } = req.body;
if (secret==="1234"){
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, firstname, lastname, age, gender, country, isAdmin: true });
    await user.save();
    const items = await Item.find();
    res.render('add-items', { items, user: req.session.user });
  } catch (error) {
    res.status(500).send('Error registering user');
  }}
});

// Login as user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user;
      const items = await Item.find();
      const email1 = user.email;
    
    res.render('Main', { items, user: req.session.user });


    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});


//Login as admin
app.post('/logina', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password)) && user.isAdmin==true) {
      req.session.user = user;
      const items = await Item.find();
    res.render('add-items', { items, user: req.session.user });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});


//Adding items
app.post('/add-item', async (req, res) => {
    
      const { name, description, picture1, picture2, picture3 } = req.body;
      if (req.session.user && req.session.user.isAdmin) {
      try {
        // Create a new item using the Item model
        const newItem = new Item({
          name,
          description,
          picture1,
          picture2,
          picture3,
        });
  
        // Save the new item to the MongoDB collection
        await newItem.save();
        const items = await Item.find();
        res.render('add-items', { items, user: req.session.user });
      } catch (error) {
        res.status(500).send('Error adding item');
      }}
    } 
  );
//Deleting items
  app.post('/delete-item', async (req, res) => {
    const {ItemIDD} =req.body;
    if (req.session.user && req.session.user.isAdmin) {
     const itemIdd=ItemIDD;
      try {
        await Item.findByIdAndDelete(itemIdd);
        const items = await Item.find();
        res.render('add-items', { items, user: req.session.user });
      } catch (error) {
        res.status(500).send('Error deleting item');
      }
    } else {
      res.status(403).send('Access denied');
    }
  });
//Editing items
  app.post('/edit-item', async (req, res) => {
    const {ItemID} =req.body;
    if (req.session.user && req.session.user.isAdmin) {
      const itemId = ItemID;
      const { name, description, picture1, picture2, picture3 } = req.body;
  
      try {
        await Item.findByIdAndUpdate(itemId, {
          name,
          description,
          picture1,
          picture2,
          picture3,
        });
        const items = await Item.find();
        res.render('add-items', { items, user: req.session.user });
      } catch (error) {
        res.status(500).send('Error editing item');
      }
    } else {
      res.status(403).send('Access denied');
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});