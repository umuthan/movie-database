// Importing modules
const crawler = require('crawler');
const mysql = require('mysql');

// Get configs from file
const creds = require('./config');

// Create MySQL Connection
const connection = mysql.createConnection({
  host: creds.DBHOST,
  user: creds.DBUSER,
  password: creds.DBPASS,
  database: creds.DBNAME
});

module.exports = {
  getPosterFromIMDB: function (movieID, io, socketID) {

    // Create crawler for get the poster image from IMDB
    const getPosterFromUri = new crawler({
        callback: function(error, res, done) {
            if (error) {
                console.log(error);
            } else {
                let images = res.$('.poster img')
                if(images.length>0) {
                  module.exports.savePoster(res.options.movieID, images[0].attribs.src, io, socketID)
                }
            }
        }
    });

    // Call crawler with IMDB url to get poster
    getPosterFromUri.queue({
      uri: 'https://www.imdb.com/title/'+movieID,
      movieID: movieID
    });

  },
  savePoster: function (movieID, posterUri, io, socketID){
    return new Promise(function(resolve, reject) {

      // Update poster image on DB
      let sql = `UPDATE movies SET poster = '${posterUri}' WHERE id = '${movieID}'`;

      connection.query(sql, function (err, results) {

        if (err) {
          resolve({
            error: err.message
          });
        }
        else {

          io.to(socketID).emit('poster updated', movieID);

          resolve({
            msg: 'success'
          });

        }

      });

    });

  },
  getPoster: function(movieID) {
    return new Promise(function(resolve, reject) {

      // Get poster image from DB
      let sql = 'SELECT poster from movies WHERE id = ? LIMIT 1';

      connection.query(sql, [movieID], function (err, results) {

        if (err) {
          resolve({
            error: err.message
          });
        }
        else {
          if(results.length>0) {
            results.map((result) => {
              resolve({
                poster: result.poster
              });
            });
          } else {
            resolve({});
          }
        }

      });

    });
  },
  getCategories: function() {
    return new Promise(function(resolve, reject) {

      // Get Categories from DB
      let response = [];

      let sql = `SELECT category from categories`;

      connection.query(sql, function (err, results) {

        if (err) {
          resolve({
            error: err.message
          });
        }
        else {
          results.map((result) => {
            response = response.concat({
              name: result.category
            })
          });

          resolve(response);
        }

      });

    });
  },
  getMovies: function(page, filter, order, io, socketID) {
    return new Promise(function(resolve, reject) {

      // Get Movies from DB
      let offset;
      let moviesPerPage = creds.MOVIESPERPAGE;

      page > 0 ? offset = (page-1)*moviesPerPage : offset = 0;

      let response = [];

      let whereStatements = module.exports.getFilter(filter);
      let orderStatements = module.exports.getOrder(order);

      let sqlMovies = `SELECT * FROM movies ${whereStatements} ${orderStatements} LIMIT ${moviesPerPage} OFFSET ${offset}`;

      connection.query(sqlMovies, function (err, results) {
        if (err) {
          resolve({
            error: err.msg
          })
        }
        else {
          results.map((result) => {
            let movieID = result.id;

            module.exports.getPoster(movieID).then((data) => {
              data.poster === null && module.exports.getPosterFromIMDB(movieID, io, socketID);
            })

            response = response.concat({
              id: movieID,
              title: result.title,
              category: result.categories,
              year: result.year,
              rating: result.rating,
              runtime: result.runTime,
              link: 'https://www.imdb.com/title/'+result.id
            });

          })

          resolve(response);

        }

      });

    })

  },
  getFilter: function(filter) {

    // Get filter options and set them to use getting movies with filter
    let whereStatements = [];
    let whereStatementsSql = '';

    filter.title && whereStatements.push("MATCH(title) AGAINST("+connection.escape('+'+filter.title+'+')+" IN BOOLEAN MODE)");
    filter.category && whereStatements.push("MATCH(categories) AGAINST("+connection.escape('+'+filter.category+'+')+" IN BOOLEAN MODE)");
    filter.runTime && whereStatements.push("runTime "+filter.runTime);

    whereStatements.map((value, index) => {
      index === 0 ? whereStatementsSql = 'WHERE' : whereStatementsSql += ' AND';
      whereStatementsSql += ' '+value;
    });

    return whereStatementsSql;

  },
  getOrder: function(order) {

    // Get order options and set them to use getting movies with the specific order
    return 'ORDER BY '+order.column+' '+order.by;

  }
};
