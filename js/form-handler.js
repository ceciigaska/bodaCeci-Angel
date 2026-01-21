// ===== FORM HANDLER - WEDDING INVITATION - VERSIÓN LIMPIA =====

// Configuración para Vercel - CAMBIA ESTA URL POR TU DOMINIO DE VERCEL
const getBackendUrl = () => {
  // Si estamos en localhost, usar el backend local (o el puerto que uses)
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://localhost:3000";
  }
  // Si no, usar la URL de producción de Vercel
  return "https://boda-ceci-angel-bnd.vercel.app";
};


const WEDDING_BACKEND_URL = getBackendUrl();
// Variables globales únicas para evitar conflictos
let weddingFormSubmitting = false;
let weddingCurrentGuest = null;
let weddingMaxCompanions = 0;

// ===== DEFINIR FUNCIONES GLOBALES INMEDIATAMENTE =====
window.searchGuest = async function () {
  const searchInput = document.getElementById("searchName");
  const searchButton = document.getElementById("searchButton");
  const guestName = searchInput.value.trim();

  if (guestName.length < 2) {
    showWeddingNotification("Por favor, ingresa al menos 2 letras", "error");
    return;
  }

  showWeddingNotification("Buscando...", "info", true);
  searchButton.disabled = true;

  try {
    const response = await fetch(
      `${WEDDING_BACKEND_URL}/api/search?name=${encodeURIComponent(guestName)}`
    );
    const result = await response.json();

    console.log("📄 Respuesta de la búsqueda:", result);

    if (result.found) {
      hideWeddingNotification();
      
      // ✅ NUEVO: Verificar si ya confirmó antes de mostrar el formulario
      await checkPreviousConfirmation(result.guest);
    } else {
      showWeddingNotification(
        result.message || "Invitado no encontrado. Por favor, revisa el nombre.",
        "error"
      );
    }
  } catch (error) {
    console.error("❌ Error en la búsqueda:", error);
    showWeddingNotification(`Error en la búsqueda: ${error.message}`, "error");
  } finally {
    searchButton.disabled = false;
  }
};

// ===== NUEVA FUNCIÓN: VERIFICAR CONFIRMACIÓN PREVIA =====
async function checkPreviousConfirmation(guestData) {
  try {
    console.log("🔍 Verificando si el invitado ya confirmó...");
    console.log("📋 Guest Data:", guestData);
    
    showWeddingNotification("Verificando estado...", "info", true);
    
    const checkUrl = `${WEDDING_BACKEND_URL}/api/check-confirmation?guestId=${encodeURIComponent(guestData.id)}`;
    console.log("📡 URL de verificación:", checkUrl);
    
    const response = await fetch(checkUrl);
    
    if (!response.ok) {
      console.warn(`⚠️ Response status: ${response.status}`);
    }
    
    const result = await response.json();
    
    console.log("📄 Resultado de verificación:", result);
    console.log("  - hasConfirmed:", result.hasConfirmed);
    console.log("  - confirmationNumber:", result.confirmationNumber);
    console.log("  - message:", result.message);
    
    hideWeddingNotification();
    
    if (result.hasConfirmed === true) {
      console.log("✅ El invitado YA confirmó previamente");
      showAlreadyConfirmedMessage(guestData, result);
    } else {
      console.log("ℹ️ El invitado NO ha confirmado aún");
      handleWeddingGuestFound(guestData);
    }
  } catch (error) {
    console.error("❌ Error verificando confirmación:", error);
    console.error("  - Message:", error.message);
    console.error("  - Stack:", error.stack);
    
    hideWeddingNotification();
    
    // En caso de error, permitir continuar con el formulario
    console.warn("⚠️ Error en verificación - permitiendo continuar");
    handleWeddingGuestFound(guestData);
  }
}

