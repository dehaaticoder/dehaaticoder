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
      problems: ['Q1 — Adder, Subtractor tasks', 'Print 1–100 each on a separate thread', 'IndividualNumberPrinter'],
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
//
// 1. Thread is a CLASS → Java allows only single inheritance
//    If you extend Thread, you can NEVER extend any other class.
//    If you implement Runnable (interface), your class is still free to extend anything.
//    class MyTask extends Animal implements Runnable { } // ✅ works
//    class MyTask extends Thread { }                    // ❌ can't extend Animal now
//
// 2. Cleaner separation: task logic vs threading mechanism
//    Runnable = WHAT to do (recipe)
//    Thread   = WHO does it (cook)
//    Keeping them separate is better design.
//
// 3. Same Runnable object can be shared across multiple threads
//    Runnable task = new MyTask();
//    new Thread(task).start(); // thread 1
//    new Thread(task).start(); // thread 2 — same task, different threads ✅`,
    },
    {
      name: 'Pattern 5 — Java Thread via extends Thread',
      icon: '🧵',
      when: 'Use when the task IS the thread — class directly extends Thread',
      gaonKiBaat: 'Thread extend karna matlab mazdoor khud hi apna kaam jaanta hai. Runnable implement karna matlab ek alag form pe kaam likha aur mazdoor ko diya. Dono kaam karte hain, par Runnable zyada flexible hai.',
      problems: ['BigFactorial assignment', 'When class-specific state and thread behaviour are tightly coupled'],
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
      problems: ['Interview: "What is a thread pool?"', 'Interview: "Fixed vs Cached pool?"', 'executors/client.java — 1M tasks, pool of 5 threads'],
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
      problems: ['Interview: "How to get result from a thread?"', 'Interview: "What is Future in Java?"', 'callable/numberMultiplier.java'],
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
      problems: ['Interview: "Implement parallel merge sort"', 'mergesort/sorter.java + client.java'],
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
    {
      name: 'Pattern 11 — Parallel Reduction (Sum 1M numbers using all CPU cores)',
      icon: '➕',
      when: 'Large data aggregation — divide work equally across cores, compute in parallel, combine results',
      gaonKiBaat: 'Gaon mein 1 lakh daane ginne hain. Ek banda akela ginne baithega — bahut time lagega. Samjhdaar thekedar ne kaam baant diya — 8 log hain toh 8 dher banao, sab ek saath gino, phir saath milao. Yahi hai parallel reduction. Aur iska bada bhai hai MapReduce — jaise Hadoop, Spark kaam karte hain.',
      problems: [
        'Sum 1M numbers using number of CPU cores',
        'Interview: "How would you sum a large array in parallel?"',
        'Interview: "What is parallel reduction?"',
        'Real world: DB aggregations, ML feature computation, image processing',
      ],
      template: `package oneMillionSumPorblem;

import java.util.*;
import java.util.concurrent.*;

// ── CALLABLE — partial sum for one chunk ──
public class Sum implements Callable<Long> {
    private List<Integer> list;

    Sum(List<Integer> list) { this.list = list; }

    @Override
    public Long call() throws Exception {
        long sum = 0;
        for (int i = 0; i < list.size(); i++) sum += list.get(i);
        return sum;
    }
}

// ── CLIENT ──
public class client {
    public static void main(String[] args) throws ExecutionException, InterruptedException {

        int cores = Runtime.getRuntime().availableProcessors(); // e.g. 8
        ExecutorService es = Executors.newFixedThreadPool(cores);

        // Build input list 1..1,000,000
        List<Integer> input = new ArrayList<>();
        for (int i = 1; i <= 1000000; i++) input.add(i);

        int chunkSize = 1000000 / cores;
        List<Future<Long>> futures = new ArrayList<>();

        // Submit ALL tasks first → run in PARALLEL
        for (int i = 0; i < cores; i++) {
            int start = i * chunkSize;
            int end = (i == cores - 1) ? 1000000 : start + chunkSize; // last chunk handles remainder
            futures.add(es.submit(new Sum(input.subList(start, end))));
        }

        // Collect results AFTER all submitted
        long sum = 0;
        for (Future<Long> f : futures) sum += f.get();

        System.out.println(sum); // 500000500000 ✅  (= 1000000 * 1000001 / 2)
        es.shutdown();
    }
}

// ── VERIFY ANSWER ──
// Sum of 1..N = N*(N+1)/2 = 1000000*1000001/2 = 500000500000

// ── KEY RULES ──
// 1. Submit ALL futures before calling ANY .get() → true parallelism
// 2. start = i * chunkSize  (NOT cores * chunkSize — that's always the same!)
// 3. subList(start, end)    (NOT subList(start, chunkSize) — chunkSize is size, not end index)
// 4. Last chunk: end = totalSize (handles remainder if totalSize % cores != 0)

// ── SINGLE THREAD vs PARALLEL ──
// Single thread: 1 loop, 1M additions, time = T
// 8 cores:       8 loops of 125K each, time = ~T/8
// 1B numbers → single: 10 sec, parallel 8-core: ~1.25 sec

// ── SHORTCUT — Java parallel stream ──
long parallelSum = input.parallelStream()
                        .mapToLong(Integer::longValue)
                        .sum();
// Same result — ForkJoinPool.commonPool() handles splitting internally`,
    },
    {
      name: 'Pattern 12 — Thread-Safe Collections',
      icon: '🔒',
      when: 'Multiple threads reading/writing the same collection — regular ArrayList/HashMap will corrupt data',
      gaonKiBaat: 'Socho gaon ki ek register book hai jisme sab log entries karte hain. Agar 10 log ek saath likhne lage — pages phat jayenge, entries overwrite hongi (ArrayList = corruption). CopyOnWriteArrayList = jab bhi koi likhne aaye, pehle poori book ki nakal banao, nakal mein likho, phir replace karo — padhne waale kabhi nahi rukenge. SynchronizedList = ek chowkidar — ek time pe sirf ek aadmi andar, baaki bahar wait karo.',
      problems: [
        'Interview: "Which List is thread-safe in Java?"',
        'Interview: "Difference between CopyOnWriteArrayList and synchronizedList?"',
        'Interview: "Why is ArrayList not thread-safe?"',
        'Real world: shared cache, event listeners, concurrent request handling',
      ],
      template: `// ── PROBLEM — ArrayList is NOT thread safe ──
List<Integer> list = new ArrayList<>();
// Two threads calling list.add() simultaneously → data corruption, wrong size, exceptions

// ══════════════════════════════════════════
// OPTION 1 — CopyOnWriteArrayList (read-heavy)
// ══════════════════════════════════════════
List<Integer> list = new CopyOnWriteArrayList<>();
list.add(1);   // thread safe — creates full copy of array on every write
list.get(0);   // lock-free read — very fast

// How it works internally:
// add() → copies entire array → adds to copy → replaces original
// Reads always see a consistent snapshot — never blocked

// Best when: many reads, rare writes (e.g. event listener lists, config caches)
// Cost: every write = O(n) copy → expensive if writes are frequent

// ══════════════════════════════════════════
// OPTION 2 — Collections.synchronizedList()
// ══════════════════════════════════════════
List<Integer> list = Collections.synchronizedList(new ArrayList<>());
list.add(1);   // thread safe — acquires lock before every operation
list.get(0);   // also locks — readers block writers and vice versa

// How it works internally:
// Every method wrapped with: synchronized(mutex) { ... }
// One thread at a time — others wait

// Best when: equal mix of reads and writes
// Cost: every read AND write acquires lock → higher contention

// ⚠️ Iteration must be manually synchronized:
synchronized (list) {
    for (Integer i : list) { ... }  // without this → ConcurrentModificationException
}

// ══════════════════════════════════════════
// OPTION 3 — Vector (legacy — avoid)
// ══════════════════════════════════════════
List<Integer> list = new Vector<>();  // synchronized like option 2, but old API

// ══════════════════════════════════════════
// SAME CONCEPT — other collections
// ══════════════════════════════════════════
// HashMap  → ConcurrentHashMap       (fine-grained locking, best for maps)
// HashSet  → CopyOnWriteArraySet     (same as CopyOnWriteArrayList for sets)
// Queue    → ConcurrentLinkedQueue   (lock-free, best for producer-consumer)
// Deque    → ConcurrentLinkedDeque

Map<String, Integer> map = new ConcurrentHashMap<>();  // most common in production

// ── SUMMARY ──
// Mostly reads, rare writes  → CopyOnWriteArrayList
// Frequent reads + writes    → Collections.synchronizedList()
// Map                        → ConcurrentHashMap (always prefer over synchronizedMap)
// Never use                  → Vector, Hashtable (legacy, outdated)`,
    },
    {
      name: 'Pattern 13 — Race Condition & Critical Section',
      icon: '⚠️',
      when: 'Two or more threads access shared mutable data simultaneously',
      gaonKiBaat: 'Race condition = do log ek hi cheez ko ek saath pakadne ki koshish kar rahe hain. Jaise do log ek hi last samosa uthane ki koshish karein — dono check karte hain "samosa hai?" haan — dono uthate hain — result galat. Critical section = woh code jo shared data touch karta hai, wahan pe only ek hi thread ek time pe honi chahiye.',
      problems: ['Interview: "What is a race condition?"', 'Interview: "What is a critical section?"', 'Interview: "What is a dirty read?"'],
      template: `// PROBLEM — two threads share Value.x
// Thread-1: reads x=5, adds 1 → wants to write 6
// Thread-2: reads x=5 (STALE!), adds 1 → writes 6
// Result: x=6 instead of 7 → dirty read

// Critical section = code that accesses shared mutable state
// Must be protected so only ONE thread runs it at a time

public class Value { public int x = 0; }

// Race condition — NO protection
public class Adder implements Callable<Void> {
    private Value v;
    public Void call() {
        for (int i = 1; i <= 100; i++) {
            v.x = v.x + 1;  // ← critical section — NOT protected
        }
        return null;
    }
}

// After running Adder + Subtracter concurrently:
// Expected: v.x = 0
// Actual: v.x = some random number (race condition)`,
    },
    {
      name: 'Pattern 14 — ReentrantLock (Explicit Lock)',
      icon: '🔐',
      when: 'Need explicit control over locking — must protect critical section manually',
      gaonKiBaat: 'ReentrantLock = ek physical lock aur key. Jab thread andar jaana chahti hai, pehle lock.lock() se key leti hai. Kaam karne ke baad lock.unlock() se key wapis rakh deti hai. Agar koi aur thread key pakde hua hai, baaki threads Entry Set mein wait karti hain.',
      problems: ['Interview: "What is a mutex?"', 'Interview: "What is ReentrantLock?"', 'Interview: "What is the Entry Set?"'],
      template: `import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

Lock lock = new ReentrantLock();

public class Adder implements Callable<Void> {
    private Value v;
    private Lock lock;

    public Void call() {
        for (int i = 1; i <= 100; i++) {
            lock.lock();           // acquire lock — others blocked here
            try {
                v.x = v.x + 1;    // critical section — safe now
            } finally {
                lock.unlock();     // ALWAYS unlock in finally — never forget!
            }
        }
        return null;
    }
}

// ⚠️ DANGER — if you forget unlock():
lock.lock();
v.x = v.x + 1;
// exception here → unlock() never called → DEADLOCK!
// All other threads wait forever in Entry Set

// Fix: always use try-finally with ReentrantLock
// Or use synchronized (auto-unlocks even on exception)

// Entry Set = where BLOCKED threads wait when lock is taken
// When lock released → one thread from Entry Set gets the lock`,
    },
    {
      name: 'Pattern 15 — synchronized Block',
      icon: '🔒',
      when: 'Protect only part of a method — auto-locks and auto-unlocks on any object',
      gaonKiBaat: 'synchronized block = ReentrantLock ka safe version. Lock khud lagata hai, khud kholata hai — bhulne ka chance nahi. Aur tum choose karte ho kaunse object pe lock lagana hai.',
      problems: ['Interview: "synchronized block vs ReentrantLock?"', 'Interview: "What object does synchronized lock on?"'],
      template: `// synchronized block — auto lock/unlock on chosen object
public class AdderSync implements Callable<Void> {
    private Value v;

    public Void call() {
        for (int i = 1; i <= 100; i++) {
            synchronized (v) {      // locks the object 'v'
                v.x = v.x + 1;     // only ONE thread here at a time
            }                       // auto-unlocked here, even on exception
        }
        return null;
    }
}

// Key differences vs ReentrantLock:
// ✅ Auto-unlocks — impossible to forget (no deadlock from forgetting)
// ✅ Simpler syntax
// ❌ Less flexible — no tryLock(), no timeout, no condition variables

// Lock object can be anything:
synchronized (this)    { }  // lock on current object
synchronized (v)       { }  // lock on shared object v
synchronized (MyClass.class) { }  // lock on class (for static data)

// Both threads must lock on SAME object to be mutually exclusive:
// Thread-1: synchronized(v) → acquires lock on v
// Thread-2: synchronized(v) → BLOCKED until Thread-1 releases`,
    },
    {
      name: 'Pattern 16 — synchronized Method',
      icon: '🛡️',
      when: 'Entire method accesses shared state — lock on this (the instance)',
      gaonKiBaat: 'synchronized method = class apni data khud protect karti hai. Bank ki tarah — tum account access karte ho, bank ke andar lock laga hua hai. Tumhe bahar se lock nahi laana padta.',
      problems: ['Interview: "synchronized method vs synchronized block?"', 'Interview: "What does synchronized method lock on?"', 'Interview: "What is encapsulation of synchronization?"'],
      template: `// synchronized method — locks on 'this' (the instance)
public class Value2 {
    private int x;  // private! caller cannot bypass the lock

    public synchronized void increment() {
        x = x + 1;  // equivalent to: synchronized(this) { x = x + 1; }
    }

    public synchronized void decrement() {
        x = x - 1;
    }

    public int getX() { return x; }  // safe to read after threads finish
}

// Callers need NO lock — Value2 protects itself:
public class AdderSyncMethod implements Callable<Void> {
    private Value2 v;
    public Void call() {
        for (int i = 1; i <= 100; i++) {
            v.increment();  // no synchronized here — lock is inside Value2
        }
        return null;
    }
}

// WHY private x matters:
// If x were public, caller could do: v.x = v.x + 1 (bypasses lock!)
// private forces all access through synchronized methods

// Static synchronized method → locks on Class object (Value2.class)
// Used when shared data is static (belongs to class, not instance)
public static synchronized void staticMethod() {
    // locks Value2.class — all instances affected
}`,
    },
    {
      name: 'Pattern 17 — Producer-Consumer Problem',
      icon: '🏭',
      when: 'One set of threads produces data, another set consumes it — shared buffer/queue',
      gaonKiBaat: 'Producer-Consumer = chef aur waiter. Chef (producer) dishes banata hai aur counter pe rakhta hai. Waiter (consumer) counter se dish uthata hai aur deliver karta hai. Counter ki limit hai — chef wait karta hai agar counter full ho, waiter wait karta hai agar counter empty ho.',
      problems: ['Interview: "What is the Producer-Consumer problem?"', 'Interview: "submit() vs execute() for exception visibility?"', 'Interview: "What is busy waiting?"'],
      template: `// Shared Store (the buffer/queue)
public class Store {
    private List<Integer> items = new ArrayList<>();
    private int maxStoreSize;

    // Problem WITHOUT synchronization:
    // Two producers both check size < max → both pass → size exceeds limit
    // Two consumers both check size > 0 → both pass → IndexOutOfBoundsException

    public synchronized void addItem(int x) {
        if (items.size() < maxStoreSize) {
            items.add(x);
        }
        // ⚠️ Busy waiting: if full, silently skips and loops back
        // Fix: use wait() instead of if-skip (Pattern 18 — Concurrency-4)
    }

    public synchronized void remove() {
        if (items.size() > 0) {
            items.remove(items.size() - 1);
        }
        // ⚠️ Busy waiting: if empty, silently skips and loops back
    }
}

// Producer — Runnable (fire-and-forget, execute() shows exceptions)
public class Publisher implements Runnable {
    private Store store;
    public void run() {
        while (true) { store.addItem(1); }
    }
}

// Consumer — Runnable
public class Consumer implements Runnable {
    private Store store;
    public void run() {
        while (true) { store.remove(); }
    }
}

// Client — CachedThreadPool (NOT fixed — infinite loops would deadlock fixed pool)
ExecutorService es = Executors.newCachedThreadPool();
Store store = new Store(10);
for (int i = 0; i < 10; i++) es.execute(new Publisher(store));
for (int i = 0; i < 15; i++) es.execute(new Consumer(store));

// submit() vs execute() for exceptions:
// submit(Callable) → exception stored in Future, hidden until .get()
// execute(Runnable) → exception printed to console immediately`,
    },
    {
      name: 'Pattern 18 — Semaphore (Counting Semaphore)',
      icon: '🚦',
      when: 'Control how many threads can enter a critical section simultaneously (N > 1)',
      gaonKiBaat: 'Semaphore = restaurant manager with N tables. Jab customer aata hai (acquire), manager check karta hai — koi table hai? Agar hai → table deta hai (counter -1). Agar nahi → please wait. Jab customer jaata hai (release) → counter +1, agle customer ko signal. Counter hi sab kuch hai.',
      problems: ['Interview: "What is a semaphore?"', 'Interview: "Semaphore vs Mutex?"', 'LeetCode 1226: Dining Philosophers'],
      template: `import java.util.concurrent.Semaphore;

// Semaphore = counter with two operations:
// acquire() → counter - 1 (blocks if counter = 0)
// release() → counter + 1 (wakes a waiting thread)

Semaphore s = new Semaphore(4); // 4 threads allowed simultaneously

// Thread entering critical section:
s.acquire(); // counter: 4 → 3
try {
    // do work — up to 4 threads here at once
} finally {
    s.release(); // counter: 3 → 4
}

// Semaphore(1) = Mutex — exactly one thread at a time
// Semaphore(0) = all threads block — used as a signal

// Key rule: every acquire() must have exactly ONE release()
// Double release → counter exceeds limit → IndexOutOfBoundsException
// Missing release → counter stays 0 → threads block forever → deadlock`,
    },
    {
      name: 'Pattern 19 — Producer-Consumer with Semaphore',
      icon: '🔄',
      when: 'Producers and consumers share a bounded buffer — solve without busy waiting',
      gaonKiBaat: 'Do semaphore use karte hain. publisherSema = kitni jagah baaki hai store mein. consumerSema = kitne items available hain consume karne ke liye. Publisher pehle check karta hai jagah hai? (acquire publisherSema) → add karo → consumer ko signal karo (release consumerSema). Consumer pehle check karta hai item hai? (acquire consumerSema) → remove karo → publisher ko jagah signal karo (release publisherSema).',
      problems: ['Interview: "Producer-Consumer problem"', 'Interview: "Semaphore vs synchronized for Producer-Consumer"', 'LeetCode 1188: Design Bounded Blocking Queue'],
      template: `// publisherSema(maxSize): publisher can add up to maxSize items before blocking
// consumerSema(0): consumer starts blocked — store is empty initially
Semaphore publisherSema = new Semaphore(10);
Semaphore consumerSema = new Semaphore(0);

// Publisher
public void run() {
    while (true) {
        publisherSema.acquire(); // wait if store is full
        store.addItem(1);
        consumerSema.release();  // signal consumer: item is ready
    }
}

// Consumer
public void run() {
    while (true) {
        consumerSema.acquire(); // wait if store is empty
        store.removeItem();
        publisherSema.release(); // signal publisher: slot is free
    }
}

// Store — MUST protect ArrayList with lock (Semaphore controls count, not thread safety)
private Lock lock = new ReentrantLock();

public void addItem(int item) {
    lock.lock();
    try {
        if (items.size() < maxStoreSize) { items.add(item); }
    } finally { lock.unlock(); }
}

// ⚠️ ArrayList is NOT thread-safe — multiple producers hitting it simultaneously
// causes race conditions even with Semaphore controlling flow
// Fix: synchronize the Store methods (synchronized or ReentrantLock)`,
    },
    {
      name: 'Pattern 20 — Mutex vs Semaphore (Ownership)',
      icon: '🔑',
      when: 'Choosing between mutual exclusion (Mutex) and signaling between threads (Semaphore)',
      gaonKiBaat: 'Mutex = apni chabi. Jo lock kare wahi unlock kare. Agar Thread-A ne lock kiya, Thread-B unlock nahi kar sakti. Semaphore = shared signal. Koi bhi release() call kar sakta hai — ownership nahi hoti. Isliye Producer-Consumer mein semaphore use karte hain — publisher signal deta hai consumer ko, consumer signal deta hai publisher ko.',
      problems: ['Interview: "Mutex vs Semaphore"', 'Interview: "What is ownership in locks?"', 'Interview: "When to use synchronized vs ReentrantLock?"'],
      template: `// MUTEX — has ownership
// Thread that acquired MUST be the one to release
// ReentrantLock enforces this in Java
Lock mutex = new ReentrantLock();
mutex.lock();   // Thread-A acquires
mutex.unlock(); // Thread-A MUST release — Thread-B cannot

// BINARY SEMAPHORE — no ownership
// Any thread can release(), regardless of who acquired
Semaphore binarySema = new Semaphore(1); // behaves like mutex but NO ownership
binarySema.acquire(); // Thread-A acquires
binarySema.release(); // Thread-B can release — valid!

// This is exactly Producer-Consumer:
// Publisher acquires publisherSema, Consumer releases publisherSema
// Different threads — only works with Semaphore, not Mutex

// ── synchronized vs ReentrantLock ──
// Use synchronized when:   simple mutual exclusion, less boilerplate
// Use ReentrantLock when:  need fairness (true), tryLock(), timeout, multiple conditions

Lock fairLock = new ReentrantLock(true);  // fair — threads get lock in order they waited
lock.tryLock(5, TimeUnit.SECONDS);        // attempt with timeout — avoid indefinite blocking

// Rule: lock.lock() BEFORE try block — not inside
lock.lock();       // ← correct position
try { ... }
finally { lock.unlock(); }`,
    },
    {
      name: 'Pattern 21 — ZeroOddEven (3 threads, coordinated output)',
      icon: '0️⃣',
      when: 'Print 0 1 0 2 0 3 ... 0 N using 3 threads: zeroThread, oddThread, evenThread',
      gaonKiBaat: 'Teen dost hain — Zero, Odd, Even. Zero pehle jaata hai, ek baar 0 likhta hai, phir decide karta hai — agli baari odd ki hai ya even ki? Signal deta hai unhe. Jiska signal aaya woh aata hai, apna number likhta hai, aur Zero ko wapas jaane deta hai.',
      problems: [
        'ARRISE R2 confirmed: Print 0,1,0,2,0,3... using 3 threads',
        'LeetCode 1116: Print Zero Even Odd',
        'Interview: "How do you coordinate 3 threads for ordered output?"',
      ],
      template: `// 3 semaphores — one per thread
// zeroSema(1) = zero thread starts first (open)
// oddSema(0)  = odd thread blocked until zero signals it
// evenSema(0) = even thread blocked until zero signals it

Semaphore zeroSema = new Semaphore(1);
Semaphore oddSema  = new Semaphore(0);
Semaphore evenSema = new Semaphore(0);

// Thread 1 — printZero
for (int i = 1; i <= n; i++) {
    zeroSema.acquire();       // wait for my turn
    System.out.print("0 ");
    if (i % 2 == 1) oddSema.release();   // next number is odd → signal odd thread
    else            evenSema.release();  // next number is even → signal even thread
}

// Thread 2 — printOdd
for (int i = 1; i <= n; i += 2) {
    oddSema.acquire();        // wait for zero to signal me
    System.out.print(i + " ");
    zeroSema.release();       // signal zero to print next 0
}

// Thread 3 — printEven
for (int i = 2; i <= n; i += 2) {
    evenSema.acquire();       // wait for zero to signal me
    System.out.print(i + " ");
    zeroSema.release();       // signal zero to print next 0
}

// Client — 3 tasks submitted to a 3-thread pool
ExecutorService es = Executors.newFixedThreadPool(3);
ZeroOddEven zoe = new ZeroOddEven(6);
es.submit(() -> zoe.printZero());
es.submit(() -> zoe.printOdd());
es.submit(() -> zoe.printEven());
es.shutdown();

// Output: 0 1 0 2 0 3 0 4 0 5 0 6`,
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
    {
      rule: 'Race condition = check-then-act is not atomic',
      tag: 'gotcha',
      detail: 'Thread-1 checks size < max (true), context switch happens, Thread-2 also checks (true), both add → size exceeds limit. The check and the act must be atomic — use synchronized.',
    },
    {
      rule: 'Critical section must be protected — only one thread at a time',
      tag: 'key',
      detail: 'Critical section = any code that reads or writes shared mutable state. Without protection, two threads can interleave their reads/writes and corrupt data (dirty read).',
    },
    {
      rule: 'ReentrantLock: always unlock in finally — or use synchronized',
      tag: 'gotcha',
      detail: 'If an exception occurs between lock() and unlock(), the lock is never released — all other threads wait forever (deadlock). Use try-finally, or switch to synchronized which auto-unlocks.',
    },
    {
      rule: 'synchronized method locks on this; static synchronized locks on Class object',
      tag: 'key',
      detail: 'Instance synchronized method → locks the specific object (v). Static synchronized method → locks Value.class — affects ALL instances. Use static synchronized only when shared data is static.',
    },
    {
      rule: 'Make shared data private when using synchronized methods',
      tag: 'gotcha',
      detail: 'If x is public, a caller can do v.x = v.x + 1 directly — bypassing the lock entirely. private forces all access through the synchronized methods, guaranteeing protection.',
    },
    {
      rule: 'synchronized solves race condition but causes busy waiting when condition fails',
      tag: 'gotcha',
      detail: 'With an if-guard inside synchronized, a thread that fails the check releases the lock and immediately loops back — spinning in a tight loop. Threads waste CPU. Fix: use wait/notify (Concurrency-4).',
    },
    {
      rule: 'Use CachedThreadPool for Producer-Consumer — never FixedThreadPool with infinite loops',
      tag: 'gotcha',
      detail: 'FixedThreadPool with infinite-loop tasks fills all threads permanently. New tasks queue up forever — deadlock. CachedThreadPool creates threads on demand, so infinite-loop tasks do not block new tasks.',
    },
    {
      rule: 'execute() shows exceptions immediately; submit() hides them inside Future',
      tag: 'key',
      detail: 'execute(Runnable) → uncaught exception handler prints to console. submit(Callable/Runnable) → exception stored silently in Future, only thrown when you call future.get(). If you never call get(), exception disappears.',
    },
    {
      rule: 'Lock only works when multiple threads share the SAME object instance',
      tag: 'gotcha',
      detail: 'If each thread creates its own instance, there is no shared state — locks do nothing. ReservationSystem must be a singleton so all threads hit the same availableSeats. Lock protects shared state; if state is not shared, there is nothing to protect.',
    },
    {
      rule: 'synchronized can be applied to both instance methods and static methods',
      tag: 'key',
      detail: 'Instance synchronized → locks on this (the specific object). Static synchronized → locks on ClassName.class (one lock for ALL instances). Use static synchronized when shared data is a static variable.',
    },
    {
      rule: 'Use static synchronized for app-wide shared counters — live viewers, total bookings, flash sale stock',
      tag: 'key',
      detail: 'Static data belongs to the class, not any one instance. Examples: total users online, total items sold in a flash sale, total trades executed today. If this were instance data, each object would have its own copy — no sharing, no protection needed.',
    },
    {
      rule: 'Fine-grained locking (per resource) is faster than coarse-grained (one global lock)',
      tag: 'key',
      detail: 'Train booking: lock per seat type (1AC, 2AC) → 1AC and 2AC bookings run simultaneously. One global lock → all bookings serialized even for unrelated seat types. ConcurrentHashMap uses segment-level locking for the same reason.',
    },
    {
      rule: 'Non-synchronized methods ignore all locks — they always run freely',
      tag: 'gotcha',
      detail: 'synchronized(obj) only blocks other threads trying to enter synchronized methods/blocks on the same obj. A non-synchronized method on the same object runs without any lock check — even if another thread holds the lock on that object.',
    },
    {
      rule: 'Two threads on DIFFERENT objects never block each other — each object has its own lock',
      tag: 'key',
      detail: 'obj1.fun1() locks obj1. obj2.fun1() locks obj2. Different objects = different locks = no blocking. This is why singleton matters for locking — you need the SAME object to be shared.',
    },
    {
      rule: 'Semaphore is a counter — acquire() decrements, release() increments',
      tag: 'key',
      detail: 'new Semaphore(N) → N threads allowed simultaneously. acquire() blocks when counter = 0. release() wakes a waiting thread. Semaphore(1) = Mutex. Semaphore(0) = signal — all threads block until release() is called.',
    },
    {
      rule: 'Double release() causes IndexOutOfBoundsException; missing release() causes deadlock',
      tag: 'gotcha',
      detail: 'Every acquire() must have exactly ONE corresponding release(). Double release → counter exceeds store limit → more threads enter than allowed → list overflow. Missing release → counter stays 0 → waiting thread blocks forever → deadlock.',
    },
    {
      rule: 'Semaphore controls concurrency count — it does NOT make data structures thread-safe',
      tag: 'gotcha',
      detail: 'Semaphore controls HOW MANY threads enter. ArrayList is still not thread-safe — multiple producers can simultaneously call items.add() causing corruption. Always protect the data structure separately with synchronized or ReentrantLock.',
    },
    {
      rule: 'Mutex has ownership — only the locker can unlock. Semaphore has no ownership — any thread can release.',
      tag: 'key',
      detail: 'ReentrantLock (Mutex): Thread-A locks → only Thread-A can unlock. Semaphore: Thread-A acquires → Thread-B can release. Producer-Consumer relies on this — Publisher signals Consumer by releasing consumerSema even though Publisher never acquired it.',
    },
    {
      rule: 'Internal lock is correct when one class owns the data; external lock when multiple classes share a critical section',
      tag: 'key',
      detail: 'Store owns the ArrayList → internal ReentrantLock is correct. All Publisher/Consumer threads call Store methods on the SAME Store instance → they all compete on the same internal lock. External lock needed only when multiple classes must synchronize on a shared resource they all hold a reference to.',
    },
    {
      rule: 'Use synchronized for simple cases; use ReentrantLock for fairness, tryLock, timeout, or multiple conditions',
      tag: 'key',
      detail: 'synchronized: less code, auto-unlocks on exception. ReentrantLock: new ReentrantLock(true) for fairness, tryLock() to avoid indefinite blocking, newCondition() for wait/notify equivalent. Start with synchronized — upgrade to ReentrantLock only when you need the extra features.',
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
    { problem: 'lock.lock() / lock.unlock()', tc: 'O(1)', sc: 'O(1)', note: 'Atomic CAS operation; threads not getting lock go to Entry Set (BLOCKED state)' },
    { problem: 'synchronized block/method', tc: 'O(1)', sc: 'O(1)', note: 'Same as ReentrantLock internally; JVM uses monitorenter/monitorexit bytecode' },
    { problem: 'Producer-Consumer (N producers, M consumers)', tc: 'O(1) per op', sc: 'O(capacity)', note: 'Each add/remove is O(1); store capacity bounds memory; throughput limited by lock contention' },
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
    {
      q: 'synchronized keyword can be applied to which of the following?',
      options: [
        'Instance methods only',
        'Static methods only',
        'Both instance methods and static methods',
        'It cannot be used in multithreaded applications',
      ],
      answer: 2,
      explanation: 'synchronized can be applied to instance methods (locks on this), static methods (locks on ClassName.class), and blocks (locks on any object you choose). It is the core tool for thread safety in Java.',
    },
    {
      q: 'obj1.fun1() and obj2.fun1() are both synchronized. Can they run concurrently?',
      options: [
        'No — synchronized methods can never run concurrently',
        'Yes — they lock on different objects (obj1 vs obj2) so they do not block each other',
        'No — they share the same class-level lock',
        'Yes — but only if they are static methods',
      ],
      answer: 1,
      explanation: 'Instance synchronized methods lock on "this" — the specific object instance. obj1.fun1() locks obj1; obj2.fun1() locks obj2. Different objects = different locks = no blocking. Only threads on the SAME object block each other.',
    },
    {
      q: 'A non-synchronized method fun3() exists on obj2. Can it run while another thread holds the lock on obj2?',
      options: [
        'No — if obj2 is locked, no method can run on it',
        'Yes — non-synchronized methods never acquire a lock and always run freely',
        'Only if fun3() is static',
        'Only if the lock is a ReentrantLock, not synchronized',
      ],
      answer: 1,
      explanation: 'synchronized lock is only enforced when entering a synchronized method/block. Non-synchronized methods completely ignore all locks — they run freely regardless of what other threads are doing. This is why private data matters — public fields bypass the lock entirely.',
    },
    {
      q: 'You have a flash sale with 1000 items. When should you use static synchronized?',
      options: [
        'Never — use instance synchronized always',
        'When the item count is per-user (instance variable)',
        'When the item count is shared across the entire application (static variable)',
        'static synchronized is not needed — regular synchronized is enough',
      ],
      answer: 2,
      explanation: 'Flash sale stock is one number for the entire app — belongs to the class, not any instance. If it were an instance variable, each object would have its own 1000 — overselling guaranteed. static synchronized locks ClassName.class, protecting the single shared static counter.',
    },
    {
      q: 'Two threads: Thread-1 books 1AC, Thread-2 books 2AC. With per-seat-type locks, what happens?',
      options: [
        'Thread-2 waits for Thread-1 to finish — one global lock',
        'Both run simultaneously — 1AC and 2AC have separate locks',
        'Both crash — cannot have multiple locks',
        'Thread-1 always runs first — locks are sequential',
      ],
      answer: 1,
      explanation: 'Per-seat-type locking: Thread-1 acquires the 1AC lock, Thread-2 acquires the 2AC lock — completely independent. They run simultaneously. Only two threads booking the SAME seat type block each other. This is fine-grained locking — better throughput than one global lock.',
    },
    {
      q: 'Two threads both read x=5 and both add 1. What is the final value of x?',
      options: [
        '7 — both additions are applied',
        '6 — one addition is lost due to race condition',
        '5 — no change because threads cancelled each other',
        'Depends on OS — could be 6 or 7',
      ],
      answer: 1,
      explanation: 'Race condition: Thread-1 reads x=5, Thread-2 reads x=5 (stale), Thread-1 writes 6, Thread-2 writes 6. One increment is lost. Final x=6 not 7. This is a dirty read caused by non-atomic read-modify-write.',
    },
    {
      q: 'What is the Entry Set in the context of locks?',
      options: [
        'A list of threads that have finished execution',
        'The queue where BLOCKED threads wait when another thread holds the lock',
        'A list of all methods marked as synchronized',
        'The thread pool task queue',
      ],
      answer: 1,
      explanation: 'When a thread tries to acquire a lock that is already held, it moves to the Entry Set (BLOCKED state). When the lock is released, one thread from the Entry Set is chosen to acquire it.',
    },
    {
      q: 'What happens if you forget lock.unlock() and an exception occurs inside the critical section?',
      options: [
        'The JVM automatically releases the lock',
        'The program terminates immediately',
        'The lock is never released — all other threads wait forever (deadlock)',
        'The exception is silently swallowed',
      ],
      answer: 2,
      explanation: 'ReentrantLock does NOT auto-release on exception. If unlock() is skipped, the lock stays acquired forever — other threads in the Entry Set wait indefinitely = deadlock. Always use try-finally: lock.lock(); try { ... } finally { lock.unlock(); }',
    },
    {
      q: 'synchronized method vs synchronized block — which locks on "this"?',
      options: [
        'synchronized block always locks on this',
        'synchronized method locks on this; synchronized block locks on whatever object you specify',
        'Both always lock on this',
        'Neither — they use a separate hidden lock',
      ],
      answer: 1,
      explanation: 'synchronized method → equivalent to synchronized(this) { entire method }. synchronized block → you choose the lock object: synchronized(v), synchronized(this), synchronized(MyClass.class), etc. Block gives more flexibility.',
    },
    {
      q: 'Why must x be private when using synchronized methods to protect it?',
      options: [
        'Private fields run faster than public fields',
        'synchronized only works on private fields',
        'If x is public, callers can do v.x++ directly — bypassing the synchronized method and the lock',
        'No reason — private vs public does not matter for synchronization',
      ],
      answer: 2,
      explanation: 'synchronized methods protect access through those methods. But if x is public, any caller can write v.x = v.x + 1 directly — this is NOT synchronized. Making x private forces all access through the protected methods.',
    },
    {
      q: 'You have 5 Publishers and 5 Consumers with newFixedThreadPool(5). Publishers have while(true) loops. What happens?',
      options: [
        'All 10 tasks run concurrently — no problem',
        'Publishers fill all 5 threads forever — Consumers never get a thread (deadlock)',
        'FixedThreadPool automatically creates more threads when needed',
        'Consumers run first, then Publishers',
      ],
      answer: 1,
      explanation: '5 Publishers with infinite loops fill all 5 threads permanently. Consumers are submitted to the task queue but no thread ever becomes free to pick them up — deadlock. Use CachedThreadPool for Producer-Consumer with infinite loops.',
    },
    {
      q: 'new Semaphore(0) — what happens when a thread calls acquire()?',
      options: [
        'Thread runs immediately — 0 means unlimited',
        'Thread blocks immediately — counter is 0, nothing to acquire',
        'Thread throws InterruptedException',
        'Thread acquires and counter goes to -1',
      ],
      answer: 1,
      explanation: 'Semaphore(0) means counter = 0. acquire() blocks when counter = 0 — thread waits until another thread calls release(). This is used in Producer-Consumer for consumerSema — Consumer starts blocked until Publisher adds an item and calls consumerSema.release().',
    },
    {
      q: 'Publisher calls consumerSema.release() twice after adding one item. What happens?',
      options: [
        'Nothing — release() is always safe to call multiple times',
        'Consumer runs twice for one item — can cause IndexOutOfBoundsException on remove',
        'Deadlock — semaphore counter overflows',
        'Second release() is ignored automatically',
      ],
      answer: 1,
      explanation: 'Double release() increments consumerSema counter by 2. Consumer can now acquire twice — trying to remove 2 items when only 1 was added. Second remove on empty list → IndexOutOfBoundsException. Rule: every acquire() must have exactly ONE corresponding release().',
    },
    {
      q: 'You use Semaphore(5) with 5 Publisher threads. The Store uses ArrayList without synchronization. What can go wrong?',
      options: [
        'Nothing — Semaphore guarantees thread safety',
        'All 5 publishers can call items.add() simultaneously — ArrayList corruption or wrong size',
        'Semaphore automatically synchronizes ArrayList operations',
        'Only 1 publisher runs at a time — no issue',
      ],
      answer: 1,
      explanation: 'Semaphore controls HOW MANY threads enter — it does NOT protect the ArrayList. All 5 publishers can simultaneously call items.add() on a non-thread-safe ArrayList → ConcurrentModificationException or corrupted state. Fix: use synchronized or ReentrantLock on Store methods separately.',
    },
    {
      q: 'Which statement about Mutex vs Semaphore ownership is correct?',
      options: [
        'Both Mutex and Semaphore require the same thread to acquire and release',
        'Mutex has ownership — only the locker can unlock. Semaphore has no ownership — any thread can release.',
        'Semaphore has ownership; Mutex does not',
        'Ownership only matters for static synchronized methods',
      ],
      answer: 1,
      explanation: 'Mutex (ReentrantLock): Thread-A locks → only Thread-A can unlock. Semaphore: Thread-A acquires → Thread-B can release — perfectly valid. Producer-Consumer relies on this: Publisher releases consumerSema to signal Consumer, even though Publisher never acquired consumerSema.',
    },
    {
      q: 'When should you use ReentrantLock instead of synchronized?',
      options: [
        'Always — ReentrantLock is strictly better',
        'Never — synchronized is always sufficient',
        'When you need fairness, tryLock(), timeout, or multiple conditions',
        'Only when working with static methods',
      ],
      answer: 2,
      explanation: 'synchronized is simpler and auto-unlocks on exception — prefer it for basic mutual exclusion. Switch to ReentrantLock when you need: new ReentrantLock(true) for fairness (threads get lock in order they waited), tryLock() to avoid blocking, tryLock(timeout) for bounded wait, or newCondition() for multiple wait sets.',
    },
    {
      q: 'FooBar problem: acquire() and release() are placed OUTSIDE the loop. n=2. What is the output?',
      options: [
        '"foobarfoobar" — correct alternation',
        '"foofoobarbar" — all foo printed first, then all bar',
        'Deadlock — threads block forever',
        'Random order — no guarantee',
      ],
      answer: 1,
      explanation: 'If acquire/release are outside the loop, foo prints all n times first, then releases barSema once, then bar prints all n times. Output: "foofoobarbar". To get "foobarfoobar", acquire/release must be INSIDE the loop — enforcing alternation every single iteration.',
    },
    {
      q: 'oxygenSema.acquire(2) — what happens if only 1 permit is available?',
      options: [
        'Acquires 1 permit and proceeds with partial acquisition',
        'Throws IllegalArgumentException',
        'Blocks until 2 permits are available — atomic, all-or-nothing',
        'Acquires 1 and spins waiting for the second',
      ],
      answer: 2,
      explanation: 'acquire(N) is atomic — it waits until ALL N permits are available before acquiring any. If only 1 permit is available when you need 2, the thread blocks until the second permit is released. This is why oxygenSema.acquire(2) correctly waits for BOTH hydrogen threads to signal before oxygen proceeds.',
    },
    {
      q: 'How many semaphores are needed to enforce ordering of N methods (method1 → method2 → ... → methodN)?',
      options: [
        'N semaphores — one per method',
        'N-1 semaphores — first method runs freely, each subsequent waits for previous',
        '1 semaphore — shared across all methods',
        '2 semaphores — one for odd methods, one for even methods',
      ],
      answer: 1,
      explanation: 'N-1 semaphores. The first method needs no semaphore — it runs freely and signals the next. Each subsequent method acquires one semaphore (waits for previous) and releases the next. Last method only acquires, never releases. Pattern: N methods → N-1 signal semaphores, all initialized to 0.',
    },
    {
      q: 'Producer-Consumer: publisherSema(10), consumerSema(0). Publisher forgets to call consumerSema.release() after adding. What happens?',
      options: [
        'Consumer runs freely — consumerSema is not needed',
        'Consumer blocks forever on consumerSema.acquire() — deadlock',
        'IndexOutOfBoundsException on the store',
        'Publisher blocks after adding 10 items',
      ],
      answer: 1,
      explanation: 'consumerSema starts at 0. Consumer calls consumerSema.acquire() → blocks immediately (count=0). Publisher adds items but never calls consumerSema.release() → consumerSema stays 0 forever → Consumer never wakes up → deadlock. Missing release() = thread blocked forever.',
    },
    {
      q: 'Semaphore(1) vs ReentrantLock — which one allows Thread-B to release what Thread-A acquired?',
      options: [
        'ReentrantLock — it has no ownership',
        'Semaphore(1) — it has no ownership, any thread can call release()',
        'Both allow cross-thread release',
        'Neither — ownership is always enforced in Java',
      ],
      answer: 1,
      explanation: 'Semaphore has NO ownership — any thread can call release() regardless of who called acquire(). ReentrantLock (Mutex) has ownership — only the thread that called lock() can call unlock(). This is why Producer-Consumer uses Semaphore: Publisher releases consumerSema even though it never acquired it.',
    },
    {
      q: 'ZeroOddEven problem: 3 semaphores — zeroSema(1), oddSema(0), evenSema(0). Why is zeroSema initialized to 1?',
      options: [
        'Because zero thread prints the number 1 first',
        'Because zero thread must go first — initializing to 1 means it starts open (no waiting)',
        'Because there is only 1 zero in the sequence',
        'To allow 1 odd thread and 1 even thread to run simultaneously',
      ],
      answer: 1,
      explanation: 'Semaphore(1) = open — acquire() succeeds immediately without blocking. Semaphore(0) = blocked — acquire() waits until someone calls release(). Zero thread must print first, so zeroSema=1. Odd and even threads must wait for zero to signal them, so oddSema=0 and evenSema=0. Rule: whoever goes first gets 1, everyone else gets 0.',
    },
    {
      q: 'In ZeroOddEven, printZero() releases oddSema or evenSema based on i%2. What does printOdd() do after printing?',
      options: [
        'Releases oddSema to allow the next odd number',
        'Releases evenSema to allow the next even number',
        'Releases zeroSema to allow zero thread to print the next 0',
        'Acquires zeroSema to block zero thread',
      ],
      answer: 2,
      explanation: 'After printing an odd number, printOdd() calls zeroSema.release() — this signals the zero thread to go again and print the next 0. The flow is: zero prints 0 → signals odd/even → odd/even prints → signals zero → repeat. Every thread returns control back to zero.',
    },
    {
      q: 'ZeroOddEven: printZero() calls oddSema.acquire() inside its loop. What happens?',
      options: [
        'Works correctly — zero thread handles everything',
        'Deadlock — zero thread acquires zeroSema AND tries to acquire oddSema which starts at 0, blocking itself forever',
        'Works but output order is wrong',
        'oddSema starts at 0 so it just skips the acquire',
      ],
      answer: 1,
      explanation: 'Classic deadlock bug. printZero() acquires zeroSema (fine), then calls oddSema.acquire() — but oddSema=0 and nobody releases it (the oddThread is separate and waiting). Zero thread blocks itself forever. Rule: printZero() should only RELEASE oddSema/evenSema, never acquire them. The acquire belongs in printOdd()/printEven().',
    },
    {
      q: 'How many semaphores are needed for ZeroOddEven (3 threads: zero, odd, even)?',
      options: [
        '1 semaphore — shared across all 3 threads',
        '2 semaphores — one for zero, one shared for odd/even',
        '3 semaphores — one per thread (zeroSema, oddSema, evenSema)',
        '6 semaphores — one acquire + one release per thread',
      ],
      answer: 2,
      explanation: '3 semaphores — one per thread. Each thread has exactly one waiting point: zero waits on zeroSema, odd waits on oddSema, even waits on evenSema. Rule: number of semaphores = number of distinct waiting points. Initial values: whoever goes first = 1, rest = 0.',
    },
    {
      q: 'ZeroOddEven uses ExecutorService with newFixedThreadPool(3). What happens if you use newFixedThreadPool(1) instead?',
      options: [
        'Works correctly — semaphores handle the ordering',
        'Deadlock — single thread runs printZero(), blocks on oddSema.release() waiting for printOdd() which never starts',
        'Works but slower — tasks run sequentially',
        'Prints only zeros — odd and even tasks are rejected',
      ],
      answer: 1,
      explanation: 'Deadlock. With 1 thread: printZero() runs, prints 0, calls oddSema.release() — fine so far. But printOdd() is queued and never starts because the only thread is busy running printZero(). printZero() loops back and calls zeroSema.acquire() — which blocks because nobody released it. Single thread = all 3 methods compete for the same thread = deadlock. Always use newFixedThreadPool(3) for 3 concurrent tasks.',
    },
    {
      q: 'What is the difference between ZeroOddEven (task class) and the Runnable wrappers (ZeroPrinter, OddPrinter, EvenPrinter)?',
      options: [
        'ZeroOddEven is the task — it implements Runnable and is submitted to ExecutorService',
        'ZeroOddEven holds business logic and shared state; Runnable wrappers are the actual tasks submitted to ExecutorService',
        'They are the same thing — ZeroOddEven can be used directly with es.submit()',
        'Runnable wrappers hold the semaphores; ZeroOddEven only prints',
      ],
      answer: 1,
      explanation: 'ZeroOddEven = plain class with business logic (semaphores + print methods). It has no idea about threads. Runnable wrappers = tasks that say "when a thread picks me up, call this method on zoe". The lambda () -> zoe.printZero() IS a Runnable — compiler creates an anonymous Runnable from it. Separation: business logic in ZeroOddEven, threading concern in Runnable/lambda.',
    },
    {
      q: 'es.submit(() -> zoe.printZero()) — the lambda implements which interface?',
      options: [
        'Callable — because it returns a Future',
        'Runnable — because printZero() returns void, so the lambda has no return value',
        'Thread — because it runs on a thread',
        'Supplier — because it supplies work to the executor',
      ],
      answer: 1,
      explanation: 'printZero() returns void → lambda has no return value → compiler infers Runnable (not Callable). es.submit(Runnable) returns Future<?> but the Future holds no result — calling get() just blocks until the task finishes. If printZero() returned a value, the lambda would be inferred as Callable.',
    },
    {
      q: 'Why do ZeroPrinter, OddPrinter, EvenPrinter all receive the same zoe object in their constructor?',
      options: [
        'To avoid creating multiple ZeroOddEven objects which is expensive',
        'So all 3 threads share the same semaphores — without the same zoe, each thread would have its own semaphores and coordination would break',
        'Because Java requires the same object to be passed to all Runnables',
        'To allow threads to call each other\'s methods directly',
      ],
      answer: 1,
      explanation: 'Semaphores live inside zoe. If each Runnable had its own ZeroOddEven instance, each would have its own independent semaphores — Thread-1 releasing oddSema would not wake Thread-2 waiting on a different oddSema. Shared object = shared semaphores = working coordination. This is the core principle: shared mutable state must live in ONE place accessible to all threads.',
    },

    // ── SCENARIO-BASED / CROSS-CONCEPT ──

    {
      q: 'SCENARIO: Someone changes Semaphore zeroSema = new Semaphore(2) in ZeroOddEven. What happens?',
      options: [
        'Works correctly — more permits means faster execution',
        'Two zero threads could run simultaneously, printing "0 0" before odd/even gets a chance — output order breaks',
        'Compile error — Semaphore only accepts 0 or 1',
        'printOdd() and printEven() both get signaled at the same time',
      ],
      answer: 1,
      explanation: 'Semaphore(2) means 2 threads can acquire simultaneously. Two iterations of the printZero loop could run at once — printing "0 0" before any odd/even thread runs. The ordered interleaving breaks. Always Semaphore(1) for the thread that must run exactly once per turn.',
    },
    {
      q: 'SCENARIO: Developer creates ZeroOddEven zoe1 = new ZeroOddEven(6) for ZeroPrinter, and ZeroOddEven zoe2 = new ZeroOddEven(6) for OddPrinter. What happens?',
      options: [
        'Works correctly — both objects have the same logic',
        'Deadlock — zoe1.oddSema and zoe2.oddSema are different objects; ZeroPrinter releases zoe1.oddSema but OddPrinter is waiting on zoe2.oddSema forever',
        'Output is duplicated — prints the sequence twice',
        'Race condition — both threads print 0 at the same time',
      ],
      answer: 1,
      explanation: 'Two separate ZeroOddEven instances = two separate sets of semaphores. ZeroPrinter calls zoe1.oddSema.release() → but OddPrinter is blocked on zoe2.oddSema.acquire() → nobody releases zoe2.oddSema → OddPrinter waits forever → deadlock. Shared coordination REQUIRES the same object. This is why all Runnable wrappers receive the same zoe.',
    },
    {
      q: 'SCENARIO: n=5. printEven() loop is for(int i=2; i<=n; i+=2). How many times does printEven() actually print?',
      options: [
        '5 times — once per number',
        '3 times — prints 2, 4, and then i=6 exceeds n=5 so stops',
        '2 times — prints 2 and 4',
        '2 times — prints 2 and 4; but evenSema is acquired 3 times causing a hang',
      ],
      answer: 2,
      explanation: 'i starts at 2, increments by 2: i=2 (print), i=4 (print), i=6 (6>5, loop exits). So printEven() runs 2 times. printZero() loop runs 5 times (i=1 to 5). For i=1,3,5 it signals oddSema (3 times). For i=2,4 it signals evenSema (2 times). Counts match — no hang. Always trace the loop bounds before assuming.',
    },
    {
      q: 'CROSS: Producer-Consumer uses 2 semaphores (publisherSema, consumerSema). ZeroOddEven uses 3 semaphores. What determines the count?',
      options: [
        'Always equal to the number of threads',
        'Always equal to the number of print statements',
        'Equal to the number of distinct waiting points — one semaphore per thread that needs to be signaled',
        'Equal to the number of shared variables',
      ],
      answer: 2,
      explanation: 'Number of semaphores = number of distinct waiting points. Producer-Consumer: Publisher waits (publisherSema) + Consumer waits (consumerSema) = 2. ZeroOddEven: zero waits (zeroSema) + odd waits (oddSema) + even waits (evenSema) = 3. Not about thread count — a system with 10 threads might need only 2 semaphores if they share the same waiting logic.',
    },
    {
      q: 'SCENARIO: Developer submits only 2 tasks — printZero() and printOdd() — skips printEven(). n=4. What happens?',
      options: [
        'Prints: 0 1 0 3 — even numbers are skipped cleanly',
        'Deadlock — printZero() calls evenSema.release() for i=2,4 but nobody ever acquires evenSema, so zeroSema is never released back',
        'Works for n=3 but hangs at i=2 (first even)',
        'Prints: 0 1 0 2 0 3 0 4 but 2 and 4 are printed by printZero itself',
      ],
      answer: 1,
      explanation: 'For i=2 (even): printZero() releases evenSema → waits on zeroSema for next turn → but nobody is running printEven() to acquire evenSema and release zeroSema → zeroSema stays at 0 → printZero() blocks forever → deadlock. Missing a thread in coordinated output = guaranteed hang at the first signal that nobody consumes.',
    },
    {
      q: 'CROSS: In Producer-Consumer, publisherSema is initialized to capacity (e.g. 10). In ZeroOddEven, zeroSema is initialized to 1. Why different initial values?',
      options: [
        'They are the same concept — both represent "how many threads can start immediately"',
        'Producer-Consumer: multiple publishers can run simultaneously (up to capacity). ZeroOddEven: only 1 zero turn allowed at a time — it is strictly sequential',
        'Producer-Consumer semaphore counts items; ZeroOddEven semaphore counts threads',
        'Initial value does not matter — semaphore behavior is the same regardless',
      ],
      answer: 1,
      explanation: 'Initial value = how many threads can proceed without waiting. publisherSema(10): up to 10 publisher threads can add items before blocking — parallel writes up to capacity. zeroSema(1): exactly 1 zero-print happens per round — strictly one at a time. The initial value encodes the allowed concurrency level for that specific waiting point.',
    },
    {
      q: 'SCENARIO: Someone makes ZeroOddEven implement Runnable and overrides run() to call printZero(). They submit one ZeroOddEven object. What is wrong?',
      options: [
        'Nothing — ZeroOddEven can implement Runnable',
        'Only printZero() gets a thread — printOdd() and printEven() never run, causing deadlock at the first oddSema.release()',
        'Compile error — a class cannot implement Runnable and have other methods',
        'printOdd() and printEven() run automatically when run() completes',
      ],
      answer: 1,
      explanation: 'Runnable has one run() method. If run() only calls printZero(), then printOdd() and printEven() never get a thread. printZero() calls oddSema.release() → but no thread is waiting on oddSema → oddSema count goes to 1, loop continues → printZero() calls zeroSema.acquire() on next turn → but zeroSema was released by nobody → hang. You need 3 separate tasks (lambdas or Runnable classes) for 3 concurrent threads.',
    },
    {
      q: 'SCENARIO: Developer calls zoe.printZero(), zoe.printOdd(), zoe.printEven() sequentially in main() without any threads. What happens?',
      options: [
        'Works correctly — semaphores handle the ordering',
        'Deadlock — printZero() releases oddSema then loops and calls zeroSema.acquire(); zeroSema=0 because nobody released it (printOdd() hasn\'t run yet)',
        'Prints correctly but very slowly',
        'Race condition between the 3 method calls',
      ],
      answer: 1,
      explanation: 'Sequential calls = single thread doing everything. printZero() runs: acquires zeroSema (ok), prints 0, releases oddSema (count=1), loops back, tries zeroSema.acquire() — but zeroSema=0 (nobody released it, printOdd() hasn\'t run). Main thread blocks itself. Semaphore-based coordination REQUIRES concurrent threads — calling methods sequentially on one thread always deadlocks.',
    },
    {
      q: 'CROSS: Can you solve ZeroOddEven using synchronized + wait() + notifyAll() instead of Semaphores?',
      options: [
        'No — synchronized only allows 2 threads, not 3',
        'Yes — use a shared turn variable (ZERO/ODD/EVEN), synchronized block checks turn, wait() if not your turn, notifyAll() after printing',
        'Yes — but only if you use 3 different lock objects',
        'No — wait() and notifyAll() only work with 2 threads',
      ],
      answer: 1,
      explanation: 'Yes, wait/notifyAll works. Pattern: shared volatile int turn=0 (0=zero, 1=odd, 2=even). Each thread: synchronized(lock) { while(turn != myTurn) lock.wait(); print(); turn = next; lock.notifyAll(); }. Semaphore approach is cleaner — no shared turn variable, each thread knows its own semaphore. But wait/notifyAll is valid and tests your knowledge of the older Java concurrency model.',
    },
    {
      q: 'SCENARIO: oddSema is initialized to 1 instead of 0 in ZeroOddEven. What is the first thing that goes wrong?',
      options: [
        'Nothing — oddSema=1 just means odd thread can start immediately which is fine',
        'OddThread starts immediately and prints 1 before ZeroThread prints 0 — output becomes "1 0 2 0 3..." instead of "0 1 0 2..."',
        'Compile error — only zeroSema can be initialized to 1',
        'EvenThread is starved — it never gets a signal',
      ],
      answer: 1,
      explanation: 'oddSema(1) = oddThread is immediately unblocked. printOdd() acquires oddSema without waiting and prints 1 — BEFORE printZero() even runs. Output starts with 1 instead of 0. Rule: initial value 1 = "this thread goes first". Setting the wrong semaphore to 1 changes which thread goes first. Always trace: who should go first? That semaphore gets 1. Everyone else gets 0.',
    },

    // ── PROBLEM VARIANTS — HOW MANY SEMAPHORES? ──

    {
      q: 'PROBLEM VARIANT: Print 1 2 3 4 ... 200 using 2 threads. Thread-Odd prints 1,3,5... Thread-Even prints 2,4,6... Output must be in order 1 2 3 4... How many semaphores and initial values?',
      options: [
        '1 semaphore(1) — shared, both threads acquire and release the same one',
        '2 semaphores — oddSema(1), evenSema(0). Odd goes first, signals even, even signals odd back',
        '2 semaphores — oddSema(0), evenSema(0). Main thread releases one to start',
        '3 semaphores — same as ZeroOddEven',
      ],
      answer: 1,
      explanation: '2 semaphores. Who goes first? Odd (prints 1) → oddSema(1). Even waits → evenSema(0). Flow: oddThread acquires oddSema → prints 1 → releases evenSema. evenThread acquires evenSema → prints 2 → releases oddSema. Repeat. Compare ZeroOddEven (3 semaphores): had a separate controller thread printing 0 before each number. Here no controller — 2 threads signal each other directly. Fewer threads = fewer semaphores.',
    },
    {
      q: 'PROBLEM VARIANT: Print A B C A B C A B C... using 3 threads. Thread-A prints A, Thread-B prints B, Thread-C prints C. Always in order A→B→C→A... How many semaphores and initial values?',
      options: [
        '1 semaphore — all 3 threads share it',
        '3 semaphores — aSema(1), bSema(0), cSema(0). A goes first, signals B, B signals C, C signals A back',
        '2 semaphores — abSema(0), bcSema(0). A runs freely and signals B',
        '3 semaphores — aSema(0), bSema(0), cSema(1). C goes first',
      ],
      answer: 1,
      explanation: '3 semaphores, same count as ZeroOddEven but simpler — no odd/even branching. aSema(1) because A starts. bSema(0), cSema(0). A acquires aSema → prints A → releases bSema. B acquires bSema → prints B → releases cSema. C acquires cSema → prints C → releases aSema. Cycle. Rule: N threads in fixed rotation → N semaphores. First thread gets 1, rest get 0. Each thread releases the NEXT thread\'s semaphore.',
    },
    {
      q: 'PROBLEM VARIANT: method1(), method2(), method3() must execute exactly once in order on 3 separate threads. Thread-1 runs method1, Thread-2 runs method2, Thread-3 runs method3. How many semaphores?',
      options: [
        '3 semaphores — one per method, all at 0',
        '2 semaphores — s1(0), s2(0). method1 runs freely, releases s1. method2 waits on s1, releases s2. method3 waits on s2.',
        '1 semaphore(1) — passed down from method to method',
        '0 semaphores — just call them in order from main',
      ],
      answer: 1,
      explanation: 'N methods in one-shot order → N-1 semaphores. method1 needs no gate (it runs first freely) → no semaphore for method1. method2 must wait for method1 → s1(0). method3 must wait for method2 → s2(0). method1 runs → releases s1. method2 unblocks → runs → releases s2. method3 unblocks → runs → done. Contrast with ABC rotation (repeating): ABC needs N semaphores. One-shot ordering needs N-1.',
    },
    {
      q: 'PROBLEM VARIANT: Print 1-99 using 3 threads in round-robin. Thread-1 prints 1,4,7... Thread-2 prints 2,5,8... Thread-3 prints 3,6,9... Output must be 1 2 3 4 5 6... How many semaphores?',
      options: [
        '1 semaphore — all 3 threads compete for it',
        '3 semaphores — t1Sema(1), t2Sema(0), t3Sema(0). Same rotation pattern as ABC printing',
        '2 semaphores — one for T1, one shared for T2 and T3',
        '99 semaphores — one per number',
      ],
      answer: 1,
      explanation: '3 semaphores — same structure as ABC rotation. t1Sema(1) because Thread-1 prints 1 first. t2Sema(0), t3Sema(0). T1 acquires t1Sema → prints → releases t2Sema. T2 acquires t2Sema → prints → releases t3Sema. T3 acquires t3Sema → prints → releases t1Sema. Repeat. The "what to print" changes (numbers vs letters) but the semaphore structure is identical to ABC rotation. Pattern is the same: N threads, strict rotation, N semaphores.',
    },
    {
      q: 'PROBLEM VARIANT: FizzBuzz using 4 threads. Controller thread checks each number i. Based on i, it signals: Thread-Number, Thread-Fizz, Thread-Buzz, or Thread-FizzBuzz. How many semaphores minimum?',
      options: [
        '2 semaphores — one for Fizz, one for Buzz',
        '5 semaphores — controllerSema(1), numberSema(0), fizzSema(0), buzzSema(0), fizzBuzzSema(0)',
        '4 semaphores — one per printing thread, controller needs none',
        '1 semaphore(4) — shared pool',
      ],
      answer: 1,
      explanation: '5 semaphores. Controller starts open → controllerSema(1). 4 printing threads each have a semaphore at 0. Controller: acquires controllerSema → checks i → releases the correct one (numberSema/fizzSema/buzzSema/fizzBuzzSema). That printing thread: acquires its semaphore → prints → releases controllerSema. This is ZeroOddEven generalized: 1 controller + N outcome threads = N+1 semaphores. ZeroOddEven had 1 controller (zero) + 2 outcomes (odd/even) = 3 semaphores.',
    },
    {
      q: 'PROBLEM VARIANT: Print "0 1 2 0 3 4 0 5 6..." using 2 threads. Thread-Zero always prints 0 before each pair. Thread-Number prints 2 consecutive numbers. How many semaphores?',
      options: [
        '3 semaphores — zero needs 2, number thread needs 1',
        '2 semaphores — zeroSema(1), numSema(0). Zero goes first, prints 0, signals number thread. Number thread prints i and i+1, signals zero.',
        '1 semaphore — shared between both',
        '4 semaphores — one per print call',
      ],
      answer: 1,
      explanation: '2 semaphores. zeroSema(1) because zero goes first. numSema(0) because number thread waits. Flow: zero acquires zeroSema → prints 0 → releases numSema. Number thread acquires numSema → prints i, then i+1 → releases zeroSema. Repeat. Compare ZeroOddEven: needed 3 semaphores because zero had to signal DIFFERENT threads (odd vs even) based on a condition. Here there is only ONE other thread → no branching needed → 2 semaphores is enough.',
    },
    {
      q: 'PROBLEM VARIANT: Thread-A and Thread-B must exchange values. Both must ARRIVE at the exchange point before either can proceed. A has valueA, B has valueB. After exchange both move forward. How many semaphores?',
      options: [
        '1 semaphore(1) — first thread to arrive holds it, second takes it',
        '2 semaphores — arrivedA(0), arrivedB(0). A releases arrivedA and waits on arrivedB. B releases arrivedB and waits on arrivedA.',
        '1 semaphore(2) — both acquire when 2 permits available',
        '3 semaphores — arrive, exchange, leave',
      ],
      answer: 1,
      explanation: '2 semaphores — arrivedA(0), arrivedB(0). A arrives → releases arrivedA → waits on arrivedB. B arrives → releases arrivedB → waits on arrivedA. When both have arrived, both semaphores are at 1, both threads unblock and can read each other\'s value. This is the rendezvous pattern. N threads must all meet before any proceeds → N semaphores (one per thread), all at 0. Each thread releases its own, waits on the others.',
    },
    {
      q: 'PROBLEM VARIANT: 5 Dining Philosophers. Each needs left fork AND right fork to eat. 5 forks on the table, one between each pair. Model each fork as Semaphore(1). How many semaphores?',
      options: [
        '2 semaphores — leftFork(1), rightFork(1) shared by all',
        '5 semaphores — fork[0] to fork[4], each Semaphore(1). Philosopher i acquires fork[i] and fork[(i+1)%5].',
        '10 semaphores — 2 per philosopher',
        '1 semaphore(5) — pool of 5 forks',
      ],
      answer: 1,
      explanation: '5 semaphores — one per fork, each Semaphore(1) because exactly 1 philosopher can hold each fork at a time. Philosopher i: acquires fork[i] (left) then fork[(i+1)%5] (right). If all 5 pick up left fork simultaneously → each holds 1 fork, waiting for right → circular wait → DEADLOCK. Fix: philosopher 4 picks right fork first, breaking the cycle. Key insight: semaphore count = number of independent shared resources, not threads.',
    },
    {
      q: 'CROSS PATTERN: Match each problem to its semaphore count. (1) OddEven 2 threads alternating, (2) ABC rotation 3 threads, (3) N one-shot ordered methods, (4) ZeroOddEven controller+2, (5) FizzBuzz controller+4.',
      options: [
        '(1)=1, (2)=2, (3)=N, (4)=3, (5)=4',
        '(1)=2, (2)=3, (3)=N-1, (4)=3, (5)=5',
        '(1)=2, (2)=3, (3)=N, (4)=4, (5)=5',
        '(1)=1, (2)=3, (3)=N-1, (4)=2, (5)=4',
      ],
      answer: 1,
      explanation: 'Formula summary — (1) OddEven: 2 threads signal each other = 2 semaphores. (2) ABC rotation: N threads in loop = N semaphores. (3) N one-shot ordered methods: first runs freely = N-1 semaphores. (4) ZeroOddEven: 1 controller + 2 output threads = 3 semaphores. (5) FizzBuzz: 1 controller + 4 output threads = 5 semaphores. Master rule: continuous rotation = N. One-shot ordering = N-1. Controller + M workers = M+1.',
    },
    {
      q: 'DESIGN: Print "A1 B2 A3 B4 A5..." — Thread-A prints letters (A,A,A...), Thread-B prints numbers (1,2,3...). Must strictly alternate, A always starts. How many semaphores?',
      options: [
        '1 semaphore(1) — both threads share it and alternate acquiring',
        '2 semaphores — aSema(1), bSema(0). A acquires aSema → prints letter → releases bSema. B acquires bSema → prints number → releases aSema.',
        '2 semaphores — aSema(0), bSema(1). B goes first',
        '1 semaphore(0) — main thread releases it to kick off A',
      ],
      answer: 1,
      explanation: '2 semaphores. aSema(1) because A starts. bSema(0) because B waits. A acquires aSema → prints A → releases bSema. B acquires bSema → prints 1 → releases aSema. A prints A → releases bSema. B prints 2... Output: A 1 A 2 A 3... This is the simplest 2-thread alternation — same skeleton as OddEven. The semaphore structure depends only on: how many distinct waiting points and who goes first. What gets printed is irrelevant to the semaphore design.',
    },
  ],

  patterns2: [
    {
      name: 'Pattern 22 — OddEven (2 threads alternating)',
      icon: '🔢',
      when: 'Two threads must alternate strictly — one prints odd, one prints even',
      gaonKiBaat: 'Do dost hain — ek odd bolega, ek even. Dono ek doosre ka intezaar karte hain. Jab odd bolta hai, even ka darwaza kholta hai. Jab even bolta hai, odd ka darwaza kholta hai.',
      problems: ['Print 1 2 3 4 5 6... using 2 threads', 'Thread-A prints odd, Thread-B prints even, strictly alternating'],
      template: `// APPROACH: 2 semaphores
// oddSema(1)  — odd thread goes first (starts open)
// evenSema(0) — even thread waits (starts closed)
//
// FLOW:
// printOdd:  acquire oddSema  → print → release evenSema
// printEven: acquire evenSema → print → release oddSema
//
// KEY: try-finally in EACH iteration — if thread crashes, other is not stuck forever

import java.util.concurrent.Semaphore;

public class OddEven {
    private int n;
    private Semaphore oddSema  = new Semaphore(1); // odd goes first
    private Semaphore evenSema = new Semaphore(0); // even waits

    public OddEven(int n) { this.n = n; }

    public void printOdd() {
        for (int i = 1; i <= n; i += 2) {
            try {
                oddSema.acquire();
                System.out.println(i);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt(); return;
            } finally {
                evenSema.release(); // signal even to go
            }
        }
    }

    public void printEven() {
        for (int i = 2; i <= n; i += 2) {
            try {
                evenSema.acquire();
                System.out.println(i);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt(); return;
            } finally {
                oddSema.release(); // signal odd to go
            }
        }
    }
}

// CLIENT:
// ExecutorService es = Executors.newFixedThreadPool(2);
// OddEven oe = new OddEven(10);
// es.submit(() -> { try { oe.printOdd(); } catch (Exception e) {} });
// es.submit(() -> { try { oe.printEven(); } catch (Exception e) {} });
// es.shutdown();`,
    },
    {
      name: 'Pattern 23 — PrintNThreads (N threads, ordered output)',
      icon: '🔗',
      when: 'N threads must print in strict order — thread-1 first, thread-2 second, ..., thread-N last',
      gaonKiBaat: 'N log queue mein khade hain. Pehla unlock hota hai, kaam karta hai, doosre ka darwaza kholta hai. Ek chain reaction.',
      problems: ['Print 1 to N using N threads, each thread prints exactly one number in order'],
      template: `// APPROACH: N semaphores (array)
// semas[0] = Semaphore(1)    — thread 0 goes first
// semas[1..N-1] = Semaphore(0) — all others wait
//
// FLOW: thread i → acquire semas[i] → print i+1 → release semas[i+1]
// Last thread does NOT release (no next semaphore)
//
// KEY: loop variable not effectively final inside lambda
//      → capture in local variable BEFORE submit

import java.util.concurrent.Semaphore;

public class PrintNThreads {
    private Semaphore[] semas;
    private int n;

    public PrintNThreads(int n) {
        this.n = n;
        this.semas = new Semaphore[n];
        for (int i = 0; i < n; i++)
            semas[i] = new Semaphore(i == 0 ? 1 : 0);
    }

    void print(int i) throws InterruptedException {
        semas[i].acquire();
        try {
            System.out.println(i + 1);
        } finally {
            if (i + 1 < n) semas[i + 1].release();
        }
    }
}

// CLIENT:
// PrintNThreads p = new PrintNThreads(10);
// ExecutorService es = Executors.newFixedThreadPool(10);
// for (int i = 0; i < 10; i++) {
//     int num = i; // capture before lambda — loop var not effectively final
//     es.submit(() -> { try { p.print(num); } catch (Exception e) {} });
// }
// es.shutdown();`,
    },
    {
      name: 'Pattern 24 — BlockingQueue (Producer-Consumer)',
      icon: '📦',
      when: 'Bounded queue shared between producers and consumers — producer waits when full, consumer waits when empty',
      gaonKiBaat: 'Ek dabba hai jisme max 5 cheezein aa sakti hain. Producer cheez daalta hai, consumer uthata hai. Dabba bhar gaya toh producer ruk ja. Dabba khaali ho gaya toh consumer ruk ja.',
      problems: ['Implement BlockingQueue from scratch', 'Producer-Consumer problem with bounded buffer'],
      template: `// APPROACH: ReentrantLock + 2 Conditions
// notFull  — producer waits here when queue IS full
// notEmpty — consumer waits here when queue IS empty
//
// WHY ReentrantLock not synchronized?
// → Need 2 separate Conditions — signal ONLY producers OR ONLY consumers
// → synchronized has only 1 wait set — notifyAll wakes both unnecessarily
//
// WHY while not if?
// → Spurious wakeups — must re-check condition after waking up

import java.util.*;
import java.util.concurrent.locks.*;

public class BlockingQueue {
    private List<Integer> items;
    private int capacity;
    private ReentrantLock lock;
    private Condition notFull;
    private Condition notEmpty;

    public BlockingQueue(int capacity) {
        this.capacity = capacity;
        this.items = new ArrayList<>(capacity);
        this.lock = new ReentrantLock();
        this.notFull  = lock.newCondition();
        this.notEmpty = lock.newCondition();
    }

    public void put(int item) throws InterruptedException {
        lock.lock();
        try {
            while (items.size() == capacity) notFull.await();
            items.add(item);
            notEmpty.signal(); // wake ONE consumer
        } finally { lock.unlock(); }
    }

    public int take() throws InterruptedException {
        lock.lock();
        try {
            while (items.isEmpty()) notEmpty.await();
            int item = items.get(0);
            items.remove(0);
            notFull.signal(); // wake ONE producer
            return item;
        } finally { lock.unlock(); }
    }
}

// PRODUCTION CLIENT PATTERN:
// AtomicInteger counter = new AtomicInteger(0);
// es.submit(() -> {
//     while (!Thread.currentThread().isInterrupted()) {
//         b.put(counter.incrementAndGet());
//     }
// });
// Graceful shutdown: es.shutdown() → awaitTermination(5s) → shutdownNow() → awaitTermination(2s)`,
    },
    {
      name: 'Pattern 25 — Fixed Window Rate Limiter',
      icon: '🪟',
      when: 'Limit requests to N per time window (per second, minute, hour)',
      gaonKiBaat: 'Ek khidki hai — jaise 1 minute ki. Us minute mein sirf 5 log andar aa sakte hain. Minute khatam — naya khidki, fir 5 log. Simple lekin boundary pe burst ka problem hai.',
      problems: ['Implement rate limiter — max 5 requests per second', 'API throttling'],
      template: `// APPROACH: counter + windowStart + windowDuration
// Reset counter when window expires
// synchronized — only one thread checks/updates at a time
//
// BURST PROBLEM: 5 req end of window + 5 req start of next = 10 in 2 sec
// → Use TokenBucket for production

public class FixedWindowRateLimiter {
    private int limit;
    private int currReqCount;
    private long windowStart;
    private long windowDuration; // in milliseconds

    public FixedWindowRateLimiter(int limit, long windowDuration) {
        this.limit = limit;
        this.windowStart = System.currentTimeMillis();
        this.windowDuration = windowDuration;
        this.currReqCount = 0;
    }

    public synchronized boolean allowRequest() {
        long now = System.currentTimeMillis();
        if (now - windowStart > windowDuration) {
            windowStart = now; // reset window
            currReqCount = 0;  // reset counter
        }
        if (currReqCount < limit) {
            currReqCount++;
            return true;
        }
        return false;
    }
}

// CLIENT:
// FixedWindowRateLimiter limiter = new FixedWindowRateLimiter(5, 1000); // 5 req/sec
// ExecutorService es = Executors.newFixedThreadPool(10);
// for (int i = 0; i < 10; i++) {
//     es.submit(() -> {
//         boolean allowed = limiter.allowRequest();
//         System.out.println(Thread.currentThread().getName() + " — Allowed: " + allowed);
//     });
// }
// es.shutdown();
// Expected: 5 true, 5 false`,
    },
    {
      name: 'Pattern 26 — Token Bucket Rate Limiter',
      icon: '🪣',
      when: 'Production rate limiting — handles bursts gracefully, smoother than fixed window',
      gaonKiBaat: 'Ek dabba hai jisme tokens hain — jaise prepaid recharge. Har second kuch tokens aate hain. Har request ek token leta hai. Tokens khatam — request reject. Agar bahut der se request nahi aayi toh tokens jama ho jaate hain (capacity tak).',
      problems: ['Implement Token Bucket rate limiter', 'Rate limiter that allows burst but controls sustained rate'],
      template: `// APPROACH: lazy refill — calculate tokens earned since last request ON DEMAND
// No background timer needed — calculate when request arrives
//
// FORMULA:
// secondsPassed = (now - lastRefillTime) / 1000.0
// tokensEarned  = secondsPassed * refillRate
// tokens = min(capacity, tokens + tokensEarned)
//
// WHY double not int for tokens?
// → refillRate=1/sec, request every 500ms → 0.5 tokens earned
// → int would round to 0 → token never refills → bug
//
// HOW TO SET PARAMS:
// 5 req/sec   → new TokenBucketRateLimiter(5, 5)
// 100 req/hr  → new TokenBucketRateLimiter(100, 100.0/3600)
// 1000 req/day → new TokenBucketRateLimiter(1000, 1000.0/86400)
// Rule: refillRate = allowedRequests / windowInSeconds

public class TokenBucketRateLimiter {
    private double capacity;
    private double currTokenCount;
    private double refillRate; // tokens per second
    private long lastRefillTime;

    public TokenBucketRateLimiter(double capacity, double refillRate) {
        this.capacity = capacity;
        this.currTokenCount = capacity; // bucket starts full
        this.refillRate = refillRate;
        this.lastRefillTime = System.currentTimeMillis();
    }

    public synchronized boolean allowRequest() {
        long now = System.currentTimeMillis();
        double secondsPassed = (now - lastRefillTime) / 1000.0;
        double tokensEarned  = secondsPassed * refillRate;
        currTokenCount = Math.min(capacity, currTokenCount + tokensEarned);
        lastRefillTime = now;
        if (currTokenCount >= 1) {
            currTokenCount--;
            return true;
        }
        return false;
    }
}

// FixedWindow vs TokenBucket:
// FixedWindow — simple, burst problem at window boundary
// TokenBucket — handles burst (saved tokens), smoother, production preferred`,
    },
    {
      name: 'Pattern 27 — Connection Pool',
      icon: '🔌',
      when: 'Reuse expensive DB connections — avoid creating new connection per request',
      gaonKiBaat: 'Library ki tarah socho. 5 kitaabein hain (connections). Student borrow karta hai, padhta hai, wapas karta hai. Sab 5 books borrow ho gayi — naya student wait karo. Koi wapas kare tab milegi.',
      problems: ['Implement Connection Pool from scratch', 'Thread-safe DB connection management'],
      template: `// APPROACH: Queue (available) + Set (used) + synchronized + wait/notifyAll
// Pre-create all connections at startup (eager initialization)
// getConnection() — wait if pool full, borrow available or create new
// releaseConnection() — return to available, notifyAll waiting threads
//
// WHY Set not List for usedConnections?
// → Set.remove() is O(1), List.remove() is O(N)
//
// WHY while not if in wait loop?
// → Spurious wakeups + multiple threads wake on notifyAll — re-check needed

import java.util.*;

public class ConnectionPool {
    private Queue<Connection> availableConnections;
    private Set<Connection> usedConnections;
    private int maxPoolSize;
    private String url, userName, password;

    public ConnectionPool(int maxPoolSize, String url, String userName, String password) {
        this.maxPoolSize = maxPoolSize;
        this.availableConnections = new LinkedList<>();
        this.usedConnections = new HashSet<>();
        this.url = url; this.userName = userName; this.password = password;
        for (int i = 0; i < maxPoolSize; i++)
            availableConnections.offer(new Connection(userName, url, password, false));
    }

    public synchronized Connection getConnection() throws InterruptedException {
        while (availableConnections.isEmpty() && usedConnections.size() == maxPoolSize) {
            System.out.println(Thread.currentThread().getName() + " WAITING for connection...");
            wait();
        }
        Connection conn;
        if (!availableConnections.isEmpty()) {
            conn = availableConnections.poll();
        } else {
            conn = new Connection(userName, url, password, false);
        }
        conn.setActive(true);
        usedConnections.add(conn);
        return conn;
    }

    public synchronized void releaseConnection(Connection conn) {
        usedConnections.remove(conn);
        conn.setActive(false);
        availableConnections.offer(conn);
        notifyAll(); // wake all waiting threads
    }
}

// CLIENT — always use try-finally to guarantee release:
// Connection conn = pool.getConnection();
// try {
//     // use connection
// } finally {
//     pool.releaseConnection(conn); // always released even if exception
// }

// Production: HikariCP handles all this automatically
// connectionTimeout, maxLifetime, keepaliveTime settings`,
    },
    {
      name: 'Pattern 28 — LRU Cache',
      icon: '🗄️',
      when: 'Cache with fixed capacity — evict least recently used item when full',
      gaonKiBaat: 'Phone ke recent apps jaisa. 5 apps memory mein hain. 6th khologe toh jo sabse pehle khola tha aur use nahi hua — woh band ho jaayega. Jo recently use hua woh safe hai.',
      problems: ['Implement LRU Cache', 'get(key) O(1), put(key,value) O(1), evict LRU on full'],
      template: `// APPROACH: HashMap + Java LinkedList (DLL internally)
// HashMap — O(1) key lookup → gives Node directly
// LinkedList — maintains order: HEAD=oldest, TAIL=most recent
//
// get(key):
//   not found → return -1
//   found → remove from current position → addLast (move to tail) → return value
//
// put(key, val):
//   key exists → update value → move to tail
//   key not exists + full → removeFirst (evict LRU) → remove from map → add new at tail
//   key not exists + not full → add at tail → add to map
//
// WHY key stored in Node?
// → During eviction (removeFirst), need key to remove from HashMap too

import java.util.*;

class Node {
    int key, val;
    Node prev, next;
    public Node(int key, int val) { this.key = key; this.val = val; }
}

public class LRUCache {
    private int capacity;
    private HashMap<Integer, Node> map;
    private LinkedList<Node> list; // HEAD=LRU, TAIL=MRU

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new HashMap<>(capacity);
        this.list = new LinkedList<>();
    }

    public int get(int key) {
        Node node = map.getOrDefault(key, null);
        if (node == null) return -1;
        list.remove(node);    // remove from current position
        list.addLast(node);   // move to tail (most recently used)
        return node.val;
    }

    public void put(int key, int val) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            node.val = val;
            list.remove(node);
            list.addLast(node);
            return;
        }
        if (map.size() == capacity) {
            Node lru = list.removeFirst(); // evict least recently used
            map.remove(lru.key);
        }
        Node newNode = new Node(key, val);
        list.addLast(newNode);
        map.put(key, newNode);
    }
}

// TEST:
// LRUCache cache = new LRUCache(2);
// cache.put(1, 10); cache.put(2, 20);
// cache.get(1);     → 10, moves 1 to tail
// cache.put(3, 30); → evicts 2 (LRU), adds 3
// cache.get(2);     → -1 (evicted)
// cache.get(1);     → 10
// cache.get(3);     → 30`,
    },
    {
      name: 'Pattern 29 — When to Use What (Synchronization Tools)',
      icon: '🧰',
      when: 'Deciding which concurrency tool to use — interview decision framework',
      gaonKiBaat: 'Har kaam ke liye alag haathiyaar. Taala lagana hai toh synchronized. Kitne andar aayenge control karna hai toh Semaphore. Sequence chahiye toh Semaphore. Do alag type ke log wait kar rahe hain toh ReentrantLock.',
      problems: ['Interview: "When would you use Semaphore vs synchronized?"', 'Interview: "Why ReentrantLock over synchronized?"'],
      template: `// DECISION FRAMEWORK — pick the right tool

// synchronized
// → Simple locking, ONE wait condition, protect a method/block
// → Example: FixedWindowRateLimiter, TokenBucketRateLimiter, ConnectionPool
synchronized void allowRequest() { ... }

// ReentrantLock + Condition
// → MULTIPLE wait conditions on same lock
// → Signal specific group (only producers OR only consumers)
// → Example: BlockingQueue (notFull for producers, notEmpty for consumers)
ReentrantLock lock = new ReentrantLock();
Condition notFull  = lock.newCondition(); // producers wait here
Condition notEmpty = lock.newCondition(); // consumers wait here

// Semaphore
// → Control ORDER of threads OR limit COUNT entering critical section
// → Example: ZeroOddEven, OddEven, PrintNThreads
Semaphore sema = new Semaphore(1); // 1 = first thread goes, 0 = wait

// AtomicInteger
// → Single counter inside lambda (loop variable not effectively final)
// → No complex logic needed
AtomicInteger counter = new AtomicInteger(0);
es.submit(() -> counter.incrementAndGet()); // safe in lambda

// volatile
// → Single variable visibility across threads, no atomicity needed
// → Example: stop flag for infinite loop
volatile boolean running = true;

// ReadWriteLock
// → Read-heavy workload — multiple readers OK, writer needs exclusive
// → Example: cache, config store, DB reads
int readers = 0; boolean isWriting = false;

// CyclicBarrier
// → Wait for N threads to reach same point before any proceeds
// → Example: race start, batch processing phases
CyclicBarrier barrier = new CyclicBarrier(N, () -> System.out.println("All ready!"));

// CompletableFuture
// → Async tasks, parallel execution, chaining, no blocking
// → Example: call 3 APIs in parallel, combine results
CompletableFuture.allOf(cf1, cf2, cf3).join();

// QUICK RULE:
// Control ORDER/COUNT of threads → Semaphore
// One wait condition → synchronized
// Multiple wait conditions → ReentrantLock
// Single counter in lambda → AtomicInteger
// Read-heavy → ReadWriteLock
// All threads meet at checkpoint → CyclicBarrier
// Async parallel tasks → CompletableFuture`,
    },
    {
      name: 'Pattern 30 — Distributed Rate Limiter (System Design)',
      icon: '🌐',
      when: 'Design rate limiter for millions of users across multiple pods/regions',
      gaonKiBaat: 'Ek pod ka rate limiter toh hum bana sakte hain — memory mein. Par agar 10 pods hain toh? Har pod apna hisaab rakhega aur galat ho jaayega. Solution: Redis — ek jagah ka counter jo sab pods share karein.',
      problems: ['Design distributed rate limiter for 1M users', 'How does rate limiting work across multiple pods?'],
      template: `// SINGLE POD — in-memory (what we implemented)
// TokenBucketRateLimiter rateLimiter = new TokenBucketRateLimiter(5, 5);
// Problem: each pod has own counter → 10 pods × 5 req = 50 req allowed instead of 5!

// MULTIPLE PODS — centralized Redis
//
// Flow:
// User Request
//       ↓
// API Gateway ← Rate Limiter check happens HERE (not in service)
//       ↓
// Redis (shared counter for ALL pods)
//       ↓ allowed          ↓ rejected
// Forward to service    Return 429 Too Many Requests

// WHY Redis?
// → Redis INCR is atomic — no race condition across pods
// → TTL on key = auto window reset (no manual reset needed)
// → Single source of truth for all pods

// Redis logic per request:
// key = "ratelimit:userId:windowStart"
// count = INCR key          → atomic increment, returns new value
// if count == 1: EXPIRE key windowDuration  → set TTL only on first request
// if count <= limit: ALLOW
// else: REJECT 429

// LAYERED APPROACH (production):
// Layer 1 — API Gateway: Global limit (protect service — 100k req/sec total)
// Layer 2 — Per Organization: plan-based (Free=100/hr, Pro=10k/hr, Enterprise=unlimited)
// Layer 3 — Per User: abuse prevention (100 req/min per user)

// HOW LIMIT IS DECIDED:
// 1. Load test → find breaking point (e.g. crashes at 50k req/sec)
// 2. Set global limit at 70% → 35k req/sec (buffer for spikes)
// 3. Business model → paid users × their plan limit = theoretical max
// 4. Monitor in production → adjust gradually

// IF Redis goes down:
// → Fallback to in-memory rate limiting per pod
// → Alert ops team
// → Redis should have replicas for HA

// MULTI-REGION:
// → Redis Cluster per region
// → Slight inconsistency between regions (acceptable tradeoff for availability)

// INTERVIEW ANSWER FLOW:
// 1. Clarify: per user or global? per second/minute/hour? reject or queue?
// 2. Single pod → in-memory TokenBucket
// 3. Multiple pods → Redis with atomic INCR + TTL
// 4. Multiple regions → Redis Cluster, eventual consistency
// 5. API Gateway placement — centralized, not in each service
// 6. Fallback if Redis down — in-memory per pod`,
    },
  ],
}
