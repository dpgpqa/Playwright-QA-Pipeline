import { z } from 'zod';
import {
  randomFirstName,
  randomLastName,
  randomEmail,
  randomAddress,
  randomCity,
  randomState,
  randomZipCode,
  randomPhone,
} from '../utils/random';

const ShippingSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().length(2),
  zipCode: z.string().regex(/^\d{5}$/),
  phone: z.string().regex(/^\d{10}$/),
});

export type ShippingInfo = z.infer<typeof ShippingSchema>;

export function createShippingInfo(overrides: Partial<ShippingInfo> = {}): ShippingInfo {
  const data = {
    firstName: randomFirstName(),
    lastName: randomLastName(),
    email: randomEmail(),
    address: randomAddress(),
    city: randomCity(),
    state: randomState(),
    zipCode: randomZipCode(),
    phone: randomPhone(),
    ...overrides,
  };
  return ShippingSchema.parse(data);
}

export function createMultipleShippingInfos(count: number): ShippingInfo[] {
  return Array.from({ length: count }, () => createShippingInfo());
}
