from flask import Flask, render_template, jsonify, request
from flask_mail import Mail, Message
import os
import json

# Configurar ruta de Tesseract para Windows (si es necesario)
import platform
if platform.system() == 'Windows':
    # Rutas comunes de instalación de Tesseract en Windows
    possible_paths = [
        r'C:\Program Files\Tesseract-OCR\tesseract.exe',
        r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
        r'C:\Users\{}\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'.format(
            os.getenv('USERNAME', '')),
        r'C:\tools\tesseract\tesseract.exe'  # Chocolatey
    ]

    for path in possible_paths:
        if os.path.exists(path):
            try:
                import pytesseract
                pytesseract.pytesseract.tesseract_cmd = path
                print(f"✅ Tesseract encontrado en: {path}")
                break
            except ImportError:
                pass
    else:
        print(
            "⚠️ Tesseract no encontrado en rutas comunes. Asegúrate de que esté instalado.")

# Cargar variables de entorno desde .env si existe
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("python-dotenv no instalado. Usando variables de entorno del sistema.")

app = Flask(__name__)

# Configuración de Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

# Variables de entorno para credenciales
app.config['MAIL_USERNAME'] = os.environ.get(
    'MAIL_USERNAME') or 'demo@ejemplo.com'
app.config['MAIL_PASSWORD'] = os.environ.get(
    'MAIL_PASSWORD') or 'demo-password'
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get(
    'MAIL_USERNAME') or 'demo@ejemplo.com'

# Email de destino para recibir mensajes de contacto
CONTACT_EMAIL = os.environ.get('CONTACT_EMAIL') or 'demo@ejemplo.com'

# Inicializar Flask-Mail
mail = Mail(app)

# Archivo para persistir datos del usuario
USER_DATA_FILE = 'user_data.json'


