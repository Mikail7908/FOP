import base

class Movie:
    def __init__(self, movie_name, genre, release_date):
        self.movie_name = movie_name
        self.genre = genre
        self.release_date = release_date


class Actor(Movie):
    def __init__(self, actor_name):
        super().__init__()
        self.actor_name = actor_name

class Director(Movie):
    def __init__(self, director_name):
        super().__init__()
        self.director_name = director_name

