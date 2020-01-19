/**
 * Movie Database - App Component
 * https://github.com/umuthan/movie-database
 *
 * Author: Umuthan Uyan
 *
 */

import React, { Component } from 'react';
import './Assets/scss/main.scss';

import Header from './Components/Header';
import Movie from './Components/Movie';
import Pagination from './Components/Pagination';
import Footer from './Components/Footer';

import socketIOClient from "socket.io-client";

import { getMovies } from './Api/Movies';

class App extends Component {

  constructor(props) {

    super(props);

    const currentUrl = new URL(window.location.href);

    this.movieContent = {};

    this.state = {
      loading: true,
      moviesData: [],
      page : currentUrl.searchParams.get('page'),
      filter: {
        title : currentUrl.searchParams.get('title'),
        category : currentUrl.searchParams.get('category'),
        runTime : currentUrl.searchParams.get('runTime')
      },
      order : {
        column: currentUrl.searchParams.get('order') && currentUrl.searchParams.get('order').split('|')[0],
        by: currentUrl.searchParams.get('order') && currentUrl.searchParams.get('order').split('|')[1]
      }
    };

  }

  componentDidMount() {

    // Create Socket connection with server
    const socket = socketIOClient('');

    // Update poster when server gets poster from IMDB and save it to the DB
    socket.on('poster updated', (movieID) => {
      this.movieContent[movieID].getThisMoviePoster(movieID);
    })

    // If order is not defined set order to Rating DESC
    if(!this.state.order.column) {
      this.changeUrl(
        1,
        this.state.filter.title,
        this.state.filter.category,
        this.state.filter.runTime,
        'rating',
        'DESC'
      );
    }

    // Get the movies from API
    getMovies(this.state.page, this.state.filter, this.state.order).then( data => {
      this.setState({
        moviesData: data,
        loading: false
      });
    });

  }

  changeOrder = (column) => {

    // Change order when pressed items in header
    let newOrderBy;

    this.state.order.by === 'ASC' ? newOrderBy = 'DESC' : newOrderBy = 'ASC';

    this.changeUrl(
      1,
      this.state.filter.title,
      this.state.filter.category,
      this.state.filter.runTime,
      column,
      newOrderBy
    );

  }

  changeUrl = (page, title, category, runTime, ordercolumn, orderby) => {

    // Set the url for new query
    let newUrl = new URL(window.location.href);

    page && newUrl.searchParams.set('page',page);
    title ? newUrl.searchParams.set('title',title) : newUrl.searchParams.set('title','');
    category ? newUrl.searchParams.set('category',category) : newUrl.searchParams.set('category','');
    runTime ? newUrl.searchParams.set('runTime',runTime) : newUrl.searchParams.set('runTime','');
    ordercolumn && newUrl.searchParams.set('order',ordercolumn+'|'+orderby);

    window.location.href = newUrl.href;

  }

  render() {

    const {
      loading,
      moviesData,
      page,
      filter,
      order
    } = this.state;

    return (

      <div className="container">
        <Header
          title={filter.title}
          category={filter.category}
          runTime={filter.runTime}
          changeUrlCallback={this.changeUrl}
        />
        <section>
          { moviesData.length > 0 ? (
            <>
              <header>
                <div></div>
                <h2 id="title" className={ order.column === 'title' ? "ordered "+order.by : "order" } onClick={() => this.changeOrder('title')}>Title</h2>
                <h2 id="category" className="center">Category</h2>
                <h2 id="year" className={ order.column === 'year' ? "ordered center "+order.by : "order center" } onClick={() => this.changeOrder('year')}>Year</h2>
                <h2 id="rating" className={ order.column === 'rating' ? "ordered center "+order.by : "order center" } onClick={() => this.changeOrder('rating')}>Rating</h2>
                <h2 id="runTime" className={ order.column === 'runTime' ? "ordered center "+order.by : "order center" } onClick={() => this.changeOrder('runTime')}>Runtime</h2>
                <div></div>
              </header>
              <ul id="movies">
                { moviesData.map((movie) => (
                  <li key={movie.id}>
                    <Movie
                      movieRef={(ref) => {this.movieContent[movie.id] = ref}}
                      id={movie.id}
                      title={movie.title}
                      categories={movie.category}
                      year={movie.year}
                      rating={movie.rating}
                      runtime={movie.runtime}
                      link={movie.link}
                      changeUrlCallback={this.changeUrl} />
                  </li>
                )) }
              </ul>
            </>
          ) : (
            loading ? (
              <div className="loading">LOADING...</div>
            ) : (
              <div className="notFound">
                <h1>MOVIE NOT FOUND.</h1>
                <h2>Change your parameters and try again.</h2>
              </div>
            )
          ) }
        </section>

        <Pagination
          page={page}
          moviesLength={moviesData.length}
          title={this.state.filter.title}
          category={this.state.filter.category}
          runTime={this.state.filter.runTime}
          changeUrlCallback={this.changeUrl} />
        <Footer />
      </div>

    );

  }

}

export default App;
