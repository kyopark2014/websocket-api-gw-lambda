# Labmda로 Websocket 활용하기

여기서는 WebSocket을 이용하여 API Gateway - Lambda를 연결합니다. 

## CDK로 인프라 생성하기

```java
const websocketapi = new apigatewayv2.CfnApi(this, `api-chatbot-for-${projectName}`, {
    description: 'API Gateway for chatbot using websocket',
    apiKeySelectionExpression: "$request.header.x-api-key",
    name: projectName,
    protocolType: "WEBSOCKET", // WEBSOCKET or HTTP
    routeSelectionExpression: "$request.body.action",
});
websocketapi.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY); // DESTROY, RETAIN
```

이렇게 해서 생성되는 connection url은 아래와 같습니다.

```java
const connection_url = `https://${websocketapi.attrApiId}.execute-api.${region}.amazonaws.com/${stage}`;
```

#### Integration

ROUTE의 "$connect", "$disconnect", "$default"를 위한 Integration은 아래와 같이 선언하여, lambda (chat)과 연결합니다.

```java
const integrationUri = `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${lambdachat.functionArn}/invocations`;
const cfnIntegration = new apigatewayv2.CfnIntegration(this, `api-integration-for-${projectName}`, {
    apiId: websocketapi.attrApiId,
    integrationType: 'AWS_PROXY',
    credentialsArn: role.roleArn,
    connectionType: 'INTERNET',
    description: 'Integration for connect',
    integrationUri: integrationUri,
});  
```

#### Route

API Gateway의 Route는 아래와 같이 정의합니다.

```java
new apigatewayv2.CfnRoute(this, `api-route-for-${projectName}-connect`, {
    apiId: websocketapi.attrApiId,
    routeKey: "$connect",
    apiKeyRequired: false,
    authorizationType: "NONE",
    operationName: 'connect',
    target: `integrations/${cfnIntegration.ref}`,
});

new apigatewayv2.CfnRoute(this, `api-route-for-${projectName}-disconnect`, {
    apiId: websocketapi.attrApiId,
    routeKey: "$disconnect",
    apiKeyRequired: false,
    authorizationType: "NONE",
    operationName: 'disconnect',
    target: `integrations/${cfnIntegration.ref}`,
});

new apigatewayv2.CfnRoute(this, `api-route-for-${projectName}-default`, {
    apiId: websocketapi.attrApiId,
    routeKey: "$default",
    apiKeyRequired: false,
    authorizationType: "NONE",
    operationName: 'default',
    target: `integrations/${cfnIntegration.ref}`,
});
```

Stage 생성이 완료되기 전에 Deploy가 되면 배포가 실패될수 있으므로 아래와 같이 멀티 스택으로 정의합니다.

```java
new componentDeployment(scope, "deployments", websocketapi.attrApiId)       

export class componentDeployment extends cdk.Stack {
  constructor(scope: Construct, id: string, appId: string, props?: cdk.StackProps) {    
    super(scope, id, props);

    new apigatewayv2.CfnDeployment(this, `api-deployment-for-${projectName}`, {
      apiId: appId,
      description: "deploy api gateway using websocker",  // $default
      stageName: stage
    });   
  }
}
```

#### 배포

배포하기 위해서는 Stage를 정의하여야 합니다.

```java
new apigatewayv2.CfnStage(this, `api-stage-for-${projectName}`, {
    apiId: websocketapi.attrApiId,
    stageName: stage
});
```

## 인프라 설치

```text
cdk deploy --all
```

## 시험

cdk로 인프라 설치후 결과는 아래와 같습니다.

![image](https://github.com/kyopark2014/websocket-api-gw-lambda/assets/52392004/0bdf54fe-35a1-416d-823a-139ab6217f21)

여기서, CdkWebsocketApiStack.websocketurl을 이용하여 아래와 같이 접속합니다.

```text
wscat -c wss://z8esbpg0x4.execute-api.ap-northeast-2.amazonaws.com/dev
```

이를 위해서는 "pip install wascat"로 설치가 필요합니다.

## 인프라 삭제

```text
cdk destroy --all
```

## Reference

[How to build a chat using Lambda + WebSocket + API Gateway? (nodejs)](https://www.youtube.com/watch?v=BcWD-M2PJ-8)

[Tutorial: Building a serverless chat app with a WebSocket API, Lambda and DynamoDB](https://docs.aws.amazon.com/apigateway/latest/developerguide/websocket-api-chat-app.html)

[AWS::ApiGatewayV2::RouteResponse](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html)

[About WebSocket APIs in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-overview.html)

[AWS::ApiGatewayV2::Api](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-routeselectionexpression)

[class CfnApi (construct)](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigatewayv2.CfnApi.html)

[AWS::ApiGatewayV2 Construct Library](https://github.com/aws/aws-cdk/tree/v2.99.1/packages/aws-cdk-lib/aws-apigatewayv2)

[class WebSocketApi (construct)](https://docs.aws.amazon.com/cdk/api/v2/docs/@aws-cdk_aws-apigatewayv2-alpha.WebSocketApi.html)

[API Gateway Websocket API Example with AWS CDK](http://buraktas.com/api-gateway-websocket-api-example-aws-cdk/)
