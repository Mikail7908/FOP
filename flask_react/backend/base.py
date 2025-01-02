from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('movies.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/movies', methods=['GET', 'POST'])
def movies():
    if request.method == 'GET':
        conn = get_db_connection()
        movies = conn.execute('SELECT * FROM test').fetchall()
        conn.close()
        movies_list = [dict(movie) for movie in movies]
        return jsonify(movies_list)
    
    elif request.method == 'POST':
        new_movie = request.json
        movie_name = new_movie['movie_name']
        director = new_movie['director']
        genre = new_movie['genre']
        release_date = new_movie['release_date']
        length = new_movie['length']
        
        if not movie_name or not genre or not director or not release_date:
            return jsonify({'error': 'Missing required fields'}), 400
        
        conn = get_db_connection()
        conn.execute('INSERT INTO test (movie_name, director, genre, release_date, length) VALUES (?, ?, ?, ?, ?)',
                     (movie_name, director, genre,release_date, length))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Movie added successfully!'}), 201

if __name__ == "__main__":
    app.run(debug=True)
