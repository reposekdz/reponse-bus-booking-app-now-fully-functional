
import React from 'react';

export const mockCompaniesData = [
  {
    id: 'volcano',
    name: 'Volcano Express',
    logoUrl: 'https://seeklogo.com/images/V/volcano-express-logo-F735513A51-seeklogo.com.png',
    coverUrl: 'https://images.unsplash.com/photo-1593256398246-8853b3815c32?q=80&w=2070&auto=format&fit=crop',
    description: "Volcano Express ni kimwe mu bigo bikunzwe cyane mu Rwanda, kizwiho serivisi nziza, isuku, no kugera ku gihe. Bakorera mu mihanda myinshi ikomeye.",
    totalPassengers: 3500000,
    totalRevenue: 15750000000,
    routes: [ { from: 'Kigali', to: 'Rubavu' }, { from: 'Kigali', to: 'Musanze' }, { from: 'Rubavu', to: 'Kigali' } ],
  },
  {
    id: 'ritco',
    name: 'RITCO',
    logoUrl: 'https://www.ritco.rw/wp-content/uploads/2021/03/logo.svg',
    coverUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2048&auto=format&fit=crop',
    description: "RITCO ni ikigo cya Leta gishinzwe gutwara abantu mu buryo bwa rusange, kizwiho kugira imodoka nini kandi zigezweho zitwara abantu mu gihugu hose.",
    totalPassengers: 2100000,
    totalRevenue: 9450000000,
    routes: [ { from: 'Kigali', to: 'Huye' }, { from: 'Kigali', to: 'Nyungwe' }, { from: 'Kigali', to: 'Rusizi' }, { from: 'Huye', to: 'Kigali' } ],
  },
  {
    id: 'horizon',
    name: 'Horizon Express',
    logoUrl: 'https://media.jobinrwanda.com/logo/horizon-express-ltd-1681284534.png',
    coverUrl: 'https://images.unsplash.com/photo-1605641793224-6512a8d8363b?q=80&w=1974&auto=format&fit=crop',
    description: "Horizon Express offers comfortable and reliable travel between major towns in Rwanda.",
    totalPassengers: 1200000,
    totalRevenue: 5400000000,
    routes: [ { from: 'Huye', to: 'Musanze' } ],
  },
  {
    id: 'stellart',
    name: 'STELLART',
    logoUrl: 'https://pbs.twimg.com/profile_images/1494248881944604673/h744_4jK_400x400.jpg',
    coverUrl: 'https://images.unsplash.com/photo-1616372819235-9b2e1577a2d4?q=80&w=2070&auto=format&fit=crop',
    description: 'STELLART provides premium bus services with a focus on customer comfort and safety.',
    totalPassengers: 1500000,
    totalRevenue: 6750000000,
    routes: [ { from: 'Kigali', to: 'Rusizi' } ],
  },
];

const AdminDashboard: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p>This is where admin-level statistics and management tools will be displayed.</p>
        </div>
    );
};

export default AdminDashboard;
