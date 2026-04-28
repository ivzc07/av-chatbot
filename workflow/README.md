# Chatbot MVP - n8n Workflow

Workflow de n8n que implementa el chatbot con IA. Procesa mensajes vía webhook, genera respuestas con DeepSeek, y gestiona leads en Google Sheets.

## Arquitectura

```
Widget (av-chatbot.js)
  → Webhook POST (n8n)
    → Leer KB (Google Sheets - pestaña "Conocimiento")
    → Prepare DeepSeek (Code - extrae nombre/contacto, construye prompt)
    → DeepSeek Model (LangChain) + AI Agent
    → Format Response (Code - extrae respuesta, ||RESUMEN:, ||DATOS:)
    ├→ Respond Now (respuesta inmediata al widget, ~4-5s)
    └→ Map CRM Fields → Leer CRM Session → Check Session Exists
         └→ ¿Existe Sesión?
              ├→ Si: Update CRM Row → ¿Es Lead? → Telegram Notify
              └→ No: Append CRM Row → ¿Es Lead? → Telegram Notify
```

## Nodos (15)

| # | Nodo | Tipo | Función |
|---|------|------|---------|
| 1 | Webhook | webhook | Recibe POST del widget |
| 2 | Leer KB | googleSheets | Lee conocimiento del negocio |
| 3 | Prepare DeepSeek | code | Extrae datos visitante, construye system prompt |
| 4 | DeepSeek Model | lmChatDeepSeek | Modelo LLM (deepseek-chat) |
| 5 | AI Agent | agent | Orquesta el LLM con maxIterations=1 |
| 6 | Format Response | code | Procesa respuesta: extrae texto, resumen IA, datos contacto |
| 7 | Respond Now | respondToWebhook | Responde al widget en ~4-5s |
| 8 | Map CRM Fields | set | Pasa datos al pipeline CRM |
| 9 | Leer CRM Session | googleSheets | Lee filas existentes del CRM |
| 10 | Check Session Exists | code | Busca sessionId en CRM |
| 11 | ¿Existe Sesión? | if | Rutea a update o append |
| 12 | Update CRM Row | googleSheets | appendOrUpdate por Session ID |
| 13 | Append CRM Row | googleSheets | Append nueva fila |
| 14 | ¿Es Lead? | if | Si tiene contacto → Telegram |
| 15 | Telegram Notify | httpRequest | Notifica lead captado |

## Flujo de datos

### Entrada (Webhook POST)
```json
{
  "message": "Hola, quiero reservar",
  "sessionId": "av_1234567890_abc",
  "history": [{"role": "user", "content": "..."}, ...],
  "businessName": "Cala Blanca",
  "tone": "informal"
}
```

### Formato de respuesta del LLM
```
¡Gracias María! Te contactaremos pronto.
||RESUMEN: María quiere reservar y dio sus datos.
||DATOS: nombre=María telefono=698765432
```

El sistema extrae `||RESUMEN:` y `||DATOS:` y los oculta al usuario.

### Columnas del CRM (Google Sheets)

| Col | Header | Descripción |
|-----|--------|-------------|
| A | Fecha y Hora | Timestamp ISO |
| B | Nombre Visitante | Extraído del mensaje |
| C | Contacto Visitante | Teléfono o email |
| D | Resumen Conversación | Generado por IA |
| E | Estado del Lead | Rebote / Consulta / Lead caliente |
| F | Temas Preguntados | Precios, Reservas, Carta... |
| G | Confianza Chatbot | Alta / Media / Baja |
| H | Session ID | ID único de sesión |

## ⚠️ Requisitos críticos

### Google Sheets
- **headerRow: 3** — La pestaña CRM tiene filas 1-2 de resumen. Los headers reales están en fila 3.
- El nodo `Update CRM Row` DEBE tener `options.locationDefine.values.headerRow: 3` o falla silenciosamente.
- El nodo `Append CRM Row` también requiere `headerRow: 3`.

### Credenciales necesarias
1. **Google Sheets OAuth2** — Para leer/escribir en la sheet del CRM
2. **DeepSeek API** — API key de DeepSeek para el modelo LLM

### Configuración del widget
- `GH_TOKEN` en `/opt/data/home/.hermes/.env` para despliegue
- Webhook URL: `https://auxo.app.n8n.cloud/webhook/av-chatbot`

## Instalación

1. Importar `av-chatbot-workflow.json` en n8n
2. Configurar credenciales (Google Sheets + DeepSeek)
3. Reemplazar `YOUR_SHEET_ID` con el ID real de la Google Sheet
4. Activar el workflow

## Changelog

### 2026-04-27 — Fix: CRM Update silencioso
- **Bug**: `Update CRM Row` no actualizaba filas porque `columnToMatchOn: "Session ID"` buscaba en fila 1 (headers de resumen) en vez de fila 3 (headers reales).
- **Fix**: Añadido `options.locationDefine.values.headerRow: 3` y `firstDataRow: 4`.
- Ambos problemas (datos no guardados + resumen congelado) eran el mismo root cause.
