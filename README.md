# ShopCart API

Welcome to the ShopCart API documentation! This comprehensive guide empowers you to seamlessly integrate shopping cart functionality into your e-commerce application.

## Getting Started

To use the ShopCart API, follow these simple steps:

1. **Clone the Repository:** Use Git to clone the ShopCart API repository to your local machine.

    ```bash
    git clone https://github.com/travelandcode/shopcartapi.git
    ```

2. **Navigate to the Project Folder:** Change your current directory to the project folder.

    ```bash
    cd shopcartapi
    ```

3. **Install Dependencies:** Use npm (Node Package Manager) to install the project dependencies.

    ```bash
    npm install
    ```

4. **Create the .env file:** Create a `.env` file in the root of the project with the following content:

    ```plaintext
    # .env file

    # Google Credentials
    GOOGLE_CLIENT_ID = your_google_client_id
    GOOGLE_CLIENT_SECRET = your_google_client_secret
    GOOGLE_CALLBACK_URL = your_google_callback_url

    # Twitter Credentials
    TWITTER_CONSUMER_KEY = your_twitter_consumer_key
    TWITTER_CONSUMER_SECRET = your_twitter_consumer_secret
    TWITTER_CALLBACK_URL = your_twitter_callback_url
    
    #Facebook Credentials
    FACEBOOK_CLIENT_ID = your_facebook_client_id
    FACEBOOK_CLIENT_SECRET = your_facebook_client_secret
    FACEBOOK_CALLBACK_URL = your_facebook_callback_url
    
    #Microsoft Credentials
    MICROSOFT_CLIENT_ID = your_microsoft_client_id
    MICROSOFT_CLIENT_SECRET = your_microsoft_client_secret
    MICROSOFT_CALLBACK_URL = yoour_microsoft_callback_url

    #MONGODB
    MONGODB_URI = your_mongodb_connection_string

    #STRIPE
    STRIPE_API_KEY = your_stripe_secret_key
    
    # Other configurations
    PORT= your_port_number
    DOMAIN= your_domain
    ```

   Make sure to replace the placeholder values (`your_database_connection_string`, `your_oidc_issuer`, `your_oidc_client_id`, `your_oidc_client_secret`) with your actual configuration values.

5. **Run the API:** Start the ShopCart API by running the following command.

    ```bash
    npm run start
    ```

The API should now be up and running on your local machine, and you can start sending requests to it.

## API Endpoints

The ShopCart API provides the following endpoints:

- `GET /cart/:userId`: Retrieve the contents of a user's shopping cart.
- `POST /cart/:userId/addItem`: Add an item to the user's shopping cart.
- `PUT /cart/:userId/updateItem/:itemId`: Update the quantity or details of an item in the cart.
- `DELETE /cart/:userId/removeItem/:itemId`: Remove an item from the user's shopping cart.

## Usage

You can use the API by sending HTTP requests to the specified endpoints. For example, to add an item to a user's cart, you can send a POST request to `/cart/:userId/addItem` with the item details in the request body.

Here's an example using cURL:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"productId": 123, "quantity": 2}' http://localhost:3000/cart/user123/addItem

