// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const data = require('./data.js');

// Endpoint to fetch all movies
app.get('/api/movies', (req, res) => {
  res.json(data.movies);
});

// Endpoint to fetch all reviews
app.get('/api/reviews', (req, res) => {
  const allReviews = data.movies.flatMap(movie => movie.reviews.map(review => ({
    ...review,
    movieId: movie.id
  })));
  res.json(allReviews);
});

// Endpoint to add a new review
app.post('/api/reviews', (req, res) => {
  const { movieId, reviewer, reviewText, rating } = req.body;

  // Check if movie exists
  const movie = data.movies.find(movie => movie.id === movieId);
  if (movie) {
    // Create new review and add it to the movie
    const newReview = { reviewer, reviewText, rating };
    movie.reviews.push(newReview);
    
    // Respond with success
    return res.status(201).json({ message: 'Review added successfully!', review: newReview });
  }

  // Respond with error if movie not found
  return res.status(404).json({ message: 'Movie not found!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
