import { getInput } from "@actions/core";
import {
  GraphQlQueryResponseData,
  GraphqlResponseError,
} from "@octokit/graphql";
import { graphqlWithAuth } from ".";

export const addProjects = async (projectNodeId: string) => {
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
    const result: GraphQlQueryResponseData = await graphqlWithAuth(mutation, {
      projectId: projectNodeId,
      contentId: getInput("content-id"),
    });
    return result?.addProjectNextItem?.projectNextItem?.id;
  } catch (error) {
    if (error instanceof GraphqlResponseError && !error.data) {
      console.error("Request failed: ", error.request);
      console.error(error.message);
    }
  }
};
