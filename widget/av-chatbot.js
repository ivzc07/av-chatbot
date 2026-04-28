/**
 * AuxoVelari Chatbot Widget v1.0.0
 * Widget de chat con IA - Embebible con 1 línea de código
 * 
 * Uso:
 * <script src="av-chatbot.js" data-business="Restaurante Sol" data-welcome="¡Hola! ¿En qué puedo ayudarte?" data-color="#2E86AB" data-tone="informal" data-endpoint="https://tu-n8n.com/webhook/chat"></script>
 */

(function() {
  'use strict';

  // ============================================================
  // CONFIGURACIÓN (desde data-attributes del script tag)
  // ============================================================
  const scriptTag = document.currentScript;
  const CONFIG = {
    businessName: scriptTag?.dataset?.business || 'AuxoVelari',
    welcomeMessage: scriptTag?.dataset?.welcome || '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte?',
    primaryColor: scriptTag?.dataset?.color || '#2E86AB',
    endpoint: scriptTag?.dataset?.endpoint || '',
    tone: scriptTag?.dataset?.tone || 'informal',
  };

  // ============================================================
  // ESTADO
  // ============================================================
  let isOpen = false;
  let sessionId = generateId();
  let messageHistory = [];

  // Detectar restauración de caché del navegador (bfcache) — forzar sesión nueva
  window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
      sessionId = generateId();
      messageHistory = [];
    }
  });

  function generateId() {
    return 'av_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // ============================================================
  // CREAR ESTILOS CSS
  // ============================================================
  const styles = `
    #av-chatbot-container * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    #av-chatbot-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      direction: ltr;
    }

    .av-chat-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${CONFIG.primaryColor};
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
      position: relative;
    }

    .av-chat-button:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    }

    .av-chat-button svg {
      width: 28px;
      height: 28px;
      fill: white;
    }

    .av-chat-button .av-close-icon { display: none; }
    .av-chat-panel.av-open ~ .av-chat-button .av-chat-icon { display: none; }
    .av-chat-panel.av-open ~ .av-chat-button .av-close-icon { display: block; }

    .av-chat-panel {
      display: none;
      position: absolute;
      bottom: 75px;
      right: 0;
      width: 380px;
      max-width: calc(100vw - 40px);
      height: 520px;
      max-height: calc(100vh - 120px);
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      overflow: hidden;
      flex-direction: column;
      border: 1px solid #e8e8e8;
    }

    .av-chat-panel.av-open {
      display: flex;
    }

    .av-chat-header {
      background: ${CONFIG.primaryColor};
      color: white;
      padding: 16px 20px;
      font-weight: 600;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .av-chat-header-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .av-chat-subtitle {
      font-size: 11px;
      font-weight: 400;
      opacity: 0.85;
    }

    .av-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #f7f8fa;
    }

    .av-message {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 14px;
      line-height: 1.45;
      word-wrap: break-word;
      animation: avFadeIn 0.3s ease;
    }

    @keyframes avFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .av-message-bot {
      align-self: flex-start;
      background: white;
      border: 1px solid #e8e8e8;
      border-bottom-left-radius: 4px;
      color: #333;
    }

    .av-message-user {
      align-self: flex-end;
      background: ${CONFIG.primaryColor};
      color: white;
      border-bottom-right-radius: 4px;
    }

    .av-message-error {
      align-self: flex-start;
      background: #fff0f0;
      border: 1px solid #ffcccc;
      color: #c0392b;
      font-size: 13px;
    }

    .av-chat-footer {
      padding: 12px 16px;
      border-top: 1px solid #e8e8e8;
      display: flex;
      gap: 8px;
      flex-shrink: 0;
      background: white;
    }

    .av-chat-input {
      flex: 1;
      border: 1px solid #ddd;
      border-radius: 24px;
      padding: 10px 16px;
      font-size: 14px;
      outline: none;
      font-family: inherit;
      transition: border-color 0.2s;
    }

    .av-chat-input:focus {
      border-color: ${CONFIG.primaryColor};
    }

    .av-chat-send {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: ${CONFIG.primaryColor};
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
      flex-shrink: 0;
    }

    .av-chat-send:hover { opacity: 0.9; }
    .av-chat-send:disabled { opacity: 0.5; cursor: not-allowed; }

    .av-chat-send svg {
      width: 18px;
      height: 18px;
      fill: white;
    }

    .av-typing-indicator {
      align-self: flex-start;
      padding: 10px 14px;
      display: flex;
      gap: 4px;
    }

    .av-typing-indicator span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #bbb;
      animation: avBounce 1.3s infinite;
    }

    .av-typing-indicator span:nth-child(2) { animation-delay: 0.15s; }
    .av-typing-indicator span:nth-child(3) { animation-delay: 0.3s; }

    @keyframes avBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }

    /* Responsive: móvil */
    @media (max-width: 480px) {
      #av-chatbot-container {
        bottom: 10px;
        right: 10px;
      }
      .av-chat-panel {
        width: calc(100vw - 20px);
        max-width: 100%;
        height: calc(100vh - 100px);
        max-height: calc(100vh - 80px);
        right: -4px;
        bottom: 70px;
        border-radius: 12px;
      }
      .av-chat-button {
        width: 52px;
        height: 52px;
      }
    }
  `;

  // ============================================================
  // CONSTRUIR HTML
  // ============================================================
  const html = `
    <div class="av-chat-panel" id="av-panel">
      <div class="av-chat-header">
        <div class="av-chat-header-avatar">💬</div>
        <div>
          <div>${escapeHtml(CONFIG.businessName)}</div>
          <div class="av-chat-subtitle">Respondemos en segundos</div>
        </div>
      </div>
      <div class="av-chat-messages" id="av-messages"></div>
      <div class="av-chat-footer">
        <input 
          class="av-chat-input" 
          id="av-input" 
          type="text" 
          placeholder="Escribe tu mensaje..." 
          autocomplete="off"
        />
        <button class="av-chat-send" id="av-send" aria-label="Enviar">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
    <button class="av-chat-button" id="av-button" aria-label="Abrir chat">
      <svg class="av-chat-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/></svg>
      <svg class="av-close-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
    </button>
  `;

  // ============================================================
  // INYECTAR EN EL DOM
  // ============================================================
  function init() {
    // Evitar doble inicialización
    if (document.getElementById('av-chatbot-container')) return;

    const container = document.createElement('div');
    container.id = 'av-chatbot-container';
    container.innerHTML = html;
    document.body.appendChild(container);

    // Inyectar estilos
    const styleEl = document.createElement('style');
    styleEl.id = 'av-chatbot-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Event listeners
    document.getElementById('av-button').addEventListener('click', toggleChat);
    document.getElementById('av-send').addEventListener('click', sendMessage);
    document.getElementById('av-input').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') sendMessage();
    });

    // Mostrar mensaje de bienvenida al abrir
    const panel = document.getElementById('av-panel');
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.target.classList.contains('av-open')) {
          showWelcome();
          observer.disconnect();
        }
      });
    });
    observer.observe(panel, { attributes: true, attributeFilter: ['class'] });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================================
  // ABRIR / CERRAR CHAT
  // ============================================================
  function toggleChat() {
    isOpen = !isOpen;
    const panel = document.getElementById('av-panel');
    if (isOpen) {
      panel.classList.add('av-open');
      document.getElementById('av-input').focus();
    } else {
      panel.classList.remove('av-open');
    }
  }

  function showWelcome() {
    const messagesEl = document.getElementById('av-messages');
    if (messagesEl.children.length === 0) {
      addMessage(CONFIG.welcomeMessage, 'bot');
    }
  }

  // ============================================================
  // MENSAJES
  // ============================================================
  function addMessage(text, sender) {
    const messagesEl = document.getElementById('av-messages');
    const div = document.createElement('div');
    div.className = `av-message av-message-${sender}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function showTyping() {
    const messagesEl = document.getElementById('av-messages');
    const div = document.createElement('div');
    div.className = 'av-typing-indicator';
    div.id = 'av-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function hideTyping() {
    const typing = document.getElementById('av-typing');
    if (typing) typing.remove();
  }

  function scrollToBottom() {
    const messagesEl = document.getElementById('av-messages');
    setTimeout(() => { messagesEl.scrollTop = messagesEl.scrollHeight; }, 50);
  }

  // ============================================================
  // ENVIAR MENSAJE AL BACKEND
  // ============================================================
  async function sendMessage() {
    const input = document.getElementById('av-input');
    const sendBtn = document.getElementById('av-send');
    const text = input.value.trim();
    if (!text) return;

    // Mostrar mensaje del usuario
    addMessage(text, 'user');
    messageHistory.push({ role: 'user', content: text });
    input.value = '';
    sendBtn.disabled = true;
    showTyping();

    // Si no hay endpoint configurado, responder con mensaje de prueba
    if (!CONFIG.endpoint) {
      setTimeout(() => {
        hideTyping();
        addMessage('ℹ️ Endpoint no configurado. Esto es una respuesta de prueba. Configura el webhook de n8n para respuestas reales con IA.', 'bot');
        sendBtn.disabled = false;
        input.focus();
      }, 1200);
      return;
    }

    try {
      const response = await fetch(CONFIG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId,
          message: text,
          history: messageHistory.slice(-10),
          businessName: CONFIG.businessName,
          tone: CONFIG.tone,
        }),
      });

      hideTyping();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply = data.response || data.reply || data.message || data.text || 'Lo siento, no pude procesar tu mensaje.';
      
      addMessage(reply, 'bot');
      messageHistory.push({ role: 'assistant', content: reply });

    } catch (error) {
      hideTyping();
      addMessage('⚠️ Lo siento, hubo un problema de conexión. Inténtalo de nuevo en unos segundos.', 'error');
      console.error('AuxoVelari Chatbot Error:', error);
    }

    sendBtn.disabled = false;
    input.focus();
  }

  // ============================================================
  // INICIAR AL CARGAR
  // ============================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
