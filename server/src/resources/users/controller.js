// const metalog = {};
// metalog.name = 'Users';
// metalog.prefix = ` ->`;

// console.info(`${metalog.name}: Loading controller...`);
// console.info(`${metalog.prefix} Importing external dependencies...`);
require('dotenv').config();
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');

// console.info(`${metalog.prefix} ...imported external dependencies.`);
// console.info(`${metalog.prefix} Importing internal dependencies...`);
const passport = require('passport');
const pw = require('./lib/pw');
require('../../db/mongo')('for UserController.');
const User = require('./model');
// console.info(`${metalog.prefix} ...imported internal dependencies.`);

const strategyVersion = 0.1;
// console.info(`...server strategy for password encryption / one-way-encoding for all new and updated users now use version ${0.1}. Older password strategies are only maintained for comparing and authenticating.`);

// console.info(`Initialising RESTful resources...`);
exports.create = {};
exports.read = {};
exports.update = {};
exports.delete = {};
exports.views = {};
exports.auth = {};

exports.create.one = (req, res, next) => {
  // console.info(`Initialising JSON API v1 standard response structure...`);
  let response = {};
  // console.info("usersController.create.one(): Creates a new user. Invoked...");
  const rawNewUserData = req.body;
  const alias = rawNewUserData.alias;
  User.findOne({ 'name.alias': alias }, async (err, existingUser) => {
    if (existingUser) {
      response.errors = [];
      const error = {
        id: response.errors.length,
        status: '400',
        code: 'error__users__user_name_alias_already_taken',
        title: 'Error',
        detail: `User name alias is already taken and must be unique.`,
        meta: {
          alias: existingUser.name.alias
        }
      };
      response.errors.push(error);
      return res.format({
        html() {
          console.error(response);
          res.locals.errors = response.errors;
          return res.redirect('/users/signup');
        },
        json() {
          return res.json(response);
        },
        default() {
          console.error(response);
          res.locals.errors = response.errors;
          return res.redirect('/users/signup');
        }
      });
    }

    let newUser = new User();
    newUser.id = uuidv5(rawNewUserData.alias, uuidv4());
    newUser.name.first = rawNewUserData.firstName;
    newUser.name.last = rawNewUserData.lastName;
    newUser.name.alias = rawNewUserData.alias;
    newUser.contact.email = rawNewUserData.email;

    const encodeAttempt = await pw.encipher({
      version: strategyVersion,
      key: {
        password: rawNewUserData.password
      }
    });

    // console.log("encodeAttempt: ", JSON.stringify(encodeAttempt));

    if (typeof encodeAttempt === 'undefined') {
      response.errors = [];
      const error = {
        id: response.errors.length,
        status: '500',
        code: 'error__users__pw_encoding_failed',
        title: 'Error',
        detail: `Encoding password failed. This error handler was probably invoked without awaiting pw.permaEncode() to synchronously return the encoded password.`
      };
      response.errors.push(error);
      return res.json(response);
    }

    const encodingHasErrors = typeof encodeAttempt.errors !== 'undefined';

    if (encodingHasErrors) {
      return res.format({
        html() {
          console.error(encodeAttempt);
          return res.redirect(`users/index`);
        },
        json() {
          res.json(encodeAttempt);
        },
        default() {
          console.error(encodeAttempt);
          return res.redirect('users/index');
        }
      });
    }

    encodeAttempt.data.forEach(datum => {
      if (datum.type === 'password') {
        newUser.password.hash = datum.attributes.hash;
        newUser.password.strategy = strategyVersion;
      }
    });
    newUser.save(err => {
      // console.log('Attempting to save new user...');
      if (err) {
        response.errors = [];
        console.error('Exception caught while saving user...');
        const error = {
          id: response.errors.length,
          status: '500',
          title: 'Error',
          code: 'error__users__user_not_saved',
          detail: 'Failed to save new user',
          meta: err
        };
        response.errors.push(error);
        return res.json(response);
      }

      // console.log("...new user successfully saved.");
      response.data = [];
      const datum = {
        id: response.data.length,
        status: '200',
        code: 'success__users__user_saved',
        title: 'Success',
        attributes: {
          alias: newUser.name.alias,
          email: newUser.contact.email
        }
      };
      response.data.push(datum);
      return res.format({
        html() {
          return res.redirect(`users/profile/${newUser.name.alias}`);
        },
        json() {
          res.json(response);
        },
        default() {
          return res.render('users/index', response);
        }
      });
    });
  });
};

