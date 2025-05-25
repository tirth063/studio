
import type { Contact, FamilyGroup } from '@/types';

export const DUMMY_FAMILY_GROUPS: FamilyGroup[] = [
  // Top Level Society
  { id: 'patel-society', name: 'Patel Society', description: 'Main community group for several interconnected families' },

  // Savani Family Hierarchy
  { id: 'savani-family', name: 'Savani Parivar', parentId: 'patel-society', description: 'Savani kutumb general group' },
  { id: 'savani-bhavnagar-main', name: 'Savani - Bhavnagar Main Branch', parentId: 'savani-family', description: 'Core family residing in Bhavnagar city' },
  { id: 'savani-bhavnagar-extended', name: 'Savani - Bhavnagar Extended', parentId: 'savani-bhavnagar-main', description: 'Uncles, aunts, and cousins in Bhavnagar' },
  { id: 'savani-nanasurka-branch', name: 'Savani - Nanasurka Village Branch', parentId: 'savani-family', description: 'Family members based in Nanasurka village' },
  { id: 'savani-nanasurka-elders', name: 'Savani - Nanasurka Elders', parentId: 'savani-nanasurka-branch', description: 'Senior members in Nanasurka' },
  { id: 'savani-usa-branch', name: 'Savani - USA Branch', parentId: 'savani-family', description: 'Family members who have emigrated to the USA' },


  // Golakiya Family Hierarchy
  { id: 'golakiya-family', name: 'Golakiya Parivar', parentId: 'patel-society', description: 'Golakiya kutumb general group' },
  { id: 'golakiya-surat-main', name: 'Golakiya - Surat Main Branch', parentId: 'golakiya-family', description: 'Core family in Surat' },
  { id: 'golakiya-surat-relatives', name: 'Golakiya - Surat Relatives', parentId: 'golakiya-surat-main', description: 'Extended family and cousins in Surat' },
  { id: 'golakiya-canada-branch', name: 'Golakiya - Canada Branch', parentId: 'golakiya-family', description: 'Family members in Canada' },

  // Soni Family Hierarchy
  { id: 'soni-family', name: 'Soni Parivar', parentId: 'patel-society', description: 'Soni kutumb general group' },
  { id: 'soni-mumbai-main', name: 'Soni - Mumbai Main Household', parentId: 'soni-family', description: 'Primary Soni family in Mumbai' },
  { id: 'soni-mumbai-business', name: 'Soni - Mumbai Business Circle', parentId: 'soni-mumbai-main', description: 'Business associates of Soni family' },

  // Friends Groups
  { id: 'friends-inner-circle', name: 'Friends - Inner Circle', description: 'Closest friends group' },
  { id: 'friends-college-engineering', name: 'College Friends - Engineering (NIT Surat)', parentId: 'friends-inner-circle', description: 'Friends from engineering college days' },
  { id: 'friends-childhood-bhavnagar', name: 'Childhood Friends - Bhavnagar', parentId: 'friends-inner-circle', description: 'Friends from early school days in Bhavnagar' },
  { id: 'friends-sports-club', name: 'Friends - Sports Club', description: 'Friends from local sports activities' },

  // Professional Groups
  { id: 'prof-network-main', name: 'Professional Network', description: 'General work and career related contacts' },
  { id: 'prof-tech-solutions-inc', name: 'Colleagues - Tech Solutions Inc.', parentId: 'prof-network-main', description: 'Current and former colleagues at Tech Solutions Inc.' },
  { id: 'prof-teachers-vkm-school', name: 'Teachers - VKM High School', parentId: 'prof-network-main', description: 'School teachers remembered' },
  { id: 'prof-professors-nit-surat', name: 'Professors - NIT Surat', parentId: 'prof-network-main', description: 'College professors and mentors' },
  { id: 'prof-clients-various', name: 'Clients & Customers (Various)', parentId: 'prof-network-main', description: 'Key business clients and customers' },
  { id: 'prof-medical-contacts', name: 'Medical Professionals Network', parentId: 'prof-network-main', description: 'Doctors and healthcare contacts' },
  { id: 'prof-legal-financial-contacts', name: 'Legal & Financial Advisors', parentId: 'prof-network-main', description: 'Lawyers, CAs, financial planners' },
  
  // Other general groups
  { id: 'community-volunteers', name: 'Community Volunteers Group', description: 'People involved in local community service' },
  { id: 'service-providers', name: 'Local Service Providers', description: 'Electrician, plumber, etc.'}
];

