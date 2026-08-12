import { Province } from "game/elements/Province";


/**
 * Contains province models
 */
export class World {
    provinces: Map<string, Province>

    constructor() {
        this.provinces = new Map();
    }

    addProvince(province: Province) {
        this.provinces.set(province.id, province);
    }
}