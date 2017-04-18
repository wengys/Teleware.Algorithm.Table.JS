import { Cell } from "../Cell"

export class EmptyCell extends Cell {
    private static instance = new EmptyCell();

    private constructor() {
        super();
    }

    static GetSingleton: () => EmptyCell = () => EmptyCell.instance;
}