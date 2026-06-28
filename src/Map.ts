import { Container } from "pixi.js";
import { Province } from "./Province";

export class Map {
    /**
     * The Map class represents the container of every map element
     */
    container: Container
    provinces: Province[]

    private selectedProvince: Province | undefined

    /**
     * @param {Container} [container] contains the graphic elements of the map
     */
    constructor(container: Container) {
        this.container = container
        this.container.sortableChildren = true
        this.provinces = new Array()

        this.onProvinceSelected = this.onProvinceSelected.bind(this)
    }

    addProvince(province: Province) {
        this.provinces.push(province)
        this.container.addChild(province.container)
    }

    onProvinceSelected(province: Province) {
        console.log(`Province selected: ${province.id}`)
        const realProvince = this.provinces.find(
            p => p.id === province.id
        );
    
        if (!realProvince) return;
    
        if (this.selectedProvince?.id === realProvince.id) {
            this.selectedProvince.deselect()
            this.selectedProvince = undefined
        } else {
            this.selectedProvince?.deselect()
            this.selectedProvince = realProvince
            this.selectedProvince.select()
        }
    
    }
}