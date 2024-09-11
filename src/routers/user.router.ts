import { UserController } from '@/controllers';
import { verifyAccessTokenFilter } from '@/helpers/jwt';
import { Router } from 'express';

const userRouter = Router();

const { createUser, getUsers, getById, login, refreshToken, logout } = new UserController();

/**
 * @swagger
 * tags:
 *      name: Users
 *      description: The User managing API
 */

/**
 * @swagger
 * components:
 *      schemas:
 *          RefreshToken:
 *              type: object
 *              required:
 *                  - refreshToken
 *              properties:
 *                  refreshToken:
 *                      type: string
 *                      description: The user's refresh token
 */

/**
 * @swagger
 * components:
 *      schemas:
 *          Token:
 *              type: object
 *              required:
 *                  - accessToken
 *                  - refreshToken
 *              properties:
 *                  accessToken:
 *                      type: string
 *                      description: The user's access token
 *                  refreshToken:
 *                      $ref: '#/components/schemas/RefreshToken'
 */

/**
 * @swagger
 * /user/:
 *      get:
 *          tags: [Users]
 *          description: Get a list items of User
 *          responses:
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/User'
 */
userRouter.get('/', getUsers);

/**
 * @swagger
 * /user/register/:
 *      post:
 *          tags: [Users]
 *          description: Create new user
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *                      example:
 *                          value:
 *                              name: John Doe
 *                              password: Abc#111
 *                              email: johndoe@mail.com
 *                              age: 20
 *                              avatar: https://avatar.com/abc.jpg
 *          responses:
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              $ref: '#/components/schemas/User'
 */
userRouter.post('/register', createUser);

/**
 * @swagger
 * /user/login/:
 *      post:
 *          tags: [Users]
 *          description: Login to the application
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - email
 *                              - password
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  description: User email
 *                              password:
 *                                  type: string
 *                                  description: User email
 *                      example:
 *                           email: johndoe@mail.com
 *                           password: Abc#111
 *          responses:
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              $ref: '#/components/schemas/Token'
 */
userRouter.post('/login', login);

/**
 * @swagger
 * /user/{id}:
 *      get:
 *          tags: [Users]
 *          description: Get a user by user Id
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                schema:
 *                  type: string
 *                description: The user ID
 *          responses:
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              $ref: '#/components/schemas/User'
 */
userRouter.get('/:id', verifyAccessTokenFilter, getById);

/**
 * @swagger
 * /user/refresh-token:
 *      post:
 *          tags: [Users]
 *          description: Create and retrieve new Access token by Refresh token
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/RefreshToken'
 *                      example:
 *                          refreshToken: asdfkuiahdfkl82902u8df
 *          responses:
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              $ref: '#/components/schemas/Token'
 */
userRouter.post('/refresh-token', refreshToken);

/**
 * @swagger
 * /user/logout:
 *      post:
 *          tags: [Users]
 *          description: Logout
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/RefreshToken'
 *                      example:
 *                          refreshToken: asdfkuiahdfkl82902u8df
 *          responses:
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              property:
 *                                  message:
 *                                      type: string
 *                                      description: Logout status
 *                          example:
 *                              message: Success
 */
userRouter.post('/logout', logout);

export default userRouter;
