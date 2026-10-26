---
title_es: Cómo monté mi primer contenedor con Docker
title_en: How I set up my first Docker container
date: 2026-10-20
tags: docker, linux
---

Una de las cosas que más me costó entender al empezar con **Docker** fue la diferencia entre una imagen y un contenedor. Aquí dejo mi resumen tras la primera semana dándole vueltas.

## Imagen vs contenedor

- La **imagen** es la plantilla: sistema base, dependencias, tu app. No cambia.
- El **contenedor** es la instancia en ejecución: se crea, se para, se borra sin tocar la imagen.

```bash
docker run --rm -it debian:bookworm bash
```

Con `--rm` el contenedor se elimina al salir — perfecto para experimentar sin dejar basura.

## Mi flujo habitual

1. Escribo un `Dockerfile` mínimo
2. `docker build -t miapp .`
3. `docker run -p 8080:80 miapp`

## Lo que aún me falta

- Componer varios servicios con `docker compose`
- Volumes para persistir datos
- Buenas prácticas de seguridad (usuario no-root, imágenes multi-stage)

Sigo aprendiendo. Si algo está mal, ¡corregidme!
