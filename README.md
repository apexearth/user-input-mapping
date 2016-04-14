# user-input-mapping

![](https://travis-ci.org/apexearth/user-input-mapping.svg)  
![](http://img.shields.io/npm/v/user-input-mapping.svg?style=flat)  
![](http://img.shields.io/npm/dm/user-input-mapping.svg?style=flat)  
![](http://img.shields.io/npm/l/user-input-mapping.svg?style=flat)  

Create mappings for user inputs.

## Usage

[![NPM](https://nodei.co/npm/user-input-mapping.png)](https://nodei.co/npm/user-input-mapping/)

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