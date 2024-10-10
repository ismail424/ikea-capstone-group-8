/* eslint-disable prefer-const */
import { produce } from 'sveltekit-sse';

interface Client {
    emit: (event: string, data: string) => void;
}

// It should not be a constant, as it will be mutated
let clients = new Set<Client>();

export function POST() {
  return produce(function start({ emit }) {
    const client = { emit };
    clients.add(client);

    return function stop() {
      clients.delete(client);
    };
  });
}

export async function PUT({ request }) {
  const { message } = await request.json();
  const notification = { message, timestamp: Date.now() };

  for (const client of clients) {
    client.emit('notification', JSON.stringify(notification));
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
