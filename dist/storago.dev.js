/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/adapter/index.ts":
/*!******************************!*\
  !*** ./src/adapter/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.engineKind = void 0;
var engineKind;
(function (engineKind) {
    engineKind[engineKind["WebSQL"] = 0] = "WebSQL";
    engineKind[engineKind["PostgreSQL"] = 1] = "PostgreSQL";
})(engineKind = exports.engineKind || (exports.engineKind = {}));


/***/ }),

/***/ "./src/debug.ts":
/*!**********************!*\
  !*** ./src/debug.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.debug = void 0;
exports.debug = {
    select: true,
    insert: true,
    create: true,
    query: true,
};


/***/ }),

/***/ "./src/field/boolean.ts":
/*!******************************!*\
  !*** ./src/field/boolean.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BooleanField = void 0;
const adapter_1 = __webpack_require__(/*! ../adapter */ "./src/adapter/index.ts");
const field_1 = __webpack_require__(/*! ./field */ "./src/field/field.ts");
class BooleanField extends field_1.Field {
    constructor(name, config = field_1.defaultConfig) {
        super(name);
        this.config = {
            ...field_1.defaultConfig,
            ...config,
        };
    }
    fromDB(value) {
        if (value === null) {
            return undefined;
        }
        if (value === 'true') {
            return true;
        }
        else {
            return false;
        }
    }
    toDB(model) {
        let name = this.getName();
        let value = model[name];
        if (value === undefined) {
            return this.getDefaultValue();
        }
        if (typeof value === 'boolean') {
            if (value === true) {
                return 'true';
            }
            return false;
        }
        throw { code: null, message: `value of ${name} to DB is not a boolean` };
    }
    castDB(adapter) {
        if (adapter.engine == adapter_1.engineKind.WebSQL) {
            return 'BOOLEAN';
        }
        throw {
            code: field_1.codeError.EngineNotImplemented,
            message: `Engine ${adapter.engine} not implemented on field Text`
        };
    }
}
exports.BooleanField = BooleanField;


/***/ }),

/***/ "./src/field/datetime.ts":
/*!*******************************!*\
  !*** ./src/field/datetime.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DateTimeField = void 0;
const adapter_1 = __webpack_require__(/*! ../adapter */ "./src/adapter/index.ts");
const field_1 = __webpack_require__(/*! ./field */ "./src/field/field.ts");
class DateTimeField extends field_1.Field {
    constructor(name, config = field_1.defaultConfig) {
        super(name);
        this.config = {
            ...field_1.defaultConfig,
            ...config,
        };
    }
    fromDB(value) {
        if (value === null) {
            return undefined;
        }
        return new Date(value);
    }
    toDB(model) {
        let name = this.getName();
        let value = model[name];
        if (value === undefined) {
            return this.getDefaultValue();
        }
        if (value instanceof Date) {
            return value.getTime();
        }
        throw { code: null, message: `value of ${name} to DB is not a Date` };
    }
    castDB(adapter) {
        if (adapter.engine == adapter_1.engineKind.WebSQL) {
            return 'NUMBER';
        }
        throw {
            code: field_1.codeError.EngineNotImplemented,
            message: `Engine ${adapter.engine} not implemented on field Text`
        };
    }
}
exports.DateTimeField = DateTimeField;


/***/ }),

/***/ "./src/field/field.ts":
/*!****************************!*\
  !*** ./src/field/field.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Field = exports.defaultConfig = exports.codeError = void 0;
var codeError;
(function (codeError) {
    codeError["EngineNotImplemented"] = "@storago/orm/field/engineNotImplemented";
    codeError["DefaultValueIsNotValid"] = "@storago/orm/field/defaultParamNotValid";
    codeError["IncorrectValueToDb"] = "@storago/orm/field/IncorrectValueToStorageOnDB";
    codeError["RefererNotFound"] = "@storago/orm/field/ManyRelationship";
})(codeError = exports.codeError || (exports.codeError = {}));
exports.defaultConfig = {
    required: false,
    index: false,
    primary: false
};
class Field {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    getDefaultValue() {
        let valueDefault = this.config.default;
        if (typeof valueDefault === 'function') {
            return valueDefault();
        }
        if (valueDefault === undefined) {
            valueDefault = null;
        }
        return valueDefault;
    }
    isVirtual() {
        if (this.config.link !== undefined && !this.config.index) {
            return true;
        }
        return false;
    }
    toDB(model) {
        let name = this.getName();
        let value = model[name];
        if (value === undefined) {
            return this.getDefaultValue();
        }
        return value;
    }
    ;
    isJsonObject() {
        return false;
    }
}
exports.Field = Field;


/***/ }),

/***/ "./src/field/index.ts":
/*!****************************!*\
  !*** ./src/field/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fields = exports.Field = void 0;
var field_1 = __webpack_require__(/*! ./field */ "./src/field/field.ts");
Object.defineProperty(exports, "Field", ({ enumerable: true, get: function () { return field_1.Field; } }));
const text_1 = __webpack_require__(/*! ./text */ "./src/field/text.ts");
const uuid_1 = __webpack_require__(/*! ./uuid */ "./src/field/uuid.ts");
const json_1 = __webpack_require__(/*! ./json */ "./src/field/json.ts");
const many_1 = __webpack_require__(/*! ./many */ "./src/field/many.ts");
const integer_1 = __webpack_require__(/*! ./integer */ "./src/field/integer.ts");
const boolean_1 = __webpack_require__(/*! ./boolean */ "./src/field/boolean.ts");
const datetime_1 = __webpack_require__(/*! ./datetime */ "./src/field/datetime.ts");
exports.fields = {
    Text: text_1.Text,
    UUID: uuid_1.UUID,
    Json: json_1.Json,
    Many: many_1.Many,
    Integer: integer_1.IntegerField,
    Boolean: boolean_1.BooleanField,
    DateTime: datetime_1.DateTimeField,
};


/***/ }),

/***/ "./src/field/integer.ts":
/*!******************************!*\
  !*** ./src/field/integer.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IntegerField = void 0;
const adapter_1 = __webpack_require__(/*! ../adapter */ "./src/adapter/index.ts");
const field_1 = __webpack_require__(/*! ./field */ "./src/field/field.ts");
class IntegerField extends field_1.Field {
    constructor(name, config = field_1.defaultConfig) {
        super(name);
        this.config = {
            ...field_1.defaultConfig,
            ...config,
        };
    }
    fromDB(value) {
        if (!value) {
            return undefined;
        }
        if (typeof value === 'number') {
            return value;
        }
        throw { code: null, message: 'value from DB is not a number' };
    }
    toDB(model) {
        let name = this.getName();
        let value = model[name];
        if (value == undefined) {
            return this.getDefaultValue();
        }
        if (typeof value === 'number') {
            return Math.floor(value);
        }
        throw { code: null, message: `value of ${name} to DB is not a integer` };
    }
    castDB(adapter) {
        if (adapter.engine === adapter_1.engineKind.WebSQL) {
            return 'INTEGER';
        }
        throw {
            code: field_1.codeError.EngineNotImplemented,
            message: `Engine ${adapter.engine} not implemented on field Integer`
        };
    }
}
exports.IntegerField = IntegerField;


/***/ }),

/***/ "./src/field/json.ts":
/*!***************************!*\
  !*** ./src/field/json.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Json = void 0;
const adapter_1 = __webpack_require__(/*! ../adapter */ "./src/adapter/index.ts");
const field_1 = __webpack_require__(/*! ./field */ "./src/field/field.ts");
let jsonDefaultConfig = {
    ...field_1.defaultConfig,
    type: 'object',
};
class Json extends field_1.Field {
    constructor(name, config = jsonDefaultConfig) {
        super(name);
        this.config = {
            ...jsonDefaultConfig,
            ...config,
        };
    }
    getDefaultValue() {
        let valueDefault = super.getDefaultValue();
        if (typeof valueDefault === 'string') {
            try {
                valueDefault = JSON.parse(valueDefault);
            }
            catch (e) {
                throw {
                    code: field_1.codeError.DefaultValueIsNotValid,
                    message: `Default value on JSON field is not a valid json`
                };
            }
        }
        return valueDefault;
    }
    fromDB(value) {
        if (value === undefined || value === '') {
            let kind = this.config.type;
            if (kind === 'object') {
                return {};
            }
            else {
                return [];
            }
        }
        return JSON.parse(value);
    }
    castDB(adapter) {
        if (adapter.engine == adapter_1.engineKind.WebSQL) {
            return 'TEXT';
        }
        throw {
            code: field_1.codeError.EngineNotImplemented,
            message: `Engine ${adapter.engine} not implemented on Field Json`
        };
    }
    isJsonObject() {
        if (this.config.type === 'object') {
            return true;
        }
        return false;
    }
    toDB(model) {
        let value = super.toDB(model);
        if (value === null) {
            return null;
        }
        return this.stringifyToDb(value);
    }
    stringifyToDb(value) {
        let kind = this.config.type;
        let error = {
            code: field_1.codeError.IncorrectValueToDb,
            message: `value is not a valid json`,
        };
        if (typeof value === 'string') {
            try {
                JSON.parse(value);
                if (Array.isArray(value)) {
                    if (kind !== 'list') {
                        error.message = 'JSON is a object, but must be a list';
                        throw error;
                    }
                }
                else {
                    if (kind !== 'object') {
                        error.message = 'JSON is a list, but must be a object';
                        throw error;
                    }
                }
                return value;
            }
            catch (e) {
                throw error;
            }
        }
        if (typeof value === 'object') {
            try {
                value = JSON.stringify(value);
            }
            catch (e) {
                throw error;
            }
        }
        return value;
    }
}
exports.Json = Json;


/***/ }),

/***/ "./src/field/many.ts":
/*!***************************!*\
  !*** ./src/field/many.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Many = void 0;
const uuid_1 = __webpack_require__(/*! ./uuid */ "./src/field/uuid.ts");
const field_1 = __webpack_require__(/*! ./field */ "./src/field/field.ts");
class Many extends uuid_1.UUID {
    constructor(name, referer, config) {
        super(`${name}_id`);
        this.referer = referer;
        this.config = {
            ...field_1.defaultConfig,
            ...config,
        };
    }
}
exports.Many = Many;


/***/ }),

/***/ "./src/field/text.ts":
/*!***************************!*\
  !*** ./src/field/text.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Text = void 0;
const adapter_1 = __webpack_require__(/*! ../adapter */ "./src/adapter/index.ts");
const field_1 = __webpack_require__(/*! ./field */ "./src/field/field.ts");
class Text extends field_1.Field {
    constructor(name, config = field_1.defaultConfig) {
        super(name);
        this.config = {
            ...field_1.defaultConfig,
            ...config,
        };
    }
    fromDB(value) {
        if (typeof value === 'string') {
            return value;
        }
        return undefined;
    }
    toDB(model) {
        let name = this.getName();
        let value = model[name];
        if (value === undefined) {
            return this.getDefaultValue();
        }
        if (typeof value === 'string') {
            return value.trim();
        }
        throw { code: null, message: `value of ${name} to DB is not a string` };
    }
    castDB(adapter) {
        if (adapter.engine == adapter_1.engineKind.WebSQL) {
            return 'TEXT';
        }
        throw {
            code: field_1.codeError.EngineNotImplemented,
            message: `Engine ${adapter.engine} not implemented on field Text`
        };
    }
}
exports.Text = Text;


/***/ }),

/***/ "./src/field/uuid.ts":
/*!***************************!*\
  !*** ./src/field/uuid.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UUID = void 0;
const adapter_1 = __webpack_require__(/*! ../adapter */ "./src/adapter/index.ts");
const field_1 = __webpack_require__(/*! ./field */ "./src/field/field.ts");
const uuid_1 = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/index.js");
class UUID extends field_1.Field {
    constructor(name, config = field_1.defaultConfig) {
        super(name);
        this.config = {
            ...field_1.defaultConfig,
            ...config,
        };
    }
    castDB(adapter) {
        if (adapter.engine == adapter_1.engineKind.WebSQL) {
            return 'TEXT';
        }
        throw { code: field_1.codeError.EngineNotImplemented,
            message: `Engine ${adapter.engine} not implemented on Field UUID` };
    }
    fromDB(value) {
        if (value === null) {
            return undefined;
        }
        if (typeof value === 'string') {
            return value;
        }
        throw { code: null, message: 'value from DB is not a valid uuid' };
    }
    getDefaultValue() {
        let value = super.getDefaultValue();
        if (value === null && this.config.primary) {
            value = (0, uuid_1.v4)();
        }
        return value;
    }
    toDB(model) {
        let value = super.toDB(model);
        return value;
    }
}
exports.UUID = UUID;


/***/ }),

/***/ "./src/migration.ts":
/*!**************************!*\
  !*** ./src/migration.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Migration = void 0;
;
class Migration {
    constructor(adapter) {
        this.tasks = {};
        this.adapter = adapter;
    }
    make() { }
    async run() {
        this.make();
        if (this.firstAccess === undefined) {
            throw { code: null, message: `FirstAccess Migration not implemented!` };
        }
        let version = this.adapter.getVersion();
        if (version === '') {
            return this.adapter.changeVersion(0, this.firstAccess);
        }
        while (true) {
            version++;
            let task = this.tasks[version];
            if (task === undefined) {
                break;
            }
            await this.adapter.changeVersion(version, task);
        }
        return Promise.resolve();
    }
    registerFirstAccess(callback) {
        if (this.firstAccess !== undefined) {
            throw { code: undefined, message: `firstAccess callback alredy registred` };
        }
        this.firstAccess = callback;
    }
    register(version, callback) {
        if (this.tasks[version] !== undefined) {
            throw { code: undefined, message: `callback version ${version} alredy registred` };
        }
        this.tasks[version] = callback;
    }
}
exports.Migration = Migration;


/***/ }),

/***/ "./src/model.ts":
/*!**********************!*\
  !*** ./src/model.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Model = void 0;
class Model {
}
exports.Model = Model;


/***/ }),

/***/ "./src/schema.ts":
/*!***********************!*\
  !*** ./src/schema.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Schema = void 0;
const uuid_1 = __webpack_require__(/*! ./field/uuid */ "./src/field/uuid.ts");
class Schema {
    constructor(model, name, fields = [], adapter) {
        this.fields = [];
        this.superFields = [
            new uuid_1.UUID('id', { primary: true }),
        ];
        this.name = name;
        this.adapter = adapter;
        this.Model = model;
        this.fields = this.fields.concat(fields);
    }
    async saveRow(model) {
        if (model.__data) {
        }
        let insert = this.insert();
        insert.add(model);
        return insert.save();
    }
    getModelClass() {
        return this.Model;
    }
    create() {
        return this.adapter.create(this.Model, this);
    }
    getName() {
        return this.name;
    }
    getFields() {
        return [...this.superFields, ...this.fields];
    }
    getField(name) {
        for (let field of this.getFields()) {
            if (name == field.getName()) {
                return field;
            }
        }
        throw { code: null, message: `Field with name: ${name} not exists in ${this.name}` };
    }
    getColumns() {
        let columns = [];
        for (let field of this.getFields()) {
            columns.push(field.getName());
        }
        return columns;
    }
    find(where, param) {
        let select = this.select();
        select.where(where, param);
        return select.one();
    }
    ;
    getAdapter() {
        return this.adapter;
    }
    select() {
        let select = this.adapter.select(this.Model, this);
        select.from(this.getName(), this.getColumns());
        return select;
    }
    insert() {
        let insert = this.adapter.insert(this.Model, this);
        return insert;
    }
    async populateFromDB(row) {
        let fields = this.getFields();
        let model = new this.Model();
        model.__data = row;
        for (let field of fields) {
            let name = field.getName();
            model[name] = field.fromDB(row[name]);
        }
        return model;
    }
}
exports.Schema = Schema;


