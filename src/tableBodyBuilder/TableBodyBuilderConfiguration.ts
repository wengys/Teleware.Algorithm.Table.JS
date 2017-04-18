import { AggregateRowDefinition } from "../shared/RowDefinitions/AggregateRowDefinition";
import { DataRowDefinition } from "../shared/RowDefinitions/DataRowDefinition";
import { IRowDataPicker } from "./IRowDataPicker"
import { IMergeCellsCollector } from "./IMergeCellsCollector";
import { ITableBodyBuilder } from "./ITableBodyBuilder";
import { DefaultTableBodyBuilder } from "./Impl/DefaultTableBodyBuilder";
import { AggregateMergeCellsCollector } from "./Impl/AggregateMergeCellsCollector";

interface CountRecord{
    [index:string]: number;
} 

export class TableBodyBuilderConfiguration {
    private _aggregateRows: AggregateRowDefinition[];
    private _collector: IRowDataPicker;
    private _dataRow: DataRowDefinition;
    private _mergeCellsCollector: IMergeCellsCollector;

    public static GetInstance(): TableBodyBuilderConfiguration {
        return new TableBodyBuilderConfiguration();
    }

    public CreateBuilder(): ITableBodyBuilder {
        return new DefaultTableBodyBuilder(
            this._collector,
            this._dataRow,
            this._aggregateRows,
            this._mergeCellsCollector
        );
    }

    public SetAggregateRowsDefinition(...aggregateRows: AggregateRowDefinition[]): TableBodyBuilderConfiguration {
        this._aggregateRows = aggregateRows;
        var count:CountRecord = {}
        for (let r of aggregateRows) {
            if (count[r.Name]) {
                throw new Error("发现重复聚合列定义名");
            } else {
                count[r.Name] = 1;
            }
        }
        return this;
    }

    public SetDataRowDefinition(dataRow: DataRowDefinition): TableBodyBuilderConfiguration {
        this._dataRow = dataRow;
        return this;
    }

    public SetMergeCellsCollectors(...mergeCellsCollectors: IMergeCellsCollector[]): TableBodyBuilderConfiguration {
        if (mergeCellsCollectors.length === 1) {
            this._mergeCellsCollector = mergeCellsCollectors[0];
        } else {
            this._mergeCellsCollector = new AggregateMergeCellsCollector(mergeCellsCollectors);
        }
        return this;
    }

    public SetRowDataPicker(picker: IRowDataPicker): TableBodyBuilderConfiguration {
        this._collector = picker;
        return this;
    }
}