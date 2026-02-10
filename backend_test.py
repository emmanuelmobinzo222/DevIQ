#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for RideShare Application
Tests all endpoints with realistic South African data
"""

import requests
import json
import uuid
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

print(f"Testing backend at: {API_BASE}")

class RideShareAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.driver_token = None
        self.user_id = None
        self.driver_id = None
        self.ride_id = None
        self.booking_id = None
        
    def test_health_check(self):
        """Test GET /api/ endpoint"""
        print("\n=== Testing Health Check ===")
        try:
            response = self.session.get(f"{API_BASE}/")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "version" in data:
                    print("✅ Health check passed")
                    return True
                else:
                    print("❌ Health check failed - missing required fields")
                    return False
            else:
                print(f"❌ Health check failed - status code {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Health check failed - {str(e)}")
            return False
    
    def test_user_signup(self):
        """Test POST /api/auth/signup with complete user data"""
        print("\n=== Testing User Signup ===")
        
        # Test rider signup
        rider_data = {
            "name": "Thabo Mthembu",
            "email": f"thabo.mthembu.{uuid.uuid4().hex[:8]}@gmail.com",
            "password": "SecurePass123!",
            "phone": "+27 11 234 5678",
            "role": "rider",
            "cardNumber": "4532123456789012",
            "cardExpiry": "12/27",
            "cardCVV": "123",
            "idNumber": "8901015800087",
            "location": {
                "lat": -26.2041,
                "lng": 28.0473,
                "country": "South Africa",
                "city": "Johannesburg",
                "address": "Sandton City, Johannesburg"
            }
        }
        
        try:
            response = self.session.post(f"{API_BASE}/auth/signup", json=rider_data)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                data = response.json()
                if "user" in data and "token" in data:
                    self.auth_token = data["token"]
                    self.user_id = data["user"]["id"]
                    print("✅ User signup passed")
                    return True
                else:
                    print("❌ User signup failed - missing user or token")
                    return False
            else:
                print(f"❌ User signup failed - status code {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ User signup failed - {str(e)}")
            return False
    
    def test_driver_signup(self):
        """Test driver signup for ride creation tests"""
        print("\n=== Testing Driver Signup ===")
        
        driver_data = {
            "name": "Sipho Ndlovu",
            "email": f"sipho.ndlovu.{uuid.uuid4().hex[:8]}@gmail.com",
            "password": "DriverPass123!",
            "phone": "+27 12 345 6789",
            "role": "driver",
            "cardNumber": "5555444433332222",
            "cardExpiry": "06/28",
            "cardCVV": "456",
            "idNumber": "7805125800088",
            "location": {
                "lat": -26.2041,
                "lng": 28.0473,
                "country": "South Africa",
                "city": "Johannesburg",
                "address": "Rosebank, Johannesburg"
            }
        }
        
        try:
            response = self.session.post(f"{API_BASE}/auth/signup", json=driver_data)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                data = response.json()
                if "user" in data and "token" in data:
                    self.driver_token = data["token"]
                    self.driver_id = data["user"]["id"]
                    print("✅ Driver signup passed")
                    return True
                else:
                    print("❌ Driver signup failed - missing user or token")
                    return False
            else:
                print(f"❌ Driver signup failed - status code {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Driver signup failed - {str(e)}")
            return False
    
    def test_user_login(self):
        """Test POST /api/auth/login"""
        print("\n=== Testing User Login ===")
        
        # First create a user to login with
        signup_data = {
            "name": "Nomsa Khumalo",
            "email": f"nomsa.khumalo.{uuid.uuid4().hex[:8]}@gmail.com",
            "password": "LoginTest123!",
            "phone": "+27 21 456 7890",
            "role": "rider",
            "cardNumber": "4111111111111111",
            "cardExpiry": "03/29",
            "cardCVV": "789",
            "idNumber": "9203155800089"
        }
        
        try:
            # Create user first
            signup_response = self.session.post(f"{API_BASE}/auth/signup", json=signup_data)
            if signup_response.status_code != 200:
                print("❌ Failed to create user for login test")
                return False
            
            # Now test login
            login_data = {
                "email": signup_data["email"],
                "password": signup_data["password"]
            }
            
            response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                data = response.json()
                if "user" in data and "token" in data:
                    print("✅ User login passed")
                    return True
                else:
                    print("❌ User login failed - missing user or token")
                    return False
            else:
                print(f"❌ User login failed - status code {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ User login failed - {str(e)}")
            return False
    
    def test_get_me(self):
        """Test GET /api/auth/me with Bearer token"""
        print("\n=== Testing Get Current User ===")
        
        if not self.auth_token:
            print("❌ No auth token available for test")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = self.session.get(f"{API_BASE}/auth/me", headers=headers)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                data = response.json()
                if "user" in data:
                    print("✅ Get current user passed")
                    return True
                else:
                    print("❌ Get current user failed - missing user")
                    return False
            else:
                print(f"❌ Get current user failed - status code {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Get current user failed - {str(e)}")
            return False
    
    def test_create_ride(self):
        """Test POST /api/rides to create a ride (requires driver auth)"""
        print("\n=== Testing Create Ride ===")
        
        if not self.driver_token:
            print("❌ No driver token available for test")
            return False
        
        # Calculate departure time (2 hours from now)
        departure_time = (datetime.now() + timedelta(hours=2)).isoformat()
        
        ride_data = {
            "origin": {
                "lat": -26.2041,
                "lng": 28.0473,
                "address": "Sandton City Mall, Johannesburg"
            },
            "destination": {
                "lat": -26.1392,
                "lng": 28.2460,
                "address": "OR Tambo International Airport, Johannesburg"
            },
            "departureTime": departure_time,
            "rideType": "shared_3",
            "availableSeats": 3,
            "totalSeats": 4,
            "pricePerSeat": 150.0,
            "currency": "ZAR",
            "carModel": "Toyota Corolla",
            "carPlate": "CA 123 GP",
            "distance": "25 km",
            "duration": "35 min",
            "isSchoolRide": False
        }
        
        try:
            headers = {"Authorization": f"Bearer {self.driver_token}"}
            response = self.session.post(f"{API_BASE}/rides", json=ride_data, headers=headers)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data:
                    self.ride_id = data["id"]
                    print("✅ Create ride passed")
                    return True
                else:
                    print("❌ Create ride failed - missing ride id")
                    return False
            else:
                print(f"❌ Create ride failed - status code {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Create ride failed - {str(e)}")
            return False
    
    def test_get_rides(self):
        """Test GET /api/rides (list all rides)"""
        print("\n=== Testing Get All Rides ===")
        
        try:
            response = self.session.get(f"{API_BASE}/rides")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    print(f"✅ Get all rides passed - found {len(data)} rides")
                    return True
                else:
                    print("❌ Get all rides failed - response is not a list")
                    return False
            else:
                print(f"❌ Get all rides failed - status code {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Get all rides failed - {str(e)}")
            return False
    
    def test_get_rides_with_params(self):
        """Test GET /api/rides with query params"""
        print("\n=== Testing Get Rides with Query Parameters ===")
        
        try:
            params = {
                "origin": "Sandton",
                "destination": "Airport"
            }
            response = self.session.get(f"{API_BASE}/rides", params=params)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    print(f"✅ Get rides with params passed - found {len(data)} rides")
                    return True
                else:
                    print("❌ Get rides with params failed - response is not a list")
                    return False
            else:
                print(f"❌ Get rides with params failed - status code {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Get rides with params failed - {str(e)}")
            return False
    
    def test_get_specific_ride(self):
        """Test GET /api/rides/{ride_id}"""
        print("\n=== Testing Get Specific Ride ===")
        
        if not self.ride_id:
            print("❌ No ride ID available for test")
            return False
        
        try:
            response = self.session.get(f"{API_BASE}/rides/{self.ride_id}")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and data["id"] == self.ride_id:
                    print("✅ Get specific ride passed")
                    return True
                else:
                    print("❌ Get specific ride failed - incorrect ride data")
                    return False
            else:
                print(f"❌ Get specific ride failed - status code {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Get specific ride failed - {str(e)}")
            return False
    
    def test_book_ride(self):
        """Test POST /api/bookings/rides/{ride_id}/book"""
        print("\n=== Testing Book Ride ===")
        
        if not self.ride_id or not self.auth_token:
            print("❌ Missing ride ID or auth token for booking test")
            return False
        
        booking_data = {
            "seats": 2,
            "splitFare": True
        }
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = self.session.post(
                f"{API_BASE}/bookings/rides/{self.ride_id}/book", 
                json=booking_data, 
                headers=headers
            )
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "cost" in data:
                    self.booking_id = data["id"]
                    print("✅ Book ride passed")
                    return True
                else:
                    print("❌ Book ride failed - missing booking data")
                    return False
            else:
                print(f"❌ Book ride failed - status code {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Book ride failed - {str(e)}")
            return False
    
    def test_get_user_history(self):
        """Test GET /api/bookings/users/{user_id}/history"""
        print("\n=== Testing Get User History ===")
        
        if not self.user_id or not self.auth_token:
            print("❌ Missing user ID or auth token for history test")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = self.session.get(
                f"{API_BASE}/bookings/users/{self.user_id}/history", 
                headers=headers
            )
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    print(f"✅ Get user history passed - found {len(data)} bookings")
                    return True
                else:
                    print("❌ Get user history failed - response is not a list")
                    return False
            else:
                print(f"❌ Get user history failed - status code {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Get user history failed - {str(e)}")
            return False
    
    def test_get_user_profile(self):
        """Test GET /api/users/{user_id}"""
        print("\n=== Testing Get User Profile ===")
        
        if not self.user_id:
            print("❌ No user ID available for test")
            return False
        
        try:
            response = self.session.get(f"{API_BASE}/users/{self.user_id}")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and data["id"] == self.user_id:
                    print("✅ Get user profile passed")
                    return True
                else:
                    print("❌ Get user profile failed - incorrect user data")
                    return False
            else:
                print(f"❌ Get user profile failed - status code {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Get user profile failed - {str(e)}")
            return False
    
    def test_update_user_profile(self):
        """Test PUT /api/users/{user_id}"""
        print("\n=== Testing Update User Profile ===")
        
        if not self.user_id or not self.auth_token:
            print("❌ Missing user ID or auth token for update test")
            return False
        
        update_data = {
            "name": "Thabo Mthembu Updated",
            "phone": "+27 11 999 8888",
            "carModel": "BMW 3 Series",
            "carPlate": "BM 456 GP"
        }
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = self.session.put(
                f"{API_BASE}/users/{self.user_id}", 
                json=update_data, 
                headers=headers
            )
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                data = response.json()
                if "name" in data and data["name"] == update_data["name"]:
                    print("✅ Update user profile passed")
                    return True
                else:
                    print("❌ Update user profile failed - data not updated")
                    return False
            else:
                print(f"❌ Update user profile failed - status code {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Update user profile failed - {str(e)}")
            return False
    
    def test_error_handling(self):
        """Test various error scenarios"""
        print("\n=== Testing Error Handling ===")
        
        error_tests = []
        
        # Test invalid login
        try:
            invalid_login = {
                "email": "nonexistent@example.com",
                "password": "wrongpassword"
            }
            response = self.session.post(f"{API_BASE}/auth/login", json=invalid_login)
            if response.status_code == 401:
                error_tests.append("✅ Invalid login returns 401")
            else:
                error_tests.append(f"❌ Invalid login returned {response.status_code}")
        except Exception as e:
            error_tests.append(f"❌ Invalid login test failed - {str(e)}")
        
        # Test unauthorized access
        try:
            response = self.session.get(f"{API_BASE}/auth/me")
            if response.status_code == 401:
                error_tests.append("✅ Unauthorized access returns 401")
            else:
                error_tests.append(f"❌ Unauthorized access returned {response.status_code}")
        except Exception as e:
            error_tests.append(f"❌ Unauthorized access test failed - {str(e)}")
        
        # Test non-existent ride
        try:
            fake_ride_id = str(uuid.uuid4())
            response = self.session.get(f"{API_BASE}/rides/{fake_ride_id}")
            if response.status_code == 404:
                error_tests.append("✅ Non-existent ride returns 404")
            else:
                error_tests.append(f"❌ Non-existent ride returned {response.status_code}")
        except Exception as e:
            error_tests.append(f"❌ Non-existent ride test failed - {str(e)}")
        
        for test_result in error_tests:
            print(test_result)
        
        return all("✅" in test for test in error_tests)
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting RideShare Backend API Tests")
        print("=" * 50)
        
        test_results = []
        
        # Core functionality tests
        test_results.append(("Health Check", self.test_health_check()))
        test_results.append(("User Signup", self.test_user_signup()))
        test_results.append(("Driver Signup", self.test_driver_signup()))
        test_results.append(("User Login", self.test_user_login()))
        test_results.append(("Get Current User", self.test_get_me()))
        test_results.append(("Create Ride", self.test_create_ride()))
        test_results.append(("Get All Rides", self.test_get_rides()))
        test_results.append(("Get Rides with Params", self.test_get_rides_with_params()))
        test_results.append(("Get Specific Ride", self.test_get_specific_ride()))
        test_results.append(("Book Ride", self.test_book_ride()))
        test_results.append(("Get User History", self.test_get_user_history()))
        test_results.append(("Get User Profile", self.test_get_user_profile()))
        test_results.append(("Update User Profile", self.test_update_user_profile()))
        test_results.append(("Error Handling", self.test_error_handling()))
        
        # Print summary
        print("\n" + "=" * 50)
        print("🏁 TEST SUMMARY")
        print("=" * 50)
        
        passed = 0
        failed = 0
        
        for test_name, result in test_results:
            status = "✅ PASSED" if result else "❌ FAILED"
            print(f"{test_name}: {status}")
            if result:
                passed += 1
            else:
                failed += 1
        
        print(f"\nTotal Tests: {len(test_results)}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        print(f"Success Rate: {(passed/len(test_results)*100):.1f}%")
        
        if failed == 0:
            print("\n🎉 All tests passed! Backend API is working correctly.")
        else:
            print(f"\n⚠️  {failed} test(s) failed. Please check the backend implementation.")
        
        return failed == 0

if __name__ == "__main__":
    tester = RideShareAPITester()
    success = tester.run_all_tests()
    exit(0 if success else 1)