/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NIL": () => (/* reexport safe */ _nil_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "parse": () => (/* reexport safe */ _parse_js__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   "stringify": () => (/* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   "v1": () => (/* reexport safe */ _v1_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "v3": () => (/* reexport safe */ _v3_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "v4": () => (/* reexport safe */ _v4_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "v5": () => (/* reexport safe */ _v5_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "validate": () => (/* reexport safe */ _validate_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   "version": () => (/* reexport safe */ _version_js__WEBPACK_IMPORTED_MODULE_5__["default"])
/* harmony export */ });
/* harmony import */ var _v1_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v1.js */ "./node_modules/uuid/dist/esm-browser/v1.js");
/* harmony import */ var _v3_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./v3.js */ "./node_modules/uuid/dist/esm-browser/v3.js");
/* harmony import */ var _v4_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./v4.js */ "./node_modules/uuid/dist/esm-browser/v4.js");
/* harmony import */ var _v5_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./v5.js */ "./node_modules/uuid/dist/esm-browser/v5.js");
/* harmony import */ var _nil_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./nil.js */ "./node_modules/uuid/dist/esm-browser/nil.js");
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./version.js */ "./node_modules/uuid/dist/esm-browser/version.js");
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist/esm-browser/parse.js");










/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/md5.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/md5.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Uint8Array(msg.length);

    for (var i = 0; i < msg.length; ++i) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  var output = [];
  var length32 = input.length * 32;
  var hexTab = '0123456789abcdef';

  for (var i = 0; i < length32; i += 8) {
    var x = input[i >> 5] >>> i % 32 & 0xff;
    var hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/**
 * Calculate output length with padding and bit length
 */


function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[getOutputLength(len) - 1] = len;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;

  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }

  var length8 = input.length * 8;
  var output = new Uint32Array(getOutputLength(length8));

  for (var i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (md5);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/nil.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/nil.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('00000000-0000-0000-0000-000000000000');

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/parse.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/parse.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");


function parse(uuid) {
  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Invalid UUID');
  }

  var v;
  var arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (parse);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/sha1.js":
/*!****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/sha1.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = [];

    for (var i = 0; i < msg.length; ++i) {
      bytes.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes)) {
    // Convert Array-like to Array
    bytes = Array.prototype.slice.call(bytes);
  }

  bytes.push(0x80);
  var l = bytes.length / 4 + 2;
  var N = Math.ceil(l / 16);
  var M = new Array(N);

  for (var _i = 0; _i < N; ++_i) {
    var arr = new Uint32Array(16);

    for (var j = 0; j < 16; ++j) {
      arr[j] = bytes[_i * 64 + j * 4] << 24 | bytes[_i * 64 + j * 4 + 1] << 16 | bytes[_i * 64 + j * 4 + 2] << 8 | bytes[_i * 64 + j * 4 + 3];
    }

    M[_i] = arr;
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (var _i2 = 0; _i2 < N; ++_i2) {
    var W = new Uint32Array(80);

    for (var t = 0; t < 16; ++t) {
      W[t] = M[_i2][t];
    }

    for (var _t = 16; _t < 80; ++_t) {
      W[_t] = ROTL(W[_t - 3] ^ W[_t - 8] ^ W[_t - 14] ^ W[_t - 16], 1);
    }

    var a = H[0];
    var b = H[1];
    var c = H[2];
    var d = H[3];
    var e = H[4];

    for (var _t2 = 0; _t2 < 80; ++_t2) {
      var s = Math.floor(_t2 / 20);
      var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[_t2] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sha1);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v1.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v1.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");

 // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;

var _clockseq; // Previous uuid creation time


var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || new Array(16);
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  var msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(b);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v1);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v3.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v3.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist/esm-browser/v35.js");
/* harmony import */ var _md5_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./md5.js */ "./node_modules/uuid/dist/esm-browser/md5.js");


var v3 = (0,_v35_js__WEBPACK_IMPORTED_MODULE_0__["default"])('v3', 0x30, _md5_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v3);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v35.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v35.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DNS": () => (/* binding */ DNS),
/* harmony export */   "URL": () => (/* binding */ URL),
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist/esm-browser/parse.js");



function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  var bytes = [];

  for (var i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

var DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
var URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0,_parse_js__WEBPACK_IMPORTED_MODULE_0__["default"])(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    var bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v5.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v5.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist/esm-browser/v35.js");
/* harmony import */ var _sha1_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sha1.js */ "./node_modules/uuid/dist/esm-browser/sha1.js");


