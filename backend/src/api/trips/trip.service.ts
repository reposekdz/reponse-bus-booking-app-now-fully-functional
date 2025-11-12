import Trip from './trip.model';
import Route from '../routes/route.model';
import { AppError } from '../../utils/AppError';

interface TripQuery {
    from: string;
    to: string;
    date: string;
}

export const findTrips = async (query: TripQuery) => {
    const { from, to, date } = query;

    if (!from || !to || !date) {
        throw new AppError('Please provide from, to, and date query parameters.', 400);
    }
    
    // Find all routes that match the from/to criteria
    const matchingRoutes = await Route.find({ from, to }).select('_id');
    const routeIds = matchingRoutes.map(route => route._id);

    if (routeIds.length === 0) {
        return []; // No routes match, so no trips will match
    }
    
    // Find all trips on the specified date that are on one of the matching routes
    const searchDate = new Date(date);
    const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
    
    const trips = await Trip.find({
        route: { $in: routeIds },
        departureTime: {
            $gte: startOfDay,
            $lte: endOfDay
        },
        status: 'Scheduled'
    })
    .populate({
        path: 'route',
        select: 'from to basePrice estimatedDurationMinutes',
        populate: {
            path: 'company',
            select: 'name logoUrl'
        }
    })
    .populate('bus', 'model amenities')
    .populate('driver', 'name');

    return trips;
};

export const findTripById = async (id: string) => {
    const trip = await Trip.findById(id)
        .populate({
            path: 'route',
            select: 'from to basePrice',
            populate: {
                path: 'company',
                select: 'name'
            }
        })
        .populate('bus', 'capacity');
    
    if (!trip) {
        throw new AppError('Trip not found', 404);
    }
    return trip;
};
