"""Helper for calling the OpenAI API."""
import csv
from io import StringIO
from typing import Dict, Iterable, List, Tuple

import logging
from openai import OpenAI, OpenAIError

import config

if config.OPENAI_API_KEY:
  client: OpenAI | None = OpenAI(api_key=config.OPENAI_API_KEY)
else:
  logging.warning("OPENAI_API_KEY is missing; OpenAI features disabled")
  client: OpenAI | None = None
# default model; gpt-4 provides better reasoning but is slower and pricier,
# while gpt-4o is faster but may still cost more than gpt-3.5
MODEL = 'gpt-4o'


def parse_tag_weights_csv(csv_text: str) -> Dict[int, int]:
  """Parse CSV text and return mapping of tagID to weight (>=1)."""
  result: Dict[int, int] = {}
  lines = []
  for line in csv_text.splitlines():
    line = line.strip()
    if not line or line.startswith('#'):
      continue
    lines.append(line)
  if not lines:
    return result
  reader = csv.reader(StringIO('\n'.join(lines)))
  headers = next(reader, None)
  if headers is None:
    return result
  for row in reader:
    if len(row) < 3:
      continue
    try:
      tag_id = int(row[0].strip())
      weight = int(row[2].strip())
    except ValueError:
      continue
    if weight >= 1:
      result[tag_id] = weight
  return result


def parse_selected_tags_csv(csv_text: str) -> List[Tuple[int, str]]:
  """Parse CSV text and return list of ``(tagID, tagName)`` tuples."""
  result: List[Tuple[int, str]] = []
  lines = []
  for line in csv_text.splitlines():
    line = line.strip()
    if not line or line.startswith('#'):
      continue
    lines.append(line)
  if not lines:
    return result
  reader = csv.reader(StringIO('\n'.join(lines)))
  headers = next(reader, None)
  if headers is None:
    return result
  for row in reader:
    if len(row) < 2:
      continue
    try:
      tag_id = int(row[0].strip())
      tag_name = row[1].strip()
    except (ValueError, IndexError):
      continue
    if not tag_name:
      continue
    result.append((tag_id, tag_name))
  return result


def select_relevant_tags(description: str, tags: Iterable[Tuple[int, str]]) -> List[Tuple[int, str]]:
  """Return subset of tags relevant to the given description via GPT."""
  tag_list = ", ".join(f"{tid}:{name}" for tid, name in tags)
  prompt = (
      "You will receive a user description and a comma-separated list of tags "
      "in the format TagID:TagName. Select the tags that best match the user "
      "description. Return between 5 and 30 lines formatted as 'TagID,TagName'.\n\n"
      f"Description:\n{description}\n\nTags:\n{tag_list}"
  )
  try:
    assert client is not None
    response = client.chat.completions.create(model=MODEL, messages=[{"role": "user", "content": prompt}])
    csv_text = response.choices[0].message.content.strip()
  except OpenAIError as err:
    logging.error("OpenAI API call failed: %s", err)
    return []
  selected = parse_selected_tags_csv(csv_text)
  return selected


def get_tag_weights(description: str, tags: Iterable[Tuple[int, str]]) -> Dict[int, int]:
  """Return weight 1-5 for tags in description using the OpenAI API."""
  if not config.OPENAI_API_KEY:
    logging.error("OPENAI_API_KEY is missing; cannot call OpenAI API")
    return {}
  if client is None:
    logging.warning("OpenAI client unavailable; returning empty tag weights")
    return {}

  selected = select_relevant_tags(description, tags)
  logging.debug("Selected tags: %s", selected)
  if not selected:
    return {}

  tag_list = ", ".join(f"{tid}:{name}" for tid, name in selected)
  step_prompt = (
      "Assign a weight from 1 to 5 for each of the following tags based on how well they match the user description."
      " Return only tags with weight >= 1 as CSV with header 'TagID,TagName,Weight'.\n\n"
      f"Description:\n{description}\n\nTags:\n{tag_list}"
  )
  try:
    assert client is not None
    response = client.chat.completions.create(model=MODEL, messages=[{"role": "user", "content": step_prompt}])
    csv_text = response.choices[0].message.content.strip()
  except OpenAIError as err:
    logging.error("OpenAI API call failed: %s", err)
    return {}

  result = parse_tag_weights_csv(csv_text)
  result = {tid: w for tid, w in result.items() if w >= 1}
  logging.debug("Parsed tag weights: %s", result)
  return result
