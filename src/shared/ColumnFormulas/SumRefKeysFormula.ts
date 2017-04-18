import { IFormula } from "../IFormula"
import { DataRow } from "../Rows/DataRow";

export type AdderFunc<TValue> = (a: TValue, b: TValue) => TValue;
export type MapperFunc<TValue> = (source: any) => TValue;

export class SumRefKeysFormula<TValue> implements IFormula {
    private _id: MapperFunc<TValue> = v => <TValue>v;

    Adder: AdderFunc<TValue>;
    RefKeys: string[];
    ValueMapper: MapperFunc<TValue>;

    constructor(valueMapper: MapperFunc<TValue>, adder: AdderFunc<TValue>, ...refKeys: string[]) {
        this.RefKeys = refKeys;
        this.ValueMapper = valueMapper || this._id;
        this.Adder = adder;
    }

    Execute(rows: DataRow[]): any {
        let vs: TValue[] = [];
        let result: TValue = null;
        for (let row of rows) {
            for (let refKey of this.RefKeys) {
                var columnData = row.RowBuildContext.GetColumnDataByRefKey(refKey);
                if (columnData != null) {
                    vs.push(this.ValueMapper(columnData))
                }
            }
        }
        if (vs.length > 0) {
            result = vs[0];
            for (let i = 1; i < vs.length; i++) {
                result = this.Adder(result, vs[i])
            }
        }
        return result;
    }
}

export class SumRefKeysDecimalFormula implements IFormula {
    private _id: MapperFunc<number> = v => <number>v;

    RefKeys: string[];
    ValueMapper: MapperFunc<number>;

    constructor(valueMapper: MapperFunc<number>, ...refKeys: string[]) {
        this.RefKeys = refKeys;
        this.ValueMapper = valueMapper || this._id;
    }

    Execute(rows: DataRow[]): any {
        let vs: number[] = [];
        let result: number = null;
        for (let row of rows) {
            for (let refKey of this.RefKeys) {
                var columnData = row.RowBuildContext.GetColumnDataByRefKey(refKey);
                if (columnData != null) {
                    vs.push(this.ValueMapper(columnData))
                }
            }
        }
        if (vs.length > 0) {
            result = vs[0];
            for (let i = 1; i < vs.length; i++) {
                result = result + vs[i];
            }
        }
        return result;
    }
}