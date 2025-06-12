import pika

class RabbitMQConsumer:
    def __init__(self, host: str, queue_name: str, callback: callable):
        self.host = host
        self.queue_name = queue_name
        self.callback = callback
        self.connection = None
        self.channel = None

    def connect(self):
        params = pika.ConnectionParameters(self.host)
        self.connection = pika.BlockingConnection(params)
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=self.queue_name, durable=True)

    def start_consuming(self):
        if self.connection == None or self.channel == None:
            self.connect()

        self.channel.basic_consume(queue=self.queue_name, on_message_callback=self.callback)
        print("Waiting for messages...")
        self.channel.start_consuming()

    def close(self):
        if self.connection and self.connection.is_open:
            self.connection.close()
        
