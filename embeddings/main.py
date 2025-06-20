# embedding-service/main.py
# from flask import Flask, request, jsonify
# from sentence_transformers import SentenceTransformer

# app = Flask(__name__)
# model = SentenceTransformer('all-MiniLM-L6-v2')

# @app.route('/embed', methods=['POST'])
# def embed():
#     data = request.json
#     text = data.get("text", "")
#     vector = model.encode(text).tolist()
#     return jsonify({ "embedding": vector })

# if __name__ == '__main__':
#     app.run(port=6000)
# embedding-service/main.py
# embeddings/main.py

from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = "journal"
MODEL_NAME = "all-MiniLM-L6-v2"

# Initialize Flask
app = Flask(__name__)

# Initialize SentenceTransformer model
try:
    model = SentenceTransformer(MODEL_NAME)
except Exception as e:
    print(f"Failed to initialize SentenceTransformer: {e}")
    raise

# Initialize Pinecone
try:
    pc = Pinecone(api_key=PINECONE_API_KEY)
    
    # Check if index exists, create if it doesn't
    if PINECONE_INDEX_NAME not in pc.list_indexes().names():
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=384,  # Matches all-MiniLM-L6-v2 output
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")  # Adjust region
        )
    
    # Connect to the index
    index = pc.Index(PINECONE_INDEX_NAME)
except Exception as e:
    print(f"Failed to initialize Pinecone: {e}")
    raise

@app.route("/embed", methods=["POST"])
def embed():
    try:
        data = request.json
        text = data.get("text", "")
        journal_id = data.get("id", "")
        user_id = data.get("userId", "")
        summary = data.get("summary", "")
        created_at = data.get("createdAt", "")

        # Validate inputs
        if not text or not journal_id:
            return jsonify({"error": "Missing text or journal_id"}), 400

        # Generate embedding
        vector = model.encode(text).tolist()

        # Prepare metadata
        metadata = {
            "summary": summary,
            "userId": user_id,
            "createdAt": created_at
        }

        # Upsert to Pinecone
        index.upsert(
            vectors=[{
                "id": journal_id,
                "values": vector,
                "metadata": metadata
            }],
            namespace="journal-entries"
        )

        return jsonify({"status": "upserted", "id": journal_id})

    except Exception as e:
        return jsonify({"error": f"Failed to upsert embedding: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(port=6000, debug=True)  # Development only