// ===== MOSTRAR MENSAJE DE YA CONFIRMADO =====
function showAlreadyConfirmedMessage(guestData, confirmationInfo) {
  const searchResult = document.getElementById("searchResult");
  const confirmationForm = document.getElementById("confirmationForm");
  
  confirmationForm.style.display = "none";
  
  const confirmedDate = confirmationInfo.confirmedAt 
    ? new Date(confirmationInfo.confirmedAt).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Fecha no disponible';
  
  searchResult.innerHTML = `
    <div class="already-confirmed-message">
      <div class="celebration-animation">
        <span class="celebration-icon">🎊</span>
        <span class="celebration-icon">💍</span>
        <span class="celebration-icon">✅</span>
        <span class="celebration-icon">🎉</span>
      </div>
      
      <h3 class="confirmed-title">¡Tu asistencia ya está confirmada!</h3>
      
      <div class="confirmation-card">
        <div class="confirmation-header">
          <span class="header-icon">👤</span>
          <h4>Detalles de tu confirmación</h4>
        </div>
        
        <div class="confirmation-details">
          <div class="detail-row">
            <span class="detail-label">📝 Nombre:</span>
            <span class="detail-value">${guestData.name}</span>
          </div>
          
          <div class="detail-row highlight">
            <span class="detail-label">🎫 Código:</span>
            <span class="detail-value code-number">${confirmationInfo.confirmationNumber || 'No disponible'}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">📅 Confirmado el:</span>
            <span class="detail-value">${confirmedDate}</span>
          </div>
          
          ${guestData.maxCompanions > 0 ? `
            <div class="detail-row">
              <span class="detail-label">👥 Acompañantes:</span>
              <span class="detail-value">${guestData.maxCompanions} permitidos</span>
            </div>
          ` : ''}
        </div>
      </div>
      
      <div class="info-box">
        <div class="info-icon-box">ℹ️</div>
        <div class="info-content">
          <h5>¿Necesitas hacer cambios?</h5>
          <p>Tu confirmación ya está registrada en nuestro sistema. Si necesitas modificar tu asistencia o la de tus acompañantes, por favor contacta directamente a los novios.</p>
        </div>
      </div>
      
      <div class="important-reminder">
        <span class="reminder-icon">📲</span>
        <p><strong>Importante:</strong> Guarda tu código de confirmación. Lo necesitarás el día de la boda.</p>
      </div>
      
      <div class="confirmation-actions">
        <button onclick="location.reload()" class="btn btn-secondary">
          🔍 Buscar otro invitado
        </button>
        <a href="https://wa.me/5215640042829?text=${encodeURIComponent(`Hola, soy ${guestData.name}. Mi código de confirmación es ${confirmationInfo.confirmationNumber || 'No disponible'}. Necesito modificar mi confirmación de asistencia.`)}" 
           class="btn main-btn" 
           target="_blank">
          💬 Contactar a los novios
        </a>
      </div>
      
      <div class="wedding-reminder">
        <h4>📅 Te esperamos el 30 de Octubre 2026</h4>
        <p>🕓 4:00 PM - Lienzo Charro "La Tapatía"</p>
      </div>
    </div>
  `;
  
  searchResult.className = "search-result found already-confirmed";
  searchResult.style.display = "block";
  
  // Animación de los íconos de celebración
  setTimeout(() => {
    const icons = document.querySelectorAll('.celebration-icon');
    icons.forEach((icon, index) => {
      setTimeout(() => {
        icon.style.animation = 'bounce 0.6s ease';
      }, index * 100);
    });
  }, 100);
  
  showWeddingNotification("✅ Este invitado ya confirmó su asistencia", "info");
}

window.addCompanion = function () {
  console.log("➕ Añadiendo acompañante");
  addWeddingCompanionField();
};

window.removeCompanionField = function (button) {
  console.log("➖ Eliminando acompañante");
  if (button && button.parentElement) {
    button.parentElement.remove();
    updateWeddingAddCompanionButton();
    renumberWeddingCompanions();
  }
};
// ===== FUNCIONES INTERNAS =====

