# Deskroom

Portfolio personal de **Alain** ([@AlainVA7](https://github.com/AlainVA7)) — paneles modales en el navegador con proyectos, skills, CV y contacto.

🌐 **En vivo:** https://alainva7.github.io

## Notas técnicas

La última nota se muestra en el HUD. El contenido completo vive en un repositorio privado:

- `AlainVA7/deskroom-content` (privado): issues con la etiqueta `nota`.
- `AlainVA7/AlainVA7.github.io` (público): `notas.json` con **solo la última nota**.

Un workflow del repo privado publica la última nota en `notas.json` cada vez que se crea, edita, cierra o reabre un issue con la etiqueta `nota`.

### Escribir una nota

1. Entra en la web con `?owner=1` o `#owner` para activar el modo propietario en ese navegador (`?owner=0` lo desactiva).
2. Pulsa **Nueva nota**, rellena título y texto, y abre el issue prefijado en GitHub.
3. Al crear el issue, el workflow actualiza `notas.json` y la web muestra la nota.

El modo propietario es solo cosmético: no guarda tokens ni permite escribir sin iniciar sesión en GitHub.

### Configurar la publicación

El workflow necesita un token con permiso de escritura sobre el repo público:

1. Crea un fine-grained PAT con acceso a `AlainVA7/AlainVA7.github.io` y permiso **Contents: Read and write**.
2. Guárdalo como secreto `PUBLIC_REPO_TOKEN` en `AlainVA7/deskroom-content` → Settings → Secrets and variables → Actions.
3. Ejecuta el workflow **Publicar última nota** una vez o crea un issue de prueba con la etiqueta `nota`.
