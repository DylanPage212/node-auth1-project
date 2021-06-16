const path = require('path'); 
const express = require('express');
const helmet = require('helmet'); 
const cors = require('cors');
const session = require('express-session');
const Store = require('connect-session-knex')(session);
const knex = require('../data/db-config');

const server = express();
const authRouter = require('./auth/auth-router');
const userRouter = require('./users/users-router');
const { NONAME } = require('dns'); //eslint-disable-line

server.use(express.static(path.join(__dirname, '../client'))); // whats all this about?

server.use(
	session({
		name: 'chocolatechip',
		secret: 'keep it secret', // .env file
		saveUninitialized: false, // session not saved automatically
		resave: false, // required by some session stores
		store: new Store({
			knex,
			createTable: true,
			clearInterval: 1000 * 60 * 10,
			tablename: 'sessions',
			sidfieldname: 'sid' // whats all this about?
		}),
		cookie: {
			maxAge: 1000 * 60 * 10,
			secure: false, // if true, only works over TLS/https
			httpOnly: false // if true, cookie not in document
			// sameSite: 'none',
		}
	})
);

server.use(helmet()); // whats all this about?
server.use(express.json());
server.use(cors());

server.use('/api/users', userRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
	res.json({ api: 'up' });
});

server.use((err, req, res, next) => { //eslint-disable-line
	// eslint-disable-line
	res.status(err.status || 500).json({
		message: err.message,
		stack: err.stack
	});
});

module.exports = server;