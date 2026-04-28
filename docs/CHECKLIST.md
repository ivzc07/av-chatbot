# Checklist de Instalación — Chatbot Web con IA

Cliente: ____________________  
Fecha: ____________________  
Instalador: ____________________

---

## Preparación (antes de empezar)

- [ ] Recibir datos del cliente (nombre negocio, web, colores)
- [ ] Crear API key de DeepSeek
- [ ] Verificar saldo de DeepSeek ($5 mínimo)
- [ ] Tener acceso al Google Cloud Console
- [ ] Tener acceso a Google Drive (para crear la hoja CRM)
- [ ] Tener servidor web disponible (hosting, VPS, etc.)

---

## n8n — Workflow

- [ ] Abrir n8n
- [ ] Importar `workflow/av-chatbot-workflow.json`
- [ ] Configurar credencial DeepSeek API (Settings → Credentials → DeepSeek API)
- [ ] Configurar credencial Google Sheets OAuth2 (Settings → Credentials → Google Sheets)
- [ ] Activar workflow
- [ ] Copiar URL del webhook: `________________________________`

---

## Widget — Instalación

- [ ] Subir `widget/av-chatbot.js` al servidor
- [ ] Rellenar línea de instalación:

```html
<script src="________________________________"
        data-business="________________________________"
        data-welcome="________________________________"
        data-color="#__________"
        data-tone="informal"
        data-endpoint="________________________________">
</script>
```

- [ ] Insertar línea en la web del cliente
- [ ] Verificar que el botón flotante aparece
- [ ] Verificar que se abre y cierra correctamente
- [ ] Verificar responsive en móvil

---

## Google Sheets — CRM

- [ ] Crear Google Sheet vacía: `CRM-[NOMBRE_CLIENTE]`
- [ ] Compartir con el email de tu service account como Editor
- [ ] Ejecutar `python3 scripts/create-client-sheet.py <SHEET_ID> "Nombre del Negocio"`
- [ ] Rellenar datos del negocio en pestaña "Conocimiento"
- [ ] Anotar ID de la hoja: `________________________________`

---

## Telegram — Notificaciones

- [ ] Crear bot con @BotFather
- [ ] Anotar token: `________________________________`
- [ ] Dueño obtiene Chat ID con @userinfobot
- [ ] Anotar Chat ID: `________________________________`
- [ ] Añadir `Telegram Token` y `Telegram Chat ID` en pestaña "Conocimiento" de Google Sheets
- [ ] Verificar: dueño envía mensaje al bot → OK

---

## Verificación final (end-to-end)

- [ ] Abrir web del cliente
- [ ] Widget visible y funcional
- [ ] Enviar pregunta de prueba al chatbot
- [ ] Chatbot responde con información relevante del negocio
- [ ] Simular lead (preguntar precios/reservas)
- [ ] Chatbot ofrece capturar datos
- [ ] Conversación registrada en Google Sheets
- [ ] Notificación Telegram recibida por el dueño

---

## Datos de la instalación (para registro)

| Campo | Valor |
|---|---|
| Cliente | |
| Web | |
| URL Webhook n8n | |
| ID Google Sheet | |
| Telegram Chat ID | |
| Color widget | |
| Fecha instalación | |
| Tiempo total | |

---

Chatbot Web · Abril 2026
