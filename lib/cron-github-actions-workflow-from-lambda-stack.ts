import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as cdk from "aws-cdk-lib";
import * as dotenv from "dotenv";

export class CronGithubActionsWorkflowFromLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stringSecretArn = process.env.AWS_SECRETS_MANAGER_APN;
    if (stringSecretArn !== undefined) {
      const WorkflowDispatch = new NodejsFunction(this, "WorkflowDispatch", {
        runtime: Runtime.NODEJS_18_X,
        entry: "lib/trigger-ga-workflow-dispatch.ts",
        timeout: cdk.Duration.seconds(60),
      });

    // AWS Secrets Manager への権限付与
    const smResource = Secret.fromSecretCompleteArn(this, "SecretsManager", stringSecretArn);
      smResource.grantRead(WorkflowDispatch);

      new events.Rule(this, "WorkflowDispatchRule", {
        // 5分ごとに実行
        schedule: events.Schedule.expression("cron(0/5 * * * ? *)"),
        targets: [new targets.LambdaFunction(WorkflowDispatch,
          {
            retryAttempts: 0
          }
        )],
      });
    }
  }
}
