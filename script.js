document.addEventListener('DOMContentLoaded', function () {

  const apiKey = "f120b69966b143c7b0b401cd2fb88c03"; // Replace with your actual API key
  const companies = ["Accenture", "TCS", "Deloitte", "Globant", "EPAM", "Endava"]; // Companies you want to track
  const newsContainer = document.getElementById('news-container');

    async function fetchNewsForCompany(company) {
        const apiUrl = `https://newsapi.org/v2/everything?q=${company}&apiKey=${f120b69966b143c7b0b401cd2fb88c03}`;

        try {
          const response = await fetch(apiUrl);
              if (!response.ok) {
                const message =  `HTTP error! Status: ${response.status}`
                console.error(`Failed to fetch news for ${company}:`, message);
                 return {company: company, articles: []}
             }
            const data = await response.json();

             // If no articles are found, handle this case
                if (!data.articles || data.articles.length === 0) {
                  return {company: company, articles: []}
                }

            const articles = data.articles.map((article) => ({
                title: article.title,
                link: article.url,
            }));

            return {company: company, articles: articles}

        } catch (error) {
          console.error(`Failed to fetch news for ${company}:`, error);
            return {company: company, articles: []} //Return empty articles to ensure all company articles return
        }
    }

  async function fetchAndRenderNews() {
    newsContainer.innerHTML = ""; // Clear previous content
      const promises = companies.map((company)=> fetchNewsForCompany(company))
        const newsData = await Promise.all(promises);

        //Loop through the data and create the articles to append to the main div
        newsData.forEach(function(companyData) {
            const companyNewsDiv = document.createElement('div');
            companyNewsDiv.classList.add('company-news');

            const companyTitle = document.createElement('h2');
            companyTitle.textContent = companyData.company;
            companyNewsDiv.appendChild(companyTitle);

            const articleList = document.createElement('ul');

            if(companyData.articles.length > 0) {
              companyData.articles.forEach(function(article) {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = article.link;
                    link.textContent = article.title;
                    link.target = "_blank"; // opens in a new tab
                    listItem.appendChild(link);
                    articleList.appendChild(listItem);
                });
            } else {
                 const listItem = document.createElement('li');
                 listItem.textContent = `No articles found`
                 articleList.appendChild(listItem);
            }

            companyNewsDiv.appendChild(articleList);
            newsContainer.appendChild(companyNewsDiv);
        })
  }
    fetchAndRenderNews(); // Call the function to start fetching data when the page loads
});
