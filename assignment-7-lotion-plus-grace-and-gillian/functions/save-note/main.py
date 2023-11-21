import boto3
import json

dynamodb_resource = boto3.resource('dynamodb')
table = dynamodb_resource.Table('lotion-30142405')

def lambda_handler(event, context):
    try:
        table.put_item(
            Item = json.loads(event['body'])
        )
        return {
            'statusCode': 201,
            'body': "hello"
            
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
            "message": str(e)
            })
        }
