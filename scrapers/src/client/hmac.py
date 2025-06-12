import hmac
import hashlib
import os

class Hmac:
    @staticmethod
    def sign(message):
        key = os.getenv("WEBHOOK_SECRET")
        key_to_bytes = key.encode('utf-8')
        return hmac.new(key_to_bytes, message, hashlib.sha256).digest()