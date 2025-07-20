// Alpine.js Components para Flask HTMX SPA
// Este archivo contiene todos los componentes y stores de Alpine.js

// Store global para compartir datos entre componentes
document.addEventListener('alpine:init', () => {
    Alpine.store('app', {
        // Estado global de la aplicación
        user: {
            name: 'Usuario Demo',
            email: 'demo@ejemplo.com',
            preferences: {
                theme: 'light',
                language: 'es',
                notifications: true
            }
        },
        
        notifications: [],
        
        // Métodos globales
        addNotification(message, type = 'info') {
            const notification = {
                id: Date.now(),
                message: message,
                type: type,
                timestamp: new Date().toLocaleTimeString()
            };
            this.notifications.unshift(notification);
            
            // Auto-remover después de 5 segundos
            setTimeout(() => {
                this.removeNotification(notification.id);
            }, 5000);
        },
        
        removeNotification(id) {
            this.notifications = this.notifications.filter(n => n.id !== id);
        },
        
        updateUser(userData) {
            this.user = { ...this.user, ...userData };
            this.addNotification('Usuario actualizado', 'success');
        }
    });

    // Store para el formulario de contacto
    Alpine.store('contact', {
        showMailForm: true,
        
        hideForm() {
            this.showMailForm = false;
        },
        
        showForm() {
            this.showMailForm = true;
        }
    });

    // Store global para PWA (deferredPrompt y modal)
    Alpine.store('pwa', {
        deferredPrompt: null,
        pwaModalShown: false,
        setDeferredPrompt(e) {
            this.deferredPrompt = e;
        },
        clearDeferredPrompt() {
            this.deferredPrompt = null;
        },
        setPwaModalShown(val) {
            this.pwaModalShown = val;
        }
    });
});

// Componente principal de la aplicación
function appData() {
    return {
        // Datos del usuario desde localStorage
        user: JSON.parse(localStorage.getItem('app-user') || JSON.stringify({
            name: 'Usuario Demo',
            email: 'demo@ejemplo.com',
            preferences: {
                theme: 'light',
                language: 'es',
                notifications: true
            }
        })),
        stats: {
            users: 0,
            sales: 0,
            orders: 0,
            visits: 0
        },
        appConfig: {
            name: 'Flask HTMX Alpine SPA',
            version: '1.0.0',
            debug: false
        },
        
        // Variables reactivas locales
        currentTime: new Date().toLocaleTimeString(),
        counter: parseInt(localStorage.getItem('app-counter') || '0'),
        message: localStorage.getItem('app-message') || '',
        isLoading: false,
        notifications: [],
        showMailForm: true, // Variable para controlar la visibilidad del formulario de contacto
        showApiButton: true, // Variable para controlar la visibilidad del botón de API
        
        // Inicialización
        init() {
            console.log('🚀 Alpine.js App inicializado');
            console.log('📊 Datos del usuario desde localStorage:', this.user);
            
            this.updateTime();
            
            // Aplicar tema guardado
            this.applyTheme();
            
            // Sincronizar con store global si existe
            if (this.$store && this.$store.app) {
                this.$store.app.updateUser(this.user);
            }
        },

        // Guardar usuario completo en localStorage
        saveUserToStorage() {
            localStorage.setItem('app-user', JSON.stringify(this.user));
            console.log('💾 Usuario guardado en localStorage:', this.user);
        },
        
        // Métodos de tiempo
        updateTime() {
            setInterval(() => {
                this.currentTime = new Date().toLocaleTimeString();
            }, 1000);
        },
        
        // Métodos de contador
        incrementCounter() {
            this.counter++;
            localStorage.setItem('app-counter', this.counter.toString());
            this.addNotification(`Contador incrementado a ${this.counter}`, 'info');
        },
        
        resetCounter() {
            this.counter = 0;
            localStorage.setItem('app-counter', '0');
            this.addNotification('Contador reiniciado', 'info');
        },

        // Método para actualizar mensaje dinámico
        updateMessage(newMessage) {
            this.message = newMessage;
            localStorage.setItem('app-message', newMessage);
        },
        
        // Métodos de usuario
        updateUserName(newName) {
            this.user.name = newName;
            this.saveUserToStorage(); // Guardar automáticamente
            this.addNotification(`Nombre actualizado a: ${newName}`, 'success');
            
            // Sincronizar con store global
            if (this.$store && this.$store.app) {
                this.$store.app.updateUser(this.user);
            }
        },

        updateUserEmail(newEmail) {
            this.user.email = newEmail;
            this.saveUserToStorage(); // Guardar automáticamente
            console.log(`Email actualizado a: ${newEmail}`);
            
            // Sincronizar con store global
            if (this.$store && this.$store.app) {
                this.$store.app.updateUser(this.user);
            }
        },
        
        toggleTheme() {
            this.user.preferences.theme = this.user.preferences.theme === 'light' ? 'dark' : 'light';
            
            // Guardar usuario completo en localStorage (incluye el tema)
            this.saveUserToStorage();
            
            // Aplicar tema
            this.applyTheme();
        },

        applyTheme() {
            // Aplicar tema al body
            document.body.setAttribute('data-theme', this.user.preferences.theme);
            
            // También aplicar al html para mayor compatibilidad
            document.documentElement.setAttribute('data-theme', this.user.preferences.theme);
            
            console.log(`Tema aplicado: ${this.user.preferences.theme}`);
        },
        
        // Métodos de notificaciones
        addNotification(message, type = 'info') {
            const notification = {
                id: Date.now(),
                message: message,
                type: type,
                timestamp: new Date().toLocaleTimeString()
            };
            this.notifications.unshift(notification);
            
            // Limitar a 5 notificaciones máximo
            if (this.notifications.length > 5) {
                this.notifications = this.notifications.slice(0, 5);
            }
            
            // Auto-remover después de 5 segundos
            setTimeout(() => {
                this.removeNotification(notification.id);
            }, 5000);
        },
        
        removeNotification(id) {
            this.notifications = this.notifications.filter(n => n.id !== id);
        },
        
        // Métodos de API
        async syncWithServer() {
            this.isLoading = true;
            try {
                const response = await fetch('/api/stats/sync');
                const data = await response.json();
                
                if (data.success) {
                    this.stats = data.stats;
                    this.addNotification('Datos random de prueba', 'success');
                } else {
                    throw new Error('Error en la respuesta del servidor');
                }
            } catch (error) {
                console.error('Error al sincronizar:', error);
                this.addNotification('Error al sincronizar datos', 'error');
            } finally {
                this.isLoading = false;
            }
        },
        

        
        async sendNotificationToServer(message, type) {
            try {
                const notification = {
                    message: message,
                    type: type,
                    timestamp: new Date().toISOString(),
                    user: this.user.name
                };
                
                const response = await fetch('/api/notifications', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(notification)
                });
                
                const data = await response.json();
                console.log('Notificación enviada al servidor:', data);
            } catch (error) {
                console.error('Error al enviar notificación:', error);
            }
        }
    }
}

