import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [moviesData, setMoviesData] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [error, setError] = useState(null);

  const [newMovie, setNewMovie] = useState({
    movie_name: '',
    genre: '',
    director: '',
    length: '',
    release_date: ''
  });

  useEffect(() => {
    getMoviesData();
  }, []);

  // Fetch movies data from Flask backend
  function getMoviesData() {
    setLoadingMovies(true);
    setError(null); // Reset error on new request
    axios
      .get('http://127.0.0.1:5000/movies')
      .then((response) => {
        setMoviesData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching movies data:', error);
        setError('Failed to load movie data. Please try again later.');
      })
      .finally(() => {
        setLoadingMovies(false);
      });
  }

  // Handle form input change
  function handleInputChange(event) {
    const { name, value } = event.target;
    setNewMovie({
      ...newMovie,
      [name]: value
    });
  }

  // Handle form submission for adding a new movie
  function handleFormSubmit(event) {
    event.preventDefault();
    axios
      .post('http://127.0.0.1:5000/movies', newMovie)
      .then((response) => {
        console.log('Movie added:', response.data);
        setNewMovie({
          movie_name: '',
          genre: '',
          director: '',
          length: '',
          release_date: ''
        });
        getMoviesData(); // Refresh the movie list after adding a new movie
      })
      .catch((error) => {
        console.error('Error adding movie:', error);
        setError('Failed to add movie. Please try again later.');
      });
  }

  // Delete a movie from the table
  function handleDeleteMovie(movieId) {
    axios
      .delete(`http://127.0.0.1:5000/movies/${movieId}`)
      .then((response) => {
        console.log(response.data.message);
        getMoviesData(); // Refresh the movie list after deleting
      })
      .catch((error) => {
        console.error('Error deleting movie:', error);
        setError('Failed to delete movie. Please try again later.');
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Movies List</h1>

        {/* Add Movie Form */}
        <div className="add-movie-form">
          <h2>Add a Movie</h2>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="movie_name"
              placeholder="Movie Name"
              value={newMovie.movie_name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="genre"
              placeholder="Genre"
              value={newMovie.genre}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="director"
              placeholder="Director"
              value={newMovie.director}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="length"
              placeholder="Length"
              value={newMovie.length}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="release_date"
              value={newMovie.release_date}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Add Movie</button>
          </form>
        </div>

        <div className="movies-section">
          <h2>Movies Data</h2>

          {loadingMovies ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : moviesData.length > 0 ? (
            <table className="movies-table">
              <thead>
                <tr>
                  <th>Movie Name</th>
                  <th>Director</th>
                  <th>Genre</th>
                  <th>Length</th>
                  <th>Release Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {moviesData.map((movie) => (
                  <tr key={movie.movie_ID}>
                    <td>{movie.movie_name}</td>
                    <td>{movie.director || 'N/A'}</td>
                    <td>{movie.genre}</td>
                    <td>{movie.length || 'N/A'}</td>
                    <td>{movie.release_date}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteMovie(movie.movie_ID)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No movies data available.</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
