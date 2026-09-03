export const designPatternsCheatsheet = {
  title: 'Design Patterns (LLD)',

  patterns: [
    {
      name: 'Pattern 1 — Singleton',
      icon: '👑',
      when: 'Use when exactly ONE instance of a class should exist across the entire application',
      gaonKiBaat: 'Gaon mein ek hi Pradhan hota hai — do Pradhan ek saath nahi ho sakte. Agar koi naya Pradhan banana chaahe, toh wahi purana Pradhan milta hai. Singleton wahi hai — ek hi instance, baar baar wahi milta hai.',
      problems: ['Database connection pool', 'Logger', 'Configuration manager', 'Thread pool'],
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
      when: 'Use when object creation logic should be in one place, not scattered across callers',
      gaonKiBaat: 'Gaon mein jalebi banane wala ek hi hota hai — tu sirf bolta hai "jalebi do" aur woh bana ke deta hai. Tu andar ka process nahi jaanta. Simple Factory wahi hai — ek jagah se object maango, kaise bana yeh chhupa rahega.',
      problems: ['Notification sender (SMS/Email/Push)', 'Shape creator (Circle/Rectangle)', 'Logger factory'],
      template: `// Simple Factory — static method with if-else
public class NotificationFactory {

    public static Notification create(String type) {
        if (type.equals("email")) return new EmailNotification();
        if (type.equals("sms"))   return new SmsNotification();
        if (type.equals("push"))  return new PushNotification();
        throw new IllegalArgumentException("Unknown type: " + type);
    }
}

// Caller — doesn't know how object is created
Notification n = NotificationFactory.create("email");
n.send("Hello!");

// Problem with Simple Factory:
// Adding "slack" notification → must edit NotificationFactory (violates OCP)
// Solution → Factory Method or Registry Pattern`,
    },
    {
      name: 'Pattern 4 — Abstract Factory',
      icon: '🏗️🏭',
      when: 'Use when you need a FAMILY of related objects from the same provider — ensures consistency',
      gaonKiBaat: 'Gaon mein ek hi dukan se chai bhi lo aur samosa bhi lo — dono Sharma ji ki dukan ke hain, ek saath theek lagte hain. Agar chai Sharma ji ki aur samosa Gupta ji ka liya toh mismatch ho sakta hai. Abstract Factory wahi consistency deta hai — ek hi provider se poora set lo.',
      problems: ['AI provider (chat client + vector client must be same provider)', 'UI themes (button + dialog must match)', 'Database drivers (connection + statement)'],
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
      when: 'Use when new providers must be addable WITHOUT editing existing factory code',
      gaonKiBaat: 'Gaon mein naya dukandaar aaya — usne apna naam khud register karwaya panchayat mein. Panchayat ko kuch badalna nahi pada. Registry Pattern wahi hai — naya factory khud register karta hai, purana code nahi badalta.',
      problems: ['AI provider plugins (add Gemini without touching existing code)', 'Payment gateway plugins', 'Notification channel plugins'],
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
      rule: 'type.cast() vs (T) for generic casting',
      tag: 'gotcha',
      detail: 'When you have Class<T> type token, use type.cast(value) not (T) value. type.cast() throws ClassCastException at the right place; (T) gives unchecked warning and fails later.',
    },
  ],

  complexity: [
    { problem: 'Singleton DCL', tc: 'O(1)', sc: 'O(1)', note: 'volatile + two null checks + synchronized block' },
    { problem: 'Builder build()', tc: 'O(1)', sc: 'O(fields)', note: 'Copies all fields from Builder to main object' },
    { problem: 'Registry lookup', tc: 'O(1)', sc: 'O(providers)', note: 'HashMap get — constant time regardless of provider count' },
    { problem: 'Simple Factory', tc: 'O(n)', sc: 'O(1)', note: 'if-else chain — linear scan through types' },
    { problem: 'Abstract Factory', tc: 'O(1)', sc: 'O(1)', note: 'Direct instantiation — no lookup needed' },
    { problem: 'Static block', tc: 'O(1)', sc: 'O(1)', note: 'Runs once at class load time — negligible cost' },
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
  ],
}
