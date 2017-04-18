import { DataColumnDefinition, DataColumnDecorator } from "../DataColumnDefinition"
import { Cell } from "../Cell";
import { ReferenceCell } from "../Cells/ReferenceCell";
import { EmptyCell } from "../Cells/EmptyCell";
import { DataRowBuildContext } from "../BuildContext/DataRowBuildContext";

export type ValueMapperFunc = (source: any) => any;

export class ReferenceColumnDefinition extends DataColumnDefinition {
    private static _idVM: ValueMapperFunc = a => a;

    private _valueMapper: ValueMapperFunc;
    private _columnText: string;
    public RefKey: string;

    constructor(columnText: string, refKey: string, valueMapper?: ValueMapperFunc, cellDecorator?: DataColumnDecorator) {
        super(cellDecorator)
        this._columnText = columnText;
        this.RefKey = refKey;
        this._valueMapper = valueMapper || ReferenceColumnDefinition._idVM;
    }

    protected BuildCell(context: DataRowBuildContext): Cell {
        var data = context.GetColumnDataByRefKey(this.RefKey);
        if (data === null) {
            return EmptyCell.GetSingleton();
        }
        var column = new ReferenceCell(this._valueMapper(data), data);
        return column;
    }

    public GetColumnText(): string {
        return this._columnText;
    }
}
