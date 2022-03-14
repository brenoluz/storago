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

/***/ "./src/adapters/query.ts":
/*!*******************************!*\
  !*** ./src/adapters/query.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Query = void 0;
class Query {
    constructor(table, conn) {
        this.Table = table;
        this.conn = conn;
    }
}
exports.Query = Query;


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
class WebSQLAdapter {
    constructor(name, description, size) {
        this.engine = adapter_1.engineKind.WebSQL;
        this.db = window.openDatabase(name, '', description, size);
    }
    async transaction() {
        return new Promise(this.db.transaction);
    }
    select(table) {
        let select = new select_1.WebSQLSelect(table, this);
        return select;
    }
    async query(sql, data) {
        let tx = await this.transaction();
        return new Promise((resolve, reject) => {
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

/***/ "./src/adapters/websql/select.ts":
/*!***************************************!*\
  !*** ./src/adapters/websql/select.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSQLSelect = void 0;
const query_1 = __webpack_require__(/*! ../query */ "./src/adapters/query.ts");
class WebSQLSelect extends query_1.Query {
    constructor(table, conn) {
        super(table, conn);
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
        let sql = 'SELECT';
        if (this._distinct) {
            sql += ' DISTINCT';
        }
        sql += this._column.join(' ,');
        sql += this._from;
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
                if (!!where[1]) {
                    this._params.concat(where[1]);
                }
            }
        }
        sql += this._order.join(' ');
        return sql;
    }
    toString() {
        return this.render();
    }
    async execute() {
        let sql = this.render();
        return this.conn.query(sql, this._params);
    }
    async all() {
        let rowset = [];
        let result = await this.execute();
        for (let i = 0; result.rows.length > i; i++) {
            let row = result.rows.item(i);
            rowset.push(this.Table.createFromDB(row));
        }
        return rowset;
    }
}
exports.WebSQLSelect = WebSQLSelect;


/***/ }),

/***/ "./src/field/field.ts":
/*!****************************!*\
  !*** ./src/field/field.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Field = void 0;
class Field {
    constructor(config = {}) {
        this._config = config;
    }
    getName(name) {
        return name;
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
exports.fields = {
    Text: text_1.Text,
};


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
    fromDB(value) {
        return value;
    }
    toDB(value) {
        return ''.trim();
    }
    castDB(conn) {
        if (conn.engine == adapter_1.engineKind.PostgreSQL) {
            return 'VARCHAR';
        }
        return 'TEXT';
    }
}
exports.Text = Text;


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
    constructor(name, fields, adapter = session_1.session.adapter) {
        this.name = name;
        this.fields = fields;
        this.conn = adapter;
    }
    getName() {
        return this.name;
    }
    getFields() {
        return this.fields;
    }
    getAdapter() {
        return this.conn;
    }
    select(table) {
        let select = this.conn.select(table);
        select.from(this.name, Object.keys(this.fields));
        return select;
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
exports.setDefaultAdapter = exports.session = void 0;
const adapter_1 = __webpack_require__(/*! ./adapters/websql/adapter */ "./src/adapters/websql/adapter.ts");
exports.session = {
    adapter: new adapter_1.WebSQLAdapter('default', 'default db', 1024 ** 2),
};
function setDefaultAdapter(adapter) {
    exports.session.adapter = adapter;
}
exports.setDefaultAdapter = setDefaultAdapter;


/***/ }),

