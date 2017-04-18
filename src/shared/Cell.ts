export abstract class Cell {
    public Metadata: any;
    public Value: any;

    protected constructor() {
        this.Metadata = {}
        this.Value = null;
    }

    toString(): string {
        let v: any;
        if (this.Value === null) {
            v = "";
        } else {
            v = this.Value;
        }
        return `${v}`
    }
}