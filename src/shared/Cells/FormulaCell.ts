import { Cell } from "../Cell"
import { IFormula } from "../IFormula"
import { DataRow } from "../Rows/DataRow"


export class FormulaCell extends Cell {
    Formula: IFormula;

    constructor(formula: IFormula) {
        super();
        this.Formula = formula;
    }

    ExecuteFormula(dataRows: DataRow[]): void {
        this.Value = this.Formula.Execute(dataRows);
    }
}