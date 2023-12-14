const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// Database credentials
const connection = mysql.createConnection({
    host: 'localhost', // Replace with your MySQL server host
    user: 'root', // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'carpooling', // Replace with your MySQL database name
});

// Connect to the MySQL server
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }

    console.log('Connected to MySQL');
});



// Signup API endpoint
app.post('/signup', async (req, res) => {
    const {first_name, last_name, email, password} = req.body;
// Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    const newUser = {
        first_name,
        last_name,
        email,
        password: hashedPassword
    };

    // Insert user into the database
    connection.query('INSERT INTO users SET ?', newUser, (err, results) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({error: 'Error signing up. Please try again.'});
        }

        return res.status(201).json({message: 'Signup successful', user_id: results.insertId});
    });
});

// Login API endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch the user from the database based on the email
        const [user] = connection.query('SELECT * FROM users WHERE email = ?', [email]);

        // Check if the user exists
        if (user.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify the password
        const passwordMatch = await bcrypt.compare(password, user[0].password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Successful login
        return res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// Close the database connection when the server is shut down
process.on('SIGINT', () => {
    connection.end((err) => {
        if (err) {
            console.error('Error closing MySQL connection:', err);
        }
        console.log('MySQL connection closed');
        process.exit();
    });
});

// Your other routes and middleware

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

