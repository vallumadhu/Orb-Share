from models.chat_models import GPT_OSS_20b,GEMINI_FLASH
from services.retriever import retrieving_chunks


def talk_to_note(note_id:str,query:str,messages:list[str],top_k=20):

    k_chunks = retrieving_chunks(note_id,query,100)
    model_repsonse = GPT_OSS_20b.invoke(query,messages,k_chunks)
    return model_repsonse