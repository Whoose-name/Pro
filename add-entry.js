let selectedRating = 0;

const starRating = document.getElementById('starRating');
const stars = starRating.querySelectorAll('span');
const ratingInput = document.getElementById('rating');
const movieForm = document.getElementById('movieForm');
const submitBtn = document.getElementById('submitBtn');
const statusMessage = document.getElementById('statusMessage');

// Star rating functionality
stars.forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.rating);
        ratingInput.value = selectedRating;
        updateStars();
    });

    star.addEventListener('mouseenter', () => {
        const rating = parseInt(star.dataset.rating);
        highlightStars(rating);
    });
});

starRating.addEventListener('mouseleave', () => {
    updateStars();
});

function highlightStars(rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.textContent = '★';
            star.classList.add('active');
        } else {
            star.textContent = '☆';
            star.classList.remove('active');
        }
    });
}

function updateStars() {
    highlightStars(selectedRating);
}

// Form submission
movieForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (selectedRating === 0) {
        showStatus('Please select a rating', 'error');
        return;
    }

    const movie = {
        title: document.getElementById('movieTitle').value,
        date: document.getElementById('watchDate').value,
        rating: selectedRating,
        remarks: document.getElementById('remarks').value
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(movie)
        });

        // Note: no-cors mode doesn't allow reading response, so we assume success
        showStatus('Movie added successfully!', 'success');
        movieForm.reset();
        selectedRating = 0;
        updateStars();
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    } catch (error) {
        showStatus('Error adding movie. Please try again.', 'error');
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add to Diary';
    }
});

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    if (type === 'error') {
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
    }
}

// Set today's date as default
document.getElementById('watchDate').valueAsDate = new Date();
