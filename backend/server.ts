/**
 * FINPILOT Backend Server
 * Main Express server with all API routes for the financial management app
 * Handles authentication, transactions, jars, goals, assets, AI insights, and more
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

// Load environment variables
dotenv.config();

// Initialize Express app and Prisma
const app: Express = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
interface AuthRequest extends Request {
  userId?: string;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ==================== AUTH ROUTES ====================

/**
 * POST /api/auth/register
 * Register a new user with email and password
 */
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
      },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * POST /api/auth/login
 * Login user with email and password
 */
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ==================== DASHBOARD ROUTES ====================

/**
 * GET /api/dashboard
 * Get dashboard data: balance, stats, recent transactions, alerts
 */
app.get('/api/dashboard', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    // Get user
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Get all transactions for current month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: monthStart },
      },
    });

    // Calculate balance and stats
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    const balance = income - expenses;

    // Get jars
    const jars = await prisma.jar.findMany({ where: { userId } });
    const jarsFunded = jars.filter(j => Number(j.currentAmount) > 0).length;

    // Get goals
    const goals = await prisma.goal.findMany({ where: { userId } });
    const goalsProgress = goals.length > 0
      ? (goals.filter(g => Number(g.currentAmount) > 0).length / goals.length) * 100
      : 0;

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
    });

    // Get alerts
    const alerts = await prisma.alert.findMany({
      where: { userId, dismissed: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    res.json({
      user,
      balance,
      income,
      expenses,
      stats: {
        jarsFunded,
        goalsProgress,
        transactionCount: transactions.length,
      },
      recentTransactions,
      alerts,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// ==================== TRANSACTION ROUTES ====================

/**
 * GET /api/transactions
 * Get all transactions with pagination and filters
 */
app.get('/api/transactions', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { page = 1, limit = 20, category, type, startDate, endDate } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build filter
    const where: any = { userId };
    if (category) where.category = category;
    if (type) where.type = type;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      skip,
      take: Number(limit),
    });

    const total = await prisma.transaction.count({ where });

    res.json({
      transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Transactions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

/**
 * POST /api/transactions
 * Create a new transaction
 */
app.post('/api/transactions', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { title, description, amount, category, type, paymentMethod, date, jarId, goalId } = req.body;

    // Validate required fields
    if (!title || !amount || !category || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        title,
        description,
        amount: Number(amount),
        category,
        type,
        paymentMethod,
        date: new Date(date || new Date()),
        jarId,
        goalId,
      },
    });

    // Update jar or goal amount if applicable
    if (jarId && type === 'expense') {
      await prisma.jar.update({
        where: { id: jarId },
        data: { currentAmount: { increment: Math.abs(Number(amount)) } },
      });
    }

    if (goalId && type === 'expense') {
      await prisma.goal.update({
        where: { id: goalId },
        data: { currentAmount: { increment: Math.abs(Number(amount)) } },
      });
    }

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

/**
 * DELETE /api/transactions/:id
 * Delete a transaction
 */
app.delete('/api/transactions/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Verify ownership
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction || transaction.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete transaction
    await prisma.transaction.delete({ where: { id } });

    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error('Transaction deletion error:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// ==================== JAR ROUTES ====================

/**
 * GET /api/jars
 * Get all jars for user
 */
app.get('/api/jars', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const jars = await prisma.jar.findMany({
      where: { userId },
      include: {
        transactions: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
    });

    // Calculate progress and days left for each jar
    const jarsWithProgress = jars.map(jar => ({
      ...jar,
      progress: (Number(jar.currentAmount) / Number(jar.targetAmount)) * 100,
      dailyRecommended: Number(jar.targetAmount) / 30, // Simplified: 30 days
    }));

    res.json(jarsWithProgress);
  } catch (error) {
    console.error('Jars fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch jars' });
  }
});

/**
 * POST /api/jars
 * Create a new jar
 */
app.post('/api/jars', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, description, targetAmount, color, icon } = req.body;

    if (!name || !targetAmount) {
      return res.status(400).json({ error: 'Name and target amount required' });
    }

    const jar = await prisma.jar.create({
      data: {
        userId,
        name,
        description,
        targetAmount: Number(targetAmount),
        color: color || '#3B82F6',
        icon,
      },
    });

    res.status(201).json(jar);
  } catch (error) {
    console.error('Jar creation error:', error);
    res.status(500).json({ error: 'Failed to create jar' });
  }
});

/**
 * PUT /api/jars/:id
 * Update jar
 */
app.put('/api/jars/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { name, description, targetAmount, color, icon, currentAmount } = req.body;

    // Verify ownership
    const jar = await prisma.jar.findUnique({ where: { id } });
    if (!jar || jar.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedJar = await prisma.jar.update({
      where: { id },
      data: {
        name: name || jar.name,
        description: description !== undefined ? description : jar.description,
        targetAmount: targetAmount ? Number(targetAmount) : jar.targetAmount,
        color: color || jar.color,
        icon: icon !== undefined ? icon : jar.icon,
        currentAmount: currentAmount !== undefined ? Number(currentAmount) : jar.currentAmount,
      },
    });

    res.json(updatedJar);
  } catch (error) {
    console.error('Jar update error:', error);
    res.status(500).json({ error: 'Failed to update jar' });
  }
});

/**
 * DELETE /api/jars/:id
 * Delete jar
 */
app.delete('/api/jars/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Verify ownership
    const jar = await prisma.jar.findUnique({ where: { id } });
    if (!jar || jar.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.jar.delete({ where: { id } });

    res.json({ message: 'Jar deleted' });
  } catch (error) {
    console.error('Jar deletion error:', error);
    res.status(500).json({ error: 'Failed to delete jar' });
  }
});

