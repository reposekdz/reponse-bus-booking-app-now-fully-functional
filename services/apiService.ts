
// services/apiService.ts - REAL BACKEND API CLIENT

const BASE_URL = '/api/v1';
let TOKEN: string | null = null;

// Helper to handle API responses
const handleResponse = async (response: Response) => {
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { success: true, data: {} };
    }
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
};

// Main fetch function
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (TOKEN) {
        headers['Authorization'] = `Bearer ${TOKEN}`;
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    return handleResponse(response);
};

// --- AUTH ---
export const setAuthToken = (token: string | null) => {
    TOKEN = token;
};

export const login = (credentials: any) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
export const register = (userData: any) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
export const getCurrentUser = async () => {
    const { data } = await apiFetch('/auth/me');
    return data;
};
export const updatePassword = (passwords: any) => apiFetch('/auth/updatepassword', { method: 'PUT', body: JSON.stringify(passwords) });
export const forgotPassword = (email: string) => apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
export const resetPassword = (token: string, password: string) => apiFetch(`/auth/reset-password/${token}`, { method: 'POST', body: JSON.stringify({ password }) });

// --- TRIPS ---
export const searchTrips = async (from: string, to: string, date: string, companyId?: string) => {
    const params = new URLSearchParams({ from, to, date });
    if (companyId) {
        params.append('companyId', companyId);
    }
    const { data } = await apiFetch(`/trips/search?${params.toString()}`);
    return data;
};
export const getTripDetails = async (tripId: string) => {
    const { data } = await apiFetch(`/trips/${tripId}`);
    return data;
};
export const getTripManifest = async (tripId: string) => {
    const { data } = await apiFetch(`/trips/${tripId}/manifest`);
    return data;
};
export const confirmBoarding = async (tripId: string, ticketId: string) => {
    const { data } = await apiFetch(`/trips/${tripId}/boardings`, {
        method: 'POST',
        body: JSON.stringify({ ticketId }),
    });
    return data;
};
export const departTrip = (tripId: string) => apiFetch(`/trips/${tripId}/depart`, { method: 'POST' });
export const arriveTrip = (tripId: string) => apiFetch(`/trips/${tripId}/arrive`, { method: 'POST' });
export const updateTripStatus = (tripId: string, status: string) => apiFetch(`/trips/${tripId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });


// --- BOOKINGS ---
export const createBooking = async (bookingData: any) => {
    const { data } = await apiFetch('/bookings', { method: 'POST', body: JSON.stringify(bookingData) });
    return data;
};
export const getMyBookings = async () => {
    const { data } = await apiFetch('/bookings');
    return data;
};

// --- PAYMENTS ---
export const initiateMomoPayment = (paymentData: any) => apiFetch('/payments/momo/initiate', { method: 'POST', body: JSON.stringify(paymentData) });


// --- PUBLIC CONTENT ---
export const getCompanies = async () => {
    const { data } = await apiFetch('/companies');
    return data;
};
export const getCompanyById = async (id: string) => {
    const { data } = await apiFetch(`/companies/${id}`);
    return data;
};
export const getCompanyProfileDetails = async (id: string) => {
    const { data } = await apiFetch(`/companies/${id}/details`);
    return data;
};
export const getSetting = (key: string) => apiFetch(`/settings/${key}`);
export const getAllDestinations = async () => {
    const { data } = await apiFetch('/destinations');
    return data;
};
export const getActiveAds = () => apiFetch('/advertisements');


// --- USER PROFILE ---
export const updateAvatar = (avatarData: string) => apiFetch('/users/me/avatar', { method: 'PUT', body: JSON.stringify({ avatarData }) });
export const updateMyProfile = (profileData: any) => apiFetch('/users/me', { method: 'PUT', body: JSON.stringify(profileData) });


// --- WALLET ---
export const getWalletHistory = async () => {
    const { data } = await apiFetch('/wallet/history');
    return data;
};
export const topUpWallet = (amount: number) => apiFetch('/wallet/topup', { method: 'POST', body: JSON.stringify({ amount }) });
export const setWalletPin = (pin: string) => apiFetch('/wallet/set-pin', { method: 'PUT', body: JSON.stringify({ pin }) });
export const walletTransfer = (data: any) => apiFetch('/wallet/transfer', { method: 'POST', body: JSON.stringify(data) });

// --- MESSAGES ---
export const submitContactMessage = (messageData: any) => apiFetch('/messages', { method: 'POST', body: JSON.stringify(messageData) });
export const adminGetMessages = async () => {
    const { data } = await apiFetch('/messages');
    return data;
};
export const adminUpdateMessage = (id: string, updateData: any) => apiFetch(`/messages/${id}`, { method: 'PUT', body: JSON.stringify(updateData) });


// --- ADMIN ---
export const adminGetCompanies = async () => {
    const { data } = await apiFetch('/admin/companies');
    return data;
};
export const adminCreateCompany = (companyData: any) => apiFetch('/admin/companies', { method: 'POST', body: JSON.stringify(companyData) });
export const adminUpdateCompany = (id: string, companyData: any) => apiFetch(`/admin/companies/${id}`, { method: 'PUT', body: JSON.stringify(companyData) });
export const adminDeleteCompany = (id: string) => apiFetch(`/admin/companies/${id}`, { method: 'DELETE' });

export const adminGetAllDrivers = async () => {
    const { data } = await apiFetch('/admin/drivers');
    return data;
};
export const adminCreateDriver = (driverData: any) => apiFetch('/admin/drivers', { method: 'POST', body: JSON.stringify(driverData) });
export const adminUpdateDriver = (id: string, driverData: any) => apiFetch(`/admin/drivers/${id}`, { method: 'PUT', body: JSON.stringify(driverData) });
export const adminDeleteDriver = (id: string) => apiFetch(`/admin/drivers/${id}`, { method: 'DELETE' });
export const adminGetDriverHistory = async (driverId: string) => {
    const { data } = await apiFetch(`/admin/drivers/${driverId}/history`);
    return data;
};


export const adminGetAllAgents = async () => {
    const { data } = await apiFetch('/admin/agents');
    return data;
};
export const adminCreateAgent = (agentData: any) => apiFetch('/admin/agents', { method: 'POST', body: JSON.stringify(agentData) });
export const adminUpdateAgent = (id: string, agentData: any) => apiFetch(`/admin/agents/${id}`, { method: 'PUT', body: JSON.stringify(agentData) });
export const adminDeleteAgent = (id: string) => apiFetch(`/admin/agents/${id}`, { method: 'DELETE' });

export const adminGetAllUsers = async () => {
    const { data } = await apiFetch('/admin/users');
    return data;
};

export const adminGetDashboardAnalytics = async () => {
    const { data } = await apiFetch('/admin/analytics');
    return data;
};
export const adminGetFinancials = async () => {
    const { data } = await apiFetch('/admin/financials');
    return data;
};

export const adminUpdateSetting = (key: string, value: string) => apiFetch(`/admin/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) });

