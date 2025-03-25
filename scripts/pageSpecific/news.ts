
/*
* Loads news from the news API
*/
export function DisplayNewsPage() {
    console.log("Calling DisplayNewsPage()...");
    const API_KEY = "d4392d8160b24f7b9678647eab03b02d";
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) {
        console.error("[ERROR] Unable to find newsContainer");
        return;
    }
    interface Article {
        title: string;
        description: string;
        publishedAt: string;
        url: string;
    }
    // Fetch news about Oshawa
    fetch(`https://newsapi.org/v2/everything?q=Oshawa&sortBy=publishedAt&apiKey=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.articles && data.articles.length > 0) {
                newsContainer.innerHTML = ''; // Clear existing content
                
                data.articles.slice(0, 18).forEach((article: Article) => { // Display first 18 articles
                    const articleElement = document.createElement('div');
                    articleElement.className = 'col-md-4 mb-4';
                    articleElement.innerHTML = `
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title">${article.title}</h5>
                                <p class="card-text">${article.description || ''}</p>
                                <p class="card-text">
                                    <small class="text-muted">
                                        Published On: ${new Date(article.publishedAt).toLocaleDateString()}
                                    </small>
                                </p>
                                <a href="${article.url}" class="btn btn-primary" target="_blank">
                                    Click To Read More
                                </a>
                            </div>
                        </div>
                    `;
                    newsContainer.appendChild(articleElement);
                });
            } else {
                newsContainer.innerHTML = `
                    <div class="alert alert-info" role="alert">
                        No news articles found for Oshawa at this time.
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            newsContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Error loading news. Please try again later.
                </div>
            `;
        });
}
