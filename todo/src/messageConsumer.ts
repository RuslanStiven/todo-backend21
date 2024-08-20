import amqp from 'amqplib';

const RABBITMQ_URL = 'amqp://localhost';

export const startConsuming = async (queue: string) => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: true });
        console.log(`Waiting for messages in ${queue}...`);

        channel.consume(queue, (msg) => {
            if (msg !== null) {
                console.log(`Received message: ${msg.content.toString()}`);
                channel.ack(msg); // Подтвердить получение сообщения
            }
        }, { noAck: false });
    } catch (error) {
        console.error('Error consuming messages:', error);
    }
};