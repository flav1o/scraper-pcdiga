import json
from os import wait
from src.rabbitmq.consumer import RabbitMQConsumer
from threading import Thread
from src.scrapers.scraper_factory import ScraperFactory
from pika.adapters import BlockingConnection 
from src.client.webhook import WebHook
from dotenv import load_dotenv

load_dotenv()
scrapers = ScraperFactory()

def scraper_consumer_thread():
    def on_message(ch, method, _, body):
        try:
            data = json.loads(body.decode()).get("data", {})
            url = data.get("url")
            company = data.get("company")
            product_id = data.get("productId")

            if not company or not url:
                ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
                return

            scraped_data = scrapers.get_scraper(company, url, product_id)
            WebHook.send(scraped_data)
            
            # Print using original DTO structure
            print(f"Original Price: {scraped_data.original_price}")
            print(f"Discount Price: {scraped_data.discount_price}")
            print(f"Product ID: {scraped_data.product_id}")
            print("--------------------------------")

            ch.basic_ack(delivery_tag=method.delivery_tag)
        except Exception as e:
            print(f"Error processing message: {e}")
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

    consumer = RabbitMQConsumer("localhost", "scraper_queue", callback=on_message)
    consumer.start_consuming()

for _ in range(3):
    Thread(target=scraper_consumer_thread).start()