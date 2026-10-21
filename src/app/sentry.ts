import * as Sentry from '@sentry/angular';

export type SentryEnvironmentConfig = {
  SENTRY_DSN?: string;
  SENTRY_ENVIRONMENT?: string;
  SENTRY_RELEASE?: string;
  SENTRY_TRACES_SAMPLE_RATE?: number;
};

export function initializeSentry(environment: SentryEnvironmentConfig): void {
  const dsn = environment.SENTRY_DSN?.trim() ?? '';

  Sentry.init({
    dsn,
    enabled: !!dsn,
    environment: environment.SENTRY_ENVIRONMENT,
    release: environment.SENTRY_RELEASE,
    tracesSampleRate: environment.SENTRY_TRACES_SAMPLE_RATE ?? 0,
    attachStacktrace: true,
  });
}
