/* eslint-disable @typescript-eslint/no-unused-expressions */
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

type UpdateCategoryInputConstructorProps = {
  id: string
  name?: string
  description?: string | null
  is_active?: boolean
}

export class UpdateCategoryInput {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsNotEmpty()
  name?: string

  @IsString()
  @IsOptional()
  description?: string | null

  @IsBoolean()
  @IsOptional()
  is_active?: boolean

  constructor(props: UpdateCategoryInputConstructorProps) {
    if (!props) return
    this.id = props.id
    props.name && (this.name = props.name)
    props.description && (this.description = props.description)
    props.is_active !== null &&
      props.is_active !== undefined &&
      (this.is_active = props.is_active)
  }
}