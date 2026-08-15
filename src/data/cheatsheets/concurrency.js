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
  ],
}
