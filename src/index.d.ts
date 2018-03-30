import {Options, Difference} from './index';

declare module 'ddiff' {
    export = ddiff;
}

declare namespace ddiff {
    function diff(lhs: any, rhs: any, options?: Options): Difference[];
}
