import {is, toString, TypeName} from './is';

type Key = string | number;
type Path = Key[];
type DiffObject = any;
type OrderIndependence = boolean;

interface IStackItem {
    lhs: DiffObject;
    rhs: DiffObject;
}

interface IStackArrayItem {
    lhs: DiffObject[];
    rhs: DiffObject[];
}

type Stack = IStackItem[];

enum StackProperty {
    Lhs = 'lhs',
    Rhs = 'rhs'
}

export interface IOptions {
    orderIndependent?: OrderIndependence;
}

export enum Kind {
    New = 'N',
    Deleted = 'D',
    Edited = 'E',
    Array = 'A'
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

type Difference = INormalDifference | IArrayDifference;

export function diff(
    lhs: DiffObject,
    rhs: DiffObject,
    options: IOptions = {orderIndependent: false}
): Difference[] {
    return deepDiff({lhs, rhs}, [], [], null, options.orderIndependent);
}

function deepDiff(
    item: IStackItem,
    changes: Difference[],
    path: Path,
    key: Key,
    orderIndependent: OrderIndependence
): Difference[] {
    const currentChanges: Difference[] = [].concat(changes);

    const {lhs, rhs} = item;
    const currentPath: Path = getCurrentPath(path, key);
    if (
        is(lhs) === TypeName.RegExp &&
        is(rhs) === TypeName.RegExp &&
        toString(lhs) === toString(rhs)
    ) {
        return currentChanges;
    }

    if (!lhs && rhs) {
        return [...currentChanges, createDiffNew(item, path)];
    }

    if (lhs && !rhs) {
        return [...currentChanges, createDiffDeleted(item, path)];
    }

    if (
        is(lhs) !== is(rhs) ||
        (is(lhs) === TypeName.Date && !isSameDate(<Date>lhs, <Date>rhs))
    ) {
        return [...currentChanges, createDiffEdited(item, path)];
    }

    if (is(lhs) === TypeName.Array) {
        const arrayChanges: Difference[] = deepDiffArray(
            <IStackArrayItem>item,
            currentPath
        );

        return [...currentChanges, ...arrayChanges];
    }

    return currentChanges;
}

function isSameDate(leftDate: Date, rightDate: Date): boolean {
    return leftDate.getTime() - rightDate.getTime() === 0;
}

function deepDiffArray(item: IStackArrayItem, currentPath: Path): Difference[] {
    const {lhs, rhs} = item;

    let allChanges: Difference[] = [];
    if (lhs.length > rhs.length) {
        const itemsNumber: number = lhs.length - rhs.length;
        const leftHandItems: DiffObject[] = lhs.slice(-itemsNumber);

        const arrayChanges: IArrayDifference[] = leftHandItems.map(
            (leftHandItem: DiffObject, index: number): IArrayDifference => {
                return createDiffArray(
                    currentPath,
                    index + rhs.length,
                    createDiffDeleted({
                        lhs: leftHandItem,
                        rhs: undefined
                    })
                );
            }
        );

        allChanges = allChanges.concat(arrayChanges);
    } else if (rhs.length > lhs.length) {
        const itemsNumber: number = rhs.length - lhs.length;
        const rightHandItems: DiffObject[] = rhs.slice(-itemsNumber);

        const arrayChanges: IArrayDifference[] = rightHandItems.map(
            (rightHandItem: DiffObject, index: number): IArrayDifference => {
                return createDiffArray(
                    currentPath,
                    index + lhs.length,
                    createDiffNew({lhs: undefined, rhs: rightHandItem})
                );
            }
        );
        allChanges = allChanges.concat(arrayChanges);
    }

    return allChanges;
}

function createDiffArray(
    path: Path,
    index: number,
    item: INormalDifference
): IArrayDifference {
    return {
        kind: Kind.Array,
        path: path,
        item: item,
        index: index
    };
}

function createDiffNew(stack: IStackItem, path?: Path): INormalDifference {
    return {
        kind: Kind.New,
        path: path,
        ...stack
    };
}
function createDiffDeleted(stack: IStackItem, path?: Path): INormalDifference {
    return {
        kind: Kind.Deleted,
        path: path,
        ...stack
    };
}

function createDiffEdited(stack: IStackItem, path?: Path): INormalDifference {
    return {
        kind: Kind.Edited,
        path: path,
        ...stack
    };
}

function getCurrentPath(path: Path, key: Key): Path {
    if (key === null) {
        return path;
    }

    return [...path, key];
}
