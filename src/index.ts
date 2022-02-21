import { getInput, setOutput } from "@actions/core";
import { graphql } from "@octokit/graphql";

import { getProjectId } from "./getProjectId";
import { addProjects } from "./addProjects";

export const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${getInput("github-token")}`,
  },
});

const main = async () => {
  const projectNodeId = await getProjectId();
  if (!projectNodeId) throw new Error(`no project node id`);

  const result = await addProjects(projectNodeId);
  setOutput("added-item-id", result);
};

main();
