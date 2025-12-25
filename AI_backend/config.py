from dotenv import load_dotenv
import os

load_dotenv()

PINECONE_API_KEY = os.getenv("Pinecone_API_Key")
INDEX_NAME = "orb-share"
EMBEDDING_MODEL_NAME = "ibm-granite/granite-embedding-278m-multilingual"
OPEN_ROUTER_KEY = os.getenv("Open_Router_Key")