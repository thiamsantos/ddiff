export interface Options {
    orderIndependent?: boolean;
}

enum Kind {
    New = 'N',
    Deleted = 'D',
    Edited = 'E',
    Array = 'A'
}

export interface Difference {
    kind: Kind;
    path: (string | number)[];
    lhs: string;
    rhs: string;
    index?: number;
    item: Difference;
}

export function diff(lhs: any, rhs: any, options?: Options): Difference[] {
    return [];
}
