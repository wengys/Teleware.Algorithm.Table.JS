var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("shared/Cell", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Cell = (function () {
        function Cell() {
            this.Metadata = {};
            this.Value = null;
        }
        Cell.prototype.toString = function () {
            var v;
            if (this.Value === null) {
                v = "";
            }
            else {
                v = this.Value;
            }
            return "" + v;
        };
        return Cell;
    }());
    exports.Cell = Cell;
});
define("shared/Row", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Row = (function () {
        function Row(Cells) {
            this.Cells = Cells;
            this.Metadata = {};
        }
        return Row;
    }());
    exports.Row = Row;
});
define("shared/Rows/AggregateRow", ["require", "exports", "shared/Row"], function (require, exports, Row_1) {
    "use strict";
    exports.__esModule = true;
    var AggregateRow = (function (_super) {
        __extends(AggregateRow, _super);
        function AggregateRow(cells, rowBuildContext) {
            var _this = _super.call(this, cells) || this;
            _this.RowBuildContext = rowBuildContext;
            return _this;
        }
        return AggregateRow;
    }(Row_1.Row));
    exports.AggregateRow = AggregateRow;
});
define("shared/DataColumnDefinition", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var DataColumnDefinition = (function () {
        function DataColumnDefinition(cellDecorator) {
            this.CellDecorator = cellDecorator || DataColumnDefinition._id;
        }
        DataColumnDefinition.prototype.CreateCell = function (context) {
            var cell = this.BuildCell(context);
            context.RegisterCell(cell, this);
            return cell;
        };
        return DataColumnDefinition;
    }());
    DataColumnDefinition._id = function (c, ctx) { return c; };
    exports.DataColumnDefinition = DataColumnDefinition;
});
define("shared/RowDefinitions/DataRowDefinition", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var DataRowDefinition = (function () {
        function DataRowDefinition(columns, rowDecorator) {
            this.Columns = columns;
            this.RowDecorator = rowDecorator || DataRowDefinition._id;
        }
        return DataRowDefinition;
    }());
    DataRowDefinition._id = function (r, ctx) { return r; };
    exports.DataRowDefinition = DataRowDefinition;
});
define("shared/BuildContext/DataRowBuildContext", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var DataRowBuildContext = (function () {
        function DataRowBuildContext(Definition, Datas, DataRowIndex) {
            this.Definition = Definition;
            this.Datas = Datas;
            this.DataRowIndex = DataRowIndex;
            this._cellDefMapping = [];
            this.RelatedAggregateRowContext = {};
        }
        DataRowBuildContext.prototype.GetColumnDataByRefKey = function (refKey) {
            var data = this.Datas[refKey];
            if (typeof data === "undefined") {
                return null;
            }
            return data;
        };
        DataRowBuildContext.prototype.RegisterCell = function (cell, column) {
            this._cellDefMapping.push(new CellDefMappingItem(cell, column));
        };
        DataRowBuildContext.prototype.GetCellDefinition = function (cell) {
            var colDef = null;
            for (var _i = 0, _a = this._cellDefMapping; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.Cell === cell) {
                    colDef = item.Definition;
                }
            }
            return colDef;
        };
        DataRowBuildContext.prototype.DecorateCell = function (cell) {
            return this.GetCellDefinition(cell).CellDecorator(cell, this);
        };
        DataRowBuildContext.prototype.DecorateRow = function (row) {
            return this.Definition.RowDecorator(row, this);
        };
        return DataRowBuildContext;
    }());
    exports.DataRowBuildContext = DataRowBuildContext;
    var CellDefMappingItem = (function () {
        function CellDefMappingItem(Cell, Definition) {
            this.Cell = Cell;
            this.Definition = Definition;
        }
        return CellDefMappingItem;
    }());
});
define("shared/Rows/DataRow", ["require", "exports", "shared/Row"], function (require, exports, Row_2) {
    "use strict";
    exports.__esModule = true;
    var DataRow = (function (_super) {
        __extends(DataRow, _super);
        function DataRow(cells, rowBuildContext) {
            var _this = _super.call(this, cells) || this;
            _this.RowBuildContext = rowBuildContext;
            return _this;
        }
        return DataRow;
    }(Row_2.Row));
    exports.DataRow = DataRow;
});
/**
 * 聚合行出现位置
 */
