import uuid
from typing import List
from pydantic import BaseModel
from fastapi import APIRouter,Form
from services.splitter import splitter
from models.embedding_models import ibm_embedding_model
from db.pinecone import index
from services.chat import talk_to_note

class ChatRequest(BaseModel):
    unique_note_id:str
    query: str
    past_conversations: List[str]

router = APIRouter()

@router.post("/embednote")
def embednote(note:str= Form("")):

    chunks = splitter.split_text(note)
    embeddings = ibm_embedding_model.encode(chunks)
    unique_note_id = str(uuid.uuid4())

    vectors_to_upsert = []

    for i, (doc, embedding) in enumerate(zip(chunks, embeddings)):
        vectors_to_upsert.append({
            "id": f"doc_{i}",
            "values": embedding.tolist(),
            "metadata": {
                "text": doc,
                "document_id": unique_note_id,
                "chunk_index": i}
        })

        if i%500 == 0:
            index.upsert(vectors=vectors_to_upsert)
            print(f"{i + 1} vectors processed")
            vectors_to_upsert = []

    index.upsert(vectors=vectors_to_upsert)

    return {
            "message":"sucessfully embedded and uploaded to database",
             "note_id":unique_note_id
             }


@router.post("/chatbot")
def chat(data: ChatRequest):

    note_id, query, past_conversations = (
    data.unique_note_id,
    data.query,
    data.past_conversations)


    response = talk_to_note(note_id,query,past_conversations)
    
    return {
        "note_id":data.unique_note_id,
        "query":data.query,
        "output":response
    }