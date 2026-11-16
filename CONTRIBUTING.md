# Contribuir

Gracias por revisar Deskroom. El proyecto es un sitio estático (HTML, CSS y JavaScript sin build) publicado en GitHub Pages.

## Flujo de trabajo

1. Crea una rama desde `main`:
   - `feat/nombre-corto` para funcionalidad
   - `fix/nombre-corto` para errores
   - `style/nombre-corto` para diseño
   - `docs/nombre-corto` para documentación
2. Haz commits pequeños y descriptivos.
3. Abre un Pull Request contra `main` usando la plantilla.
4. No mergees sin haber probado el sitio en local.

## Probar en local

```powershell
python -m http.server 8080
```

Abre http://localhost:8080. Comprueba escritorio y móvil, ES/EN, tema claro/oscuro, fondos y el panel de notas.

Comprobación rápida de sintaxis:

```powershell
Get-ChildItem js\*.js | ForEach-Object { node --check $_.FullName }
```

## Estructura

- `index.html`: estructura, plantillas de paneles y HUD.
- `css/style.css`: escritorio, HUD y fondos.
- `css/windows.css`: paneles modales.
- `css/apps.css`: contenido de las apps.
- `js/main.js`: arranque, reloj, HUD y notas públicas.
- `js/apps.js`: proyectos, skills, contacto y ajustes.
- `js/wm.js`: gestor de paneles.
- `js/i18n.js`: textos ES/EN.
- `js/data.js`: perfil y skills.
- `projects.json`: proyectos sincronizados desde GitHub.

## Seguridad

- No incluyas tokens, contraseñas ni datos privados.
- El historial de notas vive en un repositorio privado aparte; en este repo solo se publica el último registro en `notas.json`.
