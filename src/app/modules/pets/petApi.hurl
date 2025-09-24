GET {{baseUrl}}/pets

GET {{baseUrl}}/products/usersproduct/68ca50ed1768bf9be41c45db
GET {{baseUrl}}/products/usersproduct/68ca50e21768bf9be41c45da

POST {{baseUrl}}/pets/create
Content-Type: application/json

{
  "petName": "Whiskers",
  "petType": "Cat",
  "petAge": 3,
  "userId": "68d277c7895b8b7fcc30399e",
  "weight":2
}



POST {{baseUrl}}/products
Content-Type: application/json

{
  "name": "Rice Cooker",
  "price": 3000,
  "description": "This is a product",
  "sellerId": "68ca50ed1768bf9be41c45db"
}


POST {{baseUrl}}/products
Content-Type: application/json

{
  "name": "Iron Machine",
  "price": 500,
  "description": "This is Iron Machine",
  "sellerId": "68ca50ed1768bf9be41c45db"
}