// Componente para la página Home
function homeData() {
    return {
        quickMessage: '',
        quickNotes: JSON.parse(localStorage.getItem('quickNotes') || '[]'),
        homeStats: {
            activeUsers: 42,
            todaySales: 1250,
            pendingTasks: 8,
            systemLoad: 65
        },
        isRefreshing: false,
        lastUpdate: new Date().toLocaleTimeString(),
        autoRefreshInterval: null,
        
        init() {
            console.log('🏠 Alpine.js Home inicializado');
            this.startAutoRefresh();
            
            // Cargar notas desde localStorage
            this.loadNotesFromStorage();
        },
        
        // Métodos de notas rápidas
        addQuickNote() {
            if (this.quickMessage.trim()) {
                const note = {
                    id: Date.now(),
                    text: this.quickMessage.trim(),
                    timestamp: new Date().toLocaleTimeString(),
                    date: new Date().toLocaleDateString()
                };
                this.quickNotes.unshift(note);
                this.quickMessage = '';
                
                // Guardar en localStorage
                this.saveNotesToStorage();
                
                // Notificar al store global si existe
                if (this.$store && this.$store.app) {
                    this.$store.app.addNotification('Nota agregada', 'success');
                }
            }
        },
        
        removeQuickNote(id) {
            this.quickNotes = this.quickNotes.filter(note => note.id !== id);
            this.saveNotesToStorage();
            
            if (this.$store && this.$store.app) {
                this.$store.app.addNotification('Nota eliminada', 'info');
            }
        },
        
        clearAllNotes() {
            this.quickNotes = [];
            this.saveNotesToStorage();
            
            if (this.$store && this.$store.app) {
                this.$store.app.addNotification('Todas las notas eliminadas', 'warning');
            }
        },
        
        // Métodos de almacenamiento
        saveNotesToStorage() {
            localStorage.setItem('quickNotes', JSON.stringify(this.quickNotes));
        },
        
        loadNotesFromStorage() {
            const saved = localStorage.getItem('quickNotes');
            if (saved) {
                this.quickNotes = JSON.parse(saved);
            }
        },
        
        // Métodos de estadísticas
        async refreshStats() {
            this.isRefreshing = true;
            try {
                // Simular llamada a API real
                const response = await fetch('/api/stats/sync');
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        // Usar datos reales del servidor
                        this.homeStats.activeUsers = data.stats.users || this.homeStats.activeUsers;
                        this.homeStats.todaySales = data.stats.sales || this.homeStats.todaySales;
                    }
                } else {
                    // Fallback a datos simulados
                    this.homeStats.activeUsers = Math.floor(Math.random() * 100) + 20;
                    this.homeStats.todaySales = Math.floor(Math.random() * 2000) + 500;
                }
                
                this.homeStats.pendingTasks = Math.floor(Math.random() * 20);
                this.homeStats.systemLoad = Math.floor(Math.random() * 40) + 40;
                
                this.lastUpdate = new Date().toLocaleTimeString();
                
                if (this.$store && this.$store.app) {
                    this.$store.app.addNotification('Estadísticas actualizadas', 'success');
                }
            } catch (error) {
                console.error('Error al actualizar estadísticas:', error);
                if (this.$store && this.$store.app) {
                    this.$store.app.addNotification('Error al actualizar estadísticas', 'error');
                }
            } finally {
                this.isRefreshing = false;
            }
        },
        
        startAutoRefresh() {
            // Auto-actualizar cada 30 segundos
            this.autoRefreshInterval = setInterval(() => {
                if (!this.isRefreshing) {
                    this.refreshStats();
                }
            }, 30000);
        },
        
        stopAutoRefresh() {
            if (this.autoRefreshInterval) {
                clearInterval(this.autoRefreshInterval);
                this.autoRefreshInterval = null;
            }
        },
        
        // Cleanup cuando el componente se destruye
        destroy() {
            this.stopAutoRefresh();
        }
    }
}

