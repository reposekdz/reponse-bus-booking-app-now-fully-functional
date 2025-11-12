import User from '../users/user.model';
import Company from '../companies/company.model';
import Bus from '../buses/bus.model';
import Route from '../routes/route.model';
import Trip from '../trips/trip.model';
import mongoose from 'mongoose';

const clearCollections = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
};

export const seedDatabase = async () => {
    console.log('Clearing database...');
    await clearCollections();
    console.log('Database cleared.');

    console.log('Seeding data...');
    
    // 1. Create Users
    const passengerUser = await User.create({ name: 'Kalisa Jean', email: 'passenger@gobus.rw', password: 'password', role: 'passenger', walletBalance: 50000, loyaltyPoints: 1250 });
    const volcanoManager = await User.create({ name: 'Volcano Manager', email: 'company@gobus.rw', password: 'password', role: 'company' });
    const ritcoManager = await User.create({ name: 'RITCO Manager', email: 'company2@gobus.rw', password: 'password', role: 'company' });
    const driverUser1 = await User.create({ name: 'John Doe', email: 'driver1@gobus.rw', password: 'password', role: 'driver' });
    const driverUser2 = await User.create({ name: 'Mary Anne', email: 'driver2@gobus.rw', password: 'password', role: 'driver' });
    const adminUser = await User.create({ name: 'Admin User', email: 'admin@gobus.rw', password: 'password', role: 'admin' });

    // 2. Create Companies
    const volcano = await Company.create({ name: 'Volcano Express', owner: volcanoManager._id, status: 'Active', logoUrl: 'https://pbs.twimg.com/profile_images/1237839357116452865/p-28c8o-_400x400.jpg' });
    const ritco = await Company.create({ name: 'RITCO', owner: ritcoManager._id, status: 'Active', logoUrl: 'https://www.ritco.rw/wp-content/uploads/2021/04/ritco-logo.jpg' });
    
    volcanoManager.company = volcano._id as any;
    ritcoManager.company = ritco._id as any;
    driverUser1.company = volcano._id as any;
    driverUser2.company = ritco._id as any;
    await Promise.all([volcanoManager.save(), ritcoManager.save(), driverUser1.save(), driverUser2.save()]);

    // 3. Create Buses
    const bus1 = await Bus.create({ company: volcano._id, plateNumber: 'RAD 123 B', model: 'Yutong Explorer', capacity: 55, amenities: ['AC', 'Charging'] });
    const bus2 = await Bus.create({ company: ritco._id, plateNumber: 'RAE 456 C', model: 'Scania Marcopolo', capacity: 65, amenities: ['AC', 'WiFi', 'TV'] });

    // 4. Create Routes
    const route1 = await Route.create({ company: volcano._id, from: 'Kigali', to: 'Rubavu', basePrice: 4500, estimatedDurationMinutes: 210 });
    const route2 = await Route.create({ company: ritco._id, from: 'Kigali', to: 'Huye', basePrice: 3000, estimatedDurationMinutes: 150 });
    const route3 = await Route.create({ company: volcano._id, from: 'Kigali', to: 'Musanze', basePrice: 3500, estimatedDurationMinutes: 120 });


    // 5. Create Trips with Seat Maps
    const generateSeatMap = (capacity: number) => {
        const seatMap = new Map();
        const rows = Math.ceil(capacity / 4);
        const seats = ['A', 'B', 'C', 'D'];
        for (let i = 1; i <= rows; i++) {
            for (let j = 0; j < 4; j++) {
                if ((i - 1) * 4 + j < capacity) {
                    const seatId = `${i}${seats[j]}`;
                    // Randomly make some seats occupied
                    seatMap.set(seatId, Math.random() > 0.8 ? 'occupied' : 'available');
                }
            }
        }
        return seatMap;
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tripsToCreate = [
        // Volcano Trips for Today
        { route: route1, bus: bus1, driver: driverUser1, departureTime: new Date(new Date(today).setHours(7, 0, 0, 0)), arrivalTime: new Date(new Date(today).setHours(10, 30, 0, 0)), seatMap: generateSeatMap(bus1.capacity) },
        { route: route1, bus: bus1, driver: driverUser1, departureTime: new Date(new Date(today).setHours(11, 0, 0, 0)), arrivalTime: new Date(new Date(today).setHours(14, 30, 0, 0)), seatMap: generateSeatMap(bus1.capacity) },
        { route: route3, bus: bus1, driver: driverUser1, departureTime: new Date(new Date(today).setHours(9, 0, 0, 0)), arrivalTime: new Date(new Date(today).setHours(11, 0, 0, 0)), seatMap: generateSeatMap(bus1.capacity) },

        // RITCO Trips for Today
        { route: route2, bus: bus2, driver: driverUser2, departureTime: new Date(new Date(today).setHours(8, 30, 0, 0)), arrivalTime: new Date(new Date(today).setHours(11, 0, 0, 0)), seatMap: generateSeatMap(bus2.capacity) },
        { route: route2, bus: bus2, driver: driverUser2, departureTime: new Date(new Date(today).setHours(13, 0, 0, 0)), arrivalTime: new Date(new Date(today).setHours(15, 30, 0, 0)), seatMap: generateSeatMap(bus2.capacity) },
        
         // Volcano Trips for Tomorrow
        { route: route1, bus: bus1, driver: driverUser1, departureTime: new Date(new Date(tomorrow).setHours(7, 0, 0, 0)), arrivalTime: new Date(new Date(tomorrow).setHours(10, 30, 0, 0)), seatMap: generateSeatMap(bus1.capacity) },

    ];

    await Trip.create(tripsToCreate);

    console.log('Seeding complete.');
};