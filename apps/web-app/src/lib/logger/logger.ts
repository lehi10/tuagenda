/**
 * Log types supported by the Logger
 */
export type LogType = "info" | "warning" | "error" | "fatal";

/**
 * Log entry interface
 */
export interface LogEntry {
  type: LogType;
  service: string;
  userId: string;
  description: string;
  timestamp: Date;
}

/**
 * Logger - Singleton class for application-wide logging
 *
 * Usage:
 * const logger = Logger.getInstance();
 * logger.info('UserService', 'user-123', 'User logged in successfully');
 * logger.error('PaymentService', 'user-456', 'Payment processing failed');
 */
export class Logger {
  private static instance: Logger;

  /**
   * Private constructor to prevent direct instantiation
   */
  private constructor() {
    // Initialize logger
  }

  /**
   * Get the singleton instance of Logger
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Format log entry for output
   */
  private formatLog(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const type = entry.type.toUpperCase();
    return `[${timestamp}] [${type}] [${entry.service}] [User: ${entry.userId}] ${entry.description}`;
  }

  /**
   * Log an informational message
   * @param service - The service or function name generating the log
   * @param userId - The user ID, or 'anonymous' if not logged in
   * @param description - Description of the event
   */
  public info(
    service: string,
    userId: string = "anonymous",
    description: string
  ): void {
    const entry: LogEntry = {
      type: "info",
      service,
      userId,
      description,
      timestamp: new Date(),
    };
    console.log(this.formatLog(entry));
  }

  /**
   * Log a warning message
   * @param service - The service or function name generating the log
   * @param userId - The user ID, or 'anonymous' if not logged in
   * @param description - Description of the warning
   */
  public warning(
    service: string,
    userId: string = "anonymous",
    description: string
  ): void {
    const entry: LogEntry = {
      type: "warning",
      service,
      userId,
      description,
      timestamp: new Date(),
    };
    console.log(this.formatLog(entry));
  }

  /**
   * Log an error message
   * @param service - The service or function name generating the log
   * @param userId - The user ID, or 'anonymous' if not logged in
   * @param description - Description of the error
   */
  public error(
    service: string,
    userId: string = "anonymous",
    description: string
  ): void {
    const entry: LogEntry = {
      type: "error",
      service,
      userId,
      description,
      timestamp: new Date(),
    };
    console.log(this.formatLog(entry));
  }

  /**
   * Log a fatal error message
   * @param service - The service or function name generating the log
   * @param userId - The user ID, or 'anonymous' if not logged in
   * @param description - Description of the fatal error
   */
  public fatal(
    service: string,
    userId: string = "anonymous",
    description: string
  ): void {
    const entry: LogEntry = {
      type: "fatal",
      service,
      userId,
      description,
      timestamp: new Date(),
    };
    console.log(this.formatLog(entry));
  }
}

/**
 * Export a singleton instance for convenience
 */
export const logger = Logger.getInstance();
