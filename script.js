document.addEventListener('DOMContentLoaded', function () {
    const companies = ["Accenture", "TCS", "Deloitte", "Globant", "EPAM", "Endava"];
    const newsContainer = document.getElementById('news-container');

    async function fetchNewsForCompany(company) {
        const apiUrl = `http://127.0.0.1:3001/news?q=${encodeURIComponent(company)}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            const data = await response.json();
            return data.articles || [];
        } catch (error) {
            console.error(`Error fetching news for ${company}:`, error);
            return [];
        }
    }

    async function fetchAndDisplayNews() {
        newsContainer.innerHTML = "<p class='loading'>Loading news articles...</p>";
        const promises = companies.map(company => fetchNewsForCompany(company));
        const newsData = await Promise.all(promises);

        newsContainer.innerHTML = "";

        newsData.forEach((articles, index) => {
            const companyName = companies[index];
            const companyDiv = document.createElement('div');
            companyDiv.classList.add('company-news');

            const companyTitle = document.createElement('h2');
            companyTitle.textContent = companyName;
            companyDiv.appendChild(companyTitle);

            const articleList = document.createElement('ul');

            if (articles.length > 0) {
                articles.forEach(article => {
                    const listItem = document.createElement('li');

                    const link = document.createElement('a');
                    link.href = article.url;
                    link.textContent = article.title;
                    link.target = "_blank";
                    listItem.appendChild(link);

                    const summaryButton = document.createElement('button');
                    summaryButton.textContent = "Summarize";
                    summaryButton.onclick = () => {
    const articleText = `${article.title}. ${article.description}`;
    fetchSummary(articleText, listItem);
};

                    listItem.appendChild(summaryButton);
                    articleList.appendChild(listItem);
                });
            } else {
                const noNewsItem = document.createElement('li');
                noNewsItem.textContent = "No news available.";
                noNewsItem.classList.add('no-news');
                articleList.appendChild(noNewsItem);
            }

            companyDiv.appendChild(articleList);
            newsContainer.appendChild(companyDiv);
        });
    }

    async function fetchSummary(content, listItem) {
    try {
        const response = await fetch('http://127.0.0.1:3001/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });

        if (!response.ok) throw new Error("Failed to fetch summary");

        const data = await response.json();
        console.log('Summary:', data.summary); // Log summary for debugging

        const summaryDiv = document.createElement('div');
        summaryDiv.classList.add('summary');
        summaryDiv.textContent = data.summary;
        listItem.appendChild(summaryDiv);
    } catch (error) {
        console.error("Error fetching summary:", error);
        alert("Error: Unable to fetch summary. Please check the server.");
    }
}


    fetchAndDisplayNews();
});
