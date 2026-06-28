import { Button } from "@pixi/ui";
import {Assets, Container, Graphics, Sprite, Text, Texture} from "pixi.js";
import {darken, lighten} from "../../util/colors";

const color = 0x222222;

const hardcodedArgs = {
    color: color,
    hoverColor: lighten(color),
    pressedColor: darken(color),
    disabledColor: darken(darken(color)),
    width: 50,
    height: 50,
    radius: 14,
    disabled: false,
};
const defaultAction = () => { console.log("Button clicked"); }


export class ToolbarButton extends Container {
    constructor(text: string, onPress: () => void = defaultAction) {
        super();
        const {
            width,
            height,
            color,
            hoverColor,
            pressedColor,
            disabled,
            radius,
            disabledColor,
        } = hardcodedArgs;

        const button = new Button(this);

        // const buttonText = new Text({
        //     text: text,
        //     style: {
        //         fill:  0xffffff
        //     }
        // })
        const buttonText = Sprite.from("offLine2.png");
        buttonText.width = width * 0.8;
        buttonText.height = height * 0.8;

        buttonText.anchor.set(0.5);

        const buttonBg = new Graphics();

        const defaultButton = (fillColor = color) => {
            buttonBg
                .clear()
                .roundRect(8, 8, width - 4, height - 4, radius)
                .stroke({
                    color: disabled ? darken(disabledColor)  : darken(fillColor),
                    width: 3
                })
                .roundRect(0, 0, width, height, radius)
                .fill(disabled ? disabledColor : fillColor);

            buttonBg.x = -buttonBg.width / 2;
            buttonBg.y = -buttonBg.height / 2;
            buttonText.x = -4;
            buttonText.y = -5;
        };

        const hoverButton = () => {
            defaultButton(hoverColor);
        };

        const pressButton = () => {
            buttonBg
                .clear()
                .roundRect(6, 6, width - 4, height - 4, radius)
                .stroke({
                    color: pressedColor,
                    width: 3
                })
                .roundRect(0, 0, width, height, radius)
                .fill(pressedColor)
                ;
            buttonBg.x += 2;
            buttonBg.y += 2;
            buttonText.x += 2;
            buttonText.y += 2;
        };

        button.onDown.connect(() => {
            pressButton();
        });
        button.onUp.connect(() => {
            defaultButton();
        });
        button.onHover.connect(() => {
            hoverButton();
        });
        button.onOut.connect(() => {
            defaultButton();
        });
        button.onUpOut.connect(() => {
            defaultButton();
        });

        this.addChild(buttonBg, buttonText)

        button.onPress.connect(onPress);

        defaultButton();
    }
}