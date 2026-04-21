import { z } from 'zod';

// FUTURE: field-level validation (email format, phone format, ZIP format)
export const referralFormSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName:  z.string().min(1, 'Required'),
  email:     z.string().min(1, 'Required'),
  phone:     z.string().min(1, 'Required'),
  address1:  z.string().min(1, 'Required'),
  city:      z.string().min(1, 'Required'),
  state:     z.string().min(1, 'Required'),
  zip:       z.string().min(1, 'Required'),
  useCase:   z.string().min(1, 'Required'),
  notes:     z.string(),
});

export type ReferralFormSchema = z.infer<typeof referralFormSchema>;

export function isFormComplete(data: Partial<ReferralFormSchema>): boolean {
  const required: (keyof ReferralFormSchema)[] = [
    'firstName', 'lastName', 'email', 'phone',
    'address1', 'city', 'state', 'zip', 'useCase',
  ];
  return required.every(field => typeof data[field] === 'string' && (data[field] as string).trim().length > 0);
}
