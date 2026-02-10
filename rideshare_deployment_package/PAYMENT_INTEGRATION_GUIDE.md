# RideShare Payment Integration Guide

## Overview
This guide covers integrating payment processing, automatic commission splits, and scheduled driver payouts.

---

## Payment Flow

```
Passenger Books Ride
    ↓
Charge Passenger Card (Full Amount)
    ↓
Split Payment:
- 40% → Creator Account (Mwenge Emmanuel Mobinzo)
- 60% → Driver Payout Queue
    ↓
Driver Payout (Every Tuesday)
    ↓
Transfer to Driver Bank Account
```

---

## Option 1: Stripe (Global)

### Setup

1. **Create Stripe Account**
   - Go to https://stripe.com
   - Sign up for business account
   - Complete verification

2. **Get API Keys**
   - Dashboard → Developers → API Keys
   - Copy:
     - Publishable key (for frontend)
     - Secret key (for backend)

3. **Install Dependencies**

```bash
# Backend
pip install stripe

# Frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### Backend Implementation

```python
# backend/stripe_service.py
import stripe
import os
from datetime import datetime, timedelta

stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

CREATOR_ACCOUNT_ID = "acct_XXXXXXXXXXXX"  # Get from Stripe Connect

async def charge_passenger(amount, currency, customer_id, ride_id):
    """
    Charge passenger's card
    """
    try:
        # Create payment intent
        payment_intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),  # Convert to cents
            currency=currency.lower(),
            customer=customer_id,
            description=f"RideShare - Ride #{ride_id}",
            metadata={
                'ride_id': ride_id,
                'commission_rate': '0.40'
            },
            transfer_group=ride_id,
        )
        
        return payment_intent
        
    except stripe.error.CardError as e:
        raise Exception(f"Card error: {e.user_message}")
    except Exception as e:
        raise Exception(f"Payment failed: {str(e)}")

async def split_payment(payment_intent_id, driver_account_id, ride_id):
    """
    Split payment: 40% to creator, 60% to driver
    """
    payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
    total_amount = payment_intent.amount
    
    # Calculate splits
    creator_amount = int(total_amount * 0.40)
    driver_amount = int(total_amount * 0.60)
    
    # Transfer to creator (immediate)
    creator_transfer = stripe.Transfer.create(
        amount=creator_amount,
        currency=payment_intent.currency,
        destination=CREATOR_ACCOUNT_ID,
        transfer_group=ride_id,
        description=f"Commission for ride #{ride_id}"
    )
    
    # Schedule transfer to driver (for next Tuesday)
    next_tuesday = get_next_tuesday()
    driver_transfer = stripe.Transfer.create(
        amount=driver_amount,
        currency=payment_intent.currency,
        destination=driver_account_id,
        transfer_group=ride_id,
        description=f"Payout for ride #{ride_id}",
        metadata={
            'scheduled_for': next_tuesday.isoformat(),
            'payout_date': 'Tuesday'
        }
    )
    
    return {
        'creator_transfer': creator_transfer,
        'driver_transfer': driver_transfer
    }

def get_next_tuesday():
    today = datetime.now()
    days_until_tuesday = (1 - today.weekday()) % 7
    if days_until_tuesday == 0:
        days_until_tuesday = 7
    next_tuesday = today + timedelta(days=days_until_tuesday)
    return next_tuesday

async def create_customer(email, card_token):
    """
    Create Stripe customer
    """
    customer = stripe.Customer.create(
        email=email,
        source=card_token,
        description="RideShare User"
    )
    return customer.id

async def add_bank_account(driver_id, bank_account_data):
    """
    Add driver's bank account for payouts
    """
    # Create Connect account for driver
    account = stripe.Account.create(
        type="express",
        country=bank_account_data['country_code'],
        email=bank_account_data['email'],
        capabilities={
            "transfers": {"requested": True},
        },
        business_type="individual",
        individual={
            "email": bank_account_data['email'],
            "phone": bank_account_data['phone'],
        },
        external_account={
            "object": "bank_account",
            "country": bank_account_data['country_code'],
            "currency": bank_account_data['currency'],
            "account_number": bank_account_data['account_number'],
            "routing_number": bank_account_data['routing_number'],
        }
    )
    
    return account.id
