CREATE TABLE IF NOT EXISTS test (
    movie_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_name TEXT NOT NULL,
    director TEXT NOT NULL,
    genre TEXT NOT NULL,
    release_date TEXT NOT NULL,
    length TEXT NOT NULL
);

INSERT INTO test(movie_name, director, genre, release_date, length) 
VALUES 
("Interstella", "Christopher Nolan","Action","2017","2:30"),
("Avengers", "Anothony Russo","Fantasy","2016","2:45"),
("The Dark Knight", "Christopher Nolan","Action","2015","2:30"),
("The Dark Knight Rises", "Christopher Nolan","Action","2014","2:30"),
("Inception", "Christopher Nolan","Action","2013","2:30"),
("The Prestige", "Christopher Nolan","Action","2012","2:30"),
("The Avengers", "Anothony Russo","Fantasy","2011","2:45"),
("The Avengers: Age of Ultron", "Anothony Russo","Fantasy","2010","2:45"),
("The Avengers: Infinity War", "Anothony Russo","Fantasy","2009","2:45"),
("The Avengers: Endgame", "Anothony Russo","Fantasy","2008","2:45");

DROP TABLE IF EXISTS test;