define("shared/RowDefinitions/AggregateRowPositions", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var AggregateRowPositions;
    (function (AggregateRowPositions) {
        /**
         * 开始处
         */
        AggregateRowPositions[AggregateRowPositions["Begin"] = 0] = "Begin";
        /**
         * 结束处
         */
        AggregateRowPositions[AggregateRowPositions["End"] = 1] = "End";
    })(AggregateRowPositions = exports.AggregateRowPositions || (exports.AggregateRowPositions = {}));
});
define("shared/RowDefinitions/AggregateRowDefinition", ["require", "exports", "shared/RowDefinitions/AggregateRowPositions"], function (require, exports, AggregateRowPositions_1) {
    "use strict";
    exports.__esModule = true;
    var AggregateRowDefinition = (function () {
        function AggregateRowDefinition(aggregateRowDefinitionName, aggregateKeySelector, columns, rowDecorator, position) {
            if (position === void 0) { position = AggregateRowPositions_1.AggregateRowPositions.End; }
            this.Name = aggregateRowDefinitionName;
            this.AggregateKeySelector = aggregateKeySelector;
            this.Columns = columns;
            this.RowDecorator = rowDecorator || AggregateRowDefinition._id;
            this.Position = position;
        }
        return AggregateRowDefinition;
    }());
    AggregateRowDefinition._id = function (r, ctx) { return r; };
    exports.AggregateRowDefinition = AggregateRowDefinition;
});
define("shared/BuildContext/AggregateRowBuildContext", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var AggregateRowBuildContext = (function () {
        function AggregateRowBuildContext(aggregateRowDefinition, aggregateKey, rowsToAggregate, aggregateRowIndex) {
            this._cellDefMapping = [];
            this.Definition = aggregateRowDefinition;
            this.RowsToAggregate = rowsToAggregate;
            this.AggregateKey = aggregateKey;
            this.AggregateRowIndex = aggregateRowIndex;
            this.BindToDataRows(aggregateRowDefinition, rowsToAggregate);
        }
        AggregateRowBuildContext.prototype.BindToDataRows = function (aggregateRowDefinition, rowsToAggregate) {
            for (var _i = 0, rowsToAggregate_1 = rowsToAggregate; _i < rowsToAggregate_1.length; _i++) {
                var dataRow = rowsToAggregate_1[_i];
                dataRow.RowBuildContext.RelatedAggregateRowContext[aggregateRowDefinition.Name] = this;
            }
        };
        AggregateRowBuildContext.prototype.RegisterCell = function (cell, column) {
            this._cellDefMapping.push(new CellDefMappingItem(cell, column));
        };
        AggregateRowBuildContext.prototype.GetCellDefinition = function (cell) {
            var colDef = null;
            for (var _i = 0, _a = this._cellDefMapping; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.Cell === cell) {
                    colDef = item.Definition;
                }
            }
            return colDef;
        };
        AggregateRowBuildContext.prototype.DecorateCell = function (cell) {
            var cellDef = this.GetCellDefinition(cell);
            if (!cellDef) {
                return cell;
            }
            return cellDef.CellDecorator(cell, this);
        };
        AggregateRowBuildContext.prototype.DecorateRow = function (row) {
            return this.Definition.RowDecorator(row, this);
        };
        return AggregateRowBuildContext;
    }());
    exports.AggregateRowBuildContext = AggregateRowBuildContext;
    var CellDefMappingItem = (function () {
        function CellDefMappingItem(Cell, Definition) {
            this.Cell = Cell;
            this.Definition = Definition;
        }
        return CellDefMappingItem;
    }());
});
define("shared/AggregateColumnDefinition", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var AggregateColumnDefinition = (function () {
        function AggregateColumnDefinition(colNum, cellDecorator) {
            this.ColNum = colNum;
            this.CellDecorator = cellDecorator || AggregateColumnDefinition._id;
        }
        AggregateColumnDefinition.prototype.CreateCell = function (context) {
            var cell = this.BuildCell(context);
            context.RegisterCell(cell, this);
            return cell;
        };
        return AggregateColumnDefinition;
    }());
    AggregateColumnDefinition._id = function (c, ctx) { return c; };
    exports.AggregateColumnDefinition = AggregateColumnDefinition;
});
define("shared/CellReference", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var CellReference = (function () {
        function CellReference(RowNum, ColNum) {
            this.RowNum = RowNum;
            this.ColNum = ColNum;
        }
        CellReference.prototype.toString = function () {
            return "(" + this.RowNum + ", " + this.ColNum + ")";
        };
        return CellReference;
    }());
    exports.CellReference = CellReference;
    function CellReferenceComparer(a, b) {
        if (a.RowNum < b.RowNum) {
            return -1;
        }
        else if (a.RowNum > b.RowNum) {
            return 1;
        }
        if (a.ColNum < b.ColNum) {
            return -1;
        }
        else if (a.ColNum > b.ColNum) {
            return 1;
        }
        return 0;
    }
    exports.CellReferenceComparer = CellReferenceComparer;
});
define("shared/IFormula", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
});
define("shared/Table", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Table = (function () {
        function Table(TableHead, TableBody) {
        }
        return Table;
    }());
    exports.Table = Table;
    var TableBody = (function () {
        function TableBody(Rows, MergeCellGroups) {
            this.Rows = Rows;
            this.MergeCellGroups = MergeCellGroups;
        }
        return TableBody;
    }());
    exports.TableBody = TableBody;
    var TableHead = (function () {
        function TableHead(Rows, MergeCellGroups) {
            this.Rows = Rows;
            this.MergeCellGroups = MergeCellGroups;
        }
        return TableHead;
    }());
    exports.TableHead = TableHead;
});
define("shared/Cells/FormulaCell", ["require", "exports", "shared/Cell"], function (require, exports, Cell_1) {
    "use strict";
    exports.__esModule = true;
    var FormulaCell = (function (_super) {
        __extends(FormulaCell, _super);
        function FormulaCell(formula) {
            var _this = _super.call(this) || this;
            _this.Formula = formula;
            return _this;
        }
        FormulaCell.prototype.ExecuteFormula = function (dataRows) {
            this.Value = this.Formula.Execute(dataRows);
        };
        return FormulaCell;
    }(Cell_1.Cell));
    exports.FormulaCell = FormulaCell;
});
define("shared/AggregateColumnDefinitions/FormulaAggregateColumnDefinition", ["require", "exports", "shared/AggregateColumnDefinition", "shared/Cells/FormulaCell"], function (require, exports, AggregateColumnDefinition_1, FormulaCell_1) {
    "use strict";
    exports.__esModule = true;
    var FormulaAggregateColumnDefinition = (function (_super) {
        __extends(FormulaAggregateColumnDefinition, _super);
        function FormulaAggregateColumnDefinition(colNum, formula, cellDecorator) {
            var _this = _super.call(this, colNum, cellDecorator) || this;
            _this.Formula = formula;
            return _this;
        }
        FormulaAggregateColumnDefinition.prototype.BuildCell = function (context) {
            return new FormulaCell_1.FormulaCell(this.Formula);
        };
        return FormulaAggregateColumnDefinition;
    }(AggregateColumnDefinition_1.AggregateColumnDefinition));
    exports.FormulaAggregateColumnDefinition = FormulaAggregateColumnDefinition;
});
define("shared/ColumnFormulas/TextAggregateColumnFormula", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var TextAggregateColumnFormula = (function () {
        function TextAggregateColumnFormula(textGetter, context) {
            this.textGetter = textGetter;
            this.context = context;
        }
        TextAggregateColumnFormula.prototype.Execute = function (rows) {
            return this.textGetter(this.context);
        };
        return TextAggregateColumnFormula;
    }());
    exports.TextAggregateColumnFormula = TextAggregateColumnFormula;
});
define("shared/AggregateColumnDefinitions/TextAggregateColumnDefinition", ["require", "exports", "shared/AggregateColumnDefinition", "shared/Cells/FormulaCell", "shared/ColumnFormulas/TextAggregateColumnFormula"], function (require, exports, AggregateColumnDefinition_2, FormulaCell_2, TextAggregateColumnFormula_1) {
    "use strict";
    exports.__esModule = true;
    var TextAggregateColumnDefinition = (function (_super) {
        __extends(TextAggregateColumnDefinition, _super);
        function TextAggregateColumnDefinition(colNum, textGetter, cellDecorator) {
            var _this = _super.call(this, colNum, cellDecorator) || this;
            if (typeof textGetter === "string") {
                _this._textGetter = function (ctx) { return textGetter; };
            }
            else {
                _this._textGetter = textGetter;
            }
            return _this;
        }
        TextAggregateColumnDefinition.prototype.BuildCell = function (context) {
            return new FormulaCell_2.FormulaCell(new TextAggregateColumnFormula_1.TextAggregateColumnFormula(this._textGetter, context));
        };
        return TextAggregateColumnDefinition;
    }(AggregateColumnDefinition_2.AggregateColumnDefinition));
    exports.TextAggregateColumnDefinition = TextAggregateColumnDefinition;
});
define("shared/Cells/EmptyCell", ["require", "exports", "shared/Cell"], function (require, exports, Cell_2) {
    "use strict";
    exports.__esModule = true;
    var EmptyCell = (function (_super) {
        __extends(EmptyCell, _super);
        function EmptyCell() {
            return _super.call(this) || this;
        }
        return EmptyCell;
    }(Cell_2.Cell));
    EmptyCell.instance = new EmptyCell();
    EmptyCell.GetSingleton = function () { return EmptyCell.instance; };
    exports.EmptyCell = EmptyCell;
});
define("shared/Cells/ReferenceCell", ["require", "exports", "shared/Cell"], function (require, exports, Cell_3) {
    "use strict";
    exports.__esModule = true;
    var ReferenceCell = (function (_super) {
        __extends(ReferenceCell, _super);
        function ReferenceCell(value, rawData) {
            var _this = _super.call(this) || this;
            _this.Value = value;
            _this.RawData = rawData;
            return _this;
        }
        return ReferenceCell;
    }(Cell_3.Cell));
    exports.ReferenceCell = ReferenceCell;
});
define("shared/Cells/StaticTextCell", ["require", "exports", "shared/Cell"], function (require, exports, Cell_4) {
    "use strict";
    exports.__esModule = true;
    var StaticTextCell = (function (_super) {
        __extends(StaticTextCell, _super);
        function StaticTextCell(text) {
            var _this = _super.call(this) || this;
            _this.Value = text;
            return _this;
        }
        return StaticTextCell;
    }(Cell_4.Cell));
    exports.StaticTextCell = StaticTextCell;
});
define("shared/ColumnFormulas/SumRefKeysFormula", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var SumRefKeysFormula = (function () {
        function SumRefKeysFormula(valueMapper, adder) {
            var refKeys = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                refKeys[_i - 2] = arguments[_i];
            }
            this._id = function (v) { return v; };
            this.RefKeys = refKeys;
            this.ValueMapper = valueMapper || this._id;
            this.Adder = adder;
        }
        SumRefKeysFormula.prototype.Execute = function (rows) {
            var vs = [];
            var result = null;
            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                var row = rows_1[_i];
                for (var _a = 0, _b = this.RefKeys; _a < _b.length; _a++) {
                    var refKey = _b[_a];
                    var columnData = row.RowBuildContext.GetColumnDataByRefKey(refKey);
                    if (columnData != null) {
                        vs.push(this.ValueMapper(columnData));
                    }
                }
            }
            if (vs.length > 0) {
                result = vs[0];
                for (var i = 1; i < vs.length; i++) {
                    result = this.Adder(result, vs[i]);
                }
            }
            return result;
        };
        return SumRefKeysFormula;
    }());
    exports.SumRefKeysFormula = SumRefKeysFormula;
    var SumRefKeysDecimalFormula = (function () {
        function SumRefKeysDecimalFormula(valueMapper) {
            var refKeys = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                refKeys[_i - 1] = arguments[_i];
            }
            this._id = function (v) { return v; };
            this.RefKeys = refKeys;
            this.ValueMapper = valueMapper || this._id;
        }
        SumRefKeysDecimalFormula.prototype.Execute = function (rows) {
            var vs = [];
            var result = null;
            for (var _i = 0, rows_2 = rows; _i < rows_2.length; _i++) {
                var row = rows_2[_i];
                for (var _a = 0, _b = this.RefKeys; _a < _b.length; _a++) {
                    var refKey = _b[_a];
                    var columnData = row.RowBuildContext.GetColumnDataByRefKey(refKey);
                    if (columnData != null) {
                        vs.push(this.ValueMapper(columnData));
                    }
                }
            }
            if (vs.length > 0) {
                result = vs[0];
                for (var i = 1; i < vs.length; i++) {
                    result = result + vs[i];
                }
            }
            return result;
        };
        return SumRefKeysDecimalFormula;
    }());
    exports.SumRefKeysDecimalFormula = SumRefKeysDecimalFormula;
});
define("shared/DataColumnDefinitions/FormulaColumnDefinition", ["require", "exports", "shared/DataColumnDefinition", "shared/Cells/FormulaCell"], function (require, exports, DataColumnDefinition_1, FormulaCell_3) {
    "use strict";
    exports.__esModule = true;
    var FormulaColumnDefinition = (function (_super) {
        __extends(FormulaColumnDefinition, _super);
        function FormulaColumnDefinition(columnText, formula, cellDecorator) {
            var _this = _super.call(this, cellDecorator) || this;
            _this._columnText = columnText;
            _this.Formula = formula;
            return _this;
        }
        FormulaColumnDefinition.prototype.BuildCell = function (context) {
            return new FormulaCell_3.FormulaCell(this.Formula);
        };
        FormulaColumnDefinition.prototype.GetColumnText = function () {
            return this._columnText;
        };
        return FormulaColumnDefinition;
    }(DataColumnDefinition_1.DataColumnDefinition));
    exports.FormulaColumnDefinition = FormulaColumnDefinition;
});
define("shared/DataColumnDefinitions/ReferenceColumnDefinition", ["require", "exports", "shared/DataColumnDefinition", "shared/Cells/ReferenceCell", "shared/Cells/EmptyCell"], function (require, exports, DataColumnDefinition_2, ReferenceCell_1, EmptyCell_1) {
    "use strict";
    exports.__esModule = true;
    var ReferenceColumnDefinition = (function (_super) {
        __extends(ReferenceColumnDefinition, _super);
        function ReferenceColumnDefinition(columnText, refKey, valueMapper, cellDecorator) {
            var _this = _super.call(this, cellDecorator) || this;
            _this._columnText = columnText;
            _this.RefKey = refKey;
            _this._valueMapper = valueMapper || ReferenceColumnDefinition._idVM;
            return _this;
        }
        ReferenceColumnDefinition.prototype.BuildCell = function (context) {
            var data = context.GetColumnDataByRefKey(this.RefKey);
            if (data === null) {
                return EmptyCell_1.EmptyCell.GetSingleton();
            }
            var column = new ReferenceCell_1.ReferenceCell(this._valueMapper(data), data);
            return column;
        };
        ReferenceColumnDefinition.prototype.GetColumnText = function () {
            return this._columnText;
        };
        return ReferenceColumnDefinition;
    }(DataColumnDefinition_2.DataColumnDefinition));
    ReferenceColumnDefinition._idVM = function (a) { return a; };
    exports.ReferenceColumnDefinition = ReferenceColumnDefinition;
});
define("tableBodyBuilder/Tuple", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Tuple = (function () {
        function Tuple(Item1, Item2) {
            this.Item1 = Item1;
            this.Item2 = Item2;
        }
        Tuple.Create = function (item1, item2) {
            return new Tuple(item1, item2);
        };
        return Tuple;
    }());
    exports.Tuple = Tuple;
});
define("tableBodyBuilder/IMergeCellsCollector", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
});
define("tableBodyBuilder/IRowDataPicker", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
});
define("tableBodyBuilder/ITableBodyBuilder", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
});
define("tableBodyBuilder/Impl/DefaultTableBodyBuilder", ["require", "exports", "shared/CellReference", "shared/Cells/FormulaCell", "shared/BuildContext/AggregateRowBuildContext", "shared/Cells/EmptyCell", "shared/Rows/AggregateRow", "tableBodyBuilder/Tuple", "shared/Rows/DataRow", "shared/BuildContext/DataRowBuildContext", "shared/RowDefinitions/AggregateRowPositions", "shared/Table"], function (require, exports, CellReference_1, FormulaCell_4, AggregateRowBuildContext_1, EmptyCell_2, AggregateRow_1, Tuple_1, DataRow_1, DataRowBuildContext_1, AggregateRowPositions_2, Table_1) {
    "use strict";
    exports.__esModule = true;
    var DefaultTableBodyBuilder = (function () {
        function DefaultTableBodyBuilder(picker, dataRow, aggregateRows, mergeCellsCollector) {
            this._picker = picker;
            this._dataRow = dataRow;
            this._mergeCellsCollector = mergeCellsCollector;
            this._aggregateRows = aggregateRows || [];
        }
        DefaultTableBodyBuilder.prototype.Build = function (rawDatas) {
            var rowDatas = this.GetRowDatas(rawDatas);
            var body = this.CreateBody(rowDatas);
            var aggregateRows = this.CreateAggregateRows(body);
            this.MergeAggregateRows(body, aggregateRows);
            for (var i = 0; i < body.length; i++) {
                var row = body[i];
                this.EvalFormulaCells(row, i);
                body[i] = this.DecorateRowAndCells(row);
            }
            var mergeCellGroups = this.CollectMergeCellGroups(body);
            return new Table_1.TableBody(body, mergeCellGroups);
        };
        DefaultTableBodyBuilder.prototype.GetRowDatas = function (rawDatas) {
            return this._picker.PickRowDatas(rawDatas);
        };
        DefaultTableBodyBuilder.prototype.CreateBody = function (rowDatas) {
            var body = [];
            for (var i = 0; i < rowDatas.length; i++) {
                var rd = rowDatas[i];
                var dataRowIndex = i;
                var rowBuildContext = new DataRowBuildContext_1.DataRowBuildContext(this._dataRow, rd, dataRowIndex);
                var rowColumns = [];
                for (var _i = 0, _a = this._dataRow.Columns; _i < _a.length; _i++) {
                    var colDef = _a[_i];
                    rowColumns.push(colDef.CreateCell(rowBuildContext));
                }
                body.push(new DataRow_1.DataRow(rowColumns, rowBuildContext));
            }
            return body;
        };
        DefaultTableBodyBuilder.prototype.CreateAggregateRows = function (body) {
            var aggregateRows = [];
            for (var _i = 0, _a = this._aggregateRows; _i < _a.length; _i++) {
                var aggregateRowDef = _a[_i];
                var firstRow = true;
                var lastKey = null;
                var rowsToAggregate = [];
                var aggregateRowIndex = 0;
                for (var i = 0; i < body.length; i++) {
                    var row = body[i];
                    var key = aggregateRowDef.AggregateKeySelector(row);
                    if (firstRow) {
                        firstRow = false;
                        lastKey = key;
                        rowsToAggregate.push(Tuple_1.Tuple.Create(i, row));
                    }
                    else if (lastKey === key) {
                        rowsToAggregate.push(Tuple_1.Tuple.Create(i, row));
                    }
                    else if (lastKey !== key) {
                        var aggregateRowTuple = this.CreateAggregateRow(lastKey, aggregateRowDef, rowsToAggregate, aggregateRowIndex);
                        aggregateRowIndex++;
                        aggregateRows.push(aggregateRowTuple);
                        rowsToAggregate = [];
                        lastKey = key;
                        rowsToAggregate.push(Tuple_1.Tuple.Create(i, row));
                    }
                }
                if (rowsToAggregate.length > 0) {
                    var aggregateRowTuple = this.CreateAggregateRow(lastKey, aggregateRowDef, rowsToAggregate, aggregateRowIndex);
                    aggregateRows.push(aggregateRowTuple);
                }
            }
            return aggregateRows.sort(function (a, b) {
                return a.Item1 - b.Item1;
            });
        };
        DefaultTableBodyBuilder.prototype.CreateAggregateRow = function (lastKey, aggregateRowDef, rowsToAggregate, aggregateRowIndex) {
            var rowNum;
            if (aggregateRowDef.Position == AggregateRowPositions_2.AggregateRowPositions.End) {
                rowNum = rowsToAggregate[rowsToAggregate.length - 1].Item1 + 1;
            }
            else {
                rowNum = rowsToAggregate[0].Item1;
            }
            var cellCount = rowsToAggregate[0].Item2.Cells.length;
            var cells = [];
            for (var i = 0; i < cellCount; i++) {
                cells.push(EmptyCell_2.EmptyCell.GetSingleton());
            }
            var dataRows = [];
            for (var _i = 0, rowsToAggregate_2 = rowsToAggregate; _i < rowsToAggregate_2.length; _i++) {
                var r = rowsToAggregate_2[_i];
                dataRows.push(r.Item2);
            }
            var aggregateBuildContext = new AggregateRowBuildContext_1.AggregateRowBuildContext(aggregateRowDef, lastKey, dataRows, aggregateRowIndex);
            for (var _a = 0, _b = aggregateRowDef.Columns; _a < _b.length; _a++) {
                var column = _b[_a];
                var cell = column.CreateCell(aggregateBuildContext);
                cells[column.ColNum] = cell;
            }
            return Tuple_1.Tuple.Create(rowNum, new AggregateRow_1.AggregateRow(cells, aggregateBuildContext));
        };
        DefaultTableBodyBuilder.prototype.MergeAggregateRows = function (body, aggregateRows) {
            for (var i = aggregateRows.length - 1; i >= 0; i--) {
                var aggregateRow = aggregateRows[i];
                body.splice(aggregateRow.Item1, 0, aggregateRow.Item2);
            }
        };
        DefaultTableBodyBuilder.prototype.EvalFormulaCells = function (row, rowIndex) {
            DefaultTableBodyBuilder.VisitRowByType(row, function (dr) {
                dr.RowBuildContext.RowIndex = rowIndex;
                for (var _i = 0, _a = dr.Cells; _i < _a.length; _i++) {
                    var cell = _a[_i];
                    if (cell instanceof FormulaCell_4.FormulaCell) {
                        cell.ExecuteFormula([dr]);
                    }
                }
            }, function (ar) {
                ar.RowBuildContext.RowIndex = rowIndex;
                for (var _i = 0, _a = ar.Cells; _i < _a.length; _i++) {
                    var cell = _a[_i];
                    var ctx = ar.RowBuildContext.RowsToAggregate;
                    if (cell instanceof FormulaCell_4.FormulaCell) {
                        cell.ExecuteFormula(ctx);
                    }
                }
            });
        };
        DefaultTableBodyBuilder.prototype.DecorateRowAndCells = function (r) {
            return DefaultTableBodyBuilder.MapRowByType(r, function (dr) {
                var ctx = dr.RowBuildContext;
                for (var i = 0; i < dr.Cells.length; i++) {
                    dr.Cells[i] = ctx.DecorateCell(dr.Cells[i]);
                }
                return ctx.DecorateRow(dr);
            }, function (ar) {
                var ctx = ar.RowBuildContext;
                for (var i = 0; i < ar.Cells.length; i++) {
                    ar.Cells[i] = ctx.DecorateCell(ar.Cells[i]);
                }
                return ctx.DecorateRow(ar);
            });
        };
        DefaultTableBodyBuilder.prototype.CollectMergeCellGroups = function (data) {
            if (!this._mergeCellsCollector) {
                return [];
            }
            var mergeCellPairs = this._mergeCellsCollector.Collect(data)
                .sort(function (a, b) { return CellReference_1.CellReferenceComparer(a.Item1, b.Item1); });
            var visitedCells = [];
            var mergeCellGroups = [];
            var visited = false;
            for (var _i = 0, mergeCellPairs_1 = mergeCellPairs; _i < mergeCellPairs_1.length; _i++) {
                var mergeCellPair = mergeCellPairs_1[_i];
                for (var _a = 0, visitedCells_1 = visitedCells; _a < visitedCells_1.length; _a++) {
                    var c = visitedCells_1[_a];
                    if (CellReference_1.CellReferenceComparer(c, mergeCellPair.Item1) === 0) {
                        visited = true;
                        break;
                    }
                }
                if (visited) {
                    continue;
                }
                var mergeCellList = this.CollectMergeGroup(mergeCellPairs, mergeCellPair);
                mergeCellList = mergeCellList.sort(CellReference_1.CellReferenceComparer);
                for (var _b = 0, mergeCellList_1 = mergeCellList; _b < mergeCellList_1.length; _b++) {
                    var mc = mergeCellList_1[_b];
                    visitedCells.push(mc);
                }
                mergeCellGroups.push(mergeCellList);
            }
            return mergeCellGroups;
        };
        DefaultTableBodyBuilder.prototype.CollectMergeGroup = function (mergeCells, mergeCellPair) {
            var mergeCellList = [];
            mergeCellList.push(mergeCellPair.Item1);
            mergeCellList.push(mergeCellPair.Item2);
            for (var i = 1; i < mergeCellList.length; i++) {
                var nextMergeSource = mergeCellList[i];
                for (var _i = 0, mergeCells_1 = mergeCells; _i < mergeCells_1.length; _i++) {
                    var mergeCell = mergeCells_1[_i];
                    if (CellReference_1.CellReferenceComparer(mergeCell.Item1, nextMergeSource) === 0) {
                        mergeCellList.push(mergeCell.Item2);
                    }
                }
            }
            return mergeCellList;
        };
        DefaultTableBodyBuilder.MapRowByType = function (row, dataRowMapper, aggregateRowMapper) {
            if (row instanceof DataRow_1.DataRow) {
                return dataRowMapper(row);
            }
            else if (row instanceof AggregateRow_1.AggregateRow) {
                return aggregateRowMapper(row);
            }
            else {
                throw new Error("\u65E0\u6CD5\u8BC6\u522B\u7684\u884C\u7C7B\u578B: " + typeof row);
            }
        };
        DefaultTableBodyBuilder.VisitRowByType = function (row, dataRowVisitor, aggregateRowVisitor) {
            if (row instanceof DataRow_1.DataRow) {
                dataRowVisitor(row);
            }
            else if (row instanceof AggregateRow_1.AggregateRow) {
                aggregateRowVisitor(row);
            }
            else {
                throw new Error("\u65E0\u6CD5\u8BC6\u522B\u7684\u884C\u7C7B\u578B: " + typeof row);
            }
        };
        return DefaultTableBodyBuilder;
    }());
    exports.DefaultTableBodyBuilder = DefaultTableBodyBuilder;
});
define("tableBodyBuilder/Impl/AggregateMergeCellsCollector", ["require", "exports", "shared/CellReference"], function (require, exports, CellReference_2) {
    "use strict";
    exports.__esModule = true;
    var AggregateMergeCellsCollector = (function () {
        function AggregateMergeCellsCollector(_mergeCellsCollectors) {
            this._mergeCellsCollectors = _mergeCellsCollectors;
        }
        AggregateMergeCellsCollector.prototype.Collect = function (rows) {
            var mergeCellPairs = [];
            for (var _i = 0, _a = this._mergeCellsCollectors; _i < _a.length; _i++) {
                var collector = _a[_i];
                var pairs = collector.Collect(rows);
                for (var _b = 0, pairs_1 = pairs; _b < pairs_1.length; _b++) {
                    var pair = pairs_1[_b];
                    if (this.IsDistinct(mergeCellPairs, pair)) {
                        mergeCellPairs.push(pair);
                    }
                }
            }
            return mergeCellPairs;
        };
        AggregateMergeCellsCollector.prototype.IsDistinct = function (mergeCellPairs, pair) {
            for (var _i = 0, mergeCellPairs_2 = mergeCellPairs; _i < mergeCellPairs_2.length; _i++) {
                var existsPair = mergeCellPairs_2[_i];
                if (CellReference_2.CellReferenceComparer(existsPair.Item1, pair.Item1) && CellReference_2.CellReferenceComparer(existsPair.Item2, pair.Item2)) {
                    return false;
                }
            }
            return true;
        };
        return AggregateMergeCellsCollector;
    }());
    exports.AggregateMergeCellsCollector = AggregateMergeCellsCollector;
});
define("tableBodyBuilder/TableBodyBuilderConfiguration", ["require", "exports", "tableBodyBuilder/Impl/DefaultTableBodyBuilder", "tableBodyBuilder/Impl/AggregateMergeCellsCollector"], function (require, exports, DefaultTableBodyBuilder_1, AggregateMergeCellsCollector_1) {
    "use strict";
    exports.__esModule = true;
    var TableBodyBuilderConfiguration = (function () {
        function TableBodyBuilderConfiguration() {
        }
        TableBodyBuilderConfiguration.GetInstance = function () {
            return new TableBodyBuilderConfiguration();
        };
        TableBodyBuilderConfiguration.prototype.CreateBuilder = function () {
            return new DefaultTableBodyBuilder_1.DefaultTableBodyBuilder(this._collector, this._dataRow, this._aggregateRows, this._mergeCellsCollector);
        };
        TableBodyBuilderConfiguration.prototype.SetAggregateRowsDefinition = function () {
            var aggregateRows = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                aggregateRows[_i] = arguments[_i];
            }
            this._aggregateRows = aggregateRows;
            var count = {};
            for (var _a = 0, aggregateRows_1 = aggregateRows; _a < aggregateRows_1.length; _a++) {
                var r = aggregateRows_1[_a];
                if (count[r.Name]) {
                    throw new Error("发现重复聚合列定义名");
                }
                else {
                    count[r.Name] = 1;
                }
            }
            return this;
        };
        TableBodyBuilderConfiguration.prototype.SetDataRowDefinition = function (dataRow) {
            this._dataRow = dataRow;
            return this;
        };
        TableBodyBuilderConfiguration.prototype.SetMergeCellsCollectors = function () {
            var mergeCellsCollectors = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                mergeCellsCollectors[_i] = arguments[_i];
            }
            if (mergeCellsCollectors.length === 1) {
                this._mergeCellsCollector = mergeCellsCollectors[0];
            }
            else {
                this._mergeCellsCollector = new AggregateMergeCellsCollector_1.AggregateMergeCellsCollector(mergeCellsCollectors);
            }
            return this;
        };
        TableBodyBuilderConfiguration.prototype.SetRowDataPicker = function (picker) {
            this._collector = picker;
            return this;
        };
        return TableBodyBuilderConfiguration;
    }());
    exports.TableBodyBuilderConfiguration = TableBodyBuilderConfiguration;
});
