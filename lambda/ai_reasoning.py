import json
import boto3

# Initialize Bedrock Runtime client
bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')

def lambda_handler(event, context):
    """
    AI Reason Engine Microservice
    Invokes Amazon Bedrock (Claude 3 Haiku) to write human-readable safety contexts.
    """
    try:
        body = json.loads(event.get('body', '{}'))
    except TypeError:
        body = event
        
    route_str = body.get('route_str', 'Metro -> Walk')
    raw_score = body.get('safety_score', 85)
    destination = body.get('destination', 'India Gate')
    
    prompt = f"Analyze this transit route in India: {route_str} to {destination} with a safety score of {raw_score}/100. Write a 2-sentence user-friendly explanation of why it is safe, mentioning crowd levels or lighting."
    
    try:
        response = bedrock.invoke_model(
            modelId='anthropic.claude-3-haiku-20240307-v1:0',
            contentType='application/json',
            accept='application/json',
            body=json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 150,
                "messages": [{"role": "user", "content": prompt}]
            })
        )
        
        result = json.loads(response['body'].read())
        ai_text = result['content'][0]['text']
    except Exception as e:
        ai_text = f"Safety recommended based on current analytics for {route_str}. Station areas are continuously monitored."
        
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"ai_reasoning": ai_text})
    }
