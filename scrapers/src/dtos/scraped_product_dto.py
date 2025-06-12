class ScrapedProductDto:
    def __init__(self, original_price: float, discount_price: float, product_id: str):
        self.original_price = original_price
        self.discount_price = discount_price
        self.product_id = product_id

    def to_dict(self):
        return {
            "originalPrice": self.original_price,
            "productId": self.product_id,
            "discountPrice": self.discount_price,
        }