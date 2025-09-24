# (START) ==========   (START) ==========

# (END)   ==========   (END)   ==========


# ========== GET All Users   (START) ==========

GET http://localhost:5002/api/v1/users
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YzkzY2M3MzVkNDAzNzBlMDY0NGZkYiIsImVtYWlsIjoiamFuZS5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoiVXNlciIsImlhdCI6MTc1ODAyMDA3NywiZXhwIjoxNzU5MzE2MDc3fQ.lASuKtS7IcDZU4HJPlALjn4in4jGZc94S7N5gvbH_Is

# ========== GET All Users  (END)   ==========

GET http://localhost:5002/api/v1/users/ruhulaminvai/amin

# (START) ==========  CREATE USER WITH OTP EMAIL VERIFICATION (START) ==========

POST http://localhost:5002/api/v1/users/create
Content-Type: application/json

{
 "firstName": "Michael",
  "lastName": "David",
  "email": "muhommodshahjalal@gmail.com",
  "password": "Test@123", 
  "nationality": "British",
  "fcmToken": "fcm_token_example_12345"
}

# (END) ========== CREATE USER WITH OTP EMAIL VERIFICATION  (END)   ==========


# (START) ==========  SIGNUP VERIFICATION (START) ==========

POST http://localhost:5002/api/v1/users/signup-verification
Content-Type: application/json

{
  "email": "shahjalal.backend@gmail.com",
  "otp": "2798"
}

# (END)   ==========  SIGNUP VERIFICATION (END)   ==========



# (START) ==========  GET SINGLE USER (START) ==========

GET http://localhost:5002/api/v1/users/68d220acefca8233990b13b8
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDIxODI4ZWZjYTgyMzM5OTBiMTNiNyIsImVtYWlsIjoic2hhaGphbGFsLmJhY2tlbmRAZ21haWwuY29tIiwicm9sZSI6IlVzZXIiLCJpYXQiOjE3NTg1OTk2MjksImV4cCI6MTc1OTg5NTYyOX0.pElN8R-WT9MnL4T66i_pmRTkR-8jepQhmPTe2kdEbN0

# (END)   ==========  GET SINGLE USER (END)   ==========


# (START) ==========  GOOGLE-LOGIN (START) ==========
POST http://localhost:5002/api/v1/auth/google-login
Content-Type: application/json

{
  "email": "sadman.doe@example.com",
  "role":"Seller",
  "fullName": "Jane Doe",
  "fcmToken": "abc123xyz456"
}
# (END)   ==========  GOOGLE-LOGIN (END)   ==========



# (START) ========== DELETE USER   (START) ==========

DELETE {{baseUrl}}/users/68d220acefca8233990b13b8
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDIxODI4ZWZjYTgyMzM5OTBiMTNiNyIsImVtYWlsIjoic2hhaGphbGFsLmJhY2tlbmRAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzU4NjA1NTE1LCJleHAiOjE3NTk5MDE1MTV9.iyeZ7gXirMGY-hx3lwHo5lb4A3L6I91kAVxiKxpP9Uc

# (END)   ==========  DELETE USER  (END)   ==========


# (START) ========== UPDATE USER (START) ==========
PATCH {{baseUrl}}/users/68d2323cefca8233990b13b9
Content-Type: application/json

{
  "firstName": "David",
  "lastName": "Harrol",
  "profileImage": "url"
}
# (END)   ========== UPDATE USER (END)   ==========

