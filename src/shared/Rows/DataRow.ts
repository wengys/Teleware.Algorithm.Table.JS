import { Row } from "../Row";
import { Cell } from "../Cell";
import { DataRowBuildContext } from "../BuildContext/DataRowBuildContext";

export class DataRow extends Row {
    constructor(cells: Cell[], rowBuildContext: DataRowBuildContext) {
        super(cells);
        this.RowBuildContext = rowBuildContext;
    }
    public RowBuildContext: DataRowBuildContext;
}