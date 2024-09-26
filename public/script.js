document.addEventListener('DOMContentLoaded', function() {
  fetch('/api/movies')
    .then(response => response.json())
    .then(movies => {
      const moviesContainer = document.getElementById('movies');
      const movieSelect = document.getElementById('movie-select');

      movies.forEach(movie => {
        const option = document.createElement('option');
        option.value = movie.id;
        option.textContent = movie.title;
        movieSelect.appendChild(option);

        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
          <img src="${movie.imageUrl}" alt="${movie.title} poster" class="movie-poster">
          <h2>${movie.title}</h2>
          <div class="movie-info">
            <p>${movie.description}</p>
            <div class="reviews" id="reviews-${movie.id}">
              <h3>Reviews:</h3>
              <div class="review-list"></div>
            </div>
          </div>
        `;
        moviesContainer.appendChild(movieCard);

        movieCard.addEventListener('mouseenter', () => {
          const reviewList = movieCard.querySelector('.review-list');
          reviewList.innerHTML = '';
          movie.reviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            reviewItem.innerHTML = `
              <strong>${review.reviewer}</strong>: ${review.reviewText} (${review.rating}/5)
            `;
            reviewList.appendChild(reviewItem);
          });
          reviewList.style.display = 'block';
        });

        movieCard.addEventListener('mouseleave', () => {
          const reviewList = movieCard.querySelector('.review-list');
          reviewList.style.display = 'none';
        });
      });

      document.getElementById('review-form-element').addEventListener('submit', function(event) {
        event.preventDefault();

        const selectedMovieId = movieSelect.value;
        const reviewerName = document.getElementById('reviewer').value;
        const reviewText = document.getElementById('reviewText').value;
        const rating = document.getElementById('rating').value;

        if (!selectedMovieId || !reviewerName || !reviewText || !rating) {
          alert('Please fill in all fields.');
          return;
        }

        const review = {
          movieId: selectedMovieId,
          reviewer: reviewerName,
          reviewText: reviewText,
          rating: parseInt(rating)
        };

        fetch('/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(review)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const reviewDiv = document.createElement('div');
          reviewDiv.className = 'review-item';
          reviewDiv.innerHTML = `
            <strong>${reviewerName}</strong>: ${reviewText} (${rating}/5)
          `;
          document.querySelector(`#reviews-${selectedMovieId} .review-list`).appendChild(reviewDiv);

          document.getElementById('reviewer').value = '';
          document.getElementById('reviewText').value = '';
          document.getElementById('rating').value = '';
        })
        .catch(error => {
          console.error('Error submitting review:', error);
          alert('There was an error submitting your review. Please try again.');
        });
      });

      const searchInput = document.getElementById('search-input');
      searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const movieCards = document.querySelectorAll('.movie-card');

        movieCards.forEach(card => {
          const title = card.querySelector('h2').textContent.toLowerCase();
          if (title.includes(searchTerm)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    })
    .catch(error => {
      console.error('Error fetching movies:', error);
      alert('There was an error fetching movies. Please try again.');
    });
});
