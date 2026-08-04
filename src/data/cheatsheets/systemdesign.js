export const systemDesignCheatsheet = {
  title: 'System Design — Backend Concepts',

  patterns: [
    {
      name: 'Pattern 1 — Dynamic Config Reload (No Pod Restart)',
      icon: '🔄',
      when: 'When config/secrets change in Vault, AWS, or ConfigMap and you need zero-downtime refresh',
      gaonKiBaat: 'Socho gaon ka ration card system hai. Purana system = har baar naya rule aaya toh poora office band karo, naya rule laago, phir kholo (restart). Naya system = ek runner hamesha bahar bhaagta rehta hai — vault/AWS se naya config laata hai aur andar waalon ko bata deta hai bina office band kiye. Kaam chalta rehta hai, config bhi badal jaata hai.',
      problems: [
        'Interview: "How do you reload config without restarting a pod?"',
        'Interview: "What is @RefreshScope in Spring Boot?"',
        'Interview: "How does Spring Cloud Bus work?"',
        'Production: rotating DB passwords without downtime',
      ],
      template: `// ══════════════════════════════════════════════════
// PATTERN 1 — Spring Boot @RefreshScope + Actuator
// ══════════════════════════════════════════════════
// Step 1: Annotate bean with @RefreshScope
@RefreshScope
@Component
public class PaymentConfig {
    @Value("\${payment.timeout}")
    private int timeout;

    @Value("\${payment.retryCount}")
    private int retryCount;
}

// Step 2: Hit the refresh endpoint (manual trigger)
// POST /actuator/refresh
// → Spring rebuilds all @RefreshScope beans with new values
// → No restart needed

// Enable in application.properties:
// management.endpoints.web.exposure.include=refresh,health,info

// ══════════════════════════════════════════════════
// PATTERN 2 — Spring Cloud Config + Spring Cloud Bus
// ══════════════════════════════════════════════════
// Most common in production — fully automatic, zero human intervention

// Flow:
// Git config repo → changes pushed
//   → Spring Cloud Config Server picks up new values
//     → publishes RefreshRemoteApplicationEvent to RabbitMQ/Kafka
//       → ALL running pods subscribed to Bus receive event
//         → each pod auto-refreshes @RefreshScope beans

// Config Server application.yml:
// spring:
//   cloud:
//     bus:
//       enabled: true
//   rabbitmq:
//     host: localhost

// Result: push config to Git → all pods refresh in seconds, zero restart

// ══════════════════════════════════════════════════
// PATTERN 3 — Kubernetes ConfigMap as Volume Mount
// ══════════════════════════════════════════════════

// deployment.yaml — mount as FILE (not env var!)
// volumeMounts:
//   - name: config-volume
//     mountPath: /app/config
// volumes:
//   - name: config-volume
//     configMap:
//       name: my-app-config

// K8s automatically updates mounted file within ~60 sec when ConfigMap changes
// App uses Java WatchService to detect file change and reload:

WatchService watcher = FileSystems.getDefault().newWatchService();
Path configPath = Paths.get("/app/config");
configPath.register(watcher, StandardWatchEventKinds.ENTRY_MODIFY);

Thread watchThread = new Thread(() -> {
    while (true) {
        WatchKey key = watcher.take();   // blocks until change detected
        for (WatchEvent<?> event : key.pollEvents()) {
            reloadConfig();              // your reload logic
        }
        key.reset();
    }
});
watchThread.setDaemon(true);
watchThread.start();

// ⚠️ KEY RULE: File mount → auto-updated by K8s, no restart
//              Env var (envFrom: configMapRef) → restart REQUIRED

// ══════════════════════════════════════════════════
// PATTERN 4 — AWS AppConfig (Poll-based)
// ══════════════════════════════════════════════════
// App polls AWS AppConfig at a fixed interval — no restart needed

AppConfigDataClient appConfigClient = AppConfigDataClient.create();

// Poll every 60 seconds in a background thread
ScheduledExecutorService poller = Executors.newSingleThreadScheduledExecutor();
poller.scheduleAtFixedRate(() -> {
    String newConfig = appConfigClient.getLatestConfiguration(token);
    if (newConfig != null) applyConfig(newConfig);
}, 0, 60, TimeUnit.SECONDS);

// Works with: AWS Secrets Manager, Parameter Store, AppConfig profiles
// Supports gradual rollout (10% → 50% → 100%) and auto-rollback on errors

// ══════════════════════════════════════════════════
// PATTERN 5 — HashiCorp Vault Agent Sidecar
// ══════════════════════════════════════════════════

// Pod structure:
// ┌─────────────────────────────────┐
// │  your-app container             │
// │    reads from /vault/secrets/   │
// │                                 │
// │  vault-agent sidecar            │
// │    watches Vault for rotation   │
// │    writes to /vault/secrets/    │ ← shared volume
// └─────────────────────────────────┘

// Vault agent config:
// template {
//   source      = "/vault/template/db.ctmpl"
//   destination = "/vault/secrets/db.properties"
//   command     = "kill -HUP <your-app-pid>"   // signal app to reload
// }

// App just reads /vault/secrets/db.properties — no Vault SDK needed
// Agent handles: token renewal, lease management, secret rotation

// ══════════════════════════════════════════════════
// SUMMARY — WHICH TO USE WHEN
// ══════════════════════════════════════════════════
// Spring Boot + K8s          → Spring Cloud Config + Bus + @RefreshScope
// AWS stack                  → AWS AppConfig / Parameter Store polling
// Secrets (passwords, keys)  → Vault Agent Sidecar
// Simple K8s config          → ConfigMap volume mount + WatchService
// Instant propagation        → Spring Cloud Bus (event-driven, not poll-based)

// ROOT RULE:
// Env vars   → always need restart to pick up changes
// File mount + polling + bus events → no restart needed`,
    },
  ],

  rules: [
    {
      rule: 'Env vars always need a restart. File mounts + polling + bus events do not.',
      tag: 'key',
      detail: 'This is the root rule. If you inject config as environment variables (envFrom: configMapRef), the process must restart to see new values. File mounts are updated by K8s in-place; the app just needs to watch for changes.',
    },
    {
      rule: '@RefreshScope rebuilds the bean. Without it, @Value fields are frozen at startup.',
      tag: 'gotcha',
      detail: 'A Spring bean without @RefreshScope reads @Value once at startup and never again. With @RefreshScope, hitting /actuator/refresh destroys and recreates the bean with fresh values from the config source.',
    },
    {
      rule: 'Spring Cloud Bus = event-driven broadcast. AppConfig/Vault = poll-based pull.',
      tag: 'key',
      detail: 'Bus pushes change events to all pods simultaneously via a message broker (Rabbit/Kafka). Polling approaches (AppConfig, Parameter Store) each pod fetches on its own schedule — there is a lag up to the poll interval.',
    },
    {
      rule: 'ConfigMap as env var → restart. ConfigMap as volume mount → auto-updated (~60 sec).',
      tag: 'gotcha',
      detail: 'K8s kubelet syncs mounted ConfigMap files periodically (default ~1 min). Environment variables set from ConfigMaps are snapshotted at pod start — they never update without a restart.',
    },
    {
      rule: 'Vault Agent Sidecar keeps secrets out of app code entirely.',
      tag: 'key',
      detail: 'App reads secrets from a local file written by Vault Agent — no Vault SDK, no token management in app code. Agent handles renewal, rotation, and can signal the app (kill -HUP) when secrets rotate.',
    },
    {
      rule: 'AWS AppConfig supports gradual rollout and automatic rollback.',
      tag: 'key',
      detail: 'Unlike raw Parameter Store, AppConfig adds deployment strategies (linear, exponential) and CloudWatch alarm-based rollback. If errors spike after a config change, AppConfig rolls back automatically.',
    },
  ],

  complexity: [
    { problem: 'Spring @RefreshScope reload', tc: 'O(beans)', sc: 'O(1)', note: 'Recreates only @RefreshScope beans — rest of context untouched' },
    { problem: 'Spring Cloud Bus broadcast', tc: 'O(pods)', sc: 'O(1)', note: 'One event published; each pod consumes and refreshes independently' },
    { problem: 'K8s ConfigMap file sync', tc: 'O(1)', sc: 'O(config size)', note: 'K8s kubelet updates mounted file; delay up to syncPeriod (~60 sec default)' },
    { problem: 'AWS AppConfig poll', tc: 'O(1)', sc: 'O(config size)', note: 'Cached response if unchanged; only transfers diff on change' },
    { problem: 'Vault Agent secret fetch', tc: 'O(1)', sc: 'O(secret size)', note: 'Agent maintains lease; re-fetches before expiry automatically' },
  ],

  quiz: [
    {
      q: 'You store DB password in a K8s ConfigMap and inject it as an environment variable. You rotate the password. What must you do?',
      options: [
        'Nothing — K8s automatically updates env vars',
        'Hit /actuator/refresh',
        'Restart the pod — env vars are snapshotted at pod start',
        'Use kubectl apply and the pod updates live',
      ],
      answer: 2,
      explanation: 'Environment variables are copied into the process at startup and never updated. To pick up a new value you must restart the pod. Mount as a file volume instead if you want live updates.',
    },
    {
      q: 'What does @RefreshScope do in Spring Boot?',
      options: [
        'Restarts the entire Spring application context',
        'Marks the bean to be rebuilt with fresh config values when /actuator/refresh is called',
        'Automatically polls for config changes every 60 seconds',
        'Connects Spring Boot to Spring Cloud Bus',
      ],
      answer: 1,
      explanation: '@RefreshScope makes the bean a proxy. When /actuator/refresh is called, Spring destroys and recreates the bean, re-injecting all @Value fields from the current config source. Beans without @RefreshScope keep their startup values forever.',
    },
    {
      q: 'What is the advantage of Spring Cloud Bus over /actuator/refresh?',
      options: [
        'Spring Cloud Bus is faster on a single pod',
        'Spring Cloud Bus broadcasts the refresh event to ALL pods simultaneously — no manual per-pod trigger needed',
        'Spring Cloud Bus avoids the need for @RefreshScope',
        'Spring Cloud Bus works without a message broker',
      ],
      answer: 1,
      explanation: 'With /actuator/refresh you must call it on every pod individually. Spring Cloud Bus publishes one event to RabbitMQ/Kafka and all subscribed pods refresh automatically — fully zero-touch.',
    },
    {
      q: 'Why is Vault Agent Sidecar preferred over embedding the Vault SDK in your app?',
      options: [
        'Vault Agent is faster than the SDK',
        'App code stays clean — no Vault SDK, token management, or lease renewal logic needed',
        'Vault Agent supports more secret types',
        'The SDK cannot be used inside containers',
      ],
      answer: 1,
      explanation: 'Vault Agent handles all the plumbing: token auth, lease renewal, secret rotation, and writing secrets to a shared file. Your app just reads a local file — zero Vault dependency in application code.',
    },
  ],
}
