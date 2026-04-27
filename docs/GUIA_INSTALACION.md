# Guía de Instalación — AuxoVelari Chatbot

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
- [ ] **Servidor web** — Para alojar el archivo `av-chatbot.js` (puede ser Hetzner CX33 con Docker, o cualquier hosting estático)

---

## 2. Configurar n8n

### 2.1 Importar el workflow

1. Abre tu instancia de n8n
2. Ve a **Workflows → Import from File**
3. Selecciona `workflow/av-chatbot-workflow.json`
4. El workflow se importará con el nombre "AuxoVelari - Chatbot Backend"

### 2.2 Configurar credenciales en el workflow

El workflow importado tiene 3 nodos HTTP Request que necesitan configuración:

#### Nodo "DeepSeek V3.2"
- Ya está preconfigurado con el endpoint de DeepSeek
- Cambia el API Key en los headers si usas otro proveedor

#### Nodo "Telegram Notificación"
- Cambia `chat_id` por el ID de Telegram del dueño del negocio
- Cambia el token del bot en la URL

#### Nodo "Google Sheets" (por añadir)
- Añádelo después de "Procesar Respuesta"
- Conéctalo con una Google Service Account

### 2.3 Activar el workflow

1. Haz clic en **Activo** (toggle arriba a la derecha)
2. Copia la URL del webhook (se muestra en el nodo "Webhook Chat")
3. Esta URL será el `data-api` del widget

---

## 3. Configurar DeepSeek

1. Ve a [platform.deepseek.com](https://platform.deepseek.com)
2. Crea una cuenta o inicia sesión
3. Ve a **API Keys** → **Create new key**
4. Copia la API key
5. Pégala en el nodo "DeepSeek V3.2" del workflow (header `Authorization: Bearer TU_API_KEY`)
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

### 4.2 Crear la hoja de CRM

1. Crea una nueva Google Sheet en Google Drive
2. Ponle nombre: `AV-CRM-[NOMBRE_CLIENTE]`
3. Añade estas columnas en la fila 1:

| Fecha/Hora | Visitante | Contacto | Resumen | Estado | Temas | Confianza | Session ID |
|---|---|---|---|---|---|---|---|
| (vacío) | (vacío) | (vacío) | (vacío) | (vacío) | (vacío) | (vacío) | (vacío) |

4. Comparte la hoja con el email de la service account (Editor)
5. Copia el ID de la hoja (está en la URL: `https://docs.google.com/spreadsheets/d/EL_ID/edit`)

### 4.3 Formatear la hoja (demo-ready)

1. Selecciona la columna **Estado (E)**
2. Ve a **Formato → Formato condicional**
3. Añade reglas:
   - Si el texto contiene "Lead caliente" → fondo verde claro
   - Si el texto contiene "Consulta" → fondo amarillo claro
   - Si el texto contiene "Rebote" → fondo gris claro
4. Añade un panel resumen en las filas superiores:
   - Fila 1: "📊 RESUMEN CRM — [NOMBRE_NEGOCIO]" (merge A1:H1, fondo oscuro)
   - Fila 2: "Total visitantes:" / `=COUNTA(A4:A)` / "Leads captados:" / `=COUNTIF(E4:E;"Lead caliente")` / "Tasa conversión:" / `=IF(B2>0; E2/B2; 0)` con formato %
   - Fila 3: Headers (fondo oscuro, texto blanco)
5. Fija las 3 primeras filas: **Ver → Fijar → 3 filas**

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

### 5.3 Actualizar el workflow

1. En el nodo "Telegram Notificación", cambia la URL:
   ```
   https://api.telegram.org/botTOKEN_DEL_BOT/sendMessage
   ```
2. En el body JSON, cambia `chat_id` por el ID del dueño

---

## 6. Instalar el widget en la web

### 6.1 Subir el archivo JS

Sube `widget/av-chatbot.js` a tu servidor. Opciones:

- **Hetzner CX33 (Docker):** Copia a `/var/www/html/widget/av-chatbot.js` en el contenedor nginx
- **GitHub Pages:** Sube a un repo y usa la URL raw
- **CDN:** Cualquier hosting de archivos estáticos

### 6.2 Añadir la línea de instalación

En el `<head>` o justo antes de `</body>` de la web del cliente, añade:

```html
<script src="https://TU_SERVIDOR/widget/av-chatbot.js"
        data-business="NOMBRE_DEL_NEGOCIO"
        data-name="NOMBRE_DEL_NEGOCIO"
        data-welcome="¡Hola! Soy el asistente virtual de NOMBRE_DEL_NEGOCIO. ¿En qué puedo ayudarte?"
        data-color="#COLOR_PRINCIPAL"
        data-tone="informal"
        data-api="https://TU_N8N/webhook/av-chatbot">
</script>
```

### Parámetros configurables

| Parámetro | Descripción | Ejemplo |
|---|---|---|
| `data-business` | Nombre del negocio (aparece en cabecera del chat) | `Mi Negocio 🏖️` |
| `data-name` | Alias de data-business (compatible con PRD) | `Mi Negocio` |
| `data-welcome` | Mensaje de bienvenida al abrir el chat | `¡Hola! ¿En qué puedo ayudarte?` |
| `data-color` | Color principal del widget (hex) | `#2E86AB` |
| `data-tone` | Tono del chatbot: `formal` o `informal` | `informal` |
| `data-api` | URL del webhook de n8n | `https://n8n.ejemplo.com/webhook/av-chatbot` |

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
- Revisa la URL del webhook en `data-api`
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

AuxoVelari · Abril 2026
