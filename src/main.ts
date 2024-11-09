import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { WrapperDataInterceptor } from './nest-modules/shared-module/interceptors/wrapper-data/wrapper-data.interceptor'
import { NotFoundErrorFilter } from './filters/not-found-error.filter'
import { EntityValidationErrorFilter } from './filters/entity-validation-error.filter'


async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422
    })
  )

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  app.useGlobalInterceptors(new WrapperDataInterceptor())
  app.useGlobalFilters(
    new NotFoundErrorFilter(),
    new EntityValidationErrorFilter()
  )
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
