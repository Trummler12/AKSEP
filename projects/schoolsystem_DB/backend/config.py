"""Configuration placeholders for DB and OpenAI access."""

import os

DB_HOST = 'localhost'
DB_USER = 'root'
DB_PASSWORD = 'root'
DB_NAME = 'schoolsystem'

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
  key_file = os.path.join(os.path.dirname(__file__), 'openai_key.txt')
  if os.path.exists(key_file):
    with open(key_file, 'r', encoding='utf-8') as f:
      OPENAI_API_KEY = f.read().strip()
  else:
    OPENAI_API_KEY = ''
