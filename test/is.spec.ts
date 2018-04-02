import {is, TypeName} from '../src/is';

describe('check types', () => {
    it('should return null', () => {
        expect(is(null)).toBe(TypeName.null);
    });

    it('should return boolean', () => {
        expect(is(true)).toBe(TypeName.boolean);
        expect(is(false)).toBe(TypeName.boolean);
        expect(is(new Boolean())).toBe(TypeName.boolean);
    });

    it('should return undefined', () => {
        expect(is(undefined)).toBe(TypeName.undefined);
    });

    it('should return string', () => {
        expect(is('super string')).toBe(TypeName.string);
        expect(is(new String())).toBe(TypeName.string);
    });

    it('should return NaN', () => {
        expect(is(NaN)).toBe(TypeName.NaN);
    });

    it('should return Array', () => {
        expect(is([])).toBe(TypeName.Array);
    });

    it('should return Date', () => {
        expect(is(new Date())).toBe(TypeName.Date);
    });

    it('should return RegExp', () => {
        expect(is(new RegExp('something'))).toBe(TypeName.RegExp);
        expect(is(/something/)).toBe(TypeName.RegExp);
    });

    it('should return Object', () => {
        expect(is({})).toBe(TypeName.Object);
    });
});
