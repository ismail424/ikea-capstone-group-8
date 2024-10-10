import { writable } from 'svelte/store';

interface Notification {
  message: string;
  timestamp: number;
}

function createNotificationStore() {
  const { set, update } = writable<Notification[]>([]);

  return {
    add: (message: string) => {
      update(notifications => [...notifications, { message, timestamp: Date.now() }]);
      fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
    },
    clear: () => set([])
  };
}

export const notifications = createNotificationStore();