exports.create.many = (req, res, next) => {
  // console.info("usersController.create.many(): Creates many new users. Invoked...");
};

exports.read.one = (req, res, next) => {
  // console.info("usersController.read.one(): List account info of a user. Invoked...");
  // console.info(`Initialising JSON API v1 standard response structure...`);
  let response = {};
  if (!req.params) {
    // Handle error
    // console.error("...params not found.");
    response.errors = [];
    const error = {
      id: response.errors.length,
      status: '400',
      code: 'error__users__missing_params',
      title: 'Error',
      detail: `Missing parameters from request.`
    };
    response.errors.push(error);
    return res.format({
      html() {
        return res.render('users/index', response);
      },
      json() {
        res.json(response);
      },
      default() {
        return res.render('users/index', response);
      }
    });
  }

  const callback = (err, user) => {
    if (user === null) {
      // console.error("...user not found.");
      response.errors = [];
      const error = {
        id: response.errors.length,
        status: '404',
        code: 'error__users__no_such_user',
        title: 'Error',
        detail: `Unable to find user with alias: ${req.params.alias}.`,
        meta: err
      };
      response.errors.push(error);
      return res.format({
        html() {
          return res.render('users/index', response);
        },
        json() {
          res.json(response);
        },
        default() {
          return res.render('users/index', response);
        }
      });
    } else {
      response.data = [];
      const datum = {
        id: response.data.length,
        type: 'User found',
        attributes: user
      };
      response.data.push(datum);
      return res.format({
        html() {
          return res.render('users/auth', response);
        },
        json() {
          res.json(response);
        },
        default() {
          return res.render('users/auth', response);
        }
      });
    }
  };

  User.findOne()
    .where('name.alias')
    .equals(req.params.alias)
    .exec(callback);
};

exports.read.many = (req, res, next) => {
  // console.info("usersController.read.many(): List account info of many users. Invoked...");
};

exports.update.one = (req, res, next) => {
  // console.info("usersController.update.one(): Update account info of a user. Invoked...");
};

exports.update.many = (req, res, next) => {
  // console.info("usersController.update.many(): Update account info of many users. Invoked...");
};

exports.delete.one = (req, res, next) => {
  // console.info("usersController.delete.one(): Destroy account info of a user. Invoked...");
};

exports.delete.many = (req, res, next) => {
  // console.info("usersController.delete.many(): Destroy account info of many users. Invoked...");
};

/*
 ** Three pieces need to be configured to use Passport for authentication:
 **
 ** - Authentication strategies
 ** - Application middleware
 ** - Sessions (optional)
 **
 */

exports.auth.login = (req, res, next) => {
  // console.info("usersController.login(): Processes user login credentials and enables persistent server user session.");
  // console.info(`Initialising JSON API v1 standard response structure...`);
  passport.authenticate('local', function(errors, user) {
    // console.log(errors, user);
    if (errors) {
      // console.error(errors);
      res.locals.errors = errors;
      return next();
    }
    if (!user) {
      return next();
    }
    // console.log(`Logging in ${user.name.alias}...`);
    req.logIn(user, function(err) {
      if (err) {
        // console.error(err);
        return res.format({
          html() {
            return res.render('users/index', { errors: [err] });
          },
          json() {
            res.json({ errors: [err] });
          },
          default() {
            return res.render('users/index', { errors: [err] });
          }
        });
      }
      return res.redirect(`/users/profile/${user.name.alias}`);
    });
  })(req, res, next);
};

exports.views.login = (req, res) => {
  // console.info("usersController.view.login(): Opens login page.");
  // console.log(req.user);
  if (req.user) {
    return res.redirect(`/users/profile/${req.user.name.alias}`);
  }
  if (res.locals.errors && res.locals.errors.length > 0) {
    return res.render('users/login', {
      loginFailed: true,
      errors: res.locals.errors
    });
  }
  return res.render('users/login', {
    loginFailed: false
  });
};

