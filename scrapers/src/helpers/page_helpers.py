from playwright.sync_api import Page
from typing import Optional, Dict, Any
import json
import re

class PageHelpers:
    def __init__(self, page: Page):
        self.page = page
    
    def get_meta_content(self, property_name: str) -> Optional[str]:
        """Extract meta tag content by property (e.g., og:title, og:image)"""
        meta_element = self.page.query_selector(f"meta[property='{property_name}']")
        if not meta_element:
            return None
        return meta_element.get_attribute("content")
    
    def get_json_ld(self) -> Optional[Dict[Any, Any]]:
        """Extract JSON-LD structured data from script tag"""
        json_ld_script = self.page.query_selector("script[type='application/ld+json']")
        if not json_ld_script:
            return None
        
        try:
            content = json_ld_script.text_content()
            if content:
                return json.loads(content)
        except (json.JSONDecodeError, AttributeError):
            pass
        
        return None
    
    def get_text_by_xpath(self, xpath: str) -> Optional[str]:
        """Get text content using XPath selector"""
        element = self.page.locator(f"xpath={xpath}")
        if element.count() > 0:
            return element.text_content()
        return None
    
    def get_text_by_selector(self, selector: str) -> Optional[str]:
        """Get text content using CSS selector"""
        element = self.page.query_selector(selector)
        if element:
            return element.text_content()
        return None
    
    def extract_price_from_text(self, text: str) -> float:
        """Extract price from text string (handles €, commas, etc.)"""
        if not text:
            return 0.0
        
        # Remove currency symbols and normalize decimal separators
        price_str = text.split(" ")[0].replace(",", ".").replace("€", "").replace("$", "").strip()
        
        try:
            return float(price_str)
        except (ValueError, AttributeError):
            return 0.0 