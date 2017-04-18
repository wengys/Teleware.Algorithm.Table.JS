import { DataColumnDefinition, DataColumnDecorator } from "../DataColumnDefinition"
import { Cell } from "../Cell";
import { FormulaCell } from "../Cells/FormulaCell";
import { IFormula } from "../IFormula"
import { DataRowBuildContext } from "../BuildContext/DataRowBuildContext";

export class FormulaColumnDefinition extends DataColumnDefinition {
    private _columnText: string;
    public Formula: IFormula;

    constructor(columnText: string, formula: IFormula, cellDecorator?: DataColumnDecorator) {
        super(cellDecorator)
        this._columnText = columnText;
        this.Formula = formula;
    }

    protected BuildCell(context: DataRowBuildContext): Cell {
        return new FormulaCell(this.Formula);
    }

    public GetColumnText(): string {
        return this._columnText;
    }
}
