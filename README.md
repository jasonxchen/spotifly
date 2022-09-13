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