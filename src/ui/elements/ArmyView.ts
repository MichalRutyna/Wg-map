import * as PIXI from "pixi.js";
import {GlowFilter} from "pixi-filters";
import {Army} from "../../game/elements/Army";

export class ArmyView extends PIXI.Container {
    army: Army

    private readonly graphics: PIXI.Graphics;
    /** glow is kept on a seperate layer so it gets properly antialiased
     * @private */
    private readonly glowGraphics: PIXI.Graphics;
    private readonly glowFilter: GlowFilter;

    constructor(army: Army) {
        super();
        this.army = army;

        this.graphics = new PIXI.Graphics();
        this.glowGraphics = new PIXI.Graphics();
        this.glowFilter = new GlowFilter({
            distance: 15,
            outerStrength: 2,
            color: 0xffff00,
            knockout: true,
        });
    }
}