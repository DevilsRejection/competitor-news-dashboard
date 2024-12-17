document.addEventListener('DOMContentLoaded', function () {
  const companies = ["Accenture", "TCS", "Deloitte", "Globant", "EPAM", "Endava"]; // Companies to track
  const newsContainer = document.getElementById('news-container');

  // Function to fetch news for a single company with retry logic
  async function fetchNewsForCompany(company, retries = 2) {
    const apiUrl = `http://127.0.0.1:3000/news?q="${company}"`;

    while (retries > 0) {
      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch news for ${company}: HTTP Status ${response.status}`);
        }

        const data = await response.json();

        // Ensure the response has valid articles
        if (!data.articles || data.articles.length === 0) {
          console.warn(`No articles found for ${company}`);
          return { company, articles: [] };
        }

        // Filter and map articles with valid title and URL
        const articles = data.articles
          .filter(article => article.title && article.url) // Ensure valid title and URL
          .map(article => ({
            title: article.title,
            link: article.url,
          }));

        return { company, articles };

      } catch (error) {
        console.error(`Error fetching news for ${company}:`, error);
        retries--; // Retry logic
      }
    }

    // If all retries fail, return empty articles
    return { company, articles: [] };
  }

  // Function to fetch news for all companies and render on the page
  async function fetchAndRenderNews() {
    newsContainer.innerHTML = "<p>Loading news articles...</p>"; // Show loading message

    try {
      const promises = companies.map(company => fetchNewsForCompany(company));
      const newsData = await Promise.all(promises);

      newsContainer.innerHTML = ""; // Clear the loading message

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
          listItem.textContent = `No relevant articles found for ${companyData.company}`;
          articleList.appendChild(listItem);
        }

        companyNewsDiv.appendChild(articleList);
        newsContainer.appendChild(companyNewsDiv);
      });
    } catch (error) {
      console.error("Error fetching and rendering news:", error);
      newsContainer.innerHTML = "<p>Failed to load news articles. Please try again later.</p>";
    }
  }

  // Fetch and render news when the page loads
  fetchAndRenderNews();
});