```

### Frontend Implementation

```javascript
// src/services/stripe.js
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export const createPaymentMethod = async (cardElement) => {
  const stripe = await stripePromise;
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return paymentMethod;
};

export const confirmPayment = async (clientSecret) => {
  const stripe = await stripePromise;
  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return paymentIntent;
};
```

### Environment Variables

```bash
# Backend .env
STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXX
STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXX
CREATOR_STRIPE_ACCOUNT_ID=acct_XXXXXXXXXXXX

# Frontend .env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXX
```

---

## Option 2: PayStack (Africa - Recommended for South Africa)

### Setup

1. **Create PayStack Account**
   - Go to https://paystack.com
   - Sign up for business account
   - Complete verification with company/personal details

2. **Get API Keys**
   - Dashboard → Settings → API Keys & Webhooks
   - Copy:
     - Public key (for frontend)
     - Secret key (for backend)

3. **Install Dependencies**

```bash
# Backend
pip install paystackapi

# Frontend
npm install react-paystack
```

### Backend Implementation

```python
# backend/paystack_service.py
from paystackapi.paystack import Paystack
from paystackapi.transaction import Transaction
from paystackapi.transfer import Transfer
from paystackapi.transferrecipient import TransferRecipient
import os

paystack = Paystack(secret_key=os.environ.get('PAYSTACK_SECRET_KEY'))

# Creator's bank details
CREATOR_BANK = {
    'account_number': '19195042437',
    'bank_code': '057',  # Discovery Bank code
    'account_name': 'Mwenge Emmanuel Mobinzo',
    'currency': 'ZAR'
}

async def initialize_transaction(email, amount, ride_id):
    """
    Initialize payment transaction
    """
    response = Transaction.initialize(
        email=email,
        amount=int(amount * 100),  # Convert to cents
        currency='ZAR',
        reference=f"ride_{ride_id}_{int(datetime.now().timestamp())}",
        callback_url=f"{os.environ.get('FRONTEND_URL')}/payment/callback",
        metadata={
            'ride_id': ride_id,
            'commission_rate': 0.40
        }
    )
    return response

async def verify_transaction(reference):
    """
    Verify payment was successful
    """
    response = Transaction.verify(reference=reference)
    return response

async def create_transfer_recipient(bank_account):
    """
    Create transfer recipient (driver or creator)
    """
    response = TransferRecipient.create(
        type="nuban",
        name=bank_account['account_name'],
        account_number=bank_account['account_number'],
        bank_code=bank_account['bank_code'],
        currency=bank_account.get('currency', 'ZAR')
    )
    return response['data']['recipient_code']

async def split_and_transfer(amount, ride_id, driver_recipient_code):
    """
    Split payment and transfer
    """
    # Calculate splits
    creator_amount = int(amount * 0.40)
    driver_amount = int(amount * 0.60)
    
    # Get or create creator recipient
    creator_recipient = await create_transfer_recipient(CREATOR_BANK)
    
    # Transfer to creator (immediate)
    creator_transfer = Transfer.initiate(
        source="balance",
        amount=creator_amount,
        recipient=creator_recipient,
        reason=f"Commission for ride #{ride_id}"
    )
    
    # Schedule driver payout (store in database for Tuesday processing)
    driver_payout = {
        'recipient_code': driver_recipient_code,
        'amount': driver_amount,
        'ride_id': ride_id,
        'scheduled_for': 'next_tuesday',
        'status': 'scheduled'
    }
    
    # Save to database
    await db.scheduled_payouts.insert_one(driver_payout)
    
    return {
        'creator_transfer': creator_transfer,
        'driver_payout_scheduled': driver_payout
    }

async def process_tuesday_payouts():
    """
    Process all scheduled payouts (run this every Tuesday via cron)
    """
    # Get all scheduled payouts
    payouts = await db.scheduled_payouts.find({
        'status': 'scheduled'
    }).to_list(1000)
    
    results = []
    for payout in payouts:
        try:
            # Process transfer
            transfer = Transfer.initiate(
                source="balance",
                amount=payout['amount'],
                recipient=payout['recipient_code'],
                reason=f"Weekly payout for ride #{payout['ride_id']}"
            )
            
            # Update status
            await db.scheduled_payouts.update_one(
                {'_id': payout['_id']},
                {'$set': {'status': 'completed', 'processed_at': datetime.utcnow()}}
            )
            
            results.append({
                'payout_id': payout['_id'],
                'status': 'success',
                'transfer': transfer
            })
            
        except Exception as e:
            results.append({
                'payout_id': payout['_id'],
                'status': 'failed',
                'error': str(e)
            })
    
    return results
