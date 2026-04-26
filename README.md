# AuxoVelari Chatbot — MVP

Widget de chat con IA para webs de negocio. Entiende lenguaje natural, responde usando la base de conocimiento del negocio, capta leads y registra todo en Google Sheets.

## Demo

Abre `demo/index.html` en tu navegador para ver el widget funcionando con el restaurante de prueba "Cala Blanca" (Menorca).

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
<script src="https://TU_SERVIDOR/widget/av-chatbot.js"
        data-business="Mi Negocio"
        data-welcome="¡Hola! ¿En qué puedo ayudarte?"
        data-color="#2E86AB"
        data-endpoint="https://TU-N8N/webhook/av-chatbot">
</script>
```

2. Importa `workflow/av-chatbot-workflow.json` en n8n
3. Configura las credenciales (DeepSeek, Google Sheets, Telegram)
4. Activa el workflow

## Stack técnico

| Componente | Tecnología |
|---|---|
| Widget frontend | Vanilla JS + CSS (sin frameworks) |
| Backend | n8n workflow (webhook) |
| Modelo IA | DeepSeek V3.2 (OpenAI-compatible) |
| CRM | Google Sheets API |
| Notificaciones | Telegram Bot API |

## Créditos

AuxoVelari · Abril 2026