/***/ "./src/table.ts":
/*!**********************!*\
  !*** ./src/table.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Table = void 0;
class Table {
    static find(where, param) {
        let select = this.select();
        select.where(`${where} = ?`, param);
        return select.all();
    }
    ;
    static select() {
        return this.schema.select(this);
    }
    static createFromDB(row) {
        let instance = new this;
        for (let a in row) {
            instance[a] = row[a];
        }
        return instance;
    }
}
exports.Table = Table;


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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setDefaultAdapter = exports.session = exports.fields = exports.Schema = exports.Table = void 0;
var table_1 = __webpack_require__(/*! ./table */ "./src/table.ts");
Object.defineProperty(exports, "Table", ({ enumerable: true, get: function () { return table_1.Table; } }));
var schema_1 = __webpack_require__(/*! ./schema */ "./src/schema.ts");
Object.defineProperty(exports, "Schema", ({ enumerable: true, get: function () { return schema_1.Schema; } }));
var field_1 = __webpack_require__(/*! ./field */ "./src/field/index.ts");
Object.defineProperty(exports, "fields", ({ enumerable: true, get: function () { return field_1.fields; } }));
var session_1 = __webpack_require__(/*! ./session */ "./src/session.ts");
Object.defineProperty(exports, "session", ({ enumerable: true, get: function () { return session_1.session; } }));
Object.defineProperty(exports, "setDefaultAdapter", ({ enumerable: true, get: function () { return session_1.setDefaultAdapter; } }));

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RCxFQUFFLHFDQUFxQyx1Q0FBdUMsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3N0b3JhZ28yLy4vc3JjL2FkYXB0ZXJzL2FkYXB0ZXIudHMiLCJ3ZWJwYWNrOi8vc3RvcmFnbzIvLi9zcmMvYWRhcHRlcnMvcXVlcnkudHMiLCJ3ZWJwYWNrOi8vc3RvcmFnbzIvLi9zcmMvYWRhcHRlcnMvd2Vic3FsL2FkYXB0ZXIudHMiLCJ3ZWJwYWNrOi8vc3RvcmFnbzIvLi9zcmMvYWRhcHRlcnMvd2Vic3FsL3NlbGVjdC50cyIsIndlYnBhY2s6Ly9zdG9yYWdvMi8uL3NyYy9maWVsZC9maWVsZC50cyIsIndlYnBhY2s6Ly9zdG9yYWdvMi8uL3NyYy9maWVsZC9pbmRleC50cyIsIndlYnBhY2s6Ly9zdG9yYWdvMi8uL3NyYy9maWVsZC90ZXh0LnRzIiwid2VicGFjazovL3N0b3JhZ28yLy4vc3JjL3NjaGVtYS50cyIsIndlYnBhY2s6Ly9zdG9yYWdvMi8uL3NyYy9zZXNzaW9uLnRzIiwid2VicGFjazovL3N0b3JhZ28yLy4vc3JjL3RhYmxlLnRzIiwid2VicGFjazovL3N0b3JhZ28yL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3N0b3JhZ28yLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5lbmdpbmVLaW5kID0gdm9pZCAwO1xudmFyIGVuZ2luZUtpbmQ7XG4oZnVuY3Rpb24gKGVuZ2luZUtpbmQpIHtcbiAgICBlbmdpbmVLaW5kW2VuZ2luZUtpbmRbXCJXZWJTUUxcIl0gPSAwXSA9IFwiV2ViU1FMXCI7XG4gICAgZW5naW5lS2luZFtlbmdpbmVLaW5kW1wiUG9zdGdyZVNRTFwiXSA9IDFdID0gXCJQb3N0Z3JlU1FMXCI7XG59KShlbmdpbmVLaW5kID0gZXhwb3J0cy5lbmdpbmVLaW5kIHx8IChleHBvcnRzLmVuZ2luZUtpbmQgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlF1ZXJ5ID0gdm9pZCAwO1xuY2xhc3MgUXVlcnkge1xuICAgIGNvbnN0cnVjdG9yKHRhYmxlLCBjb25uKSB7XG4gICAgICAgIHRoaXMuVGFibGUgPSB0YWJsZTtcbiAgICAgICAgdGhpcy5jb25uID0gY29ubjtcbiAgICB9XG59XG5leHBvcnRzLlF1ZXJ5ID0gUXVlcnk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuV2ViU1FMQWRhcHRlciA9IHZvaWQgMDtcbmNvbnN0IGFkYXB0ZXJfMSA9IHJlcXVpcmUoXCIuLi9hZGFwdGVyXCIpO1xuY29uc3Qgc2VsZWN0XzEgPSByZXF1aXJlKFwiLi9zZWxlY3RcIik7XG5jbGFzcyBXZWJTUUxBZGFwdGVyIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBkZXNjcmlwdGlvbiwgc2l6ZSkge1xuICAgICAgICB0aGlzLmVuZ2luZSA9IGFkYXB0ZXJfMS5lbmdpbmVLaW5kLldlYlNRTDtcbiAgICAgICAgdGhpcy5kYiA9IHdpbmRvdy5vcGVuRGF0YWJhc2UobmFtZSwgJycsIGRlc2NyaXB0aW9uLCBzaXplKTtcbiAgICB9XG4gICAgYXN5bmMgdHJhbnNhY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSh0aGlzLmRiLnRyYW5zYWN0aW9uKTtcbiAgICB9XG4gICAgc2VsZWN0KHRhYmxlKSB7XG4gICAgICAgIGxldCBzZWxlY3QgPSBuZXcgc2VsZWN0XzEuV2ViU1FMU2VsZWN0KHRhYmxlLCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIHNlbGVjdDtcbiAgICB9XG4gICAgYXN5bmMgcXVlcnkoc3FsLCBkYXRhKSB7XG4gICAgICAgIGxldCB0eCA9IGF3YWl0IHRoaXMudHJhbnNhY3Rpb24oKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHR4LmV4ZWN1dGVTcWwoc3FsLCBkYXRhLCAodHgsIHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgIH0sICh0eCwgZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuV2ViU1FMQWRhcHRlciA9IFdlYlNRTEFkYXB0ZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuV2ViU1FMU2VsZWN0ID0gdm9pZCAwO1xuY29uc3QgcXVlcnlfMSA9IHJlcXVpcmUoXCIuLi9xdWVyeVwiKTtcbmNsYXNzIFdlYlNRTFNlbGVjdCBleHRlbmRzIHF1ZXJ5XzEuUXVlcnkge1xuICAgIGNvbnN0cnVjdG9yKHRhYmxlLCBjb25uKSB7XG4gICAgICAgIHN1cGVyKHRhYmxlLCBjb25uKTtcbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gMDtcbiAgICAgICAgdGhpcy5fZGlzdGluY3QgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZnJvbSA9ICcnO1xuICAgICAgICB0aGlzLl93aGVyZSA9IFtdO1xuICAgICAgICB0aGlzLl9jb2x1bW4gPSBbXTtcbiAgICAgICAgdGhpcy5fam9pbiA9IFtdO1xuICAgICAgICB0aGlzLl9qb2luTGVmdCA9IFtdO1xuICAgICAgICB0aGlzLl9qb2luUmlnaHQgPSBbXTtcbiAgICAgICAgdGhpcy5fcGFyYW1zID0gW107XG4gICAgICAgIHRoaXMuX29yZGVyID0gW107XG4gICAgfVxuICAgIGRpc3RpbmN0KGZsYWcgPSB0cnVlKSB7XG4gICAgICAgIHRoaXMuX2Rpc3RpbmN0ID0gZmxhZztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGZyb20oZnJvbSwgY29sdW1ucykge1xuICAgICAgICB0aGlzLl9mcm9tID0gZnJvbTtcbiAgICAgICAgaWYgKCFjb2x1bW5zKSB7XG4gICAgICAgICAgICBjb2x1bW5zID0gWycqJ107XG4gICAgICAgIH1cbiAgICAgICAgY29sdW1ucy5wdXNoKCdyb3dpZCcpO1xuICAgICAgICBmb3IgKGxldCBjb2x1bW4gb2YgY29sdW1ucykge1xuICAgICAgICAgICAgdGhpcy5fY29sdW1uLnB1c2goYCR7ZnJvbX0uJHtjb2x1bW59YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHdoZXJlKGNyaXRlcmlhLCBwYXJhbXMpIHtcbiAgICAgICAgaWYgKHBhcmFtcyAhPT0gdW5kZWZpbmVkICYmICFBcnJheS5pc0FycmF5KHBhcmFtcykpIHtcbiAgICAgICAgICAgIHBhcmFtcyA9IFtwYXJhbXNdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3doZXJlLnB1c2goW2NyaXRlcmlhLCBwYXJhbXNdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGpvaW4odGFibGVOYW1lLCBvbiwgY29sdW1ucykge1xuICAgICAgICB0aGlzLl9qb2luLnB1c2goW3RhYmxlTmFtZSwgb25dKTtcbiAgICAgICAgaWYgKCEhY29sdW1ucykge1xuICAgICAgICAgICAgdGhpcy5fY29sdW1uLmNvbmNhdChjb2x1bW5zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgam9pbkxlZnQodGFibGVOYW1lLCBvbiwgY29sdW1ucykge1xuICAgICAgICB0aGlzLl9qb2luTGVmdC5wdXNoKFt0YWJsZU5hbWUsIG9uXSk7XG4gICAgICAgIGlmICghIWNvbHVtbnMpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbHVtbi5jb25jYXQoY29sdW1ucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGpvaW5SaWdodCh0YWJsZU5hbWUsIG9uLCBjb2x1bW5zKSB7XG4gICAgICAgIHRoaXMuX2pvaW5SaWdodC5wdXNoKFt0YWJsZU5hbWUsIG9uXSk7XG4gICAgICAgIHRoaXMuX2NvbHVtbi5jb25jYXQoY29sdW1ucyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBvcmRlcihjb2x1bW4sIGRpcmVjdGlvbikge1xuICAgICAgICBpZiAoIWRpcmVjdGlvbikge1xuICAgICAgICAgICAgZGlyZWN0aW9uID0gJ0FTQyc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fb3JkZXIucHVzaChgJHtjb2x1bW59ICR7ZGlyZWN0aW9ufWApO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuX3BhcmFtcyA9IFtdO1xuICAgICAgICBsZXQgc3FsID0gJ1NFTEVDVCc7XG4gICAgICAgIGlmICh0aGlzLl9kaXN0aW5jdCkge1xuICAgICAgICAgICAgc3FsICs9ICcgRElTVElOQ1QnO1xuICAgICAgICB9XG4gICAgICAgIHNxbCArPSB0aGlzLl9jb2x1bW4uam9pbignICwnKTtcbiAgICAgICAgc3FsICs9IHRoaXMuX2Zyb207XG4gICAgICAgIGlmICh0aGlzLl9qb2luLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGpvaW4gb2YgdGhpcy5fam9pbikge1xuICAgICAgICAgICAgICAgIHNxbCArPSBgIEpPSU4gJHtqb2luWzBdfSBPTiAke2pvaW5bMV19YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fam9pbkxlZnQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yIChsZXQgam9pbiBvZiB0aGlzLl9qb2luTGVmdCkge1xuICAgICAgICAgICAgICAgIHNxbCArPSBgIEpPSU4gTEVGVCAke2pvaW5bMF19IE9OICR7am9pblsxXX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCB3aGVyZV9zaXplID0gdGhpcy5fd2hlcmUubGVuZ3RoO1xuICAgICAgICBsZXQgd2hlcmVBbmRMaW1pdCA9IHdoZXJlX3NpemUgLSAxO1xuICAgICAgICBpZiAod2hlcmVfc2l6ZSA+IDApIHtcbiAgICAgICAgICAgIHNxbCArPSAnIFdIRVJFICc7XG4gICAgICAgICAgICBmb3IgKGxldCB3IGluIHRoaXMuX3doZXJlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGkgPSBwYXJzZUludCh3KTtcbiAgICAgICAgICAgICAgICBsZXQgd2hlcmUgPSB0aGlzLl93aGVyZVt3XTtcbiAgICAgICAgICAgICAgICBzcWwgKz0gd2hlcmVbMF07XG4gICAgICAgICAgICAgICAgaWYgKHdoZXJlQW5kTGltaXQgIT0gaSkge1xuICAgICAgICAgICAgICAgICAgICBzcWwgKz0gJyBBTkQgJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCEhd2hlcmVbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFyYW1zLmNvbmNhdCh3aGVyZVsxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNxbCArPSB0aGlzLl9vcmRlci5qb2luKCcgJyk7XG4gICAgICAgIHJldHVybiBzcWw7XG4gICAgfVxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gICAgYXN5bmMgZXhlY3V0ZSgpIHtcbiAgICAgICAgbGV0IHNxbCA9IHRoaXMucmVuZGVyKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbm4ucXVlcnkoc3FsLCB0aGlzLl9wYXJhbXMpO1xuICAgIH1cbiAgICBhc3luYyBhbGwoKSB7XG4gICAgICAgIGxldCByb3dzZXQgPSBbXTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IHRoaXMuZXhlY3V0ZSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgcmVzdWx0LnJvd3MubGVuZ3RoID4gaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm93ID0gcmVzdWx0LnJvd3MuaXRlbShpKTtcbiAgICAgICAgICAgIHJvd3NldC5wdXNoKHRoaXMuVGFibGUuY3JlYXRlRnJvbURCKHJvdykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3dzZXQ7XG4gICAgfVxufVxuZXhwb3J0cy5XZWJTUUxTZWxlY3QgPSBXZWJTUUxTZWxlY3Q7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRmllbGQgPSB2b2lkIDA7XG5jbGFzcyBGaWVsZCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnID0ge30pIHtcbiAgICAgICAgdGhpcy5fY29uZmlnID0gY29uZmlnO1xuICAgIH1cbiAgICBnZXROYW1lKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxufVxuZXhwb3J0cy5GaWVsZCA9IEZpZWxkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmZpZWxkcyA9IHZvaWQgMDtcbmNvbnN0IHRleHRfMSA9IHJlcXVpcmUoXCIuL3RleHRcIik7XG5leHBvcnRzLmZpZWxkcyA9IHtcbiAgICBUZXh0OiB0ZXh0XzEuVGV4dCxcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVGV4dCA9IHZvaWQgMDtcbmNvbnN0IGFkYXB0ZXJfMSA9IHJlcXVpcmUoXCIuLi9hZGFwdGVycy9hZGFwdGVyXCIpO1xuY29uc3QgZmllbGRfMSA9IHJlcXVpcmUoXCIuL2ZpZWxkXCIpO1xuY2xhc3MgVGV4dCBleHRlbmRzIGZpZWxkXzEuRmllbGQge1xuICAgIGZyb21EQih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHRvREIodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuICcnLnRyaW0oKTtcbiAgICB9XG4gICAgY2FzdERCKGNvbm4pIHtcbiAgICAgICAgaWYgKGNvbm4uZW5naW5lID09IGFkYXB0ZXJfMS5lbmdpbmVLaW5kLlBvc3RncmVTUUwpIHtcbiAgICAgICAgICAgIHJldHVybiAnVkFSQ0hBUic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdURVhUJztcbiAgICB9XG59XG5leHBvcnRzLlRleHQgPSBUZXh0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNjaGVtYSA9IHZvaWQgMDtcbmNvbnN0IHNlc3Npb25fMSA9IHJlcXVpcmUoXCIuL3Nlc3Npb25cIik7XG5jbGFzcyBTY2hlbWEge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGZpZWxkcywgYWRhcHRlciA9IHNlc3Npb25fMS5zZXNzaW9uLmFkYXB0ZXIpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5maWVsZHMgPSBmaWVsZHM7XG4gICAgICAgIHRoaXMuY29ubiA9IGFkYXB0ZXI7XG4gICAgfVxuICAgIGdldE5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWU7XG4gICAgfVxuICAgIGdldEZpZWxkcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmllbGRzO1xuICAgIH1cbiAgICBnZXRBZGFwdGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25uO1xuICAgIH1cbiAgICBzZWxlY3QodGFibGUpIHtcbiAgICAgICAgbGV0IHNlbGVjdCA9IHRoaXMuY29ubi5zZWxlY3QodGFibGUpO1xuICAgICAgICBzZWxlY3QuZnJvbSh0aGlzLm5hbWUsIE9iamVjdC5rZXlzKHRoaXMuZmllbGRzKSk7XG4gICAgICAgIHJldHVybiBzZWxlY3Q7XG4gICAgfVxufVxuZXhwb3J0cy5TY2hlbWEgPSBTY2hlbWE7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2V0RGVmYXVsdEFkYXB0ZXIgPSBleHBvcnRzLnNlc3Npb24gPSB2b2lkIDA7XG5jb25zdCBhZGFwdGVyXzEgPSByZXF1aXJlKFwiLi9hZGFwdGVycy93ZWJzcWwvYWRhcHRlclwiKTtcbmV4cG9ydHMuc2Vzc2lvbiA9IHtcbiAgICBhZGFwdGVyOiBuZXcgYWRhcHRlcl8xLldlYlNRTEFkYXB0ZXIoJ2RlZmF1bHQnLCAnZGVmYXVsdCBkYicsIDEwMjQgKiogMiksXG59O1xuZnVuY3Rpb24gc2V0RGVmYXVsdEFkYXB0ZXIoYWRhcHRlcikge1xuICAgIGV4cG9ydHMuc2Vzc2lvbi5hZGFwdGVyID0gYWRhcHRlcjtcbn1cbmV4cG9ydHMuc2V0RGVmYXVsdEFkYXB0ZXIgPSBzZXREZWZhdWx0QWRhcHRlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5UYWJsZSA9IHZvaWQgMDtcbmNsYXNzIFRhYmxlIHtcbiAgICBzdGF0aWMgZmluZCh3aGVyZSwgcGFyYW0pIHtcbiAgICAgICAgbGV0IHNlbGVjdCA9IHRoaXMuc2VsZWN0KCk7XG4gICAgICAgIHNlbGVjdC53aGVyZShgJHt3aGVyZX0gPSA/YCwgcGFyYW0pO1xuICAgICAgICByZXR1cm4gc2VsZWN0LmFsbCgpO1xuICAgIH1cbiAgICA7XG4gICAgc3RhdGljIHNlbGVjdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NoZW1hLnNlbGVjdCh0aGlzKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZUZyb21EQihyb3cpIHtcbiAgICAgICAgbGV0IGluc3RhbmNlID0gbmV3IHRoaXM7XG4gICAgICAgIGZvciAobGV0IGEgaW4gcm93KSB7XG4gICAgICAgICAgICBpbnN0YW5jZVthXSA9IHJvd1thXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxufVxuZXhwb3J0cy5UYWJsZSA9IFRhYmxlO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zZXREZWZhdWx0QWRhcHRlciA9IGV4cG9ydHMuc2Vzc2lvbiA9IGV4cG9ydHMuZmllbGRzID0gZXhwb3J0cy5TY2hlbWEgPSBleHBvcnRzLlRhYmxlID0gdm9pZCAwO1xudmFyIHRhYmxlXzEgPSByZXF1aXJlKFwiLi90YWJsZVwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlRhYmxlXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0YWJsZV8xLlRhYmxlOyB9IH0pO1xudmFyIHNjaGVtYV8xID0gcmVxdWlyZShcIi4vc2NoZW1hXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiU2NoZW1hXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBzY2hlbWFfMS5TY2hlbWE7IH0gfSk7XG52YXIgZmllbGRfMSA9IHJlcXVpcmUoXCIuL2ZpZWxkXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZmllbGRzXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBmaWVsZF8xLmZpZWxkczsgfSB9KTtcbnZhciBzZXNzaW9uXzEgPSByZXF1aXJlKFwiLi9zZXNzaW9uXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwic2Vzc2lvblwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc2Vzc2lvbl8xLnNlc3Npb247IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJzZXREZWZhdWx0QWRhcHRlclwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc2Vzc2lvbl8xLnNldERlZmF1bHRBZGFwdGVyOyB9IH0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9