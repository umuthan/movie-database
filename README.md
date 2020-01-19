# Movie Database

![Image of LogoOfMovieDatabase](http://umuthan.com/wp-content/uploads/2020/01/logo.png)

## Table of Contents

- [Info](#info)
- [Features](#features)
- [Screenshots](#screenshots)
- [Install](#install)
- [Author](#author)

## Info

### This is a test project for my application to EGA.

Movie Database

#### Features

* You can import movies from IMDB to your Database
* You can search and filter the movies

## Screenshots

![Image of MovieDatabaseComputer](http://umuthan.com/wp-content/uploads/2020/01/moviedatabasecomputer-664x1024.png)
![Image of MovieDatabaseMobile](http://umuthan.com/wp-content/uploads/2020/01/moviedatabasemobile.png)


## Dependencies

### Back-end
* express
* socket.io
* cors
* crawler
* mysql

### Front-end
* socket.io-client
* node-sass

## Install

You need Nodejs, npm, wget, mysql, gunzip installed on your computer.

#### Clone the repo:

```
$ git clone https://github.com/umuthan/movie-database.git
```

#### Import the Data:

Inside import folder:
```
$ ./import.sh
```
You need to answer questions to import the data from IMDB

#### Install the npm packages:

Inside server directory:
```
$ npm install
```

Inside src directory:
```
$ npm install
```

#### Start the application

Inside server directory:
```
$ node index.js
```

## Author

Umuthan Uyan
