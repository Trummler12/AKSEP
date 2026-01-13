from __future__ import annotations

import csv
import os
import random
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
from sentence_transformers import SentenceTransformer

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "testing" / "data"
LOG_DIR = ROOT / "testing" / "logs"

TAGS_PATH = DATA_DIR / "t_tag_PLANNING.txt"
TOPICS_PATH = DATA_DIR / "t_topic_PLANNING.csv"
ASSIGN_PATH = DATA_DIR / "ct_topic_tags_PLANNING.csv.txt"
LOG_PATH = LOG_DIR / "tag_eval_v1.txt"

MODEL_NAME = os.getenv(
    "TAG_MODEL_NAME", "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
)
QUERY_TOP_K = int(os.getenv("QUERY_TOP_K", "7"))
QUERY_SAMPLE_SIZE = int(os.getenv("QUERY_SAMPLE_SIZE", "8"))
QUERY_SAMPLE_SEED = os.getenv("QUERY_SAMPLE_SEED")
QUERY_MIN_SIM = float(os.getenv("QUERY_MIN_SIM", "0.2"))
QUERY_TEMP = float(os.getenv("QUERY_WEIGHT_TEMP", "0.08"))
TOP_N_CANDIDATES = int(os.getenv("TOP_N_CANDIDATES", "250"))
RELATIVE_MIN_FACTOR = float(os.getenv("RELATIVE_MIN_FACTOR", "0.333333"))
ABS_MIN_PREFILTER = float(os.getenv("ABS_MIN_PREFILTER", "0.02"))
TOP_FINAL = int(os.getenv("TOP_FINAL", "20"))


@dataclass(frozen=True)
class Tag:
    tag_id: int
    name: str
    synonyms: List[str]


@dataclass(frozen=True)
class Topic:
    topic_id: str
    name: str
    description: str


def load_tags(path: Path) -> List[Tag]:
    tags: List[Tag] = []
    with path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            tag_id_raw = (row.get("tagID") or "").strip()
            name = (row.get("name") or "").strip()
            synonyms_raw = (row.get("synonyms") or "").strip()
            if not tag_id_raw or not name:
                continue
            try:
                tag_id = int(tag_id_raw)
            except ValueError:
                continue
            synonyms = [part.strip() for part in synonyms_raw.split(",") if part.strip()]
            tags.append(Tag(tag_id=tag_id, name=name, synonyms=synonyms))
    return tags


def load_topics(path: Path) -> List[Topic]:
    topics: List[Topic] = []
    with path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            topic_id = (row.get("topicID") or "").strip()
            name = (row.get("name") or "").strip()
            description = (row.get("description") or "").strip()
            if not topic_id or not name:
                continue
            topics.append(Topic(topic_id=topic_id, name=name, description=description))
    return topics


def load_assignments(path: Path) -> Dict[str, Dict[int, float]]:
    mapping: Dict[str, Dict[int, float]] = {}
    with path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            topic_id = (row.get("topicID") or "").strip()
            tag_id_raw = (row.get("tagID") or "").strip()
            weight_raw = (row.get("weight") or "").strip()
            if not topic_id or not tag_id_raw or not weight_raw:
                continue
            try:
                tag_id = int(tag_id_raw)
            except ValueError:
                continue
            mapping.setdefault(topic_id, {})[tag_id] = float(weight_raw)
    return mapping


def build_tag_variants(tags: List[Tag]) -> Tuple[List[str], List[List[int]]]:
    variant_texts: List[str] = []
    tag_variant_indices: List[List[int]] = []
    for tag in tags:
        variants = [tag.name] + tag.synonyms
        indices: List[int] = []
        for variant in variants:
            variant_texts.append(f"Tag: {variant}.")
            indices.append(len(variant_texts) - 1)
        tag_variant_indices.append(indices)
    return variant_texts, tag_variant_indices


def topic_text(topic: Topic) -> str:
    if topic.description:
        return f"{topic.name}. {topic.description}"
    return topic.name


