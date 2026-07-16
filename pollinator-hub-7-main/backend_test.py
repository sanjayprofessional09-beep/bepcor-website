#!/usr/bin/env python3
"""
Comprehensive backend API tests for BEPCoR NGO website
Tests all endpoints at REACT_APP_BACKEND_URL/api
"""

import requests
import json
import sys
from typing import Dict, Any
import uuid

# Read backend URL from frontend/.env
def get_backend_url():
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                return line.split('=', 1)[1].strip()
    raise ValueError("REACT_APP_BACKEND_URL not found in /app/frontend/.env")

BASE_URL = get_backend_url() + "/api"
print(f"Testing backend at: {BASE_URL}\n")

# Test results tracking
tests_passed = 0
tests_failed = 0
test_details = []

def log_test(name: str, passed: bool, details: str = ""):
    global tests_passed, tests_failed
    if passed:
        tests_passed += 1
        status = "✅ PASS"
    else:
        tests_failed += 1
        status = "❌ FAIL"
    
    message = f"{status}: {name}"
    if details:
        message += f"\n    {details}"
    print(message)
    test_details.append({"name": name, "passed": passed, "details": details})

def validate_uuid(value: str) -> bool:
    """Check if value is a valid UUID string"""
    try:
        uuid.UUID(value)
        return True
    except (ValueError, AttributeError):
        return False

def validate_iso_datetime(value: str) -> bool:
    """Check if value is an ISO datetime string"""
    from datetime import datetime
    try:
        datetime.fromisoformat(value.replace('Z', '+00:00'))
        return True
    except (ValueError, AttributeError):
        return False

def check_no_mongodb_id(data: Any) -> bool:
    """Recursively check that no _id field exists in response"""
    if isinstance(data, dict):
        if '_id' in data:
            return False
        return all(check_no_mongodb_id(v) for v in data.values())
    elif isinstance(data, list):
        return all(check_no_mongodb_id(item) for item in data)
    return True

print("=" * 80)
print("BEPCOR BACKEND API TESTS")
print("=" * 80)
print()

