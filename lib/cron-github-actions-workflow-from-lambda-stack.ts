import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from 'aws-cdk-lib/aws-events-targets';

export class CronGithubActionsWorkflowFromLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const WorkflowDispatch = new NodejsFunction(this, "WorkflowDispatch", {
      runtime: Runtime.NODEJS_18_X,
      entry: "lib/trigger-ga-workflow-dispatch.ts",
      timeout: cdk.Duration.seconds(60),
    });

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
