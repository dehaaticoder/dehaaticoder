export const machineCodingCheatsheet = {
  title: 'Machine Coding (LLD)',

  patterns: [
    {
      name: 'Problem 2 — URL Shortener',
      icon: '🔗',
      when: 'Asked to design a system that shortens long URLs, tracks clicks, handles expiry, and returns analytics',
      gaonKiBaat: 'Socho gaon mein ek postman hai. Tumhara ghar ka address bahut lamba hai — "Gali no. 5, Purana Mohalla, Bhola Nagar, District X". Postman kehta hai — "Yaar, itna lamba address mat likho. Main tumhe ek short code dunga — G5PM. Jab bhi koi G5PM bheje, main jaanta hoon kahan deliver karna hai." Yahi kaam karta hai URL Shortener — lamba URL lo, short code do, aur jab short code aaye toh original pe bhej do.',
      scorecard: [
        { round: 'Requirements', score: '70%', note: 'NFRs vague — missing 1000+ req/s, O(1) lookup' },
        { round: 'Entity Design', score: '78%', note: 'ExpiryCleanupJob misplaced in entities, alias vs shortCode unresolved' },
        { round: 'Implementation (attempt 1)', score: '84%', note: 'Missing stubs for Counter/Random strategy, resolve() metadata null' },
        { round: 'Implementation (final)', score: '87%', note: 'Excellent — putIfAbsent, AtomicInteger, testable start() all praised' },
      ],
      problems: [
        'Design a URL Shortener (tinyurl / bitly)',
        'Design a Pastebin',
        'Design an Invite Link system (referral codes)',
        'Design a Feature Flag system (short keys → config)',
      ],
      template: `// ════════════════════════════════════════════════════════
// ENTITIES
// ════════════════════════════════════════════════════════

class ShortUrl {
    private final String shortCode;      // system-generated or derived from alias
    private final String originalUrl;
    private final String customAlias;    // optional user input, null if not provided
    private final LocalDateTime createdAt;
    private final LocalDateTime expiresAt; // absolute timestamp — O(1) isExpired()
    private final String createdBy;      // nullable if anonymous shortening allowed
    private final AtomicInteger clickCount = new AtomicInteger(0); // thread-safe

    public ShortUrl(String originalUrl, String customAlias, LocalDateTime createdAt,
                    LocalDateTime expiresAt, String createdBy, String shortCode) {
        this.originalUrl  = originalUrl;
        this.customAlias  = (customAlias == null || customAlias.isEmpty()) ? null : customAlias;
        this.createdAt    = createdAt;
        this.expiresAt    = expiresAt;
        this.createdBy    = createdBy;
        this.shortCode    = shortCode;
    }

    boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }

    void incrementClicks() { clickCount.incrementAndGet(); }
    public int getClickCount()       { return clickCount.get(); }
    public String getShortCode()     { return shortCode; }
    public String getOriginalUrl()   { return originalUrl; }
    public String getCustomAlias()   { return customAlias; }
    public String getCreatedBy()     { return createdBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
}

class ClickEvent {
    private final String id;           // UUID — globally unique
    private final String shortCode;    // FK to ShortUrl — not object reference (memory)
    private final String clickedBy;    // nullable
    private final String source;       // nullable — mobile/web/api
    private final LocalDateTime clickedAt;

    public ClickEvent(String shortCode, String clickedBy, String source, LocalDateTime clickedAt) {
        this.id        = UUID.randomUUID().toString();
        this.shortCode = shortCode;
        this.clickedBy = clickedBy;
        this.source    = source;
        this.clickedAt = clickedAt;
    }
    public String getId()            { return id; }
    public String getShortCode()     { return shortCode; }
    public String getClickedBy()     { return clickedBy; }
    public String getSource()        { return source; }
    public LocalDateTime getClickedAt() { return clickedAt; }
}

class UrlStats {
    private final int clickCount;
    private final LocalDateTime createdAt;
    private final LocalDateTime expiresAt;
    private final List<ClickEvent> recentEvents;

    public UrlStats(int clickCount, LocalDateTime createdAt,
                    LocalDateTime expiresAt, List<ClickEvent> recentEvents) {
        this.clickCount   = clickCount;
        this.createdAt    = createdAt;
        this.expiresAt    = expiresAt;
        this.recentEvents = recentEvents;
    }
    public int getClickCount()              { return clickCount; }
    public LocalDateTime getCreatedAt()     { return createdAt; }
    public LocalDateTime getExpiresAt()     { return expiresAt; }
    public List<ClickEvent> getRecentEvents() {
        return new ArrayList<>(recentEvents); // defensive copy — protects internal state
    }
}

// ════════════════════════════════════════════════════════
// STRATEGY PATTERN — Code Generation
// ════════════════════════════════════════════════════════

interface CodeGenerationStrategy {
    String generate(String input);
}

// Stateless — no constructor needed
class HashBasedStrategy implements CodeGenerationStrategy {
    public String generate(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest(input.getBytes());
            return HexFormat.of().formatHex(hash).substring(0, 6);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 not available", e); // wrap checked → unchecked
        }
    }
}

class CounterBasedStrategy implements CodeGenerationStrategy {
    private final AtomicInteger counter = new AtomicInteger(0);
    public String generate(String input) {
        return String.valueOf(counter.incrementAndGet());
    }
}

class RandomBasedStrategy implements CodeGenerationStrategy {
    public String generate(String input) {
        return UUID.randomUUID().toString().substring(0, 6);
    }
}

// ════════════════════════════════════════════════════════
// REPOSITORIES
// ════════════════════════════════════════════════════════

class ShortUrlRepository {
    private final ConcurrentHashMap<String, ShortUrl> shortUrlMap = new ConcurrentHashMap<>();

    public boolean saveIfAbsent(ShortUrl shortUrl) {
        // atomic check-and-insert — eliminates race condition
        return shortUrlMap.putIfAbsent(shortUrl.getShortCode(), shortUrl) == null;
    }
    public Optional<ShortUrl> findByShortCode(String shortCode) {
        return Optional.ofNullable(shortUrlMap.get(shortCode));
    }
    public List<ShortUrl> findAllExpired() {
        return shortUrlMap.values().stream()
            .filter(ShortUrl::isExpired)
            .collect(Collectors.toList());
    }
    public void delete(String shortCode) { shortUrlMap.remove(shortCode); }
}

class ClickEventRepository {
    // CopyOnWriteArrayList — read-heavy (many reads per click, rare writes)
    private final ConcurrentHashMap<String, CopyOnWriteArrayList<ClickEvent>> clickEventMap
        = new ConcurrentHashMap<>();

    public void save(ClickEvent clickEvent) {
        // computeIfAbsent — atomic list creation, avoids race on first click
        clickEventMap.computeIfAbsent(clickEvent.getShortCode(),
            k -> new CopyOnWriteArrayList<>()).add(clickEvent);
    }
    public List<ClickEvent> findByShortCode(String shortCode) {
        return clickEventMap.getOrDefault(shortCode, new CopyOnWriteArrayList<>());
    }
}

// ════════════════════════════════════════════════════════
// SERVICE
// ════════════════════════════════════════════════════════

class UrlShortenerService {
    private final ShortUrlRepository shortUrlRepo;
    private final ClickEventRepository clickEventRepo;
    private final CodeGenerationStrategy codeGenStrategy; // DIP — depends on abstraction

    public UrlShortenerService(ShortUrlRepository shortUrlRepo,
                                ClickEventRepository clickEventRepo,
                                CodeGenerationStrategy codeGenStrategy) {
        this.shortUrlRepo    = shortUrlRepo;
        this.clickEventRepo  = clickEventRepo;
        this.codeGenStrategy = codeGenStrategy;
    }

    public String shorten(String longUrl, String customAlias, Integer ttlSeconds, String createdBy) {
        LocalDateTime expiresAt = (ttlSeconds != null)
            ? LocalDateTime.now().plusSeconds(ttlSeconds) : null;

        if (customAlias != null && !customAlias.isEmpty()) {
            ShortUrl shortUrl = new ShortUrl(longUrl, customAlias, LocalDateTime.now(), expiresAt, createdBy, customAlias);
            if (shortUrlRepo.saveIfAbsent(shortUrl)) return customAlias;
            else throw new RuntimeException("Alias already taken");
        }

        // UUID salt — ensures different input each retry, true collision busting
        int retryCnt = 0;
        while (retryCnt < 3) {
            retryCnt++;
            String hashShortCode = codeGenStrategy.generate(longUrl + UUID.randomUUID());
            ShortUrl shortUrl = new ShortUrl(longUrl, customAlias, LocalDateTime.now(), expiresAt, createdBy, hashShortCode);
            if (shortUrlRepo.saveIfAbsent(shortUrl)) return hashShortCode;
        }
        throw new RuntimeException("Error while generating short url");
    }

    public String resolve(String shortCode, String userId, String source) {
        Optional<ShortUrl> shortUrl = shortUrlRepo.findByShortCode(shortCode);
        if (!shortUrl.isPresent()) throw new RuntimeException("URL not found");
        ShortUrl url = shortUrl.get();
        if (url.isExpired()) throw new RuntimeException("URL has expired");
        url.incrementClicks();
        clickEventRepo.save(new ClickEvent(shortCode, userId, source, LocalDateTime.now()));
        return url.getOriginalUrl();
    }

    public UrlStats getStats(String shortCode) {
        Optional<ShortUrl> shortUrl = shortUrlRepo.findByShortCode(shortCode);
        if (!shortUrl.isPresent()) throw new RuntimeException("URL not found");
        ShortUrl url = shortUrl.get();
        // No expiry check — analytics are historical, not tied to redirect eligibility
        List<ClickEvent> events = clickEventRepo.findByShortCode(shortCode);
        return new UrlStats(url.getClickCount(), url.getCreatedAt(), url.getExpiresAt(), events);
    }
}

// ════════════════════════════════════════════════════════
// BACKGROUND JOB
// ════════════════════════════════════════════════════════

class ExpiryCleanupJob {
    private final ShortUrlRepository shortUrlRepo;
    private final int cronInterval; // configurable — not hardcoded
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    public ExpiryCleanupJob(ShortUrlRepository shortUrlRepo, int cronInterval) {
        this.shortUrlRepo = shortUrlRepo;
        this.cronInterval = cronInterval;
    }

    // Separate start() — not in constructor — enables unit testing without scheduler
    public void start() {
        scheduler.scheduleAtFixedRate(this::run, 0, cronInterval, TimeUnit.SECONDS);
    }

    private void run() {
        List<ShortUrl> expired = shortUrlRepo.findAllExpired();
        for (ShortUrl url : expired) {
            shortUrlRepo.delete(url.getShortCode());
        }
        // ClickEvents NOT deleted — analytics are historical data (intentional design decision)
        // In real DB: use ON DELETE SET NULL on shortCode FK in ClickEvent table
    }
}

// ════════════════════════════════════════════════════════
// WIRING (main)
// ════════════════════════════════════════════════════════

ShortUrlRepository shortUrlRepo    = new ShortUrlRepository();
ClickEventRepository clickEventRepo = new ClickEventRepository();
CodeGenerationStrategy strategy     = new HashBasedStrategy(); // swap to Counter/Random — no service change
UrlShortenerService service         = new UrlShortenerService(shortUrlRepo, clickEventRepo, strategy);
ExpiryCleanupJob cleanupJob         = new ExpiryCleanupJob(shortUrlRepo, 60);
cleanupJob.start();

// Usage
String shortCode = service.shorten("https://google.com", null, 3600, "alice");
String original  = service.resolve(shortCode, "bob", "mobile");
UrlStats stats   = service.getStats(shortCode);`,
    },
    {
      name: 'Problem 1 — Design a Vehicle',
      icon: '🚗',
      when: 'Asked to model a real-world entity with multiple types, shared behaviour, and type-specific features',
      gaonKiBaat: 'Gaon mein teen tarah ki gaadi hoti hai — petrol wali, battery wali, aur dono wali (hybrid). Teeno mein brand, price, aur drive() common hai. Lekin petrol wali mein engine hoga, battery wali mein charger hoga. Toh common cheezein ek "gaadi" class mein daal do — aur alag alag cheezein apni apni class mein. Yahi hai Vehicle Design.',
      problems: [
        'Design a Vehicle (Petrol / Electric / Hybrid)',
        'Design a Shape (Circle / Rectangle / Triangle)',
        'Design an Animal (Dog / Cat / Bird)',
        'Design a Payment method (UPI / Card / Wallet)',
      ],
      template: `// ─── ENUMS ───────────────────────────────────────────────
enum VehicleType      { PETROL, HYBRID, PLUGIN_HYBRID, ELECTRIC }
enum TransmissionType { MANUAL, AUTOMATIC, SEMI_AUTOMATIC }

// ─── INTERFACES ───────────────────────────────────────────
interface Refuelable { void refuel(); }
interface Chargeable { void charge(); }

// ─── SUPPORT CLASSES ──────────────────────────────────────
class Engine  { private String type; private int horsepower; }
class Battery { private int capacityKWh; private int chargeLevel; }

// ─── ABSTRACT BASE ────────────────────────────────────────
abstract class Vehicle {
    protected String           brand;
    protected String           modelName;
    protected double           price;
    protected int              capacity;          // seating
    protected TransmissionType transmissionType;
    protected VehicleType      vehicleType;

    public Vehicle(String brand, String modelName, double price,
                   int capacity, TransmissionType transmissionType) {
        this.brand            = brand;
        this.modelName        = modelName;
        this.price            = price;
        this.capacity         = capacity;
        this.transmissionType = transmissionType;
    }

    public abstract void drive();
    public void start() { System.out.println(modelName + " started"); }
    public void stop()  { System.out.println(modelName + " stopped"); }
}

// ─── PETROL VEHICLE ───────────────────────────────────────
class PetrolVehicle extends Vehicle implements Refuelable {
    private Engine engine;

    public PetrolVehicle(String brand, String modelName, double price,
                         int capacity, TransmissionType transmissionType, Engine engine) {
        super(brand, modelName, price, capacity, transmissionType);
        this.vehicleType = VehicleType.PETROL;
        this.engine      = engine;
    }

    @Override public void drive()  { System.out.println("Petrol vehicle driving"); }
    @Override public void refuel() { System.out.println("Petrol vehicle refueling"); }
}

// ─── ELECTRIC VEHICLE ─────────────────────────────────────
class ElectricVehicle extends Vehicle implements Chargeable {
    private Battery battery;

    public ElectricVehicle(String brand, String modelName, double price,
                           int capacity, TransmissionType transmissionType, Battery battery) {
        super(brand, modelName, price, capacity, transmissionType);
        this.vehicleType = VehicleType.ELECTRIC;
        this.battery     = battery;
    }

    @Override public void drive()  { System.out.println("Electric vehicle driving"); }
    @Override public void charge() { System.out.println("Electric vehicle charging"); }
}

// ─── HYBRID VEHICLE (HEV) ─────────────────────────────────
class HybridVehicle extends Vehicle implements Refuelable {
    protected Engine  engine;
    protected Battery battery;

    public HybridVehicle(String brand, String modelName, double price,
                         int capacity, TransmissionType transmissionType,
                         Engine engine, Battery battery) {
        super(brand, modelName, price, capacity, transmissionType);
        this.vehicleType = VehicleType.HYBRID;
        this.engine      = engine;
        this.battery     = battery;
    }

    @Override public void drive()  { System.out.println("Hybrid vehicle driving"); }
    @Override public void refuel() { System.out.println("Hybrid vehicle refueling"); }
}

// ─── PLUGIN HYBRID VEHICLE (PHEV) ─────────────────────────
class PluginHybridVehicle extends HybridVehicle implements Chargeable {

    public PluginHybridVehicle(String brand, String modelName, double price,
                                int capacity, TransmissionType transmissionType,
                                Engine engine, Battery battery) {
        super(brand, modelName, price, capacity, transmissionType, engine, battery);
        this.vehicleType = VehicleType.PLUGIN_HYBRID;
    }

    @Override public void drive()  { System.out.println("Plugin Hybrid driving"); }
    @Override public void charge() { System.out.println("Plugin Hybrid charging"); }
}

// ─── CLIENT ───────────────────────────────────────────────
Engine  engine  = new Engine();
Battery battery = new Battery();

// Polymorphism via abstract class reference
Vehicle petrol = new PetrolVehicle("Toyota", "Camry", 2500000, 5, TransmissionType.AUTOMATIC, engine);
petrol.drive();

// Polymorphism via interface reference
Refuelable refuelable = new PetrolVehicle("Honda", "Civic", 2000000, 5, TransmissionType.MANUAL, engine);
refuelable.refuel();

// Full access via concrete type
PetrolVehicle petrolFull = new PetrolVehicle("BMW", "5 Series", 6000000, 5, TransmissionType.AUTOMATIC, engine);
petrolFull.drive();
petrolFull.refuel();

// PHEV — both refuel + charge
PluginHybridVehicle phev = new PluginHybridVehicle("BMW", "330e", 5500000, 5, TransmissionType.AUTOMATIC, engine, battery);
phev.drive();
phev.refuel();
phev.charge();`,
    },
  ],

  rules: [
    // ── URL Shortener rules ──────────────────────────────────────
    {
      rule: 'Use putIfAbsent — never existsByShortCode + save separately',
      tag: 'key',
      detail: 'existsByShortCode() then save() has a race condition — two threads can both pass the check and both save. ConcurrentHashMap.putIfAbsent() is atomic: check-and-insert in one operation. Returns null if inserted (success), existing value if key was already there (collision). This is the most important thread-safety decision in URL Shortener.',
    },
    {
      rule: 'Store expiresAt as absolute LocalDateTime — not TTL duration',
      tag: 'key',
      detail: 'If you store ttlSeconds, every isExpired() call needs createdAt + ttlSeconds + comparison. If you store expiresAt = createdAt + ttlSeconds at creation time, isExpired() is just LocalDateTime.now().isAfter(expiresAt) — O(1), one field, no arithmetic. Convert TTL to absolute timestamp once at shorten() time.',
    },
    {
      rule: 'ClickEvent stores shortCode (FK) — not ShortUrl object reference',
      tag: 'key',
      detail: 'Storing the full ShortUrl object in every ClickEvent means that object cannot be GC\'d as long as ClickEvents exist — memory leak. String shortCode FK is a few bytes. In real DB this is the natural FK column. Same principle in-memory.',
    },
    {
      rule: 'getStats() must NOT throw on expired URL — analytics are historical',
      tag: 'gotcha',
      detail: 'resolve() throws UrlExpiredException — correct, redirect is blocked. getStats() must NOT throw — click analytics happened before expiry and are still valuable. Business rule: expiry controls redirectability, not data visibility. This distinction is asked in real interviews.',
    },
    {
      rule: 'ExpiryCleanupJob belongs in Services/Jobs — NOT in Entities',
      tag: 'gotcha',
      detail: 'ExpiryCleanupJob is a background worker, not a domain entity. Entities = ShortUrl, ClickEvent, User. Services/Jobs = UrlShortenerService, ExpiryCleanupJob. Mixing them signals conceptual blur to the interviewer.',
    },
    {
      rule: 'start() separate from constructor — enables unit testing',
      tag: 'key',
      detail: 'If scheduler.scheduleAtFixedRate() is in the constructor, every new ExpiryCleanupJob() immediately starts firing. In tests you cannot control this. Separate start() means you can create the object, call run() directly in tests, and never call start() — scheduler never fires. Always do this for background jobs.',
    },
    {
      rule: 'Salt code generation with UUID — not retryCnt appended to URL',
      tag: 'gotcha',
      detail: 'codeGenStrategy.generate(longUrl + retryCnt) means attempt 1 always produces the same hash for the same URL. Two users shortening https://google.com will collide on attempt 1. Use UUID.randomUUID() as salt: generate(longUrl + UUID.randomUUID()) — truly random input every call, guaranteed different output.',
    },
    {
      rule: 'CopyOnWriteArrayList for click events — not ArrayList',
      tag: 'key',
      detail: 'Click events are read-heavy: every resolve() reads the list for stats, writes happen only once per click. CopyOnWriteArrayList: reads are lock-free, writes copy the entire array. Perfect for read-heavy workloads. Using ArrayList here would need external synchronization.',
    },
    {
      rule: 'Always quantify NFRs — never say "handle concurrent requests"',
      tag: 'key',
      detail: '"Handle concurrent requests" is vague — interviewers expect numbers. Say: "1000+ requests/second for shortening", "sub-50ms redirect latency", "O(1) lookup by shortCode". Missing quantification signals you haven\'t thought about scale. This gap caused Requirements score to stay at 70% across rounds.',
    },
    {
      rule: 'Name the interface explicitly when using Strategy pattern',
      tag: 'key',
      detail: 'Writing "I will use a strategy pattern" is weak. Write: "CodeGenerationStrategy interface with HashBasedStrategy, CounterBasedStrategy, RandomBasedStrategy implementations — UrlShortenerService depends on the abstraction (DIP)." Explicitly naming the interface + concrete classes is what earns SOLID credit.',
    },
    // ── Vehicle rules ──────────────────────────────────────────
    {
      rule: 'Always check IS-A before using inheritance',
      tag: 'key',
      detail: 'HybridVehicle IS-A Vehicle ✅. HybridVehicle IS-A PetrolVehicle ❌. If IS-A fails, use composition (HAS-A) instead. Wrong IS-A leads to broken hierarchy that is hard to fix later.',
    },
    {
      rule: 'When IS-A breaks but you need code — use HAS-A (composition)',
      tag: 'key',
      detail: 'HybridVehicle HAS-A Engine ✅ and HAS-A Battery ✅. Declare them as fields. Composition is always safer than forced inheritance.',
    },
    {
      rule: 'Never use boolean when there are 3+ states — use enum',
      tag: 'gotcha',
      detail: 'isAutomatic: boolean only handles Manual/Automatic. Semi-Automatic is a third state — boolean breaks. Always ask: can this field have more than 2 values in future? If yes, use enum from day one.',
    },
    {
      rule: 'Extract behaviour to interface when not all subclasses share it',
      tag: 'key',
      detail: 'Not all vehicles refuel — only Petrol and Hybrid. Not all charge — only Electric and PHEV. Put refuel() in Refuelable interface, charge() in Chargeable interface. Each class implements only what it needs.',
    },
    {
      rule: 'VehicleType is hardcoded in each child — never passed from caller',
      tag: 'key',
      detail: 'Caller should never do new PetrolVehicle(..., VehicleType.PETROL). That is redundant and error-prone. Child constructor sets this.vehicleType = VehicleType.PETROL itself — always correct, zero chance of mismatch.',
    },
    {
      rule: 'PluginHybridVehicle extends HybridVehicle — not Vehicle directly',
      tag: 'key',
      detail: 'PHEV IS-A HybridVehicle ✅ (every PHEV is a Hybrid). It inherits engine + battery + refuel() from HybridVehicle and only adds charge(). Clean, no duplication.',
    },
    {
      rule: 'Use concrete type when you need both parent and interface methods',
      tag: 'key',
      detail: 'Vehicle reference gives only drive(). Refuelable reference gives only refuel(). PetrolVehicle reference gives both. Use the most abstract type that satisfies your need — not more, not less.',
    },
    {
      rule: 'Scaler 6-step framework: Overview → Gather → Clarify → Class Diagram → Schema → Code',
      tag: 'key',
      detail: 'Step 0: entity or system? Step 1: gather 5-8 features with suggestions. Step 2: clarify edge cases. Step 3: class diagram (nouns = classes). Step 4: schema (only if real system). Step 5: code one feature at a time.',
    },
  ],

  complexity: [
    { problem: 'Vehicle class hierarchy', tc: 'O(1)', sc: 'O(1)', note: 'All operations are direct method calls — no loops, no collections' },
    { problem: 'Enum lookup', tc: 'O(1)', sc: 'O(n)', note: 'n = number of enum constants — stored as array by JVM' },
    { problem: 'Polymorphic dispatch', tc: 'O(1)', sc: 'O(1)', note: 'JVM vtable lookup — constant time regardless of class hierarchy depth' },
  ],

  quiz: [
    // ── URL Shortener quiz ──────────────────────────────────────
    {
      q: 'Why use putIfAbsent instead of existsByShortCode() + save() for collision handling?',
      options: [
        'putIfAbsent is faster because it uses hashing internally',
        'existsByShortCode() + save() has a race condition — two threads can both pass the check and save. putIfAbsent is atomic: check-and-insert in one operation.',
        'save() does not work for custom aliases',
        'putIfAbsent is required by ConcurrentHashMap API',
      ],
      answer: 1,
      explanation: 'The gap between existsByShortCode() and save() is a check-then-act race condition. Thread A checks → not found. Thread B checks → not found. Thread A saves. Thread B saves → collision or overwrite. putIfAbsent() is atomic at the hardware level — only one thread can insert for a given key.',
    },
    {
      q: 'Should getStats() throw UrlExpiredException if the URL has expired?',
      options: [
        'Yes — if the URL is expired, all operations should fail',
        'No — analytics are historical data. Even if the URL cannot redirect, its click history is still valuable and should be accessible.',
        'Yes — expired URLs should be treated as non-existent',
        'No — because getStats() does not check expiry at all in the system',
      ],
      answer: 1,
      explanation: 'resolve() throws on expiry because redirect is blocked. getStats() must NOT throw — clicks happened before expiry and that data has value (business analytics, billing, audit). Two different operations, two different rules. This distinction is frequently tested in LLD interviews.',
    },
    {
      q: 'Why store expiresAt as a LocalDateTime instead of ttlSeconds?',
      options: [
        'LocalDateTime uses less memory than int',
        'Convert TTL to absolute timestamp at creation: expiresAt = now() + ttlSeconds. isExpired() becomes a single comparison — no arithmetic, no createdAt dependency.',
        'ttlSeconds would overflow for long TTLs',
        'LocalDateTime is required by ScheduledExecutorService',
      ],
      answer: 1,
      explanation: 'isExpired() is called on every resolve() — it must be fast. With ttlSeconds: compare now() against createdAt + ttlSeconds — two fields, one addition, one comparison. With expiresAt: compare now() against expiresAt — one field, one comparison. Compute once at creation, read cheaply at every resolve.',
    },
    {
      q: 'Why does ClickEvent store String shortCode instead of ShortUrl object?',
      options: [
        'String is faster to serialize',
        'Storing ShortUrl object in every ClickEvent prevents GC — memory leak. String shortCode FK is a few bytes and is the standard relational pattern.',
        'Java does not allow object references in concurrent collections',
        'ShortUrl would create circular references',
      ],
      answer: 1,
      explanation: 'If ClickEvent holds a ShortUrl reference, the ShortUrl object stays in memory as long as any ClickEvent exists. With millions of clicks, this means millions of full ShortUrl objects in memory. String FK (shortCode) is a few bytes. When you need the ShortUrl, look it up. This is also how you would model it in a real DB — FK column, not embedded object.',
    },
    {
      q: 'Why should start() be separate from the constructor in ExpiryCleanupJob?',
      options: [
        'Java constructors cannot call methods',
        'If the scheduler starts in the constructor, every new ExpiryCleanupJob() immediately fires. In unit tests you cannot stop it. Separate start() lets you create the object and test run() directly without the scheduler.',
        'ScheduledExecutorService must be initialized after the constructor',
        'It is a Java convention — no functional reason',
      ],
      answer: 1,
      explanation: 'Constructor-started scheduler fires immediately on new ExpiryCleanupJob(). In tests this causes timing issues, unnecessary cleanup calls, and difficulty isolating run() logic. With start() separate: create object → call run() directly in test → verify behavior → never call start(). This is the standard testability pattern for background jobs.',
    },
    {
      q: 'What is wrong with codeGenStrategy.generate(longUrl + retryCnt) as a salt?',
      options: [
        'retryCnt causes integer overflow',
        'Same longUrl always produces the same hash on attempt 1 — two users shortening the same URL will always collide first. UUID salt ensures truly random input every call.',
        'The + operator does not work between String and int in Java',
        'Nothing — retryCnt is a valid salt',
      ],
      answer: 1,
      explanation: 'hash("https://google.com1") is always the same string — deterministic. If that shortCode is already taken, attempt 2 uses "https://google.com2" — also deterministic, same result every time for the same URL. UUID.randomUUID() produces a different string on every call — guaranteed unique salt, guaranteed different hash input on every retry.',
    },
    // ── Vehicle quiz ──────────────────────────────────────────
    {
      q: 'Should HybridVehicle extend PetrolVehicle to reuse the engine field?',
      options: [
        'Yes — code reuse is the most important goal',
        'No — HybridVehicle IS-A PetrolVehicle fails. We could equally extend ElectricVehicle for the same reuse. Use composition instead.',
        'Yes — HybridVehicle always has an engine so it is a type of PetrolVehicle',
        'No — Java does not allow this',
      ],
      answer: 1,
      explanation: 'IS-A rule: HybridVehicle is NOT a PetrolVehicle — it is its own category. Also, the same reuse argument works for ElectricVehicle, making the choice arbitrary. When IS-A fails, use HAS-A (composition): declare engine and battery as fields in HybridVehicle.',
    },
    {
      q: 'Why is TransmissionType an enum instead of boolean isAutomatic?',
      options: [
        'Enums are faster than booleans in Java',
        'boolean only handles 2 states — Manual/Automatic. Semi-Automatic is a third state. Enum handles all current and future states cleanly.',
        'boolean fields are not allowed in abstract classes',
        'Enums look cleaner in code',
      ],
      answer: 1,
      explanation: 'boolean isAutomatic handles only true/false → Manual or Automatic. Semi-Automatic breaks this model. Enum TransmissionType { MANUAL, AUTOMATIC, SEMI_AUTOMATIC } handles all three and is extensible — add DUAL_CLUTCH later without breaking existing code.',
    },
    {
      q: 'Why does PetrolVehicle implement Refuelable instead of declaring refuel() directly in Vehicle?',
      options: [
        'Vehicle is abstract so it cannot have methods',
        'Not all vehicles refuel — ElectricVehicle cannot refuel. Interface ensures only vehicles that CAN refuel declare the method.',
        'refuel() is too complex for Vehicle to hold',
        'Interface methods are faster than regular methods',
      ],
      answer: 1,
      explanation: 'If refuel() is in Vehicle, ElectricVehicle inherits it but cannot meaningfully implement it. Interface Refuelable is implemented only by PetrolVehicle and HybridVehicle — the ones that actually refuel. This follows Interface Segregation Principle.',
    },
    {
      q: 'What does PluginHybridVehicle inherit from HybridVehicle?',
      options: [
        'Nothing — it only inherits from Vehicle',
        'engine, battery, refuel(), drive(), start(), stop() — plus adds its own charge()',
        'Only the drive() method',
        'engine and battery fields, but not the methods',
      ],
      answer: 1,
      explanation: 'PluginHybridVehicle extends HybridVehicle which extends Vehicle. Full chain: engine (HybridVehicle field), battery (HybridVehicle field), refuel() (Refuelable from HybridVehicle), drive() + start() + stop() (Vehicle). PHEV only adds charge() via Chargeable interface.',
    },
    {
      q: 'When should you use Vehicle reference vs PetrolVehicle reference in Client?',
      options: [
        'Always use Vehicle — always program to the most abstract type',
        'Always use PetrolVehicle — you need all methods',
        'Use Vehicle when you only need drive(). Use PetrolVehicle when you need both drive() and refuel(). Use the most abstract type that satisfies your need.',
        'Use Refuelable always — interfaces are best practice',
      ],
      answer: 2,
      explanation: 'Program to the most abstract type that gives you what you need. Vehicle gives drive(). Refuelable gives refuel(). PetrolVehicle gives both. Choosing Vehicle when you need refuel() = compile error. Choosing PetrolVehicle when you only need drive() = over-specifying. Match the reference type to what you actually use.',
    },
    {
      q: 'In machine coding interview, what is the FIRST question to ask the interviewer?',
      options: [
        'What design patterns should I use?',
        'How many classes should I create?',
        'Am I building an Entity (just models) or a full System (with services and controllers)?',
        'Should I use Java or Python?',
      ],
      answer: 2,
      explanation: 'Step 0 of the 6-step framework: clarify scope. Entity = only model classes, no service/controller layer. System = full application. This one question saves 30 minutes of building the wrong thing. For Vehicle Design, answer is Entity — only models needed.',
    },
  ],
}
