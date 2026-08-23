export const genericsCheatsheet = {
  title: 'Generics & Collections',

  patterns: [
    {
      name: 'Pattern 1 — Problem Before Generics (Object approach)',
      icon: '⚠️',
      when: 'Explain why Generics were needed — type safety problem with Object',
      gaonKiBaat: 'Pehle log Object use karte the sab kuch store karne ke liye — compiler kuch nahi bolta, but runtime pe ClassCastException aata tha. Ghar mein koi bhi aa sakta tha, pata tab chalta tha jab nuksaan ho jaata.',
      problems: ['Interview: "Why were Generics introduced in Java?"', 'Interview: "What is ClassCastException?"'],
      template: `// WITHOUT GENERICS — ObjectPair problem
public class ObjectPair {
    Object x;
    Object y;
}

ObjectPair p = new ObjectPair();
p.setX(10);        // Integer stored as Object
p.setY("hello");   // String stored as Object — no compile error!

int x = (int) p.getX(); // runtime ClassCastException if types mixed!

// Problem: compiler trusts your cast, but runtime explodes
// Stack example: push String, push Integer, push Double
// pop() → try to cast Double to String → ClassCastException`,
    },
    {
      name: 'Pattern 2 — Generic Class <T, V>',
      icon: '🔷',
      when: 'Create a class that works with any type but enforces type safety',
      gaonKiBaat: 'Generic class ek tarah ka contract hai — jab object banate ho tab bolta ho "yaar, sirf String chahiye mujhe". Compiler tab se guard baith jaata hai, koi aur type aaya toh turant pakad leta hai.',
      problems: ['Interview: "What are Generics in Java?"', 'Interview: "What is the difference between ObjectPair and Pair<T,V>?"'],
      template: `// WITH GENERICS — type safe
public class Pair<T, V> {
    T x;
    V y;
    public T getX() { return x; }
    public V getY() { return y; }
}

// Usage — type locked at object creation
Pair<String, Double> p1 = new Pair<>();
p1.setX("ABC");    // only String allowed
p1.setY(23.0);     // only Double allowed
// p1.setX(10);    // COMPILE ERROR — caught early!

// No casting needed — getX() returns String directly
String val = p1.getX(); // no (String) cast needed`,
    },
    {
      name: 'Pattern 3 — Static Generic Method <S>',
      icon: '⚡',
      when: 'Write a static utility method that works with any type',
      gaonKiBaat: 'Static method bina object ke bulaya jaata hai — isliye class ka T usse milta hi nahi. Usse apna khud ka type parameter chahiye, jaise ek alag ID card banana padta hai freelancer ko jo kisi ek company se bound nahi.',
      problems: ['Interview: "Why does a static method need its own type parameter?"', 'Interview: "Can static methods use class-level type parameters?"'],
      template: `public class Pair<T, V> {
    // WRONG — static method cannot use class's T
    // public static void doSomething(T x) { } // COMPILE ERROR

    // CORRECT — declare own type parameter <S>
    public static <S> void doSomething(S x) {
        System.out.println(x);
    }
}

// Why? T is resolved when you create an object:
// new Pair<String, Double>() → T = String
// But static is called WITHOUT creating object:
// Pair.doSomething("Test") → which T? There is none!
// So static method declares its own <S>, resolved at each call site

Pair.doSomething("Test");  // S = String, resolved here
Pair.doSomething(42);      // S = Integer, resolved here`,
    },
    {
      name: 'Pattern 4 — Bounded Generics (T extends ...)',
      icon: '🔒',
      when: 'Restrict what types can be passed — and access methods of the bound type',
      gaonKiBaat: 'Bounded generic ek restricted entry jaisa hai — sirf Number ke bachche aa sakte hain. Aur kyunki hum jaante hain sab Number ke bachche hain, toh unke sab methods use kar sakte hain bina casting ke.',
      problems: ['Interview: "What is a bounded type parameter?"', 'Interview: "Why use T extends Number?"'],
      template: `// Without bound — can't call any methods on T
public class Pair<T, V> {
    // x.intValue(); // COMPILE ERROR — T could be anything
}

// With bound — T must be Number or subclass
public class BoundedPair<T extends Number, V extends Number> {
    T x;
    V y;

    public int sum() {
        return x.intValue() + y.intValue(); // safe — T is at least Number
    }
}

BoundedPair<Integer, Double> p = new BoundedPair<>(10, 20.5);
System.out.println(p.sum()); // 30

// BoundedPair<String, Double> p2; // COMPILE ERROR — String not a Number

// Bounded on class level (Inventory example):
public class Inventory<T extends Item> {
    // can call item.getId() — guaranteed T is at least Item
}

// IMPORTANT: In generics bounds, ALWAYS use 'extends' — even for interfaces
// T extends Comparable  ✅ — even though Comparable is an interface
// T implements Comparable ❌ — COMPILE ERROR — 'implements' not valid in generics
// 'extends' in generics means "is a subtype of" — covers both class and interface`,
    },
    {
      name: 'Pattern 5 — Generics Invariance (List<Dog> ≠ List<Animal>)',
      icon: '🚫',
      when: 'Understand why passing List<Dog> where List<Animal> expected fails',
      gaonKiBaat: 'Normal inheritance mein Dog IS-A Animal — sahi baat. But List<Dog> IS-NOT-A List<Animal>. Kyun? Agar allowed hota toh List<Animal> mein Cat bhi daal sakte the, aur dogList corrupt ho jaata. Java ne pehle se rok diya.',
      problems: ['Interview: "Why is List<Dog> not assignable to List<Animal>?"', 'Interview: "What is generic invariance?"'],
      template: `// Normal inheritance — works fine
Animal a = new Dog("Dog"); // ✅ Dog IS-A Animal

// Generic invariance — FAILS
public static void printName(List<Animal> animals) { ... }

List<Dog> dogList = new ArrayList<>();
printName(dogList); // COMPILE ERROR — List<Dog> is NOT List<Animal>

// WHY? If it was allowed:
List<Dog> dogs = new ArrayList<>();
List<Animal> animals = dogs;  // if this was allowed...
animals.add(new Cat());       // Cat IS-A Animal — compiler ok
Dog d = dogs.get(0);          // ClassCastException! Cat returned as Dog

// FIX — use wildcard (see Pattern 6)`,
    },
    {
      name: 'Pattern 6 — Wildcards & PECS',
      icon: '🃏',
      when: 'Pass lists of different but related types to a method — PECS rule',
      gaonKiBaat: 'PECS = Producer Extends, Consumer Super. Agar list se cheezein nikal ke padhni hain (producer) toh extends. Agar list mein cheezein daalni hain (consumer) toh super. Yeh yaad raha toh wildcard kabhi confuse nahi karega.',
      problems: ['Interview: "What is PECS?"', 'Interview: "When to use ? extends vs ? super?"', 'Interview: "What is an upper bounded wildcard?"'],
      template: `// PRODUCER EXTENDS — reading/getting from list
// Accepts List<Animal>, List<Dog>, List<Cat> — any subtype
public static void printName(List<? extends Animal> animals) {
    for (Animal a : animals) {
        System.out.println(a.getName()); // can READ
    }
    // animals.add(new Dog()); // COMPILE ERROR — can't write
}

// CONSUMER SUPER — writing/adding to list
// Accepts List<Animal>, List<Creature>, List<Object> — any supertype
public static void addAnimal(List<? super Animal> list) {
    list.add(new Animal()); // can WRITE
    // Animal a = list.get(0); // only Object returned — can't read usefully
}

// Plain ? — unbounded, don't care about type
public static void printSize(List<?> list) {
    System.out.println(list.size()); // only generic ops allowed
}

// Summary:
// ? extends T → read only (Producer)
// ? super T   → write only (Consumer)
// ?           → neither read nor write meaningfully`,
    },
    {
      name: 'Pattern 7 — Type Erasure',
      icon: '🧹',
      when: 'Understand what happens to generics at runtime',
      gaonKiBaat: 'Generics sirf compiler ka kaam hai — ek security guard jo compile time pe check karta hai. Jab code JVM ke haath aata hai, guard chala jaata hai aur sab kuch wapas Object ban jaata hai. JVM ko pata hi nahi ki T tha kya.',
      problems: ['Interview: "What is type erasure?"', 'Interview: "Do generics exist at runtime?"', 'Interview: "Why can\'t we create a generic array?"'],
      template: `// Your code (compile time):
Pair<String, Double> p = new Pair<>();

// After type erasure (what JVM runs):
Pair p = new Pair();  // <String, Double> erased → Object

// PROOF — both are same class at runtime:
List<String> list1 = new ArrayList<>();
List<Integer> list2 = new ArrayList<>();
System.out.println(list1.getClass() == list2.getClass()); // true!
System.out.println(list1.getClass()); // class java.util.ArrayList

// CONSEQUENCES:

// 1. Cannot use instanceof with generic type
// if (list instanceof List<String>) { } // COMPILE ERROR
if (list instanceof List<?>) { }         // ✅ allowed

// 2. Cannot create generic array
// T[] arr = new T[10]; // COMPILE ERROR — T unknown at runtime

// 3. Cannot use primitives as type params
// Pair<int, double> p; // COMPILE ERROR
Pair<Integer, Double> p; // ✅ use wrapper classes

// 4. Cannot overload methods differing only by generic type
// void print(List<String> list) { } // both erase to List
// void print(List<Integer> list) { } // COMPILE ERROR

// Erasure rule:
// T (no bound)      → Object
// T extends Number  → Number
// T extends Comparable → Comparable`,
    },
    {
      name: 'Pattern 8 (Diagram) — Java Collections Hierarchy',
      icon: '🗺️',
      when: 'Quick visual reference — which class implements which interface',
      gaonKiBaat: 'Collection framework ek family hai — Iterable dada hai, Collection baap hai, aur List/Set/Queue teen bade bete hain. Map poora alag khandan hai — Collection se koi rishta nahi. PriorityQueue Queue ke ghar ka hai, List ke nahi — yahi interview mein faasata hai.',
      problems: ['Interview: "Which classes implement List?"', 'Interview: "Is PriorityQueue a List?"', 'Interview: "Does Map extend Collection?"'],
      template: `// Java Collections Framework Hierarchy
// ● = Interface   ○ = Concrete Class

Iterable (●)
└── Collection (●)
    ├── List (●)
    │   ├── ArrayList (○)
    │   ├── LinkedList (○)  ← also implements Deque
    │   └── Vector (○)
    │       └── Stack (○)
    │
    ├── Set (●)
    │   ├── HashSet (○)
    │   │   └── LinkedHashSet (○)
    │   └── SortedSet (●)
    │       └── TreeSet (○)
    │
    └── Queue (●)
        ├── PriorityQueue (○)  ← NOT a List!
        └── Deque (●)
            ├── ArrayDeque (○)
            └── LinkedList (○)  ← implements both List and Deque

// Map — COMPLETELY SEPARATE hierarchy (does NOT extend Collection)
Map (●)
├── HashMap (○)
│   └── LinkedHashMap (○)
├── SortedMap (●)
│   └── TreeMap (○)
└── Hashtable (○)

// Interview traps:
// PriorityQueue → Queue, NOT List
// Stack         → extends Vector → indirectly implements List
// LinkedList    → implements both List AND Deque
// Map           → separate hierarchy, no relation to Collection

// Key behaviours:
// ArrayList   → backed by array,  O(1) get,    O(n) insert/delete
// LinkedList  → backed by DLL,    O(n) get,    O(1) insert/delete at ends
// HashSet     → no order,         O(1) add/contains — needs equals()+hashCode()
// TreeSet     → sorted order,     O(log n)     — needs Comparable or Comparator
// HashMap     → no order,         O(1) get/put
// TreeMap     → sorted by key,    O(log n)
// PriorityQueue → min-heap,       O(log n) add — needs Comparable or Comparator`,
    },
    {
      name: 'Pattern 8a — Comparable<T> and When It Triggers',
      icon: '⚖️',
      when: 'Sort custom objects — and understand when compareTo is actually called',
      gaonKiBaat: 'Comparable ek tarah ka sorting contract hai. Tum Java ko bata rahe ho "yaar, do objects mein se kaun pehle aayega". But yeh contract tab hi kaam karta hai jab koi use kare — PriorityQueue har add() pe use karta hai, List sirf tab jab explicitly sort karo.',
      problems: ['Interview: "How does PriorityQueue know how to sort custom objects?"', 'Interview: "When is compareTo called?"', 'Interview: "Comparable vs Comparator?"'],
      template: `// Implement Comparable in custom class
public class Order implements Comparable<Order> {
    String orderId;
    boolean isExpress;

    @Override
    public int compareTo(Order o) {
        // express (true) should come first — return -1 means "I am smaller"
        if (this.isExpress && !o.isExpress) return -1;
        if (!this.isExpress && o.isExpress) return 1;
        return 0;
    }
}

// PriorityQueue — calls compareTo on EVERY add()
PriorityQueue<Order> pq = new PriorityQueue<>();
pq.add(order1); // first element — no comparison needed
pq.add(order2); // compareTo called immediately to place correctly
pq.poll();      // returns highest priority (smallest by compareTo)

// List — compareTo called only when you explicitly sort
List<Order> list = new ArrayList<>();
list.add(order1); // no compareTo called — just appended
list.add(order2); // no compareTo called — just appended
Collections.sort(list); // NOW compareTo is triggered

// Without Comparable in PriorityQueue → ClassCastException at runtime on 2nd add()
// Without Comparable in List → ClassCastException only when Collections.sort() called

// String comparison in compareTo:
// this.name.compareTo(o.name)          → alphabetical (case-sensitive)
// this.name.compareToIgnoreCase(o.name) → alphabetical (case-insensitive)
// Double.compare(this.price, o.price)  → ascending by price
// Double.compare(o.price, this.price)  → descending by price (swap args)

// IMPORTANT: In generics, use 'extends' even for interfaces — 'implements' is not valid
// T extends Comparable<T>  ✅ (Comparable is interface but 'extends' used in generics)
// T implements Comparable  ❌ COMPILE ERROR

// Multi-field sort — primary + secondary:
public int compareTo(Item o) {
    if (Double.compare(this.price, o.price) == 0)
        return Double.compare(this.quantity, o.quantity); // secondary
    return Double.compare(this.price, o.price);           // primary
}`,
    },
    {
      name: 'Pattern 8b — LinkedList as Bounded Recently Viewed Queue',
      icon: '📋',
      when: 'Maintain a fixed-size list of recently viewed items — remove oldest when limit exceeded',
      gaonKiBaat: 'LinkedList mein add() aur removeFirst() dono O(1) hain — isliye yeh recently viewed ke liye perfect hai. Har baar ek nayi cheez aati hai, add karo — agar size 10 se zyada ho gayi, sabse purani nikal do. Simple aur fast.',
      problems: ['Interview: "How would you implement a recently viewed list?"', 'Interview: "Why LinkedList over ArrayList here?"'],
      template: `public class RecentlyViewedItems {
    private LinkedList<Item> rvi = new LinkedList<>();
    private static final int MAX_SIZE = 10;

    public void addRecentlyViewedItem(Item item) {
        rvi.add(item);           // add to end — O(1)
        if (rvi.size() > MAX_SIZE) {
            rvi.removeFirst();   // remove oldest — O(1)
        }
        // No while loop needed — add one at a time, size exceeds by 1 max
    }

    public LinkedList<Item> getRvi() { return rvi; }
}

// Why LinkedList over ArrayList?
// removeFirst() on LinkedList → O(1) — just update head pointer
// remove(0) on ArrayList    → O(n) — shifts all elements left

// Test: add 12 items → list holds items 3-12 (oldest 1,2 removed)`,
    },
    {
      name: 'Pattern 8c — toString, equals, hashCode — When and Why',
      icon: '🔍',
      when: 'Use custom objects in HashSet/HashMap, or print them meaningfully',
      gaonKiBaat: 'Teen alag kaam, teen alag methods. toString() sirf dikhane ke liye hai — println mein. equals() bolta hai "yeh dono same hain kya?" — contains(), remove() mein use hota hai. hashCode() bolta hai "kis bucket mein dhundho?" — HashSet/HashMap mein pehle yeh chalta hai, phir equals(). Teeno mein se ek bhi miss karo toh gadbad pakki.',
      problems: ['Interview: "Why override equals and hashCode together?"', 'Interview: "What happens if only equals is overridden?"', 'Interview: "How does HashSet detect duplicates?"'],
      template: `// toString() — called by System.out.println(item)
// Without override → Item@1a2b3c (memory address, useless)
// With override → Item{id='1', name='Book1', price=125.0}
@Override
public String toString() {
    return "Item{id='" + id + "', name='" + name + "', price=" + price + "}";
}

// equals() — called by contains(), remove(), equals()
// Without override → compares memory address (two objects with same data = NOT equal)
// With override → you define equality (same id = same item)
@Override
public boolean equals(Object obj) {
    if (this == obj) return true;           // same object in memory? definitely equal
    if (!(obj instanceof Item)) return false; // not an Item? can't be equal
    Item item = (Item) obj;
    return this.id.equals(item.id);         // equal if same id
}

// hashCode() — called FIRST by HashSet/HashMap to find the bucket
// Rule: if equals() returns true, hashCode() MUST return same value
// Without override → uses memory address → different objects = different buckets
//                  → contains()/remove() fail even if data is same
@Override
public int hashCode() {
    return this.id.hashCode(); // String.hashCode() handles the number generation
}

// HashSet duplicate detection — two steps:
// Step 1: hashCode() → find bucket (e.g. "3".hashCode() = 51 for both i3 and i4)
// Step 2: equals()   → confirm match (i3.id.equals(i4.id) → true → duplicate!)
// Result: i4 NOT added

// For primitive wrappers (Integer, String, Double) — already implemented by Java
// Only custom classes need manual override

// Always override BOTH equals() and hashCode() — never one without the other
// hashCode() alone → finds bucket but equals() uses memory address → duplicates added
// equals() alone   → hashCode() returns different values → wrong bucket → item not found`,
    },
    {
      name: 'Pattern 8 — Key Collections',
      icon: '📦',
      when: 'Choose the right collection for the problem',
      gaonKiBaat: 'Collection framework Java ka toolkit hai — har kaam ke liye alag hathiyaar. Interview mein poochha jaata hai "ArrayList vs LinkedList kab use karein" — yeh table yaad rakh aur kabhi mat bhool.',
      problems: ['Interview: "ArrayList vs LinkedList?"', 'Interview: "HashSet vs TreeSet?"', 'Interview: "HashMap vs TreeMap?"'],
      template: `// List — ordered, duplicates allowed
ArrayList<String> list = new ArrayList<>();   // backed by array, fast get O(1)
LinkedList<String> ll = new LinkedList<>();   // backed by DLL, fast add/remove O(1)

// Set — no duplicates
HashSet<String> hs = new HashSet<>();         // no order, O(1) add/contains
TreeSet<String> ts = new TreeSet<>();         // sorted order, O(log n)
LinkedHashSet<String> lhs = new LinkedHashSet<>(); // insertion order

// Map — key-value pairs, unique keys
HashMap<String, Integer> hm = new HashMap<>();     // no order, O(1)
TreeMap<String, Integer> tm = new TreeMap<>();     // key sorted, O(log n)
LinkedHashMap<String, Integer> lhm = new LinkedHashMap<>(); // insertion order

// Queue / Deque
PriorityQueue<Integer> pq = new PriorityQueue<>(); // min-heap by default
ArrayDeque<Integer> dq = new ArrayDeque<>();       // double-ended queue

// When to use:
// Random access needed        → ArrayList
// Frequent insert/delete      → LinkedList
// Unique elements, fast check → HashSet
// Unique + sorted             → TreeSet
// Key-value, fast lookup      → HashMap
// Key-value + sorted keys     → TreeMap`,
    },
  ],
};