// ==================== GOAL ROUTES ====================

/**
 * GET /api/goals
 * Get all goals for user
 */
app.get('/api/goals', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const goals = await prisma.goal.findMany({
      where: { userId },
      include: {
        transactions: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
    });

    // Calculate progress and monthly required saving
    const goalsWithProgress = goals.map(goal => {
      const progress = (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100;
      const daysLeft = Math.ceil(
        (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      const monthlyRequired = daysLeft > 0
        ? Number(goal.targetAmount - goal.currentAmount) / (daysLeft / 30)
        : 0;

      return {
        ...goal,
        progress,
        daysLeft,
        monthlyRequired,
        feasible: monthlyRequired > 0,
      };
    });

    res.json(goalsWithProgress);
  } catch (error) {
    console.error('Goals fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

/**
 * POST /api/goals
 * Create a new goal
 */
app.post('/api/goals', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { title, description, targetAmount, category, priority, startDate, targetDate } = req.body;

    if (!title || !targetAmount || !targetDate) {
      return res.status(400).json({ error: 'Title, target amount, and target date required' });
    }

    const goal = await prisma.goal.create({
      data: {
        userId,
        title,
        description,
        targetAmount: Number(targetAmount),
        category: category || 'general',
        priority: priority || 'medium',
        startDate: new Date(startDate || new Date()),
        targetDate: new Date(targetDate),
      },
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error('Goal creation error:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

/**
 * PUT /api/goals/:id
 * Update goal
 */
app.put('/api/goals/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { title, description, targetAmount, category, priority, status, currentAmount, targetDate } = req.body;

    // Verify ownership
    const goal = await prisma.goal.findUnique({ where: { id } });
    if (!goal || goal.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        title: title || goal.title,
        description: description !== undefined ? description : goal.description,
        targetAmount: targetAmount ? Number(targetAmount) : goal.targetAmount,
        category: category || goal.category,
        priority: priority || goal.priority,
        status: status || goal.status,
        currentAmount: currentAmount !== undefined ? Number(currentAmount) : goal.currentAmount,
        targetDate: targetDate ? new Date(targetDate) : goal.targetDate,
      },
    });

    res.json(updatedGoal);
  } catch (error) {
    console.error('Goal update error:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// ==================== ASSET ROUTES ====================

/**
 * GET /api/assets
 * Get all assets for user
 */
app.get('/api/assets', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const assets = await prisma.asset.findMany({
      where: { userId },
      orderBy: { gainLossPercent: 'desc' },
    });

    res.json(assets);
  } catch (error) {
    console.error('Assets fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

/**
 * POST /api/assets
 * Create a new asset
 */
app.post('/api/assets', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, symbol, type, quantity, buyPrice, currentPrice } = req.body;

    if (!name || !symbol || !quantity || !buyPrice || !currentPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const totalValue = Number(quantity) * Number(currentPrice);
    const gainLoss = totalValue - (Number(quantity) * Number(buyPrice));
    const gainLossPercent = ((gainLoss / (Number(quantity) * Number(buyPrice))) * 100);

    const asset = await prisma.asset.create({
      data: {
        userId,
        name,
        symbol,
        type: type || 'stock',
        quantity: Number(quantity),
        buyPrice: Number(buyPrice),
        currentPrice: Number(currentPrice),
        totalValue: totalValue,
        gainLoss: gainLoss,
        gainLossPercent: gainLossPercent,
      },
    });

    res.status(201).json(asset);
  } catch (error) {
    console.error('Asset creation error:', error);
    res.status(500).json({ error: 'Failed to create asset' });
  }
});

// ==================== PORTFOLIO ROUTES ====================

/**
 * GET /api/portfolio
 * Get portfolio summary
 */
app.get('/api/portfolio', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    // Get all assets
    const assets = await prisma.asset.findMany({ where: { userId } });

    // Calculate portfolio totals
    const totalValue = assets.reduce((sum, asset) => sum + Number(asset.totalValue), 0);
    const totalGainLoss = assets.reduce((sum, asset) => sum + Number(asset.gainLoss), 0);
    const dailyPnLPercent = totalValue > 0 ? (totalGainLoss / totalValue) * 100 : 0;

    // Get or create portfolio record
    let portfolio = await prisma.portfolio.findFirst({ where: { userId } });

    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: {
          userId,
          totalValue: totalValue,
          dailyPnL: totalGainLoss,
          dailyPnLPercent: dailyPnLPercent,
          allocationJson: JSON.stringify({}),
        },
      });
    } else {
      portfolio = await prisma.portfolio.update({
        where: { id: portfolio.id },
        data: {
          totalValue: totalValue,
          dailyPnL: totalGainLoss,
          dailyPnLPercent: dailyPnLPercent,
        },
      });
    }

    // Calculate allocation
    const allocation = assets.reduce((acc: any, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + Number(asset.totalValue);
      return acc;
    }, {});

    res.json({
      portfolio,
      assets,
      allocation,
      topGainers: assets.sort((a, b) => Number(b.gainLossPercent) - Number(a.gainLossPercent)).slice(0, 3),
      topLosers: assets.sort((a, b) => Number(a.gainLossPercent) - Number(b.gainLossPercent)).slice(0, 3),
    });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// ==================== ALERT ROUTES ====================

/**
 * GET /api/alerts
 * Get all alerts for user
 */
app.get('/api/alerts', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const alerts = await prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(alerts);
  } catch (error) {
    console.error('Alerts fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

/**
 * PUT /api/alerts/:id
 * Mark alert as read or dismissed
 */
app.put('/api/alerts/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { read, dismissed } = req.body;

    // Verify ownership
    const alert = await prisma.alert.findUnique({ where: { id } });
    if (!alert || alert.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedAlert = await prisma.alert.update({
      where: { id },
      data: {
        read: read !== undefined ? read : alert.read,
        dismissed: dismissed !== undefined ? dismissed : alert.dismissed,
      },
    });

    res.json(updatedAlert);
  } catch (error) {
    console.error('Alert update error:', error);
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

// ==================== AI INSIGHTS ROUTES ====================

/**
 * GET /api/ai-insights
 * Get AI insights for user
 */
app.get('/api/ai-insights', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { type } = req.query;

    const where: any = { userId };
    if (type) where.type = type;

    const insights = await prisma.aiInsight.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(insights);
  } catch (error) {
    console.error('AI insights fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch AI insights' });
  }
});

// ==================== CHAT ROUTES ====================

/**
 * GET /api/chat/messages
 * Get chat history
 */
app.get('/api/chat/messages', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const messages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });

    res.json(messages);
  } catch (error) {
    console.error('Chat messages fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch chat messages' });
  }
});

/**
 * POST /api/chat/messages
 * Send a chat message
 */
app.post('/api/chat/messages', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { content, role = 'user' } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content required' });
    }

    // Save user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        userId,
        role: 'user',
        content,
      },
    });

    // Generate AI response (simplified - in production, use actual AI service)
    const suggestedPrompts = [
      'Show me spending trends',
      'How can I save more?',
      'What are my financial goals?',
    ];

    const assistantMessage = await prisma.chatMessage.create({
      data: {
        userId,
        role: 'assistant',
        content: `I'm analyzing your financial data. ${content}`,
        suggestedPrompts: JSON.stringify(suggestedPrompts),
        responseType: 'card',
      },
    });

    res.status(201).json({
      userMessage,
      assistantMessage,
    });
  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ==================== SMS PARSER ROUTES ====================

/**
 * POST /api/sms/parse
 * Parse SMS and extract transaction data
 */
app.post('/api/sms/parse', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { smsText, sender } = req.body;

    if (!smsText) {
      return res.status(400).json({ error: 'SMS text required' });
    }

    // Simple SMS parsing logic (in production, use NLP)
    const amountMatch = smsText.match(/₹\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;

    // Determine transaction type
    const isIncome = /credited|received|salary|payment/i.test(smsText);
    const type = isIncome ? 'income' : 'expense';

    // Categorize
    let category = 'Other';
    if (/food|restaurant|cafe/i.test(smsText)) category = 'Food';
    else if (/fuel|petrol|gas|transport/i.test(smsText)) category = 'Transport';
    else if (/bill|electricity|water|internet/i.test(smsText)) category = 'Utilities';
    else if (/shopping|store|mall/i.test(smsText)) category = 'Shopping';

    // Save SMS record
    const smsRecord = await prisma.smsRecord.create({
      data: {
        userId,
        smsText,
        sender,
        parsedAmount: amount,
        parsedCategory: category,
        parsedType: type,
      },
    });

    res.json({
      smsRecord,
      preview: {
        amount,
        category,
        type,
        title: smsText.substring(0, 50),
      },
    });
  } catch (error) {
    console.error('SMS parsing error:', error);
    res.status(500).json({ error: 'Failed to parse SMS' });
  }
});

