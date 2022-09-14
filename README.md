# Spotifly

"Can you spot me?" Get used to asking that when you head to the gym with your new workout routines. Use Spotifly to create your own exercise "playlists" and share them with others.

## User Stories

* As a user, I want to create workout routines to share with others and to keep as reminders for myself.
* As a user, I want to add notes on the exercises in my routines to express my thoughts.
* As a user, I want to update or delete my routines and/or the exercises they contain as desired.
* As a user, I want to explore a list of routines made by other users that I can try out.
* As a user, I want to save routines from others that stand out to me.

## Wireframes

"/" route
![Home Wireframe](./img/Home-Wireframe.png)

"/users/:userId/routines" route; where userId = signed in user
![My Routines Wireframe](./img/MyRoutines-Wireframe.png)

"/users/:userId/routine/new" route
![New Routine Wireframe](./img/NewRoutine-Wireframe.png)

"/exercises" route
![Exercises Search Wireframe](./img/Exercises-Search-Wireframe.png)

"/exercises/:exerciseId" route
![Exercises Details Wireframe](./img/Exercise-Details-Wireframe.png)

"/users/new" route
![Sign Up Wireframe](./img/SignUp-Wireframe.png)

## ERD

![Entity Relationship Diagram](./img/ERD.png)

## RESTful Routes

| HTTP METHOD | URL              | CRUD    | Response                              |
| ----------- | ---------------- | ------- | ------------------------------------- |
| GET         | `/users/:userId` | READ    | render user details page              |
| GET         | `/users/new` | READ    | render form for user creation             |
| GET         | `/users/:userId/routines` | READ   | render all routines from user |
| GET    | `/users/:userId/routines/new` | READ | render form for routine creation |
| POST        | `/users`         | CREATE  | create new user in database           |
| POST       | `/users/:userId/routines` | CREATE | create new routine in database |
| PUT         | `/users/:userId` | UPDATE  | update user in database               |
| PUT | `/users/:userId/routines/:routineId/exercises/:exercisesId` | UPDATE | update routine's exercise in database |
| PUT | `/users/:userId/routines/:routineId` | UPDATE | update routine in database |
| DELETE      | `/users/:userId` | DESTORY | delete user from database             |
| DELETE | `/users/:userId/routines/:routineId` | DESTORY | delete routine from database |
| GET         | `/` | READ    | render all routines     |
| GET         | `/routines/:routineId` | READ    | render routine details page     |
| GET         | `/exercises` | READ   | render exercises from search result |
| GET         | `/exercises/:exerciseId` | READ    | render exercise details page  |

## API

* [wger Workout Manager REST API](https://wger.de/api/v2/)
* No API key required to access public endpoints
* Example axios request:
```
const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000;
app.get("/", async (req, res) => {
    try {
        // increase results limit to max of 50,000
        const response = await axios.get("https://wger.de/api/v2/exerciseinfo/?limit=50000");
        // explicitly filter by english language since API filter method is broken for now
        const filtered = response.data.results.filter(item => item.language.id === 2);
        res.json(filtered);    // send json data
    } 
    catch (error) {
        console.log(error);
        res.send("error");
    }
})
app.listen(PORT, () => {
    console.log(`api-test express server running on port ${PORT}`);
})
```
* .json results:<br>
![API Results Count](./img/API_results_count.png)
![API Results Head](./img/API_results_head.png)

## Tech Stack
* JavaScript
* Node.js
* PostgreSQL
* CSS
* HTML5
* Sequelize
* Express
* EJS

## Minimum Viable Product (MVP) Goals
* [ ] Create Routine and Exercise models w/ attributes
* [ ] Associate 1:M and M:M relationships for User and Routine models, and Routine and Exercise models respectively
* [ ] Render users, routines, and exercises GET routes
* [ ] Implement POST, PUT, and DELETE routes for users and routines
* [ ] Incorporate wger Workout Manager REST API for exercise data
* [ ] Search for exercises from API to add to routines
* [ ] Working user authentication and authorization
* [x] Incorrect login management
* [x] Password information is securely handled
* [x] Encrypt necessary cookies
* [ ] Minimal CSS styling
* [ ] No bugs

## Stretch Goals
* [ ] More CSS styling
* [ ] Dark mode
* [ ] Incorporate Spotify API to add a music playlist to routines (1:M)
* [ ] Add a M:M relationship for Routine and a new Tag model for better organization
* [ ] Implement more search categories (e.g. by routine titles)
* [ ] Add About page and other links
* [ ] Save other users' routines to your own (view only vs. copy?)
* [ ] Add option to write notes on each exercise in routine
* [ ] A nice logo referencing wings for the latissimus dorsi muscle
* [ ] Update README.md Wireframes, ERD, and Routes as projects evolves
* [ ] Use modals instead of /new pages
* [ ] Have template error page for error catches instead of res.send()