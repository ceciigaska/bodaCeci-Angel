# 💕 Invitación de Boda Digital - Ceci & Ángel

Una invitación de boda interactiva y moderna con funcionalidades avanzadas de confirmación de asistencia.

## 🌟 Características Principales

- **Pantalla de bienvenida** con música de fondo
- **Cuenta regresiva en tiempo real** hasta la fecha de la boda
- **Historia de amor personalizada** de la pareja
- **Búsqueda de invitados** integrada con Google Sheets
- **Confirmación de asistencia** con manejo de acompañantes
- **Integración completa** con Google Apps Script
- **Diseño responsive** para todos los dispositivos
- **Paleta de colores personalizada** y fuentes elegantes

## 🎨 Paleta de Colores

| Color | Hex Code | Uso |
|-------|----------|-----|
| Aqua principal | `#4dd0c7` | Títulos y acentos principales |
| Verde agua | `#7bb5a8` | Elementos secundarios |
| Azul grisáceo | `#5a9aa8` | Texto y detalles |
| Verde claro | `#66a693` | Complementarios |
| Aqua brillante | `#3ac5bb` | Hover effects |
| Azul oscuro | `#4a8794` | Sombras |
| Coral | `#ff6b47` | Botones de acción |
| Coral oscuro | `#e55a3c` | Estados activos |
| Crema | `#fff2e6` | Fondos suaves |
| Crema claro | `#fef7f0` | Fondos alternativos |

## 🔤 Tipografías

- **Nunito** - Texto general y párrafos
- **Great Vibes** - Nombres de la pareja y títulos decorativos
- **Quicksand** - Títulos de sección y navegación
- **Poppins** - Botones y elementos UI

## 📁 Estructura del Proyecto

```
wedding-invitation/
├── index.html                 # Página principal
├── css/
│   ├── styles.css            # Estilos principales
│   └── splash.css            # Estilos de pantalla de bienvenida
├── js/
│   ├── main.js               # Funcionalidad principal
│   ├── countdown.js          # Lógica de cuenta regresiva
│   └── form-handler.js       # Manejo de formularios
├── assets/
│   ├── images/
│   │   ├── couple-photo.jpg  # Foto de la pareja
│   │   └── qr-code.png      # QR para álbum de fotos
│   ├── audio/
│   │   └── wedding-song.mp3 # Música de fondo
│   └── fonts/               # Fuentes locales (opcional)
├── google-apps-script/
│   └── Code.gs              # Script de Google Apps Script
└── docs/
    └── README.md            # Este archivo
```

## ⚙️ Configuración

### 1. Google Sheets Setup

#### Hoja 1: "Invitados"
| Columna A | Columna B | Columna C | Columna D | Columna E |
|-----------|-----------|-----------|-----------|-----------|
| Nombre Completo | Email | Teléfono | Acompañantes Permitidos | Notas Especiales |
| Juan Pérez García | juan@email.com | 5551234567 | 2 | |
| María González López | maria@email.com | 5557654321 | 4 | Vegetariana |

#### Hoja 2: "Confirmaciones" (Se crea automáticamente)
Esta hoja almacena todas las respuestas de confirmación de asistencia.

### 2. Google Apps Script Configuration

