# 🚨 CONFIGURACIÓN REQUERIDA

## ⚠️ ANTES DE EJECUTAR LA APLICACIÓN

**🔴 DEBES crear un archivo `.env` para que funcione correctamente:**

### Paso 1: Crear archivo .env
```bash
cp .env.example .env
```

### Paso 2: Configurar tus credenciales en .env
Edita el archivo `.env` con tus datos reales:

```env
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-app-password-de-gmail  
CONTACT_EMAIL=donde-recibir-emails@gmail.com
```

### Paso 3: Configurar Gmail
1. Habilita verificación en 2 pasos en Gmail
2. Genera App Password: https://myaccount.google.com/apppasswords
3. Usa esa contraseña en `MAIL_PASSWORD`

### Paso 4: Instalar dependencias
```bash
pip install -r requirements.txt
```

### Paso 5: Ejecutar
```bash
python app.py
```

---

**📚 Para más detalles, lee:**
- [README.md](README.md) - Documentación completa
- [EMAIL_SETUP.md](EMAIL_SETUP.md) - Guía detallada de emails

**🧪 Para probar que funciona:**
- Ve a http://localhost:5000
- Haz clic en "📧 Test Email" en el navbar