import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "akshita@123",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [];
async function checkVisisted() {
  const result = await db.query(
    "SELECT country_code FROM visited_countries JOIN users ON users.id = user_id WHERE user_id = $1; ",
    [currentUserId]
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
async function getCurrentUser() {
 const result = await db.query("SELECT * FROM users");
  users = result.rows;
 return users.find((user) => user.id == currentUserId);
}
app.get("/", async (req, res) => {
  try {
    const countries = await checkVisisted();
    const currentUser = await getCurrentUser();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      users: users, // Assuming 'users' is defined elsewhere in your app
      color: currentUser.color,
    });
  } catch (err) {
    console.log('Error loading page:', err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];
  const currentUser = await getCurrentUser(); // Assuming this fetches user data including ID

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    if (result.rows.length > 0) {
      const countryCode = result.rows[0].country_code;
      const currentUserId = currentUser.id; // Assuming the ID is stored as 'id'

      // Check if the country has already been visited
      const checkVisit = await db.query(
        "SELECT * FROM visited_countries WHERE country_code = $1 AND user_id = $2;",
        [countryCode, currentUserId]
      );

      if (checkVisit.rows.length === 0) {
        try {
          await db.query(
            "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
            [countryCode, currentUserId]
          );
          res.redirect("/");
        } catch (err) {
          console.log('Error inserting data:', err);
          res.status(500).send("Error saving your data");
        }
      } else {
        res.redirect("/"); // Or send a message that the country has already been added
      }
    } else {
      res.status(404).send("Country not found");
    }
  } catch (err) {
    console.log('Error querying country:', err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/user", async (req, res) => {
if (req.body.add === "new") {
  res.render("new.ejs");
} else {
  currentUserId = req.body.user;
  res.redirect("/");
}


});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  const name = req.body.name;
  const color = req.body.color;
  
  const result = await db.query(
    "INSERT INTO users (name, color) VALUES($1, $2) RETURNING *;",
    [name, color]
  );

  const id = result.rows[0].id;
  currentUserId = id;

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
