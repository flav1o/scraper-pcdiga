[![Stargazers][stars-shield]][stars-url]
![MIT License][license-shield]
[![LinkedIn][linkedin-shield]][linkedin-url]

# Web Scraping

This project consists of an autonomous web scraper that extracts product data from the online e-commerce stores. The system is built to detect price changes, and offer features such as price history and personalized alerts.

## 🧠 Technologies Used

- **NestJS** — Scalable backend framework for Node.js.
- **ElasticSearch** — High-performance search by name or EAN.
- **RabbitMQ** — Asynchronous integration between backend and scrapers.
- **Prisma ORM** — Type-safe interaction with PostgreSQL database.
- **React + Vite** — Development of the Google Chrome extension.
- **Playwright (Python)** — Automated scraping of web pages.

## 🚀 Running the Project

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file with the required values:

```env
DATABASE_URL=""
GOOGLE_AUTH_CLIENT_ID=""
GOOGLE_AUTH_CLIENT_SECRET=""
SMTP_USER_EMAIL=""
SMTP_USER_PASSWORD=""
```

### 3. Start PostgreSQL and Elasticsearch (via Docker)

```bash
docker-compose up -d
```

### 4. Start the Backend

```bash
npm run start:dev
```

### 5. Run the Scrapers (Python)

```bash
cd scrapers
pip install -r requirements.txt
python main.py
```

### 6. Build and Load the Chrome Extension

```bash
cd extension
npm install
npm run build
```

Then go to `chrome://extensions`, enable Developer Mode, and load the `extension/dist` folder.

## 📬 Notifications

When a product price drops below the user's defined threshold, an automatic email is sent using a webhook-based notification system.

## 📊 Key Features

* Automatic and scheduled price scraping
* Checksum-based validation to ensure data integrity
* Historical price charting and visualization
* Watchlist with buy recommendations
* Visual classification of price opportunity (green/red gradients)
* Email notifications via webhook

## 📚 Flow

![alto_nivel](https://github.com/user-attachments/assets/93013639-2fbb-4a9d-8dd6-7bd03f8ba928)


## License

Distributed under the MIT License.

[stars-shield]: https://img.shields.io/github/stars/flav1o/scraper-pcdiga.svg?style=for-the-badge
[stars-url]: https://github.com/flav1o/scraper-pcdiga/stargazers
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/flav1o/scraper-pcdiga/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/flav1o/
