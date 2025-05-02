import {convertBase64ToUint8Array} from "./index";
import {subscribePushNotification, unsubscribePushNotification} from "../data/api";
import Swal from "sweetalert2";

export function isNotificationAvailable() {
    return 'Notification' in window;
}

export function isNotificationGranted() {
    return Notification.permission === 'granted';
}

export async function requestNotificationPermission() {
    if (!isNotificationAvailable()) {
        return false;
    }

    if (isNotificationGranted()) {
        return true;
    }

    const status = await Notification.requestPermission();

    if (status === 'denied') {
        await Swal.fire({
            icon: 'error',
            title: 'Izin Notifikasi ditolak.',
            confirmButtonText: 'Oke',
        })
        return false;
    }

    if (status === 'default') {
        await Swal.fire({
            icon: 'error',
            title: 'Izin Notifikasi ditutup atau diabaikan.',
            confirmButtonText: 'Oke',
        })
        return false;
    }

    return true;
}

export async function getPushSubscription() {
    if (!('serviceWorker' in navigator)) {
        return null;
    }
    
    try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
            return null;
        }
        return await registration.pushManager.getSubscription();
    } catch (error) {
        return null;
    }
}

export async function isCurrentPushSubscriptionAvailable() {
    const subscription = await getPushSubscription();
    return !!subscription;
}

export function generateSubscribeOptions() {
    return {
        userVisibleOnly: true,
        applicationServerKey: convertBase64ToUint8Array("BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"),
    };
}

export async function subscribe() {
    if (!(await requestNotificationPermission())) {
        return;
    }

    if (await isCurrentPushSubscriptionAvailable()) {
        await Swal.fire({
            icon: 'info',
            title: 'Sudah berlangganan push notification.',
            confirmButtonText: 'Oke',
        })
        return;
    }

    const failureSubscribeMessage = 'Push notification subscription failed to activate.';
    const successSubscribeMessage = 'Push notification subscription is successfully activated.';

    let pushSubscription;

    try {
        if (!('serviceWorker' in navigator)) {
            throw new Error('Service Worker tidak didukung di browser ini');
        }
        
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
            throw new Error('Service Worker belum teregistrasi');
        }
        
        pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());

        const { endpoint, keys  } = pushSubscription.toJSON();
        const response = await subscribePushNotification({ endpoint, keys });

        if (!response.ok) {
            await Swal.fire({
                icon: 'error',
                title: failureSubscribeMessage,
                confirmButtonText: 'Ok',
            })

            await pushSubscription.unsubscribe();

            return;
        }

        await Swal.fire({
            icon: 'success',
            title: successSubscribeMessage,
            confirmButtonText: 'Ok',
        })
    } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: failureSubscribeMessage,
            confirmButtonText: 'Ok',
        })
        if (pushSubscription) {
            await pushSubscription.unsubscribe();
        }
    }
}

export async function unsubscribe() {
    const failureUnsubscribeMessage = 'Langganan push notification gagal dinonaktifkan.';
    const successUnsubscribeMessage = 'Langganan push notification berhasil dinonaktifkan.';
    try {
        const pushSubscription = await getPushSubscription();
        if (!pushSubscription) {
            await Swal.fire({
                icon: 'info',
                title: 'Tidak bisa memutus langganan push notification karena belum berlangganan sebelumnya.',
                confirmButtonText: 'Ok',
            })
            return;
        }
        const { endpoint, keys } = pushSubscription.toJSON();
        const response = await unsubscribePushNotification({ endpoint });
        if (!response.ok) {
            await Swal.fire({
                icon: 'error',
                title: failureUnsubscribeMessage,
                confirmButtonText: 'Ok',
            })
            return;
        }
        const unsubscribed = await pushSubscription.unsubscribe();
        if (!unsubscribed) {
            await Swal.fire({
                icon: 'error',
                title: failureUnsubscribeMessage,
                confirmButtonText: 'Ok',
            })
            await subscribePushNotification({ endpoint, keys });
            return;
        }

        await Swal.fire({
            icon: 'success',
            title: successUnsubscribeMessage,
            confirmButtonText: 'Ok',
        })
    } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: failureUnsubscribeMessage,
            confirmButtonText: 'Ok',
        })
    }
}