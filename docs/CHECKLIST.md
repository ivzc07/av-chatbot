# Checklist de Instalación — AuxoVelari Chatbot

Cliente: ____________________  
Fecha: ____________________  
Instalador: ____________________

---

## Preparación (antes de empezar)

- [ ] Recibir datos del cliente (nombre negocio, web, colores)
- [ ] Crear API key de DeepSeek
- [ ] Verificar saldo de DeepSeek ($5 mínimo)
- [ ] Tener acceso al Google Cloud Console
- [ ] Tener acceso al Google Drive de AuxoVelari
- [ ] Tener servidor web disponible (Hetzner CX33)

---

## n8n — Workflow

- [ ] Abrir n8n
- [ ] Importar `workflow/av-chatbot-workflow.json`
- [ ] Configurar API key de DeepSeek en nodo "DeepSeek V3.2"
- [ ] Configurar token de Telegram en nodo "Telegram Notificación"
- [ ] Configurar Chat ID en nodo "Telegram Notificación"
- [ ] Activar workflow
- [ ] Copiar URL del webhook: `________________________________`

---

## Widget — Instalación

- [ ] Subir `widget/av-chatbot.js` al servidor
- [ ] Rellenar línea de instalación:

```html
<script src="________________________________"
        data-business="________________________________"
        data-name="________________________________"
        data-welcome="________________________________"
        data-color="#__________"
        data-tone="informal"
        data-api="________________________________">
</script>
```

- [ ] Insertar línea en la web del cliente
- [ ] Verificar que el botón flotante aparece
- [ ] Verificar que se abre y cierra correctamente
- [ ] Verificar responsive en móvil

---

## Google Sheets — CRM

- [ ] Habilitar Google Sheets API en Cloud Console
- [ ] Crear Service Account
- [ ] Descargar JSON de credenciales
- [ ] Crear nueva Google Sheet: `AV-CRM-[NOMBRE_CLIENTE]`
- [ ] Añadir columnas: Fecha/Hora, Visitante, Contacto, Resumen, Estado, Temas, Confianza, Session ID
- [ ] Formatear columna Estado (verde/amarillo/gris)
- [ ] Añadir panel resumen (filas superiores)
- [ ] Fijar primeras 3 filas (panel + header)
- [ ] Compartir hoja con email de service account (Editor)
- [ ] Anotar ID de la hoja: `________________________________`

---

## Telegram — Notificaciones

- [ ] Crear bot con @BotFather
- [ ] Anotar token: `________________________________`
- [ ] Dueño obtiene Chat ID con @userinfobot
- [ ] Anotar Chat ID: `________________________________`
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

AuxoVelari · Abril 2026
