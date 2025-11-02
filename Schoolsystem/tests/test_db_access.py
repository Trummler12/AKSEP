import os
import sys
from unittest.mock import patch

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
import db_access

class DummyCursor:
    def execute(self, query):
        self.last_query = query
    def executemany(self, query, params):
        self.last_executemany = (query, params)
    def fetchall(self):
        return [
            {"topicID": i, "topic": f"Topic{i}", "description": "", "url": "", "score": 0}
            for i in range(1, 51)
        ]
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc, tb):
        pass

class DummyConn:
    def cursor(self):
        return DummyCursor()
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc, tb):
        pass

def test_get_topic_scores_returns_50_rows_without_weights():
    conn = DummyConn()
    with patch('db_access._get_connection', return_value=conn):
        rows = db_access.get_topic_scores({})
    assert len(rows) == 50
    assert all(row['score'] == 0 for row in rows)
