import _ from 'lodash'

/*
 * EntityType - TypeORM Entity
 * obj - Object to upsert
 * key_naming_transform (optional) - Transformation to apply to key names before upsert
 * do_not_upsert - Keys to exclude from upsert. This is useful if a non-nullable field is required in case
 * the row does not already exist but you do not want to overwrite this field if it already exists
 */
export default async <T>(
    EntityType: T,
    obj: T,
    primary_key: string,
    opts?: {
        key_naming_transform: (k: string) => string,
        do_not_upsert: string[],
    }
): Promise<T> => {
    const keys: string[] = _.difference(_.keys(obj), opts ? opts.do_not_upsert : [])
    const setter_string =
        keys.map(k => `${opts ? opts.key_naming_transform(k) : k} = :${k}`)

    const qb = (EntityType as any).createQueryBuilder()
        .insert()
        .values(obj)
        .onConflict(`("${primary_key}") DO UPDATE SET ${setter_string}`)

    keys.forEach(k => {
        qb.setParameter(k, (obj as any)[k])
    })

    return (await qb.returning('*').execute()).generatedMaps[0] as T;
}
