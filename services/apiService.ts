// services/apiService.ts - MOCK BACKEND

// This file simulates a complete backend and database to fulfill the user's request
// for a new architecture without an actual backend deployment.

// --- MOCK DATABASE ---
let mockUsers = [
    { _id: 'user1', name: 'Kalisa Jean', email: 'passenger@gobus.rw', password: 'password', role: 'passenger', walletBalance: 50000, loyaltyPoints: 1250, avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg', coverUrl: 'https://images.unsplash.com/photo/1619534103142-93b3f276c120?q=80&w=2070&auto=format&fit=crop', pin: '1234' },
    { _id: 'user2', name: 'Volcano Manager', email: 'company@gobus.rw', password: 'password', role: 'company', companyId: 'comp1', avatarUrl: 'https://pbs.twimg.com/profile_images/1237839357116452865/p-28c8o-_400x400.jpg', coverUrl: 'https://images.unsplash.com/photo/1544620347-c4fd4a3d5957?q=80&w=2048&auto=format&fit=crop', pin: '1234' },
    { _id: 'user3', name: 'John Doe', email: 'driver1@gobus.rw', password: 'password', role: 'driver', companyId: 'comp1', avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg', coverUrl: 'https://images.unsplash.com/photo/1533104816-588941750c11?q=80&w=1974&auto=format&fit=crop', pin: '1234' },
    { _id: 'user4', name: 'Admin Reponse', email: 'reponse@gmail.com', password: '2025', role: 'admin', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg', coverUrl: 'https://images.unsplash.com/photo/1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop', pin: '1234' },
    { _id: 'user5', name: 'RITCO Manager', email: 'company2@gobus.rw', password: 'password', role: 'company', companyId: 'comp2' },
    { _id: 'user6', name: 'Mary Anne', email: 'driver2@gobus.rw', password: 'password', role: 'driver', companyId: 'comp2' },
];

let mockCompanies = [
    { _id: 'comp1', name: 'Volcano Express', owner: 'user2', status: 'Active', logoUrl: 'https://pbs.twimg.com/profile_images/1237839357116452865/p-28c8o-_400x400.jpg' },
    { _id: 'comp2', name: 'RITCO', owner: 'user5', status: 'Active', logoUrl: 'https://www.ritco.rw/wp-content/uploads/2021/04/ritco-logo.jpg' },
];

let mockBuses = [
    { _id: 'bus1', companyId: 'comp1', plateNumber: 'RAD 123 B', model: 'Yutong Explorer', capacity: 55, amenities: ['AC', 'Charging'] },
    { _id: 'bus2', companyId: 'comp2', plateNumber: 'RAE 456 C', model: 'Scania Marcopolo', capacity: 65, amenities: ['AC', 'WiFi', 'TV'] },
];

let mockRoutes = [
    { _id: 'route1', companyId: 'comp1', from: 'Kigali', to: 'Rubavu', basePrice: 4500, estimatedDurationMinutes: 210 },
    { _id: 'route2', companyId: 'comp2', from: 'Kigali', to: 'Huye', basePrice: 3000, estimatedDurationMinutes: 150 },
    { _id: 'route3', companyId: 'comp1', from: 'Kigali', to: 'Musanze', basePrice: 3500, estimatedDurationMinutes: 120 },
];

const generateSeatMap = (capacity) => {
    const seatMap = {};
    const rows = Math.ceil(capacity / 4);
    const seats = ['A', 'B', 'C', 'D'];
    for (let i = 1; i <= rows; i++) {
        for (let j = 0; j < 4; j++) {
            if ((i - 1) * 4 + j < capacity) {
                const seatId = `${i}${seats[j]}`;
                seatMap[seatId] = Math.random() > 0.8 ? 'occupied' : 'available';
            }
        }
    }
    return seatMap;
};

const today = new Date(); today.setHours(0,0,0,0);
let mockTrips = [
    { _id: 'trip1', routeId: 'route1', busId: 'bus1', driverId: 'user3', departureTime: new Date(new Date(today).setHours(7, 0)).toISOString(), arrivalTime: new Date(new Date(today).setHours(10, 30)).toISOString(), seatMap: generateSeatMap(55), status: 'Scheduled' },
    { _id: 'trip2', routeId: 'route2', busId: 'bus2', driverId: 'user6', departureTime: new Date(new Date(today).setHours(8, 30)).toISOString(), arrivalTime: new Date(new Date(today).setHours(11, 0)).toISOString(), seatMap: generateSeatMap(65), status: 'Scheduled' },
    { _id: 'trip3', routeId: 'route1', busId: 'bus1', driverId: 'user3', departureTime: new Date(new Date(today).setHours(11, 0)).toISOString(), arrivalTime: new Date(new Date(today).setHours(14, 30)).toISOString(), seatMap: generateSeatMap(55), status: 'Scheduled' },
];

let mockBookings = [];
let mockWalletTransactions = [
    {
        _id: `tx-1`,
        user: 'user1',
        type: 'top-up',
        amount: 20000,
        description: 'Mobile Money Top-up',
        createdAt: new Date(new Date().setDate(today.getDate() - 5)).toISOString(),
        hash: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`
    },
    {
        _id: `tx-2`,
        user: 'user1',
        type: 'purchase',
        amount: -4500,
        description: 'Ticket: Kigali to Rubavu',
        createdAt: new Date(new Date().setDate(today.getDate() - 4)).toISOString(),
        hash: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`
    }
];

// --- API SIMULATION ---
const simulateLatency = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

let authToken = null;
const activeTokens = {};

export const setAuthToken = (token) => {
    authToken = token;
};

const verifyToken = (token) => {
    return activeTokens[token]; // Returns userId if valid
}

// --- AUTH ---
export const login = async (credentials) => {
    await simulateLatency(500);
    const { email, password } = credentials;
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!user) {
        throw new Error('Invalid credentials');
    }
    
    const token = `token-${user._id}-${Date.now()}`;
    activeTokens[token] = user._id;

    // Deep copy user and remove password
    const userData = JSON.parse(JSON.stringify(user));
    delete userData.password;

    return { token, data: userData };
};

export const register = async (userData) => {
    await simulateLatency(500);
    const { name, email, password, phone } = userData;
    if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('An account with this email already exists.');
    }
    const newUser = {
        _id: `user-${Date.now()}`,
        name,
        email,
        password,
        phone,
        role: 'passenger',
        walletBalance: 0,
        loyaltyPoints: 500, // Welcome bonus
        avatarUrl: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`,
// FIX: Added missing coverUrl property to match the inferred type of mockUsers.
        coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop',
        pin: '1234', // Default PIN
    };
    mockUsers.push(newUser as any);
    
    const token = `token-${newUser._id}-${Date.now()}`;
    activeTokens[token] = newUser._id;
    
    const newUserResponse = { ...newUser };
    delete newUserResponse.password;

    return { token, data: newUserResponse };
};


export const getCurrentUser = async () => {
    await simulateLatency();
    const userId = verifyToken(authToken);
    if (!userId) throw new Error("Invalid token");

    const user = mockUsers.find(u => u._id === userId);
    if (!user) throw new Error("User not found");
    
    const userData = JSON.parse(JSON.stringify(user));
    delete userData.password;
    return userData;
};

// --- TRIPS ---
export const searchTrips = async (from, to, date) => {
    await simulateLatency();
    const matchingRouteIds = mockRoutes.filter(r => r.from === from && r.to === to).map(r => r._id);
    const trips = mockTrips.filter(t => matchingRouteIds.includes(t.routeId));
    
    // Simulate populating data
    return trips.map(trip => {
        const route = mockRoutes.find(r => r._id === trip.routeId);
        const company = mockCompanies.find(c => c._id === route.companyId);
        const bus = mockBuses.find(b => b._id === trip.busId);
        const driver = mockUsers.find(u => u._id === trip.driverId);
        return {
            ...trip,
            route: { ...route, company },
            bus,
            driver,
        }
    });
};

export const getTripDetails = async (tripId) => {
    await simulateLatency();
    const trip = mockTrips.find(t => t._id === tripId);
    if (!trip) throw new Error("Trip not found");

    const route = mockRoutes.find(r => r._id === trip.routeId);
    const company = mockCompanies.find(c => c._id === route.companyId);
    const bus = mockBuses.find(b => b._id === trip.busId);
    
    return { ...trip, route: { ...route, company }, bus };
}

// --- BOOKINGS ---
export const createBooking = async (bookingData) => {
    await simulateLatency(800);
    const userId = verifyToken(authToken);
    if (!userId) throw new Error("Not authorized");
    
    const trip = mockTrips.find(t => t._id === bookingData.tripId);
    if (!trip) throw new Error("Trip not found");
    
    const route = mockRoutes.find(r => r._id === trip.routeId);
    const passenger = mockUsers.find(u => u._id === userId);

    // Check seat availability
    for (const seat of bookingData.seats) {
        if (trip.seatMap[seat] !== 'available') {
            throw new Error(`Seat ${seat} is no longer available.`);
        }
    }
    
    if (bookingData.paymentMethod === 'Wallet') {
        if (passenger.walletBalance < bookingData.totalPrice) {
            throw new Error('Insufficient wallet balance');
        }
        passenger.walletBalance -= bookingData.totalPrice;
        
        // Add transaction log
        mockWalletTransactions.push({
            _id: `tx-${Date.now()}`,
            user: userId,
            type: 'purchase',
            amount: -bookingData.totalPrice,
            description: `Ticket: ${route.from} to ${route.to}`,
            createdAt: new Date().toISOString(),
            hash: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`
        });
    }

    // Update seat map
    bookingData.seats.forEach(seat => {
        trip.seatMap[seat] = 'occupied';
    });

    const newBooking = {
        _id: `booking-${Date.now()}`,
        passenger: userId,
        trip: bookingData.tripId,
        seats: bookingData.seats,
        totalPrice: bookingData.totalPrice,
        status: 'Confirmed',
        bookingId: `GB-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
    };
    mockBookings.push(newBooking);
    return newBooking;
};

export const getMyBookings = async () => {
    await simulateLatency();
    const userId = verifyToken(authToken);
    if (!userId) throw new Error("Not authorized");

    const userBookings = mockBookings.filter(b => b.passenger === userId);
    
    // Populate data
    return userBookings.map(booking => {
        const trip = mockTrips.find(t => t._id === booking.trip);
        const route = mockRoutes.find(r => r._id === trip.routeId);
        const company = mockCompanies.find(c => c._id === route.companyId);
        return {
            ...booking,
            trip: { ...trip, route: { ...route, company } }
        };
    }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// --- COMPANIES ---
export const getCompanies = async () => {
    await simulateLatency();
    return mockCompanies.map(c => {
        const owner = mockUsers.find(u => u._id === c.owner);
        return { ...c, owner: { name: owner.name, email: owner.email }};
    });
};

// --- WALLET ---
export const getWalletHistory = async () => {
    await simulateLatency();
    const userId = verifyToken(authToken);
    if (!userId) throw new Error("Not authorized");
    return mockWalletTransactions.filter(tx => tx.user === userId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const topUpWallet = async (amount) => {
    await simulateLatency();
    const userId = verifyToken(authToken);
    if (!userId) throw new Error("Not authorized");
    
    const user = mockUsers.find(u => u._id === userId);
    user.walletBalance += amount;

    mockWalletTransactions.push({
        _id: `tx-${Date.now()}`,
        user: userId,
        type: 'top-up',
        amount: amount,
        description: 'User wallet top-up',
        createdAt: new Date().toISOString(),
        hash: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`
    });

    const userData = JSON.parse(JSON.stringify(user));
    delete userData.password;
    return userData;
}