// Componente para formularios dinámicos
function formData() {
    return {
        formFields: {},
        isSubmitting: false,
        errors: {},
        
        init() {
            console.log('📝 Alpine.js Form inicializado');
        },
        
        async submitForm(endpoint, method = 'POST') {
            this.isSubmitting = true;
            this.errors = {};
            
            try {
                const response = await fetch(endpoint, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.formFields)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    if (this.$store && this.$store.app) {
                        this.$store.app.addNotification('Formulario enviado correctamente', 'success');
                    }
                    this.formFields = {}; // Limpiar formulario
                } else {
                    this.errors = data.errors || {};
                    throw new Error(data.message || 'Error al enviar formulario');
                }
            } catch (error) {
                console.error('Error al enviar formulario:', error);
                if (this.$store && this.$store.app) {
                    this.$store.app.addNotification('Error al enviar formulario', 'error');
                }
            } finally {
                this.isSubmitting = false;
            }
        },
        
        validateField(fieldName, value) {
            // Validación básica
            if (!value || value.trim() === '') {
                this.errors[fieldName] = 'Este campo es requerido';
                return false;
            }
            
            // Limpiar error si es válido
            if (this.errors[fieldName]) {
                delete this.errors[fieldName];
            }
            
            return true;
        }
    }
}

