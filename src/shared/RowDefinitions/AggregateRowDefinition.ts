import { AggregateRowBuildContext } from '../BuildContext/AggregateRowBuildContext';
import { DataRow } from '../Rows/DataRow';
import { AggregateRow } from '../Rows/AggregateRow';
import { AggregateColumnDefinition } from "../AggregateColumnDefinition";
import { AggregateRowPositions  } from "./AggregateRowPositions"

export class AggregateRowDefinition {
    private static _id: (ar: AggregateRow, ctx: AggregateRowBuildContext) => AggregateRow = (r, ctx) => r;

    Name: string
    AggregateKeySelector: (dr: DataRow) => string;
    Columns: AggregateColumnDefinition[]
    RowDecorator: (ar: AggregateRow, ctx: AggregateRowBuildContext) => AggregateRow;
    Position: AggregateRowPositions

    constructor(
        aggregateRowDefinitionName: string, 
        aggregateKeySelector: (dr: DataRow) => string, 
        columns: AggregateColumnDefinition[], 
        rowDecorator?: (ar: AggregateRow, ctx: AggregateRowBuildContext) => AggregateRow,
        position:AggregateRowPositions = AggregateRowPositions.End
        ) {
        this.Name = aggregateRowDefinitionName;
        this.AggregateKeySelector = aggregateKeySelector;
        this.Columns = columns;
        this.RowDecorator = rowDecorator || AggregateRowDefinition._id;
        this.Position = position;
    }


}