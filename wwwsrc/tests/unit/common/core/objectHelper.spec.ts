/// <reference path="../../../../typings/app.d.ts" />

import { ObjectHelper } from "../../../../app/common/core/objectHelper";

describe("the ObjectHelper module", () => {
    let objectHelper: ObjectHelper;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        objectHelper = new ObjectHelper();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(objectHelper).toBeDefined();
    });

    describe("getClassName", () => {
        it("can not get a class name for a null subject", () => {
            expect(ObjectHelper.getClassName(null)).toEqual("<no object>");
        });

        it("can not get a class name for an undefined subject", () => {
            expect(ObjectHelper.getClassName(undefined)).toEqual("<no object>");
        });

        it("can not get a class name for a non object", () => {
            expect(ObjectHelper.getClassName({constructor: "blah"})).toEqual("<no object>");
        });

        it("can not get a class name for a Object", () => {
            expect(ObjectHelper.getClassName({})).toEqual("Object");
        });

        it("can not get a class name for a String", () => {
            expect(ObjectHelper.getClassName("blah blah")).toEqual("String");
        });

        it("can get a class name for an object", () => {
            expect(ObjectHelper.getClassName(objectHelper)).toEqual("ObjectHelper");
        });

        it("can get a class name for a class", () => {
            expect(ObjectHelper.getClassName(ObjectHelper)).toEqual("ObjectHelper");
        });
    });

    describe("getPathValue", () => {
        it("can not get a path value for a null subject", () => {
            expect(ObjectHelper.getPathValue(null, null)).toBeUndefined();
        });

        it("can not get a path value for an undefined subject", () => {
            expect(ObjectHelper.getPathValue(undefined, undefined)).toBeUndefined();
        });

        it("can not get a path value for a null path", () => {
            let obj = {};
            expect(ObjectHelper.getPathValue(obj, null)).toBeUndefined();
        });

        it("can not get a path value for an undefined path", () => {
            let obj = {};
            expect(ObjectHelper.getPathValue(obj, undefined)).toBeUndefined();
        });

        it("can not get a path value for an empty path", () => {
            let obj = {};
            expect(ObjectHelper.getPathValue(obj, "")).toBeUndefined();
        });

        it("can not get a path value for an unknown path", () => {
            let obj = {};
            expect(ObjectHelper.getPathValue(obj, "myProp")).toBeUndefined();
        });

        it("can not get a path value for an unknown path", () => {
            let obj = {};
            expect(ObjectHelper.getPathValue(obj, "myProp")).toBeUndefined();
        });

        it("can get a value for a known path", () => {
            let obj = {
                myProp: "val"
            };
            expect(ObjectHelper.getPathValue(obj, "myProp")).toEqual("val");
        });

        it("can get a value for a known child path", () => {
            let obj = {
                myChild: {
                    myProp: "val"
                }
            };
            expect(ObjectHelper.getPathValue(obj, "myChild.myProp")).toEqual("val");
        });

        it("can not get a value for a known child path that does not exist", () => {
            let obj = {
                myChild: {}
            };
            expect(ObjectHelper.getPathValue(obj, "myChild.myProp")).toBeUndefined();
        });

        it("can not get a value for a known child path that is null", () => {
            let obj: { myChild: any } = {
                myChild: null
            };
            expect(ObjectHelper.getPathValue(obj, "myChild.myProp")).toBeUndefined();
        });

        it("can not get a value for a known child path that is undefined", () => {
            let obj: { myChild: any } = {
                myChild: undefined
            };
            expect(ObjectHelper.getPathValue(obj, "myChild.myProp")).toBeUndefined();
        });

        it("can get a value for a known child..child path", () => {
            let obj = {
                myChild: {
                    myChild2: {
                        myProp: "val"
                    }
                }
            };
            expect(ObjectHelper.getPathValue(obj, "myChild.myChild2.myProp")).toEqual("val");
        });

        it("can not get a value for a known child..child path", () => {
            let obj: { myChild: { myChild2: any } } = {
                myChild: {
                    myChild2: null
                }
            };
            expect(ObjectHelper.getPathValue(obj, "myChild.myChild2.myProp")).toBeUndefined();
        });

        it("can not get a value for a false property", () => {
            let obj: { myChild: { myChild2: any } } = {
                myChild: {
                    myChild2: false
                }
            };
            expect(ObjectHelper.getPathValue(obj, "myChild.myChild2")).toEqual(false);
        });

        it("can get a value for an array index property", () => {
            let obj: { myChild: { myChildren: string[] } } = {
                myChild: {
                    myChildren: ["1", "2"]
                }
            };
            expect(ObjectHelper.getPathValue(obj, "myChild.myChildren[0]")).toEqual("1");
            expect(ObjectHelper.getPathValue(obj, "myChild.myChildren[1]")).toEqual("2");
        });

        it("can not get a value for an array index out of bounds", () => {
            let obj: { myChild: { myChildren: string[] } } = {
                myChild: {
                    myChildren: ["1", "2"]
                }
            };
            expect(ObjectHelper.getPathValue(obj, "myChild.myChildren[2]")).toEqual(undefined);
        });

        it("can not get a value for an unclosed array index", () => {
            let obj: { myChild: { myChildren: string[] } } = {
                myChild: {
                    myChildren: ["1", "2"]
                }
            };
            expect(ObjectHelper.getPathValue(obj, "myChild.myChildren[2")).toEqual(undefined);
        });

        it("can not get a value for an index when object is not array", () => {
            let obj: { myChild: { myChildren: string } } = {
                myChild: {
                    myChildren: "aaaaa"
                }
            };
            expect(ObjectHelper.getPathValue(obj, "myChild.myChildren[2")).toEqual(undefined);
        });

        it("can get a value for a second array index property", () => {
            let obj: { myChild: { myChildren: { children2: string[] }[] } } = {
                myChild: {
                    myChildren: [
                        {
                            children2: ["1", "2"]
                        },
                        {
                            children2: ["3", "4"]
                        }]
                }
            };
            expect(ObjectHelper.getPathValue(obj, "myChild.myChildren[0].children2[0]")).toEqual("1");
            expect(ObjectHelper.getPathValue(obj, "myChild.myChildren[1].children2[1]")).toEqual("4");
        });
    });

    describe("object sanitise", () => {

        describe("sanitizeObjectStringsForHttp", () => {
            it("can remove carriage returns", () => {
                let obj = {
                    dirtyString1: "A\n\rB\nC",
                    nestedDirtyString: {
                        dirtyString2: "A\n\rB\nC"
                    }
                };
                ObjectHelper.sanitizeObjectStringsForHttp(obj);
                expect(obj.dirtyString1).toEqual("A B C");
                expect(obj.nestedDirtyString.dirtyString2).toEqual("A B C");
            });
        });

        describe("sanitizeObjectStringsJobUpdate", () => {
            it("can remove emojis" , () => {
                let obj = {
                    foo: "bar💩baz"
                };
                ObjectHelper.sanitizeObjectStringsForJobUpdate(obj);
                expect(obj.foo).toEqual("bar baz");
            });

            it("can remove many emojis" , () => {
                let obj = {
                    foo: "bar💩baz💩buzz👨‍💻fizz"
                };
                ObjectHelper.sanitizeObjectStringsForJobUpdate(obj);
                expect(obj.foo).toEqual("bar baz buzz fizz");
            });

            it("can work appropriately across the character range boundaries", () => {
                let obj = {
                    unitSeparator: "-\x1F-", // out of range
                    space: "-\x20\-", // start of range
                    tilda: "-\x7E-", // end of range
                    del: "-\x7F-"  // out of range
                };
                ObjectHelper.sanitizeObjectStringsForJobUpdate(obj);
                expect(obj).toEqual({
                    unitSeparator: "- -",
                    space: "- -", // space resolves to space
                    tilda: "-~-",
                    del: "- -"
                });
            });

            it("can retain the expected range of characters", () => {
                let obj = {
                    normals: "the quick brown fox jumps over the lazy dog THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG 1234567890 _-+=!\"£$%^&*(){[}]:;@'~#<,>.?/|\\`"
                };
                ObjectHelper.sanitizeObjectStringsForJobUpdate(obj);
                expect(obj).toEqual({
                    normals: "the quick brown fox jumps over the lazy dog THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG 1234567890 _-+=!\"£$%^&*(){[}]:;@'~#<,>.?/|\\`"
                });
            });

            it("can handle arrays", () => {
                let obj = {
                    arr1: [
                        "bar💩baz"
                    ],
                    arr2: [
                        {foo: "bar💩bazz"}
                    ],
                    arr3: [
                        {foo: [
                            {
                                bar: "bar💩bazzz"
                            }
                        ]}
                    ]
                };
                ObjectHelper.sanitizeObjectStringsForJobUpdate(obj);
                expect(obj.arr1[0]).toEqual("bar baz");
                expect(obj.arr2[0].foo).toEqual("bar bazz");
                expect(obj.arr3[0].foo[0].bar).toEqual("bar bazzz");
            });

            it("can handle nulls and undefines", () => {
                let obj = {
                    foo: null,
                    bar: undefined,
                    baz: 1,
                    fizz: new Date(),
                    obj: {
                        buzz: "hi"
                    }
                };
                ObjectHelper.sanitizeObjectStringsForJobUpdate(obj);
                expect(obj.obj.buzz).toEqual("hi");
            });

            it("can retain strings", () => {
                let obj = {
                    a: "foo",
                    b: "bar",
                    c: "bar💩baz",
                    d: "bar💩bazz",
                    e: "bar👨‍💻bazzz"
                };

                let retainedStrings = [
                    "bar💩baz",
                    "bar💩bazz"
                ];
                ObjectHelper.sanitizeObjectStringsForJobUpdate(obj, retainedStrings);
                expect(obj.a).toEqual("foo");
                expect(obj.b).toEqual("bar");
                expect(obj.c).toEqual("bar💩baz");
                expect(obj.d).toEqual("bar💩bazz");
                expect(obj.e).toEqual("bar bazzz");
            })
        });
    });

    describe("getAllStringsFromObject", () => {
        it("can get all strings from an object", () => {
            let obj = {
                a: "aa",
                b: "bb",
                c: undefined,
                d: null,
                obj: {
                    c: "cc",
                    a: "aa",
                    b: "bb",
                    arr: [
                        "dd", "ee", "aa", "bb", null, undefined,
                        { f: "ff" }
                    ]
                }
            };

            let foundStrings = ObjectHelper.getAllStringsFromObject(obj);
            expect(foundStrings).toEqual(["aa", "bb", "cc", "dd", "ee", "ff"]);
        });
    });

    describe("isComparable", () => {
        it("when both are undefined", () => {
            expect(ObjectHelper.isComparable(undefined, undefined)).toEqual(true);
        });
        it("when one is undefined", () => {
            expect(ObjectHelper.isComparable(undefined, {})).toEqual(false);
        });
        it("when second is undefined", () => {
            expect(ObjectHelper.isComparable({}, undefined)).toEqual(false);
        });
        it("when both are null", () => {
            expect(ObjectHelper.isComparable(null, null)).toEqual(true);
        });
        it("when one is null", () => {
            expect(ObjectHelper.isComparable(null, {})).toEqual(false);
        });
        it("when second is null", () => {
            expect(ObjectHelper.isComparable({}, null)).toEqual(false);
        });
        it("when both are false", () => {
            expect(ObjectHelper.isComparable(false, false)).toEqual(true);
        });
        it("when one is false", () => {
            expect(ObjectHelper.isComparable(false, true)).toEqual(false);
        });
        it("when both are true", () => {
            expect(ObjectHelper.isComparable(true, true)).toEqual(true);
        });
        it("when one is true", () => {
            expect(ObjectHelper.isComparable(true, false)).toEqual(false);
        });
        it("when both are same strings", () => {
            expect(ObjectHelper.isComparable("aaa", "aaa")).toEqual(true);
        });
        it("when they are different string", () => {
            expect(ObjectHelper.isComparable("aaa", "AAA")).toEqual(false);
        });
        it("when both are same numbers", () => {
            expect(ObjectHelper.isComparable(5, 5)).toEqual(true);
        });
        it("when they are different numbers", () => {
            expect(ObjectHelper.isComparable(5, 6)).toEqual(false);
        });
        it("when both are same NaN", () => {
            expect(ObjectHelper.isComparable(NaN, NaN)).toEqual(true);
        });
        it("when they are different NaN", () => {
            expect(ObjectHelper.isComparable(NaN, 1)).toEqual(false);
        });
        it("when both are same dates", () => {
            expect(ObjectHelper.isComparable(new Date(2016, 1, 1), new Date(2016, 1, 1))).toEqual(true);
        });
        it("when they are different dates", () => {
            expect(ObjectHelper.isComparable(new Date(2016, 1, 1), new Date(2016, 1, 2))).toEqual(false);
        });
        it("when they are invalid dates", () => {
            expect(ObjectHelper.isComparable(new Date(""), new Date(""))).toEqual(true);
        });
        it("when both are same arrays", () => {
            let arr1 = [1, 2, 3];
            let arr2 = [1, 2, 3];
            expect(ObjectHelper.isComparable(arr1, arr2)).toEqual(true);
        });
        it("when they are different arrays", () => {
            let arr1 = [1, 2, 3];
            let arr2 = [2, 3, 4];
            expect(ObjectHelper.isComparable(arr1, arr2)).toEqual(false);
        });
        it("when they are different array lengths1", () => {
            let arr1 = [1, 2, 3];
            let arr2 = [1, 2, 3, 4];
            expect(ObjectHelper.isComparable(arr1, arr2)).toEqual(false);
        });
        it("when they are different array lengths2", () => {
            let arr1 = [1, 2, 3, 4];
            let arr2 = [1, 2, 3];
            expect(ObjectHelper.isComparable(arr1, arr2)).toEqual(false);
        });
        it("when both are same objects", () => {
            let obj1 = { "a": 1, "b": 2, "c": 3 };
            let obj2 = { "a": 1, "b": 2, "c": 3 };
            expect(ObjectHelper.isComparable(obj1, obj2)).toEqual(true);
        });
        it("when they are same keyed objects with different order", () => {
            let obj1 = { "a": 1, "b": 2, "c": 3 };
            let obj2 = { "b": 2, "a": 1, "c": 3 };
            expect(ObjectHelper.isComparable(obj1, obj2)).toEqual(true);
        });
        it("when they are different keyed objects", () => {
            let obj1 = { "a": 1, "b": 2, "c": 3 };
            let obj2 = { "d": 1, "e": 2, "f": 3 };
            expect(ObjectHelper.isComparable(obj1, obj2)).toEqual(false);
        });
        it("when they are different keyed objects 1", () => {
            let obj1 = { "a": 1, "b": 2, "c": 3, "d": 4 };
            let obj2 = { "a": 1, "b": 2, "c": 3 };
            expect(ObjectHelper.isComparable(obj1, obj2)).toEqual(false);
        });
        it("when they are different keyed objects 2", () => {
            let obj1 = { "a": 1, "b": 2, "c": 3 };
            let obj2 = { "a": 1, "b": 2, "c": 3, "d": 4 };
            expect(ObjectHelper.isComparable(obj1, obj2)).toEqual(false);
        });
        it("when they have undefined keys", () => {
            let obj1: { a: number, b: number, c: number} = { "a": 1, "b": 2, "c": undefined };
            let obj2 = { "a": 1, "b": 2 };
            expect(ObjectHelper.isComparable(obj1, obj2)).toEqual(true);
        });
    });
});
