const API_KEY = 'api_key=29b6d168fa1cf6882cb94e1bd043c739&page=1';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500/';

const sections = {
    movies: document.getElementById('movies'),
    series: document.getElementById('series'),
    trending: document.getElementById('trending'),
    popular: document.getElementById('popular'),
    movies2: document.getElementById('movies-2'),
    series2: document.getElementById('series-2'),
    popular2: document.getElementById('popular-2'),
    searchResults: document.getElementById('search-results'),
    searchResultsContainer: document.getElementById('search-results-container'),
    searchResultsTitle: document.getElementById('search-results-title'),
};

// Initialize search input event listener
document.getElementById('search-input').addEventListener('input', () => {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        searchMovies(query);
    } else {
        resetToDefaultScreen();
    }
});

// Search function to get movie results
async function searchMovies(query) {
    try {
        const searchUrl = `${BASE_URL}/search/multi?query=${query}&${API_KEY}&page=1`;
        const res = await fetch(searchUrl);
        const data = await res.json();

        if (data.results.length > 0) {
            displaySearchResults(data.results);
        } else {
            sections.searchResultsTitle.style.display = 'none';
            sections.searchResultsContainer.style.display = 'none';
            alert('No results found.');
        }
    } catch (error) {
        console.log('Error fetching search results:', error);
    }
}

// Function to display search results
function displaySearchResults(results) {
    sections.searchResults.innerHTML = ''; 
    sections.searchResultsTitle.style.display = 'block';
    sections.searchResultsContainer.style.display = 'block';

    results.forEach(item => {
        const { title, name, poster_path, vote_average, overview, id } = item;
        const displayTitle = title || name;
        const ratingColor = getRatingColor(vote_average);

        const resultItem = document.createElement('div');
        resultItem.classList.add('movie-item');
        resultItem.innerHTML = `
            <img src="${IMG_URL + poster_path}" alt="${displayTitle}">
            <div class="title-rating">
                <p>${displayTitle}</p>
                <p style="color: ${ratingColor};">${vote_average}</p>
            </div>
            <div class="movie-description">${overview}</div>
            <button class="watch-trailer-btn" data-id="${id}">Watch Trailer</button>
        `;
        sections.searchResults.appendChild(resultItem);
    });

    attachTrailerEventListeners();
}

// Reset to default screen when search is cleared
function resetToDefaultScreen() {
    sections.searchResults.innerHTML = '';
    sections.searchResultsTitle.style.display = 'none';
    sections.searchResultsContainer.style.display = 'none';
}

// Fetch default movies and populate sections
function loadDefaultMovies() {
    getMovies(`${BASE_URL}/discover/movie?sort_by=popularity.desc&language=en&${API_KEY}&page=1`, sections.movies);
    getMovies(`${BASE_URL}/discover/tv?sort_by=popularity.desc&language=en&${API_KEY}&page=1`, sections.series);
    getMovies(`${BASE_URL}/trending/all/day?${API_KEY}&page=1`, sections.trending);
    getMovies(`${BASE_URL}/discover/movie?sort_by=popularity.desc&language=en&${API_KEY}&page=1`, sections.popular);

    getMovies(`${BASE_URL}/discover/movie?sort_by=popularity.desc&language=en&${API_KEY}&page=2`, sections.movies2);
    getMovies(`${BASE_URL}/discover/tv?sort_by=popularity.desc&language=en&${API_KEY}&page=2`, sections.series2);
    getMovies(`${BASE_URL}/discover/movie?sort_by=popularity.desc&language=en&${API_KEY}&page=2`, sections.popular2);
}

loadDefaultMovies();

// Fetch movies from API
async function getMovies(url, container) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.results.length > 0) {
            displayMovies(data.results, container);
        }
    } catch (error) {
        console.log('Error fetching data:', error);
    }
}

function getRatingColor(vote) {
    if (vote < 5) return 'red';
    if (vote >= 5 && vote <= 8) return 'yellow';
    return 'green';
}

function displayMovies(movies, container) {
    container.innerHTML = '';

    movies.forEach(movie => {
        const { title, poster_path, vote_average, overview, id } = movie;
        const ratingColor = getRatingColor(vote_average);

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie-item');
        movieEl.innerHTML = `
            <img src="${IMG_URL + poster_path}" alt="${title}">
            <div class="title-rating">
                <p>${title}</p>
                <p style="color: ${ratingColor};">${vote_average}</p>
            </div>
            <div class="movie-description">${overview}</div>
            <button class="watch-trailer-btn" data-id="${id}">Watch Trailer</button>
        `;
        container.appendChild(movieEl);
    });

    attachTrailerEventListeners();
}

// Fetch and open the trailer
async function fetchTrailer(movieId) {
    try {
        const res = await fetch(`${BASE_URL}/movie/${movieId}/videos?${API_KEY}`);
        const data = await res.json();

        if (data.results.length > 0) {
            const trailerKey = data.results[0].key;
            window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank');
        } else {
            alert('Trailer not available.');
        }
    } catch (error) {
        console.log('Error fetching trailer:', error);
    }
}

// Attach event listeners to Watch Trailer buttons
function attachTrailerEventListeners() {
    document.querySelectorAll('.watch-trailer-btn').forEach(button => {
        button.addEventListener('click', function () {
            const movieId = this.getAttribute('data-id');
            fetchTrailer(movieId);
        });
    });
}

// Scroll button setup for all sections
function setupScrollButton(leftBtnId, rightBtnId, containerId) {
    document.getElementById(leftBtnId).addEventListener('click', () => {
        document.getElementById(containerId).scrollBy({
            left: -300,
            behavior: 'smooth'
        });
    });

    document.getElementById(rightBtnId).addEventListener('click', () => {
        document.getElementById(containerId).scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    });
}

// Initialize scrolling for all sections including search results
setupScrollButton('scroll-movies-left', 'scroll-movies-right', 'movies');
setupScrollButton('scroll-movies-left-2', 'scroll-movies-right-2', 'movies-2');
setupScrollButton('scroll-series-left', 'scroll-series-right', 'series');
setupScrollButton('scroll-series-left-2', 'scroll-series-right-2', 'series-2');
setupScrollButton('scroll-trending-left', 'scroll-trending-right', 'trending');
setupScrollButton('scroll-popular-left', 'scroll-popular-right', 'popular');
setupScrollButton('scroll-popular-left-2', 'scroll-popular-right-2', 'popular-2');

// **Scroll Buttons for Search Results**
setupScrollButton('scroll-search-left', 'scroll-search-right', 'search-results');
