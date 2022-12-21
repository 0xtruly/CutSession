export interface MerchantSignUpDto {
    name: string;
    email: string;
    cityOfOperation: string;
    username: string;
    password: string;
    phoneNumber: string;
    metadata?: Record<string, string>
}

export interface UserSignupDto extends MerchantSignUpDto {
    dob: string;
}

export enum ACCESS_TYPE {
USER = 'USER',
MERCHANT = 'MERCHANT',
}

export enum STUDIO_SESSION_TYPE {
    WEEKDAY = 'WeekDay',
    WEEKEND = 'WeekEnd'
}

export type UserData = {
    merchantId: string,
    token: string,
    type: ACCESS_TYPE,
    userId: string,
}

export interface LoginDto {
    username: string;
    password: string;
    accessType: ACCESS_TYPE;
}

export type UserLoginResDto = {
    userId?: string,
    name: string,
    email: string,
    dob: string,
    phoneNumber: string,
    cityOfResidence?: string,
    cityOfOperation?: string,
    merchantId?: string
}

export type MerchantLoginResDto = {
    userId: string,
    name: string,
    email: string,
    dob: string,
    phoneNumber: string,
    cityOfResidence: string,
}

export type StudioSessionsResDto = {
    id: string,
    merchantId: string,
    endsAt: string,
    startsAt: string,
    type: STUDIO_SESSION_TYPE
}

export type CreateSessionDto = {
    startsAt: string,
    endsAt: string,
    type: STUDIO_SESSION_TYPE
}

export type SessionBookingDto = {
    sessionId: string,
    date: string,
    userId: string,
    notes: string,
    title: string,
}

export type BookedSessionDto = {
    city: string,
    merchant?: string,
    period?: string,
}

export type BookedSessionResDto = {
    bookingId: string,
    bookingRef: string,
    userId: string,
    sessionId: string,
    date: string,
    startsAt: string,
    endsAt: string,
    notes?: string,
    title?: string
}