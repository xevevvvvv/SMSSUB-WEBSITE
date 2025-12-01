#!/bin/bash

# Test Telegram Notification Endpoint
# Replace YOUR_DEPLOYMENT_URL with your actual Vercel deployment URL

DEPLOYMENT_URL="${1:-smssub-website.vercel.app}"
ENDPOINT="https://${DEPLOYMENT_URL}/api/register-main-app-user"

echo "Testing Telegram Notification Endpoint..."
echo "URL: ${ENDPOINT}"
echo ""

# Test with minimal data (just email)
echo "Test 1: Minimal registration (email only)"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }' \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "---"
echo ""

# Test with full data
echo "Test 2: Full registration (email, name, phone)"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }' \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo ""
echo "✅ Check your Telegram for notifications!"
echo "If you see notifications, the endpoint is working correctly."

