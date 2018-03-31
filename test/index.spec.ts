import {diff} from '../src/index';

describe('A target that has no properties', () => {
    it('shows no differences when compared to another empty object', () => {
        expect(diff({}, {})).toEqual([]);
    });

    describe('when compared to a different type of keyless object', () => {
        const comparandTuples = [
            [
                'an array',
                {
                    key: []
                }
            ],
            [
                'an object',
                {
                    key: {}
                }
            ],
            [
                'a date',
                {
                    key: new Date()
                }
            ],
            [
                'a null',
                {
                    key: null
                }
            ],
            [
                'a regexp literal',
                {
                    key: /a/
                }
            ],
            [
                'Math',
                {
                    key: Math
                }
            ]
        ];

        comparandTuples.forEach(function(lhsTuple) {
            comparandTuples.forEach(function(rhsTuple) {
                if (lhsTuple[0] === rhsTuple[0]) {
                    return;
                }
                it(
                    'shows differences when comparing ' +
                        lhsTuple[0] +
                        ' to ' +
                        rhsTuple[0],
                    () => {
                        const actual = diff(lhsTuple[1], rhsTuple[1]);
                        expect(actual).toBeTruthy();
                        expect(actual.length).toEqual(1);
                        expect(actual[0]).toHaveProperty('kind');
                        expect(actual[0].kind).toEqual('E');
                    }
                );
            });
        });
    });

    describe('when compared with an object having other properties', () => {
        it('the differences are reported', () => {
            const comparand = {
                other: 'property',
                another: 13.13
            };
            const actual = diff({}, comparand);
            expect(actual).toBeTruthy();
            expect(actual.length).toEqual(2);

            expect(actual[0]).toHaveProperty('kind');
            expect(actual[0].kind).toEqual('N');
            expect(actual[0]).toHaveProperty('path');
            expect(actual[0].path).toBeInstanceOf(Array);
            expect(actual[0].path[0]).toEqual('other');
            expect(actual[0]).toHaveProperty('rhs');
            expect(actual[0].rhs).toEqual('property');

            expect(actual[1]).toHaveProperty('kind');
            expect(actual[1].kind).toEqual('N');
            expect(actual[1]).toHaveProperty('path');
            expect(actual[1].path).toBeInstanceOf(Array);
            expect(actual[1].path[0]).toEqual('another');
            expect(actual[1]).toHaveProperty('rhs');
            expect(actual[1].rhs).toEqual(13.13);
        });
    });
});

