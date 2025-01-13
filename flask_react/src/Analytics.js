import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

// Register required Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function Analytics({ movies }) {
  const totalMovies = movies.length;

  // Group movies by director
  const directors = movies.reduce((acc, movie) => {
    acc[movie.director] = (acc[movie.director] || 0) + 1;
    return acc;
  }, {});

  // Group movies by genre
  const genres = movies.reduce((acc, movie) => {
    acc[movie.genre] = (acc[movie.genre] || 0) + 1;
    return acc;
  }, {});

  // Movies by year
  const moviesByYear = movies.reduce((acc, movie) => {
    const year = new Date(movie.release_date).getFullYear();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  // Chart Data
  const genreData = {
    labels: Object.keys(genres),
    datasets: [
      {
        label: "Movies per Genre",
        data: Object.values(genres),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const directorData = {
    labels: Object.keys(directors),
    datasets: [
      {
        label: "Movies per Director",
        data: Object.values(directors),
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  const yearData = {
    labels: Object.keys(moviesByYear),
    datasets: [
      {
        label: "Movies per Year",
        data: Object.values(moviesByYear),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  return (
    <div className="analytics-container">
      <h2>Movie Analytics</h2>
      <p>Total Movies: {totalMovies}</p>
      
      <div className="charts">
        <div className="chart">
          <h3>Movies by Genre</h3>
          <Pie data={genreData} />
        </div>
        <div className="chart">
          <h3>Movies by Director</h3>
          <Bar data={directorData} />
        </div>
        <div className="chart">
          <h3>Movies Released per Year</h3>
          <Bar data={yearData} />
        </div>
      </div>
    </div>
  );
}

export default Analytics;
