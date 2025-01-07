import unittest
import json
from base import app, DatabaseManager

class TestMovieApp(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = app.test_client()
        cls.db_manager = DatabaseManager('movies.db')

        # Setup test database
        conn = cls.db_manager.get_connection()
        conn.execute('DROP TABLE IF EXISTS test')
        conn.execute('''
            CREATE TABLE test (
                movie_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                movie_name TEXT NOT NULL,
                director TEXT NOT NULL,
                genre TEXT NOT NULL,
                release_date TEXT NOT NULL,
                length INTEGER
            )
        ''')
        conn.commit()
        conn.close()

    def test_add_movie(self):
        # Test adding a new movie
        new_movie = {
            "movie_name": "Inception",
            "director": "Christopher Nolan",
            "genre": "Sci-Fi",
            "release_date": "2010-07-16",
            "length": 148
        }
        response = self.client.post('/movies', json=new_movie)
        self.assertEqual(response.status_code, 201)
        self.assertIn('Movie added successfully!', response.json['message'])

    def test_add_movie_missing_fields(self):
        # Test adding a movie with missing fields
        incomplete_movie = {
            "movie_name": "Incomplete Movie"
        }
        response = self.client.post('/movies', json=incomplete_movie)
        self.assertEqual(response.status_code, 400)
        self.assertIn('Missing required fields', response.json['error'])

    def test_get_all_movies(self):
        # Test retrieving all movies
        response = self.client.get('/movies')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json) > 0)  # Check if movies exist

    def test_delete_movie(self):
        # Add a movie to delete
        new_movie = {
            "movie_name": "Test Movie",
            "director": "Test Director",
            "genre": "Test Genre",
            "release_date": "2022-01-01",
            "length": 120
        }
        add_response = self.client.post('/movies', json=new_movie)
        movie_id = add_response.json['movie_ID'] # Get the ID of the movie

        # Delete the movie
        delete_response = self.client.delete(f'/movies/{movie_id}')
        self.assertEqual(delete_response.status_code, 200)
        self.assertIn(f'Movie with ID {movie_id} deleted successfully!', delete_response.json['message'])

    def test_delete_nonexistent_movie(self):
        # Test deleting a movie that does not exist
        response = self.client.delete('/movies/9999') # ID 9999 does not exist
        self.assertEqual(response.status_code, 200)
        self.assertIn('deleted successfully!', response.json['message'])

    # @classmethod
    # def tearDownClass(cls):
    #     # Clean up test database
    #     conn = cls.db_manager.get_connection()
    #     conn.execute('DROP TABLE IF EXISTS test')
    #     conn.commit()
    #     conn.close()

if __name__ == '__main__':
    unittest.main()
