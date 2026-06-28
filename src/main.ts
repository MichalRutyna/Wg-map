import { Application, Point } from 'pixi.js';
import { Province } from './Province';
import { CameraContainer } from './GameContainer';
import { Map } from './Map';
import data from "../output.json"

(async () => {
  const app = new Application();

  await app.init({
    background: '#1a1a2e',
    width: 1000,
    height: 700,
    antialias: true,
    autoDensity: true,
  });

  document.getElementById('map-root')?.appendChild(app.canvas);


  const cameraContainer = new CameraContainer();
  const map = new Map(cameraContainer)

  const provinces = data.map((item) => {
    const points = item.points.map(
      ([x, y]: number[]) => new Point(x, y)
    );
    map.addProvince(new Province(item.id, points, Math.random()*16_777_216, map.onProvinceSelected));
  });

  app.stage.addChild(cameraContainer);

  cameraContainer.enablePan(app);
  cameraContainer.enableZoom(app);
})();
