import { IFormula } from "../IFormula";
import { DataRow } from "../Rows/DataRow";
import { AggregateRowBuildContext } from "../BuildContext/AggregateRowBuildContext";

export class TextAggregateColumnFormula implements IFormula {
    constructor(private textGetter: (ctx: AggregateRowBuildContext) => string, private context: AggregateRowBuildContext) {
    }

    Execute(rows: DataRow[]): any {
        return this.textGetter(this.context);
    }
}