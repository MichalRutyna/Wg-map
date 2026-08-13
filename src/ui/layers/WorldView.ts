import { Container } from "pixi.js";
import {ProvinceView} from "../elements/ProvinceView";

/*
* Contains province views
*
* It's responsible for selecting a province
 */
export class WorldView extends Container {
    provinces: Map<string, ProvinceView>
    selectedProvince: ProvinceView | null

    constructor() {
        super();

        this.provinces = new Map();
        this.sortableChildren = true

        this.selectedProvince = null;

        // a callback needs to be bound on construction
        this.onProvinceClicked = this.onProvinceClicked.bind(this)
    }

    addProvince(province: ProvinceView) {
        this.provinces.set(province.province.id, province);
        this.addChild(province)
    }

    getProvince(id: string): ProvinceView | undefined {
        return this.provinces.get(id)
    }

    /**
     * The callback that will be passed into provinces
     */
    onProvinceClicked(province: ProvinceView) {
        //
        const realProvince = this.provinces.get(province.province.id);

        if (!realProvince) return;

        if (this.selectedProvince && this.selectedProvince.province.id === realProvince.province.id) {
            this.selectedProvince.deselect();
            this.selectedProvince = null;
        } else {
            this.selectedProvince?.deselect()
            this.selectedProvince = realProvince
            this.selectedProvince.select()
            console.log(`Province selected: ${province.province.name} (${province.province.id})`)
        }

    }
}