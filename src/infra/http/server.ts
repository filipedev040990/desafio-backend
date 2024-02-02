import 'module-alias/register'
import { app } from './app'
import logger from '@/shared/logger'

const port = process.env.PORT ?? 3000

app.listen(port, () => logger.info(`Server running at port ${port}`))
