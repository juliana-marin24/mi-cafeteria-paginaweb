/**
 * horarios.js - Renderizado de horarios de la cafetería
 * Carga datos desde JSON y renderiza tabla de horarios
 */

document.addEventListener('DOMContentLoaded', () => {
  const horariosContainer = document.getElementById('horarios-container');
  const horarioHoy = document.getElementById('horario-hoy');
  
  if (!horariosContainer) return;
  
  // ============================================
  // CARGA Y RENDERIZADO
  // ============================================
  
  async function cargarHorarios() {
    // Mostrar loading
    horariosContainer.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p>Cargando horarios...</p>
      </div>
    `;
    
    try {
      const response = await fetch('data/horarios.json');
      if (!response.ok) throw new Error('Error al cargar horarios');
      
      const data = await response.json();
      
      // Renderizar tabla de horarios
      renderizarTabla(data.horarios);
      
      // Renderizar horario de hoy si el contenedor existe
      if (horarioHoy) {
        renderizarHorarioHoy(data.horarios);
      }
      
    } catch (error) {
      console.error('Error:', error);
      horariosContainer.innerHTML = `
        <div class="empty-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>No se pudieron cargar los horarios. Inténtalo de nuevo más tarde.</p>
        </div>
      `;
    }
  }
  
  /**
   * Renderiza la tabla de horarios
   * @param {Array} horarios - Lista de horarios
   */
  function renderizarTabla(horarios) {
    if (!horarios || horarios.length === 0) {
      horariosContainer.innerHTML = `
        <div class="empty-message">
          <i class="fas fa-clock"></i>
          <p>No hay horarios disponibles</p>
        </div>
      `;
      return;
    }
    
    const diaActual = window.CafeteriaUtils.getDiaActual();
    
    const html = `
      <div style="overflow-x: auto;">
        <table class="schedule-table">
          <thead>
            <tr>
              <th>Día</th>
              <th>Horario</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${horarios.map(horario => `
              <tr class="${horario.dia === diaActual ? 'current-day' : ''}">
                <td>
                  <strong>${horario.dia}</strong>
                  ${horario.dia === diaActual ? ' <span style="color: var(--primary);">(Hoy)</span>' : ''}
                </td>
                <td>
                  ${horario.activo 
                    ? `${horario.apertura} - ${horario.cierre}`
                    : 'Cerrado'}
                </td>
                <td>
                  <span class="schedule-status ${horario.activo ? 'open' : 'closed'}">
                    <i class="fas ${horario.activo ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    ${horario.activo ? 'Abierto' : 'Cerrado'}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    
    horariosContainer.innerHTML = html;
  }
  
  /**
   * Renderiza el horario del día actual
   * @param {Array} horarios - Lista de horarios
   */
  function renderizarHorarioHoy(horarios) {
    const diaActual = window.CafeteriaUtils.getDiaActual();
    const horarioHoyData = horarios.find(h => h.dia === diaActual);
    
    if (horarioHoyData) {
      horarioHoy.innerHTML = horarioHoyData.activo
        ? `<strong>${horarioHoyData.apertura} - ${horarioHoyData.cierre}</strong>`
        : '<strong>Cerrado hoy</strong>';
    } else {
      horarioHoy.innerHTML = '<strong>Horario no disponible</strong>';
    }
  }
  
  // Iniciar carga
  cargarHorarios();
});
