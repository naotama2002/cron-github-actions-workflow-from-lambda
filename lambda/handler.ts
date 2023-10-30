import { AWS_SM_SECRET_ID } from "./constants";
import { loadSecrets } from "./secrets";
import { triggerWorkflowDispatch } from "./trigger-ga-workflow-dispatch";

export const handler = async () => {
  const secretId = AWS_SM_SECRET_ID;
  const secrets = await loadSecrets(secretId);

  await triggerWorkflowDispatch({ secrets });
};