// --- ADMIN ---
export const adminGetCompanies = async () => getCompanies();

export const adminCreateCompany = async (companyData) => {
    await simulateLatency();
    // FIX: Changed owner from const to let to allow reassignment.
    let owner = mockUsers.find(u => u.email === companyData.ownerEmail);
    if (!owner) {
        // Create the owner user
        const newOwner = {
             _id: `user-${Date.now()}`,
            name: companyData.ownerName,
            email: companyData.ownerEmail,
            password: companyData.password,
            role: 'company',
            // FIX: Added missing properties to match user type.
            walletBalance: 0,
            loyaltyPoints: 0,
            avatarUrl: 'https://randomuser.me/api/portraits/lego/3.jpg',
            coverUrl: 'https://images.unsplash.com/photo/1544620347-c4fd4a3d5957?q=80&w=2048&auto=format&fit=crop',
            pin: '1234',
        };
        mockUsers.push(newOwner as any);
        owner = newOwner;
    }
    
    const newCompany = {
        _id: `comp-${Date.now()}`,
        name: companyData.name,
        owner: owner._id,
        status: 'Active',
        logoUrl: 'https://via.placeholder.com/100'
    };
    mockCompanies.push(newCompany);
    owner.companyId = newCompany._id;
    return newCompany;
};

