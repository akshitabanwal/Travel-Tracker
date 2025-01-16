# Travel-Tracker
A website which can track you travel records


# Family Travel Tracker

This is a web application designed to track countries visited by family members. Users can add themselves to the database, pick a color for their profile, and record the countries they have visited.

## Features

1. **User Management**
   - Add new users with a name and a preferred color.
   - Switch between existing users.

2. **Visited Countries**
   - Add a country to the list of visited countries for the current user.
   - Prevent duplicate entries for the same user.

3. **Dynamic Updates**
   - View a summary of all visited countries.
   - Display the total number of countries visited.

## Prerequisites

- Node.js
- PostgreSQL database

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akshitabanwal/Travel-Tracker/
   
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the PostgreSQL database:
   - Create a database named `world`.
   - Create the required tables using the schema:
     ```sql
     CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       color VARCHAR(50) NOT NULL
     );

     CREATE TABLE countries (
       country_code VARCHAR(10) PRIMARY KEY,
       country_name VARCHAR(255) NOT NULL
     );

     CREATE TABLE visited_countries (
       id SERIAL PRIMARY KEY,
       user_id INT REFERENCES users(id),
       country_code VARCHAR(10) REFERENCES countries(country_code)
     );
     ```

4. Populate the `countries` table with data:
   - Insert country names and codes into the table.

5. Update the database configuration in the `db` connection:
   ```javascript
   const db = new pg.Client({
     user: "postgres",
     host: "localhost",
     database: "world",
     password: "<your_password>",
     port: 5432,
   });
   ```

## Usage

1. Start the server:
   ```bash
   node index.js
   ```

2. Open the application in your browser:
   [http://localhost:3000](http://localhost:3000)

3. Use the following features:
   - Add a new user by clicking "Add a Family Member."
   - Select an existing user to view their visited countries.
   - Add a country to the visited list by typing its name.

## API Endpoints

### GET `/`
Renders the main page with:
- List of visited countries for the current user.
- Total number of countries visited.

### POST `/add`
Adds a country to the current user's visited list:
- Request Body: `{ country: <country_name> }`

### POST `/user`
Switches the current user:
- Request Body: `{ user: <user_id>, add: "new" (optional) }`

### POST `/new`
Adds a new user:
- Request Body: `{ name: <name>, color: <color> }`



## Known Issues
- The app assumes that the `countries` table is pre-populated with valid data.
- Input validation could be improved.



