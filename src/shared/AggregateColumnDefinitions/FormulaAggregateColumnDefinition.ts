import { Cell } from "../Cell";
import { IFormula } from "../IFormula"
import { AggregateColumnDefinition, AggregateColumnDecorator } from "../AggregateColumnDefinition"
import { AggregateRowBuildContext } from "../BuildContext/AggregateRowBuildContext";
import { FormulaCell } from "../Cells/FormulaCell"

export class FormulaAggregateColumnDefinition extends AggregateColumnDefinition {
    Formula: IFormula;

    constructor(colNum: number, formula: IFormula, cellDecorator?: AggregateColumnDecorator) {
        super(colNum, cellDecorator);
        this.Formula = formula;
    }

    protected BuildCell(context: AggregateRowBuildContext): Cell {
        return new FormulaCell(this.Formula);
    }
}