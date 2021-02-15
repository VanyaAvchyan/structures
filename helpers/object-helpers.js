Object.defineProperty(Object.prototype, 'includeOnly', {
    value: function (fields = []) {
        if(typeof (this) != 'object') {
            return this;
        }

        let newArr = [];
        let arr = this;
        if (!Array.isArray(arr)) {
            arr = [arr];
        }
        arr.forEach(el => {
            let newObj = {};
            fields.forEach(field=> {
                let fieldParts = field.split('.');
                newObj = _getOnlyRecursive(fieldParts, el, newObj);
            });

            newArr.push(newObj);
        });

        return (newArr.length > 1 || Array.isArray(this)) ? newArr : newArr[0];
    },
    writable: true,
    configurable: true,
    enumerable: false
});

Object.defineProperty(Object.prototype, 'excludeOnly', {
    value: function (fields) {
        if(typeof (this) != 'object') {
            return this;
        }

        let newArr = [];
        let arr = this;
        if (!Array.isArray(arr)) {
            arr = [arr];
        }

        arr.forEach(el => {
            let newObj = JSON.parse(JSON.stringify(el));

            fields.forEach(field=> {
                let fieldParts = field.split('.');
                newObj = _excludeOnlyRecursive(fieldParts, newObj);

            });

            newArr.push(newObj);
        });

        return (newArr.length > 1 || Array.isArray(this)) ? newArr : newArr[0];
    },
    writable: true,
    configurable: true,
    enumerable: false
});


function _excludeOnlyRecursive(fieldParts, obj, i = 0) {
    if (!obj[fieldParts[i]]) {
        return obj;
    }

    if (i == fieldParts.length - 1) {
        delete obj[fieldParts[i]];
        return obj;
    }

    obj[fieldParts[i]] = _excludeOnlyRecursive(fieldParts, obj[fieldParts[i]], ++i);
    return obj;
}

function _getOnlyRecursive(fieldParts, sourceObj, obj, i = 0) {
    if (!sourceObj[fieldParts[i]])
        return obj;

    if (i == fieldParts.length - 1) {
        obj[fieldParts[i]] = sourceObj[fieldParts[i]];
        return obj;
    }

    if (!obj[fieldParts[i]]) {
        obj[fieldParts[i]] = {};
    }

    obj[fieldParts[i]] = _getOnlyRecursive(fieldParts, sourceObj[fieldParts[i]], obj[fieldParts[i]], ++i);
    return obj;
}
