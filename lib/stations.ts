
/**
 * Complete Rwanda Bus Stations Database
 * Covering all 30 Districts (Kigali City, Northern, Southern, Eastern, and Western Provinces)
 */

export interface RwandaStation {
  id: string;
  name: string;
  nameRw: string;
  district: string;
  province: string;
  type: 'terminal' | 'major' | 'minor' | 'stop';
}

export const rwandaAllStations: RwandaStation[] = [
  // --- KIGALI CITY (3 Districts) ---
  { id: 'KG01', name: 'Nyabugogo Terminal', nameRw: 'Gare ya Nyabugogo', district: 'Nyarugenge', province: 'Kigali', type: 'terminal' },
  { id: 'KG02', name: 'Downtown (CBD)', nameRw: 'Mu Mujyi', district: 'Nyarugenge', province: 'Kigali', type: 'terminal' },
  { id: 'KG03', name: 'Nyamirambo', nameRw: 'Nyamirambo', district: 'Nyarugenge', province: 'Kigali', type: 'major' },
  { id: 'KG04', name: 'Remera (Giporoso)', nameRw: 'Remera', district: 'Gasabo', province: 'Kigali', type: 'terminal' },
  { id: 'KG05', name: 'Kimironko', nameRw: 'Kimironko', district: 'Gasabo', province: 'Kigali', type: 'major' },
  { id: 'KG06', name: 'Kabuga', nameRw: 'Kabuga', district: 'Gasabo', province: 'Kigali', type: 'major' },
  { id: 'KG07', name: 'Kicukiro Centre', nameRw: 'Kicukiro', district: 'Kicukiro', province: 'Kigali', type: 'major' },
  { id: 'KG08', name: 'Nyanza-Kicukiro', nameRw: 'Nyanza', district: 'Kicukiro', province: 'Kigali', type: 'terminal' },
  { id: 'KG09', name: 'Kanombe', nameRw: 'Kanombe', district: 'Kicukiro', province: 'Kigali', type: 'major' },

  // --- NORTHERN PROVINCE (5 Districts) ---
  { id: 'NP01', name: 'Musanze (Ruhengeri)', nameRw: 'Musanze', district: 'Musanze', province: 'North', type: 'terminal' },
  { id: 'NP02', name: 'Kinigi', nameRw: 'Kinigi', district: 'Musanze', province: 'North', type: 'major' },
  { id: 'NP03', name: 'Byumba', nameRw: 'Byumba', district: 'Gicumbi', province: 'North', type: 'terminal' },
  { id: 'NP04', name: 'Gatuna Border', nameRw: 'Gatuna', district: 'Gicumbi', province: 'North', type: 'major' },
  { id: 'NP05', name: 'Base', nameRw: 'Base', district: 'Rulindo', province: 'North', type: 'major' },
  { id: 'NP06', name: 'Shyorongi', nameRw: 'Shyorongi', district: 'Rulindo', province: 'North', type: 'minor' },
  { id: 'NP07', name: 'Cyanika Border', nameRw: 'Cyanika', district: 'Burera', province: 'North', type: 'terminal' },
  { id: 'NP08', name: 'Kidaho', nameRw: 'Kidaho', district: 'Burera', province: 'North', type: 'major' },
  { id: 'NP09', name: 'Gakenke Centre', nameRw: 'Gakenke', district: 'Gakenke', province: 'North', type: 'major' },
  { id: 'NP10', name: 'Ruli', nameRw: 'Ruli', district: 'Gakenke', province: 'North', type: 'minor' },

  // --- SOUTHERN PROVINCE (8 Districts) ---
  { id: 'SP01', name: 'Huye (Butare)', nameRw: 'Huye', district: 'Huye', province: 'South', type: 'terminal' },
  { id: 'SP02', name: 'Muhanga (Gitarama)', nameRw: 'Muhanga', district: 'Muhanga', province: 'South', type: 'terminal' },
  { id: 'SP03', name: 'Kabgayi', nameRw: 'Kabgayi', district: 'Muhanga', province: 'South', type: 'major' },
  { id: 'SP04', name: 'Nyanza (Heritage)', nameRw: 'Nyanza', district: 'Nyanza', province: 'South', type: 'terminal' },
  { id: 'SP05', name: 'Ruyenzi', nameRw: 'Ruyenzi', district: 'Kamonyi', province: 'South', type: 'major' },
  { id: 'SP06', name: 'Kamonyi Centre', nameRw: 'Kamonyi', district: 'Kamonyi', province: 'South', type: 'major' },
  { id: 'SP07', name: 'Ruhango', nameRw: 'Ruhango', district: 'Ruhango', province: 'South', type: 'terminal' },
  { id: 'SP08', name: 'Kinazi', nameRw: 'Kinazi', district: 'Ruhango', province: 'South', type: 'minor' },
  { id: 'SP09', name: 'Nyamagabe (Gikongoro)', nameRw: 'Nyamagabe', district: 'Nyamagabe', province: 'South', type: 'terminal' },
  { id: 'SP10', name: 'Kitabi', nameRw: 'Kitabi', district: 'Nyamagabe', province: 'South', type: 'major' },
  { id: 'SP11', name: 'Kibeho', nameRw: 'Kibeho', district: 'Nyaruguru', province: 'South', type: 'terminal' },
  { id: 'SP12', name: 'Akanyaru Border', nameRw: 'Akanyaru', district: 'Nyaruguru', province: 'South', type: 'major' },
  { id: 'SP13', name: 'Gisagara Centre', nameRw: 'Gisagara', district: 'Gisagara', province: 'South', type: 'major' },
  { id: 'SP14', name: 'Save', nameRw: 'Save', district: 'Gisagara', province: 'South', type: 'minor' },

  // --- EASTERN PROVINCE (7 Districts) ---
  { id: 'EP01', name: 'Rwamagana', nameRw: 'Rwamagana', district: 'Rwamagana', province: 'East', type: 'terminal' },
  { id: 'EP02', name: 'Nyagasambu', nameRw: 'Nyagasambu', district: 'Rwamagana', province: 'East', type: 'major' },
  { id: 'EP03', name: 'Kayonza', nameRw: 'Kayonza', district: 'Kayonza', province: 'East', type: 'terminal' },
  { id: 'EP04', name: 'Kabarondo', nameRw: 'Kabarondo', district: 'Kayonza', province: 'East', type: 'major' },
  { id: 'EP05', name: 'Nyagatare', nameRw: 'Nyagatare', district: 'Nyagatare', province: 'East', type: 'terminal' },
  { id: 'EP06', name: 'Kagitumba Border', nameRw: 'Kagitumba', district: 'Nyagatare', province: 'East', type: 'terminal' },
  { id: 'EP07', name: 'Matimba', nameRw: 'Matimba', district: 'Nyagatare', province: 'East', type: 'major' },
  { id: 'EP08', name: 'Kabarore', nameRw: 'Kabarore', district: 'Gatsibo', province: 'East', type: 'terminal' },
  { id: 'EP09', name: 'Kiramuruzi', nameRw: 'Kiramuruzi', district: 'Gatsibo', province: 'East', type: 'major' },
  { id: 'EP10', name: 'Kibungo', nameRw: 'Kibungo', district: 'Ngoma', province: 'East', type: 'terminal' },
  { id: 'EP11', name: 'Zaza', nameRw: 'Zaza', district: 'Ngoma', province: 'East', type: 'minor' },
  { id: 'EP12', name: 'Rusumo Border', nameRw: 'Rusumo', district: 'Kirehe', province: 'East', type: 'terminal' },
  { id: 'EP13', name: 'Nyakarambi', nameRw: 'Nyakarambi', district: 'Kirehe', province: 'East', type: 'major' },
  { id: 'EP14', name: 'Nyamata', nameRw: 'Nyamata', district: 'Bugesera', province: 'East', type: 'terminal' },
  { id: 'EP15', name: 'Nemba Border', nameRw: 'Nemba', district: 'Bugesera', province: 'East', type: 'major' },
  { id: 'EP16', name: 'Ruhuha', nameRw: 'Ruhuha', district: 'Bugesera', province: 'East', type: 'major' },

  // --- WESTERN PROVINCE (7 Districts) ---
  { id: 'WP01', name: 'Rubavu (Gisenyi)', nameRw: 'Rubavu', district: 'Rubavu', province: 'West', type: 'terminal' },
  { id: 'WP02', name: 'Mahoko', nameRw: 'Mahoko', district: 'Rubavu', province: 'West', type: 'major' },
  { id: 'WP03', name: 'La Corniche Border', nameRw: 'La Corniche', district: 'Rubavu', province: 'West', type: 'major' },
  { id: 'WP04', name: 'Rusizi (Kamembe)', nameRw: 'Rusizi', district: 'Rusizi', province: 'West', type: 'terminal' },
  { id: 'WP05', name: 'Bugarama', nameRw: 'Bugarama', district: 'Rusizi', province: 'West', type: 'major' },
  { id: 'WP06', name: 'Karongi (Kibuye)', nameRw: 'Karongi', district: 'Karongi', province: 'West', type: 'terminal' },
  { id: 'WP07', name: 'Rubengera', nameRw: 'Rubengera', district: 'Karongi', province: 'West', type: 'major' },
  { id: 'WP08', name: 'Rutsiro Centre', nameRw: 'Rutsiro', district: 'Rutsiro', province: 'West', type: 'major' },
  { id: 'WP09', name: 'Congo Nil', nameRw: 'Congo Nil', district: 'Rutsiro', province: 'West', type: 'minor' },
  { id: 'WP10', name: 'Ngororero', nameRw: 'Ngororero', district: 'Ngororero', province: 'West', type: 'terminal' },
  { id: 'WP11', name: 'Kabaya', nameRw: 'Kabaya', district: 'Ngororero', province: 'West', type: 'major' },
  { id: 'WP12', name: 'Mukamira', nameRw: 'Mukamira', district: 'Nyabihu', province: 'West', type: 'major' },
  { id: 'WP13', name: 'Vunga', nameRw: 'Vunga', district: 'Nyabihu', province: 'West', type: 'minor' },
  { id: 'WP14', name: 'Nyamasheke (Tyazo)', nameRw: 'Nyamasheke', district: 'Nyamasheke', province: 'West', type: 'terminal' },
  { id: 'WP15', name: 'Ntendezi', nameRw: 'Ntendezi', district: 'Nyamasheke', province: 'West', type: 'major' },
];

export const getDistrictList = () => {
  return [...new Set(rwandaAllStations.map(s => s.district))].sort();
};

export const getStationsByDistrict = (district: string) => {
  return rwandaAllStations.filter(s => s.district === district);
};
