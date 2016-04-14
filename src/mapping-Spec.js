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
    })
})