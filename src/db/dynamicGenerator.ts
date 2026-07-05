import { Question, TrackSlug, SkillLevel, QuestionOption } from '../types';

// Fun entities/developers and silly project scenarios to keep the questions highly engaging!
const DEVELOPERS = [
  "Greg the over-caffeinated intern",
  "SillyCat LLC",
  "Alice the senior staff wizard",
  "Bob the paranoid sysadmin",
  "Quantum Tacos",
  "The Office Coffee Robot",
  "Zog the Martian developer",
  "CyberDyne Cleaners",
  "MegaSilly Corp",
  "A rogue smart-toaster",
  "Dave who refuses to read documentation",
  "The legendary 10x Developer Cat",
  "Sarah the database whisperer",
  "An ancient COBOL developer",
  "The startup 'JustAddAI'",
  "Uncle Leo's serverless bakery",
  "A sentient banana",
  "NoodleSoup Systems",
  "Dr. Brainiac's lab",
  "The Chaos Monkey's cousin",
  "Pam the Cloud Guardian",
  "The API Goblin",
  "Penny the Penguin",
  "The Lambda Alpaca",
  "DinoDev Systems"
];

const PROJECTS = [
  "a translation model for dog barks",
  "a neural network to predict when the last donut will be eaten",
  "a serverless API for teleporting pizzas",
  "a Kubernetes cluster running on smart socks",
  "a system to auto-hide embarrassing commit messages",
  "a python script to automatically decline calendar invites",
  "an AI model to generate corporate jargon on demand",
  "a database of every cat video on the internet",
  "a serverless lambda function that prints 'Refactoring...' and sleeps for an hour",
  "a microservice to calculate the optimal temperature of coffee",
  "a Docker container containing only other Docker containers",
  "a Django app for scheduling quantum meetings with past selves",
  "a deep learning pipeline to detect if a sandwich is a sub",
  "a cloud-native scraper for discount spaceship parts",
  "an automated proctoring script that plays dramatic organ music",
  "a slack bot that replies with random stackoverflow answers",
  "a smart mirror that lies about how good your code looks",
  "an AI to optimize the placement of sprinkles on cupcakes",
  "a serverless queue that redirects spam to the CEO's pager",
  "a database migration script written entirely in emojis",
  "a compiler that changes variable names to pirate slang",
  "a machine learning model to predict git merge conflicts",
  "a cloud firewall that blocks requests from anyone named Greg",
  "a lambda function that mines imaginary coins on failure",
  "a REST API to query the mood of the office plant"
];

// Helper to construct structured options easily
function makeOptions(opts: string[]): QuestionOption[] {
  const alphabet = ['a', 'b', 'c', 'd', 'e'];
  return opts.map((opt, idx) => ({
    id: alphabet[idx] || String(idx),
    text: opt
  }));
}

