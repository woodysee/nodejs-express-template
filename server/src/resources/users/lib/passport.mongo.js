require('dotenv').config();

import { compare } from 'bcrypt';

export const configurePassportAuth = async (err, user, { password, done }) => {
  const errors = [];
  if (err) {
    // console.error(`Error occurred while finding user in the DB:`);
    // console.error(err);
    errors.push({
      id: errors.length,
      status: '500',
      code: 'error__db_query_failed',
      title: 'Error',
      detail: `Unable to execute query to find the user to authenticate with the alias provided.`,
      meta: {
        alias,
      },
    });
  }
  if (!user) {
    // console.error(`No such user found:`);
    errors.push({
      id: errors.length,
      status: '400',
      code: 'error__no_user',
      title: 'Error',
      detail: `Unable to find the user with the alias provided.`,
      meta: {
        alias,
      },
    });
    return done(errors, false);
  }

  // console.log("authenticatedUser:", user);

  if (!user.name.alias) {
    // console.error("Invalid user.");
    errors.push({
      id: errors.length,
      status: '400',
      code: 'error__invalid_user',
      title: 'Error',
      detail: `No such user with alias ${user.name.alias}.`,
    });
    return done(errors, false);
  }

  const hash = user.password.hash;

  const passwordsMatch = await new Promise((resolve, reject) => {
    compare(password, hash, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });

  // console.log("Compared user-input password. Hashes match:", passwordsMatch);

  if (!passwordsMatch) {
    // console.error("Invalid password.");
    errors.push({
      id: errors.length,
      status: '400',
      code: 'error__wrong_pw',
      title: 'Error',
      detail: `Incorrect password.`,
    });
    return done(errors, false);
  }

  // console.log(
  //   "...user has been locally configured for Passport authentication."
  // );
  return done(null, user);
};
