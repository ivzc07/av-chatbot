# Product

## Register

product

## Users

**Clientes directos:** Dueños de negocios pequeños y medianos en España (restaurantes, hoteles, clínicas, tiendas) que quieren atención al cliente 24/7 sin contratar personal. No son técnicos. Instalan el widget copiando 1 línea de HTML. Reciben leads por Telegram y revisan conversaciones en Google Sheets.

**Usuarios finales:** Visitantes del sitio web del cliente. Buscan información sobre menús, horarios, precios, disponibilidad. Están en contexto de decisión de compra o consulta pre-venta.

**Instaladores:** Técnicos de AuxoVelari que despliegan el sistema para nuevos clientes. Siguen un checklist y completan la instalación en <3 horas.

## Product Purpose

AuxoVelari es un widget de chat con IA que convierte sitios web estáticos en negocios que conversan. Es white-label y multi-cliente: cada negocio configura su nombre, mensaje de bienvenida, color y endpoint. El chatbot usa IA (DeepSeek) con la información del negocio, detecta intención de compra, registra conversaciones en Google Sheets, y notifica leads al dueño por Telegram.

Éxito = un dueño de negocio recibe una notificación de lead sin haber hecho nada más que pegar un `<script>`.

## Brand Personality

**Invisible pero presente.** AuxoVelari no compite con la marca del cliente — la amplifica. Como un buen anfitrión: profesional, cálido, discreto. El widget se adapta al tono visual del sitio donde vive. La marca AuxoVelari solo aparece en el sutil "Powered by" y en la documentación técnica.

Tono de la documentación y demo: español natural, profesional pero cercano. Sin jerga corporativa. Sin hype de startup.

## Anti-references

- **NO** chatbots genéricos que parecen clones de Intercom o Tidio
- **NO** interfaces "enterprise" frías (Salesforce, Zendesk)
- **NO** widgets que imponen su diseño sobre la web del cliente
- **NO** tipografía Inter como default — es la system font del SO, no una elección de diseño
- **NO** gradientes morados/rosas — cliché visual de "IA"
- **NO** glassmorphism, blur effects decorativos, side-stripe borders
- **NO** cards anidadas ni grid de iconos repetidos — patrón SaaS template

## Design Principles

1. **El widget es un invitado** — Se adapta al sitio del cliente, no al revés. Hereda el `data-color`, usa la font del sistema. Es invisible hasta que se necesita.

2. **Una línea lo cambia todo** — La simplicidad de instalación (`<script>`) debe reflejarse en la simplicidad visual. Cada elemento gana su lugar.

3. **White-label por diseño** — El widget no tiene personalidad visual propia más allá de lo funcional. Los colores, el nombre, el mensaje de bienvenida — todo lo define el cliente.

4. **Profesional sin ser frío** — Las formas son suaves (radios generosos), las sombras difusas, las transiciones rápidas. Útil, no decorativo.

5. **Transparencia desde el primer mensaje** — El bot se identifica como asistente virtual. Sin fingir ser humano. La confianza se construye con honestidad.

## Accessibility & Inclusion

- WCAG 2.1 AA mínimo en el widget
- Contraste suficiente en todos los estados (botón, mensajes, foco)
- Soporte para `prefers-reduced-motion`
- Touch targets ≥ 44px en móvil
- Textos en español claro
- El widget funciona en cualquier sitio web — no asume frameworks ni stacks específicos
