# TypeORM Upsert

Say you have a TypeORM entity `Post` and you want to atomically upsert:

```typescript
import { TypeOrmUpsert } from 'typeorm-upsert'
import { SnakeCase } from 'snake-case'


const post: Post = { ... }

(async () => {

    const upserted_post = await TypeOrmUpsert(
        PostRepository, // TypeOrm Repository
        post, // object or array of objects
        "id",  // primary-key to upsert on
          // optional params
        {
            key_naming_transform: SnakeCase,  // arbitrarily transform keys before UPSERT
            do_not_upsert: ["created_at"], // exclude non-nullable keys from UPDATE that are required in the event of an INSERT operation
        }
    );
    console.log(upserted_post) // prints the finished version of `Post`
})
```

Tested with PostgreSQL 9.5+. Contributors welcome.
