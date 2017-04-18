declare module "shared/Cell" {
    export abstract class Cell {
        Metadata: any;
        Value: any;
        protected constructor();
        toString(): string;
    }
}
declare module "shared/Row" {
    import { Cell } from "shared/Cell";
    export abstract class Row {
        Cells: Cell[];
        Metadata: any;
        protected constructor(Cells: Cell[]);
    }
}
declare module "shared/Rows/AggregateRow" {
    import { Row } from "shared/Row";
    import { Cell } from "shared/Cell";
    import { AggregateRowBuildContext } from "shared/BuildContext/AggregateRowBuildContext";
    export class AggregateRow extends Row {
        constructor(cells: Cell[], rowBuildContext: AggregateRowBuildContext);
        RowBuildContext: AggregateRowBuildContext;
    }
}
declare module "shared/DataColumnDefinition" {
    import { Cell } from "shared/Cell";
    import { DataRowBuildContext } from "shared/BuildContext/DataRowBuildContext";
    export type DataColumnDecorator = (cell: Cell, ctx: DataRowBuildContext) => Cell;
    export abstract class DataColumnDefinition {
        private static _id;
        CellDecorator: DataColumnDecorator;
        protected constructor(cellDecorator?: DataColumnDecorator);
        protected abstract BuildCell(context: DataRowBuildContext): Cell;
        CreateCell(context: DataRowBuildContext): Cell;
        abstract GetColumnText(): string;
    }
}
declare module "shared/RowDefinitions/DataRowDefinition" {
    import { DataRowBuildContext } from "shared/BuildContext/DataRowBuildContext";
    import { DataRow } from "shared/Rows/DataRow";
    import { DataColumnDefinition } from "shared/DataColumnDefinition";
    export class DataRowDefinition {
        private static _id;
        constructor(columns: DataColumnDefinition[], rowDecorator?: (dr: DataRow, ctx: DataRowBuildContext) => DataRow);
        Columns: DataColumnDefinition[];
        RowDecorator: (dr: DataRow, ctx: DataRowBuildContext) => DataRow;
    }
}
declare module "shared/BuildContext/DataRowBuildContext" {
    import { Cell } from "shared/Cell";
    import { DataRow } from "shared/Rows/DataRow";
    import { DataColumnDefinition } from "shared/DataColumnDefinition";
    import { DataRowDefinition } from "shared/RowDefinitions/DataRowDefinition";
    export class DataRowBuildContext {
        Definition: DataRowDefinition;
        Datas: any;
        DataRowIndex: number;
        private _cellDefMapping;
        RowIndex: number;
        RelatedAggregateRowContext: any;
        constructor(Definition: DataRowDefinition, Datas: any, DataRowIndex: number);
        GetColumnDataByRefKey(refKey: string): any;
        RegisterCell(cell: Cell, column: DataColumnDefinition): void;
        GetCellDefinition(cell: Cell): DataColumnDefinition;
        DecorateCell(cell: Cell): Cell;
        DecorateRow(row: DataRow): DataRow;
    }
}
declare module "shared/Rows/DataRow" {
    import { Row } from "shared/Row";
    import { Cell } from "shared/Cell";
    import { DataRowBuildContext } from "shared/BuildContext/DataRowBuildContext";
    export class DataRow extends Row {
        constructor(cells: Cell[], rowBuildContext: DataRowBuildContext);
        RowBuildContext: DataRowBuildContext;
    }
}
declare module "shared/RowDefinitions/AggregateRowPositions" {
    /**
     * 聚合行出现位置
     */
    export enum AggregateRowPositions {
        /**
         * 开始处
         */
        Begin = 0,
        /**
         * 结束处
         */
        End = 1,
    }
}
declare module "shared/RowDefinitions/AggregateRowDefinition" {
    import { AggregateRowBuildContext } from "shared/BuildContext/AggregateRowBuildContext";
    import { DataRow } from "shared/Rows/DataRow";
    import { AggregateRow } from "shared/Rows/AggregateRow";
    import { AggregateColumnDefinition } from "shared/AggregateColumnDefinition";
    import { AggregateRowPositions } from "shared/RowDefinitions/AggregateRowPositions";
    export class AggregateRowDefinition {
        private static _id;
        Name: string;
        AggregateKeySelector: (dr: DataRow) => string;
        Columns: AggregateColumnDefinition[];
        RowDecorator: (ar: AggregateRow, ctx: AggregateRowBuildContext) => AggregateRow;
        Position: AggregateRowPositions;
        constructor(aggregateRowDefinitionName: string, aggregateKeySelector: (dr: DataRow) => string, columns: AggregateColumnDefinition[], rowDecorator?: (ar: AggregateRow, ctx: AggregateRowBuildContext) => AggregateRow, position?: AggregateRowPositions);
    }
}
declare module "shared/BuildContext/AggregateRowBuildContext" {
    import { AggregateRow } from "shared/Rows/AggregateRow";
    import { Cell } from "shared/Cell";
    import { DataRow } from "shared/Rows/DataRow";
    import { AggregateColumnDefinition } from "shared/AggregateColumnDefinition";
    import { AggregateRowDefinition } from "shared/RowDefinitions/AggregateRowDefinition";
    export class AggregateRowBuildContext {
        private _cellDefMapping;
        RowsToAggregate: DataRow[];
        AggregateKey: string;
        Definition: AggregateRowDefinition;
        AggregateRowIndex: number;
        RowIndex: number;
        constructor(aggregateRowDefinition: AggregateRowDefinition, aggregateKey: string, rowsToAggregate: DataRow[], aggregateRowIndex: number);
        BindToDataRows(aggregateRowDefinition: AggregateRowDefinition, rowsToAggregate: DataRow[]): void;
        RegisterCell(cell: Cell, column: AggregateColumnDefinition): void;
        GetCellDefinition(cell: Cell): AggregateColumnDefinition;
        DecorateCell(cell: Cell): Cell;
        DecorateRow(row: AggregateRow): AggregateRow;
    }
}
declare module "shared/AggregateColumnDefinition" {
    import { Cell } from "shared/Cell";
    import { AggregateRowBuildContext } from "shared/BuildContext/AggregateRowBuildContext";
    export type AggregateColumnDecorator = (cell: Cell, ctx: AggregateRowBuildContext) => Cell;
    export abstract class AggregateColumnDefinition {
        private static _id;
        ColNum: number;
        CellDecorator: AggregateColumnDecorator;
        protected constructor(colNum: number, cellDecorator?: AggregateColumnDecorator);
        protected abstract BuildCell(context: AggregateRowBuildContext): Cell;
        CreateCell(context: AggregateRowBuildContext): Cell;
    }
}
declare module "shared/CellReference" {
    export class CellReference {
        RowNum: number;
        ColNum: number;
        constructor(RowNum: number, ColNum: number);
        toString(): string;
    }
    export function CellReferenceComparer(a: CellReference, b: CellReference): 1 | -1 | 0;
}
declare module "shared/IFormula" {
    import { DataRow } from "shared/Rows/DataRow";
    export interface IFormula {
        Execute(rows: DataRow[]): any;
    }
}
declare module "shared/Table" {
    import { Row } from "shared/Row";
    import { CellReference } from "shared/CellReference";
    export class Table {
        constructor(TableHead: TableHead, TableBody: TableBody);
    }
    export interface ITableContentSection {
        Rows: Row[];
        MergeCellGroups: CellReference[][];
    }
    export class TableBody implements ITableContentSection {
        Rows: Row[];
        MergeCellGroups: CellReference[][];
        constructor(Rows: Row[], MergeCellGroups: CellReference[][]);
    }
    export class TableHead implements ITableContentSection {
        Rows: Row[];
        MergeCellGroups: CellReference[][];
        constructor(Rows: Row[], MergeCellGroups: CellReference[][]);
    }
}
declare module "shared/Cells/FormulaCell" {
    import { Cell } from "shared/Cell";
    import { IFormula } from "shared/IFormula";
    import { DataRow } from "shared/Rows/DataRow";
    export class FormulaCell extends Cell {
        Formula: IFormula;
        constructor(formula: IFormula);
        ExecuteFormula(dataRows: DataRow[]): void;
    }
}
declare module "shared/AggregateColumnDefinitions/FormulaAggregateColumnDefinition" {
    import { Cell } from "shared/Cell";
    import { IFormula } from "shared/IFormula";
    import { AggregateColumnDefinition, AggregateColumnDecorator } from "shared/AggregateColumnDefinition";
    import { AggregateRowBuildContext } from "shared/BuildContext/AggregateRowBuildContext";
    export class FormulaAggregateColumnDefinition extends AggregateColumnDefinition {
        Formula: IFormula;
        constructor(colNum: number, formula: IFormula, cellDecorator?: AggregateColumnDecorator);
        protected BuildCell(context: AggregateRowBuildContext): Cell;
    }
}
declare module "shared/ColumnFormulas/TextAggregateColumnFormula" {
    import { IFormula } from "shared/IFormula";
    import { DataRow } from "shared/Rows/DataRow";
    import { AggregateRowBuildContext } from "shared/BuildContext/AggregateRowBuildContext";
    export class TextAggregateColumnFormula implements IFormula {
        private textGetter;
        private context;
        constructor(textGetter: (ctx: AggregateRowBuildContext) => string, context: AggregateRowBuildContext);
        Execute(rows: DataRow[]): any;
    }
}
declare module "shared/AggregateColumnDefinitions/TextAggregateColumnDefinition" {
    import { Cell } from "shared/Cell";
    import { AggregateColumnDefinition } from "shared/AggregateColumnDefinition";
    import { AggregateRowBuildContext } from "shared/BuildContext/AggregateRowBuildContext";
    export class TextAggregateColumnDefinition extends AggregateColumnDefinition {
        private _textGetter;
        constructor(colNum: number, textGetter: string | ((ctx: AggregateRowBuildContext) => string), cellDecorator?: (cell: Cell, ctx: AggregateRowBuildContext) => Cell);
        protected BuildCell(context: AggregateRowBuildContext): Cell;
    }
}
declare module "shared/Cells/EmptyCell" {
    import { Cell } from "shared/Cell";
    export class EmptyCell extends Cell {
        private static instance;
        private constructor();
        static GetSingleton: () => EmptyCell;
    }
}
declare module "shared/Cells/ReferenceCell" {
    import { Cell } from "shared/Cell";
    export class ReferenceCell extends Cell {
        RawData: any;
        constructor(value: any, rawData: any);
    }
}
declare module "shared/Cells/StaticTextCell" {
    import { Cell } from "shared/Cell";
    export class StaticTextCell extends Cell {
        constructor(text: string);
    }
}
declare module "shared/ColumnFormulas/SumRefKeysFormula" {
    import { IFormula } from "shared/IFormula";
    import { DataRow } from "shared/Rows/DataRow";
    export type AdderFunc<TValue> = (a: TValue, b: TValue) => TValue;
    export type MapperFunc<TValue> = (source: any) => TValue;
    export class SumRefKeysFormula<TValue> implements IFormula {
        private _id;
        Adder: AdderFunc<TValue>;
        RefKeys: string[];
        ValueMapper: MapperFunc<TValue>;
        constructor(valueMapper: MapperFunc<TValue>, adder: AdderFunc<TValue>, ...refKeys: string[]);
        Execute(rows: DataRow[]): any;
    }
    export class SumRefKeysDecimalFormula implements IFormula {
        private _id;
        RefKeys: string[];
        ValueMapper: MapperFunc<number>;
        constructor(valueMapper: MapperFunc<number>, ...refKeys: string[]);
        Execute(rows: DataRow[]): any;
    }
}
declare module "shared/DataColumnDefinitions/FormulaColumnDefinition" {
    import { DataColumnDefinition, DataColumnDecorator } from "shared/DataColumnDefinition";
    import { Cell } from "shared/Cell";
    import { IFormula } from "shared/IFormula";
    import { DataRowBuildContext } from "shared/BuildContext/DataRowBuildContext";
    export class FormulaColumnDefinition extends DataColumnDefinition {
        private _columnText;
        Formula: IFormula;
        constructor(columnText: string, formula: IFormula, cellDecorator?: DataColumnDecorator);
        protected BuildCell(context: DataRowBuildContext): Cell;
        GetColumnText(): string;
    }
}
declare module "shared/DataColumnDefinitions/ReferenceColumnDefinition" {
    import { DataColumnDefinition, DataColumnDecorator } from "shared/DataColumnDefinition";
    import { Cell } from "shared/Cell";
    import { DataRowBuildContext } from "shared/BuildContext/DataRowBuildContext";
    export type ValueMapperFunc = (source: any) => any;
    export class ReferenceColumnDefinition extends DataColumnDefinition {
        private static _idVM;
        private _valueMapper;
        private _columnText;
        RefKey: string;
        constructor(columnText: string, refKey: string, valueMapper?: ValueMapperFunc, cellDecorator?: DataColumnDecorator);
        protected BuildCell(context: DataRowBuildContext): Cell;
        GetColumnText(): string;
    }
}
declare module "tableBodyBuilder/Tuple" {
    export class Tuple<T1, T2> {
        Item1: T1;
        Item2: T2;
        constructor(Item1: T1, Item2: T2);
        static Create<T1, T2>(item1: T1, item2: T2): Tuple<T1, T2>;
    }
}
declare module "tableBodyBuilder/IMergeCellsCollector" {
    import { Row } from "shared/Row";
    import { Tuple } from "tableBodyBuilder/Tuple";
    import { CellReference } from "shared/CellReference";
    export interface IMergeCellsCollector {
        Collect(rows: Row[]): Tuple<CellReference, CellReference>[];
    }
}
declare module "tableBodyBuilder/IRowDataPicker" {
    export interface IRowDataPicker {
        PickRowDatas(rawDatas: any): {}[];
    }
}
declare module "tableBodyBuilder/ITableBodyBuilder" {
    import { TableBody } from "shared/Table";
    export interface ITableBodyBuilder {
        Build(rawDatas: any): TableBody;
    }
}
declare module "tableBodyBuilder/Impl/DefaultTableBodyBuilder" {
    import { ITableBodyBuilder } from "tableBodyBuilder/ITableBodyBuilder";
    import { AggregateRowDefinition } from "shared/RowDefinitions/AggregateRowDefinition";
    import { DataRowDefinition } from "shared/RowDefinitions/DataRowDefinition";
    import { IRowDataPicker } from "tableBodyBuilder/IRowDataPicker";
    import { IMergeCellsCollector } from "tableBodyBuilder/IMergeCellsCollector";
    import { TableBody } from "shared/Table";
    export class DefaultTableBodyBuilder implements ITableBodyBuilder {
        private _picker;
        private _dataRow;
        private _aggregateRows;
        private _mergeCellsCollector;
        constructor(picker: IRowDataPicker, dataRow: DataRowDefinition, aggregateRows: AggregateRowDefinition[], mergeCellsCollector: IMergeCellsCollector);
        Build(rawDatas: any): TableBody;
        private GetRowDatas(rawDatas);
        private CreateBody(rowDatas);
        private CreateAggregateRows(body);
        private CreateAggregateRow(lastKey, aggregateRowDef, rowsToAggregate, aggregateRowIndex);
        private MergeAggregateRows(body, aggregateRows);
        private EvalFormulaCells(row, rowIndex);
        private DecorateRowAndCells(r);
        private CollectMergeCellGroups(data);
        private CollectMergeGroup(mergeCells, mergeCellPair);
        private static MapRowByType<TResult>(row, dataRowMapper, aggregateRowMapper);
        private static VisitRowByType(row, dataRowVisitor, aggregateRowVisitor);
    }
}
declare module "tableBodyBuilder/Impl/AggregateMergeCellsCollector" {
    import { IMergeCellsCollector } from "tableBodyBuilder/IMergeCellsCollector";
    import { Row } from "shared/Row";
    import { CellReference } from "shared/CellReference";
    import { Tuple } from "tableBodyBuilder/Tuple";
    export class AggregateMergeCellsCollector implements IMergeCellsCollector {
        private _mergeCellsCollectors;
        constructor(_mergeCellsCollectors: IMergeCellsCollector[]);
        Collect(rows: Row[]): Tuple<CellReference, CellReference>[];
        private IsDistinct(mergeCellPairs, pair);
    }
}
declare module "tableBodyBuilder/TableBodyBuilderConfiguration" {
    import { AggregateRowDefinition } from "shared/RowDefinitions/AggregateRowDefinition";
    import { DataRowDefinition } from "shared/RowDefinitions/DataRowDefinition";
    import { IRowDataPicker } from "tableBodyBuilder/IRowDataPicker";
    import { IMergeCellsCollector } from "tableBodyBuilder/IMergeCellsCollector";
    import { ITableBodyBuilder } from "tableBodyBuilder/ITableBodyBuilder";
    export class TableBodyBuilderConfiguration {
        private _aggregateRows;
        private _collector;
        private _dataRow;
        private _mergeCellsCollector;
        static GetInstance(): TableBodyBuilderConfiguration;
        CreateBuilder(): ITableBodyBuilder;
        SetAggregateRowsDefinition(...aggregateRows: AggregateRowDefinition[]): TableBodyBuilderConfiguration;
        SetDataRowDefinition(dataRow: DataRowDefinition): TableBodyBuilderConfiguration;
        SetMergeCellsCollectors(...mergeCellsCollectors: IMergeCellsCollector[]): TableBodyBuilderConfiguration;
        SetRowDataPicker(picker: IRowDataPicker): TableBodyBuilderConfiguration;
    }
}
