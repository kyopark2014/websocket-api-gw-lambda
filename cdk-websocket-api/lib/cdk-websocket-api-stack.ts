import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs"
import * as iam from 'aws-cdk-lib/aws-iam';

const projectName = "websocket-api";
const stage = "dev";
const functionNmae = `lambda-chat-for-${projectName}`;
const region = process.env.CDK_DEFAULT_REGION;   

export class CdkWebsocketApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // role
     const role = new iam.Role(this, `api-role-for-${projectName}`, {
      roleName: `api-role-for-${projectName}`,
      assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com")
    });
    role.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['lambda:InvokeFunction']
    }));
    role.addManagedPolicy({
      managedPolicyArn: 'arn:aws:iam::aws:policy/AWSLambdaExecute',
    }); 
    
    // API Gateway
    const websocketapi = new apigatewayv2.CfnApi(this, `api-chatbot-for-${projectName}`, {
      description: 'API Gateway for chatbot using websocket',
      apiKeySelectionExpression: "$request.header.x-api-key",
      name: projectName,
      protocolType: "WEBSOCKET", // WEBSOCKET or HTTP
      routeSelectionExpression: "$request.body.action",     
    });  
    websocketapi.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY); // DESTROY, RETAIN

    new cdk.CfnOutput(this, 'api-identifier', {
      value: websocketapi.attrApiId,
      description: 'The API identifier.',
    });

    const wss_url = `wss://${websocketapi.attrApiId}.execute-api.${region}.amazonaws.com/${stage}`;
    new cdk.CfnOutput(this, 'web-socket-url', {
      value: wss_url,
      
      description: 'The URL of Web Socket',
    });

    const connection_url = `https://${websocketapi.attrApiId}.execute-api.${region}.amazonaws.com/${stage}`;
    new cdk.CfnOutput(this, 'connection-url', {
      value: connection_url,
      
      description: 'The URL of connection',
    });

    // Lambda - Chat
    const lambdachat = new lambda.Function(this, `lambda-chat-for-${projectName}`, {
      runtime: lambda.Runtime.NODEJS_16_X, 
      functionName: functionNmae,
      code: lambda.Code.fromAsset("../lambda-chat"), 
      handler: "index.handler", 
      timeout: cdk.Duration.seconds(10),
      logRetention: logs.RetentionDays.ONE_DAY,
      environment: {
        connection_url: connection_url
      }      
    });
    lambdachat.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));  

    new cdk.CfnOutput(this, 'function-chat-arn', {
      value: lambdachat.functionArn,
      description: 'The arn of lambda chat.',
    });
    
    new cdk.CfnOutput(this, 'function-chat-name', {
      value: lambdachat.functionName,
      description: 'The name of lambda chat.',
    });
  
    const integrationUri = `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${lambdachat.functionArn}/invocations`;    
    const cfnIntegration = new apigatewayv2.CfnIntegration(this, `api-integration-for-${projectName}`, {
      apiId: websocketapi.attrApiId,
      integrationType: 'AWS_PROXY',
      credentialsArn: role.roleArn,
      connectionType: 'INTERNET',
      description: 'Integration for connect',
      integrationUri: integrationUri,
    });  

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

    new apigatewayv2.CfnStage(this, `api-stage-for-${projectName}`, {
      apiId: websocketapi.attrApiId,
      stageName: stage
    }); 

    // deploy components
    new componentDeployment(scope, "deployments", websocketapi.attrApiId)       
  }
}

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