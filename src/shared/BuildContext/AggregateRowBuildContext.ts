import { AggregateRow } from '../Rows/AggregateRow';
import { Cell } from '../Cell';
import { DataRow } from '../Rows/DataRow';
import { AggregateColumnDefinition } from "../AggregateColumnDefinition"
import { AggregateRowDefinition } from '../RowDefinitions/AggregateRowDefinition';

export class AggregateRowBuildContext {
    private _cellDefMapping: CellDefMappingItem[] = []

    RowsToAggregate: DataRow[]
    AggregateKey: string
    Definition: AggregateRowDefinition;
    AggregateRowIndex: number;
    RowIndex: number;

    constructor(aggregateRowDefinition: AggregateRowDefinition, aggregateKey: string, rowsToAggregate: DataRow[], aggregateRowIndex: number) {
        this.Definition = aggregateRowDefinition;
        this.RowsToAggregate = rowsToAggregate;
        this.AggregateKey = aggregateKey;
        this.AggregateRowIndex = aggregateRowIndex;

        this.BindToDataRows(aggregateRowDefinition, rowsToAggregate);
    }

    BindToDataRows(aggregateRowDefinition: AggregateRowDefinition, rowsToAggregate: DataRow[]) {
        for (let dataRow of rowsToAggregate) {
            dataRow.RowBuildContext.RelatedAggregateRowContext[aggregateRowDefinition.Name] = this;
        }
    }
    public RegisterCell(cell: Cell, column: AggregateColumnDefinition) {
        this._cellDefMapping.push(new CellDefMappingItem(cell, column));
    }
    public GetCellDefinition(cell: Cell): AggregateColumnDefinition {
        let colDef: AggregateColumnDefinition = null;
        for (let item of this._cellDefMapping) {
            if (item.Cell === cell) {
                colDef = item.Definition
            }
        }
        return colDef;
    }
    public DecorateCell(cell: Cell): Cell {
        let cellDef = this.GetCellDefinition(cell);
        if(!cellDef) {
            return cell;
        }
        return cellDef.CellDecorator(cell, this);
    }
    public DecorateRow(row: AggregateRow) {
        return this.Definition.RowDecorator(row, this);
    }
}

class CellDefMappingItem {
    constructor(public Cell: Cell, public Definition: AggregateColumnDefinition) {
    }
}