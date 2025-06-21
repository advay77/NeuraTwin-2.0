
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec
import os
from dotenv import load_dotenv
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configuration
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = "journal"
MODEL_NAME = "all-MiniLM-L6-v2"
EXPECTED_DIMENSION = 384  # Matches all-MiniLM-L6-v2

# Initialize Flask
app = Flask(__name__)

# Initialize SentenceTransformer model
try:
    model = SentenceTransformer(MODEL_NAME)
except Exception as e:
    logger.error(f"Failed to initialize SentenceTransformer: {e}")
    raise

# Initialize Pinecone
try:
    pc = Pinecone(api_key=PINECONE_API_KEY)
    
    # Check if index exists
    index_exists = PINECONE_INDEX_NAME in pc.list_indexes().names()
    
    if index_exists:
        # Get index description to check dimension
        index_description = pc.describe_index(PINECONE_INDEX_NAME)
        current_dimension = index_description.dimension
        
        if current_dimension != EXPECTED_DIMENSION:
            pc.delete_index(PINECONE_INDEX_NAME)
            index_exists = False
    
    # Create index if it doesn't exist or was deleted
    if not index_exists:
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=EXPECTED_DIMENSION,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")  # Adjust region
        )
    
    # Connect to the index
    index = pc.Index(PINECONE_INDEX_NAME)
except Exception as e:
    logger.error(f"Failed to initialize Pinecone: {e}")
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
        upsert_response = index.upsert(
            vectors=[{
                "id": journal_id,
                "values": vector,
                "metadata": metadata
            }],
            namespace="journal-entries"
        )
        logger.info(f"Pinecone upsert response: {upsert_response}")

        return jsonify({"status": "upserted", "id": journal_id})

    except Exception as e:
        logger.error(f"Failed to upsert embedding: {str(e)}")
        return jsonify({"error": f"Failed to upsert embedding: {str(e)}"}), 500

# Filters by userId to ensure user-specific results.
# Returns matches with id, score, and metadata (including summary, userId, createdAt).
    
@app.route("/query", methods=["POST"])
def query():
    try:
        data = request.json
        prompt = data.get("prompt", "")
        user_id = data.get("userId", "")
        top_k = data.get("topK", 3)

        # Validate inputs
        if not prompt or not user_id:
            return jsonify({"error": "Missing prompt or userId"}), 400

        # Generate embedding for prompt
        vector = model.encode(prompt).tolist()

        # Query Pinecone
        query_response = index.query(
            namespace="journal-entries",
            vector=vector,
            top_k=top_k,
            include_metadata=True,
            filter={"userId": user_id}
        )

        # Format matches
        matches = [
            {
                "id": match["id"],
                "score": match["score"],
                "metadata": match["metadata"]
            }
            for match in query_response["matches"]
        ]

        logger.info(f"Pinecone query successful, found {len(matches)} matches")
        return jsonify({"matches": matches})

    except Exception as e:
        logger.error(f"Failed to query Pinecone: {str(e)}")
        return jsonify({"error": f"Failed to query Pinecone: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(port=6000, debug=True)

