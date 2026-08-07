// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  FEEDBACK_SERVICE_URL: 'https://api-production-065b.up.railway.app/belair_report.php',
  SENTRY_DSN: 'https://12fd8e2b0359466f620b84e9c2baabba@o4511828869644288.ingest.de.sentry.io/4511868879634512',
  SENTRY_ENVIRONMENT: 'development',
  SENTRY_RELEASE: '3.0.24',
  SENTRY_TRACES_SAMPLE_RATE: 0
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
