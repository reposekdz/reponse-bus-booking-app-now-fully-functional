
/**
 * Complete Rwanda Bus Stations Database
 * Covering all 30 Districts (Kigali City, Northern, Southern, Eastern, and Western Provinces)
 */

export interface RwandaStation {
  id: string;
  name: string;
  district: string;
  province: string;
  type: 'terminal' | 'major' | 'minor' | 'stop';
}

export const rwandaDistricts = [
  // Kigali
  'Gasabo', 'Kicukiro', 'Nyarugenge',
  // North
  'Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo',
  // South
  'Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango',
  // East
  'Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana',
  // West
  'Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro'
];

export const rwandaAllStations: RwandaStation[] = [
  // --- KIGALI CITY ---
  { id: 'KG01', name: 'Nyabugogo Terminal', district: 'Nyarugenge', province: 'Kigali', type: 'terminal' },
  { id: 'KG02', name: 'Downtown (CBD)', district: 'Nyarugenge', province: 'Kigali', type: 'terminal' },
  { id: 'KG03', name: 'Nyamirambo', district: 'Nyarugenge', province: 'Kigali', type: 'major' },
  { id: 'KG04', name: 'Remera (Giporoso)', district: 'Gasabo', province: 'Kigali', type: 'terminal' },
  { id: 'KG05', name: 'Kimironko', district: 'Gasabo', province: 'Kigali', type: 'major' },
  { id: 'KG06', name: 'Kabuga', district: 'Gasabo', province: 'Kigali', type: 'major' },
  { id: 'KG07', name: 'Kicukiro Centre', district: 'Kicukiro', province: 'Kigali', type: 'major' },
  { id: 'KG08', name: 'Nyanza-Kicukiro', district: 'Kicukiro', province: 'Kigali', type: 'terminal' },
  
  // --- NORTHERN PROVINCE ---
  { id: 'NP01', name: 'Musanze (Ruhengeri)', district: 'Musanze', province: 'North', type: 'terminal' },
  { id: 'NP02', name: 'Kinigi', district: 'Musanze', province: 'North', type: 'major' },
  { id: 'NP03', name: 'Byumba', district: 'Gicumbi', province: 'North', type: 'terminal' },
  { id: 'NP04', name: 'Gatuna Border', district: 'Gicumbi', province: 'North', type: 'major' },
  { id: 'NP05', name: 'Base', district: 'Rulindo', province: 'North', type: 'major' },
  { id: 'NP07', name: 'Cyanika Border', district: 'Burera', province: 'North', type: 'terminal' },
  { id: 'NP09', name: 'Gakenke Centre', district: 'Gakenke', province: 'North', type: 'major' },

  // --- SOUTHERN PROVINCE ---
  { id: 'SP01', name: 'Huye (Butare)', district: 'Huye', province: 'South', type: 'terminal' },
  { id: 'SP02', name: 'Muhanga (Gitarama)', district: 'Muhanga', province: 'South', type: 'terminal' },
  { id: 'SP03', name: 'Kabgayi', district: 'Muhanga', province: 'South', type: 'major' },
  { id: 'SP04', name: 'Nyanza (Heritage)', district: 'Nyanza', province: 'South', type: 'terminal' },
  { id: 'SP05', name: 'Ruyenzi', district: 'Kamonyi', province: 'South', type: 'major' },
  { id: 'SP07', name: 'Ruhango', district: 'Ruhango', province: 'South', type: 'terminal' },
  { id: 'SP09', name: 'Nyamagabe (Gikongoro)', district: 'Nyamagabe', province: 'South', type: 'terminal' },
  { id: 'SP10', name: 'Kitabi', district: 'Nyamagabe', province: 'South', type: 'major' },
  { id: 'SP11', name: 'Kibeho', district: 'Nyaruguru', province: 'South', type: 'terminal' },
  { id: 'SP13', name: 'Gisagara Centre', district: 'Gisagara', province: 'South', type: 'major' },

  // --- EASTERN PROVINCE ---
  { id: 'EP01', name: 'Rwamagana', district: 'Rwamagana', province: 'East', type: 'terminal' },
  { id: 'EP03', name: 'Kayonza', district: 'Kayonza', province: 'East', type: 'terminal' },
  { id: 'EP05', name: 'Nyagatare', district: 'Nyagatare', province: 'East', type: 'terminal' },
  { id: 'EP06', name: 'Kagitumba Border', district: 'Nyagatare', province: 'East', type: 'terminal' },
  { id: 'EP08', name: 'Kabarore', district: 'Gatsibo', province: 'East', type: 'terminal' },
  { id: 'EP10', name: 'Kibungo', district: 'Ngoma', province: 'East', type: 'terminal' },
  { id: 'EP12', name: 'Rusumo Border', district: 'Kirehe', province: 'East', type: 'terminal' },
  { id: 'EP13', name: 'Nyakarambi', district: 'Kirehe', province: 'East', type: 'major' },
  { id: 'EP14', name: 'Nyamata', district: 'Bugesera', province: 'East', type: 'terminal' },
  { id: 'EP15', name: 'Nemba Border', district: 'Bugesera', province: 'East', type: 'major' },

  // --- WESTERN PROVINCE ---
  { id: 'WP01', name: 'Rubavu (Gisenyi)', district: 'Rubavu', province: 'West', type: 'terminal' },
  { id: 'WP03', name: 'La Corniche Border', district: 'Rubavu', province: 'West', type: 'major' },
  { id: 'WP04', name: 'Rusizi (Kamembe)', district: 'Rusizi', province: 'West', type: 'terminal' },
  { id: 'WP05', name: 'Bugarama', district: 'Rusizi', province: 'West', type: 'major' },
  { id: 'WP06', name: 'Karongi (Kibuye)', district: 'Karongi', province: 'West', type: 'terminal' },
  { id: 'WP08', name: 'Rutsiro Centre', district: 'Rutsiro', province: 'West', type: 'major' },
  { id: 'WP10', name: 'Ngororero', district: 'Ngororero', province: 'West', type: 'terminal' },
  { id: 'WP12', name: 'Mukamira', district: 'Nyabihu', province: 'West', type: 'major' },
  { id: 'WP14', name: 'Nyamasheke (Tyazo)', district: 'Nyamasheke', province: 'West', type: 'terminal' },
];

export const getDistrictList = () => {
  return rwandaDistricts.sort();
};

export const getStationsByDistrict = (district: string) => {
  return rwandaAllStations.filter(s => s.district === district);
};
