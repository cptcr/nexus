"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var crypto_1 = require("crypto");
var createFilePath = function (folderPath, modelName) { return path.join(folderPath, "".concat(modelName, ".json")); };
var createFileIfNotExists = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!fs.existsSync(filePath)) return [3 /*break*/, 2];
                return [4 /*yield*/, fs.promises.writeFile(filePath, JSON.stringify([]))];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
var readFile = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var fileContent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs.promises.readFile(filePath, 'utf-8')];
            case 1:
                fileContent = _a.sent();
                return [2 /*return*/, JSON.parse(fileContent)];
        }
    });
}); };
var writeFile = function (filePath, data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs.promises.writeFile(filePath, JSON.stringify(data, null, 2))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var LocalDatabase = /** @class */ (function () {
    function LocalDatabase(modelName, schema, folderPath) {
        if (folderPath === void 0) { folderPath = './src/data'; }
        this.modelName = modelName;
        this.schema = schema;
        this.filePath = createFilePath(folderPath, modelName);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        createFileIfNotExists(this.filePath);
    }
    LocalDatabase.prototype.generateUUID = function () {
        return (0, crypto_1.createHash)('sha1').update("".concat(Date.now()).concat(Math.random())).digest('hex');
    };
    LocalDatabase.prototype.validateSchema = function (document) {
        for (var key in this.schema) {
            if (typeof document[key] !== this.schema[key]) {
                throw new Error("Invalid type for ".concat(key, ". Expected ").concat(this.schema[key], ", but got ").concat(typeof document[key]));
            }
        }
        return true;
    };
    LocalDatabase.prototype.insert = function (document) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.validateSchema(document);
                        document._id = this.generateUUID();
                        return [4 /*yield*/, readFile(this.filePath)];
                    case 1:
                        data = _a.sent();
                        data.push(document);
                        return [4 /*yield*/, writeFile(this.filePath, data)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, document];
                }
            });
        });
    };
    LocalDatabase.prototype.find = function (query) {
        if (query === void 0) { query = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile(this.filePath)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.filter(function (doc) {
                                return Object.keys(query).every(function (key) { return doc[key] === query[key]; });
                            })];
                }
            });
        });
    };
    LocalDatabase.prototype.findOne = function (query) {
        if (query === void 0) { query = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile(this.filePath)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.find(function (doc) {
                                return Object.keys(query).every(function (key) { return doc[key] === query[key]; });
                            })];
                }
            });
        });
    };
    LocalDatabase.prototype.update = function (query, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var data, updatedDocs, updatedData;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile(this.filePath)];
                    case 1:
                        data = _a.sent();
                        updatedDocs = [];
                        updatedData = data.map(function (doc) {
                            if (Object.keys(query).every(function (key) { return doc[key] === query[key]; })) {
                                var updatedDoc = __assign(__assign({}, doc), updates);
                                _this.validateSchema(updatedDoc);
                                updatedDocs.push(updatedDoc);
                                return updatedDoc;
                            }
                            return doc;
                        });
                        return [4 /*yield*/, writeFile(this.filePath, updatedData)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, updatedDocs];
                }
            });
        });
    };
    LocalDatabase.prototype.delete = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var data, filteredData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile(this.filePath)];
                    case 1:
                        data = _a.sent();
                        filteredData = data.filter(function (doc) {
                            return !Object.keys(query).every(function (key) { return doc[key] === query[key]; });
                        });
                        return [4 /*yield*/, writeFile(this.filePath, filteredData)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, data.length !== filteredData.length];
                }
            });
        });
    };
    return LocalDatabase;
}());
exports.default = LocalDatabase;
