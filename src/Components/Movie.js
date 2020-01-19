/**
 * Movie Database - Movie Component
 * https://github.com/umuthan/movie-database
 *
 * Author: Umuthan Uyan
 *
 */

import React, { Component } from 'react';

import { getMoviePoster } from '../Api/Movies';

class Movie extends Component {

  constructor(props) {

    super(props);

    this.state = {
      poster: require('../Assets/img/blankPoster.png')
    };

  }

  getThisMoviePoster(movieID) {
    // Getting movie poster from API
    getMoviePoster(movieID).then((data)=>{
      data.poster !== null && this.setState({ poster: data.poster });
    })
  }

  componentDidMount() {

    // Setting Ref settings for Component
    const { movieRef } = this.props;
    movieRef(this);

    this.getThisMoviePoster(this.props.id);

  }

  componentWillUnmount() {

    // Unsetting Ref settings just before unmounting component
    const { movieRef } = this.props;
    movieRef(undefined);

  }


  render() {

    const {
      title,
      categories,
      year,
      rating,
      runtime,
      link
    } = this.props;

    const {
      poster
    } = this.state;

  return (

    <>
      <div className="poster">
        <img src={poster} alt={title} />
      </div>
      <h3 className="title">{title}</h3>
      <div className="categories">
        {categories.split(',').map((category, i) => <h4 onClick={() => this.props.changeUrlCallback(1,'',category)} key={i}>{category}</h4>)}
      </div>
      <h4 className="center year">{year}</h4>
      <h4 className="center rating">{rating}</h4>
      <span className="center runtime">{runtime} min.</span>
      <a className="link" rel="noopener noreferrer" target="_blank" href={link}>
        <img alt="Go To IMDB Page" src={require('../Assets/img/link.png')} />
      </a>
    </>

  );
}
}

export default Movie;
