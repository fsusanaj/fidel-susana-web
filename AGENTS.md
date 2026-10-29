# AGENTS.md — Memoria del proyecto

## Contexto

Landing page de promoción para **Fidel Susana**: soluciones tecnológicas para
empresas (desarrollo web, apps móviles, sistemas CRM, automatización,
integraciones y producto/UX).

- Sitio estático, sin build ni dependencias npm.
- HTML, CSS y JavaScript vanilla.
- Contenido en español.
- Estética moderna y minimalista: fondo papel cálido, negro tinta, acento
  violeta/azul (`#3b2eff`) y acento lima (`#d8ff5f`) en secciones oscuras.
- Tipografías de Google Fonts: Sora (display), Inter (texto) e Instrument
  Serif italic (palabras destacadas).

## Estructura

```
index.html            Página completa (una sola página con anclas)
css/styles.css        Estilos, animaciones, responsive y reduced motion
js/main.js            Interacciones (menú, reveals, contadores, FAQ, formulario)
img/logo-fidel-susana.png          Logo original proporcionado por el cliente
img/logo-fidel-susana-mark.png     Logo recortado, fondo transparente, trazos negros
img/logo-fidel-susana-white.png    Igual al anterior, trazos blancos para fondos oscuros
```

## Secciones de la página

1. Header fijo con logo, navegación y CTA "Hablemos".
2. Hero con badge de disponibilidad, titular animado, CTAs, puntos de valor y
   mockup visual: dashboard CRM + teléfono con app + chips flotantes.
3. Cinta marquesina con servicios.
4. Servicios: 6 tarjetas (web, apps, CRM, automatización, integraciones, UX/UI).
5. Resultados: bloque oscuro con beneficios y 4 contadores animados.
6. Proceso: 4 etapas (descubrimiento, estrategia, desarrollo, lanzamiento).
7. Tecnologías: grid de 12 herramientas.
8. Cita de marca.
9. FAQ con acordeón (5 preguntas).
10. Contacto: datos + formulario con validación.
11. Footer con navegación, disponibilidad, copyright dinámico y marca de agua.

## Interacciones implementadas (js/main.js)

- Barra de progreso de scroll y header con fondo glass al hacer scroll.
- Menú móvil full-screen, cierre con Escape, al hacer clic en un enlace o al
  ampliar la ventana; bloqueo del scroll del body.
- Reveals con IntersectionObserver y delays escalonados (`--d`).
- Contadores animados al entrar en pantalla (`data-target`).
- Spotlight radial en tarjetas de servicio siguiendo el cursor.
- Parallax/tilt sutil del dashboard y del teléfono con el puntero.
- Acordeón FAQ accesible (`aria-expanded`, `aria-controls`).
- Scroll spy para marcar el enlace activo del menú.
- Formulario: valida nombre, email y mensaje; muestra errores accesibles
  (`aria-invalid`, `aria-describedby`); construye un `mailto:` con asunto y
  cuerpo y avisa que se abrirá el cliente de correo. No hay backend.
- Año del footer actualizado automáticamente.
- Respeta `prefers-reduced-motion`.

## Decisiones y detalles a recordar

- Las imágenes `logo-fidel-susana-mark.png` y `logo-fidel-susana-white.png` se
  generaron recortando el logo original y convirtiendo el blanco en
  transparencia. No hace falta regenerarlas salvo que cambie el logo original.
- El logo se usa completo (marco + nombre) como marca junto al wordmark "Fidel
  Susana" en el header y footer.
- El correo de contacto es un placeholder editable:
  `hola@fidelsusana.com` (aparece en contacto, footer y en el `mailto` del JS).
- Las métricas (40+, 98%, 3x, 24/7) y el texto de la cita son contenido de
  ejemplo; deben ajustarse a datos reales del negocio.
- Los testimonios no son de clientes reales; la cita es de marca.
- Breakpoints principales: 1080px, 900px (menú móvil), 640px y 380px.
- No añadir frameworks ni pasos de build sin motivo; el valor del proyecto es
  su simplicidad.

## Cómo previsualizar

```bash
cd /home/adeodato/Documentos/fidel-susana-web
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Verificaciones realizadas

- Capturas headless en 320, 390, 820 y 1440 px.
- Sin overflow horizontal en 320–1440 px.
- Menú móvil, FAQ y validación del formulario probados vía Chrome DevTools
  Protocol.
- `node --check js/main.js` sin errores; llaves CSS balanceadas y HTML sin
  etiquetas mal cerradas.

## Convenciones para futuras ediciones

- Mantener el contenido en español y el tono directo, profesional y cercano.
- Conservar la paleta, tipografías y el estilo minimalista.
- No agregar comentarios innecesarios al código.
- Reutilizar las variables CSS de `:root` para colores, radios y transiciones.
- Cualquier cambio de sección debe mantener el responsive y el modo de
  movimiento reducido.