/**
 * POST /api/sms/confirm
 * Confirm and create transaction from SMS
 */
app.post('/api/sms/confirm', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { smsRecordId, title, amount, category, type } = req.body;

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        title: title || 'SMS Transaction',
        amount: Number(amount),
        category,
        type,
        date: new Date(),
      },
    });

    // Mark SMS as processed
    await prisma.smsRecord.update({
      where: { id: smsRecordId },
      data: { processed: true },
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('SMS confirmation error:', error);
    res.status(500).json({ error: 'Failed to confirm SMS transaction' });
  }
});

// ==================== USER ROUTES ====================

/**
 * GET /api/user/profile
 * Get user profile
 */
app.get('/api/user/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        profileImage: true,
        riskProfile: true,
        notificationsEnabled: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * PUT /api/user/profile
 * Update user profile
 */
app.put('/api/user/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, phone, profileImage, riskProfile, notificationsEnabled } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        profileImage: profileImage || undefined,
        riskProfile: riskProfile || undefined,
        notificationsEnabled: notificationsEnabled !== undefined ? notificationsEnabled : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        profileImage: true,
        riskProfile: true,
        notificationsEnabled: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ==================== HEALTH CHECK ====================

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// ==================== ERROR HANDLING ====================

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// ==================== SERVER START ====================

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation:`);
      console.log(`   - Auth: POST /api/auth/register, POST /api/auth/login`);
      console.log(`   - Dashboard: GET /api/dashboard`);
      console.log(`   - Transactions: GET/POST /api/transactions`);
      console.log(`   - Jars: GET/POST/PUT/DELETE /api/jars`);
      console.log(`   - Goals: GET/POST/PUT /api/goals`);
      console.log(`   - Assets: GET/POST /api/assets`);
      console.log(`   - Portfolio: GET /api/portfolio`);
      console.log(`   - Alerts: GET/PUT /api/alerts`);
      console.log(`   - AI Insights: GET /api/ai-insights`);
      console.log(`   - Chat: GET/POST /api/chat/messages`);
      console.log(`   - SMS: POST /api/sms/parse, POST /api/sms/confirm`);
      console.log(`   - User: GET/PUT /api/user/profile`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