export const adminUpdateCompany = async (companyId, companyData) => {
    await simulateLatency();
    const company = mockCompanies.find(c => c._id === companyId);
    if (company) Object.assign(company, companyData);
    return company;
};

export const adminDeleteCompany = async (companyId) => {
    await simulateLatency();
    mockCompanies = mockCompanies.filter(c => c._id !== companyId);
    return { success: true };
};

export const adminGetAllDrivers = async () => {
    await simulateLatency();
    return mockUsers.filter(u => u.role === 'driver').map(d => ({
        ...d,
        company: mockCompanies.find(c => c._id === d.companyId)
    }));
};
export const adminCreateDriver = async (driverData) => {
    await simulateLatency();
    const newDriver = {
        _id: `user-${Date.now()}`,
        ...driverData,
        role: 'driver',
        avatarUrl: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 80)}.jpg`,
    };
    mockUsers.push(newDriver);
    return newDriver;
};
export const adminUpdateDriver = async (driverId, driverData) => {
     await simulateLatency();
    const driver = mockUsers.find(u => u._id === driverId);
    if(driver) Object.assign(driver, driverData);
    return driver;
};
export const adminDeleteDriver = async (driverId) => {
    await simulateLatency();
    mockUsers = mockUsers.filter(u => u._id !== driverId);
    return { success: true };
};

// Add other functions if needed, they will all query the mock data arrays.
export const getAdminDashboardAnalytics = async () => {
    return {
        stats: {
            companies: mockCompanies.length,
        },
        revenueData: [],
        passengerData: [],
        companyRevenue: [],
    }
}
export const adminGetAllAgents = async () => [];
export const adminCreateAgent = async (data) => data;
export const adminGetAllUsers = async () => mockUsers;
export const adminUpdateAgent = async (id, data) => data;
export const adminDeleteAgent = async (id) => ({});
export const adminUpdateUser = async (id, data) => data;
export const adminDeleteUser = async (id) => ({});