function addWeddingCompanionField(name = "", readonly = false) {
  const companionsList = document.getElementById("companionsList");
  if (!companionsList) {
    console.error("❌ Lista de acompañantes no encontrada");
    return;
  }

  const currentCount = companionsList.querySelectorAll(
    ".companion-input-group"
  ).length;

  if (currentCount >= weddingMaxCompanions) {
    showWeddingNotification(
      `Solo puedes agregar hasta ${weddingMaxCompanions} acompañantes.`,
      "error"
    );
    return;
  }

  const companionDiv = document.createElement("div");
  companionDiv.className = "companion-input-group";

  companionDiv.innerHTML = `
   <input 
     type="text" 
     name="companionName[]" 
     placeholder="Nombre del acompañante" 
     value="${name}"
     ${readonly ? "readonly" : ""}
     required
   >
   <div class="attendance-radio">
     <label><input type="radio" name="companionAttendance[${currentCount}]" value="si" required> Sí</label>
     <label><input type="radio" name="companionAttendance[${currentCount}]" value="no" required> No</label>
   </div>
   <select name="companionAge[]" required>
     <option value="">Edad</option>
     <option value="adulto">Adulto</option>
     <option value="nino">Niño</option>
   </select>
   ${!readonly
      ? '<button type="button" class="remove-companion-btn" onclick="window.removeCompanionField(this)">×</button>'
      : ""
    }
 `;

  companionsList.appendChild(companionDiv);
  updateWeddingAddCompanionButton();
}

function updateWeddingAddCompanionButton() {
  const companionsList = document.getElementById("companionsList");
  const addCompanionBtn = document.getElementById("addCompanionBtn");

  if (!companionsList || !addCompanionBtn) return;

  const currentCount = companionsList.querySelectorAll(
    ".companion-input-group"
  ).length;

  if (currentCount >= weddingMaxCompanions) {
    addCompanionBtn.style.display = "none";
  } else {
    addCompanionBtn.style.display = "block";
  }
}

function renumberWeddingCompanions() {
  const companionGroups = document.querySelectorAll(".companion-input-group");
  companionGroups.forEach((group, index) => {
    const radios = group.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => {
      const baseName = radio.name.split("[")[0];
      radio.name = `${baseName}[${index}]`;
    });
  });
}

// ===== FUNCIÓN: MANEJA LA RESPUESTA DE INVITADO ENCONTRADO =====
function handleWeddingGuestFound(guestData) {
  const searchResult = document.getElementById("searchResult");
  const confirmationForm = document.getElementById("confirmationForm");

  console.log("✅ Invitado encontrado:", guestData);

  weddingCurrentGuest = guestData;
  weddingMaxCompanions = guestData.maxCompanions || 0;

  // Actualiza la UI con la información del invitado
  searchResult.innerHTML = `
   <div class="guest-found">
     <div class="success-icon">✅</div>
     <h4>¡Invitado encontrado!</h4>
     <div class="guest-info">
       <p><strong>Nombre:</strong> ${guestData.name}</p>
       ${weddingMaxCompanions > 0
      ? `<p><strong>Acompañantes permitidos:</strong> ${weddingMaxCompanions}</p>`
      : "<p><strong>Invitación individual</strong></p>"
    }
     </div>
   </div>
 `;
  searchResult.className = "search-result found";
  searchResult.style.display = "block";

  // Llenar el formulario
  fillWeddingFormData(guestData);
  setupWeddingCompanions(guestData);

  if (confirmationForm) {
    confirmationForm.style.display = "block";
    confirmationForm.scrollIntoView({ behavior: "smooth" });
  }
}

// ===== FUNCIÓN: LLENA EL FORMULARIO CON DATOS DEL INVITADO =====
function fillWeddingFormData(guestData) {
  const guestNameInput = document.getElementById("guestName");
  const dietaryTextarea = document.getElementById("dietary");

  if (guestNameInput) {
    guestNameInput.value = guestData.name;
    guestNameInput.setAttribute("data-guest-id", guestData.id);
  }

  // Pre-llenar notas especiales si existen
  if (guestData.specialNotes && dietaryTextarea) {
    dietaryTextarea.value = guestData.specialNotes;
  }
}

