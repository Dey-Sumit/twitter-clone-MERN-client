### set up

---

[ ] install tailwind
[ ] add ts
[ ] init eslint react | https://medium.com/@RossWhitehouse/setting-up-eslint-in-react-c20015ef35f7

## backend

### Auth

Packages : bcryptjs

- User model
- api
- testing

### Important links

- https://www.freecodecamp.org/news/learn-how-to-handle-authentication-with-node-using-passport-js-4a56ed18e81e/
- https://flaviocopes.com/express-sessions/#:~:text=That's%20what%20sessions%20are.,npm%20install%20express%2Dsession

---

https://levelup.gitconnected.com/everything-you-need-to-know-about-the-passport-local-passport-js-strategy-633bbab6195

POST MODEL

- id
- title
- body
- tags[]
- user (ref to User model , who post it)
- vote up
- vote down

## Mongo DB

- https://stackoverflow.com/questions/37691476/mongoose-reversed-population-i-e-populating-a-parent-object-based-on-the-ref
- https://stackoverflow.com/questions/57136184/mongoose-populate-to-get-all-posts-by-user-returns-empty-array

## TODO

- Frontend UI - auth page same as dribble website
  // https://dribbble.com/shots/10034795-Twitter-Redesign-Dark-Mode/attachments/2053017?mode=media

/api/users?uid=<> => return the user by id
/api/users?username=<> => return the user by username
/api/users/:username?tweets = true & followers = true => return the user by username
