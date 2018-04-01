import {is, TypeName} from './is';

type Key = string | number;
type Path = Key[];
type DiffObject = any;

interface IStackItem {
    lhs: DiffObject;
    rhs: DiffObject;
}

interface IStackArrayItem {
    lhs: DiffObject[];
    rhs: DiffObject[];
}

interface IStackObjectItem {
    lhs: Object;
    rhs: Object;
}

enum StackProperty {
    Lhs = 'lhs',
    Rhs = 'rhs'
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

export function diff(lhs: DiffObject, rhs: DiffObject): Difference[] {
    return deepDiff({lhs, rhs}, []);
}

function deepDiff(item: IStackItem, currentPath: Path): Difference[] {
    const {lhs, rhs} = item;

    if (Object.is(lhs, rhs)) {
        return [];
    }

    if (is(lhs) === TypeName.RegExp && is(rhs) === TypeName.RegExp) {
        return deepDiff(
            {lhs: lhs.toString(), rhs: rhs.toString()},
            currentPath
        );
    }

    if (is(lhs) === TypeName.undefined && rhs) {
        return [createDiffNew(item, currentPath)];
    }

    if ((lhs || is(lhs) === TypeName.null) && is(rhs) === TypeName.undefined) {
        return [createDiffDeleted(item, currentPath)];
    }

    if (
        is(lhs) !== is(rhs) ||
        (is(lhs) === TypeName.Date && !isSameDate(<Date>lhs, <Date>rhs))
    ) {
        return [createDiffEdited(item, currentPath)];
    }

    if (is(lhs) === TypeName.Array) {
        return deepDiffArray(<IStackArrayItem>item, currentPath);
    }

    if (is(lhs) === TypeName.Object) {
        return deepDiffObject(<IStackObjectItem>item, currentPath);
    }

    if (is(lhs) === TypeName.null || is(lhs) === TypeName.undefined) {
        return [];
    }

    return [createDiffEdited(item, currentPath)];
}

function isSameDate(leftDate: Date, rightDate: Date): boolean {
    return leftDate.getTime() - rightDate.getTime() === 0;
}

function deepDiffObject(
    item: IStackObjectItem,
    currentPath: Path
): Difference[] {
    const {lhs, rhs} = item;
    const leftHandKeys = Object.keys(lhs);
    const rightHandKeys = Object.keys(rhs);

    let currentChanges: Difference[] = [];

    const keysInBothSides = leftHandKeys.filter(key =>
        rightHandKeys.includes(key)
    );

    for (const key of keysInBothSides) {
        currentChanges = currentChanges.concat(
            deepDiff({lhs: lhs[key], rhs: rhs[key]}, currentPath.concat(key))
        );
    }

    const uniqueLeftKeys = leftHandKeys.filter(
        key => !rightHandKeys.includes(key)
    );

    for (const key of uniqueLeftKeys) {
        currentChanges = currentChanges.concat(
            createDiffDeleted(
                {lhs: lhs[key], rhs: undefined},
                currentPath.concat(key)
            )
        );
    }

    const uniqueRightKeys = rightHandKeys.filter(
        key => !leftHandKeys.includes(key)
    );

    for (const key of uniqueRightKeys) {
        currentChanges = currentChanges.concat(
            createDiffNew(
                {lhs: undefined, rhs: rhs[key]},
                currentPath.concat(key)
            )
        );
    }

    return currentChanges;
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

    for (let index = 0; index < lhs.length; index++) {
        if (index > rhs.length) {
            continue;
        }
        allChanges = allChanges.concat(
            deepDiff(
                {lhs: lhs[index], rhs: rhs[index]},
                currentPath.concat(index)
            )
        );
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
