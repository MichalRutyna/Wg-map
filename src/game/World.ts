import { Province } from "game/elements/Province";


/**
 * Contains province data models
 */
export class World {
    provinces: Map<string, Province>

    constructor() {
        this.provinces = new Map();
    }

    addProvince(province: Province) {
        this.provinces.set(province.id, province);
    }

    getProvince(id: string): Province | undefined {
        return this.provinces.get(id);
    }
}