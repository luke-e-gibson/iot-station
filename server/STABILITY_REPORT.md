## Server stability review

### Context
The Raspberry Pi server experienced unexpected crashes during long-running operation. The goal was to identify code paths that could terminate the Node.js process and harden the server against them.

### Findings
- **Unhandled file stream errors**: The logger writes to a file when configured. If the log directory becomes unavailable (e.g., disk full, permission change), the underlying write stream emits an `error` event. Without a listener, Node.js treats this as an unhandled error and terminates the process.
- **Uncaught process-level errors**: Unexpected exceptions or rejected promises at the process level would take down the server because there were no global handlers to record and contain them.

### Changes implemented
- Added a defensive `error` handler to the log file stream to gracefully disable file logging and fall back to console logging if file I/O fails, preventing crashes from log write failures.
- Registered `uncaughtException` and `unhandledRejection` handlers that log the failure details and trigger a controlled shutdown (with timeout) so a supervisor can restart the service without leaving the process in an undefined state.

### Verification
- No automated tests are available for the server package. Changes were reviewed for minimal surface area and alignment with existing logging patterns.

### Recommendations
- Monitor disk usage or add log rotation to prevent unbounded log growth on constrained devices.
- Add targeted health checks and lightweight runtime smoke tests to catch regressions in future changes.
