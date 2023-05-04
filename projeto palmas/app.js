const express = require('express')
const path = require('path');

const route = require('./route/palmas')
const app = express();

const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);
const options = {
    host: 'localhost',
	port: 3306,
	user: 'odPalmas',
	password: 'odPalmas',
	database: 'odpalmas'
};
const sessionStore = new mysqlStore(options);


app.use(express.urlencoded({ extended: true })); //handle body requests
app.use(express.static('public'));

app.use(session({
    secret: 'odpalmas',
    resave: false, 
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 60 * 60 * 60 * 24 * 365,
        sameSite: 'lax'
    }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(route);
app.listen(8000);