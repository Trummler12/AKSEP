"""Database helper functions."""
from typing import Dict, Tuple, List

import pymysql

import config


def _get_connection():
  return pymysql.connect(
      host=config.DB_HOST,
      user=config.DB_USER,
      password=config.DB_PASSWORD,
      database=config.DB_NAME,
      cursorclass=pymysql.cursors.DictCursor,
      charset='utf8mb4'
  )


def get_tags() -> List[Tuple[int, str]]:
  """Return list of all tags."""
  query = "SELECT tagID, tag FROM t_tag"
  with _get_connection() as conn:
    with conn.cursor() as cur:
      cur.execute(query)
      return [(row['tagID'], row['tag']) for row in cur.fetchall()]


def get_topic_scores(tag_weights: Dict[int, int]) -> List[Dict[str, object]]:
  """Return topics with aggregated score for given tag weights."""

  with _get_connection() as conn:
    with conn.cursor() as cur:
      if tag_weights:
        cur.execute("CREATE TEMPORARY TABLE user_weights(tagID INT, weight TINYINT)")
        cur.executemany(
            "INSERT INTO user_weights (tagID, weight) VALUES (%s, %s)",
            list(tag_weights.items())
        )
        query = """
          SELECT t.topicID,
                 t.name AS topic,
                 t.description,
                 GROUP_CONCAT(DISTINCT u.url) AS url,
                 SUM(uw.weight * c.weight) AS score
          FROM ct_topic_tags c
          JOIN t_topic t ON c.topicID = t.topicID
          JOIN user_weights uw ON uw.tagID = c.tagID
          LEFT JOIN t_topic_url u ON u.topicID = t.topicID
          GROUP BY t.topicID
          ORDER BY score DESC
          LIMIT 50
        """
      else:
        query = """
          SELECT t.topicID,
                 t.name AS topic,
                 t.description,
                 GROUP_CONCAT(DISTINCT u.url) AS url,
                 0 AS score
          FROM t_topic t
          LEFT JOIN t_topic_url u ON u.topicID = t.topicID
          GROUP BY t.topicID
          ORDER BY t.topicID
          LIMIT 50
        """

      cur.execute(query)
      return cur.fetchall()
