from flask import Flask, request, jsonify
from flask_cors import CORS

import db_access
import gpt_interface

app = Flask(__name__, static_folder='../public', static_url_path='')
CORS(app)


@app.route('/')
def index():
  """Serve the main page."""
  return app.send_static_file('index.html')


@app.route('/match', methods=['POST'])
def match_topics():
  """Return top topics for the provided interest text."""
  payload = request.get_json(silent=True) or {}
  description = payload.get('text', '')

  tags = db_access.get_tags()
  tag_weights = gpt_interface.get_tag_weights(description, tags)
  topics = db_access.get_topic_scores(tag_weights)
  return jsonify(topics)


if __name__ == '__main__':
  app.run(port=5000)
