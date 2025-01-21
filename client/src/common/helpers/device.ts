export enum DeviceOS {
    Windows = 'windows',
    Android = 'android',
    IOs = 'ios',
    Unknown = 'unknown',
}

export const getMobileOperatingSystem = (): DeviceOS => {
    const userAgent = navigator.userAgent || navigator.vendor;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return DeviceOS.Windows;
    }

    if (/android/i.test(userAgent)) {
        return DeviceOS.Android;
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent)) {
        return DeviceOS.IOs;
    }

    return DeviceOS.Unknown;
};
