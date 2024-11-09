import { EntityValidationError } from '@core/shared/domain/validators/validation.error'
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { Response } from 'express'

@Catch(EntityValidationError)
export class EntityValidationErrorFilter implements ExceptionFilter {
  catch(exception: EntityValidationError, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()

    response.status(422).json({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: [
        ...exception.error.reduce(
          (acc, error) =>
            acc.concat(
              typeof error === 'string'
                ? [error]
                : [
                    ...Object.values(error).reduce(
                      (acc, error) => acc.concat(error),
                      [] as string[]
                    )
                  ]
            ),
          [] as string[]
        )
      ]
    })
  }
}
