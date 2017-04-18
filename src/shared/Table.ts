import { Row } from "./Row";
import { CellReference } from "./CellReference"

export class Table {
    constructor(TableHead: TableHead, TableBody: TableBody) { }
}

export interface ITableContentSection {
    Rows: Row[];
    MergeCellGroups: CellReference[][];
}

export class TableBody implements ITableContentSection {
    constructor(public Rows: Row[], public MergeCellGroups: CellReference[][]) {
    }
}

export class TableHead implements ITableContentSection {
    constructor(public Rows: Row[], public MergeCellGroups: CellReference[][]) {
    }
}