import { BaseEntity, ObjectType, QueryBuilder } from 'typeorm'
import _ from 'lodash'

type ClassType<T> = {
    new (): T
    createQueryBuilder<T>(this: ObjectType<T>, alias?: string): QueryBuilder<T>;
}

/*
 * EntityType - TypeORM Entity
 * obj - Object to upsert
 * key_naming_transform (optional) - Transformation to apply to key names before upsert
 * do_not_upsert - Keys to exclude from upsert. This is useful if a non-nullable field is required in case
 * the row does not already exist but you do not want to overwrite this field if it already exists
 */
export default async <T>(
    EntityType: ClassType<T>,
    obj: T,
    key_naming_transform: (k: string) => string = _.identity,
    do_not_upsert: string[] = [],
): Promise<T> => {
    const keys: string[] = _.difference(_.keys(obj), do_not_upsert)
    const setter_string =
        keys.map(k => `${key_naming_transform(k)} = :${k}`)

    const qb = EntityType.createQueryBuilder()
        .insert()
        .values(obj)
        .onConflict(`("key") DO UPDATE SET ${setter_string}`)

    keys.forEach(k => {
        qb.setParameter(k, (obj as any)[k])
    })

    return (await qb.returning('*').execute()).generatedMaps[0] as T;
}
