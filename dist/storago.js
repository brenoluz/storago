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
exports.Migration = exports.codeFieldError = exports.FieldKind = exports.Field = exports.fields = exports.Schema = exports.Model = exports.debug = void 0;
var debug_1 = __webpack_require__(/*! ./debug */ "./src/debug.ts");
Object.defineProperty(exports, "debug", ({ enumerable: true, get: function () { return debug_1.debug; } }));
var model_1 = __webpack_require__(/*! ./model */ "./src/model.ts");
Object.defineProperty(exports, "Model", ({ enumerable: true, get: function () { return model_1.Model; } }));
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

/***/ "./src/model.ts":
/*!**********************!*\
  !*** ./src/model.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Model = void 0;
class Model {
    constructor(id) {
        this.id = id;
    }
}
exports.Model = Model;


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
    new(...args) {
        const model = new this.Model(...args);
        return model;
    }
    populateFromDB(row, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (model == undefined) {
                let params = {};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LGlFQUFlLEVBQUU7Ozs7Ozs7Ozs7Ozs7OztBQ0hjOztBQUUvQjtBQUNBLHFDQUFxQyxzREFBVTtBQUMvQzs7QUFFQSxpRUFBZSxRQUFROzs7Ozs7Ozs7Ozs7Ozs7QUNOYzs7QUFFckM7QUFDQSxPQUFPLHdEQUFRO0FBQ2Y7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlFQUFlLE9BQU87Ozs7Ozs7Ozs7QUNWdEI7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2FkYXB0ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2RlYnVnLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC9ib29sZWFuLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC9kYXRldGltZS50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvZmllbGQudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL2luZGV4LnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC9pbnRlZ2VyLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC9qc29uLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC9tYW55LnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC90ZXh0LnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC91dWlkLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvbWlncmF0aW9uLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9tb2RlbC50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvc2NoZW1hLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS9tZDUuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS9uaWwuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS9wYXJzZS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3JlZ2V4LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvcm5nLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvc2hhMS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3N0cmluZ2lmeS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3YxLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvdjMuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS92MzUuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS92NC5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3Y1LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvdmFsaWRhdGUuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS92ZXJzaW9uLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiY3J5cHRvXCIiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BzdG9yYWdvL29ybS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0BzdG9yYWdvL29ybS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0BzdG9yYWdvL29ybS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0BzdG9yYWdvL29ybS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgeyBTZWxlY3QgfSBmcm9tIFwiLi9zZWxlY3RcIjtcbmV4cG9ydCB7IENyZWF0ZSB9IGZyb20gXCIuL2NyZWF0ZVwiO1xuZXhwb3J0IHsgSW5zZXJ0IH0gZnJvbSBcIi4vaW5zZXJ0XCI7XG5leHBvcnQgeyBEcm9wIH0gZnJvbSBcIi4vZHJvcFwiO1xuZXhwb3J0IHsgcGFyYW1zVHlwZSB9IGZyb20gXCIuL3F1ZXJ5XCI7XG5leHBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4vYWRhcHRlclwiO1xuIiwiaW50ZXJmYWNlIERlYnVne1xuICBzZWxlY3Q6IGJvb2xlYW4sXG4gIGluc2VydDogYm9vbGVhbixcbiAgY3JlYXRlOiBib29sZWFuLFxuICBkcm9wOiBib29sZWFuLFxuICBxdWVyeTogYm9vbGVhbixcbn1cblxuZXhwb3J0IGxldCBkZWJ1ZzogRGVidWcgPSB7XG4gIHNlbGVjdDogZmFsc2UsXG4gIGluc2VydDogZmFsc2UsXG4gIGNyZWF0ZTogZmFsc2UsXG4gIGRyb3A6IGZhbHNlLFxuICBxdWVyeTogZmFsc2UsXG59IiwiaW1wb3J0IHsgTW9kZWxJbnRlcmZhY2UgfSBmcm9tIFwiLi5cIjtcbmltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi4vYWRhcHRlci9hZGFwdGVyXCI7XG5pbXBvcnQgeyBDb25maWcsIGRlZmF1bHRDb25maWcsIEZpZWxkLCBGaWVsZEtpbmQgfSBmcm9tIFwiLi9maWVsZFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJvb2xlYW5Db25maWcgZXh0ZW5kcyBDb25maWcgeyB9XG5cbmV4cG9ydCBjbGFzcyBCb29sZWFuRmllbGQgZXh0ZW5kcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgY29uZmlnOiBCb29sZWFuQ29uZmlnO1xuICByZWFkb25seSBraW5kOiBGaWVsZEtpbmQgPSBGaWVsZEtpbmQuQk9PTEVBTjtcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGNvbmZpZzogUGFydGlhbDxCb29sZWFuQ29uZmlnPiA9IGRlZmF1bHRDb25maWcpIHtcblxuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLi4uZGVmYXVsdENvbmZpZyxcbiAgICAgIC4uLmNvbmZpZyxcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZnJvbURCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBLCB2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG5cbiAgICByZXR1cm4gYWRhcHRlci5maWVsZFRyYW5zZm9ybUZyb21EYih0aGlzLCB2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgdG9EQjxBIGV4dGVuZHMgQWRhcHRlciwgTSBleHRlbmRzIE1vZGVsSW50ZXJmYWNlPihhZGFwdGVyOiBBLCBtb2RlbDogTSk6IGFueSB7XG5cbiAgICBsZXQgdmFsdWUgPSBzdXBlci50b0RCPEEsIE0+KGFkYXB0ZXIsIG1vZGVsKTtcbiAgICByZXR1cm4gYWRhcHRlci5maWVsZFRyYW5zZm9ybVRvREI8Qm9vbGVhbkZpZWxkLCBNPih0aGlzLCB2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgY2FzdERCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBKTogc3RyaW5nIHtcblxuICAgIHJldHVybiBhZGFwdGVyLmZpZWxkQ2FzdDxCb29sZWFuRmllbGQ+KHRoaXMpO1xuICB9XG59IiwiaW1wb3J0IHsgTW9kZWxJbnRlcmZhY2UgfSBmcm9tIFwiLi5cIjtcbmltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi4vYWRhcHRlci9hZGFwdGVyXCI7XG5pbXBvcnQgeyBDb25maWcsIGRlZmF1bHRDb25maWcsIEZpZWxkLCBGaWVsZEtpbmQgfSBmcm9tIFwiLi9maWVsZFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIERhdGVUaW1lQ29uZmlnIGV4dGVuZHMgQ29uZmlnIHsgfVxuXG5leHBvcnQgY2xhc3MgRGF0ZVRpbWVGaWVsZCBleHRlbmRzIEZpZWxkIHtcblxuICByZWFkb25seSBjb25maWc6IERhdGVUaW1lQ29uZmlnO1xuICByZWFkb25seSBraW5kOiBGaWVsZEtpbmQgPSBGaWVsZEtpbmQuREFURVRJTUU7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjb25maWc6IFBhcnRpYWw8RGF0ZVRpbWVDb25maWc+ID0gZGVmYXVsdENvbmZpZykge1xuXG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmcm9tREI8QSBleHRlbmRzIEFkYXB0ZXI+KGFkYXB0ZXI6IEEsIHZhbHVlOiBhbnkpIDogRGF0ZXx1bmRlZmluZWQge1xuXG4gICAgaWYodmFsdWUgPT09IG51bGwpe1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IERhdGUodmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHRvREI8QSBleHRlbmRzIEFkYXB0ZXIsIE0gZXh0ZW5kcyBNb2RlbEludGVyZmFjZT4oYWRhcHRlcjogQSwgbW9kZWw6IE0pIDogbnVtYmVyIHtcbiAgICBcbiAgICBsZXQgbmFtZSA9IHRoaXMuZ2V0TmFtZSgpO1xuICAgIGxldCB2YWx1ZSA9IG1vZGVsW25hbWUgYXMga2V5b2YgTV07XG5cbiAgICBpZih2YWx1ZSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRWYWx1ZSgpO1xuICAgIH1cblxuICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSl7XG4gICAgICByZXR1cm4gdmFsdWUuZ2V0VGltZSgpO1xuICAgIH1cblxuICAgIHRocm93IHtjb2RlOiBudWxsLCBtZXNzYWdlOiBgdmFsdWUgb2YgJHtuYW1lfSB0byBEQiBpcyBub3QgYSBEYXRlYH07XG4gIH1cblxuICBwdWJsaWMgY2FzdERCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBKTogc3RyaW5nIHtcbiAgICBcbiAgICByZXR1cm4gYWRhcHRlci5maWVsZENhc3Q8RGF0ZVRpbWVGaWVsZD4odGhpcyk7XG4gIH1cbn0iLCJpbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4uL2FkYXB0ZXIvYWRhcHRlclwiO1xuaW1wb3J0IHsgTW9kZWxJbnRlcmZhY2UgfSBmcm9tIFwiLi4vbW9kZWxcIjtcblxuZXhwb3J0IGVudW0gY29kZUZpZWxkRXJyb3Ige1xuICAnRW5naW5lTm90SW1wbGVtZW50ZWQnID0gJ0BzdG9yYWdvL29ybS9maWVsZC9lbmdpbmVOb3RJbXBsZW1lbnRlZCcsXG4gICdEZWZhdWx0VmFsdWVJc05vdFZhbGlkJyA9ICdAc3RvcmFnby9vcm0vZmllbGQvZGVmYXVsdFBhcmFtTm90VmFsaWQnLFxuICAnSW5jb3JyZWN0VmFsdWVUb0RiJyA9ICdAc3RvcmFnby9vcm0vZmllbGQvSW5jb3JyZWN0VmFsdWVUb1N0b3JhZ2VPbkRCJyxcbiAgJ1JlZmVyZXJOb3RGb3VuZCcgPSAnQHN0b3JhZ28vb3JtL2ZpZWxkL01hbnlSZWxhdGlvbnNoaXAnLFxuICAnRmllbGRLaW5kTm90U3VwcG9ydGVkJyA9ICdAc3RvcmFnby9vcm0vZmllbGQvRmllbGRLaW5kTm90U3VwcG9ydGVkJyxcbn1cblxuZXhwb3J0IGVudW0gRmllbGRLaW5ke1xuICBURVhULFxuICBWQVJDSEFSLFxuICBDSEFSQUNURVIsXG5cbiAgSU5URUdFUixcbiAgVElOWUlOVCxcbiAgU01BTExJTlQsXG4gIE1FRElVTUlOVCxcbiAgQklHSU5ULFxuXG4gIFJFQUwsXG4gIERPVUJMRSxcbiAgRkxPQVQsXG5cbiAgTlVNRVJJQyxcbiAgREVDSU1BTCxcbiAgREFURSxcbiAgREFURVRJTUUsXG4gIEJPT0xFQU4sXG5cbiAgVVVJRCxcbiAgSlNPTixcblxuICBCTE9CLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZyB7XG4gIGRlZmF1bHQ/OiBhbnk7XG4gIHJlcXVpcmVkOiBib29sZWFuO1xuICBsaW5rPzogc3RyaW5nO1xuICBpbmRleDogYm9vbGVhbjtcbiAgcHJpbWFyeTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRDb25maWc6IENvbmZpZyA9IHtcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBpbmRleDogZmFsc2UsXG4gIHByaW1hcnk6IGZhbHNlXG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgYWJzdHJhY3QgY29uZmlnOiBDb25maWc7XG4gIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbiAgYWJzdHJhY3QgcmVhZG9ubHkga2luZDogRmllbGRLaW5kOyBcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICB9XG5cbiAgcHVibGljIGdldE5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xuICB9XG5cbiAgcHVibGljIGdldERlZmF1bHRWYWx1ZSgpOiBhbnkge1xuXG4gICAgbGV0IHZhbHVlRGVmYXVsdCA9IHRoaXMuY29uZmlnLmRlZmF1bHQ7XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlRGVmYXVsdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHZhbHVlRGVmYXVsdCgpO1xuICAgIH1cbiAgICBcbiAgICBpZiAodmFsdWVEZWZhdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbHVlRGVmYXVsdCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlRGVmYXVsdDtcbiAgfVxuXG4gIHB1YmxpYyBpc1ZpcnR1YWwoKTogYm9vbGVhbiB7XG5cbiAgICBpZiAodGhpcy5jb25maWcubGluayAhPT0gdW5kZWZpbmVkICYmICF0aGlzLmNvbmZpZy5pbmRleCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLypcbiAgcHVibGljIGFzeW5jIHBvcHVsYXRlKG1vZGVsOiBNb2RlbCwgcm93OiB7IFtpbmRleDogc3RyaW5nXTogYW55OyB9KTogUHJvbWlzZTxhbnk+IHtcblxuICAgIGxldCBuYW1lID0gdGhpcy5nZXROYW1lKCk7XG4gICAgbGV0IHZhbHVlID0gcm93W25hbWVdO1xuXG4gICAgLypcbiAgICBpZiAodGhpcy5jb25maWcubGluayAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgIGxldCBsaW5rczogc3RyaW5nW10gPSB0aGlzLmNvbmZpZy5saW5rLnNwbGl0KCcuJyk7XG4gICAgICBsZXQgaXRlbU5hbWUgPSBsaW5rcy5zaGlmdCgpO1xuXG4gICAgICBpZiAoIWl0ZW1OYW1lIHx8IGl0ZW1OYW1lIGluIG1vZGVsLl9fZGF0YSkge1xuICAgICAgICBtb2RlbFtuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YWx1ZSA9IGF3YWl0IG1vZGVsLl9fZGF0YVtpdGVtTmFtZV07XG5cbiAgICAgIHdoaWxlIChpdGVtTmFtZSA9IGxpbmtzLnNoaWZ0KCkpIHtcblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGlmIChpdGVtTmFtZSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZVtpdGVtTmFtZV07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0aGlzLmZyb21EQih2YWx1ZSk7XG4gIH1cbiAgKi9cbiAgXG4gcHVibGljIHRvREI8QSBleHRlbmRzIEFkYXB0ZXIsIE0gZXh0ZW5kcyBNb2RlbEludGVyZmFjZT4oYWRhcHRlcjogQSwgbW9kZWw6IE0pOiBhbnkge1xuICAgXG4gICBsZXQgbmFtZSA9IHRoaXMuZ2V0TmFtZSgpO1xuICAgbGV0IHZhbHVlID0gbW9kZWxbbmFtZSBhcyBrZXlvZiBNXTtcbiAgIFxuICAgaWYodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCl7XG4gICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRWYWx1ZSgpO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgYWJzdHJhY3QgZnJvbURCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBLCB2YWx1ZTogYW55KTogYW55O1xuICBhYnN0cmFjdCBjYXN0REI8QSBleHRlbmRzIEFkYXB0ZXI+KGFkYXB0ZXI6IEEpOiBzdHJpbmc7XG4gIFxuICBwdWJsaWMgaXNKc29uT2JqZWN0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBcbiAgLypcbiAgcHJvdGVjdGVkIGRlZmluZVNldHRlcihsaW5rOiBzdHJpbmcsIHNjaGVtYTogU2NoZW1hLCBtb2RlbDogTW9kZWwsIHZhbHVlOiBhbnkpIDogdm9pZCB7XG5cbiAgICBpZiAobGluaykge1xuICAgICAgbGV0IGxpc3ROYW1lID0gbGluay5zcGxpdCgnLicpO1xuICAgICAgbGV0IGZpZWxkTmFtZSA9IGxpc3ROYW1lWzBdO1xuICAgICAgbGV0IHRhcmdldCA9IGxpc3ROYW1lLnBvcCgpO1xuICAgICAgbGV0IGZpZWxkID0gc2NoZW1hLmdldEZpZWxkKGZpZWxkTmFtZSk7XG4gICAgICBsZXQgaXRlbSA6IGFueSA9IG1vZGVsO1xuICAgICAgXG4gICAgICBpZihmaWVsZC5pc0pzb25PYmplY3QoKSl7XG4gICAgICAgIGxldCBpdGVtTmFtZSA9IGxpc3ROYW1lLnNoaWZ0KCk7XG4gICAgICAgIHdoaWxlKGl0ZW1OYW1lKXtcbiAgICAgICAgICBcbiAgICAgICAgICBpZih0eXBlb2YgaXRlbVtpdGVtTmFtZV0gIT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIGl0ZW1baXRlbU5hbWVdID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIGl0ZW0gPSBpdGVtW2l0ZW1OYW1lXTtcbiAgICAgICAgICBpdGVtTmFtZSA9IGxpc3ROYW1lLnNoaWZ0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYodGFyZ2V0KXtcbiAgICAgICAgaXRlbVt0YXJnZXRdID0gdGhpcy5wYXJzZVRvREIodmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBkZWZpbmVHZXR0ZXIobGluazogc3RyaW5nLCBzY2hlbWE6IFNjaGVtYSwgbW9kZWw6IE1vZGVsKSA6IGFueSB7XG5cbiAgICBpZiAobGluaykge1xuICAgICAgbGV0IGxpc3ROYW1lID0gbGluay5zcGxpdCgnLicpO1xuICAgICAgbGV0IGZpZWxkTmFtZSA9IGxpc3ROYW1lWzBdO1xuICAgICAgbGV0IHRhcmdldCA9IGxpc3ROYW1lLnBvcCgpO1xuICAgICAgbGV0IGZpZWxkID0gc2NoZW1hLmdldEZpZWxkKGZpZWxkTmFtZSk7XG4gICAgICBsZXQgaXRlbSA6IGFueSA9IG1vZGVsO1xuXG4gICAgICBpZihmaWVsZC5pc0pzb25PYmplY3QoKSl7XG4gICAgICAgIGxldCBpdGVtTmFtZSA9IGxpc3ROYW1lLnNoaWZ0KCk7XG4gICAgICAgIHdoaWxlKGl0ZW1OYW1lKXtcbiAgICAgICAgICBcbiAgICAgICAgICBpZih0eXBlb2YgaXRlbVtpdGVtTmFtZV0gIT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIHJldHVybiBpdGVtW2l0ZW1OYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgaXRlbSA9IGl0ZW1baXRlbU5hbWVdO1xuICAgICAgICAgIGl0ZW1OYW1lID0gbGlzdE5hbWUuc2hpZnQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBpZih0YXJnZXQpe1xuICAgICAgICByZXR1cm4gaXRlbVt0YXJnZXRdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgXG4gIHB1YmxpYyBkZWZpbmVQcm9wZXJ0eShzY2hlbWE6IFNjaGVtYSwgbW9kZWw6IE1vZGVsKTogdm9pZCB7XG4gICAgXG4gICAgXG4gICAgbGV0IGxpbmsgPSB0aGlzLmNvbmZpZy5saW5rO1xuICAgIGlmIChsaW5rKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kZWwsIHRoaXMubmFtZSwge1xuICAgICAgICAnc2V0JzogdGhpcy5kZWZpbmVTZXR0ZXIuYmluZCh0aGlzLCBsaW5rLCBzY2hlbWEsIG1vZGVsKSxcbiAgICAgICAgJ2dldCc6IHRoaXMuZGVmaW5lR2V0dGVyLmJpbmQodGhpcywgbGluaywgc2NoZW1hLCBtb2RlbCksXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgKi9cblxufVxuIiwiZXhwb3J0IHsgRmllbGQsIEZpZWxkS2luZCwgY29kZUZpZWxkRXJyb3IgfSBmcm9tIFwiLi9maWVsZFwiO1xuXG5pbXBvcnQgeyBUZXh0RmllbGQgfSBmcm9tIFwiLi90ZXh0XCI7XG5pbXBvcnQgeyBVVUlERmllbGQgfSBmcm9tIFwiLi91dWlkXCI7XG5pbXBvcnQgeyBKc29uRmllbGQgfSBmcm9tIFwiLi9qc29uXCI7XG5pbXBvcnQgeyBNYW55RmllbGQgfSBmcm9tIFwiLi9tYW55XCI7XG5pbXBvcnQgeyBJbnRlZ2VyRmllbGQgfSBmcm9tIFwiLi9pbnRlZ2VyXCI7XG5pbXBvcnQgeyBCb29sZWFuRmllbGQgfSBmcm9tIFwiLi9ib29sZWFuXCI7XG5pbXBvcnQgeyBEYXRlVGltZUZpZWxkIH0gZnJvbSBcIi4vZGF0ZXRpbWVcIjtcblxuZXhwb3J0IGNvbnN0IGZpZWxkcyA9IHtcbiAgVGV4dEZpZWxkLFxuICBVVUlERmllbGQsXG4gIEpzb25GaWVsZCxcbiAgTWFueUZpZWxkLFxuICBJbnRlZ2VyRmllbGQsXG4gIEJvb2xlYW5GaWVsZCxcbiAgRGF0ZVRpbWVGaWVsZCxcbn1cbiIsImltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi4vYWRhcHRlci9hZGFwdGVyXCI7XG5pbXBvcnQgeyBNb2RlbEludGVyZmFjZSB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgRmllbGQsIENvbmZpZywgZGVmYXVsdENvbmZpZywgRmllbGRLaW5kIH0gZnJvbSBcIi4vZmllbGRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJbnRlZ2VyQ29uZmlnIGV4dGVuZHMgQ29uZmlnIHsgfVxuXG5leHBvcnQgY2xhc3MgSW50ZWdlckZpZWxkIGV4dGVuZHMgRmllbGQge1xuXG4gIHJlYWRvbmx5IGNvbmZpZzogSW50ZWdlckNvbmZpZztcbiAgcmVhZG9ubHkga2luZDogRmllbGRLaW5kID0gRmllbGRLaW5kLklOVEVHRVI7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjb25maWc6IFBhcnRpYWw8SW50ZWdlckNvbmZpZz4gPSBkZWZhdWx0Q29uZmlnKSB7XG5cbiAgICBzdXBlcihuYW1lKTtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIC4uLmRlZmF1bHRDb25maWcsXG4gICAgICAuLi5jb25maWcsXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGZyb21EQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSwgdmFsdWU6IHN0cmluZyk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG5cbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhyb3cgeyBjb2RlOiBudWxsLCBtZXNzYWdlOiAndmFsdWUgZnJvbSBEQiBpcyBub3QgYSBudW1iZXInIH07XG4gIH1cblxuICBwdWJsaWMgdG9EQjxBIGV4dGVuZHMgQWRhcHRlciwgTSBleHRlbmRzIE1vZGVsSW50ZXJmYWNlPihhZGFwdGVyOiBBLCBtb2RlbDogTSk6IGFueSB7XG5cbiAgICBsZXQgbmFtZSA9IHRoaXMuZ2V0TmFtZSgpO1xuICAgIGxldCB2YWx1ZSA9IG1vZGVsW25hbWUgYXMga2V5b2YgTV07XG5cbiAgICBpZiAodmFsdWUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0VmFsdWUoKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IodmFsdWUpO1xuICAgIH1cblxuICAgIHRocm93IHsgY29kZTogbnVsbCwgbWVzc2FnZTogYHZhbHVlIG9mICR7IG5hbWUgfSB0byBEQiBpcyBub3QgYSBpbnRlZ2VyYCB9O1xuICB9XG5cbiAgcHVibGljIGNhc3REQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSk6IHN0cmluZyB7XG5cbiAgICByZXR1cm4gYWRhcHRlci5maWVsZENhc3Q8SW50ZWdlckZpZWxkPih0aGlzKTtcbiAgfVxufSIsImltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi4vYWRhcHRlci9hZGFwdGVyXCI7XG5pbXBvcnQgeyBNb2RlbEludGVyZmFjZSB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgRmllbGQsIENvbmZpZywgZGVmYXVsdENvbmZpZywgY29kZUZpZWxkRXJyb3IsIEZpZWxkS2luZCB9IGZyb20gXCIuL2ZpZWxkXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSnNvbkNvbmZpZyBleHRlbmRzIENvbmZpZyB7XG4gIHR5cGU6ICdsaXN0JyB8ICdvYmplY3QnLFxuICBkZWZhdWx0PzogJ3N0cmluZycgfCBGdW5jdGlvbiB8IE9iamVjdDtcbn1cblxubGV0IGpzb25EZWZhdWx0Q29uZmlnOiBKc29uQ29uZmlnID0ge1xuICAuLi5kZWZhdWx0Q29uZmlnLFxuICB0eXBlOiAnb2JqZWN0Jyxcbn1cblxuZXhwb3J0IGNsYXNzIEpzb25GaWVsZCBleHRlbmRzIEZpZWxkIHtcblxuICByZWFkb25seSBjb25maWc6IEpzb25Db25maWc7XG4gIHJlYWRvbmx5IGtpbmQ6IEZpZWxkS2luZCA9IEZpZWxkS2luZC5KU09OO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgY29uZmlnOiBQYXJ0aWFsPEpzb25Db25maWc+ID0ganNvbkRlZmF1bHRDb25maWcpIHtcblxuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLi4uanNvbkRlZmF1bHRDb25maWcsXG4gICAgICAuLi5jb25maWcsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBnZXREZWZhdWx0VmFsdWUoKTogYW55IHtcblxuICAgIGxldCB2YWx1ZURlZmF1bHQgPSBzdXBlci5nZXREZWZhdWx0VmFsdWUoKTtcblxuICAgIGlmICh0eXBlb2YgdmFsdWVEZWZhdWx0ID09PSAnc3RyaW5nJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWVEZWZhdWx0ID0gSlNPTi5wYXJzZSh2YWx1ZURlZmF1bHQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgY29kZTogY29kZUZpZWxkRXJyb3IuRGVmYXVsdFZhbHVlSXNOb3RWYWxpZCxcbiAgICAgICAgICBtZXNzYWdlOiBgRGVmYXVsdCB2YWx1ZSBvbiBKU09OIGZpZWxkIGlzIG5vdCBhIHZhbGlkIGpzb25gXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlRGVmYXVsdDtcbiAgfVxuXG4gIHB1YmxpYyBmcm9tREI8QSBleHRlbmRzIEFkYXB0ZXI+KGFkYXB0ZXI6IEEsIHZhbHVlOiBzdHJpbmcgfCBudWxsKTogb2JqZWN0IHwgdW5kZWZpbmVkIHtcblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09ICcnKSB7XG4gICAgICBsZXQgdHlwZSA9IHRoaXMuY29uZmlnLnR5cGU7XG4gICAgICBpZiAodHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vcmV0dXJuIEpTT04ucGFyc2UodmFsdWUpO1xuICAgIHJldHVybiBhZGFwdGVyLmZpZWxkVHJhbnNmb3JtRnJvbURiPEpzb25GaWVsZD4odGhpcywgdmFsdWUpO1xuICB9XG5cbiAgcHVibGljIGNhc3REQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSk6IHN0cmluZyB7XG5cbiAgICByZXR1cm4gYWRhcHRlci5maWVsZENhc3Q8SnNvbkZpZWxkPih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBpc0pzb25PYmplY3QoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuY29uZmlnLnR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwdWJsaWMgdG9EQjxBIGV4dGVuZHMgQWRhcHRlciwgTSBleHRlbmRzIE1vZGVsSW50ZXJmYWNlPihhZGFwdGVyOiBBLCBtb2RlbDogTSk6IHN0cmluZyB8IG51bGwge1xuXG4gICAgbGV0IHZhbHVlID0gc3VwZXIudG9EQihhZGFwdGVyLCBtb2RlbCk7XG5cbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0cmluZ2lmeVRvRGIodmFsdWUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0cmluZ2lmeVRvRGIodmFsdWU6IGFueSk6IHN0cmluZyB7XG5cbiAgICBsZXQga2luZCA9IHRoaXMuY29uZmlnLnR5cGU7XG4gICAgbGV0IGVycm9yID0ge1xuICAgICAgY29kZTogY29kZUZpZWxkRXJyb3IuSW5jb3JyZWN0VmFsdWVUb0RiLFxuICAgICAgbWVzc2FnZTogYHZhbHVlIGlzIG5vdCBhIHZhbGlkIGpzb25gLFxuICAgIH07XG5cbiAgICAvKiBUZXN0IGlmIHZhbHVlIGlzIHZhbGlkICovXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIEpTT04ucGFyc2UodmFsdWUpOyAvL2p1c3QgdGVzdFxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICBpZiAoa2luZCAhPT0gJ2xpc3QnKSB7XG4gICAgICAgICAgICBlcnJvci5tZXNzYWdlID0gJ0pTT04gaXMgYSBvYmplY3QsIGJ1dCBtdXN0IGJlIGEgbGlzdCc7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGtpbmQgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBlcnJvci5tZXNzYWdlID0gJ0pTT04gaXMgYSBsaXN0LCBidXQgbXVzdCBiZSBhIG9iamVjdCc7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogY29udmVydCB0byBzdHJpbmcgKi9cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufSIsImltcG9ydCB7IE1vZGVsSW50ZXJmYWNlIH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBVVUlERmllbGQgfSBmcm9tIFwiLi91dWlkXCI7XG5pbXBvcnQgeyBDb25maWcsIGRlZmF1bHRDb25maWcgfSBmcm9tIFwiLi9maWVsZFwiO1xuaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSBcIi4uXCI7XG5cbmV4cG9ydCBjbGFzcyBNYW55RmllbGQgZXh0ZW5kcyBVVUlERmllbGQge1xuXG4gIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnO1xuICAvL3Byb3RlY3RlZCByZWZlcmVyOiB0eXBlb2YgTW9kZWw7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjb25maWc/OiBQYXJ0aWFsPENvbmZpZz4pIHtcblxuICAgIHN1cGVyKGAkeyBuYW1lIH1faWRgKTtcbiAgICAvL3RoaXMucmVmZXJlciA9IHJlZmVyZXI7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH1cbiAgfVxuXG4gIC8qXG4gIHB1YmxpYyBkZWZpbmVQcm9wZXJ0eShzY2hlbWE6IFNjaGVtYSwgbW9kZWw6IE1vZGVsKTogdm9pZCB7XG4gICAgXG4gICAgbGV0IGNvbHVtbiA9IHRoaXMuZ2V0TmFtZSgpO1xuICAgIGxldCBuYW1lID0gY29sdW1uLnJlcGxhY2UoJ19pZCcsICcnKTtcbiAgICBsZXQgcHJveHkgPSB0aGlzO1xuICAgIG1vZGVsW25hbWVdID0gYXN5bmMgZnVuY3Rpb24oaXRlbT86IHR5cGVvZiB0aGlzLnJlZmVyZXJ8c3RyaW5nKSA6IFByb21pc2U8TW9kZWx8dm9pZHx1bmRlZmluZWQ+e1xuICAgICAgXG4gICAgICBpZihpdGVtID09IHVuZGVmaW5lZCl7XG4gICAgICAgIGxldCBpZFJlZmVyZXIgPSBtb2RlbFtjb2x1bW5dOyBcbiAgICAgICAgcmV0dXJuIHByb3h5LnJlZmVyZXIuZmluZCgnaWQgPSA/JywgaWRSZWZlcmVyKTtcbiAgICAgIH1cblxuICAgICAgaWYoaXRlbSBpbnN0YW5jZW9mIHByb3h5LnJlZmVyZXIpe1xuICAgICAgICBtb2RlbFtjb2x1bW5dID0gaXRlbS5pZDtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgfVxuXG4gICAgICBsZXQgcmVmID0gYXdhaXQgcHJveHkucmVmZXJlci5maW5kKCdpZCA9ID8nLCBpdGVtKTtcbiAgICAgIGlmKHJlZiA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgdGhyb3cge2NvZGU6IGNvZGVFcnJvci5SZWZlcmVyTm90Rm91bmQsIG1lc3NhZ2U6IGBOb3QgZm91bmQgJHtpdGVtfSBvbiB0YWJsZSAke25hbWV9YH07XG4gICAgICB9XG4gICAgICBtb2RlbFtjb2x1bW5dID0gcmVmLmlkO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgfVxuICAqL1xufSIsImltcG9ydCB7IE1vZGVsSW50ZXJmYWNlIH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4uL2FkYXB0ZXIvYWRhcHRlclwiO1xuaW1wb3J0IHsgRmllbGQsIENvbmZpZywgZGVmYXVsdENvbmZpZywgRmllbGRLaW5kIH0gZnJvbSBcIi4vZmllbGRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBUZXh0Q29uZmlnIGV4dGVuZHMgQ29uZmlnIHsgfVxuXG5leHBvcnQgY2xhc3MgVGV4dEZpZWxkIGV4dGVuZHMgRmllbGQge1xuXG4gIHJlYWRvbmx5IGNvbmZpZzogVGV4dENvbmZpZztcbiAgcmVhZG9ubHkga2luZDogRmllbGRLaW5kID0gRmllbGRLaW5kLlRFWFQ7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjb25maWc6IFBhcnRpYWw8VGV4dENvbmZpZz4gPSBkZWZhdWx0Q29uZmlnKSB7XG5cbiAgICBzdXBlcihuYW1lKTtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIC4uLmRlZmF1bHRDb25maWcsXG4gICAgICAuLi5jb25maWcsXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGZyb21EQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSwgdmFsdWU6IHN0cmluZ3xudWxsKTogc3RyaW5nfHVuZGVmaW5lZCB7XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgdG9EQjxBIGV4dGVuZHMgQWRhcHRlciwgVCBleHRlbmRzIE1vZGVsSW50ZXJmYWNlPihhZGFwdGVyOiBBLCBtb2RlbDogVCk6IHN0cmluZ3xudWxsIHtcblxuICAgIGxldCBuYW1lID0gdGhpcy5nZXROYW1lKCk7XG4gICAgbGV0IHZhbHVlID0gbW9kZWxbbmFtZSBhcyBrZXlvZiBUXTtcblxuICAgIGlmKHZhbHVlID09PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVmYXVsdFZhbHVlKCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB2YWx1ZS50cmltKCk7XG4gICAgfVxuXG4gICAgdGhyb3cge2NvZGU6IG51bGwsIG1lc3NhZ2U6IGB2YWx1ZSBvZiAke25hbWV9IHRvIERCIGlzIG5vdCBhIHN0cmluZ2B9O1xuICB9XG5cbiAgcHVibGljIGNhc3REQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSk6IHN0cmluZyB7XG5cbiAgICByZXR1cm4gYWRhcHRlci5maWVsZENhc3Q8VGV4dEZpZWxkPih0aGlzKTtcbiAgfVxufSIsImltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi4vYWRhcHRlci9hZGFwdGVyXCI7XG5pbXBvcnQgeyBGaWVsZCwgQ29uZmlnLCBkZWZhdWx0Q29uZmlnLCBGaWVsZEtpbmQgfSBmcm9tIFwiLi9maWVsZFwiO1xuaW1wb3J0IHsgTW9kZWxJbnRlcmZhY2UgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcblxuZXhwb3J0IGNsYXNzIFVVSURGaWVsZCBleHRlbmRzIEZpZWxkIHtcblxuICByZWFkb25seSBjb25maWc6IENvbmZpZztcbiAgcmVhZG9ubHkga2luZDogRmllbGRLaW5kID0gRmllbGRLaW5kLlVVSUQ7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjb25maWc6IFBhcnRpYWw8Q29uZmlnPiA9IGRlZmF1bHRDb25maWcpIHtcblxuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLi4uZGVmYXVsdENvbmZpZyxcbiAgICAgIC4uLmNvbmZpZyxcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGNhc3REQihhZGFwdGVyOiBBZGFwdGVyKTogc3RyaW5nIHtcblxuICAgIHJldHVybiBhZGFwdGVyLmZpZWxkQ2FzdDxVVUlERmllbGQ+KHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGZyb21EQih2YWx1ZTogYW55KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHRocm93IHsgY29kZTogbnVsbCwgbWVzc2FnZTogJ3ZhbHVlIGZyb20gREIgaXMgbm90IGEgdmFsaWQgdXVpZCcgfTtcbiAgfVxuXG4gIHB1YmxpYyBnZXREZWZhdWx0VmFsdWUoKTogYW55IHtcblxuICAgIGxldCB2YWx1ZSA9IHN1cGVyLmdldERlZmF1bHRWYWx1ZSgpO1xuXG4gICAgaWYgKHZhbHVlID09PSBudWxsICYmIHRoaXMuY29uZmlnLnByaW1hcnkpIHtcbiAgICAgIHZhbHVlID0gdXVpZCgpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB0b0RCPEEgZXh0ZW5kcyBBZGFwdGVyLCBNIGV4dGVuZHMgTW9kZWxJbnRlcmZhY2U+KGFkYXB0ZXI6IEEsIG1vZGVsOiBNKTogYW55IHtcblxuICAgIGxldCB2YWx1ZSA9IHN1cGVyLnRvREI8QSwgTT4oYWRhcHRlciwgbW9kZWwpO1xuICAgIHJldHVybiBhZGFwdGVyLmZpZWxkVHJhbnNmb3JtVG9EQjxVVUlERmllbGQsIE0+KHRoaXMsIHZhbHVlKTtcbiAgfVxufSIsImV4cG9ydCB7IGRlYnVnIH0gZnJvbSAnLi9kZWJ1Zyc7XG5cbmV4cG9ydCB7IE1vZGVsSW50ZXJmYWNlLCBNb2RlbENvbnN0cnVjdG9yLCBNb2RlbCB9IGZyb20gJy4vbW9kZWwnO1xuZXhwb3J0IHsgU2NoZW1hIH0gZnJvbSAnLi9zY2hlbWEnO1xuZXhwb3J0ICogZnJvbSAnLi9hZGFwdGVyJztcbmV4cG9ydCB7IGZpZWxkcywgRmllbGQsIEZpZWxkS2luZCwgY29kZUZpZWxkRXJyb3IgfSBmcm9tICcuL2ZpZWxkJztcbmV4cG9ydCB7IE1pZ3JhdGlvbiB9IGZyb20gJy4vbWlncmF0aW9uJztcblxuLy9leHBvcnQgeyBzZXNzaW9uLCBzZXREZWZhdWx0QWRhcHRlciwgZ2V0RGVmYXVsdEFkYXB0ZXIgfSBmcm9tICcuL3Nlc3Npb24nOyIsImltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi9hZGFwdGVyL2FkYXB0ZXJcIjtcblxudHlwZSB0YXNrQ2FsbGJhY2sgPSB7ICh0cmFuc2FjdGlvbjogYW55KTogUHJvbWlzZTx2b2lkPiB9O1xuXG5pbnRlcmZhY2UgdGFza1ZlcnNpb24ge1xuICBbdmVyc2lvbjogbnVtYmVyXTogdGFza0NhbGxiYWNrO1xufTtcblxuZXhwb3J0IGNsYXNzIE1pZ3JhdGlvbiB7XG5cbiAgcHJvdGVjdGVkIGFkYXB0ZXI6IEFkYXB0ZXI7XG4gIHByaXZhdGUgdGFza3M6IHRhc2tWZXJzaW9uID0ge307XG4gIHByaXZhdGUgZmlyc3RBY2Nlc3M/OiB0YXNrQ2FsbGJhY2s7XG5cbiAgY29uc3RydWN0b3IoYWRhcHRlcjogQWRhcHRlcikge1xuICAgIHRoaXMuYWRhcHRlciA9IGFkYXB0ZXI7XG4gIH1cblxuICBwcm90ZWN0ZWQgbWFrZSgpOiB2b2lkIHsgfVxuXG4gIHB1YmxpYyBhc3luYyBydW4oKTogUHJvbWlzZTx2b2lkPiB7XG5cbiAgICB0aGlzLm1ha2UoKTtcblxuICAgIGlmICh0aGlzLmZpcnN0QWNjZXNzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IHsgY29kZTogbnVsbCwgbWVzc2FnZTogYEZpcnN0QWNjZXNzIE1pZ3JhdGlvbiBub3QgaW1wbGVtZW50ZWQhYCB9O1xuICAgIH1cblxuICAgIC8qXG4gICAgbGV0IHZlcnNpb24gPSB0aGlzLmFkYXB0ZXIuZ2V0VmVyc2lvbigpO1xuICAgIGlmICh2ZXJzaW9uID09PSAnJykge1xuICAgICAgcmV0dXJuIHRoaXMuYWRhcHRlci5jaGFuZ2VWZXJzaW9uKDAsIHRoaXMuZmlyc3RBY2Nlc3MpO1xuICAgIH1cbiAgICBcblxuICAgIHdoaWxlICh0cnVlKSB7XG5cbiAgICAgIHZlcnNpb24rKztcbiAgICAgIGxldCB0YXNrID0gdGhpcy50YXNrc1t2ZXJzaW9uXTtcbiAgICAgIGlmICh0YXNrID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHRoaXMuYWRhcHRlci5jaGFuZ2VWZXJzaW9uKHZlcnNpb24sIHRhc2spO1xuICAgIH1cbiovXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlZ2lzdGVyRmlyc3RBY2Nlc3MoY2FsbGJhY2s6IHRhc2tDYWxsYmFjayk6IHZvaWQge1xuXG4gICAgaWYgKHRoaXMuZmlyc3RBY2Nlc3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgeyBjb2RlOiB1bmRlZmluZWQsIG1lc3NhZ2U6IGBmaXJzdEFjY2VzcyBjYWxsYmFjayBhbHJlYWR5IHJlZ2lzdGVyZWRgIH07XG4gICAgfVxuXG4gICAgdGhpcy5maXJzdEFjY2VzcyA9IGNhbGxiYWNrO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlZ2lzdGVyKHZlcnNpb246IG51bWJlciwgY2FsbGJhY2s6IHRhc2tDYWxsYmFjayk6IHZvaWQge1xuXG4gICAgaWYgKHRoaXMudGFza3NbdmVyc2lvbl0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgeyBjb2RlOiB1bmRlZmluZWQsIG1lc3NhZ2U6IGBjYWxsYmFjayB2ZXJzaW9uICR7IHZlcnNpb24gfSBhbHJlYWR5IHJlZ2lzdGVyZWRgIH07XG4gICAgfVxuXG4gICAgdGhpcy50YXNrc1t2ZXJzaW9uXSA9IGNhbGxiYWNrO1xuICB9XG59IiwiZXhwb3J0IGludGVyZmFjZSBNb2RlbEludGVyZmFjZSB7XG4gIGlkOiBzdHJpbmcsXG4gIF9fZGF0YT86IGFueSxcbn1cblxuZXhwb3J0IHR5cGUgTW9kZWxDb25zdHJ1Y3RvcjxNPiA9IG5ldyAoaWQ6IHN0cmluZywgLi4uYXJnczogYW55KSA9PiBNO1xuXG5leHBvcnQgY2xhc3MgTW9kZWwge1xuXG4gIGlkOiBzdHJpbmc7XG4gIF9fZGF0YT86IE1vZGVsSW50ZXJmYWNlO1xuXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLmlkID0gaWQ7XG4gIH1cbn0iLCJpbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4vYWRhcHRlci9hZGFwdGVyXCI7XG5pbXBvcnQgeyBTZWxlY3QgfSBmcm9tIFwiLi9hZGFwdGVyL3NlbGVjdFwiO1xuaW1wb3J0IHsgSW5zZXJ0IH0gZnJvbSBcIi4vYWRhcHRlci9pbnNlcnRcIjtcbmltcG9ydCB7IERyb3AgfSBmcm9tIFwiLi9hZGFwdGVyL2Ryb3BcIjtcbmltcG9ydCB7IHBhcmFtc1R5cGUgfSBmcm9tIFwiLi9hZGFwdGVyL3F1ZXJ5XCI7XG5pbXBvcnQgeyBNb2RlbENvbnN0cnVjdG9yLCBNb2RlbCB9IGZyb20gXCIuL21vZGVsXCI7XG5pbXBvcnQgeyBGaWVsZCB9IGZyb20gXCIuL2ZpZWxkL2ZpZWxkXCI7XG5pbXBvcnQgeyBDcmVhdGUgfSBmcm9tIFwiLi9hZGFwdGVyL2NyZWF0ZVwiO1xuaW1wb3J0IHsgVVVJREZpZWxkIH0gZnJvbSBcIi4vZmllbGQvdXVpZFwiO1xuXG5leHBvcnQgZW51bSBjb2RlU2NoZW1hRXJyb3Ige1xuICAnUG9zdFNhdmVOb3RGb3VuZCcgPSAnQHN0b3JhZ28vb3JtL3NjaGVtYS9Qb3N0U2F2ZU5vdEZvdW5kJyxcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNjaGVtYTxBIGV4dGVuZHMgQWRhcHRlciwgTSBleHRlbmRzIE1vZGVsPiB7XG5cbiAgYWJzdHJhY3QgcmVhZG9ubHkgTW9kZWw6IE1vZGVsQ29uc3RydWN0b3I8TT47XG4gIGFic3RyYWN0IHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICByZWFkb25seSBmaWVsZHM6IEZpZWxkW10gPSBbXTtcbiAgcmVhZG9ubHkgYWRhcHRlcjogQTtcblxuICBwcm90ZWN0ZWQgc3VwZXJGaWVsZHM6IEZpZWxkW10gPSBbXG4gICAgbmV3IFVVSURGaWVsZCgnaWQnLCB7IHByaW1hcnk6IHRydWUgfSksXG4gIF07XG5cbiAgY29uc3RydWN0b3IoYWRhcHRlcjogQSkge1xuXG4gICAgdGhpcy5hZGFwdGVyID0gYWRhcHRlcjtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzYXZlKG1vZGVsOiBNKTogUHJvbWlzZTxNPiB7XG5cbiAgICBpZiAobW9kZWwuX19kYXRhKSB7XG4gICAgICAvL3VwZGF0ZSBhcmVhXG4gICAgICBjb25zb2xlLmxvZygnc2F2ZSB1cGRhdGUnLCBtb2RlbC5fX2RhdGEpO1xuICAgICAgdGhyb3cgJ01ldGhvZCB1cGRhdGUgZG8gbm90IGltcGxlbWVudGVkJztcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdzYXZlIGluc2VydCcsIG1vZGVsLl9fZGF0YSk7XG4gICAgICBsZXQgaW5zZXJ0ID0gdGhpcy5pbnNlcnQoKTtcbiAgICAgIGluc2VydC5hZGQobW9kZWwpO1xuICAgICAgYXdhaXQgaW5zZXJ0LnNhdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5yZWZyZXNoTW9kZWwobW9kZWwpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHJlZnJlc2hNb2RlbChtb2RlbDogTSk6IFByb21pc2U8TT4ge1xuXG4gICAgbGV0IGlkID0gbW9kZWxbJ2lkJ107XG5cbiAgICBsZXQgaXRlbSA9IGF3YWl0IHRoaXMuZmluZCgnaWQgPSA/JywgaWQpO1xuICAgIGlmIChpdGVtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IHsgY29kZTogY29kZVNjaGVtYUVycm9yLlBvc3RTYXZlTm90Rm91bmQsIG1lc3NhZ2U6IGBGYWlsIHRvIGZpbmQgaWQ6ICR7aWR9YCB9O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBvcHVsYXRlRnJvbURCKGl0ZW0sIG1vZGVsKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRNb2RlbENsYXNzKCk6IE1vZGVsQ29uc3RydWN0b3I8TT4gfCB1bmRlZmluZWQge1xuXG4gICAgcmV0dXJuIHRoaXMuTW9kZWw7XG4gIH1cblxuICBwdWJsaWMgZ2V0TmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm5hbWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0RmllbGRzKCk6IEZpZWxkW10ge1xuXG4gICAgcmV0dXJuIFsuLi50aGlzLnN1cGVyRmllbGRzLCAuLi50aGlzLmZpZWxkc107XG4gIH1cblxuICBwdWJsaWMgZ2V0RmllbGQobmFtZTogc3RyaW5nKTogRmllbGQge1xuXG4gICAgZm9yIChsZXQgZmllbGQgb2YgdGhpcy5nZXRGaWVsZHMoKSkge1xuICAgICAgaWYgKG5hbWUgPT0gZmllbGQuZ2V0TmFtZSgpKSB7XG4gICAgICAgIHJldHVybiBmaWVsZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyB7IGNvZGU6IG51bGwsIG1lc3NhZ2U6IGBGaWVsZCB3aXRoIG5hbWU6ICR7bmFtZX0gbm90IGV4aXN0cyBpbiAke3RoaXMubmFtZX1gIH07XG4gIH1cblxuICBwdWJsaWMgZ2V0Q29sdW1ucygpOiBzdHJpbmdbXSB7XG5cbiAgICBsZXQgY29sdW1uczogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgZmllbGRzID0gdGhpcy5nZXRGaWVsZHMoKTtcbiAgICBmb3IgKGxldCBmaWVsZCBvZiB0aGlzLmdldEZpZWxkcygpKSB7XG4gICAgICBjb2x1bW5zLnB1c2goZmllbGQuZ2V0TmFtZSgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29sdW1ucztcbiAgfVxuXG4gIHB1YmxpYyBmaW5kKHdoZXJlOiBzdHJpbmcsIHBhcmFtOiBwYXJhbXNUeXBlKTogUHJvbWlzZTxNIHwgdW5kZWZpbmVkPiB7XG5cbiAgICBsZXQgc2VsZWN0ID0gdGhpcy5zZWxlY3QoKTtcbiAgICBzZWxlY3Qud2hlcmUod2hlcmUsIHBhcmFtKTtcbiAgICByZXR1cm4gc2VsZWN0Lm9uZSgpO1xuICB9O1xuXG4gIHB1YmxpYyBnZXRBZGFwdGVyKCk6IEEge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXI7XG4gIH1cblxuICBwdWJsaWMgc2VsZWN0KCk6IFNlbGVjdDxNPiB7XG4gICAgbGV0IHNlbGVjdCA9IHRoaXMuYWRhcHRlci5zZWxlY3Q8TT4odGhpcyk7XG4gICAgc2VsZWN0LmZyb20odGhpcy5nZXROYW1lKCksIHRoaXMuZ2V0Q29sdW1ucygpKTtcbiAgICByZXR1cm4gc2VsZWN0O1xuICB9XG5cbiAgcHVibGljIGluc2VydCgpOiBJbnNlcnQ8TT4ge1xuICAgIGxldCBpbnNlcnQgPSB0aGlzLmFkYXB0ZXIuaW5zZXJ0PE0+KHRoaXMpO1xuICAgIHJldHVybiBpbnNlcnQ7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlVGFibGUoKTogQ3JlYXRlPE0+IHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmNyZWF0ZTxNPih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBkcm9wKCk6IERyb3A8TT4ge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZHJvcDxNPih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBuZXcoLi4uYXJnczogQ29uc3RydWN0b3JQYXJhbWV0ZXJzPHR5cGVvZiB0aGlzLk1vZGVsPik6IE0ge1xuXG4gICAgY29uc3QgbW9kZWwgPSBuZXcgdGhpcy5Nb2RlbCguLi5hcmdzKTtcbiAgICByZXR1cm4gbW9kZWw7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcG9wdWxhdGVGcm9tREIocm93OiB7IFtpbmRleDogc3RyaW5nXTogYW55OyB9LCBtb2RlbD86IE0pOiBQcm9taXNlPE0+IHtcblxuICAgIGlmIChtb2RlbCA9PSB1bmRlZmluZWQpIHtcblxuICAgICAgbGV0IHBhcmFtcyA9IHt9O1xuICAgICAgbW9kZWwgPSB0aGlzLm5ldyhyb3cuaWQpO1xuICAgIH1cblxuICAgIGxldCBmaWVsZHMgPSB0aGlzLmdldEZpZWxkcygpO1xuICAgIG1vZGVsLl9fZGF0YSA9IHJvdyBhcyBNO1xuICAgIGZvciAobGV0IGZpZWxkIG9mIGZpZWxkcykge1xuICAgICAgbGV0IG5hbWUgPSBmaWVsZC5nZXROYW1lKCk7XG4gICAgICBpZiAobmFtZSA9PSAnaWQnKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgbW9kZWxbbmFtZSBhcyBrZXlvZiBNXSA9IGZpZWxkLmZyb21EQih0aGlzLmFkYXB0ZXIsIHJvd1tuYW1lXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZGVsO1xuICB9XG5cbiAgLypcbiAgcHVibGljIGFzeW5jIHBvcHVsYXRlRnJvbURCPFQgZXh0ZW5kcyBNb2RlbD4ocm93OiB7IFtpbmRleDogc3RyaW5nXTogYW55OyB9LCBtb2RlbDogVCk6IFByb21pc2U8VD4ge1xuXG4gICAgbGV0IHByb21pc2VzOiBQcm9taXNlPGFueT5bXSA9IFtdO1xuICAgIGxldCBmaWVsZHMgPSB0aGlzLmdldFJlYWxGaWVsZHMoKTtcbiAgICBsZXQga2V5czogc3RyaW5nW10gPSBbXTtcbiAgXG4gICAgZm9yIChsZXQgZmllbGQgb2YgZmllbGRzKSB7XG4gICAgICBsZXQgbmFtZSA9IGZpZWxkLmdldE5hbWUoKTtcbiAgICAgIGxldCBwcm9taXNlUG9wdWxhdGUgPSBmaWVsZC5wb3B1bGF0ZShtb2RlbCwgcm93KTtcbiAgICAgIG1vZGVsLl9fZGF0YVtuYW1lXSA9IHByb21pc2VQb3B1bGF0ZTtcbiAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZVBvcHVsYXRlKTtcbiAgICAgIGtleXMucHVzaChuYW1lKTtcbiAgICB9XG5cbiAgICBsZXQgZGF0YSA9IGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICBmb3IobGV0IGsgaW4ga2V5cyl7XG4gICAgICBsZXQgbmFtZSA9IGtleXNba107XG4gICAgICBtb2RlbFtuYW1lIGFzIGtleW9mIFRdID0gZGF0YVtrXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbW9kZWw7XG4gIH1cblxuICBwdWJsaWMgZGVmaW5lUHJvcGVydGllcyhtb2RlbDogTW9kZWwpIDogdm9pZCB7XG5cbiAgICBmb3IobGV0IGZpZWxkIG9mIHRoaXMuZ2V0RmllbGRzKCkpe1xuICAgICAgZmllbGQuZGVmaW5lUHJvcGVydHkodGhpcywgbW9kZWwpO1xuICAgIH1cbiAgfSBcbiAgKi9cbn0iLCJleHBvcnQgeyBkZWZhdWx0IGFzIHYxIH0gZnJvbSAnLi92MS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHYzIH0gZnJvbSAnLi92My5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHY0IH0gZnJvbSAnLi92NC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHY1IH0gZnJvbSAnLi92NS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE5JTCB9IGZyb20gJy4vbmlsLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdmVyc2lvbiB9IGZyb20gJy4vdmVyc2lvbi5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHZhbGlkYXRlIH0gZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHN0cmluZ2lmeSB9IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgcGFyc2UgfSBmcm9tICcuL3BhcnNlLmpzJzsiLCJpbXBvcnQgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5cbmZ1bmN0aW9uIG1kNShieXRlcykge1xuICBpZiAoQXJyYXkuaXNBcnJheShieXRlcykpIHtcbiAgICBieXRlcyA9IEJ1ZmZlci5mcm9tKGJ5dGVzKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgYnl0ZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgYnl0ZXMgPSBCdWZmZXIuZnJvbShieXRlcywgJ3V0ZjgnKTtcbiAgfVxuXG4gIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnbWQ1JykudXBkYXRlKGJ5dGVzKS5kaWdlc3QoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWQ1OyIsImV4cG9ydCBkZWZhdWx0ICcwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAnOyIsImltcG9ydCB2YWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlLmpzJztcblxuZnVuY3Rpb24gcGFyc2UodXVpZCkge1xuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdJbnZhbGlkIFVVSUQnKTtcbiAgfVxuXG4gIGxldCB2O1xuICBjb25zdCBhcnIgPSBuZXcgVWludDhBcnJheSgxNik7IC8vIFBhcnNlICMjIyMjIyMjLS4uLi4tLi4uLi0uLi4uLS4uLi4uLi4uLi4uLlxuXG4gIGFyclswXSA9ICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSgwLCA4KSwgMTYpKSA+Pj4gMjQ7XG4gIGFyclsxXSA9IHYgPj4+IDE2ICYgMHhmZjtcbiAgYXJyWzJdID0gdiA+Pj4gOCAmIDB4ZmY7XG4gIGFyclszXSA9IHYgJiAweGZmOyAvLyBQYXJzZSAuLi4uLi4uLi0jIyMjLS4uLi4tLi4uLi0uLi4uLi4uLi4uLi5cblxuICBhcnJbNF0gPSAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoOSwgMTMpLCAxNikpID4+PiA4O1xuICBhcnJbNV0gPSB2ICYgMHhmZjsgLy8gUGFyc2UgLi4uLi4uLi4tLi4uLi0jIyMjLS4uLi4tLi4uLi4uLi4uLi4uXG5cbiAgYXJyWzZdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDE0LCAxOCksIDE2KSkgPj4+IDg7XG4gIGFycls3XSA9IHYgJiAweGZmOyAvLyBQYXJzZSAuLi4uLi4uLi0uLi4uLS4uLi4tIyMjIy0uLi4uLi4uLi4uLi5cblxuICBhcnJbOF0gPSAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoMTksIDIzKSwgMTYpKSA+Pj4gODtcbiAgYXJyWzldID0gdiAmIDB4ZmY7IC8vIFBhcnNlIC4uLi4uLi4uLS4uLi4tLi4uLi0uLi4uLSMjIyMjIyMjIyMjI1xuICAvLyAoVXNlIFwiL1wiIHRvIGF2b2lkIDMyLWJpdCB0cnVuY2F0aW9uIHdoZW4gYml0LXNoaWZ0aW5nIGhpZ2gtb3JkZXIgYnl0ZXMpXG5cbiAgYXJyWzEwXSA9ICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSgyNCwgMzYpLCAxNikpIC8gMHgxMDAwMDAwMDAwMCAmIDB4ZmY7XG4gIGFyclsxMV0gPSB2IC8gMHgxMDAwMDAwMDAgJiAweGZmO1xuICBhcnJbMTJdID0gdiA+Pj4gMjQgJiAweGZmO1xuICBhcnJbMTNdID0gdiA+Pj4gMTYgJiAweGZmO1xuICBhcnJbMTRdID0gdiA+Pj4gOCAmIDB4ZmY7XG4gIGFyclsxNV0gPSB2ICYgMHhmZjtcbiAgcmV0dXJuIGFycjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcGFyc2U7IiwiZXhwb3J0IGRlZmF1bHQgL14oPzpbMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMS01XVswLTlhLWZdezN9LVs4OWFiXVswLTlhLWZdezN9LVswLTlhLWZdezEyfXwwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDApJC9pOyIsImltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmNvbnN0IHJuZHM4UG9vbCA9IG5ldyBVaW50OEFycmF5KDI1Nik7IC8vICMgb2YgcmFuZG9tIHZhbHVlcyB0byBwcmUtYWxsb2NhdGVcblxubGV0IHBvb2xQdHIgPSBybmRzOFBvb2wubGVuZ3RoO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcm5nKCkge1xuICBpZiAocG9vbFB0ciA+IHJuZHM4UG9vbC5sZW5ndGggLSAxNikge1xuICAgIGNyeXB0by5yYW5kb21GaWxsU3luYyhybmRzOFBvb2wpO1xuICAgIHBvb2xQdHIgPSAwO1xuICB9XG5cbiAgcmV0dXJuIHJuZHM4UG9vbC5zbGljZShwb29sUHRyLCBwb29sUHRyICs9IDE2KTtcbn0iLCJpbXBvcnQgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5cbmZ1bmN0aW9uIHNoYTEoYnl0ZXMpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYnl0ZXMpKSB7XG4gICAgYnl0ZXMgPSBCdWZmZXIuZnJvbShieXRlcyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGJ5dGVzID09PSAnc3RyaW5nJykge1xuICAgIGJ5dGVzID0gQnVmZmVyLmZyb20oYnl0ZXMsICd1dGY4Jyk7XG4gIH1cblxuICByZXR1cm4gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTEnKS51cGRhdGUoYnl0ZXMpLmRpZ2VzdCgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzaGExOyIsImltcG9ydCB2YWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlLmpzJztcbi8qKlxuICogQ29udmVydCBhcnJheSBvZiAxNiBieXRlIHZhbHVlcyB0byBVVUlEIHN0cmluZyBmb3JtYXQgb2YgdGhlIGZvcm06XG4gKiBYWFhYWFhYWC1YWFhYLVhYWFgtWFhYWC1YWFhYWFhYWFhYWFhcbiAqL1xuXG5jb25zdCBieXRlVG9IZXggPSBbXTtcblxuZm9yIChsZXQgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBieXRlVG9IZXgucHVzaCgoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpKTtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KGFyciwgb2Zmc2V0ID0gMCkge1xuICAvLyBOb3RlOiBCZSBjYXJlZnVsIGVkaXRpbmcgdGhpcyBjb2RlISAgSXQncyBiZWVuIHR1bmVkIGZvciBwZXJmb3JtYW5jZVxuICAvLyBhbmQgd29ya3MgaW4gd2F5cyB5b3UgbWF5IG5vdCBleHBlY3QuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQvcHVsbC80MzRcbiAgY29uc3QgdXVpZCA9IChieXRlVG9IZXhbYXJyW29mZnNldCArIDBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMV1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDNdXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA1XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDZdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgN11dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA4XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDldXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTJdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTNdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTVdXSkudG9Mb3dlckNhc2UoKTsgLy8gQ29uc2lzdGVuY3kgY2hlY2sgZm9yIHZhbGlkIFVVSUQuICBJZiB0aGlzIHRocm93cywgaXQncyBsaWtlbHkgZHVlIHRvIG9uZVxuICAvLyBvZiB0aGUgZm9sbG93aW5nOlxuICAvLyAtIE9uZSBvciBtb3JlIGlucHV0IGFycmF5IHZhbHVlcyBkb24ndCBtYXAgdG8gYSBoZXggb2N0ZXQgKGxlYWRpbmcgdG9cbiAgLy8gXCJ1bmRlZmluZWRcIiBpbiB0aGUgdXVpZClcbiAgLy8gLSBJbnZhbGlkIGlucHV0IHZhbHVlcyBmb3IgdGhlIFJGQyBgdmVyc2lvbmAgb3IgYHZhcmlhbnRgIGZpZWxkc1xuXG4gIGlmICghdmFsaWRhdGUodXVpZCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ1N0cmluZ2lmaWVkIFVVSUQgaXMgaW52YWxpZCcpO1xuICB9XG5cbiAgcmV0dXJuIHV1aWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0cmluZ2lmeTsiLCJpbXBvcnQgcm5nIGZyb20gJy4vcm5nLmpzJztcbmltcG9ydCBzdHJpbmdpZnkgZnJvbSAnLi9zdHJpbmdpZnkuanMnOyAvLyAqKmB2MSgpYCAtIEdlbmVyYXRlIHRpbWUtYmFzZWQgVVVJRCoqXG4vL1xuLy8gSW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL0xpb3NLL1VVSUQuanNcbi8vIGFuZCBodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvdXVpZC5odG1sXG5cbmxldCBfbm9kZUlkO1xuXG5sZXQgX2Nsb2Nrc2VxOyAvLyBQcmV2aW91cyB1dWlkIGNyZWF0aW9uIHRpbWVcblxuXG5sZXQgX2xhc3RNU2VjcyA9IDA7XG5sZXQgX2xhc3ROU2VjcyA9IDA7IC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQgZm9yIEFQSSBkZXRhaWxzXG5cbmZ1bmN0aW9uIHYxKG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIGxldCBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuICBjb25zdCBiID0gYnVmIHx8IG5ldyBBcnJheSgxNik7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsZXQgbm9kZSA9IG9wdGlvbnMubm9kZSB8fCBfbm9kZUlkO1xuICBsZXQgY2xvY2tzZXEgPSBvcHRpb25zLmNsb2Nrc2VxICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmNsb2Nrc2VxIDogX2Nsb2Nrc2VxOyAvLyBub2RlIGFuZCBjbG9ja3NlcSBuZWVkIHRvIGJlIGluaXRpYWxpemVkIHRvIHJhbmRvbSB2YWx1ZXMgaWYgdGhleSdyZSBub3RcbiAgLy8gc3BlY2lmaWVkLiAgV2UgZG8gdGhpcyBsYXppbHkgdG8gbWluaW1pemUgaXNzdWVzIHJlbGF0ZWQgdG8gaW5zdWZmaWNpZW50XG4gIC8vIHN5c3RlbSBlbnRyb3B5LiAgU2VlICMxODlcblxuICBpZiAobm9kZSA9PSBudWxsIHx8IGNsb2Nrc2VxID09IG51bGwpIHtcbiAgICBjb25zdCBzZWVkQnl0ZXMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpO1xuXG4gICAgaWYgKG5vZGUgPT0gbnVsbCkge1xuICAgICAgLy8gUGVyIDQuNSwgY3JlYXRlIGFuZCA0OC1iaXQgbm9kZSBpZCwgKDQ3IHJhbmRvbSBiaXRzICsgbXVsdGljYXN0IGJpdCA9IDEpXG4gICAgICBub2RlID0gX25vZGVJZCA9IFtzZWVkQnl0ZXNbMF0gfCAweDAxLCBzZWVkQnl0ZXNbMV0sIHNlZWRCeXRlc1syXSwgc2VlZEJ5dGVzWzNdLCBzZWVkQnl0ZXNbNF0sIHNlZWRCeXRlc1s1XV07XG4gICAgfVxuXG4gICAgaWYgKGNsb2Nrc2VxID09IG51bGwpIHtcbiAgICAgIC8vIFBlciA0LjIuMiwgcmFuZG9taXplICgxNCBiaXQpIGNsb2Nrc2VxXG4gICAgICBjbG9ja3NlcSA9IF9jbG9ja3NlcSA9IChzZWVkQnl0ZXNbNl0gPDwgOCB8IHNlZWRCeXRlc1s3XSkgJiAweDNmZmY7XG4gICAgfVxuICB9IC8vIFVVSUQgdGltZXN0YW1wcyBhcmUgMTAwIG5hbm8tc2Vjb25kIHVuaXRzIHNpbmNlIHRoZSBHcmVnb3JpYW4gZXBvY2gsXG4gIC8vICgxNTgyLTEwLTE1IDAwOjAwKS4gIEpTTnVtYmVycyBhcmVuJ3QgcHJlY2lzZSBlbm91Z2ggZm9yIHRoaXMsIHNvXG4gIC8vIHRpbWUgaXMgaGFuZGxlZCBpbnRlcm5hbGx5IGFzICdtc2VjcycgKGludGVnZXIgbWlsbGlzZWNvbmRzKSBhbmQgJ25zZWNzJ1xuICAvLyAoMTAwLW5hbm9zZWNvbmRzIG9mZnNldCBmcm9tIG1zZWNzKSBzaW5jZSB1bml4IGVwb2NoLCAxOTcwLTAxLTAxIDAwOjAwLlxuXG5cbiAgbGV0IG1zZWNzID0gb3B0aW9ucy5tc2VjcyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5tc2VjcyA6IERhdGUubm93KCk7IC8vIFBlciA0LjIuMS4yLCB1c2UgY291bnQgb2YgdXVpZCdzIGdlbmVyYXRlZCBkdXJpbmcgdGhlIGN1cnJlbnQgY2xvY2tcbiAgLy8gY3ljbGUgdG8gc2ltdWxhdGUgaGlnaGVyIHJlc29sdXRpb24gY2xvY2tcblxuICBsZXQgbnNlY3MgPSBvcHRpb25zLm5zZWNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm5zZWNzIDogX2xhc3ROU2VjcyArIDE7IC8vIFRpbWUgc2luY2UgbGFzdCB1dWlkIGNyZWF0aW9uIChpbiBtc2VjcylcblxuICBjb25zdCBkdCA9IG1zZWNzIC0gX2xhc3RNU2VjcyArIChuc2VjcyAtIF9sYXN0TlNlY3MpIC8gMTAwMDA7IC8vIFBlciA0LjIuMS4yLCBCdW1wIGNsb2Nrc2VxIG9uIGNsb2NrIHJlZ3Jlc3Npb25cblxuICBpZiAoZHQgPCAwICYmIG9wdGlvbnMuY2xvY2tzZXEgPT09IHVuZGVmaW5lZCkge1xuICAgIGNsb2Nrc2VxID0gY2xvY2tzZXEgKyAxICYgMHgzZmZmO1xuICB9IC8vIFJlc2V0IG5zZWNzIGlmIGNsb2NrIHJlZ3Jlc3NlcyAobmV3IGNsb2Nrc2VxKSBvciB3ZSd2ZSBtb3ZlZCBvbnRvIGEgbmV3XG4gIC8vIHRpbWUgaW50ZXJ2YWxcblxuXG4gIGlmICgoZHQgPCAwIHx8IG1zZWNzID4gX2xhc3RNU2VjcykgJiYgb3B0aW9ucy5uc2VjcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbnNlY3MgPSAwO1xuICB9IC8vIFBlciA0LjIuMS4yIFRocm93IGVycm9yIGlmIHRvbyBtYW55IHV1aWRzIGFyZSByZXF1ZXN0ZWRcblxuXG4gIGlmIChuc2VjcyA+PSAxMDAwMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInV1aWQudjEoKTogQ2FuJ3QgY3JlYXRlIG1vcmUgdGhhbiAxME0gdXVpZHMvc2VjXCIpO1xuICB9XG5cbiAgX2xhc3RNU2VjcyA9IG1zZWNzO1xuICBfbGFzdE5TZWNzID0gbnNlY3M7XG4gIF9jbG9ja3NlcSA9IGNsb2Nrc2VxOyAvLyBQZXIgNC4xLjQgLSBDb252ZXJ0IGZyb20gdW5peCBlcG9jaCB0byBHcmVnb3JpYW4gZXBvY2hcblxuICBtc2VjcyArPSAxMjIxOTI5MjgwMDAwMDsgLy8gYHRpbWVfbG93YFxuXG4gIGNvbnN0IHRsID0gKChtc2VjcyAmIDB4ZmZmZmZmZikgKiAxMDAwMCArIG5zZWNzKSAlIDB4MTAwMDAwMDAwO1xuICBiW2krK10gPSB0bCA+Pj4gMjQgJiAweGZmO1xuICBiW2krK10gPSB0bCA+Pj4gMTYgJiAweGZmO1xuICBiW2krK10gPSB0bCA+Pj4gOCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsICYgMHhmZjsgLy8gYHRpbWVfbWlkYFxuXG4gIGNvbnN0IHRtaCA9IG1zZWNzIC8gMHgxMDAwMDAwMDAgKiAxMDAwMCAmIDB4ZmZmZmZmZjtcbiAgYltpKytdID0gdG1oID4+PiA4ICYgMHhmZjtcbiAgYltpKytdID0gdG1oICYgMHhmZjsgLy8gYHRpbWVfaGlnaF9hbmRfdmVyc2lvbmBcblxuICBiW2krK10gPSB0bWggPj4+IDI0ICYgMHhmIHwgMHgxMDsgLy8gaW5jbHVkZSB2ZXJzaW9uXG5cbiAgYltpKytdID0gdG1oID4+PiAxNiAmIDB4ZmY7IC8vIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYCAoUGVyIDQuMi4yIC0gaW5jbHVkZSB2YXJpYW50KVxuXG4gIGJbaSsrXSA9IGNsb2Nrc2VxID4+PiA4IHwgMHg4MDsgLy8gYGNsb2NrX3NlcV9sb3dgXG5cbiAgYltpKytdID0gY2xvY2tzZXEgJiAweGZmOyAvLyBgbm9kZWBcblxuICBmb3IgKGxldCBuID0gMDsgbiA8IDY7ICsrbikge1xuICAgIGJbaSArIG5dID0gbm9kZVtuXTtcbiAgfVxuXG4gIHJldHVybiBidWYgfHwgc3RyaW5naWZ5KGIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2MTsiLCJpbXBvcnQgdjM1IGZyb20gJy4vdjM1LmpzJztcbmltcG9ydCBtZDUgZnJvbSAnLi9tZDUuanMnO1xuY29uc3QgdjMgPSB2MzUoJ3YzJywgMHgzMCwgbWQ1KTtcbmV4cG9ydCBkZWZhdWx0IHYzOyIsImltcG9ydCBzdHJpbmdpZnkgZnJvbSAnLi9zdHJpbmdpZnkuanMnO1xuaW1wb3J0IHBhcnNlIGZyb20gJy4vcGFyc2UuanMnO1xuXG5mdW5jdGlvbiBzdHJpbmdUb0J5dGVzKHN0cikge1xuICBzdHIgPSB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoc3RyKSk7IC8vIFVURjggZXNjYXBlXG5cbiAgY29uc3QgYnl0ZXMgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGJ5dGVzLnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpO1xuICB9XG5cbiAgcmV0dXJuIGJ5dGVzO1xufVxuXG5leHBvcnQgY29uc3QgRE5TID0gJzZiYTdiODEwLTlkYWQtMTFkMS04MGI0LTAwYzA0ZmQ0MzBjOCc7XG5leHBvcnQgY29uc3QgVVJMID0gJzZiYTdiODExLTlkYWQtMTFkMS04MGI0LTAwYzA0ZmQ0MzBjOCc7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAobmFtZSwgdmVyc2lvbiwgaGFzaGZ1bmMpIHtcbiAgZnVuY3Rpb24gZ2VuZXJhdGVVVUlEKHZhbHVlLCBuYW1lc3BhY2UsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHZhbHVlID0gc3RyaW5nVG9CeXRlcyh2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBuYW1lc3BhY2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICBuYW1lc3BhY2UgPSBwYXJzZShuYW1lc3BhY2UpO1xuICAgIH1cblxuICAgIGlmIChuYW1lc3BhY2UubGVuZ3RoICE9PSAxNikge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCdOYW1lc3BhY2UgbXVzdCBiZSBhcnJheS1saWtlICgxNiBpdGVyYWJsZSBpbnRlZ2VyIHZhbHVlcywgMC0yNTUpJyk7XG4gICAgfSAvLyBDb21wdXRlIGhhc2ggb2YgbmFtZXNwYWNlIGFuZCB2YWx1ZSwgUGVyIDQuM1xuICAgIC8vIEZ1dHVyZTogVXNlIHNwcmVhZCBzeW50YXggd2hlbiBzdXBwb3J0ZWQgb24gYWxsIHBsYXRmb3JtcywgZS5nLiBgYnl0ZXMgPVxuICAgIC8vIGhhc2hmdW5jKFsuLi5uYW1lc3BhY2UsIC4uLiB2YWx1ZV0pYFxuXG5cbiAgICBsZXQgYnl0ZXMgPSBuZXcgVWludDhBcnJheSgxNiArIHZhbHVlLmxlbmd0aCk7XG4gICAgYnl0ZXMuc2V0KG5hbWVzcGFjZSk7XG4gICAgYnl0ZXMuc2V0KHZhbHVlLCBuYW1lc3BhY2UubGVuZ3RoKTtcbiAgICBieXRlcyA9IGhhc2hmdW5jKGJ5dGVzKTtcbiAgICBieXRlc1s2XSA9IGJ5dGVzWzZdICYgMHgwZiB8IHZlcnNpb247XG4gICAgYnl0ZXNbOF0gPSBieXRlc1s4XSAmIDB4M2YgfCAweDgwO1xuXG4gICAgaWYgKGJ1Zikge1xuICAgICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDA7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgICAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlc1tpXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJ1ZjtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RyaW5naWZ5KGJ5dGVzKTtcbiAgfSAvLyBGdW5jdGlvbiNuYW1lIGlzIG5vdCBzZXR0YWJsZSBvbiBzb21lIHBsYXRmb3JtcyAoIzI3MClcblxuXG4gIHRyeSB7XG4gICAgZ2VuZXJhdGVVVUlELm5hbWUgPSBuYW1lOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZW1wdHlcbiAgfSBjYXRjaCAoZXJyKSB7fSAvLyBGb3IgQ29tbW9uSlMgZGVmYXVsdCBleHBvcnQgc3VwcG9ydFxuXG5cbiAgZ2VuZXJhdGVVVUlELkROUyA9IEROUztcbiAgZ2VuZXJhdGVVVUlELlVSTCA9IFVSTDtcbiAgcmV0dXJuIGdlbmVyYXRlVVVJRDtcbn0iLCJpbXBvcnQgcm5nIGZyb20gJy4vcm5nLmpzJztcbmltcG9ydCBzdHJpbmdpZnkgZnJvbSAnLi9zdHJpbmdpZnkuanMnO1xuXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgY29uc3Qgcm5kcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBybmcpKCk7IC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcblxuICBybmRzWzZdID0gcm5kc1s2XSAmIDB4MGYgfCAweDQwO1xuICBybmRzWzhdID0gcm5kc1s4XSAmIDB4M2YgfCAweDgwOyAvLyBDb3B5IGJ5dGVzIHRvIGJ1ZmZlciwgaWYgcHJvdmlkZWRcblxuICBpZiAoYnVmKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyArK2kpIHtcbiAgICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHJuZHNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuXG4gIHJldHVybiBzdHJpbmdpZnkocm5kcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHY0OyIsImltcG9ydCB2MzUgZnJvbSAnLi92MzUuanMnO1xuaW1wb3J0IHNoYTEgZnJvbSAnLi9zaGExLmpzJztcbmNvbnN0IHY1ID0gdjM1KCd2NScsIDB4NTAsIHNoYTEpO1xuZXhwb3J0IGRlZmF1bHQgdjU7IiwiaW1wb3J0IFJFR0VYIGZyb20gJy4vcmVnZXguanMnO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZSh1dWlkKSB7XG4gIHJldHVybiB0eXBlb2YgdXVpZCA9PT0gJ3N0cmluZycgJiYgUkVHRVgudGVzdCh1dWlkKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdmFsaWRhdGU7IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuXG5mdW5jdGlvbiB2ZXJzaW9uKHV1aWQpIHtcbiAgaWYgKCF2YWxpZGF0ZSh1dWlkKSkge1xuICAgIHRocm93IFR5cGVFcnJvcignSW52YWxpZCBVVUlEJyk7XG4gIH1cblxuICByZXR1cm4gcGFyc2VJbnQodXVpZC5zdWJzdHIoMTQsIDEpLCAxNik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZlcnNpb247IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY3J5cHRvXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==