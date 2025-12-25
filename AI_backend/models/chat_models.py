import requests
import json
from config import OPEN_ROUTER_KEY

class ChatModel:
    def __init__(self,model_name:str | None = "openai/gpt-oss-20b:free",OPENROUTER_API_KEY:str | None=None):
        self.url = "https://openrouter.ai/api/v1/chat/completions"
        self.model_name = model_name
        self.OPENROUTER_API_KEY = OPENROUTER_API_KEY
    
    def invoke(self, prompt: str | None = None, messages: list | None = [],k_chunks: list | None = None):

        messages.append(
                    {
                    "role": "user",
                    "content": prompt
                    })
        if k_chunks:
            context = "\n\n".join([f"chunk index:{chunk['metadata']['chunk_index']} \n chunk data:\n{chunk['metadata']['text']}" for chunk in k_chunks])
            messages.insert(0, {
                            "role": "system",
                            "content": f"Use the following context to answer the user's question:\n\n{context}"
                        })
            
        payload = {
                "model": self.model_name,
                "messages": messages,
                "reasoning": {"enabled": True}
            }

        response = requests.post(
            url=self.url,
            headers={
                "Authorization": f"Bearer {self.OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            data=json.dumps(payload)
            )
        
        if response.status_code != 200:
            raise RuntimeError(f"OpenRouter error {response.status_code}: {response.text}")

        data = response.json()
        return data["choices"][0]["message"]["content"]
    
    def info(self):
        return {
            "model_name":self.model_name,
            "accessed_using":self.url
        }
    

GPT_OSS_20b = ChatModel(model_name="openai/gpt-oss-20b:free",OPENROUTER_API_KEY=OPEN_ROUTER_KEY)
GEMINI_FLASH = ChatModel(model_name="google/gemini-2.0-flash-exp:free",OPENROUTER_API_KEY=OPEN_ROUTER_KEY)