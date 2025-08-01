# API Endpoints

## GET /api/pizzas
Returns list of pizzas

## POST /api/order
Creates a new order
Body:
```json
{
  "userId": "123",
  "items": [{ "pizzaId": "abc", "qty": 2 }],
  "total": 25.99
}