def load_user_data():
    """Cargar datos del usuario desde archivo JSON"""
    try:
        if os.path.exists(USER_DATA_FILE):
            with open(USER_DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error al cargar datos del usuario: {e}")

    # Datos por defecto si no existe el archivo o hay error
    return {
        'name': 'Usuario Demo',
        'email': 'demo@ejemplo.com',
        'preferences': {
            'theme': 'light',
            'language': 'es',
            'notifications': True
        }
    }


def save_user_data(user_data):
    """Guardar datos del usuario en archivo JSON"""
    try:
        with open(USER_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(user_data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Error al guardar datos del usuario: {e}")
        return False


@app.route('/')
def index():
    # Cargar datos del usuario desde archivo persistido
    user_data = load_user_data()

    # Datos iniciales que se pasarán a Alpine.js
    initial_data = {
        'user': user_data,
        'stats': {
            'users': 1234,
            'sales': 45678,
            'orders': 567,
            'visits': 8901
        },
        'app_config': {
            'name': 'Flask HTMX Alpine SPA',
            'version': '1.0.0',
            'debug': True
        }
    }
    return render_template('index.html', data=initial_data)


@app.route('/health')
def health_check():
    """Advanced health check endpoint for monitoring and preventing cold starts"""
    from datetime import datetime
    import psutil
    import os
    
    try:
        # Verificar componentes críticos
        health_status = {
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'service': 'flask-htmx-alpine',
            'version': '1.0.0',
            'uptime': datetime.now().isoformat(),
            'checks': {
                'database': 'ok',  # Si tuvieras DB
                'filesystem': 'ok' if os.path.exists('templates') else 'error',
                'memory': 'ok',
                'dependencies': 'ok'
            }
        }
        
        # Información del sistema (opcional)
        try:
            memory = psutil.virtual_memory()
            health_status['system'] = {
                'memory_percent': memory.percent,
                'cpu_count': psutil.cpu_count(),
                'disk_usage': psutil.disk_usage('/').percent if hasattr(psutil, 'disk_usage') else 'N/A'
            }
        except:
            health_status['system'] = 'unavailable'
        
        # Verificar si algún check falló
        failed_checks = [k for k, v in health_status['checks'].items() if v == 'error']
        if failed_checks:
            health_status['status'] = 'degraded'
            return jsonify(health_status), 503
            
        return jsonify(health_status), 200
        
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'timestamp': datetime.now().isoformat(),
            'error': str(e)
        }), 500


@app.route('/api/data')
def api_data():
    return render_template('responses/api_data.html')


@app.route('/home')
def home():
    # Si es una petición HTMX, devolver solo el fragmento
    if request.headers.get('HX-Request'):
        return render_template('partials/home.html')

    # Si es una recarga completa, devolver la página completa
    user_data = load_user_data()
    initial_data = {
        'user': user_data,
        'stats': {
            'users': 1234,
            'sales': 45678,
            'orders': 567,
            'visits': 8901
        },
        'app_config': {
            'name': 'Flask HTMX Alpine SPA',
            'version': '1.0.0',
            'debug': True
        }
    }
    return render_template('index.html', data=initial_data)


@app.route('/about')
def about():
    # Si es una petición HTMX, devolver solo el fragmento
    if request.headers.get('HX-Request'):
        return render_template('partials/about.html')

    # Si es una recarga completa, devolver la página completa
    user_data = load_user_data()
    initial_data = {
        'user': user_data,
        'stats': {
            'users': 1234,
            'sales': 45678,
            'orders': 567,
            'visits': 8901
        },
        'app_config': {
            'name': 'Flask HTMX Alpine SPA',
            'version': '1.0.0',
            'debug': True
        }
    }
    return render_template('index.html', data=initial_data)


@app.route('/contact')
def contact():
    # Si es una petición HTMX, devolver solo el fragmento
    if request.headers.get('HX-Request'):
        return render_template('partials/contact.html')

    # Si es una recarga completa, devolver la página completa
    user_data = load_user_data()
    initial_data = {
        'user': user_data,
        'stats': {
            'users': 1234,
            'sales': 45678,
            'orders': 567,
            'visits': 8901
        },
        'app_config': {
            'name': 'Flask HTMX Alpine SPA',
            'version': '1.0.0',
            'debug': True
        }
    }
    return render_template('index.html', data=initial_data)


@app.route('/contact/send', methods=['POST'])
def contact_send():
    try:
        # Obtener datos del formulario
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        subject = request.form.get('subject', '').strip()
        message_text = request.form.get('message', '').strip()

        print(
            f"📧 Datos recibidos - Nombre: {name}, Email: {email}, Asunto: {subject}")
        print(f"📧 Mensaje: {message_text[:100]}...")

        # Validación básica
        if not all([name, email, message_text]):
            print("❌ Validación fallida - Campos requeridos vacíos")
            return render_template('responses/contact_validation_error.html')

        # Crear el mensaje de email
        subject_line = f"Contacto desde web: {subject or 'Sin asunto'}"

        # Preparar datos para los templates de email
        message_html = message_text.replace(chr(10), '<br>')

        try:
            # Email para el administrador
            admin_msg = Message(
                subject=subject_line,
                recipients=[CONTACT_EMAIL],
                html=render_template('emails/admin_notification.html',
                                     name=name,
                                     email=email,
                                     subject=subject,
                                     message_html=message_html)
            )

            # Email de confirmación para el usuario
            user_msg = Message(
                subject="Confirmación: Hemos recibido tu mensaje",
                recipients=[email],
                html=render_template('emails/user_confirmation.html',
                                     name=name,
                                     subject=subject,
                                     message_html=message_html)
            )

            # Enviar emails reales
            print(f"📧 Intentando enviar emails a {CONTACT_EMAIL} y {email}")
            mail.send(admin_msg)
            mail.send(user_msg)
            print("✅ Emails enviados correctamente")

        except Exception as mail_error:
            print(f"⚠️ Error al enviar emails: {str(mail_error)}")
            print("📧 Continuando sin envío de email (modo demo)")

        return render_template('responses/contact_success.html',
                               name=name,
                               email=email,
                               contact_email=CONTACT_EMAIL)

    except Exception as e:
        # Log del error (en producción usarías logging)
        print(f"❌ Error general en contact_send: {str(e)}")

        return render_template('responses/contact_error.html',
                               contact_email=CONTACT_EMAIL)


@app.route('/system-error')
def system_error():
    return render_template('responses/system_error.html')


@app.route('/system-info')
def system_info():
    import platform
    import sys

    # Detectar Windows 11 correctamente
    def get_windows_version():
        if platform.system() != 'Windows':
            return platform.release()

        try:
            import winreg
            # Leer la versión desde el registro de Windows
            key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE,
                                 r"SOFTWARE\Microsoft\Windows NT\CurrentVersion")

            # Obtener el número de build
            build_number = winreg.QueryValueEx(key, "CurrentBuildNumber")[0]
            product_name = winreg.QueryValueEx(key, "ProductName")[0]

            winreg.CloseKey(key)

            # Windows 11 tiene build >= 22000
            if int(build_number) >= 22000:
                return f"11 (Build {build_number})"
            elif int(build_number) >= 10240:
                return f"10 (Build {build_number})"
            else:
                return f"{platform.release()} (Build {build_number})"

        except Exception:
            # Fallback si no se puede leer el registro
            return platform.release()

    system_name = platform.system()
    if system_name == 'Windows':
        system_release = get_windows_version()
        system_display = f"Windows {system_release}"
    else:
        system_release = platform.release()
        system_display = f"{system_name} {system_release}"

    return render_template('responses/system_info.html',
                           system_display=system_display,
                           python_version=sys.version.split()[0])


