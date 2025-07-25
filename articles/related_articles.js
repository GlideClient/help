async function loadRelatedArticles(currentArticleId) {
    try {
        const response = await fetch('/articles.json');
        const data = await response.json();
        
        const currentArticle = data.articles.find(article => article.id === currentArticleId);
        if (!currentArticle || !currentArticle.relatedIds) {
            return;
        }
        
        const relatedArticles = currentArticle.relatedIds
            .map(id => data.articles.find(article => article.id === id))
            .filter(article => article); // Remove any undefined articles
        
        if (relatedArticles.length === 0) {
            return; 
        }

        const relatedHTML = generateRelatedArticlesHTML(relatedArticles, data.categories);
        
        const relatedSection = document.querySelector('.related-docs');
        if (relatedSection) {
            relatedSection.innerHTML = relatedHTML;
        }
        
    } catch (error) {
        console.error('Failed to load related articles:', error);
    }
}

function generateRelatedArticlesHTML(articles, categories) {
    const articlesHTML = articles.map(article => {
        const categoryName = categories.find(cat => cat.id === article.category)?.name || article.category;
        
        return `
            <div class="related-article-card">
                <a href="${article.path}" class="related-article-link">
                    <div class="related-article-image">
                        <img src="${article.image}" alt="${article.title}" loading="lazy">
                        <div class="related-article-overlay"></div>
                    </div>
                    <div class="related-article-content">
                        <div class="related-article-meta">
                            <span class="related-article-category">${categoryName}</span>
                        </div>
                        <h3 class="related-article-title">${article.title}</h3>
                        <p class="related-article-description">${article.description}</p>
                        <div class="related-article-arrow">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l9.2-9.2M17 17V7H7"/>
                            </svg>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }).join('');
    
    return `
        <h2>Related.</h2>
        <div class="related-articles-grid">
            ${articlesHTML}
        </div>
    `;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}
