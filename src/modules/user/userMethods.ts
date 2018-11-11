import * as jwt from 'jsonwebtoken';
import User from './userModel';
import { KEY } from '../../config';

interface AddUser {
  name: string;
  password: string;
  email: string;
}

interface GetUsers {
  search: string;
  after: number;
  first: number;
}

interface Login {
  email: string;
  password: string;
}

export default {
  /**
   * Gets user using the email
   * @constructor
   * @param {string} email - The title of the book.
   */
  user: async (email: string) => await User.findOne({ email }),

  /**
   * User login on the api
   * @constructor
   * @param {string} password - User password
   * @param {string} email - User email
   */
  login: async ({ password, email }: AddUser) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordCorrect = user.authenticate(password);

    if (!isPasswordCorrect) {
      throw new Error('Invalid email or password')
    }

    const token = `JWT ${jwt.sign({ id: email }, KEY)}`;

    return token;
  },

  /**
   * Register a user on the api
   * @constructor
   * @param {string} name - User full name
   * @param {string} password - User password
   * @param {string} email - User email
   */
  addUser: async ({ name, password, email }: AddUser) => {
    const user = await User.findOne({ email });

    if (user) {
      throw new Error('This email is already in use');
    }

    const newUser = new User({
      name,
      password,
      email
    });

    await newUser.save();

    const token = `JWT ${jwt.sign({ id: email }, KEY)}`;

    return token;
  },

  /**
   * List users registered on the api
   * @constructor
   * @param {string} search - Search a user by name
   * @param {string} after - Skips n rows
   * @param {string} first - Number of rows per page
   */
  users: async ({ search, after, first }: GetUsers) => {
    const where = search ? {
      name: {
        $regex: new RegExp(`^${search}^`, 'ig'),
      },
    } : {};

    const users = !after
      ? User.find(where).limit(first)
      : User.find(where)
        .skip(after)
        .limit(first);

    return {
      count: User.find({}).count(),
      users,
    };
  },
};
