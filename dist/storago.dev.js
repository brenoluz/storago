/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Migration = exports.codeFieldError = exports.FieldKind = exports.Field = exports.fields = exports.Schema = exports.Model = exports.debug = void 0;
var debug_1 = __webpack_require__(/*! ./debug */ "./src/debug.ts");
Object.defineProperty(exports, "debug", ({ enumerable: true, get: function () { return debug_1.debug; } }));
var model_1 = __webpack_require__(/*! ./model */ "./src/model.ts");
Object.defineProperty(exports, "Model", ({ enumerable: true, get: function () { return model_1.Model; } }));
var schema_1 = __webpack_require__(/*! ./schema */ "./src/schema.ts");
Object.defineProperty(exports, "Schema", ({ enumerable: true, get: function () { return schema_1.Schema; } }));
var field_1 = __webpack_require__(/*! ./field */ "./src/field/index.ts");
Object.defineProperty(exports, "fields", ({ enumerable: true, get: function () { return field_1.fields; } }));
Object.defineProperty(exports, "Field", ({ enumerable: true, get: function () { return field_1.Field; } }));
Object.defineProperty(exports, "FieldKind", ({ enumerable: true, get: function () { return field_1.FieldKind; } }));
Object.defineProperty(exports, "codeFieldError", ({ enumerable: true, get: function () { return field_1.codeFieldError; } }));
var migration_1 = __webpack_require__(/*! ./migration */ "./src/migration.ts");
Object.defineProperty(exports, "Migration", ({ enumerable: true, get: function () { return migration_1.Migration; } }));

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztBQ05BLG1FQUFnQztBQUF2QixvR0FBSztBQUVkLG1FQUFrRDtBQUF6QyxvR0FBSztBQUNkLHNFQUFrQztBQUF6Qix1R0FBTTtBQUVmLHlFQUFtRTtBQUExRCxzR0FBTTtBQUFFLG9HQUFLO0FBQUUsNEdBQVM7QUFBRSxzSEFBYztBQUNqRCwrRUFBd0M7QUFBL0IsZ0hBQVMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZGVidWcudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL2Jvb2xlYW4udHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL2RhdGV0aW1lLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC9maWVsZC50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL2ludGVnZXIudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL2pzb24udHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL21hbnkudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL3RleHQudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL3V1aWQudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL21pZ3JhdGlvbi50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvbW9kZWwudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL3NjaGVtYS50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL2luZGV4LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvbWQ1LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvbmlsLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvcGFyc2UuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS9yZWdleC5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3JuZy5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3NoYTEuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS9zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS92MS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3YzLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvdjM1LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvdjQuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS92NS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvdmVyc2lvbi5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImNyeXB0b1wiIiwid2VicGFjazovL0BzdG9yYWdvL29ybS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW50ZXJmYWNlIERlYnVne1xuICBzZWxlY3Q6IGJvb2xlYW4sXG4gIGluc2VydDogYm9vbGVhbixcbiAgY3JlYXRlOiBib29sZWFuLFxuICBxdWVyeTogYm9vbGVhbixcbn1cblxuZXhwb3J0IGxldCBkZWJ1ZzogRGVidWcgPSB7XG4gIHNlbGVjdDogdHJ1ZSxcbiAgaW5zZXJ0OiB0cnVlLFxuICBjcmVhdGU6IHRydWUsXG4gIHF1ZXJ5OiB0cnVlLFxufSIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSBcIi4uXCI7XG5pbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4uL2FkYXB0ZXIvYWRhcHRlclwiO1xuaW1wb3J0IHsgQ29uZmlnLCBkZWZhdWx0Q29uZmlnLCBGaWVsZCwgRmllbGRLaW5kIH0gZnJvbSBcIi4vZmllbGRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBCb29sZWFuQ29uZmlnIGV4dGVuZHMgQ29uZmlnIHsgfVxuXG5leHBvcnQgY2xhc3MgQm9vbGVhbkZpZWxkIGV4dGVuZHMgRmllbGQge1xuXG4gIHJlYWRvbmx5IGNvbmZpZzogQm9vbGVhbkNvbmZpZztcbiAgcmVhZG9ubHkga2luZDogRmllbGRLaW5kID0gRmllbGRLaW5kLkJPT0xFQU47XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjb25maWc6IFBhcnRpYWw8Qm9vbGVhbkNvbmZpZz4gPSBkZWZhdWx0Q29uZmlnKSB7XG5cbiAgICBzdXBlcihuYW1lKTtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIC4uLmRlZmF1bHRDb25maWcsXG4gICAgICAuLi5jb25maWcsXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGZyb21EQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSwgdmFsdWU6IHN0cmluZyk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuXG4gICAgcmV0dXJuIGFkYXB0ZXIuZmllbGRUcmFuc2Zvcm1Gcm9tRGIodGhpcywgdmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHRvREI8QSBleHRlbmRzIEFkYXB0ZXIsIE0gZXh0ZW5kcyBNb2RlbD4oYWRhcHRlcjogQSwgbW9kZWw6IE0pOiBhbnkge1xuXG4gICAgbGV0IHZhbHVlID0gc3VwZXIudG9EQjxBLCBNPihhZGFwdGVyLCBtb2RlbCk7XG4gICAgcmV0dXJuIGFkYXB0ZXIuZmllbGRUcmFuc2Zvcm1Ub0RCPEEsIEJvb2xlYW5GaWVsZCwgTT4odGhpcywgdmFsdWUpO1xuICB9XG5cbiAgcHVibGljIGNhc3REQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSk6IHN0cmluZyB7XG5cbiAgICByZXR1cm4gYWRhcHRlci5maWVsZENhc3Q8Qm9vbGVhbkZpZWxkPih0aGlzKTtcbiAgfVxufSIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSBcIi4uXCI7XG5pbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4uL2FkYXB0ZXIvYWRhcHRlclwiO1xuaW1wb3J0IHsgQ29uZmlnLCBkZWZhdWx0Q29uZmlnLCBGaWVsZCwgRmllbGRLaW5kIH0gZnJvbSBcIi4vZmllbGRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBEYXRlVGltZUNvbmZpZyBleHRlbmRzIENvbmZpZyB7IH1cblxuZXhwb3J0IGNsYXNzIERhdGVUaW1lRmllbGQgZXh0ZW5kcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgY29uZmlnOiBEYXRlVGltZUNvbmZpZztcbiAgcmVhZG9ubHkga2luZDogRmllbGRLaW5kID0gRmllbGRLaW5kLkRBVEVUSU1FO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgY29uZmlnOiBQYXJ0aWFsPERhdGVUaW1lQ29uZmlnPiA9IGRlZmF1bHRDb25maWcpIHtcblxuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLi4uZGVmYXVsdENvbmZpZyxcbiAgICAgIC4uLmNvbmZpZyxcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZnJvbURCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBLCB2YWx1ZTogYW55KSA6IERhdGV8dW5kZWZpbmVkIHtcblxuICAgIGlmKHZhbHVlID09PSBudWxsKXtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBEYXRlKHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyB0b0RCPEEgZXh0ZW5kcyBBZGFwdGVyLCBNIGV4dGVuZHMgTW9kZWw+KGFkYXB0ZXI6IEEsIG1vZGVsOiBNKSA6IG51bWJlciB7XG4gICAgXG4gICAgbGV0IG5hbWUgPSB0aGlzLmdldE5hbWUoKTtcbiAgICBsZXQgdmFsdWUgPSBtb2RlbFtuYW1lIGFzIGtleW9mIE1dO1xuXG4gICAgaWYodmFsdWUgPT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0VmFsdWUoKTtcbiAgICB9XG5cbiAgICBpZih2YWx1ZSBpbnN0YW5jZW9mIERhdGUpe1xuICAgICAgcmV0dXJuIHZhbHVlLmdldFRpbWUoKTtcbiAgICB9XG5cbiAgICB0aHJvdyB7Y29kZTogbnVsbCwgbWVzc2FnZTogYHZhbHVlIG9mICR7bmFtZX0gdG8gREIgaXMgbm90IGEgRGF0ZWB9O1xuICB9XG5cbiAgcHVibGljIGNhc3REQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSk6IHN0cmluZyB7XG4gICAgXG4gICAgcmV0dXJuIGFkYXB0ZXIuZmllbGRDYXN0PERhdGVUaW1lRmllbGQ+KHRoaXMpO1xuICB9XG59IiwiaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gXCIuLi9hZGFwdGVyL2FkYXB0ZXJcIjtcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSBcIi4uL21vZGVsXCI7XG5cbmV4cG9ydCBlbnVtIGNvZGVGaWVsZEVycm9yIHtcbiAgJ0VuZ2luZU5vdEltcGxlbWVudGVkJyA9ICdAc3RvcmFnby9vcm0vZmllbGQvZW5naW5lTm90SW1wbGVtZW50ZWQnLFxuICAnRGVmYXVsdFZhbHVlSXNOb3RWYWxpZCcgPSAnQHN0b3JhZ28vb3JtL2ZpZWxkL2RlZmF1bHRQYXJhbU5vdFZhbGlkJyxcbiAgJ0luY29ycmVjdFZhbHVlVG9EYicgPSAnQHN0b3JhZ28vb3JtL2ZpZWxkL0luY29ycmVjdFZhbHVlVG9TdG9yYWdlT25EQicsXG4gICdSZWZlcmVyTm90Rm91bmQnID0gJ0BzdG9yYWdvL29ybS9maWVsZC9NYW55UmVsYXRpb25zaGlwJyxcbiAgJ0ZpZWxkS2luZE5vdFN1cHBvcnRlZCcgPSAnQHN0b3JhZ28vb3JtL2ZpZWxkL0ZpZWxkS2luZE5vdFN1cHBvcnRlZCcsXG59XG5cbmV4cG9ydCBlbnVtIEZpZWxkS2luZHtcbiAgVEVYVCxcbiAgVkFSQ0hBUixcbiAgQ0hBUkFDVEVSLFxuXG4gIElOVEVHRVIsXG4gIFRJTllJTlQsXG4gIFNNQUxMSU5ULFxuICBNRURJVU1JTlQsXG4gIEJJR0lOVCxcblxuICBSRUFMLFxuICBET1VCTEUsXG4gIEZMT0FULFxuXG4gIE5VTUVSSUMsXG4gIERFQ0lNQUwsXG4gIERBVEUsXG4gIERBVEVUSU1FLFxuICBCT09MRUFOLFxuXG4gIFVVSUQsXG4gIEpTT04sXG5cbiAgQkxPQixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb25maWcge1xuICBkZWZhdWx0PzogYW55O1xuICByZXF1aXJlZDogYm9vbGVhbjtcbiAgbGluaz86IHN0cmluZztcbiAgaW5kZXg6IGJvb2xlYW47XG4gIHByaW1hcnk6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0Q29uZmlnOiBDb25maWcgPSB7XG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgaW5kZXg6IGZhbHNlLFxuICBwcmltYXJ5OiBmYWxzZVxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRmllbGQge1xuXG4gIHJlYWRvbmx5IGFic3RyYWN0IGNvbmZpZzogQ29uZmlnO1xuICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG4gIGFic3RyYWN0IHJlYWRvbmx5IGtpbmQ6IEZpZWxkS2luZDsgXG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXROYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXREZWZhdWx0VmFsdWUoKTogYW55IHtcblxuICAgIGxldCB2YWx1ZURlZmF1bHQgPSB0aGlzLmNvbmZpZy5kZWZhdWx0O1xuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZURlZmF1bHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiB2YWx1ZURlZmF1bHQoKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHZhbHVlRGVmYXVsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWx1ZURlZmF1bHQgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZURlZmF1bHQ7XG4gIH1cblxuICBwdWJsaWMgaXNWaXJ0dWFsKCk6IGJvb2xlYW4ge1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmxpbmsgIT09IHVuZGVmaW5lZCAmJiAhdGhpcy5jb25maWcuaW5kZXgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qXG4gIHB1YmxpYyBhc3luYyBwb3B1bGF0ZShtb2RlbDogTW9kZWwsIHJvdzogeyBbaW5kZXg6IHN0cmluZ106IGFueTsgfSk6IFByb21pc2U8YW55PiB7XG5cbiAgICBsZXQgbmFtZSA9IHRoaXMuZ2V0TmFtZSgpO1xuICAgIGxldCB2YWx1ZSA9IHJvd1tuYW1lXTtcblxuICAgIC8qXG4gICAgaWYgKHRoaXMuY29uZmlnLmxpbmsgIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICBsZXQgbGlua3M6IHN0cmluZ1tdID0gdGhpcy5jb25maWcubGluay5zcGxpdCgnLicpO1xuICAgICAgbGV0IGl0ZW1OYW1lID0gbGlua3Muc2hpZnQoKTtcblxuICAgICAgaWYgKCFpdGVtTmFtZSB8fCBpdGVtTmFtZSBpbiBtb2RlbC5fX2RhdGEpIHtcbiAgICAgICAgbW9kZWxbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFsdWUgPSBhd2FpdCBtb2RlbC5fX2RhdGFbaXRlbU5hbWVdO1xuXG4gICAgICB3aGlsZSAoaXRlbU5hbWUgPSBsaW5rcy5zaGlmdCgpKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBpZiAoaXRlbU5hbWUgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWVbaXRlbU5hbWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gdGhpcy5mcm9tREIodmFsdWUpO1xuICB9XG4gICovXG4gIFxuIHB1YmxpYyB0b0RCPEEgZXh0ZW5kcyBBZGFwdGVyLCBNIGV4dGVuZHMgTW9kZWw+KGFkYXB0ZXI6IEEsIG1vZGVsOiBNKTogYW55IHtcbiAgIFxuICAgbGV0IG5hbWUgPSB0aGlzLmdldE5hbWUoKTtcbiAgIGxldCB2YWx1ZSA9IG1vZGVsW25hbWUgYXMga2V5b2YgTV07XG4gICBcbiAgIGlmKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpe1xuICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0VmFsdWUoKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIGFic3RyYWN0IGZyb21EQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSwgdmFsdWU6IGFueSk6IGFueTtcbiAgYWJzdHJhY3QgY2FzdERCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBKTogc3RyaW5nO1xuICBcbiAgcHVibGljIGlzSnNvbk9iamVjdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgXG4gIC8qXG4gIHByb3RlY3RlZCBkZWZpbmVTZXR0ZXIobGluazogc3RyaW5nLCBzY2hlbWE6IFNjaGVtYSwgbW9kZWw6IE1vZGVsLCB2YWx1ZTogYW55KSA6IHZvaWQge1xuXG4gICAgaWYgKGxpbmspIHtcbiAgICAgIGxldCBsaXN0TmFtZSA9IGxpbmsuc3BsaXQoJy4nKTtcbiAgICAgIGxldCBmaWVsZE5hbWUgPSBsaXN0TmFtZVswXTtcbiAgICAgIGxldCB0YXJnZXQgPSBsaXN0TmFtZS5wb3AoKTtcbiAgICAgIGxldCBmaWVsZCA9IHNjaGVtYS5nZXRGaWVsZChmaWVsZE5hbWUpO1xuICAgICAgbGV0IGl0ZW0gOiBhbnkgPSBtb2RlbDtcbiAgICAgIFxuICAgICAgaWYoZmllbGQuaXNKc29uT2JqZWN0KCkpe1xuICAgICAgICBsZXQgaXRlbU5hbWUgPSBsaXN0TmFtZS5zaGlmdCgpO1xuICAgICAgICB3aGlsZShpdGVtTmFtZSl7XG4gICAgICAgICAgXG4gICAgICAgICAgaWYodHlwZW9mIGl0ZW1baXRlbU5hbWVdICE9PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICBpdGVtW2l0ZW1OYW1lXSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICBpdGVtID0gaXRlbVtpdGVtTmFtZV07XG4gICAgICAgICAgaXRlbU5hbWUgPSBsaXN0TmFtZS5zaGlmdCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmKHRhcmdldCl7XG4gICAgICAgIGl0ZW1bdGFyZ2V0XSA9IHRoaXMucGFyc2VUb0RCKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZGVmaW5lR2V0dGVyKGxpbms6IHN0cmluZywgc2NoZW1hOiBTY2hlbWEsIG1vZGVsOiBNb2RlbCkgOiBhbnkge1xuXG4gICAgaWYgKGxpbmspIHtcbiAgICAgIGxldCBsaXN0TmFtZSA9IGxpbmsuc3BsaXQoJy4nKTtcbiAgICAgIGxldCBmaWVsZE5hbWUgPSBsaXN0TmFtZVswXTtcbiAgICAgIGxldCB0YXJnZXQgPSBsaXN0TmFtZS5wb3AoKTtcbiAgICAgIGxldCBmaWVsZCA9IHNjaGVtYS5nZXRGaWVsZChmaWVsZE5hbWUpO1xuICAgICAgbGV0IGl0ZW0gOiBhbnkgPSBtb2RlbDtcblxuICAgICAgaWYoZmllbGQuaXNKc29uT2JqZWN0KCkpe1xuICAgICAgICBsZXQgaXRlbU5hbWUgPSBsaXN0TmFtZS5zaGlmdCgpO1xuICAgICAgICB3aGlsZShpdGVtTmFtZSl7XG4gICAgICAgICAgXG4gICAgICAgICAgaWYodHlwZW9mIGl0ZW1baXRlbU5hbWVdICE9PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICByZXR1cm4gaXRlbVtpdGVtTmFtZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIGl0ZW0gPSBpdGVtW2l0ZW1OYW1lXTtcbiAgICAgICAgICBpdGVtTmFtZSA9IGxpc3ROYW1lLnNoaWZ0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYodGFyZ2V0KXtcbiAgICAgICAgcmV0dXJuIGl0ZW1bdGFyZ2V0XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIFxuICBwdWJsaWMgZGVmaW5lUHJvcGVydHkoc2NoZW1hOiBTY2hlbWEsIG1vZGVsOiBNb2RlbCk6IHZvaWQge1xuICAgIFxuICAgIFxuICAgIGxldCBsaW5rID0gdGhpcy5jb25maWcubGluaztcbiAgICBpZiAobGluaykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZGVsLCB0aGlzLm5hbWUsIHtcbiAgICAgICAgJ3NldCc6IHRoaXMuZGVmaW5lU2V0dGVyLmJpbmQodGhpcywgbGluaywgc2NoZW1hLCBtb2RlbCksXG4gICAgICAgICdnZXQnOiB0aGlzLmRlZmluZUdldHRlci5iaW5kKHRoaXMsIGxpbmssIHNjaGVtYSwgbW9kZWwpLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gICovXG5cbn1cbiIsImV4cG9ydCB7IEZpZWxkLCBGaWVsZEtpbmQsIGNvZGVGaWVsZEVycm9yIH0gZnJvbSBcIi4vZmllbGRcIjtcblxuaW1wb3J0IHsgVGV4dEZpZWxkIH0gZnJvbSBcIi4vdGV4dFwiO1xuaW1wb3J0IHsgVVVJREZpZWxkIH0gZnJvbSBcIi4vdXVpZFwiO1xuaW1wb3J0IHsgSnNvbkZpZWxkIH0gZnJvbSBcIi4vanNvblwiO1xuaW1wb3J0IHsgTWFueUZpZWxkIH0gZnJvbSBcIi4vbWFueVwiO1xuaW1wb3J0IHsgSW50ZWdlckZpZWxkIH0gZnJvbSBcIi4vaW50ZWdlclwiO1xuaW1wb3J0IHsgQm9vbGVhbkZpZWxkIH0gZnJvbSBcIi4vYm9vbGVhblwiO1xuaW1wb3J0IHsgRGF0ZVRpbWVGaWVsZCB9IGZyb20gXCIuL2RhdGV0aW1lXCI7XG5cbmV4cG9ydCBjb25zdCBmaWVsZHMgPSB7XG4gIFRleHRGaWVsZCxcbiAgVVVJREZpZWxkLFxuICBKc29uRmllbGQsXG4gIE1hbnlGaWVsZCxcbiAgSW50ZWdlckZpZWxkLFxuICBCb29sZWFuRmllbGQsXG4gIERhdGVUaW1lRmllbGQsXG59XG4iLCJpbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4uL2FkYXB0ZXIvYWRhcHRlclwiO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IEZpZWxkLCBDb25maWcsIGRlZmF1bHRDb25maWcsIEZpZWxkS2luZCB9IGZyb20gXCIuL2ZpZWxkXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW50ZWdlckNvbmZpZyBleHRlbmRzIENvbmZpZyB7IH1cblxuZXhwb3J0IGNsYXNzIEludGVnZXJGaWVsZCBleHRlbmRzIEZpZWxkIHtcblxuICByZWFkb25seSBjb25maWc6IEludGVnZXJDb25maWc7XG4gIHJlYWRvbmx5IGtpbmQ6IEZpZWxkS2luZCA9IEZpZWxkS2luZC5JTlRFR0VSO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgY29uZmlnOiBQYXJ0aWFsPEludGVnZXJDb25maWc+ID0gZGVmYXVsdENvbmZpZykge1xuXG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmcm9tREI8QSBleHRlbmRzIEFkYXB0ZXI+KGFkYXB0ZXI6IEEsIHZhbHVlOiBzdHJpbmcpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuXG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHRocm93IHsgY29kZTogbnVsbCwgbWVzc2FnZTogJ3ZhbHVlIGZyb20gREIgaXMgbm90IGEgbnVtYmVyJyB9O1xuICB9XG5cbiAgcHVibGljIHRvREI8QSBleHRlbmRzIEFkYXB0ZXIsIE0gZXh0ZW5kcyBNb2RlbD4oYWRhcHRlcjogQSwgbW9kZWw6IE0pOiBhbnkge1xuXG4gICAgbGV0IG5hbWUgPSB0aGlzLmdldE5hbWUoKTtcbiAgICBsZXQgdmFsdWUgPSBtb2RlbFtuYW1lIGFzIGtleW9mIE1dO1xuXG4gICAgaWYgKHZhbHVlID09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVmYXVsdFZhbHVlKCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKHZhbHVlKTtcbiAgICB9XG5cbiAgICB0aHJvdyB7IGNvZGU6IG51bGwsIG1lc3NhZ2U6IGB2YWx1ZSBvZiAkeyBuYW1lIH0gdG8gREIgaXMgbm90IGEgaW50ZWdlcmAgfTtcbiAgfVxuXG4gIHB1YmxpYyBjYXN0REI8QSBleHRlbmRzIEFkYXB0ZXI+KGFkYXB0ZXI6IEEpOiBzdHJpbmcge1xuXG4gICAgcmV0dXJuIGFkYXB0ZXIuZmllbGRDYXN0PEludGVnZXJGaWVsZD4odGhpcyk7XG4gIH1cbn0iLCJpbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4uL2FkYXB0ZXIvYWRhcHRlclwiO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IEZpZWxkLCBDb25maWcsIGRlZmF1bHRDb25maWcsIGNvZGVGaWVsZEVycm9yLCBGaWVsZEtpbmQgfSBmcm9tIFwiLi9maWVsZFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEpzb25Db25maWcgZXh0ZW5kcyBDb25maWcge1xuICB0eXBlOiAnbGlzdCcgfCAnb2JqZWN0JyxcbiAgZGVmYXVsdD86ICdzdHJpbmcnIHwgRnVuY3Rpb24gfCBPYmplY3Q7XG59XG5cbmxldCBqc29uRGVmYXVsdENvbmZpZzogSnNvbkNvbmZpZyA9IHtcbiAgLi4uZGVmYXVsdENvbmZpZyxcbiAgdHlwZTogJ29iamVjdCcsXG59XG5cbmV4cG9ydCBjbGFzcyBKc29uRmllbGQgZXh0ZW5kcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgY29uZmlnOiBKc29uQ29uZmlnO1xuICByZWFkb25seSBraW5kOiBGaWVsZEtpbmQgPSBGaWVsZEtpbmQuSlNPTjtcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGNvbmZpZzogUGFydGlhbDxKc29uQ29uZmlnPiA9IGpzb25EZWZhdWx0Q29uZmlnKSB7XG5cbiAgICBzdXBlcihuYW1lKTtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIC4uLmpzb25EZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgZ2V0RGVmYXVsdFZhbHVlKCk6IGFueSB7XG5cbiAgICBsZXQgdmFsdWVEZWZhdWx0ID0gc3VwZXIuZ2V0RGVmYXVsdFZhbHVlKCk7XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlRGVmYXVsdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlRGVmYXVsdCA9IEpTT04ucGFyc2UodmFsdWVEZWZhdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhyb3cge1xuICAgICAgICAgIGNvZGU6IGNvZGVGaWVsZEVycm9yLkRlZmF1bHRWYWx1ZUlzTm90VmFsaWQsXG4gICAgICAgICAgbWVzc2FnZTogYERlZmF1bHQgdmFsdWUgb24gSlNPTiBmaWVsZCBpcyBub3QgYSB2YWxpZCBqc29uYFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZURlZmF1bHQ7XG4gIH1cblxuICBwdWJsaWMgZnJvbURCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBLCB2YWx1ZTogc3RyaW5nIHwgbnVsbCk6IG9iamVjdCB8IHVuZGVmaW5lZCB7XG5cbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlID09PSAnJykge1xuICAgICAgbGV0IHR5cGUgPSB0aGlzLmNvbmZpZy50eXBlO1xuICAgICAgaWYgKHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL3JldHVybiBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICByZXR1cm4gYWRhcHRlci5maWVsZFRyYW5zZm9ybUZyb21EYjxKc29uRmllbGQ+KHRoaXMsIHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBjYXN0REI8QSBleHRlbmRzIEFkYXB0ZXI+KGFkYXB0ZXI6IEEpOiBzdHJpbmcge1xuXG4gICAgcmV0dXJuIGFkYXB0ZXIuZmllbGRDYXN0PEpzb25GaWVsZD4odGhpcyk7XG4gIH1cblxuICBwdWJsaWMgaXNKc29uT2JqZWN0KCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmNvbmZpZy50eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHVibGljIHRvREI8QSBleHRlbmRzIEFkYXB0ZXIsIE0gZXh0ZW5kcyBNb2RlbD4oYWRhcHRlcjogQSwgbW9kZWw6IE0pOiBzdHJpbmcgfCBudWxsIHtcblxuICAgIGxldCB2YWx1ZSA9IHN1cGVyLnRvREIoYWRhcHRlciwgbW9kZWwpO1xuXG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdHJpbmdpZnlUb0RiKHZhbHVlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdHJpbmdpZnlUb0RiKHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuXG4gICAgbGV0IGtpbmQgPSB0aGlzLmNvbmZpZy50eXBlO1xuICAgIGxldCBlcnJvciA9IHtcbiAgICAgIGNvZGU6IGNvZGVGaWVsZEVycm9yLkluY29ycmVjdFZhbHVlVG9EYixcbiAgICAgIG1lc3NhZ2U6IGB2YWx1ZSBpcyBub3QgYSB2YWxpZCBqc29uYCxcbiAgICB9O1xuXG4gICAgLyogVGVzdCBpZiB2YWx1ZSBpcyB2YWxpZCAqL1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBKU09OLnBhcnNlKHZhbHVlKTsgLy9qdXN0IHRlc3RcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgaWYgKGtpbmQgIT09ICdsaXN0Jykge1xuICAgICAgICAgICAgZXJyb3IubWVzc2FnZSA9ICdKU09OIGlzIGEgb2JqZWN0LCBidXQgbXVzdCBiZSBhIGxpc3QnO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChraW5kICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgZXJyb3IubWVzc2FnZSA9ICdKU09OIGlzIGEgbGlzdCwgYnV0IG11c3QgYmUgYSBvYmplY3QnO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qIGNvbnZlcnQgdG8gc3RyaW5nICovXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn0iLCJpbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgVVVJREZpZWxkIH0gZnJvbSBcIi4vdXVpZFwiO1xuaW1wb3J0IHsgQ29uZmlnLCBkZWZhdWx0Q29uZmlnIH0gZnJvbSBcIi4vZmllbGRcIjtcbmltcG9ydCB7IFNjaGVtYSB9IGZyb20gXCIuLlwiO1xuXG5leHBvcnQgY2xhc3MgTWFueUZpZWxkIGV4dGVuZHMgVVVJREZpZWxkIHtcblxuICByZWFkb25seSBjb25maWc6IENvbmZpZztcbiAgcHJvdGVjdGVkIHJlZmVyZXI6IHR5cGVvZiBNb2RlbDtcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHJlZmVyZXI6IHR5cGVvZiBNb2RlbCwgY29uZmlnPzogUGFydGlhbDxDb25maWc+KSB7XG5cbiAgICBzdXBlcihgJHsgbmFtZSB9X2lkYCk7XG4gICAgdGhpcy5yZWZlcmVyID0gcmVmZXJlcjtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIC4uLmRlZmF1bHRDb25maWcsXG4gICAgICAuLi5jb25maWcsXG4gICAgfVxuICB9XG5cbiAgLypcbiAgcHVibGljIGRlZmluZVByb3BlcnR5KHNjaGVtYTogU2NoZW1hLCBtb2RlbDogTW9kZWwpOiB2b2lkIHtcbiAgICBcbiAgICBsZXQgY29sdW1uID0gdGhpcy5nZXROYW1lKCk7XG4gICAgbGV0IG5hbWUgPSBjb2x1bW4ucmVwbGFjZSgnX2lkJywgJycpO1xuICAgIGxldCBwcm94eSA9IHRoaXM7XG4gICAgbW9kZWxbbmFtZV0gPSBhc3luYyBmdW5jdGlvbihpdGVtPzogdHlwZW9mIHRoaXMucmVmZXJlcnxzdHJpbmcpIDogUHJvbWlzZTxNb2RlbHx2b2lkfHVuZGVmaW5lZD57XG4gICAgICBcbiAgICAgIGlmKGl0ZW0gPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgbGV0IGlkUmVmZXJlciA9IG1vZGVsW2NvbHVtbl07IFxuICAgICAgICByZXR1cm4gcHJveHkucmVmZXJlci5maW5kKCdpZCA9ID8nLCBpZFJlZmVyZXIpO1xuICAgICAgfVxuXG4gICAgICBpZihpdGVtIGluc3RhbmNlb2YgcHJveHkucmVmZXJlcil7XG4gICAgICAgIG1vZGVsW2NvbHVtbl0gPSBpdGVtLmlkO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICB9XG5cbiAgICAgIGxldCByZWYgPSBhd2FpdCBwcm94eS5yZWZlcmVyLmZpbmQoJ2lkID0gPycsIGl0ZW0pO1xuICAgICAgaWYocmVmID09PSB1bmRlZmluZWQpe1xuICAgICAgICB0aHJvdyB7Y29kZTogY29kZUVycm9yLlJlZmVyZXJOb3RGb3VuZCwgbWVzc2FnZTogYE5vdCBmb3VuZCAke2l0ZW19IG9uIHRhYmxlICR7bmFtZX1gfTtcbiAgICAgIH1cbiAgICAgIG1vZGVsW2NvbHVtbl0gPSByZWYuaWQ7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICB9XG4gICovXG59IiwiaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi4vYWRhcHRlci9hZGFwdGVyXCI7XG5pbXBvcnQgeyBGaWVsZCwgQ29uZmlnLCBkZWZhdWx0Q29uZmlnLCBGaWVsZEtpbmQgfSBmcm9tIFwiLi9maWVsZFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRleHRDb25maWcgZXh0ZW5kcyBDb25maWcgeyB9XG5cbmV4cG9ydCBjbGFzcyBUZXh0RmllbGQgZXh0ZW5kcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgY29uZmlnOiBUZXh0Q29uZmlnO1xuICByZWFkb25seSBraW5kOiBGaWVsZEtpbmQgPSBGaWVsZEtpbmQuVEVYVDtcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGNvbmZpZzogUGFydGlhbDxUZXh0Q29uZmlnPiA9IGRlZmF1bHRDb25maWcpIHtcblxuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLi4uZGVmYXVsdENvbmZpZyxcbiAgICAgIC4uLmNvbmZpZyxcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZnJvbURCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBLCB2YWx1ZTogc3RyaW5nfG51bGwpOiBzdHJpbmd8dW5kZWZpbmVkIHtcblxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyB0b0RCPEEgZXh0ZW5kcyBBZGFwdGVyLCBUIGV4dGVuZHMgTW9kZWw+KGFkYXB0ZXI6IEEsIG1vZGVsOiBUKTogc3RyaW5nfG51bGwge1xuXG4gICAgbGV0IG5hbWUgPSB0aGlzLmdldE5hbWUoKTtcbiAgICBsZXQgdmFsdWUgPSBtb2RlbFtuYW1lIGFzIGtleW9mIFRdO1xuXG4gICAgaWYodmFsdWUgPT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0VmFsdWUoKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlLnRyaW0oKTtcbiAgICB9XG5cbiAgICB0aHJvdyB7Y29kZTogbnVsbCwgbWVzc2FnZTogYHZhbHVlIG9mICR7bmFtZX0gdG8gREIgaXMgbm90IGEgc3RyaW5nYH07XG4gIH1cblxuICBwdWJsaWMgY2FzdERCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBKTogc3RyaW5nIHtcblxuICAgIHJldHVybiBhZGFwdGVyLmZpZWxkQ2FzdDxUZXh0RmllbGQ+KHRoaXMpO1xuICB9XG59IiwiaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gXCIuLi9hZGFwdGVyL2FkYXB0ZXJcIjtcbmltcG9ydCB7IEZpZWxkLCBDb25maWcsIGRlZmF1bHRDb25maWcsIEZpZWxkS2luZCB9IGZyb20gXCIuL2ZpZWxkXCI7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuXG5leHBvcnQgY2xhc3MgVVVJREZpZWxkIGV4dGVuZHMgRmllbGQge1xuXG4gIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnO1xuICByZWFkb25seSBraW5kOiBGaWVsZEtpbmQgPSBGaWVsZEtpbmQuVVVJRDtcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGNvbmZpZzogUGFydGlhbDxDb25maWc+ID0gZGVmYXVsdENvbmZpZykge1xuXG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgY2FzdERCKGFkYXB0ZXI6IEFkYXB0ZXIpOiBzdHJpbmcge1xuXG4gICAgcmV0dXJuIGFkYXB0ZXIuZmllbGRDYXN0PFVVSURGaWVsZD4odGhpcyk7XG4gIH1cblxuICBwdWJsaWMgZnJvbURCKHZhbHVlOiBhbnkpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhyb3cgeyBjb2RlOiBudWxsLCBtZXNzYWdlOiAndmFsdWUgZnJvbSBEQiBpcyBub3QgYSB2YWxpZCB1dWlkJyB9O1xuICB9XG5cbiAgcHVibGljIGdldERlZmF1bHRWYWx1ZSgpOiBhbnkge1xuXG4gICAgbGV0IHZhbHVlID0gc3VwZXIuZ2V0RGVmYXVsdFZhbHVlKCk7XG5cbiAgICBpZiAodmFsdWUgPT09IG51bGwgJiYgdGhpcy5jb25maWcucHJpbWFyeSkge1xuICAgICAgdmFsdWUgPSB1dWlkKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHRvREI8QSBleHRlbmRzIEFkYXB0ZXIsIE0gZXh0ZW5kcyBNb2RlbD4oYWRhcHRlcjogQSwgbW9kZWw6IE0pOiBhbnkge1xuXG4gICAgbGV0IHZhbHVlID0gc3VwZXIudG9EQjxBLCBNPihhZGFwdGVyLCBtb2RlbCk7XG4gICAgcmV0dXJuIGFkYXB0ZXIuZmllbGRUcmFuc2Zvcm1Ub0RCPEEsIFVVSURGaWVsZCwgTT4odGhpcywgdmFsdWUpO1xuICB9XG59IiwiaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gXCIuL2FkYXB0ZXIvYWRhcHRlclwiO1xuXG50eXBlIHRhc2tDYWxsYmFjayA9IHsgKHRyYW5zYWN0aW9uOiBTUUxUcmFuc2FjdGlvbik6IFByb21pc2U8dm9pZD4gfTtcblxuaW50ZXJmYWNlIHRhc2tWZXJzaW9uIHtcbiAgW3ZlcnNpb246IG51bWJlcl06IHRhc2tDYWxsYmFjaztcbn07XG5cbmV4cG9ydCBjbGFzcyBNaWdyYXRpb24ge1xuXG4gIHByb3RlY3RlZCBhZGFwdGVyOiBBZGFwdGVyO1xuICBwcml2YXRlIHRhc2tzOiB0YXNrVmVyc2lvbiA9IHt9O1xuICBwcml2YXRlIGZpcnN0QWNjZXNzPzogdGFza0NhbGxiYWNrO1xuXG4gIGNvbnN0cnVjdG9yKGFkYXB0ZXI6IEFkYXB0ZXIpIHtcbiAgICB0aGlzLmFkYXB0ZXIgPSBhZGFwdGVyO1xuICB9XG5cbiAgcHJvdGVjdGVkIG1ha2UoKTogdm9pZCB7IH1cblxuICBwdWJsaWMgYXN5bmMgcnVuKCk6IFByb21pc2U8dm9pZD4ge1xuXG4gICAgdGhpcy5tYWtlKCk7XG5cbiAgICBpZiAodGhpcy5maXJzdEFjY2VzcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyB7IGNvZGU6IG51bGwsIG1lc3NhZ2U6IGBGaXJzdEFjY2VzcyBNaWdyYXRpb24gbm90IGltcGxlbWVudGVkIWAgfTtcbiAgICB9XG5cbiAgICAvKlxuICAgIGxldCB2ZXJzaW9uID0gdGhpcy5hZGFwdGVyLmdldFZlcnNpb24oKTtcbiAgICBpZiAodmVyc2lvbiA9PT0gJycpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuY2hhbmdlVmVyc2lvbigwLCB0aGlzLmZpcnN0QWNjZXNzKTtcbiAgICB9XG4gICAgXG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuXG4gICAgICB2ZXJzaW9uKys7XG4gICAgICBsZXQgdGFzayA9IHRoaXMudGFza3NbdmVyc2lvbl07XG4gICAgICBpZiAodGFzayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCB0aGlzLmFkYXB0ZXIuY2hhbmdlVmVyc2lvbih2ZXJzaW9uLCB0YXNrKTtcbiAgICB9XG4qL1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZWdpc3RlckZpcnN0QWNjZXNzKGNhbGxiYWNrOiB0YXNrQ2FsbGJhY2spOiB2b2lkIHtcblxuICAgIGlmICh0aGlzLmZpcnN0QWNjZXNzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IHsgY29kZTogdW5kZWZpbmVkLCBtZXNzYWdlOiBgZmlyc3RBY2Nlc3MgY2FsbGJhY2sgYWxyZWFkeSByZWdpc3RlcmVkYCB9O1xuICAgIH1cblxuICAgIHRoaXMuZmlyc3RBY2Nlc3MgPSBjYWxsYmFjaztcbiAgfVxuXG4gIHByb3RlY3RlZCByZWdpc3Rlcih2ZXJzaW9uOiBudW1iZXIsIGNhbGxiYWNrOiB0YXNrQ2FsbGJhY2spOiB2b2lkIHtcblxuICAgIGlmICh0aGlzLnRhc2tzW3ZlcnNpb25dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IHsgY29kZTogdW5kZWZpbmVkLCBtZXNzYWdlOiBgY2FsbGJhY2sgdmVyc2lvbiAkeyB2ZXJzaW9uIH0gYWxyZWFkeSByZWdpc3RlcmVkYCB9O1xuICAgIH1cblxuICAgIHRoaXMudGFza3NbdmVyc2lvbl0gPSBjYWxsYmFjaztcbiAgfVxufSIsImltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi9hZGFwdGVyXCI7XG5pbXBvcnQgeyBTY2hlbWEgfSBmcm9tIFwiLi9zY2hlbWFcIjtcblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3JNb2RlbDxNIGV4dGVuZHMgTW9kZWw+ID0gbmV3IChpZDogc3RyaW5nKSA9PiBNO1xuXG5leHBvcnQgY2xhc3MgTW9kZWx7XG5cbiAgcmVhZG9ubHkgaWQ6IHN0cmluZztcblxuICBwdWJsaWMgX19kYXRhPzogb2JqZWN0O1xuXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLmlkID0gaWQ7XG4gIH1cbn1cblxuIiwiaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gXCIuL2FkYXB0ZXIvYWRhcHRlclwiO1xuaW1wb3J0IHsgU2VsZWN0IH0gZnJvbSBcIi4vYWRhcHRlci9zZWxlY3RcIjtcbmltcG9ydCB7IEluc2VydCB9IGZyb20gXCIuL2FkYXB0ZXIvaW5zZXJ0XCI7XG5pbXBvcnQgeyBwYXJhbXNUeXBlIH0gZnJvbSBcIi4vYWRhcHRlci9xdWVyeVwiO1xuaW1wb3J0IHsgTW9kZWwsIENvbnN0cnVjdG9yTW9kZWwgfSBmcm9tIFwiLi9tb2RlbFwiO1xuaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi9maWVsZC9maWVsZFwiO1xuaW1wb3J0IHsgQ3JlYXRlIH0gZnJvbSBcIi4vYWRhcHRlci9jcmVhdGVcIjtcbmltcG9ydCB7IFVVSURGaWVsZCB9IGZyb20gXCIuL2ZpZWxkL3V1aWRcIjtcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcblxuZXhwb3J0IGVudW0gY29kZVNjaGVtYUVycm9yIHtcbiAgJ1Bvc3RTYXZlTm90Rm91bmQnID0gJ0BzdG9yYWdvL29ybS9zY2hlbWEvUG9zdFNhdmVOb3RGb3VuZCcsXG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTY2hlbWE8QSBleHRlbmRzIEFkYXB0ZXIsIE0gZXh0ZW5kcyBNb2RlbD4ge1xuXG4gIGFic3RyYWN0IHJlYWRvbmx5IE1vZGVsOiBDb25zdHJ1Y3Rvck1vZGVsPE0+O1xuICBhYnN0cmFjdCByZWFkb25seSBuYW1lOiBzdHJpbmc7XG4gIFxuICByZWFkb25seSBmaWVsZHM6IEZpZWxkW10gPSBbXTtcblxuICByZWFkb25seSBhZGFwdGVyOiBBO1xuXG4gIHByb3RlY3RlZCBzdXBlckZpZWxkczogRmllbGRbXSA9IFtcbiAgICBuZXcgVVVJREZpZWxkKCdpZCcsIHsgcHJpbWFyeTogdHJ1ZSB9KSxcbiAgXTtcblxuICBjb25zdHJ1Y3RvcihhZGFwdGVyOiBBKSB7XG5cbiAgICB0aGlzLmFkYXB0ZXIgPSBhZGFwdGVyO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNhdmUobW9kZWw6IE0pOiBQcm9taXNlPE0+IHtcblxuICAgIGlmIChtb2RlbC5fX2RhdGEpIHtcbiAgICAgIC8vdXBkYXRlIGFyZWFcbiAgICB9IGVsc2Uge1xuXG4gICAgICBsZXQgaW5zZXJ0ID0gdGhpcy5pbnNlcnQoKTtcbiAgICAgIGluc2VydC5hZGQobW9kZWwpO1xuICAgICAgYXdhaXQgaW5zZXJ0LnNhdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5yZWZyZXNoTW9kZWwobW9kZWwpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHJlZnJlc2hNb2RlbChtb2RlbDogTSk6IFByb21pc2U8TT4ge1xuXG4gICAgbGV0IGlkID0gbW9kZWxbJ2lkJ107XG5cbiAgICBsZXQgaXRlbSA9IGF3YWl0IHRoaXMuZmluZCgnaWQgPSA/JywgaWQpO1xuICAgIGlmIChpdGVtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IHsgY29kZTogY29kZVNjaGVtYUVycm9yLlBvc3RTYXZlTm90Rm91bmQsIG1lc3NhZ2U6IGBGYWlsIHRvIGZpbmQgaWQ6ICR7IGlkIH1gIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucG9wdWxhdGVGcm9tREIoaXRlbSwgbW9kZWwpO1xuICB9XG5cbiAgcHVibGljIGdldE1vZGVsQ2xhc3MoKTogQ29uc3RydWN0b3JNb2RlbDxNPiB7XG5cbiAgICByZXR1cm4gdGhpcy5Nb2RlbDtcbiAgfVxuXG4gIHB1YmxpYyBnZXROYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRGaWVsZHMoKTogRmllbGRbXSB7XG5cbiAgICByZXR1cm4gWy4uLnRoaXMuc3VwZXJGaWVsZHMsIC4uLnRoaXMuZmllbGRzXTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRGaWVsZChuYW1lOiBzdHJpbmcpOiBGaWVsZCB7XG5cbiAgICBmb3IgKGxldCBmaWVsZCBvZiB0aGlzLmdldEZpZWxkcygpKSB7XG4gICAgICBpZiAobmFtZSA9PSBmaWVsZC5nZXROYW1lKCkpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRocm93IHsgY29kZTogbnVsbCwgbWVzc2FnZTogYEZpZWxkIHdpdGggbmFtZTogJHsgbmFtZSB9IG5vdCBleGlzdHMgaW4gJHsgdGhpcy5uYW1lIH1gIH07XG4gIH1cblxuICBwdWJsaWMgZ2V0Q29sdW1ucygpOiBzdHJpbmdbXSB7XG5cbiAgICBsZXQgY29sdW1uczogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgZmllbGRzID0gdGhpcy5nZXRGaWVsZHMoKTtcbiAgICBmb3IgKGxldCBmaWVsZCBvZiB0aGlzLmdldEZpZWxkcygpKSB7XG4gICAgICBjb2x1bW5zLnB1c2goZmllbGQuZ2V0TmFtZSgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29sdW1ucztcbiAgfVxuXG4gIHB1YmxpYyBmaW5kKHdoZXJlOiBzdHJpbmcsIHBhcmFtOiBwYXJhbXNUeXBlKTogUHJvbWlzZTxNIHwgdW5kZWZpbmVkPiB7XG5cbiAgICBsZXQgc2VsZWN0ID0gdGhpcy5zZWxlY3QoKTtcbiAgICBzZWxlY3Qud2hlcmUod2hlcmUsIHBhcmFtKTtcbiAgICByZXR1cm4gc2VsZWN0Lm9uZSgpO1xuICB9O1xuXG4gIHB1YmxpYyBnZXRBZGFwdGVyKCk6IEEge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXI7XG4gIH1cblxuICBwdWJsaWMgc2VsZWN0KCk6IFNlbGVjdDxBLCBNPiB7XG4gICAgbGV0IHNlbGVjdCA9IHRoaXMuYWRhcHRlci5zZWxlY3Q8QSwgTT4odGhpcyk7XG4gICAgc2VsZWN0LmZyb20odGhpcy5nZXROYW1lKCksIHRoaXMuZ2V0Q29sdW1ucygpKTtcbiAgICByZXR1cm4gc2VsZWN0O1xuICB9XG5cbiAgcHVibGljIGluc2VydCgpOiBJbnNlcnQ8QSwgTT4ge1xuICAgIGxldCBpbnNlcnQgPSB0aGlzLmFkYXB0ZXIuaW5zZXJ0PEEsIE0+KHRoaXMpO1xuICAgIHJldHVybiBpbnNlcnQ7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlVGFibGUoKTogQ3JlYXRlPEEsIE0+IHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmNyZWF0ZTxBLCBNPih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBuZXdNb2RlbCgpOiBNIHtcblxuICAgIHJldHVybiBuZXcgdGhpcy5Nb2RlbCh1dWlkKCkpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHBvcHVsYXRlRnJvbURCKHJvdzogeyBbaW5kZXg6IHN0cmluZ106IGFueTsgfSwgbW9kZWw/OiBNKTogUHJvbWlzZTxNPiB7XG5cbiAgICBpZiAobW9kZWwgPT0gdW5kZWZpbmVkKSB7XG4gICAgICBtb2RlbCA9IHRoaXMubmV3TW9kZWwoKTtcbiAgICB9XG5cbiAgICBsZXQgZmllbGRzID0gdGhpcy5nZXRGaWVsZHMoKTtcbiAgICBtb2RlbC5fX2RhdGEgPSByb3c7XG4gICAgZm9yIChsZXQgZmllbGQgb2YgZmllbGRzKSB7XG4gICAgICBsZXQgbmFtZSA9IGZpZWxkLmdldE5hbWUoKTtcbiAgICAgIGlmIChuYW1lID09ICdpZCcpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBtb2RlbFtuYW1lIGFzIGtleW9mIE1dID0gZmllbGQuZnJvbURCKHRoaXMuYWRhcHRlciwgcm93W25hbWVdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbW9kZWw7XG4gIH1cblxuICAvKlxuICBwdWJsaWMgYXN5bmMgcG9wdWxhdGVGcm9tREI8VCBleHRlbmRzIE1vZGVsPihyb3c6IHsgW2luZGV4OiBzdHJpbmddOiBhbnk7IH0sIG1vZGVsOiBUKTogUHJvbWlzZTxUPiB7XG5cbiAgICBsZXQgcHJvbWlzZXM6IFByb21pc2U8YW55PltdID0gW107XG4gICAgbGV0IGZpZWxkcyA9IHRoaXMuZ2V0UmVhbEZpZWxkcygpO1xuICAgIGxldCBrZXlzOiBzdHJpbmdbXSA9IFtdO1xuICBcbiAgICBmb3IgKGxldCBmaWVsZCBvZiBmaWVsZHMpIHtcbiAgICAgIGxldCBuYW1lID0gZmllbGQuZ2V0TmFtZSgpO1xuICAgICAgbGV0IHByb21pc2VQb3B1bGF0ZSA9IGZpZWxkLnBvcHVsYXRlKG1vZGVsLCByb3cpO1xuICAgICAgbW9kZWwuX19kYXRhW25hbWVdID0gcHJvbWlzZVBvcHVsYXRlO1xuICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlUG9wdWxhdGUpO1xuICAgICAga2V5cy5wdXNoKG5hbWUpO1xuICAgIH1cblxuICAgIGxldCBkYXRhID0gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIGZvcihsZXQgayBpbiBrZXlzKXtcbiAgICAgIGxldCBuYW1lID0ga2V5c1trXTtcbiAgICAgIG1vZGVsW25hbWUgYXMga2V5b2YgVF0gPSBkYXRhW2tdO1xuICAgIH1cblxuICAgIHJldHVybiBtb2RlbDtcbiAgfVxuXG4gIHB1YmxpYyBkZWZpbmVQcm9wZXJ0aWVzKG1vZGVsOiBNb2RlbCkgOiB2b2lkIHtcblxuICAgIGZvcihsZXQgZmllbGQgb2YgdGhpcy5nZXRGaWVsZHMoKSl7XG4gICAgICBmaWVsZC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBtb2RlbCk7XG4gICAgfVxuICB9IFxuICAqL1xufSIsImV4cG9ydCB7IGRlZmF1bHQgYXMgdjEgfSBmcm9tICcuL3YxLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdjMgfSBmcm9tICcuL3YzLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdjQgfSBmcm9tICcuL3Y0LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdjUgfSBmcm9tICcuL3Y1LmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTklMIH0gZnJvbSAnLi9uaWwuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2ZXJzaW9uIH0gZnJvbSAnLi92ZXJzaW9uLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdmFsaWRhdGUgfSBmcm9tICcuL3ZhbGlkYXRlLmpzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc3RyaW5naWZ5IH0gZnJvbSAnLi9zdHJpbmdpZnkuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBwYXJzZSB9IGZyb20gJy4vcGFyc2UuanMnOyIsImltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcblxuZnVuY3Rpb24gbWQ1KGJ5dGVzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGJ5dGVzKSkge1xuICAgIGJ5dGVzID0gQnVmZmVyLmZyb20oYnl0ZXMpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBieXRlcyA9PT0gJ3N0cmluZycpIHtcbiAgICBieXRlcyA9IEJ1ZmZlci5mcm9tKGJ5dGVzLCAndXRmOCcpO1xuICB9XG5cbiAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdtZDUnKS51cGRhdGUoYnl0ZXMpLmRpZ2VzdCgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtZDU7IiwiZXhwb3J0IGRlZmF1bHQgJzAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCc7IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuXG5mdW5jdGlvbiBwYXJzZSh1dWlkKSB7XG4gIGlmICghdmFsaWRhdGUodXVpZCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ0ludmFsaWQgVVVJRCcpO1xuICB9XG5cbiAgbGV0IHY7XG4gIGNvbnN0IGFyciA9IG5ldyBVaW50OEFycmF5KDE2KTsgLy8gUGFyc2UgIyMjIyMjIyMtLi4uLi0uLi4uLS4uLi4tLi4uLi4uLi4uLi4uXG5cbiAgYXJyWzBdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDAsIDgpLCAxNikpID4+PiAyNDtcbiAgYXJyWzFdID0gdiA+Pj4gMTYgJiAweGZmO1xuICBhcnJbMl0gPSB2ID4+PiA4ICYgMHhmZjtcbiAgYXJyWzNdID0gdiAmIDB4ZmY7IC8vIFBhcnNlIC4uLi4uLi4uLSMjIyMtLi4uLi0uLi4uLS4uLi4uLi4uLi4uLlxuXG4gIGFycls0XSA9ICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSg5LCAxMyksIDE2KSkgPj4+IDg7XG4gIGFycls1XSA9IHYgJiAweGZmOyAvLyBQYXJzZSAuLi4uLi4uLi0uLi4uLSMjIyMtLi4uLi0uLi4uLi4uLi4uLi5cblxuICBhcnJbNl0gPSAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoMTQsIDE4KSwgMTYpKSA+Pj4gODtcbiAgYXJyWzddID0gdiAmIDB4ZmY7IC8vIFBhcnNlIC4uLi4uLi4uLS4uLi4tLi4uLi0jIyMjLS4uLi4uLi4uLi4uLlxuXG4gIGFycls4XSA9ICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSgxOSwgMjMpLCAxNikpID4+PiA4O1xuICBhcnJbOV0gPSB2ICYgMHhmZjsgLy8gUGFyc2UgLi4uLi4uLi4tLi4uLi0uLi4uLS4uLi4tIyMjIyMjIyMjIyMjXG4gIC8vIChVc2UgXCIvXCIgdG8gYXZvaWQgMzItYml0IHRydW5jYXRpb24gd2hlbiBiaXQtc2hpZnRpbmcgaGlnaC1vcmRlciBieXRlcylcblxuICBhcnJbMTBdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDI0LCAzNiksIDE2KSkgLyAweDEwMDAwMDAwMDAwICYgMHhmZjtcbiAgYXJyWzExXSA9IHYgLyAweDEwMDAwMDAwMCAmIDB4ZmY7XG4gIGFyclsxMl0gPSB2ID4+PiAyNCAmIDB4ZmY7XG4gIGFyclsxM10gPSB2ID4+PiAxNiAmIDB4ZmY7XG4gIGFyclsxNF0gPSB2ID4+PiA4ICYgMHhmZjtcbiAgYXJyWzE1XSA9IHYgJiAweGZmO1xuICByZXR1cm4gYXJyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwYXJzZTsiLCJleHBvcnQgZGVmYXVsdCAvXig/OlswLTlhLWZdezh9LVswLTlhLWZdezR9LVsxLTVdWzAtOWEtZl17M30tWzg5YWJdWzAtOWEtZl17M30tWzAtOWEtZl17MTJ9fDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCkkL2k7IiwiaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nO1xuY29uc3Qgcm5kczhQb29sID0gbmV3IFVpbnQ4QXJyYXkoMjU2KTsgLy8gIyBvZiByYW5kb20gdmFsdWVzIHRvIHByZS1hbGxvY2F0ZVxuXG5sZXQgcG9vbFB0ciA9IHJuZHM4UG9vbC5sZW5ndGg7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBybmcoKSB7XG4gIGlmIChwb29sUHRyID4gcm5kczhQb29sLmxlbmd0aCAtIDE2KSB7XG4gICAgY3J5cHRvLnJhbmRvbUZpbGxTeW5jKHJuZHM4UG9vbCk7XG4gICAgcG9vbFB0ciA9IDA7XG4gIH1cblxuICByZXR1cm4gcm5kczhQb29sLnNsaWNlKHBvb2xQdHIsIHBvb2xQdHIgKz0gMTYpO1xufSIsImltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcblxuZnVuY3Rpb24gc2hhMShieXRlcykge1xuICBpZiAoQXJyYXkuaXNBcnJheShieXRlcykpIHtcbiAgICBieXRlcyA9IEJ1ZmZlci5mcm9tKGJ5dGVzKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgYnl0ZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgYnl0ZXMgPSBCdWZmZXIuZnJvbShieXRlcywgJ3V0ZjgnKTtcbiAgfVxuXG4gIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShieXRlcykuZGlnZXN0KCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNoYTE7IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDE2IGJ5dGUgdmFsdWVzIHRvIFVVSUQgc3RyaW5nIGZvcm1hdCBvZiB0aGUgZm9ybTpcbiAqIFhYWFhYWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG5cbmNvbnN0IGJ5dGVUb0hleCA9IFtdO1xuXG5mb3IgKGxldCBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleC5wdXNoKChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSkpO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkoYXJyLCBvZmZzZXQgPSAwKSB7XG4gIC8vIE5vdGU6IEJlIGNhcmVmdWwgZWRpdGluZyB0aGlzIGNvZGUhICBJdCdzIGJlZW4gdHVuZWQgZm9yIHBlcmZvcm1hbmNlXG4gIC8vIGFuZCB3b3JrcyBpbiB3YXlzIHlvdSBtYXkgbm90IGV4cGVjdC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZC9wdWxsLzQzNFxuICBjb25zdCB1dWlkID0gKGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDJdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgM11dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDVdXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA3XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDhdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMV1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxM11dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxNF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxNV1dKS50b0xvd2VyQ2FzZSgpOyAvLyBDb25zaXN0ZW5jeSBjaGVjayBmb3IgdmFsaWQgVVVJRC4gIElmIHRoaXMgdGhyb3dzLCBpdCdzIGxpa2VseSBkdWUgdG8gb25lXG4gIC8vIG9mIHRoZSBmb2xsb3dpbmc6XG4gIC8vIC0gT25lIG9yIG1vcmUgaW5wdXQgYXJyYXkgdmFsdWVzIGRvbid0IG1hcCB0byBhIGhleCBvY3RldCAobGVhZGluZyB0b1xuICAvLyBcInVuZGVmaW5lZFwiIGluIHRoZSB1dWlkKVxuICAvLyAtIEludmFsaWQgaW5wdXQgdmFsdWVzIGZvciB0aGUgUkZDIGB2ZXJzaW9uYCBvciBgdmFyaWFudGAgZmllbGRzXG5cbiAgaWYgKCF2YWxpZGF0ZSh1dWlkKSkge1xuICAgIHRocm93IFR5cGVFcnJvcignU3RyaW5naWZpZWQgVVVJRCBpcyBpbnZhbGlkJyk7XG4gIH1cblxuICByZXR1cm4gdXVpZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RyaW5naWZ5OyIsImltcG9ydCBybmcgZnJvbSAnLi9ybmcuanMnO1xuaW1wb3J0IHN0cmluZ2lmeSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7IC8vICoqYHYxKClgIC0gR2VuZXJhdGUgdGltZS1iYXNlZCBVVUlEKipcbi8vXG4vLyBJbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vTGlvc0svVVVJRC5qc1xuLy8gYW5kIGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS91dWlkLmh0bWxcblxubGV0IF9ub2RlSWQ7XG5cbmxldCBfY2xvY2tzZXE7IC8vIFByZXZpb3VzIHV1aWQgY3JlYXRpb24gdGltZVxuXG5cbmxldCBfbGFzdE1TZWNzID0gMDtcbmxldCBfbGFzdE5TZWNzID0gMDsgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZCBmb3IgQVBJIGRldGFpbHNcblxuZnVuY3Rpb24gdjEob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgbGV0IGkgPSBidWYgJiYgb2Zmc2V0IHx8IDA7XG4gIGNvbnN0IGIgPSBidWYgfHwgbmV3IEFycmF5KDE2KTtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxldCBub2RlID0gb3B0aW9ucy5ub2RlIHx8IF9ub2RlSWQ7XG4gIGxldCBjbG9ja3NlcSA9IG9wdGlvbnMuY2xvY2tzZXEgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY2xvY2tzZXEgOiBfY2xvY2tzZXE7IC8vIG5vZGUgYW5kIGNsb2Nrc2VxIG5lZWQgdG8gYmUgaW5pdGlhbGl6ZWQgdG8gcmFuZG9tIHZhbHVlcyBpZiB0aGV5J3JlIG5vdFxuICAvLyBzcGVjaWZpZWQuICBXZSBkbyB0aGlzIGxhemlseSB0byBtaW5pbWl6ZSBpc3N1ZXMgcmVsYXRlZCB0byBpbnN1ZmZpY2llbnRcbiAgLy8gc3lzdGVtIGVudHJvcHkuICBTZWUgIzE4OVxuXG4gIGlmIChub2RlID09IG51bGwgfHwgY2xvY2tzZXEgPT0gbnVsbCkge1xuICAgIGNvbnN0IHNlZWRCeXRlcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBybmcpKCk7XG5cbiAgICBpZiAobm9kZSA9PSBudWxsKSB7XG4gICAgICAvLyBQZXIgNC41LCBjcmVhdGUgYW5kIDQ4LWJpdCBub2RlIGlkLCAoNDcgcmFuZG9tIGJpdHMgKyBtdWx0aWNhc3QgYml0ID0gMSlcbiAgICAgIG5vZGUgPSBfbm9kZUlkID0gW3NlZWRCeXRlc1swXSB8IDB4MDEsIHNlZWRCeXRlc1sxXSwgc2VlZEJ5dGVzWzJdLCBzZWVkQnl0ZXNbM10sIHNlZWRCeXRlc1s0XSwgc2VlZEJ5dGVzWzVdXTtcbiAgICB9XG5cbiAgICBpZiAoY2xvY2tzZXEgPT0gbnVsbCkge1xuICAgICAgLy8gUGVyIDQuMi4yLCByYW5kb21pemUgKDE0IGJpdCkgY2xvY2tzZXFcbiAgICAgIGNsb2Nrc2VxID0gX2Nsb2Nrc2VxID0gKHNlZWRCeXRlc1s2XSA8PCA4IHwgc2VlZEJ5dGVzWzddKSAmIDB4M2ZmZjtcbiAgICB9XG4gIH0gLy8gVVVJRCB0aW1lc3RhbXBzIGFyZSAxMDAgbmFuby1zZWNvbmQgdW5pdHMgc2luY2UgdGhlIEdyZWdvcmlhbiBlcG9jaCxcbiAgLy8gKDE1ODItMTAtMTUgMDA6MDApLiAgSlNOdW1iZXJzIGFyZW4ndCBwcmVjaXNlIGVub3VnaCBmb3IgdGhpcywgc29cbiAgLy8gdGltZSBpcyBoYW5kbGVkIGludGVybmFsbHkgYXMgJ21zZWNzJyAoaW50ZWdlciBtaWxsaXNlY29uZHMpIGFuZCAnbnNlY3MnXG4gIC8vICgxMDAtbmFub3NlY29uZHMgb2Zmc2V0IGZyb20gbXNlY3MpIHNpbmNlIHVuaXggZXBvY2gsIDE5NzAtMDEtMDEgMDA6MDAuXG5cblxuICBsZXQgbXNlY3MgPSBvcHRpb25zLm1zZWNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm1zZWNzIDogRGF0ZS5ub3coKTsgLy8gUGVyIDQuMi4xLjIsIHVzZSBjb3VudCBvZiB1dWlkJ3MgZ2VuZXJhdGVkIGR1cmluZyB0aGUgY3VycmVudCBjbG9ja1xuICAvLyBjeWNsZSB0byBzaW11bGF0ZSBoaWdoZXIgcmVzb2x1dGlvbiBjbG9ja1xuXG4gIGxldCBuc2VjcyA9IG9wdGlvbnMubnNlY3MgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubnNlY3MgOiBfbGFzdE5TZWNzICsgMTsgLy8gVGltZSBzaW5jZSBsYXN0IHV1aWQgY3JlYXRpb24gKGluIG1zZWNzKVxuXG4gIGNvbnN0IGR0ID0gbXNlY3MgLSBfbGFzdE1TZWNzICsgKG5zZWNzIC0gX2xhc3ROU2VjcykgLyAxMDAwMDsgLy8gUGVyIDQuMi4xLjIsIEJ1bXAgY2xvY2tzZXEgb24gY2xvY2sgcmVncmVzc2lvblxuXG4gIGlmIChkdCA8IDAgJiYgb3B0aW9ucy5jbG9ja3NlcSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY2xvY2tzZXEgPSBjbG9ja3NlcSArIDEgJiAweDNmZmY7XG4gIH0gLy8gUmVzZXQgbnNlY3MgaWYgY2xvY2sgcmVncmVzc2VzIChuZXcgY2xvY2tzZXEpIG9yIHdlJ3ZlIG1vdmVkIG9udG8gYSBuZXdcbiAgLy8gdGltZSBpbnRlcnZhbFxuXG5cbiAgaWYgKChkdCA8IDAgfHwgbXNlY3MgPiBfbGFzdE1TZWNzKSAmJiBvcHRpb25zLm5zZWNzID09PSB1bmRlZmluZWQpIHtcbiAgICBuc2VjcyA9IDA7XG4gIH0gLy8gUGVyIDQuMi4xLjIgVGhyb3cgZXJyb3IgaWYgdG9vIG1hbnkgdXVpZHMgYXJlIHJlcXVlc3RlZFxuXG5cbiAgaWYgKG5zZWNzID49IDEwMDAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwidXVpZC52MSgpOiBDYW4ndCBjcmVhdGUgbW9yZSB0aGFuIDEwTSB1dWlkcy9zZWNcIik7XG4gIH1cblxuICBfbGFzdE1TZWNzID0gbXNlY3M7XG4gIF9sYXN0TlNlY3MgPSBuc2VjcztcbiAgX2Nsb2Nrc2VxID0gY2xvY2tzZXE7IC8vIFBlciA0LjEuNCAtIENvbnZlcnQgZnJvbSB1bml4IGVwb2NoIHRvIEdyZWdvcmlhbiBlcG9jaFxuXG4gIG1zZWNzICs9IDEyMjE5MjkyODAwMDAwOyAvLyBgdGltZV9sb3dgXG5cbiAgY29uc3QgdGwgPSAoKG1zZWNzICYgMHhmZmZmZmZmKSAqIDEwMDAwICsgbnNlY3MpICUgMHgxMDAwMDAwMDA7XG4gIGJbaSsrXSA9IHRsID4+PiAyNCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsID4+PiAxNiAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsID4+PiA4ICYgMHhmZjtcbiAgYltpKytdID0gdGwgJiAweGZmOyAvLyBgdGltZV9taWRgXG5cbiAgY29uc3QgdG1oID0gbXNlY3MgLyAweDEwMDAwMDAwMCAqIDEwMDAwICYgMHhmZmZmZmZmO1xuICBiW2krK10gPSB0bWggPj4+IDggJiAweGZmO1xuICBiW2krK10gPSB0bWggJiAweGZmOyAvLyBgdGltZV9oaWdoX2FuZF92ZXJzaW9uYFxuXG4gIGJbaSsrXSA9IHRtaCA+Pj4gMjQgJiAweGYgfCAweDEwOyAvLyBpbmNsdWRlIHZlcnNpb25cblxuICBiW2krK10gPSB0bWggPj4+IDE2ICYgMHhmZjsgLy8gYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgIChQZXIgNC4yLjIgLSBpbmNsdWRlIHZhcmlhbnQpXG5cbiAgYltpKytdID0gY2xvY2tzZXEgPj4+IDggfCAweDgwOyAvLyBgY2xvY2tfc2VxX2xvd2BcblxuICBiW2krK10gPSBjbG9ja3NlcSAmIDB4ZmY7IC8vIGBub2RlYFxuXG4gIGZvciAobGV0IG4gPSAwOyBuIDwgNjsgKytuKSB7XG4gICAgYltpICsgbl0gPSBub2RlW25dO1xuICB9XG5cbiAgcmV0dXJuIGJ1ZiB8fCBzdHJpbmdpZnkoYik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHYxOyIsImltcG9ydCB2MzUgZnJvbSAnLi92MzUuanMnO1xuaW1wb3J0IG1kNSBmcm9tICcuL21kNS5qcyc7XG5jb25zdCB2MyA9IHYzNSgndjMnLCAweDMwLCBtZDUpO1xuZXhwb3J0IGRlZmF1bHQgdjM7IiwiaW1wb3J0IHN0cmluZ2lmeSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7XG5pbXBvcnQgcGFyc2UgZnJvbSAnLi9wYXJzZS5qcyc7XG5cbmZ1bmN0aW9uIHN0cmluZ1RvQnl0ZXMoc3RyKSB7XG4gIHN0ciA9IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChzdHIpKTsgLy8gVVRGOCBlc2NhcGVcblxuICBjb25zdCBieXRlcyA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgYnl0ZXMucHVzaChzdHIuY2hhckNvZGVBdChpKSk7XG4gIH1cblxuICByZXR1cm4gYnl0ZXM7XG59XG5cbmV4cG9ydCBjb25zdCBETlMgPSAnNmJhN2I4MTAtOWRhZC0xMWQxLTgwYjQtMDBjMDRmZDQzMGM4JztcbmV4cG9ydCBjb25zdCBVUkwgPSAnNmJhN2I4MTEtOWRhZC0xMWQxLTgwYjQtMDBjMDRmZDQzMGM4JztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChuYW1lLCB2ZXJzaW9uLCBoYXNoZnVuYykge1xuICBmdW5jdGlvbiBnZW5lcmF0ZVVVSUQodmFsdWUsIG5hbWVzcGFjZSwgYnVmLCBvZmZzZXQpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgdmFsdWUgPSBzdHJpbmdUb0J5dGVzKHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG5hbWVzcGFjZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWVzcGFjZSA9IHBhcnNlKG5hbWVzcGFjZSk7XG4gICAgfVxuXG4gICAgaWYgKG5hbWVzcGFjZS5sZW5ndGggIT09IDE2KSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ05hbWVzcGFjZSBtdXN0IGJlIGFycmF5LWxpa2UgKDE2IGl0ZXJhYmxlIGludGVnZXIgdmFsdWVzLCAwLTI1NSknKTtcbiAgICB9IC8vIENvbXB1dGUgaGFzaCBvZiBuYW1lc3BhY2UgYW5kIHZhbHVlLCBQZXIgNC4zXG4gICAgLy8gRnV0dXJlOiBVc2Ugc3ByZWFkIHN5bnRheCB3aGVuIHN1cHBvcnRlZCBvbiBhbGwgcGxhdGZvcm1zLCBlLmcuIGBieXRlcyA9XG4gICAgLy8gaGFzaGZ1bmMoWy4uLm5hbWVzcGFjZSwgLi4uIHZhbHVlXSlgXG5cblxuICAgIGxldCBieXRlcyA9IG5ldyBVaW50OEFycmF5KDE2ICsgdmFsdWUubGVuZ3RoKTtcbiAgICBieXRlcy5zZXQobmFtZXNwYWNlKTtcbiAgICBieXRlcy5zZXQodmFsdWUsIG5hbWVzcGFjZS5sZW5ndGgpO1xuICAgIGJ5dGVzID0gaGFzaGZ1bmMoYnl0ZXMpO1xuICAgIGJ5dGVzWzZdID0gYnl0ZXNbNl0gJiAweDBmIHwgdmVyc2lvbjtcbiAgICBieXRlc1s4XSA9IGJ5dGVzWzhdICYgMHgzZiB8IDB4ODA7XG5cbiAgICBpZiAoYnVmKSB7XG4gICAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgKytpKSB7XG4gICAgICAgIGJ1ZltvZmZzZXQgKyBpXSA9IGJ5dGVzW2ldO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYnVmO1xuICAgIH1cblxuICAgIHJldHVybiBzdHJpbmdpZnkoYnl0ZXMpO1xuICB9IC8vIEZ1bmN0aW9uI25hbWUgaXMgbm90IHNldHRhYmxlIG9uIHNvbWUgcGxhdGZvcm1zICgjMjcwKVxuXG5cbiAgdHJ5IHtcbiAgICBnZW5lcmF0ZVVVSUQubmFtZSA9IG5hbWU7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lbXB0eVxuICB9IGNhdGNoIChlcnIpIHt9IC8vIEZvciBDb21tb25KUyBkZWZhdWx0IGV4cG9ydCBzdXBwb3J0XG5cblxuICBnZW5lcmF0ZVVVSUQuRE5TID0gRE5TO1xuICBnZW5lcmF0ZVVVSUQuVVJMID0gVVJMO1xuICByZXR1cm4gZ2VuZXJhdGVVVUlEO1xufSIsImltcG9ydCBybmcgZnJvbSAnLi9ybmcuanMnO1xuaW1wb3J0IHN0cmluZ2lmeSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7XG5cbmZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBjb25zdCBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTsgLy8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuXG4gIHJuZHNbNl0gPSBybmRzWzZdICYgMHgwZiB8IDB4NDA7XG4gIHJuZHNbOF0gPSBybmRzWzhdICYgMHgzZiB8IDB4ODA7IC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuXG4gIGlmIChidWYpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgICAgYnVmW29mZnNldCArIGldID0gcm5kc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgcmV0dXJuIHN0cmluZ2lmeShybmRzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdjQ7IiwiaW1wb3J0IHYzNSBmcm9tICcuL3YzNS5qcyc7XG5pbXBvcnQgc2hhMSBmcm9tICcuL3NoYTEuanMnO1xuY29uc3QgdjUgPSB2MzUoJ3Y1JywgMHg1MCwgc2hhMSk7XG5leHBvcnQgZGVmYXVsdCB2NTsiLCJpbXBvcnQgUkVHRVggZnJvbSAnLi9yZWdleC5qcyc7XG5cbmZ1bmN0aW9uIHZhbGlkYXRlKHV1aWQpIHtcbiAgcmV0dXJuIHR5cGVvZiB1dWlkID09PSAnc3RyaW5nJyAmJiBSRUdFWC50ZXN0KHV1aWQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2YWxpZGF0ZTsiLCJpbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG5cbmZ1bmN0aW9uIHZlcnNpb24odXVpZCkge1xuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdJbnZhbGlkIFVVSUQnKTtcbiAgfVxuXG4gIHJldHVybiBwYXJzZUludCh1dWlkLnN1YnN0cigxNCwgMSksIDE2KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdmVyc2lvbjsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjcnlwdG9cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImV4cG9ydCB7IGRlYnVnIH0gZnJvbSAnLi9kZWJ1Zyc7XG5cbmV4cG9ydCB7IE1vZGVsLCBDb25zdHJ1Y3Rvck1vZGVsIH0gZnJvbSAnLi9tb2RlbCc7XG5leHBvcnQgeyBTY2hlbWEgfSBmcm9tICcuL3NjaGVtYSc7XG5leHBvcnQgeyBBZGFwdGVyLCBTZWxlY3QsIENyZWF0ZSwgSW5zZXJ0LCBwYXJhbXNUeXBlIH0gZnJvbSAnLi9hZGFwdGVyJztcbmV4cG9ydCB7IGZpZWxkcywgRmllbGQsIEZpZWxkS2luZCwgY29kZUZpZWxkRXJyb3IgfSBmcm9tICcuL2ZpZWxkJztcbmV4cG9ydCB7IE1pZ3JhdGlvbiB9IGZyb20gJy4vbWlncmF0aW9uJztcblxuLy9leHBvcnQgeyBzZXNzaW9uLCBzZXREZWZhdWx0QWRhcHRlciwgZ2V0RGVmYXVsdEFkYXB0ZXIgfSBmcm9tICcuL3Nlc3Npb24nOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==