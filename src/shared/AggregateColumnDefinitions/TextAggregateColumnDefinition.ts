import { Cell } from "../Cell";
import { IFormula } from "../IFormula"
import { AggregateColumnDefinition } from "../AggregateColumnDefinition"
import { AggregateRowBuildContext } from "../BuildContext/AggregateRowBuildContext";
import { FormulaCell } from "../Cells/FormulaCell"
import { TextAggregateColumnFormula } from "../ColumnFormulas/TextAggregateColumnFormula"

export class TextAggregateColumnDefinition extends AggregateColumnDefinition {
    private _textGetter: (ctx: AggregateRowBuildContext) => string;

    constructor(colNum: number, textGetter: string | ((ctx: AggregateRowBuildContext) => string), cellDecorator?: (cell: Cell, ctx: AggregateRowBuildContext) => Cell) {
        super(colNum, cellDecorator);
        if (typeof textGetter === "string") {
            this._textGetter = (ctx) => textGetter;
        } else {
            this._textGetter = textGetter;
        }
    }

    protected BuildCell(context: AggregateRowBuildContext): Cell {
        return new FormulaCell(new TextAggregateColumnFormula(this._textGetter, context));
    }
}