// ===== FUNCIÓN: CONFIGURA Y LLENA LOS CAMPOS DE ACOMPAÑANTES =====
function setupWeddingCompanions(guestData) {
  const companionsContainer = document.getElementById("companionsList");

  if (!companionsContainer) {
    console.error("❌ Contenedor de acompañantes no encontrado");
    return;
  }

  companionsContainer.innerHTML = "";

  if (guestData.maxCompanions > 0) {
    const companionsToFill = guestData.companions || [];

    for (let i = 0; i < guestData.maxCompanions; i++) {
      const companionData = companionsToFill[i] || {};
      const companionName = companionData.name || "";
      const companionAttendance = companionData.attendance || "si";
      const companionAge = companionData.age || "adulto";

      const companionHtml = `
       <div class="form-group companion-input-group">
         <h5>Acompañante ${i + 1}</h5>
         <input 
           type="text" 
           name="companionName[]" 
           placeholder="Nombre completo" 
           value="${companionName}">
         <div class="companion-attendance">
           <label><input type="radio" name="companionAttendance[${i}]" value="si" ${companionAttendance === "si" ? "checked" : ""
        }> Asistirá</label>
           <label><input type="radio" name="companionAttendance[${i}]" value="no" ${companionAttendance === "no" ? "checked" : ""
        }> No Asistirá</label>
         </div>
         <div class="companion-age">
           <select name="companionAge[]">
             <option value="adulto" ${companionAge === "adulto" ? "selected" : ""
        }>Adulto</option>
             <option value="nino" ${companionAge === "nino" ? "selected" : ""
        }>Niño</option>
           </select>
         </div>
       </div>
     `;
      companionsContainer.innerHTML += companionHtml;
    }
  }
}

// ===== FUNCIÓN: AÑADE UN CAMPO DE ACOMPAÑANTE DINÁMICAMENTE =====
function addCompanionField(index) {
  const companionsContainer = document.getElementById("companionsContainer");
  const companionField = document.createElement("div");
  companionField.classList.add("companion-group");
  companionField.innerHTML = `
   <h5>Acompañante ${index}</h5>
   <div class="form-group companion-field">
     <input type="text" placeholder="Nombre completo">
     <select>
       <option value="si">Asistirá</option>
       <option value="no">No Asistirá</option>
     </select>
   </div>
 `;
  companionsContainer.appendChild(companionField);
}

function handleWeddingGuestNotFound(message) {
  const searchResult = document.getElementById("searchResult");
  searchResult.innerHTML = `
   <div class="guest-not-found">
     <div class="error-icon">❌</div>
     <h4>Invitado no encontrado</h4>
     <p>${message}</p>
     <p><small>Verifica que el nombre esté escrito correctamente o contacta a los organizadores.</small></p>
   </div>
 `;
  searchResult.className = "search-result not-found";
  searchResult.style.display = "block";
}

function hideWeddingForms() {
  const elementsToHide = [
    "searchResult",
    "confirmationForm",
    "companionsSection",
  ];
  elementsToHide.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = "none";
      el.className = "";
    }
  });
}

// ===== CONFIGURACIÓN DE EVENTOS =====
function initWeddingFormHandler() {
  console.log("🎯 Inicializando Wedding Form Handler...");

  setupWeddingSearch();
  setupWeddingFormSubmission();
  setupWeddingAttendance();
  setupWeddingAddCompanionButton();

  console.log("✅ Wedding Form Handler inicializado");
  console.log("🌐 Backend URL:", WEDDING_BACKEND_URL);

  testWeddingBackend();
}

function setupWeddingSearch() {
  const searchInput = document.getElementById("searchName");
  const searchButton = document.getElementById("searchButton");

  if (searchInput) {
    console.log("✅ Input de búsqueda encontrado");

    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        console.log("⌨️ Enter presionado en búsqueda");
        window.searchGuest();
      }
    });

    searchInput.addEventListener("input", function () {
      hideWeddingForms();
    });
  } else {
    console.error("❌ Input de búsqueda NO encontrado");
  }

  if (searchButton) {
    console.log("✅ Botón de búsqueda encontrado");

    searchButton.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("🖱️ Botón de búsqueda clickeado");
      window.searchGuest();
    });
  } else {
    console.error("❌ Botón de búsqueda NO encontrado");
  }
}

function setupWeddingAttendance() {
  const attendanceSelect = document.getElementById("attendance");
  if (attendanceSelect) {
    attendanceSelect.addEventListener("change", function () {
      const companionsSection = document.getElementById("companionsSection");
      if (this.value === "si" && weddingMaxCompanions > 0) {
        companionsSection.style.display = "block";
      } else {
        companionsSection.style.display = "none";
        const companionsList = document.getElementById("companionsList");
        if (companionsList) {
          companionsList.innerHTML = "";
        }
      }
    });
  }
}

