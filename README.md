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

"/users/:username" route
![My Routines Wireframe](./img/MyRoutines-Wireframe.png)

"/routines/new" route
![New Routine Wireframe](./img/NewRoutine-Wireframe.png)

"/exercises" route
![Exercises Search Wireframe](./img/Exercises-Search-Wireframe.png)

"/exercises/:exerciseId" route
![Exercises Details Wireframe](./img/Exercise-Details-Wireframe.png)

"/signup" route
![Sign Up Wireframe](./img/SignUp-Wireframe.png)

## ERD

![Entity Relationship Diagram](./img/ERD.png)

## RESTful Routes

| HTTP METHOD | URL              | CRUD    | Response                              |
| ----------- | ---------------- | ------- | ------------------------------------- |
| GET | `/users/:username` | READ | render user details page with all their routines |
| GET | `/signup` | READ | render form for user creation |
| GET | `/login` | READ | render form for user login |
| GET | `/settings` | READ | render form to edit user settings |
| GET | `/logout` | N/A | log out user |
| POST        | `/users`         | CREATE  | create new user in database           |
| POST | `/users/login` | N/A  | log a user in with provided payload of information |
| PUT         | `/users/:userId` | UPDATE  | update user in database               |
| DELETE      | `/users/:userId` | DESTORY | delete user from database             |
| GET         | `/` | READ    | render all routines     |
| GET         | `/routines/:routineId` | READ    | render routine details page     |
| GET | `/routines/new` | READ | render form for routine creation |
| GET | `/routines/edit/:routineId` | READ | render form to edit routine |
| POST | `/routines` | CREATE | create new routine in database |
| PUT | `/routines/:routineId` | UPDATE | update routine in database |
| DELETE | `/routines/:routineId` | DESTORY | delete routine from database |
| DELETE | `/routines/:routineId/exercises/:exerciseId` | N/A | remove association of an exercise to routine |
| GET         | `/exercises` | READ   | render exercises from search result |
| *GET         | `/exercises/:exerciseId` | READ    | render exercise details page  |
| POST | `/exercises` | CREATE | create new exercise in db using API data |
*=stretch goal

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
* Tailwind CSS
* HTML5 (EJS)
* Sequelize
* Express

## Minimum Viable Product (MVP) Goals
* [x] Create Routine and Exercise models w/ attributes
* [x] Associate 1:M and M:M relationships for User and Routine models, and Routine and Exercise models respectively
* [x] Render users, routines, and exercises GET routes
* [x] Implement POST, PUT, and DELETE routes for users and routines
* [x] "Add to routine" functionality for exercises from wger's Workout Manager REST API
* [x] Working user authentication and authorization
* [x] Incorrect login management
* [x] Password information is securely handled
* [x] Encrypt necessary cookies
* [x] Minimal CSS styling

## Stretch Goals
* [x] Search for exercises from API results
* [x] Allow pagination of exercises on exercises/index.ejs view to cut down on API request time
* [ ] Add About page and other links
* [ ] Add option to write notes on each exercise in routine
* [ ] Save other users' routines to your own (make a copy)
* [ ] Implement more search categories (e.g. by routine titles)
* [ ] Use modals instead of /new and /edit pages
* [ ] Incorporate Spotify API to add a music playlist to routines (1:M)
* [ ] Add a M:M relationship for Routine and a new Tag model for better organization
* [ ] Have template error page for error catches instead of res.send()
* [ ] Replace "Error 405" res.send() messages with something more standard (see google.com)
* [ ] Dark mode
* [ ] Hash/encrypt IDs in URL
* [ ] A nice logo referencing wings for the latissimus dorsi muscle
* [ ] Update README.md Wireframes, ERD, and Routes as projects evolves
