import React, { useState, useEffect } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [retrying, setRetrying] = useState(false);

  const retryInterval = 5000; // 5 seconds

  async function fetchMoviesHandler() {
    setIsLoading(true);
    setError(null);
    setRetryCount(0); // Reset retry count

    try {
      const response = await fetch('https://swapi.dev/api/film');
      if (!response.ok) {
        throw new Error('Something went wrong ....Retrying !');
      }

      const data = await response.json();

      const transformedMovies = data.results.map(movieData => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
      startRetrying();
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (retrying) {
      const retryTimer = setInterval(fetchMoviesHandler, retryInterval);

      return () => {
        clearInterval(retryTimer);
      };
    }
  }, [retrying]);

  const startRetrying = () => {
    setRetryCount(retryCount + 1);
    if (retryCount >= 3) {
      setRetrying(false);
      setError('Retried 3 times, but still failed.');
    } else {
      setRetrying(true);
    }
  };

  const stopRetrying = () => {
    setRetrying(false);
  };

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = (
      <div>
        <p>{error}</p>
        {retrying && <button onClick={stopRetrying}>Stop Retrying</button>}
      </div>
    );
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