describe('A target that has one property', () => {
    const lhs = {
        one: 'property'
    };

    it('shows no differences when compared to itself', () => {
        expect(diff(lhs, lhs)).toEqual([]);
    });

    it('shows the property as removed when compared to an empty object', () => {
        const actual = diff(lhs, {});
        expect(actual).toBeTruthy();
        expect(actual.length).toEqual(1);
        expect(actual[0]).toHaveProperty('kind');
        expect(actual[0].kind).toEqual('D');
    });

    it('shows the property as edited when compared to an object with null', () => {
        const actual = diff(lhs, {
            one: null
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toEqual(1);
        expect(actual[0]).toHaveProperty('kind');
        expect(actual[0].kind).toEqual('E');
    });

    it('shows the property as edited when compared to an array', () => {
        const actual = diff(lhs, ['one']);
        expect(actual).toBeTruthy();
        expect(actual.length).toEqual(1);
        expect(actual[0]).toHaveProperty('kind');
        expect(actual[0].kind).toEqual('E');
    });
});

describe('A target that has null value', () => {
    const lhs = {
        key: null
    };

    it('shows no differences when compared to itself', () => {
        expect(diff(lhs, lhs)).toEqual([]);
    });

    it('shows the property as removed when compared to an empty object', () => {
        const actual = diff(lhs, {});
        expect(actual).toBeTruthy();
        expect(actual.length).toEqual(1);
        expect(actual[0]).toHaveProperty('kind');
        expect(actual[0].kind).toEqual('D');
    });

    it('shows the property is changed when compared to an object that has value', () => {
        const actual = diff(lhs, {key: 'value'});
        expect(actual).toBeTruthy();
        expect(actual.length).toEqual(1);
        expect(actual[0]).toHaveProperty('kind');
        expect(actual[0].kind).toEqual('E');
    });

    it('shows that an object property is changed when it is set to null', () => {
        lhs.key = {
            nested: 'value'
        };
        const actual = diff(lhs, {key: null});
        expect(actual).toBeTruthy();
        expect(actual.length).toEqual(1);
        expect(actual[0]).toHaveProperty('kind');
        expect(actual[0].kind).toEqual('E');
    });
});

describe('A target that has a date value', () => {
    it('shows the property is changed with a new date value', () => {
        const lhs = {
            key: new Date(555555555555)
        };
        const actual = diff(lhs, {key: new Date(777777777777)});
        expect(actual).toBeTruthy();
        expect(actual.length).toEqual(1);
        expect(actual[0]).toHaveProperty('kind');
        expect(actual[0].kind).toEqual('E');
    });
});

describe('A target that has a NaN', () => {
    const lhs = {
        key: NaN
    };

    it('shows the property is changed when compared to another number', () => {
        const actual = diff(lhs, {key: 0});
        expect(actual).toBeTruthy();
        expect(actual.length).toEqual(1);
        expect(actual[0]).toHaveProperty('kind');
        expect(actual[0].kind).toEqual('E');
    });

    it('shows no differences when compared to another NaN', () => {
        const actual = diff(lhs, {key: NaN});
        expect(actual).toEqual([]);
    });
});

describe('A target that has nested values', () => {
    const nestedOne = {
        noChange: 'same',
        levelOne: {
            levelTwo: 'value'
        },
        arrayOne: [
            {
                objValue: 'value'
            }
        ]
    };
    const nestedTwo = {
        noChange: 'same',
        levelOne: {
            levelTwo: 'another value'
        },
        arrayOne: [
            {
                objValue: 'new value'
            },
            {
                objValue: 'more value'
            }
        ]
    };

    it('shows no differences when compared to itself', () => {
        expect(diff(nestedOne, nestedOne)).toEqual([]);
    });

    it('shows the property as removed when compared to an empty object', () => {
        const actual = diff(nestedOne, {});
        expect(actual).toBeTruthy();
        expect(actual.length).toEqual(3);
        expect(actual[0]).toHaveProperty('kind');
        expect(actual[0].kind).toEqual('D');
        expect(actual[1]).toHaveProperty('kind');
        expect(actual[1].kind).toEqual('D');
    });

    it('shows the property is changed when compared to an object that has value', () => {
        const actual = diff(nestedOne, nestedTwo);
        expect(actual).toBeTruthy();
        expect(actual.length).toEqual(3);
    });

    it('shows the property as added when compared to an empty object on left', () => {
        const actual = diff({}, nestedOne);
        expect(actual).toBeTruthy();
        expect(actual.length).toEqual(3);
        expect(actual[0]).toHaveProperty('kind');
        expect(actual[0].kind).toEqual('N');
    });
});

describe('regression test for bug #10, ', () => {
    const lhs = {
        id: 'Release',
        phases: [
            {
                id: 'Phase1',
                tasks: [
                    {
                        id: 'Task1'
                    },
                    {
                        id: 'Task2'
                    }
                ]
            },
            {
                id: 'Phase2',
                tasks: [
                    {
                        id: 'Task3'
                    }
                ]
            }
        ]
    };
    const rhs = {
        id: 'Release',
        phases: [
            {
                // E: Phase1 -> Phase2
                id: 'Phase2',
                tasks: [
                    {
                        id: 'Task3'
                    }
                ]
            },
            {
                id: 'Phase1',
                tasks: [
                    {
                        id: 'Task1'
                    },
                    {
                        id: 'Task2'
                    }
                ]
            }
        ]
    };
});

describe('Comparing regexes should work', () => {
    const lhs = /foo/;
    const rhs = /foo/i;

    it('can compare regex instances', () => {
        const actual = diff(lhs, rhs);

        expect(actual.length).toEqual(1);

        expect(actual[0].kind).toEqual('E');
        expect(actual[0].path).toBeFalsy();
        expect(actual[0].lhs).toEqual('/foo/');
        expect(actual[0].rhs).toEqual('/foo/i');
    });
});

describe('subject.toString is not a function', () => {
    it('should not throw a TypeError', () => {
        const lhs = {
            left: 'yes',
            right: 'no'
        };
        const rhs = {
            left: {
                toString: true
            },
            right: 'no'
        };
        const actual = diff(lhs, rhs);

        expect(actual.length).toEqual(1);
    });
});

describe('regression test for issue #83', () => {
    const lhs = {
        date: null
    };
    const rhs = {
        date: null
    };

    it('should not detect a difference', () => {
        expect(diff(lhs, rhs)).toEqual([]);
    });
});

describe('regression test for issue #70', () => {
    it('should detect a difference with undefined property on lhs', () => {
        const actual = diff({foo: undefined}, {});

        expect(actual).toBeInstanceOf(Array);
        expect(actual.length).toEqual(1);

        expect(actual[0].kind).toEqual('D');
        expect(typeof actual[0].path).toEqual('array');
        expect(actual[0].path).toHaveLength(1);
        expect(actual[0].path[0]).toEqual('foo');
        expect(actual[0].lhs).toEqual(undefined);
    });

    it('should detect a difference with undefined property on rhs', () => {
        const actual = diff({}, {foo: undefined});

        expect(actual).toBeInstanceOf(Array);
        expect(actual.length).toEqual(1);

        expect(actual[0].kind).toEqual('N');
        expect(typeof actual[0].path).toEqual('array');
        expect(actual[0].path).toHaveLength(1);
        expect(actual[0].path[0]).toEqual('foo');
        expect(actual[0].rhs).toEqual(undefined);
    });
});

describe('regression test for issue #98', () => {
    it('should not detect a difference with two undefined property values', () => {
        const lhs = {foo: undefined};
        const rhs = {foo: undefined};
        expect(diff(lhs, rhs)).toEqual([]);
    });
});

describe('regression tests for issue #102', () => {
    it('should not throw a TypeError', () => {
        const actual = diff(null, undefined);

        expect(actual).toBeInstanceOf(Array);
        expect(actual.length).toEqual(1);

        expect(actual[0].kind).toEqual('D');
        expect(actual[0].lhs).toEqual(null);
    });

    it('should not throw a TypeError', () => {
        const actual = diff(Object.create(null), {foo: undefined});

        expect(actual).toBeInstanceOf(Array);
        expect(actual.length).toEqual(1);

        expect(actual[0].kind).toEqual('N');
        expect(actual[0].rhs).toEqual(undefined);
    });
});

describe('Order indepedent array comparison should work', () => {
    it('can compare simple arrays in an order independent fashion', () => {
        const lhs = [1, 2, 3];
        const rhs = [1, 3, 2];

        const actual = diff(lhs, rhs, {orderIndependent: true});
        expect(actual).toEqual([]);
    });

    it('still works with repeated elements', () => {
        const lhs = [1, 1, 2];
        const rhs = [1, 2, 1];

        const actual = diff(lhs, rhs, {orderIndependent: true});
        expect(actual).toEqual([]);
    });

    it('works on complex objects', () => {
        const obj1 = {
            foo: 'bar',
            faz: [
                1,
                'pie',
                {
                    food: 'yum'
                }
            ]
        };

        const obj2 = {
            faz: [
                'pie',
                {
                    food: 'yum'
                },
                1
            ],
            foo: 'bar'
        };

        const actual = diff(obj1, obj2, {orderIndependent: true});
        expect(actual).toEqual([]);
    });

    it('should report some difference in non-equal arrays', () => {
        const lhs = [1, 2, 3];
        const rhs = [2, 2, 3];

        const actual = diff(lhs, rhs, {orderIndependent: true});
        expect(actual.length).toBeTruthy();
    });
});
