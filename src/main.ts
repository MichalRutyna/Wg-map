import {Application, Assets, Point} from 'pixi.js';
import { Province } from './game/elements/Province';
import { CameraContainer } from './game/ui/CameraContainer';
import { Map } from './game/Map';
import data from "./assets/mapa.json"
import { GUIContainer } from './game/ui/GUIContainer';

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

  await Assets.load('offLine2.png')

  // ----------- Creating main containers ------------------

  const cameraContainer = new CameraContainer();
  const map = new Map(cameraContainer)

  const guiContainer = new GUIContainer(app);

  // ----------- Populating the map ------------------

  data.map((item): void => {
    const points: Point[] = item.points.map(
      ([x, y]: number[]): Point => new Point(x, y)
    );
    map.addProvince(
        new Province(
            item.id,
            item.name,
            points,
            Math.random()*16_777_216, // 2^24 - semi-random color
            map.onProvinceClicked
        )
    );
  });

  
  // ----------- Finalizing display ------------------

  app.stage.addChild(cameraContainer);
  app.stage.addChild(guiContainer);

  cameraContainer.enablePan(app);
  cameraContainer.enableZoom(app);
})();
