import json
import boto3
from decimal import Decimal

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
# table = dynamodb.Table('TransitFareRegistry')

def lambda_handler(event, context):
    """
    Budget Engine Microservice
    Calculates the most cost-effective routes, specifically handling the ₹10 challenge.
    """
    try:
        body = json.loads(event.get('body', '{}'))
        origin = body.get('origin', 'Current Location')
        destination = body.get('destination', 'India Gate')
        max_budget = body.get('max_budget', 10) # Default to ₹10 challenge
        
        # Simulate DynamoDB lookup for standard fares
        # response = table.query(KeyConditionExpression=Key('route_id').eq('NDLS-IG'))
        
        # Budget mode logic: Prioritize DTC Non-AC buses and Metro short-hops
        budget_routes = [
            {
                "id": "budget-1",
                "name": "₹10 Challenge Route",
                "mode": "Bus (Non-AC)",
                "cost": 10,
                "time": "45 min",
                "savings": "₹40 vs Auto",
                "steps": [
                    "Walk 200m to NDLS Gate 2",
                    "Board DTC Bus 440 (Non-AC)",
                    "Alight at Mandi House",
                    "Walk 400m to India Gate"
                ]
            }
        ]
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                "engine": "BudgetOptimizer-v1",
                "max_budget": max_budget,
                "routes": budget_routes,
                "recommendation": "Use DTC Bus 440 for the most affordable ₹10 journey."
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
