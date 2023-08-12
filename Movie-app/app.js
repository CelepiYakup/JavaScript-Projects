const apiKey = "Your-API-KEY"; // Use your own API key

const imgApi = "https://image.tmdb.org/t/p/w1280";

const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;

const form = document.getElementById("search-form");

const query = document.getElementById("search-input");

const result = document.getElementById("result");

let page = 1;
let isSearching = false;


async function commuteData(url) {
    try {
        const response = await fetch(url); 
        if (!response.ok) {
            throw new Error("Network was not response.");
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

async function commuteAndSearch(url){
    const data = await commuteData(url);
    if (data && data.results); {
        showResults(data.results);
    }
}

function newMovieCard(movie) {
        const { poster_path, original_title, release_date, overview } = movie;
        const imagePath = poster_path ? imgApi + poster_path : "./img-01.jpeg";
        const truncatedTitle = original_title.length > 15 ? original_title.slice(0, 15) + "..." : original_title;
        const formattedDate = release_date || "No release date";
        const cardTemplate = `
            <div class="column">
                <div class="card">
                    <a class="card-media" href="./img-01.jpeg">
                        <img src="${imagePath}" alt="${original_title}" width="100%" />
                    </a>
                    <div class="card-content">
                        <div class="card-header">
                            <div class="left-content">
                            <h3 style="font-weight: 600">${truncatedTitle}</h3>
                            <span style="color: #12efec">${formattedDate}</span>
                            </div>
                        <div class="right-content">
                            <a href="${imagePath}" target="_blank" class="card-btn">See Cover</a>
                        </div>
                    </div>
                    <div class="info">
                        ${overview || "No overview yet..."}
                    </div>
                </div>
            </div>
        </div>
        `;
    return cardTemplate;
}

function RESULTS(){
    result.innerHTML = "";
}



function showResults(item){
    const newContent = item.map(newMovieCard).join("")
    result.innerHTML += newContent || "<p>No results found. </p>";
}


async function loadMoreResults(){
    if (isSearching) {
        return;
    }
    page++;
    const searchTerm = query.value;
    const url = searchTerm ? `${searchUrl}${searchTerm}&page=${page}` : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    await commuteAndSearch(url);
}

function detectEnd(){
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
        loadMoreResults();
    }
}

async function handleSearch(e) {
    e.preventDefault();
    const searchTerm = query.value.trim();
    if(searchTerm) {
        isSearching = true;
        RESULTS();
        const newUrl = `${searchUrl}${searchTerm}&page=${page}`;
        await commuteAndSearch(newUrl);
        query.value = "";
    }
}

form.addEventListener('submit', handleSearch);
window.addEventListener('scroll', detectEnd);
window.addEventListener('resize', detectEnd);


async function init(){
    RESULTS();
    const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    isSearching = false;
    await commuteAndSearch(url);
}
init();


