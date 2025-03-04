import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

// ユーザーのエンティティ
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    firstName!: string

    @Column()
    lastName!: string

    @Column()
    age!: number

}
