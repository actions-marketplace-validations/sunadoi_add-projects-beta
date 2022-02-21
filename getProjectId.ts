import { getInput } from "@actions/core";
import { GraphqlResponseError } from "@octokit/graphql";
import { graphqlWithAuth } from ".";

export const getProjectId = async () => {
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

  try {
    await graphqlWithAuth(query, {
      login: getInput("project-owner"),
      projectNumber: Number(getInput("project-number")),
    });
  } catch (error) {
    if (error instanceof GraphqlResponseError) {
      if (!error.data) {
        console.error("Request failed: ", error.request);
        console.error(error.message);
      }
      return (
        error.data.user?.projectNext?.id ||
        error.data.organization?.projectNext?.id ||
        ""
      );
    }
  }
};
