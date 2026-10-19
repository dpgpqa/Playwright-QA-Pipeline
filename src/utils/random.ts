import { randomBytes } from 'crypto';

const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
];

const STREETS = [
  'Main St', 'Oak Ave', 'Pine Rd', 'Elm Dr', 'Cedar Ln', 'Maple Blvd', 'Washington Ave',
  'Lincoln St', 'Jefferson Rd', 'Franklin Dr', 'Adams Ln', 'Madison Blvd', 'Monroe St',
  'Jackson Ave', 'Van Buren Rd', 'Harrison Dr', 'Tyler Ln', 'Polk Blvd', 'Taylor St',
];

const CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio',
  'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus',
  'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington',
];

const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN',
  'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV',
  'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN',
  'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

function randomElement<T>(arr: T[]): T {
  const index = randomBytes(1)[0] % arr.length;
  return arr[index];
}

function randomInt(min: number, max: number): number {
  const range = max - min + 1;
  const bytes = randomBytes(4);
  const value = bytes.readUInt32BE(0);
  return min + (value % range);
}

function randomString(length: number, charset = 'abcdefghijklmnopqrstuvwxyz'): string {
  const bytes = randomBytes(length);
  return Array.from(bytes, (b) => charset[b % charset.length]).join('');
}

export function randomFirstName(): string {
  return randomElement(FIRST_NAMES);
}

export function randomLastName(): string {
  return randomElement(LAST_NAMES);
}

export function randomFullName(): string {
  return `${randomFirstName()} ${randomLastName()}`;
}

export function randomEmail(domain = 'example.com'): string {
  const username = randomString(8) + randomInt(100, 9999);
  return `${username}@${domain}`;
}

export function randomAddress(): string {
  const number = randomInt(1, 9999);
  const street = randomElement(STREETS);
  return `${number} ${street}`;
}

export function randomCity(): string {
  return randomElement(CITIES);
}

export function randomState(): string {
  return randomElement(STATES);
}

export function randomZipCode(): string {
  return String(randomInt(10000, 99999));
}

export function randomPhone(): string {
  const areaCode = randomInt(200, 999);
  const prefix = randomInt(200, 999);
  const line = randomInt(1000, 9999);
  return `${areaCode}${prefix}${line}`;
}

export function randomProductName(): string {
  const adjectives = ['Premium', 'Deluxe', 'Standard', 'Pro', 'Ultra', 'Basic', 'Advanced'];
  const nouns = ['Widget', 'Gadget', 'Tool', 'Device', 'Kit', 'Set', 'Package'];
  return `${randomElement(adjectives)} ${randomElement(nouns)} ${randomInt(100, 999)}`;
}

export function randomPrice(min = 5, max = 500): number {
  return randomInt(min * 100, max * 100) / 100;
}

export function randomBoolean(): boolean {
  return randomBytes(1)[0] % 2 === 0;
}

export function randomDateString(): string {
  const year = randomInt(2024, 2026);
  const month = String(randomInt(1, 12)).padStart(2, '0');
  const day = String(randomInt(1, 28)).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
