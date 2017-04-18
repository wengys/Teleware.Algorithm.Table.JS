export class CellReference {
    constructor(public RowNum: number, public ColNum: number) {
    }
    toString(): string {
        return `(${this.RowNum}, ${this.ColNum})`;
    }
}

export function CellReferenceComparer(a: CellReference, b: CellReference) {
    if (a.RowNum < b.RowNum) {
        return -1;
    } else if (a.RowNum > b.RowNum) {
        return 1;
    }
    if (a.ColNum < b.ColNum) {
        return -1;
    } else if (a.ColNum > b.ColNum) {
        return 1;
    }
    return 0;
}