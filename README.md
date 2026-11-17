# 🎀 XV Valentina · Invitación web (demo)

Invitación digital para XV años con estilo **Dreamy Pastel**: sobre con moño que se abre, lluvia de pétalos, cuenta regresiva, calendario, lugares con fotos, itinerario, código de vestimenta, galería con visor y confirmación por WhatsApp.

Todo es estático (HTML + CSS + JS, sin librerías), listo para **GitHub Pages**.

## Estructura

```
index.html      → contenido de la invitación
css/styles.css  → estilos y colores (variables en :root)
js/main.js      → lógica; la configuración está en CONFIG al inicio
assets/img/     → fotos (reemplázalas por las reales con el mismo nombre)
```

## Personalizar

1. **Datos del evento:** edita `CONFIG` en `js/main.js` (fecha, número de WhatsApp, datos del calendario).
2. **Textos:** nombres, direcciones, itinerario y regalos están en `index.html`.
3. **Colores:** cambia las variables `--pink`, `--lilac`, `--mint`, `--sky`, etc. en `css/styles.css`.
4. **Fotos:** sustituye los `.jpg` de `assets/img/` conservando el nombre (`splash.jpg` = sobre, `corona.jpg` = portada).

## Links personalizados por invitado

Agrega parámetros a la URL para saludar al invitado y limitar sus pases:

```
https://TU-USUARIO.github.io/xv-divertidos/?invitado=Familia%20Pérez&pases=3
```

## Publicar en GitHub Pages

```bash
git init
git add .
git commit -m "Invitación XV"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/xv-divertidos.git
git push -u origin main
```

Luego en GitHub: **Settings → Pages → Branch: `main` / root → Save**.

> Todos los nombres, direcciones y teléfonos son ficticios. Las fotos de demo son de [Unsplash](https://unsplash.com) (licencia libre).
