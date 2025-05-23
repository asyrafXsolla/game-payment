# Game Payment
This repository was made to simulate the integration of Xsolla Pay Station with game.

# Features
1. Basic authentication where user can register and login.
2. User can earn the coin by clicking on the button.
3. User can purchase coin by package using Xsolla Pay Station.

# Screenshots
1. Login
![alt text](<Screenshot-login.png>)
2. Game page
![alt text](<Screenshot-game-page.png>)
3. Store page
![alt text](<Screenshot-store-page.png>)

# Installation Guide
1. Ensure you have Docker installed in your local machine.
2. Execute this `cp .env.example .env` - to copy the .env file from .env.example
3. In the root folder, execute this: `docker compose up -d`
4. To get into the contanier, execute this: `docker exec -it game-payment-laravel.test-1 bash`
5. Run the following commands:
    - `composer i` - to install all composer packages
    - `php artisan key:generate` - to generate application key in .env file
    - `php artisan migrate` - to execute migration in database (by default using SQLite)
    - `npm i` - to install JavaScript packages
    - `npm run build` - to build frontend component
6. To receive the request to our webhook from Xsolla in local machine, we can utilize ngrok and [get the auth token here](https://dashboard.ngrok.com/get-started/your-authtoken). Enter the auth token to the following key in `.env` file.
```
NGROK_AUTHTOKEN=
```
7. Get the ngrok tunnel URL using this link: `http://localhost:4040/status`
8. Setup the webhook in the Publisher Account (refer [documentation](https://developers.xsolla.com/webhooks/overview/#section/Set-up-webhooks-in-Publisher-Account)) using the following endpoint:
    - Webhook: `<ngrok tunnel URL>/payment/webhook/xsolla`
    - Webhook with `xsolla-sdk-php`: `<ngrok tunnel URL>/payment/webhook/xsolla-sdk`
9. Enter the following information to integrate with Xsolla Pay Station:
```
XSOLLA_PROJECT_ID=
XSOLLA_API_KEY=
XSOLLA_WEBHOOK_SECRET=
```
10. The game should be accessible now via `http://localhost/login`