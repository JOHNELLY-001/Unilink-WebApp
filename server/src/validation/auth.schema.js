import { z } from 'zod'

const nameField = z.string().trim().min(2, 'Must be at least 2 characters').max(100)
const passwordField = z.string().min(8, 'Password must be at least 8 characters').max(128)

export const registerSchema = z.object({
  firstName: nameField,
  lastName:  nameField,
  email:     z.string().trim().email('Invalid email address').max(255),
  phone:     z.string().trim().max(30).optional().or(z.literal('')),
  password:  passwordField,
  role:      z.enum(['student', 'mentor'], { message: 'Role must be student or mentor' }),
})

export const loginSchema = z.object({
  email:    z.string().trim().email('Invalid email address').max(255),
  password: z.string().min(1, 'Password is required').max(128),
})

export const googleAuthSchema = z.object({
  idToken: z.string().min(10, 'Google ID token is required'),
  role:    z.enum(['student', 'mentor']).optional(),
})

export const studentOnboardingSchema = z.object({
  school:             z.string().trim().max(255).optional().nullable(),
  form:               z.string().trim().max(20).optional().nullable(),
  region:             z.string().trim().max(100).optional().nullable(),
  combination:        z.string().trim().max(100).optional().nullable(),
  careerInterests:    z.array(z.string().trim().max(100)).max(20).optional(),
  targetUniversities: z.array(z.string().trim().max(255)).max(20).optional(),
  goals:              z.string().trim().max(2000).optional().nullable(),
  bio:                z.string().trim().max(2000).optional().nullable(),
})

export const mentorOnboardingSchema = z.object({
  title:           z.string().trim().max(255).optional().nullable(),
  company:         z.string().trim().max(255).optional().nullable(),
  field:           z.string().trim().max(100).optional().nullable(),
  yearsExperience: z.number().int().min(0).max(60).optional().nullable(),
  mentoringAreas:  z.array(z.string().trim().max(100)).max(20).optional(),
  sessionType:     z.string().trim().max(50).optional().nullable(),
  availability:    z.string().trim().max(255).optional().nullable(),
  hoursPerMonth:   z.number().int().min(0).max(200).optional().nullable(),
  bio:             z.string().trim().max(2000).optional().nullable(),
  linkedIn:        z.string().trim().url('Must be a valid URL').max(500).optional().or(z.literal('')).nullable(),
  portfolio:       z.string().trim().url('Must be a valid URL').max(500).optional().or(z.literal('')).nullable(),
})
