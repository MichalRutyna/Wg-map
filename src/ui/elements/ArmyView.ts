import {GlowFilter} from "pixi-filters";
import {Army} from "../../game/elements/Army";
import {Container, Graphics} from "pixi.js";

export class ArmyView extends Container {
    army: Army

    private readonly graphics: Graphics;
    /** glow is kept on a seperate layer so it gets properly antialiased
     * @private */
    private readonly glowGraphics: Graphics;
    private readonly glowFilter: GlowFilter;

    constructor(army: Army) {
        super();
        this.army = army;

        this.graphics = new Graphics();
        this.glowGraphics = new Graphics();
        this.glowFilter = new GlowFilter({
            distance: 15,
            outerStrength: 2,
            color: 0xffff00,
            knockout: true,
        });
    }
}