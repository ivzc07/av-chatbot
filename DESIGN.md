---
name: AuxoVelari Widget
description: White-label chat widget que se integra en cualquier web de negocio con una línea de código
colors:
  default-ocean: "#2E86AB"
  default-deep: "#1a5c74"
  panel-white: "#ffffff"
  message-sand: "#f7f8fa"
  border-stone: "#e8e8e8"
  text-body: "#333333"
  text-muted: "#bbbbbb"
  shadow-light: "rgba(0,0,0,0.12)"
  shadow-medium: "rgba(0,0,0,0.15)"
  shadow-strong: "rgba(0,0,0,0.2)"
typography:
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  header:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.3
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.02em"
rounded:
  sm: "4px"
  md: "14px"
  lg: "16px"
  pill: "24px"
  full: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.default-ocean}"
    textColor: "{colors.panel-white}"
    rounded: "{rounded.full}"
    size: "60px"
  button-primary-hover:
    backgroundColor: "{colors.default-deep}"
  card-panel:
    backgroundColor: "{colors.panel-white}"
    rounded: "{rounded.lg}"
  message-bot:
    backgroundColor: "{colors.panel-white}"
    rounded: "{rounded.md}"
  message-user:
    backgroundColor: "{colors.default-ocean}"
    rounded: "{rounded.md}"
---

# Design System: AuxoVelari Widget

## 1. Overview

**Creative North Star: "El Invitado Invisible"**

El widget AuxoVelari no tiene personalidad visual propia — la hereda. Como un camarero que viste de negro para no competir con el restaurante, el widget usa la system font del dispositivo, adopta el color que el cliente elige en `data-color`, y desaparece en la esquina hasta que el visitante lo necesita.

Este sistema describe el cascarón funcional: lo mínimo necesario para que el widget sea usable, accesible y profesional. Todo lo demás — color, nombre, mensaje, tono — lo define el cliente en los data-attributes. El diseño de AuxoVelari es el diseño de la ausencia de diseño.

La demo de Cala Blanca es una instancia de ejemplo, no el producto.

**Key Characteristics:**
- White-label: color, nombre, bienvenida definidos por `data-*` attributes
- Tipografía del sistema: sin fuentes propias, sin dependencias externas
- Adaptativo: mismo widget, infinitos negocios
- Funcional: cada elemento tiene un propósito, nada es decorativo
- Ligero: vanilla JS, cero dependencias, ~13KB

## 2. Colors

El widget no tiene paleta fija. El color primario lo define el cliente con `data-color`. El default (`#2E86AB`) solo aplica cuando el atributo está ausente. Los neutros son fijos y están teñidos mínimamente hacia el azul para evitar #000 y #fff puros.

### Primary (configurable)
- **Client Color** (custom via `data-color`): Botón flotante, cabecera, mensajes del usuario, indicador de foco. El cliente elige el color que representa su negocio. Default: `#2E86AB` (azul oceánico).
- **Deep Variant** (derivado automático del Client Color, ~20% más oscuro): Hover del botón y enlaces.

