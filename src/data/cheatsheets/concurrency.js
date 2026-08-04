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
    {
      name: 'Pattern 7 — ExecutorService & Thread Pool',
      icon: '🏊',
      when: 'Production code — never create raw threads for every task; use a thread pool',
      gaonKiBaat: 'Socho gaon mein kheth pe kaam hai. Har baar naya mazdoor Bombay se bulao — train ticket, waqt, sab lagega (1M threads = 51 sec). Thread pool = gaon ka thekedar jiske paas 5 kaarigar hamesha tayyar baithe hain. Kaam aaya → ek kaarigar bhejo → kaam khatam → waapis baith jao. OS scheduler = sarpanch jo decide karta hai kaun pehle khet mein jaayega.',
      problems: ['Interview: "What is a thread pool?"', 'Interview: "Fixed vs Cached pool?"', 'Scaler: executors/client.java — 1M tasks, pool of 5 threads'],
      template: `import java.util.concurrent.*;

// ── FIXED THREAD POOL ──
// n threads created UPFRONT — even before any task arrives
ExecutorService ex = Executors.newFixedThreadPool(5);

// execute() — for Runnable (fire and forget, no return value)
ex.execute(runnableTask);

// If all 5 threads busy → new tasks go into QUEUE and wait
// When a thread frees up → picks next task from queue

// ── CACHED THREAD POOL ──
// 0 threads created upfront — threads created ON DEMAND per task
ExecutorService ex2 = Executors.newCachedThreadPool();
// If no free thread → creates new thread immediately (no queue)
// Idle thread after 60 sec → killed automatically

// ── SHUTDOWN ──
ex.shutdown();       // graceful: completes running + queued tasks, then stops
ex.shutdownNow();    // forceful: interrupts all, returns list of pending tasks

// shutdown() is NON-BLOCKING — main thread continues immediately
// To wait until all tasks finish:
ex.shutdown();
ex.awaitTermination(Long.MAX_VALUE, TimeUnit.NANOSECONDS); // blocks main thread

// ── THREAD STATES ──
// WAITING  → thread has NO task (sitting idle in pool) — OS ignores it
// RUNNABLE → thread HAS a task, ready to run — OS considers it for CPU
// RUNNING  → OS gave it CPU time — executing right now

// KEY: Thread pool assigns tasks to threads
//      OS scheduler decides WHEN a thread gets CPU time
//      Thread pool has ZERO control over CPU scheduling`,
    },
    {
      name: 'Pattern 8 — Callable + Future (return value from thread)',
      icon: '📦',
      when: 'Use when you need a result back from a thread task — Callable is Runnable that returns a value',
      gaonKiBaat: 'Dukaan pe bete ko bheja gehoon laane ke liye. Runnable = bhejo aur bhool jao, result nahi chahiye. Callable = bhejo aur ek parchi (Future) haath mein rakho — jab waapis aayega toh parchi pe result likhega. future.get() = dukaan ke bahar khamba pakad ke khade rehna jab tak woh waapis na aaye. "Hello" print karna = ghar ka doosra kaam karte rehna jab tak beta bazaar mein hai.',
      problems: ['Interview: "How to get result from a thread?"', 'Interview: "What is Future in Java?"', 'Scaler: callable/numberMultiplier.java'],
      template: `import java.util.concurrent.*;

// ── CALLABLE ──
// Like Runnable but: returns a value + can throw checked exception
public class numberMultiplier implements Callable<Integer> {
    private int val;
    numberMultiplier(int val) { this.val = val; }

    @Override
    public Integer call() throws Exception {
        Thread.sleep(10000);  // simulate long work
        return 5 * val;       // returns result
    }
}

// ── SUBMIT + FUTURE ──
ExecutorService ex = Executors.newFixedThreadPool(2);
numberMultiplier task = new numberMultiplier(5);

Future<Integer> future = ex.submit(task);  // task goes to pool, returns Future immediately

System.out.println("Hello");  // runs IMMEDIATELY — main thread does not block here

int val = future.get();       // BLOCKING — main thread waits here until task completes
System.out.println(val);      // 25

// future.get(2, TimeUnit.SECONDS) — wait max 2 sec, throw TimeoutException if not done

ex.shutdown();

// ── CALLABLE vs RUNNABLE ──
// Runnable.run()  → void, no checked exception
// Callable.call() → returns T, can throw checked exception
// execute(Runnable) → no return
// submit(Callable) → returns Future<T>

// ── EXECUTION TIME ──
// Two tasks running in parallel:
// Task A takes 3 sec, Task B takes 7 sec
// Total time = max(3, 7) = 7 sec  (NOT 3+7=10)
// Both submitted before any .get() — they run simultaneously

// ── C# ANALOGY ──
// Callable + Future ≈ async/await in C#
// Difference: await releases thread while waiting
//             future.get() BLOCKS the thread while waiting`,
    },
    {
      name: 'Pattern 9 — Multithreaded Merge Sort (Callable + ExecutorService)',
      icon: '🔀',
      when: 'Classic interview problem — shows recursive parallel decomposition using thread pool',
      gaonKiBaat: 'Gehoon ka dher hai, chalanna hai (sort karna). DSA = ek banda akele sab chaalta hai — ek ke baad ek. Multithreaded = baap ne dher ko beech se tod diya — ek beta baayein dher leke baitha, doosra daayein dher leke — dono ek saath chaalna shuru. Phir dono ke sorted gehoon milao. Aur woh dono bete? Unhone bhi apna apna dher todke chote bhai-behenon ko de diya — sab ek saath kaam kar rahe hain. Yahi hai parallel recursion.',
      problems: ['Interview: "Implement parallel merge sort"', 'Scaler: mergesort/sorter.java + client.java'],
      template: `// ── SORTER (Callable) ──
package mergesort;

public class sorter implements Callable<List<Integer>> {
    private List<Integer> list;
    private ExecutorService es;

    sorter(List<Integer> list, ExecutorService es) {
        this.list = new ArrayList<>(list);  // MUST copy — subList returns a view
        this.es = es;
    }

    @Override
    public List<Integer> call() throws Exception {
        if (list.size() == 1) return list;  // base case — same as DSA

        int mid = list.size() / 2;
        List<Integer> leftList  = list.subList(0, mid);
        List<Integer> rightList = list.subList(mid, list.size());

        sorter leftSorter  = new sorter(leftList, es);   // creates task object (call() NOT invoked yet)
        sorter rightSorter = new sorter(rightList, es);  // creates task object (call() NOT invoked yet)

        // BOTH submitted before any .get() → run in PARALLEL
        Future<List<Integer>> leftFuture  = es.submit(leftSorter);   // NOW call() will be invoked
        Future<List<Integer>> rightFuture = es.submit(rightSorter);  // NOW call() will be invoked

        List<Integer> leftSorted  = leftFuture.get();   // blocks until left done
        List<Integer> rightSorted = rightFuture.get();  // returns immediately if right already done

        return merge(leftSorted, rightSorted);
    }

    private List<Integer> merge(List<Integer> left, List<Integer> right) { ... }
}

// ── CLIENT ──
List<Integer> arr = List.of(2, 1, 3, 2, 10, 4);
ExecutorService ex = Executors.newFixedThreadPool(arr.size());
Future<List<Integer>> result = ex.submit(new sorter(arr, ex));
System.out.println(result.get());  // [1, 2, 2, 3, 4, 10]
ex.shutdown();

// ── RECURSION EXPLAINED ──
// new sorter(list, es)  → just creates object (constructor runs, call() does NOT)
// es.submit(sorter)     → puts task in pool queue; a free thread calls call()
// Inside call(), leftSorter and rightSorter are submitted → call() runs again on smaller lists
// This IS recursion — just each level runs on a different thread, in parallel

// ── DEADLOCK RISK ──
// With newFixedThreadPool(n), all n threads can block on future.get()
// while subtasks are stuck in queue with no free thread → deadlock
// Fix: use newCachedThreadPool() for recursive parallel tasks (creates threads on demand)`,
    },
    {
      name: 'Pattern 10 — ThreadPoolExecutor (Custom Thread Pool)',
      icon: '⚙️',
      when: 'Production systems — when Fixed and Cached pools are not enough and you need full control',
      gaonKiBaat: 'Fixed pool = 5 kaarigar hamesha rakho, chahe kaam ho ya na ho. Cached pool = jitna kaam utne kaarigar, koi seema nahi. ThreadPoolExecutor = apna custom setup — 3 pakke kaarigar (core), zyada kaam aaya toh 7 tak temporary rakho (max), temporary wale 60 sec bekar baithe toh ghar bhejo, aur waiting room mein sirf 10 log baith sakte hain (queue). Queue bhari aur max bhi poora? Sarpanch decide karta hai kya karein (rejection policy).',
      problems: ['Interview: "How to create a custom thread pool?"', 'Interview: "What are rejection policies?"', 'Interview: "Difference between core and max pool size?"'],
      template: `import java.util.concurrent.*;

// ThreadPoolExecutor — full control over every parameter
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    3,                                    // corePoolSize    — always-alive threads (even if idle)
    7,                                    // maximumPoolSize — max threads under peak load
    60L,                                  // keepAliveTime   — idle non-core threads die after this
    TimeUnit.SECONDS,                     // unit            — time unit for keepAliveTime
    new LinkedBlockingQueue<>(10),        // workQueue       — holds tasks when all core threads busy
    Executors.defaultThreadFactory(),     // threadFactory   — how threads are created (optional)
    new ThreadPoolExecutor.AbortPolicy()  // rejectionPolicy — what to do when queue full + max reached
);

// ── HOW IT SCALES ──
// Tasks arrive:
// 1. core threads free?        → assign to core thread
// 2. core full, queue not full → task goes into queue
// 3. queue full, max not hit   → create new (non-core) thread
// 4. queue full + max hit      → REJECTION POLICY kicks in

// ── REJECTION POLICIES ──
new ThreadPoolExecutor.AbortPolicy();         // DEFAULT — throws RejectedExecutionException
new ThreadPoolExecutor.CallerRunsPolicy();    // caller's thread runs the task (slows producer)
new ThreadPoolExecutor.DiscardPolicy();       // silently drops the new task
new ThreadPoolExecutor.DiscardOldestPolicy(); // drops oldest queued task, retries new one

// ── QUEUE TYPES ──
new LinkedBlockingQueue<>()       // unbounded — queue never full (maximumPoolSize never used!)
new LinkedBlockingQueue<>(100)    // bounded — queue holds 100 tasks max
new ArrayBlockingQueue<>(100)     // bounded, array-backed, slightly faster
new SynchronousQueue<>()          // no buffer — task handed directly to thread (like cachedPool)

// ── REAL WORLD EXAMPLE ──
// Web server handling HTTP requests:
ThreadPoolExecutor webPool = new ThreadPoolExecutor(
    10,                              // 10 core threads always ready
    50,                              // spike to 50 under heavy load
    30L, TimeUnit.SECONDS,           // temporary threads die after 30 sec idle
    new ArrayBlockingQueue<>(200),   // queue up to 200 requests
    new ThreadPoolExecutor.CallerRunsPolicy() // if overloaded, slow down the caller
);

// ── MONITORING ──
executor.getPoolSize();          // current number of threads
executor.getActiveCount();       // threads currently executing tasks
executor.getQueue().size();      // tasks waiting in queue
executor.getCompletedTaskCount(); // total tasks finished`,
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
    {
      rule: 'Thread pool assigns tasks. OS scheduler assigns CPU. These are two separate systems.',
      tag: 'key',
      detail: 'Thread pool decides which thread gets which task. OS scheduler decides when a thread gets CPU time. Thread pool has zero control over CPU scheduling.',
    },
    {
      rule: 'Idle threads are in WAITING state — OS completely ignores them for CPU',
      tag: 'key',
      detail: 'Only RUNNABLE threads (those with a task) compete for CPU. Idle threads sit in pool consuming memory but no CPU cycles.',
    },
    {
      rule: 'Tasks queue up waiting for threads — not the other way around',
      tag: 'gotcha',
      detail: 'In a fixed thread pool, when all threads are busy, new tasks go into a queue. Threads wait for tasks (WAITING state), tasks wait for threads (queue). Never confuse the two.',
    },
    {
      rule: 'newFixedThreadPool: threads created upfront. newCachedThreadPool: threads created on demand.',
      tag: 'key',
      detail: 'Fixed pool pre-creates n threads — idle threads waste memory if tasks < n. Cached pool creates threads only when a task arrives and no free thread exists. Idle cached threads die after 60 sec.',
    },
    {
      rule: 'Use Fixed pool for CPU-bound tasks, Cached pool for I/O-bound tasks',
      tag: 'key',
      detail: 'CPU-bound: pool size = number of cores (more threads = context switching waste). I/O-bound: threads spend time waiting for disk/network — many threads are fine as CPU is mostly idle.',
    },
    {
      rule: 'Callable returns a value; Runnable does not. submit() returns Future; execute() returns void.',
      tag: 'key',
      detail: 'Use Runnable + execute() for fire-and-forget tasks. Use Callable + submit() when you need the result back from the thread.',
    },
    {
      rule: 'new sorter(list, es) does NOT call call(). Only es.submit(sorter) triggers call().',
      tag: 'gotcha',
      detail: 'Creating the Callable object only runs the constructor. The call() method runs when a pool thread picks up the submitted task. Same as: new Thread(r) does not call run(); t.start() does.',
    },
    {
      rule: 'Submit both futures BEFORE calling .get() on either — otherwise no parallelism',
      tag: 'gotcha',
      detail: 'If you call leftFuture.get() before submitting rightFuture, right does not start until left finishes — completely sequential. Submit both first, then get() both.',
    },
    {
      rule: 'Parallel execution time = max(task times), not sum',
      tag: 'key',
      detail: 'If left takes 3 sec and right takes 7 sec, and both run in parallel, total = 7 sec. They run simultaneously so you wait for the slowest one.',
    },
  ],

  complexity: [
    { problem: 'Creating a Thread (new Thread)', tc: 'O(1)', sc: 'O(1)', note: 'Stack allocated per thread (~512KB default in JVM)' },
    { problem: 'start() — spawn new thread', tc: 'O(1)', sc: 'O(stack size)', note: 'OS allocates new stack; JVM registers thread' },
    { problem: 'join() — wait for thread', tc: 'O(t)', sc: 'O(1)', note: 't = time for target thread to complete' },
    { problem: 'Context Switch (OS)', tc: 'O(1)', sc: 'O(1)', note: 'Fixed overhead to save/restore TCB; not in your code but affects wall-clock time' },
    { problem: 'BigInteger factorial(n)', tc: 'O(n · M(n!))', sc: 'O(digits(n!))', note: 'M(k) = cost of multiplying k-digit number; n! has ~n log n digits' },
    { problem: 'Parallel tasks on K cores', tc: 'O(n/K)', sc: 'O(n)', note: 'Ideal case; actual speedup limited by Amdahl\'s Law' },
    { problem: 'newFixedThreadPool(n)', tc: 'O(n)', sc: 'O(n)', note: 'n threads created upfront at pool creation time' },
    { problem: 'es.submit(Callable)', tc: 'O(1)', sc: 'O(1)', note: 'Adds task to queue; Future returned immediately' },
    { problem: 'future.get()', tc: 'O(t)', sc: 'O(1)', note: 't = time for the Callable task to complete; blocks caller' },
    { problem: 'Multithreaded Merge Sort', tc: 'O(n log n)', sc: 'O(n log n)', note: 'Wall-clock = O(n) with enough threads (each level parallel); space = O(n log n) for sublists across levels' },
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
    {
      q: 'What is the difference between the Thread Pool and the OS Scheduler?',
      options: [
        'They are the same thing',
        'Thread Pool assigns tasks to threads; OS Scheduler decides when a thread gets CPU time',
        'OS Scheduler assigns tasks; Thread Pool decides CPU time',
        'Thread Pool manages CPU cores directly',
      ],
      answer: 1,
      explanation: 'Thread Pool manages which thread gets which task. OS Scheduler manages which RUNNABLE thread gets CPU time. Thread pool has zero control over CPU scheduling — that is entirely the OS\'s job.',
    },
    {
      q: 'You have newFixedThreadPool(3) and submit 10 tasks. What happens to the extra 7 tasks?',
      options: [
        'They are dropped silently',
        'Three new threads are created automatically',
        'They wait in a queue until a thread becomes free',
        'An exception is thrown',
      ],
      answer: 2,
      explanation: 'Fixed thread pool has a task queue. When all 3 threads are busy, new tasks queue up and wait. As each thread finishes its task, it picks the next one from the queue.',
    },
    {
      q: 'What is the difference between Callable and Runnable?',
      options: [
        'Callable runs faster than Runnable',
        'Callable.call() returns a value and can throw checked exceptions; Runnable.run() returns void and cannot',
        'Runnable returns a value; Callable does not',
        'They are identical — just different names',
      ],
      answer: 1,
      explanation: 'Runnable.run() → void, no checked exception — use with execute() for fire-and-forget. Callable.call() → returns T, can throw checked exception — use with submit() to get a Future back.',
    },
    {
      q: 'You submit left and right tasks, then call leftFuture.get(). Right finishes before left. What happens?',
      options: [
        'rightFuture.get() throws an exception because right finished too early',
        'The main thread blocks on leftFuture.get() until left is done; right\'s result is cached in the Future',
        'The main thread switches to wait for right instead',
        'Both futures are cancelled',
      ],
      answer: 1,
      explanation: 'leftFuture.get() blocks the main thread until left completes — regardless of whether right is done. Right\'s result is cached in the Future object. Once left finishes, rightFuture.get() returns immediately.',
    },
    {
      q: 'When does call() get invoked in: sorter s = new sorter(list, es); Future f = es.submit(s);',
      options: [
        'When new sorter(list, es) is called',
        'When the Future f is declared',
        'When a pool thread picks up the task after es.submit(s)',
        'When future.get() is called',
      ],
      answer: 2,
      explanation: 'new sorter() only runs the constructor — call() is NOT invoked. es.submit(s) puts the task in the pool queue. A free pool thread picks it up and executes call(). future.get() just waits for the result.',
    },
  ],
}
