# GitHub Actions の Cron ジョブを AWS Lambda から定刻に実行する ( AWS CDK + Lambda + GitHub Apps + GitHub Actions workflow_dispatch 実行 )

## setup

node が利用できるようにした状態で ( Node.js 18.18.0 で確認しています )

Secrets Manager APN 設定
```
cp .env.sample .env
```
.env ファイルの `AWS_SECRETS_MANAGER_APN` を設定

build
```
npm install
npm run build
```

aws profile ( aws cli が install されていることを前提にしている)
```
aws sts get-caller-identity
```
例えば、で AWS Account ID が表示されていること

## deploy

最初一回
```
npm run cdk bootstrap
```

deploy
```
npm run cdk deploy
```

## 自分の環境に合わせて

- .env : Secrets Manager APN 設定
- .lib/constants.ts : GitHub App, GitHub Actions Workflow 情報
- AWS Secrets Manager に必要な情報を設定

see. https://zenn.dev/naotama/articles/cron-github-actions-workflow-from-lambda

## test

テストは未実装です
