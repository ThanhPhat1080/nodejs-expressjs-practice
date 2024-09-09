import { Router } from 'express';
import { ProjectController } from '@/controllers';

const projectRouter = Router();

const {
    getProjects,
    createProject,
} = new ProjectController();

/**
 * @swagger
 * tags:
 *      name: Projects
 *      description: The Project managing API
 */



/**
 * @swagger
 * /project/:
 *      get:
 *          tags: [Projects]
 *          description: Get a list items of project
 *          responses:
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              $ref: '#/components/schemas/Project'
 */
projectRouter.get('/', getProjects);


/**
 * @swagger
 * /project/:
 *      post:
 *          tags: [Projects]
 *          description: Create new project
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Project'
 *                      example:
 *                          name: ExpressJS API
 *                          manager: ude-csnr-vng
 *                          lastUpdate: Mon Sep 09 2024 22:33:16
 *                          status: On Hold
 *                          members: [abc-scve-efe, kie-vhre-kui]
 *                          startTime: Mon Sep 01 2024 00:00:00
 *                          endTime: Mon Sep 01 2025 00:00:00
 *                          budget: 500000
 *          responses:
 *              200:
 *                  description: Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              $ref: '#/components/schemas/Project'
 */
projectRouter.post('/', createProject);

export default projectRouter;
