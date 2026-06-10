PLAYLIST DEL HUEVÓMETRO
=======================

El reproductor flotante (solo en desktop, esquina inferior izquierda) carga
los archivos de esta carpeta. Soltá tus MP3 con estos nombres exactos:

  /public/music/track-1.mp3   →  "Cumbia Mundialista"
  /public/music/track-2.mp3   →  "La Tri en el Aire"
  /public/music/track-3.mp3   →  "Goles y Plumas"

Si querés cambiar los títulos o agregar más tracks, editá el array TRACKS
en:  components/dashboard/MusicPlayer.tsx

Formatos soportados: mp3, ogg, m4a, wav (cualquiera que reproduzca el browser).
Recomendado: MP3 a 128–192 kbps para no inflar el bundle estático.

Cuando un archivo no existe, el reproductor muestra "archivo no encontrado"
y salta al siguiente al darle play.
