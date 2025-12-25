from pinecone import Pinecone
from config import PINECONE_API_KEY, INDEX_NAME

pinecone = Pinecone(api_key=PINECONE_API_KEY)
index = pinecone.Index(INDEX_NAME)