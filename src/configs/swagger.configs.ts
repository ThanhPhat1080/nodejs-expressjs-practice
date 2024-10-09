import type { Express } from 'express';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const configs = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Express API with Swagger',
            version: '0.1.0',
            description: 'This is a simple CRUD API application made with Express and documented with Swagger',
            license: {
                name: 'MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'Phat Truong',
                email: 'thanhphat.994@gmail.com',
            },
        },
        servers: [
            {
                url: '/api/v1',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            responses: {
                UnauthorizedError: {
                    description: 'Error: Unauthorized',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'string',
                                        description: 'Response status code',
                                    },
                                    message: {
                                        type: 'string',
                                        description: 'Error message',
                                    },
                                },
                                example: {
                                    status: '401',
                                    message: 'Unauthorized',
                                },
                            },
                        },
                    },
                },
            },
            parameters: {
                EmbedParam: {
                    in: 'query',
                    name: 'embed',
                    required: false,
                    schema: {
                        type: 'boolean',
                        default: false,
                    },
                    description: 'return the reference object or not.',
                },
                PageParam: {
                    in: 'query',
                    name: 'page',
                    required: false,
                    schema: {
                        type: 'integer',
                        minimum: 0,
                    },
                    description: 'The "page" parameter using for pagination.',
                },
                LimitParam: {
                    in: 'query',
                    name: 'limit',
                    required: false,
                    schema: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 50,
                        default: 10,
                    },
                    description: 'The numbers of items to return.',
                },
            },
            schemas: {
                RefreshToken: {
                    type: 'string',
                    description: "The user's refresh token",
                },
                Token: {
                    type: 'object',
                    required: ['accessToken', 'refreshToken'],
                    properties: {
                        accessToken: {
                            type: 'string',
                            description: "The user's access token",
                        },
                        refreshToken: {
                            $ref: '#/components/schemas/RefreshToken',
                        },
                    },
                },
                User: {
                    type: 'object',
                    required: ['name', 'password', 'email', 'age', 'avatar'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'The auto-generated id of user',
                        },
                        name: {
                            type: 'string',
                            description: 'User name',
                        },
                        password: {
                            type: 'string',
                            description: 'User password',
                        },
                        email: {
                            type: 'string',
                            description: 'User email',
                        },
                        age: {
                            type: 'number',
                            description: 'User age',
                        },
                        avatar: {
                            type: 'string',
                            description: 'User avatar',
                        },
                        role: {
                            type: 'string',
                            description: 'User role',
                            enum: ['User', 'Staff', 'Admin', 'SuperUser'],
                        },
                        createdAt: {
                            type: 'date',
                        },
                        updatedAt: {
                            type: 'date',
                        },
                    },
                    example: {
                        id: 'd5fE_asz',
                        name: 'Phat Truong',
                        password: 'very-secret',
                        email: 'thanhphat.994gmail.com',
                        age: 30,
                        avatar: 'https://avatar.jpeg',
                        role: 'Admin',
                        createdAt: 'Wed Sep 10 2024 22:30:30',
                        updatedAt: 'Wed Sep 18 2024 23:00:00',
                    },
                },
                Project: {
                    type: 'object',
                    required: ['name', 'manager', 'status', 'members', 'startTime', 'endTime', 'budget'],
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Project name',
                        },
                        manager: {
                            type: 'object',
                            description: 'Project manager user',
                            $ref: '#/components/schemas/User',
                        },
                        status: {
                            type: 'string',
                            enum: ['On Track', 'On Hold', 'At Risk', 'Potential Risk'],
                            description: 'Project status',
                        },
                        members: {
                            type: ['object'],
                            description: 'Project list member users',
                            $ref: '#/components/schemas/User',
                        },
                        startTime: {
                            type: 'date',
                            description: 'Project start time',
                        },
                        endTime: {
                            type: 'date',
                            description: 'Project end time',
                        },
                        budget: {
                            type: 'number',
                            description: 'Project budget',
                        },
                        createdAt: {
                            type: 'date',
                        },
                        updatedAt: {
                            type: 'date',
                        },
                    },
                    example: {
                        name: 'ExpressJS API',
                        managerId: 'ude-csnr-vng',
                        status: 'On Hold',
                        memberIds: ['abc-scve-efe', 'kie-vhre-kui'],
                        startTime: 'Mon Sep 01 2024 00:00:00',
                        endTime: 'Mon Sep 01 2025 00:00:00',
                        budget: 500000,
                        createdAt: 'Mon Sep 01 2024 22:33:16',
                        updatedAt: 'Mon Sep 09 2024 22:33:16',
                    },
                },
            },
        },
        tags: [
            {
                name: 'Projects',
                description: 'The Project managing API',
            },
            {
                name: 'Users',
                description: 'The User managing API',
            },
        ],
    },
    apis: ['src/routers/index.ts', 'src/routers/*.router.ts', 'src/models/*.model.ts'],
};

const swaggerSpec = swaggerJSDoc(configs);

export const configSwaggerUI = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
};