exports.auth.check = (req, res) => {
  // console.info("usersController.auth.check(): Authenticating user credentials from session. Invoked...");
  // console.info(`Initialising JSON API v1 standard response structure...`);
  let response = {};
  // console.log(req.user);
  if (req.user) {
    // console.log('...User exists.');
    response.data = [];
    const userDetail = {
      id: req.user.id,
      type: 'user',
      attributes: req.user
    };
    response.data.push(userDetail);
    return res.format({
      html() {
        return res.render('users/auth', response);
      },
      json() {
        return res.json({
          errors: [
            {
              id: req.user.id,
              status: '200',
              title: 'Success',
              code: 'success__user_already_auth',
              detail: 'An existing user has already been authenticated',
              meta: {
                alias: req.user.name.alias
              }
            }
          ]
        });
      },
      default() {
        return res.render('users/auth', response);
      }
    });
  } else {
    response.errors = [];
    // console.error('...Exception caught while authenticating user.');
    const error = {
      id: response.errors.length,
      status: '401',
      title: 'Error',
      code: 'error__users__no_auth_user',
      detail: 'No authenticated user currently logged in'
    };
    response.errors.push(error);
    res.format({
      html() {
        return res.render('users/auth', response);
      },
      json() {
        return res.json(response);
      },
      default() {
        return res.render('users/auth', response);
      }
    });
  }
};

exports.auth.logout = (req, res) => {
  // console.log(req.user);
  // console.info(`usersController.auth.logout(): Logging out user ${req.user.name.alias}. Invoked...`);
  if (!req.user) {
    return res.format({
      html() {
        return res.render('users/index', {
          title: 'No user to log out',
          content: `No authenticated user currently logged in to be logged out`
        });
      },
      json() {
        return res.json({
          errors: [
            {
              id: 0,
              status: '401',
              title: 'Error',
              code: 'error__users__no_auth_user',
              detail:
                'No authenticated user currently logged in to be logged out'
            }
          ]
        });
      }
    });
  }
  const userIdBeingLoggedOut = req.user.name.alias;
  req.logout();
  return res.redirect(
    `/users/logout?userIdBeingLoggedOut=${userIdBeingLoggedOut}`
  );
};

exports.views.index = (req, res) => {
  // console.info("usersController.views.index(): View rendering of users index page. Invoked...");
  return res.render('users/index', {
    title: 'Users Index',
    content: 'For users'
  });
};

exports.views.logout = (req, res) => {
  // console.info(
  //   `usersController.views.logout(): Rendering view of a successful log out of user ${
  //     req.query.userIdBeingLoggedOut
  //   }. Invoked...`
  // );
  return res.render('users/index', {
    title: 'Successfully logged out',
    content: `This user has been logged out: ${req.query.userIdBeingLoggedOut}`
  });
};

exports.views.profile = (req, res, next) => {
  // console.info("usersController.views.profile(): View rendering of user profile page. Invoked...");
  const alias = req.user ? req.user.name.alias : req.params.alias;
  if (res.locals.errors && res.locals.errors.length > 0) {
    return res.format({
      html() {
        next();
      },
      json() {
        return res.json({
          errors: res.locals.errors
        });
      },
      default() {
        next();
      }
    });
  }
  callback = (err, user) => {
    let data = {};
    if (!user) {
      data = {
        title: 'Invalid user credentials',
        user: null
      };
    } else {
      data = {
        title: 'User Profile',
        user: {
          name: {
            first: user.name.first,
            last: user.name.last,
            alias: user.name.alias
          },
          email: user.contact.email
        }
      };
    }
    return res.format({
      html() {
        return res.render('users/profile', data);
      },
      json() {
        return res.json(data);
      },
      default() {
        return res.render('users/profile', response);
      }
    });
  };
  User.findOne()
    .where('name.alias')
    .equals(alias)
    .exec(callback);
};

exports.views.signup = (req, res) => {
  // console.info("usersController.views.signup(): View rendering of user profile page. Invoked...");
  if (res.locals.errors && res.locals.errors.length > 0) {
    const data = {
      errors: res.locals.errors
    };
    return res.format({
      html() {
        return res.render('users/signup', data);
      },
      json() {
        return res.json(data);
      },
      default() {
        return res.render('users/signup', data);
      }
    });
  }
  if (req.user) {
    return res.redirect(`/users/profile/${req.user.name.alias}`);
  }
  return res.format({
    html() {
      return res.render('users/signup');
    },
    json() {
      return res.json(data);
    },
    default() {
      return res.render('users/profile');
    }
  });
};
