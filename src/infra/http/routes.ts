import { expressAdapter } from '@/adapters/tools/express/express.adapter'
import { Router } from 'express'
import { createUserControllerFactory } from '../factories/controllers/create-user.factory'
import { updateUserControllerFactory } from '../factories/controllers/update-user.factory'

const router = Router()

router.post('/user', expressAdapter(createUserControllerFactory()))
router.patch('/user/:id', expressAdapter(updateUserControllerFactory()))

export { router }
