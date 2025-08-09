const API_KEY = "30390da6c321496f2c46e19976399e4f"; // Replace with your TMDb API key
const GENRE_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
const MOVIE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US`;

let selectedGenres = [];

// Fetch genres
fetch(GENRE_URL)
    .then(res => res.json())
    .then(data => {
        const genreContainer = document.getElementById("genre-container");
        data.genres.forEach(genre => {
            const btn = document.createElement("button");
            btn.classList.add("genre-btn");
            btn.textContent = genre.name;
            btn.addEventListener("click", () => toggleGenre(genre.id, btn));
            genreContainer.appendChild(btn);
        });
    });

function toggleGenre(id, btn) {
    if (selectedGenres.includes(id)) {
        selectedGenres = selectedGenres.filter(g => g !== id);
        btn.classList.remove("active");
    } else {
        selectedGenres.push(id);
        btn.classList.add("active");
    }
}

document.getElementById("get-movie").addEventListener("click", () => {
    if (selectedGenres.length === 0) {
        alert("Please select at least one genre!");
        return;
    }

    const url = `${MOVIE_URL}&with_genres=${selectedGenres.join(",")}&page=${Math.floor(Math.random() * 5) + 1}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.results.length === 0) {
                alert("No movies found for selected genres.");
                return;
            }

            const movie = data.results[Math.floor(Math.random() * data.results.length)];
            document.getElementById("movie-title").textContent = movie.title;
            document.getElementById("movie-poster").src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            document.getElementById("movie-result").classList.remove("hidden");
        });
});