export const adminCreateDestination = (data: any) => apiFetch('/admin/destinations', { method: 'POST', body: JSON.stringify(data) });
export const adminUpdateDestination = (id: number, data: any) => apiFetch(`/admin/destinations/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const adminDeleteDestination = (id: number) => apiFetch(`/admin/destinations/${id}`, { method: 'DELETE' });

export const adminGetAds = () => apiFetch('/advertisements/all');
export const adminCreateAd = (adData: any) => apiFetch('/advertisements', { method: 'POST', body: JSON.stringify(adData) });
export const adminUpdateAd = (id: number, adData: any) => apiFetch(`/advertisements/${id}`, { method: 'PUT', body: JSON.stringify(adData) });
export const adminDeleteAd = (id: number) => apiFetch(`/advertisements/${id}`, { method: 'DELETE' });


// --- COMPANY ---
export const companyGetMyDrivers = async () => {
    const { data } = await apiFetch('/companies/mydrivers');
    return data;
}
export const companyCreateDriver = (driverData: any) => apiFetch('/companies/mydrivers', { method: 'POST', body: JSON.stringify(driverData) });
export const companyUpdateDriver = (id: string, driverData: any) => apiFetch(`/companies/mydrivers/${id}`, { method: 'PUT', body: JSON.stringify(driverData) });
export const companyDeleteDriver = (id: string) => apiFetch(`/companies/mydrivers/${id}`, { method: 'DELETE' });
export const companyGetDriverHistory = async (driverId: string) => {
    const { data } = await apiFetch(`/companies/mydrivers/${driverId}/history`);
    return data;
};
export const getCompanyDashboard = async () => {
    const { data } = await apiFetch('/companies/my-dashboard');
    return data;
}
export const companyGetMyBuses = async () => {
    const { data } = await apiFetch('/companies/mybuses');
    return data;
};
export const companyCreateBus = (busData: any) => apiFetch('/companies/mybuses', { method: 'POST', body: JSON.stringify(busData) });
export const companyUpdateBus = (id: string, busData: any) => apiFetch(`/companies/mybuses/${id}`, { method: 'PUT', body: JSON.stringify(busData) });
export const companyDeleteBus = (id: string) => apiFetch(`/companies/mybuses/${id}`, { method: 'DELETE' });

export const companyGetMyRoutes = async () => {
    const { data } = await apiFetch('/companies/myroutes');
    return data;
};
export const companyCreateRoute = (routeData: any) => apiFetch('/companies/myroutes', { method: 'POST', body: JSON.stringify(routeData) });
export const companyUpdateRoute = (id: string, routeData: any) => apiFetch(`/companies/myroutes/${id}`, { method: 'PUT', body: JSON.stringify(routeData) });
export const companyDeleteRoute = (id: string) => apiFetch(`/companies/myroutes/${id}`, { method: 'DELETE' });

export const companyCreateTrip = (tripData: any) => apiFetch('/companies/mytrips', { method: 'POST', body: JSON.stringify(tripData) });

export const companyGetMyPassengers = async () => {
    const { data } = await apiFetch('/companies/mypassengers');
    return data;
};
export const companyGetMyFinancials = async () => {
    const { data } = await apiFetch('/companies/myfinancials');
    return data;
};


// --- DRIVER ---
export const driverGetMyTrips = async () => {
    const { data } = await apiFetch('/drivers/my-trips');
    return data;
};
export const driverGetMyHistory = async () => {
    const { data } = await apiFetch('/drivers/my-history');
    return data;
};
export const driverUpdateMyStatus = async (status: 'Active' | 'Unavailable') => {
    const { data } = await apiFetch('/drivers/my-status', {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
    return data;
};


// --- AGENT ---
export const agentLookupPassenger = async (serialCode: string) => {
    const { data } = await apiFetch(`/agents/lookup/${serialCode}`);
    return data;
};
export const agentMakeDeposit = (depositData: { passengerSerial: string, amount: number }) => {
    return apiFetch('/agents/deposit', { method: 'POST', body: JSON.stringify(depositData) });
};
export const agentGetMyTransactions = async () => {
    const { data } = await apiFetch('/agents/my-transactions');
    return data;
};
export const getAgentDashboard = async () => {
    const { data } = await apiFetch('/agents/my-dashboard');
    return data;
};

// --- LOYALTY ---
export const getLoyaltyHistory = async () => {
    const { data } = await apiFetch('/loyalty/history');
    return data;
}

// --- PRICE ALERTS ---
export const createPriceAlert = (alertData: any) => apiFetch('/price-alerts', { method: 'POST', body: JSON.stringify(alertData) });
export const getMyPriceAlerts = async () => {
    const { data } = await apiFetch('/price-alerts');
    return data;
}
export const deletePriceAlert = (id: number) => apiFetch(`/price-alerts/${id}`, { method: 'DELETE' });

// --- OTHER SERVICES ---
export const getLostAndFoundItems = async () => {
    const { data } = await apiFetch('/lost-and-found');
    return data;
}
export const reportLostItem = (itemData: any) => apiFetch('/lost-and-found', { method: 'POST', body: JSON.stringify(itemData) });

export const createPackageRequest = (packageData: any) => apiFetch('/packages', { method: 'POST', body: JSON.stringify(packageData) });
export const trackPackage = async (trackingId: string) => {
    const { data } = await apiFetch(`/packages/${trackingId}`);
    return data;
};

export const createCharterRequest = (charterData: any) => apiFetch('/charters', { method: 'POST', body: JSON.stringify(charterData) });

// --- NOTIFICATIONS ---
export const subscribePush = (subscription: any) => apiFetch('/notifications/subscribe', { method: 'POST', body: JSON.stringify(subscription) });


// --- DEBUG ---
export const seedDatabase = () => apiFetch('/debug/seed', { method: 'POST' });
