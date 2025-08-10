const API_KEY = "30390da6c321496f2c46e19976399e4f";
const GENRE_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
const MOVIE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US`;

const genreContainer = document.getElementById("genre-container");
const getMovieBtn = document.getElementById("get-movie");
const movieResult = document.getElementById("movie-result");
const moviePoster = document.getElementById("movie-poster");
const movieTitle = document.getElementById("movie-title");

let selectedGenres = [];

moviePoster.src = "";
movieTitle.textContent = "";
movieResult.classList.add("hidden");

fetch(GENRE_URL)
  .then(res => {
    console.log("Genre fetch status:", res.status);
    return res.json();
  })
  .then(data => {
    console.log("Genres data:", data);
    data.genres.forEach(genre => {
      if (genre.id === 10770) return; // exclude TV Movie

      const btn = document.createElement("button");
      btn.classList.add("genre-btn");
      btn.textContent = genre.name;
      btn.addEventListener("click", () => toggleGenre(genre.id, btn));
      genreContainer.appendChild(btn);
    });
  })
  .catch(err => {
    genreContainer.textContent = "Failed to load genres.";
    console.error("Error loading genres:", err);
  });

function toggleGenre(id, btn) {
  if (selectedGenres.includes(id)) {
    selectedGenres = selectedGenres.filter(g => g !== id);
    btn.classList.remove("active");
  } else {
    selectedGenres.push(id);
    btn.classList.add("active");
  }
  movieResult.classList.add("hidden");
}

getMovieBtn.addEventListener("click", () => {
  if (selectedGenres.length === 0) {
    alert("Please select at least one genre!");
    return;
  }

  const randomPage = Math.floor(Math.random() * 5) + 1;
  const url = `${MOVIE_URL}&with_genres=${selectedGenres.join(",")}&certification_country=US&certification.lte=PG-13&page=${randomPage}`;

  fetch(url)
    .then(res => {
      console.log("Movie fetch status:", res.status);
      return res.json();
    })
    .then(data => {
      if (!data.results || data.results.length === 0) {
        alert("No movies found for the selected genres.");
        return;
      }

      const safeResults = data.results.filter(movie => movie.adult === false);
      if (safeResults.length === 0) {
        alert("No family-friendly movies found.");
        return;
      }

      const movie = safeResults[Math.floor(Math.random() * safeResults.length)];

      if (!movie.poster_path) {
        moviePoster.src = "";
        moviePoster.alt = "No poster available";
      } else {
        moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        moviePoster.alt = movie.title;
      }
      movieTitle.textContent = movie.title;
      movieResult.classList.remove("hidden");
    })
    .catch(err => {
      alert("Failed to fetch movies. Please try again later.");
      console.error("Error fetching movies:", err);
    });
});
