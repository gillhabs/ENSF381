# add your delete-note function here
import boto3

import json


dynamodb_resource = boto3.resource('dynamodb')
table = dynamodb_resource.Table('lotion-30142405')

def lambda_handler(event, context):
    parameter = json.loads(event['body'])
    try:
        table.delete_item (
            Key={
                "email": parameter["email"],
                "id": parameter["id"]
            }
        )
        
        return {
            'statusCode': 200,
            'body': 'succeeded'
        }
        
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps({
            "message": str(e)
            })
        }
     

# uses delete
