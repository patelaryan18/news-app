const API_KEY = "eb1f0583cd7f47efb54ee7e9e923065a";

const url = "https://newsapi.org/v2/everything?q=";
const cardsContainer = document.getElementById("cards-container");
const newsCardTemplate = document.getElementById("template-news-card");
const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-text');
const backToTopButton = document.getElementById('back-to-top');
const cursor = document.querySelector(".cursor");
let curSelectedNav = null;

window.addEventListener("load", () => fetchNews("India"));
window.addEventListener('scroll', toggleBackToTopButton);
document.addEventListener('mousemove', moveCursor);
searchButton.addEventListener("click", handleSearch);
backToTopButton.addEventListener('click', scrollToTop);

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        const data = await res.json();

        if (data.articles) {
            bindData(data.articles);
        } else {
            console.error("Invalid data format received from API:", data);
        }
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}


function bindData(articles) {
    if (!articles || !Array.isArray(articles)) {
        console.error("Invalid data received from API");
        return;
    }

    cardsContainer.innerHTML = "";

    if (articles.length === 0) {
        console.warn("No articles found for the given query");
        return;
    }

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const { urlToImage, title, description, publishedAt, source, url } = article;

    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = urlToImage;
    newsTitle.innerHTML = title;
    newsDesc.innerHTML = description;

    const date = new Date(publishedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    newsSource.innerHTML = `${source.name} . ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => window.open(url, "_blank"));
}

function onNavItemClick(id) {
    fetchNews(id);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = document.getElementById(id);
    curSelectedNav.classList.add('active');
}

function handleSearch() {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = null;
}

function toggleBackToTopButton() {
    backToTopButton.style.display = window.pageYOffset > 200 ? 'block' : 'none';
}

function moveCursor(e) {
    let x = e.pageX;
    let y = e.pageY;
    cursor.style.left = `${x - 10}px`
    cursor.style.top = `${y - 10}px`
  }

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
