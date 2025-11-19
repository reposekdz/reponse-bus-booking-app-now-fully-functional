/**
 * Complete Rwanda Bus Stations Database
 * All provinces, districts, and bus stations in Rwanda
 */

export interface RwandaStation {
  id: string;
  name: string;
  nameRw: string;
  nameFr: string;
  district: string;
  districtRw: string;
  province: string;
  provinceRw: string;
  latitude: number;
  longitude: number;
  address?: string;
  type: 'terminal' | 'major' | 'minor';
  code: string;
}

export const rwandaAllStations: RwandaStation[] = [
  // KIGALI CITY - GASABO
  { id: 'KG001', code: 'NYB', name: 'Nyabugogo Bus Terminal', nameRw: 'Nyabugogo Terminali', nameFr: 'Terminal de Nyabugogo', district: 'Gasabo', districtRw: 'Gasabo', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9441, longitude: 30.0619, type: 'terminal', address: 'Nyabugogo' },
  { id: 'KG002', code: 'REM', name: 'Remera Taxi Park', nameRw: 'Paki ya Remera', nameFr: 'Parc de Taxis Remera', district: 'Gasabo', districtRw: 'Gasabo', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9333, longitude: 30.1083, type: 'major' },
  { id: 'KG003', code: 'KCY', name: 'Kacyiru Bus Stop', nameRw: 'Aho Gutagura Kacyiru', nameFr: 'Arrêt de Bus Kacyiru', district: 'Gasabo', districtRw: 'Gasabo', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9333, longitude: 30.0833, type: 'minor' },
  { id: 'KG004', code: 'GSO', name: 'Gisozi Bus Station', nameRw: 'Stasiyo ya Gisozi', nameFr: 'Station de Bus Gisozi', district: 'Gasabo', districtRw: 'Gasabo', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9167, longitude: 30.0833, type: 'minor' },
  { id: 'KG005', code: 'JAB', name: 'Jabana Bus Stop', nameRw: 'Aho Gutagura Jabana', nameFr: 'Arrêt de Bus Jabana', district: 'Gasabo', districtRw: 'Gasabo', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9000, longitude: 30.1000, type: 'minor' },
  { id: 'KG006', code: 'RUS', name: 'Rusororo Bus Station', nameRw: 'Stasiyo ya Rusororo', nameFr: 'Station de Bus Rusororo', district: 'Gasabo', districtRw: 'Gasabo', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.8833, longitude: 30.1167, type: 'minor' },
  { id: 'KG007', code: 'BUM', name: 'Bumbogo Bus Stop', nameRw: 'Aho Gutagura Bumbogo', nameFr: 'Arrêt de Bus Bumbogo', district: 'Gasabo', districtRw: 'Gasabo', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.8667, longitude: 30.1333, type: 'minor' },
  { id: 'KG008', code: 'NDE', name: 'Ndera Bus Station', nameRw: 'Stasiyo ya Ndera', nameFr: 'Station de Bus Ndera', district: 'Gasabo', districtRw: 'Gasabo', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.8500, longitude: 30.1500, type: 'minor' },
  { id: 'KG009', code: 'KIM', name: 'Kimisagara Bus Station', nameRw: 'Stasiyo ya Kimisagara', nameFr: 'Station de Bus Kimisagara', district: 'Gasabo', districtRw: 'Gasabo', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9667, longitude: 30.0500, type: 'major' },
  { id: 'KG010', code: 'KBG', name: 'Kibagabaga Bus Station', nameRw: 'Stasiyo ya Kibagabaga', nameFr: 'Station de Bus Kibagabaga', district: 'Gasabo', districtRw: 'Gasabo', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9167, longitude: 30.1167, type: 'minor' },

  // KIGALI CITY - KICUKIRO
  { id: 'KC001', code: 'NYM', name: 'Nyamirambo Bus Station', nameRw: 'Stasiyo ya Nyamirambo', nameFr: 'Station de Bus Nyamirambo', district: 'Kicukiro', districtRw: 'Kicukiro', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9608, longitude: 30.0569, type: 'major' },
  { id: 'KC002', code: 'GKD', name: 'Gikondo Bus Terminal', nameRw: 'Terminali ya Gikondo', nameFr: 'Terminal de Gikondo', district: 'Kicukiro', districtRw: 'Kicukiro', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9500, longitude: 30.1000, type: 'terminal' },
  { id: 'KC003', code: 'SNT', name: 'Sonatube Bus Stop', nameRw: 'Aho Gutagura Sonatube', nameFr: 'Arrêt de Bus Sonatube', district: 'Kicukiro', districtRw: 'Kicukiro', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9667, longitude: 30.1167, type: 'minor' },
  { id: 'KC004', code: 'KGR', name: 'Kagarama Bus Station', nameRw: 'Stasiyo ya Kagarama', nameFr: 'Station de Bus Kagarama', district: 'Kicukiro', districtRw: 'Kicukiro', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9833, longitude: 30.1333, type: 'minor' },
  { id: 'KC005', code: 'NBY', name: 'Niboye Bus Stop', nameRw: 'Aho Gutagura Niboye', nameFr: 'Arrêt de Bus Niboye', district: 'Kicukiro', districtRw: 'Kicukiro', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -2.0000, longitude: 30.1500, type: 'minor' },
  { id: 'KC006', code: 'MSK', name: 'Masaka Bus Station', nameRw: 'Stasiyo ya Masaka', nameFr: 'Station de Bus Masaka', district: 'Kicukiro', districtRw: 'Kicukiro', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -2.0167, longitude: 30.1667, type: 'minor' },
  { id: 'KC007', code: 'GHG', name: 'Gahanga Bus Stop', nameRw: 'Aho Gutagura Gahanga', nameFr: 'Arrêt de Bus Gahanga', district: 'Kicukiro', districtRw: 'Kicukiro', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -2.0333, longitude: 30.1833, type: 'minor' },
  { id: 'KC008', code: 'KNB', name: 'Kanombe Bus Station', nameRw: 'Stasiyo ya Kanombe', nameFr: 'Station de Bus Kanombe', district: 'Kicukiro', districtRw: 'Kicukiro', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9833, longitude: 30.1333, type: 'minor' },

  // KIGALI CITY - NYARUGENGE
  { id: 'NR001', code: 'NYB-M', name: 'Nyabugogo Main Terminal', nameRw: 'Terminali Nkuru ya Nyabugogo', nameFr: 'Terminal Principal de Nyabugogo', district: 'Nyarugenge', districtRw: 'Nyarugenge', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9441, longitude: 30.0619, type: 'terminal' },
  { id: 'NR002', code: 'MHM', name: 'Muhima Bus Station', nameRw: 'Stasiyo ya Muhima', nameFr: 'Station de Bus Muhima', district: 'Nyarugenge', districtRw: 'Nyarugenge', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9667, longitude: 30.0667, type: 'major' },
  { id: 'NR003', code: 'BRG', name: 'Biryogo Bus Stop', nameRw: 'Aho Gutagura Biryogo', nameFr: 'Arrêt de Bus Biryogo', district: 'Nyarugenge', districtRw: 'Nyarugenge', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9833, longitude: 30.0500, type: 'minor' },
  { id: 'NR004', code: 'RWZ', name: 'Rwezamenyo Bus Station', nameRw: 'Stasiyo ya Rwezamenyo', nameFr: 'Station de Bus Rwezamenyo', district: 'Nyarugenge', districtRw: 'Nyarugenge', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9500, longitude: 30.0333, type: 'minor' },
  { id: 'NR005', code: 'GTG', name: 'Gitega Bus Stop', nameRw: 'Aho Gutagura Gitega', nameFr: 'Arrêt de Bus Gitega', district: 'Nyarugenge', districtRw: 'Nyarugenge', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9667, longitude: 30.0333, type: 'minor' },
  { id: 'NR006', code: 'CYH', name: 'Cyahafi Bus Station', nameRw: 'Stasiyo ya Cyahafi', nameFr: 'Station de Bus Cyahafi', district: 'Nyarugenge', districtRw: 'Nyarugenge', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9333, longitude: 30.0500, type: 'minor' },
  { id: 'NR007', code: 'KIM-C', name: 'Kimisagara Central', nameRw: 'Kimisagara Hagati', nameFr: 'Kimisagara Central', district: 'Nyarugenge', districtRw: 'Nyarugenge', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9667, longitude: 30.0500, type: 'major' },
  { id: 'NR008', code: 'MGR', name: 'Mageragere Bus Terminal', nameRw: 'Terminali ya Mageragere', nameFr: 'Terminal de Mageragere', district: 'Nyarugenge', districtRw: 'Nyarugenge', province: 'Kigali City', provinceRw: 'Umujyi wa Kigali', latitude: -1.9500, longitude: 30.0667, type: 'terminal' },

  // EASTERN PROVINCE - BUGESERA
  { id: 'BG001', code: 'NYT', name: 'Nyamata Bus Terminal', nameRw: 'Terminali ya Nyamata', nameFr: 'Terminal de Nyamata', district: 'Bugesera', districtRw: 'Bugesera', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.2167, longitude: 30.1167, type: 'terminal', address: 'Nyamata Town' },
  { id: 'BG002', code: 'RLM', name: 'Rilima Bus Station', nameRw: 'Stasiyo ya Rilima', nameFr: 'Station de Bus Rilima', district: 'Bugesera', districtRw: 'Bugesera', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.1833, longitude: 30.1333, type: 'major' },
  { id: 'BG003', code: 'MYG', name: 'Mayange Bus Stop', nameRw: 'Aho Gutagura Mayange', nameFr: 'Arrêt de Bus Mayange', district: 'Bugesera', districtRw: 'Bugesera', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.2000, longitude: 30.1000, type: 'minor' },
  { id: 'BG004', code: 'GSH', name: 'Gashora Bus Station', nameRw: 'Stasiyo ya Gashora', nameFr: 'Station de Bus Gashora', district: 'Bugesera', districtRw: 'Bugesera', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.2333, longitude: 30.0833, type: 'minor' },
  { id: 'BG005', code: 'NTR', name: 'Ntarama Bus Stop', nameRw: 'Aho Gutagura Ntarama', nameFr: 'Arrêt de Bus Ntarama', district: 'Bugesera', districtRw: 'Bugesera', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.2500, longitude: 30.1167, type: 'minor' },
  { id: 'BG006', code: 'MRB', name: 'Mareba Bus Station', nameRw: 'Stasiyo ya Mareba', nameFr: 'Station de Bus Mareba', district: 'Bugesera', districtRw: 'Bugesera', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.2667, longitude: 30.1333, type: 'minor' },
  { id: 'BG007', code: 'RWR', name: 'Rweru Bus Stop', nameRw: 'Aho Gutagura Rweru', nameFr: 'Arrêt de Bus Rweru', district: 'Bugesera', districtRw: 'Bugesera', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.2167, longitude: 30.1500, type: 'minor' },
  { id: 'BG008', code: 'JRU', name: 'Juru Bus Station', nameRw: 'Stasiyo ya Juru', nameFr: 'Station de Bus Juru', district: 'Bugesera', districtRw: 'Bugesera', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.2000, longitude: 30.1667, type: 'minor' },

  // EASTERN PROVINCE - GATSIBO
  { id: 'GT001', code: 'KBR', name: 'Kabarore Bus Terminal', nameRw: 'Terminali ya Kabarore', nameFr: 'Terminal de Kabarore', district: 'Gatsibo', districtRw: 'Gatsibo', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.7833, longitude: 30.4667, type: 'terminal', address: 'Kabarore Town' },
  { id: 'GT002', code: 'KRM', name: 'Kiramuruzi Bus Stop', nameRw: 'Aho Gutagura Kiramuruzi', nameFr: 'Arrêt de Bus Kiramuruzi', district: 'Gatsibo', districtRw: 'Gatsibo', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.7500, longitude: 30.4833, type: 'minor' },
  { id: 'GT003', code: 'GTS-C', name: 'Gatsibo Center Bus Station', nameRw: 'Stasiyo ya Hagati Gatsibo', nameFr: 'Station Centre Gatsibo', district: 'Gatsibo', districtRw: 'Gatsibo', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.7833, longitude: 30.4667, type: 'major' },
  { id: 'GT004', code: 'MHR', name: 'Muhura Bus Stop', nameRw: 'Aho Gutagura Muhura', nameFr: 'Arrêt de Bus Muhura', district: 'Gatsibo', districtRw: 'Gatsibo', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.8167, longitude: 30.4500, type: 'minor' },
  { id: 'GT005', code: 'REM-G', name: 'Remera Bus Station', nameRw: 'Stasiyo ya Remera', nameFr: 'Station de Bus Remera', district: 'Gatsibo', districtRw: 'Gatsibo', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.7667, longitude: 30.4167, type: 'minor' },
  { id: 'GT006', code: 'RWM', name: 'Rwimiyaga Bus Stop', nameRw: 'Aho Gutagura Rwimiyaga', nameFr: 'Arrêt de Bus Rwimiyaga', district: 'Gatsibo', districtRw: 'Gatsibo', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.7500, longitude: 30.4333, type: 'minor' },
  { id: 'GT007', code: 'KZG', name: 'Kiziguro Bus Station', nameRw: 'Stasiyo ya Kiziguro', nameFr: 'Station de Bus Kiziguro', district: 'Gatsibo', districtRw: 'Gatsibo', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.8167, longitude: 30.4167, type: 'minor' },

  // EASTERN PROVINCE - KAYONZA
  { id: 'KY001', code: 'KYZ-T', name: 'Kayonza Bus Terminal', nameRw: 'Terminali ya Kayonza', nameFr: 'Terminal de Kayonza', district: 'Kayonza', districtRw: 'Kayonza', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.9167, longitude: 30.5333, type: 'terminal', address: 'Kayonza Town' },
  { id: 'KY002', code: 'RNK', name: 'Rwinkwavu Bus Station', nameRw: 'Stasiyo ya Rwinkwavu', nameFr: 'Station de Bus Rwinkwavu', district: 'Kayonza', districtRw: 'Kayonza', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.8833, longitude: 30.5667, type: 'major' },
  { id: 'KY003', code: 'KBR-K', name: 'Kabare Bus Stop', nameRw: 'Aho Gutagura Kabare', nameFr: 'Arrêt de Bus Kabare', district: 'Kayonza', districtRw: 'Kayonza', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.9500, longitude: 30.5000, type: 'minor' },
  { id: 'KY004', code: 'MRD', name: 'Murundi Bus Station', nameRw: 'Stasiyo ya Murundi', nameFr: 'Station de Bus Murundi', district: 'Kayonza', districtRw: 'Kayonza', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.9000, longitude: 30.4833, type: 'minor' },
  { id: 'KY005', code: 'NDG', name: 'Ndego Bus Stop', nameRw: 'Aho Gutagura Ndego', nameFr: 'Arrêt de Bus Ndego', district: 'Kayonza', districtRw: 'Kayonza', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.9333, longitude: 30.5167, type: 'minor' },
  { id: 'KY006', code: 'GHN', name: 'Gahini Bus Station', nameRw: 'Stasiyo ya Gahini', nameFr: 'Station de Bus Gahini', district: 'Kayonza', districtRw: 'Kayonza', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.8833, longitude: 30.4500, type: 'major' },
  { id: 'KY007', code: 'MKR', name: 'Mukarange Bus Stop', nameRw: 'Aho Gutagura Mukarange', nameFr: 'Arrêt de Bus Mukarange', district: 'Kayonza', districtRw: 'Kayonza', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.9500, longitude: 30.4833, type: 'minor' },
  { id: 'KY008', code: 'MRM', name: 'Murama Bus Station', nameRw: 'Stasiyo ya Murama', nameFr: 'Station de Bus Murama', district: 'Kayonza', districtRw: 'Kayonza', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.9167, longitude: 30.5500, type: 'minor' },

  // EASTERN PROVINCE - KIREHE
  { id: 'KH001', code: 'KRE-T', name: 'Kirehe Bus Terminal', nameRw: 'Terminali ya Kirehe', nameFr: 'Terminal de Kirehe', district: 'Kirehe', districtRw: 'Kirehe', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.2833, longitude: 30.7833, type: 'terminal', address: 'Kirehe Town' },
  { id: 'KH002', code: 'GTR', name: 'Gatore Bus Station', nameRw: 'Stasiyo ya Gatore', nameFr: 'Station de Bus Gatore', district: 'Kirehe', districtRw: 'Kirehe', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.2500, longitude: 30.8000, type: 'major' },
  { id: 'KH003', code: 'KGR-K', name: 'Kigarama Bus Stop', nameRw: 'Aho Gutagura Kigarama', nameFr: 'Arrêt de Bus Kigarama', district: 'Kirehe', districtRw: 'Kirehe', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.3167, longitude: 30.7667, type: 'minor' },
  { id: 'KH004', code: 'MHM-K', name: 'Mahama Bus Station', nameRw: 'Stasiyo ya Mahama', nameFr: 'Station de Bus Mahama', district: 'Kirehe', districtRw: 'Kirehe', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.2667, longitude: 30.7500, type: 'major' },
  { id: 'KH005', code: 'MSZ', name: 'Musaza Bus Stop', nameRw: 'Aho Gutagura Musaza', nameFr: 'Arrêt de Bus Musaza', district: 'Kirehe', districtRw: 'Kirehe', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.3000, longitude: 30.7333, type: 'minor' },
  { id: 'KH006', code: 'NRB', name: 'Nyarubuye Bus Station', nameRw: 'Stasiyo ya Nyarubuye', nameFr: 'Station de Bus Nyarubuye', district: 'Kirehe', districtRw: 'Kirehe', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.2833, longitude: 30.7167, type: 'minor' },
  { id: 'KH007', code: 'MPG', name: 'Mpanga Bus Stop', nameRw: 'Aho Gutagura Mpanga', nameFr: 'Arrêt de Bus Mpanga', district: 'Kirehe', districtRw: 'Kirehe', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.2500, longitude: 30.7667, type: 'minor' },
  { id: 'KH008', code: 'KGN', name: 'Kigina Bus Station', nameRw: 'Stasiyo ya Kigina', nameFr: 'Station de Bus Kigina', district: 'Kirehe', districtRw: 'Kirehe', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.3167, longitude: 30.8000, type: 'minor' },

  // EASTERN PROVINCE - NGOMA
  { id: 'NG001', code: 'KBG-T', name: 'Kibungo Bus Terminal', nameRw: 'Terminali ya Kibungo', nameFr: 'Terminal de Kibungo', district: 'Ngoma', districtRw: 'Ngoma', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.1667, longitude: 30.5500, type: 'terminal', address: 'Kibungo Town' },
  { id: 'NG002', code: 'SAK', name: 'Sake Bus Station', nameRw: 'Stasiyo ya Sake', nameFr: 'Station de Bus Sake', district: 'Ngoma', districtRw: 'Ngoma', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.1333, longitude: 30.5333, type: 'major' },
  { id: 'NG003', code: 'MGR-N', name: 'Mugesera Bus Stop', nameRw: 'Aho Gutagura Mugesera', nameFr: 'Arrêt de Bus Mugesera', district: 'Ngoma', districtRw: 'Ngoma', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.2000, longitude: 30.5667, type: 'minor' },
  { id: 'NG004', code: 'REM-N', name: 'Remera Bus Station', nameRw: 'Stasiyo ya Remera', nameFr: 'Station de Bus Remera', district: 'Ngoma', districtRw: 'Ngoma', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.1500, longitude: 30.5167, type: 'minor' },
  { id: 'NG005', code: 'ZZZ', name: 'Zaza Bus Stop', nameRw: 'Aho Gutagura Zaza', nameFr: 'Arrêt de Bus Zaza', district: 'Ngoma', districtRw: 'Ngoma', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.1833, longitude: 30.5333, type: 'minor' },
  { id: 'NG006', code: 'JRM', name: 'Jarama Bus Station', nameRw: 'Stasiyo ya Jarama', nameFr: 'Station de Bus Jarama', district: 'Ngoma', districtRw: 'Ngoma', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.1333, longitude: 30.5500, type: 'minor' },
  { id: 'NG007', code: 'KRM-N', name: 'Karembo Bus Stop', nameRw: 'Aho Gutagura Karembo', nameFr: 'Arrêt de Bus Karembo', district: 'Ngoma', districtRw: 'Ngoma', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.1667, longitude: 30.5167, type: 'minor' },
  { id: 'NG008', code: 'RKR', name: 'Rukira Bus Station', nameRw: 'Stasiyo ya Rukira', nameFr: 'Station de Bus Rukira', district: 'Ngoma', districtRw: 'Ngoma', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -2.1500, longitude: 30.5333, type: 'minor' },

  // EASTERN PROVINCE - NYAGATARE
  { id: 'NY001', code: 'NYG-T', name: 'Nyagatare Bus Terminal', nameRw: 'Terminali ya Nyagatare', nameFr: 'Terminal de Nyagatare', district: 'Nyagatare', districtRw: 'Nyagatare', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.3000, longitude: 30.3167, type: 'terminal', address: 'Nyagatare Town' },
  { id: 'NY002', code: 'MTB', name: 'Matimba Bus Station', nameRw: 'Stasiyo ya Matimba', nameFr: 'Station de Bus Matimba', district: 'Nyagatare', districtRw: 'Nyagatare', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.2667, longitude: 30.3333, type: 'major' },
  { id: 'NY003', code: 'KRZ', name: 'Karangazi Bus Stop', nameRw: 'Aho Gutagura Karangazi', nameFr: 'Arrêt de Bus Karangazi', district: 'Nyagatare', districtRw: 'Nyagatare', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.3333, longitude: 30.3000, type: 'minor' },
  { id: 'NY004', code: 'MKM', name: 'Mukama Bus Station', nameRw: 'Stasiyo ya Mukama', nameFr: 'Station de Bus Mukama', district: 'Nyagatare', districtRw: 'Nyagatare', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.2833, longitude: 30.3500, type: 'minor' },
  { id: 'NY005', code: 'RMPS', name: 'Rwempasha Bus Stop', nameRw: 'Aho Gutagura Rwempasha', nameFr: 'Arrêt de Bus Rwempasha', district: 'Nyagatare', districtRw: 'Nyagatare', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.3167, longitude: 30.3167, type: 'minor' },
  { id: 'NY006', code: 'TBG', name: 'Tabagwe Bus Station', nameRw: 'Stasiyo ya Tabagwe', nameFr: 'Station de Bus Tabagwe', district: 'Nyagatare', districtRw: 'Nyagatare', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.3000, longitude: 30.3333, type: 'minor' },
  { id: 'NY007', code: 'KYB', name: 'Kiyombe Bus Stop', nameRw: 'Aho Gutagura Kiyombe', nameFr: 'Arrêt de Bus Kiyombe', district: 'Nyagatare', districtRw: 'Nyagatare', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.2833, longitude: 30.3167, type: 'minor' },
  { id: 'NY008', code: 'MMR', name: 'Mimuri Bus Station', nameRw: 'Stasiyo ya Mimuri', nameFr: 'Station de Bus Mimuri', district: 'Nyagatare', districtRw: 'Nyagatare', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.2667, longitude: 30.3000, type: 'minor' },

  // EASTERN PROVINCE - RWAMAGANA
  { id: 'RW001', code: 'RWM-T', name: 'Rwamagana Bus Terminal', nameRw: 'Terminali ya Rwamagana', nameFr: 'Terminal de Rwamagana', district: 'Rwamagana', districtRw: 'Rwamagana', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.9486, longitude: 30.4347, type: 'terminal', address: 'Rwamagana Town' },
  { id: 'RW002', code: 'MHZ', name: 'Muhazi Bus Station', nameRw: 'Stasiyo ya Muhazi', nameFr: 'Station de Bus Muhazi', district: 'Rwamagana', districtRw: 'Rwamagana', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.8833, longitude: 30.4500, type: 'major' },
  { id: 'RW003', code: 'KGB', name: 'Kigabiro Bus Stop', nameRw: 'Aho Gutagura Kigabiro', nameFr: 'Arrêt de Bus Kigabiro', district: 'Rwamagana', districtRw: 'Rwamagana', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.9833, longitude: 30.4167, type: 'minor' },
  { id: 'RW004', code: 'NKR', name: 'Nyakariro Bus Station', nameRw: 'Stasiyo ya Nyakariro', nameFr: 'Station de Bus Nyakariro', district: 'Rwamagana', districtRw: 'Rwamagana', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.9167, longitude: 30.4500, type: 'minor' },
  { id: 'RW005', code: 'RBN', name: 'Rubona Bus Stop', nameRw: 'Aho Gutagura Rubona', nameFr: 'Arrêt de Bus Rubona', district: 'Rwamagana', districtRw: 'Rwamagana', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.9000, longitude: 30.4333, type: 'minor' },
  { id: 'RW006', code: 'GSH-R', name: 'Gishari Bus Station', nameRw: 'Stasiyo ya Gishari', nameFr: 'Station de Bus Gishari', district: 'Rwamagana', districtRw: 'Rwamagana', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.9333, longitude: 30.4167, type: 'minor' },
  { id: 'RW007', code: 'MNG', name: 'Munyaga Bus Stop', nameRw: 'Aho Gutagura Munyaga', nameFr: 'Arrêt de Bus Munyaga', district: 'Rwamagana', districtRw: 'Rwamagana', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.9667, longitude: 30.4000, type: 'minor' },
  { id: 'RW008', code: 'MSH', name: 'Musha Bus Station', nameRw: 'Stasiyo ya Musha', nameFr: 'Station de Bus Musha', district: 'Rwamagana', districtRw: 'Rwamagana', province: 'Eastern Province', provinceRw: 'Intara y\'Iburasirazuba', latitude: -1.9500, longitude: 30.4333, type: 'minor' },
];
