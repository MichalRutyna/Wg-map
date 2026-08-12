import { Application, Assets, Point } from 'pixi.js';
import { Province } from "./game/elements/Province";
import { CameraContainer } from "./ui/CameraContainer";
import { World } from './game/World';
import data from "./assets/mapa.json";
import { HUDContainer } from './ui/hud/HUDContainer';
import {WorldView} from "./ui/WorldView";
import {ProvinceView} from "./ui/elements/ProvinceView";

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

  await Assets.load('offLine2.png');

  // ----------- Creating main containers ------------------

  const cameraContainer = new CameraContainer();
  const worldView = new WorldView();
  cameraContainer.addChild(worldView);

  const guiContainer = new HUDContainer(app);

  // ----------- Creating the data model ----------------------

  const world = new World();

  // ----------- Populating the map ------------------

  data.map((item): void => {
    const points: Point[] = item.points.map(
      ([x, y]: number[]): Point => new Point(x, y)
    );
    const prov = new Province(
        item.id,
        item.name,
    )

    world.addProvince(prov);
    worldView.addProvince(
        new ProvinceView(
            prov,
            points,
            Math.random()*16_777_216, // 2^24 - semi-random color
            worldView.onProvinceClicked,
        )
    );
  });

  
  // ----------- Finalizing display ------------------

  app.stage.addChild(cameraContainer);
  app.stage.addChild(guiContainer);

  cameraContainer.enablePan(app);
  cameraContainer.enableZoom(app);
})();
