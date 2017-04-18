import { Row } from "../Row";
import { Cell } from "../Cell";
import { AggregateRowBuildContext } from "../BuildContext/AggregateRowBuildContext";

export class AggregateRow extends Row {
    constructor(cells: Cell[], rowBuildContext: AggregateRowBuildContext) {
        super(cells);
        this.RowBuildContext = rowBuildContext;
    }
    public RowBuildContext: AggregateRowBuildContext;
}