import {TableBody} from "../shared/Table";

export interface ITableBodyBuilder {
    Build(rawDatas:any):TableBody;
}