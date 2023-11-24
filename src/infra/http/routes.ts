import { expressAdapter } from '@/adapters/tools/express/express.adapter'
import { Router } from 'express'
import { createUserControllerFactory } from '../factories/controllers/create-user.factory'
import { updateUserControllerFactory } from '../factories/controllers/update-user.factory'
import { authenticateControllerFactory } from '../factories/controllers/authenticate.factory'
import { authenticationMiddleware } from '../factories/middlewares/authentication.factory'

const router = Router()

router.post('/user', authenticationMiddleware(), expressAdapter(createUserControllerFactory()))
router.patch('/user/:id', authenticationMiddleware(), expressAdapter(updateUserControllerFactory()))

router.post('/authenticate', expressAdapter(authenticateControllerFactory()))

export { router }
