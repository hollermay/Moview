document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/movies')
      .then(response => response.json())
      .then(movies => {
        console.log('Fetched movies:', movies); // Debugging line
        const moviesContainer = document.getElementById('movies');
        movies.forEach(movie => {
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
              movieId: parseInt(formData.get('movieId')), // Ensure movieId is an integer
              reviewer: formData.get('reviewer'),
              reviewText: formData.get('reviewText'),
              rating: parseInt(formData.get('rating')) // Ensure rating is an integer
            };
            console.log('Submitting review:', reviewData); // Debugging line
            fetch('/api/reviews', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(reviewData)
            })
            .then(response => response.json())
            .then(data => {
              console.log(data); // Debugging line
              if (data.message) {
                alert(data.message);
                window.location.reload();
              }
            })
            .catch(error => console.error('Error:', error)); // Handle errors
          });
        });
      })
      .catch(error => console.error('Error fetching movies:', error)); // Handle errors
  });
  