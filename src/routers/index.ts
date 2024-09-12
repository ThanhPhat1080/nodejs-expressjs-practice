/**
 * @swagger
 *  components:
 *      parameters:
 *          EmbedParam:
 *              in: query
 *              name: embed
 *              required: false
 *              schema:
 *                  type: boolean
 *                  default: false
 *              description: return the reference object or not.
 *          PageParam:
 *             in: query
 *             name: page
 *             required: false
 *             schema:
 *                 type: integer
 *                 minimum: 0
 *             description: The "page" parameter using for pagination.
 *          LimitParam:
 *             in: query
 *             name: limit
 *             required: false
 *             schema:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 50
 *                 default: 10
 *             description: The numbers of items to return.
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

export { default as userRouter } from './user.router';
export { default as projectRouter } from './project.router';
