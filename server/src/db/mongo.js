require('dotenv').config();
import mongoose from 'mongoose';

export const initialiseMongoConnection = forLocation => {
  console.info('Connecting to MongoDB resource...');
  mongoose.Promise = global.Promise; // To handle promise rejections. See http://mongoosejs.com/docs/promises.html
  mongoose.connect(process.env.DB__MONGO_URI, { useNewUrlParser: true }).catch(err => {
    console.error(
      '...Exception while connecting to MongoDB resource via mongoose. This is because:'
    );
    console.error(err);
    console.info('Now exiting...');
    process.exit();
  });
  const db = mongoose.connection;
  db.on(
    'error',
    console.error.bind(
      console,
      'Error while connecting to MongoDB resource via mongoose. This is because:'
    )
  );
  db.once('open', function() {
    console.info(`...connected to MongoDB resource ${forLocation}`);
  });
};
