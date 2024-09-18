const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const data = require('./data.js');

app.get('/api/movies', (req, res) => {
  res.json(data.movies);
});

app.get('/api/reviews/all', (req, res) => {
  const allReviews = data.movies.flatMap(movie => movie.reviews.map(review => ({
    ...review,
    movieId: movie.id
  })));
  res.json(allReviews);
});

app.post('/api/reviews', (req, res) => {
  const { movieId, reviewer, reviewText, rating } = req.body;
  const movie = data.movies.find(movie => movie.id === movieId);
  if (movie) {
    movie.reviews.push({ reviewer, reviewText, rating });
    res.status(201).json({ message: 'Review added successfully!' });
  } else {
    res.status(404).json({ message: 'Movie not found!' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