# ============================================================================
# TEST 1: Root health endpoint
# ============================================================================
print("TEST 1: GET /api/ (Root health endpoint)")
print("-" * 80)
try:
    response = requests.get(f"{BASE_URL}/")
    if response.status_code == 200:
        data = response.json()
        if 'service' in data and 'status' in data and data['status'] == 'ok':
            log_test("Root endpoint returns correct structure", True, 
                    f"Response: {json.dumps(data)}")
        else:
            log_test("Root endpoint returns correct structure", False,
                    f"Expected {{service, status:'ok'}}, got: {json.dumps(data)}")
    else:
        log_test("Root endpoint status code", False,
                f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("Root endpoint", False, f"Exception: {str(e)}")

print()

# ============================================================================
# TEST 2: Newsletter subscribe
# ============================================================================
print("TEST 2: POST /api/newsletter/subscribe")
print("-" * 80)

# Test 2a: Valid email - first subscription
test_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
try:
    response = requests.post(f"{BASE_URL}/newsletter/subscribe", 
                            json={"email": test_email})
    if response.status_code == 201:
        data = response.json()
        checks = []
        checks.append(("Has 'id' field", 'id' in data))
        checks.append(("'id' is UUID", validate_uuid(data.get('id', ''))))
        checks.append(("Has 'email' field", 'email' in data))
        checks.append(("Email matches", data.get('email') == test_email.lower()))
        checks.append(("Has 'subscribed_at' field", 'subscribed_at' in data))
        checks.append(("'subscribed_at' is ISO datetime", 
                      validate_iso_datetime(data.get('subscribed_at', ''))))
        checks.append(("No MongoDB _id", check_no_mongodb_id(data)))
        
        all_passed = all(check[1] for check in checks)
        failed_checks = [check[0] for check in checks if not check[1]]
        
        if all_passed:
            log_test("Newsletter subscribe - valid email (201)", True,
                    f"Email: {test_email}")
        else:
            log_test("Newsletter subscribe - valid email (201)", False,
                    f"Failed checks: {', '.join(failed_checks)}. Response: {json.dumps(data)}")
    else:
        log_test("Newsletter subscribe - valid email", False,
                f"Expected 201, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("Newsletter subscribe - valid email", False, f"Exception: {str(e)}")

# Test 2b: Duplicate email - should return 409
try:
    response = requests.post(f"{BASE_URL}/newsletter/subscribe", 
                            json={"email": test_email})
    if response.status_code == 409:
        log_test("Newsletter subscribe - duplicate email (409)", True,
                f"Correctly rejected duplicate: {test_email}")
    else:
        log_test("Newsletter subscribe - duplicate email (409)", False,
                f"Expected 409, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("Newsletter subscribe - duplicate email", False, f"Exception: {str(e)}")

# Test 2c: Invalid email - should return 422
try:
    response = requests.post(f"{BASE_URL}/newsletter/subscribe", 
                            json={"email": "not-an-email"})
    if response.status_code == 422:
        log_test("Newsletter subscribe - invalid email (422)", True,
                "Correctly rejected invalid email format")
    else:
        log_test("Newsletter subscribe - invalid email (422)", False,
                f"Expected 422, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("Newsletter subscribe - invalid email", False, f"Exception: {str(e)}")

print()

# ============================================================================
# TEST 3: Donations
# ============================================================================
print("TEST 3: POST /api/donations and GET /api/donations")
print("-" * 80)

# Test 3a: Valid donation
donation_data = {
    "name": "Riya Sharma",
    "email": f"riya_{uuid.uuid4().hex[:8]}@example.com",
    "amount": 2500,
    "tier": "Hive"
}
try:
    response = requests.post(f"{BASE_URL}/donations", json=donation_data)
    if response.status_code == 201:
        data = response.json()
        checks = []
        checks.append(("Has 'id' field", 'id' in data))
        checks.append(("'id' is UUID", validate_uuid(data.get('id', ''))))
        checks.append(("Has 'created_at' field", 'created_at' in data))
        checks.append(("'created_at' is ISO datetime", 
                      validate_iso_datetime(data.get('created_at', ''))))
        checks.append(("Name matches", data.get('name') == donation_data['name']))
        checks.append(("Email matches", data.get('email') == donation_data['email']))
        checks.append(("Amount matches", data.get('amount') == donation_data['amount']))
        checks.append(("No MongoDB _id", check_no_mongodb_id(data)))
        
        all_passed = all(check[1] for check in checks)
        failed_checks = [check[0] for check in checks if not check[1]]
        
        if all_passed:
            log_test("Donation - valid data (201)", True,
                    f"Created donation for {donation_data['name']}")
            saved_donation_id = data.get('id')
        else:
            log_test("Donation - valid data (201)", False,
                    f"Failed checks: {', '.join(failed_checks)}. Response: {json.dumps(data)}")
    else:
        log_test("Donation - valid data", False,
                f"Expected 201, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("Donation - valid data", False, f"Exception: {str(e)}")

# Test 3b: Invalid amount (0)
try:
    response = requests.post(f"{BASE_URL}/donations", 
                            json={**donation_data, "amount": 0})
    if response.status_code == 422:
        log_test("Donation - amount=0 (422)", True,
                "Correctly rejected amount=0")
    else:
        log_test("Donation - amount=0 (422)", False,
                f"Expected 422, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("Donation - amount=0", False, f"Exception: {str(e)}")

# Test 3c: Invalid amount (negative)
try:
    response = requests.post(f"{BASE_URL}/donations", 
                            json={**donation_data, "amount": -100})
    if response.status_code == 422:
        log_test("Donation - amount=-100 (422)", True,
                "Correctly rejected negative amount")
    else:
        log_test("Donation - amount=-100 (422)", False,
                f"Expected 422, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("Donation - amount=-100", False, f"Exception: {str(e)}")

# Test 3d: Invalid email
try:
    response = requests.post(f"{BASE_URL}/donations", 
                            json={**donation_data, "email": "invalid-email"})
    if response.status_code == 422:
        log_test("Donation - invalid email (422)", True,
                "Correctly rejected invalid email")
    else:
        log_test("Donation - invalid email (422)", False,
                f"Expected 422, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("Donation - invalid email", False, f"Exception: {str(e)}")

# Test 3e: Missing name
try:
    response = requests.post(f"{BASE_URL}/donations", 
                            json={"email": "test@example.com", "amount": 1000})
    if response.status_code == 422:
        log_test("Donation - missing name (422)", True,
                "Correctly rejected missing name")
    else:
        log_test("Donation - missing name (422)", False,
                f"Expected 422, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("Donation - missing name", False, f"Exception: {str(e)}")

# Test 3f: GET /api/donations
try:
    response = requests.get(f"{BASE_URL}/donations")
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            if len(data) > 0:
                # Check first item structure
                item = data[0]
                checks = []
                checks.append(("Has 'id' field", 'id' in item))
                checks.append(("'id' is UUID", validate_uuid(item.get('id', ''))))
                checks.append(("No MongoDB _id", check_no_mongodb_id(data)))
                checks.append(("Has 'created_at' field", 'created_at' in item))
                checks.append(("'created_at' is ISO datetime", 
                              validate_iso_datetime(item.get('created_at', ''))))
                
                all_passed = all(check[1] for check in checks)
                failed_checks = [check[0] for check in checks if not check[1]]
                
                if all_passed:
                    log_test("GET /api/donations returns array with valid structure", True,
                            f"Found {len(data)} donation(s)")
                else:
                    log_test("GET /api/donations returns array with valid structure", False,
                            f"Failed checks: {', '.join(failed_checks)}")
            else:
                log_test("GET /api/donations returns array", True,
                        "Returns empty array (no donations yet)")
        else:
            log_test("GET /api/donations returns array", False,
                    f"Expected array, got: {type(data)}")
    else:
        log_test("GET /api/donations", False,
                f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("GET /api/donations", False, f"Exception: {str(e)}")

print()

# ============================================================================
# TEST 4: Volunteers
# ============================================================================
print("TEST 4: POST /api/volunteers and GET /api/volunteers")
print("-" * 80)

# Test 4a: Valid volunteer
volunteer_data = {
    "name": "Anu Verma",
    "email": f"anu_{uuid.uuid4().hex[:8]}@example.com",
    "interest": "Field Volunteer",
    "message": "I want to help with pollinator conservation"
}
try:
    response = requests.post(f"{BASE_URL}/volunteers", json=volunteer_data)
    if response.status_code == 201:
        data = response.json()
        checks = []
        checks.append(("Has 'id' field", 'id' in data))
        checks.append(("'id' is UUID", validate_uuid(data.get('id', ''))))
        checks.append(("Has 'created_at' field", 'created_at' in data))
        checks.append(("No MongoDB _id", check_no_mongodb_id(data)))
        
        all_passed = all(check[1] for check in checks)
        failed_checks = [check[0] for check in checks if not check[1]]
        
        if all_passed:
            log_test("Volunteer - valid data (201)", True,
                    f"Created volunteer application for {volunteer_data['name']}")
        else:
            log_test("Volunteer - valid data (201)", False,
                    f"Failed checks: {', '.join(failed_checks)}")
    else:
        log_test("Volunteer - valid data", False,
                f"Expected 201, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("Volunteer - valid data", False, f"Exception: {str(e)}")

# Test 4b: Missing interest
try:
    response = requests.post(f"{BASE_URL}/volunteers", 
                            json={"name": "Test", "email": "test@example.com"})
    if response.status_code == 422:
        log_test("Volunteer - missing interest (422)", True,
                "Correctly rejected missing interest")
    else:
        log_test("Volunteer - missing interest (422)", False,
                f"Expected 422, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("Volunteer - missing interest", False, f"Exception: {str(e)}")

# Test 4c: GET /api/volunteers
try:
    response = requests.get(f"{BASE_URL}/volunteers")
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            log_test("GET /api/volunteers returns array", True,
                    f"Found {len(data)} volunteer(s)")
            if len(data) > 0:
                # Verify no MongoDB _id
                if not check_no_mongodb_id(data):
                    log_test("GET /api/volunteers - no MongoDB _id", False,
                            "Found MongoDB _id in response")
        else:
            log_test("GET /api/volunteers returns array", False,
                    f"Expected array, got: {type(data)}")
    else:
        log_test("GET /api/volunteers", False,
                f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("GET /api/volunteers", False, f"Exception: {str(e)}")

print()

# ============================================================================
# TEST 5: Contact
# ============================================================================
print("TEST 5: POST /api/contact and GET /api/contact")
print("-" * 80)

# Test 5a: Valid contact message
contact_data = {
    "name": "Sam Patel",
    "email": f"sam_{uuid.uuid4().hex[:8]}@example.com",
    "subject": "Collaboration Inquiry",
    "message": "I'd like to collaborate on pollinator conservation projects in my region."
}
try:
    response = requests.post(f"{BASE_URL}/contact", json=contact_data)
    if response.status_code == 201:
        data = response.json()
        checks = []
        checks.append(("Has 'id' field", 'id' in data))
        checks.append(("'id' is UUID", validate_uuid(data.get('id', ''))))
        checks.append(("Has 'created_at' field", 'created_at' in data))
        checks.append(("No MongoDB _id", check_no_mongodb_id(data)))
        
        all_passed = all(check[1] for check in checks)
        failed_checks = [check[0] for check in checks if not check[1]]
        
        if all_passed:
            log_test("Contact - valid data (201)", True,
                    f"Created contact message from {contact_data['name']}")
        else:
            log_test("Contact - valid data (201)", False,
                    f"Failed checks: {', '.join(failed_checks)}")
    else:
        log_test("Contact - valid data", False,
                f"Expected 201, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("Contact - valid data", False, f"Exception: {str(e)}")

# Test 5b: Missing message
try:
    response = requests.post(f"{BASE_URL}/contact", 
                            json={"name": "Test", "email": "test@example.com", "subject": "Hi"})
    if response.status_code == 422:
        log_test("Contact - missing message (422)", True,
                "Correctly rejected missing message")
    else:
        log_test("Contact - missing message (422)", False,
                f"Expected 422, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("Contact - missing message", False, f"Exception: {str(e)}")

# Test 5c: Message too long (>4000 chars)
try:
    long_message = "x" * 4001
    response = requests.post(f"{BASE_URL}/contact", 
                            json={**contact_data, "message": long_message})
    if response.status_code == 422:
        log_test("Contact - message >4000 chars (422)", True,
                "Correctly rejected message exceeding 4000 characters")
    else:
        log_test("Contact - message >4000 chars (422)", False,
                f"Expected 422, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("Contact - message >4000 chars", False, f"Exception: {str(e)}")

# Test 5d: GET /api/contact
try:
    response = requests.get(f"{BASE_URL}/contact")
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            log_test("GET /api/contact returns array", True,
                    f"Found {len(data)} contact message(s)")
            if len(data) > 0:
                # Verify no MongoDB _id
                if not check_no_mongodb_id(data):
                    log_test("GET /api/contact - no MongoDB _id", False,
                            "Found MongoDB _id in response")
        else:
            log_test("GET /api/contact returns array", False,
                    f"Expected array, got: {type(data)}")
    else:
        log_test("GET /api/contact", False,
                f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("GET /api/contact", False, f"Exception: {str(e)}")

print()

# ============================================================================
# TEST 6: Posts - List and Filters
# ============================================================================
print("TEST 6: GET /api/posts (list and filters)")
print("-" * 80)

# Test 6a: Get all posts
try:
    response = requests.get(f"{BASE_URL}/posts")
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            if len(data) == 6:
                log_test("GET /api/posts returns 6 seeded posts", True,
                        f"Found {len(data)} posts as expected")
                
                # Verify structure of first post
                if len(data) > 0:
                    post = data[0]
                    checks = []
                    checks.append(("Has 'id' field", 'id' in post))
                    checks.append(("'id' is UUID", validate_uuid(post.get('id', ''))))
                    checks.append(("No MongoDB _id", check_no_mongodb_id(data)))
                    checks.append(("Has 'created_at' field", 'created_at' in post))
                    
                    all_passed = all(check[1] for check in checks)
                    failed_checks = [check[0] for check in checks if not check[1]]
                    
                    if all_passed:
                        log_test("Posts have valid structure (UUID id, ISO datetime)", True)
                    else:
                        log_test("Posts have valid structure", False,
                                f"Failed checks: {', '.join(failed_checks)}")
            else:
                log_test("GET /api/posts returns 6 seeded posts", False,
                        f"Expected 6 posts, got {len(data)}")
        else:
            log_test("GET /api/posts returns array", False,
                    f"Expected array, got: {type(data)}")
    else:
        log_test("GET /api/posts", False,
                f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("GET /api/posts", False, f"Exception: {str(e)}")

# Test 6b: Filter by category=Pollinators
try:
    response = requests.get(f"{BASE_URL}/posts?category=Pollinators")
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            # Check that all returned posts have category=Pollinators
            pollinator_posts = [p for p in data if p.get('category') == 'Pollinators']
            if len(pollinator_posts) == len(data) and len(data) > 0:
                log_test("GET /api/posts?category=Pollinators filters correctly", True,
                        f"Found {len(data)} Pollinators post(s)")
            elif len(data) == 0:
                log_test("GET /api/posts?category=Pollinators", False,
                        "No Pollinators posts found (expected at least 1)")
            else:
                log_test("GET /api/posts?category=Pollinators", False,
                        f"Some posts don't have category=Pollinators")
        else:
            log_test("GET /api/posts?category=Pollinators returns array", False,
                    f"Expected array, got: {type(data)}")
    else:
        log_test("GET /api/posts?category=Pollinators", False,
                f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("GET /api/posts?category=Pollinators", False, f"Exception: {str(e)}")

# Test 6c: Filter by category=All (should return all posts)
try:
    response = requests.get(f"{BASE_URL}/posts?category=All")
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            if len(data) == 6:
                log_test("GET /api/posts?category=All returns all posts", True,
                        f"Found {len(data)} posts (treats 'All' as no filter)")
            else:
                log_test("GET /api/posts?category=All", False,
                        f"Expected 6 posts, got {len(data)}")
        else:
            log_test("GET /api/posts?category=All returns array", False,
                    f"Expected array, got: {type(data)}")
    else:
        log_test("GET /api/posts?category=All", False,
                f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("GET /api/posts?category=All", False, f"Exception: {str(e)}")

# Test 6d: Search by query q=bees
try:
    response = requests.get(f"{BASE_URL}/posts?q=bees")
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            # Should include "Why native bees matter more than you think"
            found_bees_post = any('bees' in p.get('title', '').lower() or 
                                 'bees' in p.get('excerpt', '').lower() 
                                 for p in data)
            native_bees_post = any('native bees' in p.get('title', '').lower() 
                                  for p in data)
            
            if found_bees_post and len(data) > 0:
                if native_bees_post:
                    log_test("GET /api/posts?q=bees searches correctly", True,
                            f"Found {len(data)} post(s) with 'bees', including 'Why native bees matter'")
                else:
                    log_test("GET /api/posts?q=bees searches correctly", True,
                            f"Found {len(data)} post(s) with 'bees' in title/excerpt")
            else:
                log_test("GET /api/posts?q=bees", False,
                        "No posts found with 'bees' (expected at least 1)")
        else:
            log_test("GET /api/posts?q=bees returns array", False,
                    f"Expected array, got: {type(data)}")
    else:
        log_test("GET /api/posts?q=bees", False,
                f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("GET /api/posts?q=bees", False, f"Exception: {str(e)}")

print()

# ============================================================================
# TEST 7: Posts - Get by slug
# ============================================================================
print("TEST 7: GET /api/posts/{slug}")
print("-" * 80)

# Test 7a: Valid slug - why-native-bees-matter
try:
    response = requests.get(f"{BASE_URL}/posts/why-native-bees-matter")
    if response.status_code == 200:
        data = response.json()
        if data.get('slug') == 'why-native-bees-matter':
            checks = []
            checks.append(("Has 'id' field", 'id' in data))
            checks.append(("'id' is UUID", validate_uuid(data.get('id', ''))))
            checks.append(("No MongoDB _id", check_no_mongodb_id(data)))
            checks.append(("Has correct title", 'native bees' in data.get('title', '').lower()))
            
            all_passed = all(check[1] for check in checks)
            failed_checks = [check[0] for check in checks if not check[1]]
            
            if all_passed:
                log_test("GET /api/posts/why-native-bees-matter", True,
                        f"Retrieved post: {data.get('title')}")
            else:
                log_test("GET /api/posts/why-native-bees-matter", False,
                        f"Failed checks: {', '.join(failed_checks)}")
        else:
            log_test("GET /api/posts/why-native-bees-matter", False,
                    f"Wrong post returned: {data.get('slug')}")
    else:
        log_test("GET /api/posts/why-native-bees-matter", False,
                f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("GET /api/posts/why-native-bees-matter", False, f"Exception: {str(e)}")

# Test 7b: Another valid slug
try:
    response = requests.get(f"{BASE_URL}/posts/pollinator-garden-guide")
    if response.status_code == 200:
        data = response.json()
        if data.get('slug') == 'pollinator-garden-guide':
            log_test("GET /api/posts/pollinator-garden-guide", True,
                    f"Retrieved post: {data.get('title')}")
        else:
            log_test("GET /api/posts/pollinator-garden-guide", False,
                    f"Wrong post returned: {data.get('slug')}")
    else:
        log_test("GET /api/posts/pollinator-garden-guide", False,
                f"Expected 200, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("GET /api/posts/pollinator-garden-guide", False, f"Exception: {str(e)}")

# Test 7c: Unknown slug - should return 404
try:
    response = requests.get(f"{BASE_URL}/posts/unknown-slug-12345")
    if response.status_code == 404:
        log_test("GET /api/posts/unknown-slug returns 404", True,
                "Correctly returns 404 for non-existent slug")
    else:
        log_test("GET /api/posts/unknown-slug returns 404", False,
                f"Expected 404, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("GET /api/posts/unknown-slug", False, f"Exception: {str(e)}")

print()

# ============================================================================
# SUMMARY
# ============================================================================
print("=" * 80)
print("TEST SUMMARY")
print("=" * 80)
print(f"Total tests: {tests_passed + tests_failed}")
print(f"✅ Passed: {tests_passed}")
print(f"❌ Failed: {tests_failed}")
print()

if tests_failed > 0:
    print("FAILED TESTS:")
    print("-" * 80)
    for test in test_details:
        if not test['passed']:
            print(f"❌ {test['name']}")
            if test['details']:
                print(f"   {test['details']}")
    print()

# Exit with appropriate code
sys.exit(0 if tests_failed == 0 else 1)
