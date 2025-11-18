import { useEffect, useState } from 'react';

// 브라우저의 실제 PushSubscription 타입 사용
type BrowserPushSubscription = PushSubscription;

/**
 * Web Push API를 사용한 백그라운드 알림 관리
 */
export const useWebPush = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<BrowserPushSubscription | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Service Worker 등록
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      
      // Service Worker 등록
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker 등록 성공:', registration.scope);
          
          // 기존 구독 확인
          return registration.pushManager.getSubscription();
        })
        .then((sub) => {
          if (sub) {
            setSubscription(sub);
            setIsSubscribed(true);
            console.log('✅ 기존 Push 구독 발견');
          }
        })
        .catch((error) => {
          console.error('❌ Service Worker 등록 실패:', error);
        });
    } else {
      console.warn('⚠️ 이 브라우저는 Web Push를 지원하지 않습니다.');
      setIsSupported(false);
    }
  }, []);

  // Push 구독
  const subscribe = async (): Promise<BrowserPushSubscription | null> => {
    if (!isSupported) {
      console.warn('⚠️ Web Push를 지원하지 않습니다.');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // VAPID 공개 키 (백엔드에서 생성 필요)
      // 실제로는 백엔드에서 받아와야 함
      const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY'; // TODO: 백엔드에서 가져오기

      const vapidKey = urlBase64ToUint8Array(vapidPublicKey);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey.buffer as ArrayBuffer,
      });

      setSubscription(subscription);
      setIsSubscribed(true);
      console.log('✅ Push 구독 성공:', subscription);

      // 백엔드에 구독 정보 전송
      await sendSubscriptionToServer(subscription);

      return subscription;
    } catch (error) {
      console.error('❌ Push 구독 실패:', error);
      return null;
    }
  };

  // Push 구독 해제
  const unsubscribe = async (): Promise<boolean> => {
    if (!subscription) {
      return false;
    }

    try {
      const unsubscribed = await subscription.unsubscribe();
      
      if (unsubscribed) {
        setSubscription(null);
        setIsSubscribed(false);
        console.log('✅ Push 구독 해제 성공');
        
        // 백엔드에 구독 해제 알림
        await removeSubscriptionFromServer(subscription);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Push 구독 해제 실패:', error);
      return false;
    }
  };

  // VAPID 키 변환 (Base64 URL → Uint8Array)
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray as Uint8Array;
  };

  // 백엔드에 구독 정보 전송
  const sendSubscriptionToServer = async (sub: BrowserPushSubscription): Promise<void> => {
    try {
      // 구독 정보를 JSON으로 변환
      const subscriptionJson = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(sub.getKey('p256dh')!),
          auth: arrayBufferToBase64(sub.getKey('auth')!),
        },
      };
      
      // TODO: 백엔드 API 호출
      // await axios.post('/api/push/subscribe', { subscription: subscriptionJson });
      console.log('📤 구독 정보를 백엔드에 전송:', subscriptionJson);
    } catch (error) {
      console.error('❌ 구독 정보 전송 실패:', error);
    }
  };

  // 백엔드에서 구독 정보 제거
  const removeSubscriptionFromServer = async (sub: BrowserPushSubscription): Promise<void> => {
    try {
      // 구독 정보를 JSON으로 변환
      const subscriptionJson = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(sub.getKey('p256dh')!),
          auth: arrayBufferToBase64(sub.getKey('auth')!),
        },
      };
      
      // TODO: 백엔드 API 호출
      // await axios.post('/api/push/unsubscribe', { subscription: subscriptionJson });
      console.log('📤 구독 해제 정보를 백엔드에 전송:', subscriptionJson);
    } catch (error) {
      console.error('❌ 구독 해제 정보 전송 실패:', error);
    }
  };

  // ArrayBuffer를 Base64로 변환
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  return {
    isSupported,
    isSubscribed,
    subscription,
    subscribe,
    unsubscribe,
  };
};

