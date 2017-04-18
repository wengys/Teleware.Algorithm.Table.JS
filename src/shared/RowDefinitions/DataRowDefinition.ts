import { DataRowBuildContext } from '../BuildContext/DataRowBuildContext';
import { DataRow } from '../Rows/DataRow';
import { DataColumnDefinition } from '../DataColumnDefinition';

export class DataRowDefinition {
    private static _id: (dr: DataRow, ctx: DataRowBuildContext) => DataRow = (r, ctx) => r;

    constructor(columns: DataColumnDefinition[], rowDecorator?: (dr: DataRow, ctx: DataRowBuildContext) => DataRow) {
        this.Columns = columns;
        this.RowDecorator = rowDecorator || DataRowDefinition._id;
    }

    Columns: DataColumnDefinition[];
    RowDecorator: (dr: DataRow, ctx: DataRowBuildContext) => DataRow;
}