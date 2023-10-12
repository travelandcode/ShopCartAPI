# ShopCart API

The ShopCart API serves as a vital component in your e-commerce application, enabling you to create and manage shopping carts for users. Beyond its core functionality, this API also integrates with OIDC for secure user authentication and authorization. This ensures that only authenticated and authorized users can interact with the shopping cart services.

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

4. **Run the API:** Start the ShopCart API by running the following command.

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
