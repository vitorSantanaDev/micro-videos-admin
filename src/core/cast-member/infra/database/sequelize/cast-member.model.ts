import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { CastMemberModelProps } from './cast-member.sequelize.repository'
import { CastMemberTypes } from '@core/cast-member/domain/cast-member-type.vo'

@Table({ tableName: 'cast_members', timestamps: false })
export class CastMemberModel extends Model<CastMemberModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare cast_member_id: string

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string

  @Column({
    allowNull: false,
    type: DataType.SMALLINT
  })
  declare type: CastMemberTypes

  @Column({ allowNull: false, type: DataType.DATE(3) })
  declare created_at: Date
}
