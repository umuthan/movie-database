/**
 * Movie Database - Movie API
 * https://github.com/umuthan/movie-database
 *
 * Author: Umuthan Uyan
 *
 */

const getMovies = async (page, filter, order) => {
  // Get movies from API
  let requestURL = '/API/movies';

  let response = await fetch(requestURL, {
    method: 'post',
    body: JSON.stringify({
      page: page,
      filter: filter,
      order: order
    }),
    headers: {"Content-Type": "application/json"}
  });
  let data = await response.json();
  return data;
}

const getMoviePoster = async (movieID) => {
  // Get movie poster from API
  let requestURL = '/API/moviePoster?movieID='+movieID;

  let response = await fetch(requestURL, {
    method: 'get',
  });
  let data = await response.json();
  return data;
}

const getCategories = async () => {
  // Get categories from API
  let requestURL = '/API/categories';

  let response = await fetch(requestURL, {
    method: 'get',
  });
  let data = await response.json();
  return data;
}

export { getMovies, getMoviePoster, getCategories }
