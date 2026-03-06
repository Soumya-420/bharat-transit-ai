import json
import random
import time

def lambda_handler(event, context):
    """
    Crowd Prediction Engine Microservice
    Simulates real-time crowd level and route delays using time-of-day weights.
    """
    try:
        body = json.loads(event.get('body', '{}'))
    except TypeError:
        body = event
        
    station = body.get('station', 'NDLS Metro')
    
    # Basic simulation logic: higher density during rush hours
    current_hour = time.localtime().tm_hour
    
    if 8 <= current_hour <= 10 or 17 <= current_hour <= 20:
        density_level = "High"
        delay_mins = random.randint(5, 15)
    else:
        density_level = "Moderate"
        delay_mins = random.randint(0, 5)
        
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({
            "station": station,
            "crowd_density": density_level,
            "estimated_delay": delay_mins,
            "timestamp": time.time()
        })
    }
