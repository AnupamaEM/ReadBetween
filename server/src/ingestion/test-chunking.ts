import { ChunkingService } from './chunking.service';

const service = new ChunkingService();

const text = `
Membership fees are due on the 5th of every month.
A late payment fee of ₹250 will apply.
Cancellation requires 30 days notice.
Cancellation requests must be submitted through the member portal.
Memberships cannot be cancelled during the first 3 months.
The membership may be suspended if payment remains overdue.
`;

const chunks = service.chunkText(text);

console.log('\nTotal chunks:', chunks.length);

for (const chunk of chunks) {
  console.log('\n-------------------------');
  console.log('Chunk:', chunk.index);
  console.log('Length:', chunk.content.length);
  console.log(chunk.content);
}