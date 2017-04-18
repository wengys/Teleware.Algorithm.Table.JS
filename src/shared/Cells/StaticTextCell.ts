import { Cell } from "../Cell"

export class StaticTextCell extends Cell {
    constructor(text: string) {
        super();
        this.Value = text;
    }
}