/**
 * menu.js - Manejo del menú de la cafetería
 * Carga datos desde JSON y renderiza productos
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // VARIABLES GLOBALES
  // ============================================
  
  let menuData = null;
  let currentFilter = 'todos';
  
  // ============================================
  // REFERENCIAS DEL DOM
  // ============================================
  
  const menuContainer = document.getElementById('menu-container');
  const menuFilters = document.getElementById('menu-filters');
  const diaActualBadge = document.getElementById('dia-actual');
  
  // ============================================
  // CARGA DE DATOS
  // ============================================
  
  /**
   * Carga los datos del menú desde el archivo JSON
   */
  async function cargarMenu() {
    if (!menuContainer) return;
    
    // Mostrar loading
    menuContainer.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p>Cargando menú...</p>
      </div>
    `;
    
    try {
      const response = await fetch('data/menu.json');
      if (!response.ok) throw new Error('Error al cargar menú');
      
      menuData = await response.json();
      
      // Mostrar día actual
      if (diaActualBadge) {
        diaActualBadge.textContent = window.CafeteriaUtils.getDiaActual();
      }
      
      // Renderizar menú
      renderizarMenu();
      
    } catch (error) {
      console.error('Error:', error);
      menuContainer.innerHTML = `
        <div class="empty-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>No se pudo cargar el menú. Inténtalo de nuevo más tarde.</p>
        </div>
      `;
    }
  }
  
  // ============================================
  // RENDERIZADO
  // ============================================
  
  /**
   * Renderiza los productos del menú según el filtro actual
   */
  function renderizarMenu() {
    if (!menuData || !menuContainer) return;
    
    const diaActual = window.CafeteriaUtils.getDiaActual();
    
    let productosAMostrar = [];
    
    if (currentFilter === 'todos') {
      // Mostrar menú del día actual
      const menuHoy = menuData.semana.find(m => m.dia === diaActual);
      if (menuHoy && menuHoy.productos.length > 0) {
        productosAMostrar = menuHoy.productos;
      }
    } else if (currentFilter === 'semana') {
      // Mostrar todos los productos de la semana
      menuData.semana.forEach(dia => {
        productosAMostrar = [...productosAMostrar, ...dia.productos];
      });
    } else {
      // Filtrar por día específico
      const menuDia = menuData.semana.find(m => m.dia === currentFilter);
      if (menuDia) {
        productosAMostrar = menuDia.productos;
      }
    }
    
    // Renderizar productos
    if (productosAMostrar.length === 0) {
      menuContainer.innerHTML = `
        <div class="empty-message">
          <i class="fas fa-utensils"></i>
          <p>${currentFilter === 'todos' 
            ? 'No hay menú disponible hoy. Consulta los otros días.' 
            : 'No hay productos disponibles para este día.'}</p>
        </div>
      `;
      return;
    }
    
    const html = productosAMostrar.map(producto => `
      <div class="product-card">
        <!-- SE CAMBIÓ EL PLACEHOLDER POR LA ETIQUETA DE IMAGEN REAL -->
        <div class="product-image-container">
          <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image" 
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="product-image-placeholder" style="display: none;">
            <i class="fas fa-utensils"></i>
          </div>
        </div>
        <div class="product-info">
          <h3 class="product-name">${producto.nombre}</h3>
          <p class="product-description">${producto.descripcion}</p>
          <div class="product-price">${window.CafeteriaUtils.formatPrice(producto.precio)}</div>
          ${producto.etiquetas && producto.etiquetas.length > 0 ? `
            <div class="product-tags">
              ${producto.etiquetas.map(tag => `
                <span class="product-tag">${tag}</span>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
    
    menuContainer.innerHTML = html;
  }
  
  // ============================================
  // FILTROS
  // ============================================
  
  /**
   * Inicializa los filtros del menú
   */
  function initFilters() {
    if (!menuFilters) return;
    
    const filterButtons = menuFilters.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Actualizar filtro activo
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Aplicar filtro
        currentFilter = btn.dataset.filter;
        renderizarMenu();
      });
    });
  }
  
  // ============================================
  // INICIALIZACIÓN
  // ============================================
  
  cargarMenu();
  initFilters();
});

// ============================================
// FUNCIONES PARA OTRAS PÁGINAS
// ============================================

/**
 * Renderiza el menú del día para la página de inicio
 * @param {string} containerId - ID del contenedor
 */
async function renderizarMenuInicio(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  try {
    const response = await fetch('data/menu.json');
    if (!response.ok) throw new Error('Error al cargar menú');
    
    const data = await response.json();
    const diaActual = window.CafeteriaUtils.getDiaActual();
    const menuHoy = data.semana.find(m => m.dia === diaActual);
    
    if (menuHoy && menuHoy.productos.length > 0) {
      container.innerHTML = menuHoy.productos.slice(0, 3).map(producto => `
        <div class="product-card">
          <!-- SE CAMBIÓ EL PLACEHOLDER POR LA ETIQUETA DE IMAGEN REAL AQUÍ TAMBIÉN -->
          <div class="product-image-container">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="product-image-placeholder" style="display: none;">
              <i class="fas fa-utensils"></i>
            </div>
          </div>
          <div class="product-image-container">


          <div class="product-info">
            <h3 class="product-name">${producto.nombre}</h3>
            <p class="product-description">${producto.descripcion}</p>
            <div class="product-price">${window.CafeteriaUtils.formatPrice(producto.precio)}</div>
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = `
        <div class="empty-message">
          <i class="fas fa-utensils"></i>
          <p>No hay menú disponible hoy</p>
        </div>
      `;
    }
  } catch (error) {
    container.innerHTML = `
      <div class="empty-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>No se pudo cargar el menú</p>
      </div>
    `;
  }
}


