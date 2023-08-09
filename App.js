import React, { useState } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

async function fetchMoviesHandler() {
  try {
    const response = await fetch('https://swapi.dev/api/films');
    const data = await response.json();
    const transformedMovies = data.results.map(movieData => ({
      id: movieData.episode_id,
      title: movieData.title,
      openingText: movieData.opening_crawl,
      releaseDate: movieData.release_date
    }));
    return transformedMovies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

function App() {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    const transformedMovies = await fetchMoviesHandler();
    setMovies(transformedMovies);
  };

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
      </section>
      <section>
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;
