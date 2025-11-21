import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorMapping {
  getUserError(code: string): string {
    const errorMapping: Record<string, string> = {
      NETWORK_ERROR: 'Network error, try again later.',
      SESSION_EXPIRED: 'Session expired, log in again.',
      USER_NOT_FOUND: 'User not found.',
      FILL_ALL_FIELDS: 'Please fill all the required fields.',
      INVALID_CREDENTIALS: 'Invalid credentials, try again.',
      INSERT_FAILED: 'Insert in database failed, try again.',
      AUTH_FAILED: 'Authentication failed, try again.',
      'auth/invalid-credentials': 'Invalid credentials',
      'auth/user-not-found': 'User not found',
      'auth/wrong-password': 'Wrong password',
      'auth/email-already-in-use': 'Email already in use',
      'auth/invalid-email': 'Invalid email',
      'auth/weak-password': 'Weak password',
      user_already_exists: 'Email already in use',
      invalid_credentials: 'Invalid email or password',
      UNKNOWN: 'Something went wrong, try again.',
    };

    return errorMapping[code] ?? errorMapping['UNKNOWN'];
  }
}
