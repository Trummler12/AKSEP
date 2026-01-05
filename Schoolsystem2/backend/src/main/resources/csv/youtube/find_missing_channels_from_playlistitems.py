#!/usr/bin/env python3
import csv
from collections import Counter, defaultdict
from pathlib import Path


# User-configurable defaults.
MIN_PLAYLIST_ITEMS_COUNT = 2
MAX_OUTPUT_ROWS = 100
# Toggle blacklist filtering.
BLACKLIST_CHANNELS = True
# Each entry is a missing_channel_id; optional title in comment.
BLACKLISTED_CHANNELS = [
    "UCqoy014xOu7ICwgLWHd9BzQ", # Cortex Podcast
    "UCCAgrIbwcJ67zIow1pNF30A", # nottinghamscience
    "UCKXbq6IGFelzryn7fH6A-aw", # vsauceLEANBACK
    "UC30ditU5JI16o5NbFsHde_Q", # DW عربية
    "UCx_JS-Fzrq-bXUYP0mk9Zag", # Humany
    "UC0tq0g5u2bo-TErZt7SJM6w", # The Sound Traveler
    "UCTbjYz7d3AZgos7ALYvkvLQ", # OldScapeMusic
    "UC6Z5hzUmbUxdZiLDWeePo0A", # Cha Chingo Christiano
    "UCXR3Bb0lI_qD19NYsEd2Fvg", # Slow Walkthroughs
    "UCKSFtZ1HaDZV65eO9DaSIAQ", # Lona90Bs
    "UCsf4kqbUhqshA8pwqk580qw", # Arthur Morgan
    "UCDVKYPXwdYUQfgA05CkyFSg", # GameChops
    "UCS0JvjYXm-XIQeq1JM1F8tg", # Video Game Music
    "UCm9WFeqTgvRvyRoGD8jVFVA", # Music of 40K
    "UCdTS7P-ZLEx8Ftj7PpGlvvA", # GodsFriendChuck
    "UCV6H0I6LneT5P8uZo0BHtzg", # Aramil
    "UCPLjYuNQ6KXnZh4a418B4uw", # z3lx
    "UC6CXxWgSK4CXd4ZxRTDJGzg", # SMORT
    "UCNVIXlJnjDUs2Gu5o9IQPDQ", # Bad Company - Topic
    "UCzB0O38LGuW1rjFYUli_2nQ", # Kusovai
    "UCmMzqlRl2b3KDWAv691S-AA", # Marcin Przybyłowicz - Topic
    "UCZTD9yWC7Z7NAVBsOpx4RLA", # DuFrosch
    "UCxgE2CUWf6VXKEGBn1WCnUw", # ozgq
    "UC4u77JhpmafFQ-Z9Lsoakug", # Wowmusicable
    "UCBawJ1Cx1AytQwvth-Gjh8A", # GameMusic321
    "UCE5EjWAuCFqChJ5GEU6cgzg", # GronkhOSTs
    "UCWmnkYUzoOiOztmPBhIlZjg", # Aphex Twin - Topic
    "UCspCdzaOYa7hW70w9rR-gzA", # minutemandolin
    "UCRqpyQj9GqiHUVAce1AgXUw", # HANATSU miroir
    "UCm1fqkJ-Tq64bQzM6VRMicQ", # New York Times Opinion
    "UCkEwxrLpgVtkTYVHf9rpcXQ", # G4F Records
    "UCRCCp6MvIMYG1dHvrVmX_Tg", # Mikolai Stroinski - Topic
    "UCodJf9XMs8mZtvdkHJcHlAQ", # Saechao Plus
    "UCwbIPMWlJkjrIZ5huBNYKbA", # Howber
    "UCCj956IF62FbT7Gouszaj9w", # BBC
    "UCH25NHxNn0vnQlScW0mXINw", # Salacity
    "UC656PsrhcUuCSXkFCpebJjg", # EagleEyePT
    "UC7ZITrdvK5IYsv-7SnwdSbQ", # Motoi Sakuraba - Topic
    "UCWb9tHoAP9mZbjeukBN3lXw", # TheSoundtrack
    "UChheO1e1gPqEd0TvJSqMrvw", # mush
    "UCc5dglBsmMOzwY7NM5aK3FA", # IwannalickMenatsFeet
    "UC5B86a7N4VvxgoiVKBNHBMA", # F4m1LyGuy10
    "UCRwr1kxjL-8m1L6mQXB2zSQ", # BradyStuff
    "UCP9RBaisc_YlrRE7hGlaxKQ", # Lewie G
    "UCfb7SiX9k7y1LkGyepdEGdg", # J.O.E. VGM
    "UC8ldibQv2VLVBomgzpsRVkQ", # Yoshi's VGM
    "UCHQCT6VAzQtqmPt35AEryPw", # Yoshi Vibes
    "UC33tp9cw4Kfa2fjch4rjPRQ", # Video Game Music Resources
    "UClReXJLH9NnYvOiu7OeeqJA", # Shinx
    "UCaO6TYtlC8U5ttz62hTrZgg", # JYP Entertainment
]
# To evaluate:
# UCRkx3gqTZpL6hpoWpOU_pmA        28      That Chemist (old)    https://www.youtube.com/@ThatChemistOld/videos
# UCGTcq44kTnFMV55WCeHxDdg        21      Filip Holm            https://www.youtube.com/@FilipHolm/videos
# UC4_HPD_v8Id82lnBrX7w7lg        20      FavScientist          https://www.youtube.com/@FavScientist/videos
# UCaF_EnJKDAdFsToUhkLfFxw        19      Mind Blow             https://www.youtube.com/@MindBlowOriginal/videos
# UCqVEHtQoXHmUCfJ-9smpTSg        7       Answer in Progress    https://www.youtube.com/@answerinprogress/videos
# UCnQtJro3IurKlxp7XSPqpaA        6       bibledex              https://www.youtube.com/@bibledex/videos
# UCWUq6teKH18Iwuh41D75sQg        6       foodskey              https://www.youtube.com/@foodskey/videos
# UCY1kMZp36IQSyNx_9h4mpCg        5       Mark Rober            https://www.youtube.com/@MarkRober/videos
# UC9IuUwwE2xdjQUT_LMLONoA        5       The Julia Programming Language    https://www.youtube.com/@TheJuliaLanguage/videos
# UC3KEoMzNz8eYnwBC34RaKCQ        4       Simone Giertz         https://www.youtube.com/@simonegiertz/videos
# UCeWgfJXzXpnNBNi9NI6GMfA        3       greeenpro             https://www.youtube.com/@greeenpro2009/videos
# UC7pcI9Im0frl_CLmVLxZIUQ        3       GriefTourist          https://www.youtube.com/@GriefTourist/videos
# UCtinbF-Q-fVthA0qrFQTgXQ        3       CaseyNeistat          https://www.youtube.com/@casey/videos
# UCR5xDMmpD18Gr4CI71wgL5Q        3       kyliecaravan          https://www.youtube.com/@kyliecaravan/videos