1. Crear nuevo proyecto en [Google Apps Script](https://script.google.com)
2. Pegar el código de `google-apps-script/Code.gs`
3. Ejecutar la función `initializeWeddingInvitation()` para setup inicial
4. Configurar las variables:
   ```javascript
   const SPREADSHEET_ID = 'TU_ID_DE_GOOGLE_SHEETS_AQUI';
   const GUESTS_SHEET_NAME = 'Invitados';
   const CONFIRMATIONS_SHEET_NAME = 'Confirmaciones';
   ```
5. Implementar como Web App:
   - Ir a "Implementar" → "Nueva implementación"
   - Tipo: "Aplicación web"
   - Ejecutar como: "Yo"
   - Acceso: "Cualquiera"
   - Copiar la URL generada

### 3. Frontend Configuration

Actualizar las URLs en los archivos JavaScript:

#### En `js/main.js`:
```javascript
const SEARCH_SCRIPT_URL = 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI';
```

#### En `js/form-handler.js`:
```javascript
const FORM_SCRIPT_URL = 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI';
const SEARCH_SCRIPT_URL = 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI';
```

### 4. Assets Setup

1. **Foto de pareja**: Reemplazar `assets/images/couple-photo.jpg`
2. **Música**: Agregar `assets/audio/wedding-song.mp3`
3. **QR Code**: Generar QR para el álbum de Google Drive y guardarlo en `assets/images/qr-code.png`

### 5. Personalización de Contenido

#### En `index.html`:
- Actualizar nombres de la pareja
- Modificar la historia de amor
- Cambiar detalles del evento (fecha, lugar, dirección)
- Actualizar información de padrinos
- Modificar enlaces de mesa de regalos

#### En `js/countdown.js`:
```javascript
const WEDDING_DATE = new Date('2026-10-30T16:00:00').getTime();
```

## 🚀 Despliegue

### Opción 1: GitHub Pages
1. Subir archivos a un repositorio de GitHub
2. Habilitar GitHub Pages en la configuración del repositorio
3. La invitación estará disponible en `https://username.github.io/repository-name`

### Opción 2: Netlify
1. Conectar repositorio de GitHub o subir carpeta directamente
2. Deploy automático en `https://sitename.netlify.app`

### Opción 3: Hosting tradicional
1. Subir todos los archivos a tu servidor web
2. Asegurar que el dominio apunte a la carpeta correcta

## 📱 Funcionalidades

### Búsqueda de Invitados
- Búsqueda flexible (ignora acentos, mayúsculas/minúsculas)
- Validación automática de límite de acompañantes
- Autocompletar mientras se escribe

### Confirmación de Asistencia
- Formulario adaptable según respuesta
- Validación en tiempo real
- Manejo dinámico de acompañantes
- Envío automático de email de confirmación

### Cuenta Regresiva
- Actualización en tiempo real
- Efectos especiales según tiempo restante
- Animaciones personalizadas
- Mensaje especial el día de la boda

### Control de Música
- Reproducción automática al entrar
- Control manual de play/pause
- Botón flotante siempre visible

## 🎵 Música Recomendada

Formatos soportados: MP3, WAV, OGG

Sugerencias de canciones:
- "Perfect" - Ed Sheeran
- "All of Me" - John Legend
- "A Thousand Years" - Christina Perri
- "Thinking Out Loud" - Ed Sheeran
- "Make You Feel My Love" - Adele

## 📊 Analytics y Monitoreo

El sistema incluye funciones para monitorear:
- Número de confirmaciones
- Estadísticas de asistencia
- Total de acompañantes
- Restricciones alimentarias
- Health check del sistema

### Funciones disponibles en Google Apps Script:
```javascript
getWeddingStats()      // Estadísticas generales
getSystemHealth()      // Estado del sistema
exportConfirmations()  // Exportar datos
createBackup()         // Crear respaldo
sendReminders()        // Enviar recordatorios
```

## 🛠️ Troubleshooting

### Problemas Comunes:

**1. Música no se reproduce:**
- Verificar que el archivo existe en `assets/audio/wedding-song.mp3`
- Algunos navegadores requieren interacción del usuario antes de reproducir audio
- Revisar consola del navegador para errores

**2. Búsqueda de invitados no funciona:**
- Verificar URL del Google Apps Script
- Revisar que el spreadsheet ID sea correcto
- Verificar permisos del script (debe ser público)

**3. Formulario no se envía:**
- Revisar URL del script en `form-handler.js`
- Verificar que el script esté implementado como Web App
- Revisar logs en Google Apps Script

**4. Estilos no se cargan:**
- Verificar rutas de archivos CSS
- Revisar que Google Fonts esté cargando
- Validar sintaxis CSS

### Logs y Debugging:

Revisar la consola del navegador (F12) para:
- Errores de JavaScript
- Fallos de carga de recursos
- Problemas de red

En Google Apps Script:
- Ver logs en "Ejecuciones"
- Usar `console.log()` para debugging
- Revisar permisos de ejecución

## 🔒 Seguridad y Privacidad

- Datos almacenados solo en Google Sheets del propietario
- No se utilizan cookies ni tracking
- Emails de confirmación enviados automáticamente
- Validación de datos en frontend y backend

## 📧 Soporte

Para problemas técnicos:
1. Revisar este README
2. Verificar logs en consola del navegador
3. Revisar ejecuciones en Google Apps Script
4. Crear backup antes de hacer cambios

## 🎉 Créditos

- **Diseño**: Inspirado en tendencias modernas de invitaciones digitales
- **Iconos**: Emojis nativos y símbolos Unicode
- **Fuentes**: Google Fonts
- **Backend**: Google Apps Script y Google Sheets

## 📄 Licencia

Este proyecto es de uso libre para invitaciones de boda personales. No está permitido el uso comercial sin autorización.

---

💕 **¡Que tengan una boda increíble!** 💕