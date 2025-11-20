
/**
 * Complete Rwanda Bus Stations Database
 * Covering all 30 Districts and major Sectors/Centers
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
  // Gasabo
  { id: 'KG001', name: 'Nyabugogo', nameRw: 'Nyabugogo', district: 'Nyarugenge', province: 'Kigali', type: 'terminal' },
  { id: 'KG002', name: 'Remera', nameRw: 'Remera', district: 'Gasabo', province: 'Kigali', type: 'terminal' },
  { id: 'KG003', name: 'Kimironko', nameRw: 'Kimironko', district: 'Gasabo', province: 'Kigali', type: 'major' },
  { id: 'KG004', name: 'Kacyiru', nameRw: 'Kacyiru', district: 'Gasabo', province: 'Kigali', type: 'major' },
  { id: 'KG005', name: 'Kabuga', nameRw: 'Kabuga', district: 'Gasabo', province: 'Kigali', type: 'major' },
  { id: 'KG006', name: 'Kinyinya', nameRw: 'Kinyinya', district: 'Gasabo', province: 'Kigali', type: 'minor' },
  { id: 'KG007', name: 'Ndera', nameRw: 'Ndera', district: 'Gasabo', province: 'Kigali', type: 'minor' },
  { id: 'KG008', name: 'Rusororo', nameRw: 'Rusororo', district: 'Gasabo', province: 'Kigali', type: 'minor' },
  { id: 'KG009', name: 'Bumbogo', nameRw: 'Bumbogo', district: 'Gasabo', province: 'Kigali', type: 'minor' },
  { id: 'KG010', name: 'Gatsata', nameRw: 'Gatsata', district: 'Gasabo', province: 'Kigali', type: 'minor' },
  // Kicukiro
  { id: 'KC001', name: 'Nyanza-Kicukiro', nameRw: 'Nyanza ya Kicukiro', district: 'Kicukiro', province: 'Kigali', type: 'terminal' },
  { id: 'KC002', name: 'Gikondo', nameRw: 'Gikondo', district: 'Kicukiro', province: 'Kigali', type: 'major' },
  { id: 'KC003', name: 'Kicukiro Centre', nameRw: 'Kicukiro Centre', district: 'Kicukiro', province: 'Kigali', type: 'major' },
  { id: 'KC004', name: 'Kanombe', nameRw: 'Kanombe', district: 'Kicukiro', province: 'Kigali', type: 'major' },
  { id: 'KC005', name: 'Masaka', nameRw: 'Masaka', district: 'Kicukiro', province: 'Kigali', type: 'minor' },
  { id: 'KC006', name: 'Gahanga', nameRw: 'Gahanga', district: 'Kicukiro', province: 'Kigali', type: 'minor' },
  { id: 'KC007', name: 'Kagarama', nameRw: 'Kagarama', district: 'Kicukiro', province: 'Kigali', type: 'minor' },
  // Nyarugenge
  { id: 'NR001', name: 'Nyamirambo', nameRw: 'Nyamirambo', district: 'Nyarugenge', province: 'Kigali', type: 'major' },
  { id: 'NR002', name: 'Downtown', nameRw: 'Mu Mujyi', district: 'Nyarugenge', province: 'Kigali', type: 'terminal' },
  { id: 'NR003', name: 'Mageragere', nameRw: 'Mageragere', district: 'Nyarugenge', province: 'Kigali', type: 'minor' },
  { id: 'NR004', name: 'Rwezamenyo', nameRw: 'Rwezamenyo', district: 'Nyarugenge', province: 'Kigali', type: 'minor' },
  { id: 'NR005', name: 'Kigali (Gitega)', nameRw: 'Gitega', district: 'Nyarugenge', province: 'Kigali', type: 'minor' },

  // --- NORTHERN PROVINCE (5 Districts) ---
  // Musanze
  { id: 'NP001', name: 'Musanze (Ruhengeri)', nameRw: 'Musanze', district: 'Musanze', province: 'North', type: 'terminal' },
  { id: 'NP002', name: 'Kinigi', nameRw: 'Kinigi', district: 'Musanze', province: 'North', type: 'major' },
  { id: 'NP003', name: 'Muhoza', nameRw: 'Muhoza', district: 'Musanze', province: 'North', type: 'minor' },
  { id: 'NP004', name: 'Busogo', nameRw: 'Busogo', district: 'Musanze', province: 'North', type: 'minor' },
  // Gicumbi
  { id: 'NP005', name: 'Byumba', nameRw: 'Byumba', district: 'Gicumbi', province: 'North', type: 'terminal' },
  { id: 'NP006', name: 'Rukomo', nameRw: 'Rukomo', district: 'Gicumbi', province: 'North', type: 'major' },
  { id: 'NP007', name: 'Kageyo', nameRw: 'Kageyo', district: 'Gicumbi', province: 'North', type: 'minor' },
  { id: 'NP008', name: 'Miyove', nameRw: 'Miyove', district: 'Gicumbi', province: 'North', type: 'minor' },
  // Rulindo
  { id: 'NP009', name: 'Base', nameRw: 'Base', district: 'Rulindo', province: 'North', type: 'major' },
  { id: 'NP010', name: 'Shyorongi', nameRw: 'Shyorongi', district: 'Rulindo', province: 'North', type: 'minor' },
  { id: 'NP011', name: 'Kinihira', nameRw: 'Kinihira', district: 'Rulindo', province: 'North', type: 'minor' },
  // Burera
  { id: 'NP012', name: 'Kidaho', nameRw: 'Kidaho', district: 'Burera', province: 'North', type: 'major' },
  { id: 'NP013', name: 'Cyanika Border', nameRw: 'Cyanika', district: 'Burera', province: 'North', type: 'terminal' },
  { id: 'NP014', name: 'Butaro', nameRw: 'Butaro', district: 'Burera', province: 'North', type: 'minor' },
  // Gakenke
  { id: 'NP015', name: 'Gakenke Centre', nameRw: 'Gakenke', district: 'Gakenke', province: 'North', type: 'major' },
  { id: 'NP016', name: 'Ruli', nameRw: 'Ruli', district: 'Gakenke', province: 'North', type: 'minor' },
  { id: 'NP017', name: 'Janja', nameRw: 'Janja', district: 'Gakenke', province: 'North', type: 'minor' },

  // --- SOUTHERN PROVINCE (8 Districts) ---
  // Huye
  { id: 'SP001', name: 'Huye (Butare)', nameRw: 'Huye', district: 'Huye', province: 'South', type: 'terminal' },
  { id: 'SP002', name: 'Ngoma (Huye)', nameRw: 'Ngoma', district: 'Huye', province: 'South', type: 'major' },
  { id: 'SP003', name: 'Tumba', nameRw: 'Tumba', district: 'Huye', province: 'South', type: 'minor' },
  // Muhanga
  { id: 'SP004', name: 'Muhanga (Gitarama)', nameRw: 'Muhanga', district: 'Muhanga', province: 'South', type: 'terminal' },
  { id: 'SP005', name: 'Kabgayi', nameRw: 'Kabgayi', district: 'Muhanga', province: 'South', type: 'major' },
  { id: 'SP006', name: 'Nyabinoni', nameRw: 'Nyabinoni', district: 'Muhanga', province: 'South', type: 'minor' },
  // Nyanza
  { id: 'SP007', name: 'Nyanza', nameRw: 'Nyanza', district: 'Nyanza', province: 'South', type: 'terminal' },
  { id: 'SP008', name: 'Busasamana', nameRw: 'Busasamana', district: 'Nyanza', province: 'South', type: 'major' },
  // Kamonyi
  { id: 'SP009', name: 'Ruyenzi', nameRw: 'Ruyenzi', district: 'Kamonyi', province: 'South', type: 'major' },
  { id: 'SP010', name: 'Bishenyi', nameRw: 'Bishenyi', district: 'Kamonyi', province: 'South', type: 'minor' },
  { id: 'SP011', name: 'Kamonyi Centre', nameRw: 'Kamonyi', district: 'Kamonyi', province: 'South', type: 'minor' },
  // Ruhango
  { id: 'SP012', name: 'Ruhango', nameRw: 'Ruhango', district: 'Ruhango', province: 'South', type: 'major' },
  { id: 'SP013', name: 'Byimana', nameRw: 'Byimana', district: 'Ruhango', province: 'South', type: 'minor' },
  { id: 'SP014', name: 'Kinazi', nameRw: 'Kinazi', district: 'Ruhango', province: 'South', type: 'minor' },
  // Nyamagabe
  { id: 'SP015', name: 'Nyamagabe (Gikongoro)', nameRw: 'Nyamagabe', district: 'Nyamagabe', province: 'South', type: 'terminal' },
  { id: 'SP016', name: 'Kitabi', nameRw: 'Kitabi', district: 'Nyamagabe', province: 'South', type: 'major' },
  { id: 'SP017', name: 'Kaduha', nameRw: 'Kaduha', district: 'Nyamagabe', province: 'South', type: 'minor' },
  // Nyaruguru
  { id: 'SP018', name: 'Kibeho', nameRw: 'Kibeho', district: 'Nyaruguru', province: 'South', type: 'terminal' },
  { id: 'SP019', name: 'Ndago', nameRw: 'Ndago', district: 'Nyaruguru', province: 'South', type: 'minor' },
  // Gisagara
  { id: 'SP020', name: 'Ndora', nameRw: 'Ndora', district: 'Gisagara', province: 'South', type: 'major' },
  { id: 'SP021', name: 'Mamba', nameRw: 'Mamba', district: 'Gisagara', province: 'South', type: 'minor' },

  // --- EASTERN PROVINCE (7 Districts) ---
  // Rwamagana
  { id: 'EP001', name: 'Rwamagana', nameRw: 'Rwamagana', district: 'Rwamagana', province: 'East', type: 'terminal' },
  { id: 'EP002', name: 'Nyagasambu', nameRw: 'Nyagasambu', district: 'Rwamagana', province: 'East', type: 'major' },
  { id: 'EP003', name: 'Karenge', nameRw: 'Karenge', district: 'Rwamagana', province: 'East', type: 'minor' },
  // Kayonza
  { id: 'EP004', name: 'Kayonza', nameRw: 'Kayonza', district: 'Kayonza', province: 'East', type: 'terminal' },
  { id: 'EP005', name: 'Kabarondo', nameRw: 'Kabarondo', district: 'Kayonza', province: 'East', type: 'major' },
  { id: 'EP006', name: 'Rwinkwavu', nameRw: 'Rwinkwavu', district: 'Kayonza', province: 'East', type: 'minor' },
  // Nyagatare
  { id: 'EP007', name: 'Nyagatare', nameRw: 'Nyagatare', district: 'Nyagatare', province: 'East', type: 'terminal' },
  { id: 'EP008', name: 'Matimba', nameRw: 'Matimba', district: 'Nyagatare', province: 'East', type: 'major' },
  { id: 'EP009', name: 'Karangazi', nameRw: 'Karangazi', district: 'Nyagatare', province: 'East', type: 'minor' },
  { id: 'EP010', name: 'Mimuri', nameRw: 'Mimuri', district: 'Nyagatare', province: 'East', type: 'minor' },
  // Gatsibo
  { id: 'EP011', name: 'Kabarore', nameRw: 'Kabarore', district: 'Gatsibo', province: 'East', type: 'terminal' },
  { id: 'EP012', name: 'Kiziguro', nameRw: 'Kiziguro', district: 'Gatsibo', province: 'East', type: 'major' },
  { id: 'EP013', name: 'Kiramuruzi', nameRw: 'Kiramuruzi', district: 'Gatsibo', province: 'East', type: 'minor' },
  // Ngoma
  { id: 'EP014', name: 'Kibungo', nameRw: 'Kibungo', district: 'Ngoma', province: 'East', type: 'terminal' },
  { id: 'EP015', name: 'Zaza', nameRw: 'Zaza', district: 'Ngoma', province: 'East', type: 'minor' },
  { id: 'EP016', name: 'Sake', nameRw: 'Sake', district: 'Ngoma', province: 'East', type: 'minor' },
  // Kirehe
  { id: 'EP017', name: 'Rusumo', nameRw: 'Rusumo', district: 'Kirehe', province: 'East', type: 'terminal' },
  { id: 'EP018', name: 'Nyakarambi', nameRw: 'Nyakarambi', district: 'Kirehe', province: 'East', type: 'major' },
  { id: 'EP019', name: 'Nasho', nameRw: 'Nasho', district: 'Kirehe', province: 'East', type: 'minor' },
  // Bugesera
  { id: 'EP020', name: 'Nyamata', nameRw: 'Nyamata', district: 'Bugesera', province: 'East', type: 'terminal' },
  { id: 'EP021', name: 'Ruhuha', nameRw: 'Ruhuha', district: 'Bugesera', province: 'East', type: 'major' },
  { id: 'EP022', name: 'Mayange', nameRw: 'Mayange', district: 'Bugesera', province: 'East', type: 'minor' },
  { id: 'EP023', name: 'Nemba Border', nameRw: 'Nemba', district: 'Bugesera', province: 'East', type: 'minor' },

  // --- WESTERN PROVINCE (7 Districts) ---
  // Rubavu
  { id: 'WP001', name: 'Rubavu (Gisenyi)', nameRw: 'Rubavu', district: 'Rubavu', province: 'West', type: 'terminal' },
  { id: 'WP002', name: 'Mahoko', nameRw: 'Mahoko', district: 'Rubavu', province: 'West', type: 'major' },
  { id: 'WP003', name: 'Nyamyumba', nameRw: 'Nyamyumba', district: 'Rubavu', province: 'West', type: 'minor' },
  // Rusizi
  { id: 'WP004', name: 'Rusizi (Kamembe)', nameRw: 'Rusizi', district: 'Rusizi', province: 'West', type: 'terminal' },
  { id: 'WP005', name: 'Bugarama', nameRw: 'Bugarama', district: 'Rusizi', province: 'West', type: 'major' },
  { id: 'WP006', name: 'Muganza', nameRw: 'Muganza', district: 'Rusizi', province: 'West', type: 'minor' },
  // Karongi
  { id: 'WP007', name: 'Karongi (Kibuye)', nameRw: 'Karongi', district: 'Karongi', province: 'West', type: 'terminal' },
  { id: 'WP008', name: 'Rubengera', nameRw: 'Rubengera', district: 'Karongi', province: 'West', type: 'major' },
  { id: 'WP009', name: 'Mubuga', nameRw: 'Mubuga', district: 'Karongi', province: 'West', type: 'minor' },
  // Rutsiro
  { id: 'WP010', name: 'Gihango', nameRw: 'Gihango', district: 'Rutsiro', province: 'West', type: 'major' },
  { id: 'WP011', name: 'Rutsiro Centre', nameRw: 'Rutsiro', district: 'Rutsiro', province: 'West', type: 'minor' },
  // Ngororero
  { id: 'WP012', name: 'Ngororero', nameRw: 'Ngororero', district: 'Ngororero', province: 'West', type: 'terminal' },
  { id: 'WP013', name: 'Kabaya', nameRw: 'Kabaya', district: 'Ngororero', province: 'West', type: 'major' },
  // Nyabihu
  { id: 'WP014', name: 'Mukamira', nameRw: 'Mukamira', district: 'Nyabihu', province: 'West', type: 'major' },
  { id: 'WP015', name: 'Vunga', nameRw: 'Vunga', district: 'Nyabihu', province: 'West', type: 'minor' },
  // Nyamasheke
  { id: 'WP016', name: 'Nyamasheke (Tyazo)', nameRw: 'Nyamasheke', district: 'Nyamasheke', province: 'West', type: 'terminal' },
  { id: 'WP017', name: 'Kibogora', nameRw: 'Kibogora', district: 'Nyamasheke', province: 'West', type: 'major' },
  { id: 'WP018', name: 'Bushenge', nameRw: 'Bushenge', district: 'Nyamasheke', province: 'West', type: 'minor' },
];

export const getDistrictList = () => {
  return [...new Set(rwandaAllStations.map(s => s.district))].sort();
};

export const getStationsByDistrict = (district: string) => {
  return rwandaAllStations.filter(s => s.district === district);
};
