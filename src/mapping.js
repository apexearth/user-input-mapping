module.exports = Mapping

function Mapping(input, mapping, requireUpdates) {
    this.input = input
    this.mapping = mapping
    this.requireUpdates = typeof requireUpdates === 'undefined' ? true : requireUpdates;
    this.values = {}
}

Mapping.prototype.update = function (updateKey) {
    for (var source in this.mapping) {
        if (!this.mapping.hasOwnProperty(source)) continue;
        for (var key in this.mapping[source]) {
            if (!this.mapping[source].hasOwnProperty(key)) continue;
            this.values[key] = 0;
        }
    }
    for (source in this.mapping) {
        if (!this.mapping.hasOwnProperty(source)) continue;
        var inputSourceValue = source === "gamepad" ? this.input[source]() : this.input[source];
        var sourceValue = this.mapping[source];

        for (key in sourceValue) {
            if (sourceValue.hasOwnProperty(key) && (!updateKey || updateKey === key)) {
                var keyValue = sourceValue[key]
                if (typeof keyValue === 'string') {
                    this.values[key] = (this.values[key] || 0) + inputSourceValue(keyValue)
                } else if (typeof keyValue === 'function') {
                    if (inputSourceValue !== undefined)
                        this.values[key] = (this.values[key] || 0) + keyValue(inputSourceValue)
                } else if (Object.prototype.toString.call(keyValue) === '[object Array]') {
                    for(var i = 0; i < keyValue.length; i++) {
                        if (typeof keyValue[i] === 'string') {
                            this.values[key] = (this.values[key] || 0) + inputSourceValue(keyValue[i])
                        } else if (typeof keyValue[i] === 'function') {
                            if (inputSourceValue !== undefined)
                                this.values[key] = (this.values[key] || 0) + keyValue[i](inputSourceValue)
                        }
                    }
                }
            }
        }
    }
}

Mapping.prototype.value = function (key, value) {
    if (!this.requireUpdates) {
        this.update(key);
    }
    if (typeof value !== 'undefined') {
        this.values[key] = value;
    }
    return this.values[key] || 0
}
