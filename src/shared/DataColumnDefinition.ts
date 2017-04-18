import { Cell } from "./Cell";
import { DataRowBuildContext } from "./BuildContext/DataRowBuildContext";

export type DataColumnDecorator = (cell: Cell, ctx: DataRowBuildContext) => Cell;

export abstract class DataColumnDefinition {
    private static _id: DataColumnDecorator = (c, ctx) => c;

    public CellDecorator: DataColumnDecorator;

    protected constructor(cellDecorator?: DataColumnDecorator) {
        this.CellDecorator = cellDecorator || DataColumnDefinition._id;
    }

    protected abstract BuildCell(context: DataRowBuildContext): Cell;
    public CreateCell(context: DataRowBuildContext): Cell {
        var cell = this.BuildCell(context);
        context.RegisterCell(cell, this);
        return cell;
    }
    public abstract GetColumnText(): string;
}