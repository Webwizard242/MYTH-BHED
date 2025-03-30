import spacy
import sys
import json

nlp = spacy.load("en_core_web_sm")

def extract_keywords(text):
    doc = nlp(text)
    keywords = [token.text for token in doc if token.pos_ in ["NOUN", "PROPN"]]
    return list(set(keywords))  # Remove duplicates

if __name__ == "__main__":
    text = sys.argv[1]
    keywords = extract_keywords(text)
    print(json.dumps({"keywords": keywords}))
