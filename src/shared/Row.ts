import { Cell } from "./Cell";
export abstract class Row {
    public Metadata: any;
    protected constructor(public Cells: Cell[]) {
        this.Metadata = {};
    }
}