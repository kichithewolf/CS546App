# CS546App

How to run project:
  1. Make sure node.js is installed on the computer
  2. Download/Clone repository
  3. Extract files if downloaded
  4. From root of project folder, `npm install` the following packages:
    * `bcryptjs`
    * `body-parser`
    * `cookie-parser`
    * `express`
    * `express-handlebars`
    * `express-session`
    * `handlebars`
    * `mongodb`
    * `morgan`
    * `node-twitter-api`
    * `node-uuid`
    * `passport`
    * `passport-facebook`
    * `passport-local`
    * `twitter`
  5. Start the server using `npm start`
  6. Open a web browser and go to `http://localhost:3000/login`
  7. You should now be running Collective

TODO List:
* we said we saving FB/TW account configuration info in the user.accounts array in the db, but it doesn't look like we are...
* when signing in with FB, it says "myApp will receive your public profile"- change to "Collective". Also FB callbackURL needs to change to /posts
* when posting to FB, I get an unhandled promise, error returned from Facebook about app not authorized

