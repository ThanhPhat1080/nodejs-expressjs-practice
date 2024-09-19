import { faker } from '@faker-js/faker';
import { MongoDbConnection } from './dataHelpers';
import mongoose from 'mongoose';
import UserModel, { USER_ROLES } from './models/user.model';
import bcryptjs from 'bcryptjs';

async function seedDB() {
    const mongodbService = new MongoDbConnection((process.env.MONGO_URI as string) || 'mongodb://0.0.0.0:27017/local');
    mongodbService.connect();

    mongoose.connection.on('connected', () => {
        console.log('=== Start seeding data! ===');
        console.log('=== - Seeding user! ===');

        seedingUser();
    });
}

const seedingUser = () => {
    try {
        /**
         * The drop() command destroys all data from a collection.
         * Make sure you run it against proper database and collection.
         */
        mongoose.connection.dropCollection('users');

        const newUsers = new Array(10).fill('').reduce((acc, _, i) => {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();

            const name = `${firstName} ${lastName}`;
            const email = faker.internet.email();
            const age = faker.number.int(100);
            const avatar = faker.image.avatar();
            const role =
                i === 0
                    ? USER_ROLES.SUPER_USER
                    : i % 4 === 0
                      ? USER_ROLES.ADMIN
                      : i % 3 === 0
                        ? USER_ROLES.USER
                        : USER_ROLES.STAFF;
            const password = generatePassword(role);

            const salt = bcryptjs.genSaltSync(Number(process.env.GEN_SALT as string));
            const hashPassword = bcryptjs.hashSync(password as string, salt);

            const currentTimestamp = new Date().getTime();
            const createdAt = new Date(currentTimestamp + 60 * 60 * 1000);

            const newUser = new UserModel({
                name,
                email,
                age,
                avatar,
                role,
                password: hashPassword,
                createdAt,
            });

            acc.push(newUser);

            return acc;
        }, []);

        UserModel.insertMany(newUsers)
            .then(() => {
                console.log('=== - User Seeded! ===');
            })
            .catch((err) => {
                console.log('Seed user error', err);
            })
            .then(() => {
                process.exit();
            });
    } catch (err) {
        console.log(err.stack);
    }
};

const generatePassword = (role = USER_ROLES.USER) => {
    switch (role) {
        case USER_ROLES.SUPER_USER:
            return 'Super@123';
        case USER_ROLES.ADMIN:
            return 'Admin@123';
        case USER_ROLES.STAFF:
            return 'Staff@123';
        default:
            return 'User@123';
    }
};

seedDB();
