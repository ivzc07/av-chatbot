# Guía de Instalación — Chatbot Web con IA

Esta guía explica cómo instalar el chatbot para un nuevo cliente desde cero. Tiempo objetivo: menos de 3 horas.

---

## Índice

1. [Requisitos previos](#1-requisitos-previos)
2. [Configurar n8n](#2-configurar-n8n)
3. [Configurar DeepSeek](#3-configurar-deepseek)
4. [Configurar Google Sheets](#4-configurar-google-sheets)
5. [Configurar Telegram](#5-configurar-telegram)
6. [Instalar el widget en la web](#6-instalar-el-widget-en-la-web)
7. [Verificar el sistema](#7-verificar-el-sistema)

---

## 1. Requisitos previos

Antes de empezar, necesitas tener acceso a:

- [ ] **n8n** — Instancia funcionando (cloud o self-hosted)
- [ ] **DeepSeek API key** — Regístrate en [platform.deepseek.com](https://platform.deepseek.com)
- [ ] **Google Cloud Console** — Con Google Sheets API habilitada
- [ ] **Telegram Bot Token** — Crear bot con [@BotFather](https://t.me/BotFather)
- [ ] **Servidor web** — Para alojar el archivo `av-chatbot.js` (VPS, hosting estático, o cualquier servidor con HTTPS)

---

## 2. Configurar n8n

### 2.1 Importar el workflow

1. Abre tu instancia de n8n
2. Ve a **Workflows → Import from File**
3. Selecciona `workflow/av-chatbot-workflow.json`
4. El workflow se importará con el nombre "Chatbot MVP"

### 2.2 Configurar credenciales en el workflow

El workflow usa credenciales gestionadas por n8n (no necesitas editar nodos manualmente).

1. Ve a **Settings → Credentials** en n8n
2. Añade estas credenciales:

#### Credencial: DeepSeek API
- Tipo: `DeepSeek API`
- Pega tu API key de DeepSeek (la obtendrás en el paso 3)

#### Credencial: Google Sheets OAuth2
- Tipo: `Google Sheets OAuth2`
- Conéctala con la cuenta de Google que tiene acceso al Drive

3. En el workflow, cada nodo ya apunta a la credencial correcta:
   - `DeepSeek Model` → credencial `DeepSeek API`
   - `Leer KB`, `Append CRM Row`, `Update CRM Row` → credencial `Google Sheets OAuth2`

### 2.3 Activar el workflow

1. Haz clic en **Activo** (toggle arriba a la derecha)
2. Copia la URL del webhook (se muestra en el nodo "Webhook Chat")
3. Esta URL será el `data-endpoint` del widget

---

## 3. Configurar DeepSeek

1. Ve a [platform.deepseek.com](https://platform.deepseek.com)
2. Crea una cuenta o inicia sesión
3. Ve a **API Keys** → **Create new key**
4. Copia la API key
5. En n8n, ve a **Settings → Credentials → DeepSeek API** y pega la key
6. Recarga saldo si es necesario (mínimo recomendado: $5 para desarrollo)

---

## 4. Configurar Google Sheets

### 4.1 Crear Service Account

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un proyecto (o usa uno existente)
3. Ve a **APIs & Services → Library**
4. Busca "Google Sheets API" y habilítala
5. Ve a **APIs & Services → Credentials**
6. Haz clic en **Create Credentials → Service Account**
7. Ponle nombre (ej: "av-chatbot-crm")
8. Asigna el rol **Editor**
9. Haz clic en la service account creada → **Keys → Add Key → JSON**
10. Descarga el archivo JSON

### 4.2 Crear y formatear la hoja de CRM

1. Crea una Google Sheet vacía en Google Drive
2. Ponle nombre: `AV-CRM-[NOMBRE_CLIENTE]`
3. Compártela con el email de tu service account como **Editor**
4. Copia el ID de la hoja (está en la URL: `https://docs.google.com/spreadsheets/d/EL_ID/edit`)
5. Ejecuta el script de formateo:
   ```bash
   python3 scripts/create-client-sheet.py EL_ID "Nombre del Negocio"
   ```
6. El script configura automáticamente: panel resumen, headers, colores condicionales, pestaña Conocimiento

### 4.3 Formatear la hoja (demo-ready)

El script ya lo hace automáticamente. Si necesitas verificarlo manualmente:

1. Columna **Estado del Lead (E)** tiene formato condicional: verde (Lead caliente), amarillo (Consulta), gris (Rebote)
2. Panel resumen en filas 1-2: total visitantes, leads captados, tasa de conversión (fórmulas)
3. Fila de encabezado fijada (fila 3)
4. Ordenado por fecha descendente

---

## 5. Configurar Telegram

### 5.1 Crear el bot

1. Abre Telegram y busca [@BotFather](https://t.me/BotFather)
2. Envía el comando `/newbot`
3. Ponle nombre: `[NOMBRE_CLIENTE] Notifier`
4. Ponle username: `@[nombre]_bot`
5. BotFather te dará un **token** (guárdalo)

### 5.2 Obtener el Chat ID del dueño

1. El dueño del negocio debe buscar [@userinfobot](https://t.me/userinfobot) en Telegram
2. Enviar cualquier mensaje al bot
3. El bot responde con el Chat ID numérico
4. Guarda ese número

### 5.3 Configurar en Google Sheets

El workflow lee el token y el Chat ID desde la pestaña "Conocimiento" de Google Sheets.

1. Abre la hoja de Google Sheets del cliente
2. Ve a la pestaña **Conocimiento**
3. Añade estas filas:
   - `Telegram Token` | `TU_TOKEN_DEL_BOT`
   - `Telegram Chat ID` | `ID_NUMERICO_DEL_DUENO`

---

## 6. Instalar el widget en la web

### 6.1 Subir el archivo JS

Sube `widget/av-chatbot.js` a tu servidor. Opciones:

- **GitHub Pages:** Actívalo en Settings → Pages, el archivo se sirve desde `TU_USUARIO.github.io/av-chatbot/widget/av-chatbot.js`
- **VPS con nginx/Apache:** Copia a `/var/www/html/widget/av-chatbot.js`
- **CDN / Hosting:** Cualquier hosting de archivos estáticos con HTTPS

### 6.2 Añadir la línea de instalación

En el `<head>` o justo antes de `</body>` de la web del cliente, añade:

```html
<script src="https://TU_SERVIDOR/widget/av-chatbot.js"
        data-business="NOMBRE_DEL_NEGOCIO"
        data-welcome="¡Hola! Soy el asistente virtual de NOMBRE_DEL_NEGOCIO. ¿En qué puedo ayudarte?"
        data-color="#COLOR_PRINCIPAL"
        data-tone="informal"
        data-endpoint="https://TU_N8N/webhook/av-chatbot">
</script>
```

### Parámetros configurables

| Parámetro | Descripción | Ejemplo |
|---|---|---|
| `data-business` | Nombre del negocio (aparece en cabecera) | `Mi Negocio 🏖️` |
| `data-welcome` | Mensaje de bienvenida al abrir el chat | `¡Hola! ¿En qué puedo ayudarte?` |
| `data-color` | Color principal del widget (hex) | `#2E86AB` |
| `data-tone` | Tono de la conversación: `informal` (tú, emojis) o `formal` (usted, profesional) | `informal` |
| `data-endpoint` | URL del webhook de n8n | `https://n8n.ejemplo.com/webhook/av-chatbot` |

---

## 7. Verificar el sistema

Después de instalar, verifica cada paso:

1. [ ] Abre la web del cliente → el botón flotante del chat aparece en la esquina inferior derecha
2. [ ] Haz clic en el botón → se abre el panel con el mensaje de bienvenida
3. [ ] Escribe una pregunta sobre el negocio (ej: "¿qué precio tiene la caldereta?") → el chatbot responde con información relevante
4. [ ] Pregunta por disponibilidad o reservas → el chatbot ofrece comprobar disponibilidad (detección de lead)
5. [ ] Revisa Google Sheets → la conversación aparece registrada
6. [ ] Si se captó un lead → llega notificación a Telegram

---

## Resolución de problemas

### El widget no aparece
- Verifica que `av-chatbot.js` es accesible desde la URL del `<script>`
- Revisa la consola del navegador (F12) para errores
- Asegúrate de que no hay conflictos con otros scripts

### El chatbot no responde
- Verifica que el workflow de n8n está **activo**
- Revisa la URL del webhook en `data-endpoint`
- Comprueba que la API key de DeepSeek es válida y tiene saldo

### No llegan notificaciones de Telegram
- Verifica que el token del bot es correcto
- Asegúrate de que alguien ha enviado al menos un mensaje al bot
- Revisa los logs de ejecución en n8n

### Google Sheets no se actualiza
- Verifica que la service account tiene acceso de editor a la hoja
- Comprueba que el ID de la hoja es correcto
- La API de Google Sheets está habilitada en el proyecto

---

Chatbot Web · Abril 2026
