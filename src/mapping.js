module.exports = Mapping

function Mapping(input, mapping, requireUpdates) {
    this.input = input
    this.mapping = mapping
    this.requireUpdates = typeof requireUpdates === 'undefined' ? true : requireUpdates;
    this.values = {}
    this.value.clear = this.clear.bind(this);
}

Mapping.prototype.getInput = function (source) {
    return source === "gamepad" ? this.input[source]() : this.input[source];
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
        var inputSource = this.getInput(source);
        var mappingSource = this.mapping[source];

        for (key in mappingSource) {
            if (mappingSource.hasOwnProperty(key) && (!updateKey || updateKey === key)) {
                var keyValue = mappingSource[key]
                if (typeof keyValue === 'string') {
                    this.values[key] = (this.values[key] || 0) + inputSource(keyValue)
                } else if (typeof keyValue === 'function') {
                    if (inputSource)
                        this.values[key] = (this.values[key] || 0) + keyValue(inputSource)
                } else if (Object.prototype.toString.call(keyValue) === '[object Array]') {
                    for (var i = 0; i < keyValue.length; i++) {
                        if (typeof keyValue[i] === 'string') {
                            this.values[key] = (this.values[key] || 0) + inputSource(keyValue[i])
                        } else if (typeof keyValue[i] === 'function') {
                            if (inputSource)
                                this.values[key] = (this.values[key] || 0) + keyValue[i](inputSource)
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

Mapping.prototype.clear = function () {
    this.values = {};
    this.input.clear();
}