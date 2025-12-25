from db.pinecone import index
from models.embedding_models import ibm_embedding_model

def retrieving_chunks(note_id, query_text, top_k=5):
    query_embedding = ibm_embedding_model.encode(query_text)

    results = index.query(
        vector=query_embedding.tolist(),
        top_k=top_k,
        include_metadata=True,
        filter={
            "document_id": {"$eq": note_id}
        }
    )
    
    return results["matches"]