import json
import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('lotion-30142405')
    email = event["queryStringParameters"]["email"]
    
    res = table.query(KeyConditionExpression = Key('email').eq(email))
    
    return {
        "statusCode": 200,
        "body": json.dumps(res["Items"])
    }
