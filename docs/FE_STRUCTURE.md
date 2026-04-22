# Frontend Source Structure (Recommended)

Muc tieu la tach ro phan `app`, `features`, `shared` de de mo rong va de maintain.

## Proposed tree

```txt
src/
  app/
    providers/          # React providers (router, query, theme, store)
    router/             # AppRouter, route guards
    styles/             # global styles, tailwind entry
    App.jsx
    main.jsx

  features/
    auth/
      pages/
      components/
      hooks/
      services/
      store/
      types/
    dashboard/
      pages/
      components/
      services/
      hooks/
    transactions/
      pages/
      components/
      services/
      hooks/
    jars/
      pages/
      components/
      services/
      hooks/
    budget/
      pages/
      components/
      services/
    goals/
      pages/
      components/
      services/
    reports/
      pages/
      components/
      services/
    admin/
      pages/
      components/
      services/

  shared/
    components/         # UI dung chung, layout, alert, modal...
    constants/          # constants dung chung toan app
    hooks/              # hooks dung chung
    services/           # api client, interceptors
    store/              # global stores
    utils/              # formatters, validators...
    assets/

  legacy/               # tam thoi cho code cu trong giai doan migration
```

## Mapping from current code

- `src/routes/*` -> `src/app/router/*`
- `src/pages/auth/*` -> `src/features/auth/pages/*`
- `src/pages/dashboard/*` -> `src/features/dashboard/pages/*`
- `src/pages/transactions/*` -> `src/features/transactions/pages/*`
- `src/pages/jars/*` -> `src/features/jars/pages/*`
- `src/pages/budget/*` -> `src/features/budget/pages/*`
- `src/pages/goals/*` -> `src/features/goals/pages/*`
- `src/pages/reports/*` -> `src/features/reports/pages/*`
- `src/pages/admin/*` -> `src/features/admin/pages/*`
- `src/components/ui/*` -> `src/shared/components/ui/*`
- `src/components/layout/*` -> `src/shared/components/layout/*`
- `src/components/shared/*` -> `src/shared/components/common/*`
- `src/services/api.js` -> `src/shared/services/apiClient.js`

## Migration principles

1. Di chuyen theo tung feature, khong big-bang.
2. Moi lan di chuyen phai chay lint/build.
3. Dat import alias (`@/app`, `@/features`, `@/shared`) de import gon va on dinh.
4. Hoan thanh migration xong moi xoa cac thu muc cu.

## Naming conventions

- Component: `PascalCase.jsx`
- Hook: `useSomething.js`
- Service: `somethingService.js`
- Store: `somethingStore.js`
- Constant: `UPPER_SNAKE_CASE` key trong file `camelCase.js`