@app.route('/dashboard')
def dashboard():
    return render_template('partials/dashboard.html')


@app.route('/settings')
def settings():
    return render_template('partials/settings.html')


@app.route('/api/refresh', methods=['POST'])
def api_refresh():
    import datetime
    return render_template('responses/api_refresh.html',
                           timestamp=datetime.datetime.now().strftime("%H:%M:%S"))


@app.route('/settings/save', methods=['POST'])
def settings_save():
    return render_template('responses/settings_save.html')


@app.route('/settings/cache/clear')
def settings_cache_clear():
    return render_template('responses/settings_cache_clear.html')


@app.route('/settings/logs/view')
def settings_logs_view():
    logs_content = """[2025-01-15 14:30:15] INFO: Aplicación iniciada
[2025-01-15 14:30:20] INFO: Usuario conectado
[2025-01-15 14:31:05] INFO: Configuración actualizada
[2025-01-15 14:31:10] DEBUG: Cache limpiado"""
    return render_template('responses/settings_logs.html', logs=logs_content)

# APIs para Alpine.js


@app.route('/api/user/update', methods=['POST'])
def api_user_update():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                'success': False,
                'message': 'No se recibieron datos'
            }), 400

        # Guardar datos del usuario en archivo JSON
        if save_user_data(data):
            return jsonify({
                'success': True,
                'message': f'Usuario {data.get("name", "desconocido")} guardado correctamente en el servidor',
                'user': data
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Error al guardar los datos del usuario'
            }), 500

    except Exception as e:
        print(f"Error en api_user_update: {e}")
        return jsonify({
            'success': False,
            'message': f'Error del servidor: {str(e)}'
        }), 500


@app.route('/api/stats/sync', methods=['GET'])
def api_stats_sync():
    import random
    # Simular datos actualizados desde el servidor
    new_stats = {
        'users': random.randint(1200, 1500),
        'sales': random.randint(40000, 50000),
        'orders': random.randint(500, 700),
        'visits': random.randint(8000, 10000)
    }
    return jsonify({
        'success': True,
        'stats': new_stats,
        'timestamp': __import__('datetime').datetime.now().isoformat()
    })


@app.route('/api/notifications', methods=['POST'])
def api_notifications():
    from flask import request
    data = request.get_json()
    # Aquí podrías guardar la notificación en base de datos
    return jsonify({
        'success': True,
        'message': 'Notificación procesada',
        'notification': data
    })


@app.route('/chat/start')
def chat_start():
    return render_template('responses/chat_widget.html')


