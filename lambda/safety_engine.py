```python
import json
import boto3

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
table = dynamodb.Table('SafetyEventDB')

def lambda_handler(event, context):
    """
    Safety Engine Microservice
    Queries DynamoDB for real-time safety incidents and crowd reports.
    """
    try:
        # Simulate DynamoDB query for active safety alerts in the area
        # response = table.query(
        #     IndexName='LocationIndex',
        #     KeyConditionExpression=Key('city').eq('Delhi')
        # )
        # alerts = response.get('Items', [])
        body = json.loads(event.get('body', '{}'))
    except TypeError:
        body = event
        
    route_waypoints = body.get('waypoints', ['Janpath'])
    
    # In a real app, query DynamoDB for recent alerts near the route coordinates
    # recent_alerts = table.query(
    #     KeyConditionExpression="AreaId = :area",
    #     ExpressionAttributeValues={":area": route_waypoints[0]}
    # )
    
    # Simulated query result
    recent_alerts = [{"incident": "Poor lighting reported", "severity": 2}]
    
    # Base safety is 99, minus 5 for every recent alert
    safety_score = max(50, 99 - (len(recent_alerts) * 5))
    
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"base_safety_score": safety_score, "alerts": recent_alerts})
    }
