/**
 * Movie Database - Pagination Component
 * https://github.com/umuthan/movie-database
 *
 * Author: Umuthan Uyan
 *
 */

import React, { Component } from 'react';

class Pagination extends Component {

  render() {

    const {
      page,
      moviesLength,
      title,
      category,
      runTime
    } = this.props;

    const nextPage = Number(page)+1;
    const prevPage = Number(page)-1;

    return(
      <div id="pagination">
        { page > 1 && (
          <button id="prev" onClick={() => this.props.changeUrlCallback(prevPage,title,category,runTime)}>Prev</button>
        )}
        { moviesLength === 20 && (
          <button id="next" onClick={() => this.props.changeUrlCallback(nextPage,title,category,runTime)}>Next</button>
        )}
      </div>
    )

  }

}

export default Pagination;
