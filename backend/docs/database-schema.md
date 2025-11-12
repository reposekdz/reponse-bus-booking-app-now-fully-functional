# GoBus Database Schema (MongoDB/Mongoose)

This document outlines the data models for the GoBus application.

---

## 1. `User`

Stores information about all individuals registered on the platform, including passengers, drivers, agents, company managers, and admins.

```javascript
{
  _id: ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  phone: { type: String },
  role: {
    type: String,
    enum: ['passenger', 'driver', 'agent', 'company', 'admin'],
    default: 'passenger',
  },
  avatarUrl: { type: String },
  status: { 
    type: String, 
    enum: ['Active', 'Suspended', 'Pending'], 
    default: 'Active' 
  },
  // Passenger-specific
  walletBalance: { type: Number, default: 0 },
  loyaltyPoints: { type: Number, default: 0 },
  // Driver/Agent/Company-specific
  company: { type: ObjectId, ref: 'Company', required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

---

## 2. `Company`

Represents a bus operator partner on the platform.

```javascript
{
  _id: ObjectId,
  name: { type: String, required: true, unique: true },
  description: { type: String },
  logoUrl: { type: String },
  coverUrl: { type: String },
  contact: {
    email: String,
    phone: String,
    address: String,
  },
  owner: { type: ObjectId, ref: 'User' }, // The 'company' role user
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Suspended'],
    default: 'Pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

---

## 3. `Bus`

Represents a single vehicle in a company's fleet.

```javascript
{
  _id: ObjectId,
  company: { type: ObjectId, ref: 'Company', required: true },
  plateNumber: { type: String, required: true, unique: true },
  model: { type: String },
  capacity: { type: Number, required: true },
  amenities: [{ type: String, enum: ['WiFi', 'AC', 'Charging', 'TV'] }],
  status: {
    type: String,
    enum: ['Operational', 'Maintenance', 'On Route'],
    default: 'Operational',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

---

## 4. `Route`

Defines a travel path between two locations operated by a company.

```javascript
{
  _id: ObjectId,
  company: { type: ObjectId, ref: 'Company', required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  basePrice: { type: Number, required: true },
  estimatedDurationMinutes: { type: Number, required: true }, // in minutes
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

---

## 5. `Trip` (Schedule)

Represents a specific, scheduled journey on a `Route`. This is what users search for and book.

```javascript
{
  _id: ObjectId,
  route: { type: ObjectId, ref: 'Route', required: true },
  bus: { type: ObjectId, ref: 'Bus', required: true },
  driver: { type: ObjectId, ref: 'User', required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true }, // Calculated on creation
  status: {
    type: String,
    enum: ['Scheduled', 'Departed', 'Arrived', 'Cancelled'],
    default: 'Scheduled',
  },
  // A map of seat IDs to their status for this specific trip
  seatMap: { type: Map, of: String, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

---

## 6. `Booking`

A record of a passenger's confirmed booking on a specific `Trip`.

```javascript
{
  _id: ObjectId,
  passenger: { type: ObjectId, ref: 'User', required: true },
  trip: { type: ObjectId, ref: 'Trip', required: true },
  seats: [{ type: String, required: true }], // e.g., ['A5', 'A6']
  totalPrice: { type: Number, required: true },
  payment: {
    method: { type: String, enum: ['Wallet', 'MoMo', 'Card'] },
    transactionId: String,
    status: { type: String, enum: ['Paid', 'Pending'], default: 'Paid' }
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'Completed'],
    default: 'Confirmed'
  },
  bookingId: { type: String, unique: true }, // User-facing ID, e.g., GB-XYZ123
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```
