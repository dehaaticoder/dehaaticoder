export const machineCodingCheatsheet = {
  title: 'Machine Coding (LLD)',

  patterns: [
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
