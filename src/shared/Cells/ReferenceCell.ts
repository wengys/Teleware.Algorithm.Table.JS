import { Cell } from "../Cell"

export class ReferenceCell extends Cell {
    RawData: any;

    constructor(value: any, rawData: any) {
        super();
        this.Value = value;
        this.RawData = rawData;
    }
}