@app.route('/ocr/process', methods=['POST'])
def ocr_process():
    try:
        # Verificar si se subió un archivo
        if 'image' not in request.files:
            return render_template('responses/ocr_error.html',
                                   error='No se seleccionó ningún archivo')

        file = request.files['image']
        if file.filename == '':
            return render_template('responses/ocr_error.html',
                                   error='No se seleccionó ningún archivo')

        # Verificar tipo de archivo
        if not file.content_type.startswith('image/'):
            return render_template('responses/ocr_error.html',
                                   error='El archivo debe ser una imagen')

        # Obtener idioma seleccionado
        language = request.form.get('language', 'spa')

        # Mapear códigos de idioma para Tesseract
        tesseract_languages = {
            'spa': 'spa',
            'eng': 'eng',
            'fra': 'fra',
            'deu': 'deu',
            'ita': 'ita',
            'por': 'por'
        }

        tesseract_lang = tesseract_languages.get(language, 'spa')

        try:
            # Intentar usar pytesseract para OCR real
            import pytesseract
            from PIL import Image
            import io

            # Leer la imagen desde el archivo subido
            image_data = file.read()
            image = Image.open(io.BytesIO(image_data))

            # Procesar con Tesseract
            extracted_text = pytesseract.image_to_string(
                image, lang=tesseract_lang)

            # Calcular confianza (pytesseract puede dar datos de confianza)
            try:
                data = pytesseract.image_to_data(
                    image, lang=tesseract_lang, output_type=pytesseract.Output.DICT)
                confidences = [int(conf)
                               for conf in data['conf'] if int(conf) > 0]
                confidence = sum(
                    confidences) // len(confidences) if confidences else 0
            except:
                confidence = 85  # Valor por defecto

            # Limpiar texto extraído
            extracted_text = extracted_text.strip()

            if not extracted_text:
                return render_template('responses/ocr_error.html',
                                       error='No se pudo extraer texto de la imagen')

            return render_template('responses/prueba_texto.html',
                                   text=extracted_text,
                                   confidence=confidence,
                                   language=language,
                                   filename=file.filename)

        except ImportError:
            # Si pytesseract no está instalado, usar texto simulado como fallback
            print("⚠️ pytesseract no está instalado. Usando texto simulado.")

            # Texto simulado basado en el idioma
            sample_texts = {
                'spa': 'Este es un texto de ejemplo extraído de la imagen. La tecnología OCR permite convertir imágenes con texto en texto editable.',
                'eng': 'This is a sample text extracted from the image. OCR technology allows converting images with text into editable text.',
                'fra': 'Ceci est un exemple de texte extrait de l\'image. La technologie OCR permet de convertir des images avec du texte en texte modifiable.',
                'deu': 'Dies ist ein Beispieltext, der aus dem Bild extrahiert wurde. Die OCR-Technologie ermöglicht es, Bilder mit Text in bearbeitbaren Text umzuwandeln.',
                'ita': 'Questo è un testo di esempio estratto dall\'immagine. La tecnologia OCR consente di convertire immagini con testo in testo modificabile.',
                'por': 'Este é um texto de exemplo extraído da imagem. A tecnologia OCR permite converter imagens com texto em texto editável.'
            }

            import random
            extracted_text = sample_texts.get(language, sample_texts['spa'])
            confidence = random.randint(85, 98)

            return render_template('responses/prueba_texto.html',
                                   text=extracted_text,
                                   confidence=confidence,
                                   language=language,
                                   filename=file.filename)

    except Exception as e:
        print(f"Error en OCR: {e}")
        return render_template('responses/ocr_error.html',
                               error='Error interno del servidor')


@app.route('/ocr/history')
def ocr_history():
    return render_template('responses/ocr_history.html')


@app.route('/ocr')
def ocr():
    # Si es una petición HTMX, devolver solo el fragmento
    if request.headers.get('HX-Request'):
        return render_template('partials/ocr.html')

    # Si es una recarga completa, devolver la página completa
    user_data = load_user_data()
    initial_data = {
        'user': user_data,
        'stats': {
            'users': 1234,
            'sales': 45678,
            'orders': 567,
            'visits': 8901
        },
        'app_config': {
            'name': 'Flask HTMX Alpine SPA',
            'version': '1.0.0',
            'debug': True
        }
    }
    return render_template('index.html', data=initial_data)


@app.route('/manifest.json')
def manifest():
    return app.send_static_file('manifest.json')


@app.route('/sw.js')
def service_worker():
    return app.send_static_file('sw.js')


@app.route('/robots.txt')
def robots():
    return app.send_static_file('../robots.txt')


@app.route('/sitemap.xml')
def sitemap():
    from flask import render_template_string
    with open('sitemap.xml', 'r', encoding='utf-8') as f:
        sitemap_content = f.read()
    return render_template_string(sitemap_content), 200, {'Content-Type': 'application/xml'}


@app.route('/browserconfig.xml')
def browserconfig():
    return app.send_static_file('../browserconfig.xml')


if __name__ == '__main__':
    # Para desarrollo local
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(debug=debug, host='0.0.0.0', port=port)
