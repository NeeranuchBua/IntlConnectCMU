import { ApiError } from "@/types/api/apiError";
import { clsx, type ClassValue } from "clsx"
import { DateTime } from "luxon";
import { Session } from "next-auth";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toThaiYearDate(date: Date) {
  // Set the date in Bangkok timezone and adjust to the Buddhist year
  const thaiDate = DateTime.fromJSDate(date, { zone: 'Asia/Bangkok' });
  const thaiYear = thaiDate.year + 543;

  // Return a new DateTime with adjusted year
  return thaiDate.set({ year: thaiYear });
}

export function formatCustomDate(date: Date) {
  // Convert the date to Bangkok timezone and format
  const formattedDate = DateTime.fromJSDate(date, { zone: 'Asia/Bangkok' })
    .setLocale('th')
    .toFormat('dd/MM/yyyy');

  return formattedDate;
}

const THAI_TIMEZONE = 'Asia/Bangkok';

export function getThaiMonthName(dateString?: string): string {
  const date = dateString
    ? DateTime.fromISO(dateString, { zone: THAI_TIMEZONE })
    : DateTime.now().setZone(THAI_TIMEZONE);

  return date.setLocale('th').toFormat('LLLL');
}

export function getThaiMonthAndYear(dateString?: string): string {
  const date = dateString
    ? DateTime.fromISO(dateString, { zone: THAI_TIMEZONE })
    : DateTime.now().setZone(THAI_TIMEZONE);

  // Use Thai Buddhist year (by adding 543 to the Gregorian year)
  const thaiYear = date.year + 543;
  const thaiMonthName = date.setLocale('th').toFormat('LLLL');

  return `${thaiMonthName} ${thaiYear}`;
}

export function getThaiYear(dateString?: string): number {
  const date = dateString
    ? DateTime.fromISO(dateString, { zone: THAI_TIMEZONE })
    : DateTime.now().setZone(THAI_TIMEZONE);

  // Convert to Thai Buddhist year by adding 543
  return date.year + 543;
}

export function formatDateThai(date: Date) {
  const thaiDate = DateTime.fromJSDate(date, { zone: 'Asia/Bangkok' }).setLocale('en');
  const thaiYear = thaiDate.year + 543; // Adjust to Buddhist calendar year
  const thaiMonth = thaiDate.toFormat('MMMM'); // Month in Thai
  const thaiTime = thaiDate.toFormat('HH:mm'); // Time in 24-hour format

  return `${thaiDate.day} ${thaiMonth} ${thaiYear} ${thaiTime}`;
}

export function formatTime(date: Date) {
  const thaiTime = DateTime.fromJSDate(date, { zone: 'Asia/Bangkok' });
  return thaiTime.toFormat('HH:mm'); // Format as HH:mm for 24-hour time
}

export function generateCodeVerifier(): string {
  const array = new Uint32Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (val) => val.toString(36)).join("").slice(0, 128);
}

export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Use Array.from to convert Uint8Array to an iterable array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return btoa(
    hashArray.map((byte) => String.fromCharCode(byte)).join("")
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export interface AuthContext {
  session: Session;
}

export function getSessionFromContext(context: Partial<AuthContext>): AuthContext['session'] {
  if (!context.session) {
    throw ApiError.unauthorized('Session not found. Please log in.');
  }
  return context.session;
}

export function getUserFromContext(context: Partial<AuthContext>): Session['user'] {
  if (!context.session) {
    throw ApiError.unauthorized('Session not found. Please log in.');
  }
  return context.session.user;
}

export function getParam<T = string>(
  context: any,
  paramName: string,
  required: boolean = true
): T | undefined {
  const value = context?.params?.[paramName];

  if (required && !value) {
    throw ApiError.badRequest(`${paramName} is required`);
  }

  return value as T;
}

export function mapResourceForRBAC(paramName: string, resourceKey: string, uuid: boolean = false) {
  return (_: any, context: any) => {
      const value = context?.params?.[paramName];

      if (!value) {
          throw ApiError.badRequest(`${paramName} is required`);
      }

      return {
          [resourceKey]: {
              ...(uuid ? { 'uuid': value } : { 'name': value }),
          },
      };
  };
}