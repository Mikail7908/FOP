import { useState, useEffect } from 'react';
import axios from 'axios';
import Analytics from "./Analytics";
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

  const [editedMovie, setEditedMovie] = useState({
    movie_ID: '',
    movie_name: '',
    genre: '',
    director: '',
    length: '',
    release_date: ''
  });

  const [editingRowId, setEditingRowId] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('movie_name'); // Default sorting by movie name

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

  // Start editing a row
  function handleEditRow(movie) {
    setEditingRowId(movie.movie_ID);
    setEditedMovie(movie); // Initialize with the current movie data
  }

  // Handle changes to the editable row
  function handleEditChange(event) {
    const { name, value } = event.target;
    setEditedMovie({
      ...editedMovie,
      [name]: value,
    });
  }

  // Save changes to the backend
  function handleSaveEdit() {
    // Make sure editedMovie contains the updated fields (movie_ID included)
    if (editedMovie.movie_ID) {
      axios
        .put(`http://127.0.0.1:5000/movies/${editingRowId}`, editedMovie)  // using movie_ID here
        .then((response) => {
          console.log('Movie updated:', response.data);
          setEditingRowId(null); // Exit edit mode
          getMoviesData(); // Refresh the movie list
        })
        .catch((error) => {
          console.error('Error updating movie:', error);
          setError('Failed to update movie. Please try again later.');
        });
    } else {
      console.log("Movie ID missing in edited movie data.");
    }
  }


  // Cancel editing
  function handleCancelEdit() {
    setEditingRowId(null);
    setEditedMovie({});
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

  // Handle search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle sort selection
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Filter and sort movies
  const filteredAndSortedMovies = moviesData
    .filter((movie) =>
      movie.movie_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1;
      if (a[sortBy] > b[sortBy]) return 1;
      return 0;
    });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mikail's Movie Collection Manager</h1>

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

        {/* Search and Sort Controls */}
        <div className="filter-container">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <select value={sortBy} onChange={handleSortChange} className="sort-select">
            <option value="movie_name">Movie Name</option>
            <option value="director">Director</option>
            <option value="genre">Genre</option>
            <option value="release_date">Release Date</option>
            <option value="Movie ID">movie_ID</option>
          </select>
        </div>

        <div className="movies-section">
          <h2>Movie List</h2>

          {loadingMovies ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : filteredAndSortedMovies.length > 0 ? (
            <table className="movies-table">
              <thead>
                <tr>
                  <th>Movie ID</th>
                  <th>Movie Name</th>
                  <th>Director</th>
                  <th>Genre</th>
                  <th>Length</th>
                  <th>Release Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedMovies.map((movie) => (
                  <tr key={movie.movie_ID}>
                    <td>{movie.movie_ID}</td> {/* Displaying Movie ID */}
                    <td>{movie.movie_name}</td>
                    <td>{movie.director || 'N/A'}</td>
                    <td>{movie.genre}</td>
                    <td>{movie.length || 'N/A'}</td>
                    <td>{movie.release_date}</td>
                    <td>
                      <button
                        onClick={() => handleEditRow(movie)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
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

        {/* Edit Movie Form */}
        {editingRowId && (
          <div className="edit-movie-form">
            <h2>Edit Movie (ID: {editingRowId})</h2>
            <form onSubmit={handleSaveEdit}>
              <input
                type="text"
                name="movie_name"
                value={editedMovie.movie_name}
                onChange={handleEditChange}
                required
              />
              <input
                type="text"
                name="genre"
                value={editedMovie.genre}
                onChange={handleEditChange}
                required
              />
              <input
                type="text"
                name="director"
                value={editedMovie.director}
                onChange={handleEditChange}
                required
              />
              <input
                type="text"
                name="length"
                value={editedMovie.length}
                onChange={handleEditChange}
              />
              <input
                type="date"
                name="release_date"
                value={editedMovie.release_date}
                onChange={handleEditChange}
                required
              />
              <button type="submit">Save Changes</button>
              <button type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            </form>
          </div>
        )}
        <div className="analytics-section">
            <Analytics movies={moviesData} />
        </div>
      </header>
    </div>
  );
}

export default App;
