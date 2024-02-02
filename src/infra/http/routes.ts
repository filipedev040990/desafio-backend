import { expressAdapter } from '@/adapters/tools/express/express.adapter'
import { Router } from 'express'
import { createUserControllerFactory } from '../factories/controllers/create-user.factory'
import { updateUserControllerFactory } from '../factories/controllers/update-user.factory'
import { authenticateControllerFactory } from '../factories/controllers/authenticate.factory'
import { authenticationMiddleware } from '../middlewares/authentication/authentication.middleware'
import { routePermissionMiddleware } from '../middlewares/permissions/route-permission.middleware'
import { getUserControllerFactory } from '../factories/controllers/get-user.factory'

const router = Router()

router.post('/user', authenticationMiddleware, routePermissionMiddleware, expressAdapter(createUserControllerFactory()))
router.patch('/user/:id', authenticationMiddleware, routePermissionMiddleware, expressAdapter(updateUserControllerFactory()))
router.get('/user', authenticationMiddleware, routePermissionMiddleware, expressAdapter(getUserControllerFactory()))

router.post('/authenticate', expressAdapter(authenticateControllerFactory()))

export { router }
