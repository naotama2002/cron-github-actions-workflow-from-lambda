import { Secrets } from "./secrets";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { WORKFLOW_OWNER, WORKFLOW_REPO, WORKFLOW_ID, WORKFLOW_REF } from "./constants";

type triggerWorkflowDispatchParams = {
  secrets: Secrets;
};

export const triggerWorkflowDispatch = async ({
  secrets,
}: triggerWorkflowDispatchParams): Promise<void> => {
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: secrets.GITHUB_APP_ID,
      privateKey: secrets.GITHUB_SECRET_KEY,
      installationId: secrets.GITHUB_APP_INSTALLATION_ID,
    },
  });

  await octokit.rest.actions
    .createWorkflowDispatch({
      owner: WORKFLOW_OWNER,
      repo: WORKFLOW_REPO,
      workflow_id: WORKFLOW_ID,
      ref: WORKFLOW_REF,
    })
    .then((_) => {
      console.log(
        `success: ${WORKFLOW_OWNER}/${WORKFLOW_REPO}/${WORKFLOW_ID}:${WORKFLOW_REF} workflow_dispatch`,
      );
    })
    .catch((error) => {
      console.log(
        `error: ${WORKFLOW_OWNER}/${WORKFLOW_REPO}/${WORKFLOW_ID}:${WORKFLOW_REF} workflow_dispatch`,
      );
      throw error;
    }
  );
};
