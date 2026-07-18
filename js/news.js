// ============================================
// F1 NEWS - Live from Motorsport.com & F1.com
// ============================================

const newsContainer = document.getElementById('news-container');

const feeds = [
    {
        name: 'Motorsport F1',
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.motorsport.com/rss/f1/news/'
    },
    {
        name: 'Formula 1',
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.formula1.com/feeds/latest-news.html'
    }
];

async function fetchAllNews() {
    try {
        const responses = await Promise.all(feeds.map(feed => fetch(feed.url)));
        const data = await Promise.all(responses.map(res => res.json()));

        let allArticles = [];
        data.forEach((feedData, index) => {
            if (feedData.items) {
                const articles = feedData.items.map(item => ({
                    title: item.title,
                    description: item.description || 'Read more about this story...',
                    link: item.link,
                    pubDate: item.pubDate,
                    source: feeds[index].name,
                    image: item.enclosure?.link || null
                }));
                allArticles = allArticles.concat(articles);
            }
        });

        allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        allArticles = allArticles.slice(0, 20);
        renderNews(allArticles);

    } catch (error) {
        console.error('Error fetching news:', error);
        newsContainer.innerHTML = `
            <div class="error-message">
                ⚠️ Unable to load news. Please try again later.
                <br><small>${error.message}</small>
            </div>
        `;
    }
}

function renderNews(articles) {
    if (articles.length === 0) {
        newsContainer.innerHTML = '<p>No news available at the moment.</p>';
        return;
    }

    let html = '';
    articles.forEach(article => {
        const date = new Date(article.pubDate);
        const formattedDate = date.toLocaleDateString('en-US', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        const imageUrl = article.image || 'https://via.placeholder.com/400x200/e10600/ffffff?text=F1+News';

        html += `
            <div class="news-card">
                <img src="${imageUrl}" alt="${article.title}" loading="lazy" 
                     onerror="this.src='https://via.placeholder.com/400x200/333333/ffffff?text=No+Image'">
                <div class="news-card-content">
                    <span class="news-source">${article.source}</span>
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <div class="news-meta">
                        <span>📅 ${formattedDate}</span>
                        <a href="${article.link}" target="_blank" class="read-more">Read Full Story →</a>
                    </div>
                </div>
            </div>
        `;
    });

    newsContainer.innerHTML = html;
}

fetchAllNews();
setInterval(fetchAllNews, 300000);