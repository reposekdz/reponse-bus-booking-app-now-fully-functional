
// lib/api.ts - Advanced Simulated Backend Service

const DB_KEYS = {
    DRIVERS: 'gobus_drivers',
    COMPANIES: 'gobus_companies'
};

const defaultCompanies = [
    // ... existing company data
    { id: 'volcano', name: 'Volcano Express', logoUrl: 'https://pbs.twimg.com/profile_images/1237839357116452865/p-28c8o-_400x400.jpg', status: 'Active', totalRevenue: 56610000, totalPassengers: 12580, routesCount: 30, description: "Volcano Express is one of the most popular transport companies in Rwanda, known for its excellent service, cleanliness, and punctuality. They operate on many major routes.", coverUrl: 'https://images.unsplash.com/photo-1593256398246-8853b3815c32?q=80&w=2070&auto-format&fit=crop' },
    { id: 'ritco', name: 'RITCO', logoUrl: 'https://www.ritco.rw/wp-content/uploads/2021/04/ritco-logo.jpg', status: 'Active', totalRevenue: 34475000, totalPassengers: 9850, routesCount: 25, description: "RITCO is a government-owned public transport company, known for its large and modern buses that cover routes across the country.", coverUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2048&auto-format&fit=crop' },
    { id: 'horizon', name: 'Horizon Express', logoUrl: '', status: 'Active', totalRevenue: 22500000, totalPassengers: 7500, routesCount: 20, description: "Horizon Express provides reliable transport services on various national routes.", coverUrl: 'https://images.unsplash.com/photo-1605641793224-6512a_d8363b?q=80&w=1974&auto-format&fit=crop' },
    { id: 'international', name: 'International', logoUrl: '', status: 'Active', totalRevenue: 25000000, totalPassengers: 25000, routesCount: 15, description: "International travel services.", coverUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2048&auto-format&fit=crop' },
];

const defaultDrivers = [
    // ... existing driver data
    { 
        id: 'd1', 
        name: 'John Doe', 
        email: 'driver@volcano.rw', 
        role: 'driver', 
        avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg', 
        coverUrl: 'https://images.unsplash.com/photo-1533104816-588941750c11?q=80&w=1974&auto=format&fit=crop',
        companyId: 'volcano', 
        assignedBusId: 'RAD 123 B', 
        phone: '0788111222', 
        status: 'Active', 
        joinDate: '2022-03-10', 
        bio: 'Experienced driver with over 10 years on the Kigali-Rubavu route. Safety is my priority.', 
        documents: [
          {id: 'DL-RW-12345', name: 'Driver\'s License Category D', expiry: '2026-08-15'},
          {id: 'CERT-001', name: 'Defensive Driving', expiry: '2025-12-31'},
        ],
        performance: { onTimeRate: 98.5, averageRating: 4.8, completionRate: 100, safetyScore: 99, totalTrips: 245, },
        tripHistory: [
            {id: 'TRIP-501', route: 'Kigali - Rubavu', date: '2024-10-28', status: 'Completed', passengers: 54},
            {id: 'TRIP-502', route: 'Kigali - Musanze', date: '2024-10-27', status: 'Completed', passengers: 28},
        ]
    },
    { 
        id: 'd3', 
        name: 'Mary Anne', 
        email: 'mary.a@ritco.rw',
        role: 'driver',
        avatarUrl: 'https://randomuser.me/api/portraits/women/6.jpg', 
        coverUrl: 'https://images.unsplash.com/photo-1533104816-588941750c11?q=80&w=1974&auto=format&fit=crop',
        companyId: 'ritco', 
        assignedBusId: 'RAE 789 A', 
        phone: '0788555666', 
        status: 'On Leave',
        joinDate: '2021-01-15',
        bio: 'Driving for 5 years with a perfect safety record.',
        documents: [],
        performance: { onTimeRate: 99.1, averageRating: 4.9, completionRate: 100, safetyScore: 99, totalTrips: 301, },
        tripHistory: []
    },
];

class ApiService {
    private drivers: any[];
    private companies: any[];
    private analyticsData: any;

    constructor() {
        this.drivers = this.initializeData(DB_KEYS.DRIVERS, defaultDrivers);
        this.companies = this.initializeData(DB_KEYS.COMPANIES, defaultCompanies);
        this.analyticsData = this.generateAnalyticsData();
    }

    private initializeData(key: string, defaultData: any[]) {
        try {
            const storedData = localStorage.getItem(key);
            if (storedData) return JSON.parse(storedData);
        } catch (e) {
            console.error("Failed to parse from localStorage", e);
        }
        localStorage.setItem(key, JSON.stringify(defaultData));
        return defaultData;
    }
    
    private generateAnalyticsData() {
        const revenueData = [{ day: 'Mon', revenue: 3.5 }, { day: 'Tue', revenue: 4.2 }, { day: 'Wed', revenue: 3.9 }, { day: 'Thu', revenue: 5.1 }, { day: 'Fri', revenue: 6.8 }, { day: 'Sat', revenue: 8.2 }, { day: 'Sun', revenue: 7.5 }];
        const passengerData = [{ day: 'Mon', passengers: 1200 }, { day: 'Tue', passengers: 1500 }, { day: 'Wed', passengers: 1400 }, { day: 'Thu', passengers: 1800 }, { day: 'Fri', passengers: 2500 }, { day: 'Sat', passengers: 3200 }, { day: 'Sun', passengers: 2800 }];
        const companyRevenue = this.companies.map(c => ({
            name: c.name.substring(0,3).toUpperCase(),
            revenue: c.totalRevenue / 1_000_000_000
        })).filter(c => c.revenue > 0);

        return { revenueData, passengerData, companyRevenue };
    }

    private async simulateLatency(ms = 300) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- API Methods ---

    // Companies
    async getCompanies() {
        await this.simulateLatency();
        return [...this.companies];
    }
    
    // Drivers
    async getDrivers() {
        await this.simulateLatency();
        return this.drivers.map(driver => ({
            ...driver,
            companyName: this.companies.find(c => c.id === driver.companyId)?.name || 'Unknown'
        }));
    }

    // Analytics
    async getAdminDashboardAnalytics() {
        await this.simulateLatency(600);
        return {
            stats: {
                companies: this.companies.length,
                drivers: this.drivers.length,
            },
            ...this.analyticsData,
        }
    }

    // Payment
    async processPayment(details: { amount: number, method: string }) {
        await this.simulateLatency(1500); // Simulate network call to payment provider
        if (details.method === 'card') {
            // Simulate 3D Secure verification
            const isVerified = await this.verify3DSecure();
            if (!isVerified) {
                throw new Error("3D Secure verification failed.");
            }
        }
        // Simulate success/failure
        if (Math.random() > 0.1) { // 90% success rate
            return { success: true, transactionId: `TXN-${Date.now()}` };
        } else {
            throw new Error("Payment gateway rejected the transaction.");
        }
    }

    private async verify3DSecure(): Promise<boolean> {
        return new Promise(resolve => {
            // In a real app, this would open an iframe/popup. We simulate it with a confirm dialog.
            const isConfirmed = window.confirm("Your bank requires 3D Secure verification. Please confirm this mock transaction.");
            resolve(isConfirmed);
        });
    }

    // Other CRUD methods can be added here following the same pattern...
}

// Export a singleton instance of the service
export const api = new ApiService();

// Re-exporting raw data for components that might still use them synchronously
export const mockCompaniesData = [...defaultCompanies];
export const mockDriversData = [...defaultDrivers];
      