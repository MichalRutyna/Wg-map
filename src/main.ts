import {Application, Assets, Point} from 'pixi.js';

import {Province} from "./game/elements/Province";
import {CameraContainer} from "./ui/layers/CameraContainer";
import {World} from './game/World';
import data from "./assets/map.json";
import {HUDContainer} from './ui/hud/HUDContainer';
import {WorldView} from "./ui/layers/WorldView";
import {ProvinceView} from "./ui/elements/ProvinceView";
import {ArmyLayer} from "./ui/layers/ArmyLayer";
import {OrderLayer} from "./ui/layers/OrderLayer";
import {Armies} from "./game/Armies";
import {Army} from "./game/elements/Army";

import { fetchIntoContainer } from "./game/DataContainer"

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

    const armyLayer = new ArmyLayer();
    cameraContainer.addChild(armyLayer)

    const orderLayer = new OrderLayer();
    cameraContainer.addChild(orderLayer)

    const guiContainer = new HUDContainer(app);

    // ----------- Creating the data model ----------------------

    const world = new World();
    await fetchIntoContainer('/api/provinces.json', Province, world);

    const armies = new Armies();
    await fetchIntoContainer('/api/armies.json', Army, armies);

    console.log(world);
    console.log(armies);

    // ----------- Populating the map ------------------
    // we import all baked-into data - province geometry

    data.map((item: { id: string, points: number[][] }): void => {
        const points: Point[] = item.points.map(
            ([x, y]: number[]): Point => new Point(x, y)
        );
        const prov = world.getChild(item.id);
        if (!prov) {
            return
        }
        worldView.addProvince(
            new ProvinceView(
                prov,
                points,
                Math.random() * 16_777_216, // 2^24 - semi-random color
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
