/**
 * Simple logging utilities
 * Errors go to stderr, info goes to stdout
 */

import { config } from '../constants.js';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  const currentLevel = config.logLevel as LogLevel;
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
}

export function debug(message: string, meta?: Record<string, unknown>): void {
  if (shouldLog('debug')) {
    console.log(formatMessage('debug', message, meta));
  }
}

export function info(message: string, meta?: Record<string, unknown>): void {
  if (shouldLog('info')) {
    console.log(formatMessage('info', message, meta));
  }
}

export function warn(message: string, meta?: Record<string, unknown>): void {
  if (shouldLog('warn')) {
    console.warn(formatMessage('warn', message, meta));
  }
}

export function error(message: string, meta?: Record<string, unknown>): void {
  if (shouldLog('error')) {
    console.error(formatMessage('error', message, meta));
  }
}

export const logger = {
  debug,
  info,
  warn,
  error,
};
