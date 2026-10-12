# LapSimCam — visor y grabador de cámara endoscópica (MedicalBit)

Aplicación de escritorio para el **entrenamiento quirúrgico simulado**: muestra la imagen de la
cámara endoscópica, la graba y permite medir el tiempo de la práctica. Forma parte de las
herramientas de **MedicalBit** (simulador laparoscópico).

## Funcionalidad

- **Selector de cámara**: lista los dispositivos de video disponibles (`enumerateDevices`) para
  elegir la fuente endoscópica.
- **Visualización en vivo** de la imagen de la cámara.
- **Grabación** de la práctica con la API `MediaRecorder` (`Grabadora.js`): grabar, reproducir y
  **descargar** el video resultante.
- **Cronómetro** de la sesión con inicio, pausa y reset (`Cronometro.js`).
- **Escena 3D** (`escenaVirtual.js`): proyecta el video de la cámara sobre un plano dentro de una
  escena three.js (`VideoTexture` + `PlaneGeometry` 16:9). En esta versión el módulo va sin usar:
  el código quedó comentado.

## Stack

- **Electron 12** + **electron-forge 6** (makers para Windows/squirrel, macOS/zip, `.deb` y `.rpm`).
- **three.js** (`src/three.module.js`) para la escena virtual.
- **Bootstrap + jQuery** (CDN) para la interfaz.
- APIs del navegador: `MediaRecorder`, `getUserMedia`, `enumerateDevices`.

## Cómo correrlo

```bash
npm install
npm start          # electron-forge start
```

## Cómo empaquetarlo

```bash
npm run make       # según package.json: squirrel (Windows), zip (macOS), deb y rpm (Linux)
```

## Compilar para Android (versión histórica)

La versión para tablet se armaba con **Apache Cordova**, que en su momento exigía **Java 1.8**:

```bash
sudo apt install oracle-java8-installer
sudo update-alternatives --config java
sudo update-alternatives --config javac
cordova build android
```

## Estructura

```
src/index.js            proceso principal de Electron (ventana de 1280x800)
src/index.html          interfaz: nav, video, botones de grabación y cronómetro
src/Grabadora.js        selección de cámara, grabación, reproducción y descarga
src/Cronometro.js       cronómetro de la práctica
src/escenaVirtual.js    escena three.js con el video como textura (WIP, comentado)
src/three.module.js     three.js
src/CamRecStyle.css     estilos
package.json            electron-forge: nombre del producto, makers y dependencias
```