function setupWeddingAddCompanionButton() {
  const addCompanionBtn = document.getElementById("addCompanionBtn");
  if (addCompanionBtn) {
    console.log("✅ Botón agregar acompañante encontrado");
    addCompanionBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("🖱️ Botón agregar acompañante clickeado");
      window.addCompanion();
    });
  } else {
    console.log(
      "⚠️ Botón agregar acompañante NO encontrado (se agregará después)"
    );
  }
}

function setupWeddingFormSubmission() {
  const confirmationForm = document.getElementById("confirmationForm");

  if (confirmationForm) {
    confirmationForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (weddingFormSubmitting) {
        console.log("⚠️ Envío ya en progreso");
        return;
      }

      weddingFormSubmitting = true;

      const submitButton = confirmationForm.querySelector(
        'button[type="submit"]'
      );
      const originalText = submitButton.textContent;
      submitButton.textContent = "Enviando...";
      submitButton.disabled = true;

      try {
        const formData = collectWeddingFormData();
        console.log("📝 Datos a enviar:", formData);

        if (!validateWeddingFormData(formData)) {
          throw new Error("Datos del formulario inválidos");
        }

        const response = await fetch(WEDDING_BACKEND_URL + "/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log("📄 Resultado:", result);

        if (result.success) {
          showWeddingSuccessMessage(result);
        } else {
          console.error("❌ Error enviando formulario:", result.error);
          showWeddingNotification(`❌ Error: ${result.error}`, "error");
        }
      } catch (error) {
        console.error("❌ Error enviando formulario:", error);
        showWeddingNotification(`Error: ${error.message}`, "error");
      } finally {
        weddingFormSubmitting = false;
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    });
  }
}

function collectWeddingFormData() {
  const guestNameInput = document.getElementById("guestName");
  const attendanceSelect = document.getElementById("attendance");
  const dietaryTextarea = document.getElementById("dietary");
  const phoneInput = document.getElementById("phone");

  const companions = [];
  const companionGroups = document.querySelectorAll(".companion-input-group");

  companionGroups.forEach((group) => {
    const nameInput = group.querySelector('input[name="companionName[]"]');
    const attendanceInput = group.querySelector('input[type="radio"]:checked');
    const ageSelect = group.querySelector('select[name="companionAge[]"]');

    if (nameInput && nameInput.value.trim()) {
      companions.push({
        name: nameInput.value.trim(),
        attendance: attendanceInput ? attendanceInput.value : "no",
        age: ageSelect ? ageSelect.value : "adulto",
      });
    }
  });

  return {
    id: guestNameInput.getAttribute("data-guest-id") || weddingCurrentGuest?.id,
    name: guestNameInput.value.trim(),
    phone: phoneInput.value.trim(),
    attendance: attendanceSelect.value,
    dietary: dietaryTextarea.value.trim() || "",
    companions: companions,
  };
}

function validateWeddingFormData(data) {
  if (!data.id || !data.name || !data.attendance) {
    showWeddingNotification("Faltan datos requeridos", "error");
    return false;
  }

  if (
    data.attendance === "si" &&
    data.companions.length > weddingMaxCompanions
  ) {
    showWeddingNotification(
      `Máximo ${weddingMaxCompanions} acompañantes`,
      "error"
    );
    return false;
  }

  return true;
}

function mostrarQrModal(confirmationNumber, qrUrl, whatsappUrl) {
  document.getElementById('confirmationNumber').textContent = confirmationNumber;
  document.getElementById('qrImage').src = qrUrl;
  document.getElementById('downloadQrBtn').href = qrUrl;

  // Botón de compartir QR por WhatsApp
  const text = encodeURIComponent(`Aquí está mi código de confirmación para la boda: ${confirmationNumber}\n${qrUrl}`);
  document.getElementById('shareWhatsappBtn').href = `https://wa.me/?text=${text}`;

  document.getElementById('qrModal').classList.add('show');
}

