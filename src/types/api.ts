/**
 * API Type Definitions
 * TypeScript interfaces matching backend response models
 */

// ============ AUTH TYPES ============

export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

// ============ DASHBOARD TYPES ============

export interface DashboardSummary {
  balance: number;
  safe_to_spend: number;
  income_7day: number;
  expense_7day: number;
  jars_funded: number;
  goals_progress: number;
  alerts: Alert[];
  spending_habits: Record<string, number>;
  recent_transactions: Transaction[];
}

// ============ TRANSACTION TYPES ============

export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'food'
  | 'transport'
  | 'utilities'
  | 'entertainment'
  | 'shopping'
  | 'healthcare'
  | 'education'
  | 'other';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionRequest {
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  date: string;
}

// ============ JAR TYPES ============

export interface Jar {
  id: string;
  user_id: string;
  name: string;
  description: string;
  target_amount: number;
  current_amount: number;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface CreateJarRequest {
  name: string;
  description: string;
  target_amount: number;
  color: string;
  icon: string;
}

export interface AllocateJarRequest {
  amount: number;
}

// ============ GOAL TYPES ============

export type GoalStatus = 'active' | 'completed' | 'paused' | 'failed';

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  description: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  status: GoalStatus;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface CreateGoalRequest {
  name: string;
  description: string;
  target_amount: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
}

export interface GoalPlan {
  goal_id: string;
  monthly_savings_needed: number;
  months_to_goal: number;
  feasibility_score: number;
  recommended_jars: Jar[];
  milestones: Milestone[];
}

export interface Milestone {
  amount: number;
  date: string;
  description: string;
}

// ============ ALERT TYPES ============

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Alert {
  id: string;
  user_id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  is_read: boolean;
  is_dismissed: boolean;
  created_at: string;
  updated_at: string;
}

// ============ INSIGHT TYPES ============

export interface Prediction {
  type: string;
  value: number;
  confidence: number;
  date: string;
}

export interface Pattern {
  category: string;
  average_amount: number;
  frequency: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface Optimization {
  title: string;
  description: string;
  potential_savings: number;
  priority: 'high' | 'medium' | 'low';
}

export interface CategoryStats {
  category: string;
  total_amount: number;
  transaction_count: number;
  average_transaction: number;
  percentage_of_total: number;
}

// ============ ASSET TYPES ============

export type AssetType = 'stock' | 'mutual_fund' | 'crypto' | 'bond' | 'commodity';

export interface Asset {
  id: string;
  user_id: string;
  name: string;
  symbol: string;
  type: AssetType;
  current_price: number;
  created_at: string;
  updated_at: string;
}

export interface Holding {
  id: string;
  asset_id: string;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  total_value: number;
  total_invested: number;
  total_gain_loss: number;
  gain_loss_percentage: number;
  holdings: HoldingWithAsset[];
}

export interface HoldingWithAsset extends Holding {
  asset: Asset;
  current_value: number;
  gain_loss: number;
}

export interface AssetForecast {
  asset_id: string;
  predicted_price: number;
  confidence: number;
  date: string;
}

// ============ AGENT TYPES ============

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export interface AgentResponse {
  message: string;
  agent_used: string;
  tools_invoked: string[];
  confidence_score: number;
  rationale: string;
}

// ============ PROFILE TYPES ============

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  avatar_url: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

export interface Preferences {
  currency: string;
  language: string;
  notifications_enabled: boolean;
  email_alerts: boolean;
  push_alerts: boolean;
  theme: 'light' | 'dark';
}

// ============ ERROR TYPES ============

export interface ApiErrorResponse {
  detail: string;
  status: number;
  timestamp: string;
}

// ============ PAGINATION TYPES ============

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}