### Neutral (fixed)
- **Panel White** (#ffffff): Fondo del panel de chat y burbujas del bot. Solo en superficies flotantes — nunca en la página del cliente.
- **Message Sand** (#f7f8fa): Fondo del scroll de mensajes. Gris apenas azulado.
- **Border Stone** (#e8e8e8): Bordes sutiles de panel y mensajes.
- **Text Body** (#333333): Texto de mensajes. Legible sobre blanco y sand.
- **Text Muted** (#bbbbbb): Placeholder del input, botón de enviar deshabilitado.

### Shadows (fixed)
- **Light** (0 8px 32px rgba(0,0,0,0.12)): Sombra del panel de chat.
- **Medium** (0 4px 16px rgba(0,0,0,0.15)): Botón flotante en reposo.
- **Strong** (0 6px 20px rgba(0,0,0,0.2)): Botón flotante en hover.

### Named Rules
**The Client Color Rule.** El widget tiene exactamente un color de identidad, y lo elige el cliente. No hay paleta secundaria, no hay "modo oscuro del widget", no hay gradientes. Un color, bien usado.

**The No Pure Rule.** Nunca #000 ni #fff en el widget. Los neutros están teñidos hacia el azul (chroma 0.005–0.01 OKLCH). Esto aplica al widget, no a la página del cliente.

**The White-Only-In-Panel Rule.** El blanco puro (#ffffff) solo aparece dentro del panel de chat. El widget nunca modifica el fondo de la página del cliente.

## 3. Typography

**Font Stack:** `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif`

**Character:** Funcional, neutral, rápida. La system font es una decisión de diseño, no una omisión: el widget no debe imponer una tipografía sobre la web del cliente. En macOS se ve como SF Pro, en Windows como Segoe UI, en Android como Roboto. Cada visitante ve lo que espera ver.

### Hierarchy
- **Header** (600, 15px, 1.3): Nombre del negocio en la cabecera del chat.
- **Body** (400, 14px, 1.45): Mensajes del chat. Máximo ~55 caracteres por línea en el panel.
- **Label** (400, 11px, 0.02em): Subtítulo "Asistente Virtual", timestamp de mensajes.

### Named Rules
**The System Font Rule.** El widget usa exclusivamente la font stack del sistema operativo. No carga webfonts, no usa Google Fonts, no añade dependencias. Esto es intencional: el widget es un invitado, no un protagonista tipográfico.

**The Demo Exception Rule.** La página demo (`demo/index.html`) usa Georgia serif para evocar un restaurante con carácter. Es un ejemplo de cómo se ve el widget integrado en un sitio con personalidad. La demo es marketing; el widget es producto.

## 4. Elevation

El sistema es **plano por defecto, elevado en interacción.** No hay sombras en los mensajes, cards, o inputs. Las sombras solo existen para separar el widget del fondo de la página.

### Shadow Vocabulary
- **Panel** (Light): Separa el panel de chat del contenido de la página. Difusa, amplia, sin dureza.
- **Button rest** (Medium): El botón flotante se eleva sutilmente.
- **Button hover** (Strong): Más altura al interactuar — feedback táctil implícito.

### Named Rules
**The Flat-By-Default Rule.** Las superficies dentro del panel son planas. Las sombras solo aparecen en el botón flotante (siempre) y el panel (cuando está abierto). Si una sombra recuerda a 2014, es demasiado oscura y tiene muy poco blur.

**The Shadow-Is-Separation Rule.** Las sombras indican capas respecto a la página del cliente. Dentro del panel, la jerarquía se expresa con color y espaciado, no con elevación.

## 5. Components

### Chat Button (FAB)
- **Shape:** Círculo (60x60px, radius 50%)
- **Color:** `data-color` del cliente
- **Shadow:** Medium → Strong en hover
- **Icon:** SVG inline blanco (chat bubble / X close), 28x28px
- **Position:** Fixed, bottom: 20px, right: 20px, z-index: 999999
- **Transition:** `transform 0.2s, box-shadow 0.2s` — ease, sin bounce

### Chat Panel
- **Shape:** Rectángulo redondeado (380x520px, radius 16px)
- **Background:** Panel White
- **Border:** 1px Border Stone
- **Shadow:** Light
- **Position:** Absolute, bottom: 75px, right: 0 (relativo al botón)

### Chat Header
- **Background:** `data-color` del cliente
- **Text:** Header style, blanco sobre color
- **Avatar:** Círculo 36px, blanco al 20% de opacidad
- **Content:** Nombre del negocio + "Asistente Virtual" debajo

### Messages
- **Bot:** Alineado a la izquierda, fondo Panel White, borde Border Stone, radius 14px/14px/14px/4px
- **User:** Alineado a la derecha, fondo `data-color`, texto blanco, radius 14px uniforme
- **Animation:** `fadeIn 0.3s ease` — opacidad + translateY(8px→0)

### Input Area
- **Shape:** Pill (radius 24px)
- **Border:** 1px Border Stone → `data-color` en foco
- **Send Button:** Círculo 36px, `data-color`, blanco cuando habilitado, Text Muted cuando deshabilitado
- **Padding:** 16px alrededor del área de input

## 6. Do's and Don'ts

### Do:
- **Do** usar `data-color` como única fuente de verdad para el color del widget
- **Do** usar la system font stack en el widget — sin webfonts, sin dependencias
- **Do** mantener el FAB en bottom-right — consistencia entre todos los clientes
- **Do** mostrar el `data-welcome` inmediatamente al abrir — sin onboarding
- **Do** transiciones ≤0.3s, ease-out, sin bounce ni elastic
- **Do** identificar al bot como "asistente virtual" en la cabecera

### Don't:
- **Don't** usar `border-left` >1px como acento de color — anti-patrón side-stripe
- **Don't** usar `background-clip: text` con gradientes — decorativo, nunca funcional
- **Don't** usar glassmorphism, blur, o translucidez decorativa
- **Don't** anidar tarjetas — los mensajes no son cards
- **Don't** cargar webfonts ni Google Fonts en el widget
- **Don't** modificar CSS de la página del cliente fuera del `#av-chatbot-container`
- **Don't** usar negro puro (#000) ni blanco puro (#fff) en el widget
- **Don't** hacer que el bot imite a un humano — siempre "Asistente Virtual"
- **Don't** grids de icono + título + texto — no hay "features" que vender, hay conversaciones que tener
