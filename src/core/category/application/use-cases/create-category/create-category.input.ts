import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync
} from 'class-validator'

type CreateCategoryInputConstructorProps = {
  name: string
  description?: string | null
  is_active?: boolean
}

export class CreateCategoryInput {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsString()
  description?: string | null

  @IsOptional()
  @IsBoolean()
  is_active?: boolean

  constructor(props: CreateCategoryInputConstructorProps) {
    if (!props) return
    this.name = props.name
    this.description = props.description
    this.is_active = props.is_active
  }
}

export class ValidateCreateCategoryInput {
  static validate(input: CreateCategoryInput) {
    return validateSync(input)
  }
}
