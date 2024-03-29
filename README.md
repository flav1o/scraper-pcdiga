[![Stargazers][stars-shield]][stars-url]
![MIT License][license-shield]
[![LinkedIn][linkedin-shield]][linkedin-url]

###### Possibility of fraudulent price manipulation found!

Before all, I exported the database with the prices of Black November, Blackfriday 2022 and Christmas sales. There's really fishy prices like the product with the id of `6378fc29f2a8d33070b07298`. As we can see there is a price boost in Black November and there is applied the discount that goes back to the normal price.

| Sales            | Original Price € | Discount Price € |
| ---------------- | ---------------- | ---------------- |
| _Black November_ | 279.9            | 219.9            |
| _Black Friday_   | 279.9            | ----             |
| _Christmas_      | 219.9            | ----             |

There's a lot more products with this fishy price oscillation! You can check the database file in the `src/db` folder.

## About the project

This is a web scraper to watch and registe the price oscillation in the Pc Diga website. I made this project to know when to buy the products I was interested in.

## How does it work

![How does it work](https://cdn.discordapp.com/attachments/946807027462705172/980478083746385920/how-does-it-work.png)

_When the scraper is called the data is saved on the database_

## Built With

- [NestJs](https://nestjs.com/)
- [Puppeteer](https://pptr.dev/)
- [MongoDb](https://www.mongodb.com/)
- [GraphQl](https://graphql.org/)
- [ApolloGraphQl](https://www.apollographql.com/)
- [SendGrid](https://sendgrid.com/)
- [Docker](https://www.docker.com/)

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

Install npm

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

_These are the steps to install and use the scraper_

1. Get a free API Key at [SendGrid](https://sendgrid.com/)
2. Clone the repo
   ```sh
   git clone https://github.com/flav1o/scraper-pcdiga.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API Key in `.env`
   ```env
   SEND_GRID_API_KEY=ENTER YOUR API
   ```
5. Run docker compose
   ```sh
   docker-compose up
   ```
6. Run the application
   ```sh
   npm run start:dev
   ```

## Proof of work

![data](https://cdn.discordapp.com/attachments/941756261555376170/1027272351320113213/unknown.png)

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

[stars-shield]: https://img.shields.io/github/stars/flav1o/scraper-pcdiga.svg?style=for-the-badge
[stars-url]: https://github.com/flav1o/scraper-pcdiga/stargazers
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/flav1o/scraper-pcdiga/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/flav1o/
