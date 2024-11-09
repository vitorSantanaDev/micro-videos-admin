import { NotFoundError } from '@core/shared/domain/errors/not-found.error'
import { Response } from 'express'
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

@Catch(NotFoundError)
export class NotFoundErrorFilter implements ExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()

    response.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: exception.message
    })
  }
}
