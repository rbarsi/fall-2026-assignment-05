import products from './data/products.json';

const productGrid = document.querySelector('#product-grid');

// The shared script also runs on Home and About, which have no product grid.
if (productGrid) {
  const productsPerPage = 5;
  const categoryFilter = document.querySelector('#category-filter');
  const requestedCategory = new URLSearchParams(window.location.search).get(
    'category',
  );
  const validCategories = new Set(products.map((product) => product.category));
  let selectedCategory = validCategories.has(requestedCategory)
    ? requestedCategory
    : '';
  categoryFilter.value = selectedCategory;
  let filteredProducts = [];
  let totalPages = 1;
  let currentPage = 1;
  const previousButton = document.querySelector('#previous-page');
  const nextButton = document.querySelector('#next-page');
  const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  function renderProducts() {
    filteredProducts = selectedCategory
      ? products.filter((product) => product.category === selectedCategory)
      : products;
    totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    document.querySelector('#catalog-heading').textContent =
      selectedCategory || 'Shop the collection';
    const startIndex = (currentPage - 1) * productsPerPage;
    const visibleProducts = filteredProducts.slice(
      startIndex,
      startIndex + productsPerPage,
    );
    productGrid.replaceChildren();

    visibleProducts.forEach((product) => {
      const card = document.createElement('article');
      card.className = 'product-card';
      const image = document.createElement('img');
      image.src = product.imageUrl;
      image.alt = `${product.name} product mockup`;
      image.width = 400;
      image.height = 300;
      const details = document.createElement('div');
      details.className = 'product-details';
      const category = document.createElement('span');
      category.className = 'badge';
      category.textContent = product.category;
      const title = document.createElement('h3');
      title.textContent = product.name;
      const price = document.createElement('p');
      price.className = 'price';
      price.textContent = priceFormatter.format(product.price);
      const description = document.createElement('p');
      description.textContent = product.description;
      details.append(category, title, price, description);
      card.append(image, details);
      productGrid.append(card);
    });

    document.querySelector('#page-indicator').textContent =
      `Page ${currentPage} of ${totalPages}`;
    document.querySelector('#product-count').textContent =
      `Showing ${startIndex + 1}–${startIndex + visibleProducts.length} of ${filteredProducts.length} products`;
    previousButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
  }

  previousButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      renderProducts();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage += 1;
      renderProducts();
    }
  });

  categoryFilter.addEventListener('change', () => {
    selectedCategory = categoryFilter.value;
    currentPage = 1;
    const url = new URL(window.location.href);
    if (selectedCategory) {
      url.searchParams.set('category', selectedCategory);
    } else {
      url.searchParams.delete('category');
    }
    window.history.replaceState(null, '', url);
    renderProducts();
  });

  renderProducts();
}
