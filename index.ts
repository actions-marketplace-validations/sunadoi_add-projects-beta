import { getInput } from "@actions/core";
import {
  graphql,
  GraphQlQueryResponseData,
  GraphqlResponseError,
} from "@octokit/graphql";

const main = async () => {
  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${getInput("github-token")}`,
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
    const queryResult: GraphQlQueryResponseData = await graphqlWithAuth(query, {
      login: getInput("project-owner"),
      projectNumber: Number(getInput("project-number")),
    });

    const projectNodeId =
      queryResult?.user?.projectNext?.id ||
      queryResult?.organization?.projectNext?.id ||
      "";

    console.log(projectNodeId);
    if (!projectNodeId) {
      console.error(`no project node id`);
    }

    const mutationResult: GraphQlQueryResponseData = await graphqlWithAuth(
      mutation,
      {
        projectId: projectNodeId,
        contentId: getInput("content-id"),
      }
    );
    return mutationResult?.addProjectNextItem?.projectNextItem?.id || "";
  } catch (error: unknown) {
    console.log("error");
    if (error instanceof GraphqlResponseError) {
      console.error("Request failed: ", error.request);
      console.error(error.message);
    }
    return;
  }
};

main();
