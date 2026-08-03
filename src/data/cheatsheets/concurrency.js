export const concurrencyCheatsheet = {
  title: 'Concurrency & Multithreading',

  patterns: [
    {
      name: 'Pattern 1 — Program vs Process vs Thread',
      icon: '🖥️',
      when: 'Understand the layers before writing any multithreaded code',
      gaonKiBaat: 'Program = recipe book on shelf (disk). Process = jab koi actually khana bana raha ho (RAM mein chala). Thread = haath jo kaam kar rahe hain — ek process ke andar ek ya zyada haath ho sakte hain.',
      problems: ['Interview: "What is a process?"', 'Interview: "What is a thread?"', 'Interview: "Difference between process and thread?"'],
      template: `// Program → static code stored on disk (.exe, .jar, .class)
// Not running. Just sitting there.

// Process → program in execution (loaded into RAM)
// Has its own: Process ID, Memory space, Program Counter, Stack, Heap
// At least ONE thread lives inside every process

// Thread → unit of execution inside a process
// Has its own: Thread ID, Program Counter, Stack (registers)
// Shares with other threads: Heap, Code, Static data

// Example: Chrome browser
// Each tab = separate process (crash isolation)
// Each tab's process has multiple threads (render, network, JS engine)

// In Java:
public class Main {
    public static void main(String[] args) {
        // This is the main thread — JVM creates it automatically
        System.out.println("Running on: " + Thread.currentThread().getName());
        // Output: Running on: main
    }
}`,
    },
    {
      name: 'Pattern 2 — Concurrency vs Parallelism',
      icon: '⚡',
      when: 'Explain the difference in interviews or design discussions',
      gaonKiBaat: 'Concurrency = ek doctor ke paas 10 patient hain, woh ek ek ko thoda thoda time deta hai — sab progress kar rahe hain, par ek time pe sirf ek patient. Parallelism = 4 doctor hain, 4 patient simultaneously treat ho rahe hain.',
      problems: ['Interview: "What is concurrency?"', 'Interview: "What is parallelism?"', 'Interview: "Is parallelism a subset of concurrency?"'],
      template: `// CONCURRENCY — multiple tasks make progress, but not truly simultaneous
// OS rapidly switches between threads → illusion of parallelism
// Works even on 1 core CPU via context switching

// PARALLELISM — multiple tasks run at the EXACT same instant
// Requires multiple CPU cores
// 4-core CPU → 4 threads running truly simultaneously

// Relationship: Parallelism IS a subset of Concurrency
// If things run in parallel → they are also concurrent
// If things are concurrent → they may or may not be parallel

// Real example (4-core CPU, 100 threads):
// - 4 threads run in parallel (truly at same time) → PARALLELISM
// - Other 96 threads wait, take turns via context switch → CONCURRENCY
// - Overall system = concurrent (parallelism + time-sliced concurrency)

// Case 1: 1 core, no context switch, 3 threads → NEITHER
// T1 runs to completion, then T2, then T3. No overlap at all.

// Case 2: 1 core, WITH context switching, 3 threads → CONCURRENCY only
// T1, T2, T3 take turns. Progress interleaved. Not parallel.

// Case 3: 4 cores, 3 threads → PARALLELISM (and therefore concurrent too)
// T1, T2, T3 run simultaneously on 3 cores.`,
    },
    {
      name: 'Pattern 3 — Context Switching',
      icon: '🔄',
      when: 'When asked about overhead of multithreading or OS scheduling',
      gaonKiBaat: 'Jaise student ek subject chhod ke dusra subject padhne se pehle apni progress copy mein likh leta hai. OS bhi thread chhodne se pehle uska saara state (TCB) save karta hai, phir kisi aur thread ka state load karta hai.',
      problems: ['Interview: "What is context switching?"', 'Interview: "Does context switching have overhead?"', 'Interview: "What is TCB?"'],
      template: `// Context Switching = OS pauses one thread and resumes another

// What OS saves before pausing a thread (into TCB — Thread Control Block):
// - Program Counter (which instruction was running)
// - CPU Registers (current values)
// - Stack Pointer
// - Thread state (RUNNING → WAITING/READY)

// Steps:
// 1. OS interrupts Thread T1
// 2. Saves T1's state into T1's TCB
// 3. Loads T2's state from T2's TCB
// 4. T2 resumes from where it left off

// OVERHEAD: Context switching is NOT free
// - Time spent saving/restoring state
// - CPU cache invalidation (L1/L2 cache may have T1's data, now useless)
// - If too many threads → more switching → less actual work done
// This is why 1000 threads on 4 cores is often SLOWER than 8 threads

// Thread priorities:
// I/O-bound threads (waiting for disk, network) often get higher priority
// CPU-bound threads (heavy computation) get lower priority
// OS schedulers (Round Robin, Priority Queue etc.) decide the order`,
    },
    {
      name: 'Pattern 4 — Java Thread via Runnable (Preferred)',
      icon: '🧵',
      when: 'Use when you want to define a task and run it on a thread — preferred approach',
      gaonKiBaat: 'Runnable = kaam ka description (task). Thread = kaam karne wala mazdoor. Mazdoor ko kaam batao aur kaho "shuru kar" — alag alag mazdoor alag alag kaam le sakte hain.',
      problems: ['Scaler Q1 — Adder, Subtractor tasks', 'Print 1–100 each on a separate thread', 'IndividualNumberPrinter'],
      template: `// STEP 1: Define the task (implement Runnable)
public class IndividualNumberPrinter implements Runnable {

    private int num;

    IndividualNumberPrinter(int num) {
        this.num = num;
    }

    @Override
    public void run() {
        // This is the task — runs when thread starts
        System.out.println(num);
    }
}

// STEP 2: Create a thread with the task and start it
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 100; i++) {
            IndividualNumberPrinter task = new IndividualNumberPrinter(i);
            Thread t = new Thread(task);  // wrap task in a thread
            t.start();                    // start() creates new thread + calls run()
        }
    }
}

// WHY Runnable over extending Thread?
// - Your class can still extend another class (Java = single inheritance)
// - Cleaner separation: task logic vs threading mechanism
// - Same task object can be shared across multiple threads`,
    },
    {
      name: 'Pattern 5 — Java Thread via extends Thread',
      icon: '🧵',
      when: 'Use when the task IS the thread — class directly extends Thread',
      gaonKiBaat: 'Thread extend karna matlab mazdoor khud hi apna kaam jaanta hai. Runnable implement karna matlab ek alag form pe kaam likha aur mazdoor ko diya. Dono kaam karte hain, par Runnable zyada flexible hai.',
      problems: ['BigFactorial Scaler assignment', 'When class-specific state and thread behaviour are tightly coupled'],
      template: `// Extend Thread directly — class IS the thread
import java.math.BigInteger;

public class BigFactorial extends Thread {

    private int number = 0;
    private BigInteger ans;

    public BigFactorial(int number) {
        this.number = number;
    }

    public BigInteger getFactorial() {
        return ans;
    }

    @Override
    public void run() {
        // runs when start() is called
        ans = BigInteger.ONE;
        for (int i = 1; i <= number; i++) {
            ans = ans.multiply(BigInteger.valueOf(i));
        }
    }
}

// Usage:
BigFactorial calc = new BigFactorial(1000);
calc.start();  // spawns new thread, calls run()
calc.join();   // main thread waits for calc thread to finish
System.out.println(calc.getFactorial());

// BigInteger — for numbers that exceed long/int range
// BigInteger.ONE, BigInteger.ZERO are constants
// BigInteger.valueOf(i) converts int to BigInteger
// ans.multiply(BigInteger.valueOf(i)) — immutable: always reassign`,
    },
    {
      name: 'Pattern 6 — start() vs run()',
      icon: '▶️',
      when: 'Critical distinction — always use start(), never call run() directly',
      gaonKiBaat: 'run() directly bulana = khud hi kaam karna (same thread). start() bulana = naya mazdoor rakho aur usse kaam do (new thread). Multithreading tabhi hoti hai jab start() se nayi thread bane.',
      problems: ['Any multithreading question in interview', 'Debugging why code runs sequentially despite using Thread'],
      template: `Thread t = new Thread(task);

// WRONG — runs task on the CURRENT thread (no new thread created)
t.run();
// Output: numbers print in order 1,2,3... sequentially

// CORRECT — creates NEW thread, calls run() on that new thread
t.start();
// Output: numbers print in random order (threads compete for CPU)

// What start() does internally:
// 1. Registers new thread with JVM
// 2. Allocates new stack for the thread
// 3. Calls run() on that NEW thread
// 4. Returns immediately to the caller (non-blocking)

// join() — wait for a thread to finish
Thread t = new Thread(task);
t.start();
t.join();  // main thread blocks here until t completes
System.out.println("t is done");  // runs only after t finishes`,
    },
  ],

  rules: [
    {
      rule: 'Program = disk. Process = RAM. Thread = CPU unit of execution.',
      tag: 'key',
      detail: 'A program becomes a process when loaded into RAM. A process has at least one thread. Thread is what CPU actually executes.',
    },
    {
      rule: 'Every process has at least one thread (the main thread)',
      tag: 'key',
      detail: 'In Java, JVM creates the "main" thread automatically. All other threads you create are additional.',
    },
    {
      rule: 'Threads share Heap; each thread has its own Stack',
      tag: 'gotcha',
      detail: 'Heap = shared objects (instance variables, new objects). Stack = local variables, method calls. This is why two threads can corrupt shared data.',
    },
    {
      rule: 'Parallelism is a subset of concurrency — not the opposite',
      tag: 'key',
      detail: 'Concurrency = tasks make progress (time-sliced or parallel). Parallelism = tasks run at exact same instant. Parallel always implies concurrent.',
    },
    {
      rule: 'Context switching has overhead — more threads ≠ more speed',
      tag: 'gotcha',
      detail: 'CPU spends time saving/restoring TCB state. Beyond a point, adding threads slows the system down due to switching overhead.',
    },
    {
      rule: 'start() creates new thread. run() runs on current thread.',
      tag: 'gotcha',
      detail: 'Calling t.run() directly is just a method call — no new thread. Call t.start() to actually spawn a thread.',
    },
    {
      rule: 'Prefer Runnable over extending Thread',
      tag: 'key',
      detail: 'Java is single-inheritance. If you extend Thread, you cannot extend anything else. Runnable keeps your options open.',
    },
    {
      rule: 'join() makes the calling thread wait for the target thread to finish',
      tag: 'key',
      detail: 'Without join(), main thread may print result before worker thread finishes. Use join() to synchronize.',
    },
    {
      rule: 'BigInteger is immutable — always reassign',
      tag: 'gotcha',
      detail: 'ans.multiply(x) does NOT modify ans. It returns a new BigInteger. Always do: ans = ans.multiply(x).',
    },
  ],

  complexity: [
    { problem: 'Creating a Thread (new Thread)', tc: 'O(1)', sc: 'O(1)', note: 'Stack allocated per thread (~512KB default in JVM)' },
    { problem: 'start() — spawn new thread', tc: 'O(1)', sc: 'O(stack size)', note: 'OS allocates new stack; JVM registers thread' },
    { problem: 'join() — wait for thread', tc: 'O(t)', sc: 'O(1)', note: 't = time for target thread to complete' },
    { problem: 'Context Switch (OS)', tc: 'O(1)', sc: 'O(1)', note: 'Fixed overhead to save/restore TCB; not in your code but affects wall-clock time' },
    { problem: 'BigInteger factorial(n)', tc: 'O(n · M(n!))', sc: 'O(digits(n!))', note: 'M(k) = cost of multiplying k-digit number; n! has ~n log n digits' },
    { problem: 'Parallel tasks on K cores', tc: 'O(n/K)', sc: 'O(n)', note: 'Ideal case; actual speedup limited by Amdahl\'s Law' },
  ],

  quiz: [
    {
      q: 'What is the difference between a Program and a Process?',
      options: [
        'They are the same thing',
        'Program = static code on disk, Process = program currently running in RAM',
        'Program runs in RAM, Process runs on disk',
        'Process is a type of program',
      ],
      answer: 1,
      explanation: 'Program is passive — a .jar or .exe file sitting on disk. Process is active — the same code loaded into RAM and executing. One program can spawn multiple processes.',
    },
    {
      q: 'You have a 4-core CPU and 100 threads. Which statement is correct?',
      options: [
        'All 100 threads run in parallel',
        'No parallelism is possible — only concurrency',
        '4 threads run in parallel; others make progress via context switching (concurrency)',
        'Only 1 thread runs at a time',
      ],
      answer: 2,
      explanation: '4 cores → 4 threads truly parallel at any instant. The other 96 threads are managed by the OS scheduler via context switching — they are concurrent but not parallel.',
    },
    {
      q: 'What happens when you call t.run() instead of t.start()?',
      options: [
        'A new thread is created and run() executes on it',
        'run() executes on the CURRENT thread — no new thread created',
        'Compile error — run() is private',
        'run() and start() do exactly the same thing',
      ],
      answer: 1,
      explanation: 't.run() is just a normal method call — it runs synchronously on the calling thread. t.start() is what actually creates a new OS thread and runs run() on it.',
    },
    {
      q: 'Why is Runnable preferred over extending Thread in Java?',
      options: [
        'Runnable is faster than Thread',
        'Java supports multiple inheritance so it does not matter',
        'Extending Thread prevents your class from extending any other class',
        'Runnable automatically handles synchronization',
      ],
      answer: 2,
      explanation: 'Java has single-inheritance. If your class extends Thread, it cannot extend anything else (e.g., Animal, Shape). Implementing Runnable keeps the inheritance slot free.',
    },
    {
      q: 'What does join() do?',
      options: [
        'Merges two threads into one',
        'Makes the calling thread wait until the joined thread finishes',
        'Starts multiple threads simultaneously',
        'Terminates the thread immediately',
      ],
      answer: 1,
      explanation: 'calc.join() blocks the current (main) thread until calc finishes. Without join(), main might read getFactorial() before the computation is done — returning null.',
    },
    {
      q: 'What is wrong with: `BigInteger ans = BigInteger.ONE; ans.multiply(BigInteger.valueOf(5));`',
      options: [
        'BigInteger.ONE is not a valid constant',
        'multiply() is not a valid method',
        'ans is still ONE — BigInteger is immutable. Result must be reassigned: ans = ans.multiply(...)',
        'Nothing is wrong',
      ],
      answer: 2,
      explanation: 'BigInteger is immutable — multiply() returns a NEW BigInteger, it does not modify the existing one. You must always reassign: ans = ans.multiply(BigInteger.valueOf(5)).',
    },
    {
      q: 'Threads inside the same process share which memory area?',
      options: [
        'Stack only',
        'Heap only',
        'Stack and Heap both',
        'Neither — threads have completely separate memory',
      ],
      answer: 1,
      explanation: 'Each thread has its OWN stack (local variables, method frames). All threads in a process share the HEAP (objects created with new). This shared heap is why race conditions happen.',
    },
  ],
}