// Componente para OCR
function ocrData() {
    return {
        selectedImage: null,
        selectedLanguage: 'spa',
        isDragOver: false,
        showOcrForm: true,
        showMobileModal: false,
        imageInfo: '',
        isProcessing: false,
        extractedText: '',
        progress: 0,
        progressText: '',
        confidence: 0,
        
        init() {
            console.log('📸 Alpine.js OCR inicializado');
        },
        
        // Manejo de archivos
        handleFileSelect(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                this.processImageFile(file);
            }
        },
        
        handleDrop(event) {
            this.isDragOver = false;
            const files = event.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.processImageFile(files[0]);
            }
        },
        
        processImageFile(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.selectedImage = e.target.result;
                this.imageInfo = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
            };
            reader.readAsDataURL(file);
        },
        
        handleUploadClick() {
            if (this.isMobileDevice()) {
                this.showMobileModal = true;
            } else {
                this.$refs.fileInput.click();
            }
        },
        
        selectCamera() {
            this.$refs.cameraInput.click();
            this.showMobileModal = false;
        },
        
        selectGallery() {
            this.$refs.fileInput.click();
            this.showMobileModal = false;
        },
        
        isMobileDevice() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        
        // Callbacks para HTMX
        beforeOcrRequest() {
            this.isProcessing = true;
            if (this.$store && this.$store.app) {
                this.$store.app.addNotification('Procesando imagen con OCR...', 'info');
            }
        },
        
        afterOcrRequest() {
            this.isProcessing = false;
        },
        
        ocrError() {
            this.isProcessing = false;
            if (this.$store && this.$store.app) {
                this.$store.app.addNotification('Error al procesar la imagen', 'error');
            }
        },
        
        clearImage() {
            this.selectedImage = null;
            this.imageInfo = '';
            this.$refs.fileInput.value = '';
            this.$refs.cameraInput.value = '';
        },
        
        clearForm() {
            this.clearImage();
            this.selectedLanguage = 'spa';
            this.extractedText = '';
            this.confidence = 0;
            this.progress = 0;
            this.progressText = '';
            this.isProcessing = false;
            
            // Limpiar también el área de resultados
            const resultsDiv = document.getElementById('ocr-results');
            if (resultsDiv) {
                resultsDiv.innerHTML = '';
            }
            
            if (this.$store && this.$store.app) {
                this.$store.app.addNotification('Formulario limpiado', 'info');
            }
        },
        
        closeMobileModal() {
            this.showMobileModal = false;
        },

        processImage() {
          if (!this.selectedImage || !window.Tesseract) {
            if (this.$store && this.$store.app) {
              this.$store.app.addNotification('Tesseract.js no está cargado. Intenta de nuevo.', 'error');
            }
            return;
          }
          this.isProcessing = true;
          this.progress = 0;
          this.progressText = 'Procesando...';
          this.extractedText = '';
          this.confidence = 0;

          const language = document.getElementById('language-select').value;

          Tesseract.recognize(
            this.selectedImage,
            language,
            {
              logger: (m) => {
                if (m.status === 'recognizing text') {
                  this.progress = Math.round(m.progress * 100);
                  this.progressText = `Reconociendo texto... ${this.progress}%`;
                } else {
                  this.progressText = m.status;
                }
              }
            }
          ).then(({ data }) => {
            this.extractedText = data.text.trim();
            this.confidence = Math.round(data.confidence);
            if (this.$store && this.$store.app) {
              if (this.extractedText) {
                this.$store.app.addNotification('Texto extraído exitosamente', 'success');
              } else {
                this.$store.app.addNotification('No se pudo extraer texto de la imagen', 'error');
              }
            }
          }).catch((error) => {
            if (this.$store && this.$store.app) {
              this.$store.app.addNotification('Error al procesar la imagen', 'error');
            }
            console.error('Error en OCR:', error);
          }).finally(() => {
            this.isProcessing = false;
            this.progressText = '';
            this.progress = 0;
          });
        },

        downloadText() {
          if (!this.extractedText) return;
          const blob = new Blob([this.extractedText], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `texto-extraido-${Date.now()}.txt`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          if (this.$store && this.$store.app) {
            this.$store.app.addNotification('Archivo descargado', 'success');
          }
        }
    }
}

// Componente para Chat Bot
function chatData() {
    return {
        messages: [],
        currentMessage: '',
        isTyping: false,
        chatHistory: JSON.parse(localStorage.getItem('chatHistory') || '[]'),
        
        init() {
            console.log('💬 Alpine.js Chat inicializado');
            this.messages = this.chatHistory;
            
            // Mensaje de bienvenida si no hay historial
            if (this.messages.length === 0) {
                this.addBotMessage('¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?');
            }
        },
        
        sendMessage() {
            if (this.currentMessage.trim()) {
                this.addUserMessage(this.currentMessage);
                const userMsg = this.currentMessage;
                this.currentMessage = '';
                
                // Simular respuesta del bot
                this.simulateBotResponse(userMsg);
            }
        },
        
        addUserMessage(text) {
            const message = {
                id: Date.now(),
                text: text,
                sender: 'user',
                timestamp: new Date().toLocaleTimeString()
            };
            this.messages.push(message);
            this.saveChatHistory();
            this.scrollToBottom();
        },
        
        addBotMessage(text) {
            const message = {
                id: Date.now(),
                text: text,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString()
            };
            this.messages.push(message);
            this.saveChatHistory();
            this.scrollToBottom();
        },
        
        simulateBotResponse(userMessage) {
            this.isTyping = true;
            
            setTimeout(() => {
                const responses = [
                    'Interesante pregunta. Déjame pensar en eso...',
                    'Entiendo tu punto. Aquí tienes mi respuesta:',
                    'Esa es una buena pregunta. Te puedo ayudar con eso.',
                    'Basándome en tu consulta, te sugiero lo siguiente:',
                    'Perfecto, puedo ayudarte con eso.'
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                this.addBotMessage(randomResponse);
                this.isTyping = false;
            }, 1000 + Math.random() * 2000);
        },
        
        clearChat() {
            this.messages = [];
            this.saveChatHistory();
            this.addBotMessage('Chat limpiado. ¿En qué más puedo ayudarte?');
        },
        
        saveChatHistory() {
            localStorage.setItem('chatHistory', JSON.stringify(this.messages));
        },
        
        scrollToBottom() {
            this.$nextTick(() => {
                const chatContainer = document.querySelector('.chat-messages');
                if (chatContainer) {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
            });
        }
    }
}

// Utilidades globales
window.AlpineUtils = {
    formatNumber(num) {
        return new Intl.NumberFormat('es-ES').format(num);
    },
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    },
    
    formatDate(date) {
        return new Intl.DateTimeFormat('es-ES').format(new Date(date));
    },
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

console.log('📦 Alpine.js Components cargados correctamente');