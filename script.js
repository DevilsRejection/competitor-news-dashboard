document.addEventListener('DOMContentLoaded', function () {
  const companies = ["Accenture", "TCS", "Deloitte", "Globant", "EPAM", "Endava"]; // Companies to track
  const newsContainer = document.getElementById('news-container');

  async function fetchNewsForCompany(company) {
    const apiUrl = `http://127.0.0.1:3000/news?q=${company}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        console.error(`Failed to fetch news for ${company}: HTTP Status ${response.status}`);
        return { company, articles: [] }; // Return empty articles on failure
      }

      const data = await response.json();

      // Check if articles are returned
      if (!data.articles || data.articles.length === 0) {
        return { company, articles: [] };
      }

      // Map the articles
      const articles = data.articles.map(article => ({
        title: article.title,
        link: article.url,
      }));

      return { company, articles };

    } catch (error) {
      console.error(`Error fetching news for ${company}:`, error);
      return { company, articles: [] }; // Return empty articles on error
    }
  }

  async function fetchAndRenderNews() {
    newsContainer.innerHTML = ""; // Clear previous content
    const promises = companies.map(company => fetchNewsForCompany(company));
    const newsData = await Promise.all(promises);

    // Render the news for each company
    newsData.forEach(companyData => {
      const companyNewsDiv = document.createElement('div');
      companyNewsDiv.classList.add('company-news');

      const companyTitle = document.createElement('h2');
      companyTitle.textContent = companyData.company;
      companyNewsDiv.appendChild(companyTitle);

      const articleList = document.createElement('ul');

      if (companyData.articles.length > 0) {
        companyData.articles.forEach(article => {
          const listItem = document.createElement('li');
          const link = document.createElement('a');
          link.href = article.link;
          link.textContent = article.title;
          link.target = "_blank"; // Open in a new tab
          listItem.appendChild(link);
          articleList.appendChild(listItem);
        });
      } else {
        const listItem = document.createElement('li');
        listItem.textContent = `No articles found`;
        articleList.appendChild(listItem);
      }

      companyNewsDiv.appendChild(articleList);
      newsContainer.appendChild(companyNewsDiv);
    });
  }

  fetchAndRenderNews(); // Start fetching and rendering news
});
