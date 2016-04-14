module.exports = Mapping

function Mapping(input, mapping) {
    this.input   = input
    this.mapping = mapping
    this.values  = {}
}

Mapping.prototype.update = function () {
    this.values = {}
    for (var source in this.mapping) {
        if (this.mapping.hasOwnProperty(source)) {
            var inputSourceValue = source === "gamepad" ? this.input[source]() : this.input[source];
            var sourceValue      = this.mapping[source];

            for (var key in sourceValue) {
                if (sourceValue.hasOwnProperty(key)) {

                    var keyValue = sourceValue[key]
                    if (typeof keyValue === 'string') {
                        this.values[key] = (this.values[key] || 0) + inputSourceValue(keyValue)
                    } else if (typeof keyValue === 'function') {
                        if (inputSourceValue !== undefined)
                            this.values[key] = (this.values[key] || 0) + keyValue(inputSourceValue)
                    }

                }
            }

        }
    }
}

Mapping.prototype.value  = function (key) {
    return this.values[key] || 0
}
