#------//----------// LOGIN EXISTING USER ------//----------//

POST {{baseUrl}}/auth/login
Content-Type:application/json

{
 "email": "shahjalal.backend@gmail.com",
 "password": "Test@123",
 "fcmToken": "fcm_token_example_12345"
}

#------//----------// LOGIN EXISTING USER ------//----------//

#------//----------// LOGIN EXISTING USER ------//----------//
POST {{baseUrl}}/auth/login
Content-Type:application/json

{
 "email": "shahjalal.backend@gmail.com",
 "password": "newPassword",
 "fcmToken": "token"
}

#------//----------// LOGIN EXISTING USER ------//----------//


#
#
#
#------//----------//  Get  logged in user profile------//----------//
GET {{baseUrl}}/auth/profile
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDIzMjNjZWZjYTgyMzM5OTBiMTNiOSIsImVtYWlsIjoibXVob21tb2RzaGFoamFsYWxAZ21haWwuY29tIiwicm9sZSI6IlVzZXIiLCJpYXQiOjE3NTg2MDkzOTQsImV4cCI6MTc1OTkwNTM5NH0.GdsQiDJxAEk_GvAaCgAVonqvmji-QrId6VS4ucw8AHw

#------//----------//  Get  logged in user profile------//----------//
#
#
#


# ============================================================
# =====================   LOGIN USER 1   =====================
# ============================================================

POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "hasan.doe@example.com",
  "password": "Aa@123456",
  "fcmToken": null
}


# ============================================================
# =====================   LOGIN USER 2   =====================
# ============================================================

POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "shahjalal.backend@gmail.com",
  "password": "Aa@123456",
  "fcmToken": "token"
}


# ============================================================
# ===============   GET LOGGED IN USER PROFILE   =============
# ============================================================

GET {{baseUrl}}/auth/profile
Authorization: <JWT_TOKEN>


# ============================================================
# ===============start   SEND FORGOT PASSWORD OTP =============

POST {{baseUrl}}/auth/send-otp

Content-Type: application/json
{
  "email": "jamil.ux@gmail.com"
}

# ===============end   SEND FORGOT PASSWORD OTP ==============
# ============================================================


# ===============   verifyForgotPasswordOtpCode  =============
# ============================================================

POST {{baseUrl}}/auth/verify-otp

Content-Type: application/json
{
  "email": "shahjalal.backend@gmail.com",
  "otp": "3039"
}


# ============================================================
# ===============   verifyForgotPasswordOtpCode  =============
# ============================================================
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Y2U0Y2QwOGYyOWQ5YTUxNGVkZjc5YyIsImVtYWlsIjoic2hhaGphbGFsLmJhY2tlbmRAZ21haWwuY29tIiwiaWF0IjoxNzU4MzYzNTc3LCJleHAiOjE3NTk2NTk1Nzd9.3AVJAPMdwGp_AExfSaEuzs_PbrGRFwn7Wg5dEj9HahI

PATCH {{baseUrl}}/auth/reset-password

Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Y2U0Y2QwOGYyOWQ5YTUxNGVkZjc5YyIsImVtYWlsIjoic2hhaGphbGFsLmJhY2tlbmRAZ21haWwuY29tIiwiaWF0IjoxNzU4MzYzNTc3LCJleHAiOjE3NTk2NTk1Nzd9.3AVJAPMdwGp_AExfSaEuzs_PbrGRFwn7Wg5dEj9HahI

Content-Type: application/json

{
  "newPassword": "newPassword"
}


# ============================================================
# ===============   UPDATE PROFILE               =============
# ============================================================

PATCH {{baseUrl}}/auth/profile

Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Y2U0Y2QwOGYyOWQ5YTUxNGVkZjc5YyIsImVtYWlsIjoic2hhaGphbGFsLmJhY2tlbmRAZ21haWwuY29tIiwiaWF0IjoxNzU4MzYzNTc3LCJleHAiOjE3NTk2NTk1Nzd9.3AVJAPMdwGp_AExfSaEuzs_PbrGRFwn7Wg5dEj9HahI

Content-Type: application/json

{
  "profileImage": ""
}

# ============================================================
# ===============   UPDATE PROFILE               =============
# ============================================================





