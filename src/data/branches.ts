export interface Branch {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  distance: string;
  isOpen: boolean;
  services: string[];
  hours: string;
}

export const branches: Branch[] = [
  {
    id: 1,
    name: 'Financial District Plaza',
    address: '100 Market Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    distance: '0.4 mi',
    isOpen: true,
    services: ['ATM', '24/7 Access'],
    hours: '9:00 AM - 5:00 PM',
  },
  {
    id: 2,
    name: 'SOMA Express Center',
    address: '450 Mission Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    distance: '1.2 mi',
    isOpen: true,
    services: ['ATM', '24/7 Access', 'Full Service'],
    hours: '8:00 AM - 6:00 PM',
  },
  {
    id: 3,
    name: 'Marina Wealth Center',
    address: '2150 Chestnut Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94123',
    distance: '2.8 mi',
    isOpen: false,
    services: ['Full Service', 'Drive-Thru'],
    hours: '9:00 AM - 4:00 PM',
  },
  {
    id: 4,
    name: 'Mission Bay Branch',
    address: '185 Berry Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94158',
    distance: '3.1 mi',
    isOpen: true,
    services: ['ATM', 'Full Service', '24/7 Access'],
    hours: '8:30 AM - 5:30 PM',
  },
  {
    id: 5,
    name: 'Nob Hill Premium',
    address: '1200 California Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94109',
    distance: '3.5 mi',
    isOpen: true,
    services: ['Full Service', 'Drive-Thru', 'ATM'],
    hours: '9:00 AM - 5:00 PM',
  },
  {
    id: 6,
    name: 'Sunset District ATM',
    address: '3401 Noriega Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94122',
    distance: '5.2 mi',
    isOpen: true,
    services: ['ATM', '24/7 Access'],
    hours: '24 Hours',
  },
];
