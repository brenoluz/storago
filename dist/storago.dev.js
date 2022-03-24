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
    isJsonObject() {
        return false;
    }
    defineSetter(link, schema, model, value) {
        if (link) {
            let listName = link.split('.');
            let fieldName = listName[0];
            let target = listName.pop();
            let field = schema.getField(fieldName);
            let item = model;
            if (field.isJsonObject()) {
                let itemName = listName.shift();
                while (itemName) {
                    if (typeof item[itemName] !== 'object') {
                        item[itemName] = {};
                    }
                    item = item[itemName];
                    itemName = listName.shift();
                }
            }
            if (target) {
                item[target] = value;
            }
        }
    }
    defineGetter(link, schema, model) {
        if (link) {
            let listName = link.split('.');
            let fieldName = listName[0];
            let target = listName.pop();
            let field = schema.getField(fieldName);
            let item = model;
            if (field.isJsonObject()) {
                let itemName = listName.shift();
                while (itemName) {
                    if (typeof item[itemName] !== 'object') {
                        return item[itemName];
                    }
                    item = item[itemName];
                    itemName = listName.shift();
                }
            }
            if (target) {
                return item[target];
            }
        }
    }
    defineProperty(schema, model) {
        let link = this.config.link;
        if (link) {
            Object.defineProperty(model, this.name, {
                'set': this.defineSetter.bind(this, link, schema, model),
                'get': this.defineGetter.bind(this, link, schema, model),
            });
        }
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
        let schema = Object.getPrototypeOf(this).constructor.schema;
        schema.defineProperties(this);
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
    getField(name) {
        for (let field of this.getFields()) {
            if (name == field.getName()) {
                return field;
            }
        }
        throw { code: null, message: `Field with name: ${name} not exists in ${this.name}` };
    }
    getRealFields() {
        let fieldFiltered = [];
        for (let field of this.fields) {
            if (!field.isVirtual()) {
                fieldFiltered.push(field);
            }
        }
        return fieldFiltered;
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
        let fields = this.getRealFields();
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
    defineProperties(model) {
        for (let field of this.getFields()) {
            field.defineProperty(this, model);
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVM7QUFFbEIseUVBQTBFO0FBQWpFLDBHQUFPO0FBQUUsOEhBQWlCO0FBQUUsOEhBQWlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2FkYXB0ZXJzL2FkYXB0ZXIudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2FkYXB0ZXJzL3dlYnNxbC9hZGFwdGVyLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9hZGFwdGVycy93ZWJzcWwvY3JlYXRlLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9hZGFwdGVycy93ZWJzcWwvaW5zZXJ0LnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9hZGFwdGVycy93ZWJzcWwvc2VsZWN0LnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9kZWJ1Zy50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvZmllbGQvZmllbGQudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL2ZpZWxkL2luZGV4LnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC9qc29uLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC90ZXh0LnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9maWVsZC91dWlkLnRzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL3NyYy9taWdyYXRvbi50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvbW9kZWwudHMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vc3JjL3NjaGVtYS50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvc2Vzc2lvbi50cyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL2luZGV4LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvbWQ1LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvbmlsLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvcGFyc2UuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9yZWdleC5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3JuZy5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3NoYTEuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92MS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3YzLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdjM1LmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdjQuanMiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92NS5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL0BzdG9yYWdvL29ybS8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdmVyc2lvbi5qcyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQHN0b3JhZ28vb3JtL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9Ac3RvcmFnby9vcm0vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VsZWN0IH0gZnJvbSBcIi4vc2VsZWN0XCI7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgSW5zZXJ0IH0gZnJvbSBcIi4vaW5zZXJ0XCI7XG5pbXBvcnQgeyBDcmVhdGUgfSBmcm9tIFwiLi9jcmVhdGVcIjtcblxudHlwZSBjYWxsYmFja01pZ3JhdGlvbiA9IHsodHJhbnNhY3Rpb246IGFueSkgOiBQcm9taXNlPHZvaWQ+fTtcblxuZXhwb3J0IGVudW0gZW5naW5lS2luZCB7XG4gIFdlYlNRTCxcbiAgUG9zdGdyZVNRTCxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBZGFwdGVye1xuXG4gIGVuZ2luZTogZW5naW5lS2luZDtcblxuICBxdWVyeShzcWw6IGFueSwgZGF0YTogT2JqZWN0QXJyYXksIHRyYW5zYWN0aW9uOiBhbnkpIDogUHJvbWlzZTxhbnk+O1xuICBzZWxlY3QobW9kZWw6IHR5cGVvZiBNb2RlbCkgOiBTZWxlY3Q7XG4gIGluc2VydChtb2RlbDogdHlwZW9mIE1vZGVsKSA6IEluc2VydDtcbiAgZ2V0VmVyc2lvbigpIDogJyd8bnVtYmVyO1xuICBjcmVhdGUobW9kZWw6IHR5cGVvZiBNb2RlbCkgOiBDcmVhdGU7XG4gIGNoYW5nZVZlcnNpb24obmV3VmVyc2lvbjogbnVtYmVyLCBjYjogY2FsbGJhY2tNaWdyYXRpb24pIDogUHJvbWlzZTx2b2lkPjtcbn0iLCJpbXBvcnQgeyBBZGFwdGVyLCBlbmdpbmVLaW5kIH0gZnJvbSBcIi4uL2FkYXB0ZXJcIjtcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSBcIi4uLy4uL21vZGVsXCI7XG5pbXBvcnQgeyBXZWJTUUxTZWxlY3QgfSBmcm9tIFwiLi9zZWxlY3RcIjtcbmltcG9ydCB7IFdlYlNRTEluc2VydCB9IGZyb20gXCIuL2luc2VydFwiO1xuaW1wb3J0IHsgV2ViU1FMQ3JlYXRlIH0gZnJvbSBcIi4vY3JlYXRlXCI7XG5pbXBvcnQgeyBkZWJ1ZyB9IGZyb20gXCIuLi8uLi9kZWJ1Z1wiO1xuXG50eXBlIGNhbGxiYWNrTWlncmF0aW9uID0geyh0cmFuc2FjdGlvbjogU1FMVHJhbnNhY3Rpb24pIDogUHJvbWlzZTx2b2lkPn07XG5cbmV4cG9ydCBjbGFzcyBXZWJTUUxBZGFwdGVyIGltcGxlbWVudHMgQWRhcHRlciB7XG5cbiAgcHVibGljIHJlYWRvbmx5IGRiOiBEYXRhYmFzZTtcbiAgcHVibGljIHJlYWRvbmx5IGVuZ2luZTogZW5naW5lS2luZCA9IGVuZ2luZUtpbmQuV2ViU1FMO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZywgc2l6ZTogbnVtYmVyKSB7XG5cbiAgICB0aGlzLmRiID0gd2luZG93Lm9wZW5EYXRhYmFzZShuYW1lLCAnJywgZGVzY3JpcHRpb24sIHNpemUpO1xuICB9XG5cbiAgcHVibGljIGdldFZlcnNpb24oKTogJyd8bnVtYmVyIHtcblxuICAgIGxldCB2ZXJzaW9uID0gdGhpcy5kYi52ZXJzaW9uIGFzIHN0cmluZztcbiAgICBpZiAodmVyc2lvbiAhPT0gJycpIHtcbiAgICAgIHJldHVybiBwYXJzZUludCh2ZXJzaW9uKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcHVibGljIGNoYW5nZVZlcnNpb24obmV3VmVyc2lvbjogbnVtYmVyLCBjYjogY2FsbGJhY2tNaWdyYXRpb24pIDogUHJvbWlzZTx2b2lkPntcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgIHRoaXMuZGIuY2hhbmdlVmVyc2lvbihTdHJpbmcodGhpcy5nZXRWZXJzaW9uKCkpLCBTdHJpbmcobmV3VmVyc2lvbiksIGNiLCByZWplY3QsIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldFRyYW5zYWN0aW9uKCk6IFByb21pc2U8U1FMVHJhbnNhY3Rpb24+IHtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmRiLnRyYW5zYWN0aW9uKHJlc29sdmUsIHJlamVjdCk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc2VsZWN0KHRhYmxlOiB0eXBlb2YgTW9kZWwpOiBXZWJTUUxTZWxlY3Qge1xuICAgIGxldCBzZWxlY3QgPSBuZXcgV2ViU1FMU2VsZWN0KHRhYmxlLCB0aGlzKTtcbiAgICByZXR1cm4gc2VsZWN0O1xuICB9XG5cbiAgcHVibGljIGluc2VydChtb2RlbDogdHlwZW9mIE1vZGVsKTogV2ViU1FMSW5zZXJ0IHtcbiAgICBsZXQgaW5zZXJ0ID0gbmV3IFdlYlNRTEluc2VydChtb2RlbCwgdGhpcyk7XG4gICAgcmV0dXJuIGluc2VydDtcbiAgfVxuXG4gIHB1YmxpYyBjcmVhdGUobW9kZWw6IHR5cGVvZiBNb2RlbCkgOiBXZWJTUUxDcmVhdGUge1xuXG4gICAgbGV0IGNyZWF0ZSA9IG5ldyBXZWJTUUxDcmVhdGUobW9kZWwsIHRoaXMpO1xuICAgIHJldHVybiBjcmVhdGU7XG4gIH1cblxuICBwdWJsaWMgcXVlcnkoc3FsOiBET01TdHJpbmcsIGRhdGE6IE9iamVjdEFycmF5ID0gW10sIHR4PzogU1FMVHJhbnNhY3Rpb24pOiBQcm9taXNlPFNRTFJlc3VsdFNldD4ge1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgaWYodHggPT09IHVuZGVmaW5lZCl7XG4gICAgICAgIHR4ID0gYXdhaXQgdGhpcy5nZXRUcmFuc2FjdGlvbigpO1xuICAgICAgfVxuXG4gICAgICBpZihkZWJ1Zy5xdWVyeSl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdAc3RvcmFnby9vcm0nLCAncXVlcnknLCBzcWwsIGRhdGEpO1xuICAgICAgfVxuICAgICAgXG4gICAgICB0eC5leGVjdXRlU3FsKHNxbCwgZGF0YSwgKHR4OiBTUUxUcmFuc2FjdGlvbiwgcmVzdWx0OiBTUUxSZXN1bHRTZXQpOiB2b2lkID0+IHtcblxuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG5cbiAgICAgIH0sICh0eDogU1FMVHJhbnNhY3Rpb24sIGVycm9yOiBTUUxFcnJvcik6IGJvb2xlYW4gPT4ge1xuXG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn0iLCJpbXBvcnQgeyBDcmVhdGUgfSBmcm9tIFwiLi4vY3JlYXRlXCI7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJy4uLy4uL21vZGVsJztcbmltcG9ydCB7IFdlYlNRTEFkYXB0ZXIgfSBmcm9tICcuL2FkYXB0ZXInO1xuXG5leHBvcnQgY2xhc3MgV2ViU1FMQ3JlYXRlIGltcGxlbWVudHMgQ3JlYXRle1xuXG4gIHByaXZhdGUgTW9kZWw6IHR5cGVvZiBNb2RlbDtcbiAgcHJpdmF0ZSBhZGFwdGVyOiBXZWJTUUxBZGFwdGVyO1xuIFxuICBjb25zdHJ1Y3Rvcihtb2RlbDogdHlwZW9mIE1vZGVsLCBhZGFwdGVyOiBXZWJTUUxBZGFwdGVyKXtcbiAgICB0aGlzLk1vZGVsID0gbW9kZWw7XG4gICAgdGhpcy5hZGFwdGVyID0gYWRhcHRlcjtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q29sdW1ucygpIDogc3RyaW5nW10ge1xuXG4gICAgY29uc3QgY29sdW1uczogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgZmllbGRzID0gdGhpcy5Nb2RlbC5zY2hlbWEuZ2V0UmVhbEZpZWxkcygpO1xuXG4gICAgZm9yKGxldCBmaWVsZCBvZiBmaWVsZHMpe1xuICAgICAgbGV0IG5hbWUgPSBmaWVsZC5nZXROYW1lKCk7XG4gICAgICBjb2x1bW5zLnB1c2goYCR7bmFtZX0gJHtmaWVsZC5jYXN0REIodGhpcy5hZGFwdGVyKX1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29sdW1ucztcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXIoKSA6IHN0cmluZyB7XG5cbiAgICBsZXQgY29sdW1uczogc3RyaW5nW10gPSB0aGlzLmdldENvbHVtbnMoKTtcbiAgICBsZXQgc3FsID0gYENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTICR7dGhpcy5Nb2RlbC5zY2hlbWEuZ2V0TmFtZSgpfSAoYDtcbiAgICBzcWwgKz0gY29sdW1ucy5qb2luKCcsICcpO1xuICAgIHNxbCArPSAnKTsnO1xuICAgIHJldHVybiBzcWw7XG4gIH1cblxuICBwdWJsaWMgZXhlY3V0ZSh0eDogU1FMVHJhbnNhY3Rpb24pIDogUHJvbWlzZTxTUUxSZXN1bHRTZXQ+IHtcblxuICAgIGxldCBzcWw6IHN0cmluZyA9IHRoaXMucmVuZGVyKCk7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5xdWVyeShzcWwsIFtdLCB0eCk7XG4gIH1cbn0iLCJpbXBvcnQgeyBJbnNlcnQgfSBmcm9tIFwiLi4vaW5zZXJ0XCI7XG5pbXBvcnQgeyBXZWJTUUxBZGFwdGVyIH0gZnJvbSBcIi4vYWRhcHRlclwiO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vLi4vbW9kZWxcIjtcbmltcG9ydCB7IGRlYnVnIH0gZnJvbSBcIi4uLy4uL2RlYnVnXCI7XG5cbmV4cG9ydCB0eXBlIGRiVmFsdWVDYXN0ID0gc3RyaW5nIHwgbnVtYmVyO1xuXG5leHBvcnQgY2xhc3MgV2ViU1FMSW5zZXJ0IGltcGxlbWVudHMgSW5zZXJ0IHtcblxuICBwcm90ZWN0ZWQgTW9kZWw6IHR5cGVvZiBNb2RlbDtcbiAgcHJvdGVjdGVkIGFkYXB0ZXI6IFdlYlNRTEFkYXB0ZXI7XG4gIHByb3RlY3RlZCB2YWx1ZXM6IGRiVmFsdWVDYXN0W10gPSBbXTtcbiAgcHJvdGVjdGVkIG9iamVjdHM6IE1vZGVsW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihtb2RlbDogdHlwZW9mIE1vZGVsLCBhZGFwdGVyOiBXZWJTUUxBZGFwdGVyKSB7XG4gICAgdGhpcy5Nb2RlbCA9IG1vZGVsO1xuICAgIHRoaXMuYWRhcHRlciA9IGFkYXB0ZXI7XG4gIH1cblxuICBhZGQocm93OiBNb2RlbCk6IHZvaWQge1xuXG4gICAgdGhpcy5vYmplY3RzLnB1c2gocm93KTtcbiAgfVxuXG4gIHJlbmRlcigpOiBzdHJpbmcge1xuXG4gICAgbGV0IHNjaGVtYSA9IHRoaXMuTW9kZWwuc2NoZW1hO1xuICAgIGxldCBmaWVsZHMgPSBzY2hlbWEuZ2V0UmVhbEZpZWxkcygpO1xuXG4gICAgbGV0IGxlbmd0aCA9IGZpZWxkcy5sZW5ndGggLSAxO1xuICAgIGxldCBzcWwgPSBgSU5TRVJUIElOVE8gJHsgc2NoZW1hLmdldE5hbWUoKSB9IChgO1xuICAgIGZvciAobGV0IGkgaW4gZmllbGRzKSB7XG5cbiAgICAgIGxldCBpbmRleCA9IHBhcnNlSW50KGkpO1xuICAgICAgbGV0IGZpZWxkID0gZmllbGRzW2ldO1xuICAgICAgbGV0IG5hbWUgPSBmaWVsZC5nZXROYW1lKCk7XG4gICAgICBzcWwgKz0gYFwiJHsgbmFtZSB9XCJgO1xuICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHNxbCArPSAnLCAnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNxbCArPSAnKSBWQUxVRVMnO1xuXG4gICAgbGV0IG9fc2l6ZSA9IHRoaXMub2JqZWN0cy5sZW5ndGggLSAxO1xuICAgIGZvciAobGV0IG8gaW4gdGhpcy5vYmplY3RzKSB7XG5cbiAgICAgIGxldCBvX2luZGV4ID0gcGFyc2VJbnQobyk7XG4gICAgICBsZXQgb2JqID0gdGhpcy5vYmplY3RzW29dO1xuXG4gICAgICBzcWwgKz0gJyAoJztcblxuICAgICAgZm9yIChsZXQgaSBpbiBmaWVsZHMpIHtcblxuICAgICAgICBsZXQgaW5kZXggPSBwYXJzZUludChpKTtcbiAgICAgICAgbGV0IGZpZWxkID0gZmllbGRzW2ldO1xuXG4gICAgICAgIHRoaXMudmFsdWVzLnB1c2goZmllbGQudG9EQihvYmopKTsgLy9ndWFyZGEgb3MgdmFsb3JlcyBwYXJhIGdyYXZhciBubyBiYW5jb1xuXG4gICAgICAgIHNxbCArPSAnPyc7XG4gICAgICAgIGlmIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIHNxbCArPSAnLCAnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHNxbCArPSAnKSc7XG5cbiAgICAgIGlmIChvX2luZGV4IDwgb19zaXplKSB7XG4gICAgICAgIHNxbCArPSAnLCAnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNxbCArPSAnOyc7XG5cbiAgICByZXR1cm4gc3FsO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGV4ZWN1dGUoKTogUHJvbWlzZTxTUUxSZXN1bHRTZXQ+IHtcblxuICAgIGxldCBzcWwgPSB0aGlzLnJlbmRlcigpO1xuICAgIGlmKGRlYnVnLmluc2VydCl7XG4gICAgICBjb25zb2xlLmxvZyhzcWwsIHRoaXMudmFsdWVzKTtcbiAgICB9XG4gICAgXG5cbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLnF1ZXJ5KHNxbCwgdGhpcy52YWx1ZXMpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNhdmUoKSA6IFByb21pc2U8dm9pZD57XG5cbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgdGhpcy5leGVjdXRlKCk7XG4gICAgY29uc29sZS5sb2coJ3Jlc3VsdCcsIHJlc3VsdCk7XG4gIH1cbn0iLCJpbXBvcnQgeyBXZWJTUUxBZGFwdGVyIH0gZnJvbSAnLi9hZGFwdGVyJztcbmltcG9ydCB7IFNlbGVjdCB9IGZyb20gJy4uL3NlbGVjdCc7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJy4uLy4uL21vZGVsJztcbmltcG9ydCB7IHBhcmFtc1R5cGUgfSBmcm9tICcuLi9xdWVyeSc7XG5pbXBvcnQgeyBkZWJ1ZyB9IGZyb20gJy4uLy4uL2RlYnVnJztcblxudHlwZSB3aGVyZVR1cGxlID0gW3N0cmluZywgcGFyYW1zVHlwZVtdIHwgdW5kZWZpbmVkXTtcbnR5cGUgam9pblR1cGxlID0gW3N0cmluZywgc3RyaW5nXTtcbnR5cGUgb3JkZXJUeXBlID0gXCJBU0NcIiB8IFwiREVTQ1wiO1xuXG5leHBvcnQgY2xhc3MgV2ViU1FMU2VsZWN0IGltcGxlbWVudHMgU2VsZWN0IHtcblxuICBwcml2YXRlIE1vZGVsOiB0eXBlb2YgTW9kZWw7XG4gIHByaXZhdGUgYWRhcHRlcjogV2ViU1FMQWRhcHRlcjtcbiAgcHJpdmF0ZSBfb2Zmc2V0OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIF9kaXN0aW5jdDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIF9mcm9tOiBzdHJpbmcgPSAnJztcbiAgcHJpdmF0ZSBfd2hlcmU6IHdoZXJlVHVwbGVbXSA9IFtdO1xuICBwcml2YXRlIF9jb2x1bW46IHN0cmluZ1tdID0gW107XG4gIHByaXZhdGUgX2pvaW46IGpvaW5UdXBsZVtdID0gW107XG4gIHByaXZhdGUgX2pvaW5MZWZ0OiBqb2luVHVwbGVbXSA9IFtdO1xuICBwcml2YXRlIF9qb2luUmlnaHQ6IGpvaW5UdXBsZVtdID0gW107XG4gIHByaXZhdGUgX3BhcmFtczogcGFyYW1zVHlwZVtdID0gW107XG4gIHByaXZhdGUgX29yZGVyOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKG1vZGVsOiB0eXBlb2YgTW9kZWwsIGFkYXB0ZXI6IFdlYlNRTEFkYXB0ZXIpIHtcbiAgICB0aGlzLk1vZGVsID0gbW9kZWw7XG4gICAgdGhpcy5hZGFwdGVyID0gYWRhcHRlcjtcbiAgfVxuXG4gIGRpc3RpbmN0KGZsYWc6IGJvb2xlYW4gPSB0cnVlKTogV2ViU1FMU2VsZWN0IHtcblxuICAgIHRoaXMuX2Rpc3RpbmN0ID0gZmxhZztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZyb20oZnJvbTogc3RyaW5nLCBjb2x1bW5zPzogc3RyaW5nW10pOiBXZWJTUUxTZWxlY3Qge1xuXG4gICAgdGhpcy5fZnJvbSA9IGZyb207XG4gICAgaWYgKCFjb2x1bW5zKSB7XG4gICAgICBjb2x1bW5zID0gWycqJ107XG4gICAgfVxuXG4gICAgY29sdW1ucy5wdXNoKCdyb3dpZCcpO1xuXG4gICAgZm9yIChsZXQgY29sdW1uIG9mIGNvbHVtbnMpIHtcbiAgICAgIHRoaXMuX2NvbHVtbi5wdXNoKGAkeyBmcm9tIH0uJHsgY29sdW1uIH1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHdoZXJlKGNyaXRlcmlhOiBzdHJpbmcsIHBhcmFtcz86IHBhcmFtc1R5cGVbXSB8IHBhcmFtc1R5cGUpOiBXZWJTUUxTZWxlY3Qge1xuXG4gICAgaWYgKHBhcmFtcyAhPT0gdW5kZWZpbmVkICYmICFBcnJheS5pc0FycmF5KHBhcmFtcykpIHtcbiAgICAgIHBhcmFtcyA9IFtwYXJhbXNdO1xuICAgIH1cblxuICAgIHRoaXMuX3doZXJlLnB1c2goW2NyaXRlcmlhLCBwYXJhbXNdKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGpvaW4odGFibGVOYW1lOiBzdHJpbmcsIG9uOiBzdHJpbmcsIGNvbHVtbnM/OiBzdHJpbmdbXSk6IFdlYlNRTFNlbGVjdCB7XG5cbiAgICB0aGlzLl9qb2luLnB1c2goW3RhYmxlTmFtZSwgb25dKTtcbiAgICBpZiAoISFjb2x1bW5zKSB7XG4gICAgICB0aGlzLl9jb2x1bW4uY29uY2F0KGNvbHVtbnMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGpvaW5MZWZ0KHRhYmxlTmFtZTogc3RyaW5nLCBvbjogc3RyaW5nLCBjb2x1bW5zPzogc3RyaW5nW10pOiBXZWJTUUxTZWxlY3Qge1xuXG4gICAgdGhpcy5fam9pbkxlZnQucHVzaChbdGFibGVOYW1lLCBvbl0pO1xuICAgIGlmICghIWNvbHVtbnMpIHtcbiAgICAgIHRoaXMuX2NvbHVtbi5jb25jYXQoY29sdW1ucyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgam9pblJpZ2h0KHRhYmxlTmFtZTogc3RyaW5nLCBvbjogc3RyaW5nLCBjb2x1bW5zOiBzdHJpbmdbXSk6IFdlYlNRTFNlbGVjdCB7XG5cbiAgICB0aGlzLl9qb2luUmlnaHQucHVzaChbdGFibGVOYW1lLCBvbl0pO1xuICAgIHRoaXMuX2NvbHVtbi5jb25jYXQoY29sdW1ucyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBvcmRlcihjb2x1bW46IHN0cmluZywgZGlyZWN0aW9uPzogb3JkZXJUeXBlKSB7XG5cbiAgICBpZiAoIWRpcmVjdGlvbikge1xuICAgICAgZGlyZWN0aW9uID0gJ0FTQyc7XG4gICAgfVxuXG4gICAgdGhpcy5fb3JkZXIucHVzaChgJHsgY29sdW1uIH0gJHsgZGlyZWN0aW9uIH1gKTtcbiAgfVxuXG4gIHJlbmRlcigpOiBzdHJpbmcge1xuXG4gICAgdGhpcy5fcGFyYW1zID0gW107XG4gICAgLypcbiAgICBpZighdGhpcy5fZnJvbSAmJiB0aGlzLlRhYmxlKXtcbiAgICAgIHRoaXMuZnJvbSh0aGlzLlRhYmxlLnNjaGVtYS5uYW1lKTtcbiAgICB9Ki9cblxuICAgIGxldCBzcWwgPSAnU0VMRUNUICc7XG4gICAgaWYgKHRoaXMuX2Rpc3RpbmN0KSB7XG4gICAgICBzcWwgKz0gJ0RJU1RJTkNUICc7XG4gICAgfVxuXG4gICAgc3FsICs9IHRoaXMuX2NvbHVtbi5qb2luKCcsICcpO1xuICAgIHNxbCArPSBgIEZST00gJHsgdGhpcy5fZnJvbSB9YDtcblxuICAgIC8vam9pblxuICAgIGlmICh0aGlzLl9qb2luLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAobGV0IGpvaW4gb2YgdGhpcy5fam9pbikge1xuICAgICAgICBzcWwgKz0gYCBKT0lOICR7IGpvaW5bMF0gfSBPTiAkeyBqb2luWzFdIH1gO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vbGVmdCBqb2luXG4gICAgaWYgKHRoaXMuX2pvaW5MZWZ0Lmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAobGV0IGpvaW4gb2YgdGhpcy5fam9pbkxlZnQpIHtcbiAgICAgICAgc3FsICs9IGAgSk9JTiBMRUZUICR7IGpvaW5bMF0gfSBPTiAkeyBqb2luWzFdIH1gO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vd2hlcmVcbiAgICBsZXQgd2hlcmVfc2l6ZSA9IHRoaXMuX3doZXJlLmxlbmd0aDtcbiAgICBsZXQgd2hlcmVBbmRMaW1pdCA9IHdoZXJlX3NpemUgLSAxO1xuICAgIGlmICh3aGVyZV9zaXplID4gMCkge1xuICAgICAgc3FsICs9ICcgV0hFUkUgJztcbiAgICAgIGZvciAobGV0IHcgaW4gdGhpcy5fd2hlcmUpIHtcbiAgICAgICAgbGV0IGk6IG51bWJlciA9IHBhcnNlSW50KHcpO1xuICAgICAgICBsZXQgd2hlcmUgPSB0aGlzLl93aGVyZVt3XTtcbiAgICAgICAgc3FsICs9IHdoZXJlWzBdO1xuICAgICAgICBpZiAod2hlcmVBbmRMaW1pdCAhPSBpKSB7XG4gICAgICAgICAgc3FsICs9ICcgQU5EICc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHdoZXJlWzFdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnd2hlcmUnLCB3aGVyZSwgd2hlcmVbMV0pO1xuICAgICAgICAgIHRoaXMuX3BhcmFtcyA9IHRoaXMuX3BhcmFtcy5jb25jYXQod2hlcmVbMV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3FsICs9IHRoaXMuX29yZGVyLmpvaW4oJyAnKTtcbiAgICBzcWwgKz0gJzsnO1xuICAgIHJldHVybiBzcWw7XG4gIH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGV4ZWN1dGUoKTogUHJvbWlzZTxTUUxSZXN1bHRTZXQ+IHtcblxuICAgIGxldCBzcWw6IHN0cmluZyA9IHRoaXMucmVuZGVyKCk7XG4gICAgY29uc29sZS5sb2coJ2V4ZWN1dGUnLCBzcWwsIHRoaXMuX3BhcmFtcyk7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5xdWVyeShzcWwsIHRoaXMuX3BhcmFtcyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgYWxsKCk6IFByb21pc2U8TW9kZWxbXT4ge1xuXG4gICAgbGV0IHByb21pc2VzOiBQcm9taXNlPE1vZGVsPltdID0gW107XG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IHRoaXMuZXhlY3V0ZSgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IHJlc3VsdC5yb3dzLmxlbmd0aCA+IGk7IGkrKykge1xuICAgICAgbGV0IHJvdyA9IHJlc3VsdC5yb3dzLml0ZW0oaSk7XG4gICAgICBwcm9taXNlcy5wdXNoKHRoaXMuTW9kZWwuc2NoZW1hLnBvcHVsYXRlRnJvbURCKHJvdykpO1xuICAgIH1cblxuICAgIGxldCByb3dzZXQgPSBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgaWYgKGRlYnVnLnNlbGVjdCkge1xuICAgICAgY29uc29sZS5sb2coJ0BzdG9yYWdvL29ybScsICdzZWxlY3Q6cm93c2V0Jywgcm93c2V0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcm93c2V0O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIG9uZSgpOiBQcm9taXNlPE1vZGVsPiB7XG5cbiAgICBsZXQgcm93c2V0ID0gYXdhaXQgdGhpcy5hbGwoKTtcbiAgICByZXR1cm4gcm93c2V0WzBdO1xuICB9XG59IiwiaW50ZXJmYWNlIERlYnVne1xuICBzZWxlY3Q6IGJvb2xlYW4sXG4gIGluc2VydDogYm9vbGVhbixcbiAgY3JlYXRlOiBib29sZWFuLFxuICBxdWVyeTogYm9vbGVhbixcbn1cblxuZXhwb3J0IGxldCBkZWJ1ZzogRGVidWcgPSB7XG4gIHNlbGVjdDogdHJ1ZSxcbiAgaW5zZXJ0OiB0cnVlLFxuICBjcmVhdGU6IHRydWUsXG4gIHF1ZXJ5OiB0cnVlLFxufSIsImltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi4vYWRhcHRlcnMvYWRhcHRlclwiO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IFNjaGVtYSB9IGZyb20gXCIuLi9zY2hlbWFcIjtcblxuZXhwb3J0IGVudW0gY29kZUVycm9yIHtcbiAgJ0VuZ2luZU5vdEltcGxlbWVudGVkJyA9ICdAc3RvcmFnby9vcm0vZmllbGQvZW5naW5lTm90SW1wbGVtZW50ZWQnLFxuICAnRGVmYXVsdFZhbHVlSXNOb3RWYWxpZCcgPSAnQHN0b3JhZ28vb3JtL2ZpZWxkL2RlZmF1bHRQYXJhbU5vdFZhbGlkJyxcbiAgJ0luY29ycmVjdFZhbHVlVG9EYicgPSAnQHN0b3JhZ28vb3JtL2ZpZWxkL0luY29ycmVjdFZhbHVlVG9TdG9yYWdlT25EQicsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlnIHtcbiAgZGVmYXVsdD86IGFueTtcbiAgcmVxdWlyZWQ6IGJvb2xlYW47XG4gIGxpbms/OiBzdHJpbmc7XG4gIGluZGV4OiBib29sZWFuO1xuICBwcmltYXJ5OiBib29sZWFuO1xufVxuXG5leHBvcnQgY29uc3QgZGVmYXVsdENvbmZpZzogQ29uZmlnID0ge1xuICByZXF1aXJlZDogZmFsc2UsXG4gIGluZGV4OiBmYWxzZSxcbiAgcHJpbWFyeTogZmFsc2Vcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEZpZWxkIHtcblxuICByZWFkb25seSBhYnN0cmFjdCBjb25maWc6IENvbmZpZztcbiAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0TmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm5hbWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0RGVmYXVsdFZhbHVlKCk6IGFueSB7XG5cbiAgICBsZXQgdmFsdWVEZWZhdWx0ID0gdGhpcy5jb25maWcuZGVmYXVsdDtcblxuICAgIGlmICh2YWx1ZURlZmF1bHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlRGVmYXVsdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHZhbHVlRGVmYXVsdCgpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZURlZmF1bHQ7XG4gIH1cblxuICBwdWJsaWMgaXNWaXJ0dWFsKCk6IGJvb2xlYW4ge1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmxpbmsgIT09IHVuZGVmaW5lZCAmJiAhdGhpcy5jb25maWcuaW5kZXgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBwb3B1bGF0ZShtb2RlbDogTW9kZWwsIHJvdzogeyBbaW5kZXg6IHN0cmluZ106IGFueTsgfSk6IFByb21pc2U8YW55PiB7XG5cbiAgICBsZXQgbmFtZSA9IHRoaXMuZ2V0TmFtZSgpO1xuICAgIGxldCB2YWx1ZSA9IHJvd1tuYW1lXTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5saW5rICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgbGV0IGxpbmtzOiBzdHJpbmdbXSA9IHRoaXMuY29uZmlnLmxpbmsuc3BsaXQoJy4nKTtcbiAgICAgIGxldCBpdGVtTmFtZSA9IGxpbmtzLnNoaWZ0KCk7XG5cbiAgICAgIGlmICghaXRlbU5hbWUgfHwgaXRlbU5hbWUgaW4gbW9kZWwuX19kYXRhKSB7XG4gICAgICAgIG1vZGVsW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhbHVlID0gYXdhaXQgbW9kZWwuX19kYXRhW2l0ZW1OYW1lXTtcblxuICAgICAgd2hpbGUgKGl0ZW1OYW1lID0gbGlua3Muc2hpZnQoKSkge1xuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgaWYgKGl0ZW1OYW1lIGluIHZhbHVlKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlW2l0ZW1OYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5mcm9tREIodmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHRvREIobW9kZWw6IE1vZGVsKTogYW55IHtcblxuICAgIGxldCBuYW1lID0gdGhpcy5nZXROYW1lKCk7XG4gICAgbGV0IHZhbHVlID0gbW9kZWxbbmFtZV07XG5cbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsdWUgPSB0aGlzLmdldERlZmF1bHRWYWx1ZSgpO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWx1ZSA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuICBcbiAgcHVibGljIGlzSnNvbk9iamVjdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgXG4gIHByb3RlY3RlZCBkZWZpbmVTZXR0ZXIobGluazogc3RyaW5nLCBzY2hlbWE6IFNjaGVtYSwgbW9kZWw6IE1vZGVsLCB2YWx1ZTogYW55KSA6IHZvaWQge1xuXG4gICAgaWYgKGxpbmspIHtcbiAgICAgIGxldCBsaXN0TmFtZSA9IGxpbmsuc3BsaXQoJy4nKTtcbiAgICAgIGxldCBmaWVsZE5hbWUgPSBsaXN0TmFtZVswXTtcbiAgICAgIGxldCB0YXJnZXQgPSBsaXN0TmFtZS5wb3AoKTtcbiAgICAgIGxldCBmaWVsZCA9IHNjaGVtYS5nZXRGaWVsZChmaWVsZE5hbWUpO1xuICAgICAgbGV0IGl0ZW0gOiBhbnkgPSBtb2RlbDtcbiAgICAgIFxuICAgICAgaWYoZmllbGQuaXNKc29uT2JqZWN0KCkpe1xuICAgICAgICBsZXQgaXRlbU5hbWUgPSBsaXN0TmFtZS5zaGlmdCgpO1xuICAgICAgICB3aGlsZShpdGVtTmFtZSl7XG4gICAgICAgICAgXG4gICAgICAgICAgaWYodHlwZW9mIGl0ZW1baXRlbU5hbWVdICE9PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICBpdGVtW2l0ZW1OYW1lXSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICBpdGVtID0gaXRlbVtpdGVtTmFtZV07XG4gICAgICAgICAgaXRlbU5hbWUgPSBsaXN0TmFtZS5zaGlmdCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmKHRhcmdldCl7XG4gICAgICAgIGl0ZW1bdGFyZ2V0XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBkZWZpbmVHZXR0ZXIobGluazogc3RyaW5nLCBzY2hlbWE6IFNjaGVtYSwgbW9kZWw6IE1vZGVsKSA6IGFueSB7XG5cbiAgICBpZiAobGluaykge1xuICAgICAgbGV0IGxpc3ROYW1lID0gbGluay5zcGxpdCgnLicpO1xuICAgICAgbGV0IGZpZWxkTmFtZSA9IGxpc3ROYW1lWzBdO1xuICAgICAgbGV0IHRhcmdldCA9IGxpc3ROYW1lLnBvcCgpO1xuICAgICAgbGV0IGZpZWxkID0gc2NoZW1hLmdldEZpZWxkKGZpZWxkTmFtZSk7XG4gICAgICBsZXQgaXRlbSA6IGFueSA9IG1vZGVsO1xuXG4gICAgICBpZihmaWVsZC5pc0pzb25PYmplY3QoKSl7XG4gICAgICAgIGxldCBpdGVtTmFtZSA9IGxpc3ROYW1lLnNoaWZ0KCk7XG4gICAgICAgIHdoaWxlKGl0ZW1OYW1lKXtcbiAgICAgICAgICBcbiAgICAgICAgICBpZih0eXBlb2YgaXRlbVtpdGVtTmFtZV0gIT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIHJldHVybiBpdGVtW2l0ZW1OYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgaXRlbSA9IGl0ZW1baXRlbU5hbWVdO1xuICAgICAgICAgIGl0ZW1OYW1lID0gbGlzdE5hbWUuc2hpZnQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBpZih0YXJnZXQpe1xuICAgICAgICByZXR1cm4gaXRlbVt0YXJnZXRdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgcHVibGljIGRlZmluZVByb3BlcnR5KHNjaGVtYTogU2NoZW1hLCBtb2RlbDogTW9kZWwpOiB2b2lkIHtcbiAgICBcbiAgICBcbiAgICBsZXQgbGluayA9IHRoaXMuY29uZmlnLmxpbms7XG4gICAgaWYgKGxpbmspIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2RlbCwgdGhpcy5uYW1lLCB7XG4gICAgICAgICdzZXQnOiB0aGlzLmRlZmluZVNldHRlci5iaW5kKHRoaXMsIGxpbmssIHNjaGVtYSwgbW9kZWwpLFxuICAgICAgICAnZ2V0JzogdGhpcy5kZWZpbmVHZXR0ZXIuYmluZCh0aGlzLCBsaW5rLCBzY2hlbWEsIG1vZGVsKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGFic3RyYWN0IGZyb21EQih2YWx1ZTogYW55KTogYW55O1xuICBhYnN0cmFjdCBjYXN0REIoYWRhcHRlcjogQWRhcHRlcik6IHN0cmluZztcbn1cbiIsImltcG9ydCB7IFRleHQgfSBmcm9tIFwiLi90ZXh0XCI7XG5pbXBvcnQgeyBVVUlEIH0gZnJvbSBcIi4vdXVpZFwiO1xuaW1wb3J0IHsgSnNvbiB9IGZyb20gXCIuL2pzb25cIjtcbmV4cG9ydCB7IEpzb25Db25maWcgfSBmcm9tIFwiLi9qc29uXCI7XG5cbmV4cG9ydCBjb25zdCBmaWVsZHMgPSB7XG4gIFRleHQ6IFRleHQsXG4gIFVVSUQ6IFVVSUQsXG4gIEpzb246IEpzb24sXG59IiwiaW1wb3J0IHsgQWRhcHRlciwgZW5naW5lS2luZCB9IGZyb20gXCIuLi9hZGFwdGVycy9hZGFwdGVyXCI7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgRmllbGQsIENvbmZpZywgZGVmYXVsdENvbmZpZywgY29kZUVycm9yIH0gZnJvbSBcIi4vZmllbGRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBKc29uQ29uZmlnIGV4dGVuZHMgQ29uZmlnIHtcbiAgdHlwZTogJ2xpc3QnIHwgJ29iamVjdCcsXG4gIGRlZmF1bHQ/OiAnc3RyaW5nJyB8IEZ1bmN0aW9uIHwgT2JqZWN0O1xufVxuXG5sZXQganNvbkRlZmF1bHRDb25maWc6IEpzb25Db25maWcgPSB7XG4gIC4uLmRlZmF1bHRDb25maWcsXG4gIHR5cGU6ICdvYmplY3QnLFxufVxuXG5leHBvcnQgY2xhc3MgSnNvbiBleHRlbmRzIEZpZWxkIHtcblxuICByZWFkb25seSBjb25maWc6IEpzb25Db25maWc7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBjb25maWc6IFBhcnRpYWw8SnNvbkNvbmZpZz4gPSBqc29uRGVmYXVsdENvbmZpZykge1xuXG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5qc29uRGVmYXVsdENvbmZpZyxcbiAgICAgIC4uLmNvbmZpZyxcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGdldERlZmF1bHRWYWx1ZSgpOiBhbnkge1xuXG4gICAgbGV0IHZhbHVlRGVmYXVsdCA9IHN1cGVyLmdldERlZmF1bHRWYWx1ZSgpO1xuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZURlZmF1bHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZURlZmF1bHQgPSBKU09OLnBhcnNlKHZhbHVlRGVmYXVsdCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRocm93IHtcbiAgICAgICAgICBjb2RlOiBjb2RlRXJyb3IuRGVmYXVsdFZhbHVlSXNOb3RWYWxpZCxcbiAgICAgICAgICBtZXNzYWdlOiBgRGVmYXVsdCB2YWx1ZSBvbiBKU09OIGZpZWxkIGlzIG5vdCBhIHZhbGlkIGpzb25gXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlRGVmYXVsdDtcbiAgfVxuXG4gIHB1YmxpYyBmcm9tREIodmFsdWU6IGFueSkge1xuXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09ICcnKSB7XG4gICAgICBsZXQga2luZCA9IHRoaXMuY29uZmlnLnR5cGU7XG4gICAgICBpZiAoa2luZCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBKU09OLnBhcnNlKHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBjYXN0REIoYWRhcHRlcjogQWRhcHRlcik6IHN0cmluZyB7XG5cbiAgICBpZiAoYWRhcHRlci5lbmdpbmUgPT0gZW5naW5lS2luZC5XZWJTUUwpIHtcbiAgICAgIHJldHVybiAnVEVYVCc7XG4gICAgfVxuXG4gICAgdGhyb3cge1xuICAgICAgY29kZTogY29kZUVycm9yLkVuZ2luZU5vdEltcGxlbWVudGVkLFxuICAgICAgbWVzc2FnZTogYEVuZ2luZSAkeyBhZGFwdGVyLmVuZ2luZSB9IG5vdCBpbXBsZW1lbnRlZCBvbiBGaWVsZCBKc29uYFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgaXNKc29uT2JqZWN0KCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmNvbmZpZy50eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHVibGljIHRvREIobW9kZWw6IE1vZGVsKTogc3RyaW5nIHwgbnVsbCB7XG5cbiAgICBsZXQgdmFsdWUgPSBzdXBlci50b0RCKG1vZGVsKTtcblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RyaW5naWZ5VG9EYih2YWx1ZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RyaW5naWZ5VG9EYih2YWx1ZTogYW55KTogc3RyaW5nIHtcblxuICAgIGxldCBraW5kID0gdGhpcy5jb25maWcudHlwZTtcbiAgICBsZXQgZXJyb3IgPSB7XG4gICAgICBjb2RlOiBjb2RlRXJyb3IuSW5jb3JyZWN0VmFsdWVUb0RiLFxuICAgICAgbWVzc2FnZTogYHZhbHVlIGlzIG5vdCBhIHZhbGlkIGpzb25gLFxuICAgIH07XG5cbiAgICAvKiBUZXN0IGlmIHZhbHVlIGlzIHZhbGlkICovXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIEpTT04ucGFyc2UodmFsdWUpOyAvL2p1c3QgdGVzdFxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICBpZiAoa2luZCAhPT0gJ2xpc3QnKSB7XG4gICAgICAgICAgICBlcnJvci5tZXNzYWdlID0gJ0pTT04gaXMgYSBvYmplY3QsIGJ1dCBtdXN0IGJlIGEgbGlzdCc7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGtpbmQgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBlcnJvci5tZXNzYWdlID0gJ0pTT04gaXMgYSBsaXN0LCBidXQgbXVzdCBiZSBhIG9iamVjdCc7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyogY29udmVydCB0byBzdHJpbmcgKi9cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufSIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBBZGFwdGVyLCBlbmdpbmVLaW5kIH0gZnJvbSBcIi4uL2FkYXB0ZXJzL2FkYXB0ZXJcIjtcbmltcG9ydCB7IEZpZWxkLCBDb25maWcsIGRlZmF1bHRDb25maWcsIGNvZGVFcnJvciB9IGZyb20gXCIuL2ZpZWxkXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGV4dENvbmZpZyBleHRlbmRzIENvbmZpZyB7IH1cblxuZXhwb3J0IGNsYXNzIFRleHQgZXh0ZW5kcyBGaWVsZCB7XG5cbiAgcmVhZG9ubHkgY29uZmlnOiBUZXh0Q29uZmlnO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgY29uZmlnOiBQYXJ0aWFsPFRleHRDb25maWc+ID0gZGVmYXVsdENvbmZpZykge1xuXG4gICAgc3VwZXIobmFtZSk7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAuLi5kZWZhdWx0Q29uZmlnLFxuICAgICAgLi4uY29uZmlnLFxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmcm9tREIodmFsdWU6IGFueSk6IGFueSB7XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgdG9EQihtb2RlbDogTW9kZWwpOiBhbnkge1xuXG4gICAgbGV0IG5hbWUgPSB0aGlzLmdldE5hbWUoKTtcbiAgICBsZXQgdmFsdWUgPSBtb2RlbFtuYW1lXTtcblxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdmFsdWUudHJpbSgpO1xuICAgIH1cblxuICAgIGlmICgndG9TdHJpbmcnIGluIHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyBjYXN0REIoYWRhcHRlcjogQWRhcHRlcik6IHN0cmluZyB7XG5cbiAgICBpZiAoYWRhcHRlci5lbmdpbmUgPT0gZW5naW5lS2luZC5XZWJTUUwpIHtcbiAgICAgIHJldHVybiAnVEVYVCc7XG4gICAgfVxuXG4gICAgdGhyb3cge1xuICAgICAgY29kZTogY29kZUVycm9yLkVuZ2luZU5vdEltcGxlbWVudGVkLFxuICAgICAgbWVzc2FnZTogYEVuZ2luZSAkeyBhZGFwdGVyLmVuZ2luZSB9IG5vdCBpbXBsZW1lbnRlZCBvbiBmaWVsZCBUZXh0YFxuICAgIH07XG4gIH1cbn0iLCJpbXBvcnQgeyBBZGFwdGVyLCBlbmdpbmVLaW5kIH0gZnJvbSBcIi4uL2FkYXB0ZXJzL2FkYXB0ZXJcIjtcbmltcG9ydCB7IEZpZWxkLCBDb25maWcsIGRlZmF1bHRDb25maWcsIGNvZGVFcnJvciB9IGZyb20gXCIuL2ZpZWxkXCI7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgdjQgYXMgdXVpZCB9IGZyb20gJ3V1aWQnO1xuXG5leHBvcnQgY2xhc3MgVVVJRCBleHRlbmRzIEZpZWxkIHtcblxuICByZWFkb25seSBjb25maWc6IENvbmZpZztcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGNvbmZpZzogUGFydGlhbDxDb25maWc+ID0gZGVmYXVsdENvbmZpZyl7XG5cbiAgICBzdXBlcihuYW1lKTtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIC4uLmRlZmF1bHRDb25maWcsXG4gICAgICAuLi5jb25maWcsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBjYXN0REIoYWRhcHRlcjogQWRhcHRlcik6IHN0cmluZyB7XG5cbiAgICBpZihhZGFwdGVyLmVuZ2luZSA9PSBlbmdpbmVLaW5kLldlYlNRTCl7XG4gICAgICByZXR1cm4gJ1RFWFQnO1xuICAgIH1cblxuICAgIHRocm93IHtjb2RlOiBjb2RlRXJyb3IuRW5naW5lTm90SW1wbGVtZW50ZWQsIFxuICAgICAgbWVzc2FnZTogYEVuZ2luZSAke2FkYXB0ZXIuZW5naW5lfSBub3QgaW1wbGVtZW50ZWQgb24gRmllbGQgVVVJRGB9O1xuICB9XG5cbiAgcHVibGljIGZyb21EQih2YWx1ZTogYW55KSB7XG4gICAgXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIGdldERlZmF1bHRWYWx1ZSgpIDogYW55IHtcbiAgICBcbiAgICBsZXQgdmFsdWUgPSBzdXBlci5nZXREZWZhdWx0VmFsdWUoKTtcblxuICAgIGlmKHZhbHVlID09PSB1bmRlZmluZWQgJiYgdGhpcy5jb25maWcucHJpbWFyeSl7XG4gICAgICB2YWx1ZSA9IHV1aWQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgdG9EQihtb2RlbDogTW9kZWwpIDogYW55IHtcblxuICAgIGxldCB2YWx1ZSA9IHN1cGVyLnRvREIobW9kZWwpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufSIsImltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi9hZGFwdGVycy9hZGFwdGVyXCI7XG5cbnR5cGUgdGFza0NhbGxiYWNrID0geyAodHJhbnNhY3Rpb246IFNRTFRyYW5zYWN0aW9uKTogUHJvbWlzZTx2b2lkPiB9O1xuXG5pbnRlcmZhY2UgdGFza1ZlcnNpb24ge1xuICBbdmVyc2lvbjogbnVtYmVyXTogdGFza0NhbGxiYWNrO1xufTtcblxuZXhwb3J0IGNsYXNzIE1pZ3JhdGlvbiB7XG5cbiAgcHJvdGVjdGVkIGFkYXB0ZXI6IEFkYXB0ZXI7XG4gIHByaXZhdGUgdGFza3M6IHRhc2tWZXJzaW9uID0ge307XG4gIHByaXZhdGUgZmlyc3RBY2Nlc3M/OiB0YXNrQ2FsbGJhY2s7XG5cbiAgY29uc3RydWN0b3IoYWRhcHRlcjogQWRhcHRlcikge1xuICAgIHRoaXMuYWRhcHRlciA9IGFkYXB0ZXI7XG4gIH1cblxuICBwcm90ZWN0ZWQgbWFrZSgpOiB2b2lkIHsgfVxuXG4gIHB1YmxpYyBhc3luYyBydW4oKTogUHJvbWlzZTx2b2lkPiB7XG5cbiAgICB0aGlzLm1ha2UoKTtcblxuICAgIGlmICh0aGlzLmZpcnN0QWNjZXNzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IHsgY29kZTogbnVsbCwgbWVzc2FnZTogYEZpcnN0QWNjZXNzIE1pZ3JhdGlvbiBub3QgaW1wbGVtZW50ZWQhYCB9O1xuICAgIH1cblxuICAgIGxldCB2ZXJzaW9uID0gdGhpcy5hZGFwdGVyLmdldFZlcnNpb24oKTtcbiAgICBpZiAodmVyc2lvbiA9PT0gJycpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuY2hhbmdlVmVyc2lvbigwLCB0aGlzLmZpcnN0QWNjZXNzKTtcbiAgICB9XG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuXG4gICAgICB2ZXJzaW9uKys7XG4gICAgICBsZXQgdGFzayA9IHRoaXMudGFza3NbdmVyc2lvbl07XG4gICAgICBpZiAodGFzayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCB0aGlzLmFkYXB0ZXIuY2hhbmdlVmVyc2lvbih2ZXJzaW9uLCB0YXNrKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVnaXN0ZXJGaXJzdEFjY2VzcyhjYWxsYmFjazogdGFza0NhbGxiYWNrKTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy5maXJzdEFjY2VzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyB7IGNvZGU6IHVuZGVmaW5lZCwgbWVzc2FnZTogYGZpcnN0QWNjZXNzIGNhbGxiYWNrIGFscmVkeSByZWdpc3RyZWRgIH07XG4gICAgfVxuXG4gICAgdGhpcy5maXJzdEFjY2VzcyA9IGNhbGxiYWNrO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlZ2lzdGVyKHZlcnNpb246IG51bWJlciwgY2FsbGJhY2s6IHRhc2tDYWxsYmFjayk6IHZvaWQge1xuXG4gICAgaWYgKHRoaXMudGFza3NbdmVyc2lvbl0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgeyBjb2RlOiB1bmRlZmluZWQsIG1lc3NhZ2U6IGBjYWxsYmFjayB2ZXJzaW9uICR7IHZlcnNpb24gfSBhbHJlZHkgcmVnaXN0cmVkYCB9O1xuICAgIH1cblxuICAgIHRoaXMudGFza3NbdmVyc2lvbl0gPSBjYWxsYmFjaztcbiAgfVxufSIsImltcG9ydCB7IFNjaGVtYSB9IGZyb20gJy4vc2NoZW1hJztcbmltcG9ydCB7IFNlbGVjdCB9IGZyb20gJy4vYWRhcHRlcnMvc2VsZWN0JztcbmltcG9ydCB7IHBhcmFtc1R5cGUgfSBmcm9tICcuL2FkYXB0ZXJzL3F1ZXJ5JztcbmltcG9ydCB7IENyZWF0ZSB9IGZyb20gJy4vYWRhcHRlcnMvY3JlYXRlJztcblxuaW50ZXJmYWNlIFBvcHVsYXRlIHtcbiAgW25hbWU6IHN0cmluZ106IFByb21pc2U8YW55Pjtcbn1cblxuZXhwb3J0IGNsYXNzIE1vZGVsIHtcblxuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IHNjaGVtYTogU2NoZW1hO1xuICBwdWJsaWMgX19kYXRhOiBQb3B1bGF0ZSA9IHt9O1xuXG4gIFtwcm9wOiBzdHJpbmddOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoKXtcblxuICAgIGxldCBzY2hlbWE6IFNjaGVtYSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3Rvci5zY2hlbWE7XG4gICAgc2NoZW1hLmRlZmluZVByb3BlcnRpZXModGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2F2ZSgpOiBQcm9taXNlPGFueT4ge1xuXG4gICAgbGV0IHNjaGVtYTogU2NoZW1hID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yLnNjaGVtYTtcblxuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLl9fZGF0YSkubGVuZ3RoID09PSAwKSB7XG4gICAgICBsZXQgaW5zZXJ0ID0gc2NoZW1hLmluc2VydCgpO1xuICAgICAgaW5zZXJ0LmFkZCh0aGlzKTtcbiAgICAgIHJldHVybiBpbnNlcnQuc2F2ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoMSk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGZpbmQod2hlcmU6IHN0cmluZywgcGFyYW06IHBhcmFtc1R5cGUpOiBQcm9taXNlPE1vZGVsfHVuZGVmaW5lZD4ge1xuXG4gICAgbGV0IHNlbGVjdDogU2VsZWN0ID0gdGhpcy5zZWxlY3QoKTtcbiAgICBzZWxlY3Qud2hlcmUod2hlcmUsIHBhcmFtKTtcbiAgICByZXR1cm4gc2VsZWN0Lm9uZSgpO1xuICB9O1xuXG4gIHB1YmxpYyBzdGF0aWMgc2VsZWN0KCk6IFNlbGVjdCB7XG5cbiAgICByZXR1cm4gdGhpcy5zY2hlbWEuc2VsZWN0KCk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGNyZWF0ZSgpOiBDcmVhdGUge1xuXG4gICAgcmV0dXJuIHRoaXMuc2NoZW1hLmNyZWF0ZSgpO1xuICB9XG5cbn1cbiIsImltcG9ydCB7IEFkYXB0ZXIgfSBmcm9tIFwiLi9hZGFwdGVycy9hZGFwdGVyXCI7XG5pbXBvcnQgeyBTZWxlY3QgfSBmcm9tIFwiLi9hZGFwdGVycy9zZWxlY3RcIjtcbmltcG9ydCB7IEluc2VydCB9IGZyb20gXCIuL2FkYXB0ZXJzL2luc2VydFwiO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi9tb2RlbFwiO1xuaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi9maWVsZC9maWVsZFwiO1xuaW1wb3J0IHsgc2Vzc2lvbiB9IGZyb20gJy4vc2Vzc2lvbic7XG5pbXBvcnQgeyBDcmVhdGUgfSBmcm9tIFwiLi9hZGFwdGVycy9jcmVhdGVcIjtcblxuZXhwb3J0IGNsYXNzIFNjaGVtYSB7XG5cbiAgcHJvdGVjdGVkIG5hbWU6IHN0cmluZztcbiAgcHJvdGVjdGVkIGZpZWxkczogRmllbGRbXTtcbiAgcHJvdGVjdGVkIGFkYXB0ZXI6IEFkYXB0ZXI7XG4gIHByb3RlY3RlZCBNb2RlbDogdHlwZW9mIE1vZGVsO1xuXG4gIGNvbnN0cnVjdG9yKG1vZGVsOiB0eXBlb2YgTW9kZWwsIG5hbWU6IHN0cmluZywgZmllbGRzOiBGaWVsZFtdLCBhZGFwdGVyOiBBZGFwdGVyID0gc2Vzc2lvbi5hZGFwdGVyKSB7XG5cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuZmllbGRzID0gZmllbGRzO1xuICAgIHRoaXMuYWRhcHRlciA9IGFkYXB0ZXI7XG4gICAgdGhpcy5Nb2RlbCA9IG1vZGVsO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZSgpOiBDcmVhdGUge1xuXG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5jcmVhdGUodGhpcy5Nb2RlbCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0TmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm5hbWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0RmllbGRzKCk6IEZpZWxkW10ge1xuICAgIHJldHVybiB0aGlzLmZpZWxkcztcbiAgfVxuXG4gIHB1YmxpYyBnZXRGaWVsZChuYW1lOiBzdHJpbmcpIDogRmllbGQge1xuXG4gICAgZm9yKGxldCBmaWVsZCBvZiB0aGlzLmdldEZpZWxkcygpKXtcbiAgICAgIGlmKG5hbWUgPT0gZmllbGQuZ2V0TmFtZSgpKXtcbiAgICAgICAgcmV0dXJuIGZpZWxkO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRocm93IHtjb2RlOiBudWxsLCBtZXNzYWdlOiBgRmllbGQgd2l0aCBuYW1lOiAke25hbWV9IG5vdCBleGlzdHMgaW4gJHt0aGlzLm5hbWV9YH07XG4gIH1cblxuICBwdWJsaWMgZ2V0UmVhbEZpZWxkcygpOiBGaWVsZFtdIHtcblxuICAgIGxldCBmaWVsZEZpbHRlcmVkOiBGaWVsZFtdID0gW107XG4gICAgZm9yIChsZXQgZmllbGQgb2YgdGhpcy5maWVsZHMpIHtcblxuICAgICAgaWYgKCFmaWVsZC5pc1ZpcnR1YWwoKSkge1xuICAgICAgICBmaWVsZEZpbHRlcmVkLnB1c2goZmllbGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmaWVsZEZpbHRlcmVkO1xuICB9XG5cbiAgcHVibGljIGdldENvbHVtbnMoKTogc3RyaW5nW10ge1xuXG4gICAgbGV0IGNvbHVtbnM6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQgZmllbGQgb2YgdGhpcy5maWVsZHMpIHtcblxuICAgICAgaWYgKCFmaWVsZC5pc1ZpcnR1YWwoKSkge1xuICAgICAgICBjb2x1bW5zLnB1c2goZmllbGQuZ2V0TmFtZSgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY29sdW1ucztcbiAgfVxuXG4gIHB1YmxpYyBnZXRBZGFwdGVyKCk6IEFkYXB0ZXIge1xuICAgIHJldHVybiB0aGlzLmFkYXB0ZXI7XG4gIH1cblxuICBwdWJsaWMgc2VsZWN0KCk6IFNlbGVjdCB7XG4gICAgbGV0IHNlbGVjdDogU2VsZWN0ID0gdGhpcy5hZGFwdGVyLnNlbGVjdCh0aGlzLk1vZGVsKTtcbiAgICBzZWxlY3QuZnJvbSh0aGlzLmdldE5hbWUoKSwgdGhpcy5nZXRDb2x1bW5zKCkpO1xuICAgIHJldHVybiBzZWxlY3Q7XG4gIH1cblxuICBwdWJsaWMgaW5zZXJ0KCk6IEluc2VydCB7XG5cbiAgICBsZXQgaW5zZXJ0OiBJbnNlcnQgPSB0aGlzLmFkYXB0ZXIuaW5zZXJ0KHRoaXMuTW9kZWwpO1xuICAgIHJldHVybiBpbnNlcnQ7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcG9wdWxhdGVGcm9tREIocm93OiB7IFtpbmRleDogc3RyaW5nXTogYW55OyB9LCBtb2RlbDogTW9kZWwgPSBuZXcgdGhpcy5Nb2RlbCgpKTogUHJvbWlzZTxNb2RlbD4ge1xuXG4gICAgbGV0IHByb21pc2VzOiBQcm9taXNlPGFueT5bXSA9IFtdO1xuICAgIGxldCBmaWVsZHMgPSB0aGlzLmdldFJlYWxGaWVsZHMoKTtcbiAgICBsZXQga2V5czogc3RyaW5nW10gPSBbXTtcbiAgXG4gICAgZm9yIChsZXQgZmllbGQgb2YgZmllbGRzKSB7XG4gICAgICBsZXQgbmFtZSA9IGZpZWxkLmdldE5hbWUoKTtcbiAgICAgIGxldCBwcm9taXNlUG9wdWxhdGUgPSBmaWVsZC5wb3B1bGF0ZShtb2RlbCwgcm93KTtcbiAgICAgIG1vZGVsLl9fZGF0YVtuYW1lXSA9IHByb21pc2VQb3B1bGF0ZTtcbiAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZVBvcHVsYXRlKTtcbiAgICAgIGtleXMucHVzaChuYW1lKTtcbiAgICB9XG5cbiAgICBsZXQgZGF0YSA9IGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICBmb3IobGV0IGsgaW4ga2V5cyl7XG4gICAgICBsZXQgbmFtZSA9IGtleXNba107XG4gICAgICBtb2RlbFtuYW1lXSA9IGRhdGFba107XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZGVsO1xuICB9XG5cbiAgcHVibGljIGRlZmluZVByb3BlcnRpZXMobW9kZWw6IE1vZGVsKSA6IHZvaWQge1xuXG4gICAgZm9yKGxldCBmaWVsZCBvZiB0aGlzLmdldEZpZWxkcygpKXtcbiAgICAgIGZpZWxkLmRlZmluZVByb3BlcnR5KHRoaXMsIG1vZGVsKTtcbiAgICB9XG4gIH0gXG59IiwiaW1wb3J0IHsgQWRhcHRlciB9IGZyb20gJy4vYWRhcHRlcnMvYWRhcHRlcic7XG5pbXBvcnQgeyBXZWJTUUxBZGFwdGVyIH0gZnJvbSAnLi9hZGFwdGVycy93ZWJzcWwvYWRhcHRlcic7XG5cbmludGVyZmFjZSBEZWZhdWx0cyB7XG4gIGFkYXB0ZXI6IEFkYXB0ZXI7XG59XG5cbmV4cG9ydCBjb25zdCBzZXNzaW9uOiBEZWZhdWx0cyA9IHtcbiAgYWRhcHRlcjogbmV3IFdlYlNRTEFkYXB0ZXIoJ2RlZmF1bHQnLCAnZGVmYXVsdCBkYicsIDEwMjQqKjIpLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldERlZmF1bHRBZGFwdGVyKGFkYXB0ZXI6IEFkYXB0ZXIpe1xuICBzZXNzaW9uLmFkYXB0ZXIgPSBhZGFwdGVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdEFkYXB0ZXIoKSA6IEFkYXB0ZXIge1xuICByZXR1cm4gc2Vzc2lvbi5hZGFwdGVyO1xufVxuIiwiZXhwb3J0IHsgZGVmYXVsdCBhcyB2MSB9IGZyb20gJy4vdjEuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2MyB9IGZyb20gJy4vdjMuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2NCB9IGZyb20gJy4vdjQuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2NSB9IGZyb20gJy4vdjUuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBOSUwgfSBmcm9tICcuL25pbC5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHZlcnNpb24gfSBmcm9tICcuL3ZlcnNpb24uanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB2YWxpZGF0ZSB9IGZyb20gJy4vdmFsaWRhdGUuanMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzdHJpbmdpZnkgfSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHBhcnNlIH0gZnJvbSAnLi9wYXJzZS5qcyc7IiwiLypcbiAqIEJyb3dzZXItY29tcGF0aWJsZSBKYXZhU2NyaXB0IE1ENVxuICpcbiAqIE1vZGlmaWNhdGlvbiBvZiBKYXZhU2NyaXB0IE1ENVxuICogaHR0cHM6Ly9naXRodWIuY29tL2JsdWVpbXAvSmF2YVNjcmlwdC1NRDVcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMSwgU2ViYXN0aWFuIFRzY2hhblxuICogaHR0cHM6Ly9ibHVlaW1wLm5ldFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcbiAqIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKlxuICogQmFzZWQgb25cbiAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgUlNBIERhdGEgU2VjdXJpdHksIEluYy4gTUQ1IE1lc3NhZ2VcbiAqIERpZ2VzdCBBbGdvcml0aG0sIGFzIGRlZmluZWQgaW4gUkZDIDEzMjEuXG4gKiBWZXJzaW9uIDIuMiBDb3B5cmlnaHQgKEMpIFBhdWwgSm9obnN0b24gMTk5OSAtIDIwMDlcbiAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSBCU0QgTGljZW5zZVxuICogU2VlIGh0dHA6Ly9wYWpob21lLm9yZy51ay9jcnlwdC9tZDUgZm9yIG1vcmUgaW5mby5cbiAqL1xuZnVuY3Rpb24gbWQ1KGJ5dGVzKSB7XG4gIGlmICh0eXBlb2YgYnl0ZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIG1zZyA9IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChieXRlcykpOyAvLyBVVEY4IGVzY2FwZVxuXG4gICAgYnl0ZXMgPSBuZXcgVWludDhBcnJheShtc2cubGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXNnLmxlbmd0aDsgKytpKSB7XG4gICAgICBieXRlc1tpXSA9IG1zZy5jaGFyQ29kZUF0KGkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtZDVUb0hleEVuY29kZWRBcnJheSh3b3Jkc1RvTWQ1KGJ5dGVzVG9Xb3JkcyhieXRlcyksIGJ5dGVzLmxlbmd0aCAqIDgpKTtcbn1cbi8qXG4gKiBDb252ZXJ0IGFuIGFycmF5IG9mIGxpdHRsZS1lbmRpYW4gd29yZHMgdG8gYW4gYXJyYXkgb2YgYnl0ZXNcbiAqL1xuXG5cbmZ1bmN0aW9uIG1kNVRvSGV4RW5jb2RlZEFycmF5KGlucHV0KSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgdmFyIGxlbmd0aDMyID0gaW5wdXQubGVuZ3RoICogMzI7XG4gIHZhciBoZXhUYWIgPSAnMDEyMzQ1Njc4OWFiY2RlZic7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGgzMjsgaSArPSA4KSB7XG4gICAgdmFyIHggPSBpbnB1dFtpID4+IDVdID4+PiBpICUgMzIgJiAweGZmO1xuICAgIHZhciBoZXggPSBwYXJzZUludChoZXhUYWIuY2hhckF0KHggPj4+IDQgJiAweDBmKSArIGhleFRhYi5jaGFyQXQoeCAmIDB4MGYpLCAxNik7XG4gICAgb3V0cHV0LnB1c2goaGV4KTtcbiAgfVxuXG4gIHJldHVybiBvdXRwdXQ7XG59XG4vKipcbiAqIENhbGN1bGF0ZSBvdXRwdXQgbGVuZ3RoIHdpdGggcGFkZGluZyBhbmQgYml0IGxlbmd0aFxuICovXG5cblxuZnVuY3Rpb24gZ2V0T3V0cHV0TGVuZ3RoKGlucHV0TGVuZ3RoOCkge1xuICByZXR1cm4gKGlucHV0TGVuZ3RoOCArIDY0ID4+PiA5IDw8IDQpICsgMTQgKyAxO1xufVxuLypcbiAqIENhbGN1bGF0ZSB0aGUgTUQ1IG9mIGFuIGFycmF5IG9mIGxpdHRsZS1lbmRpYW4gd29yZHMsIGFuZCBhIGJpdCBsZW5ndGguXG4gKi9cblxuXG5mdW5jdGlvbiB3b3Jkc1RvTWQ1KHgsIGxlbikge1xuICAvKiBhcHBlbmQgcGFkZGluZyAqL1xuICB4W2xlbiA+PiA1XSB8PSAweDgwIDw8IGxlbiAlIDMyO1xuICB4W2dldE91dHB1dExlbmd0aChsZW4pIC0gMV0gPSBsZW47XG4gIHZhciBhID0gMTczMjU4NDE5MztcbiAgdmFyIGIgPSAtMjcxNzMzODc5O1xuICB2YXIgYyA9IC0xNzMyNTg0MTk0O1xuICB2YXIgZCA9IDI3MTczMzg3ODtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpICs9IDE2KSB7XG4gICAgdmFyIG9sZGEgPSBhO1xuICAgIHZhciBvbGRiID0gYjtcbiAgICB2YXIgb2xkYyA9IGM7XG4gICAgdmFyIG9sZGQgPSBkO1xuICAgIGEgPSBtZDVmZihhLCBiLCBjLCBkLCB4W2ldLCA3LCAtNjgwODc2OTM2KTtcbiAgICBkID0gbWQ1ZmYoZCwgYSwgYiwgYywgeFtpICsgMV0sIDEyLCAtMzg5NTY0NTg2KTtcbiAgICBjID0gbWQ1ZmYoYywgZCwgYSwgYiwgeFtpICsgMl0sIDE3LCA2MDYxMDU4MTkpO1xuICAgIGIgPSBtZDVmZihiLCBjLCBkLCBhLCB4W2kgKyAzXSwgMjIsIC0xMDQ0NTI1MzMwKTtcbiAgICBhID0gbWQ1ZmYoYSwgYiwgYywgZCwgeFtpICsgNF0sIDcsIC0xNzY0MTg4OTcpO1xuICAgIGQgPSBtZDVmZihkLCBhLCBiLCBjLCB4W2kgKyA1XSwgMTIsIDEyMDAwODA0MjYpO1xuICAgIGMgPSBtZDVmZihjLCBkLCBhLCBiLCB4W2kgKyA2XSwgMTcsIC0xNDczMjMxMzQxKTtcbiAgICBiID0gbWQ1ZmYoYiwgYywgZCwgYSwgeFtpICsgN10sIDIyLCAtNDU3MDU5ODMpO1xuICAgIGEgPSBtZDVmZihhLCBiLCBjLCBkLCB4W2kgKyA4XSwgNywgMTc3MDAzNTQxNik7XG4gICAgZCA9IG1kNWZmKGQsIGEsIGIsIGMsIHhbaSArIDldLCAxMiwgLTE5NTg0MTQ0MTcpO1xuICAgIGMgPSBtZDVmZihjLCBkLCBhLCBiLCB4W2kgKyAxMF0sIDE3LCAtNDIwNjMpO1xuICAgIGIgPSBtZDVmZihiLCBjLCBkLCBhLCB4W2kgKyAxMV0sIDIyLCAtMTk5MDQwNDE2Mik7XG4gICAgYSA9IG1kNWZmKGEsIGIsIGMsIGQsIHhbaSArIDEyXSwgNywgMTgwNDYwMzY4Mik7XG4gICAgZCA9IG1kNWZmKGQsIGEsIGIsIGMsIHhbaSArIDEzXSwgMTIsIC00MDM0MTEwMSk7XG4gICAgYyA9IG1kNWZmKGMsIGQsIGEsIGIsIHhbaSArIDE0XSwgMTcsIC0xNTAyMDAyMjkwKTtcbiAgICBiID0gbWQ1ZmYoYiwgYywgZCwgYSwgeFtpICsgMTVdLCAyMiwgMTIzNjUzNTMyOSk7XG4gICAgYSA9IG1kNWdnKGEsIGIsIGMsIGQsIHhbaSArIDFdLCA1LCAtMTY1Nzk2NTEwKTtcbiAgICBkID0gbWQ1Z2coZCwgYSwgYiwgYywgeFtpICsgNl0sIDksIC0xMDY5NTAxNjMyKTtcbiAgICBjID0gbWQ1Z2coYywgZCwgYSwgYiwgeFtpICsgMTFdLCAxNCwgNjQzNzE3NzEzKTtcbiAgICBiID0gbWQ1Z2coYiwgYywgZCwgYSwgeFtpXSwgMjAsIC0zNzM4OTczMDIpO1xuICAgIGEgPSBtZDVnZyhhLCBiLCBjLCBkLCB4W2kgKyA1XSwgNSwgLTcwMTU1ODY5MSk7XG4gICAgZCA9IG1kNWdnKGQsIGEsIGIsIGMsIHhbaSArIDEwXSwgOSwgMzgwMTYwODMpO1xuICAgIGMgPSBtZDVnZyhjLCBkLCBhLCBiLCB4W2kgKyAxNV0sIDE0LCAtNjYwNDc4MzM1KTtcbiAgICBiID0gbWQ1Z2coYiwgYywgZCwgYSwgeFtpICsgNF0sIDIwLCAtNDA1NTM3ODQ4KTtcbiAgICBhID0gbWQ1Z2coYSwgYiwgYywgZCwgeFtpICsgOV0sIDUsIDU2ODQ0NjQzOCk7XG4gICAgZCA9IG1kNWdnKGQsIGEsIGIsIGMsIHhbaSArIDE0XSwgOSwgLTEwMTk4MDM2OTApO1xuICAgIGMgPSBtZDVnZyhjLCBkLCBhLCBiLCB4W2kgKyAzXSwgMTQsIC0xODczNjM5NjEpO1xuICAgIGIgPSBtZDVnZyhiLCBjLCBkLCBhLCB4W2kgKyA4XSwgMjAsIDExNjM1MzE1MDEpO1xuICAgIGEgPSBtZDVnZyhhLCBiLCBjLCBkLCB4W2kgKyAxM10sIDUsIC0xNDQ0NjgxNDY3KTtcbiAgICBkID0gbWQ1Z2coZCwgYSwgYiwgYywgeFtpICsgMl0sIDksIC01MTQwMzc4NCk7XG4gICAgYyA9IG1kNWdnKGMsIGQsIGEsIGIsIHhbaSArIDddLCAxNCwgMTczNTMyODQ3Myk7XG4gICAgYiA9IG1kNWdnKGIsIGMsIGQsIGEsIHhbaSArIDEyXSwgMjAsIC0xOTI2NjA3NzM0KTtcbiAgICBhID0gbWQ1aGgoYSwgYiwgYywgZCwgeFtpICsgNV0sIDQsIC0zNzg1NTgpO1xuICAgIGQgPSBtZDVoaChkLCBhLCBiLCBjLCB4W2kgKyA4XSwgMTEsIC0yMDIyNTc0NDYzKTtcbiAgICBjID0gbWQ1aGgoYywgZCwgYSwgYiwgeFtpICsgMTFdLCAxNiwgMTgzOTAzMDU2Mik7XG4gICAgYiA9IG1kNWhoKGIsIGMsIGQsIGEsIHhbaSArIDE0XSwgMjMsIC0zNTMwOTU1Nik7XG4gICAgYSA9IG1kNWhoKGEsIGIsIGMsIGQsIHhbaSArIDFdLCA0LCAtMTUzMDk5MjA2MCk7XG4gICAgZCA9IG1kNWhoKGQsIGEsIGIsIGMsIHhbaSArIDRdLCAxMSwgMTI3Mjg5MzM1Myk7XG4gICAgYyA9IG1kNWhoKGMsIGQsIGEsIGIsIHhbaSArIDddLCAxNiwgLTE1NTQ5NzYzMik7XG4gICAgYiA9IG1kNWhoKGIsIGMsIGQsIGEsIHhbaSArIDEwXSwgMjMsIC0xMDk0NzMwNjQwKTtcbiAgICBhID0gbWQ1aGgoYSwgYiwgYywgZCwgeFtpICsgMTNdLCA0LCA2ODEyNzkxNzQpO1xuICAgIGQgPSBtZDVoaChkLCBhLCBiLCBjLCB4W2ldLCAxMSwgLTM1ODUzNzIyMik7XG4gICAgYyA9IG1kNWhoKGMsIGQsIGEsIGIsIHhbaSArIDNdLCAxNiwgLTcyMjUyMTk3OSk7XG4gICAgYiA9IG1kNWhoKGIsIGMsIGQsIGEsIHhbaSArIDZdLCAyMywgNzYwMjkxODkpO1xuICAgIGEgPSBtZDVoaChhLCBiLCBjLCBkLCB4W2kgKyA5XSwgNCwgLTY0MDM2NDQ4Nyk7XG4gICAgZCA9IG1kNWhoKGQsIGEsIGIsIGMsIHhbaSArIDEyXSwgMTEsIC00MjE4MTU4MzUpO1xuICAgIGMgPSBtZDVoaChjLCBkLCBhLCBiLCB4W2kgKyAxNV0sIDE2LCA1MzA3NDI1MjApO1xuICAgIGIgPSBtZDVoaChiLCBjLCBkLCBhLCB4W2kgKyAyXSwgMjMsIC05OTUzMzg2NTEpO1xuICAgIGEgPSBtZDVpaShhLCBiLCBjLCBkLCB4W2ldLCA2LCAtMTk4NjMwODQ0KTtcbiAgICBkID0gbWQ1aWkoZCwgYSwgYiwgYywgeFtpICsgN10sIDEwLCAxMTI2ODkxNDE1KTtcbiAgICBjID0gbWQ1aWkoYywgZCwgYSwgYiwgeFtpICsgMTRdLCAxNSwgLTE0MTYzNTQ5MDUpO1xuICAgIGIgPSBtZDVpaShiLCBjLCBkLCBhLCB4W2kgKyA1XSwgMjEsIC01NzQzNDA1NSk7XG4gICAgYSA9IG1kNWlpKGEsIGIsIGMsIGQsIHhbaSArIDEyXSwgNiwgMTcwMDQ4NTU3MSk7XG4gICAgZCA9IG1kNWlpKGQsIGEsIGIsIGMsIHhbaSArIDNdLCAxMCwgLTE4OTQ5ODY2MDYpO1xuICAgIGMgPSBtZDVpaShjLCBkLCBhLCBiLCB4W2kgKyAxMF0sIDE1LCAtMTA1MTUyMyk7XG4gICAgYiA9IG1kNWlpKGIsIGMsIGQsIGEsIHhbaSArIDFdLCAyMSwgLTIwNTQ5MjI3OTkpO1xuICAgIGEgPSBtZDVpaShhLCBiLCBjLCBkLCB4W2kgKyA4XSwgNiwgMTg3MzMxMzM1OSk7XG4gICAgZCA9IG1kNWlpKGQsIGEsIGIsIGMsIHhbaSArIDE1XSwgMTAsIC0zMDYxMTc0NCk7XG4gICAgYyA9IG1kNWlpKGMsIGQsIGEsIGIsIHhbaSArIDZdLCAxNSwgLTE1NjAxOTgzODApO1xuICAgIGIgPSBtZDVpaShiLCBjLCBkLCBhLCB4W2kgKyAxM10sIDIxLCAxMzA5MTUxNjQ5KTtcbiAgICBhID0gbWQ1aWkoYSwgYiwgYywgZCwgeFtpICsgNF0sIDYsIC0xNDU1MjMwNzApO1xuICAgIGQgPSBtZDVpaShkLCBhLCBiLCBjLCB4W2kgKyAxMV0sIDEwLCAtMTEyMDIxMDM3OSk7XG4gICAgYyA9IG1kNWlpKGMsIGQsIGEsIGIsIHhbaSArIDJdLCAxNSwgNzE4Nzg3MjU5KTtcbiAgICBiID0gbWQ1aWkoYiwgYywgZCwgYSwgeFtpICsgOV0sIDIxLCAtMzQzNDg1NTUxKTtcbiAgICBhID0gc2FmZUFkZChhLCBvbGRhKTtcbiAgICBiID0gc2FmZUFkZChiLCBvbGRiKTtcbiAgICBjID0gc2FmZUFkZChjLCBvbGRjKTtcbiAgICBkID0gc2FmZUFkZChkLCBvbGRkKTtcbiAgfVxuXG4gIHJldHVybiBbYSwgYiwgYywgZF07XG59XG4vKlxuICogQ29udmVydCBhbiBhcnJheSBieXRlcyB0byBhbiBhcnJheSBvZiBsaXR0bGUtZW5kaWFuIHdvcmRzXG4gKiBDaGFyYWN0ZXJzID4yNTUgaGF2ZSB0aGVpciBoaWdoLWJ5dGUgc2lsZW50bHkgaWdub3JlZC5cbiAqL1xuXG5cbmZ1bmN0aW9uIGJ5dGVzVG9Xb3JkcyhpbnB1dCkge1xuICBpZiAoaW5wdXQubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgdmFyIGxlbmd0aDggPSBpbnB1dC5sZW5ndGggKiA4O1xuICB2YXIgb3V0cHV0ID0gbmV3IFVpbnQzMkFycmF5KGdldE91dHB1dExlbmd0aChsZW5ndGg4KSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg4OyBpICs9IDgpIHtcbiAgICBvdXRwdXRbaSA+PiA1XSB8PSAoaW5wdXRbaSAvIDhdICYgMHhmZikgPDwgaSAlIDMyO1xuICB9XG5cbiAgcmV0dXJuIG91dHB1dDtcbn1cbi8qXG4gKiBBZGQgaW50ZWdlcnMsIHdyYXBwaW5nIGF0IDJeMzIuIFRoaXMgdXNlcyAxNi1iaXQgb3BlcmF0aW9ucyBpbnRlcm5hbGx5XG4gKiB0byB3b3JrIGFyb3VuZCBidWdzIGluIHNvbWUgSlMgaW50ZXJwcmV0ZXJzLlxuICovXG5cblxuZnVuY3Rpb24gc2FmZUFkZCh4LCB5KSB7XG4gIHZhciBsc3cgPSAoeCAmIDB4ZmZmZikgKyAoeSAmIDB4ZmZmZik7XG4gIHZhciBtc3cgPSAoeCA+PiAxNikgKyAoeSA+PiAxNikgKyAobHN3ID4+IDE2KTtcbiAgcmV0dXJuIG1zdyA8PCAxNiB8IGxzdyAmIDB4ZmZmZjtcbn1cbi8qXG4gKiBCaXR3aXNlIHJvdGF0ZSBhIDMyLWJpdCBudW1iZXIgdG8gdGhlIGxlZnQuXG4gKi9cblxuXG5mdW5jdGlvbiBiaXRSb3RhdGVMZWZ0KG51bSwgY250KSB7XG4gIHJldHVybiBudW0gPDwgY250IHwgbnVtID4+PiAzMiAtIGNudDtcbn1cbi8qXG4gKiBUaGVzZSBmdW5jdGlvbnMgaW1wbGVtZW50IHRoZSBmb3VyIGJhc2ljIG9wZXJhdGlvbnMgdGhlIGFsZ29yaXRobSB1c2VzLlxuICovXG5cblxuZnVuY3Rpb24gbWQ1Y21uKHEsIGEsIGIsIHgsIHMsIHQpIHtcbiAgcmV0dXJuIHNhZmVBZGQoYml0Um90YXRlTGVmdChzYWZlQWRkKHNhZmVBZGQoYSwgcSksIHNhZmVBZGQoeCwgdCkpLCBzKSwgYik7XG59XG5cbmZ1bmN0aW9uIG1kNWZmKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgcmV0dXJuIG1kNWNtbihiICYgYyB8IH5iICYgZCwgYSwgYiwgeCwgcywgdCk7XG59XG5cbmZ1bmN0aW9uIG1kNWdnKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgcmV0dXJuIG1kNWNtbihiICYgZCB8IGMgJiB+ZCwgYSwgYiwgeCwgcywgdCk7XG59XG5cbmZ1bmN0aW9uIG1kNWhoKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgcmV0dXJuIG1kNWNtbihiIF4gYyBeIGQsIGEsIGIsIHgsIHMsIHQpO1xufVxuXG5mdW5jdGlvbiBtZDVpaShhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XG4gIHJldHVybiBtZDVjbW4oYyBeIChiIHwgfmQpLCBhLCBiLCB4LCBzLCB0KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWQ1OyIsImV4cG9ydCBkZWZhdWx0ICcwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAnOyIsImltcG9ydCB2YWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlLmpzJztcblxuZnVuY3Rpb24gcGFyc2UodXVpZCkge1xuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdJbnZhbGlkIFVVSUQnKTtcbiAgfVxuXG4gIHZhciB2O1xuICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoMTYpOyAvLyBQYXJzZSAjIyMjIyMjIy0uLi4uLS4uLi4tLi4uLi0uLi4uLi4uLi4uLi5cblxuICBhcnJbMF0gPSAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoMCwgOCksIDE2KSkgPj4+IDI0O1xuICBhcnJbMV0gPSB2ID4+PiAxNiAmIDB4ZmY7XG4gIGFyclsyXSA9IHYgPj4+IDggJiAweGZmO1xuICBhcnJbM10gPSB2ICYgMHhmZjsgLy8gUGFyc2UgLi4uLi4uLi4tIyMjIy0uLi4uLS4uLi4tLi4uLi4uLi4uLi4uXG5cbiAgYXJyWzRdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDksIDEzKSwgMTYpKSA+Pj4gODtcbiAgYXJyWzVdID0gdiAmIDB4ZmY7IC8vIFBhcnNlIC4uLi4uLi4uLS4uLi4tIyMjIy0uLi4uLS4uLi4uLi4uLi4uLlxuXG4gIGFycls2XSA9ICh2ID0gcGFyc2VJbnQodXVpZC5zbGljZSgxNCwgMTgpLCAxNikpID4+PiA4O1xuICBhcnJbN10gPSB2ICYgMHhmZjsgLy8gUGFyc2UgLi4uLi4uLi4tLi4uLi0uLi4uLSMjIyMtLi4uLi4uLi4uLi4uXG5cbiAgYXJyWzhdID0gKHYgPSBwYXJzZUludCh1dWlkLnNsaWNlKDE5LCAyMyksIDE2KSkgPj4+IDg7XG4gIGFycls5XSA9IHYgJiAweGZmOyAvLyBQYXJzZSAuLi4uLi4uLi0uLi4uLS4uLi4tLi4uLi0jIyMjIyMjIyMjIyNcbiAgLy8gKFVzZSBcIi9cIiB0byBhdm9pZCAzMi1iaXQgdHJ1bmNhdGlvbiB3aGVuIGJpdC1zaGlmdGluZyBoaWdoLW9yZGVyIGJ5dGVzKVxuXG4gIGFyclsxMF0gPSAodiA9IHBhcnNlSW50KHV1aWQuc2xpY2UoMjQsIDM2KSwgMTYpKSAvIDB4MTAwMDAwMDAwMDAgJiAweGZmO1xuICBhcnJbMTFdID0gdiAvIDB4MTAwMDAwMDAwICYgMHhmZjtcbiAgYXJyWzEyXSA9IHYgPj4+IDI0ICYgMHhmZjtcbiAgYXJyWzEzXSA9IHYgPj4+IDE2ICYgMHhmZjtcbiAgYXJyWzE0XSA9IHYgPj4+IDggJiAweGZmO1xuICBhcnJbMTVdID0gdiAmIDB4ZmY7XG4gIHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhcnNlOyIsImV4cG9ydCBkZWZhdWx0IC9eKD86WzAtOWEtZl17OH0tWzAtOWEtZl17NH0tWzEtNV1bMC05YS1mXXszfS1bODlhYl1bMC05YS1mXXszfS1bMC05YS1mXXsxMn18MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwKSQvaTsiLCIvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiBJbiB0aGUgYnJvd3NlciB3ZSB0aGVyZWZvcmVcbi8vIHJlcXVpcmUgdGhlIGNyeXB0byBBUEkgYW5kIGRvIG5vdCBzdXBwb3J0IGJ1aWx0LWluIGZhbGxiYWNrIHRvIGxvd2VyIHF1YWxpdHkgcmFuZG9tIG51bWJlclxuLy8gZ2VuZXJhdG9ycyAobGlrZSBNYXRoLnJhbmRvbSgpKS5cbnZhciBnZXRSYW5kb21WYWx1ZXM7XG52YXIgcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBybmcoKSB7XG4gIC8vIGxhenkgbG9hZCBzbyB0aGF0IGVudmlyb25tZW50cyB0aGF0IG5lZWQgdG8gcG9seWZpbGwgaGF2ZSBhIGNoYW5jZSB0byBkbyBzb1xuICBpZiAoIWdldFJhbmRvbVZhbHVlcykge1xuICAgIC8vIGdldFJhbmRvbVZhbHVlcyBuZWVkcyB0byBiZSBpbnZva2VkIGluIGEgY29udGV4dCB3aGVyZSBcInRoaXNcIiBpcyBhIENyeXB0byBpbXBsZW1lbnRhdGlvbi4gQWxzbyxcbiAgICAvLyBmaW5kIHRoZSBjb21wbGV0ZSBpbXBsZW1lbnRhdGlvbiBvZiBjcnlwdG8gKG1zQ3J5cHRvKSBvbiBJRTExLlxuICAgIGdldFJhbmRvbVZhbHVlcyA9IHR5cGVvZiBjcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKGNyeXB0bykgfHwgdHlwZW9mIG1zQ3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzID09PSAnZnVuY3Rpb24nICYmIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKG1zQ3J5cHRvKTtcblxuICAgIGlmICghZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NyeXB0by5nZXRSYW5kb21WYWx1ZXMoKSBub3Qgc3VwcG9ydGVkLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkI2dldHJhbmRvbXZhbHVlcy1ub3Qtc3VwcG9ydGVkJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGdldFJhbmRvbVZhbHVlcyhybmRzOCk7XG59IiwiLy8gQWRhcHRlZCBmcm9tIENocmlzIFZlbmVzcycgU0hBMSBjb2RlIGF0XG4vLyBodHRwOi8vd3d3Lm1vdmFibGUtdHlwZS5jby51ay9zY3JpcHRzL3NoYTEuaHRtbFxuZnVuY3Rpb24gZihzLCB4LCB5LCB6KSB7XG4gIHN3aXRjaCAocykge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiB4ICYgeSBeIH54ICYgejtcblxuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiB4IF4geSBeIHo7XG5cbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4geCAmIHkgXiB4ICYgeiBeIHkgJiB6O1xuXG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIHggXiB5IF4gejtcbiAgfVxufVxuXG5mdW5jdGlvbiBST1RMKHgsIG4pIHtcbiAgcmV0dXJuIHggPDwgbiB8IHggPj4+IDMyIC0gbjtcbn1cblxuZnVuY3Rpb24gc2hhMShieXRlcykge1xuICB2YXIgSyA9IFsweDVhODI3OTk5LCAweDZlZDllYmExLCAweDhmMWJiY2RjLCAweGNhNjJjMWQ2XTtcbiAgdmFyIEggPSBbMHg2NzQ1MjMwMSwgMHhlZmNkYWI4OSwgMHg5OGJhZGNmZSwgMHgxMDMyNTQ3NiwgMHhjM2QyZTFmMF07XG5cbiAgaWYgKHR5cGVvZiBieXRlcyA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgbXNnID0gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KGJ5dGVzKSk7IC8vIFVURjggZXNjYXBlXG5cbiAgICBieXRlcyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtc2cubGVuZ3RoOyArK2kpIHtcbiAgICAgIGJ5dGVzLnB1c2gobXNnLmNoYXJDb2RlQXQoaSkpO1xuICAgIH1cbiAgfSBlbHNlIGlmICghQXJyYXkuaXNBcnJheShieXRlcykpIHtcbiAgICAvLyBDb252ZXJ0IEFycmF5LWxpa2UgdG8gQXJyYXlcbiAgICBieXRlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGJ5dGVzKTtcbiAgfVxuXG4gIGJ5dGVzLnB1c2goMHg4MCk7XG4gIHZhciBsID0gYnl0ZXMubGVuZ3RoIC8gNCArIDI7XG4gIHZhciBOID0gTWF0aC5jZWlsKGwgLyAxNik7XG4gIHZhciBNID0gbmV3IEFycmF5KE4pO1xuXG4gIGZvciAodmFyIF9pID0gMDsgX2kgPCBOOyArK19pKSB7XG4gICAgdmFyIGFyciA9IG5ldyBVaW50MzJBcnJheSgxNik7XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IDE2OyArK2opIHtcbiAgICAgIGFycltqXSA9IGJ5dGVzW19pICogNjQgKyBqICogNF0gPDwgMjQgfCBieXRlc1tfaSAqIDY0ICsgaiAqIDQgKyAxXSA8PCAxNiB8IGJ5dGVzW19pICogNjQgKyBqICogNCArIDJdIDw8IDggfCBieXRlc1tfaSAqIDY0ICsgaiAqIDQgKyAzXTtcbiAgICB9XG5cbiAgICBNW19pXSA9IGFycjtcbiAgfVxuXG4gIE1bTiAtIDFdWzE0XSA9IChieXRlcy5sZW5ndGggLSAxKSAqIDggLyBNYXRoLnBvdygyLCAzMik7XG4gIE1bTiAtIDFdWzE0XSA9IE1hdGguZmxvb3IoTVtOIC0gMV1bMTRdKTtcbiAgTVtOIC0gMV1bMTVdID0gKGJ5dGVzLmxlbmd0aCAtIDEpICogOCAmIDB4ZmZmZmZmZmY7XG5cbiAgZm9yICh2YXIgX2kyID0gMDsgX2kyIDwgTjsgKytfaTIpIHtcbiAgICB2YXIgVyA9IG5ldyBVaW50MzJBcnJheSg4MCk7XG5cbiAgICBmb3IgKHZhciB0ID0gMDsgdCA8IDE2OyArK3QpIHtcbiAgICAgIFdbdF0gPSBNW19pMl1bdF07XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX3QgPSAxNjsgX3QgPCA4MDsgKytfdCkge1xuICAgICAgV1tfdF0gPSBST1RMKFdbX3QgLSAzXSBeIFdbX3QgLSA4XSBeIFdbX3QgLSAxNF0gXiBXW190IC0gMTZdLCAxKTtcbiAgICB9XG5cbiAgICB2YXIgYSA9IEhbMF07XG4gICAgdmFyIGIgPSBIWzFdO1xuICAgIHZhciBjID0gSFsyXTtcbiAgICB2YXIgZCA9IEhbM107XG4gICAgdmFyIGUgPSBIWzRdO1xuXG4gICAgZm9yICh2YXIgX3QyID0gMDsgX3QyIDwgODA7ICsrX3QyKSB7XG4gICAgICB2YXIgcyA9IE1hdGguZmxvb3IoX3QyIC8gMjApO1xuICAgICAgdmFyIFQgPSBST1RMKGEsIDUpICsgZihzLCBiLCBjLCBkKSArIGUgKyBLW3NdICsgV1tfdDJdID4+PiAwO1xuICAgICAgZSA9IGQ7XG4gICAgICBkID0gYztcbiAgICAgIGMgPSBST1RMKGIsIDMwKSA+Pj4gMDtcbiAgICAgIGIgPSBhO1xuICAgICAgYSA9IFQ7XG4gICAgfVxuXG4gICAgSFswXSA9IEhbMF0gKyBhID4+PiAwO1xuICAgIEhbMV0gPSBIWzFdICsgYiA+Pj4gMDtcbiAgICBIWzJdID0gSFsyXSArIGMgPj4+IDA7XG4gICAgSFszXSA9IEhbM10gKyBkID4+PiAwO1xuICAgIEhbNF0gPSBIWzRdICsgZSA+Pj4gMDtcbiAgfVxuXG4gIHJldHVybiBbSFswXSA+PiAyNCAmIDB4ZmYsIEhbMF0gPj4gMTYgJiAweGZmLCBIWzBdID4+IDggJiAweGZmLCBIWzBdICYgMHhmZiwgSFsxXSA+PiAyNCAmIDB4ZmYsIEhbMV0gPj4gMTYgJiAweGZmLCBIWzFdID4+IDggJiAweGZmLCBIWzFdICYgMHhmZiwgSFsyXSA+PiAyNCAmIDB4ZmYsIEhbMl0gPj4gMTYgJiAweGZmLCBIWzJdID4+IDggJiAweGZmLCBIWzJdICYgMHhmZiwgSFszXSA+PiAyNCAmIDB4ZmYsIEhbM10gPj4gMTYgJiAweGZmLCBIWzNdID4+IDggJiAweGZmLCBIWzNdICYgMHhmZiwgSFs0XSA+PiAyNCAmIDB4ZmYsIEhbNF0gPj4gMTYgJiAweGZmLCBIWzRdID4+IDggJiAweGZmLCBIWzRdICYgMHhmZl07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNoYTE7IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDE2IGJ5dGUgdmFsdWVzIHRvIFVVSUQgc3RyaW5nIGZvcm1hdCBvZiB0aGUgZm9ybTpcbiAqIFhYWFhYWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG5cbnZhciBieXRlVG9IZXggPSBbXTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBieXRlVG9IZXgucHVzaCgoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpKTtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KGFycikge1xuICB2YXIgb2Zmc2V0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAwO1xuICAvLyBOb3RlOiBCZSBjYXJlZnVsIGVkaXRpbmcgdGhpcyBjb2RlISAgSXQncyBiZWVuIHR1bmVkIGZvciBwZXJmb3JtYW5jZVxuICAvLyBhbmQgd29ya3MgaW4gd2F5cyB5b3UgbWF5IG5vdCBleHBlY3QuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQvcHVsbC80MzRcbiAgdmFyIHV1aWQgPSAoYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDFdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAzXV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDRdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA2XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDddXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA5XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEwXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDExXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEyXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDEzXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDE1XV0pLnRvTG93ZXJDYXNlKCk7IC8vIENvbnNpc3RlbmN5IGNoZWNrIGZvciB2YWxpZCBVVUlELiAgSWYgdGhpcyB0aHJvd3MsIGl0J3MgbGlrZWx5IGR1ZSB0byBvbmVcbiAgLy8gb2YgdGhlIGZvbGxvd2luZzpcbiAgLy8gLSBPbmUgb3IgbW9yZSBpbnB1dCBhcnJheSB2YWx1ZXMgZG9uJ3QgbWFwIHRvIGEgaGV4IG9jdGV0IChsZWFkaW5nIHRvXG4gIC8vIFwidW5kZWZpbmVkXCIgaW4gdGhlIHV1aWQpXG4gIC8vIC0gSW52YWxpZCBpbnB1dCB2YWx1ZXMgZm9yIHRoZSBSRkMgYHZlcnNpb25gIG9yIGB2YXJpYW50YCBmaWVsZHNcblxuICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdTdHJpbmdpZmllZCBVVUlEIGlzIGludmFsaWQnKTtcbiAgfVxuXG4gIHJldHVybiB1dWlkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzdHJpbmdpZnk7IiwiaW1wb3J0IHJuZyBmcm9tICcuL3JuZy5qcyc7XG5pbXBvcnQgc3RyaW5naWZ5IGZyb20gJy4vc3RyaW5naWZ5LmpzJzsgLy8gKipgdjEoKWAgLSBHZW5lcmF0ZSB0aW1lLWJhc2VkIFVVSUQqKlxuLy9cbi8vIEluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9MaW9zSy9VVUlELmpzXG4vLyBhbmQgaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L3V1aWQuaHRtbFxuXG52YXIgX25vZGVJZDtcblxudmFyIF9jbG9ja3NlcTsgLy8gUHJldmlvdXMgdXVpZCBjcmVhdGlvbiB0aW1lXG5cblxudmFyIF9sYXN0TVNlY3MgPSAwO1xudmFyIF9sYXN0TlNlY3MgPSAwOyAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkIGZvciBBUEkgZGV0YWlsc1xuXG5mdW5jdGlvbiB2MShvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcbiAgdmFyIGIgPSBidWYgfHwgbmV3IEFycmF5KDE2KTtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBub2RlID0gb3B0aW9ucy5ub2RlIHx8IF9ub2RlSWQ7XG4gIHZhciBjbG9ja3NlcSA9IG9wdGlvbnMuY2xvY2tzZXEgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY2xvY2tzZXEgOiBfY2xvY2tzZXE7IC8vIG5vZGUgYW5kIGNsb2Nrc2VxIG5lZWQgdG8gYmUgaW5pdGlhbGl6ZWQgdG8gcmFuZG9tIHZhbHVlcyBpZiB0aGV5J3JlIG5vdFxuICAvLyBzcGVjaWZpZWQuICBXZSBkbyB0aGlzIGxhemlseSB0byBtaW5pbWl6ZSBpc3N1ZXMgcmVsYXRlZCB0byBpbnN1ZmZpY2llbnRcbiAgLy8gc3lzdGVtIGVudHJvcHkuICBTZWUgIzE4OVxuXG4gIGlmIChub2RlID09IG51bGwgfHwgY2xvY2tzZXEgPT0gbnVsbCkge1xuICAgIHZhciBzZWVkQnl0ZXMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpO1xuXG4gICAgaWYgKG5vZGUgPT0gbnVsbCkge1xuICAgICAgLy8gUGVyIDQuNSwgY3JlYXRlIGFuZCA0OC1iaXQgbm9kZSBpZCwgKDQ3IHJhbmRvbSBiaXRzICsgbXVsdGljYXN0IGJpdCA9IDEpXG4gICAgICBub2RlID0gX25vZGVJZCA9IFtzZWVkQnl0ZXNbMF0gfCAweDAxLCBzZWVkQnl0ZXNbMV0sIHNlZWRCeXRlc1syXSwgc2VlZEJ5dGVzWzNdLCBzZWVkQnl0ZXNbNF0sIHNlZWRCeXRlc1s1XV07XG4gICAgfVxuXG4gICAgaWYgKGNsb2Nrc2VxID09IG51bGwpIHtcbiAgICAgIC8vIFBlciA0LjIuMiwgcmFuZG9taXplICgxNCBiaXQpIGNsb2Nrc2VxXG4gICAgICBjbG9ja3NlcSA9IF9jbG9ja3NlcSA9IChzZWVkQnl0ZXNbNl0gPDwgOCB8IHNlZWRCeXRlc1s3XSkgJiAweDNmZmY7XG4gICAgfVxuICB9IC8vIFVVSUQgdGltZXN0YW1wcyBhcmUgMTAwIG5hbm8tc2Vjb25kIHVuaXRzIHNpbmNlIHRoZSBHcmVnb3JpYW4gZXBvY2gsXG4gIC8vICgxNTgyLTEwLTE1IDAwOjAwKS4gIEpTTnVtYmVycyBhcmVuJ3QgcHJlY2lzZSBlbm91Z2ggZm9yIHRoaXMsIHNvXG4gIC8vIHRpbWUgaXMgaGFuZGxlZCBpbnRlcm5hbGx5IGFzICdtc2VjcycgKGludGVnZXIgbWlsbGlzZWNvbmRzKSBhbmQgJ25zZWNzJ1xuICAvLyAoMTAwLW5hbm9zZWNvbmRzIG9mZnNldCBmcm9tIG1zZWNzKSBzaW5jZSB1bml4IGVwb2NoLCAxOTcwLTAxLTAxIDAwOjAwLlxuXG5cbiAgdmFyIG1zZWNzID0gb3B0aW9ucy5tc2VjcyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5tc2VjcyA6IERhdGUubm93KCk7IC8vIFBlciA0LjIuMS4yLCB1c2UgY291bnQgb2YgdXVpZCdzIGdlbmVyYXRlZCBkdXJpbmcgdGhlIGN1cnJlbnQgY2xvY2tcbiAgLy8gY3ljbGUgdG8gc2ltdWxhdGUgaGlnaGVyIHJlc29sdXRpb24gY2xvY2tcblxuICB2YXIgbnNlY3MgPSBvcHRpb25zLm5zZWNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm5zZWNzIDogX2xhc3ROU2VjcyArIDE7IC8vIFRpbWUgc2luY2UgbGFzdCB1dWlkIGNyZWF0aW9uIChpbiBtc2VjcylcblxuICB2YXIgZHQgPSBtc2VjcyAtIF9sYXN0TVNlY3MgKyAobnNlY3MgLSBfbGFzdE5TZWNzKSAvIDEwMDAwOyAvLyBQZXIgNC4yLjEuMiwgQnVtcCBjbG9ja3NlcSBvbiBjbG9jayByZWdyZXNzaW9uXG5cbiAgaWYgKGR0IDwgMCAmJiBvcHRpb25zLmNsb2Nrc2VxID09PSB1bmRlZmluZWQpIHtcbiAgICBjbG9ja3NlcSA9IGNsb2Nrc2VxICsgMSAmIDB4M2ZmZjtcbiAgfSAvLyBSZXNldCBuc2VjcyBpZiBjbG9jayByZWdyZXNzZXMgKG5ldyBjbG9ja3NlcSkgb3Igd2UndmUgbW92ZWQgb250byBhIG5ld1xuICAvLyB0aW1lIGludGVydmFsXG5cblxuICBpZiAoKGR0IDwgMCB8fCBtc2VjcyA+IF9sYXN0TVNlY3MpICYmIG9wdGlvbnMubnNlY3MgPT09IHVuZGVmaW5lZCkge1xuICAgIG5zZWNzID0gMDtcbiAgfSAvLyBQZXIgNC4yLjEuMiBUaHJvdyBlcnJvciBpZiB0b28gbWFueSB1dWlkcyBhcmUgcmVxdWVzdGVkXG5cblxuICBpZiAobnNlY3MgPj0gMTAwMDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1dWlkLnYxKCk6IENhbid0IGNyZWF0ZSBtb3JlIHRoYW4gMTBNIHV1aWRzL3NlY1wiKTtcbiAgfVxuXG4gIF9sYXN0TVNlY3MgPSBtc2VjcztcbiAgX2xhc3ROU2VjcyA9IG5zZWNzO1xuICBfY2xvY2tzZXEgPSBjbG9ja3NlcTsgLy8gUGVyIDQuMS40IC0gQ29udmVydCBmcm9tIHVuaXggZXBvY2ggdG8gR3JlZ29yaWFuIGVwb2NoXG5cbiAgbXNlY3MgKz0gMTIyMTkyOTI4MDAwMDA7IC8vIGB0aW1lX2xvd2BcblxuICB2YXIgdGwgPSAoKG1zZWNzICYgMHhmZmZmZmZmKSAqIDEwMDAwICsgbnNlY3MpICUgMHgxMDAwMDAwMDA7XG4gIGJbaSsrXSA9IHRsID4+PiAyNCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsID4+PiAxNiAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsID4+PiA4ICYgMHhmZjtcbiAgYltpKytdID0gdGwgJiAweGZmOyAvLyBgdGltZV9taWRgXG5cbiAgdmFyIHRtaCA9IG1zZWNzIC8gMHgxMDAwMDAwMDAgKiAxMDAwMCAmIDB4ZmZmZmZmZjtcbiAgYltpKytdID0gdG1oID4+PiA4ICYgMHhmZjtcbiAgYltpKytdID0gdG1oICYgMHhmZjsgLy8gYHRpbWVfaGlnaF9hbmRfdmVyc2lvbmBcblxuICBiW2krK10gPSB0bWggPj4+IDI0ICYgMHhmIHwgMHgxMDsgLy8gaW5jbHVkZSB2ZXJzaW9uXG5cbiAgYltpKytdID0gdG1oID4+PiAxNiAmIDB4ZmY7IC8vIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYCAoUGVyIDQuMi4yIC0gaW5jbHVkZSB2YXJpYW50KVxuXG4gIGJbaSsrXSA9IGNsb2Nrc2VxID4+PiA4IHwgMHg4MDsgLy8gYGNsb2NrX3NlcV9sb3dgXG5cbiAgYltpKytdID0gY2xvY2tzZXEgJiAweGZmOyAvLyBgbm9kZWBcblxuICBmb3IgKHZhciBuID0gMDsgbiA8IDY7ICsrbikge1xuICAgIGJbaSArIG5dID0gbm9kZVtuXTtcbiAgfVxuXG4gIHJldHVybiBidWYgfHwgc3RyaW5naWZ5KGIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB2MTsiLCJpbXBvcnQgdjM1IGZyb20gJy4vdjM1LmpzJztcbmltcG9ydCBtZDUgZnJvbSAnLi9tZDUuanMnO1xudmFyIHYzID0gdjM1KCd2MycsIDB4MzAsIG1kNSk7XG5leHBvcnQgZGVmYXVsdCB2MzsiLCJpbXBvcnQgc3RyaW5naWZ5IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcbmltcG9ydCBwYXJzZSBmcm9tICcuL3BhcnNlLmpzJztcblxuZnVuY3Rpb24gc3RyaW5nVG9CeXRlcyhzdHIpIHtcbiAgc3RyID0gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHN0cikpOyAvLyBVVEY4IGVzY2FwZVxuXG4gIHZhciBieXRlcyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgYnl0ZXMucHVzaChzdHIuY2hhckNvZGVBdChpKSk7XG4gIH1cblxuICByZXR1cm4gYnl0ZXM7XG59XG5cbmV4cG9ydCB2YXIgRE5TID0gJzZiYTdiODEwLTlkYWQtMTFkMS04MGI0LTAwYzA0ZmQ0MzBjOCc7XG5leHBvcnQgdmFyIFVSTCA9ICc2YmE3YjgxMS05ZGFkLTExZDEtODBiNC0wMGMwNGZkNDMwYzgnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG5hbWUsIHZlcnNpb24sIGhhc2hmdW5jKSB7XG4gIGZ1bmN0aW9uIGdlbmVyYXRlVVVJRCh2YWx1ZSwgbmFtZXNwYWNlLCBidWYsIG9mZnNldCkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YWx1ZSA9IHN0cmluZ1RvQnl0ZXModmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgbmFtZXNwYWNlID09PSAnc3RyaW5nJykge1xuICAgICAgbmFtZXNwYWNlID0gcGFyc2UobmFtZXNwYWNlKTtcbiAgICB9XG5cbiAgICBpZiAobmFtZXNwYWNlLmxlbmd0aCAhPT0gMTYpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcignTmFtZXNwYWNlIG11c3QgYmUgYXJyYXktbGlrZSAoMTYgaXRlcmFibGUgaW50ZWdlciB2YWx1ZXMsIDAtMjU1KScpO1xuICAgIH0gLy8gQ29tcHV0ZSBoYXNoIG9mIG5hbWVzcGFjZSBhbmQgdmFsdWUsIFBlciA0LjNcbiAgICAvLyBGdXR1cmU6IFVzZSBzcHJlYWQgc3ludGF4IHdoZW4gc3VwcG9ydGVkIG9uIGFsbCBwbGF0Zm9ybXMsIGUuZy4gYGJ5dGVzID1cbiAgICAvLyBoYXNoZnVuYyhbLi4ubmFtZXNwYWNlLCAuLi4gdmFsdWVdKWBcblxuXG4gICAgdmFyIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoMTYgKyB2YWx1ZS5sZW5ndGgpO1xuICAgIGJ5dGVzLnNldChuYW1lc3BhY2UpO1xuICAgIGJ5dGVzLnNldCh2YWx1ZSwgbmFtZXNwYWNlLmxlbmd0aCk7XG4gICAgYnl0ZXMgPSBoYXNoZnVuYyhieXRlcyk7XG4gICAgYnl0ZXNbNl0gPSBieXRlc1s2XSAmIDB4MGYgfCB2ZXJzaW9uO1xuICAgIGJ5dGVzWzhdID0gYnl0ZXNbOF0gJiAweDNmIHwgMHg4MDtcblxuICAgIGlmIChidWYpIHtcbiAgICAgIG9mZnNldCA9IG9mZnNldCB8fCAwO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDE2OyArK2kpIHtcbiAgICAgICAgYnVmW29mZnNldCArIGldID0gYnl0ZXNbaV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBidWY7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cmluZ2lmeShieXRlcyk7XG4gIH0gLy8gRnVuY3Rpb24jbmFtZSBpcyBub3Qgc2V0dGFibGUgb24gc29tZSBwbGF0Zm9ybXMgKCMyNzApXG5cblxuICB0cnkge1xuICAgIGdlbmVyYXRlVVVJRC5uYW1lID0gbmFtZTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVtcHR5XG4gIH0gY2F0Y2ggKGVycikge30gLy8gRm9yIENvbW1vbkpTIGRlZmF1bHQgZXhwb3J0IHN1cHBvcnRcblxuXG4gIGdlbmVyYXRlVVVJRC5ETlMgPSBETlM7XG4gIGdlbmVyYXRlVVVJRC5VUkwgPSBVUkw7XG4gIHJldHVybiBnZW5lcmF0ZVVVSUQ7XG59IiwiaW1wb3J0IHJuZyBmcm9tICcuL3JuZy5qcyc7XG5pbXBvcnQgc3RyaW5naWZ5IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcblxuZnVuY3Rpb24gdjQob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTsgLy8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuXG4gIHJuZHNbNl0gPSBybmRzWzZdICYgMHgwZiB8IDB4NDA7XG4gIHJuZHNbOF0gPSBybmRzWzhdICYgMHgzZiB8IDB4ODA7IC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuXG4gIGlmIChidWYpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgICAgYnVmW29mZnNldCArIGldID0gcm5kc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmO1xuICB9XG5cbiAgcmV0dXJuIHN0cmluZ2lmeShybmRzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdjQ7IiwiaW1wb3J0IHYzNSBmcm9tICcuL3YzNS5qcyc7XG5pbXBvcnQgc2hhMSBmcm9tICcuL3NoYTEuanMnO1xudmFyIHY1ID0gdjM1KCd2NScsIDB4NTAsIHNoYTEpO1xuZXhwb3J0IGRlZmF1bHQgdjU7IiwiaW1wb3J0IFJFR0VYIGZyb20gJy4vcmVnZXguanMnO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZSh1dWlkKSB7XG4gIHJldHVybiB0eXBlb2YgdXVpZCA9PT0gJ3N0cmluZycgJiYgUkVHRVgudGVzdCh1dWlkKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdmFsaWRhdGU7IiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuXG5mdW5jdGlvbiB2ZXJzaW9uKHV1aWQpIHtcbiAgaWYgKCF2YWxpZGF0ZSh1dWlkKSkge1xuICAgIHRocm93IFR5cGVFcnJvcignSW52YWxpZCBVVUlEJyk7XG4gIH1cblxuICByZXR1cm4gcGFyc2VJbnQodXVpZC5zdWJzdHIoMTQsIDEpLCAxNik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZlcnNpb247IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJleHBvcnQgeyBkZWJ1ZyB9IGZyb20gJy4vZGVidWcnO1xuXG5leHBvcnQgeyBNb2RlbCB9IGZyb20gJy4vbW9kZWwnO1xuZXhwb3J0IHsgU2NoZW1hIH0gZnJvbSAnLi9zY2hlbWEnO1xuZXhwb3J0IHsgZmllbGRzIH0gZnJvbSAnLi9maWVsZCc7XG5leHBvcnQgeyBNaWdyYXRpb24gfSBmcm9tICcuL21pZ3JhdG9uJztcblxuZXhwb3J0IHsgc2Vzc2lvbiwgc2V0RGVmYXVsdEFkYXB0ZXIsIGdldERlZmF1bHRBZGFwdGVyIH0gZnJvbSAnLi9zZXNzaW9uJzsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=