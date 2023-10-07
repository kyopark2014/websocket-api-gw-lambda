# Labmda로 Websocket 활용하기

## 인프라 설치

```text
cdk deploy --all
```

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
