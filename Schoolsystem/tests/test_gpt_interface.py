import os
import sys
import importlib

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

def test_get_tag_weights_returns_empty_when_api_key_missing(monkeypatch, caplog):
    monkeypatch.setattr('config.OPENAI_API_KEY', '')
    if 'gpt_interface' in sys.modules:
        del sys.modules['gpt_interface']
    with caplog.at_level('ERROR'):
        gpt_interface = importlib.import_module('gpt_interface')
        assert gpt_interface.client is None
        result = gpt_interface.get_tag_weights('desc', [(1, 'tag')])
    assert result == {}
    assert any('OPENAI_API_KEY is missing' in r.getMessage() for r in caplog.records)


def test_parse_tag_weights_csv_basic():
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
    import gpt_interface
    csv_text = "TagID,TagName,Weight\n101,Maths,5\n102,Art,1\n"
    assert gpt_interface.parse_tag_weights_csv(csv_text) == {101: 5, 102: 1}


def test_parse_tag_weights_csv_ignores_invalid_lines():
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
    import gpt_interface
    csv_text = "TagID,TagName,Weight\ninvalid\n103,Game,three\n104,Science,2"
    assert gpt_interface.parse_tag_weights_csv(csv_text) == {104: 2}


def test_parse_selected_tags_csv_basic():
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
    import gpt_interface
    csv_text = "TagID,TagName\n201,History\n202,Biology\n"
    assert gpt_interface.parse_selected_tags_csv(csv_text) == [
        (201, "History"),
        (202, "Biology"),
    ]


def test_parse_selected_tags_csv_ignores_invalid_lines():
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
    import gpt_interface
    csv_text = "TagID,TagName\ninvalid\n203,Gaming\n,\n204,Physics\n"
    assert gpt_interface.parse_selected_tags_csv(csv_text) == [
        (203, "Gaming"),
        (204, "Physics"),
    ]
