declare module 'ddiff' {
    export = ddiff;
}

export type Key = string | number;
export type Path = Key[];
export type DiffObject = any;

export enum Kind {
    New = 'N',
    Deleted = 'D',
    Edited = 'E',
    Array = 'A'
}

export interface IStackItem {
    lhs: DiffObject;
    rhs: DiffObject;
}

export interface INormalDifference extends IStackItem {
    kind: Kind;
    path: Path;
}

export interface IArrayDifference {
    kind: Kind.Array;
    path: Path;
    index: number;
    item: INormalDifference;
}

export type Difference = INormalDifference | IArrayDifference;

declare namespace ddiff {
    function diff(lhs: DiffObject, rhs: DiffObject): Difference[];
}
