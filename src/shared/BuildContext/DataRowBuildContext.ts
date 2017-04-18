import { Cell } from "../Cell";
import { DataRow } from "../Rows/DataRow";
import { DataColumnDefinition } from "../DataColumnDefinition";
import { DataRowDefinition } from "../RowDefinitions/DataRowDefinition";

export class DataRowBuildContext {
    private _cellDefMapping: CellDefMappingItem[] = []

    public RowIndex: number;
    public RelatedAggregateRowContext: any;

    constructor(public Definition: DataRowDefinition, public Datas: any, public DataRowIndex: number) {
        this.RelatedAggregateRowContext = {};
    }

    public GetColumnDataByRefKey(refKey: string): any {
        let data = this.Datas[refKey]
        if (typeof data === "undefined") {
            return null;
        }
        return data;
    }
    public RegisterCell(cell: Cell, column: DataColumnDefinition) {
        this._cellDefMapping.push(new CellDefMappingItem(cell, column));
    }
    public GetCellDefinition(cell: Cell): DataColumnDefinition {
        let colDef: DataColumnDefinition = null;
        for (let item of this._cellDefMapping) {
            if (item.Cell === cell) {
                colDef = item.Definition
            }
        }
        return colDef;
    }
    public DecorateCell(cell: Cell): Cell {
        return this.GetCellDefinition(cell).CellDecorator(cell, this);
    }
    public DecorateRow(row: DataRow) {
        return this.Definition.RowDecorator(row, this);
    }
}

class CellDefMappingItem {
    constructor(public Cell: Cell, public Definition: DataColumnDefinition) {
    }
}