const aws = require('aws-sdk');
//const aws = require('aws-sdk');
//import { LambdaActions } from 'lambda-actions';
//import aws from 'aws-sdk';


const connection_url = process.env.connection_url;
console.log('connection_url: ', connection_url);
const ENDPOINT = connection_url;
const client = new aws.ApiGatewayManagementApi({ endpoint: ENDPOINT });

let sesssionId;

const sendMessage = async (id, body) => {
    try {
        await client.postToConnection({
            'ConnectionId': id,
            'Data': Buffer.from(JSON.stringify(body)),
        }).promise();
    } catch (err) {
        console.error(err);
    }
};

exports.handler = async (event, context) => {
    // console.log('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env));
    // console.log('## EVENT: ' + JSON.stringify(event));
    
    if (!event.requestContext) {
        return {
            statusCode: 500,
            body: JSON.stringify(event)
        };
    }
    console.log('Request: ' + JSON.stringify(event['requestContext']));

    try {
        const connectionId = event.requestContext.connectionId;
        console.log('connectionId: ', connectionId);
        const routeKey = event.requestContext.routeKey;
        console.log('routeKey: ', routeKey);
        const body = JSON.parse(event.body || '{}');
        console.log('body: ', body);

        switch(routeKey) {
            case '$connect':
                console.log('sesssionId: ', sesssionId);                
                console.log('new connection!');
                sesssionId = connectionId;
                break;
            case '$disconnect':
                console.log('the session was disconnected!');
                break;
            case '$default':
                await sendMessage(sesssionId, {message: `The received message: ${body}`})
                break;
            case 'message':
                await sendMessage(sesssionId, {message: `The received message: ${body}`})
                break;
        }
    } catch (err) {
        console.error(err);
    } 

    const response = {
        statusCode: 200,
        body: "Ok" 
    };
    return response;
};