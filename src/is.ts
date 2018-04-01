export const enum TypeName {
    null = 'null',
    boolean = 'boolean',
    undefined = 'undefined',
    string = 'string',
    number = 'number',
    symbol = 'symbol',
    Function = 'Function',
    GeneratorFunction = 'GeneratorFunction',
    AsyncFunction = 'AsyncFunction',
    Array = 'Array',
    Buffer = 'Buffer',
    Object = 'Object',
    RegExp = 'RegExp',
    Date = 'Date',
    Error = 'Error',
    Map = 'Map',
    Set = 'Set',
    WeakMap = 'WeakMap',
    WeakSet = 'WeakSet',
    Int8Array = 'Int8Array',
    Uint8Array = 'Uint8Array',
    Uint8ClampedArray = 'Uint8ClampedArray',
    Int16Array = 'Int16Array',
    Uint16Array = 'Uint16Array',
    Int32Array = 'Int32Array',
    Uint32Array = 'Uint32Array',
    Float32Array = 'Float32Array',
    Float64Array = 'Float64Array',
    ArrayBuffer = 'ArrayBuffer',
    SharedArrayBuffer = 'SharedArrayBuffer',
    DataView = 'DataView',
    Promise = 'Promise',
    NaN = 'Nan'
}

export const toString = value => Object.prototype.toString.call(value);
const isOfType = (type: string) => (value: any) => typeof value === type;
const getObjectType = (value: any): TypeName | null => {
    const objectName = toString(value).slice(8, -1) as string;

    if (objectName) {
        return objectName as TypeName;
    }

    return null;
};

const isObjectOfType = (type: TypeName) => (value: any) =>
    getObjectType(value) === type;

export function is(value: any): TypeName {
    if (value === null) {
        return TypeName.null;
    }

    if (value === true || value === false || value instanceof Boolean) {
        return TypeName.boolean;
    }

    const type = typeof value;

    if (type === 'undefined') {
        return TypeName.undefined;
    }

    if (type === 'string' || value instanceof String) {
        return TypeName.string;
    }

    if (type === 'number' || value instanceof Number) {
        if (Number.isNaN(value)) {
            return TypeName.NaN;
        }

        return TypeName.number;
    }

    if (type === 'symbol') {
        return TypeName.symbol;
    }

    if (Array.isArray(value)) {
        return TypeName.Array;
    }

    const tagType = getObjectType(value);
    if (tagType) {
        return tagType;
    }

    return TypeName.Object;
}
