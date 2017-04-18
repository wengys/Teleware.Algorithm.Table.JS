import {DataRow} from "./Rows/DataRow";

export interface IFormula {
    Execute(rows: DataRow[]):any;
}