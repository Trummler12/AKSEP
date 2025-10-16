import os
import csv
import re
import time
import logging
import socket
import msvcrt  # Für Windows; unter Unix ggf. "select" verwenden
import mysql.connector
from googleapiclient.discovery import build
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import vertexai
from vertexai.generative_models import GenerativeModel, Part
from urllib.parse import urlparse, parse_qs

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\Users\tobia\AppData\Roaming\gcloud\application_default_credentials.json"

# Logging konfigurieren
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Vertex AI initialisieren
vertexai.init(project="scenic-hydra-451413-q7", location="us-central1")
model = GenerativeModel("gemini-1.5-flash-002")

# SQL-Datenbank-Verbindungsdaten
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',  # Ersetze mit Deinem tatsächlichen Passwort
    'database': 'schoolsystem'
}

# Verbinde zur Datenbank
db_conn = mysql.connector.connect(**db_config)
cursor = db_conn.cursor()

# Falls die CSV-Dateien noch nicht existieren, erstelle sie mit Headerzeile
script_dir = os.path.dirname(os.path.realpath(__file__))
csv_source_filename = os.path.join(script_dir, "t_source.csv")
csv_author_filename = os.path.join(script_dir, "t_source_author.csv")

if not os.path.exists(csv_source_filename):
    with open(csv_source_filename, mode="w", newline='', encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["sourceID", "source_typeID", "source_URL", "sauthorID", "source_title", "description", "created", "updated"])
if not os.path.exists(csv_author_filename):
    with open(csv_author_filename, mode="w", newline='', encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["sauthorID", "sauthor_name", "sauthor_URL", "sauthor_description", "impressum_URL"])

# Hilfsfunktion: Video-ID extrahieren (mittels urllib.parse)
def extract_video_id(url):
    parsed_url = urlparse(url)
    if "youtu.be" in parsed_url.netloc:
        return parsed_url.path.lstrip("/")
    elif "youtube.com" in parsed_url.netloc:
        query_params = parse_qs(parsed_url.query)
        video_ids = query_params.get("v")
        if video_ids:
            return video_ids[0]
    return None

# Funktion, um Videodetails (ohne Kanalinformationen) via YouTube Data API zu holen
def get_video_details(youtube, video_id):
    try:
        request = youtube.videos().list(part='snippet', id=video_id)
        response = request.execute()
        if response.get('items'):
            snippet = response['items'][0].get('snippet', {})
            title = snippet.get('title', '')
            description = snippet.get('description', '')
            published_at = snippet.get('publishedAt', '')
            channel_title = snippet.get('channelTitle', '')
            channel_id = snippet.get('channelId', '')
            # Versuche, die primäre Sprache aus defaultAudioLanguage oder defaultLanguage zu lesen; Standard ist 'en'
            default_language = snippet.get('defaultAudioLanguage', snippet.get('defaultLanguage', 'en'))
            return title, description, published_at, channel_title, channel_id, default_language
    except Exception as e:
        logging.error("Error fetching video details: %s", e)
    return None, None, None, None, None, 'en'

# Funktion, um den Transkripttext zu holen (falls vorhanden)
def get_video_transcript(video_id, preferred_languages=['en', 'de']):
    try:
        transcripts = YouTubeTranscriptApi.list_transcripts(video_id)
        # Versuche zuerst, ein manuell erstelltes Transcript in einer bevorzugten Sprache zu erhalten
        for lang in preferred_languages:
            try:
                transcript = transcripts.find_manually_created_transcript([lang])
                return " ".join([entry['text'] for entry in transcript.fetch()])
            except Exception:
                continue
        # Falls kein manuell erstelltes Transcript gefunden wird, nutze das automatisch erstellte
        for lang in preferred_languages:
            try:
                transcript = transcripts.find_generated_transcript([lang])
                return " ".join([entry['text'] for entry in transcript.fetch()])
            except Exception:
                continue
    except Exception as e:
        logging.info("Transcript not available for video %s with preferred languages %s: %s", video_id, preferred_languages, e)
    return ""

# Funktion, um eine CSV-Zeile für t_source zu erstellen
def create_csv_row(source_id, source_type_id, video_url, sauthor_id, title, abstract, date):
    return [source_id, source_type_id, video_url, sauthor_id, title, abstract, date, date]

# Funktion, um eine CSV-Zeile für t_source_author-Updates zu erstellen
def create_author_csv_row(sauthor_id, sauthor_name, sauthor_URL, sauthor_description, impressum_URL):
    return [sauthor_id, sauthor_name, sauthor_URL, sauthor_description, impressum_URL]

# Funktion, um SQL-Abfragen auszuführen
def get_sql_value(cursor, query, params):
    cursor.execute(query, params)
    result = cursor.fetchone()
    return result[0] if result else None



# Initialisiere den YouTube Data API Client
script_dir = os.path.dirname(os.path.realpath(__file__))
api_key_path = os.path.join(script_dir, "youtube_api_key.txt")
try:
  with open(api_key_path, "r", encoding="utf-8") as key_file:
    API_KEY = key_file.read().strip()
except FileNotFoundError:
  logging.error("API key file not found at %s", api_key_path)
  API_KEY = ""
youtube = build('youtube', 'v3', developerKey=API_KEY)

# Hole source_type_id für "YouTube Video"
cursor.execute("SELECT stypeID FROM t_source_type WHERE stype_name = %s", ("YouTube Video",))
result = cursor.fetchone()
source_type_id = result[0] if result else 1
print("source_type_id:", source_type_id)

