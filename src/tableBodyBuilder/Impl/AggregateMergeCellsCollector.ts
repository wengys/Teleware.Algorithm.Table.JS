import { IMergeCellsCollector } from "../IMergeCellsCollector";
import {Row} from "../../shared/Row";
import {CellReference,CellReferenceComparer} from "../../shared/CellReference";
import {Tuple} from "../Tuple";

export class AggregateMergeCellsCollector implements IMergeCellsCollector{
    constructor(private _mergeCellsCollectors:IMergeCellsCollector[]){

    }

    Collect(rows:Row[]):Tuple<CellReference,CellReference>[]{
        let mergeCellPairs:Tuple<CellReference,CellReference>[]=[];
        for(let collector of this._mergeCellsCollectors){
            let pairs=collector.Collect(rows);
            for(let pair of pairs){
                if(this.IsDistinct(mergeCellPairs,pair)){
                    mergeCellPairs.push(pair);
                }
            }
        }
        return mergeCellPairs;
    }

    private IsDistinct(mergeCellPairs:Tuple<CellReference,CellReference>[],pair:Tuple<CellReference,CellReference>):boolean{
        for(let existsPair of mergeCellPairs){
            if(CellReferenceComparer(existsPair.Item1,pair.Item1)&&CellReferenceComparer(existsPair.Item2,pair.Item2)){
                return false;
            }
        }
        return true;
    }
}