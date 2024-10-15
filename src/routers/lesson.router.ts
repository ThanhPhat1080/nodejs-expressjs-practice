import { Router } from 'express';
import { LessonController } from '@/controllers';
import { verifyAccessTokenAuthentication, withRoles } from '@/middleware/auth.middleware';
import { USER_ROLES } from '@/models/user.model';

const lessonRouter = Router();

const { getLessons, createLesson } = new LessonController();

/** #
 * @swagger
 * /lesson/:
 *      get:
 *          tags: [Lessons]
 *          description: Get a list items of lessons
 *          parameters:
 *              - in: query
 *                name: name
 *                schema:
 *                    type: string
 *                description: Query by lesson name
 *              - $ref: '#/components/parameters/PageParam'
 *              - $ref: '#/components/parameters/LimitParam'
 *              - $ref: '#/components/parameters/EmbedParam'
 *          responses:
 *              401:
 *                  $ref: '#/components/responses/UnauthorizedError'
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              $ref: '#/components/schemas/Lesson'
 */
lessonRouter.get('/', getLessons);

/**
 * @swagger
 * /lesson/:
 *      post:
 *          tags: [Lessons]
 *          description: Create new lesson
 *          security:
 *              - BearerAuth: [Admin]
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Lesson'
 *                      example:
 *                          name: Lesson 1
 *                          videoUrl: https://video.url
 *                          description: Lesson first
 *                          status: DRAFT
 *                          creator: user-uuid
 *                          metadata: { key: value }
 *                          length: anything
 *          responses:
 *              401:
 *                  $ref: '#/components/responses/UnauthorizedError'
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              $ref: '#/components/schemas/Lesson'
 */
lessonRouter.post('/', createLesson);

export default lessonRouter;
