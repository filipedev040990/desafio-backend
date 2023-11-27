import { expressAdapter } from '@/adapters/tools/express/express.adapter'
import { createUserControllerFactory } from '../factories/controllers/create-user.factory'
import { updateUserControllerFactory } from '../factories/controllers/update-user.factory'
import { authenticateControllerFactory } from '../factories/controllers/authenticate.factory'
import { authenticationMiddleware } from '../middlewares/authentication/authentication.middleware'
import { permissionsMiddleware } from '../middlewares/authentication/permission.middleware'
import { Router } from 'express'

const router = Router()

router.post('/user', authenticationMiddleware(), permissionsMiddleware(), expressAdapter(createUserControllerFactory()))
router.patch('/user/:id', authenticationMiddleware(), permissionsMiddleware(), expressAdapter(updateUserControllerFactory()))

router.post('/authenticate', expressAdapter(authenticateControllerFactory()))

export { router }
