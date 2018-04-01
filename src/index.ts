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

interface IStackObjectItem {
    lhs: Object;
    rhs: Object;
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
    return deepDiff({lhs, rhs}, [], null, options.orderIndependent);
}

function deepDiff(
    item: IStackItem,
    path: Path,
    key: Key,
    orderIndependent: OrderIndependence
): Difference[] {
    const currentChanges: Difference[] = [];

    const {lhs, rhs} = item;

    const currentPath: Path = getCurrentPath(path, key);
    if (
        is(lhs) === TypeName.RegExp &&
        is(rhs) === TypeName.RegExp &&
        toString(lhs) === toString(rhs)
    ) {
        return [];
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
            currentPath,
            orderIndependent
        );

        return [...currentChanges, ...arrayChanges];
    }

    if (is(lhs) === TypeName.Object) {
        const objectChanges: Difference[] = deepDiffObject(
            <IStackObjectItem>item,
            currentPath,
            orderIndependent
        );

        return [...currentChanges, ...objectChanges];
    }

    return currentChanges;
}

function isSameDate(leftDate: Date, rightDate: Date): boolean {
    return leftDate.getTime() - rightDate.getTime() === 0;
}

function deepDiffObject(
    item: IStackObjectItem,
    currentPath: Path,
    orderIndependent: OrderIndependence
): Difference[] {
    const {lhs, rhs} = item;
    const leftHandKeys = Object.keys(lhs);
    const rightHandKeys = Object.keys(rhs);

    const currentChanges: Difference[] = [];
    for (const key of leftHandKeys) {
        const rightHandContainsKey = rightHandKeys.includes(key);
        const rightHand = rightHandContainsKey ? rhs[key] : undefined;
        currentChanges.concat(
            deepDiff(
                {lhs: lhs[key], rhs: rightHand},
                currentPath,
                key,
                orderIndependent
            )
        );
    }

    const uniqueRightKeys = rightHandKeys.filter(
        key => !leftHandKeys.includes(key)
    );

    for (const key of uniqueRightKeys) {
        currentChanges.concat(
            deepDiff(
                {lhs: undefined, rhs: rhs[key]},
                currentPath,
                key,
                orderIndependent
            )
        );
    }

    return currentChanges;
}

function deepDiffArray(
    item: IStackArrayItem,
    currentPath: Path,
    orderIndependent: OrderIndependence
): Difference[] {
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

    for (let index = 0; index < rhs.length; index++) {
        allChanges = allChanges.concat(
            deepDiff(
                {lhs: lhs[index], rhs: rhs[index]},
                currentPath,
                index,
                orderIndependent
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

function getCurrentPath(path: Path, key: Key): Path {
    if (key === null) {
        return path;
    }

    return [...path, key];
}