def read_channel_ids(path: Path) -> set[str]:
    if not path.exists():
        return set()
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        return {row.get("channel_id", "").strip() for row in reader if row.get("channel_id")}


def main() -> int:
    base_dir = Path(__file__).resolve().parent
    channels_path = base_dir / "channels.csv"
    playlist_items_path = base_dir / "playlistItems.csv"

    channel_ids = read_channel_ids(channels_path)
    if not playlist_items_path.exists():
        print(f"ERROR: missing playlistItems.csv at {playlist_items_path}")
        return 1

    counts: Counter[str] = Counter()
    titles: dict[str, str] = defaultdict(str)

    with playlist_items_path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            channel_id = (row.get("video_owner_channel_id") or "").strip()
            if not channel_id:
                continue
            if BLACKLIST_CHANNELS and channel_id in BLACKLISTED_CHANNELS:
                continue
            if channel_id in channel_ids:
                continue
            counts[channel_id] += 1
            title = (row.get("video_owner_channel_title") or "").strip()
            if title:
                titles[channel_id] = title

    if not counts:
        print("No missing channels found.")
        return 0

    print("missing_channel_id\tplaylist_items_count\tchannel_title")
    emitted = 0
    for channel_id, count in counts.most_common():
        if count < MIN_PLAYLIST_ITEMS_COUNT:
            continue
        if emitted >= MAX_OUTPUT_ROWS:
            break
        title = titles.get(channel_id, "")
        print(f"{channel_id}\t{count}\t{title}")
        emitted += 1
    if emitted == 0:
        print("No missing channels found within the current thresholds.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
