from src.dtos.scraped_product_dto import ScrapedProductDto
from src.scrapers.companies.pc_diga import PcDigaScraper

class ScraperFactory:
    SCRAPERS = { 
        "PC_DIGA": PcDigaScraper 
    }

    def get_scraper(self, company: str, url: str, product_id: str) -> ScrapedProductDto:
        scraper_class = self.SCRAPERS.get(company)

        if scraper_class:
            scraper_class = scraper_class()
            return scraper_class.search(url, product_id)
        
        raise ValueError(f"No scraper available for {company}")