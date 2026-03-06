import json
import boto3

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
pref_table = dynamodb.Table('UserPreferences')

def lambda_handler(event, context):
    """
    Route Engine Microservice
    Handles multi-modal pathfinding and personalizes based on DynamoDB user prefs.
    """
    try:
        body = json.loads(event.get('body', '{}'))
    except TypeError:
        body = event
        
    origin = body.get('origin', 'NDLS')
    destination = body.get('destination', 'India Gate')
    
    # Calculate different multimodal paths
    route_data = calculate_multimodal_path(origin, destination)
    
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"routes": route_data})
    }

def calculate_multimodal_path(origin, dest):
    # Simulated response routing engine logic
    return {
        "fastest": {
            "type": "Fastest",
            "modes": ["Metro", "Auto"],
            "duration_mins": 32, 
            "cost": 45,
            "route_geojson": [[77.2185, 28.6415], [77.2285, 28.6129]]
        },
        "budget": {
            "type": "Cheapest",
            "modes": ["Bus"],
            "duration_mins": 55,
            "cost": 10, # ₹10 Challenge
            "route_geojson": [[77.2185, 28.6415], [77.2155, 28.6325], [77.2285, 28.6129]]
        } 
    }
