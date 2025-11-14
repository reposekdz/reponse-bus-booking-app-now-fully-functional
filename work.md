# GoBus: The Future of Rwandan Transport

## 1. Vision & Problem Solved

**Vision:** To create a sleek, modern, and highly intuitive bus booking platform that revolutionizes travel across Rwanda. GoBus aims to provide a seamless, premium, and unified digital experience for passengers, bus companies, drivers, and agents.

**Problem Solved:** GoBus addresses the fragmented and often inefficient nature of traditional bus travel by:
- **Centralizing Booking:** Eliminating the need to visit physical ticket offices or contact multiple companies.
- **Providing Transparency:** Offering clear, comparable information on routes, prices, schedules, and amenities.
- **Enhancing Convenience:** Enabling 24/7 booking, secure digital payments, and instant e-ticket generation.
- **Improving Operations:** Giving bus companies, drivers, and agents powerful digital tools to manage their services, track performance, and increase efficiency.
- **Building Trust:** Creating a reliable, safe, and modern ecosystem that elevates the standard of public transportation.

---

## 2. Core Features & Capabilities

GoBus is a multi-faceted platform with tailored features for each user role, all connected in a real-time ecosystem.

### Key Platform-Wide Features
- **AI-Powered Trip Planner:** Users can describe their travel plans in natural language (e.g., "a weekend trip to see the gorillas"), and the AI will suggest structured routes.
- **Multi-Language Support:** Full localization for Kinyarwanda, English, and French.
- **Real-Time Notifications:** Push notifications for booking confirmations, trip delays, promotions, and wallet transactions, powered by WebSockets and Push API.
- **Secure & Flexible Payments:** Integrated payment system supporting Mobile Money (MoMo), an internal secure **GoBus Wallet**, and credit/debit cards.
- **Personalization:** Users can save favorite trips and set up price drop alerts for specific routes.

---

## 3. Role-Based Functionality

### For Passengers
- **Seamless Booking Flow:** Search, select seats on an interactive map, and pay securely within minutes.
- **Digital Wallet:** Top-up funds, make payments, and securely send money to other users via their unique serial code, protected by a PIN.
- **GoPoints Loyalty Program:** Earn points on every trip and redeem them for discounts and rewards.
- **Comprehensive Profile Management:** Manage bookings, view e-tickets with QR codes, track wallet history, and edit personal details.

### For Drivers
- **Trip Dashboard:** View assigned daily trips, departure times, and bus details.
- **Digital Manifest:** Access a live passenger list for each trip.
- **QR Code Boarding Verification:** Securely scan passenger e-tickets to confirm boarding, with real-time updates to the manifest.
- **Live Location Tracking:** The app automatically transmits the bus's location to the company's fleet monitoring dashboard when a trip is active.

### For Agents
- **Secure Deposit System:** Assist passengers without smartphones by looking them up via their unique serial code and accepting cash deposits directly into their GoBus Wallet.
- **Offline Transaction Queuing:** If the network is down, deposit transactions are securely saved locally and automatically synced with the server once connectivity is restored.
- **Performance Dashboard:** Track total deposits, commissions earned, and transaction volume.

### For Company Managers
- **Fleet Management:** Full CRUD (Create, Read, Update, Delete) capabilities to manage the company's fleet of buses, including details on model, capacity, and amenities.
- **Driver Management:** Add, edit, and manage driver profiles associated with the company.
- **Route & Schedule Management:** Define new routes, set base prices, and manage trip schedules.
- **Live Fleet Monitoring:** A real-time map dashboard showing the exact location of all active buses.
- **Financial Analytics:** A comprehensive dashboard to track revenue, passenger volume, and performance by route.

### For Platform Admins
- **Complete Oversight:** A master dashboard with platform-wide analytics on revenue, user growth, and system health.
- **User & Company Management:** The ability to manage all users, companies, drivers, and agents on the platform.
- **Financial Control:** View platform-wide financial transactions, payouts, and commissions.
- **Content Management:** Manage site-wide content, such as the home page hero image and featured travel destinations.
- **Communication Tools:** Send platform-wide announcements targeted to specific user roles (e.g., all drivers).