var v5 = (0,_v35_js__WEBPACK_IMPORTED_MODULE_0__["default"])('v5', 0x50, _sha1_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v5);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-browser/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/version.js":
/*!*******************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/version.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");


function version(uuid) {
  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (version);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Migration = exports.Field = exports.fields = exports.Schema = exports.Model = exports.debug = void 0;
var debug_1 = __webpack_require__(/*! ./debug */ "./src/debug.ts");
Object.defineProperty(exports, "debug", ({ enumerable: true, get: function () { return debug_1.debug; } }));
var model_1 = __webpack_require__(/*! ./model */ "./src/model.ts");
Object.defineProperty(exports, "Model", ({ enumerable: true, get: function () { return model_1.Model; } }));
var schema_1 = __webpack_require__(/*! ./schema */ "./src/schema.ts");
Object.defineProperty(exports, "Schema", ({ enumerable: true, get: function () { return schema_1.Schema; } }));
var field_1 = __webpack_require__(/*! ./field */ "./src/field/index.ts");
Object.defineProperty(exports, "fields", ({ enumerable: true, get: function () { return field_1.fields; } }));
Object.defineProperty(exports, "Field", ({ enumerable: true, get: function () { return field_1.Field; } }));
var migration_1 = __webpack_require__(/*! ./migration */ "./src/migration.ts");
Object.defineProperty(exports, "Migration", ({ enumerable: true, get: function () { return migration_1.Migration; } }));

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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dUdBQU07QUFFZix5RUFBd0M7QUFBL0Isc0dBQU07QUFBRSxvR0FBSztBQUN0QiwrRUFBd0M7QUFBL0IsZ0hBQVMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvYWRhcHRlci9pbmRleC50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZGVidWcudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL2Jvb2xlYW4udHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL2RhdGV0aW1lLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC9maWVsZC50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL2ludGVnZXIudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL2pzb24udHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL21hbnkudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL3RleHQudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL3V1aWQudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL21pZ3JhdGlvbi50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvbW9kZWwudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL3NjaGVtYS50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL2luZGV4LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvbWQ1LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvbmlsLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvcGFyc2UuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9yZWdleC5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3JuZy5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3NoYTEuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92MS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3YzLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdjM1LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdjQuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92NS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdmVyc2lvbi5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VsZWN0IH0gZnJvbSBcIi4vc2VsZWN0XCI7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgSW5zZXJ0IH0gZnJvbSBcIi4vaW5zZXJ0XCI7XG5pbXBvcnQgeyBDcmVhdGUgfSBmcm9tIFwiLi9jcmVhdGVcIjtcbmltcG9ydCB7IFNjaGVtYSB9IGZyb20gXCIuLi9zY2hlbWFcIjtcblxudHlwZSBjYWxsYmFja01pZ3JhdGlvbiA9IHsodHJhbnNhY3Rpb246IGFueSkgOiBQcm9taXNlPHZvaWQ+fTtcblxuZXhwb3J0IGVudW0gZW5naW5lS2luZCB7XG4gIFdlYlNRTCxcbiAgUG9zdGdyZVNRTCxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBZGFwdGVye1xuXG4gIGVuZ2luZTogZW5naW5lS2luZDtcblxuICBxdWVyeShzcWw6IGFueSwgZGF0YTogT2JqZWN0QXJyYXksIHRyYW5zYWN0aW9uOiBhbnkpIDogUHJvbWlzZTxhbnk+O1xuICBzZWxlY3Q8TSBleHRlbmRzIE1vZGVsPihtb2RlbDogbmV3KCkgPT4gTSwgc2NoZW1hOiBTY2hlbWE8TT4pIDogU2VsZWN0PE0+O1xuICBpbnNlcnQ8TSBleHRlbmRzIE1vZGVsPihtb2RlbDogbmV3KCkgPT4gTSwgc2NoZW1hOiBTY2hlbWE8TT4pIDogSW5zZXJ0O1xuICBnZXRWZXJzaW9uKCkgOiAnJ3xudW1iZXI7XG4gIGNyZWF0ZTxNIGV4dGVuZHMgTW9kZWw+KG1vZGVsOiBuZXcoKSA9PiBNLCBzY2hlbWE6IFNjaGVtYTxNPikgOiBDcmVhdGU7XG4gIGNoYW5nZVZlcnNpb24obmV3VmVyc2lvbjogbnVtYmVyLCBjYjogY2FsbGJhY2tNaWdyYXRpb24pIDogUHJvbWlzZTx2b2lkPjtcbn0iLCJpbnRlcmZhY2UgRGVidWd7XG4gIHNlbGVjdDogYm9vbGVhbixcbiAgaW5zZXJ0OiBib29sZWFuLFxuICBjcmVhdGU6IGJvb2xlYW4sXG4gIHF1ZXJ5OiBib29sZWFuLFxufVxuXG5leHBvcnQgbGV0IGRlYnVnOiBEZWJ1ZyA9IHtcbiAgc2VsZWN0OiB0cnVlLFxuICBpbnNlcnQ6IHRydWUsXG4gIGNyZWF0ZTogdHJ1ZSxcbiAgcXVlcnk6IHRydWUsXG59IiwiaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi5cIjtcbmltcG9ydCB7IEFkYXB0ZXIsIGVuZ2luZUtpbmQgfSBmcm9tIFwiLi4vYWRhcHRlclwiO1xuaW1wb3J0IHsgQ29uZmlnLCBkZWZhdWx0Q29uZmlnLCBGaWVsZCwgY29kZUVycm9yIH0gZnJvbSBcIi4vZmllbGRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBCb29sZWFuQ29uZmlnIGV4dGVuZHMgQ29uZmlnIHsgfVxuXG5leHBvcnQgY2xhc3MgQm9vbGVhbkZpZWxkIGV4dGVuZHMgRmllbGQge1xuXG4gIHJlYWRvbmx5IGNvbmZpZzogQm9vbGVhbkNvbmZpZztcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGNvbmZpZzogUGFydGlhbDxCb29sZWFuQ29uZmlnPiA9IGRlZmF1bHRDb25maWcpe1xuXG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmcm9tREIodmFsdWU6IHN0cmluZykgOiBib29sZWFufHVuZGVmaW5lZCB7XG4gICAgXG4gICAgaWYodmFsdWUgPT09IG51bGwpe1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZih2YWx1ZSA9PT0gJ3RydWUnKXtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1lbHNle1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB0b0RCPFQgZXh0ZW5kcyBNb2RlbD4obW9kZWw6IFQpIHtcbiAgICBcbiAgICBsZXQgbmFtZSA9IHRoaXMuZ2V0TmFtZSgpO1xuICAgIGxldCB2YWx1ZSA9IG1vZGVsW25hbWUgYXMga2V5b2YgVF07XG5cbiAgICBpZih2YWx1ZSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRWYWx1ZSgpO1xuICAgIH1cblxuICAgIGlmKHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nKXtcbiAgICAgIGlmKHZhbHVlID09PSB0cnVlKXtcbiAgICAgICAgcmV0dXJuICd0cnVlJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRocm93IHtjb2RlOiBudWxsLCBtZXNzYWdlOiBgdmFsdWUgb2YgJHtuYW1lfSB0byBEQiBpcyBub3QgYSBib29sZWFuYH07XG4gIH1cblxuICBwdWJsaWMgY2FzdERCKGFkYXB0ZXI6IEFkYXB0ZXIpOiBzdHJpbmcge1xuICAgIFxuICAgIGlmKGFkYXB0ZXIuZW5naW5lID09IGVuZ2luZUtpbmQuV2ViU1FMKXtcbiAgICAgIHJldHVybiAnQk9PTEVBTic7XG4gICAgfVxuXG4gICAgdGhyb3cge1xuICAgICAgY29kZTogY29kZUVycm9yLkVuZ2luZU5vdEltcGxlbWVudGVkLFxuICAgICAgbWVzc2FnZTogYEVuZ2luZSAkeyBhZGFwdGVyLmVuZ2luZSB9IG5vdCBpbXBsZW1lbnRlZCBvbiBmaWVsZCBUZXh0YFxuICAgIH07XG4gIH1cbn0iLCJpbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuLlwiO1xuaW1wb3J0IHsgQWRhcHRlciwgZW5naW5lS2luZCB9IGZyb20gXCIuLi9hZGFwdGVyXCI7XG5pbXBvcnQgeyBDb25maWcsIGRlZmF1bHRDb25maWcsIEZpZWxkLCBjb2RlRXJyb3IgfSBmcm9tIFwiLi9maWVsZFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIERhdGVUaW1lQ29uZmlnIGV4dGVuZHMgQ29uZmlnIHsgfVxuXG5leHBvcnQgY2xhc3MgRGF0ZVRpbWVGaWVsZCBleHRlbmRzIEZpZWxkIHtcblxuICByZWFkb25seSBjb25maWc6IERhdGVUaW1lQ29uZmlnO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgY29uZmlnOiBQYXJ0aWFsPERhdGVUaW1lQ29uZmlnPiA9IGRlZmF1bHRDb25maWcpIHtcblxuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLi4uZGVmYXVsdENvbmZpZyxcbiAgICAgIC4uLmNvbmZpZyxcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZnJvbURCKHZhbHVlOiBudW1iZXJ8bnVsbCk6IERhdGV8dW5kZWZpbmVke1xuXG4gICAgaWYodmFsdWUgPT09IG51bGwpe1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IERhdGUodmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHRvREI8VCBleHRlbmRzIE1vZGVsPihtb2RlbDogVCkgOiBudW1iZXIge1xuICAgIFxuICAgIGxldCBuYW1lID0gdGhpcy5nZXROYW1lKCk7XG4gICAgbGV0IHZhbHVlID0gbW9kZWxbbmFtZSBhcyBrZXlvZiBUXTtcblxuICAgIGlmKHZhbHVlID09PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVmYXVsdFZhbHVlKCk7XG4gICAgfVxuXG4gICAgaWYodmFsdWUgaW5zdGFuY2VvZiBEYXRlKXtcbiAgICAgIHJldHVybiB2YWx1ZS5nZXRUaW1lKCk7XG4gICAgfVxuXG4gICAgdGhyb3cge2NvZGU6IG51bGwsIG1lc3NhZ2U6IGB2YWx1ZSBvZiAke25hbWV9IHRvIERCIGlzIG5vdCBhIERhdGVgfTtcbiAgfVxuXG4gIHB1YmxpYyBjYXN0REIoYWRhcHRlcjogQWRhcHRlcik6IHN0cmluZyB7XG4gICAgXG4gICAgaWYoYWRhcHRlci5lbmdpbmUgPT0gZW5naW5lS2luZC5XZWJTUUwpe1xuICAgICAgcmV0dXJuICdOVU1CRVInO1xuICAgIH1cblxuICAgIHRocm93IHtcbiAgICAgIGNvZGU6IGNvZGVFcnJvci5FbmdpbmVOb3RJbXBsZW1lbnRlZCxcbiAgICAgIG1lc3NhZ2U6IGBFbmdpbmUgJHsgYWRhcHRlci5lbmdpbmUgfSBub3QgaW1wbGVtZW50ZWQgb24gZmllbGQgVGV4dGBcbiAgICB9O1xuICB9XG59IiwiaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gXCIuLi9hZGFwdGVyXCI7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuXG5leHBvcnQgZW51bSBjb2RlRXJyb3Ige1xuICAnRW5naW5lTm90SW1wbGVtZW50ZWQnID0gJ0BzdG9yYWdvL29ybS9maWVsZC9lbmdpbmVOb3RJbXBsZW1lbnRlZCcsXG4gICdEZWZhdWx0VmFsdWVJc05vdFZhbGlkJyA9ICdAc3RvcmFnby9vcm0vZmllbGQvZGVmYXVsdFBhcmFtTm90VmFsaWQnLFxuICAnSW5jb3JyZWN0VmFsdWVUb0RiJyA9ICdAc3RvcmFnby9vcm0vZmllbGQvSW5jb3JyZWN0VmFsdWVUb1N0b3JhZ2VPbkRCJyxcbiAgJ1JlZmVyZXJOb3RGb3VuZCcgPSAnQHN0b3JhZ28vb3JtL2ZpZWxkL01hbnlSZWxhdGlvbnNoaXAnLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZyB7XG4gIGRlZmF1bHQ/OiBhbnk7XG4gIHJlcXVpcmVkOiBib29sZWFuO1xuICBsaW5rPzogc3RyaW5nO1xuICBpbmRleDogYm9vbGVhbjtcbiAgcHJpbWFyeTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRDb25maWc6IENvbmZpZyA9IHtcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBpbmRleDogZmFsc2UsXG4gIHByaW1hcnk6IGZhbHNlXG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgYWJzdHJhY3QgY29uZmlnOiBDb25maWc7XG4gIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICB9XG5cbiAgcHVibGljIGdldE5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xuICB9XG5cbiAgcHVibGljIGdldERlZmF1bHRWYWx1ZSgpOiBhbnkge1xuXG4gICAgbGV0IHZhbHVlRGVmYXVsdCA9IHRoaXMuY29uZmlnLmRlZmF1bHQ7XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlRGVmYXVsdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHZhbHVlRGVmYXVsdCgpO1xuICAgIH1cbiAgICBcbiAgICBpZiAodmFsdWVEZWZhdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbHVlRGVmYXVsdCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlRGVmYXVsdDtcbiAgfVxuXG4gIHB1YmxpYyBpc1ZpcnR1YWwoKTogYm9vbGVhbiB7XG5cbiAgICBpZiAodGhpcy5jb25maWcubGluayAhPT0gdW5kZWZpbmVkICYmICF0aGlzLmNvbmZpZy5pbmRleCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLypcbiAgcHVibGljIGFzeW5jIHBvcHVsYXRlKG1vZGVsOiBNb2RlbCwgcm93OiB7IFtpbmRleDogc3RyaW5nXTogYW55OyB9KTogUHJvbWlzZTxhbnk+IHtcblxuICAgIGxldCBuYW1lID0gdGhpcy5nZXROYW1lKCk7XG4gICAgbGV0IHZhbHVlID0gcm93W25hbWVdO1xuXG4gICAgLypcbiAgICBpZiAodGhpcy5jb25maWcubGluayAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgIGxldCBsaW5rczogc3RyaW5nW10gPSB0aGlzLmNvbmZpZy5saW5rLnNwbGl0KCcuJyk7XG4gICAgICBsZXQgaXRlbU5hbWUgPSBsaW5rcy5zaGlmdCgpO1xuXG4gICAgICBpZiAoIWl0ZW1OYW1lIHx8IGl0ZW1OYW1lIGluIG1vZGVsLl9fZGF0YSkge1xuICAgICAgICBtb2RlbFtuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YWx1ZSA9IGF3YWl0IG1vZGVsLl9fZGF0YVtpdGVtTmFtZV07XG5cbiAgICAgIHdoaWxlIChpdGVtTmFtZSA9IGxpbmtzLnNoaWZ0KCkpIHtcblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGlmIChpdGVtTmFtZSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZVtpdGVtTmFtZV07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0aGlzLmZyb21EQih2YWx1ZSk7XG4gIH1cbiAgKi9cbiAgXG4gIHB1YmxpYyB0b0RCPFQgZXh0ZW5kcyBNb2RlbD4obW9kZWw6IFQpOiBhbnkge1xuXG4gICAgbGV0IG5hbWUgPSB0aGlzLmdldE5hbWUoKTtcbiAgICBsZXQgdmFsdWUgPSBtb2RlbFtuYW1lIGFzIGtleW9mIFRdO1xuXG4gICAgaWYodmFsdWUgPT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0VmFsdWUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG4gIFxuICBwdWJsaWMgaXNKc29uT2JqZWN0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgLypcbiAgcHJvdGVjdGVkIGRlZmluZVNldHRlcihsaW5rOiBzdHJpbmcsIHNjaGVtYTogU2NoZW1hLCBtb2RlbDogTW9kZWwsIHZhbHVlOiBhbnkpIDogdm9pZCB7XG5cbiAgICBpZiAobGluaykge1xuICAgICAgbGV0IGxpc3ROYW1lID0gbGluay5zcGxpdCgnLicpO1xuICAgICAgbGV0IGZpZWxkTmFtZSA9IGxpc3ROYW1lWzBdO1xuICAgICAgbGV0IHRhcmdldCA9IGxpc3ROYW1lLnBvcCgpO1xuICAgICAgbGV0IGZpZWxkID0gc2NoZW1hLmdldEZpZWxkKGZpZWxkTmFtZSk7XG4gICAgICBsZXQgaXRlbSA6IGFueSA9IG1vZGVsO1xuICAgICAgXG4gICAgICBpZihmaWVsZC5pc0pzb25PYmplY3QoKSl7XG4gICAgICAgIGxldCBpdGVtTmFtZSA9IGxpc3ROYW1lLnNoaWZ0KCk7XG4gICAgICAgIHdoaWxlKGl0ZW1OYW1lKXtcbiAgICAgICAgICBcbiAgICAgICAgICBpZih0eXBlb2YgaXRlbVtpdGVtTmFtZV0gIT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIGl0ZW1baXRlbU5hbWVdID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIGl0ZW0gPSBpdGVtW2l0ZW1OYW1lXTtcbiAgICAgICAgICBpdGVtTmFtZSA9IGxpc3ROYW1lLnNoaWZ0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYodGFyZ2V0KXtcbiAgICAgICAgaXRlbVt0YXJnZXRdID0gdGhpcy5wYXJzZVRvREIodmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBkZWZpbmVHZXR0ZXIobGluazogc3RyaW5nLCBzY2hlbWE6IFNjaGVtYSwgbW9kZWw6IE1vZGVsKSA6IGFueSB7XG5cbiAgICBpZiAobGluaykge1xuICAgICAgbGV0IGxpc3ROYW1lID0gbGluay5zcGxpdCgnLicpO1xuICAgICAgbGV0IGZpZWxkTmFtZSA9IGxpc3ROYW1lWzBdO1xuICAgICAgbGV0IHRhcmdldCA9IGxpc3ROYW1lLnBvcCgpO1xuICAgICAgbGV0IGZpZWxkID0gc2NoZW1hLmdldEZpZWxkKGZpZWxkTmFtZSk7XG4gICAgICBsZXQgaXRlbSA6IGFueSA9IG1vZGVsO1xuXG4gICAgICBpZihmaWVsZC5pc0pzb25PYmplY3QoKSl7XG4gICAgICAgIGxldCBpdGVtTmFtZSA9IGxpc3ROYW1lLnNoaWZ0KCk7XG4gICAgICAgIHdoaWxlKGl0ZW1OYW1lKXtcbiAgICAgICAgICBcbiAgICAgICAgICBpZih0eXBlb2YgaXRlbVtpdGVtTmFtZV0gIT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIHJldHVybiBpdGVtW2l0ZW1OYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgaXRlbSA9IGl0ZW1baXRlbU5hbWVdO1xuICAgICAgICAgIGl0ZW1OYW1lID0gbGlzdE5hbWUuc2hpZnQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBpZih0YXJnZXQpe1xuICAgICAgICByZXR1cm4gaXRlbVt0YXJnZXRdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgXG4gIHB1YmxpYyBkZWZpbmVQcm9wZXJ0eShzY2hlbWE6IFNjaGVtYSwgbW9kZWw6IE1vZGVsKTogdm9pZCB7XG4gICAgXG4gICAgXG4gICAgbGV0IGxpbmsgPSB0aGlzLmNvbmZpZy5saW5rO1xuICAgIGlmIChsaW5rKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kZWwsIHRoaXMubmFtZSwge1xuICAgICAgICAnc2V0JzogdGhpcy5kZWZpbmVTZXR0ZXIuYmluZCh0aGlzLCBsaW5rLCBzY2hlbWEsIG1vZGVsKSxcbiAgICAgICAgJ2dldCc6IHRoaXMuZGVmaW5lR2V0dGVyLmJpbmQodGhpcywgbGluaywgc2NoZW1hLCBtb2RlbCksXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgKi9cblxuICBhYnN0cmFjdCBmcm9tREIodmFsdWU6IGFueSk6IGFueTtcbiAgYWJzdHJhY3QgY2FzdERCKGFkYXB0ZXI6IEFkYXB0ZXIpOiBzdHJpbmc7XG59XG4iLCJleHBvcnQgeyBGaWVsZCB9IGZyb20gXCIuL2ZpZWxkXCI7XG5cbmltcG9ydCB7IFRleHQgfSBmcm9tIFwiLi90ZXh0XCI7XG5pbXBvcnQgeyBVVUlEIH0gZnJvbSBcIi4vdXVpZFwiO1xuaW1wb3J0IHsgSnNvbiB9IGZyb20gXCIuL2pzb25cIjtcbmltcG9ydCB7IE1hbnkgfSBmcm9tIFwiLi9tYW55XCI7XG5pbXBvcnQgeyBJbnRlZ2VyRmllbGQgfSBmcm9tIFwiLi9pbnRlZ2VyXCI7XG5pbXBvcnQgeyBCb29sZWFuRmllbGQgfSBmcm9tIFwiLi9ib29sZWFuXCI7XG5pbXBvcnQgeyBEYXRlVGltZUZpZWxkIH0gZnJvbSBcIi4vZGF0ZXRpbWVcIjtcblxuZXhwb3J0IGNvbnN0IGZpZWxkcyA9IHtcbiAgVGV4dDogVGV4dCxcbiAgVVVJRDogVVVJRCxcbiAgSnNvbjogSnNvbixcbiAgTWFueTogTWFueSxcbiAgSW50ZWdlcjogSW50ZWdlckZpZWxkLFxuICBCb29sZWFuOiBCb29sZWFuRmllbGQsXG4gIERhdGVUaW1lOiBEYXRlVGltZUZpZWxkLFxufVxuIiwiaW1wb3J0IHsgQWRhcHRlciwgZW5naW5lS2luZCB9IGZyb20gXCIuLi9hZGFwdGVyXCI7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgRmllbGQsIGNvZGVFcnJvciwgQ29uZmlnLCBkZWZhdWx0Q29uZmlnIH0gZnJvbSBcIi4vZmllbGRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJbnRlZ2VyQ29uZmlnIGV4dGVuZHMgQ29uZmlnIHsgfVxuXG5leHBvcnQgY2xhc3MgSW50ZWdlckZpZWxkIGV4dGVuZHMgRmllbGQge1xuXG4gIHJlYWRvbmx5IGNvbmZpZzogSW50ZWdlckNvbmZpZztcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGNvbmZpZzogUGFydGlhbDxJbnRlZ2VyQ29uZmlnPiA9IGRlZmF1bHRDb25maWcpe1xuXG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmcm9tREIodmFsdWU6IGFueSk6IG51bWJlcnx1bmRlZmluZWQge1xuXG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZih0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKXtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aHJvdyB7Y29kZTogbnVsbCwgbWVzc2FnZTogJ3ZhbHVlIGZyb20gREIgaXMgbm90IGEgbnVtYmVyJ307XG4gIH1cblxuICBwdWJsaWMgdG9EQjxUIGV4dGVuZHMgTW9kZWw+KG1vZGVsOiBUKTogbnVtYmVyfG51bGwge1xuXG4gICAgbGV0IG5hbWUgPSB0aGlzLmdldE5hbWUoKTtcbiAgICBsZXQgdmFsdWUgPSBtb2RlbFtuYW1lIGFzIGtleW9mIFRdO1xuICAgIFxuICAgIGlmICh2YWx1ZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRWYWx1ZSgpO1xuICAgIH1cblxuICAgIGlmKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpe1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IodmFsdWUpO1xuICAgIH1cblxuICAgIHRocm93IHtjb2RlOiBudWxsLCBtZXNzYWdlOiBgdmFsdWUgb2YgJHtuYW1lfSB0byBEQiBpcyBub3QgYSBpbnRlZ2VyYH07XG4gIH1cblxuICBwdWJsaWMgY2FzdERCKGFkYXB0ZXI6IEFkYXB0ZXIpOiBzdHJpbmcge1xuXG4gICAgaWYgKGFkYXB0ZXIuZW5naW5lID09PSBlbmdpbmVLaW5kLldlYlNRTCkge1xuICAgICAgcmV0dXJuICdJTlRFR0VSJztcbiAgICB9XG5cbiAgICB0aHJvdyB7XG4gICAgICBjb2RlOiBjb2RlRXJyb3IuRW5naW5lTm90SW1wbGVtZW50ZWQsXG4gICAgICBtZXNzYWdlOiBgRW5naW5lICR7IGFkYXB0ZXIuZW5naW5lIH0gbm90IGltcGxlbWVudGVkIG9uIGZpZWxkIEludGVnZXJgXG4gICAgfTtcbiAgfVxufSIsImltcG9ydCB7IEFkYXB0ZXIsIGVuZ2luZUtpbmQgfSBmcm9tIFwiLi4vYWRhcHRlclwiO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IEZpZWxkLCBDb25maWcsIGRlZmF1bHRDb25maWcsIGNvZGVFcnJvciB9IGZyb20gXCIuL2ZpZWxkXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSnNvbkNvbmZpZyBleHRlbmRzIENvbmZpZyB7XG4gIHR5cGU6ICdsaXN0JyB8ICdvYmplY3QnLFxuICBkZWZhdWx0PzogJ3N0cmluZycgfCBGdW5jdGlvbiB8IE9iamVjdDtcbn1cblxubGV0IGpzb25EZWZhdWx0Q29uZmlnOiBKc29uQ29uZmlnID0ge1xuICAuLi5kZWZhdWx0Q29uZmlnLFxuICB0eXBlOiAnb2JqZWN0Jyxcbn1cblxuZXhwb3J0IGNsYXNzIEpzb24gZXh0ZW5kcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgY29uZmlnOiBKc29uQ29uZmlnO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgY29uZmlnOiBQYXJ0aWFsPEpzb25Db25maWc+ID0ganNvbkRlZmF1bHRDb25maWcpIHtcblxuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLi4uanNvbkRlZmF1bHRDb25maWcsXG4gICAgICAuLi5jb25maWcsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBnZXREZWZhdWx0VmFsdWUoKTogYW55IHtcblxuICAgIGxldCB2YWx1ZURlZmF1bHQgPSBzdXBlci5nZXREZWZhdWx0VmFsdWUoKTtcblxuICAgIGlmICh0eXBlb2YgdmFsdWVEZWZhdWx0ID09PSAnc3RyaW5nJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWVEZWZhdWx0ID0gSlNPTi5wYXJzZSh2YWx1ZURlZmF1bHQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgY29kZTogY29kZUVycm9yLkRlZmF1bHRWYWx1ZUlzTm90VmFsaWQsXG4gICAgICAgICAgbWVzc2FnZTogYERlZmF1bHQgdmFsdWUgb24gSlNPTiBmaWVsZCBpcyBub3QgYSB2YWxpZCBqc29uYFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZURlZmF1bHQ7XG4gIH1cblxuICBwdWJsaWMgZnJvbURCKHZhbHVlOiBhbnkpIHtcblxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSAnJykge1xuICAgICAgbGV0IGtpbmQgPSB0aGlzLmNvbmZpZy50eXBlO1xuICAgICAgaWYgKGtpbmQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgY2FzdERCKGFkYXB0ZXI6IEFkYXB0ZXIpOiBzdHJpbmcge1xuXG4gICAgaWYgKGFkYXB0ZXIuZW5naW5lID09IGVuZ2luZUtpbmQuV2ViU1FMKSB7XG4gICAgICByZXR1cm4gJ1RFWFQnO1xuICAgIH1cblxuICAgIHRocm93IHtcbiAgICAgIGNvZGU6IGNvZGVFcnJvci5FbmdpbmVOb3RJbXBsZW1lbnRlZCxcbiAgICAgIG1lc3NhZ2U6IGBFbmdpbmUgJHsgYWRhcHRlci5lbmdpbmUgfSBub3QgaW1wbGVtZW50ZWQgb24gRmllbGQgSnNvbmBcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGlzSnNvbk9iamVjdCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5jb25maWcudHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHB1YmxpYyB0b0RCKG1vZGVsOiBNb2RlbCk6IHN0cmluZyB8IG51bGwge1xuXG4gICAgbGV0IHZhbHVlID0gc3VwZXIudG9EQihtb2RlbCk7XG5cbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0cmluZ2lmeVRvRGIodmFsdWUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0cmluZ2lmeVRvRGIodmFsdWU6IGFueSk6IHN0cmluZyB7XG5cbiAgICBsZXQga2luZCA9IHRoaXMuY29uZmlnLnR5cGU7XG4gICAgbGV0IGVycm9yID0ge1xuICAgICAgY29kZTogY29kZUVycm9yLkluY29ycmVjdFZhbHVlVG9EYixcbiAgICAgIG1lc3NhZ2U6IGB2YWx1ZSBpcyBub3QgYSB2YWxpZCBqc29uYCxcbiAgICB9O1xuXG4gICAgLyogVGVzdCBpZiB2YWx1ZSBpcyB2YWxpZCAqL1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBKU09OLnBhcnNlKHZhbHVlKTsgLy9qdXN0IHRlc3RcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgaWYgKGtpbmQgIT09ICdsaXN0Jykge1xuICAgICAgICAgICAgZXJyb3IubWVzc2FnZSA9ICdKU09OIGlzIGEgb2JqZWN0LCBidXQgbXVzdCBiZSBhIGxpc3QnO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChraW5kICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgZXJyb3IubWVzc2FnZSA9ICdKU09OIGlzIGEgbGlzdCwgYnV0IG11c3QgYmUgYSBvYmplY3QnO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qIGNvbnZlcnQgdG8gc3RyaW5nICovXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn0iLCJpbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgVVVJRCB9IGZyb20gXCIuL3V1aWRcIjtcbmltcG9ydCB7IGNvZGVFcnJvciwgQ29uZmlnLCBkZWZhdWx0Q29uZmlnIH0gZnJvbSBcIi4vZmllbGRcIjtcbmltcG9ydCB7IFNjaGVtYSB9IGZyb20gXCIuLlwiO1xuXG5leHBvcnQgY2xhc3MgTWFueSBleHRlbmRzIFVVSUR7XG5cbiAgcmVhZG9ubHkgY29uZmlnOiBDb25maWc7XG4gIHByb3RlY3RlZCByZWZlcmVyOiB0eXBlb2YgTW9kZWw7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCByZWZlcmVyOiB0eXBlb2YgTW9kZWwsIGNvbmZpZz86IFBhcnRpYWw8Q29uZmlnPil7XG5cbiAgICBzdXBlcihgJHtuYW1lfV9pZGApO1xuICAgIHRoaXMucmVmZXJlciA9IHJlZmVyZXI7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH1cbiAgfVxuXG4gIC8qXG4gIHB1YmxpYyBkZWZpbmVQcm9wZXJ0eShzY2hlbWE6IFNjaGVtYSwgbW9kZWw6IE1vZGVsKTogdm9pZCB7XG4gICAgXG4gICAgbGV0IGNvbHVtbiA9IHRoaXMuZ2V0TmFtZSgpO1xuICAgIGxldCBuYW1lID0gY29sdW1uLnJlcGxhY2UoJ19pZCcsICcnKTtcbiAgICBsZXQgcHJveHkgPSB0aGlzO1xuICAgIG1vZGVsW25hbWVdID0gYXN5bmMgZnVuY3Rpb24oaXRlbT86IHR5cGVvZiB0aGlzLnJlZmVyZXJ8c3RyaW5nKSA6IFByb21pc2U8TW9kZWx8dm9pZHx1bmRlZmluZWQ+e1xuICAgICAgXG4gICAgICBpZihpdGVtID09IHVuZGVmaW5lZCl7XG4gICAgICAgIGxldCBpZFJlZmVyZXIgPSBtb2RlbFtjb2x1bW5dOyBcbiAgICAgICAgcmV0dXJuIHByb3h5LnJlZmVyZXIuZmluZCgnaWQgPSA/JywgaWRSZWZlcmVyKTtcbiAgICAgIH1cblxuICAgICAgaWYoaXRlbSBpbnN0YW5jZW9mIHByb3h5LnJlZmVyZXIpe1xuICAgICAgICBtb2RlbFtjb2x1bW5dID0gaXRlbS5pZDtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgfVxuXG4gICAgICBsZXQgcmVmID0gYXdhaXQgcHJveHkucmVmZXJlci5maW5kKCdpZCA9ID8nLCBpdGVtKTtcbiAgICAgIGlmKHJlZiA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgdGhyb3cge2NvZGU6IGNvZGVFcnJvci5SZWZlcmVyTm90Rm91bmQsIG1lc3NhZ2U6IGBOb3QgZm91bmQgJHtpdGVtfSBvbiB0YWJsZSAke25hbWV9YH07XG4gICAgICB9XG4gICAgICBtb2RlbFtjb2x1bW5dID0gcmVmLmlkO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgfVxuICAqL1xufSIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBBZGFwdGVyLCBlbmdpbmVLaW5kIH0gZnJvbSBcIi4uL2FkYXB0ZXJcIjtcbmltcG9ydCB7IEZpZWxkLCBDb25maWcsIGRlZmF1bHRDb25maWcsIGNvZGVFcnJvciB9IGZyb20gXCIuL2ZpZWxkXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGV4dENvbmZpZyBleHRlbmRzIENvbmZpZyB7IH1cblxuZXhwb3J0IGNsYXNzIFRleHQgZXh0ZW5kcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgY29uZmlnOiBUZXh0Q29uZmlnO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgY29uZmlnOiBQYXJ0aWFsPFRleHRDb25maWc+ID0gZGVmYXVsdENvbmZpZykge1xuXG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmcm9tREIodmFsdWU6IHN0cmluZ3xudWxsKTogc3RyaW5nfHVuZGVmaW5lZCB7XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgdG9EQjxUIGV4dGVuZHMgTW9kZWw+KG1vZGVsOiBUKTogc3RyaW5nfG51bGwge1xuXG4gICAgbGV0IG5hbWUgPSB0aGlzLmdldE5hbWUoKTtcbiAgICBsZXQgdmFsdWUgPSBtb2RlbFtuYW1lIGFzIGtleW9mIFRdO1xuXG4gICAgaWYodmFsdWUgPT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0VmFsdWUoKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlLnRyaW0oKTtcbiAgICB9XG5cbiAgICB0aHJvdyB7Y29kZTogbnVsbCwgbWVzc2FnZTogYHZhbHVlIG9mICR7bmFtZX0gdG8gREIgaXMgbm90IGEgc3RyaW5nYH07XG4gIH1cblxuICBwdWJsaWMgY2FzdERCKGFkYXB0ZXI6IEFkYXB0ZXIpOiBzdHJpbmcge1xuXG4gICAgaWYgKGFkYXB0ZXIuZW5naW5lID09IGVuZ2luZUtpbmQuV2ViU1FMKSB7XG4gICAgICByZXR1cm4gJ1RFWFQnO1xuICAgIH1cblxuICAgIHRocm93IHtcbiAgICAgIGNvZGU6IGNvZGVFcnJvci5FbmdpbmVOb3RJbXBsZW1lbnRlZCxcbiAgICAgIG1lc3NhZ2U6IGBFbmdpbmUgJHsgYWRhcHRlci5lbmdpbmUgfSBub3QgaW1wbGVtZW50ZWQgb24gZmllbGQgVGV4dGBcbiAgICB9O1xuICB9XG59IiwiaW1wb3J0IHsgQWRhcHRlciwgZW5naW5lS2luZCB9IGZyb20gXCIuLi9hZGFwdGVyXCI7XG5pbXBvcnQgeyBGaWVsZCwgQ29uZmlnLCBkZWZhdWx0Q29uZmlnLCBjb2RlRXJyb3IgfSBmcm9tIFwiLi9maWVsZFwiO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcblxuZXhwb3J0IGNsYXNzIFVVSUQgZXh0ZW5kcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgY29uZmlnOiBDb25maWc7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjb25maWc6IFBhcnRpYWw8Q29uZmlnPiA9IGRlZmF1bHRDb25maWcpe1xuXG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgY2FzdERCKGFkYXB0ZXI6IEFkYXB0ZXIpOiBzdHJpbmcge1xuXG4gICAgaWYoYWRhcHRlci5lbmdpbmUgPT0gZW5naW5lS2luZC5XZWJTUUwpe1xuICAgICAgcmV0dXJuICdURVhUJztcbiAgICB9XG5cbiAgICB0aHJvdyB7Y29kZTogY29kZUVycm9yLkVuZ2luZU5vdEltcGxlbWVudGVkLCBcbiAgICAgIG1lc3NhZ2U6IGBFbmdpbmUgJHthZGFwdGVyLmVuZ2luZX0gbm90IGltcGxlbWVudGVkIG9uIEZpZWxkIFVVSURgfTtcbiAgfVxuXG4gIHB1YmxpYyBmcm9tREIodmFsdWU6IGFueSkgOiBzdHJpbmd8dW5kZWZpbmVkIHtcblxuICAgIGlmKHZhbHVlID09PSBudWxsKXtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyl7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIFxuICAgIHRocm93IHtjb2RlOiBudWxsLCBtZXNzYWdlOiAndmFsdWUgZnJvbSBEQiBpcyBub3QgYSB2YWxpZCB1dWlkJ307XG4gIH1cblxuICBwdWJsaWMgZ2V0RGVmYXVsdFZhbHVlKCkgOiBhbnkge1xuICAgIFxuICAgIGxldCB2YWx1ZSA9IHN1cGVyLmdldERlZmF1bHRWYWx1ZSgpO1xuXG4gICAgaWYodmFsdWUgPT09IG51bGwgJiYgdGhpcy5jb25maWcucHJpbWFyeSl7XG4gICAgICB2YWx1ZSA9IHV1aWQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdG9EQjxUIGV4dGVuZHMgTW9kZWw+KG1vZGVsOiBUKSA6IHN0cmluZ3xudWxsIHtcblxuICAgIGxldCB2YWx1ZSA9IHN1cGVyLnRvREIobW9kZWwpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufSIsImltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi9hZGFwdGVyXCI7XG5cbnR5cGUgdGFza0NhbGxiYWNrID0geyAodHJhbnNhY3Rpb246IFNRTFRyYW5zYWN0aW9uKTogUHJvbWlzZTx2b2lkPiB9O1xuXG5pbnRlcmZhY2UgdGFza1ZlcnNpb24ge1xuICBbdmVyc2lvbjogbnVtYmVyXTogdGFza0NhbGxiYWNrO1xufTtcblxuZXhwb3J0IGNsYXNzIE1pZ3JhdGlvbiB7XG5cbiAgcHJvdGVjdGVkIGFkYXB0ZXI6IEFkYXB0ZXI7XG4gIHByaXZhdGUgdGFza3M6IHRhc2tWZXJzaW9uID0ge307XG4gIHByaXZhdGUgZmlyc3RBY2Nlc3M/OiB0YXNrQ2FsbGJhY2s7XG5cbiAgY29uc3RydWN0b3IoYWRhcHRlcjogQWRhcHRlcikge1xuICAgIHRoaXMuYWRhcHRlciA9IGFkYXB0ZXI7XG4gIH1cblxuICBwcm90ZWN0ZWQgbWFrZSgpOiB2b2lkIHsgfVxuXG4gIHB1YmxpYyBhc3luYyBydW4oKTogUHJvbWlzZTx2b2lkPiB7XG5cbiAgICB0aGlzLm1ha2UoKTtcblxuICAgIGlmICh0aGlzLmZpcnN0QWNjZXNzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IHsgY29kZTogbnVsbCwgbWVzc2FnZTogYEZpcnN0QWNjZXNzIE1pZ3JhdGlvbiBub3QgaW1wbGVtZW50ZWQhYCB9O1xuICAgIH1cblxuICAgIGxldCB2ZXJzaW9uID0gdGhpcy5hZGFwdGVyLmdldFZlcnNpb24oKTtcbiAgICBpZiAodmVyc2lvbiA9PT0gJycpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuY2hhbmdlVmVyc2lvbigwLCB0aGlzLmZpcnN0QWNjZXNzKTtcbiAgICB9XG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuXG4gICAgICB2ZXJzaW9uKys7XG4gICAgICBsZXQgdGFzayA9IHRoaXMudGFza3NbdmVyc2lvbl07XG4gICAgICBpZiAodGFzayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCB0aGlzLmFkYXB0ZXIuY2hhbmdlVmVyc2lvbih2ZXJzaW9uLCB0YXNrKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVnaXN0ZXJGaXJzdEFjY2VzcyhjYWxsYmFjazogdGFza0NhbGxiYWNrKTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy5maXJzdEFjY2VzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyB7IGNvZGU6IHVuZGVmaW5lZCwgbWVzc2FnZTogYGZpcnN0QWNjZXNzIGNhbGxiYWNrIGFscmVkeSByZWdpc3RyZWRgIH07XG4gICAgfVxuXG4gICAgdGhpcy5maXJzdEFjY2VzcyA9IGNhbGxiYWNrO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlZ2lzdGVyKHZlcnNpb246IG51bWJlciwgY2FsbGJhY2s6IHRhc2tDYWxsYmFjayk6IHZvaWQge1xuXG4gICAgaWYgKHRoaXMudGFza3NbdmVyc2lvbl0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgeyBjb2RlOiB1bmRlZmluZWQsIG1lc3NhZ2U6IGBjYWxsYmFjayB2ZXJzaW9uICR7IHZlcnNpb24gfSBhbHJlZHkgcmVnaXN0cmVkYCB9O1xuICAgIH1cblxuICAgIHRoaXMudGFza3NbdmVyc2lvbl0gPSBjYWxsYmFjaztcbiAgfVxufSIsImV4cG9ydCBjbGFzcyBNb2RlbHtcblxuICBwdWJsaWMgX19kYXRhPzogb2JqZWN0O1xuICBwdWJsaWMgaWQ/OiBzdHJpbmc7XG59XG4iLCJpbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4vYWRhcHRlclwiO1xuaW1wb3J0IHsgU2VsZWN0IH0gZnJvbSBcIi4vYWRhcHRlci9zZWxlY3RcIjtcbmltcG9ydCB7IEluc2VydCB9IGZyb20gXCIuL2FkYXB0ZXIvaW5zZXJ0XCI7XG5pbXBvcnQgeyBwYXJhbXNUeXBlIH0gZnJvbSBcIi4vYWRhcHRlci9xdWVyeVwiO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi9tb2RlbFwiO1xuaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi9maWVsZC9maWVsZFwiO1xuaW1wb3J0IHsgQ3JlYXRlIH0gZnJvbSBcIi4vYWRhcHRlci9jcmVhdGVcIjtcbmltcG9ydCB7IFVVSUQgfSBmcm9tIFwiLi9maWVsZC91dWlkXCI7XG5cbmV4cG9ydCBjbGFzcyBTY2hlbWE8TSBleHRlbmRzIE1vZGVsPiB7XG5cbiAgcHJvdGVjdGVkIG5hbWU6IHN0cmluZztcbiAgcHJvdGVjdGVkIGFkYXB0ZXI6IEFkYXB0ZXI7XG4gIHByb3RlY3RlZCBNb2RlbDogbmV3ICgpID0+IE07XG4gIHByb3RlY3RlZCBmaWVsZHM6IEZpZWxkW10gPSBbXTtcblxuICBwcm90ZWN0ZWQgc3VwZXJGaWVsZHM6IEZpZWxkW10gPSBbXG4gICAgbmV3IFVVSUQoJ2lkJywgeyBwcmltYXJ5OiB0cnVlIH0pLFxuICBdO1xuXG4gIGNvbnN0cnVjdG9yKG1vZGVsOiBuZXcgKCkgPT4gTSwgbmFtZTogc3RyaW5nLCBmaWVsZHM6IEZpZWxkW10gPSBbXSwgYWRhcHRlcjogQWRhcHRlcikge1xuXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmFkYXB0ZXIgPSBhZGFwdGVyO1xuICAgIHRoaXMuTW9kZWwgPSBtb2RlbDtcbiAgICB0aGlzLmZpZWxkcyA9IHRoaXMuZmllbGRzLmNvbmNhdChmaWVsZHMpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNhdmVSb3cobW9kZWw6IE1vZGVsKTogUHJvbWlzZTx2b2lkPiB7XG5cbiAgICBpZiAobW9kZWwuX19kYXRhKSB7XG4gICAgICAvL3VwZGF0ZSBhcmVhXG4gICAgfVxuXG4gICAgbGV0IGluc2VydCA9IHRoaXMuaW5zZXJ0KCk7XG4gICAgaW5zZXJ0LmFkZChtb2RlbCk7XG4gICAgcmV0dXJuIGluc2VydC5zYXZlKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0TW9kZWxDbGFzcygpOiAobmV3ICgpID0+IE0pIHtcblxuICAgIHJldHVybiB0aGlzLk1vZGVsO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZSgpOiBDcmVhdGUge1xuXG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5jcmVhdGU8TT4odGhpcy5Nb2RlbCwgdGhpcyk7XG4gIH1cblxuICBwdWJsaWMgZ2V0TmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm5hbWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0RmllbGRzKCk6IEZpZWxkW10ge1xuXG4gICAgcmV0dXJuIFsuLi50aGlzLnN1cGVyRmllbGRzLCAuLi50aGlzLmZpZWxkc107XG4gIH1cblxuICBwdWJsaWMgZ2V0RmllbGQobmFtZTogc3RyaW5nKTogRmllbGQge1xuXG4gICAgZm9yIChsZXQgZmllbGQgb2YgdGhpcy5nZXRGaWVsZHMoKSkge1xuICAgICAgaWYgKG5hbWUgPT0gZmllbGQuZ2V0TmFtZSgpKSB7XG4gICAgICAgIHJldHVybiBmaWVsZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyB7IGNvZGU6IG51bGwsIG1lc3NhZ2U6IGBGaWVsZCB3aXRoIG5hbWU6ICR7IG5hbWUgfSBub3QgZXhpc3RzIGluICR7IHRoaXMubmFtZSB9YCB9O1xuICB9XG5cbiAgcHVibGljIGdldENvbHVtbnMoKTogc3RyaW5nW10ge1xuXG4gICAgbGV0IGNvbHVtbnM6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQgZmllbGQgb2YgdGhpcy5nZXRGaWVsZHMoKSkge1xuICAgICAgY29sdW1ucy5wdXNoKGZpZWxkLmdldE5hbWUoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbHVtbnM7XG4gIH1cblxuICBwdWJsaWMgZmluZCh3aGVyZTogc3RyaW5nLCBwYXJhbTogcGFyYW1zVHlwZSk6IFByb21pc2U8TSB8IHVuZGVmaW5lZD4ge1xuXG4gICAgbGV0IHNlbGVjdCA9IHRoaXMuc2VsZWN0KCk7XG4gICAgc2VsZWN0LndoZXJlKHdoZXJlLCBwYXJhbSk7XG4gICAgcmV0dXJuIHNlbGVjdC5vbmUoKTtcbiAgfTtcblxuICBwdWJsaWMgZ2V0QWRhcHRlcigpOiBBZGFwdGVyIHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyO1xuICB9XG5cbiAgcHVibGljIHNlbGVjdCgpOiBTZWxlY3Q8TT4ge1xuICAgIGxldCBzZWxlY3QgPSB0aGlzLmFkYXB0ZXIuc2VsZWN0PE0+KHRoaXMuTW9kZWwsIHRoaXMpO1xuICAgIHNlbGVjdC5mcm9tKHRoaXMuZ2V0TmFtZSgpLCB0aGlzLmdldENvbHVtbnMoKSk7XG4gICAgcmV0dXJuIHNlbGVjdDtcbiAgfVxuXG4gIHB1YmxpYyBpbnNlcnQoKTogSW5zZXJ0IHtcbiAgICBsZXQgaW5zZXJ0OiBJbnNlcnQgPSB0aGlzLmFkYXB0ZXIuaW5zZXJ0PE0+KHRoaXMuTW9kZWwsIHRoaXMpO1xuICAgIHJldHVybiBpbnNlcnQ7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcG9wdWxhdGVGcm9tREIocm93OiB7IFtpbmRleDogc3RyaW5nXTogYW55OyB9KTogUHJvbWlzZTxNPiB7XG5cbiAgICBsZXQgZmllbGRzID0gdGhpcy5nZXRGaWVsZHMoKTtcbiAgICBsZXQgbW9kZWwgPSBuZXcgdGhpcy5Nb2RlbCgpO1xuICAgIG1vZGVsLl9fZGF0YSA9IHJvdztcbiAgICBmb3IgKGxldCBmaWVsZCBvZiBmaWVsZHMpIHtcbiAgICAgIGxldCBuYW1lID0gZmllbGQuZ2V0TmFtZSgpO1xuICAgICAgbW9kZWxbbmFtZSBhcyBrZXlvZiBNXSA9IGZpZWxkLmZyb21EQihyb3dbbmFtZV0pO1xuICAgIH1cblxuICAgIHJldHVybiBtb2RlbDtcbiAgfVxuXG4gIC8qXG4gIHB1YmxpYyBhc3luYyBwb3B1bGF0ZUZyb21EQjxUIGV4dGVuZHMgTW9kZWw+KHJvdzogeyBbaW5kZXg6IHN0cmluZ106IGFueTsgfSwgbW9kZWw6IFQpOiBQcm9taXNlPFQ+IHtcblxuICAgIGxldCBwcm9taXNlczogUHJvbWlzZTxhbnk+W10gPSBbXTtcbiAgICBsZXQgZmllbGRzID0gdGhpcy5nZXRSZWFsRmllbGRzKCk7XG4gICAgbGV0IGtleXM6IHN0cmluZ1tdID0gW107XG4gIFxuICAgIGZvciAobGV0IGZpZWxkIG9mIGZpZWxkcykge1xuICAgICAgbGV0IG5hbWUgPSBmaWVsZC5nZXROYW1lKCk7XG4gICAgICBsZXQgcHJvbWlzZVBvcHVsYXRlID0gZmllbGQucG9wdWxhdGUobW9kZWwsIHJvdyk7XG4gICAgICBtb2RlbC5fX2RhdGFbbmFtZV0gPSBwcm9taXNlUG9wdWxhdGU7XG4gICAgICBwcm9taXNlcy5wdXNoKHByb21pc2VQb3B1bGF0ZSk7XG4gICAgICBrZXlzLnB1c2gobmFtZSk7XG4gICAgfVxuXG4gICAgbGV0IGRhdGEgPSBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgZm9yKGxldCBrIGluIGtleXMpe1xuICAgICAgbGV0IG5hbWUgPSBrZXlzW2tdO1xuICAgICAgbW9kZWxbbmFtZSBhcyBrZXlvZiBUXSA9IGRhdGFba107XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZGVsO1xuICB9XG5cbiAgcHVibGljIGRlZmluZVByb3BlcnRpZXMobW9kZWw6IE1vZGVsKSA6IHZvaWQge1xuXG4gICAgZm9yKGxldCBmaWVsZCBvZiB0aGlzLmdldEZpZWxkcygpKXtcbiAgICAgIGZpZWxkLmRlZmluZVByb3BlcnR5KHRoaXMsIG1vZGVsKTtcbiAgICB9XG4gIH0gXG4gICovXG59IiwiZXhwb3J0IHsgZGVmYXVsdCBhcyB2MSB9IGZyb20gJy4vdjEuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2MyB9IGZyb20gJy4vdjMuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2NCB9IGZyb20gJy4vdjQuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2NSB9IGZyb20gJy4vdjUuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBOSUwgfSBmcm9tICcuL25pbC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHZlcnNpb24gfSBmcm9tICcuL3ZlcnNpb24uanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2YWxpZGF0ZSB9IGZyb20gJy4vdmFsaWRhdGUuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzdHJpbmdpZnkgfSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHBhcnNlIH0gZnJvbSAnLi9wYXJzZS5qcyc7IiwiLypcbiAqIEJyb3dzZXItY29tcGF0aWJsZSBKYXZhU2NyaXB0IE1ENVxuICpcbiAqIE1vZGlmaWNhdGlvbiBvZiBKYXZhU2NyaXB0IE1ENVxuICogaHR0cHM6Ly9naXRodWIuY29tL2JsdWVpbXAvSmF2YVNjcmlwdC1NRDVcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMSwgU2ViYXN0aWFuIFRzY2hhblxuICogaHR0cHM6Ly9ibHVlaW1wLm5ldFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcbiAqIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKlxuICogQmFzZWQgb25cbiAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgUlNBIERhdGEgU2VjdXJpdHksIEluYy4gTUQ1IE1lc3NhZ2VcbiAqIERpZ2VzdCBBbGdvcml0aG0sIGFzIGRlZmluZWQgaW4gUkZDIDEzMjEuXG4gKiBWZXJzaW9uIDIuMiBDb3B5cmlnaHQgKEMpIFBhdWwgSm9obnN0b24gMTk5OSAtIDIwMDlcbiAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSBCU0QgTGljZW5zZVxuICogU2VlIGh0dHA6Ly9wYWpob21lLm9yZy51ay9jcnlwdC9tZDUgZm9yIG1vcmUgaW5mby5cbiAqL1xuZnVuY3Rpb24gbWQ1KGJ5dGVzKSB7XG4gIGlmICh0eXBlb2YgYnl0ZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIG1zZyA9IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChieXRlcykpOyAvLyBVVEY4IGVzY2FwZVxuXG4gICAgYnl0ZXMgPSBuZXcgVWludDhBcnJheShtc2cubGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXNnLmxlbmd0aDsgKytpKSB7XG4gICAgICBieXRlc1tpXSA9IG1zZy5jaGFyQ29kZUF0KGkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtZDVUb0hleEVuY29kZWRBcnJheSh3b3Jkc1RvTWQ1KGJ5dGVzVG9Xb3JkcyhieXRlcyksIGJ5dGVzLmxlbmd0aCAqIDgpKTtcbn1cbi8qXG4gKiBDb252ZXJ0IGFuIGFycmF5IG9mIGxpdHRsZS1lbmRpYW4gd29yZHMgdG8gYW4gYXJyYXkgb2YgYnl0ZXNcbiAqL1xuXG5cbmZ1bmN0aW9uIG1kNVRvSGV4RW5jb2RlZEFycmF5KGlucHV0KSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgdmFyIGxlbmd0aDMyID0gaW5wdXQubGVuZ3RoICogMzI7XG4gIHZhciBoZXhUYWIgPSAnMDEyMzQ1Njc4OWFiY2RlZic7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGgzMjsgaSArPSA4KSB7XG4gICAgdmFyIHggPSBpbnB1dFtpID4+IDVdID4+PiBpICUgMzIgJiAweGZmO1xuICAgIHZhciBoZXggPSBwYXJzZUludChoZXhUYWIuY2hhckF0KHggPj4+IDQgJiAweDBmKSArIGhleFRhYi5jaGFyQXQoeCAmIDB4MGYpLCAxNik7XG4gICAgb3V0cHV0LnB1c2goaGV4KTtcbiAgfVxuXG4gIHJldHVybiBvdXRwdXQ7XG59XG4vKipcbiAqIENhbGN1bGF0ZSBvdXRwdXQgbGVuZ3RoIHdpdGggcGFkZGluZyBhbmQgYml0IGxlbmd0aFxuICovXG5cblxuZnVuY3Rpb24gZ2V0T3V0cHV0TGVuZ3RoKGlucHV0TGVuZ3RoOCkge1xuICByZXR1cm4gKGlucHV0TGVuZ3RoOCArIDY0ID4+PiA5IDw8IDQpICsgMTQgKyAxO1xufVxuLypcbiAqIENhbGN1bGF0ZSB0aGUgTUQ1IG9mIGFuIGFycmF5IG9mIGxpdHRsZS1lbmRpYW4gd29yZHMsIGFuZCBhIGJpdCBsZW5ndGguXG4gKi9cblxuXG5mdW5jdGlvbiB3b3Jkc1RvTWQ1KHgsIGxlbikge1xuICAvKiBhcHBlbmQgcGFkZGluZyAqL1xuICB4W2xlbiA+PiA1XSB8PSAweDgwIDw8IGxlbiAlIDMyO1xuICB4W2dldE91dHB1dExlbmd0aChsZW4pIC0gMV0gPSBsZW47XG4gIHZhciBhID0gMTczMjU4NDE5MztcbiAgdmFyIGIgPSAtMjcxNzMzODc5O1xuICB2YXIgYyA9IC0xNzMyNTg0MTk0O1xuICB2YXIgZCA9IDI3MTczMzg3ODtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpICs9IDE2KSB7XG4gICAgdmFyIG9sZGEgPSBhO1xuICAgIHZhciBvbGRiID0gYjtcbiAgICB2YXIgb2xkYyA9IGM7XG4gICAgdmFyIG9sZGQgPSBkO1xuICAgIGEgPSBtZDVmZihhLCBiLCBjLCBkLCB4W2ldLCA3LCAtNjgwODc2OTM2KTtcbiAgICBkID0gbWQ1ZmYoZCwgYSwgYiwgYywgeFtpICsgMV0sIDEyLCAtMzg5NTY0NTg2KTtcbiAgICBjID0gbWQ1ZmYoYywgZCwgYSwgYiwgeFtpICsgMl0sIDE3LCA2MDYxMDU4MTkpO1xuICAgIGIgPSBtZDVmZihiLCBjLCBkLCBhLCB4W2kgKyAzXSwgMjIsIC0xMDQ0NTI1MzMwKTtcbiAgICBhID0gbWQ1ZmYoYSwgYiwgYywgZCwgeFtpICsgNF0sIDcsIC0xNzY0MTg4OTcpO1xuICAgIGQgPSBtZDVmZihkLCBhLCBiLCBjLCB4W2kgKyA1XSwgMTIsIDEyMDAwODA0MjYpO1xuICAgIGMgPSBtZDVmZihjLCBkLCBhLCBiLCB4W2kgKyA2XSwgMTcsIC0xNDczMjMxMzQxKTtcbiAgICBiID0gbWQ1ZmYoYiwgYywgZCwgYSwgeFtpICsgN10sIDIyLCAtNDU3MDU5ODMpO1xuICAgIGEgPSBtZDVmZihhLCBiLCBjLCBkLCB4W2kgKyA4XSwgNywgMTc3MDAzNTQxNik7XG4gICAgZCA9IG1kNWZmKGQsIGEsIGIsIGMsIHhbaSArIDldLCAxMiwgLTE5NTg0MTQ0MTcpO1xuICAgIGMgPSBtZDVmZihjLCBkLCBhLCBiLCB4W2kgKyAxMF0sIDE3LCAtNDIwNjMpO1xuICAgIGIgPSBtZDVmZihiLCBjLCBkLCBhLCB4W2kgKyAxMV0sIDIyLCAtMTk5MDQwNDE2Mik7XG4gICAgYSA9IG1kNWZmKGEsIGIsIGMsIGQsIHhbaSArIDEyXSwgNywgMTgwNDYwMzY4Mik7XG4gICAgZCA9IG1kNWZmKGQsIGEsIGIsIGMsIHhbaSArIDEzXSwgMTIsIC00MDM0MTEwMSk7XG4gICAgYyA9IG1kNWZmKGMsIGQsIGEsIGIsIHhbaSArIDE0XSwgMTcsIC0xNTAyMDAyMjkwKTtcbiAgICBiID0gbWQ1ZmYoYiwgYywgZCwgYSwgeFtpICsgMTVdLCAyMiwgMTIzNjUzNTMyOSk7XG4gICAgYSA9IG1kNWdnKGEsIGIsIGMsIGQsIHhbaSArIDFdLCA1LCAtMTY1Nzk2NTEwKTtcbiAgICBkID0gbWQ1Z2coZCwgYSwgYiwgYywgeFtpICsgNl0sIDksIC0xMDY5NTAxNjMyKTtcbiAgICBjID0gbWQ1Z2coYywgZCwgYSwgYiwgeFtpICsgMTFdLCAxNCwgNjQzNzE3NzEzKTtcbiAgICBiID0gbWQ1Z2coYiwgYywgZCwgYSwgeFtpXSwgMjAsIC0zNzM4OTczMDIpO1xuICAgIGEgPSBtZDVnZyhhLCBiLCBjLCBkLCB4W2kgKyA1XSwgNSwgLTcwMTU1ODY5MSk7XG4gICAgZCA9IG1kNWdnKGQsIGEsIGIsIGMsIHhbaSArIDEwXSwgOSwgMzgwMTYwODMpO1xuICAgIGMgPSBtZDVnZyhjLCBkLCBhLCBiLCB4W2kgKyAxNV0sIDE0LCAtNjYwNDc4MzM1KTtcbiAgICBiID0gbWQ1Z2coYiwgYywgZCwgYSwgeFtpICsgNF0sIDIwLCAtNDA1NTM3ODQ4KTtcbiAgICBhID0gbWQ1Z2coYSwgYiwgYywgZCwgeFtpICsgOV0sIDUsIDU2ODQ0NjQzOCk7XG4gICAgZCA9IG1kNWdnKGQsIGEsIGIsIGMsIHhbaSArIDE0XSwgOSwgLTEwMTk4MDM2OTApO1xuICAgIGMgPSBtZDVnZyhjLCBkLCBhLCBiLCB4W2kgKyAzXSwgMTQsIC0xODczNjM5NjEpO1xuICAgIGIgPSBtZDVnZyhiLCBjLCBkLCBhLCB4W2kgKyA4XSwgMjAsIDExNjM1MzE1MDEpO1xuICAgIGEgPSBtZDVnZyhhLCBiLCBjLCBkLCB4W2kgKyAxM10sIDUsIC0xNDQ0NjgxNDY3KTtcbiAgICBkID0gbWQ1Z2coZCwgYSwgYiwgYywgeFtpICsgMl0sIDksIC01MTQwMzc4NCk7XG4gICAgYyA9IG1kNWdnKGMsIGQsIGEsIGIsIHhbaSArIDddLCAxNCwgMTczNTMyODQ3Myk7XG4gICAgYiA9IG1kNWdnKGIsIGMsIGQsIGEsIHhbaSArIDEyXSwgMjAsIC0xOTI2NjA3NzM0KTtcbiAgICBhID0gbWQ1aGgoYSwgYiwgYywgZCwgeFtpICsgNV0sIDQsIC0zNzg1NTgpO1xuICAgIGQgPSBtZDVoaChkLCBhLCBiLCBjLCB4W2kgKyA4XSwgMTEsIC0yMDIyNTc0NDYzKTtcbiAgICBjID0gbWQ1aGgoYywgZCwgYSwgYiwgeFtpICsgMTFdLCAxNiwgMTgzOTAzMDU2Mik7XG4gICAgYiA9IG1kNWhoKGIsIGMsIGQsIGEsIHhbaSArIDE0XSwgMjMsIC0zNTMwOTU1Nik7XG4gICAgYSA9IG1kNWhoKGEsIGIsIGMsIGQsIHhbaSArIDFdLCA0LCAtMTUzMDk5MjA2MCk7XG4gICAgZCA9IG1kNWhoKGQsIGEsIGIsIGMsIHhbaSArIDRdLCAxMSwgMTI3Mjg5MzM1Myk7XG4gICAgYyA9IG1kNWhoKGMsIGQsIGEsIGIsIHhbaSArIDddLCAxNiwgLTE1NTQ5NzYzMik7XG4gICAgYiA9IG1kNWhoKGIsIGMsIGQsIGEsIHhbaSArIDEwXSwgMjMsIC0xMDk0NzMwNjQwKTtcbiAgICBhID0gbWQ1aGgoYSwgYiwgYywgZCwgeFtpICsgMTNdLCA0LCA2ODEyNzkxNzQpO1xuICAgIGQgPSBtZDVoaChkLCBhLCBiLCBjLCB4W2ldLCAxMSwgLTM1ODUzNzIyMik7XG4gICAgYyA9IG1kNWhoKGMsIGQsIGEsIGIsIHhbaSArIDNdLCAxNiwgLTcyMjUyMTk3OSk7XG4gICAgYiA9IG1kNWhoKGIsIGMsIGQsIGEsIHhbaSArIDZdLCAyMywgNzYwMjkxODkpO1xuICAgIGEgPSBtZDVoaChhLCBiLCBjLCBkLCB4W2kgKyA5XSwgNCwgLTY0MDM2NDQ4Nyk7XG4gICAgZCA9IG1kNWhoKGQsIGEsIGIsIGMsIHhbaSArIDEyXSwgMTEsIC00MjE4MTU4MzUpO1xuICAgIGMgPSBtZDVoaChjLCBkLCBhLCBiLCB4W2kgKyAxNV0sIDE2LCA1MzA3NDI1MjApO1xuICAgIGIgPSBtZDVoaChiLCBjLCBkLCBhLCB4W2kgKyAyXSwgMjMsIC05OTUzMzg2NTEpO1xuICAgIGEgPSBtZDVpaShhLCBiLCBjLCBkLCB4W2ldLCA2LCAtMTk4NjMwODQ0KTtcbiAgICBkID0gbWQ1aWkoZCwgYSwgYiwgYywgeFtpICsgN10sIDEwLCAxMTI2ODkxNDE1KTtcbiAgICBjID0gbWQ1aWkoYywgZCwgYSwgYiwgeFtpICsgMTRdLCAxNSwgLTE0MTYzNTQ5MDUpO1xuICAgIGIgPSBtZDVpaShiLCBjLCBkLCBhLCB4W2kgKyA1XSwgMjEsIC01NzQzNDA1NSk7XG4gICAgYSA9IG1kNWlpKGEsIGIsIGMsIGQsIHhbaSArIDEyXSwgNiwgMTcwMDQ4NTU3MSk7XG4gICAgZCA9IG1kNWlpKGQsIGEsIGIsIGMsIHhbaSArIDNdLCAxMCwgLTE4OTQ5ODY2MDYpO1xuICAgIGMgPSBtZDVpaShjLCBkLCBhLCBiLCB4W2kgKyAxMF0sIDE1LCAtMTA1MTUyMyk7XG4gICAgYiA9IG1kNWlpKGIsIGMsIGQsIGEsIHhbaSArIDFdLCAyMSwgLTIwNTQ5MjI3OTkpO1xuICAgIGEgPSBtZDVpaShhLCBiLCBjLCBkLCB4W2kgKyA4XSwgNiwgMTg3MzMxMzM1OSk7XG4gICAgZCA9IG1kNWlpKGQsIGEsIGIsIGMsIHhbaSArIDE1XSwgMTAsIC0zMDYxMTc0NCk7XG4gICAgYyA9IG1kNWlpKGMsIGQsIGEsIGIsIHhbaSArIDZdLCAxNSwgLTE1NjAxOTgzODApO1xuICAgIGIgPSBtZDVpaShiLCBjLCBkLCBhLCB4W2kgKyAxM10sIDIxLCAxMzA5MTUxNjQ5KTtcbiAgICBhID0gbWQ1aWkoYSwgYiwgYywgZCwgeFtpICsgNF0sIDYsIC0xNDU1MjMwNzApO1xuICAgIGQgPSBtZDVpaShkLCBhLCBiLCBjLCB4W2kgKyAxMV0sIDEwLCAtMTEyMDIxMDM3OSk7XG4gICAgYyA9IG1kNWlpKGMsIGQsIGEsIGIsIHhbaSArIDJdLCAxNSwgNzE4Nzg3MjU5KTtcbiAgICBiID0gbWQ1aWkoYiwgYywgZCwgYSwgeFtpICsgOV0sIDIxLCAtMzQzNDg1NTUxKTtcbiAgICBhID0gc2FmZUFkZChhLCBvbGRhKTtcbiAgICBiID0gc2FmZUFkZChiLCBvbGRiKTtcbiAgICBjID0gc2FmZUFkZChjLCBvbGRjKTtcbiAgICBkID0gc2FmZUFkZChkLCBvbGRkKTtcbiAgfVxuXG4gIHJldHVybiBbYSwgYiwgYywgZF07XG59XG4vKlxuICogQ29udmVydCBhbiBhcnJheSBieXRlcyB0byBhbiBhcnJheSBvZiBsaXR0bGUtZW5kaWFuIHdvcmRzXG4gKiBDaGFyYWN0ZXJzID4yNTUgaGF2ZSB0aGVpciBoaWdoLWJ5dGUgc2lsZW50bHkgaWdub3JlZC5cbiAqL1xuXG5cbmZ1bmN0aW9uIGJ5dGVzVG9Xb3JkcyhpbnB1dCkge1xuICBpZiAoaW5wdXQubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgdmFyIGxlbmd0aDggPSBpbnB1dC5sZW5ndGggKiA4O1xuICB2YXIgb3V0cHV0ID0gbmV3IFVpbnQzMkFycmF5KGdldE91dHB1dExlbmd0aChsZW5ndGg4KSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg4OyBpICs9IDgpIHtcbiAgICBvdXRwdXRbaSA+PiA1XSB8PSAoaW5wdXRbaSAvIDhdICYgMHhmZikgPDwgaSAlIDMyO1xuICB9XG5cbiAgcmV0dXJuIG91dHB1dDtcbn1cbi8qXG4gKiBBZGQgaW50ZWdlcnMsIHdyYXBwaW5nIGF0IDJeMzIuIFRoaXMgdXNlcyAxNi1iaXQgb3BlcmF0aW9ucyBpbnRlcm5hbGx5XG4gKiB0byB3b3JrIGFyb3VuZCBidWdzIGluIHNvbWUgSlMgaW50ZXJwcmV0ZXJzLlxuICovXG5cblxuZnVuY3Rpb24gc2FmZUFkZCh4LCB5KSB7XG4gIHZhciBsc3cgPSAoeCAmIDB4ZmZmZikgKyAoeSAmIDB4ZmZmZik7XG4gIHZhciBtc3cgPSAoeCA+PiAxNikgKyAoeSA+PiAxNikgKyAobHN3ID4+IDE2KTtcbiAgcmV0dXJuIG1zdyA8PCAxNiB8IGxzdyAmIDB4ZmZmZjtcbn1cbi8qXG4gKiBCaXR3aXNlIHJvdGF0ZSBhIDMyLWJpdCBudW1iZXIgdG8gdGhlIGxlZnQuXG4gKi9cblxuXG5mdW5jdGlvbiBiaXRSb3RhdGVMZWZ0KG51bSwgY250KSB7XG4gIHJldHVybiBudW0gPDwgY250IHwgbnVtID4+PiAzMiAtIGNudDtcbn1cbi8qXG4gKiBUaGVzZSBmdW5jdGlvbnMgaW1wbGVtZW50IHRoZSBmb3VyIGJhc2ljIG9wZXJhdGlvbnMgdGhlIGFsZ29yaXRobSB1c2VzLlxuICovXG5cblxuZnVuY3Rpb24gbWQ1Y21uKHEsIGEsIGIsIHgsIHMsIHQpIHtcbiAgcmV0dXJuIHNhZmVBZGQoYml0Um90YXRlTGVmdChzYWZlQWRkKHNhZmVBZGQoYSwgcSksIHNhZmVBZGQoeCwgdCkpLCBzKSwgYik7XG59XG5cbmZ1bmN0aW9uIG1kNWZmKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgcmV0dXJuIG1kNWNtbihiICYgYyB8IH5iICYgZCwgYSwgYiwgeCwgcywgdCk7XG59XG5cbmZ1bmN0aW9uIG1kNWdnKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgcmV0dXJuIG1kNWNtbihiICYgZCB8IGMgJiB+ZCwgYSwgYiwgeCwgcywgdCk7XG59XG5cbmZ1bmN0aW9uIG1kNWhoKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgcmV0dXJuIG1kNWNtbihiIF4gYyBeIGQsIGEsIGIsIHgsIHMsIHQpO1xufVxuXG5mdW5jdGlvbiBtZDVpaShhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XG4gIHJldHVybiBtZDVjbW4oYyBeIChiIHwgfmQpLCBhLCBiLCB4LCBzLCB0KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWQ1OyIsImV4cG9ydCBkZWZhdWx0ICcwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAnOyIsImltcG9ydCB2YWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlLmpzJztcblxuZnVuY3Rpb24gcGFyc2UodXVpZCkge1xuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdJbnZhbGlkIFVVSUQnKTtcbiAgfVxuXG4gIHZhciB2O1xuICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoMTYpOyAvLyBQYXJzZSAjIyMjIyMjIy0uLi4uLS4uLi4tLi4uLi0uLi4uLi4uLi4uLi5cblxuICBhcnJbMF0gPSAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoMCwgOCksIDE2KSkgPj4+IDI0O1xuICBhcnJbMV0gPSB2ID4+PiAxNiAmIDB4ZmY7XG4gIGFyclsyXSA9IHYgPj4+IDggJiAweGZmO1xuICBhcnJbM10gPSB2ICYgMHhmZjsgLy8gUGFyc2UgLi4uLi4uLi4tIyMjIy0uLi4uLS4uLi4tLi4uLi4uLi4uLi4uXG5cbiAgYXJyWzRdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDksIDEzKSwgMTYpKSA+Pj4gODtcbiAgYXJyWzVdID0gdiAmIDB4ZmY7IC8vIFBhcnNlIC4uLi4uLi4uLS4uLi4tIyMjIy0uLi4uLS4uLi4uLi4uLi4uLlxuXG4gIGFycls2XSA9ICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSgxNCwgMTgpLCAxNikpID4+PiA4O1xuICBhcnJbN10gPSB2ICYgMHhmZjsgLy8gUGFyc2UgLi4uLi4uLi4tLi4uLi0uLi4uLSMjIyMtLi4uLi4uLi4uLi4uXG5cbiAgYXJyWzhdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDE5LCAyMyksIDE2KSkgPj4+IDg7XG4gIGFycls5XSA9IHYgJiAweGZmOyAvLyBQYXJzZSAuLi4uLi4uLi0uLi4uLS4uLi4tLi4uLi0jIyMjIyMjIyMjIyNcbiAgLy8gKFVzZSBcIi9cIiB0byBhdm9pZCAzMi1iaXQgdHJ1bmNhdGlvbiB3aGVuIGJpdC1zaGlmdGluZyBoaWdoLW9yZGVyIGJ5dGVzKVxuXG4gIGFyclsxMF0gPSAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoMjQsIDM2KSwgMTYpKSAvIDB4MTAwMDAwMDAwMDAgJiAweGZmO1xuICBhcnJbMTFdID0gdiAvIDB4MTAwMDAwMDAwICYgMHhmZjtcbiAgYXJyWzEyXSA9IHYgPj4+IDI0ICYgMHhmZjtcbiAgYXJyWzEzXSA9IHYgPj4+IDE2ICYgMHhmZjtcbiAgYXJyWzE0XSA9IHYgPj4+IDggJiAweGZmO1xuICBhcnJbMTVdID0gdiAmIDB4ZmY7XG4gIHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhcnNlOyIsImV4cG9ydCBkZWZhdWx0IC9eKD86WzAtOWEtZl17OH0tWzAtOWEtZl17NH0tWzEtNV1bMC05YS1mXXszfS1bODlhYl1bMC05YS1mXXszfS1bMC05YS1mXXsxMn18MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwKSQvaTsiLCIvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiBJbiB0aGUgYnJvd3NlciB3ZSB0aGVyZWZvcmVcbi8vIHJlcXVpcmUgdGhlIGNyeXB0byBBUEkgYW5kIGRvIG5vdCBzdXBwb3J0IGJ1aWx0LWluIGZhbGxiYWNrIHRvIGxvd2VyIHF1YWxpdHkgcmFuZG9tIG51bWJlclxuLy8gZ2VuZXJhdG9ycyAobGlrZSBNYXRoLnJhbmRvbSgpKS5cbnZhciBnZXRSYW5kb21WYWx1ZXM7XG52YXIgcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBybmcoKSB7XG4gIC8vIGxhenkgbG9hZCBzbyB0aGF0IGVudmlyb25tZW50cyB0aGF0IG5lZWQgdG8gcG9seWZpbGwgaGF2ZSBhIGNoYW5jZSB0byBkbyBzb1xuICBpZiAoIWdldFJhbmRvbVZhbHVlcykge1xuICAgIC8vIGdldFJhbmRvbVZhbHVlcyBuZWVkcyB0byBiZSBpbnZva2VkIGluIGEgY29udGV4dCB3aGVyZSBcInRoaXNcIiBpcyBhIENyeXB0byBpbXBsZW1lbnRhdGlvbi4gQWxzbyxcbiAgICAvLyBmaW5kIHRoZSBjb21wbGV0ZSBpbXBsZW1lbnRhdGlvbiBvZiBjcnlwdG8gKG1zQ3J5cHRvKSBvbiBJRTExLlxuICAgIGdldFJhbmRvbVZhbHVlcyA9IHR5cGVvZiBjcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKGNyeXB0bykgfHwgdHlwZW9mIG1zQ3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzID09PSAnZnVuY3Rpb24nICYmIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKG1zQ3J5cHRvKTtcblxuICAgIGlmICghZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NyeXB0by5nZXRSYW5kb21WYWx1ZXMoKSBub3Qgc3VwcG9ydGVkLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkI2dldHJhbmRvbXZhbHVlcy1ub3Qtc3VwcG9ydGVkJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGdldFJhbmRvbVZhbHVlcyhybmRzOCk7XG59IiwiLy8gQWRhcHRlZCBmcm9tIENocmlzIFZlbmVzcycgU0hBMSBjb2RlIGF0XG4vLyBodHRwOi8vd3d3Lm1vdmFibGUtdHlwZS5jby51ay9zY3JpcHRzL3NoYTEuaHRtbFxuZnVuY3Rpb24gZihzLCB4LCB5LCB6KSB7XG4gIHN3aXRjaCAocykge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiB4ICYgeSBeIH54ICYgejtcblxuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiB4IF4geSBeIHo7XG5cbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4geCAmIHkgXiB4ICYgeiBeIHkgJiB6O1xuXG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIHggXiB5IF4gejtcbiAgfVxufVxuXG5mdW5jdGlvbiBST1RMKHgsIG4pIHtcbiAgcmV0dXJuIHggPDwgbiB8IHggPj4+IDMyIC0gbjtcbn1cblxuZnVuY3Rpb24gc2hhMShieXRlcykge1xuICB2YXIgSyA9IFsweDVhODI3OTk5LCAweDZlZDllYmExLCAweDhmMWJiY2RjLCAweGNhNjJjMWQ2XTtcbiAgdmFyIEggPSBbMHg2NzQ1MjMwMSwgMHhlZmNkYWI4OSwgMHg5OGJhZGNmZSwgMHgxMDMyNTQ3NiwgMHhjM2QyZTFmMF07XG5cbiAgaWYgKHR5cGVvZiBieXRlcyA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgbXNnID0gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KGJ5dGVzKSk7IC8vIFVURjggZXNjYXBlXG5cbiAgICBieXRlcyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtc2cubGVuZ3RoOyArK2kpIHtcbiAgICAgIGJ5dGVzLnB1c2gobXNnLmNoYXJDb2RlQXQoaSkpO1xuICAgIH1cbiAgfSBlbHNlIGlmICghQXJyYXkuaXNBcnJheShieXRlcykpIHtcbiAgICAvLyBDb252ZXJ0IEFycmF5LWxpa2UgdG8gQXJyYXlcbiAgICBieXRlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGJ5dGVzKTtcbiAgfVxuXG4gIGJ5dGVzLnB1c2goMHg4MCk7XG4gIHZhciBsID0gYnl0ZXMubGVuZ3RoIC8gNCArIDI7XG4gIHZhciBOID0gTWF0aC5jZWlsKGwgLyAxNik7XG4gIHZhciBNID0gbmV3IEFycmF5KE4pO1xuXG4gIGZvciAodmFyIF9pID0gMDsgX2kgPCBOOyArK19pKSB7XG4gICAgdmFyIGFyciA9IG5ldyBVaW50MzJBcnJheSgxNik7XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IDE2OyArK2opIHtcbiAgICAgIGFycltqXSA9IGJ5dGVzW19pICogNjQgKyBqICogNF0gPDwgMjQgfCBieXRlc1tfaSAqIDY0ICsgaiAqIDQgKyAxXSA8PCAxNiB8IGJ5dGVzW19pICogNjQgKyBqICogNCArIDJdIDw8IDggfCBieXRlc1tfaSAqIDY0ICsgaiAqIDQgKyAzXTtcbiAgICB9XG5cbiAgICBNW19pXSA9IGFycjtcbiAgfVxuXG4gIE1bTiAtIDFdWzE0XSA9IChieXRlcy5sZW5ndGggLSAxKSAqIDggLyBNYXRoLnBvdygyLCAzMik7XG4gIE1bTiAtIDFdWzE0XSA9IE1hdGguZmxvb3IoTVtOIC0gMV1bMTRdKTtcbiAgTVtOIC0gMV1bMTVdID0gKGJ5dGVzLmxlbmd0aCAtIDEpICogOCAmIDB4ZmZmZmZmZmY7XG5cbiAgZm9yICh2YXIgX2kyID0gMDsgX2kyIDwgTjsgKytfaTIpIHtcbiAgICB2YXIgVyA9IG5ldyBVaW50MzJBcnJheSg4MCk7XG5cbiAgICBmb3IgKHZhciB0ID0gMDsgdCA8IDE2OyArK3QpIHtcbiAgICAgIFdbdF0gPSBNW19pMl1bdF07XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX3QgPSAxNjsgX3QgPCA4MDsgKytfdCkge1xuICAgICAgV1tfdF0gPSBST1RMKFdbX3QgLSAzXSBeIFdbX3QgLSA4XSBeIFdbX3QgLSAxNF0gXiBXW190IC0gMTZdLCAxKTtcbiAgICB9XG5cbiAgICB2YXIgYSA9IEhbMF07XG4gICAgdmFyIGIgPSBIWzFdO1xuICAgIHZhciBjID0gSFsyXTtcbiAgICB2YXIgZCA9IEhbM107XG4gICAgdmFyIGUgPSBIWzRdO1xuXG4gICAgZm9yICh2YXIgX3QyID0gMDsgX3QyIDwgODA7ICsrX3QyKSB7XG4gICAgICB2YXIgcyA9IE1hdGguZmxvb3IoX3QyIC8gMjApO1xuICAgICAgdmFyIFQgPSBST1RMKGEsIDUpICsgZihzLCBiLCBjLCBkKSArIGUgKyBLW3NdICsgV1tfdDJdID4+PiAwO1xuICAgICAgZSA9IGQ7XG4gICAgICBkID0gYztcbiAgICAgIGMgPSBST1RMKGIsIDMwKSA+Pj4gMDtcbiAgICAgIGIgPSBhO1xuICAgICAgYSA9IFQ7XG4gICAgfVxuXG4gICAgSFswXSA9IEhbMF0gKyBhID4+PiAwO1xuICAgIEhbMV0gPSBIWzFdICsgYiA+Pj4gMDtcbiAgICBIWzJdID0gSFsyXSArIGMgPj4+IDA7XG4gICAgSFszXSA9IEhbM10gKyBkID4+PiAwO1xuICAgIEhbNF0gPSBIWzRdICsgZSA+Pj4gMDtcbiAgfVxuXG4gIHJldHVybiBbSFswXSA+PiAyNCAmIDB4ZmYsIEhbMF0gPj4gMTYgJiAweGZmLCBIWzBdID4+IDggJiAweGZmLCBIWzBdICYgMHhmZiwgSFsxXSA+PiAyNCAmIDB4ZmYsIEhbMV0gPj4gMTYgJiAweGZmLCBIWzFdID4+IDggJiAweGZmLCBIWzFdICYgMHhmZiwgSFsyXSA+PiAyNCAmIDB4ZmYsIEhbMl0gPj4gMTYgJiAweGZmLCBIWzJdID4+IDggJiAweGZmLCBIWzJdICYgMHhmZiwgSFszXSA+PiAyNCAmIDB4ZmYsIEhbM10gPj4gMTYgJiAweGZmLCBIWzNdID4+IDggJiAweGZmLCBIWzNdICYgMHhmZiwgSFs0XSA+PiAyNCAmIDB4ZmYsIEhbNF0gPj4gMTYgJiAweGZmLCBIWzRdID4+IDggJiAweGZmLCBIWzRdICYgMHhmZl07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNoYTE7IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDE2IGJ5dGUgdmFsdWVzIHRvIFVVSUQgc3RyaW5nIGZvcm1hdCBvZiB0aGUgZm9ybTpcbiAqIFhYWFhYWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG5cbnZhciBieXRlVG9IZXggPSBbXTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBieXRlVG9IZXgucHVzaCgoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpKTtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KGFycikge1xuICB2YXIgb2Zmc2V0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwO1xuICAvLyBOb3RlOiBCZSBjYXJlZnVsIGVkaXRpbmcgdGhpcyBjb2RlISAgSXQncyBiZWVuIHR1bmVkIGZvciBwZXJmb3JtYW5jZVxuICAvLyBhbmQgd29ya3MgaW4gd2F5cyB5b3UgbWF5IG5vdCBleHBlY3QuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQvcHVsbC80MzRcbiAgdmFyIHV1aWQgPSAoYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAzXV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA2XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDddXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA5XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDExXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEzXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE1XV0pLnRvTG93ZXJDYXNlKCk7IC8vIENvbnNpc3RlbmN5IGNoZWNrIGZvciB2YWxpZCBVVUlELiAgSWYgdGhpcyB0aHJvd3MsIGl0J3MgbGlrZWx5IGR1ZSB0byBvbmVcbiAgLy8gb2YgdGhlIGZvbGxvd2luZzpcbiAgLy8gLSBPbmUgb3IgbW9yZSBpbnB1dCBhcnJheSB2YWx1ZXMgZG9uJ3QgbWFwIHRvIGEgaGV4IG9jdGV0IChsZWFkaW5nIHRvXG4gIC8vIFwidW5kZWZpbmVkXCIgaW4gdGhlIHV1aWQpXG4gIC8vIC0gSW52YWxpZCBpbnB1dCB2YWx1ZXMgZm9yIHRoZSBSRkMgYHZlcnNpb25gIG9yIGB2YXJpYW50YCBmaWVsZHNcblxuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdTdHJpbmdpZmllZCBVVUlEIGlzIGludmFsaWQnKTtcbiAgfVxuXG4gIHJldHVybiB1dWlkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdHJpbmdpZnk7IiwiaW1wb3J0IHJuZyBmcm9tICcuL3JuZy5qcyc7XG5pbXBvcnQgc3RyaW5naWZ5IGZyb20gJy4vc3RyaW5naWZ5LmpzJzsgLy8gKipgdjEoKWAgLSBHZW5lcmF0ZSB0aW1lLWJhc2VkIFVVSUQqKlxuLy9cbi8vIEluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9MaW9zSy9VVUlELmpzXG4vLyBhbmQgaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L3V1aWQuaHRtbFxuXG52YXIgX25vZGVJZDtcblxudmFyIF9jbG9ja3NlcTsgLy8gUHJldmlvdXMgdXVpZCBjcmVhdGlvbiB0aW1lXG5cblxudmFyIF9sYXN0TVNlY3MgPSAwO1xudmFyIF9sYXN0TlNlY3MgPSAwOyAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkIGZvciBBUEkgZGV0YWlsc1xuXG5mdW5jdGlvbiB2MShvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcbiAgdmFyIGIgPSBidWYgfHwgbmV3IEFycmF5KDE2KTtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBub2RlID0gb3B0aW9ucy5ub2RlIHx8IF9ub2RlSWQ7XG4gIHZhciBjbG9ja3NlcSA9IG9wdGlvbnMuY2xvY2tzZXEgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY2xvY2tzZXEgOiBfY2xvY2tzZXE7IC8vIG5vZGUgYW5kIGNsb2Nrc2VxIG5lZWQgdG8gYmUgaW5pdGlhbGl6ZWQgdG8gcmFuZG9tIHZhbHVlcyBpZiB0aGV5J3JlIG5vdFxuICAvLyBzcGVjaWZpZWQuICBXZSBkbyB0aGlzIGxhemlseSB0byBtaW5pbWl6ZSBpc3N1ZXMgcmVsYXRlZCB0byBpbnN1ZmZpY2llbnRcbiAgLy8gc3lzdGVtIGVudHJvcHkuICBTZWUgIzE4OVxuXG4gIGlmIChub2RlID09IG51bGwgfHwgY2xvY2tzZXEgPT0gbnVsbCkge1xuICAgIHZhciBzZWVkQnl0ZXMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpO1xuXG4gICAgaWYgKG5vZGUgPT0gbnVsbCkge1xuICAgICAgLy8gUGVyIDQuNSwgY3JlYXRlIGFuZCA0OC1iaXQgbm9kZSBpZCwgKDQ3IHJhbmRvbSBiaXRzICsgbXVsdGljYXN0IGJpdCA9IDEpXG4gICAgICBub2RlID0gX25vZGVJZCA9IFtzZWVkQnl0ZXNbMF0gfCAweDAxLCBzZWVkQnl0ZXNbMV0sIHNlZWRCeXRlc1syXSwgc2VlZEJ5dGVzWzNdLCBzZWVkQnl0ZXNbNF0sIHNlZWRCeXRlc1s1XV07XG4gICAgfVxuXG4gICAgaWYgKGNsb2Nrc2VxID09IG51bGwpIHtcbiAgICAgIC8vIFBlciA0LjIuMiwgcmFuZG9taXplICgxNCBiaXQpIGNsb2Nrc2VxXG4gICAgICBjbG9ja3NlcSA9IF9jbG9ja3NlcSA9IChzZWVkQnl0ZXNbNl0gPDwgOCB8IHNlZWRCeXRlc1s3XSkgJiAweDNmZmY7XG4gICAgfVxuICB9IC8vIFVVSUQgdGltZXN0YW1wcyBhcmUgMTAwIG5hbm8tc2Vjb25kIHVuaXRzIHNpbmNlIHRoZSBHcmVnb3JpYW4gZXBvY2gsXG4gIC8vICgxNTgyLTEwLTE1IDAwOjAwKS4gIEpTTnVtYmVycyBhcmVuJ3QgcHJlY2lzZSBlbm91Z2ggZm9yIHRoaXMsIHNvXG4gIC8vIHRpbWUgaXMgaGFuZGxlZCBpbnRlcm5hbGx5IGFzICdtc2VjcycgKGludGVnZXIgbWlsbGlzZWNvbmRzKSBhbmQgJ25zZWNzJ1xuICAvLyAoMTAwLW5hbm9zZWNvbmRzIG9mZnNldCBmcm9tIG1zZWNzKSBzaW5jZSB1bml4IGVwb2NoLCAxOTcwLTAxLTAxIDAwOjAwLlxuXG5cbiAgdmFyIG1zZWNzID0gb3B0aW9ucy5tc2VjcyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5tc2VjcyA6IERhdGUubm93KCk7IC8vIFBlciA0LjIuMS4yLCB1c2UgY291bnQgb2YgdXVpZCdzIGdlbmVyYXRlZCBkdXJpbmcgdGhlIGN1cnJlbnQgY2xvY2tcbiAgLy8gY3ljbGUgdG8gc2ltdWxhdGUgaGlnaGVyIHJlc29sdXRpb24gY2xvY2tcblxuICB2YXIgbnNlY3MgPSBvcHRpb25zLm5zZWNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm5zZWNzIDogX2xhc3ROU2VjcyArIDE7IC8vIFRpbWUgc2luY2UgbGFzdCB1dWlkIGNyZWF0aW9uIChpbiBtc2VjcylcblxuICB2YXIgZHQgPSBtc2VjcyAtIF9sYXN0TVNlY3MgKyAobnNlY3MgLSBfbGFzdE5TZWNzKSAvIDEwMDAwOyAvLyBQZXIgNC4yLjEuMiwgQnVtcCBjbG9ja3NlcSBvbiBjbG9jayByZWdyZXNzaW9uXG5cbiAgaWYgKGR0IDwgMCAmJiBvcHRpb25zLmNsb2Nrc2VxID09PSB1bmRlZmluZWQpIHtcbiAgICBjbG9ja3NlcSA9IGNsb2Nrc2VxICsgMSAmIDB4M2ZmZjtcbiAgfSAvLyBSZXNldCBuc2VjcyBpZiBjbG9jayByZWdyZXNzZXMgKG5ldyBjbG9ja3NlcSkgb3Igd2UndmUgbW92ZWQgb250byBhIG5ld1xuICAvLyB0aW1lIGludGVydmFsXG5cblxuICBpZiAoKGR0IDwgMCB8fCBtc2VjcyA+IF9sYXN0TVNlY3MpICYmIG9wdGlvbnMubnNlY3MgPT09IHVuZGVmaW5lZCkge1xuICAgIG5zZWNzID0gMDtcbiAgfSAvLyBQZXIgNC4yLjEuMiBUaHJvdyBlcnJvciBpZiB0b28gbWFueSB1dWlkcyBhcmUgcmVxdWVzdGVkXG5cblxuICBpZiAobnNlY3MgPj0gMTAwMDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1dWlkLnYxKCk6IENhbid0IGNyZWF0ZSBtb3JlIHRoYW4gMTBNIHV1aWRzL3NlY1wiKTtcbiAgfVxuXG4gIF9sYXN0TVNlY3MgPSBtc2VjcztcbiAgX2xhc3ROU2VjcyA9IG5zZWNzO1xuICBfY2xvY2tzZXEgPSBjbG9ja3NlcTsgLy8gUGVyIDQuMS40IC0gQ29udmVydCBmcm9tIHVuaXggZXBvY2ggdG8gR3JlZ29yaWFuIGVwb2NoXG5cbiAgbXNlY3MgKz0gMTIyMTkyOTI4MDAwMDA7IC8vIGB0aW1lX2xvd2BcblxuICB2YXIgdGwgPSAoKG1zZWNzICYgMHhmZmZmZmZmKSAqIDEwMDAwICsgbnNlY3MpICUgMHgxMDAwMDAwMDA7XG4gIGJbaSsrXSA9IHRsID4+PiAyNCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsID4+PiAxNiAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsID4+PiA4ICYgMHhmZjtcbiAgYltpKytdID0gdGwgJiAweGZmOyAvLyBgdGltZV9taWRgXG5cbiAgdmFyIHRtaCA9IG1zZWNzIC8gMHgxMDAwMDAwMDAgKiAxMDAwMCAmIDB4ZmZmZmZmZjtcbiAgYltpKytdID0gdG1oID4+PiA4ICYgMHhmZjtcbiAgYltpKytdID0gdG1oICYgMHhmZjsgLy8gYHRpbWVfaGlnaF9hbmRfdmVyc2lvbmBcblxuICBiW2krK10gPSB0bWggPj4+IDI0ICYgMHhmIHwgMHgxMDsgLy8gaW5jbHVkZSB2ZXJzaW9uXG5cbiAgYltpKytdID0gdG1oID4+PiAxNiAmIDB4ZmY7IC8vIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYCAoUGVyIDQuMi4yIC0gaW5jbHVkZSB2YXJpYW50KVxuXG4gIGJbaSsrXSA9IGNsb2Nrc2VxID4+PiA4IHwgMHg4MDsgLy8gYGNsb2NrX3NlcV9sb3dgXG5cbiAgYltpKytdID0gY2xvY2tzZXEgJiAweGZmOyAvLyBgbm9kZWBcblxuICBmb3IgKHZhciBuID0gMDsgbiA8IDY7ICsrbikge1xuICAgIGJbaSArIG5dID0gbm9kZVtuXTtcbiAgfVxuXG4gIHJldHVybiBidWYgfHwgc3RyaW5naWZ5KGIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2MTsiLCJpbXBvcnQgdjM1IGZyb20gJy4vdjM1LmpzJztcbmltcG9ydCBtZDUgZnJvbSAnLi9tZDUuanMnO1xudmFyIHYzID0gdjM1KCd2MycsIDB4MzAsIG1kNSk7XG5leHBvcnQgZGVmYXVsdCB2MzsiLCJpbXBvcnQgc3RyaW5naWZ5IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcbmltcG9ydCBwYXJzZSBmcm9tICcuL3BhcnNlLmpzJztcblxuZnVuY3Rpb24gc3RyaW5nVG9CeXRlcyhzdHIpIHtcbiAgc3RyID0gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHN0cikpOyAvLyBVVEY4IGVzY2FwZVxuXG4gIHZhciBieXRlcyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgYnl0ZXMucHVzaChzdHIuY2hhckNvZGVBdChpKSk7XG4gIH1cblxuICByZXR1cm4gYnl0ZXM7XG59XG5cbmV4cG9ydCB2YXIgRE5TID0gJzZiYTdiODEwLTlkYWQtMTFkMS04MGI0LTAwYzA0ZmQ0MzBjOCc7XG5leHBvcnQgdmFyIFVSTCA9ICc2YmE3YjgxMS05ZGFkLTExZDEtODBiNC0wMGMwNGZkNDMwYzgnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG5hbWUsIHZlcnNpb24sIGhhc2hmdW5jKSB7XG4gIGZ1bmN0aW9uIGdlbmVyYXRlVVVJRCh2YWx1ZSwgbmFtZXNwYWNlLCBidWYsIG9mZnNldCkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YWx1ZSA9IHN0cmluZ1RvQnl0ZXModmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgbmFtZXNwYWNlID09PSAnc3RyaW5nJykge1xuICAgICAgbmFtZXNwYWNlID0gcGFyc2UobmFtZXNwYWNlKTtcbiAgICB9XG5cbiAgICBpZiAobmFtZXNwYWNlLmxlbmd0aCAhPT0gMTYpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcignTmFtZXNwYWNlIG11c3QgYmUgYXJyYXktbGlrZSAoMTYgaXRlcmFibGUgaW50ZWdlciB2YWx1ZXMsIDAtMjU1KScpO1xuICAgIH0gLy8gQ29tcHV0ZSBoYXNoIG9mIG5hbWVzcGFjZSBhbmQgdmFsdWUsIFBlciA0LjNcbiAgICAvLyBGdXR1cmU6IFVzZSBzcHJlYWQgc3ludGF4IHdoZW4gc3VwcG9ydGVkIG9uIGFsbCBwbGF0Zm9ybXMsIGUuZy4gYGJ5dGVzID1cbiAgICAvLyBoYXNoZnVuYyhbLi4ubmFtZXNwYWNlLCAuLi4gdmFsdWVdKWBcblxuXG4gICAgdmFyIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoMTYgKyB2YWx1ZS5sZW5ndGgpO1xuICAgIGJ5dGVzLnNldChuYW1lc3BhY2UpO1xuICAgIGJ5dGVzLnNldCh2YWx1ZSwgbmFtZXNwYWNlLmxlbmd0aCk7XG4gICAgYnl0ZXMgPSBoYXNoZnVuYyhieXRlcyk7XG4gICAgYnl0ZXNbNl0gPSBieXRlc1s2XSAmIDB4MGYgfCB2ZXJzaW9uO1xuICAgIGJ5dGVzWzhdID0gYnl0ZXNbOF0gJiAweDNmIHwgMHg4MDtcblxuICAgIGlmIChidWYpIHtcbiAgICAgIG9mZnNldCA9IG9mZnNldCB8fCAwO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDE2OyArK2kpIHtcbiAgICAgICAgYnVmW29mZnNldCArIGldID0gYnl0ZXNbaV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBidWY7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cmluZ2lmeShieXRlcyk7XG4gIH0gLy8gRnVuY3Rpb24jbmFtZSBpcyBub3Qgc2V0dGFibGUgb24gc29tZSBwbGF0Zm9ybXMgKCMyNzApXG5cblxuICB0cnkge1xuICAgIGdlbmVyYXRlVVVJRC5uYW1lID0gbmFtZTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVtcHR5XG4gIH0gY2F0Y2ggKGVycikge30gLy8gRm9yIENvbW1vbkpTIGRlZmF1bHQgZXhwb3J0IHN1cHBvcnRcblxuXG4gIGdlbmVyYXRlVVVJRC5ETlMgPSBETlM7XG4gIGdlbmVyYXRlVVVJRC5VUkwgPSBVUkw7XG4gIHJldHVybiBnZW5lcmF0ZVVVSUQ7XG59IiwiaW1wb3J0IHJuZyBmcm9tICcuL3JuZy5qcyc7XG5pbXBvcnQgc3RyaW5naWZ5IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcblxuZnVuY3Rpb24gdjQob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTsgLy8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuXG4gIHJuZHNbNl0gPSBybmRzWzZdICYgMHgwZiB8IDB4NDA7XG4gIHJuZHNbOF0gPSBybmRzWzhdICYgMHgzZiB8IDB4ODA7IC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuXG4gIGlmIChidWYpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgICAgYnVmW29mZnNldCArIGldID0gcm5kc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgcmV0dXJuIHN0cmluZ2lmeShybmRzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdjQ7IiwiaW1wb3J0IHYzNSBmcm9tICcuL3YzNS5qcyc7XG5pbXBvcnQgc2hhMSBmcm9tICcuL3NoYTEuanMnO1xudmFyIHY1ID0gdjM1KCd2NScsIDB4NTAsIHNoYTEpO1xuZXhwb3J0IGRlZmF1bHQgdjU7IiwiaW1wb3J0IFJFR0VYIGZyb20gJy4vcmVnZXguanMnO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZSh1dWlkKSB7XG4gIHJldHVybiB0eXBlb2YgdXVpZCA9PT0gJ3N0cmluZycgJiYgUkVHRVgudGVzdCh1dWlkKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdmFsaWRhdGU7IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuXG5mdW5jdGlvbiB2ZXJzaW9uKHV1aWQpIHtcbiAgaWYgKCF2YWxpZGF0ZSh1dWlkKSkge1xuICAgIHRocm93IFR5cGVFcnJvcignSW52YWxpZCBVVUlEJyk7XG4gIH1cblxuICByZXR1cm4gcGFyc2VJbnQodXVpZC5zdWJzdHIoMTQsIDEpLCAxNik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZlcnNpb247IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJleHBvcnQgeyBkZWJ1ZyB9IGZyb20gJy4vZGVidWcnO1xuXG5leHBvcnQgeyBNb2RlbCB9IGZyb20gJy4vbW9kZWwnO1xuZXhwb3J0IHsgU2NoZW1hIH0gZnJvbSAnLi9zY2hlbWEnO1xuZXhwb3J0IHsgQWRhcHRlciB9IGZyb20gJy4vYWRhcHRlcic7XG5leHBvcnQgeyBmaWVsZHMsIEZpZWxkIH0gZnJvbSAnLi9maWVsZCc7XG5leHBvcnQgeyBNaWdyYXRpb24gfSBmcm9tICcuL21pZ3JhdGlvbic7XG5cbi8vZXhwb3J0IHsgc2Vzc2lvbiwgc2V0RGVmYXVsdEFkYXB0ZXIsIGdldERlZmF1bHRBZGFwdGVyIH0gZnJvbSAnLi9zZXNzaW9uJzsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=