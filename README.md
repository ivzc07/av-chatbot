# Chatbot Web con IA — MVP

Widget de chat con IA para webs de negocio. Entiende lenguaje natural, responde usando la base de conocimiento del negocio, capta leads y registra todo en Google Sheets. Notifica al dueño por Telegram.

## Demo

Abre https://ivzc07.github.io/av-chatbot/demo/ para ver el widget funcionando con el restaurante de prueba "Cala Blanca" (Menorca).

## Estructura del proyecto

```
av-chatbot/
├── widget/
│   └── av-chatbot.js         # Widget de chat (1 línea de instalación)
├── demo/
│   └── index.html            # Demo: restaurante en Menorca
├── workflow/
│   └── av-chatbot-workflow.json  # Workflow n8n (importar)
├── docs/
│   ├── GUIA_INSTALACION.md   # Guía paso a paso
│   └── CHECKLIST.md          # Checklist de setup por cliente
└── README.md
```

## Instalación rápida

1. Añade esta línea a cualquier web:

```html
<script src="https://ivzc07.github.io/av-chatbot/widget/av-chatbot.js"
        data-business="Mi Negocio"
        data-welcome="¡Hola! ¿En qué puedo ayudarte?"
        data-color="#2E86AB"
        data-tone="informal"
        data-endpoint="https://TU-N8N/webhook/av-chatbot">
</script>
```

2. Importa `workflow/av-chatbot-workflow.json` en n8n
3. Configura las credenciales (DeepSeek, Google Sheets, Telegram)
4. Activa el workflow

## Workflow (15 nodos)

```
Webhook Chat → Leer KB → Prepare DeepSeek → DeepSeek Model + AI Agent → Format Response
                                                                              ├→ Respond Now (respuesta inmediata ~4-5s)
                                                                              └→ Map CRM → Leer CRM → Check Session → Update/Append CRM → ¿Es Lead? → Telegram
```

| Nodo | Descripción |
|------|-------------|
| Webhook | Recibe mensajes del widget (POST) |
| Leer KB | Lee la base de conocimiento del negocio desde Google Sheets |
| Prepare DeepSeek | Extrae nombre/contacto, construye system prompt con KB |
| DeepSeek Model + AI Agent | Genera respuesta con IA (DeepSeek nativo vía LangChain) |
| Format Response | Extrae respuesta, ||DATOS:, ||RESUMEN:, clasifica lead |
| Respond Now | Responde al widget inmediatamente (~4-5s) |
| Map CRM Fields | Pasa datos al pipeline de CRM |
| Leer CRM Session | Lee filas existentes del CRM |
| Check Session Exists | Busca si la sesión ya tiene fila en el CRM |
| Update / Append CRM | Actualiza sesión existente o crea nueva fila |
| ¿Es Lead? | Si tiene datos de contacto → notifica por Telegram |
| Telegram Notify | Envía notificación al dueño cuando se capta un lead |

## Stack técnico

| Componente | Tecnología |
|---|---|
| Widget frontend | Vanilla JS + CSS (sin frameworks) |
| Backend | n8n workflow (webhook) |
| Modelo IA | DeepSeek V4 (OpenAI-compatible) |
| CRM | Google Sheets API |
| Notificaciones | Telegram Bot API |

## Producción

- **n8n:** instancia cloud en `auxo.app.n8n.cloud`
- **Webhook:** `POST https://auxo.app.n8n.cloud/webhook/av-chatbot`
- **Widget:** `https://ivzc07.github.io/av-chatbot/widget/av-chatbot.js`
- **Demo:** `https://ivzc07.github.io/av-chatbot/demo/`
- **Sheets:** `14jda--cH6USqr0vm2vExmZe6VNQ4dmP5N9OxrFox3JM`
- **Telegram:** bot `@n8n_izvc9999_bot`

## Créditos

Chatbot Web · Abril 2026
