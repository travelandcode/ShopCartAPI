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

    #MONGODB
    MONGODB_URI = your_mongodb_connection_string

    #STRIPE
    STRIPE_API_KEY = your_stripe_secret_key
    
    # Other configurations
    PORT = your_port_number
    DOMAIN = your_domain
    SESSION_SECRET = your_session_secret
    ```

   Make sure to replace the placeholder values (`your_mongodb_connection_string`, `your_google_client_id`, `your_google_client_secret`, `your_google_callback_url`, etc...) with your actual configuration values.

5. **Run the API:** Start the ShopCart API by running the following command.

    ```bash
    npm run start
    ```

The API should now be up and running on your local machine, and you can start sending requests to it.

TEST PUSH
