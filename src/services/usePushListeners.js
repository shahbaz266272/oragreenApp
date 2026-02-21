import * as Notifications from "expo-notifications";
import { useEffect } from "react";

export function usePushListeners() {
  useEffect(() => {
    const r1 = Notifications.addNotificationReceivedListener((n) => {
      console.log("Foreground notification:", n);
    });

    const r2 = Notifications.addNotificationResponseReceivedListener((r) => {
      console.log("Tapped notification:", r.notification.request.content.data);
    });

    return () => {
      r1.remove();
      r2.remove();
    };
  }, []);
}
