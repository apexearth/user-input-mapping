# user-input-mapping

![](https://travis-ci.org/apexearth/user-input-mapping.svg)
![](http://img.shields.io/npm/v/user-input-mapping.svg?style=flat)
![](http://img.shields.io/npm/dm/user-input-mapping.svg?style=flat)
![](http://img.shields.io/npm/l/user-input-mapping.svg?style=flat)

Create mappings for user inputs.

## Usage

[![NPM](https://nodei.co/npm/user-input-mapping.png)](https://nodei.co/npm/user-input-mapping/)

Quick example.

    var Mapping   = require("user-input-mapping")
    var userInput = require("user-input")
         
    // Create an input listener.
    var input   = userInput().withKeyboard()
    
    // Create a mapping to translate the inputs.
    var mapping = new Mapping(input, {
        keyboard: {
            left:  "A",
            right: function (k) {
                return k("A") === 1
            }
        }
    })
    
    mapping.value('right') // Equals 0 or 1 depending on the state of key A.

See below for test cases.

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


### Example ([source](https://github.com/apexearth/starship/blob/master/src/player/player.human.js))

    var util      = require("util")
    var userInput = require("user-input")
    var Mapping   = require("user-input-mapping")
    var Player    = require("./player.js")
    
    module.exports = PlayerHuman
    
    /**
     * @class
     * @extends Player
     */
    function PlayerHuman(options) {
        var that      = this
        options       = options || {}
        options.input = options.input || userInput().withKeyboard().withMouse().withGamepad(0)
        Player.call(this, options)
    
        if (options.ship) {
            this.ship = options.ship
            this.ships.push(options.ship)
        }
    
        var mapping = {
            keyboard: {
                left:    "A",
                right:   "D",
                forward: "W",
                reverse: "S",
                fire:    "<space>"
            },
            mouse:    {
                rotation: function (mouse) {
                    return Math.atan2(mouse("y") - that.ship.y, mouse("x") - that.ship.x)
                }
            },
            gamepad:  {
                left:     function (gamepad) {
                    return gamepad.axes[0] < -.25 ? -gamepad.axes[0] : 0
                },
                right:    function (gamepad) {
                    return gamepad.axes[0] > .25 ? gamepad.axes[0] : 0
                },
                forward:       function (gamepad) {
                    return gamepad.axes[1] < -.25 ? -gamepad.axes[1] : 0
                },
                reverse:     function (gamepad) {
                    return gamepad.axes[1] > .25 ? gamepad.axes[1] : 0
                },
                rotation: function (gamepad) {
                    return Math.atan2(gamepad.axes[3], gamepad.axes[2])
                }
            }
        };
    
        this.input   = options.input
        this.mapping = new Mapping(this.input, mapping)
    }
    util.inherits(PlayerHuman, Player)
    
    PlayerHuman.prototype.update = function (time) {
        Player.prototype.update.call(this, time)
        this.mapping.update()
        this.ship.orders["left"]     = this.mapping.value("left")
        this.ship.orders["right"]    = this.mapping.value("right")
        this.ship.orders["forward"]  = this.mapping.value("forward")
        this.ship.orders["reverse"]  = this.mapping.value("reverse")
        this.ship.orders["rotation"] = this.mapping.value("rotation")
        this.ship.orders["fire"]     = this.mapping.value("fire")
    }

## Test

Mocha: `npm test`