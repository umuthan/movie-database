/**
 * Movie Database - Server
 * https://github.com/umuthan/movie-database
 *
 * Author: Umuthan Uyan
 *
 */

'use strict';

// Get configs from file
const creds = require('./config');

// Import Modules
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Import API
const movies = require('./movies.js');

// Settings for Express
const app = express();
const proxy = require('http-proxy-middleware');
const cors = require('cors');
const port = process.env.PORT || creds.PORT;

const server = http.createServer(app)

// Setttings for SocketIO
const io = socketIO(server)
var socketID;

io.on('connection', socket => {
  socketID = socket.id;
})

io.sockets.setMaxListeners(0);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// console.log that your server is up and running
server.listen(port, () => console.log(`Listening on port ${port}`));

// serve the app
app.use('/', express.static('../build'));

// create a GET route for movies
app.post('/API/movies', ( req, res ) => {

  let page = req.body.page;
  let filter = req.body.filter;
  let order = req.body.order;

  movies.getMovies(page, filter, order, io, socketID).then(data => {

    // Set Response Status Code
    res.status(200);

    // Set Repsonse Message
    res.json (data);

  });

});

// create a GET route for movie poster
app.get('/API/moviePoster', ( req, res ) => {

  req.query.movieID ? (

    movies.getPoster(req.query.movieID).then(data => {

      // Set Response Status Code
      res.status(200);

      // Set Repsonse Message
      res.json (data);

    })

  ) : (

    res.status(404)

  )

});

// create a GET route for movies
app.get('/API/categories', ( req, res ) => {

  movies.getCategories().then(data => {

    // Set Response Status Code
    res.status(200);

    // Set Repsonse Message
    res.json (data);

  });

});
