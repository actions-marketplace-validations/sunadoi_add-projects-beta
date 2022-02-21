import core from "@actions/core";
import { graphql, GraphQlQueryResponseData } from "@octokit/graphql";

const main = async () => {
  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: core.getInput("github-token"),
    },
  });

  const query = `
    query($login: String!, $projectNumber: Int!) {
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
    const queryResult: GraphQlQueryResponseData = await graphqlWithAuth(query, {
      login: core.getInput("project-owner"),
      projectNumber: core.getInput("project-number"),
    });

    const projectNodeId =
      queryResult?.user?.projectNext?.id ||
      queryResult?.organization?.projectNext?.id ||
      "";
    if (!projectNodeId) {
      console.error(`no project node id`);
    }

    const mutationResult: GraphQlQueryResponseData = await graphqlWithAuth(
      mutation,
      {
        projectId: projectNodeId,
        contentId: core.getInput("content-id"),
      }
    );
    return mutationResult?.addProjectNextItem?.projectNextItem?.id || "";
  } catch (error) {
    console.error(error.message);
    return;
  }
};

main();
