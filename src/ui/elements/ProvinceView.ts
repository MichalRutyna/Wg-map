import * as PIXI from "pixi.js";
import { GlowFilter } from "pixi-filters";
import { lighten } from "util/colors";
import { HOVER_SCALE } from "settings";
import {Province} from "../../game/elements/Province";

/**
 * A single Province on the map
 */
export class ProvinceView extends PIXI.Container {
    color: number;

    readonly province: Province;

    private readonly points: PIXI.Point[];

    private readonly clickCallback: (p: ProvinceView) => void

    private readonly graphics: PIXI.Graphics;
    /** glow is kept on a seperate layer so it gets properly antialiased
     * @private */
    private readonly glowGraphics: PIXI.Graphics;
    private readonly glowFilter: GlowFilter;

    // defaults to a slightly lighter color
    private hoverColor: number;
    // for calculating the slight enlargement on hover
    private centroid: PIXI.Point;

    constructor(
        province: Province,
        points: PIXI.Point[],
        color: number,
        clickCallback: (p: ProvinceView) => void)
    {
        super();
        this.province = province;
        this.points = points;
        this.color = color;
        this.clickCallback = clickCallback

        this.hoverColor = lighten(color);
        this.centroid = this.calculateCentroid();

        this.glowGraphics = new PIXI.Graphics();
        this.graphics = new PIXI.Graphics();

        this.glowFilter = new GlowFilter({
            distance: 15,
            outerStrength: 2,
            color: 0xffff00,
            knockout: true,
        });
        this.glowGraphics.filters = [this.glowFilter];
        this.glowGraphics.visible = false;

        this.addChild(this.glowGraphics);
        this.addChild(this.graphics);

        this.draw();

        this.pivot.set(this.centroid.x, this.centroid.y);
        this.position.set(this.centroid.x, this.centroid.y);

        // passes events
        this.eventMode = "passive";
        // processes events
        this.graphics.eventMode = "static";
        // terminates events
        this.glowGraphics.eventMode = "none";

        this.graphics.hitArea = new PIXI.Polygon(
            this.points.flatMap((p) => [p.x, p.y]),
        );

        this.graphics.on("pointerover", () => this.onHover());
        this.graphics.on("pointerout", () => this.onOut());
        this.graphics.on("pointertap", () => this.onClick());
    }

    deselect() {
        this.removeGlow();
        this.zIndex = 1;
    }

    select() {
        this.zIndex = 3;
        this.applyGlow();
    }

    private calculateCentroid(): PIXI.Point {
        if (this.points.length === 0) return new PIXI.Point(0, 0);
        let sumX = 0;
        let sumY = 0;
        for (const pt of this.points) {
            sumX += pt.x;
            sumY += pt.y;
        }
        return new PIXI.Point(sumX / this.points.length, sumY / this.points.length);
    }

    private drawTo(graphics: PIXI.Graphics, fillColor: number, withStroke: boolean) {
        graphics.clear();
        graphics.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            graphics.lineTo(this.points[i].x, this.points[i].y);
        }
        graphics.closePath();
        graphics.fill({color: fillColor});
        if (withStroke) {
            graphics.stroke({width: 2, color: 0x000000});
        }
    }

    private draw(fillColor: number = this.color) {
        this.drawTo(this.graphics, fillColor, true);
        this.drawTo(this.glowGraphics, fillColor, false);
    }

    private onHover() {
        this.draw(this.hoverColor);
        this.scale.set(HOVER_SCALE);
    }

    private onOut() {
        this.scale.set(1);
        this.draw(this.color);
    }

    private onClick() {
        this.clickCallback(this)
    }

    private setColor(newColor: number) {
        this.color = newColor;
        this.hoverColor = lighten(newColor);
        this.draw();
    }

    private removeGlow() {
        this.glowGraphics.visible = false;
    }

    private applyGlow() {
        this.glowGraphics.visible = true;
    }
}