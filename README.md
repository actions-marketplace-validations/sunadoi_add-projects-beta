# Add issues or PRs to GitHub Projects(Beta)

[![test](https://github.com/sunadoi/add-projects-beta/actions/workflows/test.yml/badge.svg)](https://github.com/sunadoi/add-projects-beta/actions/workflows/test.yml)

This action adds issue or PR to GitHub Projects(Beta).

## Inputs
All inputs are required.
### `github-token`
Personal access token that contains `repo` and `org:write` is required.
For security reasons, it is recommended to set the token to GitHub secrets.

### `project-owner`
User or Organization name of projects beta.

### `project-number`
The projects number.
This is shown in URL of projects.
In the following example, the projects number is 1.
`https://github.com/orgs/foo/projects/1`

### `content-id`
The node id of issue or PR.
You can use `github.event.issue.node_id` if triggered `on: issues` or `github.event.pull_request.node_id` if triggered `on: pull_request`.

## Outputs
### `added-item-id`
Project item id added to the project.

## Example Usage
```
- uses: sunadoi/add-projects-beta@v1
  with:
    github-token: ${{ secrets.ADD_PROJECTS_BETA }}
    project-owner: "foo"
    project-number: 1
    content-id: ${{ github.event.issue.node_id }}
```