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
        console.log('fields', [this.superFields, this.fields]);
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
        console.log('fields', fields);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7QUNOQSxtRUFBZ0M7QUFBdkIsb0dBQUs7QUFFZCxtRUFBa0Q7QUFBekMsb0dBQUs7QUFDZCxzRUFBa0M7QUFBekIsdUdBQU07QUFFZix5RUFBbUU7QUFBMUQsc0dBQU07QUFBRSxvR0FBSztBQUFFLDRHQUFTO0FBQUUsc0hBQWM7QUFDakQsK0VBQXdDO0FBQS9CLGdIQUFTIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2RlYnVnLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC9ib29sZWFuLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC9kYXRldGltZS50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvZmllbGQudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL2luZGV4LnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC9pbnRlZ2VyLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC9qc29uLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC9tYW55LnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC90ZXh0LnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC91dWlkLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9taWdyYXRpb24udHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL21vZGVsLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9zY2hlbWEudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL21kNS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL25pbC5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3BhcnNlLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvcmVnZXguanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS9ybmcuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS9zaGExLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvc3RyaW5naWZ5LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvdjEuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS92My5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3YzNS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3Y0LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLW5vZGUvdjUuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tbm9kZS92YWxpZGF0ZS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1ub2RlL3ZlcnNpb24uanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJjcnlwdG9cIiIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL0BzdG9yYWdvL29ybS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImludGVyZmFjZSBEZWJ1Z3tcbiAgc2VsZWN0OiBib29sZWFuLFxuICBpbnNlcnQ6IGJvb2xlYW4sXG4gIGNyZWF0ZTogYm9vbGVhbixcbiAgcXVlcnk6IGJvb2xlYW4sXG59XG5cbmV4cG9ydCBsZXQgZGVidWc6IERlYnVnID0ge1xuICBzZWxlY3Q6IHRydWUsXG4gIGluc2VydDogdHJ1ZSxcbiAgY3JlYXRlOiB0cnVlLFxuICBxdWVyeTogdHJ1ZSxcbn0iLCJpbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuLlwiO1xuaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gXCIuLi9hZGFwdGVyL2FkYXB0ZXJcIjtcbmltcG9ydCB7IENvbmZpZywgZGVmYXVsdENvbmZpZywgRmllbGQsIEZpZWxkS2luZCB9IGZyb20gXCIuL2ZpZWxkXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQm9vbGVhbkNvbmZpZyBleHRlbmRzIENvbmZpZyB7IH1cblxuZXhwb3J0IGNsYXNzIEJvb2xlYW5GaWVsZCBleHRlbmRzIEZpZWxkIHtcblxuICByZWFkb25seSBjb25maWc6IEJvb2xlYW5Db25maWc7XG4gIHJlYWRvbmx5IGtpbmQ6IEZpZWxkS2luZCA9IEZpZWxkS2luZC5CT09MRUFOO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgY29uZmlnOiBQYXJ0aWFsPEJvb2xlYW5Db25maWc+ID0gZGVmYXVsdENvbmZpZykge1xuXG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmcm9tREI8QSBleHRlbmRzIEFkYXB0ZXI+KGFkYXB0ZXI6IEEsIHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcblxuICAgIHJldHVybiBhZGFwdGVyLmZpZWxkVHJhbnNmb3JtRnJvbURiKHRoaXMsIHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyB0b0RCPEEgZXh0ZW5kcyBBZGFwdGVyLCBNIGV4dGVuZHMgTW9kZWw+KGFkYXB0ZXI6IEEsIG1vZGVsOiBNKTogYW55IHtcblxuICAgIGxldCB2YWx1ZSA9IHN1cGVyLnRvREI8QSwgTT4oYWRhcHRlciwgbW9kZWwpO1xuICAgIHJldHVybiBhZGFwdGVyLmZpZWxkVHJhbnNmb3JtVG9EQjxBLCBCb29sZWFuRmllbGQsIE0+KHRoaXMsIHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBjYXN0REI8QSBleHRlbmRzIEFkYXB0ZXI+KGFkYXB0ZXI6IEEpOiBzdHJpbmcge1xuXG4gICAgcmV0dXJuIGFkYXB0ZXIuZmllbGRDYXN0PEJvb2xlYW5GaWVsZD4odGhpcyk7XG4gIH1cbn0iLCJpbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuLlwiO1xuaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gXCIuLi9hZGFwdGVyL2FkYXB0ZXJcIjtcbmltcG9ydCB7IENvbmZpZywgZGVmYXVsdENvbmZpZywgRmllbGQsIEZpZWxkS2luZCB9IGZyb20gXCIuL2ZpZWxkXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGF0ZVRpbWVDb25maWcgZXh0ZW5kcyBDb25maWcgeyB9XG5cbmV4cG9ydCBjbGFzcyBEYXRlVGltZUZpZWxkIGV4dGVuZHMgRmllbGQge1xuXG4gIHJlYWRvbmx5IGNvbmZpZzogRGF0ZVRpbWVDb25maWc7XG4gIHJlYWRvbmx5IGtpbmQ6IEZpZWxkS2luZCA9IEZpZWxkS2luZC5EQVRFVElNRTtcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGNvbmZpZzogUGFydGlhbDxEYXRlVGltZUNvbmZpZz4gPSBkZWZhdWx0Q29uZmlnKSB7XG5cbiAgICBzdXBlcihuYW1lKTtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIC4uLmRlZmF1bHRDb25maWcsXG4gICAgICAuLi5jb25maWcsXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGZyb21EQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSwgdmFsdWU6IGFueSkgOiBEYXRlfHVuZGVmaW5lZCB7XG5cbiAgICBpZih2YWx1ZSA9PT0gbnVsbCl7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgRGF0ZSh2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgdG9EQjxBIGV4dGVuZHMgQWRhcHRlciwgTSBleHRlbmRzIE1vZGVsPihhZGFwdGVyOiBBLCBtb2RlbDogTSkgOiBudW1iZXIge1xuICAgIFxuICAgIGxldCBuYW1lID0gdGhpcy5nZXROYW1lKCk7XG4gICAgbGV0IHZhbHVlID0gbW9kZWxbbmFtZSBhcyBrZXlvZiBNXTtcblxuICAgIGlmKHZhbHVlID09PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVmYXVsdFZhbHVlKCk7XG4gICAgfVxuXG4gICAgaWYodmFsdWUgaW5zdGFuY2VvZiBEYXRlKXtcbiAgICAgIHJldHVybiB2YWx1ZS5nZXRUaW1lKCk7XG4gICAgfVxuXG4gICAgdGhyb3cge2NvZGU6IG51bGwsIG1lc3NhZ2U6IGB2YWx1ZSBvZiAke25hbWV9IHRvIERCIGlzIG5vdCBhIERhdGVgfTtcbiAgfVxuXG4gIHB1YmxpYyBjYXN0REI8QSBleHRlbmRzIEFkYXB0ZXI+KGFkYXB0ZXI6IEEpOiBzdHJpbmcge1xuICAgIFxuICAgIHJldHVybiBhZGFwdGVyLmZpZWxkQ2FzdDxEYXRlVGltZUZpZWxkPih0aGlzKTtcbiAgfVxufSIsImltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi4vYWRhcHRlci9hZGFwdGVyXCI7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuXG5leHBvcnQgZW51bSBjb2RlRmllbGRFcnJvciB7XG4gICdFbmdpbmVOb3RJbXBsZW1lbnRlZCcgPSAnQHN0b3JhZ28vb3JtL2ZpZWxkL2VuZ2luZU5vdEltcGxlbWVudGVkJyxcbiAgJ0RlZmF1bHRWYWx1ZUlzTm90VmFsaWQnID0gJ0BzdG9yYWdvL29ybS9maWVsZC9kZWZhdWx0UGFyYW1Ob3RWYWxpZCcsXG4gICdJbmNvcnJlY3RWYWx1ZVRvRGInID0gJ0BzdG9yYWdvL29ybS9maWVsZC9JbmNvcnJlY3RWYWx1ZVRvU3RvcmFnZU9uREInLFxuICAnUmVmZXJlck5vdEZvdW5kJyA9ICdAc3RvcmFnby9vcm0vZmllbGQvTWFueVJlbGF0aW9uc2hpcCcsXG4gICdGaWVsZEtpbmROb3RTdXBwb3J0ZWQnID0gJ0BzdG9yYWdvL29ybS9maWVsZC9GaWVsZEtpbmROb3RTdXBwb3J0ZWQnLFxufVxuXG5leHBvcnQgZW51bSBGaWVsZEtpbmR7XG4gIFRFWFQsXG4gIFZBUkNIQVIsXG4gIENIQVJBQ1RFUixcblxuICBJTlRFR0VSLFxuICBUSU5ZSU5ULFxuICBTTUFMTElOVCxcbiAgTUVESVVNSU5ULFxuICBCSUdJTlQsXG5cbiAgUkVBTCxcbiAgRE9VQkxFLFxuICBGTE9BVCxcblxuICBOVU1FUklDLFxuICBERUNJTUFMLFxuICBEQVRFLFxuICBEQVRFVElNRSxcbiAgQk9PTEVBTixcblxuICBVVUlELFxuICBKU09OLFxuXG4gIEJMT0IsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlnIHtcbiAgZGVmYXVsdD86IGFueTtcbiAgcmVxdWlyZWQ6IGJvb2xlYW47XG4gIGxpbms/OiBzdHJpbmc7XG4gIGluZGV4OiBib29sZWFuO1xuICBwcmltYXJ5OiBib29sZWFuO1xufVxuXG5leHBvcnQgY29uc3QgZGVmYXVsdENvbmZpZzogQ29uZmlnID0ge1xuICByZXF1aXJlZDogZmFsc2UsXG4gIGluZGV4OiBmYWxzZSxcbiAgcHJpbWFyeTogZmFsc2Vcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEZpZWxkIHtcblxuICByZWFkb25seSBhYnN0cmFjdCBjb25maWc6IENvbmZpZztcbiAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuICBhYnN0cmFjdCByZWFkb25seSBraW5kOiBGaWVsZEtpbmQ7IFxuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0TmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm5hbWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0RGVmYXVsdFZhbHVlKCk6IGFueSB7XG5cbiAgICBsZXQgdmFsdWVEZWZhdWx0ID0gdGhpcy5jb25maWcuZGVmYXVsdDtcblxuICAgIGlmICh0eXBlb2YgdmFsdWVEZWZhdWx0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdmFsdWVEZWZhdWx0KCk7XG4gICAgfVxuICAgIFxuICAgIGlmICh2YWx1ZURlZmF1bHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsdWVEZWZhdWx0ID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWVEZWZhdWx0O1xuICB9XG5cbiAgcHVibGljIGlzVmlydHVhbCgpOiBib29sZWFuIHtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5saW5rICE9PSB1bmRlZmluZWQgJiYgIXRoaXMuY29uZmlnLmluZGV4KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKlxuICBwdWJsaWMgYXN5bmMgcG9wdWxhdGUobW9kZWw6IE1vZGVsLCByb3c6IHsgW2luZGV4OiBzdHJpbmddOiBhbnk7IH0pOiBQcm9taXNlPGFueT4ge1xuXG4gICAgbGV0IG5hbWUgPSB0aGlzLmdldE5hbWUoKTtcbiAgICBsZXQgdmFsdWUgPSByb3dbbmFtZV07XG5cbiAgICAvKlxuICAgIGlmICh0aGlzLmNvbmZpZy5saW5rICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgbGV0IGxpbmtzOiBzdHJpbmdbXSA9IHRoaXMuY29uZmlnLmxpbmsuc3BsaXQoJy4nKTtcbiAgICAgIGxldCBpdGVtTmFtZSA9IGxpbmtzLnNoaWZ0KCk7XG5cbiAgICAgIGlmICghaXRlbU5hbWUgfHwgaXRlbU5hbWUgaW4gbW9kZWwuX19kYXRhKSB7XG4gICAgICAgIG1vZGVsW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhbHVlID0gYXdhaXQgbW9kZWwuX19kYXRhW2l0ZW1OYW1lXTtcblxuICAgICAgd2hpbGUgKGl0ZW1OYW1lID0gbGlua3Muc2hpZnQoKSkge1xuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgaWYgKGl0ZW1OYW1lIGluIHZhbHVlKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlW2l0ZW1OYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHRoaXMuZnJvbURCKHZhbHVlKTtcbiAgfVxuICAqL1xuICBcbiBwdWJsaWMgdG9EQjxBIGV4dGVuZHMgQWRhcHRlciwgTSBleHRlbmRzIE1vZGVsPihhZGFwdGVyOiBBLCBtb2RlbDogTSk6IGFueSB7XG4gICBcbiAgIGxldCBuYW1lID0gdGhpcy5nZXROYW1lKCk7XG4gICBsZXQgdmFsdWUgPSBtb2RlbFtuYW1lIGFzIGtleW9mIE1dO1xuICAgXG4gICBpZih2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKXtcbiAgICAgcmV0dXJuIHRoaXMuZ2V0RGVmYXVsdFZhbHVlKCk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICBhYnN0cmFjdCBmcm9tREI8QSBleHRlbmRzIEFkYXB0ZXI+KGFkYXB0ZXI6IEEsIHZhbHVlOiBhbnkpOiBhbnk7XG4gIGFic3RyYWN0IGNhc3REQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSk6IHN0cmluZztcbiAgXG4gIHB1YmxpYyBpc0pzb25PYmplY3QoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIFxuICAvKlxuICBwcm90ZWN0ZWQgZGVmaW5lU2V0dGVyKGxpbms6IHN0cmluZywgc2NoZW1hOiBTY2hlbWEsIG1vZGVsOiBNb2RlbCwgdmFsdWU6IGFueSkgOiB2b2lkIHtcblxuICAgIGlmIChsaW5rKSB7XG4gICAgICBsZXQgbGlzdE5hbWUgPSBsaW5rLnNwbGl0KCcuJyk7XG4gICAgICBsZXQgZmllbGROYW1lID0gbGlzdE5hbWVbMF07XG4gICAgICBsZXQgdGFyZ2V0ID0gbGlzdE5hbWUucG9wKCk7XG4gICAgICBsZXQgZmllbGQgPSBzY2hlbWEuZ2V0RmllbGQoZmllbGROYW1lKTtcbiAgICAgIGxldCBpdGVtIDogYW55ID0gbW9kZWw7XG4gICAgICBcbiAgICAgIGlmKGZpZWxkLmlzSnNvbk9iamVjdCgpKXtcbiAgICAgICAgbGV0IGl0ZW1OYW1lID0gbGlzdE5hbWUuc2hpZnQoKTtcbiAgICAgICAgd2hpbGUoaXRlbU5hbWUpe1xuICAgICAgICAgIFxuICAgICAgICAgIGlmKHR5cGVvZiBpdGVtW2l0ZW1OYW1lXSAhPT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgaXRlbVtpdGVtTmFtZV0gPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgaXRlbSA9IGl0ZW1baXRlbU5hbWVdO1xuICAgICAgICAgIGl0ZW1OYW1lID0gbGlzdE5hbWUuc2hpZnQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBpZih0YXJnZXQpe1xuICAgICAgICBpdGVtW3RhcmdldF0gPSB0aGlzLnBhcnNlVG9EQih2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGRlZmluZUdldHRlcihsaW5rOiBzdHJpbmcsIHNjaGVtYTogU2NoZW1hLCBtb2RlbDogTW9kZWwpIDogYW55IHtcblxuICAgIGlmIChsaW5rKSB7XG4gICAgICBsZXQgbGlzdE5hbWUgPSBsaW5rLnNwbGl0KCcuJyk7XG4gICAgICBsZXQgZmllbGROYW1lID0gbGlzdE5hbWVbMF07XG4gICAgICBsZXQgdGFyZ2V0ID0gbGlzdE5hbWUucG9wKCk7XG4gICAgICBsZXQgZmllbGQgPSBzY2hlbWEuZ2V0RmllbGQoZmllbGROYW1lKTtcbiAgICAgIGxldCBpdGVtIDogYW55ID0gbW9kZWw7XG5cbiAgICAgIGlmKGZpZWxkLmlzSnNvbk9iamVjdCgpKXtcbiAgICAgICAgbGV0IGl0ZW1OYW1lID0gbGlzdE5hbWUuc2hpZnQoKTtcbiAgICAgICAgd2hpbGUoaXRlbU5hbWUpe1xuICAgICAgICAgIFxuICAgICAgICAgIGlmKHR5cGVvZiBpdGVtW2l0ZW1OYW1lXSAhPT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW1baXRlbU5hbWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICBpdGVtID0gaXRlbVtpdGVtTmFtZV07XG4gICAgICAgICAgaXRlbU5hbWUgPSBsaXN0TmFtZS5zaGlmdCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmKHRhcmdldCl7XG4gICAgICAgIHJldHVybiBpdGVtW3RhcmdldF07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBcbiAgcHVibGljIGRlZmluZVByb3BlcnR5KHNjaGVtYTogU2NoZW1hLCBtb2RlbDogTW9kZWwpOiB2b2lkIHtcbiAgICBcbiAgICBcbiAgICBsZXQgbGluayA9IHRoaXMuY29uZmlnLmxpbms7XG4gICAgaWYgKGxpbmspIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2RlbCwgdGhpcy5uYW1lLCB7XG4gICAgICAgICdzZXQnOiB0aGlzLmRlZmluZVNldHRlci5iaW5kKHRoaXMsIGxpbmssIHNjaGVtYSwgbW9kZWwpLFxuICAgICAgICAnZ2V0JzogdGhpcy5kZWZpbmVHZXR0ZXIuYmluZCh0aGlzLCBsaW5rLCBzY2hlbWEsIG1vZGVsKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICAqL1xuXG59XG4iLCJleHBvcnQgeyBGaWVsZCwgRmllbGRLaW5kLCBjb2RlRmllbGRFcnJvciB9IGZyb20gXCIuL2ZpZWxkXCI7XG5cbmltcG9ydCB7IFRleHRGaWVsZCB9IGZyb20gXCIuL3RleHRcIjtcbmltcG9ydCB7IFVVSURGaWVsZCB9IGZyb20gXCIuL3V1aWRcIjtcbmltcG9ydCB7IEpzb25GaWVsZCB9IGZyb20gXCIuL2pzb25cIjtcbmltcG9ydCB7IE1hbnlGaWVsZCB9IGZyb20gXCIuL21hbnlcIjtcbmltcG9ydCB7IEludGVnZXJGaWVsZCB9IGZyb20gXCIuL2ludGVnZXJcIjtcbmltcG9ydCB7IEJvb2xlYW5GaWVsZCB9IGZyb20gXCIuL2Jvb2xlYW5cIjtcbmltcG9ydCB7IERhdGVUaW1lRmllbGQgfSBmcm9tIFwiLi9kYXRldGltZVwiO1xuXG5leHBvcnQgY29uc3QgZmllbGRzID0ge1xuICBUZXh0RmllbGQsXG4gIFVVSURGaWVsZCxcbiAgSnNvbkZpZWxkLFxuICBNYW55RmllbGQsXG4gIEludGVnZXJGaWVsZCxcbiAgQm9vbGVhbkZpZWxkLFxuICBEYXRlVGltZUZpZWxkLFxufVxuIiwiaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gXCIuLi9hZGFwdGVyL2FkYXB0ZXJcIjtcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBGaWVsZCwgQ29uZmlnLCBkZWZhdWx0Q29uZmlnLCBGaWVsZEtpbmQgfSBmcm9tIFwiLi9maWVsZFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEludGVnZXJDb25maWcgZXh0ZW5kcyBDb25maWcgeyB9XG5cbmV4cG9ydCBjbGFzcyBJbnRlZ2VyRmllbGQgZXh0ZW5kcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgY29uZmlnOiBJbnRlZ2VyQ29uZmlnO1xuICByZWFkb25seSBraW5kOiBGaWVsZEtpbmQgPSBGaWVsZEtpbmQuSU5URUdFUjtcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGNvbmZpZzogUGFydGlhbDxJbnRlZ2VyQ29uZmlnPiA9IGRlZmF1bHRDb25maWcpIHtcblxuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLi4uZGVmYXVsdENvbmZpZyxcbiAgICAgIC4uLmNvbmZpZyxcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZnJvbURCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBLCB2YWx1ZTogc3RyaW5nKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcblxuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aHJvdyB7IGNvZGU6IG51bGwsIG1lc3NhZ2U6ICd2YWx1ZSBmcm9tIERCIGlzIG5vdCBhIG51bWJlcicgfTtcbiAgfVxuXG4gIHB1YmxpYyB0b0RCPEEgZXh0ZW5kcyBBZGFwdGVyLCBNIGV4dGVuZHMgTW9kZWw+KGFkYXB0ZXI6IEEsIG1vZGVsOiBNKTogYW55IHtcblxuICAgIGxldCBuYW1lID0gdGhpcy5nZXROYW1lKCk7XG4gICAgbGV0IHZhbHVlID0gbW9kZWxbbmFtZSBhcyBrZXlvZiBNXTtcblxuICAgIGlmICh2YWx1ZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRWYWx1ZSgpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcih2YWx1ZSk7XG4gICAgfVxuXG4gICAgdGhyb3cgeyBjb2RlOiBudWxsLCBtZXNzYWdlOiBgdmFsdWUgb2YgJHsgbmFtZSB9IHRvIERCIGlzIG5vdCBhIGludGVnZXJgIH07XG4gIH1cblxuICBwdWJsaWMgY2FzdERCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBKTogc3RyaW5nIHtcblxuICAgIHJldHVybiBhZGFwdGVyLmZpZWxkQ2FzdDxJbnRlZ2VyRmllbGQ+KHRoaXMpO1xuICB9XG59IiwiaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gXCIuLi9hZGFwdGVyL2FkYXB0ZXJcIjtcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBGaWVsZCwgQ29uZmlnLCBkZWZhdWx0Q29uZmlnLCBjb2RlRmllbGRFcnJvciwgRmllbGRLaW5kIH0gZnJvbSBcIi4vZmllbGRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBKc29uQ29uZmlnIGV4dGVuZHMgQ29uZmlnIHtcbiAgdHlwZTogJ2xpc3QnIHwgJ29iamVjdCcsXG4gIGRlZmF1bHQ/OiAnc3RyaW5nJyB8IEZ1bmN0aW9uIHwgT2JqZWN0O1xufVxuXG5sZXQganNvbkRlZmF1bHRDb25maWc6IEpzb25Db25maWcgPSB7XG4gIC4uLmRlZmF1bHRDb25maWcsXG4gIHR5cGU6ICdvYmplY3QnLFxufVxuXG5leHBvcnQgY2xhc3MgSnNvbkZpZWxkIGV4dGVuZHMgRmllbGQge1xuXG4gIHJlYWRvbmx5IGNvbmZpZzogSnNvbkNvbmZpZztcbiAgcmVhZG9ubHkga2luZDogRmllbGRLaW5kID0gRmllbGRLaW5kLkpTT047XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjb25maWc6IFBhcnRpYWw8SnNvbkNvbmZpZz4gPSBqc29uRGVmYXVsdENvbmZpZykge1xuXG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5qc29uRGVmYXVsdENvbmZpZyxcbiAgICAgIC4uLmNvbmZpZyxcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGdldERlZmF1bHRWYWx1ZSgpOiBhbnkge1xuXG4gICAgbGV0IHZhbHVlRGVmYXVsdCA9IHN1cGVyLmdldERlZmF1bHRWYWx1ZSgpO1xuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZURlZmF1bHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZURlZmF1bHQgPSBKU09OLnBhcnNlKHZhbHVlRGVmYXVsdCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRocm93IHtcbiAgICAgICAgICBjb2RlOiBjb2RlRmllbGRFcnJvci5EZWZhdWx0VmFsdWVJc05vdFZhbGlkLFxuICAgICAgICAgIG1lc3NhZ2U6IGBEZWZhdWx0IHZhbHVlIG9uIEpTT04gZmllbGQgaXMgbm90IGEgdmFsaWQganNvbmBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWVEZWZhdWx0O1xuICB9XG5cbiAgcHVibGljIGZyb21EQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSwgdmFsdWU6IHN0cmluZyB8IG51bGwpOiBvYmplY3QgfCB1bmRlZmluZWQge1xuXG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICAgIGxldCB0eXBlID0gdGhpcy5jb25maWcudHlwZTtcbiAgICAgIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4ge307XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9yZXR1cm4gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgcmV0dXJuIGFkYXB0ZXIuZmllbGRUcmFuc2Zvcm1Gcm9tRGI8SnNvbkZpZWxkPih0aGlzLCB2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgY2FzdERCPEEgZXh0ZW5kcyBBZGFwdGVyPihhZGFwdGVyOiBBKTogc3RyaW5nIHtcblxuICAgIHJldHVybiBhZGFwdGVyLmZpZWxkQ2FzdDxKc29uRmllbGQ+KHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGlzSnNvbk9iamVjdCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5jb25maWcudHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHB1YmxpYyB0b0RCPEEgZXh0ZW5kcyBBZGFwdGVyLCBNIGV4dGVuZHMgTW9kZWw+KGFkYXB0ZXI6IEEsIG1vZGVsOiBNKTogc3RyaW5nIHwgbnVsbCB7XG5cbiAgICBsZXQgdmFsdWUgPSBzdXBlci50b0RCKGFkYXB0ZXIsIG1vZGVsKTtcblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RyaW5naWZ5VG9EYih2YWx1ZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RyaW5naWZ5VG9EYih2YWx1ZTogYW55KTogc3RyaW5nIHtcblxuICAgIGxldCBraW5kID0gdGhpcy5jb25maWcudHlwZTtcbiAgICBsZXQgZXJyb3IgPSB7XG4gICAgICBjb2RlOiBjb2RlRmllbGRFcnJvci5JbmNvcnJlY3RWYWx1ZVRvRGIsXG4gICAgICBtZXNzYWdlOiBgdmFsdWUgaXMgbm90IGEgdmFsaWQganNvbmAsXG4gICAgfTtcblxuICAgIC8qIFRlc3QgaWYgdmFsdWUgaXMgdmFsaWQgKi9cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgSlNPTi5wYXJzZSh2YWx1ZSk7IC8vanVzdCB0ZXN0XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIGlmIChraW5kICE9PSAnbGlzdCcpIHtcbiAgICAgICAgICAgIGVycm9yLm1lc3NhZ2UgPSAnSlNPTiBpcyBhIG9iamVjdCwgYnV0IG11c3QgYmUgYSBsaXN0JztcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoa2luZCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGVycm9yLm1lc3NhZ2UgPSAnSlNPTiBpcyBhIGxpc3QsIGJ1dCBtdXN0IGJlIGEgb2JqZWN0JztcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBjb252ZXJ0IHRvIHN0cmluZyAqL1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG59IiwiaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IFVVSURGaWVsZCB9IGZyb20gXCIuL3V1aWRcIjtcbmltcG9ydCB7IENvbmZpZywgZGVmYXVsdENvbmZpZyB9IGZyb20gXCIuL2ZpZWxkXCI7XG5pbXBvcnQgeyBTY2hlbWEgfSBmcm9tIFwiLi5cIjtcblxuZXhwb3J0IGNsYXNzIE1hbnlGaWVsZCBleHRlbmRzIFVVSURGaWVsZCB7XG5cbiAgcmVhZG9ubHkgY29uZmlnOiBDb25maWc7XG4gIHByb3RlY3RlZCByZWZlcmVyOiB0eXBlb2YgTW9kZWw7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCByZWZlcmVyOiB0eXBlb2YgTW9kZWwsIGNvbmZpZz86IFBhcnRpYWw8Q29uZmlnPikge1xuXG4gICAgc3VwZXIoYCR7IG5hbWUgfV9pZGApO1xuICAgIHRoaXMucmVmZXJlciA9IHJlZmVyZXI7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH1cbiAgfVxuXG4gIC8qXG4gIHB1YmxpYyBkZWZpbmVQcm9wZXJ0eShzY2hlbWE6IFNjaGVtYSwgbW9kZWw6IE1vZGVsKTogdm9pZCB7XG4gICAgXG4gICAgbGV0IGNvbHVtbiA9IHRoaXMuZ2V0TmFtZSgpO1xuICAgIGxldCBuYW1lID0gY29sdW1uLnJlcGxhY2UoJ19pZCcsICcnKTtcbiAgICBsZXQgcHJveHkgPSB0aGlzO1xuICAgIG1vZGVsW25hbWVdID0gYXN5bmMgZnVuY3Rpb24oaXRlbT86IHR5cGVvZiB0aGlzLnJlZmVyZXJ8c3RyaW5nKSA6IFByb21pc2U8TW9kZWx8dm9pZHx1bmRlZmluZWQ+e1xuICAgICAgXG4gICAgICBpZihpdGVtID09IHVuZGVmaW5lZCl7XG4gICAgICAgIGxldCBpZFJlZmVyZXIgPSBtb2RlbFtjb2x1bW5dOyBcbiAgICAgICAgcmV0dXJuIHByb3h5LnJlZmVyZXIuZmluZCgnaWQgPSA/JywgaWRSZWZlcmVyKTtcbiAgICAgIH1cblxuICAgICAgaWYoaXRlbSBpbnN0YW5jZW9mIHByb3h5LnJlZmVyZXIpe1xuICAgICAgICBtb2RlbFtjb2x1bW5dID0gaXRlbS5pZDtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgfVxuXG4gICAgICBsZXQgcmVmID0gYXdhaXQgcHJveHkucmVmZXJlci5maW5kKCdpZCA9ID8nLCBpdGVtKTtcbiAgICAgIGlmKHJlZiA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgdGhyb3cge2NvZGU6IGNvZGVFcnJvci5SZWZlcmVyTm90Rm91bmQsIG1lc3NhZ2U6IGBOb3QgZm91bmQgJHtpdGVtfSBvbiB0YWJsZSAke25hbWV9YH07XG4gICAgICB9XG4gICAgICBtb2RlbFtjb2x1bW5dID0gcmVmLmlkO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgfVxuICAqL1xufSIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4uL2FkYXB0ZXIvYWRhcHRlclwiO1xuaW1wb3J0IHsgRmllbGQsIENvbmZpZywgZGVmYXVsdENvbmZpZywgRmllbGRLaW5kIH0gZnJvbSBcIi4vZmllbGRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBUZXh0Q29uZmlnIGV4dGVuZHMgQ29uZmlnIHsgfVxuXG5leHBvcnQgY2xhc3MgVGV4dEZpZWxkIGV4dGVuZHMgRmllbGQge1xuXG4gIHJlYWRvbmx5IGNvbmZpZzogVGV4dENvbmZpZztcbiAgcmVhZG9ubHkga2luZDogRmllbGRLaW5kID0gRmllbGRLaW5kLlRFWFQ7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjb25maWc6IFBhcnRpYWw8VGV4dENvbmZpZz4gPSBkZWZhdWx0Q29uZmlnKSB7XG5cbiAgICBzdXBlcihuYW1lKTtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIC4uLmRlZmF1bHRDb25maWcsXG4gICAgICAuLi5jb25maWcsXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGZyb21EQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSwgdmFsdWU6IHN0cmluZ3xudWxsKTogc3RyaW5nfHVuZGVmaW5lZCB7XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgdG9EQjxBIGV4dGVuZHMgQWRhcHRlciwgVCBleHRlbmRzIE1vZGVsPihhZGFwdGVyOiBBLCBtb2RlbDogVCk6IHN0cmluZ3xudWxsIHtcblxuICAgIGxldCBuYW1lID0gdGhpcy5nZXROYW1lKCk7XG4gICAgbGV0IHZhbHVlID0gbW9kZWxbbmFtZSBhcyBrZXlvZiBUXTtcblxuICAgIGlmKHZhbHVlID09PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVmYXVsdFZhbHVlKCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB2YWx1ZS50cmltKCk7XG4gICAgfVxuXG4gICAgdGhyb3cge2NvZGU6IG51bGwsIG1lc3NhZ2U6IGB2YWx1ZSBvZiAke25hbWV9IHRvIERCIGlzIG5vdCBhIHN0cmluZ2B9O1xuICB9XG5cbiAgcHVibGljIGNhc3REQjxBIGV4dGVuZHMgQWRhcHRlcj4oYWRhcHRlcjogQSk6IHN0cmluZyB7XG5cbiAgICByZXR1cm4gYWRhcHRlci5maWVsZENhc3Q8VGV4dEZpZWxkPih0aGlzKTtcbiAgfVxufSIsImltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi4vYWRhcHRlci9hZGFwdGVyXCI7XG5pbXBvcnQgeyBGaWVsZCwgQ29uZmlnLCBkZWZhdWx0Q29uZmlnLCBGaWVsZEtpbmQgfSBmcm9tIFwiLi9maWVsZFwiO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcblxuZXhwb3J0IGNsYXNzIFVVSURGaWVsZCBleHRlbmRzIEZpZWxkIHtcblxuICByZWFkb25seSBjb25maWc6IENvbmZpZztcbiAgcmVhZG9ubHkga2luZDogRmllbGRLaW5kID0gRmllbGRLaW5kLlVVSUQ7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjb25maWc6IFBhcnRpYWw8Q29uZmlnPiA9IGRlZmF1bHRDb25maWcpIHtcblxuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLi4uZGVmYXVsdENvbmZpZyxcbiAgICAgIC4uLmNvbmZpZyxcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGNhc3REQihhZGFwdGVyOiBBZGFwdGVyKTogc3RyaW5nIHtcblxuICAgIHJldHVybiBhZGFwdGVyLmZpZWxkQ2FzdDxVVUlERmllbGQ+KHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGZyb21EQih2YWx1ZTogYW55KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHRocm93IHsgY29kZTogbnVsbCwgbWVzc2FnZTogJ3ZhbHVlIGZyb20gREIgaXMgbm90IGEgdmFsaWQgdXVpZCcgfTtcbiAgfVxuXG4gIHB1YmxpYyBnZXREZWZhdWx0VmFsdWUoKTogYW55IHtcblxuICAgIGxldCB2YWx1ZSA9IHN1cGVyLmdldERlZmF1bHRWYWx1ZSgpO1xuXG4gICAgaWYgKHZhbHVlID09PSBudWxsICYmIHRoaXMuY29uZmlnLnByaW1hcnkpIHtcbiAgICAgIHZhbHVlID0gdXVpZCgpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB0b0RCPEEgZXh0ZW5kcyBBZGFwdGVyLCBNIGV4dGVuZHMgTW9kZWw+KGFkYXB0ZXI6IEEsIG1vZGVsOiBNKTogYW55IHtcblxuICAgIGxldCB2YWx1ZSA9IHN1cGVyLnRvREI8QSwgTT4oYWRhcHRlciwgbW9kZWwpO1xuICAgIHJldHVybiBhZGFwdGVyLmZpZWxkVHJhbnNmb3JtVG9EQjxBLCBVVUlERmllbGQsIE0+KHRoaXMsIHZhbHVlKTtcbiAgfVxufSIsImltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi9hZGFwdGVyL2FkYXB0ZXJcIjtcblxudHlwZSB0YXNrQ2FsbGJhY2sgPSB7ICh0cmFuc2FjdGlvbjogU1FMVHJhbnNhY3Rpb24pOiBQcm9taXNlPHZvaWQ+IH07XG5cbmludGVyZmFjZSB0YXNrVmVyc2lvbiB7XG4gIFt2ZXJzaW9uOiBudW1iZXJdOiB0YXNrQ2FsbGJhY2s7XG59O1xuXG5leHBvcnQgY2xhc3MgTWlncmF0aW9uIHtcblxuICBwcm90ZWN0ZWQgYWRhcHRlcjogQWRhcHRlcjtcbiAgcHJpdmF0ZSB0YXNrczogdGFza1ZlcnNpb24gPSB7fTtcbiAgcHJpdmF0ZSBmaXJzdEFjY2Vzcz86IHRhc2tDYWxsYmFjaztcblxuICBjb25zdHJ1Y3RvcihhZGFwdGVyOiBBZGFwdGVyKSB7XG4gICAgdGhpcy5hZGFwdGVyID0gYWRhcHRlcjtcbiAgfVxuXG4gIHByb3RlY3RlZCBtYWtlKCk6IHZvaWQgeyB9XG5cbiAgcHVibGljIGFzeW5jIHJ1bigpOiBQcm9taXNlPHZvaWQ+IHtcblxuICAgIHRoaXMubWFrZSgpO1xuXG4gICAgaWYgKHRoaXMuZmlyc3RBY2Nlc3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgeyBjb2RlOiBudWxsLCBtZXNzYWdlOiBgRmlyc3RBY2Nlc3MgTWlncmF0aW9uIG5vdCBpbXBsZW1lbnRlZCFgIH07XG4gICAgfVxuXG4gICAgLypcbiAgICBsZXQgdmVyc2lvbiA9IHRoaXMuYWRhcHRlci5nZXRWZXJzaW9uKCk7XG4gICAgaWYgKHZlcnNpb24gPT09ICcnKSB7XG4gICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmNoYW5nZVZlcnNpb24oMCwgdGhpcy5maXJzdEFjY2Vzcyk7XG4gICAgfVxuICAgIFxuXG4gICAgd2hpbGUgKHRydWUpIHtcblxuICAgICAgdmVyc2lvbisrO1xuICAgICAgbGV0IHRhc2sgPSB0aGlzLnRhc2tzW3ZlcnNpb25dO1xuICAgICAgaWYgKHRhc2sgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgYXdhaXQgdGhpcy5hZGFwdGVyLmNoYW5nZVZlcnNpb24odmVyc2lvbiwgdGFzayk7XG4gICAgfVxuKi9cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVnaXN0ZXJGaXJzdEFjY2VzcyhjYWxsYmFjazogdGFza0NhbGxiYWNrKTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy5maXJzdEFjY2VzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyB7IGNvZGU6IHVuZGVmaW5lZCwgbWVzc2FnZTogYGZpcnN0QWNjZXNzIGNhbGxiYWNrIGFscmVhZHkgcmVnaXN0ZXJlZGAgfTtcbiAgICB9XG5cbiAgICB0aGlzLmZpcnN0QWNjZXNzID0gY2FsbGJhY2s7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVnaXN0ZXIodmVyc2lvbjogbnVtYmVyLCBjYWxsYmFjazogdGFza0NhbGxiYWNrKTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy50YXNrc1t2ZXJzaW9uXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyB7IGNvZGU6IHVuZGVmaW5lZCwgbWVzc2FnZTogYGNhbGxiYWNrIHZlcnNpb24gJHsgdmVyc2lvbiB9IGFscmVhZHkgcmVnaXN0ZXJlZGAgfTtcbiAgICB9XG5cbiAgICB0aGlzLnRhc2tzW3ZlcnNpb25dID0gY2FsbGJhY2s7XG4gIH1cbn0iLCJpbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4vYWRhcHRlclwiO1xuaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSBcIi4vc2NoZW1hXCI7XG5cbmV4cG9ydCB0eXBlIENvbnN0cnVjdG9yTW9kZWw8TSBleHRlbmRzIE1vZGVsPiA9IG5ldyAoaWQ6IHN0cmluZykgPT4gTTtcblxuZXhwb3J0IGNsYXNzIE1vZGVse1xuXG4gIHJlYWRvbmx5IGlkOiBzdHJpbmc7XG5cbiAgcHVibGljIF9fZGF0YT86IG9iamVjdDtcblxuICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nKSB7XG4gICAgdGhpcy5pZCA9IGlkO1xuICB9XG59XG5cbiIsImltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi9hZGFwdGVyL2FkYXB0ZXJcIjtcbmltcG9ydCB7IFNlbGVjdCB9IGZyb20gXCIuL2FkYXB0ZXIvc2VsZWN0XCI7XG5pbXBvcnQgeyBJbnNlcnQgfSBmcm9tIFwiLi9hZGFwdGVyL2luc2VydFwiO1xuaW1wb3J0IHsgcGFyYW1zVHlwZSB9IGZyb20gXCIuL2FkYXB0ZXIvcXVlcnlcIjtcbmltcG9ydCB7IE1vZGVsLCBDb25zdHJ1Y3Rvck1vZGVsIH0gZnJvbSBcIi4vbW9kZWxcIjtcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4vZmllbGQvZmllbGRcIjtcbmltcG9ydCB7IENyZWF0ZSB9IGZyb20gXCIuL2FkYXB0ZXIvY3JlYXRlXCI7XG5pbXBvcnQgeyBVVUlERmllbGQgfSBmcm9tIFwiLi9maWVsZC91dWlkXCI7XG5pbXBvcnQgeyB2NCBhcyB1dWlkIH0gZnJvbSAndXVpZCc7XG5cbmV4cG9ydCBlbnVtIGNvZGVTY2hlbWFFcnJvciB7XG4gICdQb3N0U2F2ZU5vdEZvdW5kJyA9ICdAc3RvcmFnby9vcm0vc2NoZW1hL1Bvc3RTYXZlTm90Rm91bmQnLFxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU2NoZW1hPEEgZXh0ZW5kcyBBZGFwdGVyLCBNIGV4dGVuZHMgTW9kZWw+IHtcblxuICBcbiAgYWJzdHJhY3QgcmVhZG9ubHkgTW9kZWw6IENvbnN0cnVjdG9yTW9kZWw8TT47XG4gIGFic3RyYWN0IHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbiAgXG4gIHJlYWRvbmx5IGZpZWxkczogRmllbGRbXSA9IFtdO1xuXG4gIHJlYWRvbmx5IGFkYXB0ZXI6IEE7XG5cbiAgcHJvdGVjdGVkIHN1cGVyRmllbGRzOiBGaWVsZFtdID0gW1xuICAgIG5ldyBVVUlERmllbGQoJ2lkJywgeyBwcmltYXJ5OiB0cnVlIH0pLFxuICBdO1xuXG4gIGNvbnN0cnVjdG9yKGFkYXB0ZXI6IEEpIHtcblxuICAgIHRoaXMuYWRhcHRlciA9IGFkYXB0ZXI7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2F2ZShtb2RlbDogTSk6IFByb21pc2U8TT4ge1xuXG4gICAgaWYgKG1vZGVsLl9fZGF0YSkge1xuICAgICAgLy91cGRhdGUgYXJlYVxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGxldCBpbnNlcnQgPSB0aGlzLmluc2VydCgpO1xuICAgICAgaW5zZXJ0LmFkZChtb2RlbCk7XG4gICAgICBhd2FpdCBpbnNlcnQuc2F2ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnJlZnJlc2hNb2RlbChtb2RlbCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcmVmcmVzaE1vZGVsKG1vZGVsOiBNKTogUHJvbWlzZTxNPiB7XG5cbiAgICBsZXQgaWQgPSBtb2RlbFsnaWQnXTtcblxuICAgIGxldCBpdGVtID0gYXdhaXQgdGhpcy5maW5kKCdpZCA9ID8nLCBpZCk7XG4gICAgaWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgeyBjb2RlOiBjb2RlU2NoZW1hRXJyb3IuUG9zdFNhdmVOb3RGb3VuZCwgbWVzc2FnZTogYEZhaWwgdG8gZmluZCBpZDogJHsgaWQgfWAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wb3B1bGF0ZUZyb21EQihpdGVtLCBtb2RlbCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0TW9kZWxDbGFzcygpOiBDb25zdHJ1Y3Rvck1vZGVsPE0+IHtcblxuICAgIHJldHVybiB0aGlzLk1vZGVsO1xuICB9XG5cbiAgcHVibGljIGdldE5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xuICB9XG5cbiAgcHVibGljIGdldEZpZWxkcygpOiBGaWVsZFtdIHtcblxuXG4gICAgY29uc29sZS5sb2coJ2ZpZWxkcycsIFt0aGlzLnN1cGVyRmllbGRzLCB0aGlzLmZpZWxkc10pO1xuICAgIHJldHVybiBbLi4udGhpcy5zdXBlckZpZWxkcywgLi4udGhpcy5maWVsZHNdO1xuICB9XG5cbiAgcHVibGljIGdldEZpZWxkKG5hbWU6IHN0cmluZyk6IEZpZWxkIHtcblxuICAgIGZvciAobGV0IGZpZWxkIG9mIHRoaXMuZ2V0RmllbGRzKCkpIHtcbiAgICAgIGlmIChuYW1lID09IGZpZWxkLmdldE5hbWUoKSkge1xuICAgICAgICByZXR1cm4gZmllbGQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhyb3cgeyBjb2RlOiBudWxsLCBtZXNzYWdlOiBgRmllbGQgd2l0aCBuYW1lOiAkeyBuYW1lIH0gbm90IGV4aXN0cyBpbiAkeyB0aGlzLm5hbWUgfWAgfTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDb2x1bW5zKCk6IHN0cmluZ1tdIHtcblxuICAgIGxldCBjb2x1bW5zOiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBmaWVsZHMgPSB0aGlzLmdldEZpZWxkcygpO1xuICAgIGNvbnNvbGUubG9nKCdmaWVsZHMnLCBmaWVsZHMpO1xuICAgIGZvciAobGV0IGZpZWxkIG9mIHRoaXMuZ2V0RmllbGRzKCkpIHtcbiAgICAgIGNvbHVtbnMucHVzaChmaWVsZC5nZXROYW1lKCkpO1xuICAgIH1cblxuICAgIHJldHVybiBjb2x1bW5zO1xuICB9XG5cbiAgcHVibGljIGZpbmQod2hlcmU6IHN0cmluZywgcGFyYW06IHBhcmFtc1R5cGUpOiBQcm9taXNlPE0gfCB1bmRlZmluZWQ+IHtcblxuICAgIGxldCBzZWxlY3QgPSB0aGlzLnNlbGVjdCgpO1xuICAgIHNlbGVjdC53aGVyZSh3aGVyZSwgcGFyYW0pO1xuICAgIHJldHVybiBzZWxlY3Qub25lKCk7XG4gIH07XG5cbiAgcHVibGljIGdldEFkYXB0ZXIoKTogQSB7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlcjtcbiAgfVxuXG4gIHB1YmxpYyBzZWxlY3QoKTogU2VsZWN0PEEsIE0+IHtcbiAgICBsZXQgc2VsZWN0ID0gdGhpcy5hZGFwdGVyLnNlbGVjdDxBLCBNPih0aGlzKTtcbiAgICBzZWxlY3QuZnJvbSh0aGlzLmdldE5hbWUoKSwgdGhpcy5nZXRDb2x1bW5zKCkpO1xuICAgIHJldHVybiBzZWxlY3Q7XG4gIH1cblxuICBwdWJsaWMgaW5zZXJ0KCk6IEluc2VydDxBLCBNPiB7XG4gICAgbGV0IGluc2VydCA9IHRoaXMuYWRhcHRlci5pbnNlcnQ8QSwgTT4odGhpcyk7XG4gICAgcmV0dXJuIGluc2VydDtcbiAgfVxuXG4gIHB1YmxpYyBjcmVhdGVUYWJsZSgpOiBDcmVhdGU8QSwgTT4ge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuY3JlYXRlPEEsIE0+KHRoaXMpO1xuICB9XG5cbiAgcHVibGljIG5ld01vZGVsKCk6IE0ge1xuXG4gICAgcmV0dXJuIG5ldyB0aGlzLk1vZGVsKHV1aWQoKSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcG9wdWxhdGVGcm9tREIocm93OiB7IFtpbmRleDogc3RyaW5nXTogYW55OyB9LCBtb2RlbD86IE0pOiBQcm9taXNlPE0+IHtcblxuICAgIGlmIChtb2RlbCA9PSB1bmRlZmluZWQpIHtcbiAgICAgIG1vZGVsID0gdGhpcy5uZXdNb2RlbCgpO1xuICAgIH1cblxuICAgIGxldCBmaWVsZHMgPSB0aGlzLmdldEZpZWxkcygpO1xuICAgIG1vZGVsLl9fZGF0YSA9IHJvdztcbiAgICBmb3IgKGxldCBmaWVsZCBvZiBmaWVsZHMpIHtcbiAgICAgIGxldCBuYW1lID0gZmllbGQuZ2V0TmFtZSgpO1xuICAgICAgaWYgKG5hbWUgPT0gJ2lkJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIG1vZGVsW25hbWUgYXMga2V5b2YgTV0gPSBmaWVsZC5mcm9tREIodGhpcy5hZGFwdGVyLCByb3dbbmFtZV0pO1xuICAgIH1cblxuICAgIHJldHVybiBtb2RlbDtcbiAgfVxuXG4gIC8qXG4gIHB1YmxpYyBhc3luYyBwb3B1bGF0ZUZyb21EQjxUIGV4dGVuZHMgTW9kZWw+KHJvdzogeyBbaW5kZXg6IHN0cmluZ106IGFueTsgfSwgbW9kZWw6IFQpOiBQcm9taXNlPFQ+IHtcblxuICAgIGxldCBwcm9taXNlczogUHJvbWlzZTxhbnk+W10gPSBbXTtcbiAgICBsZXQgZmllbGRzID0gdGhpcy5nZXRSZWFsRmllbGRzKCk7XG4gICAgbGV0IGtleXM6IHN0cmluZ1tdID0gW107XG4gIFxuICAgIGZvciAobGV0IGZpZWxkIG9mIGZpZWxkcykge1xuICAgICAgbGV0IG5hbWUgPSBmaWVsZC5nZXROYW1lKCk7XG4gICAgICBsZXQgcHJvbWlzZVBvcHVsYXRlID0gZmllbGQucG9wdWxhdGUobW9kZWwsIHJvdyk7XG4gICAgICBtb2RlbC5fX2RhdGFbbmFtZV0gPSBwcm9taXNlUG9wdWxhdGU7XG4gICAgICBwcm9taXNlcy5wdXNoKHByb21pc2VQb3B1bGF0ZSk7XG4gICAgICBrZXlzLnB1c2gobmFtZSk7XG4gICAgfVxuXG4gICAgbGV0IGRhdGEgPSBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgZm9yKGxldCBrIGluIGtleXMpe1xuICAgICAgbGV0IG5hbWUgPSBrZXlzW2tdO1xuICAgICAgbW9kZWxbbmFtZSBhcyBrZXlvZiBUXSA9IGRhdGFba107XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZGVsO1xuICB9XG5cbiAgcHVibGljIGRlZmluZVByb3BlcnRpZXMobW9kZWw6IE1vZGVsKSA6IHZvaWQge1xuXG4gICAgZm9yKGxldCBmaWVsZCBvZiB0aGlzLmdldEZpZWxkcygpKXtcbiAgICAgIGZpZWxkLmRlZmluZVByb3BlcnR5KHRoaXMsIG1vZGVsKTtcbiAgICB9XG4gIH0gXG4gICovXG59IiwiZXhwb3J0IHsgZGVmYXVsdCBhcyB2MSB9IGZyb20gJy4vdjEuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2MyB9IGZyb20gJy4vdjMuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2NCB9IGZyb20gJy4vdjQuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2NSB9IGZyb20gJy4vdjUuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBOSUwgfSBmcm9tICcuL25pbC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHZlcnNpb24gfSBmcm9tICcuL3ZlcnNpb24uanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2YWxpZGF0ZSB9IGZyb20gJy4vdmFsaWRhdGUuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzdHJpbmdpZnkgfSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHBhcnNlIH0gZnJvbSAnLi9wYXJzZS5qcyc7IiwiaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nO1xuXG5mdW5jdGlvbiBtZDUoYnl0ZXMpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYnl0ZXMpKSB7XG4gICAgYnl0ZXMgPSBCdWZmZXIuZnJvbShieXRlcyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGJ5dGVzID09PSAnc3RyaW5nJykge1xuICAgIGJ5dGVzID0gQnVmZmVyLmZyb20oYnl0ZXMsICd1dGY4Jyk7XG4gIH1cblxuICByZXR1cm4gY3J5cHRvLmNyZWF0ZUhhc2goJ21kNScpLnVwZGF0ZShieXRlcykuZGlnZXN0KCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1kNTsiLCJleHBvcnQgZGVmYXVsdCAnMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwJzsiLCJpbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG5cbmZ1bmN0aW9uIHBhcnNlKHV1aWQpIHtcbiAgaWYgKCF2YWxpZGF0ZSh1dWlkKSkge1xuICAgIHRocm93IFR5cGVFcnJvcignSW52YWxpZCBVVUlEJyk7XG4gIH1cblxuICBsZXQgdjtcbiAgY29uc3QgYXJyID0gbmV3IFVpbnQ4QXJyYXkoMTYpOyAvLyBQYXJzZSAjIyMjIyMjIy0uLi4uLS4uLi4tLi4uLi0uLi4uLi4uLi4uLi5cblxuICBhcnJbMF0gPSAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoMCwgOCksIDE2KSkgPj4+IDI0O1xuICBhcnJbMV0gPSB2ID4+PiAxNiAmIDB4ZmY7XG4gIGFyclsyXSA9IHYgPj4+IDggJiAweGZmO1xuICBhcnJbM10gPSB2ICYgMHhmZjsgLy8gUGFyc2UgLi4uLi4uLi4tIyMjIy0uLi4uLS4uLi4tLi4uLi4uLi4uLi4uXG5cbiAgYXJyWzRdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDksIDEzKSwgMTYpKSA+Pj4gODtcbiAgYXJyWzVdID0gdiAmIDB4ZmY7IC8vIFBhcnNlIC4uLi4uLi4uLS4uLi4tIyMjIy0uLi4uLS4uLi4uLi4uLi4uLlxuXG4gIGFycls2XSA9ICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSgxNCwgMTgpLCAxNikpID4+PiA4O1xuICBhcnJbN10gPSB2ICYgMHhmZjsgLy8gUGFyc2UgLi4uLi4uLi4tLi4uLi0uLi4uLSMjIyMtLi4uLi4uLi4uLi4uXG5cbiAgYXJyWzhdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDE5LCAyMyksIDE2KSkgPj4+IDg7XG4gIGFycls5XSA9IHYgJiAweGZmOyAvLyBQYXJzZSAuLi4uLi4uLi0uLi4uLS4uLi4tLi4uLi0jIyMjIyMjIyMjIyNcbiAgLy8gKFVzZSBcIi9cIiB0byBhdm9pZCAzMi1iaXQgdHJ1bmNhdGlvbiB3aGVuIGJpdC1zaGlmdGluZyBoaWdoLW9yZGVyIGJ5dGVzKVxuXG4gIGFyclsxMF0gPSAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoMjQsIDM2KSwgMTYpKSAvIDB4MTAwMDAwMDAwMDAgJiAweGZmO1xuICBhcnJbMTFdID0gdiAvIDB4MTAwMDAwMDAwICYgMHhmZjtcbiAgYXJyWzEyXSA9IHYgPj4+IDI0ICYgMHhmZjtcbiAgYXJyWzEzXSA9IHYgPj4+IDE2ICYgMHhmZjtcbiAgYXJyWzE0XSA9IHYgPj4+IDggJiAweGZmO1xuICBhcnJbMTVdID0gdiAmIDB4ZmY7XG4gIHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhcnNlOyIsImV4cG9ydCBkZWZhdWx0IC9eKD86WzAtOWEtZl17OH0tWzAtOWEtZl17NH0tWzEtNV1bMC05YS1mXXszfS1bODlhYl1bMC05YS1mXXszfS1bMC05YS1mXXsxMn18MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwKSQvaTsiLCJpbXBvcnQgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5jb25zdCBybmRzOFBvb2wgPSBuZXcgVWludDhBcnJheSgyNTYpOyAvLyAjIG9mIHJhbmRvbSB2YWx1ZXMgdG8gcHJlLWFsbG9jYXRlXG5cbmxldCBwb29sUHRyID0gcm5kczhQb29sLmxlbmd0aDtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJuZygpIHtcbiAgaWYgKHBvb2xQdHIgPiBybmRzOFBvb2wubGVuZ3RoIC0gMTYpIHtcbiAgICBjcnlwdG8ucmFuZG9tRmlsbFN5bmMocm5kczhQb29sKTtcbiAgICBwb29sUHRyID0gMDtcbiAgfVxuXG4gIHJldHVybiBybmRzOFBvb2wuc2xpY2UocG9vbFB0ciwgcG9vbFB0ciArPSAxNik7XG59IiwiaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nO1xuXG5mdW5jdGlvbiBzaGExKGJ5dGVzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGJ5dGVzKSkge1xuICAgIGJ5dGVzID0gQnVmZmVyLmZyb20oYnl0ZXMpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBieXRlcyA9PT0gJ3N0cmluZycpIHtcbiAgICBieXRlcyA9IEJ1ZmZlci5mcm9tKGJ5dGVzLCAndXRmOCcpO1xuICB9XG5cbiAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKGJ5dGVzKS5kaWdlc3QoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2hhMTsiLCJpbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG4vKipcbiAqIENvbnZlcnQgYXJyYXkgb2YgMTYgYnl0ZSB2YWx1ZXMgdG8gVVVJRCBzdHJpbmcgZm9ybWF0IG9mIHRoZSBmb3JtOlxuICogWFhYWFhYWFgtWFhYWC1YWFhYLVhYWFgtWFhYWFhYWFhYWFhYXG4gKi9cblxuY29uc3QgYnl0ZVRvSGV4ID0gW107XG5cbmZvciAobGV0IGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgYnl0ZVRvSGV4LnB1c2goKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnN1YnN0cigxKSk7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeShhcnIsIG9mZnNldCA9IDApIHtcbiAgLy8gTm90ZTogQmUgY2FyZWZ1bCBlZGl0aW5nIHRoaXMgY29kZSEgIEl0J3MgYmVlbiB0dW5lZCBmb3IgcGVyZm9ybWFuY2VcbiAgLy8gYW5kIHdvcmtzIGluIHdheXMgeW91IG1heSBub3QgZXhwZWN0LiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkL3B1bGwvNDM0XG4gIGNvbnN0IHV1aWQgPSAoYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAzXV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA2XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDddXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA5XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDExXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEzXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE1XV0pLnRvTG93ZXJDYXNlKCk7IC8vIENvbnNpc3RlbmN5IGNoZWNrIGZvciB2YWxpZCBVVUlELiAgSWYgdGhpcyB0aHJvd3MsIGl0J3MgbGlrZWx5IGR1ZSB0byBvbmVcbiAgLy8gb2YgdGhlIGZvbGxvd2luZzpcbiAgLy8gLSBPbmUgb3IgbW9yZSBpbnB1dCBhcnJheSB2YWx1ZXMgZG9uJ3QgbWFwIHRvIGEgaGV4IG9jdGV0IChsZWFkaW5nIHRvXG4gIC8vIFwidW5kZWZpbmVkXCIgaW4gdGhlIHV1aWQpXG4gIC8vIC0gSW52YWxpZCBpbnB1dCB2YWx1ZXMgZm9yIHRoZSBSRkMgYHZlcnNpb25gIG9yIGB2YXJpYW50YCBmaWVsZHNcblxuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdTdHJpbmdpZmllZCBVVUlEIGlzIGludmFsaWQnKTtcbiAgfVxuXG4gIHJldHVybiB1dWlkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdHJpbmdpZnk7IiwiaW1wb3J0IHJuZyBmcm9tICcuL3JuZy5qcyc7XG5pbXBvcnQgc3RyaW5naWZ5IGZyb20gJy4vc3RyaW5naWZ5LmpzJzsgLy8gKipgdjEoKWAgLSBHZW5lcmF0ZSB0aW1lLWJhc2VkIFVVSUQqKlxuLy9cbi8vIEluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9MaW9zSy9VVUlELmpzXG4vLyBhbmQgaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L3V1aWQuaHRtbFxuXG5sZXQgX25vZGVJZDtcblxubGV0IF9jbG9ja3NlcTsgLy8gUHJldmlvdXMgdXVpZCBjcmVhdGlvbiB0aW1lXG5cblxubGV0IF9sYXN0TVNlY3MgPSAwO1xubGV0IF9sYXN0TlNlY3MgPSAwOyAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkIGZvciBBUEkgZGV0YWlsc1xuXG5mdW5jdGlvbiB2MShvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICBsZXQgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcbiAgY29uc3QgYiA9IGJ1ZiB8fCBuZXcgQXJyYXkoMTYpO1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGV0IG5vZGUgPSBvcHRpb25zLm5vZGUgfHwgX25vZGVJZDtcbiAgbGV0IGNsb2Nrc2VxID0gb3B0aW9ucy5jbG9ja3NlcSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5jbG9ja3NlcSA6IF9jbG9ja3NlcTsgLy8gbm9kZSBhbmQgY2xvY2tzZXEgbmVlZCB0byBiZSBpbml0aWFsaXplZCB0byByYW5kb20gdmFsdWVzIGlmIHRoZXkncmUgbm90XG4gIC8vIHNwZWNpZmllZC4gIFdlIGRvIHRoaXMgbGF6aWx5IHRvIG1pbmltaXplIGlzc3VlcyByZWxhdGVkIHRvIGluc3VmZmljaWVudFxuICAvLyBzeXN0ZW0gZW50cm9weS4gIFNlZSAjMTg5XG5cbiAgaWYgKG5vZGUgPT0gbnVsbCB8fCBjbG9ja3NlcSA9PSBudWxsKSB7XG4gICAgY29uc3Qgc2VlZEJ5dGVzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTtcblxuICAgIGlmIChub2RlID09IG51bGwpIHtcbiAgICAgIC8vIFBlciA0LjUsIGNyZWF0ZSBhbmQgNDgtYml0IG5vZGUgaWQsICg0NyByYW5kb20gYml0cyArIG11bHRpY2FzdCBiaXQgPSAxKVxuICAgICAgbm9kZSA9IF9ub2RlSWQgPSBbc2VlZEJ5dGVzWzBdIHwgMHgwMSwgc2VlZEJ5dGVzWzFdLCBzZWVkQnl0ZXNbMl0sIHNlZWRCeXRlc1szXSwgc2VlZEJ5dGVzWzRdLCBzZWVkQnl0ZXNbNV1dO1xuICAgIH1cblxuICAgIGlmIChjbG9ja3NlcSA9PSBudWxsKSB7XG4gICAgICAvLyBQZXIgNC4yLjIsIHJhbmRvbWl6ZSAoMTQgYml0KSBjbG9ja3NlcVxuICAgICAgY2xvY2tzZXEgPSBfY2xvY2tzZXEgPSAoc2VlZEJ5dGVzWzZdIDw8IDggfCBzZWVkQnl0ZXNbN10pICYgMHgzZmZmO1xuICAgIH1cbiAgfSAvLyBVVUlEIHRpbWVzdGFtcHMgYXJlIDEwMCBuYW5vLXNlY29uZCB1bml0cyBzaW5jZSB0aGUgR3JlZ29yaWFuIGVwb2NoLFxuICAvLyAoMTU4Mi0xMC0xNSAwMDowMCkuICBKU051bWJlcnMgYXJlbid0IHByZWNpc2UgZW5vdWdoIGZvciB0aGlzLCBzb1xuICAvLyB0aW1lIGlzIGhhbmRsZWQgaW50ZXJuYWxseSBhcyAnbXNlY3MnIChpbnRlZ2VyIG1pbGxpc2Vjb25kcykgYW5kICduc2VjcydcbiAgLy8gKDEwMC1uYW5vc2Vjb25kcyBvZmZzZXQgZnJvbSBtc2Vjcykgc2luY2UgdW5peCBlcG9jaCwgMTk3MC0wMS0wMSAwMDowMC5cblxuXG4gIGxldCBtc2VjcyA9IG9wdGlvbnMubXNlY3MgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubXNlY3MgOiBEYXRlLm5vdygpOyAvLyBQZXIgNC4yLjEuMiwgdXNlIGNvdW50IG9mIHV1aWQncyBnZW5lcmF0ZWQgZHVyaW5nIHRoZSBjdXJyZW50IGNsb2NrXG4gIC8vIGN5Y2xlIHRvIHNpbXVsYXRlIGhpZ2hlciByZXNvbHV0aW9uIGNsb2NrXG5cbiAgbGV0IG5zZWNzID0gb3B0aW9ucy5uc2VjcyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5uc2VjcyA6IF9sYXN0TlNlY3MgKyAxOyAvLyBUaW1lIHNpbmNlIGxhc3QgdXVpZCBjcmVhdGlvbiAoaW4gbXNlY3MpXG5cbiAgY29uc3QgZHQgPSBtc2VjcyAtIF9sYXN0TVNlY3MgKyAobnNlY3MgLSBfbGFzdE5TZWNzKSAvIDEwMDAwOyAvLyBQZXIgNC4yLjEuMiwgQnVtcCBjbG9ja3NlcSBvbiBjbG9jayByZWdyZXNzaW9uXG5cbiAgaWYgKGR0IDwgMCAmJiBvcHRpb25zLmNsb2Nrc2VxID09PSB1bmRlZmluZWQpIHtcbiAgICBjbG9ja3NlcSA9IGNsb2Nrc2VxICsgMSAmIDB4M2ZmZjtcbiAgfSAvLyBSZXNldCBuc2VjcyBpZiBjbG9jayByZWdyZXNzZXMgKG5ldyBjbG9ja3NlcSkgb3Igd2UndmUgbW92ZWQgb250byBhIG5ld1xuICAvLyB0aW1lIGludGVydmFsXG5cblxuICBpZiAoKGR0IDwgMCB8fCBtc2VjcyA+IF9sYXN0TVNlY3MpICYmIG9wdGlvbnMubnNlY3MgPT09IHVuZGVmaW5lZCkge1xuICAgIG5zZWNzID0gMDtcbiAgfSAvLyBQZXIgNC4yLjEuMiBUaHJvdyBlcnJvciBpZiB0b28gbWFueSB1dWlkcyBhcmUgcmVxdWVzdGVkXG5cblxuICBpZiAobnNlY3MgPj0gMTAwMDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1dWlkLnYxKCk6IENhbid0IGNyZWF0ZSBtb3JlIHRoYW4gMTBNIHV1aWRzL3NlY1wiKTtcbiAgfVxuXG4gIF9sYXN0TVNlY3MgPSBtc2VjcztcbiAgX2xhc3ROU2VjcyA9IG5zZWNzO1xuICBfY2xvY2tzZXEgPSBjbG9ja3NlcTsgLy8gUGVyIDQuMS40IC0gQ29udmVydCBmcm9tIHVuaXggZXBvY2ggdG8gR3JlZ29yaWFuIGVwb2NoXG5cbiAgbXNlY3MgKz0gMTIyMTkyOTI4MDAwMDA7IC8vIGB0aW1lX2xvd2BcblxuICBjb25zdCB0bCA9ICgobXNlY3MgJiAweGZmZmZmZmYpICogMTAwMDAgKyBuc2VjcykgJSAweDEwMDAwMDAwMDtcbiAgYltpKytdID0gdGwgPj4+IDI0ICYgMHhmZjtcbiAgYltpKytdID0gdGwgPj4+IDE2ICYgMHhmZjtcbiAgYltpKytdID0gdGwgPj4+IDggJiAweGZmO1xuICBiW2krK10gPSB0bCAmIDB4ZmY7IC8vIGB0aW1lX21pZGBcblxuICBjb25zdCB0bWggPSBtc2VjcyAvIDB4MTAwMDAwMDAwICogMTAwMDAgJiAweGZmZmZmZmY7XG4gIGJbaSsrXSA9IHRtaCA+Pj4gOCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRtaCAmIDB4ZmY7IC8vIGB0aW1lX2hpZ2hfYW5kX3ZlcnNpb25gXG5cbiAgYltpKytdID0gdG1oID4+PiAyNCAmIDB4ZiB8IDB4MTA7IC8vIGluY2x1ZGUgdmVyc2lvblxuXG4gIGJbaSsrXSA9IHRtaCA+Pj4gMTYgJiAweGZmOyAvLyBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGAgKFBlciA0LjIuMiAtIGluY2x1ZGUgdmFyaWFudClcblxuICBiW2krK10gPSBjbG9ja3NlcSA+Pj4gOCB8IDB4ODA7IC8vIGBjbG9ja19zZXFfbG93YFxuXG4gIGJbaSsrXSA9IGNsb2Nrc2VxICYgMHhmZjsgLy8gYG5vZGVgXG5cbiAgZm9yIChsZXQgbiA9IDA7IG4gPCA2OyArK24pIHtcbiAgICBiW2kgKyBuXSA9IG5vZGVbbl07XG4gIH1cblxuICByZXR1cm4gYnVmIHx8IHN0cmluZ2lmeShiKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdjE7IiwiaW1wb3J0IHYzNSBmcm9tICcuL3YzNS5qcyc7XG5pbXBvcnQgbWQ1IGZyb20gJy4vbWQ1LmpzJztcbmNvbnN0IHYzID0gdjM1KCd2MycsIDB4MzAsIG1kNSk7XG5leHBvcnQgZGVmYXVsdCB2MzsiLCJpbXBvcnQgc3RyaW5naWZ5IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcbmltcG9ydCBwYXJzZSBmcm9tICcuL3BhcnNlLmpzJztcblxuZnVuY3Rpb24gc3RyaW5nVG9CeXRlcyhzdHIpIHtcbiAgc3RyID0gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHN0cikpOyAvLyBVVEY4IGVzY2FwZVxuXG4gIGNvbnN0IGJ5dGVzID0gW107XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICBieXRlcy5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKTtcbiAgfVxuXG4gIHJldHVybiBieXRlcztcbn1cblxuZXhwb3J0IGNvbnN0IEROUyA9ICc2YmE3YjgxMC05ZGFkLTExZDEtODBiNC0wMGMwNGZkNDMwYzgnO1xuZXhwb3J0IGNvbnN0IFVSTCA9ICc2YmE3YjgxMS05ZGFkLTExZDEtODBiNC0wMGMwNGZkNDMwYzgnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG5hbWUsIHZlcnNpb24sIGhhc2hmdW5jKSB7XG4gIGZ1bmN0aW9uIGdlbmVyYXRlVVVJRCh2YWx1ZSwgbmFtZXNwYWNlLCBidWYsIG9mZnNldCkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YWx1ZSA9IHN0cmluZ1RvQnl0ZXModmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgbmFtZXNwYWNlID09PSAnc3RyaW5nJykge1xuICAgICAgbmFtZXNwYWNlID0gcGFyc2UobmFtZXNwYWNlKTtcbiAgICB9XG5cbiAgICBpZiAobmFtZXNwYWNlLmxlbmd0aCAhPT0gMTYpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcignTmFtZXNwYWNlIG11c3QgYmUgYXJyYXktbGlrZSAoMTYgaXRlcmFibGUgaW50ZWdlciB2YWx1ZXMsIDAtMjU1KScpO1xuICAgIH0gLy8gQ29tcHV0ZSBoYXNoIG9mIG5hbWVzcGFjZSBhbmQgdmFsdWUsIFBlciA0LjNcbiAgICAvLyBGdXR1cmU6IFVzZSBzcHJlYWQgc3ludGF4IHdoZW4gc3VwcG9ydGVkIG9uIGFsbCBwbGF0Zm9ybXMsIGUuZy4gYGJ5dGVzID1cbiAgICAvLyBoYXNoZnVuYyhbLi4ubmFtZXNwYWNlLCAuLi4gdmFsdWVdKWBcblxuXG4gICAgbGV0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoMTYgKyB2YWx1ZS5sZW5ndGgpO1xuICAgIGJ5dGVzLnNldChuYW1lc3BhY2UpO1xuICAgIGJ5dGVzLnNldCh2YWx1ZSwgbmFtZXNwYWNlLmxlbmd0aCk7XG4gICAgYnl0ZXMgPSBoYXNoZnVuYyhieXRlcyk7XG4gICAgYnl0ZXNbNl0gPSBieXRlc1s2XSAmIDB4MGYgfCB2ZXJzaW9uO1xuICAgIGJ5dGVzWzhdID0gYnl0ZXNbOF0gJiAweDNmIHwgMHg4MDtcblxuICAgIGlmIChidWYpIHtcbiAgICAgIG9mZnNldCA9IG9mZnNldCB8fCAwO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyArK2kpIHtcbiAgICAgICAgYnVmW29mZnNldCArIGldID0gYnl0ZXNbaV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBidWY7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cmluZ2lmeShieXRlcyk7XG4gIH0gLy8gRnVuY3Rpb24jbmFtZSBpcyBub3Qgc2V0dGFibGUgb24gc29tZSBwbGF0Zm9ybXMgKCMyNzApXG5cblxuICB0cnkge1xuICAgIGdlbmVyYXRlVVVJRC5uYW1lID0gbmFtZTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVtcHR5XG4gIH0gY2F0Y2ggKGVycikge30gLy8gRm9yIENvbW1vbkpTIGRlZmF1bHQgZXhwb3J0IHN1cHBvcnRcblxuXG4gIGdlbmVyYXRlVVVJRC5ETlMgPSBETlM7XG4gIGdlbmVyYXRlVVVJRC5VUkwgPSBVUkw7XG4gIHJldHVybiBnZW5lcmF0ZVVVSUQ7XG59IiwiaW1wb3J0IHJuZyBmcm9tICcuL3JuZy5qcyc7XG5pbXBvcnQgc3RyaW5naWZ5IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcblxuZnVuY3Rpb24gdjQob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGNvbnN0IHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpOyAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG5cbiAgcm5kc1s2XSA9IHJuZHNbNl0gJiAweDBmIHwgMHg0MDtcbiAgcm5kc1s4XSA9IHJuZHNbOF0gJiAweDNmIHwgMHg4MDsgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG5cbiAgaWYgKGJ1Zikge1xuICAgIG9mZnNldCA9IG9mZnNldCB8fCAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgKytpKSB7XG4gICAgICBidWZbb2Zmc2V0ICsgaV0gPSBybmRzW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICByZXR1cm4gc3RyaW5naWZ5KHJuZHMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2NDsiLCJpbXBvcnQgdjM1IGZyb20gJy4vdjM1LmpzJztcbmltcG9ydCBzaGExIGZyb20gJy4vc2hhMS5qcyc7XG5jb25zdCB2NSA9IHYzNSgndjUnLCAweDUwLCBzaGExKTtcbmV4cG9ydCBkZWZhdWx0IHY1OyIsImltcG9ydCBSRUdFWCBmcm9tICcuL3JlZ2V4LmpzJztcblxuZnVuY3Rpb24gdmFsaWRhdGUodXVpZCkge1xuICByZXR1cm4gdHlwZW9mIHV1aWQgPT09ICdzdHJpbmcnICYmIFJFR0VYLnRlc3QodXVpZCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZhbGlkYXRlOyIsImltcG9ydCB2YWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlLmpzJztcblxuZnVuY3Rpb24gdmVyc2lvbih1dWlkKSB7XG4gIGlmICghdmFsaWRhdGUodXVpZCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ0ludmFsaWQgVVVJRCcpO1xuICB9XG5cbiAgcmV0dXJuIHBhcnNlSW50KHV1aWQuc3Vic3RyKDE0LCAxKSwgMTYpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2ZXJzaW9uOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNyeXB0b1wiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiZXhwb3J0IHsgZGVidWcgfSBmcm9tICcuL2RlYnVnJztcblxuZXhwb3J0IHsgTW9kZWwsIENvbnN0cnVjdG9yTW9kZWwgfSBmcm9tICcuL21vZGVsJztcbmV4cG9ydCB7IFNjaGVtYSB9IGZyb20gJy4vc2NoZW1hJztcbmV4cG9ydCB7IEFkYXB0ZXIsIFNlbGVjdCwgQ3JlYXRlLCBJbnNlcnQsIHBhcmFtc1R5cGUgfSBmcm9tICcuL2FkYXB0ZXInO1xuZXhwb3J0IHsgZmllbGRzLCBGaWVsZCwgRmllbGRLaW5kLCBjb2RlRmllbGRFcnJvciB9IGZyb20gJy4vZmllbGQnO1xuZXhwb3J0IHsgTWlncmF0aW9uIH0gZnJvbSAnLi9taWdyYXRpb24nO1xuXG4vL2V4cG9ydCB7IHNlc3Npb24sIHNldERlZmF1bHRBZGFwdGVyLCBnZXREZWZhdWx0QWRhcHRlciB9IGZyb20gJy4vc2Vzc2lvbic7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9