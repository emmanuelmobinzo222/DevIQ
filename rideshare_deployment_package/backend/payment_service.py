from datetime import datetime
from typing import Dict, List
import uuid

# Creator's bank account details
CREATOR_ACCOUNT = {
    "accountHolder": "Mwenge Emmanuel Mobinzo",
    "accountNumber": "19195042437",
    "bankName": "Discovery Bank",
    "branchCode": "679000",
    "swiftCode": "DISCZAJJXXX",
    "accountType": "Savings Account"
}

COMMISSION_RATE = 0.40  # 40% to creator
DRIVER_RATE = 0.60      # 60% to driver

# Currency exchange rates (base: ZAR - South African Rand)
EXCHANGE_RATES = {
    'ZAR': 1.0,      # South African Rand
    'USD': 0.054,    # US Dollar
    'EUR': 0.049,    # Euro
    'GBP': 0.042,    # British Pound
    'NGN': 44.5,     # Nigerian Naira
    'KES': 6.9,      # Kenyan Shilling
    'GHS': 0.82,     # Ghanaian Cedi
    'TZS': 142.0,    # Tanzanian Shilling
    'UGX': 200.0,    # Ugandan Shilling
    'ZMW': 1.45,     # Zambian Kwacha
    'BWP': 0.73,     # Botswana Pula
    'NAD': 1.0,      # Namibian Dollar
}

# Country to currency mapping
COUNTRY_CURRENCY = {
    'South Africa': 'ZAR',
    'Nigeria': 'NGN',
    'Kenya': 'KES',
    'Ghana': 'GHS',
    'Tanzania': 'TZS',
    'Uganda': 'UGX',
    'Zambia': 'ZMW',
    'Botswana': 'BWP',
    'Namibia': 'NAD',
    'United States': 'USD',
    'United Kingdom': 'GBP',
    'France': 'EUR',
    'Germany': 'EUR',
    'Spain': 'EUR',
}

def get_currency_for_country(country: str) -> str:
    """Get the currency for a given country"""
    return COUNTRY_CURRENCY.get(country, 'ZAR')

def convert_currency(amount: float, from_currency: str, to_currency: str) -> float:
    """Convert amount from one currency to another"""
    if from_currency == to_currency:
        return amount
    
    # Convert to ZAR first, then to target currency
    zar_amount = amount / EXCHANGE_RATES.get(from_currency, 1.0)
    target_amount = zar_amount * EXCHANGE_RATES.get(to_currency, 1.0)
    
    return round(target_amount, 2)

async def calculate_fare_split(total_fare: float, num_passengers: int, currency: str = 'ZAR') -> Dict:
    """Calculate how fare is split among passengers"""
    cost_per_passenger = total_fare / num_passengers
    
    return {
        'totalFare': total_fare,
        'numPassengers': num_passengers,
        'costPerPassenger': round(cost_per_passenger, 2),
        'currency': currency
    }

async def process_payment(
    booking_id: str,
    rider_id: str,
    driver_id: str,
    amount: float,
    currency: str,
    card_number: str
) -> Dict:
    """
    Process payment from rider's card
    This is a mock implementation. In production, integrate with:
    - Stripe
    - PayStack (for Africa)
    - Flutterwave (for Africa)
    - PayPal
    """
    payment_id = str(uuid.uuid4())
    
    # Mock payment processing
    payment_record = {
        'paymentId': payment_id,
        'bookingId': booking_id,
        'riderId': rider_id,
        'driverId': driver_id,
        'amount': amount,
        'currency': currency,
        'status': 'completed',
        'cardLast4': card_number[-4:],
        'processedAt': datetime.utcnow(),
        'splits': await calculate_payment_splits(amount, currency)
    }
    
    return payment_record

async def calculate_payment_splits(amount: float, currency: str) -> Dict:
    """Calculate how payment is split between creator and driver"""
    creator_amount = round(amount * COMMISSION_RATE, 2)
    driver_amount = round(amount * DRIVER_RATE, 2)
    
    return {
        'creatorAmount': creator_amount,
        'driverAmount': driver_amount,
        'currency': currency,
        'creatorAccount': CREATOR_ACCOUNT
    }

async def schedule_driver_payout(driver_id: str, amount: float, currency: str, bank_account: Dict):
    """
    Schedule driver payout for next Tuesday
    This is a mock implementation. In production:
    - Use Stripe Connect or similar
    - Schedule via cron job or task queue
    - Verify bank account before payout
    """
    payout_id = str(uuid.uuid4())
    
    payout_record = {
        'payoutId': payout_id,
        'driverId': driver_id,
        'amount': amount,
        'currency': currency,
        'bankAccount': bank_account,
        'scheduledFor': 'Next Tuesday',
        'status': 'scheduled',
        'createdAt': datetime.utcnow()
    }
    
    return payout_record

async def verify_bank_account(bank_account: Dict) -> bool:
    """
    Verify bank account details
    In production, use bank verification APIs
    """
    required_fields = ['accountHolder', 'accountNumber', 'bankName', 'branchCode']
    return all(field in bank_account for field in required_fields)

def get_ride_type_pricing(ride_type: str, base_price: float) -> float:
    """
    Calculate pricing based on ride type
    """
    pricing_multipliers = {
        'school_kids': 0.8,      # 20% discount for school kids
        'private_1': 1.0,        # Full price for private ride
        'shared_2': 0.75,        # 25% discount per person when sharing
        'shared_3': 0.60,        # 40% discount per person
        'shared_4': 0.50,        # 50% discount per person
        'shared_5plus': 0.40,    # 60% discount per person
        'split_cost': 0.50,      # Split equally
    }
    
    multiplier = pricing_multipliers.get(ride_type, 1.0)
    return round(base_price * multiplier, 2)