export const DUMMY_CONTACTS: Contact[] = [
  // Savani Family Contacts - Bhavnagar Main Branch
  {
    id: 'contact-ramesh-savani',
    name: 'Rameshbhai Savani',
    phoneNumber: '9825011111',
    email: 'ramesh.savani@example.in',
    sources: ['sim', 'whatsapp'],
    groupIds: ['savani-family', 'savani-bhavnagar-main', 'patel-society'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Head of Bhavnagar Savani family. Retired textile businessman. Enjoys morning walks.',
    addresses: [
      { label: 'Home (Bhavnagar)', street: '101, "Ashirwad", Diamond Chowk', city: 'Bhavnagar', state: 'Gujarat', zip: '364001', country: 'India' }
    ],
    displayNames: [{ lang: 'gu', name: 'રમેશભાઈ સવાણી' }]
  },
  {
    id: 'contact-nita-savani',
    name: 'Nitaben Savani',
    phoneNumber: '9825011112',
    groupIds: ['savani-family', 'savani-bhavnagar-main', 'patel-society'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Rameshbhai\'s wife. Active in local Mahila Mandal.',
    addresses: [
      { label: 'Home (Bhavnagar)', street: '101, "Ashirwad", Diamond Chowk', city: 'Bhavnagar', state: 'Gujarat', zip: '364001', country: 'India' }
    ],
    displayNames: [{ lang: 'gu', name: 'નીતાબેન સવાણી' }]
  },
  {
    id: 'contact-priya-mehta-savani',
    name: 'Dr. Priya Mehta (Savani)',
    phoneNumber: '9727033333',
    email: 'priya.mehta.doc@example.in',
    sources: ['gmail', 'whatsapp'],
    groupIds: ['savani-family', 'savani-bhavnagar-main', 'patel-society', 'prof-network-main', 'prof-medical-contacts', 'community-volunteers'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Pediatrician. Rameshbhai\'s daughter. Married into Mehta family. Runs a charity clinic on weekends.',
    addresses: [
      { label: 'Clinic', street: 'Aashirwad Children Clinic, Waghawadi Road', city: 'Bhavnagar', state: 'Gujarat', zip: '364002', country: 'India' },
      { label: 'Home (Bhavnagar)', street: '101, "Ashirwad", Diamond Chowk', city: 'Bhavnagar', state: 'Gujarat', zip: '364001', country: 'India' }
    ],
    displayNames: [{ lang: 'gu', name: 'ડૉ. પ્રિયા મહેતા (સવાણી)' }]
  },
  {
    id: 'contact-rahul-savani',
    name: 'Rahul Savani',
    phoneNumber: '9624044444',
    email: 'rahul.s.eng@example.in',
    sources: ['whatsapp', 'gmail'],
    groupIds: ['savani-family', 'savani-bhavnagar-main', 'patel-society', 'prof-network-main', 'prof-tech-solutions-inc', 'friends-college-engineering', 'friends-sports-club'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Software Architect at Tech Solutions Inc. Rameshbhai\'s son. Passionate about AI and trekking.',
    addresses: [
      { label: 'Work (Ahmedabad)', street: '5th Floor, Alpha IT Park, SG Highway', city: 'Ahmedabad', state: 'Gujarat', zip: '380015', country: 'India' },
      { label: 'Apartment (Ahmedabad)', street: 'B-303, Skyview Heights, Bodakdev', city: 'Ahmedabad', state: 'Gujarat', zip: '380058', country: 'India'}
    ],
    alternativeNumbers: ['8800544444'],
    displayNames: [{ lang: 'gu', name: 'રાહુલ સવાણી' }, { lang: 'hi', name: 'राहुल सवाणी'}]
  },
  // Savani Family - Bhavnagar Extended
   {
    id: 'contact-manish-savani',
    name: 'Manishbhai Savani',
    phoneNumber: '9825122334',
    groupIds: ['savani-family', 'savani-bhavnagar-extended', 'patel-society'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Rameshbhai\'s younger brother. Owns a local grocery store.',
    addresses: [ { label: 'Store', street: 'Savani Kirana Store, Ghogha Circle', city: 'Bhavnagar', state: 'Gujarat', zip: '364001', country: 'India' } ]
  },
  {
    id: 'contact-rita-savani',
    name: 'Ritaben Savani',
    phoneNumber: '9825122335',
    groupIds: ['savani-family', 'savani-bhavnagar-extended', 'patel-society'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Manishbhai\'s wife. Teaches at a primary school.',
    groupIds_additional: ['prof-network-main'] // Example of adding to another top-level group
  },

  // Savani Family - Nanasurka Village Branch
  {
    id: 'contact-mukesh-savani-nanasurka',
    name: 'Mukeshbhai Savani (Nanasurka)',
    phoneNumber: '9925022222',
    email: 'mukesh.s.nanasurka@example.in',
    sources: ['sim', 'whatsapp'],
    groupIds: ['savani-family', 'savani-nanasurka-branch', 'savani-nanasurka-elders','patel-society'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Cousin of Rameshbhai. Manages family farms in Nanasurka. Village Panchayat member.',
    addresses: [
      { label: 'Home (Nanasurka)', street: 'Savani Faliyu, Near Ramji Mandir', city: 'Nanasurka', state: 'Gujarat', zip: '364060', country: 'India' }
    ]
  },
  {
    id: 'contact-aarav-savani-nanasurka',
    name: 'Aarav Savani',
    phoneNumber: '9586055555',
    groupIds: ['savani-family', 'savani-nanasurka-branch', 'patel-society', 'friends-childhood-bhavnagar', 'friends-college-engineering'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Mukeshbhai\'s son. Studying Agricultural Engineering in Anand.',
    addresses: [
      { label: 'College Hostel (Anand)', street: 'Room 12, Sardar Patel Hall', city: 'Anand', state: 'Gujarat', zip: '388121', country: 'India' }
    ]
  },
  // Savani USA Branch
  {
    id: 'contact-neha-patel-savani-usa',
    name: 'Neha Patel (Savani)',
    phoneNumber: '+1-123-456-7890',
    email: 'neha.patel.usa@example.com',
    sources: ['gmail', 'whatsapp'],
    groupIds: ['savani-family', 'savani-usa-branch', 'patel-society', 'prof-network-main'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Rameshbhai\'s niece. Works as a Data Scientist in California.',
    addresses: [ {label: 'Home (USA)', street: '100 Main Street', city: 'San Jose', state: 'CA', zip: '95101', country: 'USA'}]
  },


  // Golakiya Family Contacts - Surat Main Branch
  {
    id: 'contact-ashok-golakiya',
    name: 'Ashokbhai Golakiya',
    phoneNumber: '9879012345',
    email: 'ashok.g@example.in',
    sources: ['sim', 'whatsapp'],
    groupIds: ['golakiya-family', 'golakiya-surat-main', 'patel-society', 'prof-clients-various', 'community-volunteers'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Prominent hardware merchant in Surat. Known for philanthropy.',
    addresses: [
      { label: 'Main Store (Surat)', street: 'Golakiya Hardware Mart, Ring Road', city: 'Surat', state: 'Gujarat', zip: '395002', country: 'India' },
      { label: 'Residence (Surat)', street: 'A-1, Vesu Residency, Vesu', city: 'Surat', state: 'Gujarat', zip: '395007', country: 'India' }
    ],
    displayNames: [{ lang: 'gu', name: 'અશોકભાઈ ગોળકિયા' }]
  },
  {
    id: 'contact-meena-golakiya',
    name: 'Meenaben Golakiya',
    phoneNumber: '9879012346',
    groupIds: ['golakiya-family', 'golakiya-surat-main', 'patel-society'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Ashokbhai\'s wife. Manages household and social activities.',
     addresses: [
      { label: 'Residence (Surat)', street: 'A-1, Vesu Residency, Vesu', city: 'Surat', state: 'Gujarat', zip: '395007', country: 'India' }
    ]
  },
  {
    id: 'contact-deepak-golakiya',
    name: 'Deepak Golakiya',
    phoneNumber: '9712067890',
    email: 'deepak.golakiya.dev@example.in',
    sources: ['gmail', 'whatsapp'],
    groupIds: ['golakiya-family', 'golakiya-surat-relatives', 'patel-society', 'prof-tech-solutions-inc', 'friends-college-engineering'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Ashokbhai\'s nephew. Works at Tech Solutions Inc. with Rahul. Lives in Ahmedabad.',
    addresses: [
      { label: 'Work (Ahmedabad)', street: '5th Floor, Alpha IT Park, SG Highway', city: 'Ahmedabad', state: 'Gujarat', zip: '380015', country: 'India' },
      { label: 'Rented Flat (Ahmedabad)', street: 'C-707, Galaxy Towers, Prahladnagar', city: 'Ahmedabad', state: 'Gujarat', zip: '380015', country: 'India' }
    ]
  },
  // Golakiya Canada Branch
  {
    id: 'contact-riya-shah-golakiya-canada',
    name: 'Riya Shah (Golakiya)',
    phoneNumber: '+1-647-123-4567',
    email: 'riya.shah.ca@example.com',
    groupIds: ['golakiya-family', 'golakiya-canada-branch', 'patel-society', 'prof-network-main', 'prof-legal-financial-contacts'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Ashokbhai\'s niece. Chartered Accountant in Toronto.',
    addresses: [ {label: 'Office (Canada)', street: 'Suite 500, Bay Street', city: 'Toronto', state: 'ON', zip: 'M5H 2Y2', country: 'Canada'}]
  },

  // Soni Family Contacts - Mumbai Main Household
  {
    id: 'contact-hitesh-soni',
    name: 'Hitesh Soni',
    phoneNumber: '9426054321',
    email: 'hsoni.jewellers@example.com',
    sources: ['sim'],
    groupIds: ['soni-family', 'soni-mumbai-main', 'patel-society', 'prof-clients-various', 'soni-mumbai-business'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Owner of Soni & Sons Jewellers in Zaveri Bazaar, Mumbai.',
    addresses: [
      { label: 'Jewellery Shop (Mumbai)', street: '12, Zaveri Bazaar', city: 'Mumbai', state: 'Maharashtra', zip: '400002', country: 'India' },
      { label: 'Home (Mumbai)', street: 'Soni Villa, Juhu Scheme', city: 'Mumbai', state: 'Maharashtra', zip: '400049', country: 'India'}
    ],
    displayNames: [{ lang: 'hi', name: 'हितेश सोनी'}]
  },
  {
    id: 'contact-kavita-soni',
    name: 'Kavitaben Soni',
    phoneNumber: '9426054322',
    groupIds: ['soni-family', 'soni-mumbai-main', 'patel-society'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Hiteshbhai\'s wife. Designs jewellery.',
    addresses: [ { label: 'Home (Mumbai)', street: 'Soni Villa, Juhu Scheme', city: 'Mumbai', state: 'Maharashtra', zip: '400049', country: 'India'}]
  },
  {
    id: 'contact-chirag-soni',
    name: 'Chirag Soni',
    phoneNumber: '9321098765',
    email: 'chirag.soni.mba@example.com',
    groupIds: ['soni-family', 'soni-mumbai-main', 'patel-society', 'soni-mumbai-business', 'prof-network-main'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Hiteshbhai\'s son. MBA, helps in family business. Looks after marketing.',
  },


  // Friends Contacts
  {
    id: 'contact-tirth-shah',
    name: 'Tirth Shah',
    phoneNumber: '9099010101',
    email: 'tirth.shah@example.com',
    sources: ['whatsapp', 'gmail'],
    groupIds: ['friends-inner-circle', 'friends-college-engineering', 'prof-tech-solutions-inc'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Rahul\'s college batchmate and close friend. Senior Developer at a startup.',
    displayNames: [{ lang: 'gu', name: 'તીર્થ શાહ' }]
  },
  {
    id: 'contact-jay-patel-friend',
    name: 'Jay Patel (Friend)', // Differentiating from other Patels
    phoneNumber: '9099020202',
    sources: ['whatsapp'],
    groupIds: ['friends-inner-circle', 'friends-college-engineering', 'friends-sports-club'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Plays badminton with Rahul. Works in an MNC.',
  },
  {
    id: 'contact-fenil-mehta-friend',
    name: 'Fenil Mehta',
    phoneNumber: '9099030303',
    email: 'fenil.m@example.com',
    groupIds: ['friends-inner-circle', 'friends-childhood-bhavnagar'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Rahul\'s childhood friend from Bhavnagar. Runs a travel agency.',
    addresses: [{label: 'Office', street: 'Mehta Travels, Crescent Circle', city: 'Bhavnagar', state: 'Gujarat', zip: '364001', country: 'India'}]
  },
  {
    id: 'contact-vansh-dave',
    name: 'Vansh Dave',
    phoneNumber: '9099040404',
    groupIds: ['friends-inner-circle', 'friends-college-engineering'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Another friend from NIT Surat. Currently pursuing MS in Germany.',
    addresses: [{label: 'Current (Germany)', city: 'Berlin', country: 'Germany'}]
  },
  {
    id: 'contact-suresh-kumar-friend',
    name: 'Suresh Kumar',
    phoneNumber: '9099050505',
    groupIds: ['friends-sports-club', 'community-volunteers'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Met at a community marathon event. Fitness enthusiast.'
  },
  {
    id: 'contact-yash-joshi',
    name: 'Yash Joshi',
    phoneNumber: '9099060606',
    email: 'yash.j.writer@example.org',
    groupIds: ['friends-college-engineering', 'prof-network-main'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Freelance technical writer. Collaborates on projects sometimes.'
  },
  {
    id: 'contact-harsh-pandya',
    name: 'Harsh Pandya',
    phoneNumber: '9099070707',
    groupIds: ['friends-childhood-bhavnagar', 'friends-sports-club'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Owns a popular cafe in Bhavnagar.'
  },
  {
    id: 'contact-shreeja-iyer',
    name: 'Shreeja Iyer',
    phoneNumber: '9099080808',
    email: 'shreeja.iyer@techsolutions.com',
    sources: ['gmail', 'whatsapp'],
    groupIds: ['friends-college-engineering', 'prof-tech-solutions-inc', 'prof-network-main'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Team Lead at Tech Solutions Inc. Rahul\'s mentor.',
    displayNames: [{ lang: 'hi', name: 'श्रीजा अय्यर'}]
  },
  {
    id: 'contact-diya-sharma',
    name: 'Diya Sharma',
    phoneNumber: '9099090909',
    groupIds: ['friends-childhood-bhavnagar'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Fashion designer. Lives in Mumbai now.',
    addresses: [{label: 'Studio (Mumbai)', street: 'Fashion Street, Andheri', city: 'Mumbai', state: 'Maharashtra', zip: '400053', country: 'India'}]
  },

  // Professional Contacts
  {
    id: 'contact-prof-anil-kumar',
    name: 'Professor Anil Kumar',
    phoneNumber: '9820012345',
    email: 'anil.kumar.prof@nits.ac.in',
    groupIds: ['prof-network-main', 'prof-professors-nit-surat'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Rahul\'s Head of Department for Computer Engineering at NIT Surat. Very supportive.',
    addresses: [{label: 'Office (NIT Surat)', street: 'Dept. of Computer Engg, NIT Campus', city: 'Surat', state: 'Gujarat', zip: '395007', country: 'India'}]
  },
  {
    id: 'contact-mrs-kulkarni',
    name: 'Mrs. Kulkarni',
    phoneNumber: '9427056789',
    groupIds: ['prof-network-main', 'prof-teachers-vkm-school'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Rahul\'s favorite Math teacher from VKM High School, Bhavnagar.',
  },
  {
    id: 'contact-mr-vikram-singh-client',
    name: 'Mr. Vikram Singh (Client)',
    phoneNumber: '9327011223',
    email: 'vikram.singh@singhenterprises.com',
    groupIds: ['prof-clients-various', 'prof-network-main'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'CEO of Singh Enterprises. Key client for Tech Solutions Inc. project.',
    addresses: [{label: 'Head Office', street: 'Singh Tower, Nariman Point', city: 'Mumbai', state: 'Maharashtra', zip: '400021', country: 'India'}]
  },
  {
    id: 'contact-vijay-verma-colleague',
    name: 'Vijay Verma',
    phoneNumber: '9988776655',
    email: 'vijay.verma@techsolutions.com',
    sources: ['gmail'],
    groupIds: ['prof-tech-solutions-inc', 'prof-network-main', 'friends-sports-club'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Senior Database Administrator at Tech Solutions Inc. Plays for company cricket team.'
  },
  {
    id: 'contact-dr-alpa-joshi',
    name: 'Dr. Alpa Joshi',
    phoneNumber: '9898012345',
    email: 'alpa.joshi.md@lifecare.com',
    groupIds: ['prof-medical-contacts', 'prof-network-main', 'community-volunteers'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'General Physician. Family doctor for many in the community.',
    addresses: [{label: 'Clinic', street: 'Lifecare Clinic, Opp. Town Hall', city: 'Ahmedabad', state: 'Gujarat', zip: '380006', country: 'India'}]
  },
  {
    id: 'contact-adv-sanjay-mehta',
    name: 'Advocate Sanjay Mehta',
    phoneNumber: '9765012345',
    email: 'sanjay.mehta.law@firm.com',
    groupIds: ['prof-legal-financial-contacts', 'prof-network-main'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Corporate Lawyer. Provides legal consultation.',
    addresses: [{label: 'Law Office', street: 'Justice Chambers, Ashram Road', city: 'Ahmedabad', state: 'Gujarat', zip: '380009', country: 'India'}]
  },

  // Generic Contacts & Service Providers
   {
    id: 'contact-alok-nath-community',
    name: 'Alok Nath Sharma',
    phoneNumber: '8880001111',
    groupIds: ['patel-society', 'community-volunteers'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Active community member, helps organize events.'
  },
  {
    id: 'contact-sunita-gandhi-sports',
    name: 'Sunita Gandhi',
    phoneNumber: '8880002222',
    email: 'sunita.g.sports@example.com',
    groupIds: ['golakiya-surat-relatives', 'friends-sports-club', 'patel-society'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Yoga instructor and friend of Meenaben Golakiya.'
  },
  {
    id: 'contact-mohan-joshi-electrician',
    name: 'Mohan Joshi (Electrician)',
    phoneNumber: '8880003333',
    groupIds: ['service-providers'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Reliable electrician for home repairs.'
  },
   {
    id: 'contact-chetna-vyas-canada',
    name: 'Chetna Vyas',
    phoneNumber: '7770001111',
    email: 'chetna.vyas.ca@example.com',
    groupIds: ['savani-family', 'savani-usa-branch', 'patel-society'], // Assuming she is related to USA branch due to emigration.
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Priya\'s cousin, immigrated to Canada. Works in IT support.',
    addresses: [{label: 'Home (Canada)', street: 'Apartment 1502, Maple Drive', city: 'Toronto', state: 'ON', zip: 'M5V 2E8', country: 'Canada'}]
  },
  {
    id: 'contact-rajesh-mehta-textiles',
    name: 'Rajesh Mehta (Textiles)',
    phoneNumber: '7770002222',
    email: 'rajesh.mehta.textiles@example.com',
    groupIds: ['prof-clients-various', 'prof-network-main', 'soni-mumbai-business'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Owns a large textile manufacturing unit. Business associate of Hitesh Soni.'
  },
   {
    id: 'contact-kiran-desai-baker',
    name: 'Kiran Desai (Baker)',
    phoneNumber: '6660001111',
    groupIds: ['friends-childhood-bhavnagar', 'prof-clients-various'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Childhood friend, now runs a popular bakery in Bhavnagar. "Kiran\'s Cakes & Bakes"',
    addresses: [{label: 'Bakery', street: 'Shop No. 5, Foodies Lane', city: 'Bhavnagar', state: 'Gujarat', zip: '364002', country: 'India'}]
  },
  {
    id: 'contact-ganesh-plumber',
    name: 'Ganesh (Plumber)',
    phoneNumber: '9123456789',
    groupIds: ['service-providers'],
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Local plumber, very efficient.'
  },
  {
    id: 'contact-sunil-watchman',
    name: 'Sunilbhai (Watchman)',
    phoneNumber: '9900112233',
    groupIds: ['service-providers', 'patel-society'], // Part of the society staff
    avatarUrl: 'https://placehold.co/100x100.png',
    notes: 'Night watchman for Patel Society area.'
  }
];
