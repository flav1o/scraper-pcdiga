from src.dtos.scraped_product_dto import ScrapedProductDto
from playwright.sync_api import sync_playwright
import json
from typing import Optional

class PcDigaScraper:
    def search(self, url: str, product_id: str) -> ScrapedProductDto:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False)
            page = browser.new_page()

            print("url - ", url)
            
            page.goto(url)         
            page.wait_for_function("""
            () => {
                const el = document.querySelector('script[type="application/ld+json"]');
                return el && el.textContent.trim().length > 0;
            }
            """)

            json_ld_script = page.query_selector("script[type='application/ld+json']")
            json_ld = {}
            if json_ld_script:
                try:
                    json_ld = json.loads(json_ld_script.text_content())
                except Exception:
                    pass
            
            print("json ld - ", json_ld)
            
            offers = json_ld.get("offers", {})
            current_price = float(offers.get("price", 0))
            is_on_discount = "priceValidUntil" in offers
            original_price = current_price

            print("current price - ", current_price)
            
            if is_on_discount:
                xpath = "/html/body/div[2]/main/div/div[3]/div[2]/div/div[1]/div[1]/div[1]/div[2]/div/p"
                element = page.locator(f'xpath={xpath}')
                if element.count() > 0:
                    try:
                        text = element.text_content()
                        if text:
                            price_str = text.split(" ")[0].replace(",", ".").replace("€", "").strip()
                            original_price = float(price_str)
                            print(current_price, original_price)
                    except Exception as e:
                        print("Error reading discount price:", e)
            print(current_price, original_price)
            browser.close()

            if current_price == original_price:
                current_price = None
                is_on_discount = False

            return ScrapedProductDto(original_price, current_price, product_id)


