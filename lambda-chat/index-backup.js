const aws = require('aws-sdk');
import { LambdaActions } from 'lambda-actions';
//import aws from 'aws-sdk';

/*
const wss_url = process.env.wss_url;
console.log('wss_url: ', wss_url);
const ENDPOINT = wss_url;
const client = new aws.ApiGatewayManagementApi({ endpoint: ENDPOINT });
let NAMES_DB = {};

const sendToOne = async (id, body) => {
    try {
        await client.postToConnection({
            'ConnectionId': id,
            'Data': Buffer.from(JSON.stringify(body)),
        }).promise();
    } catch (err) {
        console.error(err);
    }
};

const sendToAll = async (ids, body) => {
    const all = ids.map(i => sendToOne(i, body));
    return Promise.all(all);
};

export const $connect = async () => {
    return {};
};

export const setName = async (payload, meta) => {
    NAMES_DB[meta.connectionId] = payload.name;
    await sendToAll(Object.keys(NAMES_DB), { members: Object.values(NAMES_DB) });
    await sendToAll(Object.keys(NAMES_DB), { systemMessage: `${NAMES_DB[meta.connectionId]} has joined the chat` })
    return {};
};

export const sendPublic = async (payload, meta) => {
    await sendToAll(Object.keys(NAMES_DB), { publicMessage: `${NAMES_DB[meta.connectionId]}: ${payload.message}` })
    return {};
};

export const sendPrivate = async (payload, meta) => {
    const to = Object.keys(NAMES_DB).find(key => NAMES_DB[key] === payload.to);
    await sendToOne(to, { privateMessage: `${NAMES_DB[meta.connectionId]}: ${payload.message}` });
    return {};
};

export const $disconnect = async (payload, meta) => {
    await sendToAll(Object.keys(NAMES_DB), { systemMessage: `${NAMES_DB[meta.connectionId]} has left the chat` })
    delete NAMES_DB[meta.connectionId];
    await sendToAll(Object.keys(NAMES_DB), { members: Object.values(NAMES_DB) })
    return {};
}; */

exports.handler = async (event, context) => {
    // console.log('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env));
    console.log('## EVENT: ' + JSON.stringify(event));

  /*  if (!event.requestContext) {
        return {
            statusCode: 500,
            body: JSON.stringify(event)
        };
    }

    try {
        const connectionId = event.requestContext.connectionId;
        console.log('connectionId: ', connectionId);
        const routeKey = event.requestContext.routeKey;
        console.log('routeKey: ', routeKey);
        const body = JSON.parse(event.body || '{}');
        console.log('body: ', body);

        const lambdaActions = new LambdaActions();
        lambdaActions.action('$connect', $connect);
        lambdaActions.action('$disconnect', $disconnect);
        lambdaActions.action('setName', setName);
        lambdaActions.action('sendPublic', sendPublic);
        lambdaActions.action('sendPrivate', sendPrivate);

        await lambdaActions.fire({
            action: routeKey,
            payload: body,
            meta: { connectionId },
        });

    } catch (err) {
        console.error(err);
    } */

    const response = {
        statusCode: 200,
        body: "Ok" 
    };
    return response;
};