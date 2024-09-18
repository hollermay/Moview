document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/movies')
      .then(response => response.json())
      .then(movies => {
        const moviesContainer = document.getElementById('movies');
        const reviewsDropdown = document.getElementById('reviews-dropdown');
  
        function displayMovies(filteredMovies) {
          moviesContainer.innerHTML = '';
          filteredMovies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.className = 'movie';
            movieElement.innerHTML = `
              <h2>${movie.title}</h2>
              <p>${movie.description}</p>
              <h3>Reviews:</h3>
              <div class="reviews">
                ${movie.reviews.map(review => `
                  <div class="review">
                    <p><strong>${review.reviewer}</strong> (${review.rating}/5)</p>
                    <p>${review.reviewText}</p>
                  </div>
                `).join('')}
              </div>
              <form class="review-form">
                <input type="hidden" name="movieId" value="${movie.id}">
                <input type="text" name="reviewer" placeholder="Your Name" required>
                <textarea name="reviewText" placeholder="Your Review" required></textarea>
                <input type="number" name="rating" min="1" max="5" placeholder="Rating" required>
                <button type="submit">Submit Review</button>
              </form>
            `;
            moviesContainer.appendChild(movieElement);
  
            movieElement.querySelector('.review-form').addEventListener('submit', function(event) {
              event.preventDefault();
              const formData = new FormData(event.target);
              const reviewData = {
                movieId: parseInt(formData.get('movieId')),
                reviewer: formData.get('reviewer'),
                reviewText: formData.get('reviewText'),
                rating: parseInt(formData.get('rating'))
              };
              fetch('/api/reviews', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
              })
              .then(response => response.json())
              .then(data => {
                if (data.message) {
                  alert(data.message);
                  window.location.reload();
                }
              })
              .catch(error => console.error('Error:', error));
            });
          });
        }
  
        function populateReviewsDropdown(reviews) {
          reviewsDropdown.innerHTML = '<option value="" disabled selected>Select a review</option>';
          reviews.forEach(review => {
            const option = document.createElement('option');
            option.textContent = `${review.movieTitle}: ${review.reviewer} (${review.rating}/5) - ${review.reviewText}`;
            reviewsDropdown.appendChild(option);
          });
        }
  
        displayMovies(movies);
  
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', function() {
          const searchTerm = searchInput.value.toLowerCase();
          const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(searchTerm));
          displayMovies(filteredMovies);
        });
  
        fetch('/api/reviews/all')
          .then(response => response.json())
          .then(allReviews => {
            const reviews = allReviews.map(review => ({
              ...review,
              movieTitle: movies.find(movie => movie.id === review.movieId).title
            }));
            populateReviewsDropdown(reviews);
          })
          .catch(error => console.error('Error fetching all reviews:', error));
      })
      .catch(error => console.error('Error fetching movies:', error));
  });
  