function cerrarQrModal() {
  document.getElementById('qrModal').classList.remove('show');
}


function showWeddingSuccessMessage(result) {
  const confirmationForm = document.getElementById('confirmationForm');
  const searchResult = document.getElementById('searchResult');

  // Verifica que los elementos existen antes de manipularlos
  if (!confirmationForm || !searchResult) {
    console.error("Error: Elementos del DOM no encontrados (confirmationForm o searchResult)");
    return;
  }

  // Extrae la información necesaria de la respuesta del servidor
  const confirmationNumber = result.confirmationNumber || 'No disponible';
  const whatsappUrl = result.whatsappUrl;

  // Oculta el formulario principal
  confirmationForm.style.display = 'none';

  // Genera el HTML de éxito de forma dinámica con el número de confirmación
  const whatsappButton = whatsappUrl
    ? `<a href="${whatsappUrl}" class="btn main-btn" target="_blank">Enviar a WhatsApp</a>`
    : '';

  const qrImage = result.qrUrl
    ? `<div class="qr-section">
      <p>📲 Presenta este QR el día de la boda:</p>
      <img src="${result.qrUrl}" alt="QR de confirmación" class="qr-image"/>
    </div>`
    : '';

  searchResult.innerHTML = `
 <div class="success-message">
   <div class="success-icon">🎉</div>
   <h4>¡Confirmación enviada exitosamente!</h4>
   <p><strong>Número:</strong> ${confirmationNumber}</p>
   ${qrImage}
   <p>¡Nos vemos en la boda!</p>
   ${whatsappButton}
   <button onclick="location.reload()" class="btn btn-secondary" style="margin-top: 15px;">
     Nueva Búsqueda
   </button>
 </div>
`;

  if (result.qrUrl) {
    mostrarQrModal(confirmationNumber, result.qrUrl, whatsappUrl);
  }
  //  if (result.qrUrl) {
  //     mostrarQrModal(confirmationNumber, result.qrUrl, whatsappUrl);
  //   }

  searchResult.className = "search-result success";
  searchResult.style.display = "block";

  showWeddingNotification("¡Confirmación enviada! 🎉", "success");
}

async function testWeddingBackend() {
  try {
    console.log("🧪 Testing backend connection...");
    const response = await fetch(`${WEDDING_BACKEND_URL}/api/health`);
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Backend conectado:", data);
    }
  } catch (error) {
    console.error("❌ Backend no disponible:", error);
  }
}

