import asyncio
import json
import websockets

async def test():
    uri = 'ws://127.0.0.1:8000/ws/deliveries/ord_demo_battery/tracking?user_id=cust_demo&user_role=customer'
    print(f"Connecting to {uri}...")
    try:
        async with websockets.connect(uri) as ws:
            print("Connected!")
            msg = await ws.recv()
            print("Received snapshot event:", json.loads(msg).get("event"))
    except Exception as e:
        print("Error:", type(e), e)

if __name__ == '__main__':
    asyncio.run(test())
