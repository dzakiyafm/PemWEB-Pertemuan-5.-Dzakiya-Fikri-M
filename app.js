const express = require('express') 
const mysql = require('mysql2') 
const bodyParser = require('body-parser');
const { error } = require('console');

const app = express ();
app.use(bodyParser.urlencoded({extended : false }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pertemuan5'
});

connection.connect((err) => {
    if (err){
        console.error("Terjadi kesalahan dalam koneksi ke MySQL:"), err.stack;
        return;
    }
    console.log("Koneksi MySQL berhasil dengan id" + connection.threadId)
});

app.set('view angine', 'ejs');

// READ
app.get('/', (req, res) => {
    const query = 'SELECT * FROM users';
    connection.query(query, (err, results) => {
        res.render('index', {users: results});
    });
});

// CREATE
app.post('/add', (req, res) => {
    const {name, email, phone} = req.body;
    const query = 'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)';
    connection.query(query, [name, email, phone], (err, results) =>{
        if(err) throw err,
        res.redirect('/');
    });
});

// UPDATE
app.get('/edit/:id', (req, res) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) => {
        if(err) throw err;
        res.render('edit', {user: result[0]});
    });
});

app.post('/update/:id', (req, res) => {
    const {name, email, phone} = req.body;
    const query = 'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?';
    connection.query(query, [name, email, phone, req.params.id], (err, results) =>{
        if(err) throw err,
        res.redirect('/');
    });
});

// DELETE
app.get('/delete/:id', (req, res) => {
    const query = 'DELETE FROM users WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});

app.listen(3000,() => {
    console.log("server berjalan di port 3000, buka web melalui http://localhost:3000")
}); 