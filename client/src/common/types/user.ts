import {Timestamp} from 'firebase/firestore';

export interface DeviceInformation {
    userAgent: string;
    lastActiveAt: Timestamp;
}

export interface UserDemographics {
    email: string;
    name: string;
    uid: string;
}
