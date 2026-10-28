export const designPatternsCheatsheet = {
  title: 'Design Patterns (LLD)',

  patterns: [
    {
      name: 'Pattern 1 — Singleton',
      icon: '👑',
      when: 'Use when exactly ONE instance of a class should exist across the entire application',
      gaonKiBaat: 'Gaon mein ek hi Pradhan hota hai — do Pradhan ek saath nahi ho sakte. Agar koi naya Pradhan banana chaahe, toh wahi purana Pradhan milta hai. Singleton wahi hai — ek hi instance, baar baar wahi milta hai.',
      problems: ['Database connection pool', 'Logger', 'Configuration manager', 'Thread pool'],
      realWorldUses: [
        {
          title: '🗄️ Database Connection Pool',
          dehaatiAnalaogy: 'Gaon mein ek hi boring machine hoti hai — jisko zaroorat ho woh use karo, kaam khatam toh wapas rakh do. Har koi apni boring machine nahi laata.',
          problem: 'Every API request needs a DB connection. Creating a new connection for each request is expensive — TCP handshake, auth, setup takes ~200ms.',
          withoutPrototype: 'new DbConnection() per request → 100 concurrent requests → 100 connections → DB server crashes.',
          withPrototype: 'One ConnectionPool instance (Singleton) with fixed pool of 10 connections. Requests wait and reuse — DB never overloaded.',
          bugWithoutClone: 'Two threads both call getInstance() simultaneously → both see instance == null → both create new pool → two pools exist → connection count doubles → pool management breaks.',
        },
        {
          title: '📝 Logger',
          dehaatiAnalaogy: 'Gaon mein ek hi register hota hai jisme sab entries hoti hain. Har karamchari apna alag register nahi rakhta — sab ek hi jagah likhte hain.',
          problem: 'Application logs must go to one file/stream. Multiple Logger instances = logs split across files, out of order, corrupted.',
          withoutPrototype: 'ServiceA creates Logger → writes to app1.log. ServiceB creates Logger → writes to app2.log. Debugging requires checking multiple files.',
          withPrototype: 'Logger.getInstance() always returns same Logger. All services write to same stream — one consistent log file.',
          bugWithoutClone: 'Without volatile + DCL: Thread A creates Logger (partially constructed) → Thread B gets reference before constructor finishes → Thread B calls logger.log() → NullPointerException because internal stream is not initialized yet.',
        },
        {
          title: '⚙️ Configuration Manager',
          dehaatiAnalaogy: 'Gaon ka pradhan ek baar rules banata hai — sabko wahi rules follow karne hote hain. Har banda apne alag rules nahi bana sakta.',
          problem: 'App config (DB URL, API keys, timeouts) loaded from file at startup. Should be read once and shared — not reloaded by each component.',
          withoutPrototype: 'Each service creates ConfigManager → each reads config file independently → file I/O on every request → slow + inconsistent if file changes mid-run.',
          withPrototype: 'ConfigManager.getInstance() reads file once at startup. All services get same config object — consistent and fast.',
          bugWithoutClone: 'Two ConfigManager instances created: one has old config, one has new config after hot-reload. ServiceA uses old DB URL, ServiceB uses new DB URL — split brain.',
        },
      ],
      template: `// DCL Singleton — thread-safe, lazy initialization
public class Logger {
    private static volatile Logger instance; // volatile — prevents partial construction

    private Logger() { }  // private — nobody can do new Logger()

    public static Logger getInstance() {
        if (instance == null) {                         // first check — no lock (fast path)
            synchronized (Logger.class) {               // lock only when null
                if (instance == null) {                 // second check — inside lock
                    instance = new Logger();
                }
            }
        }
        return instance;
    }

    // resetInstance() — only single synchronized block needed
    // reason: outcome is always null — no partial construction possible
    public static void resetInstance() {
        synchronized (Logger.class) {
            instance = null;
        }
    }

    public void log(String message) {
        System.out.println(message);
    }
}

// Usage
Logger logger = Logger.getInstance();  // always same object
Logger same   = Logger.getInstance();  // same object
System.out.println(logger == same);    // true`,
    },
    {
      name: 'Pattern 2 — Builder',
      icon: '🏗️',
      when: 'Use when object has many fields — especially optional ones — and constructor args become confusing',
      gaonKiBaat: 'Gaon mein makaan banane wala pehle neev daalta hai, phir deewaar, phir chhat — ek ek step mein. Agar seedha poora makaan ek baar mein banane bolo toh confusion ho jaata hai. Builder wahi hai — ek ek field set karo, phir build() se final object lo.',
      problems: ['DatabaseConfiguration', 'HTTP Request builder', 'Email builder', 'SQL Query builder'],
      realWorldUses: [
        {
          title: '🗄️ Database Configuration',
          dehaatiAnalaogy: 'Gaon mein naya ghar banate waqt pehle neev, phir deewaar, phir darwaza — ek ek cheez order mein. Koi seedha chhath nahi lagata bina neev ke.',
          problem: 'DB config has 6+ fields — url, username, password, maxConnections, enableCache, isReadOnly. Constructor with 6 params is error-prone — easy to mix up positions.',
          withoutPrototype: 'new DatabaseConfig("admin", "jdbc://...", "secret", true, 10, false) — which is url and which is username? Easy to swap args silently.',
          withPrototype: 'new Builder().setUrl("jdbc://...").setUsername("admin").setMaxConnections(20).build() — self-documenting, each field named explicitly.',
          bugWithoutClone: 'Silent bug: this.phoneNumbers = builder.phoneNumbers — both share same list. Caller adds phone after build() → object is mutated unexpectedly. Fix: new ArrayList<>(builder.phoneNumbers).',
        },
        {
          title: '🌐 HTTP Request Builder',
          dehaatiAnalaogy: 'Chitthi likhte waqt — pehle address, phir subject, phir body, phir signature. Sab ek saath nahi likhte — ek ek step mein.',
          problem: 'HTTP request has many optional fields — headers, query params, body, timeout, auth token, retry policy. Not all requests need all fields.',
          withoutPrototype: 'Constructor overloading: 10 different constructors for different combinations of optional fields. Maintenance nightmare.',
          withPrototype: 'new HttpRequest.Builder("POST", "/api/users").addHeader("Auth", token).setBody(json).setTimeout(5000).build() — set only what you need.',
          bugWithoutClone: 'Without Builder: object created via new → fields set one by one via setters → between new() and last setter, object is half-built → another thread reads it → sees null fields → NullPointerException.',
        },
        {
          title: '📧 Email Builder',
          dehaatiAnalaogy: 'Invitation card mein — pehle naam, phir date, phir venue, phir RSVP details. Sab ek saath ek hi baar mein likhna confusing hota hai.',
          problem: 'Email has to, cc, bcc, subject, body, attachments, priority, replyTo — most optional. Different email types need different combinations.',
          withoutPrototype: 'new Email(to, null, null, subject, body, null, "HIGH", null) — positional nulls everywhere. Which null is cc and which is attachments?',
          withPrototype: 'new Email.Builder().to("dhiraj@example.com").subject("Interview").body("...").priority("HIGH").build() — only set what matters.',
          bugWithoutClone: 'Validation without Builder: email object created → fields set in random order → send() called before subject is set → blank subject email goes out to 10,000 users. Builder validates in build() before object exists.',
        },
      ],
      template: `// Builder Pattern — private constructor + static Builder class
public class DatabaseConfiguration {
    private final String url;
    private final String username;
    private final String password;
    private final int maxConnections;
    private final boolean enableCache;
    private final boolean isReadOnly;

    private DatabaseConfiguration(Builder builder) {
        this.url            = builder.url;
        this.username       = builder.username;
        this.password       = builder.password;
        this.maxConnections = builder.maxConnections;
        this.enableCache    = builder.enableCache;
        this.isReadOnly     = builder.isReadOnly;
    }

    public static class Builder {
        private String url;
        private String username;
        private String password;
        private int maxConnections = 10;   // sensible default
        private boolean enableCache = true;
        private boolean isReadOnly  = false;

        public Builder setUrl(String url)                       { this.url = url; return this; }
        public Builder setUsername(String username)             { this.username = username; return this; }
        public Builder setPassword(String password)             { this.password = password; return this; }
        public Builder setMaxConnections(int maxConnections)    { this.maxConnections = maxConnections; return this; }
        public Builder setEnableCache(boolean enableCache)      { this.enableCache = enableCache; return this; }
        public Builder setReadOnly(boolean isReadOnly)          { this.isReadOnly = isReadOnly; return this; }

        public DatabaseConfiguration build() {
            if (url == null || url.isEmpty()) throw new RuntimeException("URL is required");
            return new DatabaseConfiguration(this);
        }
    }
}

// Caller — clean, readable, no positional confusion
DatabaseConfiguration config = new DatabaseConfiguration.Builder()
    .setUrl("jdbc://localhost:5432/mydb")
    .setUsername("admin")
    .setPassword("secret")
    .setMaxConnections(20)
    .build();`,
    },
    {
      name: 'Pattern 3 — Simple Factory',
      icon: '🏭',
      when: 'Use when object creation logic should be in one place, not scattered across callers. BUT adding new type requires editing the factory — violates OCP.',
      gaonKiBaat: 'Gaon mein jalebi banane wala ek hi hota hai — tu sirf bolta hai "jalebi do" aur woh bana ke deta hai. Tu andar ka process nahi jaanta. Simple Factory wahi hai — ek jagah se object maango, kaise bana yeh chhupa rahega. Problem yeh hai ki naya item add karna ho (gulab jamun) toh factory wale ko andar jaake code badalna padega — OCP violation.',
      problems: ['Notification sender (SMS/Email/Push)', 'Audio player (MP3/WAV/FLAC)', 'Document processor (Text/Spreadsheet/Presentation)'],
      realWorldUses: [
        {
          title: '🔔 Notification System',
          dehaatiAnalaogy: 'Gaon ka dak wala — tu sirf chitthi deta hai "Email bhejo" ya "SMS bhejo". Woh decide karta hai kaun sa tarika use karna hai. Tu andar nahi jaata.',
          problem: 'Application needs to send notifications via different channels. Caller should not know EmailNotification vs SmsNotification class names.',
          withoutPrototype: 'Every caller does: if (type == "email") new EmailNotification() else new SmsNotification() — creation logic duplicated everywhere.',
          withPrototype: 'NotificationFactory.create("email") — one place, all callers use factory. Change creation logic = change only factory.',
          bugWithoutClone: 'Adding "slack" channel: must find and update every if-else block across entire codebase. Miss one → silent bug where slack falls through to default.',
        },
        {
          title: '🎵 Audio Player (MP3/WAV/FLAC)',
          dehaatiAnalaogy: 'Music system mein tu sirf gaana daalta hai — system khud decide karta hai MP3 player chalana hai ya FLAC player. Tu player ka naam nahi jaanta.',
          problem: 'Audio app supports multiple formats. Caller just knows the format name, not which decoder class to instantiate.',
          withoutPrototype: 'Caller checks format and creates decoder directly — tightly coupled to every decoder class.',
          withPrototype: 'AudioPlayerFactory.create("mp3") — caller decoupled from implementation. New format = only factory changes.',
          bugWithoutClone: 'OCP violation: adding FLAC support requires editing the factory if-else. Every addition = risk of breaking existing MP3/WAV logic.',
        },
      ],
      template: `// Simple Factory — static method with if-else
public class NotificationFactory {

    public static Notification create(String type, String recipient, String message) {
        if (type.equals("email")) return new EmailNotification(recipient, message);
        if (type.equals("sms"))   return new SmsNotification(recipient, message);
        if (type.equals("push"))  return new PushNotification(recipient, message);
        throw new IllegalArgumentException("Unknown type: " + type);
    }
}

// Caller — doesn't know how object is created
Notification n = NotificationFactory.create("email", "dhiraj@gmail.com", "Hello!");
n.send();

// ❌ OCP Violation:
// Adding "slack" notification → must edit NotificationFactory if-else
// Every new type = open this file and add another if block
// Solution → Abstract Factory (family) or Registry (plugin-style)`,
    },
    {
      name: 'Pattern 4 — Abstract Factory',
      icon: '🏗️🏭',
      when: 'Use when you need a FAMILY of related objects from the same provider — ensures consistency. Simple Factory returns ONE object. Abstract Factory returns a WHOLE FAMILY.',
      gaonKiBaat: 'Gaon mein ek hi dukan se chai bhi lo aur samosa bhi lo — dono Sharma ji ki dukan ke hain, ek saath theek lagte hain. Agar chai Sharma ji ki aur samosa Gupta ji ka liya toh mismatch ho sakta hai. Abstract Factory wahi consistency deta hai — ek hi provider se poora set lo.',
      problems: ['AI provider (chat client + vector client must be same provider)', 'UI themes (button + dialog must match)', 'Audio (decoder + player + processor must match format)', 'Notification (notification + template + sender must match channel)'],
      realWorldUses: [
        {
          title: '🤖 AI Chat Service (OpenAI / Anthropic / Gemini)',
          dehaatiAnalaogy: 'Ek hi contractor se poora kaam lo — raj mistri bhi unka, plumber bhi unka, electrician bhi unka. Mix karo toh kaam nahi chalega — ek dusre ki baat nahi sunenge.',
          problem: 'ChatService needs AiChatClient + AiVectorClient. Both must be from same provider — OpenAI chat + Anthropic vector = incompatible API formats.',
          withoutPrototype: 'Caller creates chat client and vector client separately, manually ensuring they match — easy to accidentally mix providers.',
          withPrototype: 'new ChatService(new OpenAiClientFactory()) — factory guarantees both clients are OpenAI. Switch to Anthropic = one line change.',
          bugWithoutClone: 'OpenAI chat response format is JSON. Anthropic vector uses different embedding dimensions. Mixing = runtime crash when vector search results fed into OpenAI chat context.',
        },
        {
          title: '🎵 Audio Processing (MP3 / FLAC)',
          dehaatiAnalaogy: 'MP3 cassette player mein FLAC tape mat daalo — format match nahi karta. Ek hi factory se decoder, player aur processor lo — sab ek hi format ke honge.',
          problem: 'Audio app needs Decoder + Player + Processor. All three must handle same format — MP3 decoder output is incompatible with FLAC processor input.',
          withoutPrototype: 'Caller creates MP3Decoder + FLACProcessor — compiles fine but crashes at runtime when incompatible byte streams are passed between components.',
          withPrototype: 'new AudioService(new MP3AudioFactory()) — factory guarantees MP3Decoder + MP3Player + MP3Processor. All compatible.',
          bugWithoutClone: 'FLAC uses lossless compression. MP3 processor expects lossy format headers. Mixing = garbled audio or ArrayIndexOutOfBoundsException when parsing audio frames.',
        },
        {
          title: '🔔 Notification System (Email / SMS / Push)',
          dehaatiAnalaogy: 'Email system ka template, sender aur notification — teeno email wale chahiye. SMS wala template Email sender ke saath nahi chalega.',
          problem: 'NotificationService needs Notification + Template + Sender. All must be same channel — EmailTemplate has HTML content, SmsSender has 160 char limit, mixing = broken messages.',
          withoutPrototype: 'Developer creates EmailNotification + SmsNotificationTemplate — compiles but SMS template HTML renders as raw text in SMS.',
          withPrototype: 'new NotificationService(new EmailNotificationFactory()) — factory guarantees entire Email family. Switch to SMS = one factory swap.',
          bugWithoutClone: 'EmailTemplate generates HTML with images. SmsSender sends raw text — HTML tags appear as literal characters in SMS. User receives "<h1>Welcome</h1>" as SMS text.',
        },
      ],
      template: `// Abstract Factory — creates a FAMILY of related objects
public interface AiClientFactory {
    AiChatClient   getAiChatClient();    // chat from same provider
    AiVectorClient getAiVectorClient();  // vector from same provider
}

// OpenAI family — both clients guaranteed to be OpenAI
public class OpenAiClientFactory implements AiClientFactory {
    @Override public AiChatClient   getAiChatClient()   { return new OpenAiChatClient(); }
    @Override public AiVectorClient getAiVectorClient() { return new OpenAiVectorClient(); }
}

// Anthropic family
public class AnthropicClientFactory implements AiClientFactory {
    @Override public AiChatClient   getAiChatClient()   { return new AnthropicChatClient(); }
    @Override public AiVectorClient getAiVectorClient() { return new AnthropicVectorClient(); }
}

// ChatService — works with any factory, never knows the provider
public class ChatService {
    private final AiChatClient   chatClient;
    private final AiVectorClient vectorClient;

    public ChatService(AiClientFactory factory) {
        this.chatClient   = factory.getAiChatClient();   // same provider
        this.vectorClient = factory.getAiVectorClient(); // same provider — guaranteed
    }
}

// Usage
ChatService openAiService = new ChatService(new OpenAiClientFactory());`,
    },
    {
      name: 'Pattern 5 — Factory + Registry (Open/Closed)',
      icon: '📋🔌',
      when: 'Use when new providers must be addable WITHOUT editing existing factory code. Fixes OCP violation of Simple Factory — new type self-registers, existing code untouched.',
      gaonKiBaat: 'Gaon mein naya dukandaar aaya — usne apna naam khud register karwaya panchayat mein. Panchayat ko kuch badalna nahi pada. Registry Pattern wahi hai — naya factory khud register karta hai, purana code nahi badalta. Simple Factory mein panchayat ko khud jaake list update karni padti thi — yahan dukandaar khud aata hai.',
      problems: ['AI provider plugins (add Gemini without touching existing code)', 'Payment gateway plugins', 'Notification channel plugins', 'Database driver plugins'],
      realWorldUses: [
        {
          title: '🤖 AI Provider Plugin System',
          dehaatiAnalaogy: 'Naya dukandaar gaon mein aaya — khud panchayat ke register mein naam likhwaya. Panchayat wale so rahe the, unhe kuch nahi karna pada. Ab gaon wale us dukaan pe bhi ja sakte hain.',
          problem: 'AI service supports OpenAI and Anthropic. Team wants to add Gemini. Simple Factory = edit existing if-else = risk breaking OpenAI/Anthropic.',
          withoutPrototype: 'Add Gemini → open ChatClientFactory.java → add new if block → redeploy entire service → risk regression in existing providers.',
          withPrototype: 'GeminiClientFactory has static block → self-registers on class load → zero changes to existing code → add import in Main.java → done.',
          bugWithoutClone: 'Editing Simple Factory if-else for Gemini: developer accidentally changes else branch → OpenAI requests now routed to Anthropic → wrong API keys → all OpenAI calls fail silently.',
        },
        {
          title: '💳 Payment Gateway Plugins (Razorpay / Stripe / PayU)',
          dehaatiAnalaogy: 'Dukaan mein naya payment machine aaya (PhonePe) — usne khud register kar liya. Cashier ko kuch nahi pata, woh bas "payment karo" bolta hai aur system khud handle kar leta hai.',
          problem: 'E-commerce platform supports Razorpay. Add Stripe for international users. Add PayU for enterprise. Each addition should not touch existing payment code.',
          withoutPrototype: 'PaymentFactory has if-else for each gateway. Every new gateway = open this file, add case, test all gateways again.',
          withPrototype: 'StripeGatewayFactory static block registers itself. PaymentRegistry.get("stripe") returns it. Razorpay untouched.',
          bugWithoutClone: 'Without registry — adding PayU if-else accidentally shadows Razorpay case due to copy-paste error → Indian payments broken → revenue loss.',
        },
      ],
      template: `// Registry — Map replaces if-else
public class ClientFactoryProvider {
    private static final Map<String, AiClientFactory> registry = new HashMap<>();

    public static void register(String provider, AiClientFactory factory) {
        registry.put(provider, factory);
    }

    public static AiClientFactory getAiClientFactory(String provider) {
        AiClientFactory factory = registry.get(provider);
        if (factory == null) throw new IllegalArgumentException("Unknown provider: " + provider);
        return factory;
    }
}

// Self-registration via static block — runs once when JVM loads this class
public class OpenAiClientFactory implements AiClientFactory {
    static {
        ClientFactoryProvider.register("openai", new OpenAiClientFactory());
    }
    // ...
}

// Adding Gemini — ZERO changes to existing code
public class GeminiClientFactory implements AiClientFactory {
    static {
        ClientFactoryProvider.register("gemini", new GeminiClientFactory()); // self-registers
    }
    @Override public AiChatClient   getAiChatClient()   { return new GeminiChatClient(); }
    @Override public AiVectorClient getAiVectorClient() { return new GeminiVectorClient(); }
}

// Client.java — import triggers static block → self-registration
import factory.OpenAiClientFactory;
import factory.GeminiClientFactory;

// Then use normally — registry has both
AiClientFactory factory = ClientFactoryProvider.getAiClientFactory("gemini");`,
    },
    {
      name: 'Pattern 6 — Prototype + Registry',
      icon: '🧬',
      when: 'Use when creating an object is expensive (DB fetch, complex setup) and you need many similar copies — clone a template instead of building from scratch each time',
      gaonKiBaat: 'Gaon mein ek baar achha beej mila — usse baar baar zameen se nahi nikaalte. Uski copy banao aur har khet mein lagao. Prototype wahi hai — ek baar template banao, clone karo aur customize karo.',
      problems: ['Invoice generation for testing', 'VM instance provisioning', 'Email template cloning', 'Mock user generation', 'Game character creation'],
      realWorldUses: [
        {
          title: '📧 Email / SMS Campaigns',
          dehaatiAnalaogy: 'Gaon mein shaadi ka card ek baar chhapa — sirf naam aur date badli, baaki sab same raha. Har ghar ke liye nayi printing nahi hui.',
          problem: 'Marketing platform has one "Welcome" email template. 10,000 users need welcome emails — each with their own name and link.',
          withoutPrototype: 'Fetch template from DB for each user → 10,000 DB calls → minutes of delay.',
          withPrototype: 'Fetch once, clone 10,000 times, customize name/link per clone → milliseconds.',
          bugWithoutClone: 'If registry returns original (not clone) → User A sets subject "Hi Dhiraj!" → template is now corrupted → User B also gets "Hi Dhiraj!" in their email.',
        },
        {
          title: '🧾 Invoice / Bill Generation (Amazon, Medical)',
          dehaatiAnalaogy: 'Medical store mein ek blank bill format hota hai — har customer ke liye wahi format use hota hai, sirf items aur total badlte hain.',
          problem: 'Every order/prescription needs an invoice. Base structure (company logo, GST number, bank details, terms) is always the same.',
          withoutPrototype: 'Build invoice object from scratch for every order — set all common fields repeatedly.',
          withPrototype: 'One invoice template in registry. Clone per order, set customer name + items. Common fields already pre-filled.',
          bugWithoutClone: 'Shared invoice object: Order A sets total ₹500 → Order B (concurrent) sets total ₹200 → Order A\'s invoice now shows ₹200. Production billing bug.',
        },
        {
          title: '☁️ VM / Server Provisioning (Cloud)',
          dehaatiAnalaogy: 'Ek baar achha khana bana lo — phir har thali mein wahi khana paroso, sirf naam ki placard badlo. Baar baar chulha mat jalao.',
          problem: 'Cloud platform needs to spin up 50 identical backend servers. Each needs Ubuntu 22.4, Docker, Datadog, nginx, curl — same config.',
          withoutPrototype: 'Set all fields for each of 50 server objects separately. Tedious + error-prone.',
          withPrototype: 'One "backend-server" template in registry. Clone 50 times, set unique hostname + IP per clone.',
          bugWithoutClone: 'If template is mutated directly → all 50 servers inherit the mutation → one wrong config breaks entire fleet.',
        },
        {
          title: '🎮 Game Development (Enemies / Characters)',
          dehaatiAnalaogy: 'FPS game mein ek hi zombie model bana — phir 1000 jagah spawn karo. Har zombie ka health aur position alag hoga, baaki sab same.',
          problem: 'Spawn 1000 enemy zombies on a map. Each zombie shares same model, speed, attack pattern — only position and current health differ.',
          withoutPrototype: 'Create 1000 zombie objects from scratch → load textures, animations, AI config for each → game freezes.',
          withPrototype: 'One zombie template with all config loaded. Clone 1000 times (microseconds), set position + health per clone.',
          bugWithoutClone: 'Shared zombie object: Zombie A takes damage → health drops to 20 → all 1000 zombies now have 20 health. Entire army dies together.',
        },
        {
          title: '🧪 Testing — Mock Object Generation',
          dehaatiAnalaogy: 'Exam mein ek hi question paper chhapa — har student ko copy mili. Teacher ne baar baar nahi likha.',
          problem: '100 test cases each need a User object with realistic data (name, email, age, preferences). Fetching from DB = 2-3 seconds per user.',
          withoutPrototype: '100 test cases × 3 seconds = 5 minutes just setting up test data. CI pipeline becomes unbearably slow.',
          withPrototype: 'One realistic User template fetched once. Clone 100 times, override only what each test needs. Total setup: milliseconds.',
          bugWithoutClone: 'Test A modifies shared user → sets role to ADMIN → Test B runs → unexpectedly sees ADMIN user → flaky test that passes sometimes, fails sometimes depending on test order.',
        },
      ],
      template: `// Step 1 — Prototype interface
public interface Prototype<T> {
    T clone();
}

// Step 2 — Object implements Prototype with copy constructor
public class VMInstance implements Prototype<VMInstance> {
    private String os;
    private String runtime;
    private String monitoringAgent;
    private String hostname;
    private String ipAddress;
    private List<String> installedPackages = new ArrayList<>();

    public VMInstance(String os, String runtime, String monitoringAgent,
                      String hostname, String ipAddress) {
        this.os = os; this.runtime = runtime;
        this.monitoringAgent = monitoringAgent;
        this.hostname = hostname; this.ipAddress = ipAddress;
    }

    // Copy constructor — deep copy of all fields including collections
    public VMInstance(VMInstance other) {
        this.os = other.os; this.runtime = other.runtime;
        this.monitoringAgent = other.monitoringAgent;
        this.hostname = other.hostname; this.ipAddress = other.ipAddress;
        this.installedPackages = new ArrayList<>(other.installedPackages); // deep copy!
    }

    @Override
    public VMInstance clone() { return new VMInstance(this); }

    public void addPackage(String pkg) { installedPackages.add(pkg); }

    public List<String> getInstalledPackages() {
        return new ArrayList<>(installedPackages); // defensive copy in getter
    }
}

// Step 3 — Child class overrides clone() with covariant return type
public class GpuVMInstance extends VMInstance {
    private String gpuType;

    public GpuVMInstance(GpuVMInstance other) {
        super(other.getOs(), other.getRuntime(), other.getMonitoringAgent(),
              other.getHostname(), other.getIpAddress());
        this.gpuType = other.gpuType;
    }

    @Override
    public GpuVMInstance clone() { return new GpuVMInstance(this); } // returns GpuVMInstance, not VMInstance
}

// Step 4 — Registry stores templates, always returns clones
public class VMInstanceRegistry {
    private HashMap<String, VMInstance> registry = new HashMap<>();

    public void addVMInstance(String key, VMInstance template) {
        registry.putIfAbsent(key, template); // silent ignore on duplicate key
    }

    public VMInstance getVMInstance(String key) {
        VMInstance template = registry.get(key);
        if (template == null) return null;
        return template.clone(); // ALWAYS clone — never expose template directly
    }
}

// Usage — fill registry once, clone many times
VMInstanceRegistry registry = new VMInstanceRegistry();
VMInstance ubuntu = new VMInstance("Ubuntu 22.4", "Docker 1.2", "Datadog", null, null);
ubuntu.addPackage("nginx");
ubuntu.addPackage("curl");
registry.addVMInstance("backend-v3", ubuntu);

// Each caller gets their own independent copy
VMInstance server1 = registry.getVMInstance("backend-v3");
server1.setHostname("api.scaler.com");

VMInstance server2 = registry.getVMInstance("backend-v3");
server2.setHostname("web.scaler.com"); // server1 unaffected`,
    },
    {
      name: 'Pattern 7 — Adapter',
      icon: '🔌',
      when: 'Use when you have an external API or class you cannot modify, but its interface does not match what your system expects. Adapter wraps the incompatible class and makes it speak your language.',
      gaonKiBaat: 'Gaon mein ek banda hai jo sirf Bhojpuri mein bolta hai, aur dusra sirf English mein sunna chahta hai. Beech mein ek translator aaya — woh Bhojpuri sunke English mein convert karta hai. Adapter wahi translator hai — external API apni bhasha mein bolta hai, Adapter convert karke tumhari interface pe fit kar deta hai. Adapter khud naya kaam nahi karta — sirf convert karta hai.',
      problems: ['Payment gateway integration (YesBank/ICICI behind common BankApi)', 'Social media posting (Twitter/Facebook behind common SocialMediaClient)', 'Translation APIs (Google/Microsoft behind common TranslationService)', 'Insurance claim status (AutoProtect/TravelGuard behind common ClaimService)'],
      realWorldUses: [
        {
          title: '💳 Payment Gateway Integration',
          dehaatiAnalaogy: 'Har bank ka ATM machine alag tarah ka card reader use karta tha. Ek universal adapter aaya — tu apna card daalo, adapter bank ke hisaab se signal convert karta hai. Tu bank ka internal kaam nahi jaanta.',
          problem: 'E-commerce platform needs to integrate YesBank and ICICI. Both have different method names, return types, and parameter formats. Cannot modify the bank SDKs.',
          withoutPrototype: 'Caller code checks bank type and calls different methods directly — tightly coupled to each bank\'s SDK. Adding a new bank = change everywhere.',
          withPrototype: 'BankApi interface (Target) with processPayment(). YesBankAdapter wraps YesBankSdk and translates. Caller only knows BankApi — never the bank SDK.',
          bugWithoutClone: 'YesBank returns "TXN_SUCCESS", ICICI returns "APPROVED". Without Adapter, caller must handle both strings — business logic polluted with provider-specific quirks. Adapter maps them to one common enum.',
        },
        {
          title: '🐦 Social Media Posting (Twitter/Facebook)',
          dehaatiAnalaogy: 'WhatsApp mein message bhejne ka tarika alag hai, SMS ka alag hai. Tu sirf "message bhejo" bolta hai — adapter decide karta hai andar se kaun sa API call karna hai.',
          problem: 'Marketing platform posts to Twitter and Facebook. Twitter has tweet(), Facebook has post(). Platform cannot modify either SDK.',
          withoutPrototype: 'Caller checks platform and calls tweet() or post() — tightly coupled. New platform (Instagram) = change all callers.',
          withPrototype: 'SocialMediaClient interface with sendMessage(). TwitterAdapter.sendMessage() calls tweet(). FacebookAdapter.sendMessage() calls post(). Caller decoupled.',
          bugWithoutClone: 'Twitter has 280 char limit, Facebook has none. Without Adapter, validation must go in caller. With Adapter, each adapter handles its own provider quirks internally.',
        },
        {
          title: '🌐 Translation APIs (Google/Microsoft)',
          dehaatiAnalaogy: 'Ek dukan French mein order leta hai, dusri Spanish mein. Tu sirf "translate karo" bolta hai — adapter andar jaake sahi API call karta hai.',
          problem: 'App supports Google Translate and Microsoft Translator. Both have different request formats, auth headers, and response structures.',
          withoutPrototype: 'Direct API calls sprinkled across codebase — every caller builds different HTTP requests for each provider.',
          withPrototype: 'TranslationService interface with translate(text, from, to). GoogleTranslationAdapter and MicrosoftTranslationAdapter implement it — each builds the correct HTTP request internally.',
          bugWithoutClone: 'TravelGuard insurance API returns "SUCCESS" for approved claims. ClaimStatus enum has APPROVED, not SUCCESS. Without Adapter: ClaimStatus.valueOf("SUCCESS") throws IllegalArgumentException. Adapter maps "SUCCESS" → ClaimStatus.APPROVED explicitly.',
        },
      ],
      template: `// Target interface — what YOUR system expects
public interface BankApi {
    void processPayment(String amount, String currency);
    String getTransactionStatus(String txnId);
}

// Adaptee — external SDK you CANNOT modify
public class YesBankSdk {
    public void makePayment(double amount, String curr) { /* YesBank logic */ }
    public String checkTxn(String ref)                  { return "TXN_SUCCESS"; }
}

// Adapter — written by YOU (the platform), not the bank
// Extends Adaptee OR holds it as a field (prefer composition)
public class YesBankAdapter implements BankApi {
    private YesBankSdk yesBankSdk;  // holds the adaptee

    public YesBankAdapter(YesBankSdk sdk) { this.yesBankSdk = sdk; }

    @Override
    public void processPayment(String amount, String currency) {
        yesBankSdk.makePayment(Double.parseDouble(amount), currency); // translate
    }

    @Override
    public String getTransactionStatus(String txnId) {
        String raw = yesBankSdk.checkTxn(txnId);
        return raw.equals("TXN_SUCCESS") ? "SUCCESS" : "FAILED"; // normalize
    }
}

// Caller — only knows BankApi, never YesBank or ICICI
BankApi bank = new YesBankAdapter(new YesBankSdk());
bank.processPayment("500.00", "INR");
bank.getTransactionStatus("TXN-123");

// Adding ICICI? Create IciciBankAdapter — zero changes to caller.`,
    },
    {
      name: 'Pattern 8 — Facade',
      icon: '🏛️',
      when: 'Use when multiple subsystems need to be orchestrated in a specific sequence, and you want to hide that complexity behind one simple entry point. Facade has NO business logic — it just wires services together and calls them in order.',
      gaonKiBaat: 'Gaon mein Amazon se kuch order karo — ek hi button dabao "Place Order". Peeche Inventory check hoti hai, invoice banta hai, email aata hai — teen alag karamchari hain. Tu kisi se seedha baat nahi karta. Facade wahi receptionist hai — ek jagah se bolo, woh sab ko coordinate karta hai. Facade andar koi naya kaam nahi karta — sirf sabko sahi order mein bulata hai.',
      problems: ['Amazon Place Order (Inventory + Invoice + Email)', 'Image editing pipeline (Load + Filter + Modify + Save + Analytics)', 'Travel booking (Hotels + Flights + Payment + Notification)', 'Data analysis (Fetch + Clean + Analyse + Report)'],
      realWorldUses: [
        {
          title: '🛒 Amazon Place Order',
          dehaatiAnalaogy: 'Dukan mein seedha counter pe jaate ho — "ek kilo atta do". Counter wala andar jaake stock check karta hai, bill banata hai, deliver ka intejar karta hai. Tu andar nahi jaata. Facade wahi counter hai.',
          problem: 'Client places order. Internally: InventoryService must update stock, InvoiceService must generate bill, MailService must send confirmation — always in this order.',
          withoutPrototype: 'Client calls all three services directly in right order — client now knows too much. Change the flow (add SMS step) = change every caller.',
          withPrototype: 'PlaceOrderFacade.placeOrder(order) — single call, Facade coordinates all three services internally. Client knows nothing about subsystems.',
          bugWithoutClone: 'Without Facade: client calls InvoiceService before InventoryService — invoice generated for out-of-stock item. Facade enforces order: inventory first → invoice → email. Order is the Facade\'s only job.',
        },
        {
          title: '🖼️ Image Editing Pipeline',
          dehaatiAnalaogy: 'Photo studio mein — tu photo deta hai, woh load karte hain, filter lagate hain, size badlte hain, save karte hain, analytics track karte hain. Tu sirf "edit karo" bolta hai, andar 5 log kaam karte hain.',
          problem: 'Image editing has 5 steps: ImageLoader → FilterService → ImageModifier → ImageWriter → AnalyticsService. Client should not orchestrate all 5.',
          withoutPrototype: 'Client calls all 5 services — tightly coupled to pipeline order. Adding a step = update all callers.',
          withPrototype: 'ImageEditingFacade.editImage(path, filter, brightness) — one call, Facade calls all 5 in sequence. Manager holds only the Facade and delegates.',
          bugWithoutClone: 'Manager class had all 5 services directly — test said "Manager should have no dependencies". Fix: Facade holds services, Manager holds only Facade. This enforces separation: Manager is client, Facade is coordinator.',
        },
        {
          title: '✈️ Travel Booking',
          dehaatiAnalaogy: 'Travel agent se bolo "Delhi se Mumbai, 3 din" — woh hotel book karta hai, flight book karta hai, payment leta hai, confirmation bhejta hai. Tu teen alag websites pe nahi jaata.',
          problem: 'Travel booking: HotelService + FlightService + PaymentService + NotificationService must all fire in sequence. Client should not manage this.',
          withoutPrototype: 'Client orchestrates all services. Partial failure (payment fails) = client must handle rollback across multiple services. Too much responsibility.',
          withPrototype: 'BookingFacade.bookTravel(request) — single entry point. Facade handles sequence + error cases. Client just calls once.',
          bugWithoutClone: 'Facade has NO business logic — it only calls services in order. If validation or decisions are needed, those belong in the individual services, not the Facade. Mixing business logic in Facade defeats the pattern.',
        },
      ],
      template: `// Services (subsystems) — each does ONE thing
public class InventoryService  { public void updateInventory(Order o)  { /* ... */ } }
public class InvoiceService    { public void generateInvoice(Order o)  { /* ... */ } }
public class MailService       { public void sendEmail(Order o)        { /* ... */ } }

// Facade — holds ALL services, orchestrates in sequence, ZERO business logic
public class PlaceOrderFacade {
    private InventoryService inventoryService;
    private InvoiceService   invoiceService;
    private MailService      mailService;

    public PlaceOrderFacade() {
        this.inventoryService = new InventoryService();
        this.invoiceService   = new InvoiceService();
        this.mailService      = new MailService();
    }

    public void placeOrder(Order order) {
        inventoryService.updateInventory(order);  // step 1
        invoiceService.generateInvoice(order);    // step 2
        mailService.sendEmail(order);             // step 3
        // No business logic here — just coordination
    }
}

// Manager — holds ONLY the Facade, delegates everything
// (Manager is the client-facing class; Facade is the coordinator)
public class OrderManager {
    private PlaceOrderFacade facade;

    public OrderManager() { this.facade = new PlaceOrderFacade(); }

    public void processOrder(Order order) {
        facade.placeOrder(order);  // delegates — Manager has zero service dependencies
    }
}

// Client — calls Manager, never knows about services
OrderManager manager = new OrderManager();
manager.processOrder(new Order("item-123", "dhiraj@gmail.com"));

// Facade vs Manager:
// Facade  — holds services (InventoryService, InvoiceService, MailService)
// Manager — holds only Facade; delegates; is the client-facing entry point`,
    },
  ],

  rules: [
    {
      rule: 'Singleton → volatile + double null check + synchronized on class',
      tag: 'key',
      detail: 'volatile prevents partially constructed object visible to other threads. First null check = fast path (no lock). Second null check = safe path (inside lock). Both checks needed.',
    },
    {
      rule: 'resetInstance() → only single synchronized block, NOT DCL',
      tag: 'gotcha',
      detail: 'Reset always sets to null — there is no partially constructed object risk. DCL is for creation only. Single synchronized block is enough for reset.',
    },
    {
      rule: 'Builder → setters return `this` (the Builder), not the main class',
      tag: 'key',
      detail: 'return this enables method chaining: .setUrl(...).setUsername(...).build(). If setter returns void, chaining breaks.',
    },
    {
      rule: 'Builder → build() creates the main object, not the builder itself',
      tag: 'gotcha',
      detail: 'Common mistake: returning Builder from build(). build() must return the final product — DatabaseConfiguration, not Builder.',
    },
    {
      rule: 'Builder solves inconsistent state — object is half-built between new() and last setter',
      tag: 'key',
      detail: 'Without Builder: new DatabaseConfiguration() exists but fields are null until setters are called. With Builder: main object only exists after build() — all fields set at once.',
    },
    {
      rule: 'Simple Factory violates OCP — adding new type requires editing factory',
      tag: 'gotcha',
      detail: 'if-else chain in factory must be touched for every new type. Registry Pattern fixes this — new provider self-registers, factory never changes.',
    },
    {
      rule: 'Registry + self-registering factories → circular static init → StackOverflowError',
      tag: 'gotcha',
      detail: `Gotcha: If the Registry references concrete factories (e.g. calls new OpenAiClientFactory() in its own static block), AND the factory's static block also calls Registry.register() → circular dependency → JVM tries to load each class while it is already loading → StackOverflowError.

Root cause: circular static initialization.
  Registry static block → loads OpenAiClientFactory → OpenAiClientFactory static block → loads Registry → Registry static block → ... (infinite)

Fix: ONE-WAY dependency only.
  ✅ Factory knows about Registry (factory calls Registry.register() in its static block)
  ❌ Registry NEVER imports or references any concrete factory

Registry is passive — it just stores what is pushed into it.
Factory is active — it pushes itself in on class load.

Trigger class loading explicitly in Main/Client:
  import OpenAiClientFactory; // this line triggers the static block = self-registration

Without this import, the static block never runs and the factory is never registered.`,
    },
    {
      rule: 'Abstract Factory = guarantees FAMILY consistency',
      tag: 'key',
      detail: 'If chat is OpenAI and vector is Anthropic — mismatch. Abstract Factory ensures both come from same provider because one factory creates both.',
    },
    {
      rule: 'Static block runs ONCE when JVM first loads the class',
      tag: 'key',
      detail: 'Self-registration trick: static block in GeminiClientFactory calls register(). Triggered by import. No existing code needs to know about GeminiClientFactory.',
    },
    {
      rule: 'Registry Pattern = OCP compliant factory',
      tag: 'key',
      detail: 'Open for extension (add new factory by self-registering), closed for modification (ClientFactoryProvider never changes). New team can add provider without touching existing code.',
    },
    {
      rule: 'Prototype → copy constructor copies all fields including private ones directly',
      tag: 'key',
      detail: 'Copy constructor (VMInstance other) can access other.os directly even though os is private — same class, so private access is allowed. Client code cannot do this.',
    },
    {
      rule: 'Prototype → List field must use new ArrayList<>(other.list) not this.list = other.list',
      tag: 'gotcha',
      detail: 'Shallow copy: both original and clone share the same list object. Modifying one corrupts the other. new ArrayList<>(other.list) creates an independent copy — deep copy.',
    },
    {
      rule: 'Registry → getVMInstance() must always return clone, never the template itself',
      tag: 'gotcha',
      detail: 'If registry returns the original, any caller can mutate the template. All subsequent callers get corrupted data. Registry must clone before returning.',
    },
    {
      rule: 'Prototype getter → return new ArrayList<>(installedPackages) not installedPackages directly',
      tag: 'gotcha',
      detail: 'Returning the internal list lets caller mutate it from outside — breaks encapsulation. Defensive copy in getter ensures the internal state is protected.',
    },
    {
      rule: 'Child class clone() should return child type (covariant return), not parent type',
      tag: 'key',
      detail: 'GpuVMInstance.clone() returns GpuVMInstance, not VMInstance. If it returned VMInstance, gpuType field would be lost in the copy. Java allows child return type (covariant) to be more specific than parent interface.',
    },
    {
      rule: 'putIfAbsent → silently ignores duplicate key, does not throw exception',
      tag: 'gotcha',
      detail: 'registry.put() would overwrite the existing template silently. putIfAbsent protects existing templates from being overwritten by accident. HashMap.get() returns null for missing key — always null-check before calling .clone().',
    },
    {
      rule: 'type.cast() vs (T) for generic casting',
      tag: 'gotcha',
      detail: 'When you have Class<T> type token, use type.cast(value) not (T) value. type.cast() throws ClassCastException at the right place; (T) gives unchecked warning and fails later.',
    },
    {
      rule: 'Adapter is written by YOU (the platform), not by the external provider',
      tag: 'key',
      detail: 'Bank/payment SDK authors do not write adapters for your system. Your platform writes YesBankAdapter that wraps YesBankSdk. Adapter lives in your codebase, not the external library.',
    },
    {
      rule: 'Adapter = prefer composition over inheritance (hold Adaptee as a field)',
      tag: 'key',
      detail: 'class YesBankAdapter implements BankApi { private YesBankSdk sdk; } — holds the adaptee. Inheritance (extends YesBankSdk) works but ties you to the class hierarchy and prevents mocking in tests.',
    },
    {
      rule: 'Adapter maps provider-specific quirks internally — caller never sees them',
      tag: 'gotcha',
      detail: 'TravelGuard returns "SUCCESS" not "APPROVED". Adapter maps this inside getClaimStatus(). Caller only sees ClaimStatus.APPROVED. Business logic stays clean.',
    },
    {
      rule: 'Facade = no business logic — only orchestration (call services in order)',
      tag: 'key',
      detail: 'If you add if-else or validation inside a Facade method, you are doing it wrong. That logic belongs in the individual services. Facade only wires calls together.',
    },
    {
      rule: 'Facade vs Manager: Facade holds services, Manager holds only Facade',
      tag: 'gotcha',
      detail: 'Manager is the client-facing class. It holds only the Facade and delegates. Facade holds all the services. If Manager directly holds InventoryService — the test fails and the pattern breaks.',
    },
    {
      rule: 'Facade enforces call ORDER — that is its only real value',
      tag: 'key',
      detail: 'PlaceOrderFacade ensures: inventory first → invoice → email. Without Facade, client code can call in wrong order. Facade owns sequence as a single responsibility.',
    },
  ],

  complexity: [
    { problem: 'Singleton DCL', tc: 'O(1)', sc: 'O(1)', note: 'volatile + two null checks + synchronized block' },
    { problem: 'Builder build()', tc: 'O(1)', sc: 'O(fields)', note: 'Copies all fields from Builder to main object' },
    { problem: 'Registry lookup', tc: 'O(1)', sc: 'O(providers)', note: 'HashMap get — constant time regardless of provider count' },
    { problem: 'Simple Factory', tc: 'O(n)', sc: 'O(1)', note: 'if-else chain — linear scan through types' },
    { problem: 'Abstract Factory', tc: 'O(1)', sc: 'O(1)', note: 'Direct instantiation — no lookup needed' },
    { problem: 'Static block', tc: 'O(1)', sc: 'O(1)', note: 'Runs once at class load time — negligible cost' },
    { problem: 'Prototype clone()', tc: 'O(f)', sc: 'O(f)', note: 'f = number of fields. Copies each field once. Collection fields need deep copy — O(n) where n = collection size' },
    { problem: 'Registry get + clone', tc: 'O(1) + O(f)', sc: 'O(f)', note: 'HashMap lookup O(1), then clone O(f). Much faster than DB fetch O(seconds)' },
  ],

  quiz: [
    {
      q: 'Why is `volatile` needed on the Singleton instance field?',
      options: [
        'To make the field thread-safe (only one thread can write at a time)',
        'To prevent a partially constructed object being visible to other threads before constructor finishes',
        'volatile is required for all static fields in Java',
        'To make the field immutable after first assignment',
      ],
      answer: 1,
      explanation: 'Without volatile, JVM/CPU can reorder instructions. Thread A may write the reference before finishing construction — Thread B sees non-null reference but gets a partially built object. volatile adds a memory barrier preventing this reorder.',
    },
    {
      q: 'Why does DCL have TWO null checks but resetInstance() only has ONE synchronized block?',
      options: [
        'resetInstance() is less important so less safety is needed',
        'DCL protects against partial construction during creation. Reset always sets to null — no partial construction possible — single synchronized is enough',
        'resetInstance() is called less frequently so locking overhead does not matter',
        'Both should use DCL — resetInstance() is wrong with single lock',
      ],
      answer: 1,
      explanation: 'DCL prevents partially constructed object being returned. Reset has no construction — it always writes null. Outcome is always null regardless of thread ordering. Single synchronized block prevents concurrent resets from racing — that is sufficient.',
    },
    {
      q: 'In Builder pattern, what does `return this` in a setter achieve?',
      options: [
        'Returns the main object (DatabaseConfiguration) early',
        'Returns the Builder itself — enables method chaining like .setUrl(...).setUsername(...).build()',
        'Returns null to indicate setter succeeded',
        'Returns the previous value of the field',
      ],
      answer: 1,
      explanation: 'return this returns the Builder object itself. This lets you chain: new Builder().setUrl("...").setPassword("...").build() — each setter returns the same Builder so the next setter can be called immediately.',
    },
    {
      q: 'Why does Simple Factory violate Open/Closed Principle?',
      options: [
        'It uses static methods which cannot be overridden',
        'Every new type requires editing the if-else chain inside the factory — modifying existing code',
        'Simple Factory does not support interfaces',
        'It creates objects at runtime which is unsafe',
      ],
      answer: 1,
      explanation: 'OCP says: open for extension, closed for modification. Simple Factory must be edited to add "slack" or "whatsapp" type — existing code changes. Registry Pattern fixes this — new providers self-register without touching factory.',
    },
    {
      q: 'Why use Abstract Factory over creating chat and vector clients separately?',
      options: [
        'Abstract Factory is faster to execute',
        'Abstract Factory guarantees chat and vector clients come from the same provider — prevents OpenAI chat + Anthropic vector mismatch',
        'You cannot create clients separately in Java',
        'Abstract Factory uses less memory',
      ],
      answer: 1,
      explanation: 'If you create chat and vector clients independently, a caller could mix providers — OpenAI chat with Anthropic vectors. Abstract Factory groups them: one factory creates both, so they are always from the same provider. Consistency guaranteed by design.',
    },
    {
      q: 'When does a static block in a Java class run?',
      options: [
        'Every time a new object of the class is created',
        'Once when JVM first loads the class — triggered by first use (import, new, static method call)',
        'At application startup always, regardless of whether the class is used',
        'Only when explicitly called with ClassName.static()',
      ],
      answer: 1,
      explanation: 'Static blocks run exactly once per class load — when JVM first loads the class. This is triggered by: first new, first static method call, or in this pattern, by the import statement triggering class loading. Used for self-registration without any external coordinator.',
    },
    {
      q: 'In Registry Pattern, a new team wants to add "Azure" AI provider. What files must they create or edit?',
      options: [
        'Edit ClientFactoryProvider.java to add "azure" to the registry map',
        'Edit AiClientFactory.java to add Azure methods',
        'Create AzureClientFactory.java with a static block that self-registers — zero edits to existing files',
        'Edit Client.java to add the azure import and update the factory lookup',
      ],
      answer: 2,
      explanation: 'Registry Pattern: new provider creates own factory with static block calling ClientFactoryProvider.register("azure", ...). Adding the import in Client.java triggers class loading which triggers the static block. No existing file needs to change — OCP satisfied.',
    },
    {
      q: 'In Prototype pattern, why use a copy constructor instead of just copying fields manually in the caller?',
      options: [
        'Copy constructor is faster because it skips validation',
        'Caller would need to know all private fields — Prototype encapsulates the copy logic inside the class itself',
        'Java requires copy constructors for all cloneable classes',
        'Copy constructor avoids creating a new object on the heap',
      ],
      answer: 1,
      explanation: 'Private fields cannot be accessed from outside the class. Only the class itself can copy its own private state. Copy constructor keeps clone logic encapsulated — caller just calls .clone() without knowing any internal details.',
    },
    {
      q: 'What is the silent bug in: `this.installedPackages = other.installedPackages`?',
      options: [
        'NullPointerException if installedPackages is null',
        'Both original and clone share the same list object — modifying one corrupts the other',
        'The list is not sorted after assignment',
        'installedPackages is private so this line will not compile',
      ],
      answer: 1,
      explanation: 'This is a shallow copy — both objects point to the same ArrayList in memory. If clone adds a package, the original also sees it. Fix: new ArrayList<>(other.installedPackages) — creates an independent copy.',
    },
    {
      q: 'Why must VMInstanceRegistry.getVMInstance() return a clone, not the original template?',
      options: [
        'Cloning is faster than returning a reference',
        'If the original is returned, any caller can mutate the template — corrupting all future clones for other callers',
        'Java garbage collector requires cloned objects to be returned from methods',
        'The original template may be null',
      ],
      answer: 1,
      explanation: 'Registry stores templates as a shared source of truth. If caller A gets the original and sets hostname, the template itself is modified. Caller B now gets a template with A\'s hostname. Always clone before returning — each caller gets their own independent copy.',
    },
    {
      q: 'Builder pattern prevents "inconsistent state". What does inconsistent state mean?',
      options: [
        'Two threads writing to the same object at the same time',
        'Object exists (new was called) but fields are not fully set yet — half-built object is visible',
        'Builder and main object have different field values',
        'Object is built but some setters returned wrong values',
      ],
      answer: 1,
      explanation: 'Without Builder: new DatabaseConfiguration() returns immediately, then you call setters one by one. Between new() and last setter, the object exists with null/default fields — another thread could grab this incomplete object. Builder creates the main object only in build() — all fields set at once, never half-built.',
    },
    {
      q: 'In Adapter pattern, who writes the Adapter class — the external provider or your platform?',
      options: [
        'The external provider (YesBank) writes the adapter to match your interface',
        'Your platform writes the Adapter to wrap the external SDK and match your Target interface',
        'Both parties write their own adapters and the system picks one at runtime',
        'The JVM generates adapters automatically using reflection',
      ],
      answer: 1,
      explanation: 'External providers (banks, translation services) know nothing about your BankApi or SocialMediaClient interfaces. YOUR platform writes YesBankAdapter that implements your BankApi and internally calls the YesBankSdk. Adapter lives in your codebase.',
    },
    {
      q: 'TravelGuard insurance API returns "SUCCESS" for approved claims, but your ClaimStatus enum has APPROVED. What happens if you call ClaimStatus.valueOf("SUCCESS")?',
      options: [
        'Returns ClaimStatus.APPROVED because Java does case-insensitive matching',
        'Throws IllegalArgumentException — "SUCCESS" does not match any enum constant',
        'Returns null — valueOf() returns null for unmatched strings',
        'Compiles fine but returns a default value of the first enum constant',
      ],
      answer: 1,
      explanation: 'ClaimStatus.valueOf() does exact string match against enum constant names. ClaimStatus has APPROVED, REJECTED — no SUCCESS. The fix is in the Adapter: if (raw.equalsIgnoreCase("SUCCESS")) return ClaimStatus.APPROVED; else return ClaimStatus.valueOf(raw);',
    },
    {
      q: 'What is wrong with putting business logic (validation, decisions) inside a Facade method?',
      options: [
        'Facade methods cannot contain if-else statements in Java',
        'Nothing — Facade is the right place for business rules',
        'Business logic in Facade mixes coordination with decisions — Facade should only orchestrate. Logic belongs in individual services.',
        'Facade methods run slower when they contain business logic',
      ],
      answer: 2,
      explanation: 'Facade\'s single responsibility is to wire service calls in order. If Facade checks "is item in stock before invoicing", that is InventoryService\'s job. Mixing logic in Facade makes it a God class that is hard to test and change.',
    },
    {
      q: 'Scaler test says "ImageEditingManager should have no service dependencies". What does this mean for the design?',
      options: [
        'Manager should not exist — delete it and only use Facade',
        'Manager holds only ImageEditingFacade (not the 5 services directly). Facade holds all the services. Manager delegates to Facade.',
        'Manager should call services statically without holding references',
        'Services should be passed to Manager at runtime via method parameters, not constructor',
      ],
      answer: 1,
      explanation: 'The Facade pattern enforces: Facade = holds services + coordinates. Manager = holds only Facade + delegates. If Manager held ImageLoader, FilterService etc. directly, the Facade would be pointless. The test enforces this separation explicitly.',
    },
  ],
}
