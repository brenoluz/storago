/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/adapter/index.ts":
/*!******************************!*\
  !*** ./src/adapter/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/debug.ts":
/*!**********************!*\
  !*** ./src/debug.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.debug = void 0;
exports.debug = {
    select: false,
    insert: false,
    create: false,
    drop: false,
    query: false,
};


/***/ }),

/***/ "./src/field/boolean.ts":
/*!******************************!*\
  !*** ./src/field/boolean.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BooleanField = void 0;
const field_1 = __webpack_require__(/*! ./field */ "./src/field/field.ts");
class BooleanField extends field_1.Field {
    constructor(name, config = field_1.defaultConfig) {
        super(name);
        this.kind = field_1.FieldKind.BOOLEAN;
        this.config = Object.assign(Object.assign({}, field_1.defaultConfig), config);
    }
    fromDB(adapter, value) {
        return adapter.fieldTransformFromDb(this, value);
    }
    toDB(adapter, model) {
        let value = super.toDB(adapter, model);
        return adapter.fieldTransformToDB(this, value);
    }
    castDB(adapter) {
        return adapter.fieldCast(this);
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
const field_1 = __webpack_require__(/*! ./field */ "./src/field/field.ts");
class DateTimeField extends field_1.Field {
    constructor(name, config = field_1.defaultConfig) {
        super(name);
        this.kind = field_1.FieldKind.DATETIME;
        this.config = Object.assign(Object.assign({}, field_1.defaultConfig), config);
    }
    fromDB(adapter, value) {
        if (value === null) {
            return undefined;
        }
        return new Date(value);
    }
    toDB(adapter, model) {
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
        return adapter.fieldCast(this);
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
exports.Field = exports.defaultConfig = exports.FieldKind = exports.codeFieldError = void 0;
var codeFieldError;
(function (codeFieldError) {
    codeFieldError["EngineNotImplemented"] = "@storago/orm/field/engineNotImplemented";
    codeFieldError["DefaultValueIsNotValid"] = "@storago/orm/field/defaultParamNotValid";
    codeFieldError["IncorrectValueToDb"] = "@storago/orm/field/IncorrectValueToStorageOnDB";
    codeFieldError["RefererNotFound"] = "@storago/orm/field/ManyRelationship";
    codeFieldError["FieldKindNotSupported"] = "@storago/orm/field/FieldKindNotSupported";
})(codeFieldError = exports.codeFieldError || (exports.codeFieldError = {}));
var FieldKind;
(function (FieldKind) {
    FieldKind[FieldKind["TEXT"] = 0] = "TEXT";
    FieldKind[FieldKind["VARCHAR"] = 1] = "VARCHAR";
    FieldKind[FieldKind["CHARACTER"] = 2] = "CHARACTER";
    FieldKind[FieldKind["INTEGER"] = 3] = "INTEGER";
    FieldKind[FieldKind["TINYINT"] = 4] = "TINYINT";
    FieldKind[FieldKind["SMALLINT"] = 5] = "SMALLINT";
    FieldKind[FieldKind["MEDIUMINT"] = 6] = "MEDIUMINT";
    FieldKind[FieldKind["BIGINT"] = 7] = "BIGINT";
    FieldKind[FieldKind["REAL"] = 8] = "REAL";
    FieldKind[FieldKind["DOUBLE"] = 9] = "DOUBLE";
    FieldKind[FieldKind["FLOAT"] = 10] = "FLOAT";
    FieldKind[FieldKind["NUMERIC"] = 11] = "NUMERIC";
    FieldKind[FieldKind["DECIMAL"] = 12] = "DECIMAL";
    FieldKind[FieldKind["DATE"] = 13] = "DATE";
    FieldKind[FieldKind["DATETIME"] = 14] = "DATETIME";
    FieldKind[FieldKind["BOOLEAN"] = 15] = "BOOLEAN";
    FieldKind[FieldKind["UUID"] = 16] = "UUID";
    FieldKind[FieldKind["JSON"] = 17] = "JSON";
    FieldKind[FieldKind["BLOB"] = 18] = "BLOB";
})(FieldKind = exports.FieldKind || (exports.FieldKind = {}));
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
    toDB(adapter, model) {
        let name = this.getName();
        let value = model[name];
        if (value === undefined || value === null) {
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
exports.fields = exports.codeFieldError = exports.FieldKind = exports.Field = void 0;
var field_1 = __webpack_require__(/*! ./field */ "./src/field/field.ts");
Object.defineProperty(exports, "Field", ({ enumerable: true, get: function () { return field_1.Field; } }));
Object.defineProperty(exports, "FieldKind", ({ enumerable: true, get: function () { return field_1.FieldKind; } }));
Object.defineProperty(exports, "codeFieldError", ({ enumerable: true, get: function () { return field_1.codeFieldError; } }));
const text_1 = __webpack_require__(/*! ./text */ "./src/field/text.ts");
const uuid_1 = __webpack_require__(/*! ./uuid */ "./src/field/uuid.ts");
const json_1 = __webpack_require__(/*! ./json */ "./src/field/json.ts");
const many_1 = __webpack_require__(/*! ./many */ "./src/field/many.ts");
const integer_1 = __webpack_require__(/*! ./integer */ "./src/field/integer.ts");
const boolean_1 = __webpack_require__(/*! ./boolean */ "./src/field/boolean.ts");
const datetime_1 = __webpack_require__(/*! ./datetime */ "./src/field/datetime.ts");
exports.fields = {
    TextField: text_1.TextField,
    UUIDField: uuid_1.UUIDField,
    JsonField: json_1.JsonField,
    ManyField: many_1.ManyField,
    IntegerField: integer_1.IntegerField,
    BooleanField: boolean_1.BooleanField,
    DateTimeField: datetime_1.DateTimeField,
};


/***/ }),

/***/ "./src/field/integer.ts":
/*!******************************!*\
  !*** ./src/field/integer.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IntegerField = void 0;
const field_1 = __webpack_require__(/*! ./field */ "./src/field/field.ts");
class IntegerField extends field_1.Field {
    constructor(name, config = field_1.defaultConfig) {
        super(name);
        this.kind = field_1.FieldKind.INTEGER;
        this.config = Object.assign(Object.assign({}, field_1.defaultConfig), config);
    }
    fromDB(adapter, value) {
        if (!value) {
            return undefined;
        }
        if (typeof value === 'number') {
            return value;
        }
        throw { code: null, message: 'value from DB is not a number' };
    }
    toDB(adapter, model) {
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
        return adapter.fieldCast(this);
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
exports.JsonField = void 0;
const field_1 = __webpack_require__(/*! ./field */ "./src/field/field.ts");
let jsonDefaultConfig = Object.assign(Object.assign({}, field_1.defaultConfig), { type: 'object' });
class JsonField extends field_1.Field {
    constructor(name, config = jsonDefaultConfig) {
        super(name);
        this.kind = field_1.FieldKind.JSON;
        this.config = Object.assign(Object.assign({}, jsonDefaultConfig), config);
    }
    getDefaultValue() {
        let valueDefault = super.getDefaultValue();
        if (typeof valueDefault === 'string') {
            try {
                valueDefault = JSON.parse(valueDefault);
            }
            catch (e) {
                throw {
                    code: field_1.codeFieldError.DefaultValueIsNotValid,
                    message: `Default value on JSON field is not a valid json`
                };
            }
        }
        return valueDefault;
    }
    fromDB(adapter, value) {
        if (value === null) {
            return undefined;
        }
        if (value === '') {
            let type = this.config.type;
            if (type === 'object') {
                return {};
            }
            else {
                return [];
            }
        }
        return adapter.fieldTransformFromDb(this, value);
    }
    castDB(adapter) {
        return adapter.fieldCast(this);
    }
    isJsonObject() {
        if (this.config.type === 'object') {
            return true;
        }
        return false;
    }
    toDB(adapter, model) {
        let value = super.toDB(adapter, model);
        if (value === null) {
            return null;
        }
        return this.stringifyToDb(value);
    }
    stringifyToDb(value) {
        let kind = this.config.type;
        let error = {
            code: field_1.codeFieldError.IncorrectValueToDb,
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
exports.JsonField = JsonField;


/***/ }),

/***/ "./src/field/many.ts":
/*!***************************!*\
  !*** ./src/field/many.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ManyField = void 0;
const uuid_1 = __webpack_require__(/*! ./uuid */ "./src/field/uuid.ts");
const field_1 = __webpack_require__(/*! ./field */ "./src/field/field.ts");
class ManyField extends uuid_1.UUIDField {
    constructor(name, config) {
        super(`${name}_id`);
        this.config = Object.assign(Object.assign({}, field_1.defaultConfig), config);
    }
}
exports.ManyField = ManyField;


/***/ }),

/***/ "./src/field/text.ts":
/*!***************************!*\
  !*** ./src/field/text.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TextField = void 0;
const field_1 = __webpack_require__(/*! ./field */ "./src/field/field.ts");
class TextField extends field_1.Field {
    constructor(name, config = field_1.defaultConfig) {
        super(name);
        this.kind = field_1.FieldKind.TEXT;
        this.config = Object.assign(Object.assign({}, field_1.defaultConfig), config);
    }
    fromDB(adapter, value) {
        if (typeof value === 'string') {
            return value;
        }
        return undefined;
    }
    toDB(adapter, model) {
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
        return adapter.fieldCast(this);
    }
}
exports.TextField = TextField;


/***/ }),

/***/ "./src/field/uuid.ts":
/*!***************************!*\
  !*** ./src/field/uuid.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UUIDField = void 0;
const field_1 = __webpack_require__(/*! ./field */ "./src/field/field.ts");
const uuid_1 = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-node/index.js");
class UUIDField extends field_1.Field {
    constructor(name, config = field_1.defaultConfig) {
        super(name);
        this.kind = field_1.FieldKind.UUID;
        this.config = Object.assign(Object.assign({}, field_1.defaultConfig), config);
    }
    castDB(adapter) {
        return adapter.fieldCast(this);
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
    toDB(adapter, model) {
        let value = super.toDB(adapter, model);
        return adapter.fieldTransformToDB(this, value);
    }
}
exports.UUIDField = UUIDField;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Migration = exports.codeFieldError = exports.FieldKind = exports.Field = exports.fields = exports.Schema = exports.debug = void 0;
var debug_1 = __webpack_require__(/*! ./debug */ "./src/debug.ts");
Object.defineProperty(exports, "debug", ({ enumerable: true, get: function () { return debug_1.debug; } }));
var schema_1 = __webpack_require__(/*! ./schema */ "./src/schema.ts");
Object.defineProperty(exports, "Schema", ({ enumerable: true, get: function () { return schema_1.Schema; } }));
__exportStar(__webpack_require__(/*! ./adapter */ "./src/adapter/index.ts"), exports);
var field_1 = __webpack_require__(/*! ./field */ "./src/field/index.ts");
Object.defineProperty(exports, "fields", ({ enumerable: true, get: function () { return field_1.fields; } }));
Object.defineProperty(exports, "Field", ({ enumerable: true, get: function () { return field_1.Field; } }));
Object.defineProperty(exports, "FieldKind", ({ enumerable: true, get: function () { return field_1.FieldKind; } }));
Object.defineProperty(exports, "codeFieldError", ({ enumerable: true, get: function () { return field_1.codeFieldError; } }));
var migration_1 = __webpack_require__(/*! ./migration */ "./src/migration.ts");
Object.defineProperty(exports, "Migration", ({ enumerable: true, get: function () { return migration_1.Migration; } }));


/***/ }),

/***/ "./src/migration.ts":
/*!**************************!*\
  !*** ./src/migration.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Migration = void 0;
;
class Migration {
    constructor(adapter) {
        this.tasks = {};
        this.adapter = adapter;
    }
    make() { }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.make();
            if (this.firstAccess === undefined) {
                throw { code: null, message: `FirstAccess Migration not implemented!` };
            }
            return Promise.resolve();
        });
    }
    registerFirstAccess(callback) {
        if (this.firstAccess !== undefined) {
            throw { code: undefined, message: `firstAccess callback already registered` };
        }
        this.firstAccess = callback;
    }
    register(version, callback) {
        if (this.tasks[version] !== undefined) {
            throw { code: undefined, message: `callback version ${version} already registered` };
        }
        this.tasks[version] = callback;
    }
}
exports.Migration = Migration;


/***/ }),

/***/ "./src/schema.ts":
/*!***********************!*\
  !*** ./src/schema.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Schema = exports.codeSchemaError = void 0;
const uuid_1 = __webpack_require__(/*! ./field/uuid */ "./src/field/uuid.ts");
var codeSchemaError;
(function (codeSchemaError) {
    codeSchemaError["PostSaveNotFound"] = "@storago/orm/schema/PostSaveNotFound";
})(codeSchemaError = exports.codeSchemaError || (exports.codeSchemaError = {}));
class Schema {
    constructor(adapter) {
        this.fields = [];
        this.superFields = [
            new uuid_1.UUIDField('id', { primary: true }),
        ];
        this.adapter = adapter;
    }
    save(model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (model.__data) {
                console.log('save update', model.__data);
                throw 'Method update do not implemented';
            }
            else {
                console.log('save insert', model.__data);
                let insert = this.insert();
                insert.add(model);
                yield insert.save();
            }
            return this.refreshModel(model);
        });
    }
    refreshModel(model) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = model['id'];
            let item = yield this.find('id = ?', id);
            if (item === undefined) {
                throw { code: codeSchemaError.PostSaveNotFound, message: `Fail to find id: ${id}` };
            }
            return this.populateFromDB(item, model);
        });
    }
    getModelClass() {
        return this.Model;
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
        let fields = this.getFields();
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
        let select = this.adapter.select(this);
        select.from(this.getName(), this.getColumns());
        return select;
    }
    insert() {
        let insert = this.adapter.insert(this);
        return insert;
    }
    createTable() {
        return this.adapter.create(this);
    }
    drop() {
        return this.adapter.drop(this);
    }
    new(data) {
        if (this.Model) {
            const model = new this.Model(data);
            return model;
        }
        return data;
    }
    populateFromDB(row, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (model == undefined) {
                model = this.new(row.id);
            }
            let fields = this.getFields();
            model.__data = row;
            for (let field of fields) {
                let name = field.getName();
                if (name == 'id') {
                    continue;
                }
                model[name] = field.fromDB(this.adapter, row[name]);
            }
            return model;
        });
    }
}
exports.Schema = Schema;


/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/index.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/index.js ***!
  \**************************************************/
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
/* harmony import */ var _v1_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v1.js */ "./node_modules/uuid/dist/esm-node/v1.js");
/* harmony import */ var _v3_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./v3.js */ "./node_modules/uuid/dist/esm-node/v3.js");
/* harmony import */ var _v4_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./v4.js */ "./node_modules/uuid/dist/esm-node/v4.js");
/* harmony import */ var _v5_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./v5.js */ "./node_modules/uuid/dist/esm-node/v5.js");
/* harmony import */ var _nil_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./nil.js */ "./node_modules/uuid/dist/esm-node/nil.js");
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./version.js */ "./node_modules/uuid/dist/esm-node/version.js");
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-node/validate.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-node/stringify.js");
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist/esm-node/parse.js");










