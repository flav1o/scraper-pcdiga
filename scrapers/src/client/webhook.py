import requests
from src.dtos.scraped_product_dto import ScrapedProductDto
from src.client.hmac import Hmac

class WebHook:
    @staticmethod
    def send(product: ScrapedProductDto) -> int:
        hmac = Hmac()
        
        encoded_product = str(product).encode('utf-8')
        str_product = hmac.sign(encoded_product)

        print(str_product)

        req = requests.post(
            'http://localhost:3000/on-watch/webhook',
            json=product.to_dict(),
        )

        return req.status_code
        