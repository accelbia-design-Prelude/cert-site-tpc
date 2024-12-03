import json
import boto3
import base64
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    # Event will be a dict {"certificateId": "1234"}
    BUCKET = 'certificates-thepedagogycommunity'
    FILEPATH = 'School Quality Assessment and Assurance Framework/'
    
    filename = FILEPATH + event['certificateId'] + '.pdf'
    s3 = boto3.client('s3')

    try:
        obj = s3.get_object(Bucket=BUCKET, Key=filename)
        data = obj['Body'].read()
        b64_data = base64.b64encode(data).decode('utf-8')
        return {
            'statusCode': 200,
            'body': json.dumps(
                {
                    'file': b64_data,
                    'url': f'https://{BUCKET}.s3.amazonaws.com/{filename}'
                }
                )
        }
    except ClientError:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'File not found'})
        }
