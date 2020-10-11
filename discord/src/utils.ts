/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { GuildMember } from 'discord.js';
import mongoose = require('mongoose');

mongoose.connect('mongodb://database/vatstar', {
  user: 'mongodb',
  pass: 'mongodb',
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  vatsimId: { type: String },
  createdAt: { type: Date, default: Date.now },
  isNewUser: { type: Boolean, default: true },
  lastSeen: { type: Date, default: Date.now },
  pilotRating: {
    p0: { type: Boolean, default: false },
    p1: { type: Boolean, default: false },
    p2: { type: Boolean, default: false },
    p3: { type: Boolean, default: false },
    p4: { type: Boolean, default: false },
  },
});

const db = mongoose.connection;
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // eslint-disable-next-line no-console
  console.log('DB CONNECTION SUCCESSFUL');
});

const User = mongoose.model('User', userSchema);

export function newUser(member: GuildMember) {
  const user = new User({
    userId: member.id,
    name: member.displayName,
  });
  user.save((err, user) => {
    // eslint-disable-next-line no-console
    if (err) return console.log(err);
    // eslint-disable-next-line no-console
    console.log(user);
  });
}

interface UserSchema {
    name: String,
    userId: String,
    createdAt: Date,
    isNewUser: Boolean,
    lastSeen: Date,
    _id: Object,
    pilotRating: {
      p0: boolean;
      p1: boolean;
      p2: boolean;
      p3: boolean;
      p4: boolean;
    };

}

export async function retrieveUser(member: GuildMember): Promise<UserSchema> {
  let userDoc: UserSchema;
  await User.findOne({ userId: member.id }, (err, res: UserSchema) => {
    console.log(`Server response: ${res}`);
    if (err) console.log(err);
    userDoc = res;
    return userDoc;
  });
  return userDoc;
}

export function updateUser(member: GuildMember, data, action: String) {
  console.log(`Updating member: ${member.id}`);
  const query = { userId: member.id };
  const pilotRating = {
    p0: false,
    p1: false,
    p2: false,
    p3: false,
    p4: false,
  };

  if (data.pilotrating === 0) {
    pilotRating.p0 = true;
  }
  if (data.pilotrating === 1) {
    pilotRating.p0 = true;
    pilotRating.p1 = true;
  }
  if (data.pilotrating === 3) {
    pilotRating.p0 = true;
    pilotRating.p1 = true;
    pilotRating.p2 = true;
  }
  if (data.pilotrating === 7) {
    pilotRating.p0 = true;
    pilotRating.p1 = true;
    pilotRating.p2 = true;
    pilotRating.p3 = true;
  }
  if (data.pilotrating === 15) {
    pilotRating.p0 = true;
    pilotRating.p1 = true;
    pilotRating.p2 = true;
    pilotRating.p3 = true;
    pilotRating.p4 = true;
  }
  switch (action) {
    case 'clearNewUser':
      User.findOneAndUpdate(query,
        {
          $set: {
            name: member.nickname,
            isNewUser: false,
            vatsimId: data.id,
            pilotRating,
            lastSeen: new Date(),
          },
        }, { new: true }, (err) => {
          if (err) console.log(err);
        });
      break;
    case 'updateUser':
      User.findOneAndUpdate(query,
        {
          $set: {
            lastSeen: new Date(),
            pilotRating,
            vatsimId: data.id,
          },
        }, { new: true }, (err) => {
          if (err) console.log(err);
        });

      break;
    default:
      break;
  }
}
