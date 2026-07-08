import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Mock schema representing Register validation
const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  role: z.enum(['FAN', 'VOLUNTEER', 'STAFF']),
});

describe('Authentication Unit & Validation Tests', () => {
  // Test 1: Zod validation succeeds with valid payloads
  it('should pass validation with a valid user signup payload', () => {
    const validPayload = {
      email: 'fan@worldcup.com',
      password: 'password123',
      name: 'Diego Maradona',
      role: 'FAN'
    };
    const result = RegisterSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  // Test 2: Zod validation fails with invalid email format
  it('should reject registration payloads with invalid emails', () => {
    const invalidPayload = {
      email: 'not-an-email',
      password: 'password123',
      name: 'Diego Maradona',
      role: 'FAN'
    };
    const result = RegisterSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Invalid email address');
    }
  });

  // Test 3: Zod validation fails with short passwords
  it('should reject registration payloads with short passwords (< 6 chars)', () => {
    const shortPasswordPayload = {
      email: 'fan@worldcup.com',
      password: '123',
      name: 'Diego Maradona',
      role: 'FAN'
    };
    const result = RegisterSchema.safeParse(shortPasswordPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('at least 6 characters');
    }
  });

  // Test 4: Password Hashing Verify
  it('should securely hash passwords and verify they match', async () => {
    const rawPass = 'fifaworldcup2026';
    const hash = await bcrypt.hash(rawPass, 12);
    
    expect(hash).not.toBe(rawPass);
    const isMatch = await bcrypt.compare(rawPass, hash);
    expect(isMatch).toBe(true);
    
    const isFail = await bcrypt.compare('wrongpassword', hash);
    expect(isFail).toBe(false);
  });

  // Test 5: JWT sign and decode check
  it('should correctly sign and verify access tokens containing roles', () => {
    const secret = 'test-secret-key-123';
    const payload = { id: 42, email: 'admin@stadium.iq', role: 'STAFF', name: 'Ops Chief' };
    
    const token = jwt.sign(payload, secret, { expiresIn: '15m' });
    expect(token).toBeDefined();

    const decoded = jwt.verify(token, secret) as typeof payload;
    expect(decoded.id).toBe(42);
    expect(decoded.role).toBe('STAFF');
    expect(decoded.name).toBe('Ops Chief');
  });
});
