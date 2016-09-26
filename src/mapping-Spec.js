var expect = require("expect");

var Mapping   = require("./")
var userInput = require("user-input")

describe("mapping.js", function () {
    it("should do mapping stuff", function () {
        var input   = userInput().withKeyboard()
        var mapping = new Mapping(input, {
            keyboard: {
                left:  "A",
                right: function (k) {
                    return k("A") === 1
                }
            }
        })
        expect(mapping.value('left')).toEqual(0)
        expect(mapping.value('right')).toEqual(0)
        input.keyboard('A', 1)
        expect(mapping.value('left')).toEqual(0)
        expect(mapping.value('right')).toEqual(0)

        mapping.update()
        expect(mapping.value('left')).toEqual(1)
        expect(mapping.value('right')).toEqual(1)

        input.keyboard('A', 0)
        expect(mapping.value('left')).toEqual(1)
        expect(mapping.value('right')).toEqual(1)

        mapping.update()
        expect(mapping.value('left')).toEqual(0)
        expect(mapping.value('right')).toEqual(0)

        mapping.value('right', 'hello')
        expect(mapping.value('right')).toEqual('hello')
        mapping.update()
        expect(mapping.value('right')).toEqual(0) // Because of mapping, will resolve back to 0 during update.

        mapping.value('greeting', 'hello')        // Not in the map.
        expect(mapping.value('greeting')).toEqual('hello')
        mapping.update()
        expect(mapping.value('greeting')).toEqual('hello')

        input.keyboard('A', 1)
        mapping.update()
        expect(mapping.value('left')).toEqual(1)
        expect(mapping.value('right')).toEqual(1)
    })
    it("should do mapping stuff, requireUpdate = false", function () {
        var input   = userInput().withKeyboard()
        var mapping = new Mapping(input, {
            keyboard: {
                left:  "A",
                right: function (k) {
                    return k("A") === 1
                }
            }
        }, false)
        expect(mapping.value('left')).toEqual(0)
        expect(mapping.value('right')).toEqual(0)
        input.keyboard('A', 1)
        expect(mapping.value('left')).toEqual(1)
        expect(mapping.value('right')).toEqual(1)

        input.keyboard('A', 0)
        expect(mapping.value('left')).toEqual(0)
        expect(mapping.value('right')).toEqual(0)

        mapping.value('right', 'hello')
        expect(mapping.value('right')).toEqual(0) // Because of mapping, will resolve back to 0 during update.

        mapping.value('greeting', 'hello')
        expect(mapping.value('greeting')).toEqual('hello')

        input.keyboard('A', 1)
        expect(mapping.value('left')).toEqual(1)
        expect(mapping.value('right')).toEqual(1)
    })
    it("function mapping test", function() {
        var input   = userInput().withKeyboard()
        var mapping = new Mapping(input, {
            keyboard: {
                left:  "A",
                right: function (k) {
                    return k("A") / 2;
                }
            }
        }, false)
        expect(mapping.value('left')).toEqual(0)
        expect(mapping.value('right')).toEqual(0)
        input.keyboard('A', 1)
        expect(mapping.value('left')).toEqual(1)
        expect(mapping.value('right')).toEqual(.5)
        input.keyboard('A', 11)
        expect(mapping.value('left')).toEqual(11)
        expect(mapping.value('right')).toEqual(5.5)
    })
    it("handles arrays in the mapping", function() {
        var input   = userInput().withKeyboard()
        var mapping = new Mapping(input, {
            keyboard: {
                left:  ["A", "B"],
                right: [
                    function (k) {
                        return k("A") / 2;
                    },
                    function (k) {
                        return k("B") * 2;
                    },
                    "B"
                ]
            }
        }, false)
        expect(mapping.value('left')).toEqual(0)
        expect(mapping.value('right')).toEqual(0)
        input.keyboard('A', 1)
        input.keyboard('B', 1)
        expect(mapping.value('left')).toEqual(2)
        expect(mapping.value('right')).toEqual(3.5)
        input.keyboard('A', 11)
        input.keyboard('B', 5)
        expect(mapping.value('left')).toEqual(16)
        expect(mapping.value('right')).toEqual(20.5)
    });
})