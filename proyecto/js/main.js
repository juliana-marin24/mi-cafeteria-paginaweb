/**
 * main.js - Lógica principal de la cafetería escolar
 * Contiene utilidades generales y funcionalidades compartidas
 */

// ============================================
// UTILIDADES GENERALES
// ============================================

/**
 * Formatea un precio como moneda colombiana
 * @param {number} precio - Precio a formatear
 * @returns {string} Precio formateado
 */
function formatPrice(precio) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(precio);
}

/**
 * Obtiene el nombre del día actual en español
 * @returns {string} Nombre del día
 */
function getDiaActual() {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[new Date().getDay()];
}

/**
 * Muestra un mensaje de error al usuario
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} containerId - ID del contenedor donde mostrar el error
 */
function mostrarError(mensaje, containerId = null) {
  const container = containerId 
    ? document.getElementById(containerId) 
    : document.querySelector('.page-content') || document.body;
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'alert alert-error';
  errorDiv.style.display = 'block';
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${mensaje}`;
  
  container.prepend(errorDiv);
  
  setTimeout(() => {
    errorDiv.style.display = 'none';
    errorDiv.remove();
  }, 5000);
}

/**
 * Muestra un mensaje de éxito al usuario
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} containerId - ID del contenedor donde mostrar el éxito
 */
function mostrarExito(mensaje, containerId = null) {
  const container = containerId 
    ? document.getElementById(containerId) 
    : document.querySelector('.page-content') || document.body;
  
  const exitoDiv = document.createElement('div');
  exitoDiv.className = 'alert alert-success';
  exitoDiv.style.display = 'block';
  exitoDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${mensaje}`;
  
  container.prepend(exitoDiv);
  
  setTimeout(() => {
    exitoDiv.style.display = 'none';
    exitoDiv.remove();
  }, 5000);
}

/**
 * Muestra un indicador de carga
 * @param {HTMLElement} container - Contenedor donde mostrar el loading
 * @returns {HTMLElement} Elemento de loading
 */
function showLoading(container) {
  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.innerHTML = `
    <div class="spinner"></div>
    <p>Cargando...</p>
  `;
  container.appendChild(loading);
  return loading;
}

/**
 * Oculta el indicador de carga
 * @param {HTMLElement} loading - Elemento de loading a ocultar
 */
function hideLoading(loading) {
  if (loading && loading.parentNode) {
    loading.remove();
  }
}

/**
 * Carga datos desde un archivo JSON
 * @param {string} url - URL del archivo JSON
 * @returns {Promise<Object>} Datos cargados
 */
async function cargarDatos(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al cargar ${url}:`, error);
    throw error;
  }
}

/**
 * Inicializa el acordeón de FAQ
 */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Cerrar todos los items
      faqItems.forEach(i => i.classList.remove('active'));
      
      // Abrir el item clickeado si no estaba activo
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * Resalta la página actual en el menú de navegación
 */
function highlightCurrentPage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ============================================
// INICIALIZACIÓN GENERAL
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Resaltar página actual
  highlightCurrentPage();
  
  // Inicializar FAQ si existe
  if (document.querySelector('.faq-item')) {
    initFAQ();
  }
  
  // Header scroll effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
});

// Exportar funciones para uso en otros archivos
window.CafeteriaUtils = {
  formatPrice,
  getDiaActual,
  mostrarError,
  mostrarExito,
  showLoading,
  hideLoading,
  cargarDatos
};
