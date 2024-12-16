from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('movies.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/profile')
def profile():
    return {
        "name": "John Doe",
        "about": "Software Developer"
    }

@app.route('/movies')
def movies():
    conn = get_db_connection()
    movies = conn.execute('SELECT * FROM test').fetchall()
    conn.close()
    movies_list = [dict(movie) for movie in movies]
    return jsonify(movies_list)

if __name__ == "__main__":
    app.run(debug=True)