/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/md5.js":
/*!************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/md5.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);


function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return crypto__WEBPACK_IMPORTED_MODULE_0___default().createHash('md5').update(bytes).digest();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (md5);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/nil.js":
/*!************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/nil.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('00000000-0000-0000-0000-000000000000');

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/parse.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/parse.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-node/validate.js");


function parse(uuid) {
  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

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

/***/ "./node_modules/uuid/dist/esm-node/regex.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/regex.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/rng.js":
/*!************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/rng.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto__WEBPACK_IMPORTED_MODULE_0___default().randomFillSync(rnds8Pool);
    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/sha1.js":
/*!*************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/sha1.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);


function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return crypto__WEBPACK_IMPORTED_MODULE_0___default().createHash('sha1').update(bytes).digest();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sha1);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/stringify.js":
/*!******************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/stringify.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-node/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
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

/***/ "./node_modules/uuid/dist/esm-node/v1.js":
/*!***********************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/v1.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-node/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-node/stringify.js");

 // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])();

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


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

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

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(b);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v1);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/v3.js":
/*!***********************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/v3.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist/esm-node/v35.js");
/* harmony import */ var _md5_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./md5.js */ "./node_modules/uuid/dist/esm-node/md5.js");


const v3 = (0,_v35_js__WEBPACK_IMPORTED_MODULE_0__["default"])('v3', 0x30, _md5_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v3);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/v35.js":
/*!************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/v35.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DNS": () => (/* binding */ DNS),
/* harmony export */   "URL": () => (/* binding */ URL),
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-node/stringify.js");
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist/esm-node/parse.js");



function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
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


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
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

/***/ "./node_modules/uuid/dist/esm-node/v4.js":
/*!***********************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/v4.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-node/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-node/stringify.js");



function v4(options, buf, offset) {
  options = options || {};
  const rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/v5.js":
/*!***********************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/v5.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist/esm-node/v35.js");
/* harmony import */ var _sha1_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sha1.js */ "./node_modules/uuid/dist/esm-node/sha1.js");


