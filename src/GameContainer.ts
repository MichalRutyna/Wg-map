import { Application, Container, Point } from "pixi.js";
import { Province } from "./Province";
import {
    DEFAULT_GLOBAL_SCALE,
    MAX_ZOOM,
    MIN_ZOOM,
    ZOOM_FACTOR,
} from "./settings";


export class CameraContainer extends Container {
    /* 
    Responsible for camera functions - zooming and panning 
    */
    globalScale: number;
    private dragging = false;
    private activePointerId = -1;
    private lastPointer = new Point();

    constructor(globalScale = DEFAULT_GLOBAL_SCALE) {
        super();
        this.globalScale = globalScale;
        this.scale.set(globalScale);
        this.eventMode = "passive";
    }

    enablePan(app: Application) {
        const canvas = app.canvas;

        const finishPan = (e: PointerEvent) => {
            if (e.pointerId !== this.activePointerId) return;
            this.dragging = false;
            this.activePointerId = -1;
            canvas.releasePointerCapture(e.pointerId);
        };

        canvas.addEventListener("pointerdown", (e: PointerEvent) => {
            this.dragging = true;
            this.activePointerId = e.pointerId;
            this.lastPointer.copyFrom(this.canvasPointer(app, e));
            // allows panning when outside the element
            canvas.setPointerCapture(e.pointerId);
        });

        canvas.addEventListener("pointermove", (e: PointerEvent) => {
            if (!this.dragging || e.pointerId !== this.activePointerId) return;

            const pos = this.canvasPointer(app, e);
            this.x += pos.x - this.lastPointer.x;
            this.y += pos.y - this.lastPointer.y;
            this.lastPointer.copyFrom(pos);
        });

        canvas.addEventListener("pointerup", finishPan);
        canvas.addEventListener("pointercancel", finishPan);
    }

    enableZoom(app: Application) {
        app.canvas.addEventListener("wheel", (e: WheelEvent) => {
            e.preventDefault();

            const oldScale = this.scale.x;
            const mouse = this.canvasPointer(app, e);

            const worldX = (mouse.x - this.x) / oldScale;
            const worldY = (mouse.y - this.y) / oldScale;

            const direction = e.deltaY > 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
            const newScale = Math.max(
                MIN_ZOOM,
                Math.min(MAX_ZOOM, oldScale * direction),
            );

            this.scale.set(newScale);
            this.globalScale = newScale;

            this.x = mouse.x - worldX * newScale;
            this.y = mouse.y - worldY * newScale;
        });
    }
    // local coordinate space
    private canvasPointer(
        app: Application,
        e: { clientX: number; clientY: number },
    ): Point {
        const rect = app.canvas.getBoundingClientRect();
        const scaleX = app.canvas.width / rect.width;
        const scaleY = app.canvas.height / rect.height;
        return new Point(
            (e.clientX - rect.left) * scaleX,
            (e.clientY - rect.top) * scaleY,
        );
    }
}
