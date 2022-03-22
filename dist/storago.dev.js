/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/adapters/adapter.ts":
/*!*********************************!*\
  !*** ./src/adapters/adapter.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.engineKind = void 0;
var engineKind;
(function (engineKind) {
    engineKind[engineKind["WebSQL"] = 0] = "WebSQL";
    engineKind[engineKind["PostgreSQL"] = 1] = "PostgreSQL";
})(engineKind = exports.engineKind || (exports.engineKind = {}));


/***/ }),

/***/ "./src/adapters/websql/adapter.ts":
/*!****************************************!*\
  !*** ./src/adapters/websql/adapter.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSQLAdapter = void 0;
const adapter_1 = __webpack_require__(/*! ../adapter */ "./src/adapters/adapter.ts");
const select_1 = __webpack_require__(/*! ./select */ "./src/adapters/websql/select.ts");
const insert_1 = __webpack_require__(/*! ./insert */ "./src/adapters/websql/insert.ts");
const create_1 = __webpack_require__(/*! ./create */ "./src/adapters/websql/create.ts");
const debug_1 = __webpack_require__(/*! ../../debug */ "./src/debug.ts");
class WebSQLAdapter {
    constructor(name, description, size) {
        this.engine = adapter_1.engineKind.WebSQL;
        this.db = window.openDatabase(name, '', description, size);
    }
    getVersion() {
        let version = this.db.version;
        if (version !== '') {
            return parseInt(version);
        }
        return '';
    }
    changeVersion(newVersion, cb) {
        return new Promise((resolve, reject) => {
            this.db.changeVersion(String(this.getVersion()), String(newVersion), cb, reject, resolve);
        });
    }
    async getTransaction() {
        return new Promise((resolve, reject) => {
            this.db.transaction(resolve, reject);
        });
    }
    select(table) {
        let select = new select_1.WebSQLSelect(table, this);
        return select;
    }
    insert(model) {
        let insert = new insert_1.WebSQLInsert(model, this);
        return insert;
    }
    create(model) {
        let create = new create_1.WebSQLCreate(model, this);
        return create;
    }
    query(sql, data = [], tx) {
        return new Promise(async (resolve, reject) => {
            if (tx === undefined) {
                tx = await this.getTransaction();
            }
            if (debug_1.debug.query) {
                console.log('@storago/orm', 'query', sql, data);
            }
            tx.executeSql(sql, data, (tx, result) => {
                resolve(result);
            }, (tx, error) => {
                reject(error);
                return true;
            });
        });
    }
}
exports.WebSQLAdapter = WebSQLAdapter;


/***/ }),

/***/ "./src/adapters/websql/create.ts":
/*!***************************************!*\
  !*** ./src/adapters/websql/create.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSQLCreate = void 0;
class WebSQLCreate {
    constructor(model, adapter) {
        this.Model = model;
        this.adapter = adapter;
    }
    getColumns() {
        const columns = [];
        let fields = this.Model.schema.getRealFields();
        for (let field of fields) {
            let name = field.getName();
            columns.push(`${name} ${field.castDB(this.adapter)}`);
        }
        return columns;
    }
    render() {
        let columns = this.getColumns();
        let sql = `CREATE TABLE IF NOT EXISTS ${this.Model.schema.getName()} (`;
        sql += columns.join(', ');
        sql += ');';
        return sql;
    }
    execute(tx) {
        let sql = this.render();
        return this.adapter.query(sql, [], tx);
    }
}
exports.WebSQLCreate = WebSQLCreate;


/***/ }),

/***/ "./src/adapters/websql/insert.ts":
/*!***************************************!*\
  !*** ./src/adapters/websql/insert.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSQLInsert = void 0;
const debug_1 = __webpack_require__(/*! ../../debug */ "./src/debug.ts");
class WebSQLInsert {
    constructor(model, adapter) {
        this.values = [];
        this.objects = [];
        this.Model = model;
        this.adapter = adapter;
    }
    add(row) {
        this.objects.push(row);
    }
    render() {
        let schema = this.Model.schema;
        let fields = schema.getRealFields();
        let length = fields.length - 1;
        let sql = `INSERT INTO ${schema.getName()} (`;
        for (let i in fields) {
            let index = parseInt(i);
            let field = fields[i];
            let name = field.getName();
            sql += `"${name}"`;
            if (index < length) {
                sql += ', ';
            }
        }
        sql += ') VALUES';
        let o_size = this.objects.length - 1;
        for (let o in this.objects) {
            let o_index = parseInt(o);
            let obj = this.objects[o];
            sql += ' (';
            for (let i in fields) {
                let index = parseInt(i);
                let field = fields[i];
                this.values.push(field.toDB(obj));
                sql += '?';
                if (index < length) {
                    sql += ', ';
                }
            }
            sql += ')';
            if (o_index < o_size) {
                sql += ', ';
            }
        }
        sql += ';';
        return sql;
    }
    async execute() {
        let sql = this.render();
        if (debug_1.debug.insert) {
            console.log(sql, this.values);
        }
        return this.adapter.query(sql, this.values);
    }
    async save() {
        let result = await this.execute();
        console.log('result', result);
    }
}
exports.WebSQLInsert = WebSQLInsert;


/***/ }),

/***/ "./src/adapters/websql/select.ts":
/*!***************************************!*\
  !*** ./src/adapters/websql/select.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSQLSelect = void 0;
const debug_1 = __webpack_require__(/*! ../../debug */ "./src/debug.ts");
class WebSQLSelect {
    constructor(model, adapter) {
        this._offset = 0;
        this._distinct = false;
        this._from = '';
        this._where = [];
        this._column = [];
        this._join = [];
        this._joinLeft = [];
        this._joinRight = [];
        this._params = [];
        this._order = [];
        this.Model = model;
        this.adapter = adapter;
    }
    distinct(flag = true) {
        this._distinct = flag;
        return this;
    }
    from(from, columns) {
        this._from = from;
        if (!columns) {
            columns = ['*'];
        }
        columns.push('rowid');
        for (let column of columns) {
            this._column.push(`${from}.${column}`);
        }
        return this;
    }
    where(criteria, params) {
        if (params !== undefined && !Array.isArray(params)) {
            params = [params];
        }
        this._where.push([criteria, params]);
        return this;
    }
    join(tableName, on, columns) {
        this._join.push([tableName, on]);
        if (!!columns) {
            this._column.concat(columns);
        }
        return this;
    }
    joinLeft(tableName, on, columns) {
        this._joinLeft.push([tableName, on]);
        if (!!columns) {
            this._column.concat(columns);
        }
        return this;
    }
    joinRight(tableName, on, columns) {
        this._joinRight.push([tableName, on]);
        this._column.concat(columns);
        return this;
    }
    order(column, direction) {
        if (!direction) {
            direction = 'ASC';
        }
        this._order.push(`${column} ${direction}`);
    }
    render() {
        this._params = [];
        let sql = 'SELECT ';
        if (this._distinct) {
            sql += 'DISTINCT ';
        }
        sql += this._column.join(', ');
        sql += ` FROM ${this._from}`;
        if (this._join.length > 0) {
            for (let join of this._join) {
                sql += ` JOIN ${join[0]} ON ${join[1]}`;
            }
        }
        if (this._joinLeft.length > 0) {
            for (let join of this._joinLeft) {
                sql += ` JOIN LEFT ${join[0]} ON ${join[1]}`;
            }
        }
        let where_size = this._where.length;
        let whereAndLimit = where_size - 1;
        if (where_size > 0) {
            sql += ' WHERE ';
            for (let w in this._where) {
                let i = parseInt(w);
                let where = this._where[w];
                sql += where[0];
                if (whereAndLimit != i) {
                    sql += ' AND ';
                }
                if (where[1] !== undefined) {
                    console.log('where', where, where[1]);
                    this._params = this._params.concat(where[1]);
                }
            }
        }
        sql += this._order.join(' ');
        sql += ';';
        return sql;
    }
    toString() {
        return this.render();
    }
    async execute() {
        let sql = this.render();
        console.log('execute', sql, this._params);
        return this.adapter.query(sql, this._params);
    }
    async all() {
        let promises = [];
        let result = await this.execute();
        for (let i = 0; result.rows.length > i; i++) {
            let row = result.rows.item(i);
            promises.push(this.Model.schema.populateFromDB(row));
        }
        let rowset = await Promise.all(promises);
        if (debug_1.debug.select) {
            console.log('@storago/orm', 'select:rowset', rowset);
        }
        return rowset;
    }
    async one() {
        let rowset = await this.all();
        return rowset[0];
    }
}
exports.WebSQLSelect = WebSQLSelect;


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
        if (valueDefault === undefined) {
            return undefined;
        }
        if (typeof valueDefault === 'function') {
            return valueDefault();
        }
        return valueDefault;
    }
    isVirtual() {
        if (this.config.link !== undefined && !this.config.index) {
            return true;
        }
        return false;
    }
    async populate(model, row) {
        let name = this.getName();
        let value = row[name];
        if (this.config.link !== undefined) {
            let links = this.config.link.split('.');
            let itemName = links.shift();
            if (!itemName || itemName in model.__data) {
                model[name] = undefined;
                return;
            }
            value = await model.__data[itemName];
            while (itemName = links.shift()) {
                if (typeof value === 'object') {
                    if (itemName in value) {
                        value = value[itemName];
                    }
                }
                else {
                    break;
                }
            }
        }
        return this.fromDB(value);
    }
    toDB(model) {
        let name = this.getName();
        let value = model[name];
        if (value === undefined) {
            value = this.getDefaultValue();
        }
        if (value === undefined) {
            value = null;
        }
        return value;
    }
    ;
}
exports.Field = Field;


/***/ }),

/***/ "./src/field/index.ts":
/*!****************************!*\
  !*** ./src/field/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fields = void 0;
const text_1 = __webpack_require__(/*! ./text */ "./src/field/text.ts");
const uuid_1 = __webpack_require__(/*! ./uuid */ "./src/field/uuid.ts");
const json_1 = __webpack_require__(/*! ./json */ "./src/field/json.ts");
exports.fields = {
    Text: text_1.Text,
    UUID: uuid_1.UUID,
    Json: json_1.Json,
};


/***/ }),

/***/ "./src/field/json.ts":
/*!***************************!*\
  !*** ./src/field/json.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Json = void 0;
const adapter_1 = __webpack_require__(/*! ../adapters/adapter */ "./src/adapters/adapter.ts");
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

/***/ "./src/field/text.ts":
/*!***************************!*\
  !*** ./src/field/text.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Text = void 0;
const adapter_1 = __webpack_require__(/*! ../adapters/adapter */ "./src/adapters/adapter.ts");
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
        if ('toString' in value) {
            return value.toString();
        }
        return undefined;
    }
    toDB(model) {
        let name = this.getName();
        let value = model[name];
        if (typeof value === 'string') {
            return value.trim();
        }
        if ('toString' in value) {
            return value.toString();
        }
        return null;
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
const adapter_1 = __webpack_require__(/*! ../adapters/adapter */ "./src/adapters/adapter.ts");
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
        return value;
    }
    getDefaultValue() {
        let value = super.getDefaultValue();
        if (value === undefined && this.config.primary) {
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

/***/ "./src/migraton.ts":
/*!*************************!*\
  !*** ./src/migraton.ts ***!
  \*************************/
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
    constructor() {
        this.__data = {};
    }
    async save() {
        let schema = Object.getPrototypeOf(this).constructor.schema;
        if (Object.keys(this.__data).length === 0) {
            let insert = schema.insert();
            insert.add(this);
            return insert.save();
        }
        return Promise.resolve(1);
    }
    static find(where, param) {
        let select = this.select();
        select.where(where, param);
        return select.one();
    }
    ;
    static select() {
        return this.schema.select();
    }
    static create() {
        return this.schema.create();
    }
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
const session_1 = __webpack_require__(/*! ./session */ "./src/session.ts");
class Schema {
    constructor(model, name, fields, adapter = session_1.session.adapter) {
        this.name = name;
        this.fields = fields;
        this.adapter = adapter;
        this.Model = model;
    }
    create() {
        return this.adapter.create(this.Model);
    }
    getName() {
        return this.name;
    }
    getFields() {
        return this.fields;
    }
    getRealFields() {
        let fieldFiltred = [];
        for (let field of this.fields) {
            if (!field.isVirtual()) {
                fieldFiltred.push(field);
            }
        }
        return fieldFiltred;
    }
    getColumns() {
        let columns = [];
        for (let field of this.fields) {
            if (!field.isVirtual()) {
                columns.push(field.getName());
            }
        }
        return columns;
    }
    getAdapter() {
        return this.adapter;
    }
    select() {
        let select = this.adapter.select(this.Model);
        select.from(this.getName(), this.getColumns());
        return select;
    }
    insert() {
        let insert = this.adapter.insert(this.Model);
        return insert;
    }
    async populateFromDB(row, model = new this.Model()) {
        let promises = [];
        let fields = this.getFields();
        let keys = [];
        for (let field of fields) {
            let name = field.getName();
            let promisePopulate = field.populate(model, row);
            model.__data[name] = promisePopulate;
            promises.push(promisePopulate);
            keys.push(name);
        }
        let data = await Promise.all(promises);
        for (let k in keys) {
            let name = keys[k];
            model[name] = data[k];
        }
        return model;
    }
}
exports.Schema = Schema;


/***/ }),

/***/ "./src/session.ts":
/*!************************!*\
  !*** ./src/session.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getDefaultAdapter = exports.setDefaultAdapter = exports.session = void 0;
const adapter_1 = __webpack_require__(/*! ./adapters/websql/adapter */ "./src/adapters/websql/adapter.ts");
exports.session = {
    adapter: new adapter_1.WebSQLAdapter('default', 'default db', 1024 ** 2),
};
function setDefaultAdapter(adapter) {
    exports.session.adapter = adapter;
}
exports.setDefaultAdapter = setDefaultAdapter;
function getDefaultAdapter() {
    return exports.session.adapter;
}
exports.getDefaultAdapter = getDefaultAdapter;


