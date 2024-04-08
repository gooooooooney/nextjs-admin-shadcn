import { env } from '@/env'
import { Resend } from 'resend'

export const resend = new Resend(env.RESEND_API_KEY)

export const domain = env.NEXT_PUBLIC_APP_URL
