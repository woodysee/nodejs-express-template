# Node.js Server App Template

A template with full RESTful user account management for user-account based web apps

- Database / Data store: MongoDB,
- Server app: Node.js, Express.js
- Views: EJS

## Features of this template
### Resource-based hierarchy
Breaking the server directory structure into resources of business logic each with its inner MVC framework (i.e. product-centric) instead of the usual MVC monolithic framework: https://github.com/i0natan/nodebestpractices/blob/master/sections/projectstructre/breakintresources.md
### Local login strategy
Each user account store [both password salt and hash](https://www.getdonedone.com/building-the-optimal-user-database-model-for-your-application/) in a version-specific strategy to allow for future implementations of more secure password encryption/one-way-encoding strategies while allowing for backward compatibility of accomodating existing users with  encrypted/one-way-encoded passwords stored with older strategies.
#### References

- [OWASP](https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet#Guidance)
- [It's okay to store a salt next to a hash](https://security.stackexchange.com/questions/100898/why-store-a-salt-along-side-the-hashed-password)

### Babel

#### References
- [Babel Node Guide](https://github.com/babel/example-node-server)

### Standardised request-response structure
All requests and responses mostly follow the guidelines of [JSON API](http://jsonapi.org/format/) to allow for [consistent data models](https://nordicapis.com/the-benefits-of-using-json-api/) while having the benefit of a standardised interface via HTTP between client and server applications, either internal or external.

### Server-side static view rendering using EJS

Each resource has its own set of `/views/{resource}` and SHOULD be located within a folder with the name `{resource}` within its own `views/` folder. All of the `views/` folders for each initalised component will share the hierarchy, and this is to prevent conflicting file pointers during `res.render`, e.g. `server/resources/users/views/index.ejs refer to the same file as client/views/index.ejs`.

#### References

- [Declare multiple views locations in Express](https://stackoverflow.com/questions/11315351/multiple-view-paths-on-node-js-express)

## Server app

Dependencies:

  - [`express`](https://www.npmjs.com/package/express)
  - [`bodyparser`](https://www.npmjs.com/package/body-parser)
  - [`dotenv`](https://www.npmjs.com/package/dotenv) - manage sensitive or contextual environment variables
  - [`mongoose`](https://www.npmjs.com/package/mongoose) - NoSQL modelling (http://mongoosejs.com/)
  - [`passport`](http://www.passportjs.org) - user local and social media authentication strategies.
    - `passport-local` (Local).
  - [`uuid`](https://www.npmjs.com/package/uuid) - used to generated UUIDs for unique user identifiers
  - [`bcrypt`](https://www.npmjs.com/package/bcrypt) - string hashing library
  - [`morgan`](https://www.npmjs.com/package/morgan) - needed for passport local strategy
  - [`cookie-parser`](https://www.npmjs.com/package/cookie-parser) - needed for passport local strategy
  - [`express-session`](https://www.npmjs.com/package/express-session) - needed for passport local strategy
  - [`connect-flash`](https://www.npmjs.com/package/connect-flash) - Flash messages which are stored in sessions

Developer dependencies:

- [`@babel/core`](https://www.npmjs.com/package/@babel/core) - Babel with Node.js
- [`@babel/cli`](https://www.npmjs.com/package/@babel/cli) - Needed to use babel on the command line
- [`@babel/node`](https://www.npmjs.com/package/@babel/node) - Babel with Node.js
- [`@babel/preset-env`](https://www.npmjs.com/package/@babel/node) - Recommended by Babel

## Client app (web)

## Local development

1. On project root level, install packages: `npm install`. npm manages both server and client resource dependencies.
2. Run `npm start` or `nodemon` if you have installed it via npm globally on your machine.

## Deployment

### Set up RDBs

### Set up MongoDBs

To set up a remote MongoDB, these are some options:

- [MongoDB Atlas cluster](https://cloud.mongodb.com/v2/)
- [mlab](https://www.mlab.com/)
- [Amazon Web Services VPCs](https://docs.aws.amazon.com/quickstart/latest/mongodb/welcome.html)

Create the following tables:

- `users`

## References

# Miscellenous references

- Deciding on a full stack framework: https://webinerds.com/6-web-development-stacks-try-2017/ 
- Best practices informational resource: https://github.com/i0natan/nodebestpractices#1-project-structure-practices
- Folder naming conventions on best or common practices: https://gist.github.com/woodysee/f4e5dff6ede764da422f3599221c723f
- https://www.sitepoint.com/node-js-mvc-application/
- https://twitter.com/nodepractices/
- [Passport JS Local Strategy template](https://github.com/passport/express-4.x-local-example/blob/master/server.js)
- [How to connect Robo 3T to a MongoDB Atlas cluster](https://www.datduh.com/blog/2017/7/26/how-to-connect-to-mongodb-atlas-using-robo-3t-robomongo)
