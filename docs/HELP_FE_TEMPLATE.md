## Help FE Branch Template

Muc tieu: Dong bo nhanh giua FE va BE khi bi lech field (thieu field, sai type, sai enum, sai key, sai response shape).

### 1) Quy uoc dat ten branch

- Format: `help-fe-<ticket|screen>-<yyyymmdd>`
- Vi du:
  - `help-fe-profile-fields-20260427`
  - `help-fe-onboarding-response-20260427`

### 2) Quy trinh BE ho tro FE

1. Tu branch BE hien tai, tao branch moi theo format `help-fe-*`.
2. Mo ta ro mismatch field theo template ben duoi.
3. Chinh sua truc tiep trong repository (schema/dto/validator/controller/mock/docs api).
4. Tao commit + PR voi title bat dau bang `[HELP-FE]`.
5. Ping FE pull/rebase branch de test lai mapping UI.

### 3) Template mo ta mismatch (copy-paste)

```md
# [HELP-FE] <screen/flow>

## Context
- Screen/flow: <VD: Profile / Onboarding Step 4>
- Endpoint: <VD: GET /auth/me>
- Issue: <VD: FE thieu field `phone`, `preferred_currency`>

## Field mismatch details
| field | current (BE) | expected by FE | action |
|---|---|---|---|
| phone | null / missing | string, optional | add to response |
| preferred_currency | missing | enum: VND, USD | add enum field |
| budgeting_method | six_jars | SixJars | map value format |

## Response example (before)
```json
{
  "id": "u1",
  "name": "Nguyen Minh Anh",
  "email": "anh@finjar.app"
}
```

## Response example (after)
```json
{
  "id": "u1",
  "name": "Nguyen Minh Anh",
  "email": "anh@finjar.app",
  "phone": "0901234567",
  "preferred_currency": "VND",
  "budgeting_method": "SixJars"
}
```

## Impacted files (BE)
- <path-1>
- <path-2>

## Validation / notes
- [ ] Backward compatible
- [ ] Swagger/OpenAPI updated
- [ ] Mock/test data updated
- [ ] FE confirm pass UI mapping
```

### 4) Commit va PR convention

- Commit:
  - `chore(help-fe): align profile fields for FE mapping`
  - `fix(help-fe): normalize budgeting_method values`
- PR title:
  - `[HELP-FE] Align profile response fields`

### 5) FE checklist sau khi nhan branch

- Pull/rebase branch `help-fe-*`.
- Kiem tra mapping service + store.
- Verify UI lai tren cac man hinh bi anh huong.
- Confirm lai tren group task/PR.
