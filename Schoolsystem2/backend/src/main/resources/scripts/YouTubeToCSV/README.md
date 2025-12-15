# YouTubeToCSV

This script uses the YouTube Data API to fetch metadata for videos listed in `VideoURLs_IMPORT.txt` and writes them into CSV files. It expects a YouTube Data API key in `backend/.env`.

1. Put your YouTube Data API key into `backend/.env`:
   - `YOUTUBE_DATA_API_KEY=<your key>`
2. Ensure you have an OpenAI API key in `backend/.env`:
   - `OPENAI_API_KEY=<your key>`
   - Model default: `gpt-4.1-mini` (optional override via `OPENAI_YOUTUBE_MODEL=<model>`)
3. Add video URLs (one per line) to `VideoURLs_IMPORT.txt`.
4. Run `python YouTubeToCSV.py`.

After a URL was processed successfully, the script appends `// DONE` to that line in `VideoURLs_IMPORT.txt` so you can track progress.

