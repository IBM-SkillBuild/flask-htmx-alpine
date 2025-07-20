# 🚀 Flask HTMX Alpine.js SPA

Una aplicación de una sola página (SPA) moderna construida con Flask, HTMX y Alpine.js, con funcionalidad completa de envío de emails.

## ✨ Características

- 🌐 **SPA con HTMX**: Navegación fluida sin recarga de página
- ⚡ **Alpine.js**: Reactividad bidireccional con datos de Flask
- 📧 **Envío de emails**: Formulario de contacto funcional con Flask-Mail
- 📊 **Datos dinámicos**: Sincronización en tiempo real entre frontend y backend
- 🎨 **Bootstrap 5**: Diseño responsivo y moderno
- 💾 **Persistencia**: LocalStorage + base de datos del servidor
- 🔔 **Notificaciones**: Sistema de toast en tiempo real

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd flask-htmx-alpine-spa
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. ⚠️ **IMPORTANTE: Configurar variables de entorno**

**🔴 DEBES crear un archivo `.env` para que funcione el envío de emails:**

```bash
# Copia el archivo de ejemplo
cp .env.example .env
```

**Edita el archivo `.env` con tus credenciales reales:**

```env
# Gmail SMTP Configuration
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-app-password-de-gmail
CONTACT_EMAIL=donde-quieres-recibir-emails@gmail.com
```

### 4. Configurar Gmail (para envío de emails)

1. **Habilitar verificación en 2 pasos** en tu cuenta de Gmail
2. **Generar App Password:**
   - Ve a: https://myaccount.google.com/apppasswords
   - Selecciona "Mail" y tu dispositivo
   - Copia la contraseña de 16 caracteres generada
   - Úsala como `MAIL_PASSWORD` en tu archivo `.env`

### 5. Ejecutar la aplicación

```bash
python app.py
```

La aplicación estará disponible en: http://localhost:5000

## 🧪 Probar funcionalidades

### Envío de emails

1. **Prueba rápida**: Haz clic en "📧 Test Email" en el navbar
2. **Formulario de contacto**: Ve a la página "Contacto" y envía un mensaje

### Funcionalidades SPA

- **Navegación**: Usa el menú superior para navegar sin recargas
- **Reactividad**: Prueba los controles en la página principal
- **Sincronización**: Haz clic en "🔄 Sincronizar" para actualizar datos

## 📁 Estructura del proyecto

```
├── app.py                      # Servidor Flask principal
├── requirements.txt            # Dependencias Python
├── .env.example               # ⚠️ Plantilla de configuración
├── .env                       # 🔴 TU ARCHIVO DE CONFIGURACIÓN (crear)
├── EMAIL_SETUP.md             # Guía detallada de configuración de emails
├── templates/
│   ├── index.html             # Página principal SPA
│   └── partials/              # Templates parciales para HTMX
│       ├── home.html          # Página de inicio con Alpine.js
│       ├── about.html         # Página acerca de
│       ├── contact.html       # Formulario de contacto
│       ├── dashboard.html     # Panel de control
│       └── settings.html      # Configuración
└── static/js/
    └── alpine-components.js   # Componentes Alpine.js organizados
```

## 🔧 Configuración avanzada

### Otros proveedores de email

#### SendGrid (Recomendado para producción)

```env
MAIL_SERVER=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=tu-sendgrid-api-key
```

#### Outlook/Hotmail

```env
MAIL_SERVER=smtp-mail.outlook.com
MAIL_PORT=587
MAIL_USERNAME=tu-email@outlook.com
MAIL_PASSWORD=tu-contraseña
```

### Variables de entorno disponibles

| Variable        | Descripción                  | Ejemplo                  |
| --------------- | ---------------------------- | ------------------------ |
| `MAIL_USERNAME` | Email del remitente          | `tu-email@gmail.com`     |
| `MAIL_PASSWORD` | Contraseña o App Password    | `abcd-efgh-ijkl-mnop`    |
| `CONTACT_EMAIL` | Email donde recibir mensajes | `contacto@tuempresa.com` |

## 🚨 Solución de problemas

### Error: "Authentication failed"

- ✅ Verifica que uses **App Password**, no tu contraseña normal de Gmail
- ✅ Asegúrate de que la **verificación en 2 pasos** esté habilitada

### Error: "No module named 'flask_mail'"

```bash
pip install Flask-Mail
```

### Error: "No such file or directory: '.env'"

```bash
# Crea el archivo .env basado en el ejemplo
cp .env.example .env
# Luego edita .env con tus credenciales reales
```

### El formulario no envía emails

1. Verifica que el archivo `.env` existe y tiene las credenciales correctas
2. Prueba primero con "📧 Test Email" en el navbar
3. Revisa la consola para ver errores específicos

## 🎯 Próximos pasos

- [ ] Implementar base de datos para persistir mensajes
- [ ] Agregar autenticación de usuarios
- [ ] Implementar rate limiting para prevenir spam
- [ ] Agregar más validaciones de formularios
- [ ] Implementar notificaciones push
- [ ] Crear panel de administración

## 📚 Documentación adicional

- [EMAIL_SETUP.md](EMAIL_SETUP.md) - Guía detallada de configuración de emails
- [Flask Documentation](https://flask.palletsprojects.com/)
- [HTMX Documentation](https://htmx.org/)
- [Alpine.js Documentation](https://alpinejs.dev/)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

## ⚠️ RECORDATORIO IMPORTANTE

**🔴 NO OLVIDES CREAR TU ARCHIVO `.env` CON TUS CREDENCIALES REALES**

```bash
cp .env.example .env
# Luego edita .env con tus datos
```

Sin este archivo, el envío de emails no funcionará. El archivo `.env` está en `.gitignore` por seguridad, así que no se subirá a tu repositorio.

¡Disfruta construyendo con Flask + HTMX + Alpine.js! 🚀
