import { CellReference, CellReferenceComparer } from '../../shared/CellReference';
import { FormulaCell } from '../../shared/Cells/FormulaCell';
import { AggregateRowBuildContext } from '../../shared/BuildContext/AggregateRowBuildContext';
import { EmptyCell } from '../../shared/Cells/EmptyCell';
import { AggregateRow } from '../../shared/Rows/AggregateRow';
import { Tuple } from '../Tuple';
import { DataRow } from '../../shared/Rows/DataRow';
import { Cell } from '../../shared/Cell';
import { DataRowBuildContext } from '../../shared/BuildContext/DataRowBuildContext';
import { Row } from '../../shared/Row';
import { ITableBodyBuilder } from '../ITableBodyBuilder';
import { AggregateRowDefinition } from '../../shared/RowDefinitions/AggregateRowDefinition';
import { AggregateRowPositions } from '../../shared/RowDefinitions/AggregateRowPositions';
import { DataRowDefinition } from '../../shared/RowDefinitions/DataRowDefinition';
import { IRowDataPicker } from "../IRowDataPicker"
import { IMergeCellsCollector } from "../IMergeCellsCollector";
import { TableBody } from '../../shared/Table';

export class DefaultTableBodyBuilder implements ITableBodyBuilder {
    private _picker: IRowDataPicker;
    private _dataRow: DataRowDefinition;
    private _aggregateRows: AggregateRowDefinition[];
    private _mergeCellsCollector: IMergeCellsCollector;

    constructor(
        picker: IRowDataPicker,
        dataRow: DataRowDefinition,
        aggregateRows: AggregateRowDefinition[],
        mergeCellsCollector: IMergeCellsCollector) {
        this._picker = picker;
        this._dataRow = dataRow;
        this._mergeCellsCollector = mergeCellsCollector;
        this._aggregateRows = aggregateRows || [];
    }

    public Build(rawDatas: any): TableBody {
        let rowDatas = this.GetRowDatas(rawDatas);
        let body = this.CreateBody(rowDatas);
        let aggregateRows = this.CreateAggregateRows(body);
        this.MergeAggregateRows(body, aggregateRows);
        for (let i = 0; i < body.length; i++) {
            let row = body[i];
            this.EvalFormulaCells(row, i);
            body[i] = this.DecorateRowAndCells(row);
        }
        let mergeCellGroups = this.CollectMergeCellGroups(body);

        return new TableBody(body, mergeCellGroups);
    }

    private GetRowDatas(rawDatas: any): {}[] {
        return this._picker.PickRowDatas(rawDatas);
    }

    private CreateBody(rowDatas: {}[]): Row[] {
        let body: Row[] = [];
        for (let i = 0; i < rowDatas.length; i++) {
            let rd = rowDatas[i];
            let dataRowIndex = i;

            let rowBuildContext = new DataRowBuildContext(this._dataRow, rd, dataRowIndex);
            let rowColumns: Cell[] = [];
            for (let colDef of this._dataRow.Columns) {
                rowColumns.push(colDef.CreateCell(rowBuildContext))
            }
            body.push(new DataRow(rowColumns, rowBuildContext))
        }
        return body;
    }
    private CreateAggregateRows(body: Row[]): Tuple<number, AggregateRow>[] {
        let aggregateRows: Tuple<number, AggregateRow>[] = [];
        for (let aggregateRowDef of this._aggregateRows) {
            let firstRow = true;
            let lastKey: string = null;
            let rowsToAggregate: Tuple<number, DataRow>[] = [];
            let aggregateRowIndex = 0;
            for (let i = 0; i < body.length; i++) {
                let row = <DataRow>body[i];
                let key = aggregateRowDef.AggregateKeySelector(row);
                if (firstRow) {
                    firstRow = false;
                    lastKey = key;
                    rowsToAggregate.push(Tuple.Create(i, row));
                } else if (lastKey === key) {
                    rowsToAggregate.push(Tuple.Create(i, row));
                } else if (lastKey !== key) {
                    let aggregateRowTuple = this.CreateAggregateRow(lastKey, aggregateRowDef, rowsToAggregate, aggregateRowIndex);
                    aggregateRowIndex++;
                    aggregateRows.push(aggregateRowTuple);
                    rowsToAggregate = [];
                    lastKey = key;
                    rowsToAggregate.push(Tuple.Create(i, row));
                }
            }
            if (rowsToAggregate.length > 0) {
                let aggregateRowTuple = this.CreateAggregateRow(lastKey, aggregateRowDef, rowsToAggregate, aggregateRowIndex);
                aggregateRows.push(aggregateRowTuple);
            }
        }
        return aggregateRows.sort((a, b) => {
            return a.Item1 - b.Item1;
        })
    }

