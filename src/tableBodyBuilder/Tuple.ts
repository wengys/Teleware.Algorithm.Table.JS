export class Tuple<T1, T2> {
    constructor(public Item1: T1, public Item2: T2) {

    }
    static Create<T1, T2>(item1: T1, item2: T2) {
        return new Tuple<T1, T2>(item1, item2);
    }
}