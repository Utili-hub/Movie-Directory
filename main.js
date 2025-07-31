const apiKey = 'f6b9ccc106af1e3000de34a00bd9804f'; // Replace with your TMDb API key
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const results = document.getElementById('results');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');

let currentPage = 1;
let totalPages = 1;
let currentQuery = '';

form.addEventListener('submit', e => {
  e.preventDefault();
  const query = input.value.trim();
  if (query) {
    currentQuery = query;
    currentPage = 1;
    searchMovies(currentQuery, currentPage);
  }
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    searchMovies(currentQuery, currentPage);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    searchMovies(currentQuery, currentPage);
  }
});

async function searchMovies(query, page = 1) {
  results.innerHTML = '<p>Loading...</p>';
  try {
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
    const res = await fetch(url);
    const data = await res.json();

    totalPages = data.total_pages;

    if (!data.results || data.results.length === 0) {
      results.innerHTML = '<p>No results found.</p>';
      updatePagination();
      return;
    }

    results.innerHTML = data.results
      .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
      .map(item => `
        <div class="card">
          <img src="${item.poster_path ? 'https://image.tmdb.org/t/p/w500' + item.poster_path : 'https://via.placeholder.com/500x750?text=No+Image'}" alt="${item.title || item.name}" />
          <div class="card-body">
            <h3>${item.title || item.name}</h3>
            <p>${item.release_date || item.first_air_date || 'N/A'}</p>
            <p>${(item.overview && item.overview.length > 100) ? item.overview.substring(0, 100) + '...' : item.overview || 'No description.'}</p>
          </div>
        </div>
      `).join('');

    updatePagination();

  } catch (error) {
    results.innerHTML = '<p>Something went wrong. Please try again later.</p>';
    console.error(error);
    updatePagination();
  }
}



function updatePagination() {
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}
