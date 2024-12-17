document.addEventListener('DOMContentLoaded', function () {
  const companies = ["Accenture", "TCS", "Deloitte", "Globant", "EPAM", "Endava"];
  const newsContainer = document.getElementById('news-container');
  const companySelect = document.getElementById('company-select');

  async function fetchNewsForCompany(company) {
    const apiUrl = `http://127.0.0.1:3000/news?q=${company}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Failed to fetch news for ${company}`);
      const data = await response.json();
      return data.articles || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function fetchAndRenderNews(selectedCompany = "all") {
    newsContainer.innerHTML = "<p>Loading news articles...</p>";

    const companiesToFetch = selectedCompany === "all" ? companies : [selectedCompany];
    const promises = companiesToFetch.map(company => fetchNewsForCompany(company));
    const newsData = await Promise.all(promises);

    newsContainer.innerHTML = ""; // Clear loading message

    const allArticles = [];

    newsData.forEach((articles, index) => {
      const companyName = companiesToFetch[index];
      const companyDiv = document.createElement('div');
      companyDiv.classList.add('company-news');
      const companyTitle = document.createElement('h2');
      companyTitle.textContent = companyName;

      const articleList = document.createElement('ul');
      if (articles.length > 0) {
        articles.forEach(article => {
          allArticles.push(article); // Collect all articles for summarization
          const listItem = document.createElement('li');
          const link = document.createElement('a');
          link.href = article.url;
          link.textContent = article.title;
          link.target = "_blank";
          listItem.appendChild(link);
          articleList.appendChild(listItem);
        });
      } else {
        const listItem = document.createElement('li');
        listItem.textContent = `No articles found for ${companyName}`;
        articleList.appendChild(listItem);
      }

      companyDiv.appendChild(companyTitle);
      companyDiv.appendChild(articleList);
      newsContainer.appendChild(companyDiv);
    });

    // Add summarization button
    const summarizeButton = document.createElement('button');
    summarizeButton.textContent = "Summarize Articles";
    summarizeButton.onclick = () => fetchAndDisplaySummary(allArticles);
    newsContainer.appendChild(summarizeButton);
  }

  async function fetchAndDisplaySummary(articles) {
    const response = await fetch("http://127.0.0.1:3000/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articles }),
    });

    const data = await response.json();
    const summaryDiv = document.createElement('div');
    summaryDiv.innerHTML = `<h3>Summary:</h3><p>${data.summary || "No summary available."}</p>`;
    newsContainer.appendChild(summaryDiv);
  }

  companySelect.addEventListener('change', event => fetchAndRenderNews(event.target.value));
  fetchAndRenderNews(); // Initial render
});
