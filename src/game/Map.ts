import { Container } from "pixi.js";
import { Province } from "./elements/Province";


/**
 * The Map class represents the container of every map element
 * It's responsible for selecting a province
 */
export class Map {
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

        // a callback needs to be binded on construction
        this.onProvinceClicked = this.onProvinceClicked.bind(this)
    }

    addProvince(province: Province) {
        this.provinces.push(province)
        this.container.addChild(province.container)
    }

    onProvinceClicked(province: Province) {
        /**
         * A callback for when a province is clicked
         */
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