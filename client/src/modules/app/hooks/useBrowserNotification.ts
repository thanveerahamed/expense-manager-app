import { useEffect } from 'react';
import { toast } from 'react-toastify';

import {
  getMessagingToken,
  subscribeForMessaging,
} from '../../../common/firebase/firebase';
import { UserDemographics } from '../../../common/types/user';
import { maybeSetDeviceInformation } from '../../../providers';

export const useBrowserNotification = (demographics?: UserDemographics) => {
  useEffect(() => {
    let unsubscribe = () => {};
    (async () => {
      if (demographics !== undefined && demographics !== null) {
        try {
          const messagingToken = await getMessagingToken();
          await maybeSetDeviceInformation(demographics.uid, messagingToken);
          subscribeForMessaging((message: any) => {
            toast(message.notification.title);
          });
        } catch (error: any) {
          console.log(error);
        }
      }
    })();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demographics]);
};