// Master generator function
export function generateDynamicQuestions(trackId: TrackSlug, level: SkillLevel): Question[] {
  const questions: Question[] = [];

  // Generate 102 questions for each of the 10 templates to get 1020 questions total!
  for (let t = 0; t < 10; t++) {
    for (let j = 0; j < 102; j++) {
      const globalIdx = t * 102 + j;
      const dev = DEVELOPERS[globalIdx % DEVELOPERS.length];
      const proj = PROJECTS[(globalIdx * 3 + 1) % PROJECTS.length];

      let prompt = '';
      let options: string[] = [];
      let correct: string[] = [];
      let explanation = '';
      let type: 'mcq' | 'multi' | 'code-output' | 'fill-blank' = 'mcq';
      let difficulty = 2;
      let tags: string[] = [];

      // ----------------------------------------------------
      // TRACK: PYTHON
      // ----------------------------------------------------
      if (trackId === 'python') {
        if (level === 'beginner') {
          tags = ['basics', 'syntax'];
          difficulty = 1;
          if (t === 0) {
            const val1 = j + 5;
            const val2 = (j * 1.5) + 0.5;
            prompt = `${dev} is building ${proj} and writes the following Python code:\n\n\`\`\`python\nx = ${val1}\ny = ${val2}\nz = x + y\nprint(type(z))\n\`\`\`\n\nWhat class does the variable \`z\` belong to?`;
            options = ["<class 'int'>", "<class 'float'>", "<class 'str'>", "TypeError"];
            correct = ['b'];
            explanation = `In Python, adding an integer (${val1}) and a float (${val2}) automatically promotes the result to a double-precision float to avoid losing precision.`;
          } else if (t === 1) {
            const start = j % 3;
            const end = start + 3;
            prompt = `${dev} is setting up parameters for ${proj}:\n\n\`\`\`python\nitems = [10, 20, 30, 40, 50, 60, 70]\nprint(items[${start}:${end}])\n\`\`\`\n\nWhat list is printed by this slice?`;
            const expected = [10, 20, 30, 40, 50, 60, 70].slice(start, end);
            options = [
              JSON.stringify(expected),
              JSON.stringify([10, 20, 30].map(x => x + j)),
              JSON.stringify(expected.slice(1)),
              "IndexError"
            ];
            correct = ['a'];
            explanation = `Slicing list[start:end] extracts elements from index 'start' up to (but not including) index 'end'. Here, items[${start}:${end}] results in ${JSON.stringify(expected)}.`;
          } else if (t === 2) {
            const num = j * 2 + 1;
            prompt = `${dev} is debug-logging ${proj} with the modulo operator:\n\n\`\`\`python\nnum = ${num}\nprint(num % 2)\n\`\`\`\n\nWhat is the integer output?`;
            options = ["0", "1", "2", "None"];
            correct = ['b'];
            explanation = `The % operator calculates the remainder of division. Any odd integer like ${num} divided by 2 always yields a remainder of 1.`;
          } else if (t === 3) {
            const count = (j % 4) + 2;
            prompt = `${dev} is generating an alert sequence for ${proj}:\n\n\`\`\`python\ns = "🚨" * ${count}\nprint(len(s))\n\`\`\`\n\nWhat is the length of the string \`s\`?`;
            options = [String(count), String(count * 2), "1", "TypeError"];
            correct = ['a'];
            explanation = `Multiplying a string by an integer repeats it that many times. Since the base emoji emoji character length is 1, repeating it ${count} times results in a length of ${count}.`;
          } else if (t === 4) {
            const val = j * 10;
            prompt = `${dev} is saving settings for ${proj}:\n\n\`\`\`python\nd = {"latency": ${val}}\nprint(d.get("port", "80"))\n\`\`\`\n\nWhat value is returned by the dictionary query?`;
            options = [String(val), "80", "None", "KeyError"];
            correct = ['b'];
            explanation = `The dictionary '.get(key, default)' method returns the value if the key exists, otherwise it returns the default value ("80" in this case) instead of raising a KeyError.`;
          } else if (t === 5) {
            prompt = `While deploying ${proj}, ${dev} formats user inputs:\n\n\`\`\`python\ns = "SILLY_string"\nprint(s.lower().capitalize())\n\`\`\``;
            options = ["silly_string", "Silly_string", "Silly_String", "SILLY_STRING"];
            correct = ['b'];
            explanation = `'.lower()' converts the string to lowercase ('silly_string'), and '.capitalize()' capitalizes only the first letter, producing 'Silly_string'.`;
          } else if (t === 6) {
            const lenVal = (j % 5) + 3;
            prompt = `${dev} instantiates container configs for ${proj}:\n\n\`\`\`python\nlst = [0] * ${lenVal}\nprint(len(lst))\n\`\`\``;
            options = [String(lenVal), "1", "0", "TypeError"];
            correct = ['a'];
            explanation = `Multiplying a single-element list [0] by an integer repeats the element, making a list of size ${lenVal}.`;
          } else if (t === 7) {
            const score = j;
            prompt = `${dev} reviews evaluation metrics for ${proj}:\n\n\`\`\`python\nscore = ${score}\nstatus = "High" if score > 50 else "Low"\nprint(status)\n\`\`\``;
            const res = score > 50 ? "High" : "Low";
            options = ["High", "Low", "None", "SyntaxError"];
            correct = [res === "High" ? 'a' : 'b'];
            explanation = `Python's ternary conditional statement returns 'High' when 'score > 50' evaluates to True (since score is ${score}), else 'Low'.`;
          } else if (t === 8) {
            const val = j;
            prompt = `${dev} records telemetry details for ${proj}:\n\n\`\`\`python\nlst = [10]\nlst.append(${val})\nprint(lst)\n\`\`\``;
            options = [JSON.stringify([10, val]), JSON.stringify([val, 10]), `[10]`, `[${val}]`];
            correct = ['a'];
            explanation = `The '.append()' list method adds the given item to the very end of the list in place, resulting in [10, ${val}].`;
          } else {
            const limit = (j % 4) + 2;
            prompt = `${dev} runs an iteration check for ${proj}:\n\n\`\`\`python\ntot = 0\nfor x in range(${limit}):\n    tot += x\nprint(tot)\n\`\`\``;
            let sum = 0;
            for (let x = 0; x < limit; x++) sum += x;
            options = [String(sum), String(sum + limit), "0", "TypeError"];
            correct = ['a'];
            explanation = `range(${limit}) generates numbers from 0 up to (but excluding) ${limit}. Summing them results in ${sum}.`;
          }
        } else if (level === 'intermediate') {
          tags = ['comprehensions', 'intermediate'];
          difficulty = 2;
          if (t === 0) {
            const factor = (j % 3) + 2;
            prompt = `${dev} refactors data formatting for ${proj}:\n\n\`\`\`python\nnums = [x * ${factor} for x in range(5) if x % 2 == 0]\nprint(nums)\n\`\`\``;
            const expected = [0, 2, 4].map(x => x * factor);
            options = [JSON.stringify(expected), JSON.stringify([0, 1, 2, 3, 4].map(x => x * factor)), "[]", "TypeError"];
            correct = ['a'];
            explanation = `The comprehension filters range(5) to keep only evens (0, 2, 4) and multiplies each by ${factor}, resulting in ${JSON.stringify(expected)}.`;
          } else if (t === 1) {
            const val = (j % 5) + 3;
            prompt = `${dev} is optimizing tracking logs for ${proj}:\n\n\`\`\`python\ns1 = {1, 2, ${val}}\ns2 = {2, ${val}, 4}\nprint(s1 & s2)\n\`\`\``;
            const expectedSet = Array.from(new Set([1, 2, val].filter(x => [2, val, 4].includes(x)))).sort();
            options = [
              `{${expectedSet.join(', ')}}`,
              `{1, 2, 4, ${val}}`,
              `{1, 4}`,
              "AttributeError"
            ];
            correct = ['a'];
            explanation = `The '&' operator performs set intersection, retaining elements that belong to both s1 and s2: {${expectedSet.join(', ')}}.`;
          } else if (t === 2) {
            const val = j;
            prompt = `${dev} maps telemetry records for ${proj}:\n\n\`\`\`python\nitems = list(map(lambda x: x + 1, [1, ${val}]))\nprint(items)\n\`\`\``;
            options = [JSON.stringify([2, val + 1]), JSON.stringify([1, val]), `[2, ${val}]`, "TypeError"];
            correct = ['a'];
            explanation = `The 'map()' function applies the lambda function (which increments its argument by 1) to each item in the list, yielding [2, ${val + 1}].`;
          } else if (t === 3) {
            const initVal = j;
            const bumpVal = j + 10;
            prompt = `${dev} is tracking process states for ${proj}:\n\n\`\`\`python\nx = ${initVal}\ndef run():\n    global x\n    x = ${bumpVal}\nrun()\nprint(x)\n\`\`\``;
            options = [String(bumpVal), String(initVal), "UnboundLocalError", "None"];
            correct = ['a'];
            explanation = `The 'global' keyword informs Python to bind and alter the global variable 'x' inside the local scope of 'run()', updating it to ${bumpVal}.`;
          } else if (t === 4) {
            const val = j;
            prompt = `${dev} compiles pairing arrays for ${proj}:\n\n\`\`\`python\nitems = list(zip([10, 20], [1, ${val}, 3]))\nprint(items)\n\`\`\``;
            options = [
              JSON.stringify([[10, 1], [20, val]]),
              JSON.stringify([[10, 1], [20, val], [null, 3]]),
              JSON.stringify([[10, 1], [20, val], [20, 3]]),
              "ValueError"
            ];
            correct = ['a'];
            explanation = `The 'zip()' function aggregates elements from multiple iterables. It truncates elements that do not have matching pairs when iterables are of uneven length.`;
          } else if (t === 5) {
            prompt = `${dev} is formatting a metric string for ${proj}:\n\n\`\`\`python\nratio = 2/3\nprint(f"Ratio: {ratio:.${j % 3 + 1}f}")\n\`\`\``;
            const places = j % 3 + 1;
            const resVal = (2/3).toFixed(places);
            options = [`Ratio: ${resVal}`, `Ratio: ${(2/3).toString()}`, "Ratio: {:.2f}", "ValueError"];
            correct = ['a'];
            explanation = `The ':.${places}f' formatting descriptor inside the f-string limits floating-point output to exactly ${places} decimal places.`;
          } else if (t === 6) {
            const count = (j % 3) + 2;
            prompt = `${dev} tests dictionary mappings for ${proj}:\n\n\`\`\`python\nd = {x: x**2 for x in range(${count})}\nprint(len(d))\n\`\`\``;
            options = [String(count), String(count - 1), "0", "TypeError"];
            correct = ['a'];
            explanation = `The dictionary comprehension generates key-value pairs for each item in range(${count}), creating exactly ${count} unique keys.`;
          } else if (t === 7) {
            prompt = `${dev} is implementing file output buffers for ${proj}:\n\nWhat is the primary difference between open('log.txt', 'w') and open('log.txt', 'a')?`;
            options = [
              "'w' overwrites/truncates the existing file content, while 'a' appends new logs to the end of the file.",
              "'w' creates a new file only if it doesn't exist, while 'a' always raises FileNotFoundError.",
              "'w' is for write-only access, while 'a' allows both reading and writing synchronously.",
              "There is absolutely no difference; they are direct aliases."
            ];
            correct = ['a'];
            explanation = "In Python, the write flag 'w' truncates existing files immediately on open, whereas the append flag 'a' preserves previous content.";
          } else if (t === 8) {
            const thresh = (j % 10) + 5;
            prompt = `${dev} is checking threshold exceptions for ${proj}:\n\n\`\`\`python\nchecks = [10, 20, 30]\nstatus = any(x > ${thresh} for x in checks)\nprint(status)\n\`\`\``;
            const ans = [10, 20, 30].some(x => x > thresh);
            options = [String(ans), String(!ans), "None", "TypeError"];
            correct = [ans ? 'a' : 'b'];
            explanation = `'any()' returns True if at least one item in the generator evaluates to True. Here we check if any values in [10, 20, 30] are greater than ${thresh}.`;
          } else {
            prompt = `${dev} evaluates list extension routines for ${proj}:\n\n\`\`\`python\nlst = [1, 2]\nlst.extend([${j}, ${j + 1}])\nprint(len(lst))\n\`\`\``;
            options = ["4", "3", "2", "TypeError"];
            correct = ['a'];
            explanation = `'.extend()' takes an iterable of elements and appends them one by one to the host list, increasing the length from 2 to 4.`;
          }
        } else if (level === 'advanced') {
          tags = ['meta', 'internals', 'advanced'];
          difficulty = 4;
          if (t === 0) {
            prompt = `While optimizing ${proj}, ${dev} defines a resource class using \`__slots__\`:\n\n\`\`\`python\nclass SillyResource:\n    __slots__ = ['id_code']\n    def __init__(self):\n        self.id_code = "v_${j}"\n\nr = SillyResource()\nr.secret_port = 8080\n\`\`\`\n\nWhat exception is raised when executing this code?`;
            options = ["AttributeError", "KeyError", "TypeError", "It runs successfully with no errors"];
            correct = ['a'];
            explanation = "Defining '__slots__' restricts class instances to a static list of allowed attributes, bypassing '__dict__' allocation and raising 'AttributeError' on unlisted attribute writes.";
          } else if (t === 1) {
            const factor = (j % 5) + 2;
            prompt = `${dev} crafts a micro-generator for ${proj}:\n\n\`\`\`python\ndef counter():\n    for x in range(3):\n        yield x * ${factor}\n\ngen = counter()\nnext(gen)\nprint(next(gen))\n\`\`\``;
            options = [String(factor), String(0), String(factor * 2), "StopIteration"];
            correct = ['a'];
            explanation = `The first call to next(gen) runs until 'yield 0 * ${factor}' (0). The second call runs until 'yield 1 * ${factor}', returning ${factor}.`;
          } else if (t === 2) {
            const addVal = j;
            prompt = `${dev} is writing an execution wrapper decorator for ${proj}:\n\n\`\`\`python\ndef add_val(f):\n    def wrapper(*args):\n        return f(*args) + ${addVal}\n    return wrapper\n\n@add_val\ndef base():\n    return 10\n\nprint(base())\n\`\`\``;
            options = [String(10 + addVal), "10", String(addVal), "TypeError"];
            correct = ['a'];
            explanation = "The decorator wraps 'base()', intercepting the return value (10) and adding ${addVal} to it, yielding ${10 + addVal}.";
          } else if (t === 3) {
            prompt = `${dev} is inspecting custom metaclass overrides for ${proj}:\n\nWhich method of a custom metaclass is executed first to allocate memory before the instance is actually initialized?`;
            options = ["__new__", "__init__", "__call__", "__prepare__"];
            correct = ['a'];
            explanation = "__new__ is the static allocator method called to create and return the raw class instance, executing before '__init__' configures it.";
          } else if (t === 4) {
            prompt = `${dev} is troubleshooting dynamic attributes in ${proj}:\n\nWhich dunder method handles ALL attribute accesses, whether the requested field exists on the class instance or not?`;
            options = ["__getattribute__", "__getattr__", "__setattr__", "__dir__"];
            correct = ['a'];
            explanation = "__getattribute__ intercepts ALL attribute lookup requests unconditionally. '__getattr__' is only triggered as a fallback if the attribute is missing.";
          } else if (t === 5) {
            prompt = `${dev} wants to allow memory-sensitive cache lines for ${proj} to be garbage-collected dynamically:\n\nWhich standard library module provides references to objects that do not prevent those objects from being deleted?`;
            options = ["weakref", "gc", "sys", "memtrace"];
            correct = ['a'];
            explanation = "The 'weakref' module allows programmers to track objects without establishing strong pointers, enabling the garbage collector to reclaim them when strong references fall to zero.";
          } else if (t === 6) {
            prompt = `${dev} is configuring descriptor field validations for ${proj}:\n\nWhich two methods must a class implement to conform to the non-data descriptor protocol?`;
            options = [
              "Only __get__",
              "Both __get__ and __set__",
              "Both __get__ and __delete__",
              "Only __set__"
            ];
            correct = ['a'];
            explanation = "Conforming to the non-data descriptor protocol requires implementing only '__get__'. If it implements '__set__' or '__delete__', it becomes a data descriptor.";
          } else if (t === 7) {
            prompt = `${dev} builds a custom context manager for ${proj} and handles exceptions inside \`__exit__\`:\n\nIf the \`__exit__\` method returns \`True\` after an exception is raised inside the \`with\` block, what happens?`;
            options = [
              "The exception is suppressed and program execution continues normally.",
              "The exception is re-raised instantly up the call stack.",
              "A SyntaxError is triggered.",
              "The interpreter terminates with code -1."
            ];
            correct = ['a'];
            explanation = "In Python, returning 'True' from the '__exit__' method signals to the interpreter that the exception has been fully handled and should be suppressed.";
          } else if (t === 8) {
            prompt = `Why does ${dev}'s attempt to speed up a CPU-bound calculation running ${j * 1000} loops via multiple threads fail to scale in CPython?`;
            options = [
              "The Global Interpreter Lock (GIL) limits CPython execution to a single core at a time, preventing parallel multi-threaded CPU execution.",
              "Threads do not support loops inside function blocks.",
              "CPU-bound tasks require special non-blocking async network ports.",
              "Thread execution causes database connection locks."
            ];
            correct = ['a'];
            explanation = "CPython's GIL prevents multiple native threads from executing Python bytecodes concurrently, making multi-threading ineffective for CPU-bound tasks.";
          } else {
            const factor = (j % 5) + 2;
            prompt = `${dev} converts a config class into a callable object for ${proj}:\n\n\`\`\`python\nclass Multiplier:\n    def __call__(self, val):\n        return val * ${factor}\n\nm = Multiplier()\nprint(m(10))\n\`\`\``;
            options = [String(10 * factor), "10", String(factor), "TypeError"];
            correct = ['a'];
            explanation = "Implementing the '__call__' dunder method allows the class instance 'm' to be invoked directly like a standard function, yielding ${10 * factor}.";
          }
        } else if (level === 'api') {
          tags = ['rest-api', 'fastapi', 'http'];
          difficulty = 3;
          if (t === 0) {
            prompt = `While testing endpoints for ${proj}, ${dev} requests a resource with an ID of ${j} that has been completely deleted:\n\nWhat is the most semantically appropriate HTTP status code the REST API should return?`;
            options = ["404 Not Found", "400 Bad Request", "403 Forbidden", "500 Internal Server Error"];
            correct = ['a'];
            explanation = "A '404 Not Found' status indicates that the server cannot locate the requested resource (either because it is missing or deleted).";
          } else if (t === 1) {
            const minQty = (j % 10) + 1;
            prompt = `${dev} uses Pydantic to validate input payloads for ${proj}:\n\n\`\`\`python\nfrom pydantic import BaseModel, Field\n\nclass Order(BaseModel):\n    qty: int = Field(gt=${minQty})\n\`\`\`\n\nIf Greg submits a payload with \`qty = ${minQty}\`, what error behavior occurs?`;
            options = [
              "A ValidationError is raised because gt requires the value to be strictly greater than.",
              "The schema compiles successfully with no error because gt is inclusive.",
              "A TypeError is raised.",
              "The field is coerced to a float."
            ];
            correct = ['a'];
            explanation = "In Pydantic, the 'gt' constraint specifies 'strictly greater than'. A value equal to ${minQty} fails validation, raising a ValidationError.";
          } else if (t === 2) {
            prompt = `${dev} is setting up routes for ${proj} in FastAPI:\n\nWhich of the following describes a path parameter as opposed to a query parameter?`;
            options = [
              "Path parameters are embedded directly in the URL structure (e.g., /users/{id}), whereas query parameters are key-value options attached to the end (e.g., ?q=val).",
              "Path parameters must always be strings, while query parameters can be objects.",
              "Path parameters are optional, while query parameters are always mandatory.",
              "Path parameters must be configured in the headers."
            ];
            correct = ['a'];
            explanation = "Path parameters are positional variables embedded in the URL path. Query parameters appear in the trailing search string and are often optional filters.";
          } else if (t === 3) {
            prompt = `${dev} is troubleshooting CORS issues for ${proj}:\n\nWhich HTTP header is used by the server to list which client-origin web pages are permitted to perform cross-origin network operations?`;
            options = [
              "Access-Control-Allow-Origin",
              "Access-Control-Allow-Headers",
              "Access-Control-Allow-Credentials",
              "X-Origin-Verification-Header"
            ];
            correct = ['a'];
            explanation = "The 'Access-Control-Allow-Origin' CORS header specifies which domains are allowed to access API resources from a browser client.";
          } else if (t === 4) {
            prompt = `${dev} wants to build a robust endpoint for modifying ${proj} configurations:\n\nWhich HTTP method is designed for partial resource updates, whereas PUT is designed for full, idempotent replacement?`;
            options = ["PATCH", "POST", "UPDATE", "OPTIONS"];
            correct = ['a'];
            explanation = "The PATCH method is defined for partial resource updates. PUT replaces the entire resource representation (or creates it if it doesn't exist).";
          } else if (t === 5) {
            prompt = `${dev}'s client hit rate limits while polling ${proj}:\n\nWhich standard HTTP header conveys the number of permitted requests remaining in the current time-window?`;
            options = [
              "X-RateLimit-Remaining",
              "X-RateLimit-Limit",
              "X-RateLimit-Reset",
              "Retry-After"
            ];
            correct = ['a'];
            explanation = "The 'X-RateLimit-Remaining' non-standard but ubiquitous header informs the client how many API requests they have left before getting rate-limited.";
          } else if (t === 6) {
            prompt = `${dev} is parsing incoming request authentication blocks for ${proj}:\n\nIf the client supplies a standard Bearer authentication header, what is its expected format?`;
            options = [
              "Authorization: Bearer <token_string>",
              "Authorization: Token <token_string>",
              "X-Bearer-Token: <token_string>",
              "Authorization: <token_string>"
            ];
            correct = ['a'];
            explanation = "The OAuth 2.0 Bearer authorization pattern specifies the header key as 'Authorization' and value formatted exactly as 'Bearer <token_string>'.";
          } else if (t === 7) {
            prompt = `${dev} uses FastAPI dependency injection to fetch database sessions for ${proj}:\n\nIf a dependency is declared via \`Depends(get_db)\`, what is its execution lifecycle across multiple incoming HTTP requests?`;
            options = [
              "FastAPI executes the dependency handler on EVERY individual request and injects a fresh instance.",
              "FastAPI caches the dependency result globally on boot, sharing it across all requests forever.",
              "FastAPI spawns a persistent background thread to keep the session open indefinitely.",
              "The session must be manually closed inside each controller."
            ];
            correct = ['a'];
            explanation = "By default, FastAPI calls the dependency function (like opening a database session) on every request, clean-cleaning and closing it as the request scope resolves.";
          } else if (t === 8) {
            prompt = `Why does calling a blocking, non-async function like \`time.sleep(${j % 3 + 1})\` inside a FastAPI \`async def\` controller for ${proj} block the main event loop?`;
            options = [
              "FastAPI runs all 'async def' functions in a single-threaded event loop. A synchronous blocking call halts the loop, stalling concurrent request processing.",
              "Blocking functions can only run inside Flask, not FastAPI.",
              "Python handles blocking calls automatically by spinning up threads.",
              "The async event loop always redirects sleeping calls to the background."
            ];
            correct = ['a'];
            explanation = "An 'async def' handler executes on the main thread's event loop. It must only call 'awaitable' non-blocking routines. Synchronous blockages stop all other loop operations.";
          } else {
            prompt = `${dev} is overriding standard JSON serializers for ${proj}:\n\nWhy does a standard \`json.dumps()\` call raise a TypeError when serializing a Python \`set\` object?`;
            options = [
              "The standard JSON encoder has no built-in schema to serialize sets. It only supports basic types like list, dict, str, int, float, bool, and None.",
              "Sets are too big to represent in JSON arrays.",
              "Sets contain duplicate items that break JSON parsers.",
              "JSON files cannot support strings."
            ];
            correct = ['a'];
            explanation = "Standard JSON represents sequence containers as arrays (lists) or key-value structures (dicts). It doesn't recognize Python set structures natively.";
          }
        } else if (level === 'django') {
          tags = ['django', 'orm', 'migrations'];
          difficulty = 3;
          if (t === 0) {
            const price = j * 10;
            prompt = `${dev} queries ${proj} records using the Django ORM:\n\n\`\`\`python\nproducts = Product.objects.filter(price__gt=${price}).exclude(status="draft")\n\`\`\`\n\nWhen is this SQL query actually sent to and executed by the database?`;
            options = [
              "When the 'products' queryset is first evaluated (e.g., during loop iteration, slicing, or conversion to a list).",
              "Immediately on the line defining the query assignment.",
              "When the makemigrations tool compiles the models.",
              "Only when the server is restarted."
            ];
            correct = ['a'];
            explanation = "Django querysets are lazy. Assigning them does not touch the database; execution only occurs when the queryset is evaluated or iterated over.";
          } else if (t === 1) {
            prompt = `${dev} updates field attributes on a Django model for ${proj}:\n\nWhich Django management command translates declarative model changes into actual database schema ALTER TABLE SQL queries?`;
            options = ["migrate", "makemigrations", "sqlmigrate", "showmigrations"];
            correct = ['a'];
            explanation = "While 'makemigrations' writes the python migration files summarizing changes, the 'migrate' command runs those migrations as SQL schemas against the host database.";
          } else if (t === 2) {
            prompt = `${dev} hooks into model lifecycles for ${proj}:\n\nWhich Django receiver signal is triggered immediately after a model instance is successfully saved to the database?`;
            options = ["post_save", "pre_save", "post_init", "pre_delete"];
            correct = ['a'];
            explanation = "The 'post_save' signal is sent by Django immediately after a model instance is saved. It includes a 'created' boolean indicating if it was a new record.";
          } else if (t === 3) {
            prompt = `${dev} is setting up the Django Admin panel for ${proj}:\n\nWhich attribute of a \`ModelAdmin\` subclass defines which fields are visible as columns in the change-list view?`;
            options = ["list_display", "search_fields", "list_filter", "fields"];
            correct = ['a'];
            explanation = "The 'list_display' tuple/list specifies exactly which model fields are displayed as structured columns in the Django Admin change list.";
          } else if (t === 4) {
            prompt = `${dev} is writing custom logging middleware for ${proj}:\n\nWhat is the correct order of middleware execution in Django during the request-response lifecycle?`;
            options = [
              "Middleware is executed top-down on request, then bottom-up on response.",
              "Middleware is executed bottom-up on request, then top-down on response.",
              "Middleware is executed in random order determined by threads.",
              "Django processes request and response concurrently inside a single block."
            ];
            correct = ['a'];
            explanation = "Django's middleware stack acts like an onion. Requests travel top-down (as listed in MIDDLEWARE settings) and responses bubble back bottom-up.";
          } else if (t === 5) {
            prompt = `To avoid a critical N+1 database querying bottleneck in ${proj}, ${dev} fetches foreign key relations:\n\nWhich queryset modifier performs an SQL JOIN on the initial query, loading single-valued relationships in a single database round-trip?`;
            options = ["select_related", "prefetch_related", "annotate", "aggregate"];
            correct = ['a'];
            explanation = "'select_related' performs an SQL JOIN, fetching the related objects during the initial query. 'prefetch_related' does separate queries and joins them in Python, which is ideal for many-to-many fields.";
          } else if (t === 6) {
            prompt = `Inside a Django template for ${proj}, ${dev} renders: \`{{ text|default:"${j}" }}\`\n\nWhat is displayed if the variable \`text\` is an empty string?`;
            options = [`"${j}"`, "An empty string", "None", "TemplateSyntaxError"];
            correct = ['a'];
            explanation = "In Django templates, the 'default' filter returns the specified value if the variable evaluates to False, which includes empty strings and None.";
          } else if (t === 7) {
            prompt = `${dev} is implementing custom forms validation for ${proj}:\n\nWhat method should be defined in a Django Form subclass to clean and validate a specific field named \`email\`?`;
            options = ["clean_email()", "validate_email()", "check_email()", "clean_fields()"];
            correct = ['a'];
            explanation = "Django forms automatically look for methods matching 'clean_<fieldname>()' to validate and sanitize individual fields, returning the cleaned value.";
          } else if (t === 8) {
            prompt = `${dev} wants to ensure payments for ${proj} are fully ACID-compliant:\n\nWhich Django decorator guarantees that a block of database operations will be fully rolled back if an unhandled exception occurs?`;
            options = ["transaction.atomic", "transaction.rollback", "transaction.commit", "db.atomic"];
            correct = ['a'];
            explanation = "Wrapping operations in '@transaction.atomic' guarantees transaction integrity. If any error escapes, all database changes in that block are rolled back.";
          } else {
            prompt = `${dev} is setting up cache records under key \`"stats_${j}"\` in Django:\n\nWhich setting in \`settings.py\` defines which caching backend (e.g. Memcached or Redis) Django should route cache operations to?`;
            options = ["CACHES", "CACHE_BACKEND", "REDIS_CONFIG", "MIDDLEWARE"];
            correct = ['a'];
            explanation = "The 'CACHES' dictionary setting in settings.py defines the default and alternative caching engine backends, connection strings, and parameters.";
          }
        }
      }

      // ----------------------------------------------------
      // TRACK: AI & MACHINE LEARNING
      // ----------------------------------------------------
      else if (trackId === 'ai-ml') {
        if (level === 'beginner') {
          tags = ['ai-basics', 'ml'];
          difficulty = 1;
          if (t === 0) {
            prompt = `${dev} is setting up ${proj} to group unlabeled user logs:\n\nIs this process an example of supervised or unsupervised machine learning?`;
            options = ["Unsupervised Learning", "Supervised Learning", "Reinforcement Learning", "Semi-Supervised Learning"];
            correct = ['a'];
            explanation = "Unsupervised learning works on unlabeled dataset fields to find underlying patterns, associations, or structural groups (like K-Means clustering).";
          } else if (t === 1) {
            prompt = `${dev} tracks evaluation logs for ${proj}:\n\n- Training accuracy: ${95 + (j % 5)}%\n- Validation accuracy: ${50 + (j % 10)}%\n\nWhat modeling issue is currently affecting ${dev}'s pipeline?`;
            options = ["Overfitting", "Underfitting", "Vanishing Gradients", "High Bias"];
            correct = ['a'];
            explanation = "Overfitting occurs when a model performs exceptionally well on the training data but fails to generalize to validation/test sets.";
          } else if (t === 2) {
            prompt = `${dev} is splitting a dataset for ${proj}:\n\nWhat is the primary reason for keeping a separate 'test' dataset that is NEVER used during training or validation tuning?`;
            options = [
              "To obtain an unbiased estimate of the final model's generalization capabilities on completely unseen data.",
              "To speed up the gradient descent optimization loops.",
              "To provide few-shot prompt examples for the LLM.",
              "To reduce the number of features in the feature space."
            ];
            correct = ['a'];
            explanation = "The test set must remain pristine and untouched to provide an objective, real-world generalization performance score at the very end of the project.";
          } else if (t === 3) {
            const tp = (j % 10) + 10;
            const fp = (j % 5) + 2;
            prompt = `${dev} checks confusion metrics for ${proj}:\n\n- True Positives (TP): ${tp}\n- False Positives (FP): ${fp}\n\nWhat is the Precision of this model?`;
            const precision = tp / (tp + fp);
            const ansStr = (precision * 100).toFixed(1) + "%";
            options = [ansStr, "50.0%", "10.0%", "100.0%"];
            correct = ['a'];
            explanation = `Precision measures the accuracy of positive predictions, calculated as TP / (TP + FP). Here, ${tp} / (${tp} + ${fp}) results in ${ansStr}.`;
          } else if (t === 4) {
            const slope = (j % 5) + 1;
            const intercept = j % 10;
            prompt = `${dev} fits a linear regression equation for ${proj}:\n\ny = ${slope}x + ${intercept}\n\nIf the input feature \`x = 2\`, what is the predicted value of \`y\`?`;
            const predicted = slope * 2 + intercept;
            options = [String(predicted), String(slope + intercept), String(predicted * 2), "0"];
            correct = ['a'];
            explanation = `Linear regression calculates the output by multiplying the weight/slope (${slope}) by the feature value (2) and adding the intercept (${intercept}), resulting in ${predicted}.`;
          } else if (t === 5) {
            prompt = `${dev} formats categorical labels (e.g. "Cat", "Dog") for ${proj}:\n\nWhich encoding technique converts categorical variables into a series of binary (0 or 1) columns?`;
            options = ["One-Hot Encoding", "Label Encoding", "Standard Scaling", "MinMax Scaling"];
            correct = ['a'];
            explanation = "One-Hot Encoding represents categorical variables as binary vectors, avoiding fake ordinal relationships that standard label integer assignments create.";
          } else if (t === 6) {
            prompt = `${dev} tunes the 'K' parameter in a K-Nearest Neighbors classifier for ${proj}:\n\nWhat happens to the model's decision boundary as 'K' increases from 1 to a very large number?`;
            options = [
              "The decision boundary becomes smoother and simpler, reducing model variance but increasing bias.",
              "The decision boundary becomes highly complex, leading to overfitting.",
              "The boundary disappears completely.",
              "The boundary locks into a circular radius."
            ];
            correct = ['a'];
            explanation = "Larger values of 'K' average predictions over more neighbors, smoothing out local noise and creating a simpler, more robust decision boundary.";
          } else if (t === 7) {
            prompt = `${dev}'s model performs poorly on BOTH training and validation datasets, scoring under 45% accuracy:\n\nWhat modeling issue is occurring, and how can they address it?`;
            options = [
              "Underfitting. They should increase the model complexity, add more features, or train for more epochs.",
              "Overfitting. They should add L1/L2 regularization or increase dropout rates.",
              "Data leakage. They should separate the test set earlier.",
              "The data size is too large."
            ];
            correct = ['a'];
            explanation = "Underfitting means the model is too simple to capture the underlying data patterns. Increasing model capacity, adding features, or training longer helps resolve this.";
          } else if (t === 8) {
            prompt = `${dev} splits customers into ${j % 5 + 3} distinct marketing groups for ${proj}:\n\nWhich unsupervised algorithm is most standard for grouping data points based on spatial Euclidean proximity?`;
            options = ["K-Means Clustering", "Linear Regression", "Random Forest", "Support Vector Machines"];
            correct = ['a'];
            explanation = "K-Means is a centroid-based clustering algorithm that iteratively partitions data points into K clusters based on Euclidean distance.";
          } else {
            prompt = `${dev} is defining inputs and outputs for ${proj}:\n\nIn supervised machine learning datasets, what are the input variables and target outputs commonly called?`;
            options = [
              "Inputs are 'features' and outputs are 'labels' (or targets).",
              "Inputs are 'parameters' and outputs are 'weights'.",
              "Inputs are 'biases' and outputs are 'gradients'.",
              "Inputs are 'predictions' and outputs are 'losses'."
            ];
            correct = ['a'];
            explanation = "Features are the individual independent variables fed into the model. Labels are the dependent target values the model tries to predict.";
          }
        } else if (level === 'intermediate') {
          tags = ['ai-intermediate', 'networks'];
          difficulty = 2;
          if (t === 0) {
            const val = j - 50;
            prompt = `${dev} uses a ReLU activation function inside ${proj}:\n\nWhat is the mathematical output of \`ReLU(${val})\`?`;
            const ans = Math.max(0, val);
            options = [String(ans), "0", "-1.0", "1.0"];
            correct = [ans === 0 ? 'b' : 'a'];
            explanation = `The Rectified Linear Unit (ReLU) function is defined as f(x) = max(0, x). For input ${val}, the output is ${ans}.`;
          } else if (t === 1) {
            const slope = j % 5 + 1;
            prompt = `${dev} runs gradient descent weight updates for ${proj}:\n\n- Current weight (w) = 1.5\n- Learning rate (lr) = 0.1\n- Calculated Gradient = ${slope}\n\nWhat is the new updated weight?`;
            const updated = 1.5 - (0.1 * slope);
            options = [updated.toFixed(2), "1.5", "0.0", "1.0"];
            correct = ['a'];
            explanation = `Weight updates in gradient descent follow the formula: w_new = w - (learning_rate * gradient). Here, 1.5 - (0.1 * ${slope}) = ${updated.toFixed(2)}.`;
          } else if (t === 2) {
            prompt = `${dev} is comparing L1 (Lasso) and L2 (Ridge) regularization methods for ${proj}:\n\nWhy does L1 regularization tend to produce sparse models with many weights set exactly to zero?`;
            options = [
              "L1 applies a penalty proportional to the absolute values of the weights, forcing less important feature weights to drop to exactly zero.",
              "L1 applies a squared weight penalty that only shrinks weights slightly.",
              "L1 completely removes the bias term from the network.",
              "L1 can only be applied to logistic regression."
            ];
            correct = ['a'];
            explanation = "L1 regularization penalizes the absolute sum of weights (|w|). Due to the geometry of absolute penalties, it drives negligible weights to exactly zero, performing implicit feature selection.";
          } else if (t === 3) {
            prompt = `${dev} implements an ensemble classifier for ${proj}:\n\nWhat is the core distinction of Random Forests compared to a single Decision Tree?`;
            options = [
              "Random Forests combine multiple decision trees using bootstrap aggregating (bagging) to reduce prediction variance.",
              "Random Forests are faster to train than a single decision tree.",
              "Random Forests can only solve unsupervised clustering problems.",
              "Random Forests do not support numerical data types."
            ];
            correct = ['a'];
            explanation = "Random Forest is an ensemble method that trains hundreds of decision trees on random subsets of data and features, averaging predictions to reduce variance.";
          } else if (t === 4) {
            prompt = `${dev} is normalizing values for ${proj} using a MinMax Scaler:\n\nIf the data range is [0, 100], what does a feature value of ${j} scale to in the normalized range of [0, 1]?`;
            const scaled = j / 100;
            options = [scaled.toFixed(2), "0.50", "1.00", "0.00"];
            correct = ['a'];
            explanation = `MinMax Scaling follows: (x - min) / (max - min). Here, (${j} - 0) / (100 - 0) results in ${scaled.toFixed(2)}.`;
          } else if (t === 5) {
            const inputs = (j % 5) + 5;
            prompt = `${dev} calculates parameters for a single dense layer in ${proj}:\n\n- Input nodes = ${inputs}\n- Output nodes = 10\n\nHow many trainable weights (excluding biases) exist in this layer?`;
            const weights = inputs * 10;
            options = [String(weights), String(weights + 10), String(inputs + 10), "0"];
            correct = ['a'];
            explanation = `In a fully connected dense layer, each input node connects to every output node. The total number of weights is inputs (${inputs}) * outputs (10) = ${weights}.`;
          } else if (t === 6) {
            prompt = `${dev} notices early layers in a very deep network for ${proj} are updating extremely slowly during backpropagation:\n\nWhat is this standard deep-learning challenge called?`;
            options = ["Vanishing Gradients", "Exploding Gradients", "Overfitting", "Bias Drift"];
            correct = ['a'];
            explanation = "Vanishing gradients occur when small gradients multiply repeatedly through backpropagation layers, shrinking to near zero and stalling early layer updates.";
          } else if (t === 7) {
            prompt = `${dev} reviews the bias-variance tradeoff for ${proj}:\n\nWhich of the following describes a high-bias model?`;
            options = [
              "The model is overly simplified (underfitting) and fails to capture relations in the data.",
              "The model is extremely sensitive to training noise, leading to overfitting.",
              "The model has perfect training accuracy but poor validation performance.",
              "The model's weights have exploded to infinity."
            ];
            correct = ['a'];
            explanation = "High bias is synonymous with underfitting, where the model's structural assumptions are too rigid to fit the data.";
          } else if (t === 8) {
            prompt = `${dev} is setting up a Support Vector Machine (SVM) classifier for ${proj}:\n\nWhat role does the hyperparameter 'C' play in SVM training?`;
            options = [
              "It regulates the trade-off between maximizing the margin width and minimizing training classification errors.",
              "It directly controls the learning rate of the optimizer.",
              "It defines the number of clusters to partition.",
              "It specifies the degree of polynomial kernel scaling."
            ];
            correct = ['a'];
            explanation = "In SVM, 'C' is a regularization parameter. A large 'C' penalizes misclassifications heavily (narrower margin, fewer errors), whereas a small 'C' prioritizes a wider margin.";
          } else {
            prompt = `${dev} wants to reduce dimensions for ${proj} using Principal Component Analysis (PCA):\n\nWhat mathematical property does PCA maximize when projecting features onto lower-dimensional axes?`;
            options = ["Variance", "Entropy", "Loss", "Correlation"];
            correct = ['a'];
            explanation = "PCA projects the data onto orthogonal axes (principal components) that maximize the variance of the projected data points.";
          }
        } else if (level === 'advanced') {
          tags = ['attention', 'advanced-ml', 'transformers'];
          difficulty = 5;
          if (t === 0) {
            const dk = (j % 10) + 5;
            prompt = `${dev} is verifying the scale factor inside the Transformer Self-Attention mechanism for ${proj}:\n\nGiven key dimension d_k = ${dk}, why does the formula divide the query-key dot products by the square root of d_k?`;
            options = [
              "To prevent dot products from growing excessively large in magnitude, which would push the softmax function into regions with extremely small gradients.",
              "To normalize the inputs to a standard Gaussian range.",
              "To reduce the computational complexity of matrix multiplication.",
              "To act as a dropout regularizer."
            ];
            correct = ['a'];
            explanation = `Dividing by sqrt(d_k) (sqrt(${dk})) keeps dot product variances close to 1. Without scaling, dot products grow with d_k, pushing softmax into flat saturated zones with vanishing gradients.`;
          } else if (t === 1) {
            prompt = `Consider a cross-entropy loss calculation for ${proj} where a model is confident but completely wrong:\n\nIf the true label is class A, but the network outputs a confidence probability of near 0.0 for class A, what does the cross-entropy loss value approach?`;
            options = ["Positive Infinity", "0.0", "1.0", "Negative Infinity"];
            correct = ['a'];
            explanation = "Cross-entropy loss is proportional to -log(predicted_probability). Since -log(p) approaches positive infinity as p approaches 0, the loss becomes extremely large.";
          } else if (t === 2) {
            const rate = (j % 4 + 2) * 10;
            prompt = `${dev} applies a Dropout layer with a rate of 0.${rate} to a layer with 1000 neurons during training for ${proj}:\n\nOn average, how many neuron activations are randomly set to zero during each forward pass step?`;
            const zeroed = rate * 10;
            options = [String(zeroed), String(1000 - zeroed), "0", "1000"];
            correct = ['a'];
            explanation = `Dropout randomly zeroes out a specified percentage of activations during training. A rate of 0.${rate} means ${rate}% of the 1000 neurons (${zeroed}) are deactivated.`;
          } else if (t === 3) {
            prompt = `${dev} configures convolutional layers for ${proj}:\n\nWhat is the formula to calculate the output width (W_out) of a convolutional layer given input width W, kernel size K, padding P, and stride S?`;
            options = [
              "W_out = floor((W - K + 2P) / S) + 1",
              "W_out = (W * S) - K + P",
              "W_out = (W - K + P) / (2 * S)",
              "W_out = floor((W - K + P) / S) - 1"
            ];
            correct = ['a'];
            explanation = "The standard output dimension formula is W_out = floor((W - K + 2*P) / S) + 1. This accounts for boundary margins, padding extensions, and stride pacing.";
          } else if (t === 4) {
            prompt = `${dev} implements a Cosine Annealing learning rate scheduler for ${proj}:\n\nWhy are cosine decay schedulers popular in modern deep learning training loops?`;
            options = [
              "They decay the learning rate smoothly to zero, preventing abrupt weight adjustments and helping the model settle into clean local loss minima.",
              "They train networks twice as fast.",
              "They prevent the model from overfitting completely.",
              "They allow the model to use categorical features natively."
            ];
            correct = ['a'];
            explanation = "Cosine annealing smoothly scales the learning rate down following a cosine curve, ensuring stable convergence in the final phases of training.";
          } else if (t === 5) {
            prompt = `${dev} is modeling a Generative Adversarial Network (GAN) for ${proj}:\n\nWhat is the mathematical game-theoretic objective of the Generator and the Discriminator?`;
            options = [
              "A minimax two-player game where the Discriminator tries to maximize its classification accuracy, and the Generator tries to minimize it.",
              "A cooperative game where both networks maximize the validation accuracy.",
              "An unsupervised clustering game using PCA projection.",
              "A reinforcement learning loop using temporal difference targets."
            ];
            correct = ['a'];
            explanation = "GANs are formulated as a zero-sum minimax game where the Discriminator tries to maximize its ability to distinguish real/fake, while the Generator tries to trick it.";
          } else if (t === 6) {
            prompt = `${dev} uses Batch Normalization in ${proj}:\n\nDuring training, which metrics of the mini-batch are used to normalize the layer activations?`;
            options = [
              "The mean and variance of the current mini-batch activations.",
              "The global maximum and minimum weight values.",
              "The average loss score across the validation set.",
              "The gradient norm values."
            ];
            correct = ['a'];
            explanation = "Batch Normalization normalizes activations within each mini-batch by calculating and scaling with the mini-batch mean and variance, stabilizing training.";
          } else if (t === 7) {
            prompt = `${dev} is optimizing prompt sequences for ${proj}:\n\nHow does adding 'Let's think step by step' (Chain-of-Thought prompting) affect LLM reasoning accuracy?`;
            options = [
              "It directs the LLM to generate intermediate reasoning tokens, preventing logical shortcuts and improving composite multi-step task accuracy.",
              "It speeds up response times significantly.",
              "It reduces API token usage by 50%.",
              "It forces the model to use local files."
            ];
            correct = ['a'];
            explanation = "Chain-of-Thought forces the model to output a step-by-step reasoning path, letting subsequent predictions rely on correct intermediate derivations.";
          } else if (t === 8) {
            prompt = `${dev} evaluates RAG (Retrieval-Augmented Generation) and Fine-Tuning for ${proj}:\n\nWhat is the primary advantage of RAG over Fine-Tuning?`;
            options = [
              "RAG allows the model to reference real-time external databases without expensive re-training costs, reducing hallucinations regarding dynamic data.",
              "RAG optimizes the model's weight matrices directly.",
              "RAG is easier to deploy on smart toaster hardware.",
              "RAG guarantees 100% security clearance."
            ];
            correct = ['a'];
            explanation = "RAG queries dynamic external sources and injects the text into the context window, avoiding the massive cost and latency of retraining model weights.";
          } else {
            prompt = `${dev} is configuring an Adam optimizer for ${proj}:\n\nWhat two mathematical moments of the gradients does Adam track to scale learning rates per parameter?`;
            options = [
              "The exponential moving average of the gradients (first moment) and the squared gradients (second moment).",
              "The gradient norm and the validation loss.",
              "The weight vectors and the bias offsets.",
              "The learning rate scaling factor and the momentum coefficient."
            ];
            correct = ['a'];
            explanation = "Adam (Adaptive Moment Estimation) tracks both the moving average of gradients (momentum) and the moving average of squared gradients (AdaGrad scaling) to adapt step-sizes.";
          }
        }
      }

      // ----------------------------------------------------
      // TRACK: CLOUD COMPUTING
      // ----------------------------------------------------
      else if (trackId === 'cloud') {
        if (level === 'beginner') {
          tags = ['cloud-basics', 'infrastructure'];
          difficulty = 1;
          if (t === 0) {
            prompt = `${dev} is setting up redundancy for ${proj}:\n\nWhat is the distinction between a 'Region' and an 'Availability Zone' (AZ) in public cloud infrastructure?`;
            options = [
              "A Region is a geographic area containing multiple physically isolated and redundant Availability Zones (data centers) connected via low-latency fibers.",
              "An Availability Zone is a country, while a Region is a city.",
              "Regions are completely free, while Availability Zones are pay-as-you-go.",
              "They are identical terms with no structural difference."
            ];
            correct = ['a'];
            explanation = "A Region represents a geographic area. Deploying across multiple Availability Zones (AZs) inside that Region protects applications from isolated data center power/network failures.";
          } else if (t === 1) {
            prompt = `${dev} deploys server instances for ${proj}:\n\nWhich cloud service model does provisioning raw virtual machines (like AWS EC2 or Google Compute Engine) fall under?`;
            options = ["IaaS (Infrastructure as a Service)", "PaaS (Platform as a Service)", "SaaS (Software as a Service)", "FaaS (Function as a Service)"];
            correct = ['a'];
            explanation = "IaaS provides raw compute, storage, and networking resources, giving users maximum operating system-level control over their infrastructure.";
          } else if (t === 2) {
            prompt = `${dev} is configuring object storage buckets for ${proj}:\n\nWhy must cloud storage bucket names (e.g., AWS S3 or GCP Cloud Storage) be globally unique across ALL customer accounts?`;
            options = [
              "Because bucket names are exposed as part of a globally resolvable DNS endpoint URL (e.g. bucket-name.s3.amazonaws.com).",
              "Because the cloud provider only supports one bucket per region.",
              "To prevent CPU-bound caching overhead.",
              "It is a database limitation."
            ];
            correct = ['a'];
            explanation = "Since buckets are addressable directly via public HTTP/DNS endpoints, namespaces must be globally unique to prevent routing conflicts.";
          } else if (t === 3) {
            prompt = `${dev} reviews cloud compliance security rules for ${proj}:\n\nAccording to the Shared Responsibility Model, who is responsible for securing the physical hypervisor hardware, and who is responsible for securing user data?`;
            options = [
              "The cloud provider secures the underlying physical host infrastructure, while the user secures their own applications and operating system data.",
              "The cloud provider secures everything, including user passwords.",
              "The user secures physical fiber cables, while the provider secures databases.",
              "Both responsibilities are outsourced to third-party proctors."
            ];
            correct = ['a'];
            explanation = "The provider is responsible for security 'of' the cloud (hardware, physical security, virtualization), while the customer handles security 'in' the cloud (data, IAM, OS configs).";
          } else if (t === 4) {
            prompt = `${dev} wants to optimize deployment billing budgets for ${proj}:\n\nWhat is the primary benefit of pay-as-you-go cloud pricing compared to traditional on-premise hardware purchasing?`;
            options = [
              "It shifts capital expenditure (CapEx) on hardware into variable operational expenditure (OpEx), reducing upfront start-up costs.",
              "It makes the system completely immune to regional power outages.",
              "It automatically fixes database migration syntax errors.",
              "It allows developers to bypass least-privilege IAM rules."
            ];
            correct = ['a'];
            explanation = "Variable operational pricing (OpEx) lets startups scale resources dynamically to match traffic demand without purchasing expensive on-premise servers.";
          } else if (t === 5) {
            prompt = `${dev} is scaling compute resources for ${proj}:\n\nWhat is the difference between 'Vertical Scaling' (Scale Up) and 'Horizontal Scaling' (Scale Out)?`;
            options = [
              "Vertical scaling increases the CPU/RAM capacity of a single server, while Horizontal scaling adds more independent server instances to a pool.",
              "Vertical scaling is only for databases, while horizontal scaling is for file storage.",
              "Vertical scaling is slow, while horizontal scaling is completely free.",
              "There is no difference."
            ];
            correct = ['a'];
            explanation = "Vertical scaling upgrades an existing server's resources. Horizontal scaling scales out by distributing traffic across multiple smaller servers behind a load balancer.";
          } else if (t === 6) {
            prompt = `${dev} sets up DNS records to route web traffic to ${proj}:\n\nWhich type of DNS record maps a domain name directly to a static IPv4 address?`;
            options = ["A Record", "CNAME Record", "MX Record", "TXT Record"];
            correct = ['a'];
            explanation = "An 'A' (Address) record maps a hostname directly to a physical 32-bit IPv4 address.";
          } else if (t === 7) {
            prompt = `${dev} is optimizing static media asset deliveries for ${proj}:\n\nWhich cloud service caches static content at geographically distributed 'edge' locations closer to users?`;
            options = ["CDN (Content Delivery Network)", "VPC (Virtual Private Cloud)", "IAM", "NAT Gateway"];
            correct = ['a'];
            explanation = "CDNs store copies of static assets (images, videos, styles) at edge nodes close to users, reducing page latency and offloading traffic from origin servers.";
          } else if (t === 8) {
            prompt = `${dev} configures user authentication permissions for ${proj}:\n\nWhat is the foundational security concept of 'Least Privilege' in Cloud IAM?`;
            options = [
              "Granting users only the minimum necessary permissions required to perform their specific job tasks, and nothing more.",
              "Giving all developers admin privileges to speed up staging releases.",
              "Enforcing complex passwords that rotate every 24 hours.",
              "Blocking all incoming HTTP ports."
            ];
            correct = ['a'];
            explanation = "Least privilege restricts user permissions strictly to what is required for their role, minimizing potential damage from credential leaks or accidental errors.";
          } else {
            prompt = `${dev} is defining auto-scaling characteristics for ${proj}:\n\nWhat cloud capability refers to automatically adjusting resources dynamically to match real-time load changes?`;
            options = ["Elasticity", "Redundancy", "Durability", "Consensus"];
            correct = ['a'];
            explanation = "Elasticity is the cloud's capacity to scale down and scale up resources automatically in response to current utilization rates.";
          }
        } else if (level === 'intermediate') {
          tags = ['vpc', 'networking', 'iam'];
          difficulty = 3;
          if (t === 0) {
            prompt = `${dev} allocates subnets for ${proj} inside a custom VPC:\n\nHow many usable host IP addresses exist in a standard '/24' CIDR subnet block in AWS or GCP?`;
            options = ["251 to 254", "256", "128", "512"];
            correct = ['a'];
            explanation = "A /24 block provides 256 total IP addresses, but cloud providers reserve 5 IPs (e.g., AWS reserves network, router, DNS, lease, and broadcast IPs) leaving 251 usable IPs (GCP leaves 254).";
          } else if (t === 1) {
            prompt = `${dev} writes a JSON IAM permission policy for ${proj}:\n\nWhich three foundational JSON blocks are required inside an IAM statement rule?`;
            options = [
              "Effect, Action, Resource",
              "User, Group, Role",
              "Port, Protocol, IP",
              "Bucket, Key, Metadata"
            ];
            correct = ['a'];
            explanation = "An IAM statement must specify the 'Effect' (Allow/Deny), the 'Action' (e.g., s3:GetObject), and the target 'Resource' ARN/ID.";
          } else if (t === 2) {
            prompt = `${dev} is configuring a Load Balancer to route API requests to ${proj}:\n\nWhy would they enable 'Session Stickiness' (Session Affinity) on the load balancer?`;
            options = [
              "To route subsequent client requests to the same backend server instance, which is necessary if the application keeps state locally in memory.",
              "To encrypt all database transactions automatically.",
              "To speed up DNS propagation times.",
              "To prevent overlapping VPC Peering conflicts."
            ];
            correct = ['a'];
            explanation = "Sticky sessions ensure a client keeps communicating with the same backend server, avoiding issues when session data is stored in server RAM instead of a shared cache.";
          } else if (t === 3) {
            const utilization = (j % 10) + 65;
            prompt = `${dev} configures an Autoscaling Group policy for ${proj}:\n\nIf the rule is set to scale out when CPU utilization exceeds ${utilization}%, what event occurs if CPU load hits ${utilization + 10}% for 10 minutes?`;
            options = [
              "The autoscaling engine launches new compute instances and adds them to the load balancer pool.",
              "The system halts all background processes.",
              "A database rollback is triggered.",
              "The server's vertical resources are upgraded."
            ];
            correct = ['a'];
            explanation = "Autoscaling groups monitor metrics and spin up additional horizontal instances when thresholds are breached to distribute traffic and maintain performance.";
          } else if (t === 4) {
            prompt = `${dev} is choosing a database engine for ${proj}:\n\nWhat is a key difference between AWS RDS (Relational Database Service) and DynamoDB?`;
            options = [
              "RDS provides a managed SQL database supporting complex joins, while DynamoDB is a fully-managed scale-out NoSQL key-value store.",
              "RDS is serverless, while DynamoDB requires manual OS patching.",
              "RDS can only handle up to 100 entries.",
              "They are identical SQL engines."
            ];
            correct = ['a'];
            explanation = "RDS is a managed service for traditional relational databases (PostgreSQL, MySQL). DynamoDB is an elastic, highly performant NoSQL document database built for horizontal scaling.";
          } else if (t === 5) {
            prompt = `${dev} deploys serverless functions to process backend logs for ${proj}:\n\nWhat is a primary operational disadvantage of serverless functions (like AWS Lambda or GCP Cloud Functions)?`;
            options = [
              "Cold starts (latency on initial container spin-up) and execution time limits.",
              "Manual operating system patching requirements.",
              "High capital expenditure costs.",
              "They do not support Python scripts."
            ];
            correct = ['a'];
            explanation = "Serverless functions are stateless and shut down when idle. The next invocation triggers a 'cold start' as a new container is provisioned, creating latency spikes.";
          } else if (t === 6) {
            prompt = `${dev} configures cloud security boundaries for ${proj}:\n\nWhat is the distinction between a 'Security Group' and a 'Network Access Control List' (NACL)?`;
            options = [
              "Security Groups are stateful firewalls operating at the instance level, whereas NACLs are stateless firewalls operating at the subnet level.",
              "Security Groups are stateless, while NACLs are stateful.",
              "Security Groups only block outgoing traffic, while NACLs only block incoming traffic.",
              "They are completely identical."
            ];
            correct = ['a'];
            explanation = "Security groups are stateful (if you allow an incoming request, the return response is automatically allowed). Subnet NACLs are stateless and require explicit incoming/outgoing rules.";
          } else if (t === 7) {
            prompt = `${dev} needs to link an on-premise corporate office securely to a custom VPC for ${proj}:\n\nWhich cloud service establishes an encrypted private tunnel over the public internet?`;
            options = ["Site-to-Site VPN", "Direct Connect / Dedicated Interconnect", "VPC Peering", "NAT Gateway"];
            correct = ['a'];
            explanation = "A Site-to-Site VPN creates an encrypted IPsec tunnel over the public internet to bridge local networks securely with a Virtual Private Cloud.";
          } else if (t === 8) {
            prompt = `${dev} is adopting Infrastructure as Code (IaC) to configure ${proj}:\n\nWhat is the core benefit of writing infrastructure declarations (e.g. Terraform or CloudFormation) in code?`;
            options = [
              "It allows infrastructure to be version-controlled, audited, easily duplicated, and deployed programmatically with zero manual clicks.",
              "It automatically fixes runtime application bugs.",
              "It makes server hosting completely free.",
              "It speeds up physical network latency."
            ];
            correct = ['a'];
            explanation = "IaC provides a declarative blueprint of your cloud environment, making it repeatable, versionable, and secure while eliminating manual configuration mistakes.";
          } else {
            prompt = `${dev} wants to configure high availability read capacity for ${proj}:\n\nHow do database 'Read Replicas' improve performance?`;
            options = [
              "They allow read queries to execute against duplicated read-only instances, freeing up write capacity on the primary master database.",
              "They mirror writes synchronously to ensure zero database data loss.",
              "They automatically clean out idle database rows.",
              "They compress table columns."
            ];
            correct = ['a'];
            explanation = "Read replicas receive asynchronous updates from the master. Routing search/read queries to replicas reduces load on the write-active master database.";
          }
        } else if (level === 'advanced') {
          tags = ['high-availability', 'advanced-cloud', 'kubernetes'];
          difficulty = 5;
          if (t === 0) {
            prompt = `${dev} is designing a multi-region active-passive disaster recovery failover system for ${proj}:\n\nWhat is the distinction between RTO (Recovery Time Objective) and RPO (Recovery Point Objective)?`;
            options = [
              "RTO is the target duration of time to restore service after an outage, whereas RPO is the maximum age of data that can be lost from backup logs.",
              "RTO is for database logs, while RPO is for static edge assets.",
              "RTO must always be zero, while RPO must always be positive.",
              "They are identical metrics measuring server startup times."
            ];
            correct = ['a'];
            explanation = "RTO defines how fast you must recover the system (uptime clock). RPO defines the data threshold (how many minutes/hours of database writes you can afford to lose).";
          } else if (t === 1) {
            prompt = `${dev} is peering VPC A (CIDR block 10.0.0.0/16) and VPC B (CIDR block 10.0.0.0/16) to share logs for ${proj}:\n\nWhat happens when they attempt to establish this VPC Peering connection?`;
            options = [
              "The connection fails because overlapping CIDR IP ranges make it impossible to route network packets unambiguously.",
              "The cloud provider automatically translates and merges the IP addresses.",
              "The connection succeeds, but all servers gain identical IP addresses.",
              "The routing is handled via physical fiber lines."
            ];
            correct = ['a'];
            explanation = "VPC Peering requires that the peered VPC networks have completely non-overlapping CIDR IP ranges. Overlapping ranges create routing ambiguity, causing the setup to fail.";
          } else if (t === 2) {
            prompt = `${dev} is configuring Kubernetes pod placements across nodes for ${proj}:\n\nWhat is the difference between a 'Taint' (on a Node) and an 'Affinity' (on a Pod)?`;
            options = [
              "Taints allow a Node to repel certain Pods unless they have matching tolerations, whereas Affinity attracts a Pod to specific Nodes based on labels.",
              "Taints are for database pods, while Affinity is for web pods.",
              "Taints are stateless, while Affinity is stateful.",
              "There is no functional difference."
            ];
            correct = ['a'];
            explanation = "Nodes use Taints to restrict which pods can bind to them. Pods use Node Affinity or Pod Anti-Affinity rules to declare placement preferences across nodes.";
          } else if (t === 3) {
            prompt = `${dev} runs a Terraform deployment pipeline for ${proj} in a shared CI/CD environment:\n\nWhy is configuring a backend state-locking mechanism (like DynamoDB or Consul) critical?`;
            options = [
              "To prevent concurrent pipeline runs from executing plans simultaneously, which would corrupt or overwrite the Terraform state file.",
              "To encrypt database passwords in transit.",
              "To make the compiled Go binary run faster.",
              "To allow developers to modify resources manually."
            ];
            correct = ['a'];
            explanation = "Distributed lock managers prevent two users or automated runs from modifying the central state file concurrently, avoiding corrupted infrastructure mappings.";
          } else if (t === 4) {
            prompt = `${dev} initiates a wildcard global cache purge on their CDN edge endpoints for ${proj}:\n\nWhat is a major trade-off of issuing frequent wildcard cache invalidations across a global CDN?`;
            options = [
              "High computational cost and massive edge traffic spikes on origin servers (cache stampede) as edge nodes fetch raw resources again.",
              "The CDN completely halts all static routing.",
              "Edge caches are permanently locked.",
              "A DNS propagation delay is triggered."
            ];
            correct = ['a'];
            explanation = "Forcing edge nodes to purge static files means subsequent user requests hit your origin servers directly, risking heavy backend resource exhaustion.";
          } else if (t === 5) {
            const discPercent = (j % 15) + 20;
            prompt = `${dev} is optimizing multi-region cloud expenses for ${proj}:\n\nHow do purchasing Committed Use Discounts (CUDs) or Reserved Instances reduce costs by ${discPercent}%?`;
            options = [
              "They guarantee payment for a set amount of compute capacity for a 1-year or 3-year term in exchange for a heavily reduced hourly rate.",
              "They automatically shut down idle server containers.",
              "They optimize database query JOIN filters.",
              "They bypass standard VAT/tax collections."
            ];
            correct = ['a'];
            explanation = "Reserving compute capacity for long terms provides massive discounts over standard on-demand pricing, which is ideal for baseline workload projections.";
          } else if (t === 6) {
            prompt = `${dev} configures a Kubernetes Service resource to expose an API for ${proj}:\n\nWhich service type provisions a cloud-provider Layer 4 load balancer automatically to route traffic directly into the cluster?`;
            options = ["LoadBalancer", "ClusterIP", "NodePort", "ExternalName"];
            correct = ['a'];
            explanation = "Exposing a service via 'LoadBalancer' tells the underlying cloud integration agent to provision a physical cloud load balancer (like AWS NLB/ALB or GCP Network LB).";
          } else if (t === 7) {
            const nodes = j % 2 === 0 ? j + 3 : j + 2;
            prompt = `${dev} builds a highly available distributed database cluster for ${proj} containing ${nodes} active nodes:\n\nAccording to distributed consensus algorithms (like Raft or Paxos), what is the minimum number of online nodes required to maintain a healthy quorum?`;
            const quorum = Math.floor(nodes / 2) + 1;
            options = [String(quorum), String(nodes - 1), "2", String(nodes)];
            correct = ['a'];
            explanation = `Distributed consensus requires a strict majority of nodes to operate, calculated as floor(N/2) + 1. For a cluster of ${nodes} nodes, the quorum size is ${quorum}.`;
          } else if (t === 8) {
            prompt = `${dev} transitions the architecture of ${proj} to a 'Zero Trust' security model:\n\nWhat is a core tenet of Zero Trust architectures?`;
            options = [
              "Removing default inside-the-network trust assumptions, requiring authentication and least-privilege verification for every single request regardless of origin.",
              "Removing all firewall security rules completely.",
              "Outsourcing all code reviews to anonymous git users.",
              "Exposing raw database ports to the open internet."
            ];
            correct = ['a'];
            explanation = "Zero Trust assumes threat vectors exist both inside and outside. It treats network perimeters as untrusted, validating every access request dynamically.";
          } else {
            prompt = `${dev} plans a large-scale cloud migration strategy for ${proj}:\n\nWhich pattern represents 'Rehosting' (Lift and Shift)?`;
            options = [
              "Moving existing virtual machine disk images directly to cloud compute instances with minimal or no architectural changes.",
              "Completely rewriting the application to use serverless functions.",
              "Replacing custom code with standard commercial SaaS services.",
              "None of the above."
            ];
            correct = ['a'];
            explanation = "Rehosting copies existing application VMs directly to cloud providers without code refactoring, which is fast to execute but misses cloud-native scalability features.";
          }
        }
      }

      // Safe option mapping
      const mappedOptions = options.length > 0 ? makeOptions(options) : undefined;

      // Construct final Question object
      questions.push({
        _id: `gen_${trackId}_${level}_${globalIdx + 1}`,
        trackId,
        level,
        topicTags: tags.length > 0 ? tags : [level],
        type,
        prompt,
        options: mappedOptions,
        correctOptionIds: correct,
        difficulty,
        explanation,
        version: 1,
        active: true,
        createdBy: 'procedural_generator',
        createdAt: new Date().toISOString()
      });
    }
  }

  return questions;
}