// ===== NOTIFICACIONES =====
function showWeddingNotification(message, type = "info") {
  const existingNotifications = document.querySelectorAll(
    ".wedding-notification"
  );
  existingNotifications.forEach((n) => n.remove());

  const notification = document.createElement("div");
  notification.className = `wedding-notification ${type}`;
  notification.innerHTML = `
   <div class="notification-content">
     <span>${getWeddingNotificationIcon(type)}</span>
     <p>${message}</p>
     <button onclick="this.parentElement.parentElement.remove()">×</button>
   </div>
 `;

  notification.style.cssText = `
   position: fixed;
   top: 20px;
   right: 20px;
   z-index: 10001;
   animation: slideIn 0.3s ease-out;
 `;

  const content = notification.querySelector(".notification-content");
  content.style.cssText = `
   display: flex;
   align-items: center;
   gap: 10px;
   padding: 15px 20px;
   color: white;
   border-radius: 10px;
   background: ${getWeddingNotificationColor(type)};
   box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
 `;

  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

function getWeddingNotificationIcon(type) {
  const icons = { success: "✅", error: "❌", info: "ℹ️", warning: "⚠️" };
  return icons[type] || icons.info;
}

function getWeddingNotificationColor(type) {
  const colors = {
    success: "linear-gradient(135deg, #378b85, #4dd0c7)",
    error: "linear-gradient(135deg, #d4764f, #b85a3e)",
    info: "linear-gradient(135deg, #7bb5a8, #5a9aa8)",
    warning: "linear-gradient(135deg, #ff6b47, #e55a3c)",
  };
  return colors[type] || colors.info;
}

// ===== ESTILOS CSS =====
(function addWeddingStyles() {
  if (document.getElementById("wedding-form-styles-unique")) return;

  const style = document.createElement("style");
  style.id = "wedding-form-styles-unique";
  style.textContent = `
    @keyframes slideIn {
      0% { opacity: 0; transform: translateX(100%); }
      100% { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-10px) scale(1.1); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    /* Resultado de búsqueda base */
    .search-result {
      margin-top: 20px;
      padding: 20px;
      border-radius: 15px;
      text-align: center;
      animation: fadeIn 0.3s ease-out;
    }
    
    .search-result.found {
      background: rgba(55, 139, 133, 0.1);
      border: 2px solid #4dd0c7;
    }
    
    .search-result.not-found {
      background: rgba(212, 118, 79, 0.1);
      border: 2px solid #d4764f;
    }
    
    .search-result.success {
      background: rgba(55, 139, 133, 0.15);
      border: 2px solid #4dd0c7;
    }
    
    /* Estilos para mensaje de ya confirmado */
    .search-result.already-confirmed {
      background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%);
      border: 3px solid #ffc107;
      padding: 30px;
    }
    
    .already-confirmed-message {
      max-width: 600px;
      margin: 0 auto;
    }
    
    /* Animación de celebración */
    .celebration-animation {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 20px;
      font-size: 2.5rem;
    }
    
    .celebration-icon {
      display: inline-block;
      animation: bounce 1s ease-in-out infinite;
    }
    
    .celebration-icon:nth-child(2) {
      animation-delay: 0.1s;
    }
    
    .celebration-icon:nth-child(3) {
      animation-delay: 0.2s;
    }
    
    .celebration-icon:nth-child(4) {
      animation-delay: 0.3s;
    }
    
    /* Título confirmado */
    .confirmed-title {
      font-family: var(--font-playful);
      color: #f57c00;
      font-size: 1.8rem;
      margin-bottom: 25px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    /* Tarjeta de confirmación */
    .confirmation-card {
      background: white;
      border-radius: 15px;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      border: 2px solid #ffc107;
    }
    
    .confirmation-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid rgba(255, 193, 7, 0.3);
    }
    
    .header-icon {
      font-size: 1.5rem;
    }
    
    .confirmation-header h4 {
      margin: 0;
      color: #f57c00;
      font-family: var(--font-playful);
    }
    
    /* Filas de detalles */
    .confirmation-details {
      text-align: left;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 15px;
      margin: 8px 0;
      background: rgba(255, 193, 7, 0.05);
      border-radius: 8px;
      transition: all 0.3s ease;
    }
    
    .detail-row:hover {
      background: rgba(255, 193, 7, 0.15);
      transform: translateX(5px);
    }
    
    .detail-row.highlight {
      background: linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(255, 152, 0, 0.2) 100%);
      border: 2px dashed #ffc107;
      animation: pulse 2s ease-in-out infinite;
    }
    
    .detail-label {
      font-weight: 600;
      color: #666;
      font-size: 0.95rem;
    }
    
    .detail-value {
      font-weight: 500;
      color: #333;
      font-size: 1rem;
    }
    
    .code-number {
      font-family: 'Courier New', monospace;
      background: rgba(255, 193, 7, 0.3);
      padding: 5px 15px;
      border-radius: 5px;
      font-weight: bold;
      font-size: 1.1rem;
      color: #f57c00;
      letter-spacing: 1px;
    }
    
    /* Caja de información */
    .info-box {
      background: linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(30, 136, 229, 0.1) 100%);
      border: 2px solid #2196F3;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
      display: flex;
      gap: 15px;
      text-align: left;
    }
    
    .info-icon-box {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .info-content h5 {
      margin: 0 0 10px 0;
      color: #1976D2;
      font-family: var(--font-playful);
    }
    
    .info-content p {
      margin: 0;
      line-height: 1.6;
      color: #555;
    }
    
    /* Recordatorio importante */
    .important-reminder {
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%);
      border: 2px solid #4CAF50;
      border-radius: 12px;
      padding: 15px 20px;
      margin: 20px 0;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .reminder-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .important-reminder p {
      margin: 0;
      color: #2E7D32;
      line-height: 1.5;
    }
    
    /* Acciones de confirmación */
    .confirmation-actions {
      margin-top: 25px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .confirmation-actions .btn {
      width: 100%;
      padding: 15px;
      font-size: 1.05rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .confirmation-actions .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
    
    /* Recordatorio de boda */
    .wedding-reminder {
      margin-top: 25px;
      padding: 20px;
      background: linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(142, 36, 170, 0.1) 100%);
      border: 2px solid #9C27B0;
      border-radius: 12px;
    }
    
    .wedding-reminder h4 {
      margin: 0 0 10px 0;
      color: #7B1FA2;
      font-family: var(--font-playful);
    }
    
    .wedding-reminder p {
      margin: 0;
      color: #6A1B9A;
      font-weight: 500;
    }
    
    /* Otros estilos existentes */
    .success-icon, .error-icon {
      font-size: 2.5rem;
      margin-bottom: 15px;
    }
    
    .companion-input-group {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
      align-items: center;
      flex-wrap: wrap;
      padding: 10px;
      border-radius: 8px;
      background: rgba(55, 139, 133, 0.05);
    }
    
    .attendance-radio {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .attendance-radio label {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.9rem;
      margin: 0;
      cursor: pointer;
    }
    
    .remove-companion-btn {
      background: #d4764f;
      color: white;
      border: none;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.2rem;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .already-confirmed-message {
        padding: 15px;
      }
      
      .celebration-animation {
        font-size: 2rem;
        gap: 10px;
      }
      
      .confirmed-title {
        font-size: 1.5rem;
      }
      
      .confirmation-card {
        padding: 15px;
      }
      
      .detail-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      
      .info-box {
        flex-direction: column;
        text-align: center;
      }
      
      .important-reminder {
        flex-direction: column;
        text-align: center;
      }
      
      .code-number {
        font-size: 0.95rem;
        padding: 5px 10px;
      }
    }
  `;
  document.head.appendChild(style);
})();

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", function () {
  console.log("📋 DOM loaded - Wedding Form Handler");

  setTimeout(() => {
    initWeddingFormHandler();

    // Debug info
    console.log("🔍 searchGuest:", typeof window.searchGuest);
    console.log("➕ addCompanion:", typeof window.addCompanion);
    console.log("➖ removeCompanionField:", typeof window.removeCompanionField);

    console.log("🎉 Wedding Form Handler Ready!");
  }, 100);
});