    private CreateAggregateRow(lastKey: string, aggregateRowDef: AggregateRowDefinition, rowsToAggregate: Tuple<number, DataRow>[], aggregateRowIndex: number): Tuple<number, AggregateRow> {
        let rowNum:number;
        if (aggregateRowDef.Position == AggregateRowPositions.End)
        {
            rowNum = rowsToAggregate[rowsToAggregate.length - 1].Item1 + 1;
        }
        else
        {
            rowNum = rowsToAggregate[0].Item1;
        }
        let cellCount = rowsToAggregate[0].Item2.Cells.length;

        let cells: Cell[] = [];
        for (let i = 0; i < cellCount; i++) {
            cells.push(EmptyCell.GetSingleton())
        }
        let dataRows: DataRow[] = [];
        for (let r of rowsToAggregate) {
            dataRows.push(r.Item2);
        }
        let aggregateBuildContext = new AggregateRowBuildContext(aggregateRowDef, lastKey, dataRows, aggregateRowIndex)

        for (let column of aggregateRowDef.Columns) {
            let cell = column.CreateCell(aggregateBuildContext);
            cells[column.ColNum] = cell;
        }

        return Tuple.Create(rowNum, new AggregateRow(cells, aggregateBuildContext))
    }

    private MergeAggregateRows(body: Row[], aggregateRows: Tuple<number, AggregateRow>[]) {
        for (let i = aggregateRows.length - 1; i >= 0; i--) {
            let aggregateRow = aggregateRows[i];
            body.splice(aggregateRow.Item1, 0, aggregateRow.Item2)
        }
    }

    private EvalFormulaCells(row: Row, rowIndex: number) {
        DefaultTableBodyBuilder.VisitRowByType(row, (dr) => {
            dr.RowBuildContext.RowIndex = rowIndex;
            for (let cell of dr.Cells) {
                if (cell instanceof FormulaCell) {
                    cell.ExecuteFormula([dr])
                }
            }
        }, (ar) => {
            ar.RowBuildContext.RowIndex = rowIndex;
            for (let cell of ar.Cells) {
                let ctx = ar.RowBuildContext.RowsToAggregate;
                if (cell instanceof FormulaCell) {
                    cell.ExecuteFormula(ctx)
                }
            }
        })
    }

    private DecorateRowAndCells(r: Row): Row {
        return DefaultTableBodyBuilder.MapRowByType<Row>(r, dr => {
            var ctx = dr.RowBuildContext;
            for (let i = 0; i < dr.Cells.length; i++) {
                dr.Cells[i] = ctx.DecorateCell(dr.Cells[i])
            }
            return ctx.DecorateRow(dr);
        }, ar => {
            var ctx = ar.RowBuildContext;
            for (let i = 0; i < ar.Cells.length; i++) {
                ar.Cells[i] = ctx.DecorateCell(ar.Cells[i])
            }
            return ctx.DecorateRow(ar);
        })
    }

    private CollectMergeCellGroups(data: Row[]): CellReference[][] {
        if (!this._mergeCellsCollector) {
            return [];
        }
        let mergeCellPairs = this._mergeCellsCollector.Collect(data)
            .sort((a, b) => CellReferenceComparer(a.Item1, b.Item1));

        let visitedCells: CellReference[] = [];
        let mergeCellGroups: CellReference[][] = [];
        let visited = false;
        for (let mergeCellPair of mergeCellPairs) {
            for (let c of visitedCells) {
                if (CellReferenceComparer(c, mergeCellPair.Item1) === 0) {
                    visited = true;
                    break;
                }
            }
            if (visited) {
                continue;
            }
            let mergeCellList: CellReference[] = this.CollectMergeGroup(mergeCellPairs, mergeCellPair);
            mergeCellList = mergeCellList.sort(CellReferenceComparer);
            for (let mc of mergeCellList) {
                visitedCells.push(mc);
            }
            mergeCellGroups.push(mergeCellList)
        }
        return mergeCellGroups;
    }

    private CollectMergeGroup(mergeCells: Tuple<CellReference, CellReference>[], mergeCellPair: Tuple<CellReference, CellReference>): CellReference[] {
        let mergeCellList: CellReference[] = [];
        mergeCellList.push(mergeCellPair.Item1);
        mergeCellList.push(mergeCellPair.Item2);

        for (let i = 1; i < mergeCellList.length; i++) {
            let nextMergeSource = mergeCellList[i];
            for (let mergeCell of mergeCells) {
                if (CellReferenceComparer(mergeCell.Item1, nextMergeSource) === 0) {
                    mergeCellList.push(mergeCell.Item2);
                }
            }
        }

        return mergeCellList;
    }

    private static MapRowByType<TResult>(row: Row, dataRowMapper: (dr: DataRow) => TResult, aggregateRowMapper: (ar: AggregateRow) => TResult): TResult {
        if (row instanceof DataRow) {
            return dataRowMapper(row);
        } else if (row instanceof AggregateRow) {
            return aggregateRowMapper(row);
        } else {
            throw new Error(`无法识别的行类型: ${typeof row}`)
        }
    }

    private static VisitRowByType(row: Row, dataRowVisitor: (dr: DataRow) => void, aggregateRowVisitor: (ar: AggregateRow) => void) {
        if (row instanceof DataRow) {
            dataRowVisitor(row);
        } else if (row instanceof AggregateRow) {
            aggregateRowVisitor(row);
        } else {
            throw new Error(`无法识别的行类型: ${typeof row}`)
        }
    }
}