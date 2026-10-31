export const umlCheatsheet = {
  title: 'UML Class Diagrams (LLD)',

  patterns: [
    {
      name: 'Class Diagram — Notation',
      icon: '📦',
      when: 'Use before writing code in an interview or design session — draw entities first, code follows',
      gaonKiBaat: 'Gaon mein makaan banane se pehle naksha banta hai — kitne kamre, kahan darwaza, kahan rasoi. Class diagram wahi naksha hai tere code ka. Seedha code likhna waise hi hai jaise bina naksha ke makaan banana — baad mein tootega.',
      problems: ['Interview LLD problems', 'System design entity modelling', 'DB schema derivation'],
      realWorldUses: [
        {
          title: '📦 Class Box Structure',
          dehaatiAnalaogy: 'Ek dabba — upar naam, beech mein saman (variables), neeche kaam (methods). Jaise gaon ki dukan — naam board upar, saman andar, seva neeche likhi.',
          problem: 'How to represent a Java class visually before coding.',
          withoutPrototype: 'Jump straight to code → miss fields, wrong method signatures, need to refactor later.',
          withPrototype: 'Draw class box first: name on top, variables in middle with type and access modifier, business methods at bottom.',
          bugWithoutClone: 'Writing all getters/setters in diagram = cluttered, unreadable. Only write business methods — enroll(), viewCourse(), not getName()/setName().',
        },
        {
          title: '🔣 Access Modifier Symbols',
          dehaatiAnalaogy: 'Gaon mein kuch cheezein sabke liye hain (plus — sarkari road), kuch sirf ghar waalon ke liye (minus — andar ka aangan), kuch relatives ke liye (hash — parivaar).',
          problem: 'How to show public/private/protected in a diagram without writing words.',
          withoutPrototype: 'Writing "private" / "public" → verbose, wastes space.',
          withPrototype: '- = private, + = public, # = protected. No symbol = default/package. Example: -name: String, +enroll(course: Course): void',
          bugWithoutClone: 'Forgetting to mark variables as private (-) — variables look public by default when no symbol is written.',
        },
        {
          title: '«interface» and Abstract Notation',
          dehaatiAnalaogy: 'Interface ko double darvaze se pehchano — «Flyable» — andar jaane ka raasta sab ke liye khula hai lekin andar kuch nahi hai, subclass ko khud banana padega. Abstract class italics mein likhte hain — kuch kaam andar hai, kuch bahar chhoda.',
          problem: 'How to distinguish class vs interface vs abstract class in a diagram.',
          withoutPrototype: 'All boxes look the same — reader cannot tell which is interface vs class vs abstract.',
          withPrototype: 'Interface → «interface» ClassName (double angle brackets). Abstract class → ClassName in italics. Abstract methods → method name in italics.',
          bugWithoutClone: 'Confusing solid-line vs dashed-line arrows: implements interface = dashed line + hollow triangle. extends class = solid line + hollow triangle.',
        },
      ],
      template: `// How a class box looks (text representation):
// ┌──────────────────────────────┐
// │         Student              │  ← class name
// ├──────────────────────────────┤
// │ -name: String                │  ← private field
// │ -age: Integer                │
// ├──────────────────────────────┤
// │ +enroll(course: Course): void│  ← public business method
// │ +viewCourse(): List<Course>  │
// └──────────────────────────────┘

// Interface box:
// ┌──────────────────────────────┐
// │       «interface»            │
// │         Flyable              │
// ├──────────────────────────────┤
// │ +fly(board: Board): void     │
// └──────────────────────────────┘

// Abstract class (name + abstract methods in italics — shown as * here):
// ┌──────────────────────────────┐
// │          *Bird*              │  ← abstract class (italics)
// ├──────────────────────────────┤
// │ -species: String             │
// ├──────────────────────────────┤
// │ +eat(): void                 │  ← concrete method
// │ *+fly(): void*               │  ← abstract method (italics)
// └──────────────────────────────┘

// Arrow directions:
// Child ──────▷ Parent          (solid line, hollow triangle = extends)
// Class - - - ▷ Interface       (dashed line, hollow triangle = implements)
// Class ◇───── OtherClass       (hollow diamond = aggregation)
// Class ◆───── OtherClass       (filled diamond = composition)`,
    },
    {
      name: 'Class → Schema Conversion',
      icon: '🗄️',
      when: 'After drawing class diagram — convert to DB schema before writing Hibernate/SQL',
      gaonKiBaat: 'Class diagram tere Java code ka naksha tha. Schema diagram tere database ka naksha hai. Ek se doosra banana seedha hai — primitive field seedha column banta hai, non-primitive field foreign key banta hai. Many-to-many mein ek teen wala table aata hai beech mein.',
      problems: ['DB schema design from LLD class diagram', 'Junction table identification', 'Foreign key placement'],
      realWorldUses: [
        {
          title: '🔗 Primitive vs Non-Primitive Fields',
          dehaatiAnalaogy: 'Gaon ki tehsil mein ek register mein sab kuch likhte hain — naam, umar yeh seedha likhte hain (primitive). Lekin agar biwi ka naam likhna ho, toh ek alag register mein entry hogi aur yahaan sirf uska ID likhenge (foreign key).',
          problem: 'Student has: id (int), name (String), courses (List<Course>). How to convert to tables?',
          withoutPrototype: 'Try to store List<Course> as a column → SQL does not support arrays as columns properly.',
          withPrototype: 'id → column (PK), name → column. courses (non-primitive) → foreign key in another table.',
          bugWithoutClone: 'Non-primitive = relationship, not a column. Never try to store an object reference directly as a column.',
        },
        {
          title: '🔀 Many-to-Many → Junction Table',
          dehaatiAnalaogy: 'Student aur Course — ek student kai courses mein, ek course mein kai students. Yeh seedha nahi likhte. Beech mein ek teen wala table aata hai — student_course — jisme dono ke IDs likhe hote hain. Enrollment date jaisi common cheez bhi usi junction table mein jaati hai.',
          problem: 'Student ↔ Course is many-to-many at class level. How to represent in DB?',
          withoutPrototype: 'Add course_id column in students → only one course per student. Add student_ids column → not valid SQL.',
          withPrototype: 'Create junction table: enrollments(student_id FK, course_id FK). Many-to-many → two one-to-many. Common attribute (enrolled_at) goes in junction table.',
          bugWithoutClone: 'Common attributes of the relationship (enrollment date, payment method, discount) go in the JUNCTION table, not in either main table.',
        },
        {
          title: '📌 Foreign Key Placement Rule',
          dehaatiAnalaogy: 'Ek instructor kai courses padhata hai. Course ke paas instructor ka ID hona chahiye — kyunki "many" side hamesha "one" side ka ID rakhti hai. Gaon mein jo bhi Pradhan ji ka kaam karta hai, uski apni file mein Pradhan ji ka naam likhte hain — Pradhan ji ki file mein sab kaam karne waalon ke naam nahi likhte.',
          problem: 'Instructor (one) → Courses (many). Where does the foreign key go?',
          withoutPrototype: 'Add course_ids in instructors table → array column, not valid.',
          withPrototype: 'Add instructor_id FK in courses table. Many side always holds the foreign key.',
          bugWithoutClone: 'One-to-one: FK can go on either side. One-to-many: FK goes on the MANY side. Many-to-many: junction table.',
        },
      ],
      template: `// Class → Schema conversion rules:

// RULE 1: Primitive attribute → direct column
// Student.name (String) → students.name VARCHAR(255)
// Student.age  (int)    → students.age INT

// RULE 2: Non-primitive attribute → foreign key
// Course.instructor (Instructor) → courses.instructor_id INT FK

// RULE 3: Collection (one-to-many) → FK on the many side
// Instructor has List<Course> → courses table gets instructor_id FK
// NOT instructors table getting course_ids

// RULE 4: Many-to-many → junction table
// Student ↔ Course (many-to-many)
// → students table (id, name)
// → courses  table (id, title, cost)
// → enrollments table (student_id FK, course_id FK, enrolled_at DATE)
//   ↑ composite PK: (student_id, course_id)
//   ↑ common attributes (enrolled_at) go here, not in either main table

// RULE 5: Many-to-many at class level = TWO one-to-many at DB level
// students  → enrollments : one-to-many (one student, many enrollment rows)
// courses   → enrollments : one-to-many (one course, many enrollment rows)`,
    },
    {
      name: 'Inheritance vs Association',
      icon: '🔗',
      when: 'Every time you identify a relationship between two classes — ask: is-a or has-a?',
      gaonKiBaat: 'Do sawaal poocho: "X, Y hai kya?" (is-a) ya "X ke paas Y hai kya?" (has-a). Dove ek Bird hai — is-a, inheritance. Car ke paas Engine hai — has-a, association. Yeh do sawaal tujhe hamesha sahi raah dikhayenge.',
      problems: ['Identifying class relationships', 'Drawing arrows in class diagram', 'Interview LLD design questions'],
      realWorldUses: [
        {
          title: '🔺 Inheritance — is-a relationship',
          dehaatiAnalaogy: 'Dove ek Bird hai. Penguin bhi ek Bird hai. Jo bhi Bird karta hai, woh sab Dove bhi karta hai — isliye Dove, Bird se inherit karta hai. Jab "X ek Y hai" — toh inheritance.',
          problem: 'When to use extends or implements.',
          withoutPrototype: 'Using composition when inheritance is right → code duplication, no polymorphism.',
          withPrototype: 'extends = is-a (Dove extends Bird). implements = is-a (Dove implements Flyable). Both are inheritance relationships.',
          bugWithoutClone: 'Inheritance is NOT always right. Penguin is a Bird but cannot fly — do not inherit fly() from Bird. Use interface segregation instead.',
        },
        {
          title: '🔷 Association — has-a relationship',
          dehaatiAnalaogy: 'Car ke paas Engine hai. Hospital ke paas Doctors hain. Team ke paas Players hain. Jab ek class doosri class ka object use karti hai — has-a, association. Inheritance nahi.',
          problem: 'When one class uses an object of another class.',
          withoutPrototype: 'Extending when you should be composing → tight coupling, cannot swap implementations.',
          withPrototype: 'Car has Engine field → association. Car does NOT extend Engine.',
          bugWithoutClone: 'Association is broader — it includes aggregation AND composition. When Scaler gives 4 options (Inheritance/Association/Aggregation/Composition), pick Association for generic has-a. When forced to choose between Aggregation/Composition only, look at lifecycle.',
        },
      ],
      template: `// is-a → Inheritance
class Dove extends Bird { }          // Dove is a Bird
class Dove implements Flyable { }    // Dove is a Flyable thing

// has-a → Association
class Car {
    private Engine engine;           // Car has an Engine
}

class Hospital {
    private List<Doctor> doctors;    // Hospital has Doctors
}

// Quick test:
// "Can I say X IS A Y?"  → Inheritance
// "Can I say X HAS A Y?" → Association (Aggregation or Composition)

// Arrow guide in class diagram:
// Dove ──────▷ Bird        solid + hollow triangle = extends (is-a)
// Dove - - -▷ Flyable      dashed + hollow triangle = implements (is-a)
// Car  ◇───── Engine       hollow diamond = aggregation (weak has-a)
// House ◆──── Room         filled diamond = composition (strong has-a)`,
    },
    {
      name: 'Aggregation vs Composition',
      icon: '💎',
      when: 'When you have a has-a relationship — decide whether dependent object can live independently or not',
      gaonKiBaat: 'Ek sawaal poocho: "Agar main object destroy ho jaaye, toh dependent object bhi khatam ho jaayega kya?" Agar haan — composition (strong, filled diamond). Agar nahi, woh alag reh sakta hai — aggregation (weak, hollow diamond). Aur code mein: bahar se inject kiya toh aggregation, andar new kiya toh composition.',
      problems: ['Aggregation vs Composition identification', 'Code-level recognition', 'Junction table design', 'Interview LLD design'],
      realWorldUses: [
        {
          title: '🏠 Composition — strong has-a (filled diamond ◆)',
          dehaatiAnalaogy: 'Ghar ke saath kamra. Ghar gira toh kamra bhi gaya. Notebook ke saath page. Notebook faadi toh page bhi gaya. Ek hi object ke andar doosra object peda hota hai — doosra akele nahi reh sakta.',
          problem: 'House has Rooms. If house object is deleted, rooms have no meaning.',
          withoutPrototype: 'Treating it as aggregation — room objects persist after house is gone → orphan data with no parent.',
          withPrototype: 'Room is created inside House constructor (new Room()). Room cannot exist outside House. Filled diamond in diagram.',
          bugWithoutClone: 'Composition in code = object created with new INSIDE the constructor, not injected. If you pass it in from outside, it becomes aggregation.',
        },
        {
          title: '🏟️ Aggregation — weak has-a (hollow diamond ◇)',
          dehaatiAnalaogy: 'Team aur Player. RCB band ho gayi — Virat Kohli abhi bhi exist karta hai. Dusri team mein chala jaayega. Library band ho gayi — books doosri library mein shift ho sakti hain. Dependent object akele exist kar sakta hai.',
          problem: 'Team has Players. If team is deleted, players still exist in the system.',
          withoutPrototype: 'Treating it as composition — delete team → delete all player records → data loss.',
          withPrototype: 'Player object created outside Team and injected (constructor parameter). Player can exist without Team. Hollow diamond in diagram.',
          bugWithoutClone: 'Business requirement decides this — not just common sense. Car + Engine: economy car assembles external engine (aggregation). Luxury BMW manufactures engine with car (composition). Always clarify with interviewer.',
        },
        {
          title: '💻 Code-level identification',
          dehaatiAnalaogy: 'Code dekh ke pata chal jaata hai. Bahar se aaya object — aggregation (akela reh sakta tha). Andar bana object — composition (parent ke saath juda tha).',
          problem: 'Given code, identify aggregation vs composition without relying on domain knowledge.',
          withoutPrototype: 'Guessing from domain only — gets wrong for ambiguous cases like Car+Engine.',
          withPrototype: 'Injected from outside (constructor param) = aggregation. Created inside with new = composition.',
          bugWithoutClone: 'The same domain relationship (Car+Engine) can be EITHER based on business requirement. Code tells the truth — diagram reflects the code decision.',
        },
      ],
      template: `// AGGREGATION — object injected from outside (can exist independently)
public class Team {
    private List<Player> players;

    public Team(List<Player> players) {   // ← players created OUTSIDE, passed in
        this.players = players;
    }
}

// players can exist without Team — aggregation ◇
Player virat = new Player("Virat");
Team rcb = new Team(List.of(virat));
// rcb destroyed → virat still exists in memory

// ─────────────────────────────────────────────────────────

// COMPOSITION — object created inside (cannot exist independently)
public class House {
    private Room room;

    public House() {
        this.room = new Room();   // ← Room created INSIDE House constructor
    }
}

// Room cannot exist without House — composition ◆
House house = new House();
// house destroyed → room is gone with it (no external reference)

// ─────────────────────────────────────────────────────────

// INTERVIEW TIP: when in doubt, ask the interviewer
// "Should the engine be sourced from outside (aggregation)
//  or manufactured along with the car (composition)?"
// This shows design awareness — do NOT just assume.

// QUICK REFERENCE:
// Inject from outside  → Aggregation  ◇ hollow diamond
// new inside class     → Composition  ◆ filled diamond`,
    },
  ],

  rules: [
    {
      rule: 'Class diagram: only draw BUSINESS entities (nouns), not helper/util classes',
      tag: 'key',
      detail: 'Identify entities from requirements using nouns. Student, Course, Payment — yes. JsonParser, StringUtil — no. Helper classes emerge during implementation, not design.',
    },
    {
      rule: 'Class diagram: only write BUSINESS methods — skip all getters, setters, constructors',
      tag: 'key',
      detail: 'If you have 20 variables, writing 40 getters/setters makes the diagram unreadable. Only write methods that contain actual business logic: enroll(), viewCourse(), assignTask().',
    },
    {
      rule: 'Access modifiers: - private, + public, # protected, nothing = default',
      tag: 'key',
      detail: 'These are standard UML symbols. In practice, do not stress if you forget — write the word instead. But in Scaler LLD3, diagrams are evaluated on these symbols.',
    },
    {
      rule: 'Interface → «interface» (double angle brackets). Abstract class → italics',
      tag: 'key',
      detail: 'Both use double angle brackets, but abstract class name is in italics. Abstract methods also written in italics. On paper, underline instead of italics if needed.',
    },
    {
      rule: 'implements arrow = DASHED line + hollow triangle. extends arrow = SOLID line + hollow triangle',
      tag: 'gotcha',
      detail: 'Both point from child toward parent. The only difference is dashed vs solid line. Crow foot notation (three arrows) is for schema diagrams, not class diagrams.',
    },
    {
      rule: 'Many-to-many in class → junction table in schema. Common attributes go IN the junction table.',
      tag: 'key',
      detail: 'enrollment_date, payment_method, discount — anything that belongs to BOTH sides of the relationship lives in the junction table. It cannot go in either main table without duplication.',
    },
    {
      rule: 'Foreign key always goes on the MANY side of a one-to-many relationship',
      tag: 'key',
      detail: 'Instructor (one) → Courses (many): instructor_id goes in courses table. Student (one) → Orders (many): student_id goes in orders table. Many side holds the FK.',
    },
    {
      rule: 'Aggregation vs Composition is a BUSINESS REQUIREMENT, not just common sense',
      tag: 'gotcha',
      detail: 'Car + Engine: economy car = aggregation (sourced externally). BMW = composition (manufactured together). Ask the interviewer — do not assume. Code tells the truth: inject = aggregation, new inside = composition.',
    },
    {
      rule: 'When 4 options (Association/Aggregation/Composition/Inheritance) — pick Association for generic has-a',
      tag: 'gotcha',
      detail: 'Association is the umbrella term. When question is vague (no lifecycle info), pick Association. When forced to choose between Aggregation/Composition only, look at whether dependent survives parent deletion.',
    },
    {
      rule: 'Schema diagram always AFTER class diagram — classes first, tables follow',
      tag: 'key',
      detail: 'Class diagram identifies entities and relationships. Schema is derived from it. Primitive fields → columns. Non-primitive → FK. This order ensures schema matches the domain model, not the other way around.',
    },
    {
      rule: 'Hollow diamond ◇ = Aggregation (weak). Filled diamond ◆ = Composition (strong)',
      tag: 'key',
      detail: 'Diamond is drawn on the side of the class that CONTAINS the other object (the owner). Dove points arrow toward Flyable — diamond is on Dove side if Dove owns Flyable.',
    },
  ],

  complexity: [
    { problem: 'Class → Schema (one-to-many)', tc: 'O(1)', sc: 'O(1)', note: 'Add FK column on many side — no new table needed' },
    { problem: 'Class → Schema (many-to-many)', tc: 'O(1)', sc: 'O(n)', note: 'Creates 1 extra junction table. n = rows = product of both entity counts' },
    { problem: 'Junction table lookup', tc: 'O(log n)', sc: 'O(1)', note: 'With index on FK columns — standard B-tree index' },
    { problem: 'Entity identification', tc: 'O(nouns)', sc: 'O(1)', note: 'Scan requirements for nouns — each noun is a candidate entity' },
  ],

  quiz: [
    {
      q: 'In a class diagram, what goes in the MIDDLE section of the class box?',
      options: [
        'Methods with return types',
        'Class name only',
        'Variables (fields) with data types and access modifiers',
        'Package name and imports',
      ],
      answer: 2,
      explanation: 'Class box has 3 sections: top = class name, middle = variables (e.g. -name: String), bottom = methods. Access modifiers use symbols: - private, + public, # protected.',
    },
    {
      q: 'How do you represent an interface in a UML class diagram?',
      options: [
        'Write "interface" keyword in the box like Java code',
        'Use a different color box',
        'Use «interface» (double angle brackets) above the interface name',
        'Draw a circle instead of a rectangle',
      ],
      answer: 2,
      explanation: '«interface» ClassName in double angle brackets. Similarly, abstract classes use double angle brackets with the name in italics.',
    },
    {
      q: 'Student has courses: List<Course>. In the DB schema, how is this represented?',
      options: [
        'Add a courses column of type TEXT in the students table',
        'Add a student_id foreign key in the courses table (one-to-many)',
        'If many-to-many: create an enrollments junction table with student_id and course_id',
        'B or C depending on the cardinality',
      ],
      answer: 3,
      explanation: 'If one student can have many courses AND one course can have many students → many-to-many → junction table. If one student can have many courses but one course has only one student → one-to-many → course_id or student_id FK on the many side.',
    },
    {
      q: 'A booking system stores an enrollment date — the date a student enrolled in a specific course. Where does this column go in the schema?',
      options: [
        'In the students table',
        'In the courses table',
        'In the enrollments junction table (it belongs to the relationship, not either entity)',
        'In both students and courses tables for redundancy',
      ],
      answer: 2,
      explanation: 'Enrollment date is a property of the student-course relationship, not of student alone or course alone. It goes in the junction table (enrollments). Common attributes of a many-to-many relationship always go in the junction table.',
    },
    {
      q: 'Q4 from Scaler: Library has books. If the library shuts down, the books can be transferred to another library. What is the relationship?',
      options: [
        'Inheritance — Library extends Book',
        'Composition — books are destroyed with library',
        'Aggregation — books can exist independently of the library',
        'Association — generic has-a with no lifecycle dependency',
      ],
      answer: 2,
      explanation: 'Books can exist independently even if the library is gone — aggregation (weak has-a). Hollow diamond ◇ in diagram. In code: Book objects created outside Library and injected in.',
    },
    {
      q: 'What is the code-level rule to identify Aggregation vs Composition?',
      options: [
        'Aggregation uses final keyword; Composition does not',
        'Object injected from outside (constructor param) = Aggregation. Object created with new inside class = Composition.',
        'Aggregation is always a List; Composition is always a single object',
        'Composition uses static fields; Aggregation uses instance fields',
      ],
      answer: 1,
      explanation: 'Injected from outside → object existed before and independently → Aggregation. Created inside with new → tightly bound lifecycle → Composition. This is the code-level truth — domain reasoning can be ambiguous (e.g. Car+Engine depends on business requirement).',
    },
    {
      q: 'Dove implements Flyable. What type of relationship is this, and what arrow is used?',
      options: [
        'Aggregation — hollow diamond from Dove to Flyable',
        'Composition — filled diamond from Dove to Flyable',
        'Inheritance — dashed line with hollow triangle from Dove toward Flyable',
        'Association — plain line from Dove to Flyable',
      ],
      answer: 2,
      explanation: 'implements = is-a = Inheritance. Arrow: dashed line + hollow triangle, pointing from child (Dove) toward parent (Flyable). Solid line + hollow triangle is for extends. Never a diamond for inheritance.',
    },
    {
      q: 'When Scaler gives 4 options — Inheritance, Association, Aggregation, Composition — and the question says "User has posts" without mentioning lifecycle, what do you pick?',
      options: [
        'Composition — posts are created for users',
        'Aggregation — posts can exist independently',
        'Association — generic has-a when lifecycle is not specified',
        'Inheritance — User extends Post',
      ],
      answer: 2,
      explanation: 'Association is the umbrella term for has-a. Aggregation and Composition are subtypes of Association. When 4 options are present and lifecycle is NOT explicitly mentioned, pick Association. When forced to choose between Aggregation/Composition only, look at whether dependent survives parent deletion.',
    },
  ],
}