# Hole Start-ID vom Nutzer
start_id_input = input("Enter the startID: ").strip()
try:
    source_id = int(start_id_input)
except ValueError:
    logging.error("Invalid startID. Using default value 101.")
    source_id = 101

# Funktion zum Anhängen einer Zeile an eine CSV-Datei
def append_csv_row(filename, row):
    with open(filename, mode="a", newline='', encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(row)

logging.info("Enter YouTube video URLs (one per line). Press Enter without input for 60 seconds to exit.")
while True:
    logging.info("Waiting for video URL input...")
    start_time = time.time()
    video_url = ""
    while True:
        if msvcrt.kbhit():
            video_url = input().strip()
            break
        if time.time() - start_time > 60:
            logging.info("No input for 60 seconds. Exiting loop.")
            break
        time.sleep(0.1)
    if not video_url:
        break

    # Extrahiere Video-ID
    video_id = extract_video_id(video_url)
    if not video_id:
        logging.warning("Invalid YouTube URL: %s", video_url)
        continue

    # Verwende das kompakteste URL-Format
    video_url = "https://youtu.be/"+video_id

    # Hole Videodetails (inkl. Kanalinformationen)
    title, description, published_date, channel_name, channel_id, video_language = get_video_details(youtube, video_id)
    if not title:
        logging.error("Could not retrieve details for video: %s", video_url)
        continue

    # Berechne Kanal-URL automatisch
    channel_url = f"https://www.youtube.com/channel/{channel_id}" if channel_id else ""

    # Hole optional Transkript
    transcript = get_video_transcript(video_id, video_language)
    if transcript:
        abstract_text = description + "\n\nTranscript:\n" + transcript
    else:
        abstract_text = ("(Sorry, no transcript is available. In this case, please leave the abstract text (and therefore the response itself) entirely empty.)")

    # Verwende Vertex AI zur Generierung eines wissenschaftlichen Abstracts
    prompt = (
        "Generate a concise, formal scientific abstract summarizing the topics discussed in the video. "
        "Your abstract should capture all key scientific disciplines discussed in the video, "
        "including relevant theoretical concepts, experimental methods, and quantitative insights. "
        "Use technical language and integrate details about the scientific principles and methodologies presented, "
        "while keeping the abstract clear, cohesive and at least as layperson-friendly as the video itself. "
        "The abstract should habe a text length of less than 1000 characters; "
        "For videos shorter than 30min, this Character Limit shall be adjusted to around 1000*(sqrt([video length]/30min)); "
        "Example values: 20min => 816; 10min => 577; 5min => 408; 3min => 316; 1min => 182. "
        "Avoid line breaks or extraneous formatting under any circumstances; "
        "instead, use \"<br>\" for new lines if absolutely necessary. "
        "Do not use any \"<br>\" at the end or the beginning of the abstract. "
        "Do not include any introductory phrases such as 'Certainly!' or 'Abstract:'; "
        "provide only the stand-alone abstract text without anything else. "
        "If there is instructional text written in brackets where contents of the video should be, please follow those instructions."
    )
    contents = [
        prompt,
        Part.from_uri(video_url, "video/mp4")
    ]
    try:
        response = model.generate_content(contents)
        generated_abstract = response.text.strip().replace("  ", " ")
    except Exception as e:
        logging.error("Error generating abstract for video %s: %s", video_url, e)
        generated_abstract = ""  # Fallback

    # Prüfe, ob das generierte Abstract länger als 2000 Zeichen ist; falls ja, setze es auf leer
    if len(generated_abstract) > 2000:
        logging.warning("Generated abstract too long for video %s; setting abstract to empty", video_url)
        generated_abstract = ""

    # Bestimme sauthorID anhand des Kanalnamens (nun dynamisch aus den Videodetails)
    sauthor_id = get_sql_value(cursor, "SELECT sauthorID FROM t_source_author WHERE sauthor_name = %s", (channel_name,))
    if not sauthor_id:
        # Ermittle den höchsten sauthorID und setze neuen Wert als max + 1
        cursor.execute("SELECT MAX(sauthorID) FROM t_source_author")
        max_id_result = cursor.fetchone()
        new_id = (max_id_result[0] if max_id_result[0] is not None else 0) + 1
        insert_query = (
            "INSERT INTO t_source_author (sauthorID, sauthor_name, sauthor_URL, sauthor_description, impressum_URL) "
            "VALUES (%s, %s, %s, %s, %s)"
        )
        try:
            # Achtung: Hier wird new_id als erster Parameter übergeben!
            cursor.execute(insert_query, (new_id, channel_name, channel_url, "", ""))
            db_conn.commit()
            sauthor_id = new_id
            logging.info("Inserted new source author with ID %s", sauthor_id)
            # Neue Author-Daten auch in CSV schreiben, damit Du diese später im EER aktualisieren kannst.
            author_csv_row = create_author_csv_row(sauthor_id, channel_name, channel_url, "", "")
            append_csv_row(csv_author_filename, author_csv_row)
            logging.info("Appended new author row to CSV: %s", author_csv_row)
        except mysql.connector.Error as db_err:
            logging.error("Error inserting new source author: %s", db_err)
            continue

    # Erstelle die CSV-Zeile für t_source – übergebe Strings direkt, der CSV-Writer übernimmt das Quoting
    csv_row = create_csv_row(source_id, source_type_id, video_url, sauthor_id, title, generated_abstract, published_date)
    append_csv_row(csv_source_filename, csv_row)
    logging.info("Wrote CSV row for video %s", video_url)
    source_id += 1

cursor.close()
db_conn.close()
logging.info("Process completed.")