// ===== FUNCIÓN DE DEBUG =====
window.debugWeddingForm = function () {
  console.log("🐛 DEBUG INFO:");
  console.log("- Backend URL:", WEDDING_BACKEND_URL);
  console.log("- Current Guest:", weddingCurrentGuest);
  console.log("- Max Companions:", weddingMaxCompanions);
  console.log("- Search Input:", document.getElementById("searchName"));
  console.log("- Search Button:", document.getElementById("searchButton"));
};

// ===== FUNCIONES PARA MOSTRAR NOTIFICACIONES =====
// Estas funciones son las que te faltan y causan el error.

// Muestra una notificación temporal al usuario
function showWeddingNotification(message, type = "info", isPersisted = false) {
  const notificationBar = document.getElementById("wedding-notification-bar");
  if (!notificationBar) {
    console.error("❌ Contenedor de notificaciones no encontrado");
    return;
  }

  // Limpia el contenido anterior
  notificationBar.innerHTML = "";
  notificationBar.className = `notification-bar ${type}`;
  notificationBar.textContent = message;
  notificationBar.style.display = "flex";

  // Si no es persistente, la oculta después de 3 segundos
  if (!isPersisted) {
    setTimeout(() => {
      hideWeddingNotification();
    }, 3000);
  }
}

// Oculta la notificación
function hideWeddingNotification() {
  const notificationBar = document.getElementById("wedding-notification-bar");
  if (notificationBar) {
    notificationBar.style.display = "none";
  }
}

// Opcional: Si quieres un mensaje de carga con animación
function showWeddingLoadingMessage(message) {
  const notificationBar = document.getElementById("wedding-notification-bar");
  if (notificationBar) {
    notificationBar.className = "notification-bar loading";
    notificationBar.textContent = message;
    notificationBar.style.display = "flex";
  }
}
