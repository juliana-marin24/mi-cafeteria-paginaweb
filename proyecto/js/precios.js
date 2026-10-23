/**
 * precios.js - Renderizado de precios de la cafetería
 * Carga datos desde JSON y renderiza categorías con precios
 */

document.addEventListener('DOMContentLoaded', () => {
  const preciosContainer = document.getElementById('precios-container');
  const promosContainer = document.getElementById('promos-container');
  
  if (!preciosContainer) return;
  
  // ============================================
  // CARGA Y RENDERIZADO
  // ============================================
  
  async function cargarPrecios() {
    // Mostrar loading
    preciosContainer.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p>Cargando precios...</p>
      </div>
    `;
    
    try {
      const response = await fetch('data/precios.json');
      if (!response.ok) throw new Error('Error al cargar precios');
      
      const data = await response.json();
      
      // Renderizar categorías
      renderizarCategorias(data.categorias);
      
      // Renderizar promociones si existen
      if (data.promociones && promosContainer) {
        renderizarPromociones(data.promociones);
      }
      
    } catch (error) {
      console.error('Error:', error);
      preciosContainer.innerHTML = `
        <div class="empty-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>No se pudieron cargar los precios. Inténtalo de nuevo más tarde.</p>
        </div>
      `;
    }
  }
  
  /**
   * Renderiza las categorías de precios
   * @param {Array} categorias - Lista de categorías
   */
  function renderizarCategorias(categorias) {
    if (!categorias || categorias.length === 0) {
      preciosContainer.innerHTML = `
        <div class="empty-message">
          <i class="fas fa-tags"></i>
          <p>No hay precios disponibles</p>
        </div>
      `;
      return;
    }
    
    const html = categorias.map(categoria => `
      <div class="price-category">
        <div class="price-category-header">
          <i class="fas ${categoria.icono || 'fa-utensils'}"></i>
          <h3>${categoria.nombre}</h3>
        </div>
        <div class="price-category-body">
          ${categoria.productos.map(producto => `
            <div class="price-item">
              <div class="price-item-info">
                <div class="price-item-name">${producto.nombre}</div>
                <div class="price-item-desc">${producto.descripcion}</div>
              </div>
              <div class="price-item-value">${window.CafeteriaUtils.formatPrice(producto.precio)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
    
    preciosContainer.innerHTML = html;
  }
  
  /**
   * Renderiza las promociones
   * @param {Array} promociones - Lista de promociones
   */
  function renderizarPromociones(promociones) {
    if (!promosContainer || !promociones || promociones.length === 0) return;
    
    const html = promociones.map(promo => `
      <div class="promo-card">
        <span class="promo-badge">${promo.descuento}</span>
        <h3 class="promo-name">${promo.nombre}</h3>
        <p class="promo-description">${promo.descripcion}</p>
        <div class="promo-price">${window.CafeteriaUtils.formatPrice(promo.precio)}</div>
      </div>
    `).join('');
    
    promosContainer.innerHTML = html;
  }
  
  // Iniciar carga
  cargarPrecios();
});
