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
}`,
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
