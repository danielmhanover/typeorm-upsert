# TypeORM Upsert

Say you have a TypeORM entity `Post` and you want to atomically upsert:


```typescript
import { Upsert } from 'typeorm-upsert'
import { SnakeCase } from 'snake-case'


const post: Post = { ... }

Upsert(
    Post, 
    post,
    "id",          // primary-key to upsert on
    SnakeCase,     // arbitrarily transform keys before UPSERT
    ['created_at'] // exclude non-nullable keys from UPDATE that are required in the event of an INSERT operation
)
```

Tested with PostgreSQL 9.5+. Contributors welcome.
