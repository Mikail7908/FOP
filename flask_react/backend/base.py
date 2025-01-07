from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

class DatabaseManager:
    def __init__(self, db_name):
        self.db_name = db_name

    def get_connection(self):
        conn = sqlite3.connect(self.db_name)
        conn.row_factory = sqlite3.Row
        return conn

class MovieManager:
    def __init__(self, db_manager):
        self.db_manager = db_manager

    def get_all_movies(self):
        conn = self.db_manager.get_connection()
        movies = conn.execute('SELECT * FROM test').fetchall()
        conn.close()
        return [dict(movie) for movie in movies]

    def add_movie(self, movie_data):
        required_fields = ['movie_name', 'director', 'genre', 'release_date', 'length']
        if not all(field in movie_data for field in required_fields):
            return {'error': 'Missing required fields'}, 400

        conn = self.db_manager.get_connection()
        conn.execute(
            'INSERT INTO test (movie_name, director, genre, release_date, length) VALUES (?, ?, ?, ?, ?)',
            (movie_data['movie_name'], movie_data['director'], movie_data['genre'], 
             movie_data['release_date'], movie_data['length'])
        )
        conn.commit()
        conn.close()
        return {'message': 'Movie added successfully!'}, 201

    def update_movie(self, movie_id, movie_data):
        required_fields = ['movie_name', 'director', 'genre', 'release_date', 'length']
        if not all(field in movie_data for field in required_fields):
            return {'error': 'Missing required fields'}, 400

        conn = self.db_manager.get_connection()
        cursor = conn.execute(
            '''UPDATE test
               SET movie_name = ?, director = ?, genre = ?, release_date = ?, length = ?
               WHERE movie_ID = ?''',
            (movie_data['movie_name'], movie_data['director'], movie_data['genre'],
             movie_data['release_date'], movie_data['length'], movie_id)
        )
        
        if cursor.rowcount == 0:
            return {'error': 'Movie not found'}, 404  # Movie not found

        conn.commit()
        conn.close()
        return {'message': 'Movie updated successfully!'}, 200
    
    def renumber_ids(self, conn):
        """Renumber movie_IDs before I go crazy and see the smallest number being 20"""
        movies = conn.execute('SELECT * FROM test ORDER BY movie_ID').fetchall()
        for new_id, movie in enumerate(movies, start=1):
            conn.execute('UPDATE test SET movie_ID = ? WHERE movie_ID = ?', (new_id, movie['movie_ID']))
        conn.commit()


    def delete_movie(self, movie_id):
        conn = self.db_manager.get_connection()
        cursor = conn.execute('DELETE FROM test WHERE movie_ID = ?', (movie_id,))
        
        if cursor.rowcount == 0:
            return {'error': 'Movie not found'}, 404  # Movie not found

        conn.commit()
        self.renumber_ids(conn)
        conn.close()
        return {'message': f'Movie with ID {movie_id} deleted successfully!'}, 200

class MovieApp:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)
        self.db_manager = DatabaseManager('movies.db')
        self.movie_manager = MovieManager(self.db_manager)
        self.setup_routes()

    def setup_routes(self):
        # Get all movies or add a new movie
        @self.app.route('/movies', methods=['GET', 'POST'])
        def movies():
            if request.method == 'GET':
                movies = self.movie_manager.get_all_movies()
                return jsonify(movies)

            elif request.method == 'POST':
                new_movie = request.json
                response, status = self.movie_manager.add_movie(new_movie)
                return jsonify(response), status

        # Update movie by ID
        @self.app.route('/movies/<int:movie_id>', methods=['PUT'])
        def update_movie(movie_id):
            updated_movie = request.json
            response, status = self.movie_manager.update_movie(movie_id, updated_movie)
            return jsonify(response), status

        # Delete movie by ID
        @self.app.route('/movies/<int:movie_id>', methods=['DELETE'])
        def delete_movie(movie_id):
            response, status = self.movie_manager.delete_movie(movie_id)
            return jsonify(response), status

    def run(self):
        self.app.run(debug=True)

movie_app = MovieApp()
app = movie_app.app