const v5 = (0,_v35_js__WEBPACK_IMPORTED_MODULE_0__["default"])('v5', 0x50, _sha1_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v5);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/validate.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/validate.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-node/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/version.js":
/*!****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/version.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-node/validate.js");


function version(uuid) {
  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (version);

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnby5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDUVcsYUFBSyxHQUFVO0lBQ3hCLE1BQU0sRUFBRSxLQUFLO0lBQ2IsTUFBTSxFQUFFLEtBQUs7SUFDYixNQUFNLEVBQUUsS0FBSztJQUNiLElBQUksRUFBRSxLQUFLO0lBQ1gsS0FBSyxFQUFFLEtBQUs7Q0FDYjs7Ozs7Ozs7Ozs7Ozs7QUNaRCwyRUFBa0U7QUFJbEUsTUFBYSxZQUFhLFNBQVEsYUFBSztJQUtyQyxZQUFZLElBQVksRUFBRSxTQUFpQyxxQkFBYTtRQUV0RSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFKTCxTQUFJLEdBQWMsaUJBQVMsQ0FBQyxPQUFPLENBQUM7UUFLM0MsSUFBSSxDQUFDLE1BQU0sbUNBQ04scUJBQWEsR0FDYixNQUFNLENBQ1Y7SUFDSCxDQUFDO0lBRU0sTUFBTSxDQUFvQixPQUFVLEVBQUUsS0FBYTtRQUV4RCxPQUFPLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVNLElBQUksQ0FBOEMsT0FBVSxFQUFFLEtBQVE7UUFFM0UsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBTyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0MsT0FBTyxPQUFPLENBQUMsa0JBQWtCLENBQWtCLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRU0sTUFBTSxDQUFvQixPQUFVO1FBRXpDLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBZSxJQUFJLENBQUMsQ0FBQztJQUMvQyxDQUFDO0NBQ0Y7QUE3QkQsb0NBNkJDOzs7Ozs7Ozs7Ozs7OztBQ2pDRCwyRUFBa0U7QUFJbEUsTUFBYSxhQUFjLFNBQVEsYUFBSztJQUt0QyxZQUFZLElBQVksRUFBRSxTQUFrQyxxQkFBYTtRQUV2RSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFKTCxTQUFJLEdBQWMsaUJBQVMsQ0FBQyxRQUFRLENBQUM7UUFLNUMsSUFBSSxDQUFDLE1BQU0sbUNBQ04scUJBQWEsR0FDYixNQUFNLENBQ1Y7SUFDSCxDQUFDO0lBRU0sTUFBTSxDQUFvQixPQUFVLEVBQUUsS0FBVTtRQUVyRCxJQUFHLEtBQUssS0FBSyxJQUFJLEVBQUM7WUFDaEIsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFTSxJQUFJLENBQThDLE9BQVUsRUFBRSxLQUFRO1FBRTNFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMxQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBZSxDQUFDLENBQUM7UUFFbkMsSUFBRyxLQUFLLEtBQUssU0FBUyxFQUFDO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQy9CO1FBRUQsSUFBRyxLQUFLLFlBQVksSUFBSSxFQUFDO1lBQ3ZCLE9BQU8sS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3hCO1FBRUQsTUFBTSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFlBQVksSUFBSSxzQkFBc0IsRUFBQyxDQUFDO0lBQ3RFLENBQUM7SUFFTSxNQUFNLENBQW9CLE9BQVU7UUFFekMsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFnQixJQUFJLENBQUMsQ0FBQztJQUNoRCxDQUFDO0NBQ0Y7QUEzQ0Qsc0NBMkNDOzs7Ozs7Ozs7Ozs7OztBQzlDRCxJQUFZLGNBTVg7QUFORCxXQUFZLGNBQWM7SUFDeEIsa0ZBQWtFO0lBQ2xFLG9GQUFvRTtJQUNwRSx1RkFBdUU7SUFDdkUseUVBQXlEO0lBQ3pELG9GQUFvRTtBQUN0RSxDQUFDLEVBTlcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFNekI7QUFFRCxJQUFZLFNBeUJYO0FBekJELFdBQVksU0FBUztJQUNuQix5Q0FBSTtJQUNKLCtDQUFPO0lBQ1AsbURBQVM7SUFFVCwrQ0FBTztJQUNQLCtDQUFPO0lBQ1AsaURBQVE7SUFDUixtREFBUztJQUNULDZDQUFNO0lBRU4seUNBQUk7SUFDSiw2Q0FBTTtJQUNOLDRDQUFLO0lBRUwsZ0RBQU87SUFDUCxnREFBTztJQUNQLDBDQUFJO0lBQ0osa0RBQVE7SUFDUixnREFBTztJQUVQLDBDQUFJO0lBQ0osMENBQUk7SUFFSiwwQ0FBSTtBQUNOLENBQUMsRUF6QlcsU0FBUyxHQUFULGlCQUFTLEtBQVQsaUJBQVMsUUF5QnBCO0FBVVkscUJBQWEsR0FBVztJQUNuQyxRQUFRLEVBQUUsS0FBSztJQUNmLEtBQUssRUFBRSxLQUFLO0lBQ1osT0FBTyxFQUFFLEtBQUs7Q0FDZjtBQUVELE1BQXNCLEtBQUs7SUFNekIsWUFBWSxJQUFZO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFTSxPQUFPO1FBQ1osT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFTSxlQUFlO1FBRXBCLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBRXZDLElBQUksT0FBTyxZQUFZLEtBQUssVUFBVSxFQUFFO1lBQ3RDLE9BQU8sWUFBWSxFQUFFLENBQUM7U0FDdkI7UUFFRCxJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUU7WUFDOUIsWUFBWSxHQUFHLElBQUksQ0FBQztTQUNyQjtRQUVELE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFTSxTQUFTO1FBRWQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtZQUN4RCxPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBcUNLLElBQUksQ0FBOEMsT0FBVSxFQUFFLEtBQVE7UUFFM0UsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzFCLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFlLENBQUMsQ0FBQztRQUVuQyxJQUFHLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksRUFBQztZQUN2QyxPQUFPLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUM5QjtRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUFBLENBQUM7SUFLSyxZQUFZO1FBQ2pCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztDQXlFRjtBQW5LRCxzQkFtS0M7Ozs7Ozs7Ozs7Ozs7O0FDdk5ELHlFQUEyRDtBQUFsRCxvR0FBSztBQUFFLDRHQUFTO0FBQUUsc0hBQWM7QUFFekMsd0VBQW1DO0FBQ25DLHdFQUFtQztBQUNuQyx3RUFBbUM7QUFDbkMsd0VBQW1DO0FBQ25DLGlGQUF5QztBQUN6QyxpRkFBeUM7QUFDekMsb0ZBQTJDO0FBRTlCLGNBQU0sR0FBRztJQUNwQixTQUFTLEVBQVQsZ0JBQVM7SUFDVCxTQUFTLEVBQVQsZ0JBQVM7SUFDVCxTQUFTLEVBQVQsZ0JBQVM7SUFDVCxTQUFTLEVBQVQsZ0JBQVM7SUFDVCxZQUFZLEVBQVosc0JBQVk7SUFDWixZQUFZLEVBQVosc0JBQVk7SUFDWixhQUFhLEVBQWIsd0JBQWE7Q0FDZDs7Ozs7Ozs7Ozs7Ozs7QUNoQkQsMkVBQWtFO0FBSWxFLE1BQWEsWUFBYSxTQUFRLGFBQUs7SUFLckMsWUFBWSxJQUFZLEVBQUUsU0FBaUMscUJBQWE7UUFFdEUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBSkwsU0FBSSxHQUFjLGlCQUFTLENBQUMsT0FBTyxDQUFDO1FBSzNDLElBQUksQ0FBQyxNQUFNLG1DQUNOLHFCQUFhLEdBQ2IsTUFBTSxDQUNWO0lBQ0gsQ0FBQztJQUVNLE1BQU0sQ0FBb0IsT0FBVSxFQUFFLEtBQWE7UUFFeEQsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxDQUFDO0lBQ2pFLENBQUM7SUFFTSxJQUFJLENBQThDLE9BQVUsRUFBRSxLQUFRO1FBRTNFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMxQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBZSxDQUFDLENBQUM7UUFFbkMsSUFBSSxLQUFLLElBQUksU0FBUyxFQUFFO1lBQ3RCLE9BQU8sSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQy9CO1FBRUQsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzFCO1FBRUQsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFlBQWEsSUFBSyx5QkFBeUIsRUFBRSxDQUFDO0lBQzdFLENBQUM7SUFFTSxNQUFNLENBQW9CLE9BQVU7UUFFekMsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFlLElBQUksQ0FBQyxDQUFDO0lBQy9DLENBQUM7Q0FDRjtBQS9DRCxvQ0ErQ0M7Ozs7Ozs7Ozs7Ozs7O0FDbkRELDJFQUFrRjtBQU9sRixJQUFJLGlCQUFpQixtQ0FDaEIscUJBQWEsS0FDaEIsSUFBSSxFQUFFLFFBQVEsR0FDZjtBQUVELE1BQWEsU0FBVSxTQUFRLGFBQUs7SUFLbEMsWUFBWSxJQUFZLEVBQUUsU0FBOEIsaUJBQWlCO1FBRXZFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUpMLFNBQUksR0FBYyxpQkFBUyxDQUFDLElBQUksQ0FBQztRQUt4QyxJQUFJLENBQUMsTUFBTSxtQ0FDTixpQkFBaUIsR0FDakIsTUFBTSxDQUNWLENBQUM7SUFDSixDQUFDO0lBRU0sZUFBZTtRQUVwQixJQUFJLFlBQVksR0FBRyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFM0MsSUFBSSxPQUFPLFlBQVksS0FBSyxRQUFRLEVBQUU7WUFDcEMsSUFBSTtnQkFDRixZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUN6QztZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLE1BQU07b0JBQ0osSUFBSSxFQUFFLHNCQUFjLENBQUMsc0JBQXNCO29CQUMzQyxPQUFPLEVBQUUsaURBQWlEO2lCQUMzRCxDQUFDO2FBQ0g7U0FDRjtRQUVELE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFTSxNQUFNLENBQW9CLE9BQVUsRUFBRSxLQUFvQjtRQUUvRCxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFDbEIsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUU7WUFDaEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDNUIsSUFBSSxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUNyQixPQUFPLEVBQUUsQ0FBQzthQUNYO2lCQUFNO2dCQUNMLE9BQU8sRUFBRSxDQUFDO2FBQ1g7U0FDRjtRQUdELE9BQU8sT0FBTyxDQUFDLG9CQUFvQixDQUFZLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRU0sTUFBTSxDQUFvQixPQUFVO1FBRXpDLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBWSxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRU0sWUFBWTtRQUNqQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUNqQyxPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRU0sSUFBSSxDQUE4QyxPQUFVLEVBQUUsS0FBUTtRQUUzRSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV2QyxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFDbEIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRVMsYUFBYSxDQUFDLEtBQVU7UUFFaEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDNUIsSUFBSSxLQUFLLEdBQUc7WUFDVixJQUFJLEVBQUUsc0JBQWMsQ0FBQyxrQkFBa0I7WUFDdkMsT0FBTyxFQUFFLDJCQUEyQjtTQUNyQyxDQUFDO1FBR0YsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsSUFBSTtnQkFDRixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNsQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ3hCLElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRTt3QkFDbkIsS0FBSyxDQUFDLE9BQU8sR0FBRyxzQ0FBc0MsQ0FBQzt3QkFDdkQsTUFBTSxLQUFLLENBQUM7cUJBQ2I7aUJBQ0Y7cUJBQU07b0JBQ0wsSUFBSSxJQUFJLEtBQUssUUFBUSxFQUFFO3dCQUNyQixLQUFLLENBQUMsT0FBTyxHQUFHLHNDQUFzQyxDQUFDO3dCQUN2RCxNQUFNLEtBQUssQ0FBQztxQkFDYjtpQkFDRjtnQkFFRCxPQUFPLEtBQUssQ0FBQzthQUVkO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsTUFBTSxLQUFLLENBQUM7YUFDYjtTQUNGO1FBR0QsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsSUFBSTtnQkFDRixLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMvQjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLE1BQU0sS0FBSyxDQUFDO2FBQ2I7U0FDRjtRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztDQUNGO0FBckhELDhCQXFIQzs7Ozs7Ozs7Ozs7Ozs7QUNsSUQsd0VBQW1DO0FBQ25DLDJFQUFnRDtBQUdoRCxNQUFhLFNBQVUsU0FBUSxnQkFBUztJQUt0QyxZQUFZLElBQVksRUFBRSxNQUF3QjtRQUVoRCxLQUFLLENBQUMsR0FBSSxJQUFLLEtBQUssQ0FBQyxDQUFDO1FBRXRCLElBQUksQ0FBQyxNQUFNLG1DQUNOLHFCQUFhLEdBQ2IsTUFBTSxDQUNWO0lBQ0gsQ0FBQztDQTZCRjtBQTFDRCw4QkEwQ0M7Ozs7Ozs7Ozs7Ozs7O0FDN0NELDJFQUFrRTtBQUlsRSxNQUFhLFNBQVUsU0FBUSxhQUFLO0lBS2xDLFlBQVksSUFBWSxFQUFFLFNBQThCLHFCQUFhO1FBRW5FLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUpMLFNBQUksR0FBYyxpQkFBUyxDQUFDLElBQUksQ0FBQztRQUt4QyxJQUFJLENBQUMsTUFBTSxtQ0FDTixxQkFBYSxHQUNiLE1BQU0sQ0FDVjtJQUNILENBQUM7SUFFTSxNQUFNLENBQW9CLE9BQVUsRUFBRSxLQUFrQjtRQUU3RCxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUM3QixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVNLElBQUksQ0FBOEMsT0FBVSxFQUFFLEtBQVE7UUFFM0UsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzFCLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFlLENBQUMsQ0FBQztRQUVuQyxJQUFHLEtBQUssS0FBSyxTQUFTLEVBQUM7WUFDckIsT0FBTyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDL0I7UUFFRCxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUM3QixPQUFPLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNyQjtRQUVELE1BQU0sRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxZQUFZLElBQUksd0JBQXdCLEVBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRU0sTUFBTSxDQUFvQixPQUFVO1FBRXpDLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBWSxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDO0NBQ0Y7QUEzQ0QsOEJBMkNDOzs7Ozs7Ozs7Ozs7OztBQ2hERCwyRUFBa0U7QUFFbEUsNkZBQWtDO0FBRWxDLE1BQWEsU0FBVSxTQUFRLGFBQUs7SUFLbEMsWUFBWSxJQUFZLEVBQUUsU0FBMEIscUJBQWE7UUFFL0QsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBSkwsU0FBSSxHQUFjLGlCQUFTLENBQUMsSUFBSSxDQUFDO1FBS3hDLElBQUksQ0FBQyxNQUFNLG1DQUNOLHFCQUFhLEdBQ2IsTUFBTSxDQUNWLENBQUM7SUFDSixDQUFDO0lBRU0sTUFBTSxDQUFDLE9BQWdCO1FBRTVCLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBWSxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRU0sTUFBTSxDQUFDLEtBQVU7UUFFdEIsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO1lBQ2xCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxtQ0FBbUMsRUFBRSxDQUFDO0lBQ3JFLENBQUM7SUFFTSxlQUFlO1FBRXBCLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUVwQyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7WUFDekMsS0FBSyxHQUFHLGFBQUksR0FBRSxDQUFDO1NBQ2hCO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRU0sSUFBSSxDQUE4QyxPQUFVLEVBQUUsS0FBUTtRQUUzRSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFPLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3QyxPQUFPLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBZSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDL0QsQ0FBQztDQUNGO0FBaERELDhCQWdEQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JERCxtRUFBZ0M7QUFBdkIsb0dBQUs7QUFHZCxzRUFBa0M7QUFBekIsdUdBQU07QUFDZixzRkFBMEI7QUFDMUIseUVBQW1FO0FBQTFELHNHQUFNO0FBQUUsb0dBQUs7QUFBRSw0R0FBUztBQUFFLHNIQUFjO0FBQ2pELCtFQUF3QztBQUEvQixnSEFBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBakIsQ0FBQztBQUVGLE1BQWEsU0FBUztJQU1wQixZQUFZLE9BQWdCO1FBSHBCLFVBQUssR0FBZ0IsRUFBRSxDQUFDO1FBSTlCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7SUFFUyxJQUFJLEtBQVcsQ0FBQztJQUViLEdBQUc7O1lBRWQsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBRVosSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLFNBQVMsRUFBRTtnQkFDbEMsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLHdDQUF3QyxFQUFFLENBQUM7YUFDekU7WUFvQkQsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDM0IsQ0FBQztLQUFBO0lBRVMsbUJBQW1CLENBQUMsUUFBc0I7UUFFbEQsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLFNBQVMsRUFBRTtZQUNsQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUseUNBQXlDLEVBQUUsQ0FBQztTQUMvRTtRQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDO0lBQzlCLENBQUM7SUFFUyxRQUFRLENBQUMsT0FBZSxFQUFFLFFBQXNCO1FBRXhELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxTQUFTLEVBQUU7WUFDckMsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLG9CQUFxQixPQUFRLHFCQUFxQixFQUFFLENBQUM7U0FDeEY7UUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLFFBQVEsQ0FBQztJQUNqQyxDQUFDO0NBQ0Y7QUExREQsOEJBMERDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFERCw4RUFBeUM7QUFLekMsSUFBWSxlQUVYO0FBRkQsV0FBWSxlQUFlO0lBQ3pCLDRFQUEyRDtBQUM3RCxDQUFDLEVBRlcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFFMUI7QUFFRCxNQUFzQixNQUFNO0lBWTFCLFlBQVksT0FBVTtRQVBiLFdBQU0sR0FBWSxFQUFFLENBQUM7UUFHcEIsZ0JBQVcsR0FBWTtZQUMvQixJQUFJLGdCQUFTLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDO1NBQ3ZDLENBQUM7UUFJQSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDO0lBRVksSUFBSSxDQUFDLEtBQVE7O1lBRXhCLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtnQkFFaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN6QyxNQUFNLGtDQUFrQyxDQUFDO2FBRTFDO2lCQUFNO2dCQUVMLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDekMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNsQixNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNyQjtZQUVELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxDQUFDO0tBQUE7SUFFWSxZQUFZLENBQUMsS0FBUTs7WUFFaEMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXJCLElBQUksSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDekMsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO2dCQUN0QixNQUFNLEVBQUUsSUFBSSxFQUFFLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsRUFBRSxFQUFFLENBQUM7YUFDckY7WUFFRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzFDLENBQUM7S0FBQTtJQUVNLGFBQWE7UUFFbEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFFTSxPQUFPO1FBQ1osT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFTSxTQUFTO1FBRWQsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRU0sUUFBUSxDQUFDLElBQVk7UUFFMUIsS0FBSyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDbEMsSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFO2dCQUMzQixPQUFPLEtBQUssQ0FBQzthQUNkO1NBQ0Y7UUFFRCxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsb0JBQW9CLElBQUksa0JBQWtCLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO0lBQ3ZGLENBQUM7SUFFTSxVQUFVO1FBRWYsSUFBSSxPQUFPLEdBQWEsRUFBRSxDQUFDO1FBQzNCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM5QixLQUFLLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQy9CO1FBRUQsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVNLElBQUksQ0FBQyxLQUFhLEVBQUUsS0FBaUI7UUFFMUMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzNCLE9BQU8sTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFBQSxDQUFDO0lBRUssVUFBVTtRQUNmLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRU0sTUFBTTtRQUNYLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFJLElBQUksQ0FBQyxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxNQUFNO1FBQ1gsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUksSUFBSSxDQUFDLENBQUM7UUFDMUMsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVNLFdBQVc7UUFDaEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBSSxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRU0sSUFBSTtRQUNULE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUksSUFBSSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVNLEdBQUcsQ0FBQyxJQUFPO1FBRWhCLElBQUcsSUFBSSxDQUFDLEtBQUssRUFBQztZQUNaLE1BQU0sS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQyxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRVksY0FBYyxDQUFDLEdBQThCLEVBQUUsS0FBUzs7WUFFbkUsSUFBSSxLQUFLLElBQUksU0FBUyxFQUFFO2dCQUN0QixLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDMUI7WUFFRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDOUIsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFRLENBQUM7WUFDeEIsS0FBSyxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUU7Z0JBQ3hCLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDM0IsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO29CQUNoQixTQUFTO2lCQUNWO2dCQUNELEtBQUssQ0FBQyxJQUFlLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDaEU7WUFFRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7S0FBQTtDQWlDRjtBQTdLRCx3QkE2S0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUx1QztBQUNBO0FBQ0E7QUFDQTtBQUNFO0FBQ1E7QUFDRTtBQUNFOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1AxQjs7QUFFNUI7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUEsU0FBUyx3REFBaUI7QUFDMUI7O0FBRUEsaUVBQWUsR0FBRzs7Ozs7Ozs7Ozs7Ozs7QUNabEIsaUVBQWUsc0NBQXNDOzs7Ozs7Ozs7Ozs7Ozs7QUNBaEI7O0FBRXJDO0FBQ0EsT0FBTyx3REFBUTtBQUNmO0FBQ0E7O0FBRUE7QUFDQSxrQ0FBa0M7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBLHFCQUFxQjtBQUNyQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLEtBQUs7Ozs7Ozs7Ozs7Ozs7O0FDbENwQixpRUFBZSxjQUFjLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEdBQUcseUNBQXlDOzs7Ozs7Ozs7Ozs7Ozs7O0FDQXhHO0FBQzVCLHVDQUF1Qzs7QUFFdkM7QUFDZTtBQUNmO0FBQ0EsSUFBSSw0REFBcUI7QUFDekI7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDWDRCOztBQUU1QjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQSxTQUFTLHdEQUFpQjtBQUMxQjs7QUFFQSxpRUFBZSxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7QUNaa0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsZ0JBQWdCLFNBQVM7QUFDekI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw0Z0JBQTRnQjtBQUM1Z0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsT0FBTyx3REFBUTtBQUNmO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpRUFBZSxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7O0FDNUJHO0FBQ1ksQ0FBQztBQUN4QztBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsZUFBZTs7O0FBR2Y7QUFDQSxvQkFBb0I7O0FBRXBCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnRkFBZ0Y7QUFDaEY7QUFDQTs7QUFFQTtBQUNBLHdEQUF3RCwrQ0FBRzs7QUFFM0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOzs7QUFHQSx3RUFBd0U7QUFDeEU7O0FBRUEsNEVBQTRFOztBQUU1RSxnRUFBZ0U7O0FBRWhFO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7OztBQUdBO0FBQ0E7QUFDQSxJQUFJOzs7QUFHSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3Qjs7QUFFeEIsMkJBQTJCOztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjs7QUFFdEI7QUFDQTtBQUNBLHVCQUF1Qjs7QUFFdkIsb0NBQW9DOztBQUVwQyw4QkFBOEI7O0FBRTlCLGtDQUFrQzs7QUFFbEMsNEJBQTRCOztBQUU1QixrQkFBa0IsT0FBTztBQUN6QjtBQUNBOztBQUVBLGdCQUFnQix5REFBUztBQUN6Qjs7QUFFQSxpRUFBZSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7O0FDOUZVO0FBQ0E7QUFDM0IsV0FBVyxtREFBRyxhQUFhLCtDQUFHO0FBQzlCLGlFQUFlLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0hzQjtBQUNSOztBQUUvQjtBQUNBLDJDQUEyQzs7QUFFM0M7O0FBRUEsa0JBQWtCLGdCQUFnQjtBQUNsQztBQUNBOztBQUVBO0FBQ0E7O0FBRU87QUFDQTtBQUNQLDZCQUFlLG9DQUFVO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLHFEQUFLO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsc0JBQXNCLFFBQVE7QUFDOUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFdBQVcseURBQVM7QUFDcEIsSUFBSTs7O0FBR0o7QUFDQSw4QkFBOEI7QUFDOUIsSUFBSSxlQUFlOzs7QUFHbkI7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvRDJCO0FBQ1k7O0FBRXZDO0FBQ0E7QUFDQSxpREFBaUQsK0NBQUcsS0FBSzs7QUFFekQ7QUFDQSxtQ0FBbUM7O0FBRW5DO0FBQ0E7O0FBRUEsb0JBQW9CLFFBQVE7QUFDNUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFNBQVMseURBQVM7QUFDbEI7O0FBRUEsaUVBQWUsRUFBRTs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZCVTtBQUNFO0FBQzdCLFdBQVcsbURBQUcsYUFBYSxnREFBSTtBQUMvQixpRUFBZSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7QUNIYzs7QUFFL0I7QUFDQSxxQ0FBcUMsc0RBQVU7QUFDL0M7O0FBRUEsaUVBQWUsUUFBUTs7Ozs7Ozs7Ozs7Ozs7O0FDTmM7O0FBRXJDO0FBQ0EsT0FBTyx3REFBUTtBQUNmO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpRUFBZSxPQUFPOzs7Ozs7Ozs7O0FDVnRCOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9hZGFwdGVyL2luZGV4LnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9kZWJ1Zy50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvYm9vbGVhbi50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvZGF0ZXRpbWUudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL2ZpZWxkLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC9pbmRleC50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvaW50ZWdlci50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvanNvbi50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvbWFueS50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvdGV4dC50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvdXVpZC50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL21pZ3JhdGlvbi50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvc2NoZW1hLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS9tZDUuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS9uaWwuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS9wYXJzZS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3JlZ2V4LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvcm5nLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvc2hhMS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3N0cmluZ2lmeS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3YxLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvdjMuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS92MzUuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS92NC5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3Y1LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvdmFsaWRhdGUuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS92ZXJzaW9uLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiY3J5cHRvXCIiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BzdG9yYWdvL29ybS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0BzdG9yYWdvL29ybS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0BzdG9yYWdvL29ybS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0BzdG9yYWdvL29ybS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgeyBTZWxlY3QgfSBmcm9tIFwiLi9zZWxlY3RcIjtcbmV4cG9ydCB7IENyZWF0ZSB9IGZyb20gXCIuL2NyZWF0ZVwiO1xuZXhwb3J0IHsgSW5zZXJ0IH0gZnJvbSBcIi4vaW5zZXJ0XCI7XG5leHBvcnQgeyBEcm9wIH0gZnJvbSBcIi4vZHJvcFwiO1xuZXhwb3J0IHsgcGFyYW1zVHlwZSB9IGZyb20gXCIuL3F1ZXJ5XCI7XG5leHBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4vYWRhcHRlclwiO1xuIiwiaW50ZXJmYWNlIERlYnVne1xuICBzZWxlY3Q6IGJvb2xlYW4sXG4gIGluc2VydDogYm9vbGVhbixcbiAgY3JlYXRlOiBib29sZWFuLFxuICBkcm9wOiBib29sZWFuLFxuICBxdWVyeTogYm9vbGVhbixcbn1cblxuZXhwb3J0IGxldCBkZWJ1ZzogRGVidWcgPSB7XG4gIHNlbGVjdDogZmFsc2UsXG4gIGluc2VydDogZmFsc2UsXG4gIGNyZWF0ZTogZmFsc2UsXG4gIGRyb3A6IGZhbHNlLFxuICBxdWVyeTogZmFsc2UsXG59IiwiaW1wb3J0IHsgTW9kZWxJbnRlcmZhY2UgfSBmcm9tIFwiLi5cIjtcbmltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi4vYWRhcHRlci9hZGFwdGVyXCI7XG5pbXBvcnQgeyBDb25maWcsIGRlZmF1bHRDb25maWcsIEZpZWxkLCBGaWVsZEtpbmQgfSBmcm9tIFwiLi9maWVsZFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJvb2xlYW5Db25maWcgZXh0ZW5kcyBDb25maWcgeyB9XG5cbmV4cG9ydCBjbGFzcyBCb29sZWFuRmllbGQgZXh0ZW5kcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgY29uZmlnOiBCb29sZWFuQ29uZmlnO1xuICByZWFkb25seSBraW5kOiBGaWVsZEtpbmQgPSBGaWVsZEtpbmQuQk9PTEVBTjtcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGNvbmZpZzogUGFydGlhbDxCb29sZWFuQ29uZmlnPiA9IGRlZmF1bHRDb25maWcpIHtcblxuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLi4uZGVmYXVsdENvbmZpZyxcbiAgICAgIC4uLmNvbmZpZyxcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZnJvbURCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBLCB2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG5cbiAgICByZXR1cm4gYWRhcHRlci5maWVsZFRyYW5zZm9ybUZyb21EYih0aGlzLCB2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgdG9EQjxBIGV4dGVuZHMgQWRhcHRlciwgTSBleHRlbmRzIE1vZGVsSW50ZXJmYWNlPihhZGFwdGVyOiBBLCBtb2RlbDogTSk6IGFueSB7XG5cbiAgICBsZXQgdmFsdWUgPSBzdXBlci50b0RCPEEsIE0+KGFkYXB0ZXIsIG1vZGVsKTtcbiAgICByZXR1cm4gYWRhcHRlci5maWVsZFRyYW5zZm9ybVRvREI8Qm9vbGVhbkZpZWxkLCBNPih0aGlzLCB2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgY2FzdERCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBKTogc3RyaW5nIHtcblxuICAgIHJldHVybiBhZGFwdGVyLmZpZWxkQ2FzdDxCb29sZWFuRmllbGQ+KHRoaXMpO1xuICB9XG59IiwiaW1wb3J0IHsgTW9kZWxJbnRlcmZhY2UgfSBmcm9tIFwiLi5cIjtcbmltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi4vYWRhcHRlci9hZGFwdGVyXCI7XG5pbXBvcnQgeyBDb25maWcsIGRlZmF1bHRDb25maWcsIEZpZWxkLCBGaWVsZEtpbmQgfSBmcm9tIFwiLi9maWVsZFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIERhdGVUaW1lQ29uZmlnIGV4dGVuZHMgQ29uZmlnIHsgfVxuXG5leHBvcnQgY2xhc3MgRGF0ZVRpbWVGaWVsZCBleHRlbmRzIEZpZWxkIHtcblxuICByZWFkb25seSBjb25maWc6IERhdGVUaW1lQ29uZmlnO1xuICByZWFkb25seSBraW5kOiBGaWVsZEtpbmQgPSBGaWVsZEtpbmQuREFURVRJTUU7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjb25maWc6IFBhcnRpYWw8RGF0ZVRpbWVDb25maWc+ID0gZGVmYXVsdENvbmZpZykge1xuXG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmcm9tREI8QSBleHRlbmRzIEFkYXB0ZXI+KGFkYXB0ZXI6IEEsIHZhbHVlOiBhbnkpIDogRGF0ZXx1bmRlZmluZWQge1xuXG4gICAgaWYodmFsdWUgPT09IG51bGwpe1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IERhdGUodmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHRvREI8QSBleHRlbmRzIEFkYXB0ZXIsIE0gZXh0ZW5kcyBNb2RlbEludGVyZmFjZT4oYWRhcHRlcjogQSwgbW9kZWw6IE0pIDogbnVtYmVyIHtcbiAgICBcbiAgICBsZXQgbmFtZSA9IHRoaXMuZ2V0TmFtZSgpO1xuICAgIGxldCB2YWx1ZSA9IG1vZGVsW25hbWUgYXMga2V5b2YgTV07XG5cbiAgICBpZih2YWx1ZSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRWYWx1ZSgpO1xuICAgIH1cblxuICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSl7XG4gICAgICByZXR1cm4gdmFsdWUuZ2V0VGltZSgpO1xuICAgIH1cblxuICAgIHRocm93IHtjb2RlOiBudWxsLCBtZXNzYWdlOiBgdmFsdWUgb2YgJHtuYW1lfSB0byBEQiBpcyBub3QgYSBEYXRlYH07XG4gIH1cblxuICBwdWJsaWMgY2FzdERCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBKTogc3RyaW5nIHtcbiAgICBcbiAgICByZXR1cm4gYWRhcHRlci5maWVsZENhc3Q8RGF0ZVRpbWVGaWVsZD4odGhpcyk7XG4gIH1cbn0iLCJpbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4uL2FkYXB0ZXIvYWRhcHRlclwiO1xuaW1wb3J0IHsgTW9kZWxJbnRlcmZhY2UgfSBmcm9tIFwiLi4vbW9kZWxcIjtcblxuZXhwb3J0IGVudW0gY29kZUZpZWxkRXJyb3Ige1xuICAnRW5naW5lTm90SW1wbGVtZW50ZWQnID0gJ0BzdG9yYWdvL29ybS9maWVsZC9lbmdpbmVOb3RJbXBsZW1lbnRlZCcsXG4gICdEZWZhdWx0VmFsdWVJc05vdFZhbGlkJyA9ICdAc3RvcmFnby9vcm0vZmllbGQvZGVmYXVsdFBhcmFtTm90VmFsaWQnLFxuICAnSW5jb3JyZWN0VmFsdWVUb0RiJyA9ICdAc3RvcmFnby9vcm0vZmllbGQvSW5jb3JyZWN0VmFsdWVUb1N0b3JhZ2VPbkRCJyxcbiAgJ1JlZmVyZXJOb3RGb3VuZCcgPSAnQHN0b3JhZ28vb3JtL2ZpZWxkL01hbnlSZWxhdGlvbnNoaXAnLFxuICAnRmllbGRLaW5kTm90U3VwcG9ydGVkJyA9ICdAc3RvcmFnby9vcm0vZmllbGQvRmllbGRLaW5kTm90U3VwcG9ydGVkJyxcbn1cblxuZXhwb3J0IGVudW0gRmllbGRLaW5ke1xuICBURVhULFxuICBWQVJDSEFSLFxuICBDSEFSQUNURVIsXG5cbiAgSU5URUdFUixcbiAgVElOWUlOVCxcbiAgU01BTExJTlQsXG4gIE1FRElVTUlOVCxcbiAgQklHSU5ULFxuXG4gIFJFQUwsXG4gIERPVUJMRSxcbiAgRkxPQVQsXG5cbiAgTlVNRVJJQyxcbiAgREVDSU1BTCxcbiAgREFURSxcbiAgREFURVRJTUUsXG4gIEJPT0xFQU4sXG5cbiAgVVVJRCxcbiAgSlNPTixcblxuICBCTE9CLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZyB7XG4gIGRlZmF1bHQ/OiBhbnk7XG4gIHJlcXVpcmVkOiBib29sZWFuO1xuICBsaW5rPzogc3RyaW5nO1xuICBpbmRleDogYm9vbGVhbjtcbiAgcHJpbWFyeTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRDb25maWc6IENvbmZpZyA9IHtcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBpbmRleDogZmFsc2UsXG4gIHByaW1hcnk6IGZhbHNlXG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgYWJzdHJhY3QgY29uZmlnOiBDb25maWc7XG4gIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbiAgYWJzdHJhY3QgcmVhZG9ubHkga2luZDogRmllbGRLaW5kOyBcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICB9XG5cbiAgcHVibGljIGdldE5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xuICB9XG5cbiAgcHVibGljIGdldERlZmF1bHRWYWx1ZSgpOiBhbnkge1xuXG4gICAgbGV0IHZhbHVlRGVmYXVsdCA9IHRoaXMuY29uZmlnLmRlZmF1bHQ7XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlRGVmYXVsdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHZhbHVlRGVmYXVsdCgpO1xuICAgIH1cbiAgICBcbiAgICBpZiAodmFsdWVEZWZhdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbHVlRGVmYXVsdCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlRGVmYXVsdDtcbiAgfVxuXG4gIHB1YmxpYyBpc1ZpcnR1YWwoKTogYm9vbGVhbiB7XG5cbiAgICBpZiAodGhpcy5jb25maWcubGluayAhPT0gdW5kZWZpbmVkICYmICF0aGlzLmNvbmZpZy5pbmRleCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLypcbiAgcHVibGljIGFzeW5jIHBvcHVsYXRlKG1vZGVsOiBNb2RlbCwgcm93OiB7IFtpbmRleDogc3RyaW5nXTogYW55OyB9KTogUHJvbWlzZTxhbnk+IHtcblxuICAgIGxldCBuYW1lID0gdGhpcy5nZXROYW1lKCk7XG4gICAgbGV0IHZhbHVlID0gcm93W25hbWVdO1xuXG4gICAgLypcbiAgICBpZiAodGhpcy5jb25maWcubGluayAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgIGxldCBsaW5rczogc3RyaW5nW10gPSB0aGlzLmNvbmZpZy5saW5rLnNwbGl0KCcuJyk7XG4gICAgICBsZXQgaXRlbU5hbWUgPSBsaW5rcy5zaGlmdCgpO1xuXG4gICAgICBpZiAoIWl0ZW1OYW1lIHx8IGl0ZW1OYW1lIGluIG1vZGVsLl9fZGF0YSkge1xuICAgICAgICBtb2RlbFtuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YWx1ZSA9IGF3YWl0IG1vZGVsLl9fZGF0YVtpdGVtTmFtZV07XG5cbiAgICAgIHdoaWxlIChpdGVtTmFtZSA9IGxpbmtzLnNoaWZ0KCkpIHtcblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGlmIChpdGVtTmFtZSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZVtpdGVtTmFtZV07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0aGlzLmZyb21EQih2YWx1ZSk7XG4gIH1cbiAgKi9cbiAgXG4gcHVibGljIHRvREI8QSBleHRlbmRzIEFkYXB0ZXIsIE0gZXh0ZW5kcyBNb2RlbEludGVyZmFjZT4oYWRhcHRlcjogQSwgbW9kZWw6IE0pOiBhbnkge1xuICAgXG4gICBsZXQgbmFtZSA9IHRoaXMuZ2V0TmFtZSgpO1xuICAgbGV0IHZhbHVlID0gbW9kZWxbbmFtZSBhcyBrZXlvZiBNXTtcbiAgIFxuICAgaWYodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCl7XG4gICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRWYWx1ZSgpO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgYWJzdHJhY3QgZnJvbURCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBLCB2YWx1ZTogYW55KTogYW55O1xuICBhYnN0cmFjdCBjYXN0REI8QSBleHRlbmRzIEFkYXB0ZXI+KGFkYXB0ZXI6IEEpOiBzdHJpbmc7XG4gIFxuICBwdWJsaWMgaXNKc29uT2JqZWN0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgLypcbiAgcHJvdGVjdGVkIGRlZmluZVNldHRlcihsaW5rOiBzdHJpbmcsIHNjaGVtYTogU2NoZW1hLCBtb2RlbDogTW9kZWwsIHZhbHVlOiBhbnkpIDogdm9pZCB7XG5cbiAgICBpZiAobGluaykge1xuICAgICAgbGV0IGxpc3ROYW1lID0gbGluay5zcGxpdCgnLicpO1xuICAgICAgbGV0IGZpZWxkTmFtZSA9IGxpc3ROYW1lWzBdO1xuICAgICAgbGV0IHRhcmdldCA9IGxpc3ROYW1lLnBvcCgpO1xuICAgICAgbGV0IGZpZWxkID0gc2NoZW1hLmdldEZpZWxkKGZpZWxkTmFtZSk7XG4gICAgICBsZXQgaXRlbSA6IGFueSA9IG1vZGVsO1xuICAgICAgXG4gICAgICBpZihmaWVsZC5pc0pzb25PYmplY3QoKSl7XG4gICAgICAgIGxldCBpdGVtTmFtZSA9IGxpc3ROYW1lLnNoaWZ0KCk7XG4gICAgICAgIHdoaWxlKGl0ZW1OYW1lKXtcbiAgICAgICAgICBcbiAgICAgICAgICBpZih0eXBlb2YgaXRlbVtpdGVtTmFtZV0gIT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIGl0ZW1baXRlbU5hbWVdID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIGl0ZW0gPSBpdGVtW2l0ZW1OYW1lXTtcbiAgICAgICAgICBpdGVtTmFtZSA9IGxpc3ROYW1lLnNoaWZ0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYodGFyZ2V0KXtcbiAgICAgICAgaXRlbVt0YXJnZXRdID0gdGhpcy5wYXJzZVRvREIodmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBkZWZpbmVHZXR0ZXIobGluazogc3RyaW5nLCBzY2hlbWE6IFNjaGVtYSwgbW9kZWw6IE1vZGVsKSA6IGFueSB7XG5cbiAgICBpZiAobGluaykge1xuICAgICAgbGV0IGxpc3ROYW1lID0gbGluay5zcGxpdCgnLicpO1xuICAgICAgbGV0IGZpZWxkTmFtZSA9IGxpc3ROYW1lWzBdO1xuICAgICAgbGV0IHRhcmdldCA9IGxpc3ROYW1lLnBvcCgpO1xuICAgICAgbGV0IGZpZWxkID0gc2NoZW1hLmdldEZpZWxkKGZpZWxkTmFtZSk7XG4gICAgICBsZXQgaXRlbSA6IGFueSA9IG1vZGVsO1xuXG4gICAgICBpZihmaWVsZC5pc0pzb25PYmplY3QoKSl7XG4gICAgICAgIGxldCBpdGVtTmFtZSA9IGxpc3ROYW1lLnNoaWZ0KCk7XG4gICAgICAgIHdoaWxlKGl0ZW1OYW1lKXtcbiAgICAgICAgICBcbiAgICAgICAgICBpZih0eXBlb2YgaXRlbVtpdGVtTmFtZV0gIT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIHJldHVybiBpdGVtW2l0ZW1OYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgaXRlbSA9IGl0ZW1baXRlbU5hbWVdO1xuICAgICAgICAgIGl0ZW1OYW1lID0gbGlzdE5hbWUuc2hpZnQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBpZih0YXJnZXQpe1xuICAgICAgICByZXR1cm4gaXRlbVt0YXJnZXRdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgXG4gIHB1YmxpYyBkZWZpbmVQcm9wZXJ0eShzY2hlbWE6IFNjaGVtYSwgbW9kZWw6IE1vZGVsKTogdm9pZCB7XG4gICAgXG4gICAgXG4gICAgbGV0IGxpbmsgPSB0aGlzLmNvbmZpZy5saW5rO1xuICAgIGlmIChsaW5rKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kZWwsIHRoaXMubmFtZSwge1xuICAgICAgICAnc2V0JzogdGhpcy5kZWZpbmVTZXR0ZXIuYmluZCh0aGlzLCBsaW5rLCBzY2hlbWEsIG1vZGVsKSxcbiAgICAgICAgJ2dldCc6IHRoaXMuZGVmaW5lR2V0dGVyLmJpbmQodGhpcywgbGluaywgc2NoZW1hLCBtb2RlbCksXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgKi9cblxufVxuIiwiZXhwb3J0IHsgRmllbGQsIEZpZWxkS2luZCwgY29kZUZpZWxkRXJyb3IgfSBmcm9tIFwiLi9maWVsZFwiO1xuXG5pbXBvcnQgeyBUZXh0RmllbGQgfSBmcm9tIFwiLi90ZXh0XCI7XG5pbXBvcnQgeyBVVUlERmllbGQgfSBmcm9tIFwiLi91dWlkXCI7XG5pbXBvcnQgeyBKc29uRmllbGQgfSBmcm9tIFwiLi9qc29uXCI7XG5pbXBvcnQgeyBNYW55RmllbGQgfSBmcm9tIFwiLi9tYW55XCI7XG5pbXBvcnQgeyBJbnRlZ2VyRmllbGQgfSBmcm9tIFwiLi9pbnRlZ2VyXCI7XG5pbXBvcnQgeyBCb29sZWFuRmllbGQgfSBmcm9tIFwiLi9ib29sZWFuXCI7XG5pbXBvcnQgeyBEYXRlVGltZUZpZWxkIH0gZnJvbSBcIi4vZGF0ZXRpbWVcIjtcblxuZXhwb3J0IGNvbnN0IGZpZWxkcyA9IHtcbiAgVGV4dEZpZWxkLFxuICBVVUlERmllbGQsXG4gIEpzb25GaWVsZCxcbiAgTWFueUZpZWxkLFxuICBJbnRlZ2VyRmllbGQsXG4gIEJvb2xlYW5GaWVsZCxcbiAgRGF0ZVRpbWVGaWVsZCxcbn1cbiIsImltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi4vYWRhcHRlci9hZGFwdGVyXCI7XG5pbXBvcnQgeyBNb2RlbEludGVyZmFjZSB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgRmllbGQsIENvbmZpZywgZGVmYXVsdENvbmZpZywgRmllbGRLaW5kIH0gZnJvbSBcIi4vZmllbGRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJbnRlZ2VyQ29uZmlnIGV4dGVuZHMgQ29uZmlnIHsgfVxuXG5leHBvcnQgY2xhc3MgSW50ZWdlckZpZWxkIGV4dGVuZHMgRmllbGQge1xuXG4gIHJlYWRvbmx5IGNvbmZpZzogSW50ZWdlckNvbmZpZztcbiAgcmVhZG9ubHkga2luZDogRmllbGRLaW5kID0gRmllbGRLaW5kLklOVEVHRVI7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjb25maWc6IFBhcnRpYWw8SW50ZWdlckNvbmZpZz4gPSBkZWZhdWx0Q29uZmlnKSB7XG5cbiAgICBzdXBlcihuYW1lKTtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIC4uLmRlZmF1bHRDb25maWcsXG4gICAgICAuLi5jb25maWcsXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGZyb21EQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSwgdmFsdWU6IHN0cmluZyk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG5cbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhyb3cgeyBjb2RlOiBudWxsLCBtZXNzYWdlOiAndmFsdWUgZnJvbSBEQiBpcyBub3QgYSBudW1iZXInIH07XG4gIH1cblxuICBwdWJsaWMgdG9EQjxBIGV4dGVuZHMgQWRhcHRlciwgTSBleHRlbmRzIE1vZGVsSW50ZXJmYWNlPihhZGFwdGVyOiBBLCBtb2RlbDogTSk6IGFueSB7XG5cbiAgICBsZXQgbmFtZSA9IHRoaXMuZ2V0TmFtZSgpO1xuICAgIGxldCB2YWx1ZSA9IG1vZGVsW25hbWUgYXMga2V5b2YgTV07XG5cbiAgICBpZiAodmFsdWUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0VmFsdWUoKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IodmFsdWUpO1xuICAgIH1cblxuICAgIHRocm93IHsgY29kZTogbnVsbCwgbWVzc2FnZTogYHZhbHVlIG9mICR7IG5hbWUgfSB0byBEQiBpcyBub3QgYSBpbnRlZ2VyYCB9O1xuICB9XG5cbiAgcHVibGljIGNhc3REQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSk6IHN0cmluZyB7XG5cbiAgICByZXR1cm4gYWRhcHRlci5maWVsZENhc3Q8SW50ZWdlckZpZWxkPih0aGlzKTtcbiAgfVxufSIsImltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi4vYWRhcHRlci9hZGFwdGVyXCI7XG5pbXBvcnQgeyBNb2RlbEludGVyZmFjZSB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgRmllbGQsIENvbmZpZywgZGVmYXVsdENvbmZpZywgY29kZUZpZWxkRXJyb3IsIEZpZWxkS2luZCB9IGZyb20gXCIuL2ZpZWxkXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSnNvbkNvbmZpZyBleHRlbmRzIENvbmZpZyB7XG4gIHR5cGU6ICdsaXN0JyB8ICdvYmplY3QnLFxuICBkZWZhdWx0PzogJ3N0cmluZycgfCBGdW5jdGlvbiB8IE9iamVjdDtcbn1cblxubGV0IGpzb25EZWZhdWx0Q29uZmlnOiBKc29uQ29uZmlnID0ge1xuICAuLi5kZWZhdWx0Q29uZmlnLFxuICB0eXBlOiAnb2JqZWN0Jyxcbn1cblxuZXhwb3J0IGNsYXNzIEpzb25GaWVsZCBleHRlbmRzIEZpZWxkIHtcblxuICByZWFkb25seSBjb25maWc6IEpzb25Db25maWc7XG4gIHJlYWRvbmx5IGtpbmQ6IEZpZWxkS2luZCA9IEZpZWxkS2luZC5KU09OO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgY29uZmlnOiBQYXJ0aWFsPEpzb25Db25maWc+ID0ganNvbkRlZmF1bHRDb25maWcpIHtcblxuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLi4uanNvbkRlZmF1bHRDb25maWcsXG4gICAgICAuLi5jb25maWcsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBnZXREZWZhdWx0VmFsdWUoKTogYW55IHtcblxuICAgIGxldCB2YWx1ZURlZmF1bHQgPSBzdXBlci5nZXREZWZhdWx0VmFsdWUoKTtcblxuICAgIGlmICh0eXBlb2YgdmFsdWVEZWZhdWx0ID09PSAnc3RyaW5nJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWVEZWZhdWx0ID0gSlNPTi5wYXJzZSh2YWx1ZURlZmF1bHQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgY29kZTogY29kZUZpZWxkRXJyb3IuRGVmYXVsdFZhbHVlSXNOb3RWYWxpZCxcbiAgICAgICAgICBtZXNzYWdlOiBgRGVmYXVsdCB2YWx1ZSBvbiBKU09OIGZpZWxkIGlzIG5vdCBhIHZhbGlkIGpzb25gXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlRGVmYXVsdDtcbiAgfVxuXG4gIHB1YmxpYyBmcm9tREI8QSBleHRlbmRzIEFkYXB0ZXI+KGFkYXB0ZXI6IEEsIHZhbHVlOiBzdHJpbmcgfCBudWxsKTogb2JqZWN0IHwgdW5kZWZpbmVkIHtcblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09ICcnKSB7XG4gICAgICBsZXQgdHlwZSA9IHRoaXMuY29uZmlnLnR5cGU7XG4gICAgICBpZiAodHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vcmV0dXJuIEpTT04ucGFyc2UodmFsdWUpO1xuICAgIHJldHVybiBhZGFwdGVyLmZpZWxkVHJhbnNmb3JtRnJvbURiPEpzb25GaWVsZD4odGhpcywgdmFsdWUpO1xuICB9XG5cbiAgcHVibGljIGNhc3REQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSk6IHN0cmluZyB7XG5cbiAgICByZXR1cm4gYWRhcHRlci5maWVsZENhc3Q8SnNvbkZpZWxkPih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBpc0pzb25PYmplY3QoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuY29uZmlnLnR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwdWJsaWMgdG9EQjxBIGV4dGVuZHMgQWRhcHRlciwgTSBleHRlbmRzIE1vZGVsSW50ZXJmYWNlPihhZGFwdGVyOiBBLCBtb2RlbDogTSk6IHN0cmluZyB8IG51bGwge1xuXG4gICAgbGV0IHZhbHVlID0gc3VwZXIudG9EQihhZGFwdGVyLCBtb2RlbCk7XG5cbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0cmluZ2lmeVRvRGIodmFsdWUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0cmluZ2lmeVRvRGIodmFsdWU6IGFueSk6IHN0cmluZyB7XG5cbiAgICBsZXQga2luZCA9IHRoaXMuY29uZmlnLnR5cGU7XG4gICAgbGV0IGVycm9yID0ge1xuICAgICAgY29kZTogY29kZUZpZWxkRXJyb3IuSW5jb3JyZWN0VmFsdWVUb0RiLFxuICAgICAgbWVzc2FnZTogYHZhbHVlIGlzIG5vdCBhIHZhbGlkIGpzb25gLFxuICAgIH07XG5cbiAgICAvKiBUZXN0IGlmIHZhbHVlIGlzIHZhbGlkICovXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIEpTT04ucGFyc2UodmFsdWUpOyAvL2p1c3QgdGVzdFxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICBpZiAoa2luZCAhPT0gJ2xpc3QnKSB7XG4gICAgICAgICAgICBlcnJvci5tZXNzYWdlID0gJ0pTT04gaXMgYSBvYmplY3QsIGJ1dCBtdXN0IGJlIGEgbGlzdCc7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGtpbmQgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBlcnJvci5tZXNzYWdlID0gJ0pTT04gaXMgYSBsaXN0LCBidXQgbXVzdCBiZSBhIG9iamVjdCc7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogY29udmVydCB0byBzdHJpbmcgKi9cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufSIsImltcG9ydCB7IE1vZGVsSW50ZXJmYWNlIH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBVVUlERmllbGQgfSBmcm9tIFwiLi91dWlkXCI7XG5pbXBvcnQgeyBDb25maWcsIGRlZmF1bHRDb25maWcgfSBmcm9tIFwiLi9maWVsZFwiO1xuaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSBcIi4uXCI7XG5cbmV4cG9ydCBjbGFzcyBNYW55RmllbGQgZXh0ZW5kcyBVVUlERmllbGQge1xuXG4gIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnO1xuICAvL3Byb3RlY3RlZCByZWZlcmVyOiB0eXBlb2YgTW9kZWw7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjb25maWc/OiBQYXJ0aWFsPENvbmZpZz4pIHtcblxuICAgIHN1cGVyKGAkeyBuYW1lIH1faWRgKTtcbiAgICAvL3RoaXMucmVmZXJlciA9IHJlZmVyZXI7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH1cbiAgfVxuXG4gIC8qXG4gIHB1YmxpYyBkZWZpbmVQcm9wZXJ0eShzY2hlbWE6IFNjaGVtYSwgbW9kZWw6IE1vZGVsKTogdm9pZCB7XG4gICAgXG4gICAgbGV0IGNvbHVtbiA9IHRoaXMuZ2V0TmFtZSgpO1xuICAgIGxldCBuYW1lID0gY29sdW1uLnJlcGxhY2UoJ19pZCcsICcnKTtcbiAgICBsZXQgcHJveHkgPSB0aGlzO1xuICAgIG1vZGVsW25hbWVdID0gYXN5bmMgZnVuY3Rpb24oaXRlbT86IHR5cGVvZiB0aGlzLnJlZmVyZXJ8c3RyaW5nKSA6IFByb21pc2U8TW9kZWx8dm9pZHx1bmRlZmluZWQ+e1xuICAgICAgXG4gICAgICBpZihpdGVtID09IHVuZGVmaW5lZCl7XG4gICAgICAgIGxldCBpZFJlZmVyZXIgPSBtb2RlbFtjb2x1bW5dOyBcbiAgICAgICAgcmV0dXJuIHByb3h5LnJlZmVyZXIuZmluZCgnaWQgPSA/JywgaWRSZWZlcmVyKTtcbiAgICAgIH1cblxuICAgICAgaWYoaXRlbSBpbnN0YW5jZW9mIHByb3h5LnJlZmVyZXIpe1xuICAgICAgICBtb2RlbFtjb2x1bW5dID0gaXRlbS5pZDtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgfVxuXG4gICAgICBsZXQgcmVmID0gYXdhaXQgcHJveHkucmVmZXJlci5maW5kKCdpZCA9ID8nLCBpdGVtKTtcbiAgICAgIGlmKHJlZiA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgdGhyb3cge2NvZGU6IGNvZGVFcnJvci5SZWZlcmVyTm90Rm91bmQsIG1lc3NhZ2U6IGBOb3QgZm91bmQgJHtpdGVtfSBvbiB0YWJsZSAke25hbWV9YH07XG4gICAgICB9XG4gICAgICBtb2RlbFtjb2x1bW5dID0gcmVmLmlkO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgfVxuICAqL1xufSIsImltcG9ydCB7IE1vZGVsSW50ZXJmYWNlIH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4uL2FkYXB0ZXIvYWRhcHRlclwiO1xuaW1wb3J0IHsgRmllbGQsIENvbmZpZywgZGVmYXVsdENvbmZpZywgRmllbGRLaW5kIH0gZnJvbSBcIi4vZmllbGRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBUZXh0Q29uZmlnIGV4dGVuZHMgQ29uZmlnIHsgfVxuXG5leHBvcnQgY2xhc3MgVGV4dEZpZWxkIGV4dGVuZHMgRmllbGQge1xuXG4gIHJlYWRvbmx5IGNvbmZpZzogVGV4dENvbmZpZztcbiAgcmVhZG9ubHkga2luZDogRmllbGRLaW5kID0gRmllbGRLaW5kLlRFWFQ7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjb25maWc6IFBhcnRpYWw8VGV4dENvbmZpZz4gPSBkZWZhdWx0Q29uZmlnKSB7XG5cbiAgICBzdXBlcihuYW1lKTtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIC4uLmRlZmF1bHRDb25maWcsXG4gICAgICAuLi5jb25maWcsXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGZyb21EQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSwgdmFsdWU6IHN0cmluZ3xudWxsKTogc3RyaW5nfHVuZGVmaW5lZCB7XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgdG9EQjxBIGV4dGVuZHMgQWRhcHRlciwgVCBleHRlbmRzIE1vZGVsSW50ZXJmYWNlPihhZGFwdGVyOiBBLCBtb2RlbDogVCk6IHN0cmluZ3xudWxsIHtcblxuICAgIGxldCBuYW1lID0gdGhpcy5nZXROYW1lKCk7XG4gICAgbGV0IHZhbHVlID0gbW9kZWxbbmFtZSBhcyBrZXlvZiBUXTtcblxuICAgIGlmKHZhbHVlID09PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVmYXVsdFZhbHVlKCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB2YWx1ZS50cmltKCk7XG4gICAgfVxuXG4gICAgdGhyb3cge2NvZGU6IG51bGwsIG1lc3NhZ2U6IGB2YWx1ZSBvZiAke25hbWV9IHRvIERCIGlzIG5vdCBhIHN0cmluZ2B9O1xuICB9XG5cbiAgcHVibGljIGNhc3REQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSk6IHN0cmluZyB7XG5cbiAgICByZXR1cm4gYWRhcHRlci5maWVsZENhc3Q8VGV4dEZpZWxkPih0aGlzKTtcbiAgfVxufSIsImltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi4vYWRhcHRlci9hZGFwdGVyXCI7XG5pbXBvcnQgeyBGaWVsZCwgQ29uZmlnLCBkZWZhdWx0Q29uZmlnLCBGaWVsZEtpbmQgfSBmcm9tIFwiLi9maWVsZFwiO1xuaW1wb3J0IHsgTW9kZWxJbnRlcmZhY2UgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcblxuZXhwb3J0IGNsYXNzIFVVSURGaWVsZCBleHRlbmRzIEZpZWxkIHtcblxuICByZWFkb25seSBjb25maWc6IENvbmZpZztcbiAgcmVhZG9ubHkga2luZDogRmllbGRLaW5kID0gRmllbGRLaW5kLlVVSUQ7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjb25maWc6IFBhcnRpYWw8Q29uZmlnPiA9IGRlZmF1bHRDb25maWcpIHtcblxuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLi4uZGVmYXVsdENvbmZpZyxcbiAgICAgIC4uLmNvbmZpZyxcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGNhc3REQihhZGFwdGVyOiBBZGFwdGVyKTogc3RyaW5nIHtcblxuICAgIHJldHVybiBhZGFwdGVyLmZpZWxkQ2FzdDxVVUlERmllbGQ+KHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGZyb21EQih2YWx1ZTogYW55KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHRocm93IHsgY29kZTogbnVsbCwgbWVzc2FnZTogJ3ZhbHVlIGZyb20gREIgaXMgbm90IGEgdmFsaWQgdXVpZCcgfTtcbiAgfVxuXG4gIHB1YmxpYyBnZXREZWZhdWx0VmFsdWUoKTogYW55IHtcblxuICAgIGxldCB2YWx1ZSA9IHN1cGVyLmdldERlZmF1bHRWYWx1ZSgpO1xuXG4gICAgaWYgKHZhbHVlID09PSBudWxsICYmIHRoaXMuY29uZmlnLnByaW1hcnkpIHtcbiAgICAgIHZhbHVlID0gdXVpZCgpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB0b0RCPEEgZXh0ZW5kcyBBZGFwdGVyLCBNIGV4dGVuZHMgTW9kZWxJbnRlcmZhY2U+KGFkYXB0ZXI6IEEsIG1vZGVsOiBNKTogYW55IHtcblxuICAgIGxldCB2YWx1ZSA9IHN1cGVyLnRvREI8QSwgTT4oYWRhcHRlciwgbW9kZWwpO1xuICAgIHJldHVybiBhZGFwdGVyLmZpZWxkVHJhbnNmb3JtVG9EQjxVVUlERmllbGQsIE0+KHRoaXMsIHZhbHVlKTtcbiAgfVxufSIsImV4cG9ydCB7IGRlYnVnIH0gZnJvbSAnLi9kZWJ1Zyc7XG5cbmV4cG9ydCB7IE1vZGVsSW50ZXJmYWNlLCBNb2RlbENvbnN0cnVjdG9yIH0gZnJvbSAnLi9tb2RlbCc7XG5leHBvcnQgeyBTY2hlbWEgfSBmcm9tICcuL3NjaGVtYSc7XG5leHBvcnQgKiBmcm9tICcuL2FkYXB0ZXInO1xuZXhwb3J0IHsgZmllbGRzLCBGaWVsZCwgRmllbGRLaW5kLCBjb2RlRmllbGRFcnJvciB9IGZyb20gJy4vZmllbGQnO1xuZXhwb3J0IHsgTWlncmF0aW9uIH0gZnJvbSAnLi9taWdyYXRpb24nO1xuXG4vL2V4cG9ydCB7IHNlc3Npb24sIHNldERlZmF1bHRBZGFwdGVyLCBnZXREZWZhdWx0QWRhcHRlciB9IGZyb20gJy4vc2Vzc2lvbic7IiwiaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gXCIuL2FkYXB0ZXIvYWRhcHRlclwiO1xuXG50eXBlIHRhc2tDYWxsYmFjayA9IHsgKHRyYW5zYWN0aW9uOiBhbnkpOiBQcm9taXNlPHZvaWQ+IH07XG5cbmludGVyZmFjZSB0YXNrVmVyc2lvbiB7XG4gIFt2ZXJzaW9uOiBudW1iZXJdOiB0YXNrQ2FsbGJhY2s7XG59O1xuXG5leHBvcnQgY2xhc3MgTWlncmF0aW9uIHtcblxuICBwcm90ZWN0ZWQgYWRhcHRlcjogQWRhcHRlcjtcbiAgcHJpdmF0ZSB0YXNrczogdGFza1ZlcnNpb24gPSB7fTtcbiAgcHJpdmF0ZSBmaXJzdEFjY2Vzcz86IHRhc2tDYWxsYmFjaztcblxuICBjb25zdHJ1Y3RvcihhZGFwdGVyOiBBZGFwdGVyKSB7XG4gICAgdGhpcy5hZGFwdGVyID0gYWRhcHRlcjtcbiAgfVxuXG4gIHByb3RlY3RlZCBtYWtlKCk6IHZvaWQgeyB9XG5cbiAgcHVibGljIGFzeW5jIHJ1bigpOiBQcm9taXNlPHZvaWQ+IHtcblxuICAgIHRoaXMubWFrZSgpO1xuXG4gICAgaWYgKHRoaXMuZmlyc3RBY2Nlc3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgeyBjb2RlOiBudWxsLCBtZXNzYWdlOiBgRmlyc3RBY2Nlc3MgTWlncmF0aW9uIG5vdCBpbXBsZW1lbnRlZCFgIH07XG4gICAgfVxuXG4gICAgLypcbiAgICBsZXQgdmVyc2lvbiA9IHRoaXMuYWRhcHRlci5nZXRWZXJzaW9uKCk7XG4gICAgaWYgKHZlcnNpb24gPT09ICcnKSB7XG4gICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmNoYW5nZVZlcnNpb24oMCwgdGhpcy5maXJzdEFjY2Vzcyk7XG4gICAgfVxuICAgIFxuXG4gICAgd2hpbGUgKHRydWUpIHtcblxuICAgICAgdmVyc2lvbisrO1xuICAgICAgbGV0IHRhc2sgPSB0aGlzLnRhc2tzW3ZlcnNpb25dO1xuICAgICAgaWYgKHRhc2sgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgYXdhaXQgdGhpcy5hZGFwdGVyLmNoYW5nZVZlcnNpb24odmVyc2lvbiwgdGFzayk7XG4gICAgfVxuKi9cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVnaXN0ZXJGaXJzdEFjY2VzcyhjYWxsYmFjazogdGFza0NhbGxiYWNrKTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy5maXJzdEFjY2VzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyB7IGNvZGU6IHVuZGVmaW5lZCwgbWVzc2FnZTogYGZpcnN0QWNjZXNzIGNhbGxiYWNrIGFscmVhZHkgcmVnaXN0ZXJlZGAgfTtcbiAgICB9XG5cbiAgICB0aGlzLmZpcnN0QWNjZXNzID0gY2FsbGJhY2s7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVnaXN0ZXIodmVyc2lvbjogbnVtYmVyLCBjYWxsYmFjazogdGFza0NhbGxiYWNrKTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy50YXNrc1t2ZXJzaW9uXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyB7IGNvZGU6IHVuZGVmaW5lZCwgbWVzc2FnZTogYGNhbGxiYWNrIHZlcnNpb24gJHsgdmVyc2lvbiB9IGFscmVhZHkgcmVnaXN0ZXJlZGAgfTtcbiAgICB9XG5cbiAgICB0aGlzLnRhc2tzW3ZlcnNpb25dID0gY2FsbGJhY2s7XG4gIH1cbn0iLCJpbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4vYWRhcHRlci9hZGFwdGVyXCI7XG5pbXBvcnQgeyBTZWxlY3QgfSBmcm9tIFwiLi9hZGFwdGVyL3NlbGVjdFwiO1xuaW1wb3J0IHsgSW5zZXJ0IH0gZnJvbSBcIi4vYWRhcHRlci9pbnNlcnRcIjtcbmltcG9ydCB7IERyb3AgfSBmcm9tIFwiLi9hZGFwdGVyL2Ryb3BcIjtcbmltcG9ydCB7IHBhcmFtc1R5cGUgfSBmcm9tIFwiLi9hZGFwdGVyL3F1ZXJ5XCI7XG5pbXBvcnQgeyBNb2RlbENvbnN0cnVjdG9yLCBNb2RlbEludGVyZmFjZSB9IGZyb20gXCIuL21vZGVsXCI7XG5pbXBvcnQgeyBGaWVsZCB9IGZyb20gXCIuL2ZpZWxkL2ZpZWxkXCI7XG5pbXBvcnQgeyBDcmVhdGUgfSBmcm9tIFwiLi9hZGFwdGVyL2NyZWF0ZVwiO1xuaW1wb3J0IHsgVVVJREZpZWxkIH0gZnJvbSBcIi4vZmllbGQvdXVpZFwiO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuXG50eXBlIFJlcXVpcmVkS2V5czxUPiA9IHsgW0sgaW4ga2V5b2YgVF0tPzoge30gZXh0ZW5kcyBQaWNrPFQsIEs+ID8gbmV2ZXIgOiBLIH1ba2V5b2YgVF07XG5cbmV4cG9ydCBlbnVtIGNvZGVTY2hlbWFFcnJvciB7XG4gICdQb3N0U2F2ZU5vdEZvdW5kJyA9ICdAc3RvcmFnby9vcm0vc2NoZW1hL1Bvc3RTYXZlTm90Rm91bmQnLFxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU2NoZW1hPEEgZXh0ZW5kcyBBZGFwdGVyLCBNIGV4dGVuZHMgTW9kZWxJbnRlcmZhY2U+IHtcblxuICBhYnN0cmFjdCByZWFkb25seSBNb2RlbD86IE1vZGVsQ29uc3RydWN0b3I8TT47XG4gIGFic3RyYWN0IHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICByZWFkb25seSBmaWVsZHM6IEZpZWxkW10gPSBbXTtcbiAgcmVhZG9ubHkgYWRhcHRlcjogQTtcblxuICBwcm90ZWN0ZWQgc3VwZXJGaWVsZHM6IEZpZWxkW10gPSBbXG4gICAgbmV3IFVVSURGaWVsZCgnaWQnLCB7IHByaW1hcnk6IHRydWUgfSksXG4gIF07XG5cbiAgY29uc3RydWN0b3IoYWRhcHRlcjogQSkge1xuXG4gICAgdGhpcy5hZGFwdGVyID0gYWRhcHRlcjtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzYXZlKG1vZGVsOiBNKTogUHJvbWlzZTxNPiB7XG5cbiAgICBpZiAobW9kZWwuX19kYXRhKSB7XG4gICAgICAvL3VwZGF0ZSBhcmVhXG4gICAgICBjb25zb2xlLmxvZygnc2F2ZSB1cGRhdGUnLCBtb2RlbC5fX2RhdGEpO1xuICAgICAgdGhyb3cgJ01ldGhvZCB1cGRhdGUgZG8gbm90IGltcGxlbWVudGVkJztcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdzYXZlIGluc2VydCcsIG1vZGVsLl9fZGF0YSk7XG4gICAgICBsZXQgaW5zZXJ0ID0gdGhpcy5pbnNlcnQoKTtcbiAgICAgIGluc2VydC5hZGQobW9kZWwpO1xuICAgICAgYXdhaXQgaW5zZXJ0LnNhdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5yZWZyZXNoTW9kZWwobW9kZWwpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHJlZnJlc2hNb2RlbChtb2RlbDogTSk6IFByb21pc2U8TT4ge1xuXG4gICAgbGV0IGlkID0gbW9kZWxbJ2lkJ107XG5cbiAgICBsZXQgaXRlbSA9IGF3YWl0IHRoaXMuZmluZCgnaWQgPSA/JywgaWQpO1xuICAgIGlmIChpdGVtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IHsgY29kZTogY29kZVNjaGVtYUVycm9yLlBvc3RTYXZlTm90Rm91bmQsIG1lc3NhZ2U6IGBGYWlsIHRvIGZpbmQgaWQ6ICR7aWR9YCB9O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBvcHVsYXRlRnJvbURCKGl0ZW0sIG1vZGVsKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRNb2RlbENsYXNzKCk6IE1vZGVsQ29uc3RydWN0b3I8TT4gfCB1bmRlZmluZWQge1xuXG4gICAgcmV0dXJuIHRoaXMuTW9kZWw7XG4gIH1cblxuICBwdWJsaWMgZ2V0TmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm5hbWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0RmllbGRzKCk6IEZpZWxkW10ge1xuXG4gICAgcmV0dXJuIFsuLi50aGlzLnN1cGVyRmllbGRzLCAuLi50aGlzLmZpZWxkc107XG4gIH1cblxuICBwdWJsaWMgZ2V0RmllbGQobmFtZTogc3RyaW5nKTogRmllbGQge1xuXG4gICAgZm9yIChsZXQgZmllbGQgb2YgdGhpcy5nZXRGaWVsZHMoKSkge1xuICAgICAgaWYgKG5hbWUgPT0gZmllbGQuZ2V0TmFtZSgpKSB7XG4gICAgICAgIHJldHVybiBmaWVsZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyB7IGNvZGU6IG51bGwsIG1lc3NhZ2U6IGBGaWVsZCB3aXRoIG5hbWU6ICR7bmFtZX0gbm90IGV4aXN0cyBpbiAke3RoaXMubmFtZX1gIH07XG4gIH1cblxuICBwdWJsaWMgZ2V0Q29sdW1ucygpOiBzdHJpbmdbXSB7XG5cbiAgICBsZXQgY29sdW1uczogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgZmllbGRzID0gdGhpcy5nZXRGaWVsZHMoKTtcbiAgICBmb3IgKGxldCBmaWVsZCBvZiB0aGlzLmdldEZpZWxkcygpKSB7XG4gICAgICBjb2x1bW5zLnB1c2goZmllbGQuZ2V0TmFtZSgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29sdW1ucztcbiAgfVxuXG4gIHB1YmxpYyBmaW5kKHdoZXJlOiBzdHJpbmcsIHBhcmFtOiBwYXJhbXNUeXBlKTogUHJvbWlzZTxNIHwgdW5kZWZpbmVkPiB7XG5cbiAgICBsZXQgc2VsZWN0ID0gdGhpcy5zZWxlY3QoKTtcbiAgICBzZWxlY3Qud2hlcmUod2hlcmUsIHBhcmFtKTtcbiAgICByZXR1cm4gc2VsZWN0Lm9uZSgpO1xuICB9O1xuXG4gIHB1YmxpYyBnZXRBZGFwdGVyKCk6IEEge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXI7XG4gIH1cblxuICBwdWJsaWMgc2VsZWN0KCk6IFNlbGVjdDxNPiB7XG4gICAgbGV0IHNlbGVjdCA9IHRoaXMuYWRhcHRlci5zZWxlY3Q8TT4odGhpcyk7XG4gICAgc2VsZWN0LmZyb20odGhpcy5nZXROYW1lKCksIHRoaXMuZ2V0Q29sdW1ucygpKTtcbiAgICByZXR1cm4gc2VsZWN0O1xuICB9XG5cbiAgcHVibGljIGluc2VydCgpOiBJbnNlcnQ8TT4ge1xuICAgIGxldCBpbnNlcnQgPSB0aGlzLmFkYXB0ZXIuaW5zZXJ0PE0+KHRoaXMpO1xuICAgIHJldHVybiBpbnNlcnQ7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlVGFibGUoKTogQ3JlYXRlPE0+IHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmNyZWF0ZTxNPih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBkcm9wKCk6IERyb3A8TT4ge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZHJvcDxNPih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBuZXcoZGF0YTogTSk6IE0ge1xuXG4gICAgaWYodGhpcy5Nb2RlbCl7XG4gICAgICBjb25zdCBtb2RlbCA9IG5ldyB0aGlzLk1vZGVsKGRhdGEpO1xuICAgICAgcmV0dXJuIG1vZGVsO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHBvcHVsYXRlRnJvbURCKHJvdzogeyBbaW5kZXg6IHN0cmluZ106IGFueTsgfSwgbW9kZWw/OiBNKTogUHJvbWlzZTxNPiB7XG5cbiAgICBpZiAobW9kZWwgPT0gdW5kZWZpbmVkKSB7XG4gICAgICBtb2RlbCA9IHRoaXMubmV3KHJvdy5pZCk7XG4gICAgfVxuXG4gICAgbGV0IGZpZWxkcyA9IHRoaXMuZ2V0RmllbGRzKCk7XG4gICAgbW9kZWwuX19kYXRhID0gcm93IGFzIE07XG4gICAgZm9yIChsZXQgZmllbGQgb2YgZmllbGRzKSB7XG4gICAgICBsZXQgbmFtZSA9IGZpZWxkLmdldE5hbWUoKTtcbiAgICAgIGlmIChuYW1lID09ICdpZCcpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBtb2RlbFtuYW1lIGFzIGtleW9mIE1dID0gZmllbGQuZnJvbURCKHRoaXMuYWRhcHRlciwgcm93W25hbWVdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbW9kZWw7XG4gIH1cblxuICAvKlxuICBwdWJsaWMgYXN5bmMgcG9wdWxhdGVGcm9tREI8VCBleHRlbmRzIE1vZGVsPihyb3c6IHsgW2luZGV4OiBzdHJpbmddOiBhbnk7IH0sIG1vZGVsOiBUKTogUHJvbWlzZTxUPiB7XG5cbiAgICBsZXQgcHJvbWlzZXM6IFByb21pc2U8YW55PltdID0gW107XG4gICAgbGV0IGZpZWxkcyA9IHRoaXMuZ2V0UmVhbEZpZWxkcygpO1xuICAgIGxldCBrZXlzOiBzdHJpbmdbXSA9IFtdO1xuICBcbiAgICBmb3IgKGxldCBmaWVsZCBvZiBmaWVsZHMpIHtcbiAgICAgIGxldCBuYW1lID0gZmllbGQuZ2V0TmFtZSgpO1xuICAgICAgbGV0IHByb21pc2VQb3B1bGF0ZSA9IGZpZWxkLnBvcHVsYXRlKG1vZGVsLCByb3cpO1xuICAgICAgbW9kZWwuX19kYXRhW25hbWVdID0gcHJvbWlzZVBvcHVsYXRlO1xuICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlUG9wdWxhdGUpO1xuICAgICAga2V5cy5wdXNoKG5hbWUpO1xuICAgIH1cblxuICAgIGxldCBkYXRhID0gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIGZvcihsZXQgayBpbiBrZXlzKXtcbiAgICAgIGxldCBuYW1lID0ga2V5c1trXTtcbiAgICAgIG1vZGVsW25hbWUgYXMga2V5b2YgVF0gPSBkYXRhW2tdO1xuICAgIH1cblxuICAgIHJldHVybiBtb2RlbDtcbiAgfVxuXG4gIHB1YmxpYyBkZWZpbmVQcm9wZXJ0aWVzKG1vZGVsOiBNb2RlbCkgOiB2b2lkIHtcblxuICAgIGZvcihsZXQgZmllbGQgb2YgdGhpcy5nZXRGaWVsZHMoKSl7XG4gICAgICBmaWVsZC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBtb2RlbCk7XG4gICAgfVxuICB9IFxuICAqL1xufSIsImV4cG9ydCB7IGRlZmF1bHQgYXMgdjEgfSBmcm9tICcuL3YxLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdjMgfSBmcm9tICcuL3YzLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdjQgfSBmcm9tICcuL3Y0LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdjUgfSBmcm9tICcuL3Y1LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTklMIH0gZnJvbSAnLi9uaWwuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2ZXJzaW9uIH0gZnJvbSAnLi92ZXJzaW9uLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdmFsaWRhdGUgfSBmcm9tICcuL3ZhbGlkYXRlLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc3RyaW5naWZ5IH0gZnJvbSAnLi9zdHJpbmdpZnkuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBwYXJzZSB9IGZyb20gJy4vcGFyc2UuanMnOyIsImltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcblxuZnVuY3Rpb24gbWQ1KGJ5dGVzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGJ5dGVzKSkge1xuICAgIGJ5dGVzID0gQnVmZmVyLmZyb20oYnl0ZXMpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBieXRlcyA9PT0gJ3N0cmluZycpIHtcbiAgICBieXRlcyA9IEJ1ZmZlci5mcm9tKGJ5dGVzLCAndXRmOCcpO1xuICB9XG5cbiAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdtZDUnKS51cGRhdGUoYnl0ZXMpLmRpZ2VzdCgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtZDU7IiwiZXhwb3J0IGRlZmF1bHQgJzAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCc7IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuXG5mdW5jdGlvbiBwYXJzZSh1dWlkKSB7XG4gIGlmICghdmFsaWRhdGUodXVpZCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ0ludmFsaWQgVVVJRCcpO1xuICB9XG5cbiAgbGV0IHY7XG4gIGNvbnN0IGFyciA9IG5ldyBVaW50OEFycmF5KDE2KTsgLy8gUGFyc2UgIyMjIyMjIyMtLi4uLi0uLi4uLS4uLi4tLi4uLi4uLi4uLi4uXG5cbiAgYXJyWzBdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDAsIDgpLCAxNikpID4+PiAyNDtcbiAgYXJyWzFdID0gdiA+Pj4gMTYgJiAweGZmO1xuICBhcnJbMl0gPSB2ID4+PiA4ICYgMHhmZjtcbiAgYXJyWzNdID0gdiAmIDB4ZmY7IC8vIFBhcnNlIC4uLi4uLi4uLSMjIyMtLi4uLi0uLi4uLS4uLi4uLi4uLi4uLlxuXG4gIGFycls0XSA9ICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSg5LCAxMyksIDE2KSkgPj4+IDg7XG4gIGFycls1XSA9IHYgJiAweGZmOyAvLyBQYXJzZSAuLi4uLi4uLi0uLi4uLSMjIyMtLi4uLi0uLi4uLi4uLi4uLi5cblxuICBhcnJbNl0gPSAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoMTQsIDE4KSwgMTYpKSA+Pj4gODtcbiAgYXJyWzddID0gdiAmIDB4ZmY7IC8vIFBhcnNlIC4uLi4uLi4uLS4uLi4tLi4uLi0jIyMjLS4uLi4uLi4uLi4uLlxuXG4gIGFycls4XSA9ICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSgxOSwgMjMpLCAxNikpID4+PiA4O1xuICBhcnJbOV0gPSB2ICYgMHhmZjsgLy8gUGFyc2UgLi4uLi4uLi4tLi4uLi0uLi4uLS4uLi4tIyMjIyMjIyMjIyMjXG4gIC8vIChVc2UgXCIvXCIgdG8gYXZvaWQgMzItYml0IHRydW5jYXRpb24gd2hlbiBiaXQtc2hpZnRpbmcgaGlnaC1vcmRlciBieXRlcylcblxuICBhcnJbMTBdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDI0LCAzNiksIDE2KSkgLyAweDEwMDAwMDAwMDAwICYgMHhmZjtcbiAgYXJyWzExXSA9IHYgLyAweDEwMDAwMDAwMCAmIDB4ZmY7XG4gIGFyclsxMl0gPSB2ID4+PiAyNCAmIDB4ZmY7XG4gIGFyclsxM10gPSB2ID4+PiAxNiAmIDB4ZmY7XG4gIGFyclsxNF0gPSB2ID4+PiA4ICYgMHhmZjtcbiAgYXJyWzE1XSA9IHYgJiAweGZmO1xuICByZXR1cm4gYXJyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwYXJzZTsiLCJleHBvcnQgZGVmYXVsdCAvXig/OlswLTlhLWZdezh9LVswLTlhLWZdezR9LVsxLTVdWzAtOWEtZl17M30tWzg5YWJdWzAtOWEtZl17M30tWzAtOWEtZl17MTJ9fDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCkkL2k7IiwiaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nO1xuY29uc3Qgcm5kczhQb29sID0gbmV3IFVpbnQ4QXJyYXkoMjU2KTsgLy8gIyBvZiByYW5kb20gdmFsdWVzIHRvIHByZS1hbGxvY2F0ZVxuXG5sZXQgcG9vbFB0ciA9IHJuZHM4UG9vbC5sZW5ndGg7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBybmcoKSB7XG4gIGlmIChwb29sUHRyID4gcm5kczhQb29sLmxlbmd0aCAtIDE2KSB7XG4gICAgY3J5cHRvLnJhbmRvbUZpbGxTeW5jKHJuZHM4UG9vbCk7XG4gICAgcG9vbFB0ciA9IDA7XG4gIH1cblxuICByZXR1cm4gcm5kczhQb29sLnNsaWNlKHBvb2xQdHIsIHBvb2xQdHIgKz0gMTYpO1xufSIsImltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcblxuZnVuY3Rpb24gc2hhMShieXRlcykge1xuICBpZiAoQXJyYXkuaXNBcnJheShieXRlcykpIHtcbiAgICBieXRlcyA9IEJ1ZmZlci5mcm9tKGJ5dGVzKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgYnl0ZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgYnl0ZXMgPSBCdWZmZXIuZnJvbShieXRlcywgJ3V0ZjgnKTtcbiAgfVxuXG4gIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShieXRlcykuZGlnZXN0KCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNoYTE7IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDE2IGJ5dGUgdmFsdWVzIHRvIFVVSUQgc3RyaW5nIGZvcm1hdCBvZiB0aGUgZm9ybTpcbiAqIFhYWFhYWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG5cbmNvbnN0IGJ5dGVUb0hleCA9IFtdO1xuXG5mb3IgKGxldCBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleC5wdXNoKChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSkpO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkoYXJyLCBvZmZzZXQgPSAwKSB7XG4gIC8vIE5vdGU6IEJlIGNhcmVmdWwgZWRpdGluZyB0aGlzIGNvZGUhICBJdCdzIGJlZW4gdHVuZWQgZm9yIHBlcmZvcm1hbmNlXG4gIC8vIGFuZCB3b3JrcyBpbiB3YXlzIHlvdSBtYXkgbm90IGV4cGVjdC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZC9wdWxsLzQzNFxuICBjb25zdCB1dWlkID0gKGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDJdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgM11dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDVdXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA3XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDhdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMV1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxM11dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxNF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxNV1dKS50b0xvd2VyQ2FzZSgpOyAvLyBDb25zaXN0ZW5jeSBjaGVjayBmb3IgdmFsaWQgVVVJRC4gIElmIHRoaXMgdGhyb3dzLCBpdCdzIGxpa2VseSBkdWUgdG8gb25lXG4gIC8vIG9mIHRoZSBmb2xsb3dpbmc6XG4gIC8vIC0gT25lIG9yIG1vcmUgaW5wdXQgYXJyYXkgdmFsdWVzIGRvbid0IG1hcCB0byBhIGhleCBvY3RldCAobGVhZGluZyB0b1xuICAvLyBcInVuZGVmaW5lZFwiIGluIHRoZSB1dWlkKVxuICAvLyAtIEludmFsaWQgaW5wdXQgdmFsdWVzIGZvciB0aGUgUkZDIGB2ZXJzaW9uYCBvciBgdmFyaWFudGAgZmllbGRzXG5cbiAgaWYgKCF2YWxpZGF0ZSh1dWlkKSkge1xuICAgIHRocm93IFR5cGVFcnJvcignU3RyaW5naWZpZWQgVVVJRCBpcyBpbnZhbGlkJyk7XG4gIH1cblxuICByZXR1cm4gdXVpZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RyaW5naWZ5OyIsImltcG9ydCBybmcgZnJvbSAnLi9ybmcuanMnO1xuaW1wb3J0IHN0cmluZ2lmeSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7IC8vICoqYHYxKClgIC0gR2VuZXJhdGUgdGltZS1iYXNlZCBVVUlEKipcbi8vXG4vLyBJbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vTGlvc0svVVVJRC5qc1xuLy8gYW5kIGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS91dWlkLmh0bWxcblxubGV0IF9ub2RlSWQ7XG5cbmxldCBfY2xvY2tzZXE7IC8vIFByZXZpb3VzIHV1aWQgY3JlYXRpb24gdGltZVxuXG5cbmxldCBfbGFzdE1TZWNzID0gMDtcbmxldCBfbGFzdE5TZWNzID0gMDsgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZCBmb3IgQVBJIGRldGFpbHNcblxuZnVuY3Rpb24gdjEob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgbGV0IGkgPSBidWYgJiYgb2Zmc2V0IHx8IDA7XG4gIGNvbnN0IGIgPSBidWYgfHwgbmV3IEFycmF5KDE2KTtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxldCBub2RlID0gb3B0aW9ucy5ub2RlIHx8IF9ub2RlSWQ7XG4gIGxldCBjbG9ja3NlcSA9IG9wdGlvbnMuY2xvY2tzZXEgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY2xvY2tzZXEgOiBfY2xvY2tzZXE7IC8vIG5vZGUgYW5kIGNsb2Nrc2VxIG5lZWQgdG8gYmUgaW5pdGlhbGl6ZWQgdG8gcmFuZG9tIHZhbHVlcyBpZiB0aGV5J3JlIG5vdFxuICAvLyBzcGVjaWZpZWQuICBXZSBkbyB0aGlzIGxhemlseSB0byBtaW5pbWl6ZSBpc3N1ZXMgcmVsYXRlZCB0byBpbnN1ZmZpY2llbnRcbiAgLy8gc3lzdGVtIGVudHJvcHkuICBTZWUgIzE4OVxuXG4gIGlmIChub2RlID09IG51bGwgfHwgY2xvY2tzZXEgPT0gbnVsbCkge1xuICAgIGNvbnN0IHNlZWRCeXRlcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBybmcpKCk7XG5cbiAgICBpZiAobm9kZSA9PSBudWxsKSB7XG4gICAgICAvLyBQZXIgNC41LCBjcmVhdGUgYW5kIDQ4LWJpdCBub2RlIGlkLCAoNDcgcmFuZG9tIGJpdHMgKyBtdWx0aWNhc3QgYml0ID0gMSlcbiAgICAgIG5vZGUgPSBfbm9kZUlkID0gW3NlZWRCeXRlc1swXSB8IDB4MDEsIHNlZWRCeXRlc1sxXSwgc2VlZEJ5dGVzWzJdLCBzZWVkQnl0ZXNbM10sIHNlZWRCeXRlc1s0XSwgc2VlZEJ5dGVzWzVdXTtcbiAgICB9XG5cbiAgICBpZiAoY2xvY2tzZXEgPT0gbnVsbCkge1xuICAgICAgLy8gUGVyIDQuMi4yLCByYW5kb21pemUgKDE0IGJpdCkgY2xvY2tzZXFcbiAgICAgIGNsb2Nrc2VxID0gX2Nsb2Nrc2VxID0gKHNlZWRCeXRlc1s2XSA8PCA4IHwgc2VlZEJ5dGVzWzddKSAmIDB4M2ZmZjtcbiAgICB9XG4gIH0gLy8gVVVJRCB0aW1lc3RhbXBzIGFyZSAxMDAgbmFuby1zZWNvbmQgdW5pdHMgc2luY2UgdGhlIEdyZWdvcmlhbiBlcG9jaCxcbiAgLy8gKDE1ODItMTAtMTUgMDA6MDApLiAgSlNOdW1iZXJzIGFyZW4ndCBwcmVjaXNlIGVub3VnaCBmb3IgdGhpcywgc29cbiAgLy8gdGltZSBpcyBoYW5kbGVkIGludGVybmFsbHkgYXMgJ21zZWNzJyAoaW50ZWdlciBtaWxsaXNlY29uZHMpIGFuZCAnbnNlY3MnXG4gIC8vICgxMDAtbmFub3NlY29uZHMgb2Zmc2V0IGZyb20gbXNlY3MpIHNpbmNlIHVuaXggZXBvY2gsIDE5NzAtMDEtMDEgMDA6MDAuXG5cblxuICBsZXQgbXNlY3MgPSBvcHRpb25zLm1zZWNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm1zZWNzIDogRGF0ZS5ub3coKTsgLy8gUGVyIDQuMi4xLjIsIHVzZSBjb3VudCBvZiB1dWlkJ3MgZ2VuZXJhdGVkIGR1cmluZyB0aGUgY3VycmVudCBjbG9ja1xuICAvLyBjeWNsZSB0byBzaW11bGF0ZSBoaWdoZXIgcmVzb2x1dGlvbiBjbG9ja1xuXG4gIGxldCBuc2VjcyA9IG9wdGlvbnMubnNlY3MgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubnNlY3MgOiBfbGFzdE5TZWNzICsgMTsgLy8gVGltZSBzaW5jZSBsYXN0IHV1aWQgY3JlYXRpb24gKGluIG1zZWNzKVxuXG4gIGNvbnN0IGR0ID0gbXNlY3MgLSBfbGFzdE1TZWNzICsgKG5zZWNzIC0gX2xhc3ROU2VjcykgLyAxMDAwMDsgLy8gUGVyIDQuMi4xLjIsIEJ1bXAgY2xvY2tzZXEgb24gY2xvY2sgcmVncmVzc2lvblxuXG4gIGlmIChkdCA8IDAgJiYgb3B0aW9ucy5jbG9ja3NlcSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY2xvY2tzZXEgPSBjbG9ja3NlcSArIDEgJiAweDNmZmY7XG4gIH0gLy8gUmVzZXQgbnNlY3MgaWYgY2xvY2sgcmVncmVzc2VzIChuZXcgY2xvY2tzZXEpIG9yIHdlJ3ZlIG1vdmVkIG9udG8gYSBuZXdcbiAgLy8gdGltZSBpbnRlcnZhbFxuXG5cbiAgaWYgKChkdCA8IDAgfHwgbXNlY3MgPiBfbGFzdE1TZWNzKSAmJiBvcHRpb25zLm5zZWNzID09PSB1bmRlZmluZWQpIHtcbiAgICBuc2VjcyA9IDA7XG4gIH0gLy8gUGVyIDQuMi4xLjIgVGhyb3cgZXJyb3IgaWYgdG9vIG1hbnkgdXVpZHMgYXJlIHJlcXVlc3RlZFxuXG5cbiAgaWYgKG5zZWNzID49IDEwMDAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwidXVpZC52MSgpOiBDYW4ndCBjcmVhdGUgbW9yZSB0aGFuIDEwTSB1dWlkcy9zZWNcIik7XG4gIH1cblxuICBfbGFzdE1TZWNzID0gbXNlY3M7XG4gIF9sYXN0TlNlY3MgPSBuc2VjcztcbiAgX2Nsb2Nrc2VxID0gY2xvY2tzZXE7IC8vIFBlciA0LjEuNCAtIENvbnZlcnQgZnJvbSB1bml4IGVwb2NoIHRvIEdyZWdvcmlhbiBlcG9jaFxuXG4gIG1zZWNzICs9IDEyMjE5MjkyODAwMDAwOyAvLyBgdGltZV9sb3dgXG5cbiAgY29uc3QgdGwgPSAoKG1zZWNzICYgMHhmZmZmZmZmKSAqIDEwMDAwICsgbnNlY3MpICUgMHgxMDAwMDAwMDA7XG4gIGJbaSsrXSA9IHRsID4+PiAyNCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsID4+PiAxNiAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsID4+PiA4ICYgMHhmZjtcbiAgYltpKytdID0gdGwgJiAweGZmOyAvLyBgdGltZV9taWRgXG5cbiAgY29uc3QgdG1oID0gbXNlY3MgLyAweDEwMDAwMDAwMCAqIDEwMDAwICYgMHhmZmZmZmZmO1xuICBiW2krK10gPSB0bWggPj4+IDggJiAweGZmO1xuICBiW2krK10gPSB0bWggJiAweGZmOyAvLyBgdGltZV9oaWdoX2FuZF92ZXJzaW9uYFxuXG4gIGJbaSsrXSA9IHRtaCA+Pj4gMjQgJiAweGYgfCAweDEwOyAvLyBpbmNsdWRlIHZlcnNpb25cblxuICBiW2krK10gPSB0bWggPj4+IDE2ICYgMHhmZjsgLy8gYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgIChQZXIgNC4yLjIgLSBpbmNsdWRlIHZhcmlhbnQpXG5cbiAgYltpKytdID0gY2xvY2tzZXEgPj4+IDggfCAweDgwOyAvLyBgY2xvY2tfc2VxX2xvd2BcblxuICBiW2krK10gPSBjbG9ja3NlcSAmIDB4ZmY7IC8vIGBub2RlYFxuXG4gIGZvciAobGV0IG4gPSAwOyBuIDwgNjsgKytuKSB7XG4gICAgYltpICsgbl0gPSBub2RlW25dO1xuICB9XG5cbiAgcmV0dXJuIGJ1ZiB8fCBzdHJpbmdpZnkoYik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHYxOyIsImltcG9ydCB2MzUgZnJvbSAnLi92MzUuanMnO1xuaW1wb3J0IG1kNSBmcm9tICcuL21kNS5qcyc7XG5jb25zdCB2MyA9IHYzNSgndjMnLCAweDMwLCBtZDUpO1xuZXhwb3J0IGRlZmF1bHQgdjM7IiwiaW1wb3J0IHN0cmluZ2lmeSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7XG5pbXBvcnQgcGFyc2UgZnJvbSAnLi9wYXJzZS5qcyc7XG5cbmZ1bmN0aW9uIHN0cmluZ1RvQnl0ZXMoc3RyKSB7XG4gIHN0ciA9IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChzdHIpKTsgLy8gVVRGOCBlc2NhcGVcblxuICBjb25zdCBieXRlcyA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgYnl0ZXMucHVzaChzdHIuY2hhckNvZGVBdChpKSk7XG4gIH1cblxuICByZXR1cm4gYnl0ZXM7XG59XG5cbmV4cG9ydCBjb25zdCBETlMgPSAnNmJhN2I4MTAtOWRhZC0xMWQxLTgwYjQtMDBjMDRmZDQzMGM4JztcbmV4cG9ydCBjb25zdCBVUkwgPSAnNmJhN2I4MTEtOWRhZC0xMWQxLTgwYjQtMDBjMDRmZDQzMGM4JztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChuYW1lLCB2ZXJzaW9uLCBoYXNoZnVuYykge1xuICBmdW5jdGlvbiBnZW5lcmF0ZVVVSUQodmFsdWUsIG5hbWVzcGFjZSwgYnVmLCBvZmZzZXQpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgdmFsdWUgPSBzdHJpbmdUb0J5dGVzKHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG5hbWVzcGFjZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWVzcGFjZSA9IHBhcnNlKG5hbWVzcGFjZSk7XG4gICAgfVxuXG4gICAgaWYgKG5hbWVzcGFjZS5sZW5ndGggIT09IDE2KSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ05hbWVzcGFjZSBtdXN0IGJlIGFycmF5LWxpa2UgKDE2IGl0ZXJhYmxlIGludGVnZXIgdmFsdWVzLCAwLTI1NSknKTtcbiAgICB9IC8vIENvbXB1dGUgaGFzaCBvZiBuYW1lc3BhY2UgYW5kIHZhbHVlLCBQZXIgNC4zXG4gICAgLy8gRnV0dXJlOiBVc2Ugc3ByZWFkIHN5bnRheCB3aGVuIHN1cHBvcnRlZCBvbiBhbGwgcGxhdGZvcm1zLCBlLmcuIGBieXRlcyA9XG4gICAgLy8gaGFzaGZ1bmMoWy4uLm5hbWVzcGFjZSwgLi4uIHZhbHVlXSlgXG5cblxuICAgIGxldCBieXRlcyA9IG5ldyBVaW50OEFycmF5KDE2ICsgdmFsdWUubGVuZ3RoKTtcbiAgICBieXRlcy5zZXQobmFtZXNwYWNlKTtcbiAgICBieXRlcy5zZXQodmFsdWUsIG5hbWVzcGFjZS5sZW5ndGgpO1xuICAgIGJ5dGVzID0gaGFzaGZ1bmMoYnl0ZXMpO1xuICAgIGJ5dGVzWzZdID0gYnl0ZXNbNl0gJiAweDBmIHwgdmVyc2lvbjtcbiAgICBieXRlc1s4XSA9IGJ5dGVzWzhdICYgMHgzZiB8IDB4ODA7XG5cbiAgICBpZiAoYnVmKSB7XG4gICAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgKytpKSB7XG4gICAgICAgIGJ1ZltvZmZzZXQgKyBpXSA9IGJ5dGVzW2ldO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYnVmO1xuICAgIH1cblxuICAgIHJldHVybiBzdHJpbmdpZnkoYnl0ZXMpO1xuICB9IC8vIEZ1bmN0aW9uI25hbWUgaXMgbm90IHNldHRhYmxlIG9uIHNvbWUgcGxhdGZvcm1zICgjMjcwKVxuXG5cbiAgdHJ5IHtcbiAgICBnZW5lcmF0ZVVVSUQubmFtZSA9IG5hbWU7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lbXB0eVxuICB9IGNhdGNoIChlcnIpIHt9IC8vIEZvciBDb21tb25KUyBkZWZhdWx0IGV4cG9ydCBzdXBwb3J0XG5cblxuICBnZW5lcmF0ZVVVSUQuRE5TID0gRE5TO1xuICBnZW5lcmF0ZVVVSUQuVVJMID0gVVJMO1xuICByZXR1cm4gZ2VuZXJhdGVVVUlEO1xufSIsImltcG9ydCBybmcgZnJvbSAnLi9ybmcuanMnO1xuaW1wb3J0IHN0cmluZ2lmeSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7XG5cbmZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBjb25zdCBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTsgLy8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuXG4gIHJuZHNbNl0gPSBybmRzWzZdICYgMHgwZiB8IDB4NDA7XG4gIHJuZHNbOF0gPSBybmRzWzhdICYgMHgzZiB8IDB4ODA7IC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuXG4gIGlmIChidWYpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgICAgYnVmW29mZnNldCArIGldID0gcm5kc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgcmV0dXJuIHN0cmluZ2lmeShybmRzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdjQ7IiwiaW1wb3J0IHYzNSBmcm9tICcuL3YzNS5qcyc7XG5pbXBvcnQgc2hhMSBmcm9tICcuL3NoYTEuanMnO1xuY29uc3QgdjUgPSB2MzUoJ3Y1JywgMHg1MCwgc2hhMSk7XG5leHBvcnQgZGVmYXVsdCB2NTsiLCJpbXBvcnQgUkVHRVggZnJvbSAnLi9yZWdleC5qcyc7XG5cbmZ1bmN0aW9uIHZhbGlkYXRlKHV1aWQpIHtcbiAgcmV0dXJuIHR5cGVvZiB1dWlkID09PSAnc3RyaW5nJyAmJiBSRUdFWC50ZXN0KHV1aWQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2YWxpZGF0ZTsiLCJpbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG5cbmZ1bmN0aW9uIHZlcnNpb24odXVpZCkge1xuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdJbnZhbGlkIFVVSUQnKTtcbiAgfVxuXG4gIHJldHVybiBwYXJzZUludCh1dWlkLnN1YnN0cigxNCwgMSksIDE2KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdmVyc2lvbjsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjcnlwdG9cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9