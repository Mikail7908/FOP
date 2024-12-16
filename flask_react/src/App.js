import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [moviesData, setMoviesData] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(false);

  useEffect(() => {
    getMoviesData();
  }, []);

  function getMoviesData() {
    setLoadingMovies(true);
    axios
      .get('http://127.0.0.1:5000/movies')
      .then((response) => {
        setMoviesData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching movies data:', error);
      })
      .finally(() => {
        setLoadingMovies(false);
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Movies List</h1>

        <div className="movies-section">
          <h2>Movies Data</h2>
          {loadingMovies ? (
            <p>Loading...</p>
          ) : moviesData.length > 0 ? (
            <table className="movies-table">
              <thead>
                <tr>
                  <th>Movie Name</th>
                  <th>Director</th>
                  <th>Genre</th>
                  <th>Length</th>
                  <th>Release Date</th>
                </tr>
              </thead>
              <tbody>
                {moviesData.map((movie) => (
                  <tr key={movie.movie_ID}>
                    <td>{movie.movie_name}</td>
                    <td>{movie.director}</td>
                    <td>{movie.genre}</td>
                    <td>{movie.length}</td>
                    <td>{movie.release_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No movies data</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
