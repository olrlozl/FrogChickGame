import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

const initializeRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis 서버 연결 성공');
  } catch (error) {
    console.error('Redis 연결 실패:', error);
  }
};

process.on('SIGINT', async () => {
  await redisClient.quit(); // Redis 클라이언트 연결 종료
  console.log('Redis 클라이언트 연결 종료');
  process.exit(0); // 애플리케이션 종료
});

initializeRedis();

export default redisClient;
