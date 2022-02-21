"use strict";
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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __importDefault(require("@actions/core"));
var graphql_1 = require("@octokit/graphql");
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var graphqlWithAuth, query, mutation, queryResult, projectNodeId, mutationResult, error_1;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                graphqlWithAuth = graphql_1.graphql.defaults({
                    headers: {
                        authorization: core_1.default.getInput("github-token"),
                    },
                });
                query = "\n    query($login: String!, $projectNumber: Int!) {\n      organization(login: $login) {\n        projectNext(number: $projectNumber) {\n          id\n        }\n      }\n    }\n  ";
                mutation = "\n    mutation($projectId: ID!, $contentId: ID!) {\n      addProjectNextItem(input: {projectId: $projectId, contentId: $contentId}) {\n        projectNextItem {\n          id\n        }\n      }\n    }\n  ";
                _g.label = 1;
            case 1:
                _g.trys.push([1, 4, , 5]);
                return [4 /*yield*/, graphqlWithAuth(query, {
                        login: core_1.default.getInput("project-owner"),
                        projectNumber: core_1.default.getInput("project-number"),
                    })];
            case 2:
                queryResult = _g.sent();
                projectNodeId = ((_b = (_a = queryResult === null || queryResult === void 0 ? void 0 : queryResult.user) === null || _a === void 0 ? void 0 : _a.projectNext) === null || _b === void 0 ? void 0 : _b.id) ||
                    ((_d = (_c = queryResult === null || queryResult === void 0 ? void 0 : queryResult.organization) === null || _c === void 0 ? void 0 : _c.projectNext) === null || _d === void 0 ? void 0 : _d.id) ||
                    "";
                if (!projectNodeId) {
                    console.error("no project node id");
                }
                return [4 /*yield*/, graphqlWithAuth(mutation, {
                        projectId: projectNodeId,
                        contentId: core_1.default.getInput("content-id"),
                    })];
            case 3:
                mutationResult = _g.sent();
                return [2 /*return*/, ((_f = (_e = mutationResult === null || mutationResult === void 0 ? void 0 : mutationResult.addProjectNextItem) === null || _e === void 0 ? void 0 : _e.projectNextItem) === null || _f === void 0 ? void 0 : _f.id) || ""];
            case 4:
                error_1 = _g.sent();
                console.error(error_1.message);
                return [2 /*return*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
main();
