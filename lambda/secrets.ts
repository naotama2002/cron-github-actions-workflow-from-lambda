import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { REGION } from "./constants";

export type Secrets = {
  GITHUB_SECRET_KEY: string;
  GITHUB_APP_ID: string;
  GITHUB_APP_INSTALLATION_ID: string;
};

export async function loadSecrets(secretId: string) {
  const client = new SecretsManagerClient({
    region: REGION,
  });

  let response;
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretId,
      }),
    );
  } catch (e) {
    throw new Error(`シークレットが取得できませんでした: ${secretId}`);
  }

  if (response.SecretString === undefined) {
    throw new Error(`シークレットの値がありませんでした: ${secretId}`);
  }

  return JSON.parse(response.SecretString) as Secrets;
}
