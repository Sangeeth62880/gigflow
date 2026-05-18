import app from '@/app';
import { env } from '@/config/env';
import { connectDB, disconnectDB } from '@/config/db';

async function startServer(): Promise<void> {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`\n✓ GigFlow API running on port ${env.PORT}`);
    console.log(`  Environment: ${env.NODE_ENV}`);
    console.log(`  Health: http://localhost:${env.PORT}/api/health\n`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    server.close(async () => {
      await disconnectDB();
      console.log('✓ Server shut down gracefully');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('⚠ Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
