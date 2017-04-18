import {Row} from "../shared/Row";
import {Tuple} from "./Tuple";
import {CellReference} from "../shared/CellReference";

export interface IMergeCellsCollector{
     Collect(rows:Row[]):Tuple<CellReference, CellReference>[];
}