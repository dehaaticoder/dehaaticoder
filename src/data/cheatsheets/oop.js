export const oopCheatsheet = {
  title: 'OOP / LLD',

  patterns: [
    {
      name: 'Pattern 1 — Abstract Class (IS-A)',
      icon: '🏛️',
      when: 'Use when subclasses share common state/behaviour but the base concept is never instantiated directly',
      gaonKiBaat: 'Gaon mein "Insaan" koi nahi hota directly — koi Kisan hota hai, koi Pradhan hota hai. "Insaan" toh bas ek concept hai. Waise hi abstract class seedha nahi banta.',
      problems: ['User → Member/Librarian', 'Book → TextBook/NovelBook', 'Shape → Circle/Rectangle'],
      template: `// Abstract class — cannot be instantiated directly
public abstract class User {
    private String userId;       // instance field — unique per object
    private String name;
    private static int totalUsers; // class field — shared across all

    User(String name) {
        this.userId = generateUniqueId();
        totalUsers++;
        this.name = name;
    }

    public abstract void displayDashboard(); // subclass MUST implement
    public abstract boolean canBorrowBooks(); // subclass MUST implement

    private static String generateUniqueId() { return "U" + totalUsers; }
}

// Concrete subclass
public class Member extends User {
    @Override
    public void displayDashboard() { System.out.println("Member Dashboard"); }

    @Override
    public boolean canBorrowBooks() { return borrowedCount < MAX_LIMIT; }
}`,
    },
    {
      name: 'Pattern 2 — Interface (CAN-DO)',
      icon: '📋',
      when: 'Use when unrelated classes share a behaviour/contract — not identity',
      gaonKiBaat: 'Gaon ka Sarpanch bhi cycle chala sakta hai, Kisan bhi cycle chala sakta hai — dono alag hain, par dono "cycle chalana" jaante hain. Yeh CAN-DO hai. Interface wahi hai.',
      problems: ['Lendable → TextBook/NovelBook', 'Comparable', 'Runnable', 'Serializable'],
      template: `// Interface = contract — whoever signs it must implement ALL methods
public interface Lendable {
    boolean lend(User user);      // no implementation — just the contract
    void returnItem(User user);
    boolean isAvailable();
}

// Any class can implement — no IS-A needed
public class TextBook extends Book implements Lendable {
    @Override
    public boolean lend(User user) {
        if (isAvailable() && user.canBorrowBooks()) {
            // mark unavailable
            return true;
        }
        return false;
    }
}

// Power: program to interface, not implementation
Lendable item = new TextBook(...); // reference type = interface
item.lend(member);                 // works for ANY Lendable object`,
    },
    {
      name: 'Pattern 3 — Encapsulation',
      icon: '🔒',
      when: 'Always — keep fields private, expose via getters/setters',
      gaonKiBaat: 'Gaon mein lohe ki tijori hoti hai — andar ka maal dikhta nahi. Kuch chahiye toh maalik se maango, woh dega ya nahi yeh uska faisla. Private fields wahi tijori hain.',
      problems: ['User.userId', 'Book.isbn/title/author', 'Member.borrowedBooksCount'],
      template: `public abstract class Book {
    private String isbn;     // PRIVATE — hidden from outside
    private String title;
    private boolean isAvailable;

    // Getter — read-only access
    public String getIsbn() { return isbn; }
    public String getTitle() { return title; }
    public boolean isAvailable() { return isAvailable; }

    // Setter — controlled write access
    // (No setter for isbn — once set, cannot change)
}

// Child class CANNOT do this.isbn — must use getIsbn()
public class TextBook extends Book {
    @Override
    public void displayBookDetails() {
        System.out.println("ISBN: " + getIsbn());   // via getter ✅
        System.out.println("Title: " + getTitle()); // via getter ✅
    }
}`,
    },
    {
      name: 'Pattern 4 — Runtime Polymorphism',
      icon: '🔄',
      when: 'Parent reference holds child object — method called decided at runtime by actual object',
      gaonKiBaat: 'Pradhan ne bola "koi bhi kaam karo". Kisan ne kheti ki, Mistri ne deewar banayi — same order, alag kaam. Jo saamne khada hai woh decide karta hai kya karega. Yahi runtime polymorphism hai.',
      problems: ['Book b = new TextBook()', 'Lendable l = new NovelBook()', 'Payment gateway swap'],
      template: `// Parent reference can hold any child object
Book b = new TextBook("Math", 2, "123", "Geometry", "KC Sinha");
b.displayBookDetails(); // calls TextBook.displayBookDetails() — not Book's

b = new NovelBook("Mystery", "456", "Gone Girl", "Flynn");
b.displayBookDetails(); // calls NovelBook.displayBookDetails()

// RULE: What methods you can CALL → decided by reference type (left side)
// RULE: Which implementation RUNS → decided by actual object (right side)

// Cannot call TextBook-specific methods via Book reference:
// b.getSubject(); // ❌ Book doesn't know about this

// Need to cast:
TextBook t = (TextBook) b;  // ✅ but risky — use instanceof first
if (b instanceof TextBook) {
    TextBook t2 = (TextBook) b;
    t2.getSubject();
}`,
    },
    {
      name: 'Pattern 5 — Static vs Instance',
      icon: '📊',
      when: 'static = belongs to CLASS (shared). instance = belongs to OBJECT (unique per object)',
      gaonKiBaat: 'Gaon ka ek hi kuaan hai — sabka shared. Yeh static hai. Par har ghar ka apna ghada hai — woh instance hai. Kuaan class ka, ghada object ka.',
      problems: ['totalUsers counter', 'MAX_BORROW_LIMIT constant', 'generateUniqueId()'],
      template: `public abstract class User {
    private static int totalUsers = 0; // ONE copy shared by ALL users
    private String userId;             // EACH user has their own copy

    User() {
        totalUsers++;                        // shared counter increments
        userId = generateUniqueId();         // unique per object
    }

    public static int getTotalUsers() {      // static method — no object needed
        return totalUsers;
    }

    private static String generateUniqueId() {
        return "U" + totalUsers;             // static — can call without object
    }
}

// static field accessed via class name
User.getTotalUsers(); // ✅

// instance field — needs object
Member m = new Member("Dhiraj", "...");
m.getName(); // ✅`,
    },
    {
      name: 'Pattern 6A — final Class (Non-Inheritable)',
      icon: '🔐',
      when: 'Use when a class should never be subclassed — prevents inheritance entirely',
      gaonKiBaat: 'Gaon ka Seth apni dukaan kisi ko gift nahi karta, koi uski dukaan ka "branch" nahi khol sakta. Sealed hai woh dukaan. Java mein `final class` wahi hai — koi extend nahi kar sakta.',
      problems: ['String in Java (final)', 'Integer, Double wrappers (final)', 'Custom immutable value objects'],
      template: `// final class — cannot be extended
public final class PaymentToken {
    private final String token;
    PaymentToken(String token) { this.token = token; }
    public String getToken() { return token; }
}

// ❌ compile error — cannot extend final class
public class FakeToken extends PaymentToken { } // not allowed

// C# equivalent: sealed class
// sealed class PaymentToken { }  ← same concept, different keyword`,
    },
    {
      name: 'Pattern 6B — static vs final vs static final',
      icon: '📌',
      when: 'Decide which keyword based on: shared? constant? both?',
      gaonKiBaat: 'Gaon ka kuaan sabka shared hai (static). Gaon ka naam "Rampur" kabhi nahi badlega (final). Desh ka naam "India" — shared bhi hai, kabhi nahi badlega — woh static final hai.',
      problems: ['totalUsers (static)', 'MAX_BORROW_LIMIT (final)', 'PI = 3.14 (static final)', 'borrowedBooksCount (neither)'],
      template: `class Member {
    private static int totalUsers = 0;          // shared + mutable → static
    private final int MAX_BORROW_LIMIT = 5;     // per-object + constant → final
    private static final String SYSTEM = "LMS"; // shared + constant → static final
    private int borrowedBooksCount;             // per-object + mutable → plain

    // Decision table:
    // shared across all objects?  → static
    // never changes after set?    → final
    // both?                       → static final
    // neither?                    → plain instance field
}

// Interface fields are ALWAYS public static final (Java enforces it)
interface Lendable {
    int MAX_DAYS = 30; // implicitly: public static final int MAX_DAYS = 30
}`,
    },
    {
      name: 'Pattern 6C — Program to Interface (List vs ArrayList)',
      icon: '🔌',
      when: 'Always declare variables using interface type, not concrete implementation',
      gaonKiBaat: 'Gaon mein "gaadi" bolte hain — car ho, jeep ho, tractor ho, kuch bhi. Sirf "Maruti 800" mat bolo — kal tractor ki zaroorat pad gayi toh ek hi jagah badalna padega. List wahi "gaadi" hai, ArrayList ek specific gaadi.',
      problems: ['List<Book> vs ArrayList<Book>', 'Map vs HashMap', 'Set vs HashSet'],
      template: `// ❌ Bad — tied to specific implementation
ArrayList<Book> bookInventory = new ArrayList<>();

// ✅ Good — program to interface
List<Book> bookInventory = new ArrayList<>();

// Why it matters:
// Tomorrow if you switch to LinkedList — only one line changes
List<Book> bookInventory = new LinkedList<>(); // nothing else breaks

// Same for Map, Set:
Map<String, User> users = new HashMap<>();  // ✅
Set<String> ids = new HashSet<>();          // ✅`,
    },
    {
      name: 'Pattern 6D — Enum for Type Safety',
      icon: '🎯',
      when: 'Use enum when a variable can only take a fixed set of values',
      gaonKiBaat: 'Gaon mein season sirf 3 hote hain — Garmi, Barish, Sardi. Koi "Autumn" nahi aata. Enum wahi hai — sirf fixed valid values. Koi galat value dogi toh compile time pe hi pakad lega.',
      problems: ['BookType (TextBook, NovelBook)', 'OrderStatus (PLACED, SHIPPED, DELIVERED)', 'Direction (NORTH, SOUTH, EAST, WEST)'],
      template: `// Enum — fixed set of valid values
public enum BookType {
    TextBook,
    NovelBook
}

// Usage — type safe comparison
if (BookType.TextBook.toString().equals(type) && b instanceof TextBook) {
    ans.add(b);
}

// ✅ Why enum over String?
// String type = "TextBook" → typo "Textbook" compiles but breaks at runtime
// BookType.TextBook       → typo fails at COMPILE time — caught early`,
    },
    {
      name: 'Pattern 6 — Constructor Chaining (super)',
      icon: '🔗',
      when: 'Child constructor must call super() to initialize parent fields',
      gaonKiBaat: 'Beta ghar banana chahta hai — pehle baap se zameen leni padegi. Bina baap ki zameen ke beta apna ghar nahi bana sakta. super() wahi zameen lena hai.',
      problems: ['Member → User', 'TextBook → Book', 'NovelBook → Book'],
      template: `public class Member extends User {
    private int borrowedBooksCount;

    // Default constructor
    Member() {
        super();            // calls User() — generates userId, increments totalUsers
        borrowedBooksCount = 0;
    }

    // Parameterized constructor
    Member(String name, String contactInfo) {
        super(name, contactInfo); // calls User(name, contactInfo)
        borrowedBooksCount = 0;   // always start at 0 for new member
    }

    // Copy constructor
    Member(Member m) {
        super(m);           // copies userId, name, contactInfo from parent
        this.borrowedBooksCount = m.borrowedBooksCount;
    }
}

// TextBook chains to Book
TextBook(String subject, int edition, String isbn, String title, String author) {
    super(isbn, title, author); // Book fields set by Book constructor
    this.subject = subject;
    this.edition = edition;
}`,
    },
  ],

  rules: [
    {
      rule: 'private field → NOT accessible in child class directly',
      tag: 'gotcha',
      detail: 'Use getters from parent. Child calling this.isbn fails if isbn is private in parent.',
    },
    {
      rule: 'static field → shared across ALL instances',
      tag: 'gotcha',
      detail: 'private static String userId means all users share ONE variable. Remove static — userId must be per-object.',
    },
    {
      rule: 'Abstract class → cannot be instantiated directly',
      tag: 'key',
      detail: 'new User() fails if User is abstract. Only concrete subclasses (Member, Librarian) can be instantiated.',
    },
    {
      rule: 'Copy constructor → decide: same ID or new ID?',
      tag: 'gotcha',
      detail: 'BRD said copied user gets unique ID → call generateUniqueId() in copy constructor too. Also increment totalUsers.',
    },
    {
      rule: 'super() must be FIRST line in child constructor',
      tag: 'key',
      detail: 'Java enforces this. If you do not call super() explicitly, Java inserts super() automatically — but only if parent has a no-arg constructor.',
    },
    {
      rule: 'Interface = CAN-DO. Abstract class = IS-A',
      tag: 'key',
      detail: 'Lendable is a CAN-DO — any object can be lendable regardless of type. User is IS-A — Member and Librarian are types of Users.',
    },
    {
      rule: 'Parent reference → can only call parent methods',
      tag: 'gotcha',
      detail: 'Book b = new TextBook(). b.getSubject() fails — Book has no getSubject(). Must cast to TextBook first.',
    },
    {
      rule: 'Runtime polymorphism → only for OVERRIDDEN methods',
      tag: 'key',
      detail: 'If child overrides displayBookDetails(), calling it via parent reference runs the child version. Child-only methods are invisible through parent reference.',
    },
    {
      rule: 'Constructor NOT inherited — must define in each subclass',
      tag: 'gotcha',
      detail: 'Member does not inherit User constructors. You must explicitly define Member() and call super() inside.',
    },
    {
      rule: 'final field → must be initialized at declaration or in constructor',
      tag: 'key',
      detail: 'MAX_BORROW_LIMIT = 5 is final — cannot be changed after set. Perfect for constants.',
    },
    {
      rule: 'final class → cannot be extended (Java\'s sealed)',
      tag: 'key',
      detail: 'String and Integer in Java are final — nobody can extend them. C# equivalent is sealed class.',
    },
    {
      rule: 'Interface fields are always public static final',
      tag: 'gotcha',
      detail: 'You write `int MAX_DAYS = 30` in interface — Java silently makes it `public static final int MAX_DAYS = 30`. No mutable state in interfaces.',
    },
    {
      rule: 'Program to interface — declare as List, not ArrayList',
      tag: 'key',
      detail: 'List<Book> bookInventory = new ArrayList<>(). Tomorrow switching to LinkedList = one line change. ArrayList<Book> ties you to one implementation forever.',
    },
    {
      rule: 'Method parameter type — Member vs User — choose narrowest that works',
      tag: 'gotcha',
      detail: 'lendBook(Member member, Book book) takes Member not User because only Member has incrementBorrowCount(). Using User would require unsafe casting.',
    },
    {
      rule: 'Enum over String for fixed set of values',
      tag: 'key',
      detail: 'BookType.TextBook vs "TextBook" as String — enum catches typos at compile time. String typos only fail at runtime.',
    },
    {
      rule: 'Abstract class without abstract methods — valid but rare',
      tag: 'gotcha',
      detail: 'You can mark a class abstract even with zero abstract methods — just to prevent instantiation. Real use: BaseEntity with id/createdAt where all methods are shared but object should never exist alone.',
    },
  ],

  complexity: [
    { problem: 'Abstract class vs Interface', tc: 'IS-A', sc: 'CAN-DO', note: 'Abstract = shared state+behaviour. Interface = contract only.' },
    { problem: 'static field', tc: 'Class level', sc: 'Shared', note: 'One copy across all instances. e.g. totalUsers' },
    { problem: 'instance field', tc: 'Object level', sc: 'Unique', note: 'Each object has its own copy. e.g. userId, name' },
    { problem: 'private access', tc: 'Same class only', sc: 'Getter needed', note: 'Child cannot access parent private fields directly' },
    { problem: 'protected access', tc: 'Class + subclasses', sc: 'No getter needed', note: 'Child can access directly — breaks encapsulation slightly' },
    { problem: 'Runtime polymorphism', tc: 'Decided at runtime', sc: 'By actual object', note: 'Left side = what you can call. Right side = what runs.' },
    { problem: 'Copy constructor', tc: 'Same ID or new?', sc: 'Depends on BRD', note: 'In LMS — new unique ID, increment totalUsers' },
    { problem: 'super() call', tc: 'First line in child', sc: 'Mandatory', note: 'Java inserts super() if omitted, but only if parent has no-arg constructor' },
  ],

  quiz: [
    {
      q: 'You have `private static String userId` in User class. You create 3 users. What is the userId of the first user after all 3 are created?',
      options: [
        'U001 — each user gets their own userId',
        'The same as the third user\'s userId — static means all share one variable',
        'null — static fields are not initialized',
        'Compile error — static and private cannot be combined',
      ],
      answer: 1,
      explanation: 'static field = one copy shared across all instances. Each new assignment overwrites the same variable. All 3 users end up pointing to the same userId — the last one assigned.',
    },
    {
      q: 'Which of these correctly describes the difference between an abstract class and an interface in this LMS?',
      options: [
        'User is an interface because Member and Librarian implement it',
        'Lendable is an abstract class because TextBook extends it',
        'User is abstract (IS-A — shared state+behaviour). Lendable is interface (CAN-DO — contract only)',
        'Both can be instantiated directly',
      ],
      answer: 2,
      explanation: 'Abstract class = IS-A relationship with shared state and behaviour. Interface = CAN-DO contract, no state. User has fields like name/userId — abstract class. Lendable is just a contract — interface.',
    },
    {
      q: 'Member constructor does not call super(). What happens?',
      options: [
        'Compile error — super() is mandatory',
        'Java automatically inserts super() if User has a no-arg constructor',
        'userId and totalUsers are never initialized',
        'B and C are both correct — Java inserts super() but parent fields stay uninitialized',
      ],
      answer: 1,
      explanation: 'Java auto-inserts super() as the first line if you don\'t explicitly call it — but ONLY if the parent has a no-arg constructor. If parent only has parameterized constructors, it\'s a compile error.',
    },
    {
      q: 'In copy constructor for User, should you call generateUniqueId() or copy u.userId?',
      options: [
        'Copy u.userId — same person, same ID',
        'Call generateUniqueId() — BRD says even copied users get unique ID',
        'Set userId to null — copy is not a real user',
        'Both approaches are wrong — copy constructor should not exist',
      ],
      answer: 1,
      explanation: 'BRD Task 6.3 explicitly says "Each user — including a copied user — gets a unique ID." So call generateUniqueId() and increment totalUsers in the copy constructor.',
    },
    {
      q: 'You write: `Book b = new TextBook("Math", 2, "123", "Geometry", "KC Sinha"); b.displayBookDetails();` Which displayBookDetails() runs?',
      options: [
        'Book.displayBookDetails() — reference type is Book',
        'TextBook.displayBookDetails() — actual object is TextBook',
        'Compile error — Book is abstract',
        'Both run — parent first, then child',
      ],
      answer: 1,
      explanation: 'Runtime polymorphism: method called is decided by actual object (right side), not reference type (left side). TextBook\'s override runs.',
    },
    {
      q: 'TextBook has a method getSubject(). You write: `Book b = new TextBook(...); b.getSubject();` What happens?',
      options: [
        'Works fine — TextBook has getSubject()',
        'Compile error — Book reference cannot call TextBook-specific methods',
        'Runtime error — method not found',
        'Returns null — Book doesn\'t know about subject',
      ],
      answer: 1,
      explanation: 'Left side (reference type) determines what methods you can CALL. Book has no getSubject() — compile error. You must cast: ((TextBook) b).getSubject()',
    },
    {
      q: 'Where should borrowedBooksCount and MAX_BORROW_LIMIT live?',
      options: [
        'In User — all users might have a borrow limit',
        'In Member only — Librarians cannot borrow books',
        'In Lendable interface — it\'s related to lending',
        'In Book — tracks how many times a book is borrowed',
      ],
      answer: 1,
      explanation: 'BRD says Members can borrow, Librarians manage catalog. Borrow limit is Member-specific. Keep subclass-specific behaviour in the subclass.',
    },
    {
      q: 'Why is displayBookDetails() abstract in Book?',
      options: [
        'Because Book has no fields to display',
        'Because each book type (TextBook, NovelBook) displays different details — each subclass implements its own version',
        'Abstract methods must be defined in every class',
        'Java requires at least one abstract method in an abstract class',
      ],
      answer: 1,
      explanation: 'TextBook shows subject+edition. NovelBook shows genre. The behaviour is different per subclass — making it abstract forces each subclass to define its own implementation.',
    },
    {
      q: 'Which is the correct way to access isbn from TextBook.displayBookDetails()?',
      options: [
        'this.isbn — isbn is inherited',
        'super.isbn — access parent field via super',
        'getIsbn() — use the public getter from Book',
        'Book.isbn — use class name to access',
      ],
      answer: 2,
      explanation: 'isbn is private in Book — private means same class only, not even subclasses. TextBook must use getIsbn() getter which is public and inherited.',
    },
    {
      q: 'Why does canBorrowBooks() return false for Librarian?',
      options: [
        'Librarians are not users',
        'BRD says librarians manage catalog — they do not borrow books',
        'false is the default return for boolean methods',
        'Librarian does not extend User',
      ],
      answer: 1,
      explanation: 'BRD Statement 2: "Librarians manage the catalog — add and remove items." They don\'t borrow. canBorrowBooks() returns false for Librarian.',
    },
    {
      q: 'You want to track total number of users across all subclasses. Where does totalUsers live and what keyword?',
      options: [
        'instance field in User — private int totalUsers',
        'instance field in Member — private int totalUsers',
        'static field in User — private static int totalUsers',
        'static field in Member — private static int totalUsers',
      ],
      answer: 2,
      explanation: 'static field belongs to the class, not objects — so it\'s shared across all instances including all subclasses. Lives in User (parent) so both Member and Librarian increment it.',
    },
    {
      q: 'What is the difference between IS-A and CAN-DO relationships?',
      options: [
        'IS-A = interface, CAN-DO = abstract class',
        'IS-A = inheritance (extends), CAN-DO = interface (implements)',
        'Both mean the same thing in Java',
        'IS-A = method overriding, CAN-DO = method overloading',
      ],
      answer: 1,
      explanation: 'IS-A = inheritance. TextBook IS-A Book (extends). CAN-DO = interface. TextBook CAN-DO lending (implements Lendable). A class can have both: extend one class and implement multiple interfaces.',
    },
    {
      q: 'In Book.lend(), the original code only checked isAvailable. What was missing?',
      options: [
        'Check if book is a TextBook or NovelBook',
        'Check user.canBorrowBooks() — user might have hit their borrow limit',
        'Check if isbn is not null',
        'Nothing was missing — isAvailable check is sufficient',
      ],
      answer: 1,
      explanation: 'BRD says: lend if book is available AND user can borrow. Member has MAX_BORROW_LIMIT = 5. Without canBorrowBooks() check, a member could borrow unlimited books.',
    },
    {
      q: 'Should the default constructor Book() be kept if all concrete subclasses always pass isbn/title/author?',
      options: [
        'Yes — always keep default constructor in every class',
        'No — add only constructors your use case needs. BRD asked for it here, but in real project it would be removed.',
        'Yes — Java requires a default constructor',
        'No — default constructors are automatically provided by Java always',
      ],
      answer: 1,
      explanation: 'Design principle: don\'t add constructors you have no use case for. Here BRD asked for it as an exercise. In real system, if every TextBook/NovelBook always has isbn/title/author, default constructor is not needed.',
    },
    {
      q: 'Consider: `int MAX_DAYS = 30` inside an interface. What does Java actually treat this as?',
      options: [
        'private int MAX_DAYS = 30 — interface fields are private',
        'public static final int MAX_DAYS = 30 — interface forces all three',
        'static int MAX_DAYS = 30 — shared but mutable',
        'final int MAX_DAYS = 30 — constant but per instance',
      ],
      answer: 1,
      explanation: 'All interface fields are implicitly public static final. Interface cannot have mutable state — no instances exist, so instance fields make no sense. Java enforces static + final automatically.',
    },
    {
      q: 'Which is better: `ArrayList<Book> inventory = new ArrayList<>()` or `List<Book> inventory = new ArrayList<>()`?',
      options: [
        'ArrayList<Book> — more specific, clearer intent',
        'List<Book> — program to interface, implementation can change with one line',
        'Both are identical — no difference',
        'Neither — use Book[] array instead',
      ],
      answer: 1,
      explanation: 'Program to interface principle: declare as List (interface), instantiate as ArrayList (implementation). Tomorrow switching to LinkedList = change only the right side. ArrayList declaration locks you to one implementation forever.',
    },
    {
      q: 'You have `abstract class BaseEntity` with zero abstract methods. Is this valid Java?',
      options: [
        'No — abstract class must have at least one abstract method',
        'Yes — abstract keyword just prevents instantiation, abstract methods are optional',
        'No — Java requires at least one method in an abstract class',
        'Yes — but only if it implements an interface',
      ],
      answer: 1,
      explanation: 'Abstract class does NOT need abstract methods. The abstract keyword alone prevents direct instantiation. Use case: BaseEntity with id/createdAt where all behavior is shared but `new BaseEntity()` should never be allowed.',
    },
    {
      q: 'Why does `lendBook(Member member, Book book)` take Member instead of User?',
      options: [
        'Because Librarian cannot access the library system',
        'Because only Member has incrementBorrowCount() — using User would require unsafe casting',
        'Because User is abstract and cannot be passed as parameter',
        'No specific reason — both Member and User would work equally',
      ],
      answer: 1,
      explanation: 'incrementBorrowCount() is defined only in Member, not in User. If parameter was User, you would need to cast to Member inside the method — unsafe and breaks type safety. Narrowest type that works = best choice.',
    },
    {
      q: 'Why is `BookType` an enum instead of a String constant like "TextBook"?',
      options: [
        'Enum is faster than String at runtime',
        'Enum catches typos at compile time — "Textbook" string typo only fails at runtime',
        'Strings cannot be used for type comparison in Java',
        'No reason — both are equivalent',
      ],
      answer: 1,
      explanation: 'BookType.TextBoook → compile error (caught immediately). "Textboook".equals(type) → compiles fine but search returns empty list at runtime with no error. Enum = compile-time safety. String = runtime failure.',
    },
    {
      q: 'Why is generateUniqueId() marked static in User?',
      options: [
        'So it can be called without creating a User object — it only uses the class-level counter totalUsers',
        'Because static methods run faster',
        'Because private methods must be static',
        'To prevent subclasses from overriding it',
      ],
      answer: 0,
      explanation: 'generateUniqueId() uses only totalUsers (static) and does not need access to any instance field. Static methods belong to the class and can be called without an object — appropriate here since it generates IDs using class-level state.',
    },
  ],
}