def softmax(scores: np.ndarray, temperature: float) -> np.ndarray:
    if scores.size == 0:
        return scores
    scaled = scores / max(temperature, 1e-6)
    scaled = scaled - np.max(scaled)
    exp_scores = np.exp(scaled)
    return exp_scores / np.sum(exp_scores)


def query_tag_weights(
    tag_scores: np.ndarray, tags: List[Tag]
) -> Dict[int, Tuple[str, float, float]]:
    order = np.argsort(tag_scores)[::-1]
    top_indices = order[: max(QUERY_TOP_K, 1)].tolist()
    filtered = [i for i in top_indices if float(tag_scores[i]) >= QUERY_MIN_SIM]
    if not filtered:
        filtered = [top_indices[0]]
    kept_scores = np.array([float(tag_scores[i]) for i in filtered], dtype=float)
    weights = softmax(kept_scores, QUERY_TEMP)
    output: Dict[int, Tuple[str, float, float]] = {}
    for local_idx, (idx, weight) in enumerate(zip(filtered, weights)):
        output[tags[idx].tag_id] = (
            tags[idx].name,
            float(kept_scores[local_idx]),
            float(weight),
        )
    return output


def main() -> None:
    tags = load_tags(TAGS_PATH)
    topics = load_topics(TOPICS_PATH)
    assignments = load_assignments(ASSIGN_PATH)
    if not tags or not topics or not assignments:
        raise SystemExit("Missing tags, topics, or assignments.")

    model = SentenceTransformer(MODEL_NAME)
    tag_inputs, tag_variant_indices = build_tag_variants(tags)
    topic_inputs = [topic_text(topic) for topic in topics]

    tag_variant_emb = model.encode(
        tag_inputs, normalize_embeddings=True, show_progress_bar=True
    )
    topic_emb = model.encode(
        topic_inputs, normalize_embeddings=True, show_progress_bar=True
    )

    topic_by_id = {topic.topic_id: topic for topic in topics}
    topic_index = {topic.topic_id: idx for idx, topic in enumerate(topics)}

    queries = [
        "Me gustan los dinos y los volcanes. y también el espacio!! 🚀🦕",
        "Why is the sky blue and how does an airplane fly?",
        "Aku pengin tahu gimana cara bikin game di komputer dan gimana robot bekerja.",
        "Je m’intéresse aux animaux, mais pas seulement aux animaux mignons, aussi les requins, les araignées et tout ça. Et comment ils vivent en vrai.",
        "I want to be a police officer or a firefighter later (or a vet). I also like cars and how engines work.",
        "我超爱历史，尤其是罗马和埃及，但我不懂怎么把这些都记住 😭",
        "আমি খুব আগ্রহী: মহাকাশ, ব্ল্যাক হোল, এলিয়েন (যদিও সম্ভবত সেটা ফেক), আর পদার্থবিজ্ঞান—আলো আর সময় টাইপের জিনিস।",
        "Mujhe bohot interest hai ke paisa kaise banate hain lol. Like economy, stocks, startup aur aisi cheezen. Aur psychology bhi ke log kyun kharidte hain.",
        "Eu me interesso por medicina. Como os órgãos funcionam? Por que a gente fica doente? E o que acontece numa cirurgia?",
        "I’m into politics and debates and how laws are made. Also human rights, democracy, the EU and stuff. And how to convince people.",
        "日本語で書くけど、プログラミング（Python/Javaちょっと）と数学と論理が好き。あとAIがどう動くのか、使うだけじゃなくて理解したい。",
        "Я интересуюсь искусствоведением, философией и литературой. Особенно экзистенциализмом, смыслом жизни, моралью и т.д.",
        "I might want to become an engineer (aerospace or mechanical). I’m especially into technical systems: turbines, aerodynamics, spaceflight.",
        "Me gusta todo lo de Minecraft y construir, pero quiero saber cómo se hace en la vida real: casas, puentes y esas cosas.",
        "Mən elektrik nədir başa düşmək istəyirəm?? Yəni niyə düyməni basanda işıq yanır?",
        "I love EVERYTHING about dinosaurs, seriously everything. What species existed? Why did they go extinct? Could they still exist today?",
        "Saya tertarik sama masak dan makanan, dan juga kenapa makanan itu sehat atau tidak. Sama olahraga dikit.",
        "Vorrei fare la designer o qualcosa con la moda, ma anche fotografia e montaggio video.",
        "I’m into true crime (sorry) and I want to know how forensics works. Fingerprints, DNA, crime scenes, forensic medicine.",
        "我觉得语言很有意思，尤其是英语、日语，还有语法怎么运作。也想知道词语的来源。",
        "Мне очень интересно про окружающую среду и климат. Насколько реально всё плохо? Что можно сделать? И что такое фейк-ньюс?",
        "Ich interessiere mich für Geschichte, aber eher ab 1900 (1. & 2. Weltkrieg, Kalter Krieg, Propaganda). Und politische Ideologien.",
        "I’m into music production: beats, mixing, sound design, but also the physics of sound and how speakers work.",
        "Je m’intéresse beaucoup au droit : droit pénal, droit constitutionnel, tribunaux internationaux. Et aussi l’éthique derrière tout ça.",
        "Quiero saber cómo dibujar un caballo y cómo se hace un arcoíris 🌈",
        "I want to learn about stars and why they twinkle. And about planets.",
        "मैं जानना चाहता या चाहती हूँ कि यूट्यूब कैसे करते हैं और वीडियो वायरल क्यों हो जाते हैं।",
        "Меня интересует химия, но я не очень разбираюсь. Что вообще такое атом?",
        "Por que as pessoas brigam tanto? Como dá pra resolver isso? Acho que quero ser psicólogo/psicóloga.",
        "저는 수학을 좋아해요 (진짜로) 그리고 퍼즐 같은 거요. 그리고 이걸 나중에 어디에 쓰는지도 알고 싶어요.",
        "I’m interested in animals and nature, but also plants. Which plants are poisonous? And how do trees grow?",
        "ฉันชอบรถไฟและเส้นทางรถไฟมาก ๆ อยากรู้ว่าเขาวางแผนเครือข่ายรางยังไง แล้วทำไมแต่ละประเทศระบบไฟฟ้าไม่เหมือนกัน?",
        "I want to understand how the internet works: servers, DNS, networks, and how hackers hack (just to understand).",
        "Tôi thích thiên văn học nhưng cũng thích sci-fi. Mình muốn biết những thứ sci-fi nào là thực tế.",
        "I want to do something with chemistry, maybe pharma or lab work. I’m interested in how medicines are developed.",
        "من علاقه‌مند به جامعه‌شناسی‌ام: چرا جامعه اینطور کار می‌کند، رسانه‌ها، ترندها، فشار گروهی.",
        "I’m interested in animals, especially sea animals: dolphins, whales, octopuses. How are they so intelligent??",
        "Me interesan las computadoras pero la informática en la escuela es aburrida. Quiero saber cómo se crean apps de verdad.",
        "I like geography, countries, flags (yeah) and also natural disasters: earthquakes, tsunamis, volcanoes.",
        "I’m really into economics + philosophy together: what is a good life? capitalism? which systems are fair?",
        "আমি ঠিক বুঝি না কীভাবে লিখব, কিন্তু আমি অনেক কিছুর প্রতি আগ্রহী:\n- মনোবিজ্ঞান (মানুষ কেন এমন হয়)\n- অপরাধ কেস আর প্রমাণ কীভাবে বের করে\n- আর জীববিজ্ঞান, বিশেষ করে মস্তিষ্ক\nআমি ভবিষ্যতে এমন কিছু করতে চাই যেখানে মানুষকে সাহায্য করা যায়, কিন্তু অনেক চিন্তাও করতে হয়। প্লিজ একদম বোরিং অফিস জব না।",
        "أنا مهتم جدا بالحاسوب، خصوصا: الخوارزميات، قواعد البيانات، الشبكات وأمن المعلومات. أبرمج مشاريع صغيرة في وقت الفراغ (مثل بوتات ديسكورد وتطبيقات ويب) وأريد أن أفهم أكثر كيف تعمل أنظمة التشغيل وإدارة الذاكرة والتشفير. وفي نفس الوقت يهمني الجانب الأخلاقي للتقنية: الخصوصية، المراقبة، مخاطر الذكاء الاصطناعي.",
        "Je veux ABSOLUMENT en savoir plus sur la médecine !!! Pas juste les « premiers secours », mais vraiment. Comment les organes fonctionnent ? Comment on fait les diagnostics ? Qu’est-ce qui se passe à l’hôpital ? Et comment devient-on chirurgien ? Je regarde souvent des documentaires là-dessus et ça m’intéresse mégaaa 😭",
        "I like fish and dinos and robots and space.",
        "I’m not sure what I want to be later. On one hand I’m interested in politics (because I get mad about a lot lol) and I want to understand how decisions are made and how to build good arguments. On the other hand I like natural sciences (biology and chemistry), and I find it fascinating how complex life comes from simple rules. I also like reading about history, especially revolutions and social change."
    ]

    if QUERY_SAMPLE_SEED:
        random.seed(QUERY_SAMPLE_SEED)
    sample_size = min(max(1, QUERY_SAMPLE_SIZE), len(queries))
    selected_queries = random.sample(queries, sample_size)

    LOG_DIR.mkdir(parents=True, exist_ok=True)
    with LOG_PATH.open("w", encoding="utf-8") as log:
        log.write(f"Model: {MODEL_NAME}\n")
        log.write(f"Topics: {len(topics)}; Tags: {len(tags)}\n")
        log.write(f"Assignments: {len(assignments)}\n\n")
        log.write(
            f"Query sample: {sample_size} of {len(queries)} "
            f"(seed={QUERY_SAMPLE_SEED or 'none'})\n\n"
        )

        for qi, query in enumerate(selected_queries, start=1):
            query_emb = model.encode([query], normalize_embeddings=True)[0]
            variant_scores = (query_emb @ tag_variant_emb.T).ravel()
            tag_scores = np.array(
                [
                    float(np.median(variant_scores[indices]))
                    for indices in tag_variant_indices
                ],
                dtype=float,
            )
            tag_weights = query_tag_weights(tag_scores, tags)

            log.write(f"=== Query {qi} ===\n{query}\n")
            log.write("Top query tags:\n")
            for tag_id, (name, score, weight) in sorted(
                tag_weights.items(), key=lambda t: t[1][2], reverse=True
            ):
                log.write(f"- {tag_id} {name}: sim={score:0.4f}, weight={weight:0.4f}\n")

            prefilter_scores: List[Tuple[str, float]] = []
            for topic_id, topic_tag_weights in assignments.items():
                score = 0.0
                for tag_id, (name, _, q_weight) in tag_weights.items():
                    t_weight = topic_tag_weights.get(tag_id)
                    if t_weight is not None:
                        score += q_weight * t_weight
                prefilter_scores.append((topic_id, score))

            prefilter_scores.sort(key=lambda item: item[1], reverse=True)
            third_score = prefilter_scores[2][1] if len(prefilter_scores) >= 3 else 0.0
            threshold = max(third_score * RELATIVE_MIN_FACTOR, ABS_MIN_PREFILTER)
            candidates = [item for item in prefilter_scores[:TOP_N_CANDIDATES] if item[1] >= threshold]

            log.write(
                f"\nPrefilter: {len(candidates)} candidates "
                f"(top {TOP_N_CANDIDATES}, threshold {threshold:0.4f})\n"
            )

            if not candidates:
                log.write("No candidates after prefilter.\n\n")
                continue

            candidate_indices = [topic_index[topic_id] for topic_id, _ in candidates]
            candidate_emb = topic_emb[candidate_indices]
            direct_scores = candidate_emb @ query_emb
            scored = list(zip(candidates, direct_scores))
            scored.sort(key=lambda item: item[1], reverse=True)

            log.write("Top final matches:\n")
            for (topic_id, pre_score), direct_score in scored[:TOP_FINAL]:
                topic = topic_by_id[topic_id]
                log.write(
                    f"- {topic_id} {topic.name}: pre={pre_score:0.4f}, final={float(direct_score):0.4f}\n"
                )
            log.write("\n")

    print(f"Log written to {LOG_PATH}")


if __name__ == "__main__":
    main()
