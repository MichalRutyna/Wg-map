import { Province } from "game/elements/Province";


/**
 * Contains province data models
 */
export class World implements DataContainer<Province>{
    children: Map<string, Province>

    constructor() {
        this.children = new Map();
    }

    addChild(province: Province) {
        this.children.set(province.id, province);
    }

    getChild(id: string): Province | undefined {
        return this.children.get(id);
    }
}