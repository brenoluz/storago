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
    constructor(name, referer, config) {
        super(`${name}_id`);
        this.referer = referer;
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
const uuid_2 = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-node/index.js");
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
            }
            else {
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
    newModel() {
        return new this.Model((0, uuid_2.v4)());
    }
    populateFromDB(row, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (model == undefined) {
                model = this.newModel();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9hZGFwdGVyL2luZGV4LnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9kZWJ1Zy50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvYm9vbGVhbi50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvZGF0ZXRpbWUudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL2ZpZWxkLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC9pbmRleC50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvaW50ZWdlci50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvanNvbi50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvbWFueS50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvdGV4dC50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvdXVpZC50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL21pZ3JhdGlvbi50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvbW9kZWwudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL3NjaGVtYS50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL2luZGV4LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvbWQ1LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvbmlsLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvcGFyc2UuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS9yZWdleC5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3JuZy5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3NoYTEuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS9zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS92MS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3YzLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvdjM1LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvdjQuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS92NS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvdmVyc2lvbi5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImNyeXB0b1wiIiwid2VicGFjazovL0BzdG9yYWdvL29ybS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0BzdG9yYWdvL29ybS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHsgU2VsZWN0IH0gZnJvbSBcIi4vc2VsZWN0XCI7XG5leHBvcnQgeyBDcmVhdGUgfSBmcm9tIFwiLi9jcmVhdGVcIjtcbmV4cG9ydCB7IEluc2VydCB9IGZyb20gXCIuL2luc2VydFwiO1xuZXhwb3J0IHsgRHJvcCB9IGZyb20gXCIuL2Ryb3BcIjtcbmV4cG9ydCB7IHBhcmFtc1R5cGUgfSBmcm9tIFwiLi9xdWVyeVwiO1xuZXhwb3J0IHsgQWRhcHRlciB9IGZyb20gXCIuL2FkYXB0ZXJcIjtcbiIsImludGVyZmFjZSBEZWJ1Z3tcbiAgc2VsZWN0OiBib29sZWFuLFxuICBpbnNlcnQ6IGJvb2xlYW4sXG4gIGNyZWF0ZTogYm9vbGVhbixcbiAgZHJvcDogYm9vbGVhbixcbiAgcXVlcnk6IGJvb2xlYW4sXG59XG5cbmV4cG9ydCBsZXQgZGVidWc6IERlYnVnID0ge1xuICBzZWxlY3Q6IGZhbHNlLFxuICBpbnNlcnQ6IGZhbHNlLFxuICBjcmVhdGU6IGZhbHNlLFxuICBkcm9wOiBmYWxzZSxcbiAgcXVlcnk6IGZhbHNlLFxufSIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSBcIi4uXCI7XG5pbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4uL2FkYXB0ZXIvYWRhcHRlclwiO1xuaW1wb3J0IHsgQ29uZmlnLCBkZWZhdWx0Q29uZmlnLCBGaWVsZCwgRmllbGRLaW5kIH0gZnJvbSBcIi4vZmllbGRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBCb29sZWFuQ29uZmlnIGV4dGVuZHMgQ29uZmlnIHsgfVxuXG5leHBvcnQgY2xhc3MgQm9vbGVhbkZpZWxkIGV4dGVuZHMgRmllbGQge1xuXG4gIHJlYWRvbmx5IGNvbmZpZzogQm9vbGVhbkNvbmZpZztcbiAgcmVhZG9ubHkga2luZDogRmllbGRLaW5kID0gRmllbGRLaW5kLkJPT0xFQU47XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjb25maWc6IFBhcnRpYWw8Qm9vbGVhbkNvbmZpZz4gPSBkZWZhdWx0Q29uZmlnKSB7XG5cbiAgICBzdXBlcihuYW1lKTtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIC4uLmRlZmF1bHRDb25maWcsXG4gICAgICAuLi5jb25maWcsXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGZyb21EQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSwgdmFsdWU6IHN0cmluZyk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuXG4gICAgcmV0dXJuIGFkYXB0ZXIuZmllbGRUcmFuc2Zvcm1Gcm9tRGIodGhpcywgdmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHRvREI8QSBleHRlbmRzIEFkYXB0ZXIsIE0gZXh0ZW5kcyBNb2RlbD4oYWRhcHRlcjogQSwgbW9kZWw6IE0pOiBhbnkge1xuXG4gICAgbGV0IHZhbHVlID0gc3VwZXIudG9EQjxBLCBNPihhZGFwdGVyLCBtb2RlbCk7XG4gICAgcmV0dXJuIGFkYXB0ZXIuZmllbGRUcmFuc2Zvcm1Ub0RCPEJvb2xlYW5GaWVsZCwgTT4odGhpcywgdmFsdWUpO1xuICB9XG5cbiAgcHVibGljIGNhc3REQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSk6IHN0cmluZyB7XG5cbiAgICByZXR1cm4gYWRhcHRlci5maWVsZENhc3Q8Qm9vbGVhbkZpZWxkPih0aGlzKTtcbiAgfVxufSIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSBcIi4uXCI7XG5pbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4uL2FkYXB0ZXIvYWRhcHRlclwiO1xuaW1wb3J0IHsgQ29uZmlnLCBkZWZhdWx0Q29uZmlnLCBGaWVsZCwgRmllbGRLaW5kIH0gZnJvbSBcIi4vZmllbGRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBEYXRlVGltZUNvbmZpZyBleHRlbmRzIENvbmZpZyB7IH1cblxuZXhwb3J0IGNsYXNzIERhdGVUaW1lRmllbGQgZXh0ZW5kcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgY29uZmlnOiBEYXRlVGltZUNvbmZpZztcbiAgcmVhZG9ubHkga2luZDogRmllbGRLaW5kID0gRmllbGRLaW5kLkRBVEVUSU1FO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgY29uZmlnOiBQYXJ0aWFsPERhdGVUaW1lQ29uZmlnPiA9IGRlZmF1bHRDb25maWcpIHtcblxuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLi4uZGVmYXVsdENvbmZpZyxcbiAgICAgIC4uLmNvbmZpZyxcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZnJvbURCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBLCB2YWx1ZTogYW55KSA6IERhdGV8dW5kZWZpbmVkIHtcblxuICAgIGlmKHZhbHVlID09PSBudWxsKXtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBEYXRlKHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyB0b0RCPEEgZXh0ZW5kcyBBZGFwdGVyLCBNIGV4dGVuZHMgTW9kZWw+KGFkYXB0ZXI6IEEsIG1vZGVsOiBNKSA6IG51bWJlciB7XG4gICAgXG4gICAgbGV0IG5hbWUgPSB0aGlzLmdldE5hbWUoKTtcbiAgICBsZXQgdmFsdWUgPSBtb2RlbFtuYW1lIGFzIGtleW9mIE1dO1xuXG4gICAgaWYodmFsdWUgPT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0VmFsdWUoKTtcbiAgICB9XG5cbiAgICBpZih2YWx1ZSBpbnN0YW5jZW9mIERhdGUpe1xuICAgICAgcmV0dXJuIHZhbHVlLmdldFRpbWUoKTtcbiAgICB9XG5cbiAgICB0aHJvdyB7Y29kZTogbnVsbCwgbWVzc2FnZTogYHZhbHVlIG9mICR7bmFtZX0gdG8gREIgaXMgbm90IGEgRGF0ZWB9O1xuICB9XG5cbiAgcHVibGljIGNhc3REQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSk6IHN0cmluZyB7XG4gICAgXG4gICAgcmV0dXJuIGFkYXB0ZXIuZmllbGRDYXN0PERhdGVUaW1lRmllbGQ+KHRoaXMpO1xuICB9XG59IiwiaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gXCIuLi9hZGFwdGVyL2FkYXB0ZXJcIjtcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSBcIi4uL21vZGVsXCI7XG5cbmV4cG9ydCBlbnVtIGNvZGVGaWVsZEVycm9yIHtcbiAgJ0VuZ2luZU5vdEltcGxlbWVudGVkJyA9ICdAc3RvcmFnby9vcm0vZmllbGQvZW5naW5lTm90SW1wbGVtZW50ZWQnLFxuICAnRGVmYXVsdFZhbHVlSXNOb3RWYWxpZCcgPSAnQHN0b3JhZ28vb3JtL2ZpZWxkL2RlZmF1bHRQYXJhbU5vdFZhbGlkJyxcbiAgJ0luY29ycmVjdFZhbHVlVG9EYicgPSAnQHN0b3JhZ28vb3JtL2ZpZWxkL0luY29ycmVjdFZhbHVlVG9TdG9yYWdlT25EQicsXG4gICdSZWZlcmVyTm90Rm91bmQnID0gJ0BzdG9yYWdvL29ybS9maWVsZC9NYW55UmVsYXRpb25zaGlwJyxcbiAgJ0ZpZWxkS2luZE5vdFN1cHBvcnRlZCcgPSAnQHN0b3JhZ28vb3JtL2ZpZWxkL0ZpZWxkS2luZE5vdFN1cHBvcnRlZCcsXG59XG5cbmV4cG9ydCBlbnVtIEZpZWxkS2luZHtcbiAgVEVYVCxcbiAgVkFSQ0hBUixcbiAgQ0hBUkFDVEVSLFxuXG4gIElOVEVHRVIsXG4gIFRJTllJTlQsXG4gIFNNQUxMSU5ULFxuICBNRURJVU1JTlQsXG4gIEJJR0lOVCxcblxuICBSRUFMLFxuICBET1VCTEUsXG4gIEZMT0FULFxuXG4gIE5VTUVSSUMsXG4gIERFQ0lNQUwsXG4gIERBVEUsXG4gIERBVEVUSU1FLFxuICBCT09MRUFOLFxuXG4gIFVVSUQsXG4gIEpTT04sXG5cbiAgQkxPQixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb25maWcge1xuICBkZWZhdWx0PzogYW55O1xuICByZXF1aXJlZDogYm9vbGVhbjtcbiAgbGluaz86IHN0cmluZztcbiAgaW5kZXg6IGJvb2xlYW47XG4gIHByaW1hcnk6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0Q29uZmlnOiBDb25maWcgPSB7XG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgaW5kZXg6IGZhbHNlLFxuICBwcmltYXJ5OiBmYWxzZVxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRmllbGQge1xuXG4gIHJlYWRvbmx5IGFic3RyYWN0IGNvbmZpZzogQ29uZmlnO1xuICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG4gIGFic3RyYWN0IHJlYWRvbmx5IGtpbmQ6IEZpZWxkS2luZDsgXG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXROYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXREZWZhdWx0VmFsdWUoKTogYW55IHtcblxuICAgIGxldCB2YWx1ZURlZmF1bHQgPSB0aGlzLmNvbmZpZy5kZWZhdWx0O1xuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZURlZmF1bHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiB2YWx1ZURlZmF1bHQoKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHZhbHVlRGVmYXVsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWx1ZURlZmF1bHQgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZURlZmF1bHQ7XG4gIH1cblxuICBwdWJsaWMgaXNWaXJ0dWFsKCk6IGJvb2xlYW4ge1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmxpbmsgIT09IHVuZGVmaW5lZCAmJiAhdGhpcy5jb25maWcuaW5kZXgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qXG4gIHB1YmxpYyBhc3luYyBwb3B1bGF0ZShtb2RlbDogTW9kZWwsIHJvdzogeyBbaW5kZXg6IHN0cmluZ106IGFueTsgfSk6IFByb21pc2U8YW55PiB7XG5cbiAgICBsZXQgbmFtZSA9IHRoaXMuZ2V0TmFtZSgpO1xuICAgIGxldCB2YWx1ZSA9IHJvd1tuYW1lXTtcblxuICAgIC8qXG4gICAgaWYgKHRoaXMuY29uZmlnLmxpbmsgIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICBsZXQgbGlua3M6IHN0cmluZ1tdID0gdGhpcy5jb25maWcubGluay5zcGxpdCgnLicpO1xuICAgICAgbGV0IGl0ZW1OYW1lID0gbGlua3Muc2hpZnQoKTtcblxuICAgICAgaWYgKCFpdGVtTmFtZSB8fCBpdGVtTmFtZSBpbiBtb2RlbC5fX2RhdGEpIHtcbiAgICAgICAgbW9kZWxbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFsdWUgPSBhd2FpdCBtb2RlbC5fX2RhdGFbaXRlbU5hbWVdO1xuXG4gICAgICB3aGlsZSAoaXRlbU5hbWUgPSBsaW5rcy5zaGlmdCgpKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBpZiAoaXRlbU5hbWUgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWVbaXRlbU5hbWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gdGhpcy5mcm9tREIodmFsdWUpO1xuICB9XG4gICovXG4gIFxuIHB1YmxpYyB0b0RCPEEgZXh0ZW5kcyBBZGFwdGVyLCBNIGV4dGVuZHMgTW9kZWw+KGFkYXB0ZXI6IEEsIG1vZGVsOiBNKTogYW55IHtcbiAgIFxuICAgbGV0IG5hbWUgPSB0aGlzLmdldE5hbWUoKTtcbiAgIGxldCB2YWx1ZSA9IG1vZGVsW25hbWUgYXMga2V5b2YgTV07XG4gICBcbiAgIGlmKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpe1xuICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0VmFsdWUoKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIGFic3RyYWN0IGZyb21EQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSwgdmFsdWU6IGFueSk6IGFueTtcbiAgYWJzdHJhY3QgY2FzdERCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBKTogc3RyaW5nO1xuICBcbiAgcHVibGljIGlzSnNvbk9iamVjdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgXG4gIC8qXG4gIHByb3RlY3RlZCBkZWZpbmVTZXR0ZXIobGluazogc3RyaW5nLCBzY2hlbWE6IFNjaGVtYSwgbW9kZWw6IE1vZGVsLCB2YWx1ZTogYW55KSA6IHZvaWQge1xuXG4gICAgaWYgKGxpbmspIHtcbiAgICAgIGxldCBsaXN0TmFtZSA9IGxpbmsuc3BsaXQoJy4nKTtcbiAgICAgIGxldCBmaWVsZE5hbWUgPSBsaXN0TmFtZVswXTtcbiAgICAgIGxldCB0YXJnZXQgPSBsaXN0TmFtZS5wb3AoKTtcbiAgICAgIGxldCBmaWVsZCA9IHNjaGVtYS5nZXRGaWVsZChmaWVsZE5hbWUpO1xuICAgICAgbGV0IGl0ZW0gOiBhbnkgPSBtb2RlbDtcbiAgICAgIFxuICAgICAgaWYoZmllbGQuaXNKc29uT2JqZWN0KCkpe1xuICAgICAgICBsZXQgaXRlbU5hbWUgPSBsaXN0TmFtZS5zaGlmdCgpO1xuICAgICAgICB3aGlsZShpdGVtTmFtZSl7XG4gICAgICAgICAgXG4gICAgICAgICAgaWYodHlwZW9mIGl0ZW1baXRlbU5hbWVdICE9PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICBpdGVtW2l0ZW1OYW1lXSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICBpdGVtID0gaXRlbVtpdGVtTmFtZV07XG4gICAgICAgICAgaXRlbU5hbWUgPSBsaXN0TmFtZS5zaGlmdCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmKHRhcmdldCl7XG4gICAgICAgIGl0ZW1bdGFyZ2V0XSA9IHRoaXMucGFyc2VUb0RCKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZGVmaW5lR2V0dGVyKGxpbms6IHN0cmluZywgc2NoZW1hOiBTY2hlbWEsIG1vZGVsOiBNb2RlbCkgOiBhbnkge1xuXG4gICAgaWYgKGxpbmspIHtcbiAgICAgIGxldCBsaXN0TmFtZSA9IGxpbmsuc3BsaXQoJy4nKTtcbiAgICAgIGxldCBmaWVsZE5hbWUgPSBsaXN0TmFtZVswXTtcbiAgICAgIGxldCB0YXJnZXQgPSBsaXN0TmFtZS5wb3AoKTtcbiAgICAgIGxldCBmaWVsZCA9IHNjaGVtYS5nZXRGaWVsZChmaWVsZE5hbWUpO1xuICAgICAgbGV0IGl0ZW0gOiBhbnkgPSBtb2RlbDtcblxuICAgICAgaWYoZmllbGQuaXNKc29uT2JqZWN0KCkpe1xuICAgICAgICBsZXQgaXRlbU5hbWUgPSBsaXN0TmFtZS5zaGlmdCgpO1xuICAgICAgICB3aGlsZShpdGVtTmFtZSl7XG4gICAgICAgICAgXG4gICAgICAgICAgaWYodHlwZW9mIGl0ZW1baXRlbU5hbWVdICE9PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICByZXR1cm4gaXRlbVtpdGVtTmFtZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIGl0ZW0gPSBpdGVtW2l0ZW1OYW1lXTtcbiAgICAgICAgICBpdGVtTmFtZSA9IGxpc3ROYW1lLnNoaWZ0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYodGFyZ2V0KXtcbiAgICAgICAgcmV0dXJuIGl0ZW1bdGFyZ2V0XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIFxuICBwdWJsaWMgZGVmaW5lUHJvcGVydHkoc2NoZW1hOiBTY2hlbWEsIG1vZGVsOiBNb2RlbCk6IHZvaWQge1xuICAgIFxuICAgIFxuICAgIGxldCBsaW5rID0gdGhpcy5jb25maWcubGluaztcbiAgICBpZiAobGluaykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZGVsLCB0aGlzLm5hbWUsIHtcbiAgICAgICAgJ3NldCc6IHRoaXMuZGVmaW5lU2V0dGVyLmJpbmQodGhpcywgbGluaywgc2NoZW1hLCBtb2RlbCksXG4gICAgICAgICdnZXQnOiB0aGlzLmRlZmluZUdldHRlci5iaW5kKHRoaXMsIGxpbmssIHNjaGVtYSwgbW9kZWwpLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gICovXG5cbn1cbiIsImV4cG9ydCB7IEZpZWxkLCBGaWVsZEtpbmQsIGNvZGVGaWVsZEVycm9yIH0gZnJvbSBcIi4vZmllbGRcIjtcblxuaW1wb3J0IHsgVGV4dEZpZWxkIH0gZnJvbSBcIi4vdGV4dFwiO1xuaW1wb3J0IHsgVVVJREZpZWxkIH0gZnJvbSBcIi4vdXVpZFwiO1xuaW1wb3J0IHsgSnNvbkZpZWxkIH0gZnJvbSBcIi4vanNvblwiO1xuaW1wb3J0IHsgTWFueUZpZWxkIH0gZnJvbSBcIi4vbWFueVwiO1xuaW1wb3J0IHsgSW50ZWdlckZpZWxkIH0gZnJvbSBcIi4vaW50ZWdlclwiO1xuaW1wb3J0IHsgQm9vbGVhbkZpZWxkIH0gZnJvbSBcIi4vYm9vbGVhblwiO1xuaW1wb3J0IHsgRGF0ZVRpbWVGaWVsZCB9IGZyb20gXCIuL2RhdGV0aW1lXCI7XG5cbmV4cG9ydCBjb25zdCBmaWVsZHMgPSB7XG4gIFRleHRGaWVsZCxcbiAgVVVJREZpZWxkLFxuICBKc29uRmllbGQsXG4gIE1hbnlGaWVsZCxcbiAgSW50ZWdlckZpZWxkLFxuICBCb29sZWFuRmllbGQsXG4gIERhdGVUaW1lRmllbGQsXG59XG4iLCJpbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4uL2FkYXB0ZXIvYWRhcHRlclwiO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IEZpZWxkLCBDb25maWcsIGRlZmF1bHRDb25maWcsIEZpZWxkS2luZCB9IGZyb20gXCIuL2ZpZWxkXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW50ZWdlckNvbmZpZyBleHRlbmRzIENvbmZpZyB7IH1cblxuZXhwb3J0IGNsYXNzIEludGVnZXJGaWVsZCBleHRlbmRzIEZpZWxkIHtcblxuICByZWFkb25seSBjb25maWc6IEludGVnZXJDb25maWc7XG4gIHJlYWRvbmx5IGtpbmQ6IEZpZWxkS2luZCA9IEZpZWxkS2luZC5JTlRFR0VSO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgY29uZmlnOiBQYXJ0aWFsPEludGVnZXJDb25maWc+ID0gZGVmYXVsdENvbmZpZykge1xuXG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmcm9tREI8QSBleHRlbmRzIEFkYXB0ZXI+KGFkYXB0ZXI6IEEsIHZhbHVlOiBzdHJpbmcpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuXG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHRocm93IHsgY29kZTogbnVsbCwgbWVzc2FnZTogJ3ZhbHVlIGZyb20gREIgaXMgbm90IGEgbnVtYmVyJyB9O1xuICB9XG5cbiAgcHVibGljIHRvREI8QSBleHRlbmRzIEFkYXB0ZXIsIE0gZXh0ZW5kcyBNb2RlbD4oYWRhcHRlcjogQSwgbW9kZWw6IE0pOiBhbnkge1xuXG4gICAgbGV0IG5hbWUgPSB0aGlzLmdldE5hbWUoKTtcbiAgICBsZXQgdmFsdWUgPSBtb2RlbFtuYW1lIGFzIGtleW9mIE1dO1xuXG4gICAgaWYgKHZhbHVlID09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVmYXVsdFZhbHVlKCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKHZhbHVlKTtcbiAgICB9XG5cbiAgICB0aHJvdyB7IGNvZGU6IG51bGwsIG1lc3NhZ2U6IGB2YWx1ZSBvZiAkeyBuYW1lIH0gdG8gREIgaXMgbm90IGEgaW50ZWdlcmAgfTtcbiAgfVxuXG4gIHB1YmxpYyBjYXN0REI8QSBleHRlbmRzIEFkYXB0ZXI+KGFkYXB0ZXI6IEEpOiBzdHJpbmcge1xuXG4gICAgcmV0dXJuIGFkYXB0ZXIuZmllbGRDYXN0PEludGVnZXJGaWVsZD4odGhpcyk7XG4gIH1cbn0iLCJpbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4uL2FkYXB0ZXIvYWRhcHRlclwiO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IEZpZWxkLCBDb25maWcsIGRlZmF1bHRDb25maWcsIGNvZGVGaWVsZEVycm9yLCBGaWVsZEtpbmQgfSBmcm9tIFwiLi9maWVsZFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEpzb25Db25maWcgZXh0ZW5kcyBDb25maWcge1xuICB0eXBlOiAnbGlzdCcgfCAnb2JqZWN0JyxcbiAgZGVmYXVsdD86ICdzdHJpbmcnIHwgRnVuY3Rpb24gfCBPYmplY3Q7XG59XG5cbmxldCBqc29uRGVmYXVsdENvbmZpZzogSnNvbkNvbmZpZyA9IHtcbiAgLi4uZGVmYXVsdENvbmZpZyxcbiAgdHlwZTogJ29iamVjdCcsXG59XG5cbmV4cG9ydCBjbGFzcyBKc29uRmllbGQgZXh0ZW5kcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgY29uZmlnOiBKc29uQ29uZmlnO1xuICByZWFkb25seSBraW5kOiBGaWVsZEtpbmQgPSBGaWVsZEtpbmQuSlNPTjtcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGNvbmZpZzogUGFydGlhbDxKc29uQ29uZmlnPiA9IGpzb25EZWZhdWx0Q29uZmlnKSB7XG5cbiAgICBzdXBlcihuYW1lKTtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIC4uLmpzb25EZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgZ2V0RGVmYXVsdFZhbHVlKCk6IGFueSB7XG5cbiAgICBsZXQgdmFsdWVEZWZhdWx0ID0gc3VwZXIuZ2V0RGVmYXVsdFZhbHVlKCk7XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlRGVmYXVsdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlRGVmYXVsdCA9IEpTT04ucGFyc2UodmFsdWVEZWZhdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhyb3cge1xuICAgICAgICAgIGNvZGU6IGNvZGVGaWVsZEVycm9yLkRlZmF1bHRWYWx1ZUlzTm90VmFsaWQsXG4gICAgICAgICAgbWVzc2FnZTogYERlZmF1bHQgdmFsdWUgb24gSlNPTiBmaWVsZCBpcyBub3QgYSB2YWxpZCBqc29uYFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZURlZmF1bHQ7XG4gIH1cblxuICBwdWJsaWMgZnJvbURCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBLCB2YWx1ZTogc3RyaW5nIHwgbnVsbCk6IG9iamVjdCB8IHVuZGVmaW5lZCB7XG5cbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlID09PSAnJykge1xuICAgICAgbGV0IHR5cGUgPSB0aGlzLmNvbmZpZy50eXBlO1xuICAgICAgaWYgKHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL3JldHVybiBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICByZXR1cm4gYWRhcHRlci5maWVsZFRyYW5zZm9ybUZyb21EYjxKc29uRmllbGQ+KHRoaXMsIHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBjYXN0REI8QSBleHRlbmRzIEFkYXB0ZXI+KGFkYXB0ZXI6IEEpOiBzdHJpbmcge1xuXG4gICAgcmV0dXJuIGFkYXB0ZXIuZmllbGRDYXN0PEpzb25GaWVsZD4odGhpcyk7XG4gIH1cblxuICBwdWJsaWMgaXNKc29uT2JqZWN0KCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmNvbmZpZy50eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHVibGljIHRvREI8QSBleHRlbmRzIEFkYXB0ZXIsIE0gZXh0ZW5kcyBNb2RlbD4oYWRhcHRlcjogQSwgbW9kZWw6IE0pOiBzdHJpbmcgfCBudWxsIHtcblxuICAgIGxldCB2YWx1ZSA9IHN1cGVyLnRvREIoYWRhcHRlciwgbW9kZWwpO1xuXG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdHJpbmdpZnlUb0RiKHZhbHVlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdHJpbmdpZnlUb0RiKHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuXG4gICAgbGV0IGtpbmQgPSB0aGlzLmNvbmZpZy50eXBlO1xuICAgIGxldCBlcnJvciA9IHtcbiAgICAgIGNvZGU6IGNvZGVGaWVsZEVycm9yLkluY29ycmVjdFZhbHVlVG9EYixcbiAgICAgIG1lc3NhZ2U6IGB2YWx1ZSBpcyBub3QgYSB2YWxpZCBqc29uYCxcbiAgICB9O1xuXG4gICAgLyogVGVzdCBpZiB2YWx1ZSBpcyB2YWxpZCAqL1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBKU09OLnBhcnNlKHZhbHVlKTsgLy9qdXN0IHRlc3RcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgaWYgKGtpbmQgIT09ICdsaXN0Jykge1xuICAgICAgICAgICAgZXJyb3IubWVzc2FnZSA9ICdKU09OIGlzIGEgb2JqZWN0LCBidXQgbXVzdCBiZSBhIGxpc3QnO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChraW5kICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgZXJyb3IubWVzc2FnZSA9ICdKU09OIGlzIGEgbGlzdCwgYnV0IG11c3QgYmUgYSBvYmplY3QnO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qIGNvbnZlcnQgdG8gc3RyaW5nICovXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn0iLCJpbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgVVVJREZpZWxkIH0gZnJvbSBcIi4vdXVpZFwiO1xuaW1wb3J0IHsgQ29uZmlnLCBkZWZhdWx0Q29uZmlnIH0gZnJvbSBcIi4vZmllbGRcIjtcbmltcG9ydCB7IFNjaGVtYSB9IGZyb20gXCIuLlwiO1xuXG5leHBvcnQgY2xhc3MgTWFueUZpZWxkIGV4dGVuZHMgVVVJREZpZWxkIHtcblxuICByZWFkb25seSBjb25maWc6IENvbmZpZztcbiAgcHJvdGVjdGVkIHJlZmVyZXI6IHR5cGVvZiBNb2RlbDtcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHJlZmVyZXI6IHR5cGVvZiBNb2RlbCwgY29uZmlnPzogUGFydGlhbDxDb25maWc+KSB7XG5cbiAgICBzdXBlcihgJHsgbmFtZSB9X2lkYCk7XG4gICAgdGhpcy5yZWZlcmVyID0gcmVmZXJlcjtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIC4uLmRlZmF1bHRDb25maWcsXG4gICAgICAuLi5jb25maWcsXG4gICAgfVxuICB9XG5cbiAgLypcbiAgcHVibGljIGRlZmluZVByb3BlcnR5KHNjaGVtYTogU2NoZW1hLCBtb2RlbDogTW9kZWwpOiB2b2lkIHtcbiAgICBcbiAgICBsZXQgY29sdW1uID0gdGhpcy5nZXROYW1lKCk7XG4gICAgbGV0IG5hbWUgPSBjb2x1bW4ucmVwbGFjZSgnX2lkJywgJycpO1xuICAgIGxldCBwcm94eSA9IHRoaXM7XG4gICAgbW9kZWxbbmFtZV0gPSBhc3luYyBmdW5jdGlvbihpdGVtPzogdHlwZW9mIHRoaXMucmVmZXJlcnxzdHJpbmcpIDogUHJvbWlzZTxNb2RlbHx2b2lkfHVuZGVmaW5lZD57XG4gICAgICBcbiAgICAgIGlmKGl0ZW0gPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgbGV0IGlkUmVmZXJlciA9IG1vZGVsW2NvbHVtbl07IFxuICAgICAgICByZXR1cm4gcHJveHkucmVmZXJlci5maW5kKCdpZCA9ID8nLCBpZFJlZmVyZXIpO1xuICAgICAgfVxuXG4gICAgICBpZihpdGVtIGluc3RhbmNlb2YgcHJveHkucmVmZXJlcil7XG4gICAgICAgIG1vZGVsW2NvbHVtbl0gPSBpdGVtLmlkO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICB9XG5cbiAgICAgIGxldCByZWYgPSBhd2FpdCBwcm94eS5yZWZlcmVyLmZpbmQoJ2lkID0gPycsIGl0ZW0pO1xuICAgICAgaWYocmVmID09PSB1bmRlZmluZWQpe1xuICAgICAgICB0aHJvdyB7Y29kZTogY29kZUVycm9yLlJlZmVyZXJOb3RGb3VuZCwgbWVzc2FnZTogYE5vdCBmb3VuZCAke2l0ZW19IG9uIHRhYmxlICR7bmFtZX1gfTtcbiAgICAgIH1cbiAgICAgIG1vZGVsW2NvbHVtbl0gPSByZWYuaWQ7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICB9XG4gICovXG59IiwiaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi4vYWRhcHRlci9hZGFwdGVyXCI7XG5pbXBvcnQgeyBGaWVsZCwgQ29uZmlnLCBkZWZhdWx0Q29uZmlnLCBGaWVsZEtpbmQgfSBmcm9tIFwiLi9maWVsZFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRleHRDb25maWcgZXh0ZW5kcyBDb25maWcgeyB9XG5cbmV4cG9ydCBjbGFzcyBUZXh0RmllbGQgZXh0ZW5kcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgY29uZmlnOiBUZXh0Q29uZmlnO1xuICByZWFkb25seSBraW5kOiBGaWVsZEtpbmQgPSBGaWVsZEtpbmQuVEVYVDtcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGNvbmZpZzogUGFydGlhbDxUZXh0Q29uZmlnPiA9IGRlZmF1bHRDb25maWcpIHtcblxuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLi4uZGVmYXVsdENvbmZpZyxcbiAgICAgIC4uLmNvbmZpZyxcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZnJvbURCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBLCB2YWx1ZTogc3RyaW5nfG51bGwpOiBzdHJpbmd8dW5kZWZpbmVkIHtcblxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyB0b0RCPEEgZXh0ZW5kcyBBZGFwdGVyLCBUIGV4dGVuZHMgTW9kZWw+KGFkYXB0ZXI6IEEsIG1vZGVsOiBUKTogc3RyaW5nfG51bGwge1xuXG4gICAgbGV0IG5hbWUgPSB0aGlzLmdldE5hbWUoKTtcbiAgICBsZXQgdmFsdWUgPSBtb2RlbFtuYW1lIGFzIGtleW9mIFRdO1xuXG4gICAgaWYodmFsdWUgPT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0VmFsdWUoKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlLnRyaW0oKTtcbiAgICB9XG5cbiAgICB0aHJvdyB7Y29kZTogbnVsbCwgbWVzc2FnZTogYHZhbHVlIG9mICR7bmFtZX0gdG8gREIgaXMgbm90IGEgc3RyaW5nYH07XG4gIH1cblxuICBwdWJsaWMgY2FzdERCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBKTogc3RyaW5nIHtcblxuICAgIHJldHVybiBhZGFwdGVyLmZpZWxkQ2FzdDxUZXh0RmllbGQ+KHRoaXMpO1xuICB9XG59IiwiaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gXCIuLi9hZGFwdGVyL2FkYXB0ZXJcIjtcbmltcG9ydCB7IEZpZWxkLCBDb25maWcsIGRlZmF1bHRDb25maWcsIEZpZWxkS2luZCB9IGZyb20gXCIuL2ZpZWxkXCI7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuXG5leHBvcnQgY2xhc3MgVVVJREZpZWxkIGV4dGVuZHMgRmllbGQge1xuXG4gIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnO1xuICByZWFkb25seSBraW5kOiBGaWVsZEtpbmQgPSBGaWVsZEtpbmQuVVVJRDtcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGNvbmZpZzogUGFydGlhbDxDb25maWc+ID0gZGVmYXVsdENvbmZpZykge1xuXG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgY2FzdERCKGFkYXB0ZXI6IEFkYXB0ZXIpOiBzdHJpbmcge1xuXG4gICAgcmV0dXJuIGFkYXB0ZXIuZmllbGRDYXN0PFVVSURGaWVsZD4odGhpcyk7XG4gIH1cblxuICBwdWJsaWMgZnJvbURCKHZhbHVlOiBhbnkpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhyb3cgeyBjb2RlOiBudWxsLCBtZXNzYWdlOiAndmFsdWUgZnJvbSBEQiBpcyBub3QgYSB2YWxpZCB1dWlkJyB9O1xuICB9XG5cbiAgcHVibGljIGdldERlZmF1bHRWYWx1ZSgpOiBhbnkge1xuXG4gICAgbGV0IHZhbHVlID0gc3VwZXIuZ2V0RGVmYXVsdFZhbHVlKCk7XG5cbiAgICBpZiAodmFsdWUgPT09IG51bGwgJiYgdGhpcy5jb25maWcucHJpbWFyeSkge1xuICAgICAgdmFsdWUgPSB1dWlkKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHRvREI8QSBleHRlbmRzIEFkYXB0ZXIsIE0gZXh0ZW5kcyBNb2RlbD4oYWRhcHRlcjogQSwgbW9kZWw6IE0pOiBhbnkge1xuXG4gICAgbGV0IHZhbHVlID0gc3VwZXIudG9EQjxBLCBNPihhZGFwdGVyLCBtb2RlbCk7XG4gICAgcmV0dXJuIGFkYXB0ZXIuZmllbGRUcmFuc2Zvcm1Ub0RCPFVVSURGaWVsZCwgTT4odGhpcywgdmFsdWUpO1xuICB9XG59IiwiZXhwb3J0IHsgZGVidWcgfSBmcm9tICcuL2RlYnVnJztcblxuZXhwb3J0IHsgTW9kZWwsIENvbnN0cnVjdG9yTW9kZWwgfSBmcm9tICcuL21vZGVsJztcbmV4cG9ydCB7IFNjaGVtYSB9IGZyb20gJy4vc2NoZW1hJztcbmV4cG9ydCAqIGZyb20gJy4vYWRhcHRlcic7XG5leHBvcnQgeyBmaWVsZHMsIEZpZWxkLCBGaWVsZEtpbmQsIGNvZGVGaWVsZEVycm9yIH0gZnJvbSAnLi9maWVsZCc7XG5leHBvcnQgeyBNaWdyYXRpb24gfSBmcm9tICcuL21pZ3JhdGlvbic7XG5cbi8vZXhwb3J0IHsgc2Vzc2lvbiwgc2V0RGVmYXVsdEFkYXB0ZXIsIGdldERlZmF1bHRBZGFwdGVyIH0gZnJvbSAnLi9zZXNzaW9uJzsiLCJpbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4vYWRhcHRlci9hZGFwdGVyXCI7XG5cbnR5cGUgdGFza0NhbGxiYWNrID0geyAodHJhbnNhY3Rpb246IGFueSk6IFByb21pc2U8dm9pZD4gfTtcblxuaW50ZXJmYWNlIHRhc2tWZXJzaW9uIHtcbiAgW3ZlcnNpb246IG51bWJlcl06IHRhc2tDYWxsYmFjaztcbn07XG5cbmV4cG9ydCBjbGFzcyBNaWdyYXRpb24ge1xuXG4gIHByb3RlY3RlZCBhZGFwdGVyOiBBZGFwdGVyO1xuICBwcml2YXRlIHRhc2tzOiB0YXNrVmVyc2lvbiA9IHt9O1xuICBwcml2YXRlIGZpcnN0QWNjZXNzPzogdGFza0NhbGxiYWNrO1xuXG4gIGNvbnN0cnVjdG9yKGFkYXB0ZXI6IEFkYXB0ZXIpIHtcbiAgICB0aGlzLmFkYXB0ZXIgPSBhZGFwdGVyO1xuICB9XG5cbiAgcHJvdGVjdGVkIG1ha2UoKTogdm9pZCB7IH1cblxuICBwdWJsaWMgYXN5bmMgcnVuKCk6IFByb21pc2U8dm9pZD4ge1xuXG4gICAgdGhpcy5tYWtlKCk7XG5cbiAgICBpZiAodGhpcy5maXJzdEFjY2VzcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyB7IGNvZGU6IG51bGwsIG1lc3NhZ2U6IGBGaXJzdEFjY2VzcyBNaWdyYXRpb24gbm90IGltcGxlbWVudGVkIWAgfTtcbiAgICB9XG5cbiAgICAvKlxuICAgIGxldCB2ZXJzaW9uID0gdGhpcy5hZGFwdGVyLmdldFZlcnNpb24oKTtcbiAgICBpZiAodmVyc2lvbiA9PT0gJycpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuY2hhbmdlVmVyc2lvbigwLCB0aGlzLmZpcnN0QWNjZXNzKTtcbiAgICB9XG4gICAgXG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuXG4gICAgICB2ZXJzaW9uKys7XG4gICAgICBsZXQgdGFzayA9IHRoaXMudGFza3NbdmVyc2lvbl07XG4gICAgICBpZiAodGFzayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCB0aGlzLmFkYXB0ZXIuY2hhbmdlVmVyc2lvbih2ZXJzaW9uLCB0YXNrKTtcbiAgICB9XG4qL1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZWdpc3RlckZpcnN0QWNjZXNzKGNhbGxiYWNrOiB0YXNrQ2FsbGJhY2spOiB2b2lkIHtcblxuICAgIGlmICh0aGlzLmZpcnN0QWNjZXNzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IHsgY29kZTogdW5kZWZpbmVkLCBtZXNzYWdlOiBgZmlyc3RBY2Nlc3MgY2FsbGJhY2sgYWxyZWFkeSByZWdpc3RlcmVkYCB9O1xuICAgIH1cblxuICAgIHRoaXMuZmlyc3RBY2Nlc3MgPSBjYWxsYmFjaztcbiAgfVxuXG4gIHByb3RlY3RlZCByZWdpc3Rlcih2ZXJzaW9uOiBudW1iZXIsIGNhbGxiYWNrOiB0YXNrQ2FsbGJhY2spOiB2b2lkIHtcblxuICAgIGlmICh0aGlzLnRhc2tzW3ZlcnNpb25dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IHsgY29kZTogdW5kZWZpbmVkLCBtZXNzYWdlOiBgY2FsbGJhY2sgdmVyc2lvbiAkeyB2ZXJzaW9uIH0gYWxyZWFkeSByZWdpc3RlcmVkYCB9O1xuICAgIH1cblxuICAgIHRoaXMudGFza3NbdmVyc2lvbl0gPSBjYWxsYmFjaztcbiAgfVxufSIsImltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi9hZGFwdGVyXCI7XG5pbXBvcnQgeyBTY2hlbWEgfSBmcm9tIFwiLi9zY2hlbWFcIjtcblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3JNb2RlbDxNIGV4dGVuZHMgTW9kZWw+ID0gbmV3IChpZDogc3RyaW5nKSA9PiBNO1xuXG5leHBvcnQgY2xhc3MgTW9kZWx7XG5cbiAgcmVhZG9ubHkgaWQ6IHN0cmluZztcblxuICBwdWJsaWMgX19kYXRhPzogb2JqZWN0O1xuXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLmlkID0gaWQ7XG4gIH1cbn1cblxuIiwiaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gXCIuL2FkYXB0ZXIvYWRhcHRlclwiO1xuaW1wb3J0IHsgU2VsZWN0IH0gZnJvbSBcIi4vYWRhcHRlci9zZWxlY3RcIjtcbmltcG9ydCB7IEluc2VydCB9IGZyb20gXCIuL2FkYXB0ZXIvaW5zZXJ0XCI7XG5pbXBvcnQgeyBEcm9wIH0gZnJvbSBcIi4vYWRhcHRlci9kcm9wXCI7XG5pbXBvcnQgeyBwYXJhbXNUeXBlIH0gZnJvbSBcIi4vYWRhcHRlci9xdWVyeVwiO1xuaW1wb3J0IHsgTW9kZWwsIENvbnN0cnVjdG9yTW9kZWwgfSBmcm9tIFwiLi9tb2RlbFwiO1xuaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi9maWVsZC9maWVsZFwiO1xuaW1wb3J0IHsgQ3JlYXRlIH0gZnJvbSBcIi4vYWRhcHRlci9jcmVhdGVcIjtcbmltcG9ydCB7IFVVSURGaWVsZCB9IGZyb20gXCIuL2ZpZWxkL3V1aWRcIjtcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcblxuZXhwb3J0IGVudW0gY29kZVNjaGVtYUVycm9yIHtcbiAgJ1Bvc3RTYXZlTm90Rm91bmQnID0gJ0BzdG9yYWdvL29ybS9zY2hlbWEvUG9zdFNhdmVOb3RGb3VuZCcsXG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTY2hlbWE8QSBleHRlbmRzIEFkYXB0ZXIsIE0gZXh0ZW5kcyBNb2RlbD4ge1xuXG4gIGFic3RyYWN0IHJlYWRvbmx5IE1vZGVsOiBDb25zdHJ1Y3Rvck1vZGVsPE0+O1xuICBhYnN0cmFjdCByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgcmVhZG9ubHkgZmllbGRzOiBGaWVsZFtdID0gW107XG5cbiAgcmVhZG9ubHkgYWRhcHRlcjogQTtcblxuICBwcm90ZWN0ZWQgc3VwZXJGaWVsZHM6IEZpZWxkW10gPSBbXG4gICAgbmV3IFVVSURGaWVsZCgnaWQnLCB7IHByaW1hcnk6IHRydWUgfSksXG4gIF07XG5cbiAgY29uc3RydWN0b3IoYWRhcHRlcjogQSkge1xuXG4gICAgdGhpcy5hZGFwdGVyID0gYWRhcHRlcjtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzYXZlKG1vZGVsOiBNKTogUHJvbWlzZTxNPiB7XG5cbiAgICBpZiAobW9kZWwuX19kYXRhKSB7XG4gICAgICAvL3VwZGF0ZSBhcmVhXG4gICAgfSBlbHNlIHtcblxuICAgICAgbGV0IGluc2VydCA9IHRoaXMuaW5zZXJ0KCk7XG4gICAgICBpbnNlcnQuYWRkKG1vZGVsKTtcbiAgICAgIGF3YWl0IGluc2VydC5zYXZlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucmVmcmVzaE1vZGVsKG1vZGVsKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyByZWZyZXNoTW9kZWwobW9kZWw6IE0pOiBQcm9taXNlPE0+IHtcblxuICAgIGxldCBpZCA9IG1vZGVsWydpZCddO1xuXG4gICAgbGV0IGl0ZW0gPSBhd2FpdCB0aGlzLmZpbmQoJ2lkID0gPycsIGlkKTtcbiAgICBpZiAoaXRlbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyB7IGNvZGU6IGNvZGVTY2hlbWFFcnJvci5Qb3N0U2F2ZU5vdEZvdW5kLCBtZXNzYWdlOiBgRmFpbCB0byBmaW5kIGlkOiAke2lkfWAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wb3B1bGF0ZUZyb21EQihpdGVtLCBtb2RlbCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0TW9kZWxDbGFzcygpOiBDb25zdHJ1Y3Rvck1vZGVsPE0+IHtcblxuICAgIHJldHVybiB0aGlzLk1vZGVsO1xuICB9XG5cbiAgcHVibGljIGdldE5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xuICB9XG5cbiAgcHVibGljIGdldEZpZWxkcygpOiBGaWVsZFtdIHtcblxuICAgIHJldHVybiBbLi4udGhpcy5zdXBlckZpZWxkcywgLi4udGhpcy5maWVsZHNdO1xuICB9XG5cbiAgcHVibGljIGdldEZpZWxkKG5hbWU6IHN0cmluZyk6IEZpZWxkIHtcblxuICAgIGZvciAobGV0IGZpZWxkIG9mIHRoaXMuZ2V0RmllbGRzKCkpIHtcbiAgICAgIGlmIChuYW1lID09IGZpZWxkLmdldE5hbWUoKSkge1xuICAgICAgICByZXR1cm4gZmllbGQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhyb3cgeyBjb2RlOiBudWxsLCBtZXNzYWdlOiBgRmllbGQgd2l0aCBuYW1lOiAke25hbWV9IG5vdCBleGlzdHMgaW4gJHt0aGlzLm5hbWV9YCB9O1xuICB9XG5cbiAgcHVibGljIGdldENvbHVtbnMoKTogc3RyaW5nW10ge1xuXG4gICAgbGV0IGNvbHVtbnM6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IGZpZWxkcyA9IHRoaXMuZ2V0RmllbGRzKCk7XG4gICAgZm9yIChsZXQgZmllbGQgb2YgdGhpcy5nZXRGaWVsZHMoKSkge1xuICAgICAgY29sdW1ucy5wdXNoKGZpZWxkLmdldE5hbWUoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbHVtbnM7XG4gIH1cblxuICBwdWJsaWMgZmluZCh3aGVyZTogc3RyaW5nLCBwYXJhbTogcGFyYW1zVHlwZSk6IFByb21pc2U8TSB8IHVuZGVmaW5lZD4ge1xuXG4gICAgbGV0IHNlbGVjdCA9IHRoaXMuc2VsZWN0KCk7XG4gICAgc2VsZWN0LndoZXJlKHdoZXJlLCBwYXJhbSk7XG4gICAgcmV0dXJuIHNlbGVjdC5vbmUoKTtcbiAgfTtcblxuICBwdWJsaWMgZ2V0QWRhcHRlcigpOiBBIHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyO1xuICB9XG5cbiAgcHVibGljIHNlbGVjdCgpOiBTZWxlY3Q8TT4ge1xuICAgIGxldCBzZWxlY3QgPSB0aGlzLmFkYXB0ZXIuc2VsZWN0PE0+KHRoaXMpO1xuICAgIHNlbGVjdC5mcm9tKHRoaXMuZ2V0TmFtZSgpLCB0aGlzLmdldENvbHVtbnMoKSk7XG4gICAgcmV0dXJuIHNlbGVjdDtcbiAgfVxuXG4gIHB1YmxpYyBpbnNlcnQoKTogSW5zZXJ0PE0+IHtcbiAgICBsZXQgaW5zZXJ0ID0gdGhpcy5hZGFwdGVyLmluc2VydDxNPih0aGlzKTtcbiAgICByZXR1cm4gaW5zZXJ0O1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZVRhYmxlKCk6IENyZWF0ZTxNPiB7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5jcmVhdGU8TT4odGhpcyk7XG4gIH1cblxuICBwdWJsaWMgZHJvcCgpOiBEcm9wPE0+IHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmRyb3A8TT4odGhpcyk7XG4gIH1cblxuICBwdWJsaWMgbmV3TW9kZWwoKTogTSB7XG5cbiAgICByZXR1cm4gbmV3IHRoaXMuTW9kZWwodXVpZCgpKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBwb3B1bGF0ZUZyb21EQihyb3c6IHsgW2luZGV4OiBzdHJpbmddOiBhbnk7IH0sIG1vZGVsPzogTSk6IFByb21pc2U8TT4ge1xuXG4gICAgaWYgKG1vZGVsID09IHVuZGVmaW5lZCkge1xuICAgICAgbW9kZWwgPSB0aGlzLm5ld01vZGVsKCk7XG4gICAgfVxuXG4gICAgbGV0IGZpZWxkcyA9IHRoaXMuZ2V0RmllbGRzKCk7XG4gICAgbW9kZWwuX19kYXRhID0gcm93O1xuICAgIGZvciAobGV0IGZpZWxkIG9mIGZpZWxkcykge1xuICAgICAgbGV0IG5hbWUgPSBmaWVsZC5nZXROYW1lKCk7XG4gICAgICBpZiAobmFtZSA9PSAnaWQnKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgbW9kZWxbbmFtZSBhcyBrZXlvZiBNXSA9IGZpZWxkLmZyb21EQih0aGlzLmFkYXB0ZXIsIHJvd1tuYW1lXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZGVsO1xuICB9XG5cbiAgLypcbiAgcHVibGljIGFzeW5jIHBvcHVsYXRlRnJvbURCPFQgZXh0ZW5kcyBNb2RlbD4ocm93OiB7IFtpbmRleDogc3RyaW5nXTogYW55OyB9LCBtb2RlbDogVCk6IFByb21pc2U8VD4ge1xuXG4gICAgbGV0IHByb21pc2VzOiBQcm9taXNlPGFueT5bXSA9IFtdO1xuICAgIGxldCBmaWVsZHMgPSB0aGlzLmdldFJlYWxGaWVsZHMoKTtcbiAgICBsZXQga2V5czogc3RyaW5nW10gPSBbXTtcbiAgXG4gICAgZm9yIChsZXQgZmllbGQgb2YgZmllbGRzKSB7XG4gICAgICBsZXQgbmFtZSA9IGZpZWxkLmdldE5hbWUoKTtcbiAgICAgIGxldCBwcm9taXNlUG9wdWxhdGUgPSBmaWVsZC5wb3B1bGF0ZShtb2RlbCwgcm93KTtcbiAgICAgIG1vZGVsLl9fZGF0YVtuYW1lXSA9IHByb21pc2VQb3B1bGF0ZTtcbiAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZVBvcHVsYXRlKTtcbiAgICAgIGtleXMucHVzaChuYW1lKTtcbiAgICB9XG5cbiAgICBsZXQgZGF0YSA9IGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICBmb3IobGV0IGsgaW4ga2V5cyl7XG4gICAgICBsZXQgbmFtZSA9IGtleXNba107XG4gICAgICBtb2RlbFtuYW1lIGFzIGtleW9mIFRdID0gZGF0YVtrXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbW9kZWw7XG4gIH1cblxuICBwdWJsaWMgZGVmaW5lUHJvcGVydGllcyhtb2RlbDogTW9kZWwpIDogdm9pZCB7XG5cbiAgICBmb3IobGV0IGZpZWxkIG9mIHRoaXMuZ2V0RmllbGRzKCkpe1xuICAgICAgZmllbGQuZGVmaW5lUHJvcGVydHkodGhpcywgbW9kZWwpO1xuICAgIH1cbiAgfSBcbiAgKi9cbn0iLCJleHBvcnQgeyBkZWZhdWx0IGFzIHYxIH0gZnJvbSAnLi92MS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHYzIH0gZnJvbSAnLi92My5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHY0IH0gZnJvbSAnLi92NC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHY1IH0gZnJvbSAnLi92NS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE5JTCB9IGZyb20gJy4vbmlsLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdmVyc2lvbiB9IGZyb20gJy4vdmVyc2lvbi5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHZhbGlkYXRlIH0gZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHN0cmluZ2lmeSB9IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgcGFyc2UgfSBmcm9tICcuL3BhcnNlLmpzJzsiLCJpbXBvcnQgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5cbmZ1bmN0aW9uIG1kNShieXRlcykge1xuICBpZiAoQXJyYXkuaXNBcnJheShieXRlcykpIHtcbiAgICBieXRlcyA9IEJ1ZmZlci5mcm9tKGJ5dGVzKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgYnl0ZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgYnl0ZXMgPSBCdWZmZXIuZnJvbShieXRlcywgJ3V0ZjgnKTtcbiAgfVxuXG4gIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnbWQ1JykudXBkYXRlKGJ5dGVzKS5kaWdlc3QoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWQ1OyIsImV4cG9ydCBkZWZhdWx0ICcwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAnOyIsImltcG9ydCB2YWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlLmpzJztcblxuZnVuY3Rpb24gcGFyc2UodXVpZCkge1xuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdJbnZhbGlkIFVVSUQnKTtcbiAgfVxuXG4gIGxldCB2O1xuICBjb25zdCBhcnIgPSBuZXcgVWludDhBcnJheSgxNik7IC8vIFBhcnNlICMjIyMjIyMjLS4uLi4tLi4uLi0uLi4uLS4uLi4uLi4uLi4uLlxuXG4gIGFyclswXSA9ICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSgwLCA4KSwgMTYpKSA+Pj4gMjQ7XG4gIGFyclsxXSA9IHYgPj4+IDE2ICYgMHhmZjtcbiAgYXJyWzJdID0gdiA+Pj4gOCAmIDB4ZmY7XG4gIGFyclszXSA9IHYgJiAweGZmOyAvLyBQYXJzZSAuLi4uLi4uLi0jIyMjLS4uLi4tLi4uLi0uLi4uLi4uLi4uLi5cblxuICBhcnJbNF0gPSAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoOSwgMTMpLCAxNikpID4+PiA4O1xuICBhcnJbNV0gPSB2ICYgMHhmZjsgLy8gUGFyc2UgLi4uLi4uLi4tLi4uLi0jIyMjLS4uLi4tLi4uLi4uLi4uLi4uXG5cbiAgYXJyWzZdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDE0LCAxOCksIDE2KSkgPj4+IDg7XG4gIGFycls3XSA9IHYgJiAweGZmOyAvLyBQYXJzZSAuLi4uLi4uLi0uLi4uLS4uLi4tIyMjIy0uLi4uLi4uLi4uLi5cblxuICBhcnJbOF0gPSAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoMTksIDIzKSwgMTYpKSA+Pj4gODtcbiAgYXJyWzldID0gdiAmIDB4ZmY7IC8vIFBhcnNlIC4uLi4uLi4uLS4uLi4tLi4uLi0uLi4uLSMjIyMjIyMjIyMjI1xuICAvLyAoVXNlIFwiL1wiIHRvIGF2b2lkIDMyLWJpdCB0cnVuY2F0aW9uIHdoZW4gYml0LXNoaWZ0aW5nIGhpZ2gtb3JkZXIgYnl0ZXMpXG5cbiAgYXJyWzEwXSA9ICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSgyNCwgMzYpLCAxNikpIC8gMHgxMDAwMDAwMDAwMCAmIDB4ZmY7XG4gIGFyclsxMV0gPSB2IC8gMHgxMDAwMDAwMDAgJiAweGZmO1xuICBhcnJbMTJdID0gdiA+Pj4gMjQgJiAweGZmO1xuICBhcnJbMTNdID0gdiA+Pj4gMTYgJiAweGZmO1xuICBhcnJbMTRdID0gdiA+Pj4gOCAmIDB4ZmY7XG4gIGFyclsxNV0gPSB2ICYgMHhmZjtcbiAgcmV0dXJuIGFycjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcGFyc2U7IiwiZXhwb3J0IGRlZmF1bHQgL14oPzpbMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMS01XVswLTlhLWZdezN9LVs4OWFiXVswLTlhLWZdezN9LVswLTlhLWZdezEyfXwwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDApJC9pOyIsImltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmNvbnN0IHJuZHM4UG9vbCA9IG5ldyBVaW50OEFycmF5KDI1Nik7IC8vICMgb2YgcmFuZG9tIHZhbHVlcyB0byBwcmUtYWxsb2NhdGVcblxubGV0IHBvb2xQdHIgPSBybmRzOFBvb2wubGVuZ3RoO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcm5nKCkge1xuICBpZiAocG9vbFB0ciA+IHJuZHM4UG9vbC5sZW5ndGggLSAxNikge1xuICAgIGNyeXB0by5yYW5kb21GaWxsU3luYyhybmRzOFBvb2wpO1xuICAgIHBvb2xQdHIgPSAwO1xuICB9XG5cbiAgcmV0dXJuIHJuZHM4UG9vbC5zbGljZShwb29sUHRyLCBwb29sUHRyICs9IDE2KTtcbn0iLCJpbXBvcnQgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5cbmZ1bmN0aW9uIHNoYTEoYnl0ZXMpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYnl0ZXMpKSB7XG4gICAgYnl0ZXMgPSBCdWZmZXIuZnJvbShieXRlcyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGJ5dGVzID09PSAnc3RyaW5nJykge1xuICAgIGJ5dGVzID0gQnVmZmVyLmZyb20oYnl0ZXMsICd1dGY4Jyk7XG4gIH1cblxuICByZXR1cm4gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTEnKS51cGRhdGUoYnl0ZXMpLmRpZ2VzdCgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzaGExOyIsImltcG9ydCB2YWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlLmpzJztcbi8qKlxuICogQ29udmVydCBhcnJheSBvZiAxNiBieXRlIHZhbHVlcyB0byBVVUlEIHN0cmluZyBmb3JtYXQgb2YgdGhlIGZvcm06XG4gKiBYWFhYWFhYWC1YWFhYLVhYWFgtWFhYWC1YWFhYWFhYWFhYWFhcbiAqL1xuXG5jb25zdCBieXRlVG9IZXggPSBbXTtcblxuZm9yIChsZXQgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBieXRlVG9IZXgucHVzaCgoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpKTtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KGFyciwgb2Zmc2V0ID0gMCkge1xuICAvLyBOb3RlOiBCZSBjYXJlZnVsIGVkaXRpbmcgdGhpcyBjb2RlISAgSXQncyBiZWVuIHR1bmVkIGZvciBwZXJmb3JtYW5jZVxuICAvLyBhbmQgd29ya3MgaW4gd2F5cyB5b3UgbWF5IG5vdCBleHBlY3QuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQvcHVsbC80MzRcbiAgY29uc3QgdXVpZCA9IChieXRlVG9IZXhbYXJyW29mZnNldCArIDBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMV1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDNdXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA1XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDZdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgN11dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA4XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDldXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTBdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTJdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTNdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTVdXSkudG9Mb3dlckNhc2UoKTsgLy8gQ29uc2lzdGVuY3kgY2hlY2sgZm9yIHZhbGlkIFVVSUQuICBJZiB0aGlzIHRocm93cywgaXQncyBsaWtlbHkgZHVlIHRvIG9uZVxuICAvLyBvZiB0aGUgZm9sbG93aW5nOlxuICAvLyAtIE9uZSBvciBtb3JlIGlucHV0IGFycmF5IHZhbHVlcyBkb24ndCBtYXAgdG8gYSBoZXggb2N0ZXQgKGxlYWRpbmcgdG9cbiAgLy8gXCJ1bmRlZmluZWRcIiBpbiB0aGUgdXVpZClcbiAgLy8gLSBJbnZhbGlkIGlucHV0IHZhbHVlcyBmb3IgdGhlIFJGQyBgdmVyc2lvbmAgb3IgYHZhcmlhbnRgIGZpZWxkc1xuXG4gIGlmICghdmFsaWRhdGUodXVpZCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ1N0cmluZ2lmaWVkIFVVSUQgaXMgaW52YWxpZCcpO1xuICB9XG5cbiAgcmV0dXJuIHV1aWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0cmluZ2lmeTsiLCJpbXBvcnQgcm5nIGZyb20gJy4vcm5nLmpzJztcbmltcG9ydCBzdHJpbmdpZnkgZnJvbSAnLi9zdHJpbmdpZnkuanMnOyAvLyAqKmB2MSgpYCAtIEdlbmVyYXRlIHRpbWUtYmFzZWQgVVVJRCoqXG4vL1xuLy8gSW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL0xpb3NLL1VVSUQuanNcbi8vIGFuZCBodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvdXVpZC5odG1sXG5cbmxldCBfbm9kZUlkO1xuXG5sZXQgX2Nsb2Nrc2VxOyAvLyBQcmV2aW91cyB1dWlkIGNyZWF0aW9uIHRpbWVcblxuXG5sZXQgX2xhc3RNU2VjcyA9IDA7XG5sZXQgX2xhc3ROU2VjcyA9IDA7IC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQgZm9yIEFQSSBkZXRhaWxzXG5cbmZ1bmN0aW9uIHYxKG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIGxldCBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuICBjb25zdCBiID0gYnVmIHx8IG5ldyBBcnJheSgxNik7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsZXQgbm9kZSA9IG9wdGlvbnMubm9kZSB8fCBfbm9kZUlkO1xuICBsZXQgY2xvY2tzZXEgPSBvcHRpb25zLmNsb2Nrc2VxICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmNsb2Nrc2VxIDogX2Nsb2Nrc2VxOyAvLyBub2RlIGFuZCBjbG9ja3NlcSBuZWVkIHRvIGJlIGluaXRpYWxpemVkIHRvIHJhbmRvbSB2YWx1ZXMgaWYgdGhleSdyZSBub3RcbiAgLy8gc3BlY2lmaWVkLiAgV2UgZG8gdGhpcyBsYXppbHkgdG8gbWluaW1pemUgaXNzdWVzIHJlbGF0ZWQgdG8gaW5zdWZmaWNpZW50XG4gIC8vIHN5c3RlbSBlbnRyb3B5LiAgU2VlICMxODlcblxuICBpZiAobm9kZSA9PSBudWxsIHx8IGNsb2Nrc2VxID09IG51bGwpIHtcbiAgICBjb25zdCBzZWVkQnl0ZXMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpO1xuXG4gICAgaWYgKG5vZGUgPT0gbnVsbCkge1xuICAgICAgLy8gUGVyIDQuNSwgY3JlYXRlIGFuZCA0OC1iaXQgbm9kZSBpZCwgKDQ3IHJhbmRvbSBiaXRzICsgbXVsdGljYXN0IGJpdCA9IDEpXG4gICAgICBub2RlID0gX25vZGVJZCA9IFtzZWVkQnl0ZXNbMF0gfCAweDAxLCBzZWVkQnl0ZXNbMV0sIHNlZWRCeXRlc1syXSwgc2VlZEJ5dGVzWzNdLCBzZWVkQnl0ZXNbNF0sIHNlZWRCeXRlc1s1XV07XG4gICAgfVxuXG4gICAgaWYgKGNsb2Nrc2VxID09IG51bGwpIHtcbiAgICAgIC8vIFBlciA0LjIuMiwgcmFuZG9taXplICgxNCBiaXQpIGNsb2Nrc2VxXG4gICAgICBjbG9ja3NlcSA9IF9jbG9ja3NlcSA9IChzZWVkQnl0ZXNbNl0gPDwgOCB8IHNlZWRCeXRlc1s3XSkgJiAweDNmZmY7XG4gICAgfVxuICB9IC8vIFVVSUQgdGltZXN0YW1wcyBhcmUgMTAwIG5hbm8tc2Vjb25kIHVuaXRzIHNpbmNlIHRoZSBHcmVnb3JpYW4gZXBvY2gsXG4gIC8vICgxNTgyLTEwLTE1IDAwOjAwKS4gIEpTTnVtYmVycyBhcmVuJ3QgcHJlY2lzZSBlbm91Z2ggZm9yIHRoaXMsIHNvXG4gIC8vIHRpbWUgaXMgaGFuZGxlZCBpbnRlcm5hbGx5IGFzICdtc2VjcycgKGludGVnZXIgbWlsbGlzZWNvbmRzKSBhbmQgJ25zZWNzJ1xuICAvLyAoMTAwLW5hbm9zZWNvbmRzIG9mZnNldCBmcm9tIG1zZWNzKSBzaW5jZSB1bml4IGVwb2NoLCAxOTcwLTAxLTAxIDAwOjAwLlxuXG5cbiAgbGV0IG1zZWNzID0gb3B0aW9ucy5tc2VjcyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5tc2VjcyA6IERhdGUubm93KCk7IC8vIFBlciA0LjIuMS4yLCB1c2UgY291bnQgb2YgdXVpZCdzIGdlbmVyYXRlZCBkdXJpbmcgdGhlIGN1cnJlbnQgY2xvY2tcbiAgLy8gY3ljbGUgdG8gc2ltdWxhdGUgaGlnaGVyIHJlc29sdXRpb24gY2xvY2tcblxuICBsZXQgbnNlY3MgPSBvcHRpb25zLm5zZWNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm5zZWNzIDogX2xhc3ROU2VjcyArIDE7IC8vIFRpbWUgc2luY2UgbGFzdCB1dWlkIGNyZWF0aW9uIChpbiBtc2VjcylcblxuICBjb25zdCBkdCA9IG1zZWNzIC0gX2xhc3RNU2VjcyArIChuc2VjcyAtIF9sYXN0TlNlY3MpIC8gMTAwMDA7IC8vIFBlciA0LjIuMS4yLCBCdW1wIGNsb2Nrc2VxIG9uIGNsb2NrIHJlZ3Jlc3Npb25cblxuICBpZiAoZHQgPCAwICYmIG9wdGlvbnMuY2xvY2tzZXEgPT09IHVuZGVmaW5lZCkge1xuICAgIGNsb2Nrc2VxID0gY2xvY2tzZXEgKyAxICYgMHgzZmZmO1xuICB9IC8vIFJlc2V0IG5zZWNzIGlmIGNsb2NrIHJlZ3Jlc3NlcyAobmV3IGNsb2Nrc2VxKSBvciB3ZSd2ZSBtb3ZlZCBvbnRvIGEgbmV3XG4gIC8vIHRpbWUgaW50ZXJ2YWxcblxuXG4gIGlmICgoZHQgPCAwIHx8IG1zZWNzID4gX2xhc3RNU2VjcykgJiYgb3B0aW9ucy5uc2VjcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbnNlY3MgPSAwO1xuICB9IC8vIFBlciA0LjIuMS4yIFRocm93IGVycm9yIGlmIHRvbyBtYW55IHV1aWRzIGFyZSByZXF1ZXN0ZWRcblxuXG4gIGlmIChuc2VjcyA+PSAxMDAwMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInV1aWQudjEoKTogQ2FuJ3QgY3JlYXRlIG1vcmUgdGhhbiAxME0gdXVpZHMvc2VjXCIpO1xuICB9XG5cbiAgX2xhc3RNU2VjcyA9IG1zZWNzO1xuICBfbGFzdE5TZWNzID0gbnNlY3M7XG4gIF9jbG9ja3NlcSA9IGNsb2Nrc2VxOyAvLyBQZXIgNC4xLjQgLSBDb252ZXJ0IGZyb20gdW5peCBlcG9jaCB0byBHcmVnb3JpYW4gZXBvY2hcblxuICBtc2VjcyArPSAxMjIxOTI5MjgwMDAwMDsgLy8gYHRpbWVfbG93YFxuXG4gIGNvbnN0IHRsID0gKChtc2VjcyAmIDB4ZmZmZmZmZikgKiAxMDAwMCArIG5zZWNzKSAlIDB4MTAwMDAwMDAwO1xuICBiW2krK10gPSB0bCA+Pj4gMjQgJiAweGZmO1xuICBiW2krK10gPSB0bCA+Pj4gMTYgJiAweGZmO1xuICBiW2krK10gPSB0bCA+Pj4gOCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsICYgMHhmZjsgLy8gYHRpbWVfbWlkYFxuXG4gIGNvbnN0IHRtaCA9IG1zZWNzIC8gMHgxMDAwMDAwMDAgKiAxMDAwMCAmIDB4ZmZmZmZmZjtcbiAgYltpKytdID0gdG1oID4+PiA4ICYgMHhmZjtcbiAgYltpKytdID0gdG1oICYgMHhmZjsgLy8gYHRpbWVfaGlnaF9hbmRfdmVyc2lvbmBcblxuICBiW2krK10gPSB0bWggPj4+IDI0ICYgMHhmIHwgMHgxMDsgLy8gaW5jbHVkZSB2ZXJzaW9uXG5cbiAgYltpKytdID0gdG1oID4+PiAxNiAmIDB4ZmY7IC8vIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYCAoUGVyIDQuMi4yIC0gaW5jbHVkZSB2YXJpYW50KVxuXG4gIGJbaSsrXSA9IGNsb2Nrc2VxID4+PiA4IHwgMHg4MDsgLy8gYGNsb2NrX3NlcV9sb3dgXG5cbiAgYltpKytdID0gY2xvY2tzZXEgJiAweGZmOyAvLyBgbm9kZWBcblxuICBmb3IgKGxldCBuID0gMDsgbiA8IDY7ICsrbikge1xuICAgIGJbaSArIG5dID0gbm9kZVtuXTtcbiAgfVxuXG4gIHJldHVybiBidWYgfHwgc3RyaW5naWZ5KGIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2MTsiLCJpbXBvcnQgdjM1IGZyb20gJy4vdjM1LmpzJztcbmltcG9ydCBtZDUgZnJvbSAnLi9tZDUuanMnO1xuY29uc3QgdjMgPSB2MzUoJ3YzJywgMHgzMCwgbWQ1KTtcbmV4cG9ydCBkZWZhdWx0IHYzOyIsImltcG9ydCBzdHJpbmdpZnkgZnJvbSAnLi9zdHJpbmdpZnkuanMnO1xuaW1wb3J0IHBhcnNlIGZyb20gJy4vcGFyc2UuanMnO1xuXG5mdW5jdGlvbiBzdHJpbmdUb0J5dGVzKHN0cikge1xuICBzdHIgPSB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoc3RyKSk7IC8vIFVURjggZXNjYXBlXG5cbiAgY29uc3QgYnl0ZXMgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGJ5dGVzLnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpO1xuICB9XG5cbiAgcmV0dXJuIGJ5dGVzO1xufVxuXG5leHBvcnQgY29uc3QgRE5TID0gJzZiYTdiODEwLTlkYWQtMTFkMS04MGI0LTAwYzA0ZmQ0MzBjOCc7XG5leHBvcnQgY29uc3QgVVJMID0gJzZiYTdiODExLTlkYWQtMTFkMS04MGI0LTAwYzA0ZmQ0MzBjOCc7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAobmFtZSwgdmVyc2lvbiwgaGFzaGZ1bmMpIHtcbiAgZnVuY3Rpb24gZ2VuZXJhdGVVVUlEKHZhbHVlLCBuYW1lc3BhY2UsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHZhbHVlID0gc3RyaW5nVG9CeXRlcyh2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBuYW1lc3BhY2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICBuYW1lc3BhY2UgPSBwYXJzZShuYW1lc3BhY2UpO1xuICAgIH1cblxuICAgIGlmIChuYW1lc3BhY2UubGVuZ3RoICE9PSAxNikge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCdOYW1lc3BhY2UgbXVzdCBiZSBhcnJheS1saWtlICgxNiBpdGVyYWJsZSBpbnRlZ2VyIHZhbHVlcywgMC0yNTUpJyk7XG4gICAgfSAvLyBDb21wdXRlIGhhc2ggb2YgbmFtZXNwYWNlIGFuZCB2YWx1ZSwgUGVyIDQuM1xuICAgIC8vIEZ1dHVyZTogVXNlIHNwcmVhZCBzeW50YXggd2hlbiBzdXBwb3J0ZWQgb24gYWxsIHBsYXRmb3JtcywgZS5nLiBgYnl0ZXMgPVxuICAgIC8vIGhhc2hmdW5jKFsuLi5uYW1lc3BhY2UsIC4uLiB2YWx1ZV0pYFxuXG5cbiAgICBsZXQgYnl0ZXMgPSBuZXcgVWludDhBcnJheSgxNiArIHZhbHVlLmxlbmd0aCk7XG4gICAgYnl0ZXMuc2V0KG5hbWVzcGFjZSk7XG4gICAgYnl0ZXMuc2V0KHZhbHVlLCBuYW1lc3BhY2UubGVuZ3RoKTtcbiAgICBieXRlcyA9IGhhc2hmdW5jKGJ5dGVzKTtcbiAgICBieXRlc1s2XSA9IGJ5dGVzWzZdICYgMHgwZiB8IHZlcnNpb247XG4gICAgYnl0ZXNbOF0gPSBieXRlc1s4XSAmIDB4M2YgfCAweDgwO1xuXG4gICAgaWYgKGJ1Zikge1xuICAgICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDA7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgICAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlc1tpXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJ1ZjtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RyaW5naWZ5KGJ5dGVzKTtcbiAgfSAvLyBGdW5jdGlvbiNuYW1lIGlzIG5vdCBzZXR0YWJsZSBvbiBzb21lIHBsYXRmb3JtcyAoIzI3MClcblxuXG4gIHRyeSB7XG4gICAgZ2VuZXJhdGVVVUlELm5hbWUgPSBuYW1lOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZW1wdHlcbiAgfSBjYXRjaCAoZXJyKSB7fSAvLyBGb3IgQ29tbW9uSlMgZGVmYXVsdCBleHBvcnQgc3VwcG9ydFxuXG5cbiAgZ2VuZXJhdGVVVUlELkROUyA9IEROUztcbiAgZ2VuZXJhdGVVVUlELlVSTCA9IFVSTDtcbiAgcmV0dXJuIGdlbmVyYXRlVVVJRDtcbn0iLCJpbXBvcnQgcm5nIGZyb20gJy4vcm5nLmpzJztcbmltcG9ydCBzdHJpbmdpZnkgZnJvbSAnLi9zdHJpbmdpZnkuanMnO1xuXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgY29uc3Qgcm5kcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBybmcpKCk7IC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcblxuICBybmRzWzZdID0gcm5kc1s2XSAmIDB4MGYgfCAweDQwO1xuICBybmRzWzhdID0gcm5kc1s4XSAmIDB4M2YgfCAweDgwOyAvLyBDb3B5IGJ5dGVzIHRvIGJ1ZmZlciwgaWYgcHJvdmlkZWRcblxuICBpZiAoYnVmKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyArK2kpIHtcbiAgICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHJuZHNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuXG4gIHJldHVybiBzdHJpbmdpZnkocm5kcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHY0OyIsImltcG9ydCB2MzUgZnJvbSAnLi92MzUuanMnO1xuaW1wb3J0IHNoYTEgZnJvbSAnLi9zaGExLmpzJztcbmNvbnN0IHY1ID0gdjM1KCd2NScsIDB4NTAsIHNoYTEpO1xuZXhwb3J0IGRlZmF1bHQgdjU7IiwiaW1wb3J0IFJFR0VYIGZyb20gJy4vcmVnZXguanMnO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZSh1dWlkKSB7XG4gIHJldHVybiB0eXBlb2YgdXVpZCA9PT0gJ3N0cmluZycgJiYgUkVHRVgudGVzdCh1dWlkKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdmFsaWRhdGU7IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuXG5mdW5jdGlvbiB2ZXJzaW9uKHV1aWQpIHtcbiAgaWYgKCF2YWxpZGF0ZSh1dWlkKSkge1xuICAgIHRocm93IFR5cGVFcnJvcignSW52YWxpZCBVVUlEJyk7XG4gIH1cblxuICByZXR1cm4gcGFyc2VJbnQodXVpZC5zdWJzdHIoMTQsIDEpLCAxNik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZlcnNpb247IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY3J5cHRvXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==