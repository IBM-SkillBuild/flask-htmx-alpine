#!/usr/bin/env python3
"""
Archivo de inicio para Render
"""
import os
import sys

# Agregar el directorio actual al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    # Intentar usar gunicorn
    import gunicorn.app.wsgiapp as wsgi
    from app import app
    
    if __name__ == '__main__':
        # Configuración para gunicorn
        port = int(os.environ.get('PORT', 5000))
        workers = int(os.environ.get('WEB_CONCURRENCY', 1))
        
        # Argumentos para gunicorn
        sys.argv = [
            'gunicorn',
            '--bind', f'0.0.0.0:{port}',
            '--workers', str(workers),
            '--threads', '2',
            '--timeout', '30',
            'app:app'
        ]
        
        wsgi.run()
        
except ImportError:
    # Fallback a Flask development server
    print("Gunicorn not available, using Flask development server")
    from app import app
    
    if __name__ == '__main__':
        port = int(os.environ.get('PORT', 5000))
        app.run(host='0.0.0.0', port=port, debug=False)