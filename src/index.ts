import express, { Request, Response } from 'express';

// Create Express application
const app = express();
const PORT = 8000;

// Middleware
app.use(express.json()); // JSON body parser middleware

// Root GET route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Hello from Express TypeScript server!',
    timestamp: new Date().toISOString()
  });
});

// Optional: Add a health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📝 Available routes:`);
  console.log(`   GET / - Returns welcome message`);
  console.log(`   GET /health - Health check endpoint`);
});

// Export the app for testing if needed
export default app;