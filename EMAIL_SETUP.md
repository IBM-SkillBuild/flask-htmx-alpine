# 📧 Configuración de Envío de Emails

## 🚀 ¡Ya está implementado el envío real de emails!

### ✅ Lo que hace ahora tu aplicación:

1. **Recibe el formulario de contacto**
2. **Envía 2 emails automáticamente:**
   - 📨 **Email al administrador** con los detalles del mensaje
   - 📨 **Email de confirmación al usuario** que envió el mensaje

### 🔧 Para configurar el envío de emails:

#### Paso 1: Instalar Flask-Mail
```bash
pip install Flask-Mail
```

#### Paso 2: Configurar Gmail (Recomendado)

1. **Habilitar verificación en 2 pasos** en tu cuenta de Gmail
2. **Generar App Password:**
   - Ve a: https://myaccount.google.com/apppasswords
   - Selecciona "Mail" y tu dispositivo
   - Copia la contraseña de 16 caracteres generada

#### Paso 3: Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
# Copia el archivo de ejemplo
cp .env.example .env
```

Edita `.env` con tus datos reales:
```env
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=abcd-efgh-ijkl-mnop  # App Password de Gmail
CONTACT_EMAIL=donde-quieres-recibir-emails@gmail.com
```

#### Paso 4: Cargar variables de entorno

Instala python-dotenv:
```bash
pip install python-dotenv
```

### 🔄 Alternativas de configuración:

#### Opción 1: Variables de entorno del sistema (Recomendado para producción)
```bash
export MAIL_USERNAME="tu-email@gmail.com"
export MAIL_PASSWORD="tu-app-password"
export CONTACT_EMAIL="contacto@tuempresa.com"
```

#### Opción 2: Editar directamente en app.py (Solo para pruebas)
```python
app.config['MAIL_USERNAME'] = 'tu-email@gmail.com'
app.config['MAIL_PASSWORD'] = 'tu-app-password'
CONTACT_EMAIL = 'contacto@tuempresa.com'
```

### 📧 Otros proveedores de email:

#### SendGrid (Recomendado para producción)
```python
app.config['MAIL_SERVER'] = 'smtp.sendgrid.net'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'apikey'
app.config['MAIL_PASSWORD'] = 'tu-sendgrid-api-key'
```

#### Outlook/Hotmail
```python
app.config['MAIL_SERVER'] = 'smtp-mail.outlook.com'
app.config['MAIL_PORT'] = 587
```

#### Yahoo
```python
app.config['MAIL_SERVER'] = 'smtp.mail.yahoo.com'
app.config['MAIL_PORT'] = 587
```

### 🧪 Para probar el envío de emails:

1. **Configura tus credenciales** (pasos anteriores)
2. **Ejecuta la aplicación:**
   ```bash
   python app.py
   ```
3. **Ve a la página de contacto:** http://localhost:5000/contact
4. **Llena el formulario y envía**
5. **Revisa tu email** para ver los mensajes enviados

### 🔍 Solución de problemas:

#### Error: "Authentication failed"
- ✅ Verifica que uses App Password, no tu contraseña normal
- ✅ Asegúrate de que la verificación en 2 pasos esté habilitada

#### Error: "Connection refused"
- ✅ Verifica la configuración del servidor SMTP
- ✅ Revisa que el puerto sea correcto (587 para TLS)

#### Error: "Sender address rejected"
- ✅ Verifica que MAIL_USERNAME sea un email válido
- ✅ Asegúrate de que el email esté verificado

### 📊 Logs y monitoreo:

Los errores se muestran en la consola. En producción, considera usar:
- **Logging** para registrar errores
- **Sentry** para monitoreo de errores
- **Email delivery services** como SendGrid para mejor deliverability

### 🎯 Próximos pasos sugeridos:

1. **Implementar rate limiting** para evitar spam
2. **Agregar validación de email** más robusta
3. **Implementar templates de email** más elaborados
4. **Agregar notificaciones push** para nuevos mensajes
5. **Crear panel de administración** para ver mensajes

¡Tu aplicación ya está lista para enviar emails reales! 🚀