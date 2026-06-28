import { Application, Point } from 'pixi.js';
import { Province } from './game/elements/Province';
import { CameraContainer } from './game/CameraContainer';
import { Map } from './game/Map';
import data from "./assets/mapa.json"

(async () => {
  // ----------- Basic init ------------------
  const app = new Application();

  await app.init({
    background: '#1a1a2e',
    width: 1000,
    height: 700,
    antialias: true,
    autoDensity: true,
  });

  document.getElementById('map-root')?.appendChild(app.canvas);


  // ----------- Creating the map ------------------

  const cameraContainer = new CameraContainer();
  const map = new Map(cameraContainer)


  // ----------- Populating the map ------------------

  data.map((item) => {
    const points = item.points.map(
      ([x, y]: number[]) => new Point(x, y)
    );
    map.addProvince(new Province(item.id, points, Math.random()*16_777_216, map.onProvinceClicked));
  });

  
  // ----------- Finalizing display ------------------

  app.stage.addChild(cameraContainer);

  cameraContainer.enablePan(app);
  cameraContainer.enableZoom(app);
})();