```

### Frontend Implementation

```javascript
// src/services/paystack.js
import { PaystackButton } from 'react-paystack';

export const PaystackPayment = ({ amount, email, onSuccess, onClose }) => {
  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: amount * 100, // in kobo
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
    currency: 'ZAR',
  };

  return (
    <PaystackButton
      {...config}
      text="Pay Now"
      onSuccess={onSuccess}
      onClose={onClose}
      className="paystack-button"
    />
  );
};
```

### Cron Job for Tuesday Payouts

```python
# backend/cron_jobs.py
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from paystack_service import process_tuesday_payouts

scheduler = AsyncIOScheduler()

# Run every Tuesday at 9:00 AM
scheduler.add_job(
    process_tuesday_payouts,
    'cron',
    day_of_week='tue',
    hour=9,
    minute=0
)

scheduler.start()
```

---

## Option 3: Flutterwave (Africa)

### Similar to PayStack but supports more African countries

```bash
pip install flutterwave-python
npm install flutterwave-react-v3
```

Implementation is very similar to PayStack.

---

## Bank Account Verification

### For South African Banks

```python
# backend/bank_verification.py
import requests

def verify_south_african_bank_account(account_number, bank_code):
    """
    Verify bank account details
    Using BankServ or similar service
    """
    # This is a mock - integrate with actual service
    valid_banks = {
        '057': 'Discovery Bank',
        '051': 'Standard Bank',
        '050': 'Investec',
        '198': 'Capitec',
        '632': 'Nedbank',
        '250': 'First National Bank (FNB)',
        '470': 'Absa',
    }
    
    if bank_code in valid_banks:
        return {
            'valid': True,
            'bank_name': valid_banks[bank_code],
            'account_number': account_number
        }
    
    return {'valid': False}
```

---

## Security Best Practices

### 1. Never Store Full Card Numbers
```python
def hash_card_number(card_number):
    return f"****-****-****-{card_number[-4:]}"
```

### 2. Use HTTPS Only
```python
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
app.add_middleware(HTTPSRedirectMiddleware)
```

### 3. Encrypt Sensitive Data
```python
from cryptography.fernet import Fernet

key = os.environ.get('ENCRYPTION_KEY')
cipher = Fernet(key)

def encrypt_data(data):
    return cipher.encrypt(data.encode())

def decrypt_data(encrypted_data):
    return cipher.decrypt(encrypted_data).decode()
```

### 4. PCI DSS Compliance
- Use payment gateway's tokenization
- Never log card details
- Use secure connections only
- Regular security audits

---

## Testing

### Stripe Test Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
```

### PayStack Test Cards
```
Success: 5060 6666 6666 6666 604
Pin: 1234
OTP: 123456
```

---

## Monitoring & Analytics

### Track Payment Metrics
```python
async def log_payment_event(event_type, amount, ride_id, status):
    await db.payment_logs.insert_one({
        'event_type': event_type,
        'amount': amount,
        'ride_id': ride_id,
        'status': status,
        'timestamp': datetime.utcnow()
    })
```

### Key Metrics to Monitor
- Total transactions
- Success rate
- Failed payments
- Commission collected
- Driver payouts processed
- Average transaction value

---

## Compliance

### South African Requirements
- Register with South African Reserve Bank (SARB)
- Comply with FICA (Financial Intelligence Centre Act)
- Implement KYC (Know Your Customer)
- AML (Anti-Money Laundering) procedures

### International
- PCI DSS Level 1 compliance
- GDPR (if EU users)
- Data Protection Act

---

## Support

For payment issues:
- Stripe Support: https://support.stripe.com
- PayStack Support: https://support.paystack.com
- Technical issues: payments@rideshare.app

---

## Cost Structure

### Stripe
- International cards: 3.4% + R2.00
- South African cards: 2.9% + R2.00

### PayStack
- Local cards: 1.5% (capped at R2,000)
- International cards: 3.9%

### Recommended: PayStack for South African market
