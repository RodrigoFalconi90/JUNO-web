# J.U.N.O. — Sitio web

Sitio estático (HTML + CSS + JS, sin build) con una API opcional en Azure Functions para el formulario de demo.

```
index.html · privacidad.html · terminos.html · 404.html
css/styles.css · js/main.js · assets/
staticwebapp.config.json   → rutas, 404, caché y cabeceras de seguridad (CSP)
api/                       → función POST /api/demo (valida y reenvía el lead)
robots.txt · sitemap.xml
```

## Probar en local
- Solo el sitio: `npx serve .`
- Sitio + API: `npm run dev` (usa Azure Static Web Apps CLI; requiere Node 20 y Azure Functions Core Tools).

## Desplegar en Azure Static Web Apps (recomendado)
1. Sube esta carpeta a un repositorio de GitHub.
2. En el portal de Azure: **Crear recurso → Static Web App** → conecta el repo.
3. Build preset **Custom**: *App location* `/`, *API location* `api`, *Output location* vacío.
4. Azure crea el workflow de GitHub Actions; cada `push` a `main` despliega.
5. **Configuración → Variables de entorno**: agrega `DEMO_WEBHOOK_URL` (URL de un flujo de Power Automate, Logic App, Teams o Slack que reciba el JSON del lead).
6. **Dominios personalizados**: agrega tu dominio; el certificado HTTPS es automático.

Con CLI: `npx @azure/static-web-apps-cli deploy . --api-location api --deployment-token <TOKEN>`.

## Otros hosts
- **Azure Storage (sitio estático) / Netlify / GitHub Pages**: el sitio funciona igual, pero `/api/demo` no existe. Cambia la URL del `fetch` en `js/main.js` por tu endpoint (Formspree, Azure Function aparte, etc.) y adapta la cabecera `connect-src` de la CSP.
- Las reglas de `staticwebapp.config.json` solo aplican en Static Web Apps; en otros hosts configura 404 y cabeceras equivalentes.

## Antes de publicar
- Reemplaza `www.juno.network` en `index.html` (canonical, og:url), `sitemap.xml` y `robots.txt`.
- Añade una imagen social (`assets/og.png`, 1200×630) y la etiqueta `og:image`.
- Haz revisar `privacidad.html` y `terminos.html` con asesoría legal (son plantillas).
- Los correos "gratuitos" se rechazan en el navegador **y** en la API.
