const API_BASE_URL = '/api/v1'; // Using proxy, so no need for full URL

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

const getHeaders = () => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
};

const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'An API error occurred');
    }
    return data;
};

// --- AUTH ---
export const login = async (credentials: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(credentials),
    });
    return handleResponse(response);
};

export const getCurrentUser = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getHeaders(),
    });
    const res = await handleResponse(response);
    return res.data;
};


// --- TRIPS ---
export const searchTrips = async (from: string, to: string, date: string) => {
    const params = new URLSearchParams({ from, to, date });
    const response = await fetch(`${API_BASE_URL}/trips/search?${params.toString()}`);
    const res = await handleResponse(response);
    return res.data;
};

export const getTripDetails = async (tripId: string) => {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}`);
    const res = await handleResponse(response);
    return res.data;
}

// --- BOOKINGS ---
export const createBooking = async (bookingData: any) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(bookingData)
    });
    const res = await handleResponse(response);
    return res.data;
}

export const getMyBookings = async () => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
        headers: getHeaders()
    });
    const res = await handleResponse(response);
    return res.data;
}

// --- COMPANIES ---
export const getCompanies = async () => {
    const response = await fetch(`${API_BASE_URL}/companies`);
    const res = await handleResponse(response);
    return res.data;
}

// --- WALLET ---
export const getWalletHistory = async () => {
    const response = await fetch(`${API_BASE_URL}/wallet/history`, { headers: getHeaders() });
    const res = await handleResponse(response);
    return res.data;
}

export const topUpWallet = async (amount: number) => {
    const response = await fetch(`${API_BASE_URL}/wallet/topup`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ amount })
    });
    const res = await handleResponse(response);
    return res.data;
}

// --- ADMIN ---
// FIX: Add missing admin functions for company management.
export const adminGetCompanies = async () => {
    const response = await fetch(`${API_BASE_URL}/admin/companies`, { headers: getHeaders() });
    const res = await handleResponse(response);
    return res.data;
};

export const adminCreateCompany = async (companyData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/companies`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(companyData)
    });
    const res = await handleResponse(response);
    return res.data;
};

export const adminUpdateCompany = async (companyId: string, companyData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/companies/${companyId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(companyData)
    });
    const res = await handleResponse(response);
    return res.data;
};

export const adminDeleteCompany = async (companyId: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/companies/${companyId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    const res = await handleResponse(response);
    return res.data;
};


export const adminGetAllDrivers = async () => {
    const response = await fetch(`${API_BASE_URL}/admin/drivers`, { headers: getHeaders() });
    const res = await handleResponse(response);
    return res.data;
}

export const adminCreateDriver = async (driverData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/drivers`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(driverData)
    });
    const res = await handleResponse(response);
    return res.data;
}

export const adminUpdateDriver = async (driverId: string, driverData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/drivers/${driverId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(driverData)
    });
    const res = await handleResponse(response);
    return res.data;
}

export const adminDeleteDriver = async (driverId: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/drivers/${driverId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    const res = await handleResponse(response);
    return res.data;
}


// --- DEBUG ---
export const seedDatabase = async () => {
    const response = await fetch(`${API_BASE_URL}/debug/seed`, { method: 'POST' });
    return handleResponse(response);
}