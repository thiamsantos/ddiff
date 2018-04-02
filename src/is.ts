export const enum TypeName {
    null = 'null',
    boolean = 'boolean',
    undefined = 'undefined',
    string = 'string',
    number = 'number',
    Function = 'Function',
    Array = 'Array',
    Object = 'Object',
    RegExp = 'RegExp',
    Date = 'Date',
    NaN = 'Nan'
}

// tslint:disable-next-line:no-any
function toString(value: any): string {
    // tslint:disable-next-line:no-unsafe-any
    return Object.prototype.toString.call(value);
}

// tslint:disable-next-line:no-any
export function is(value: any): TypeName {
    if (value === null) {
        return TypeName.null;
    }

    if (value === true || value === false || value instanceof Boolean) {
        return TypeName.boolean;
    }

    const isType: string = typeof value;

    if (isType === 'undefined') {
        return TypeName.undefined;
    }

    if (isType === 'string' || value instanceof String) {
        return TypeName.string;
    }

    // tslint:disable-next-line:no-unsafe-any
    if (Number.isNaN(value)) {
        return TypeName.NaN;
    }

    if (isType === 'number' || value instanceof Number) {
        return TypeName.number;
    }

    if (Array.isArray(value)) {
        return TypeName.Array;
    }

    if (value instanceof Date || toString(value) === '[object Date]') {
        return TypeName.Date;
    }

    if (value instanceof RegExp || toString(value) === '[object RegExp]') {
        return TypeName.RegExp;
    }

    return TypeName.Object;
}