/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "v1": () => (/* reexport safe */ _v1_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "v3": () => (/* reexport safe */ _v3_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "v4": () => (/* reexport safe */ _v4_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "v5": () => (/* reexport safe */ _v5_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "NIL": () => (/* reexport safe */ _nil_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "version": () => (/* reexport safe */ _version_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   "validate": () => (/* reexport safe */ _validate_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   "stringify": () => (/* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   "parse": () => (/* reexport safe */ _parse_js__WEBPACK_IMPORTED_MODULE_8__["default"])
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
exports.getDefaultAdapter = exports.setDefaultAdapter = exports.session = exports.Migration = exports.fields = exports.Schema = exports.Model = exports.debug = void 0;
var debug_1 = __webpack_require__(/*! ./debug */ "./src/debug.ts");
Object.defineProperty(exports, "debug", ({ enumerable: true, get: function () { return debug_1.debug; } }));
var model_1 = __webpack_require__(/*! ./model */ "./src/model.ts");
Object.defineProperty(exports, "Model", ({ enumerable: true, get: function () { return model_1.Model; } }));
var schema_1 = __webpack_require__(/*! ./schema */ "./src/schema.ts");
Object.defineProperty(exports, "Schema", ({ enumerable: true, get: function () { return schema_1.Schema; } }));
var field_1 = __webpack_require__(/*! ./field */ "./src/field/index.ts");
Object.defineProperty(exports, "fields", ({ enumerable: true, get: function () { return field_1.fields; } }));
var migraton_1 = __webpack_require__(/*! ./migraton */ "./src/migraton.ts");
Object.defineProperty(exports, "Migration", ({ enumerable: true, get: function () { return migraton_1.Migration; } }));
var session_1 = __webpack_require__(/*! ./session */ "./src/session.ts");
Object.defineProperty(exports, "session", ({ enumerable: true, get: function () { return session_1.session; } }));
Object.defineProperty(exports, "setDefaultAdapter", ({ enumerable: true, get: function () { return session_1.setDefaultAdapter; } }));
Object.defineProperty(exports, "getDefaultAdapter", ({ enumerable: true, get: function () { return session_1.getDefaultAdapter; } }));

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05BLG1FQUFnQztBQUF2QixvR0FBSztBQUVkLG1FQUFnQztBQUF2QixvR0FBSztBQUNkLHNFQUFrQztBQUF6Qix1R0FBTTtBQUNmLHlFQUFpQztBQUF4QixzR0FBTTtBQUNmLDRFQUF1QztBQUE5QiwrR0FBUztBQUVsQix5RUFBMEU7QUFBakUsMEdBQU87QUFBRSw4SEFBaUI7QUFBRSw4SEFBaUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvYWRhcHRlcnMvYWRhcHRlci50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvYWRhcHRlcnMvd2Vic3FsL2FkYXB0ZXIudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2FkYXB0ZXJzL3dlYnNxbC9jcmVhdGUudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2FkYXB0ZXJzL3dlYnNxbC9pbnNlcnQudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2FkYXB0ZXJzL3dlYnNxbC9zZWxlY3QudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2RlYnVnLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC9maWVsZC50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL2pzb24udHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL3RleHQudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL3V1aWQudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL21pZ3JhdG9uLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9tb2RlbC50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvc2NoZW1hLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9zZXNzaW9uLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9tZDUuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9uaWwuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9wYXJzZS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3JlZ2V4LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvcm5nLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvc2hhMS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3N0cmluZ2lmeS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3YxLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdjMuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92MzUuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92NC5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3Y1LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdmFsaWRhdGUuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92ZXJzaW9uLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0BzdG9yYWdvL29ybS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTZWxlY3QgfSBmcm9tIFwiLi9zZWxlY3RcIjtcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBJbnNlcnQgfSBmcm9tIFwiLi9pbnNlcnRcIjtcbmltcG9ydCB7IENyZWF0ZSB9IGZyb20gXCIuL2NyZWF0ZVwiO1xuXG50eXBlIGNhbGxiYWNrTWlncmF0aW9uID0geyh0cmFuc2FjdGlvbjogYW55KSA6IFByb21pc2U8dm9pZD59O1xuXG5leHBvcnQgZW51bSBlbmdpbmVLaW5kIHtcbiAgV2ViU1FMLFxuICBQb3N0Z3JlU1FMLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFkYXB0ZXJ7XG5cbiAgZW5naW5lOiBlbmdpbmVLaW5kO1xuXG4gIHF1ZXJ5KHNxbDogYW55LCBkYXRhOiBPYmplY3RBcnJheSwgdHJhbnNhY3Rpb246IGFueSkgOiBQcm9taXNlPGFueT47XG4gIHNlbGVjdChtb2RlbDogdHlwZW9mIE1vZGVsKSA6IFNlbGVjdDtcbiAgaW5zZXJ0KG1vZGVsOiB0eXBlb2YgTW9kZWwpIDogSW5zZXJ0O1xuICBnZXRWZXJzaW9uKCkgOiAnJ3xudW1iZXI7XG4gIGNyZWF0ZShtb2RlbDogdHlwZW9mIE1vZGVsKSA6IENyZWF0ZTtcbiAgY2hhbmdlVmVyc2lvbihuZXdWZXJzaW9uOiBudW1iZXIsIGNiOiBjYWxsYmFja01pZ3JhdGlvbikgOiBQcm9taXNlPHZvaWQ+O1xufSIsImltcG9ydCB7IEFkYXB0ZXIsIGVuZ2luZUtpbmQgfSBmcm9tIFwiLi4vYWRhcHRlclwiO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vLi4vbW9kZWxcIjtcbmltcG9ydCB7IFdlYlNRTFNlbGVjdCB9IGZyb20gXCIuL3NlbGVjdFwiO1xuaW1wb3J0IHsgV2ViU1FMSW5zZXJ0IH0gZnJvbSBcIi4vaW5zZXJ0XCI7XG5pbXBvcnQgeyBXZWJTUUxDcmVhdGUgfSBmcm9tIFwiLi9jcmVhdGVcIjtcbmltcG9ydCB7IGRlYnVnIH0gZnJvbSBcIi4uLy4uL2RlYnVnXCI7XG5cbnR5cGUgY2FsbGJhY2tNaWdyYXRpb24gPSB7KHRyYW5zYWN0aW9uOiBTUUxUcmFuc2FjdGlvbikgOiBQcm9taXNlPHZvaWQ+fTtcblxuZXhwb3J0IGNsYXNzIFdlYlNRTEFkYXB0ZXIgaW1wbGVtZW50cyBBZGFwdGVyIHtcblxuICBwdWJsaWMgcmVhZG9ubHkgZGI6IERhdGFiYXNlO1xuICBwdWJsaWMgcmVhZG9ubHkgZW5naW5lOiBlbmdpbmVLaW5kID0gZW5naW5lS2luZC5XZWJTUUw7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nLCBzaXplOiBudW1iZXIpIHtcblxuICAgIHRoaXMuZGIgPSB3aW5kb3cub3BlbkRhdGFiYXNlKG5hbWUsICcnLCBkZXNjcmlwdGlvbiwgc2l6ZSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0VmVyc2lvbigpOiAnJ3xudW1iZXIge1xuXG4gICAgbGV0IHZlcnNpb24gPSB0aGlzLmRiLnZlcnNpb24gYXMgc3RyaW5nO1xuICAgIGlmICh2ZXJzaW9uICE9PSAnJykge1xuICAgICAgcmV0dXJuIHBhcnNlSW50KHZlcnNpb24pO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBwdWJsaWMgY2hhbmdlVmVyc2lvbihuZXdWZXJzaW9uOiBudW1iZXIsIGNiOiBjYWxsYmFja01pZ3JhdGlvbikgOiBQcm9taXNlPHZvaWQ+e1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgdGhpcy5kYi5jaGFuZ2VWZXJzaW9uKFN0cmluZyh0aGlzLmdldFZlcnNpb24oKSksIFN0cmluZyhuZXdWZXJzaW9uKSwgY2IsIHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0VHJhbnNhY3Rpb24oKTogUHJvbWlzZTxTUUxUcmFuc2FjdGlvbj4ge1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuZGIudHJhbnNhY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzZWxlY3QodGFibGU6IHR5cGVvZiBNb2RlbCk6IFdlYlNRTFNlbGVjdCB7XG4gICAgbGV0IHNlbGVjdCA9IG5ldyBXZWJTUUxTZWxlY3QodGFibGUsIHRoaXMpO1xuICAgIHJldHVybiBzZWxlY3Q7XG4gIH1cblxuICBwdWJsaWMgaW5zZXJ0KG1vZGVsOiB0eXBlb2YgTW9kZWwpOiBXZWJTUUxJbnNlcnQge1xuICAgIGxldCBpbnNlcnQgPSBuZXcgV2ViU1FMSW5zZXJ0KG1vZGVsLCB0aGlzKTtcbiAgICByZXR1cm4gaW5zZXJ0O1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZShtb2RlbDogdHlwZW9mIE1vZGVsKSA6IFdlYlNRTENyZWF0ZSB7XG5cbiAgICBsZXQgY3JlYXRlID0gbmV3IFdlYlNRTENyZWF0ZShtb2RlbCwgdGhpcyk7XG4gICAgcmV0dXJuIGNyZWF0ZTtcbiAgfVxuXG4gIHB1YmxpYyBxdWVyeShzcWw6IERPTVN0cmluZywgZGF0YTogT2JqZWN0QXJyYXkgPSBbXSwgdHg/OiBTUUxUcmFuc2FjdGlvbik6IFByb21pc2U8U1FMUmVzdWx0U2V0PiB7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICBpZih0eCA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgdHggPSBhd2FpdCB0aGlzLmdldFRyYW5zYWN0aW9uKCk7XG4gICAgICB9XG5cbiAgICAgIGlmKGRlYnVnLnF1ZXJ5KXtcbiAgICAgICAgY29uc29sZS5sb2coJ0BzdG9yYWdvL29ybScsICdxdWVyeScsIHNxbCwgZGF0YSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHR4LmV4ZWN1dGVTcWwoc3FsLCBkYXRhLCAodHg6IFNRTFRyYW5zYWN0aW9uLCByZXN1bHQ6IFNRTFJlc3VsdFNldCk6IHZvaWQgPT4ge1xuXG4gICAgICAgIHJlc29sdmUocmVzdWx0KTtcblxuICAgICAgfSwgKHR4OiBTUUxUcmFuc2FjdGlvbiwgZXJyb3I6IFNRTEVycm9yKTogYm9vbGVhbiA9PiB7XG5cbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufSIsImltcG9ydCB7IENyZWF0ZSB9IGZyb20gXCIuLi9jcmVhdGVcIjtcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi4vLi4vbW9kZWwnO1xuaW1wb3J0IHsgV2ViU1FMQWRhcHRlciB9IGZyb20gJy4vYWRhcHRlcic7XG5cbmV4cG9ydCBjbGFzcyBXZWJTUUxDcmVhdGUgaW1wbGVtZW50cyBDcmVhdGV7XG5cbiAgcHJpdmF0ZSBNb2RlbDogdHlwZW9mIE1vZGVsO1xuICBwcml2YXRlIGFkYXB0ZXI6IFdlYlNRTEFkYXB0ZXI7XG4gXG4gIGNvbnN0cnVjdG9yKG1vZGVsOiB0eXBlb2YgTW9kZWwsIGFkYXB0ZXI6IFdlYlNRTEFkYXB0ZXIpe1xuICAgIHRoaXMuTW9kZWwgPSBtb2RlbDtcbiAgICB0aGlzLmFkYXB0ZXIgPSBhZGFwdGVyO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDb2x1bW5zKCkgOiBzdHJpbmdbXSB7XG5cbiAgICBjb25zdCBjb2x1bW5zOiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBmaWVsZHMgPSB0aGlzLk1vZGVsLnNjaGVtYS5nZXRSZWFsRmllbGRzKCk7XG5cbiAgICBmb3IobGV0IGZpZWxkIG9mIGZpZWxkcyl7XG4gICAgICBsZXQgbmFtZSA9IGZpZWxkLmdldE5hbWUoKTtcbiAgICAgIGNvbHVtbnMucHVzaChgJHtuYW1lfSAke2ZpZWxkLmNhc3REQih0aGlzLmFkYXB0ZXIpfWApO1xuICAgIH1cblxuICAgIHJldHVybiBjb2x1bW5zO1xuICB9XG5cbiAgcHVibGljIHJlbmRlcigpIDogc3RyaW5nIHtcblxuICAgIGxldCBjb2x1bW5zOiBzdHJpbmdbXSA9IHRoaXMuZ2V0Q29sdW1ucygpO1xuICAgIGxldCBzcWwgPSBgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgJHt0aGlzLk1vZGVsLnNjaGVtYS5nZXROYW1lKCl9IChgO1xuICAgIHNxbCArPSBjb2x1bW5zLmpvaW4oJywgJyk7XG4gICAgc3FsICs9ICcpOyc7XG4gICAgcmV0dXJuIHNxbDtcbiAgfVxuXG4gIHB1YmxpYyBleGVjdXRlKHR4OiBTUUxUcmFuc2FjdGlvbikgOiBQcm9taXNlPFNRTFJlc3VsdFNldD4ge1xuXG4gICAgbGV0IHNxbDogc3RyaW5nID0gdGhpcy5yZW5kZXIoKTtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnF1ZXJ5KHNxbCwgW10sIHR4KTtcbiAgfVxufSIsImltcG9ydCB7IEluc2VydCB9IGZyb20gXCIuLi9pbnNlcnRcIjtcbmltcG9ydCB7IFdlYlNRTEFkYXB0ZXIgfSBmcm9tIFwiLi9hZGFwdGVyXCI7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuLi8uLi9tb2RlbFwiO1xuaW1wb3J0IHsgZGVidWcgfSBmcm9tIFwiLi4vLi4vZGVidWdcIjtcblxuZXhwb3J0IHR5cGUgZGJWYWx1ZUNhc3QgPSBzdHJpbmcgfCBudW1iZXI7XG5cbmV4cG9ydCBjbGFzcyBXZWJTUUxJbnNlcnQgaW1wbGVtZW50cyBJbnNlcnQge1xuXG4gIHByb3RlY3RlZCBNb2RlbDogdHlwZW9mIE1vZGVsO1xuICBwcm90ZWN0ZWQgYWRhcHRlcjogV2ViU1FMQWRhcHRlcjtcbiAgcHJvdGVjdGVkIHZhbHVlczogZGJWYWx1ZUNhc3RbXSA9IFtdO1xuICBwcm90ZWN0ZWQgb2JqZWN0czogTW9kZWxbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKG1vZGVsOiB0eXBlb2YgTW9kZWwsIGFkYXB0ZXI6IFdlYlNRTEFkYXB0ZXIpIHtcbiAgICB0aGlzLk1vZGVsID0gbW9kZWw7XG4gICAgdGhpcy5hZGFwdGVyID0gYWRhcHRlcjtcbiAgfVxuXG4gIGFkZChyb3c6IE1vZGVsKTogdm9pZCB7XG5cbiAgICB0aGlzLm9iamVjdHMucHVzaChyb3cpO1xuICB9XG5cbiAgcmVuZGVyKCk6IHN0cmluZyB7XG5cbiAgICBsZXQgc2NoZW1hID0gdGhpcy5Nb2RlbC5zY2hlbWE7XG4gICAgbGV0IGZpZWxkcyA9IHNjaGVtYS5nZXRSZWFsRmllbGRzKCk7XG5cbiAgICBsZXQgbGVuZ3RoID0gZmllbGRzLmxlbmd0aCAtIDE7XG4gICAgbGV0IHNxbCA9IGBJTlNFUlQgSU5UTyAkeyBzY2hlbWEuZ2V0TmFtZSgpIH0gKGA7XG4gICAgZm9yIChsZXQgaSBpbiBmaWVsZHMpIHtcblxuICAgICAgbGV0IGluZGV4ID0gcGFyc2VJbnQoaSk7XG4gICAgICBsZXQgZmllbGQgPSBmaWVsZHNbaV07XG4gICAgICBsZXQgbmFtZSA9IGZpZWxkLmdldE5hbWUoKTtcbiAgICAgIHNxbCArPSBgXCIkeyBuYW1lIH1cImA7XG4gICAgICBpZiAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgc3FsICs9ICcsICc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3FsICs9ICcpIFZBTFVFUyc7XG5cbiAgICBsZXQgb19zaXplID0gdGhpcy5vYmplY3RzLmxlbmd0aCAtIDE7XG4gICAgZm9yIChsZXQgbyBpbiB0aGlzLm9iamVjdHMpIHtcblxuICAgICAgbGV0IG9faW5kZXggPSBwYXJzZUludChvKTtcbiAgICAgIGxldCBvYmogPSB0aGlzLm9iamVjdHNbb107XG5cbiAgICAgIHNxbCArPSAnICgnO1xuXG4gICAgICBmb3IgKGxldCBpIGluIGZpZWxkcykge1xuXG4gICAgICAgIGxldCBpbmRleCA9IHBhcnNlSW50KGkpO1xuICAgICAgICBsZXQgZmllbGQgPSBmaWVsZHNbaV07XG5cbiAgICAgICAgdGhpcy52YWx1ZXMucHVzaChmaWVsZC50b0RCKG9iaikpOyAvL2d1YXJkYSBvcyB2YWxvcmVzIHBhcmEgZ3JhdmFyIG5vIGJhbmNvXG5cbiAgICAgICAgc3FsICs9ICc/JztcbiAgICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgc3FsICs9ICcsICc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgc3FsICs9ICcpJztcblxuICAgICAgaWYgKG9faW5kZXggPCBvX3NpemUpIHtcbiAgICAgICAgc3FsICs9ICcsICc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3FsICs9ICc7JztcblxuICAgIHJldHVybiBzcWw7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZXhlY3V0ZSgpOiBQcm9taXNlPFNRTFJlc3VsdFNldD4ge1xuXG4gICAgbGV0IHNxbCA9IHRoaXMucmVuZGVyKCk7XG4gICAgaWYoZGVidWcuaW5zZXJ0KXtcbiAgICAgIGNvbnNvbGUubG9nKHNxbCwgdGhpcy52YWx1ZXMpO1xuICAgIH1cbiAgICBcblxuICAgIHJldHVybiB0aGlzLmFkYXB0ZXIucXVlcnkoc3FsLCB0aGlzLnZhbHVlcyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2F2ZSgpIDogUHJvbWlzZTx2b2lkPntcblxuICAgIGxldCByZXN1bHQgPSBhd2FpdCB0aGlzLmV4ZWN1dGUoKTtcbiAgICBjb25zb2xlLmxvZygncmVzdWx0JywgcmVzdWx0KTtcbiAgfVxufSIsImltcG9ydCB7IFdlYlNRTEFkYXB0ZXIgfSBmcm9tICcuL2FkYXB0ZXInO1xuaW1wb3J0IHsgU2VsZWN0IH0gZnJvbSAnLi4vc2VsZWN0JztcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi4vLi4vbW9kZWwnO1xuaW1wb3J0IHsgcGFyYW1zVHlwZSB9IGZyb20gJy4uL3F1ZXJ5JztcbmltcG9ydCB7IGRlYnVnIH0gZnJvbSAnLi4vLi4vZGVidWcnO1xuXG50eXBlIHdoZXJlVHVwbGUgPSBbc3RyaW5nLCBwYXJhbXNUeXBlW10gfCB1bmRlZmluZWRdO1xudHlwZSBqb2luVHVwbGUgPSBbc3RyaW5nLCBzdHJpbmddO1xudHlwZSBvcmRlclR5cGUgPSBcIkFTQ1wiIHwgXCJERVNDXCI7XG5cbmV4cG9ydCBjbGFzcyBXZWJTUUxTZWxlY3QgaW1wbGVtZW50cyBTZWxlY3Qge1xuXG4gIHByaXZhdGUgTW9kZWw6IHR5cGVvZiBNb2RlbDtcbiAgcHJpdmF0ZSBhZGFwdGVyOiBXZWJTUUxBZGFwdGVyO1xuICBwcml2YXRlIF9vZmZzZXQ6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgX2Rpc3RpbmN0OiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgX2Zyb206IHN0cmluZyA9ICcnO1xuICBwcml2YXRlIF93aGVyZTogd2hlcmVUdXBsZVtdID0gW107XG4gIHByaXZhdGUgX2NvbHVtbjogc3RyaW5nW10gPSBbXTtcbiAgcHJpdmF0ZSBfam9pbjogam9pblR1cGxlW10gPSBbXTtcbiAgcHJpdmF0ZSBfam9pbkxlZnQ6IGpvaW5UdXBsZVtdID0gW107XG4gIHByaXZhdGUgX2pvaW5SaWdodDogam9pblR1cGxlW10gPSBbXTtcbiAgcHJpdmF0ZSBfcGFyYW1zOiBwYXJhbXNUeXBlW10gPSBbXTtcbiAgcHJpdmF0ZSBfb3JkZXI6IHN0cmluZ1tdID0gW107XG5cbiAgY29uc3RydWN0b3IobW9kZWw6IHR5cGVvZiBNb2RlbCwgYWRhcHRlcjogV2ViU1FMQWRhcHRlcikge1xuICAgIHRoaXMuTW9kZWwgPSBtb2RlbDtcbiAgICB0aGlzLmFkYXB0ZXIgPSBhZGFwdGVyO1xuICB9XG5cbiAgZGlzdGluY3QoZmxhZzogYm9vbGVhbiA9IHRydWUpOiBXZWJTUUxTZWxlY3Qge1xuXG4gICAgdGhpcy5fZGlzdGluY3QgPSBmbGFnO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZnJvbShmcm9tOiBzdHJpbmcsIGNvbHVtbnM/OiBzdHJpbmdbXSk6IFdlYlNRTFNlbGVjdCB7XG5cbiAgICB0aGlzLl9mcm9tID0gZnJvbTtcbiAgICBpZiAoIWNvbHVtbnMpIHtcbiAgICAgIGNvbHVtbnMgPSBbJyonXTtcbiAgICB9XG5cbiAgICBjb2x1bW5zLnB1c2goJ3Jvd2lkJyk7XG5cbiAgICBmb3IgKGxldCBjb2x1bW4gb2YgY29sdW1ucykge1xuICAgICAgdGhpcy5fY29sdW1uLnB1c2goYCR7IGZyb20gfS4keyBjb2x1bW4gfWApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgd2hlcmUoY3JpdGVyaWE6IHN0cmluZywgcGFyYW1zPzogcGFyYW1zVHlwZVtdIHwgcGFyYW1zVHlwZSk6IFdlYlNRTFNlbGVjdCB7XG5cbiAgICBpZiAocGFyYW1zICE9PSB1bmRlZmluZWQgJiYgIUFycmF5LmlzQXJyYXkocGFyYW1zKSkge1xuICAgICAgcGFyYW1zID0gW3BhcmFtc107XG4gICAgfVxuXG4gICAgdGhpcy5fd2hlcmUucHVzaChbY3JpdGVyaWEsIHBhcmFtc10pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgam9pbih0YWJsZU5hbWU6IHN0cmluZywgb246IHN0cmluZywgY29sdW1ucz86IHN0cmluZ1tdKTogV2ViU1FMU2VsZWN0IHtcblxuICAgIHRoaXMuX2pvaW4ucHVzaChbdGFibGVOYW1lLCBvbl0pO1xuICAgIGlmICghIWNvbHVtbnMpIHtcbiAgICAgIHRoaXMuX2NvbHVtbi5jb25jYXQoY29sdW1ucyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgam9pbkxlZnQodGFibGVOYW1lOiBzdHJpbmcsIG9uOiBzdHJpbmcsIGNvbHVtbnM/OiBzdHJpbmdbXSk6IFdlYlNRTFNlbGVjdCB7XG5cbiAgICB0aGlzLl9qb2luTGVmdC5wdXNoKFt0YWJsZU5hbWUsIG9uXSk7XG4gICAgaWYgKCEhY29sdW1ucykge1xuICAgICAgdGhpcy5fY29sdW1uLmNvbmNhdChjb2x1bW5zKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBqb2luUmlnaHQodGFibGVOYW1lOiBzdHJpbmcsIG9uOiBzdHJpbmcsIGNvbHVtbnM6IHN0cmluZ1tdKTogV2ViU1FMU2VsZWN0IHtcblxuICAgIHRoaXMuX2pvaW5SaWdodC5wdXNoKFt0YWJsZU5hbWUsIG9uXSk7XG4gICAgdGhpcy5fY29sdW1uLmNvbmNhdChjb2x1bW5zKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG9yZGVyKGNvbHVtbjogc3RyaW5nLCBkaXJlY3Rpb24/OiBvcmRlclR5cGUpIHtcblxuICAgIGlmICghZGlyZWN0aW9uKSB7XG4gICAgICBkaXJlY3Rpb24gPSAnQVNDJztcbiAgICB9XG5cbiAgICB0aGlzLl9vcmRlci5wdXNoKGAkeyBjb2x1bW4gfSAkeyBkaXJlY3Rpb24gfWApO1xuICB9XG5cbiAgcmVuZGVyKCk6IHN0cmluZyB7XG5cbiAgICB0aGlzLl9wYXJhbXMgPSBbXTtcbiAgICAvKlxuICAgIGlmKCF0aGlzLl9mcm9tICYmIHRoaXMuVGFibGUpe1xuICAgICAgdGhpcy5mcm9tKHRoaXMuVGFibGUuc2NoZW1hLm5hbWUpO1xuICAgIH0qL1xuXG4gICAgbGV0IHNxbCA9ICdTRUxFQ1QgJztcbiAgICBpZiAodGhpcy5fZGlzdGluY3QpIHtcbiAgICAgIHNxbCArPSAnRElTVElOQ1QgJztcbiAgICB9XG5cbiAgICBzcWwgKz0gdGhpcy5fY29sdW1uLmpvaW4oJywgJyk7XG4gICAgc3FsICs9IGAgRlJPTSAkeyB0aGlzLl9mcm9tIH1gO1xuXG4gICAgLy9qb2luXG4gICAgaWYgKHRoaXMuX2pvaW4ubGVuZ3RoID4gMCkge1xuICAgICAgZm9yIChsZXQgam9pbiBvZiB0aGlzLl9qb2luKSB7XG4gICAgICAgIHNxbCArPSBgIEpPSU4gJHsgam9pblswXSB9IE9OICR7IGpvaW5bMV0gfWA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9sZWZ0IGpvaW5cbiAgICBpZiAodGhpcy5fam9pbkxlZnQubGVuZ3RoID4gMCkge1xuICAgICAgZm9yIChsZXQgam9pbiBvZiB0aGlzLl9qb2luTGVmdCkge1xuICAgICAgICBzcWwgKz0gYCBKT0lOIExFRlQgJHsgam9pblswXSB9IE9OICR7IGpvaW5bMV0gfWA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy93aGVyZVxuICAgIGxldCB3aGVyZV9zaXplID0gdGhpcy5fd2hlcmUubGVuZ3RoO1xuICAgIGxldCB3aGVyZUFuZExpbWl0ID0gd2hlcmVfc2l6ZSAtIDE7XG4gICAgaWYgKHdoZXJlX3NpemUgPiAwKSB7XG4gICAgICBzcWwgKz0gJyBXSEVSRSAnO1xuICAgICAgZm9yIChsZXQgdyBpbiB0aGlzLl93aGVyZSkge1xuICAgICAgICBsZXQgaTogbnVtYmVyID0gcGFyc2VJbnQodyk7XG4gICAgICAgIGxldCB3aGVyZSA9IHRoaXMuX3doZXJlW3ddO1xuICAgICAgICBzcWwgKz0gd2hlcmVbMF07XG4gICAgICAgIGlmICh3aGVyZUFuZExpbWl0ICE9IGkpIHtcbiAgICAgICAgICBzcWwgKz0gJyBBTkQgJztcbiAgICAgICAgfVxuICAgICAgICBpZiAod2hlcmVbMV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCd3aGVyZScsIHdoZXJlLCB3aGVyZVsxXSk7XG4gICAgICAgICAgdGhpcy5fcGFyYW1zID0gdGhpcy5fcGFyYW1zLmNvbmNhdCh3aGVyZVsxXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzcWwgKz0gdGhpcy5fb3JkZXIuam9pbignICcpO1xuICAgIHNxbCArPSAnOyc7XG4gICAgcmV0dXJuIHNxbDtcbiAgfVxuXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZXhlY3V0ZSgpOiBQcm9taXNlPFNRTFJlc3VsdFNldD4ge1xuXG4gICAgbGV0IHNxbDogc3RyaW5nID0gdGhpcy5yZW5kZXIoKTtcbiAgICBjb25zb2xlLmxvZygnZXhlY3V0ZScsIHNxbCwgdGhpcy5fcGFyYW1zKTtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnF1ZXJ5KHNxbCwgdGhpcy5fcGFyYW1zKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBhbGwoKTogUHJvbWlzZTxNb2RlbFtdPiB7XG5cbiAgICBsZXQgcHJvbWlzZXM6IFByb21pc2U8TW9kZWw+W10gPSBbXTtcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgdGhpcy5leGVjdXRlKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgcmVzdWx0LnJvd3MubGVuZ3RoID4gaTsgaSsrKSB7XG4gICAgICBsZXQgcm93ID0gcmVzdWx0LnJvd3MuaXRlbShpKTtcbiAgICAgIHByb21pc2VzLnB1c2godGhpcy5Nb2RlbC5zY2hlbWEucG9wdWxhdGVGcm9tREIocm93KSk7XG4gICAgfVxuXG4gICAgbGV0IHJvd3NldCA9IGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICBpZiAoZGVidWcuc2VsZWN0KSB7XG4gICAgICBjb25zb2xlLmxvZygnQHN0b3JhZ28vb3JtJywgJ3NlbGVjdDpyb3dzZXQnLCByb3dzZXQpO1xuICAgIH1cblxuICAgIHJldHVybiByb3dzZXQ7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgb25lKCk6IFByb21pc2U8TW9kZWw+IHtcblxuICAgIGxldCByb3dzZXQgPSBhd2FpdCB0aGlzLmFsbCgpO1xuICAgIHJldHVybiByb3dzZXRbMF07XG4gIH1cbn0iLCJpbnRlcmZhY2UgRGVidWd7XG4gIHNlbGVjdDogYm9vbGVhbixcbiAgaW5zZXJ0OiBib29sZWFuLFxuICBjcmVhdGU6IGJvb2xlYW4sXG4gIHF1ZXJ5OiBib29sZWFuLFxufVxuXG5leHBvcnQgbGV0IGRlYnVnOiBEZWJ1ZyA9IHtcbiAgc2VsZWN0OiB0cnVlLFxuICBpbnNlcnQ6IHRydWUsXG4gIGNyZWF0ZTogdHJ1ZSxcbiAgcXVlcnk6IHRydWUsXG59IiwiaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gXCIuLi9hZGFwdGVycy9hZGFwdGVyXCI7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuXG5leHBvcnQgZW51bSBjb2RlRXJyb3Ige1xuICAnRW5naW5lTm90SW1wbGVtZW50ZWQnID0nQHN0b3JhZ28vb3JtL2ZpZWxkL2VuZ2luZU5vdEltcGxlbWVudGVkJyxcbiAgJ0RlZmF1bHRWYWx1ZUlzTm90VmFsaWQnID0gJ0BzdG9yYWdvL29ybS9maWVsZC9kZWZhdWx0UGFyYW1Ob3RWYWxpZCcsXG4gICdJbmNvcnJlY3RWYWx1ZVRvRGInID0gJ0BzdG9yYWdvL29ybS9maWVsZC9JbmNvcnJlY3RWYWx1ZVRvU3RvcmFnZU9uREInLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZyB7XG4gIGRlZmF1bHQ/OiBhbnk7XG4gIHJlcXVpcmVkOiBib29sZWFuO1xuICBsaW5rPzogc3RyaW5nO1xuICBpbmRleDogYm9vbGVhbjtcbiAgcHJpbWFyeTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRDb25maWc6IENvbmZpZyA9IHtcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBpbmRleDogZmFsc2UsXG4gIHByaW1hcnk6IGZhbHNlXG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgYWJzdHJhY3QgY29uZmlnOiBDb25maWc7XG4gIHByb3RlY3RlZCBuYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKXtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICB9XG5cbiAgcHVibGljIGdldE5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xuICB9XG5cbiAgcHVibGljIGdldERlZmF1bHRWYWx1ZSgpOiBhbnkge1xuXG4gICAgbGV0IHZhbHVlRGVmYXVsdCA9IHRoaXMuY29uZmlnLmRlZmF1bHQ7XG5cbiAgICBpZiAodmFsdWVEZWZhdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZURlZmF1bHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiB2YWx1ZURlZmF1bHQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWVEZWZhdWx0O1xuICB9XG5cbiAgcHVibGljIGlzVmlydHVhbCgpOiBib29sZWFuIHtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5saW5rICE9PSB1bmRlZmluZWQgJiYgIXRoaXMuY29uZmlnLmluZGV4KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcG9wdWxhdGUobW9kZWw6IE1vZGVsLCByb3c6IHsgW2luZGV4OiBzdHJpbmddOiBhbnk7IH0pOiBQcm9taXNlPGFueT4ge1xuXG4gICAgbGV0IG5hbWUgPSB0aGlzLmdldE5hbWUoKTtcbiAgICBsZXQgdmFsdWUgPSByb3dbbmFtZV07XG5cbiAgICBpZiAodGhpcy5jb25maWcubGluayAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgIGxldCBsaW5rczogc3RyaW5nW10gPSB0aGlzLmNvbmZpZy5saW5rLnNwbGl0KCcuJyk7XG4gICAgICBsZXQgaXRlbU5hbWUgPSBsaW5rcy5zaGlmdCgpO1xuXG4gICAgICBpZiAoIWl0ZW1OYW1lIHx8IGl0ZW1OYW1lIGluIG1vZGVsLl9fZGF0YSkge1xuICAgICAgICBtb2RlbFtuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YWx1ZSA9IGF3YWl0IG1vZGVsLl9fZGF0YVtpdGVtTmFtZV07XG5cbiAgICAgIHdoaWxlIChpdGVtTmFtZSA9IGxpbmtzLnNoaWZ0KCkpIHtcblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGlmIChpdGVtTmFtZSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZVtpdGVtTmFtZV07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZnJvbURCKHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyB0b0RCKG1vZGVsOiBNb2RlbCk6IGFueSB7XG5cbiAgICBsZXQgbmFtZSA9IHRoaXMuZ2V0TmFtZSgpO1xuICAgIGxldCB2YWx1ZSA9IG1vZGVsW25hbWVdO1xuXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbHVlID0gdGhpcy5nZXREZWZhdWx0VmFsdWUoKTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsdWUgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICBhYnN0cmFjdCBmcm9tREIodmFsdWU6IGFueSk6IGFueTtcbiAgYWJzdHJhY3QgY2FzdERCKGFkYXB0ZXI6IEFkYXB0ZXIpOiBzdHJpbmc7XG59XG4iLCJpbXBvcnQgeyBUZXh0IH0gZnJvbSBcIi4vdGV4dFwiO1xuaW1wb3J0IHsgVVVJRCB9IGZyb20gXCIuL3V1aWRcIjtcbmltcG9ydCB7IEpzb24gfSBmcm9tIFwiLi9qc29uXCI7XG5leHBvcnQgeyBKc29uQ29uZmlnIH0gZnJvbSBcIi4vanNvblwiO1xuXG5leHBvcnQgY29uc3QgZmllbGRzID0ge1xuICBUZXh0OiBUZXh0LFxuICBVVUlEOiBVVUlELFxuICBKc29uOiBKc29uLFxufSIsImltcG9ydCB7IEFkYXB0ZXIsIGVuZ2luZUtpbmQgfSBmcm9tIFwiLi4vYWRhcHRlcnMvYWRhcHRlclwiO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IEZpZWxkLCBDb25maWcsIGRlZmF1bHRDb25maWcsIGNvZGVFcnJvciB9IGZyb20gXCIuL2ZpZWxkXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSnNvbkNvbmZpZyBleHRlbmRzIENvbmZpZyB7XG4gIHR5cGU6ICdsaXN0JyB8ICdvYmplY3QnLFxuICBkZWZhdWx0PzogJ3N0cmluZycgfCBGdW5jdGlvbiB8IE9iamVjdDtcbn1cblxubGV0IGpzb25EZWZhdWx0Q29uZmlnOiBKc29uQ29uZmlnID0ge1xuICAuLi5kZWZhdWx0Q29uZmlnLFxuICB0eXBlOiAnb2JqZWN0Jyxcbn1cblxuZXhwb3J0IGNsYXNzIEpzb24gZXh0ZW5kcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgY29uZmlnOiBKc29uQ29uZmlnO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgY29uZmlnOiBQYXJ0aWFsPEpzb25Db25maWc+ID0ganNvbkRlZmF1bHRDb25maWcpIHtcblxuICAgIHN1cGVyKG5hbWUpO1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLi4uanNvbkRlZmF1bHRDb25maWcsXG4gICAgICAuLi5jb25maWcsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBnZXREZWZhdWx0VmFsdWUoKTogYW55IHtcblxuICAgIGxldCB2YWx1ZURlZmF1bHQgPSBzdXBlci5nZXREZWZhdWx0VmFsdWUoKTtcblxuICAgIGlmICh0eXBlb2YgdmFsdWVEZWZhdWx0ID09PSAnc3RyaW5nJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWVEZWZhdWx0ID0gSlNPTi5wYXJzZSh2YWx1ZURlZmF1bHQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgY29kZTogY29kZUVycm9yLkRlZmF1bHRWYWx1ZUlzTm90VmFsaWQsXG4gICAgICAgICAgbWVzc2FnZTogYERlZmF1bHQgdmFsdWUgb24gSlNPTiBmaWVsZCBpcyBub3QgYSB2YWxpZCBqc29uYFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZURlZmF1bHQ7XG4gIH1cblxuICBwdWJsaWMgZnJvbURCKHZhbHVlOiBhbnkpIHtcblxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSAnJykge1xuICAgICAgbGV0IGtpbmQgPSB0aGlzLmNvbmZpZy50eXBlO1xuICAgICAgaWYgKGtpbmQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY2FzdERCKGFkYXB0ZXI6IEFkYXB0ZXIpOiBzdHJpbmcge1xuXG4gICAgaWYgKGFkYXB0ZXIuZW5naW5lID09IGVuZ2luZUtpbmQuV2ViU1FMKSB7XG4gICAgICByZXR1cm4gJ1RFWFQnO1xuICAgIH1cblxuICAgIHRocm93IHtcbiAgICAgIGNvZGU6IGNvZGVFcnJvci5FbmdpbmVOb3RJbXBsZW1lbnRlZCxcbiAgICAgIG1lc3NhZ2U6IGBFbmdpbmUgJHsgYWRhcHRlci5lbmdpbmUgfSBub3QgaW1wbGVtZW50ZWQgb24gRmllbGQgSnNvbmBcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHRvREIobW9kZWw6IE1vZGVsKSA6IHN0cmluZ3xudWxsIHtcblxuICAgIGxldCB2YWx1ZSA9IHN1cGVyLnRvREIobW9kZWwpO1xuXG4gICAgaWYodmFsdWUgPT09IG51bGwpe1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RyaW5naWZ5VG9EYih2YWx1ZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RyaW5naWZ5VG9EYih2YWx1ZTogYW55KTogc3RyaW5nIHtcblxuICAgIGxldCBraW5kID0gdGhpcy5jb25maWcudHlwZTtcbiAgICBsZXQgZXJyb3IgPSB7XG4gICAgICBjb2RlOiBjb2RlRXJyb3IuSW5jb3JyZWN0VmFsdWVUb0RiLFxuICAgICAgbWVzc2FnZTogYHZhbHVlIGlzIG5vdCBhIHZhbGlkIGpzb25gLFxuICAgIH07XG5cbiAgICAvKiBUZXN0IGlmIHZhbHVlIGlzIHZhbGlkICovXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIEpTT04ucGFyc2UodmFsdWUpOyAvL2p1c3QgdGVzdFxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICBpZiAoa2luZCAhPT0gJ2xpc3QnKSB7XG4gICAgICAgICAgICBlcnJvci5tZXNzYWdlID0gJ0pTT04gaXMgYSBvYmplY3QsIGJ1dCBtdXN0IGJlIGEgbGlzdCc7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGtpbmQgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBlcnJvci5tZXNzYWdlID0gJ0pTT04gaXMgYSBsaXN0LCBidXQgbXVzdCBiZSBhIG9iamVjdCc7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogY29udmVydCB0byBzdHJpbmcgKi9cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufSIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBBZGFwdGVyLCBlbmdpbmVLaW5kIH0gZnJvbSBcIi4uL2FkYXB0ZXJzL2FkYXB0ZXJcIjtcbmltcG9ydCB7IEZpZWxkLCBDb25maWcsIGRlZmF1bHRDb25maWcsIGNvZGVFcnJvciB9IGZyb20gXCIuL2ZpZWxkXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGV4dENvbmZpZyBleHRlbmRzIENvbmZpZyB7IH1cblxuZXhwb3J0IGNsYXNzIFRleHQgZXh0ZW5kcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgY29uZmlnOiBUZXh0Q29uZmlnO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgY29uZmlnOiBQYXJ0aWFsPFRleHRDb25maWc+ID0gZGVmYXVsdENvbmZpZykge1xuXG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmcm9tREIodmFsdWU6IGFueSk6IGFueSB7XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmICgndG9TdHJpbmcnIGluIHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIHRvREIobW9kZWw6IE1vZGVsKTogYW55IHtcblxuICAgIGxldCBuYW1lID0gdGhpcy5nZXROYW1lKCk7XG4gICAgbGV0IHZhbHVlID0gbW9kZWxbbmFtZV07XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlLnRyaW0oKTtcbiAgICB9XG5cbiAgICBpZiAoJ3RvU3RyaW5nJyBpbiB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwdWJsaWMgY2FzdERCKGFkYXB0ZXI6IEFkYXB0ZXIpOiBzdHJpbmcge1xuXG4gICAgaWYgKGFkYXB0ZXIuZW5naW5lID09IGVuZ2luZUtpbmQuV2ViU1FMKSB7XG4gICAgICByZXR1cm4gJ1RFWFQnO1xuICAgIH1cblxuICAgIHRocm93IHtcbiAgICAgIGNvZGU6IGNvZGVFcnJvci5FbmdpbmVOb3RJbXBsZW1lbnRlZCxcbiAgICAgIG1lc3NhZ2U6IGBFbmdpbmUgJHsgYWRhcHRlci5lbmdpbmUgfSBub3QgaW1wbGVtZW50ZWQgb24gZmllbGQgVGV4dGBcbiAgICB9O1xuICB9XG59IiwiaW1wb3J0IHsgQWRhcHRlciwgZW5naW5lS2luZCB9IGZyb20gXCIuLi9hZGFwdGVycy9hZGFwdGVyXCI7XG5pbXBvcnQgeyBGaWVsZCwgQ29uZmlnLCBkZWZhdWx0Q29uZmlnLCBjb2RlRXJyb3IgfSBmcm9tIFwiLi9maWVsZFwiO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcblxuZXhwb3J0IGNsYXNzIFVVSUQgZXh0ZW5kcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgY29uZmlnOiBDb25maWc7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjb25maWc6IFBhcnRpYWw8Q29uZmlnPiA9IGRlZmF1bHRDb25maWcpe1xuXG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgY2FzdERCKGFkYXB0ZXI6IEFkYXB0ZXIpOiBzdHJpbmcge1xuXG4gICAgaWYoYWRhcHRlci5lbmdpbmUgPT0gZW5naW5lS2luZC5XZWJTUUwpe1xuICAgICAgcmV0dXJuICdURVhUJztcbiAgICB9XG5cbiAgICB0aHJvdyB7Y29kZTogY29kZUVycm9yLkVuZ2luZU5vdEltcGxlbWVudGVkLCBcbiAgICAgIG1lc3NhZ2U6IGBFbmdpbmUgJHthZGFwdGVyLmVuZ2luZX0gbm90IGltcGxlbWVudGVkIG9uIEZpZWxkIFVVSURgfTtcbiAgfVxuXG4gIHB1YmxpYyBmcm9tREIodmFsdWU6IGFueSkge1xuICAgIFxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXREZWZhdWx0VmFsdWUoKSA6IGFueSB7XG4gICAgXG4gICAgbGV0IHZhbHVlID0gc3VwZXIuZ2V0RGVmYXVsdFZhbHVlKCk7XG5cbiAgICBpZih2YWx1ZSA9PT0gdW5kZWZpbmVkICYmIHRoaXMuY29uZmlnLnByaW1hcnkpe1xuICAgICAgdmFsdWUgPSB1dWlkKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHRvREIobW9kZWw6IE1vZGVsKSA6IGFueSB7XG5cbiAgICBsZXQgdmFsdWUgPSBzdXBlci50b0RCKG1vZGVsKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn0iLCJpbXBvcnQgeyBBZGFwdGVyIH0gZnJvbSBcIi4vYWRhcHRlcnMvYWRhcHRlclwiO1xuXG50eXBlIHRhc2tDYWxsYmFjayA9IHsgKHRyYW5zYWN0aW9uOiBTUUxUcmFuc2FjdGlvbik6IFByb21pc2U8dm9pZD4gfTtcblxuaW50ZXJmYWNlIHRhc2tWZXJzaW9uIHtcbiAgW3ZlcnNpb246IG51bWJlcl06IHRhc2tDYWxsYmFjaztcbn07XG5cbmV4cG9ydCBjbGFzcyBNaWdyYXRpb24ge1xuXG4gIHByb3RlY3RlZCBhZGFwdGVyOiBBZGFwdGVyO1xuICBwcml2YXRlIHRhc2tzOiB0YXNrVmVyc2lvbiA9IHt9O1xuICBwcml2YXRlIGZpcnN0QWNjZXNzPzogdGFza0NhbGxiYWNrO1xuXG4gIGNvbnN0cnVjdG9yKGFkYXB0ZXI6IEFkYXB0ZXIpIHtcbiAgICB0aGlzLmFkYXB0ZXIgPSBhZGFwdGVyO1xuICB9XG5cbiAgcHJvdGVjdGVkIG1ha2UoKTogdm9pZCB7IH1cblxuICBwdWJsaWMgYXN5bmMgcnVuKCk6IFByb21pc2U8dm9pZD4ge1xuXG4gICAgdGhpcy5tYWtlKCk7XG5cbiAgICBpZiAodGhpcy5maXJzdEFjY2VzcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyB7IGNvZGU6IG51bGwsIG1lc3NhZ2U6IGBGaXJzdEFjY2VzcyBNaWdyYXRpb24gbm90IGltcGxlbWVudGVkIWAgfTtcbiAgICB9XG5cbiAgICBsZXQgdmVyc2lvbiA9IHRoaXMuYWRhcHRlci5nZXRWZXJzaW9uKCk7XG4gICAgaWYgKHZlcnNpb24gPT09ICcnKSB7XG4gICAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmNoYW5nZVZlcnNpb24oMCwgdGhpcy5maXJzdEFjY2Vzcyk7XG4gICAgfVxuXG4gICAgd2hpbGUgKHRydWUpIHtcblxuICAgICAgdmVyc2lvbisrO1xuICAgICAgbGV0IHRhc2sgPSB0aGlzLnRhc2tzW3ZlcnNpb25dO1xuICAgICAgaWYgKHRhc2sgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgYXdhaXQgdGhpcy5hZGFwdGVyLmNoYW5nZVZlcnNpb24odmVyc2lvbiwgdGFzayk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlZ2lzdGVyRmlyc3RBY2Nlc3MoY2FsbGJhY2s6IHRhc2tDYWxsYmFjayk6IHZvaWQge1xuXG4gICAgaWYgKHRoaXMuZmlyc3RBY2Nlc3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgeyBjb2RlOiB1bmRlZmluZWQsIG1lc3NhZ2U6IGBmaXJzdEFjY2VzcyBjYWxsYmFjayBhbHJlZHkgcmVnaXN0cmVkYCB9O1xuICAgIH1cblxuICAgIHRoaXMuZmlyc3RBY2Nlc3MgPSBjYWxsYmFjaztcbiAgfVxuXG4gIHByb3RlY3RlZCByZWdpc3Rlcih2ZXJzaW9uOiBudW1iZXIsIGNhbGxiYWNrOiB0YXNrQ2FsbGJhY2spOiB2b2lkIHtcblxuICAgIGlmICh0aGlzLnRhc2tzW3ZlcnNpb25dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IHsgY29kZTogdW5kZWZpbmVkLCBtZXNzYWdlOiBgY2FsbGJhY2sgdmVyc2lvbiAkeyB2ZXJzaW9uIH0gYWxyZWR5IHJlZ2lzdHJlZGAgfTtcbiAgICB9XG5cbiAgICB0aGlzLnRhc2tzW3ZlcnNpb25dID0gY2FsbGJhY2s7XG4gIH1cbn0iLCJpbXBvcnQgeyBTY2hlbWEgfSBmcm9tICcuL3NjaGVtYSc7XG5pbXBvcnQgeyBTZWxlY3QgfSBmcm9tICcuL2FkYXB0ZXJzL3NlbGVjdCc7XG5pbXBvcnQgeyBwYXJhbXNUeXBlIH0gZnJvbSAnLi9hZGFwdGVycy9xdWVyeSc7XG5pbXBvcnQgeyBDcmVhdGUgfSBmcm9tICcuL2FkYXB0ZXJzL2NyZWF0ZSc7XG5cbmludGVyZmFjZSBQb3B1bGF0ZSB7XG4gIFtuYW1lOiBzdHJpbmddOiBQcm9taXNlPGFueT47XG59XG5cbmV4cG9ydCBjbGFzcyBNb2RlbCB7XG5cbiAgcHVibGljIHN0YXRpYyBzY2hlbWE6IFNjaGVtYTtcbiAgcHVibGljIF9fZGF0YTogUG9wdWxhdGUgPSB7fTtcblxuICBbcHJvcDogc3RyaW5nXTogYW55O1xuXG4gIHB1YmxpYyBhc3luYyBzYXZlKCk6IFByb21pc2U8YW55PiB7XG5cbiAgICBsZXQgc2NoZW1hOiBTY2hlbWEgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3Iuc2NoZW1hO1xuXG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuX19kYXRhKS5sZW5ndGggPT09IDApIHtcbiAgICAgIGxldCBpbnNlcnQgPSBzY2hlbWEuaW5zZXJ0KCk7XG4gICAgICBpbnNlcnQuYWRkKHRoaXMpO1xuICAgICAgcmV0dXJuIGluc2VydC5zYXZlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgxKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZmluZCh3aGVyZTogc3RyaW5nLCBwYXJhbTogcGFyYW1zVHlwZSk6IFByb21pc2U8TW9kZWx8dW5kZWZpbmVkPiB7XG5cbiAgICBsZXQgc2VsZWN0OiBTZWxlY3QgPSB0aGlzLnNlbGVjdCgpO1xuICAgIHNlbGVjdC53aGVyZSh3aGVyZSwgcGFyYW0pO1xuICAgIHJldHVybiBzZWxlY3Qub25lKCk7XG4gIH07XG5cbiAgcHVibGljIHN0YXRpYyBzZWxlY3QoKTogU2VsZWN0IHtcblxuICAgIHJldHVybiB0aGlzLnNjaGVtYS5zZWxlY3QoKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgY3JlYXRlKCk6IENyZWF0ZSB7XG5cbiAgICByZXR1cm4gdGhpcy5zY2hlbWEuY3JlYXRlKCk7XG4gIH1cblxufVxuIiwiaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gXCIuL2FkYXB0ZXJzL2FkYXB0ZXJcIjtcbmltcG9ydCB7IFNlbGVjdCB9IGZyb20gXCIuL2FkYXB0ZXJzL3NlbGVjdFwiO1xuaW1wb3J0IHsgSW5zZXJ0IH0gZnJvbSBcIi4vYWRhcHRlcnMvaW5zZXJ0XCI7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuL21vZGVsXCI7XG5pbXBvcnQgeyBGaWVsZCB9IGZyb20gXCIuL2ZpZWxkL2ZpZWxkXCI7XG5pbXBvcnQgeyBzZXNzaW9uIH0gZnJvbSAnLi9zZXNzaW9uJztcbmltcG9ydCB7IENyZWF0ZSB9IGZyb20gXCIuL2FkYXB0ZXJzL2NyZWF0ZVwiO1xuXG5leHBvcnQgY2xhc3MgU2NoZW1hIHtcblxuICBwcml2YXRlIG5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSBmaWVsZHM6IEZpZWxkW107XG4gIHByaXZhdGUgYWRhcHRlcjogQWRhcHRlcjtcbiAgcHJvdGVjdGVkIE1vZGVsOiB0eXBlb2YgTW9kZWw7XG5cbiAgY29uc3RydWN0b3IobW9kZWw6IHR5cGVvZiBNb2RlbCwgbmFtZTogc3RyaW5nLCBmaWVsZHM6IEZpZWxkW10sIGFkYXB0ZXI6IEFkYXB0ZXIgPSBzZXNzaW9uLmFkYXB0ZXIpIHtcblxuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5maWVsZHMgPSBmaWVsZHM7XG4gICAgdGhpcy5hZGFwdGVyID0gYWRhcHRlcjtcbiAgICB0aGlzLk1vZGVsID0gbW9kZWw7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlKCk6IENyZWF0ZSB7XG5cbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmNyZWF0ZSh0aGlzLk1vZGVsKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXROYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRGaWVsZHMoKTogRmllbGRbXSB7XG4gICAgcmV0dXJuIHRoaXMuZmllbGRzO1xuICB9XG5cbiAgcHVibGljIGdldFJlYWxGaWVsZHMoKTogRmllbGRbXSB7XG5cbiAgICBsZXQgZmllbGRGaWx0cmVkOiBGaWVsZFtdID0gW107XG4gICAgZm9yIChsZXQgZmllbGQgb2YgdGhpcy5maWVsZHMpIHtcblxuICAgICAgaWYgKCFmaWVsZC5pc1ZpcnR1YWwoKSkge1xuICAgICAgICBmaWVsZEZpbHRyZWQucHVzaChmaWVsZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpZWxkRmlsdHJlZDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDb2x1bW5zKCk6IHN0cmluZ1tdIHtcblxuICAgIGxldCBjb2x1bW5zOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAobGV0IGZpZWxkIG9mIHRoaXMuZmllbGRzKSB7XG5cbiAgICAgIGlmICghZmllbGQuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgY29sdW1ucy5wdXNoKGZpZWxkLmdldE5hbWUoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbHVtbnM7XG4gIH1cblxuICBwdWJsaWMgZ2V0QWRhcHRlcigpOiBBZGFwdGVyIHtcbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyO1xuICB9XG5cbiAgcHVibGljIHNlbGVjdCgpOiBTZWxlY3Qge1xuICAgIGxldCBzZWxlY3Q6IFNlbGVjdCA9IHRoaXMuYWRhcHRlci5zZWxlY3QodGhpcy5Nb2RlbCk7XG4gICAgc2VsZWN0LmZyb20odGhpcy5nZXROYW1lKCksIHRoaXMuZ2V0Q29sdW1ucygpKTtcbiAgICByZXR1cm4gc2VsZWN0O1xuICB9XG5cbiAgcHVibGljIGluc2VydCgpOiBJbnNlcnQge1xuXG4gICAgbGV0IGluc2VydDogSW5zZXJ0ID0gdGhpcy5hZGFwdGVyLmluc2VydCh0aGlzLk1vZGVsKTtcbiAgICByZXR1cm4gaW5zZXJ0O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHBvcHVsYXRlRnJvbURCKHJvdzogeyBbaW5kZXg6IHN0cmluZ106IGFueTsgfSwgbW9kZWw6IE1vZGVsID0gbmV3IHRoaXMuTW9kZWwoKSk6IFByb21pc2U8TW9kZWw+IHtcblxuICAgIGxldCBwcm9taXNlczogUHJvbWlzZTxhbnk+W10gPSBbXTtcbiAgICBsZXQgZmllbGRzID0gdGhpcy5nZXRGaWVsZHMoKTtcbiAgICBsZXQga2V5czogc3RyaW5nW10gPSBbXTtcbiAgXG4gICAgZm9yIChsZXQgZmllbGQgb2YgZmllbGRzKSB7XG4gICAgICBsZXQgbmFtZSA9IGZpZWxkLmdldE5hbWUoKTtcbiAgICAgIGxldCBwcm9taXNlUG9wdWxhdGUgPSBmaWVsZC5wb3B1bGF0ZShtb2RlbCwgcm93KTtcbiAgICAgIG1vZGVsLl9fZGF0YVtuYW1lXSA9IHByb21pc2VQb3B1bGF0ZTtcbiAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZVBvcHVsYXRlKTtcbiAgICAgIGtleXMucHVzaChuYW1lKTtcbiAgICB9XG5cbiAgICBsZXQgZGF0YSA9IGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICBmb3IobGV0IGsgaW4ga2V5cyl7XG4gICAgICBsZXQgbmFtZSA9IGtleXNba107XG4gICAgICBtb2RlbFtuYW1lXSA9IGRhdGFba107XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZGVsO1xuICB9XG59IiwiaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gJy4vYWRhcHRlcnMvYWRhcHRlcic7XG5pbXBvcnQgeyBXZWJTUUxBZGFwdGVyIH0gZnJvbSAnLi9hZGFwdGVycy93ZWJzcWwvYWRhcHRlcic7XG5cbmludGVyZmFjZSBEZWZhdWx0cyB7XG4gIGFkYXB0ZXI6IEFkYXB0ZXI7XG59XG5cbmV4cG9ydCBjb25zdCBzZXNzaW9uOiBEZWZhdWx0cyA9IHtcbiAgYWRhcHRlcjogbmV3IFdlYlNRTEFkYXB0ZXIoJ2RlZmF1bHQnLCAnZGVmYXVsdCBkYicsIDEwMjQqKjIpLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldERlZmF1bHRBZGFwdGVyKGFkYXB0ZXI6IEFkYXB0ZXIpe1xuICBzZXNzaW9uLmFkYXB0ZXIgPSBhZGFwdGVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdEFkYXB0ZXIoKSA6IEFkYXB0ZXIge1xuICByZXR1cm4gc2Vzc2lvbi5hZGFwdGVyO1xufVxuIiwiZXhwb3J0IHsgZGVmYXVsdCBhcyB2MSB9IGZyb20gJy4vdjEuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2MyB9IGZyb20gJy4vdjMuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2NCB9IGZyb20gJy4vdjQuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2NSB9IGZyb20gJy4vdjUuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBOSUwgfSBmcm9tICcuL25pbC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHZlcnNpb24gfSBmcm9tICcuL3ZlcnNpb24uanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2YWxpZGF0ZSB9IGZyb20gJy4vdmFsaWRhdGUuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzdHJpbmdpZnkgfSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHBhcnNlIH0gZnJvbSAnLi9wYXJzZS5qcyc7IiwiLypcbiAqIEJyb3dzZXItY29tcGF0aWJsZSBKYXZhU2NyaXB0IE1ENVxuICpcbiAqIE1vZGlmaWNhdGlvbiBvZiBKYXZhU2NyaXB0IE1ENVxuICogaHR0cHM6Ly9naXRodWIuY29tL2JsdWVpbXAvSmF2YVNjcmlwdC1NRDVcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMSwgU2ViYXN0aWFuIFRzY2hhblxuICogaHR0cHM6Ly9ibHVlaW1wLm5ldFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcbiAqIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKlxuICogQmFzZWQgb25cbiAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgUlNBIERhdGEgU2VjdXJpdHksIEluYy4gTUQ1IE1lc3NhZ2VcbiAqIERpZ2VzdCBBbGdvcml0aG0sIGFzIGRlZmluZWQgaW4gUkZDIDEzMjEuXG4gKiBWZXJzaW9uIDIuMiBDb3B5cmlnaHQgKEMpIFBhdWwgSm9obnN0b24gMTk5OSAtIDIwMDlcbiAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSBCU0QgTGljZW5zZVxuICogU2VlIGh0dHA6Ly9wYWpob21lLm9yZy51ay9jcnlwdC9tZDUgZm9yIG1vcmUgaW5mby5cbiAqL1xuZnVuY3Rpb24gbWQ1KGJ5dGVzKSB7XG4gIGlmICh0eXBlb2YgYnl0ZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIG1zZyA9IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChieXRlcykpOyAvLyBVVEY4IGVzY2FwZVxuXG4gICAgYnl0ZXMgPSBuZXcgVWludDhBcnJheShtc2cubGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXNnLmxlbmd0aDsgKytpKSB7XG4gICAgICBieXRlc1tpXSA9IG1zZy5jaGFyQ29kZUF0KGkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtZDVUb0hleEVuY29kZWRBcnJheSh3b3Jkc1RvTWQ1KGJ5dGVzVG9Xb3JkcyhieXRlcyksIGJ5dGVzLmxlbmd0aCAqIDgpKTtcbn1cbi8qXG4gKiBDb252ZXJ0IGFuIGFycmF5IG9mIGxpdHRsZS1lbmRpYW4gd29yZHMgdG8gYW4gYXJyYXkgb2YgYnl0ZXNcbiAqL1xuXG5cbmZ1bmN0aW9uIG1kNVRvSGV4RW5jb2RlZEFycmF5KGlucHV0KSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgdmFyIGxlbmd0aDMyID0gaW5wdXQubGVuZ3RoICogMzI7XG4gIHZhciBoZXhUYWIgPSAnMDEyMzQ1Njc4OWFiY2RlZic7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGgzMjsgaSArPSA4KSB7XG4gICAgdmFyIHggPSBpbnB1dFtpID4+IDVdID4+PiBpICUgMzIgJiAweGZmO1xuICAgIHZhciBoZXggPSBwYXJzZUludChoZXhUYWIuY2hhckF0KHggPj4+IDQgJiAweDBmKSArIGhleFRhYi5jaGFyQXQoeCAmIDB4MGYpLCAxNik7XG4gICAgb3V0cHV0LnB1c2goaGV4KTtcbiAgfVxuXG4gIHJldHVybiBvdXRwdXQ7XG59XG4vKipcbiAqIENhbGN1bGF0ZSBvdXRwdXQgbGVuZ3RoIHdpdGggcGFkZGluZyBhbmQgYml0IGxlbmd0aFxuICovXG5cblxuZnVuY3Rpb24gZ2V0T3V0cHV0TGVuZ3RoKGlucHV0TGVuZ3RoOCkge1xuICByZXR1cm4gKGlucHV0TGVuZ3RoOCArIDY0ID4+PiA5IDw8IDQpICsgMTQgKyAxO1xufVxuLypcbiAqIENhbGN1bGF0ZSB0aGUgTUQ1IG9mIGFuIGFycmF5IG9mIGxpdHRsZS1lbmRpYW4gd29yZHMsIGFuZCBhIGJpdCBsZW5ndGguXG4gKi9cblxuXG5mdW5jdGlvbiB3b3Jkc1RvTWQ1KHgsIGxlbikge1xuICAvKiBhcHBlbmQgcGFkZGluZyAqL1xuICB4W2xlbiA+PiA1XSB8PSAweDgwIDw8IGxlbiAlIDMyO1xuICB4W2dldE91dHB1dExlbmd0aChsZW4pIC0gMV0gPSBsZW47XG4gIHZhciBhID0gMTczMjU4NDE5MztcbiAgdmFyIGIgPSAtMjcxNzMzODc5O1xuICB2YXIgYyA9IC0xNzMyNTg0MTk0O1xuICB2YXIgZCA9IDI3MTczMzg3ODtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpICs9IDE2KSB7XG4gICAgdmFyIG9sZGEgPSBhO1xuICAgIHZhciBvbGRiID0gYjtcbiAgICB2YXIgb2xkYyA9IGM7XG4gICAgdmFyIG9sZGQgPSBkO1xuICAgIGEgPSBtZDVmZihhLCBiLCBjLCBkLCB4W2ldLCA3LCAtNjgwODc2OTM2KTtcbiAgICBkID0gbWQ1ZmYoZCwgYSwgYiwgYywgeFtpICsgMV0sIDEyLCAtMzg5NTY0NTg2KTtcbiAgICBjID0gbWQ1ZmYoYywgZCwgYSwgYiwgeFtpICsgMl0sIDE3LCA2MDYxMDU4MTkpO1xuICAgIGIgPSBtZDVmZihiLCBjLCBkLCBhLCB4W2kgKyAzXSwgMjIsIC0xMDQ0NTI1MzMwKTtcbiAgICBhID0gbWQ1ZmYoYSwgYiwgYywgZCwgeFtpICsgNF0sIDcsIC0xNzY0MTg4OTcpO1xuICAgIGQgPSBtZDVmZihkLCBhLCBiLCBjLCB4W2kgKyA1XSwgMTIsIDEyMDAwODA0MjYpO1xuICAgIGMgPSBtZDVmZihjLCBkLCBhLCBiLCB4W2kgKyA2XSwgMTcsIC0xNDczMjMxMzQxKTtcbiAgICBiID0gbWQ1ZmYoYiwgYywgZCwgYSwgeFtpICsgN10sIDIyLCAtNDU3MDU5ODMpO1xuICAgIGEgPSBtZDVmZihhLCBiLCBjLCBkLCB4W2kgKyA4XSwgNywgMTc3MDAzNTQxNik7XG4gICAgZCA9IG1kNWZmKGQsIGEsIGIsIGMsIHhbaSArIDldLCAxMiwgLTE5NTg0MTQ0MTcpO1xuICAgIGMgPSBtZDVmZihjLCBkLCBhLCBiLCB4W2kgKyAxMF0sIDE3LCAtNDIwNjMpO1xuICAgIGIgPSBtZDVmZihiLCBjLCBkLCBhLCB4W2kgKyAxMV0sIDIyLCAtMTk5MDQwNDE2Mik7XG4gICAgYSA9IG1kNWZmKGEsIGIsIGMsIGQsIHhbaSArIDEyXSwgNywgMTgwNDYwMzY4Mik7XG4gICAgZCA9IG1kNWZmKGQsIGEsIGIsIGMsIHhbaSArIDEzXSwgMTIsIC00MDM0MTEwMSk7XG4gICAgYyA9IG1kNWZmKGMsIGQsIGEsIGIsIHhbaSArIDE0XSwgMTcsIC0xNTAyMDAyMjkwKTtcbiAgICBiID0gbWQ1ZmYoYiwgYywgZCwgYSwgeFtpICsgMTVdLCAyMiwgMTIzNjUzNTMyOSk7XG4gICAgYSA9IG1kNWdnKGEsIGIsIGMsIGQsIHhbaSArIDFdLCA1LCAtMTY1Nzk2NTEwKTtcbiAgICBkID0gbWQ1Z2coZCwgYSwgYiwgYywgeFtpICsgNl0sIDksIC0xMDY5NTAxNjMyKTtcbiAgICBjID0gbWQ1Z2coYywgZCwgYSwgYiwgeFtpICsgMTFdLCAxNCwgNjQzNzE3NzEzKTtcbiAgICBiID0gbWQ1Z2coYiwgYywgZCwgYSwgeFtpXSwgMjAsIC0zNzM4OTczMDIpO1xuICAgIGEgPSBtZDVnZyhhLCBiLCBjLCBkLCB4W2kgKyA1XSwgNSwgLTcwMTU1ODY5MSk7XG4gICAgZCA9IG1kNWdnKGQsIGEsIGIsIGMsIHhbaSArIDEwXSwgOSwgMzgwMTYwODMpO1xuICAgIGMgPSBtZDVnZyhjLCBkLCBhLCBiLCB4W2kgKyAxNV0sIDE0LCAtNjYwNDc4MzM1KTtcbiAgICBiID0gbWQ1Z2coYiwgYywgZCwgYSwgeFtpICsgNF0sIDIwLCAtNDA1NTM3ODQ4KTtcbiAgICBhID0gbWQ1Z2coYSwgYiwgYywgZCwgeFtpICsgOV0sIDUsIDU2ODQ0NjQzOCk7XG4gICAgZCA9IG1kNWdnKGQsIGEsIGIsIGMsIHhbaSArIDE0XSwgOSwgLTEwMTk4MDM2OTApO1xuICAgIGMgPSBtZDVnZyhjLCBkLCBhLCBiLCB4W2kgKyAzXSwgMTQsIC0xODczNjM5NjEpO1xuICAgIGIgPSBtZDVnZyhiLCBjLCBkLCBhLCB4W2kgKyA4XSwgMjAsIDExNjM1MzE1MDEpO1xuICAgIGEgPSBtZDVnZyhhLCBiLCBjLCBkLCB4W2kgKyAxM10sIDUsIC0xNDQ0NjgxNDY3KTtcbiAgICBkID0gbWQ1Z2coZCwgYSwgYiwgYywgeFtpICsgMl0sIDksIC01MTQwMzc4NCk7XG4gICAgYyA9IG1kNWdnKGMsIGQsIGEsIGIsIHhbaSArIDddLCAxNCwgMTczNTMyODQ3Myk7XG4gICAgYiA9IG1kNWdnKGIsIGMsIGQsIGEsIHhbaSArIDEyXSwgMjAsIC0xOTI2NjA3NzM0KTtcbiAgICBhID0gbWQ1aGgoYSwgYiwgYywgZCwgeFtpICsgNV0sIDQsIC0zNzg1NTgpO1xuICAgIGQgPSBtZDVoaChkLCBhLCBiLCBjLCB4W2kgKyA4XSwgMTEsIC0yMDIyNTc0NDYzKTtcbiAgICBjID0gbWQ1aGgoYywgZCwgYSwgYiwgeFtpICsgMTFdLCAxNiwgMTgzOTAzMDU2Mik7XG4gICAgYiA9IG1kNWhoKGIsIGMsIGQsIGEsIHhbaSArIDE0XSwgMjMsIC0zNTMwOTU1Nik7XG4gICAgYSA9IG1kNWhoKGEsIGIsIGMsIGQsIHhbaSArIDFdLCA0LCAtMTUzMDk5MjA2MCk7XG4gICAgZCA9IG1kNWhoKGQsIGEsIGIsIGMsIHhbaSArIDRdLCAxMSwgMTI3Mjg5MzM1Myk7XG4gICAgYyA9IG1kNWhoKGMsIGQsIGEsIGIsIHhbaSArIDddLCAxNiwgLTE1NTQ5NzYzMik7XG4gICAgYiA9IG1kNWhoKGIsIGMsIGQsIGEsIHhbaSArIDEwXSwgMjMsIC0xMDk0NzMwNjQwKTtcbiAgICBhID0gbWQ1aGgoYSwgYiwgYywgZCwgeFtpICsgMTNdLCA0LCA2ODEyNzkxNzQpO1xuICAgIGQgPSBtZDVoaChkLCBhLCBiLCBjLCB4W2ldLCAxMSwgLTM1ODUzNzIyMik7XG4gICAgYyA9IG1kNWhoKGMsIGQsIGEsIGIsIHhbaSArIDNdLCAxNiwgLTcyMjUyMTk3OSk7XG4gICAgYiA9IG1kNWhoKGIsIGMsIGQsIGEsIHhbaSArIDZdLCAyMywgNzYwMjkxODkpO1xuICAgIGEgPSBtZDVoaChhLCBiLCBjLCBkLCB4W2kgKyA5XSwgNCwgLTY0MDM2NDQ4Nyk7XG4gICAgZCA9IG1kNWhoKGQsIGEsIGIsIGMsIHhbaSArIDEyXSwgMTEsIC00MjE4MTU4MzUpO1xuICAgIGMgPSBtZDVoaChjLCBkLCBhLCBiLCB4W2kgKyAxNV0sIDE2LCA1MzA3NDI1MjApO1xuICAgIGIgPSBtZDVoaChiLCBjLCBkLCBhLCB4W2kgKyAyXSwgMjMsIC05OTUzMzg2NTEpO1xuICAgIGEgPSBtZDVpaShhLCBiLCBjLCBkLCB4W2ldLCA2LCAtMTk4NjMwODQ0KTtcbiAgICBkID0gbWQ1aWkoZCwgYSwgYiwgYywgeFtpICsgN10sIDEwLCAxMTI2ODkxNDE1KTtcbiAgICBjID0gbWQ1aWkoYywgZCwgYSwgYiwgeFtpICsgMTRdLCAxNSwgLTE0MTYzNTQ5MDUpO1xuICAgIGIgPSBtZDVpaShiLCBjLCBkLCBhLCB4W2kgKyA1XSwgMjEsIC01NzQzNDA1NSk7XG4gICAgYSA9IG1kNWlpKGEsIGIsIGMsIGQsIHhbaSArIDEyXSwgNiwgMTcwMDQ4NTU3MSk7XG4gICAgZCA9IG1kNWlpKGQsIGEsIGIsIGMsIHhbaSArIDNdLCAxMCwgLTE4OTQ5ODY2MDYpO1xuICAgIGMgPSBtZDVpaShjLCBkLCBhLCBiLCB4W2kgKyAxMF0sIDE1LCAtMTA1MTUyMyk7XG4gICAgYiA9IG1kNWlpKGIsIGMsIGQsIGEsIHhbaSArIDFdLCAyMSwgLTIwNTQ5MjI3OTkpO1xuICAgIGEgPSBtZDVpaShhLCBiLCBjLCBkLCB4W2kgKyA4XSwgNiwgMTg3MzMxMzM1OSk7XG4gICAgZCA9IG1kNWlpKGQsIGEsIGIsIGMsIHhbaSArIDE1XSwgMTAsIC0zMDYxMTc0NCk7XG4gICAgYyA9IG1kNWlpKGMsIGQsIGEsIGIsIHhbaSArIDZdLCAxNSwgLTE1NjAxOTgzODApO1xuICAgIGIgPSBtZDVpaShiLCBjLCBkLCBhLCB4W2kgKyAxM10sIDIxLCAxMzA5MTUxNjQ5KTtcbiAgICBhID0gbWQ1aWkoYSwgYiwgYywgZCwgeFtpICsgNF0sIDYsIC0xNDU1MjMwNzApO1xuICAgIGQgPSBtZDVpaShkLCBhLCBiLCBjLCB4W2kgKyAxMV0sIDEwLCAtMTEyMDIxMDM3OSk7XG4gICAgYyA9IG1kNWlpKGMsIGQsIGEsIGIsIHhbaSArIDJdLCAxNSwgNzE4Nzg3MjU5KTtcbiAgICBiID0gbWQ1aWkoYiwgYywgZCwgYSwgeFtpICsgOV0sIDIxLCAtMzQzNDg1NTUxKTtcbiAgICBhID0gc2FmZUFkZChhLCBvbGRhKTtcbiAgICBiID0gc2FmZUFkZChiLCBvbGRiKTtcbiAgICBjID0gc2FmZUFkZChjLCBvbGRjKTtcbiAgICBkID0gc2FmZUFkZChkLCBvbGRkKTtcbiAgfVxuXG4gIHJldHVybiBbYSwgYiwgYywgZF07XG59XG4vKlxuICogQ29udmVydCBhbiBhcnJheSBieXRlcyB0byBhbiBhcnJheSBvZiBsaXR0bGUtZW5kaWFuIHdvcmRzXG4gKiBDaGFyYWN0ZXJzID4yNTUgaGF2ZSB0aGVpciBoaWdoLWJ5dGUgc2lsZW50bHkgaWdub3JlZC5cbiAqL1xuXG5cbmZ1bmN0aW9uIGJ5dGVzVG9Xb3JkcyhpbnB1dCkge1xuICBpZiAoaW5wdXQubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgdmFyIGxlbmd0aDggPSBpbnB1dC5sZW5ndGggKiA4O1xuICB2YXIgb3V0cHV0ID0gbmV3IFVpbnQzMkFycmF5KGdldE91dHB1dExlbmd0aChsZW5ndGg4KSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg4OyBpICs9IDgpIHtcbiAgICBvdXRwdXRbaSA+PiA1XSB8PSAoaW5wdXRbaSAvIDhdICYgMHhmZikgPDwgaSAlIDMyO1xuICB9XG5cbiAgcmV0dXJuIG91dHB1dDtcbn1cbi8qXG4gKiBBZGQgaW50ZWdlcnMsIHdyYXBwaW5nIGF0IDJeMzIuIFRoaXMgdXNlcyAxNi1iaXQgb3BlcmF0aW9ucyBpbnRlcm5hbGx5XG4gKiB0byB3b3JrIGFyb3VuZCBidWdzIGluIHNvbWUgSlMgaW50ZXJwcmV0ZXJzLlxuICovXG5cblxuZnVuY3Rpb24gc2FmZUFkZCh4LCB5KSB7XG4gIHZhciBsc3cgPSAoeCAmIDB4ZmZmZikgKyAoeSAmIDB4ZmZmZik7XG4gIHZhciBtc3cgPSAoeCA+PiAxNikgKyAoeSA+PiAxNikgKyAobHN3ID4+IDE2KTtcbiAgcmV0dXJuIG1zdyA8PCAxNiB8IGxzdyAmIDB4ZmZmZjtcbn1cbi8qXG4gKiBCaXR3aXNlIHJvdGF0ZSBhIDMyLWJpdCBudW1iZXIgdG8gdGhlIGxlZnQuXG4gKi9cblxuXG5mdW5jdGlvbiBiaXRSb3RhdGVMZWZ0KG51bSwgY250KSB7XG4gIHJldHVybiBudW0gPDwgY250IHwgbnVtID4+PiAzMiAtIGNudDtcbn1cbi8qXG4gKiBUaGVzZSBmdW5jdGlvbnMgaW1wbGVtZW50IHRoZSBmb3VyIGJhc2ljIG9wZXJhdGlvbnMgdGhlIGFsZ29yaXRobSB1c2VzLlxuICovXG5cblxuZnVuY3Rpb24gbWQ1Y21uKHEsIGEsIGIsIHgsIHMsIHQpIHtcbiAgcmV0dXJuIHNhZmVBZGQoYml0Um90YXRlTGVmdChzYWZlQWRkKHNhZmVBZGQoYSwgcSksIHNhZmVBZGQoeCwgdCkpLCBzKSwgYik7XG59XG5cbmZ1bmN0aW9uIG1kNWZmKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgcmV0dXJuIG1kNWNtbihiICYgYyB8IH5iICYgZCwgYSwgYiwgeCwgcywgdCk7XG59XG5cbmZ1bmN0aW9uIG1kNWdnKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgcmV0dXJuIG1kNWNtbihiICYgZCB8IGMgJiB+ZCwgYSwgYiwgeCwgcywgdCk7XG59XG5cbmZ1bmN0aW9uIG1kNWhoKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgcmV0dXJuIG1kNWNtbihiIF4gYyBeIGQsIGEsIGIsIHgsIHMsIHQpO1xufVxuXG5mdW5jdGlvbiBtZDVpaShhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XG4gIHJldHVybiBtZDVjbW4oYyBeIChiIHwgfmQpLCBhLCBiLCB4LCBzLCB0KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWQ1OyIsImV4cG9ydCBkZWZhdWx0ICcwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAnOyIsImltcG9ydCB2YWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlLmpzJztcblxuZnVuY3Rpb24gcGFyc2UodXVpZCkge1xuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdJbnZhbGlkIFVVSUQnKTtcbiAgfVxuXG4gIHZhciB2O1xuICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoMTYpOyAvLyBQYXJzZSAjIyMjIyMjIy0uLi4uLS4uLi4tLi4uLi0uLi4uLi4uLi4uLi5cblxuICBhcnJbMF0gPSAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoMCwgOCksIDE2KSkgPj4+IDI0O1xuICBhcnJbMV0gPSB2ID4+PiAxNiAmIDB4ZmY7XG4gIGFyclsyXSA9IHYgPj4+IDggJiAweGZmO1xuICBhcnJbM10gPSB2ICYgMHhmZjsgLy8gUGFyc2UgLi4uLi4uLi4tIyMjIy0uLi4uLS4uLi4tLi4uLi4uLi4uLi4uXG5cbiAgYXJyWzRdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDksIDEzKSwgMTYpKSA+Pj4gODtcbiAgYXJyWzVdID0gdiAmIDB4ZmY7IC8vIFBhcnNlIC4uLi4uLi4uLS4uLi4tIyMjIy0uLi4uLS4uLi4uLi4uLi4uLlxuXG4gIGFycls2XSA9ICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSgxNCwgMTgpLCAxNikpID4+PiA4O1xuICBhcnJbN10gPSB2ICYgMHhmZjsgLy8gUGFyc2UgLi4uLi4uLi4tLi4uLi0uLi4uLSMjIyMtLi4uLi4uLi4uLi4uXG5cbiAgYXJyWzhdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDE5LCAyMyksIDE2KSkgPj4+IDg7XG4gIGFycls5XSA9IHYgJiAweGZmOyAvLyBQYXJzZSAuLi4uLi4uLi0uLi4uLS4uLi4tLi4uLi0jIyMjIyMjIyMjIyNcbiAgLy8gKFVzZSBcIi9cIiB0byBhdm9pZCAzMi1iaXQgdHJ1bmNhdGlvbiB3aGVuIGJpdC1zaGlmdGluZyBoaWdoLW9yZGVyIGJ5dGVzKVxuXG4gIGFyclsxMF0gPSAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoMjQsIDM2KSwgMTYpKSAvIDB4MTAwMDAwMDAwMDAgJiAweGZmO1xuICBhcnJbMTFdID0gdiAvIDB4MTAwMDAwMDAwICYgMHhmZjtcbiAgYXJyWzEyXSA9IHYgPj4+IDI0ICYgMHhmZjtcbiAgYXJyWzEzXSA9IHYgPj4+IDE2ICYgMHhmZjtcbiAgYXJyWzE0XSA9IHYgPj4+IDggJiAweGZmO1xuICBhcnJbMTVdID0gdiAmIDB4ZmY7XG4gIHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhcnNlOyIsImV4cG9ydCBkZWZhdWx0IC9eKD86WzAtOWEtZl17OH0tWzAtOWEtZl17NH0tWzEtNV1bMC05YS1mXXszfS1bODlhYl1bMC05YS1mXXszfS1bMC05YS1mXXsxMn18MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwKSQvaTsiLCIvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiBJbiB0aGUgYnJvd3NlciB3ZSB0aGVyZWZvcmVcbi8vIHJlcXVpcmUgdGhlIGNyeXB0byBBUEkgYW5kIGRvIG5vdCBzdXBwb3J0IGJ1aWx0LWluIGZhbGxiYWNrIHRvIGxvd2VyIHF1YWxpdHkgcmFuZG9tIG51bWJlclxuLy8gZ2VuZXJhdG9ycyAobGlrZSBNYXRoLnJhbmRvbSgpKS5cbnZhciBnZXRSYW5kb21WYWx1ZXM7XG52YXIgcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBybmcoKSB7XG4gIC8vIGxhenkgbG9hZCBzbyB0aGF0IGVudmlyb25tZW50cyB0aGF0IG5lZWQgdG8gcG9seWZpbGwgaGF2ZSBhIGNoYW5jZSB0byBkbyBzb1xuICBpZiAoIWdldFJhbmRvbVZhbHVlcykge1xuICAgIC8vIGdldFJhbmRvbVZhbHVlcyBuZWVkcyB0byBiZSBpbnZva2VkIGluIGEgY29udGV4dCB3aGVyZSBcInRoaXNcIiBpcyBhIENyeXB0byBpbXBsZW1lbnRhdGlvbi4gQWxzbyxcbiAgICAvLyBmaW5kIHRoZSBjb21wbGV0ZSBpbXBsZW1lbnRhdGlvbiBvZiBjcnlwdG8gKG1zQ3J5cHRvKSBvbiBJRTExLlxuICAgIGdldFJhbmRvbVZhbHVlcyA9IHR5cGVvZiBjcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKGNyeXB0bykgfHwgdHlwZW9mIG1zQ3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzID09PSAnZnVuY3Rpb24nICYmIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKG1zQ3J5cHRvKTtcblxuICAgIGlmICghZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NyeXB0by5nZXRSYW5kb21WYWx1ZXMoKSBub3Qgc3VwcG9ydGVkLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkI2dldHJhbmRvbXZhbHVlcy1ub3Qtc3VwcG9ydGVkJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGdldFJhbmRvbVZhbHVlcyhybmRzOCk7XG59IiwiLy8gQWRhcHRlZCBmcm9tIENocmlzIFZlbmVzcycgU0hBMSBjb2RlIGF0XG4vLyBodHRwOi8vd3d3Lm1vdmFibGUtdHlwZS5jby51ay9zY3JpcHRzL3NoYTEuaHRtbFxuZnVuY3Rpb24gZihzLCB4LCB5LCB6KSB7XG4gIHN3aXRjaCAocykge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiB4ICYgeSBeIH54ICYgejtcblxuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiB4IF4geSBeIHo7XG5cbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4geCAmIHkgXiB4ICYgeiBeIHkgJiB6O1xuXG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIHggXiB5IF4gejtcbiAgfVxufVxuXG5mdW5jdGlvbiBST1RMKHgsIG4pIHtcbiAgcmV0dXJuIHggPDwgbiB8IHggPj4+IDMyIC0gbjtcbn1cblxuZnVuY3Rpb24gc2hhMShieXRlcykge1xuICB2YXIgSyA9IFsweDVhODI3OTk5LCAweDZlZDllYmExLCAweDhmMWJiY2RjLCAweGNhNjJjMWQ2XTtcbiAgdmFyIEggPSBbMHg2NzQ1MjMwMSwgMHhlZmNkYWI4OSwgMHg5OGJhZGNmZSwgMHgxMDMyNTQ3NiwgMHhjM2QyZTFmMF07XG5cbiAgaWYgKHR5cGVvZiBieXRlcyA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgbXNnID0gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KGJ5dGVzKSk7IC8vIFVURjggZXNjYXBlXG5cbiAgICBieXRlcyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtc2cubGVuZ3RoOyArK2kpIHtcbiAgICAgIGJ5dGVzLnB1c2gobXNnLmNoYXJDb2RlQXQoaSkpO1xuICAgIH1cbiAgfSBlbHNlIGlmICghQXJyYXkuaXNBcnJheShieXRlcykpIHtcbiAgICAvLyBDb252ZXJ0IEFycmF5LWxpa2UgdG8gQXJyYXlcbiAgICBieXRlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGJ5dGVzKTtcbiAgfVxuXG4gIGJ5dGVzLnB1c2goMHg4MCk7XG4gIHZhciBsID0gYnl0ZXMubGVuZ3RoIC8gNCArIDI7XG4gIHZhciBOID0gTWF0aC5jZWlsKGwgLyAxNik7XG4gIHZhciBNID0gbmV3IEFycmF5KE4pO1xuXG4gIGZvciAodmFyIF9pID0gMDsgX2kgPCBOOyArK19pKSB7XG4gICAgdmFyIGFyciA9IG5ldyBVaW50MzJBcnJheSgxNik7XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IDE2OyArK2opIHtcbiAgICAgIGFycltqXSA9IGJ5dGVzW19pICogNjQgKyBqICogNF0gPDwgMjQgfCBieXRlc1tfaSAqIDY0ICsgaiAqIDQgKyAxXSA8PCAxNiB8IGJ5dGVzW19pICogNjQgKyBqICogNCArIDJdIDw8IDggfCBieXRlc1tfaSAqIDY0ICsgaiAqIDQgKyAzXTtcbiAgICB9XG5cbiAgICBNW19pXSA9IGFycjtcbiAgfVxuXG4gIE1bTiAtIDFdWzE0XSA9IChieXRlcy5sZW5ndGggLSAxKSAqIDggLyBNYXRoLnBvdygyLCAzMik7XG4gIE1bTiAtIDFdWzE0XSA9IE1hdGguZmxvb3IoTVtOIC0gMV1bMTRdKTtcbiAgTVtOIC0gMV1bMTVdID0gKGJ5dGVzLmxlbmd0aCAtIDEpICogOCAmIDB4ZmZmZmZmZmY7XG5cbiAgZm9yICh2YXIgX2kyID0gMDsgX2kyIDwgTjsgKytfaTIpIHtcbiAgICB2YXIgVyA9IG5ldyBVaW50MzJBcnJheSg4MCk7XG5cbiAgICBmb3IgKHZhciB0ID0gMDsgdCA8IDE2OyArK3QpIHtcbiAgICAgIFdbdF0gPSBNW19pMl1bdF07XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX3QgPSAxNjsgX3QgPCA4MDsgKytfdCkge1xuICAgICAgV1tfdF0gPSBST1RMKFdbX3QgLSAzXSBeIFdbX3QgLSA4XSBeIFdbX3QgLSAxNF0gXiBXW190IC0gMTZdLCAxKTtcbiAgICB9XG5cbiAgICB2YXIgYSA9IEhbMF07XG4gICAgdmFyIGIgPSBIWzFdO1xuICAgIHZhciBjID0gSFsyXTtcbiAgICB2YXIgZCA9IEhbM107XG4gICAgdmFyIGUgPSBIWzRdO1xuXG4gICAgZm9yICh2YXIgX3QyID0gMDsgX3QyIDwgODA7ICsrX3QyKSB7XG4gICAgICB2YXIgcyA9IE1hdGguZmxvb3IoX3QyIC8gMjApO1xuICAgICAgdmFyIFQgPSBST1RMKGEsIDUpICsgZihzLCBiLCBjLCBkKSArIGUgKyBLW3NdICsgV1tfdDJdID4+PiAwO1xuICAgICAgZSA9IGQ7XG4gICAgICBkID0gYztcbiAgICAgIGMgPSBST1RMKGIsIDMwKSA+Pj4gMDtcbiAgICAgIGIgPSBhO1xuICAgICAgYSA9IFQ7XG4gICAgfVxuXG4gICAgSFswXSA9IEhbMF0gKyBhID4+PiAwO1xuICAgIEhbMV0gPSBIWzFdICsgYiA+Pj4gMDtcbiAgICBIWzJdID0gSFsyXSArIGMgPj4+IDA7XG4gICAgSFszXSA9IEhbM10gKyBkID4+PiAwO1xuICAgIEhbNF0gPSBIWzRdICsgZSA+Pj4gMDtcbiAgfVxuXG4gIHJldHVybiBbSFswXSA+PiAyNCAmIDB4ZmYsIEhbMF0gPj4gMTYgJiAweGZmLCBIWzBdID4+IDggJiAweGZmLCBIWzBdICYgMHhmZiwgSFsxXSA+PiAyNCAmIDB4ZmYsIEhbMV0gPj4gMTYgJiAweGZmLCBIWzFdID4+IDggJiAweGZmLCBIWzFdICYgMHhmZiwgSFsyXSA+PiAyNCAmIDB4ZmYsIEhbMl0gPj4gMTYgJiAweGZmLCBIWzJdID4+IDggJiAweGZmLCBIWzJdICYgMHhmZiwgSFszXSA+PiAyNCAmIDB4ZmYsIEhbM10gPj4gMTYgJiAweGZmLCBIWzNdID4+IDggJiAweGZmLCBIWzNdICYgMHhmZiwgSFs0XSA+PiAyNCAmIDB4ZmYsIEhbNF0gPj4gMTYgJiAweGZmLCBIWzRdID4+IDggJiAweGZmLCBIWzRdICYgMHhmZl07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNoYTE7IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDE2IGJ5dGUgdmFsdWVzIHRvIFVVSUQgc3RyaW5nIGZvcm1hdCBvZiB0aGUgZm9ybTpcbiAqIFhYWFhYWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG5cbnZhciBieXRlVG9IZXggPSBbXTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBieXRlVG9IZXgucHVzaCgoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpKTtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KGFycikge1xuICB2YXIgb2Zmc2V0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwO1xuICAvLyBOb3RlOiBCZSBjYXJlZnVsIGVkaXRpbmcgdGhpcyBjb2RlISAgSXQncyBiZWVuIHR1bmVkIGZvciBwZXJmb3JtYW5jZVxuICAvLyBhbmQgd29ya3MgaW4gd2F5cyB5b3UgbWF5IG5vdCBleHBlY3QuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQvcHVsbC80MzRcbiAgdmFyIHV1aWQgPSAoYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAzXV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA2XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDddXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA5XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDExXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEzXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE1XV0pLnRvTG93ZXJDYXNlKCk7IC8vIENvbnNpc3RlbmN5IGNoZWNrIGZvciB2YWxpZCBVVUlELiAgSWYgdGhpcyB0aHJvd3MsIGl0J3MgbGlrZWx5IGR1ZSB0byBvbmVcbiAgLy8gb2YgdGhlIGZvbGxvd2luZzpcbiAgLy8gLSBPbmUgb3IgbW9yZSBpbnB1dCBhcnJheSB2YWx1ZXMgZG9uJ3QgbWFwIHRvIGEgaGV4IG9jdGV0IChsZWFkaW5nIHRvXG4gIC8vIFwidW5kZWZpbmVkXCIgaW4gdGhlIHV1aWQpXG4gIC8vIC0gSW52YWxpZCBpbnB1dCB2YWx1ZXMgZm9yIHRoZSBSRkMgYHZlcnNpb25gIG9yIGB2YXJpYW50YCBmaWVsZHNcblxuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdTdHJpbmdpZmllZCBVVUlEIGlzIGludmFsaWQnKTtcbiAgfVxuXG4gIHJldHVybiB1dWlkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdHJpbmdpZnk7IiwiaW1wb3J0IHJuZyBmcm9tICcuL3JuZy5qcyc7XG5pbXBvcnQgc3RyaW5naWZ5IGZyb20gJy4vc3RyaW5naWZ5LmpzJzsgLy8gKipgdjEoKWAgLSBHZW5lcmF0ZSB0aW1lLWJhc2VkIFVVSUQqKlxuLy9cbi8vIEluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9MaW9zSy9VVUlELmpzXG4vLyBhbmQgaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L3V1aWQuaHRtbFxuXG52YXIgX25vZGVJZDtcblxudmFyIF9jbG9ja3NlcTsgLy8gUHJldmlvdXMgdXVpZCBjcmVhdGlvbiB0aW1lXG5cblxudmFyIF9sYXN0TVNlY3MgPSAwO1xudmFyIF9sYXN0TlNlY3MgPSAwOyAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkIGZvciBBUEkgZGV0YWlsc1xuXG5mdW5jdGlvbiB2MShvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcbiAgdmFyIGIgPSBidWYgfHwgbmV3IEFycmF5KDE2KTtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBub2RlID0gb3B0aW9ucy5ub2RlIHx8IF9ub2RlSWQ7XG4gIHZhciBjbG9ja3NlcSA9IG9wdGlvbnMuY2xvY2tzZXEgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY2xvY2tzZXEgOiBfY2xvY2tzZXE7IC8vIG5vZGUgYW5kIGNsb2Nrc2VxIG5lZWQgdG8gYmUgaW5pdGlhbGl6ZWQgdG8gcmFuZG9tIHZhbHVlcyBpZiB0aGV5J3JlIG5vdFxuICAvLyBzcGVjaWZpZWQuICBXZSBkbyB0aGlzIGxhemlseSB0byBtaW5pbWl6ZSBpc3N1ZXMgcmVsYXRlZCB0byBpbnN1ZmZpY2llbnRcbiAgLy8gc3lzdGVtIGVudHJvcHkuICBTZWUgIzE4OVxuXG4gIGlmIChub2RlID09IG51bGwgfHwgY2xvY2tzZXEgPT0gbnVsbCkge1xuICAgIHZhciBzZWVkQnl0ZXMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpO1xuXG4gICAgaWYgKG5vZGUgPT0gbnVsbCkge1xuICAgICAgLy8gUGVyIDQuNSwgY3JlYXRlIGFuZCA0OC1iaXQgbm9kZSBpZCwgKDQ3IHJhbmRvbSBiaXRzICsgbXVsdGljYXN0IGJpdCA9IDEpXG4gICAgICBub2RlID0gX25vZGVJZCA9IFtzZWVkQnl0ZXNbMF0gfCAweDAxLCBzZWVkQnl0ZXNbMV0sIHNlZWRCeXRlc1syXSwgc2VlZEJ5dGVzWzNdLCBzZWVkQnl0ZXNbNF0sIHNlZWRCeXRlc1s1XV07XG4gICAgfVxuXG4gICAgaWYgKGNsb2Nrc2VxID09IG51bGwpIHtcbiAgICAgIC8vIFBlciA0LjIuMiwgcmFuZG9taXplICgxNCBiaXQpIGNsb2Nrc2VxXG4gICAgICBjbG9ja3NlcSA9IF9jbG9ja3NlcSA9IChzZWVkQnl0ZXNbNl0gPDwgOCB8IHNlZWRCeXRlc1s3XSkgJiAweDNmZmY7XG4gICAgfVxuICB9IC8vIFVVSUQgdGltZXN0YW1wcyBhcmUgMTAwIG5hbm8tc2Vjb25kIHVuaXRzIHNpbmNlIHRoZSBHcmVnb3JpYW4gZXBvY2gsXG4gIC8vICgxNTgyLTEwLTE1IDAwOjAwKS4gIEpTTnVtYmVycyBhcmVuJ3QgcHJlY2lzZSBlbm91Z2ggZm9yIHRoaXMsIHNvXG4gIC8vIHRpbWUgaXMgaGFuZGxlZCBpbnRlcm5hbGx5IGFzICdtc2VjcycgKGludGVnZXIgbWlsbGlzZWNvbmRzKSBhbmQgJ25zZWNzJ1xuICAvLyAoMTAwLW5hbm9zZWNvbmRzIG9mZnNldCBmcm9tIG1zZWNzKSBzaW5jZSB1bml4IGVwb2NoLCAxOTcwLTAxLTAxIDAwOjAwLlxuXG5cbiAgdmFyIG1zZWNzID0gb3B0aW9ucy5tc2VjcyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5tc2VjcyA6IERhdGUubm93KCk7IC8vIFBlciA0LjIuMS4yLCB1c2UgY291bnQgb2YgdXVpZCdzIGdlbmVyYXRlZCBkdXJpbmcgdGhlIGN1cnJlbnQgY2xvY2tcbiAgLy8gY3ljbGUgdG8gc2ltdWxhdGUgaGlnaGVyIHJlc29sdXRpb24gY2xvY2tcblxuICB2YXIgbnNlY3MgPSBvcHRpb25zLm5zZWNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm5zZWNzIDogX2xhc3ROU2VjcyArIDE7IC8vIFRpbWUgc2luY2UgbGFzdCB1dWlkIGNyZWF0aW9uIChpbiBtc2VjcylcblxuICB2YXIgZHQgPSBtc2VjcyAtIF9sYXN0TVNlY3MgKyAobnNlY3MgLSBfbGFzdE5TZWNzKSAvIDEwMDAwOyAvLyBQZXIgNC4yLjEuMiwgQnVtcCBjbG9ja3NlcSBvbiBjbG9jayByZWdyZXNzaW9uXG5cbiAgaWYgKGR0IDwgMCAmJiBvcHRpb25zLmNsb2Nrc2VxID09PSB1bmRlZmluZWQpIHtcbiAgICBjbG9ja3NlcSA9IGNsb2Nrc2VxICsgMSAmIDB4M2ZmZjtcbiAgfSAvLyBSZXNldCBuc2VjcyBpZiBjbG9jayByZWdyZXNzZXMgKG5ldyBjbG9ja3NlcSkgb3Igd2UndmUgbW92ZWQgb250byBhIG5ld1xuICAvLyB0aW1lIGludGVydmFsXG5cblxuICBpZiAoKGR0IDwgMCB8fCBtc2VjcyA+IF9sYXN0TVNlY3MpICYmIG9wdGlvbnMubnNlY3MgPT09IHVuZGVmaW5lZCkge1xuICAgIG5zZWNzID0gMDtcbiAgfSAvLyBQZXIgNC4yLjEuMiBUaHJvdyBlcnJvciBpZiB0b28gbWFueSB1dWlkcyBhcmUgcmVxdWVzdGVkXG5cblxuICBpZiAobnNlY3MgPj0gMTAwMDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1dWlkLnYxKCk6IENhbid0IGNyZWF0ZSBtb3JlIHRoYW4gMTBNIHV1aWRzL3NlY1wiKTtcbiAgfVxuXG4gIF9sYXN0TVNlY3MgPSBtc2VjcztcbiAgX2xhc3ROU2VjcyA9IG5zZWNzO1xuICBfY2xvY2tzZXEgPSBjbG9ja3NlcTsgLy8gUGVyIDQuMS40IC0gQ29udmVydCBmcm9tIHVuaXggZXBvY2ggdG8gR3JlZ29yaWFuIGVwb2NoXG5cbiAgbXNlY3MgKz0gMTIyMTkyOTI4MDAwMDA7IC8vIGB0aW1lX2xvd2BcblxuICB2YXIgdGwgPSAoKG1zZWNzICYgMHhmZmZmZmZmKSAqIDEwMDAwICsgbnNlY3MpICUgMHgxMDAwMDAwMDA7XG4gIGJbaSsrXSA9IHRsID4+PiAyNCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsID4+PiAxNiAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsID4+PiA4ICYgMHhmZjtcbiAgYltpKytdID0gdGwgJiAweGZmOyAvLyBgdGltZV9taWRgXG5cbiAgdmFyIHRtaCA9IG1zZWNzIC8gMHgxMDAwMDAwMDAgKiAxMDAwMCAmIDB4ZmZmZmZmZjtcbiAgYltpKytdID0gdG1oID4+PiA4ICYgMHhmZjtcbiAgYltpKytdID0gdG1oICYgMHhmZjsgLy8gYHRpbWVfaGlnaF9hbmRfdmVyc2lvbmBcblxuICBiW2krK10gPSB0bWggPj4+IDI0ICYgMHhmIHwgMHgxMDsgLy8gaW5jbHVkZSB2ZXJzaW9uXG5cbiAgYltpKytdID0gdG1oID4+PiAxNiAmIDB4ZmY7IC8vIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYCAoUGVyIDQuMi4yIC0gaW5jbHVkZSB2YXJpYW50KVxuXG4gIGJbaSsrXSA9IGNsb2Nrc2VxID4+PiA4IHwgMHg4MDsgLy8gYGNsb2NrX3NlcV9sb3dgXG5cbiAgYltpKytdID0gY2xvY2tzZXEgJiAweGZmOyAvLyBgbm9kZWBcblxuICBmb3IgKHZhciBuID0gMDsgbiA8IDY7ICsrbikge1xuICAgIGJbaSArIG5dID0gbm9kZVtuXTtcbiAgfVxuXG4gIHJldHVybiBidWYgfHwgc3RyaW5naWZ5KGIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2MTsiLCJpbXBvcnQgdjM1IGZyb20gJy4vdjM1LmpzJztcbmltcG9ydCBtZDUgZnJvbSAnLi9tZDUuanMnO1xudmFyIHYzID0gdjM1KCd2MycsIDB4MzAsIG1kNSk7XG5leHBvcnQgZGVmYXVsdCB2MzsiLCJpbXBvcnQgc3RyaW5naWZ5IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcbmltcG9ydCBwYXJzZSBmcm9tICcuL3BhcnNlLmpzJztcblxuZnVuY3Rpb24gc3RyaW5nVG9CeXRlcyhzdHIpIHtcbiAgc3RyID0gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHN0cikpOyAvLyBVVEY4IGVzY2FwZVxuXG4gIHZhciBieXRlcyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgYnl0ZXMucHVzaChzdHIuY2hhckNvZGVBdChpKSk7XG4gIH1cblxuICByZXR1cm4gYnl0ZXM7XG59XG5cbmV4cG9ydCB2YXIgRE5TID0gJzZiYTdiODEwLTlkYWQtMTFkMS04MGI0LTAwYzA0ZmQ0MzBjOCc7XG5leHBvcnQgdmFyIFVSTCA9ICc2YmE3YjgxMS05ZGFkLTExZDEtODBiNC0wMGMwNGZkNDMwYzgnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG5hbWUsIHZlcnNpb24sIGhhc2hmdW5jKSB7XG4gIGZ1bmN0aW9uIGdlbmVyYXRlVVVJRCh2YWx1ZSwgbmFtZXNwYWNlLCBidWYsIG9mZnNldCkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YWx1ZSA9IHN0cmluZ1RvQnl0ZXModmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgbmFtZXNwYWNlID09PSAnc3RyaW5nJykge1xuICAgICAgbmFtZXNwYWNlID0gcGFyc2UobmFtZXNwYWNlKTtcbiAgICB9XG5cbiAgICBpZiAobmFtZXNwYWNlLmxlbmd0aCAhPT0gMTYpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcignTmFtZXNwYWNlIG11c3QgYmUgYXJyYXktbGlrZSAoMTYgaXRlcmFibGUgaW50ZWdlciB2YWx1ZXMsIDAtMjU1KScpO1xuICAgIH0gLy8gQ29tcHV0ZSBoYXNoIG9mIG5hbWVzcGFjZSBhbmQgdmFsdWUsIFBlciA0LjNcbiAgICAvLyBGdXR1cmU6IFVzZSBzcHJlYWQgc3ludGF4IHdoZW4gc3VwcG9ydGVkIG9uIGFsbCBwbGF0Zm9ybXMsIGUuZy4gYGJ5dGVzID1cbiAgICAvLyBoYXNoZnVuYyhbLi4ubmFtZXNwYWNlLCAuLi4gdmFsdWVdKWBcblxuXG4gICAgdmFyIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoMTYgKyB2YWx1ZS5sZW5ndGgpO1xuICAgIGJ5dGVzLnNldChuYW1lc3BhY2UpO1xuICAgIGJ5dGVzLnNldCh2YWx1ZSwgbmFtZXNwYWNlLmxlbmd0aCk7XG4gICAgYnl0ZXMgPSBoYXNoZnVuYyhieXRlcyk7XG4gICAgYnl0ZXNbNl0gPSBieXRlc1s2XSAmIDB4MGYgfCB2ZXJzaW9uO1xuICAgIGJ5dGVzWzhdID0gYnl0ZXNbOF0gJiAweDNmIHwgMHg4MDtcblxuICAgIGlmIChidWYpIHtcbiAgICAgIG9mZnNldCA9IG9mZnNldCB8fCAwO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDE2OyArK2kpIHtcbiAgICAgICAgYnVmW29mZnNldCArIGldID0gYnl0ZXNbaV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBidWY7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cmluZ2lmeShieXRlcyk7XG4gIH0gLy8gRnVuY3Rpb24jbmFtZSBpcyBub3Qgc2V0dGFibGUgb24gc29tZSBwbGF0Zm9ybXMgKCMyNzApXG5cblxuICB0cnkge1xuICAgIGdlbmVyYXRlVVVJRC5uYW1lID0gbmFtZTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVtcHR5XG4gIH0gY2F0Y2ggKGVycikge30gLy8gRm9yIENvbW1vbkpTIGRlZmF1bHQgZXhwb3J0IHN1cHBvcnRcblxuXG4gIGdlbmVyYXRlVVVJRC5ETlMgPSBETlM7XG4gIGdlbmVyYXRlVVVJRC5VUkwgPSBVUkw7XG4gIHJldHVybiBnZW5lcmF0ZVVVSUQ7XG59IiwiaW1wb3J0IHJuZyBmcm9tICcuL3JuZy5qcyc7XG5pbXBvcnQgc3RyaW5naWZ5IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcblxuZnVuY3Rpb24gdjQob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTsgLy8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuXG4gIHJuZHNbNl0gPSBybmRzWzZdICYgMHgwZiB8IDB4NDA7XG4gIHJuZHNbOF0gPSBybmRzWzhdICYgMHgzZiB8IDB4ODA7IC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuXG4gIGlmIChidWYpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgICAgYnVmW29mZnNldCArIGldID0gcm5kc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgcmV0dXJuIHN0cmluZ2lmeShybmRzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdjQ7IiwiaW1wb3J0IHYzNSBmcm9tICcuL3YzNS5qcyc7XG5pbXBvcnQgc2hhMSBmcm9tICcuL3NoYTEuanMnO1xudmFyIHY1ID0gdjM1KCd2NScsIDB4NTAsIHNoYTEpO1xuZXhwb3J0IGRlZmF1bHQgdjU7IiwiaW1wb3J0IFJFR0VYIGZyb20gJy4vcmVnZXguanMnO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZSh1dWlkKSB7XG4gIHJldHVybiB0eXBlb2YgdXVpZCA9PT0gJ3N0cmluZycgJiYgUkVHRVgudGVzdCh1dWlkKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdmFsaWRhdGU7IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuXG5mdW5jdGlvbiB2ZXJzaW9uKHV1aWQpIHtcbiAgaWYgKCF2YWxpZGF0ZSh1dWlkKSkge1xuICAgIHRocm93IFR5cGVFcnJvcignSW52YWxpZCBVVUlEJyk7XG4gIH1cblxuICByZXR1cm4gcGFyc2VJbnQodXVpZC5zdWJzdHIoMTQsIDEpLCAxNik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZlcnNpb247IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJleHBvcnQgeyBkZWJ1ZyB9IGZyb20gJy4vZGVidWcnO1xuXG5leHBvcnQgeyBNb2RlbCB9IGZyb20gJy4vbW9kZWwnO1xuZXhwb3J0IHsgU2NoZW1hIH0gZnJvbSAnLi9zY2hlbWEnO1xuZXhwb3J0IHsgZmllbGRzIH0gZnJvbSAnLi9maWVsZCc7XG5leHBvcnQgeyBNaWdyYXRpb24gfSBmcm9tICcuL21pZ3JhdG9uJztcblxuZXhwb3J0IHsgc2Vzc2lvbiwgc2V0RGVmYXVsdEFkYXB0ZXIsIGdldERlZmF1bHRBZGFwdGVyIH0gZnJvbSAnLi9zZXNzaW9uJzsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=