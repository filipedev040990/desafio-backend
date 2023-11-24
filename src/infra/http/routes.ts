import { expressAdapter } from '@/adapters/tools/express/express.adapter'
import { Router } from 'express'
import { createUserControllerFactory } from '../factories/controllers/create-user.factory'
import { updateUserControllerFactory } from '../factories/controllers/update-user.factory'
import { authenticateControllerFactory } from '../factories/controllers/authenticate.factory'
import { authenticationMiddlewareFactory } from '../factories/middlewares/authentication.factory'
import { expressMiddlewareAdapter } from '@/adapters/tools/express/middleware.adapter'

const router = Router()

router.post('/user', expressMiddlewareAdapter(authenticationMiddlewareFactory()), expressAdapter(createUserControllerFactory()))
router.patch('/user/:id', expressAdapter(updateUserControllerFactory()))

router.post('/authenticate', expressAdapter(authenticateControllerFactory()))

export { router }
