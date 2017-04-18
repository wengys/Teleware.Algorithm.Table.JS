import { Cell } from "./Cell";
import { AggregateRowBuildContext } from "./BuildContext/AggregateRowBuildContext";

export type AggregateColumnDecorator = (cell: Cell, ctx: AggregateRowBuildContext) => Cell;

export abstract class AggregateColumnDefinition {
    private static _id: AggregateColumnDecorator = (c, ctx) => c;

    ColNum: number;
    CellDecorator: AggregateColumnDecorator;

    protected constructor(colNum: number, cellDecorator?: AggregateColumnDecorator) {
        this.ColNum = colNum;
        this.CellDecorator = cellDecorator || AggregateColumnDefinition._id;
    }

    protected abstract BuildCell(context: AggregateRowBuildContext): Cell;
    public CreateCell(context: AggregateRowBuildContext): Cell {
        var cell = this.BuildCell(context);
        context.RegisterCell(cell, this);
        return cell;
    }
}