import { expressAdapter } from '@/adapters/tools/express/express.adapter'
import { Router } from 'express'
import { createUserControllerFactory } from '../factories/controllers/create-user.factory'

const router = Router()

router.post('/user', expressAdapter(createUserControllerFactory()))

export { router }
