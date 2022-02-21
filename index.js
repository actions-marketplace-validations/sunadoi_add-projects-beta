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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const graphql_1 = require("@octokit/graphql");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const graphqlWithAuth = graphql_1.graphql.defaults({
        headers: {
            authorization: `token ${core_1.getInput("github-token")}`,
        },
    });
    const query = `
    query($login: String!, $projectNumber: Int!) {
      user(login: $login) {
        projectNext(number: $projectNumber) {
          id
        }
      }
      organization(login: $login) {
        projectNext(number: $projectNumber) {
          id
        }
      }
    }
  `;
    const mutation = `
    mutation($projectId: ID!, $contentId: ID!) {
      addProjectNextItem(input: {projectId: $projectId, contentId: $contentId}) {
        projectNextItem {
          id
        }
      }
    }
  `;
    try {
        const queryResult = yield graphqlWithAuth(query, {
            login: core_1.getInput("project-owner"),
            projectNumber: Number(core_1.getInput("project-number")),
        });
        const projectNodeId = ((_b = (_a = queryResult === null || queryResult === void 0 ? void 0 : queryResult.user) === null || _a === void 0 ? void 0 : _a.projectNext) === null || _b === void 0 ? void 0 : _b.id) ||
            ((_d = (_c = queryResult === null || queryResult === void 0 ? void 0 : queryResult.organization) === null || _c === void 0 ? void 0 : _c.projectNext) === null || _d === void 0 ? void 0 : _d.id) ||
            "";
        console.log(projectNodeId);
        if (!projectNodeId) {
            console.error(`no project node id`);
        }
        const mutationResult = yield graphqlWithAuth(mutation, {
            projectId: projectNodeId,
            contentId: core_1.getInput("content-id"),
        });
        return ((_f = (_e = mutationResult === null || mutationResult === void 0 ? void 0 : mutationResult.addProjectNextItem) === null || _e === void 0 ? void 0 : _e.projectNextItem) === null || _f === void 0 ? void 0 : _f.id) || "";
    }
    catch (error) {
        console.log("error");
        if (error instanceof graphql_1.GraphqlResponseError) {
            console.error("Request failed: ", error.request);
            console.error(error.message);
        }
        return;
    }
});
main();
