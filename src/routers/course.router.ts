import { Router } from 'express';
import { CourseController } from '@/controllers';
import { verifyAccessTokenAuthentication, withRoles } from '@/middleware/auth.middleware';
import { USER_ROLES } from '@/models/user.model';

const courseRouter = Router();

const { getCourses, createCourse, updateCourse } = new CourseController();

/**
 * @swagger
 * /course/:
 *      get:
 *          tags: [Courses]
 *          description: Get a list items of courses
 *          parameters:
 *              - in: query
 *                name: name
 *                schema:
 *                    type: string
 *                description: Query by course name
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
 *                              $ref: '#/components/schemas/Course'
 */
courseRouter.get('/', getCourses);

/**
 * @swagger
 * /course/:
 *      post:
 *          tags: [Courses]
 *          description: Create new course
 *          security:
 *              - BearerAuth: [Admin]
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Course'
 *                      example:
 *                          name: Course 1
 *                          description: Course first
 *                          length: anything
 *                          level: 1
 *                          status: DRAFT
 *                          lessons: [
 *                              {
 *                                  order: 1,
 *                                  lesson: the-id-lesson-1,
 *                                  rightCode: C1L1
 *                              }
 *                          ]
 *                          lessonCount: 2
 *                          reviewCount: 1
 *                          rightCode: C1
 *                          metadata: { key: value }
 *                          originalPrice: 100
 *                          sale: 70
 *          responses:
 *              401:
 *                  $ref: '#/components/responses/UnauthorizedError'
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: [object]
 *                              $ref: '#/components/schemas/CourseLessonCourse'
 */
courseRouter.post('/', createCourse);

/**
 * @swagger
 * /course/{id}:
 *      post:
 *          tags: [Courses]
 *          description: Update course
 *          security:
 *              - BearerAuth: [Admin]
 *          parameters:
 *            - $ref: '#/components/parameters/IdPath'
 *              description: The course ID
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              $ref: '#/components/schemas/Course'
 *                      example:
 *                          name: Course 1
 *                          description: Course first
 *                          length: anything
 *                          level: 1
 *                          status: DRAFT
 *                          lessons: [
 *                              {
 *                                  order: 1,
 *                                  lesson: the-id-lesson-1,
 *                                  rightCode: C1L1
 *                              }
 *                          ]
 *                          lessonCount: 2
 *                          reviewCount: 1
 *                          rightCode: C1
 *                          metadata: { key: value }
 *                          originalPrice: 100
 *                          sale: 70
 *          responses:
 *              401:
 *                  $ref: '#/components/responses/UnauthorizedError'
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              $ref: '#/components/schemas/Course'
 */
courseRouter.post('/:id', updateCourse);

export default courseRouter;
