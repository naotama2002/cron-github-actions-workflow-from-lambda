import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Stack, StackProps, Duration }from "aws-cdk-lib";
import * as dotenv from "dotenv";

export class CronGithubActionsWorkflowFromLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // .env ファイル読み込み
    dotenv.config();

    // Secrets Manager の APN
    const stringSecretArn = process.env.AWS_SECRETS_MANAGER_APN;

    // Secrets Manager が設定されている場合のみ Lambda 登録
    // ここで確認するのが良いのか？という議論は、実業務に入れる時に考える
    // なんでここで確認してるの？に興味がある人は、Enginnering Producitivity Meetup #1 in Tokyo でお話ししましょ (https://cybozu.connpass.com/event/298452/)
    if (stringSecretArn !== undefined) {
      // Secrets Manager APN
      const WorkflowDispatch = new NodejsFunction(this, "WorkflowDispatch", {
        runtime: Runtime.NODEJS_18_X,
        entry: "lambda/handler.ts",
        timeout: Duration.seconds(60),
      });

      // AWS Secrets Manager への権限付与
      //   Secrets Manager の該当 APN の Read権限
      const smResource = Secret.fromSecretCompleteArn(this, "SecretsManager", stringSecretArn);
      smResource.grantRead(WorkflowDispatch);

      // 5分ごとに実行
      new Rule(this, "WorkflowDispatchRule", {
        schedule: Schedule.expression("cron(0/5 * * * ? *)"),
        targets: [new LambdaFunction(WorkflowDispatch,
          {
            retryAttempts: 0
          }
        )],
      });
    } else {
      throw new Error("Secrets Manager の APN が .env ファイルから読み込めませんでした。.env.sample を .env にコピーして Secrets Manager の APN を設定してください。");
    }
  }
}
