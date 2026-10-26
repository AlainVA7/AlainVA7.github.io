# alainva7.github.io

Portfolio interactivo **AlainOS** — sistema operativo ficticio en el navegador con apps (Sobre mí, Proyectos, Skills, Terminal, Notas, Contacto, Ajustes).

🌐 **En vivo:** https://alainva7.github.io

## Cómo funciona

- **Proyectos** se actualizan solos: la Action `sync-projects.yml` consulta la API de GitHub cada día (y bajo demanda) y regenera `projects.json`.
- **Notas**: crea un `.md` en `content/posts/` con cabecera `title_es`, `title_en`, `date`, `tags`. La Action `sync-posts.yml` regenera `posts.json` al hacer push.
- **Idioma**: conmutador ES/EN en la barra superior y en Ajustes (guardado en el navegador).
- **Perfil y skills**: se editan en `js/data.js`.

## Estructura

```
index.html            · escritorio, barra, dock, templates
css/                  · style (shell) · windows (ventanas) · apps (contenido)
js/                   · i18n · data · wm · apps · terminal · blog · main
content/posts/        · notas del blog (markdown)
projects.json         · generado por Actions
posts.json            · generado por Actions
.github/workflows/    · sync-projects.yml · sync-posts.yml
```
