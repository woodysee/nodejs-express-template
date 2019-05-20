require('dotenv').config();
import bcrypt from 'bcrypt';

const selectLocalCipher = params => {
  let response = {};
  switch (params.version) {
    case 0.1: {
      response.data = [];
      const strategy = {
        id: response.data.length,
        type: '0.1',
        attributes: {
          saltRounds: parseInt(process.env.SERVER__USER__PW__V0_1_SALT_ROUNDS),
        },
      };
      response.data.push(strategy);
      return response;
    }
    default: {
      return response;
    }
  }
};

const selectPepper = params => {
  const version = params.version;
  const password = params.key.password;
  switch (params.version) {
    case 0.1: {
      /*
       ** THIS SPACE RESERVED FOR:
       ** Custom pepper to enhance your password encoding
       **
       */
      const peppered = password;
      return {
        version: version,
        key: {
          password: peppered,
          saltRounds: params.key.saltRounds,
        },
      };
    }
    default: {
      return params;
    }
  }
};

const saltAndHasher = async params => {
  let response = {};
  // console.log('params:', params);
  // console.info(' -> Validating parameters...');
  const errors = [];
  if (!params.key.password) {
    const errorAsNoPassWordToEncode = {
      id: errors.length,
      status: '400',
      code: 'error__password__sah_no_pw',
      title: 'Missing parameter',
      detail: 'No params.unencoded (string)',
    };
    errors.push(errorAsNoPassWordToEncode);
  }
  if (!params.key.saltRounds) {
    const errorAsNoSaltRoundsDeclared = {
      id: errors.length,
      status: '400',
      code: 'error__password__sah_no_salt_rounds',
      title: 'Missing parameter',
      detail: 'No params.saltRounds (integer)',
    };
    errors.push(errorAsNoSaltRoundsDeclared);
  }
  if (!params.version) {
    const errorAsNoPasswordStrategyVersion = {
      id: errors.length,
      status: '400',
      code: 'error__password__sah_no_version',
      title: 'Missing parameter',
      detail: 'No params.version (string)',
    };
    errors.push(errorAsNoPasswordStrategyVersion);
  }
  const thereAreErrors = errors.length > 0;
  if (thereAreErrors) {
    response.errors = errors;
    return response;
  }
  // console.info(" -> ...validated parameters.");
  const password = params.key.password;
  const saltRounds = parseInt(params.key.saltRounds);
  // console.info(' -> Validating password...');
  // console.info(' -> ...validated password.');
  // console.info(' -> Password should be between 20 chars to 160 chars.');
  // console.info(
  //   " -> Generating salt-and-hashed password using a local strategy..."
  // );

  // console.info(
  //   "Wrapping bcrypt salting function in a promise in order to use await in this function..."
  // );
  const salt = await new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) reject(err);
      resolve(salt);
    });
  });

  // console.log(salt);

  // console.info(
  //   "Wrapping bcrypt hashing function in a promise in order to use await in this function..."
  // );
  const hash = await new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });

  // console.log(hash);

  let data = [];

  const datum = {
    id: data.length,
    type: 'password',
    attributes: {
      hash,
    },
  };

  data.push(datum);
  response.data = data;
  return response;
};

export const encipher = params => {
  // console.info("password.encipher() - version switch to decide which strategy to permanently encode password for storing or comparing");
  // console.log("encipher -> params:", params);
  let response = {};
  const errors = [];
  // console.info("Validating params...");
  if (!params.version) {
    const errorAsNoPasswordStrategyVersion = {
      id: errors.length,
      status: '400',
      code: 'error__password__sah_no_version',
      title: 'Missing parameter',
      detail: 'No params.version (string)',
    };
    errors.push(errorAsNoPasswordStrategyVersion);
  }
  if (!params.key && !params.key.password) {
    const errorAsNoPassWordToEncode = {
      id: errors.length,
      status: '400',
      code: 'error__password__sah_no_pw',
      title: 'Missing parameter',
      detail: 'No params.unencoded (string)',
    };
    errors.push(errorAsNoPassWordToEncode);
  }
  const thereAreErrors = errors.length > 0;
  if (thereAreErrors) {
    response.errors = errors;
    return response;
  }
  // console.info("...params validated. Continuing...");
  // console.info("Setting params...");
  const version = params.version;
  const raw = selectLocalCipher({ version });
  if (typeof raw.data === 'undefined') {
    let errors = [];
    const error = {
      id: errors.length,
      status: '500',
      code: 'error__password__invalid_cipher',
      title: 'Error',
      detail: 'Invalid password strategy details',
    };
    errors.push(error);
    response.errors = errors;
    return response;
  }
  const cipher = raw.data[0];
  switch (version) {
    case 1: {
      /**
       * THIS SPACE RESERVED FOR:
       * Future strategies for implementing custom password
       * strategies
       */
      break;
    }
    case 0.1: {
      params.key.saltRounds = cipher.attributes.saltRounds;
      const pepperedArguments = selectPepper({
        version,
        key: params.key,
      });
      const response = saltAndHasher(pepperedArguments);
      return response;
    }
    default: {
      let errors = [];
      const error = {
        id: errors.length,
        status: '400',
        code: 'error__password__invalid_strategy_version',
        title: 'Error',
        detail: 'Version of the password strategy not recognised',
      };
      errors.push(error);
      response.errors = errors;
      return response;
    }
  }
};
