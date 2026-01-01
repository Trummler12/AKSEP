import unittest

from video_query_helpers import prep as prep_helpers


class PrepHelpersTests(unittest.TestCase):
    def test_normalize_handle(self) -> None:
        self.assertEqual(prep_helpers.normalize_handle("@MyChannel"), "MyChannel")
        self.assertEqual(
            prep_helpers.normalize_handle("https://www.youtube.com/@MyChannel"),
            "MyChannel",
        )

    def test_build_channel_ref_index(self) -> None:
        refs = [
            {"channel_id": "AAA", "custom_url": "@alpha", "title": "Alpha"},
            {"channel_id": "BBB", "custom_url": "@beta", "title": "Beta"},
        ]
        ref_index = prep_helpers.build_channel_ref_index(refs)
        self.assertEqual(ref_index["aaa"], 0)
        self.assertEqual(ref_index["beta"], 1)

    def test_reorder_channels(self) -> None:
        refs = [
            {"channel_id": "AAA", "custom_url": "@alpha", "title": "Alpha"},
            {"channel_id": "BBB", "custom_url": "@beta", "title": "Beta"},
        ]
        ref_index = prep_helpers.build_channel_ref_index(refs)
        rows = [
            {"channel_id": "BBB", "custom_url": "@beta", "title": "Beta"},
            {"channel_id": "CCC", "custom_url": "@gamma", "title": "Gamma"},
            {"channel_id": "AAA", "custom_url": "@alpha", "title": "Alpha"},
        ]
        ordered, removed, reordered = prep_helpers.reorder_channels(rows, ref_index)
        self.assertEqual(removed, 1)
        self.assertTrue(reordered)
        self.assertEqual([row["channel_id"] for row in ordered], ["AAA", "BBB"])

    def test_reorder_videos_local(self) -> None:
        video_index = {"v1": 0, "v2": 1}
        rows = [
            {"video_id": "v2", "language_code": "fr", "title": "B"},
            {"video_id": "v1", "language_code": "en", "title": "A"},
            {"video_id": "v3", "language_code": "en", "title": "C"},
        ]
        ordered, removed, reordered = prep_helpers.reorder_videos_local(rows, video_index)
        self.assertEqual(removed, 1)
        self.assertTrue(reordered)
        self.assertEqual([row["video_id"] for row in ordered], ["v1", "v2"])

    def test_reconcile_course_flags(self) -> None:
        rows = [
            {"playlist_id": "P1", "playlist_type_id": "1"},
            {"playlist_id": "P2", "playlist_type_id": "2"},
        ]
        changed = prep_helpers.reconcile_course_flags(rows, {"P1"})
        self.assertEqual(changed, 2)
        self.assertEqual(rows[0]["playlist_type_id"], "2")
        self.assertEqual(rows[1]["playlist_type_id"], "1")

    def test_reorder_t_source(self) -> None:
        video_index = {"abc": 0, "def": 1}
        rows = [
            {"source_URL": "https://youtu.be/def"},
            {"source_URL": "https://youtu.be/xyz"},
            {"source_URL": "https://www.youtube.com/watch?v=abc"},
        ]
        ordered, removed, reordered = prep_helpers.reorder_t_source(rows, video_index)
        self.assertEqual(removed, 1)
        self.assertTrue(reordered)
        self.assertEqual(
            [prep_helpers.extract_video_id(row["source_URL"]) for row in ordered],
            ["abc", "def"],
        )

    def test_reorder_t_source_keep_unmatched(self) -> None:
        video_index = {"abc": 0}
        rows = [
            {"source_URL": "https://youtu.be/xyz"},
            {"source_URL": "https://youtu.be/abc"},
        ]
        ordered, removed, reordered = prep_helpers.reorder_t_source(
            rows, video_index, keep_unmatched=True
        )
        self.assertEqual(removed, 0)
        self.assertTrue(reordered)
        self.assertEqual(
            [prep_helpers.extract_video_id(row["source_URL"]) for row in ordered],
            ["abc", "xyz"],
        )


if __name__ == "__main__":
    unittest.main()
