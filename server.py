#!/bin/python3 
from flask import Flask, request
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)
headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8',
    'priority': 'u=1, i',
    'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Microsoft Edge";v="132"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty'
}

@app.route("/getmedia")
def route():
    title = request.args.get("title")
    if title is None:
        return {"error": "No title provided"}, 400
    url = f"https://v3.sg.media-imdb.com/suggestion/x/{title}.json"
    params = {
        'includeVideos': '1'
    }
    try:
        response = requests.get(url, headers=headers, params=params)
        data = response.text
        res = json.loads(data);
        iterator = map(lambda x : {"title" : x.get("l"), "id" : x.get("id"),
        "type" : x.get("qid"), "image" : x.get("i",{}).get("imageUrl")
        }, res["d"])
        movies_series = filter(lambda x : x["type"] != None, iterator);
        
        return list(movies_series)
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == "__main__":
    app.run(debug=True)
