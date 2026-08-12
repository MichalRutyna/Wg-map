import {Application, Container} from "pixi.js";
import {ToolbarButton} from "./elements/ToolbarButton";


export class GUIContainer extends Container {
    constructor(app: Application) {
        super();

        this.addChild(new ToolbarButton("Front line", () => console.log("Front line clicked")))

        this.y = app.canvas.height - 40;
        this.x = app.canvas.width / 2;
    }
} 