import { Question, TrackSlug, SkillLevel } from '../types';

interface QuestionTemplate {
  prompt: string;
  options?: string[]; // Empty or undefined for fill-blank
  correct: string[];  // Option ids or correct string answers
  explanation: string;
  type: 'mcq' | 'multi' | 'code-output' | 'fill-blank';
  difficulty: number;
  tags: string[];
}

const TEMPLATES: Record<TrackSlug, Partial<Record<SkillLevel, QuestionTemplate[]>>> = {
  python: {
    beginner: [
      {
        prompt: "What is the default return value of a Python function that does not contain a return statement?",
        options: ["0", "False", "None", "void"],
        correct: ["c"],
        explanation: "In Python, functions without an explicit return statement return 'None' by default.",
        type: "mcq",
        difficulty: 1,
        tags: ["functions", "basics"]
      },
      {
        prompt: "Which of the following creates a dictionary in Python?",
        options: ["d = {}", "d = []", "d = ()", "d = set()"],
        correct: ["a"],
        explanation: "Curly braces `{}` are used to define a dictionary literal (or a set if elements are provided without keys).",
        type: "mcq",
        difficulty: 1,
        tags: ["dictionaries", "basics"]
      },
      {
        prompt: "What is the output of 'print(type(1.0))' in Python?",
        options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "<class 'decimal'>"],
        correct: ["b"],
        explanation: "Python represents real numbers with double-precision floating-point numbers, belonging to the 'float' class.",
        type: "mcq",
        difficulty: 1,
        tags: ["types", "basics"]
      },
      {
        prompt: "What is the value of the expression '5 // 2' in Python?",
        options: ["2.5", "2", "3", "2.0"],
        correct: ["b"],
        explanation: "The double slash '//' represents floor division, which divides the numbers and rounds down to the nearest integer.",
        type: "mcq",
        difficulty: 1,
        tags: ["operators", "basics"]
      },
      {
        prompt: "Which of these string methods checks if all characters in the string are numeric?",
        options: ["isnumeric()", "isdigit()", "isdecimal()", "all of the above"],
        correct: ["d"],
        explanation: "In Python, isnumeric(), isdigit(), and isdecimal() all check numeric qualities of string characters with slight differences regarding Unicode, but all check numeric characters.",
        type: "mcq",
        difficulty: 2,
        tags: ["strings", "methods"]
      },
      {
        prompt: "What does print('Python'[::-1]) output?",
        options: ["Python", "nohtyP", "P", "n"],
        correct: ["b"],
        explanation: "The slice syntax '[::-1]' reverses a sequence like a string or list.",
        type: "mcq",
        difficulty: 2,
        tags: ["strings", "slicing"]
      },
      {
        prompt: "How do you insert an element at the beginning of a list named 'my_list'?",
        options: ["my_list.append(item)", "my_list.push(item)", "my_list.insert(0, item)", "my_list.prepend(item)"],
        correct: ["c"],
        explanation: "The insert method takes the index as the first argument. 'insert(0, item)' inserts 'item' at the front of the list.",
        type: "mcq",
        difficulty: 2,
        tags: ["lists", "methods"]
      },
      {
        prompt: "Which of the following keywords is used to define an anonymous function in Python?",
        options: ["def", "func", "lambda", "anonymous"],
        correct: ["c"],
        explanation: "The 'lambda' keyword is used to create small, anonymous (unnamed) functions on the fly.",
        type: "mcq",
        difficulty: 1,
        tags: ["lambda", "functions"]
      },
      {
        prompt: "What is the result of 'set([1, 2, 2, 3])'?",
        options: ["{1, 2, 2, 3}", "[1, 2, 3]", "{1, 2, 3}", "(1, 2, 3)"],
        correct: ["c"],
        explanation: "Passing an iterable to 'set()' removes duplicate values and returns a set, denoted by curly braces.",
        type: "mcq",
        difficulty: 1,
        tags: ["sets", "collections"]
      },
      {
        prompt: "What is the output of the following Python operation?\n\n`print('a' in {'a': 1, 'b': 2})`",
        options: ["True", "False", "1", "TypeError"],
        correct: ["a"],
        explanation: "The 'in' operator checks for key membership in a dictionary, which in this case is 'True'.",
        type: "mcq",
        difficulty: 1,
        tags: ["dictionaries", "membership"]
      },
      {
        prompt: "How do you start a single line comment in Python?",
        options: ["//", "/*", "#", "--"],
        correct: ["c"],
        explanation: "Hash characters '#' are used to designate single-line comments in Python.",
        type: "mcq",
        difficulty: 1,
        tags: ["syntax", "comments"]
      },
      {
        prompt: "Which built-in function returns the absolute value of a number?",
        options: ["abs()", "absolute()", "val()", "ceil()"],
        correct: ["a"],
        explanation: "The 'abs()' function returns the absolute magnitude/value of any integer or float parameter.",
        type: "mcq",
        difficulty: 1,
        tags: ["functions", "basics"]
      },
      {
        prompt: "Which keyword can be used to skip the rest of the current loop iteration?",
        options: ["break", "continue", "pass", "skip"],
        correct: ["b"],
        explanation: "'continue' immediately stops the current iteration and jumps to the next iteration of the loop.",
        type: "mcq",
        difficulty: 1,
        tags: ["loops", "control"]
      },
      {
        prompt: "What is the output of 'print(len(range(5)))'?",
        options: ["4", "5", "6", "infinite"],
        correct: ["b"],
        explanation: "'range(5)' yields values from 0 to 4 inclusive, which is a sequence of length 5.",
        type: "mcq",
        difficulty: 1,
        tags: ["functions", "range"]
      },
      {
        prompt: "Which of the following functions generates a random integer?",
        options: ["random.rand()", "random.integer()", "random.randint()", "random.choice()"],
        correct: ["c"],
        explanation: "'random.randint(a, b)' generates a random integer in the range [a, b] inclusive.",
        type: "mcq",
        difficulty: 2,
        tags: ["random", "modules"]
      },
      {
        prompt: "What is the result of 'float('3.14')' in Python?",
        options: ["3", "3.14", "TypeError", "'3.14'"],
        correct: ["b"],
        explanation: "The float constructor parses numeric strings into decimal floating-point representations.",
        type: "mcq",
        difficulty: 1,
        tags: ["types", "casting"]
      },
      {
        prompt: "Which command-line argument can print Python's version?",
        options: ["python -v", "python --version", "python -version", "python -info"],
        correct: ["b"],
        explanation: "The argument '--version' (or capital '-V') prints the current Python interpreter installation version.",
        type: "mcq",
        difficulty: 1,
        tags: ["cli", "basics"]
      },
      {
        prompt: "What is the output of print('hello'.upper())?",
        options: ["hello", "Hello", "HELLO", "none"],
        correct: ["c"],
        explanation: "The upper() string method converts all alphabetic characters in a string to uppercase.",
        type: "mcq",
        difficulty: 1,
        tags: ["strings", "methods"]
      },
      {
        prompt: "Which keyword is used to handle exceptions caught in a try block?",
        options: ["catch", "except", "error", "throw"],
        correct: ["b"],
        explanation: "Python uses 'except' to define exception handling routines, unlike JavaScript/C++ which use 'catch'.",
        type: "mcq",
        difficulty: 1,
        tags: ["exceptions", "error-handling"]
      },
      {
        prompt: "Which value is considered 'Falsy' in a boolean test in Python?",
        options: ["0", "None", "[] (empty list)", "All of the above"],
        correct: ["d"],
        explanation: "In Python, 0, None, empty collections (list, dict, set, tuple, string) are all evaluated as False in a boolean context.",
        type: "mcq",
        difficulty: 1,
        tags: ["boolean", "truthiness"]
      }
    ],
    intermediate: [
      {
        prompt: "What is the primary difference between a list and a tuple in Python?",
        options: ["Lists are ordered, Tuples are unordered", "Lists are mutable, Tuples are immutable", "Lists cannot hold duplicates, Tuples can", "Lists use parentheses, Tuples use brackets"],
        correct: ["b"],
        explanation: "Lists are mutable (can be changed after creation), whereas Tuples are immutable.",
        type: "mcq",
        difficulty: 2,
        tags: ["lists", "tuples"]
      },
      {
        prompt: "What is the purpose of the 'with' statement in Python?",
        options: ["To define inline classes", "To establish conditional loop blocks", "To simplify exception handling and resource cleanup", "To import modules dynamically"],
        correct: ["c"],
        explanation: "The 'with' statement is a context manager that ensures assets are cleaned up (like files closed) even if errors occur.",
        type: "mcq",
        difficulty: 2,
        tags: ["context-managers", "files"]
      },
      {
        prompt: "What is the output of print([x for x in range(5) if x % 2 == 0])?",
        options: ["[0, 2, 4]", "[2, 4]", "[1, 3]", "[0, 1, 2, 3, 4]"],
        correct: ["a"],
        explanation: "This list comprehension loops from 0 to 4, filtering for elements whose remainder is 0 when divided by 2.",
        type: "code-output",
        difficulty: 2,
        tags: ["comprehensions", "syntax"]
      },
      {
        prompt: "In function definitions, what does the operator '*args' represent?",
        options: ["A list of keyword arguments", "A tuple of positional arguments", "A pointer to variable addresses", "An array multiplier variable"],
        correct: ["b"],
        explanation: "The '*args' parameter pack captures any additional positional arguments as a tuple.",
        type: "mcq",
        difficulty: 2,
        tags: ["functions", "arguments"]
      },
      {
        prompt: "How do you create a shallow copy of a list named 'lst'?",
        options: ["lst.copy()", "lst[:]", "list(lst)", "All of the above"],
        correct: ["d"],
        explanation: "All of the listed methods return a new shallow copy of 'lst' containing the same elements.",
        type: "mcq",
        difficulty: 3,
        tags: ["lists", "cloning"]
      },
      {
        prompt: "What exception is raised when trying to look up a non-existent key in a dictionary?",
        options: ["IndexError", "LookupError", "KeyError", "ValueError"],
        correct: ["c"],
        explanation: "Looking up an absent key using brackets raises a KeyError. Using `.get()` returns None instead of raising an error.",
        type: "mcq",
        difficulty: 2,
        tags: ["dictionaries", "exceptions"]
      },
      {
        prompt: "Which keyword is used in a function to yield values incrementally instead of returning a static list?",
        options: ["yield", "return", "generate", "async"],
        correct: ["a"],
        explanation: "The 'yield' keyword turns a regular function into a generator that returns a lazy-evaluated iterator.",
        type: "mcq",
        difficulty: 3,
        tags: ["generators", "functions"]
      },
      {
        prompt: "What does the expression 'lambda x, y: x * y' define?",
        options: ["A recursive algorithm", "An anonymous inline function", "A class descriptor pattern", "A string formatting procedure"],
        correct: ["b"],
        explanation: "The 'lambda' syntax defines inline, anonymous functions with a single return expression.",
        type: "mcq",
        difficulty: 2,
        tags: ["lambda", "functional"]
      },
      {
        prompt: "What is the correct syntax for a decorator that prints 'Start' before execution of a function?",
        options: [
          "def dec(f):\n    def wrap():\n        print('Start')\n        return f()\n    return wrap",
          "def dec(f):\n    print('Start')\n    return f",
          "decorator dec(f):\n    print('Start')",
          "def dec(f):\n    return print('Start') + f"
        ],
        correct: ["a"],
        explanation: "A decorator takes a function, declares a wrapper inner function containing hook logic, and returns that inner function.",
        type: "mcq",
        difficulty: 3,
        tags: ["decorators", "advanced"]
      },
      {
        prompt: "What function can combine two lists element-by-element into tuples?",
        options: ["combine()", "merge()", "zip()", "concat()"],
        correct: ["c"],
        explanation: "The 'zip()' function accepts multiple iterables and yields tuples grouping their corresponding parallel items.",
        type: "mcq",
        difficulty: 2,
        tags: ["built-ins", "collections"]
      },
      {
        prompt: "What is the output of print(type((x for x in range(3))))?",
        options: ["<class 'list'>", "<class 'tuple'>", "<class 'generator'>", "<class 'iterator'>"],
        correct: ["c"],
        explanation: "Parentheses in a comprehension create a generator expression, which produces a generator object.",
        type: "code-output",
        difficulty: 3,
        tags: ["generators", "types"]
      },
      {
        prompt: "Which built-in module is used to work with regular expressions in Python?",
        options: ["re", "regex", "regexp", "match"],
        correct: ["a"],
        explanation: "The 're' module provides regular expression matching, searching, and splitting patterns.",
        type: "mcq",
        difficulty: 2,
        tags: ["regex", "modules"]
      },
      {
        prompt: "What is the purpose of '__slots__' in a custom Python class?",
        options: ["To define private attributes", "To prevent subclassing", "To limit dynamic property creations and optimize memory", "To declare class-level database fields"],
        correct: ["c"],
        explanation: "'__slots__' defines a static list of allowable instance attributes, bypassing '__dict__' to optimize memory footprint.",
        type: "mcq",
        difficulty: 3,
        tags: ["oop", "optimization"]
      },
      {
        prompt: "How does the 'finally' block behave in error handling?",
        options: ["Executes only on success", "Executes only when exceptions are raised", "Executes always, regardless of success or failure", "Aborts program execution immediately"],
        correct: ["c"],
        explanation: "The 'finally' block is guaranteed to execute at the end of a try/except chain, making it perfect for cleanup tasks.",
        type: "mcq",
        difficulty: 2,
        tags: ["exceptions", "error-handling"]
      },
      {
        prompt: "What is the result of '1 == 1.0' in Python?",
        options: ["True", "False", "TypeError", "None"],
        correct: ["a"],
        explanation: "Python performs implicit numeric coercion. Even though they are different types, 1 and 1.0 are mathematically equivalent.",
        type: "mcq",
        difficulty: 2,
        tags: ["boolean", "operators"]
      },
      {
        prompt: "What is the output of print(' '.join(['a', 'b', 'c']))?",
        options: ["'a b c'", "'abc'", "['a', 'b', 'c']", "TypeError"],
        correct: ["a"],
        explanation: "The string method 'join()' concatenates iterable strings using the host string as the separator.",
        type: "code-output",
        difficulty: 2,
        tags: ["strings", "methods"]
      },
      {
        prompt: "Which built-in function returns a sorted list of elements from any iterable?",
        options: ["list.sort()", "sorted()", "order()", "arrange()"],
        correct: ["b"],
        explanation: "'sorted()' is a global built-in function returning a new sorted list, whereas 'list.sort()' alters lists in place.",
        type: "mcq",
        difficulty: 2,
        tags: ["sorting", "basics"]
      },
      {
        prompt: "What is the output of printing the length of set('hello')?",
        options: ["5", "4", "3", "TypeError"],
        correct: ["b"],
        explanation: "A set only permits distinct values. 'hello' contains 'h', 'e', 'l', 'l', 'o'. The duplicate 'l' is dropped, leaving 4 characters.",
        type: "code-output",
        difficulty: 2,
        tags: ["sets", "collections"]
      },
      {
        prompt: "What does the 'pass' statement do in Python?",
        options: ["Exits from functions", "Bypasses loop conditions", "Acts as a syntactic placeholder that does absolutely nothing", "Prints debugging symbols"],
        correct: ["c"],
        explanation: "'pass' is a null-operation statement used when the syntax requires a block but no code needs execution.",
        type: "mcq",
        difficulty: 1,
        tags: ["syntax", "placeholders"]
      },
      {
        prompt: "How can you run python script and check its coverage or trace files?",
        options: ["python -m pdb", "python -m trace", "python -m site", "python -m venv"],
        correct: ["b"],
        explanation: "The 'trace' module allows you to trace program execution, printing lines as they execute, or generating code coverage reports.",
        type: "mcq",
        difficulty: 3,
        tags: ["cli", "debugging"]
      }
    ],
    advanced: [
      {
        prompt: "In Python metaclass mechanics, what dunder method represents the class creator that actually allocates the class memory?",
        options: ["__init__", "__new__", "__call__", "__prepare__"],
        correct: ["b"],
        explanation: "In a metaclass, `__new__` allocates memory and constructs the class object itself, while `__init__` configures the constructed class.",
        type: "mcq",
        difficulty: 5,
        tags: ["metaclasses", "dunder"]
      },
      {
        prompt: "Which statement is true regarding Python's Global Interpreter Lock (GIL)?",
        options: ["It prevents Python from creating threads", "It allows multi-threaded CPU parallel execution of Python bytecode", "It restricts Python interpreter execution to only one thread at a time", "It is used to lock standard file descriptors"],
        correct: ["c"],
        explanation: "The GIL is a mutex that prevents multiple native threads from executing Python bytecodes at once on CPU cores.",
        type: "mcq",
        difficulty: 4,
        tags: ["concurrency", "gil"]
      },
      {
        prompt: "What does calling '__call__' on an instance of a class allow you to do?",
        options: ["Delete the instance from memory", "Invoke the instance like a standard function", "Serialize properties into binary JSON", "Set instance attributes dynamically"],
        correct: ["b"],
        explanation: "Defining `__call__` in a class allows instances of that class to be invoked directly like a standard function.",
        type: "mcq",
        difficulty: 4,
        tags: ["dunder", "methods"]
      },
      {
        prompt: "Which module provides native support for coroutines, event loops, and asynchronous I/O tasks in Python?",
        options: ["threading", "multiprocessing", "asyncio", "socket"],
        correct: ["c"],
        explanation: "The 'asyncio' module provides the core tools, keywords, event loop, and coroutine execution models.",
        type: "mcq",
        difficulty: 4,
        tags: ["asyncio", "concurrency"]
      },
      {
        prompt: "What is the output of print(isinstance(True, int)) in Python?",
        options: ["True", "False", "TypeError", "None"],
        correct: ["a"],
        explanation: "In Python, the boolean subclass 'bool' is a direct subclass of 'int'. 'True' is represented internally by 1.",
        type: "code-output",
        difficulty: 3,
        tags: ["types", "inheritance"]
      },
      {
        prompt: "Which of the following is true about garbage collection in CPython?",
        options: [
          "It is strictly reference counted",
          "It uses reference counting and a generational cyclic garbage collector",
          "It relies entirely on mark-and-sweep cycles without reference counts",
          "It has no automated garbage collection"
        ],
        correct: ["b"],
        explanation: "CPython uses reference counting as its main garbage collection system, supplemented by a generational cyclic garbage collector to resolve reference cycles.",
        type: "mcq",
        difficulty: 5,
        tags: ["memory", "gc"]
      },
      {
        prompt: "What does the descriptor method '__get__' accept as its parameters?",
        options: ["self, instance, owner", "self, value", "self, name", "self, cls"],
        correct: ["a"],
        explanation: "The descriptor protocol's `__get__` signature is `__get__(self, instance, owner)` to fetch attributes from custom class scopes.",
        type: "mcq",
        difficulty: 5,
        tags: ["descriptors", "oop"]
      },
      {
        prompt: "Which module allows you to create weak references to Python objects so they can still be garbage-collected?",
        options: ["sys", "weakref", "gc", "types"],
        correct: ["b"],
        explanation: "The 'weakref' module allows developers to refer to objects without preventing their garbage collection reclaiming cycles.",
        type: "mcq",
        difficulty: 4,
        tags: ["memory", "weakref"]
      },
      {
        prompt: "What is the behavior of the 'yield from' statement introduced in Python 3.3?",
        options: [
          "It throws an exception inside a generator",
          "It delegates generator execution to a sub-generator or iterable",
          "It yields all values in parallel",
          "It ends a generator execution immediately"
        ],
        correct: ["b"],
        explanation: "`yield from` delegates operations, yielding values from a sub-generator or any iterable directly to the caller.",
        type: "mcq",
        difficulty: 4,
        tags: ["generators", "advanced"]
      },
      {
        prompt: "How can you obtain the bytecode representation of a compiled Python function?",
        options: ["func.__code__.co_code", "func.bytecode()", "sys.bytecode(func)", "dis.bytecode(func)"],
        correct: ["a"],
        explanation: "The code object properties (`__code__.co_code`) store the actual binary array of compiled bytecode instructions.",
        type: "mcq",
        difficulty: 5,
        tags: ["internals", "bytecode"]
      },
      {
        prompt: "Which function inside the 'sys' module returns the reference count of an object?",
        options: ["sys.refcount()", "sys.getrefcount()", "sys.references()", "sys.count()"],
        correct: ["b"],
        explanation: "'sys.getrefcount(obj)' returns the current reference count of 'obj', typically 1 higher because the search increases references.",
        type: "mcq",
        difficulty: 4,
        tags: ["memory", "refcount"]
      },
      {
        prompt: "What is abstract base classes (ABC) primarily used for?",
        options: [
          "To speed up execution",
          "To declare interfaces and enforce subclass interface rules at instantiation",
          "To secure code compilation",
          "To manage multi-core database tasks"
        ],
        correct: ["b"],
        explanation: "The 'abc' module allows defining abstract base classes that enforce subclasses to implement designated abstract methods.",
        type: "mcq",
        difficulty: 4,
        tags: ["abc", "oop"]
      },
      {
        prompt: "What does 'sys.setrecursionlimit(n)' do in Python?",
        options: [
          "Changes the maximum integer magnitude",
          "Sets the maximum depth of the Python interpreter call stack",
          "Increases memory page sizes",
          "Controls multi-threading loops"
        ],
        correct: ["b"],
        explanation: "`sys.setrecursionlimit` alters the maximum recursion stack depth permitted, preventing runaway recursions from crashing CPython.",
        type: "mcq",
        difficulty: 3,
        tags: ["recursion", "system"]
      },
      {
        prompt: "In Python multiple inheritance, what algorithm resolves class hierarchy Method Resolution Order (MRO)?",
        options: ["Dijkstra's", "DFS", "C3 Linearization", "BFS"],
        correct: ["c"],
        explanation: "Python uses the C3 Linearization algorithm to determine the Method Resolution Order (MRO) for class hierarchies.",
        type: "mcq",
        difficulty: 5,
        tags: ["inheritance", "mro"]
      },
      {
        prompt: "What occurs if you attempt to call a coroutine function directly without prepending 'await' or running it on an event loop?",
        options: [
          "It executes synchronously",
          "It returns a coroutine object without running the inner code",
          "It raises a SyntaxError",
          "It crashes the interpreter"
        ],
        correct: ["b"],
        explanation: "Calling an async def function directly does not run its body. It immediately returns a lazy coroutine object.",
        type: "mcq",
        difficulty: 4,
        tags: ["concurrency", "asyncio"]
      },
      {
        prompt: "Which dunder method handles attribute lookup when an attribute is NOT found in the usual instance dictionaries?",
        options: ["__getattr__", "__getattribute__", "__setattr__", "__lookup__"],
        correct: ["a"],
        explanation: "`__getattr__` is called only if the attribute is absent, whereas `__getattribute__` is called unconditionally on every lookup.",
        type: "mcq",
        difficulty: 4,
        tags: ["dunder", "oop"]
      },
      {
        prompt: "What is the function of the 'globals()' built-in function?",
        options: [
          "To list all modules on PyPI",
          "To return a dictionary representing the current global symbol table",
          "To declare variables universally available across projects",
          "To clean up memory buffers"
        ],
        correct: ["b"],
        explanation: "`globals()` returns a real, mutable dictionary representing the current module's global variables and bindings.",
        type: "mcq",
        difficulty: 3,
        tags: ["built-ins", "namespaces"]
      },
      {
        prompt: "What does the 'dis' module allow developers to do in Python?",
        options: [
          "Distribute applications on PyPI",
          "Disassemble compiled bytecode into human-readable assembly instructions",
          "Disconnect from database ports",
          "Delete variables"
        ],
        correct: ["b"],
        explanation: "The 'dis' (disassembler) module parses Python bytecode objects and formats them into readable code operation lines.",
        type: "mcq",
        difficulty: 4,
        tags: ["bytecode", "debugging"]
      },
      {
        prompt: "Which keyword matches patterns in Python 3.10+ similar to advanced switch-case structures?",
        options: ["match", "select", "switch", "choose"],
        correct: ["a"],
        explanation: "Python 3.10 introduced structural pattern matching using the 'match' and 'case' keywords.",
        type: "mcq",
        difficulty: 3,
        tags: ["syntax", "pattern-matching"]
      },
      {
        prompt: "What is the purpose of '__prepare__' dunder method in a custom metaclass?",
        options: [
          "Allocates the class instance namespace dictionary",
          "Returns a dictionary representing the namespace containing the class attributes",
          "Clears class cache logs",
          "Compiles bytecode ahead of time"
        ],
        correct: ["b"],
        explanation: "`__prepare__` is called on the metaclass before class body execution. It must return a mapping dictionary used to build class definitions.",
        type: "mcq",
        difficulty: 5,
        tags: ["metaclasses", "oop"]
      }
    ],
    api: [
      {
        prompt: "Which HTTP status code signifies a resource was successfully created in a POST action?",
        options: ["200 OK", "201 Created", "202 Accepted", "204 No Content"],
        correct: ["b"],
        explanation: "201 Created is the standard HTTP response indicating that a new resource has been created on the server.",
        type: "mcq",
        difficulty: 1,
        tags: ["rest", "http"]
      },
      {
        prompt: "What HTTP method should be used to fully replace or overwrite an existing resource?",
        options: ["PATCH", "POST", "PUT", "DELETE"],
        correct: ["c"],
        explanation: "PUT is designed to fully replace/overwrite the targeted resource at a specific URI.",
        type: "mcq",
        difficulty: 2,
        tags: ["rest", "http"]
      },
      {
        prompt: "Which status code should be returned if an API requires authorization, but none was provided?",
        options: ["400 Bad Request", "401 Unauthorized", "403 Forbidden", "404 Not Found"],
        correct: ["b"],
        explanation: "401 Unauthorized is used when authentication credentials are required but have either been omitted or are invalid.",
        type: "mcq",
        difficulty: 1,
        tags: ["rest", "security"]
      },
      {
        prompt: "In FastAPI, which library is utilized to perform robust model definition and validation?",
        options: ["Pydantic", "SQLAlchemy", "Marshmallow", "Cerberus"],
        correct: ["a"],
        explanation: "FastAPI relies entirely on Pydantic to parse and validate request/response payloads using standard Python type annotations.",
        type: "mcq",
        difficulty: 2,
        tags: ["fastapi", "pydantic"]
      },
      {
        prompt: "What status code does HTTP 403 Forbidden represent?",
        options: [
          "The resource does not exist",
          "The user is authenticated but lacks permission to perform the requested operation",
          "The request was malformed",
          "The server is undergoing database upgrades"
        ],
        correct: ["b"],
        explanation: "403 Forbidden indicates the server understands the requester's identity but refuses to authorize access due to insufficient privileges.",
        type: "mcq",
        difficulty: 2,
        tags: ["rest", "security"]
      },
      {
        prompt: "What does the abbreviation 'CORS' stand for in web API design?",
        options: [
          "Cross-Origin Resource Sharing",
          "Client-Only Resource Security",
          "Core Object Routing System",
          "Common Origin Redirect Standard"
        ],
        correct: ["a"],
        explanation: "Cross-Origin Resource Sharing (CORS) is a browser security mechanism that restricts cross-origin HTTP requests.",
        type: "mcq",
        difficulty: 2,
        tags: ["security", "cors"]
      },
      {
        prompt: "Which of the following describes an idempotent HTTP method?",
        options: [
          "A method that always deletes the database",
          "A method that produces the same server state regardless of whether it is called once or multiple times",
          "A method that executes faster on second call",
          "A method that cannot be cached"
        ],
        correct: ["b"],
        explanation: "An idempotent method leaves the server in the identical state regardless of repetitive identical calls (e.g. GET, PUT, DELETE).",
        type: "mcq",
        difficulty: 3,
        tags: ["rest", "http"]
      },
      {
        prompt: "In JWT-based authentication, where is the secure digital signature verified?",
        options: ["Only on the client browser", "Only on the server side", "By third-party DNS gateways", "Inside the JWT header parameter"],
        correct: ["b"],
        explanation: "Signature validation must always happen server-side using a secret key to ensure the payload has not been modified.",
        type: "mcq",
        difficulty: 2,
        tags: ["security", "jwt"]
      },
      {
        prompt: "How are query parameters denoted in a URL query string?",
        options: ["Following a colon (:)", "Following a question mark (?)", "Following a hash symbol (#)", "Following a slash (/)"],
        correct: ["b"],
        explanation: "The question mark '?' designates the boundary where route paths end and query parameters key-value combinations begin.",
        type: "mcq",
        difficulty: 1,
        tags: ["rest", "urls"]
      },
      {
        prompt: "What HTTP header is standard for delivering JWT credentials?",
        options: ["Authorization: Bearer <token>", "Credentials: Bearer <token>", "Token: <token>", "WWW-Authenticate: <token>"],
        correct: ["a"],
        explanation: "The standard convention is utilizing the 'Authorization' header populated with the 'Bearer ' schema and the token value.",
        type: "mcq",
        difficulty: 2,
        tags: ["security", "jwt"]
      },
      {
        prompt: "Which of these is NOT a standard HTTP method?",
        options: ["GET", "POST", "FETCH", "OPTIONS"],
        correct: ["c"],
        explanation: "FETCH is a browser JavaScript function to initiate network requests, not an HTTP verb specification (such as GET, POST, OPTIONS).",
        type: "mcq",
        difficulty: 1,
        tags: ["rest", "http"]
      },
      {
        prompt: "What does the 422 Unprocessable Entity status code typically represent in FastAPI?",
        options: [
          "The user is logged out",
          "A request body validation error parsed by Pydantic",
          "Internal backend database crash",
          "The route path was not found"
        ],
        correct: ["b"],
        explanation: "FastAPI returns 422 Unprocessable Entity if the input payload fields fail to match the designated Pydantic model validations.",
        type: "mcq",
        difficulty: 3,
        tags: ["fastapi", "validation"]
      },
      {
        prompt: "What is the purpose of database connection pooling in high-volume API services?",
        options: [
          "To lock the database against updates",
          "To keep a cache of active database sockets ready for reuse, preventing repetitive connection creation cost",
          "To automatically create backups",
          "To replicate data across clusters"
        ],
        correct: ["b"],
        explanation: "Pooling keeps pre-established database connections alive, eliminating the high performance overhead of creating a new socket for every incoming request.",
        type: "mcq",
        difficulty: 3,
        tags: ["database", "scaling"]
      },
      {
        prompt: "Which of the following represents a stateless API design?",
        options: [
          "An API that stores all client sessions in memory",
          "An API where each request contains all required information to process it, without relying on stored server session context",
          "An API that does not use databases",
          "An API that only handles text strings"
        ],
        correct: ["b"],
        explanation: "Statelessness dictates that every incoming request must contain the entire authentication and instruction set needed to execute it.",
        type: "mcq",
        difficulty: 3,
        tags: ["rest", "architecture"]
      },
      {
        prompt: "Which decorator is used in FastAPI to define a GET endpoint on a router object?",
        options: ["@router.get()", "@router.route('GET')", "@router.path()", "@app.select()"],
        correct: ["a"],
        explanation: "FastAPI uses modern decorators like `@router.get('/path')` or `@app.get('/path')` to map path operations.",
        type: "mcq",
        difficulty: 2,
        tags: ["fastapi", "routes"]
      },
      {
        prompt: "What format is the standard media type representation returned by APIs?",
        options: ["XML", "JSON (application/json)", "HTML", "Plain text"],
        correct: ["b"],
        explanation: "JSON is the standard, high-performance serialization format for web APIs, defined as application/json in Content-Type headers.",
        type: "mcq",
        difficulty: 1,
        tags: ["rest", "serialization"]
      },
      {
        prompt: "What is API rate limiting used for?",
        options: [
          "To verify database integrity",
          "To restrict user call volume, preventing API abuse and service denial (DDoS) events",
          "To speed up database join steps",
          "To clean up local logs"
        ],
        correct: ["b"],
        explanation: "Rate limiting throttles call frequency from specific clients, safeguarding server resources against malicious overload or accidental infinite loops.",
        type: "mcq",
        difficulty: 2,
        tags: ["security", "rate-limiting"]
      },
      {
        prompt: "In REST API naming standards, should endpoints use singular or plural nouns for resources?",
        options: ["Singular (e.g., /user/1)", "Plural (e.g., /users/1)", "Verbs (e.g., /getUser/1)", "Mixed styling"],
        correct: ["b"],
        explanation: "Standard RESTful design conventions dictate utilizing plural nouns to represent collections (such as /users or /users/1).",
        type: "mcq",
        difficulty: 2,
        tags: ["rest", "naming"]
      },
      {
        prompt: "What is an API gateway's responsibility?",
        options: [
          "To generate HTML styles",
          "To act as a reverse proxy routing, checking authentication, and aggregating logs across microservices",
          "To store system database records",
          "To boot up server hardware"
        ],
        correct: ["b"],
        explanation: "An API gateway acts as a single ingress entry point, delegating routing, security, metrics, and rate limiting to underlying microservices.",
        type: "mcq",
        difficulty: 3,
        tags: ["architecture", "api-gateway"]
      },
      {
        prompt: "Which status code represents 502 Bad Gateway?",
        options: [
          "The resource is not found",
          "A server acting as a gateway or proxy received an invalid response from an upstream server",
          "The server is out of memory",
          "The route requires premium subscriptions"
        ],
        correct: ["b"],
        explanation: "502 Bad Gateway indicates that a proxy server or router received an invalid payload or error response from its deeper target backend service.",
        type: "mcq",
        difficulty: 3,
        tags: ["rest", "http"]
      }
    ],
    django: [
      {
        prompt: "Which Django command is used to compile database tables matching new migrations?",
        options: ["python manage.py makemigrations", "python manage.py migrate", "python manage.py db_upgrade", "python manage.py sync_db"],
        correct: ["b"],
        explanation: "'migrate' runs against the database, executing pending SQL scripts to build or alter schemas in sync with migration files.",
        type: "mcq",
        difficulty: 2,
        tags: ["django", "migrations"]
      },
      {
        prompt: "What is the purpose of Django Middleware?",
        options: [
          "To style HTML elements",
          "To process requests or responses globally before they reach views or exit to clients",
          "To translate database schemas",
          "To run scheduled background scripts"
        ],
        correct: ["b"],
        explanation: "Middleware is a framework of hooks that intercepts and processes requests/responses globally in Django.",
        type: "mcq",
        difficulty: 3,
        tags: ["django", "middleware"]
      },
      {
        prompt: "In Django models, what does 'on_delete=models.CASCADE' do in a ForeignKey field?",
        options: [
          "Raises a deletion error",
          "Automatically deletes the dependent records when the referenced record is deleted",
          "Sets the foreign key to NULL",
          "Creates a background backup"
        ],
        correct: ["b"],
        explanation: "CASCADE ensures referential integrity by automatically cascading deletes downwards to child elements if the parent is removed.",
        type: "mcq",
        difficulty: 2,
        tags: ["django", "orm"]
      },
      {
        prompt: "Which of the following is true about Django's architecture?",
        options: ["It is strictly MVC", "It is MVT (Model-View-Template)", "It has no database capability", "It is serverless only"],
        correct: ["b"],
        explanation: "Django follows the MVT architecture pattern, where the framework handles the template logic dynamically.",
        type: "mcq",
        difficulty: 2,
        tags: ["django", "basics"]
      },
      {
        prompt: "Which command starts Django's local development server?",
        options: ["python manage.py run", "python manage.py runserver", "python manage.py startserver", "python manage.py boot"],
        correct: ["b"],
        explanation: "'runserver' boots up the lightweight developer web server locally (defaults to port 8000).",
        type: "mcq",
        difficulty: 1,
        tags: ["django", "cli"]
      },
      {
        prompt: "What Django tool protects forms from Cross-Site Request Forgery (CSRF) attacks?",
        options: ["{% csrf_token %}", "CSRF_Middleware", "Both of the above", "None of the above"],
        correct: ["c"],
        explanation: "Django uses both the CSRF middleware class to validate headers, and the template tag `{% csrf_token %}` to inject a secure validation key into forms.",
        type: "mcq",
        difficulty: 3,
        tags: ["django", "security"]
      },
      {
        prompt: "In Django ORM, which query filter returns objects that match exact query parameters?",
        options: ["filter()", "exclude()", "match()", "get()"],
        correct: ["a"],
        explanation: "`filter()` returns a QuerySet of all items matching parameters. `get()` returns a single object and raises an error if more than one is found.",
        type: "mcq",
        difficulty: 2,
        tags: ["django", "orm"]
      },
      {
        prompt: "What Django class should you inherit from to create forms directly mapping to a database Model?",
        options: ["forms.Form", "forms.ModelForm", "forms.DBForm", "forms.SchemaForm"],
        correct: ["b"],
        explanation: "`ModelForm` is a helper class allowing forms to map fields and validation rules directly from a model definition.",
        type: "mcq",
        difficulty: 2,
        tags: ["django", "forms"]
      },
      {
        prompt: "How can you load initial mock or setup data into database tables in Django?",
        options: ["Using Fixtures (manage.py loaddata)", "Using DB migration files", "Both of the above", "None of the above"],
        correct: ["c"],
        explanation: "Both JSON fixtures via `loaddata` and custom migrations containing python run scripts are standard ways to seed Django database instances.",
        type: "mcq",
        difficulty: 3,
        tags: ["django", "seeding"]
      },
      {
        prompt: "Which Django file holds global variables like INSTALLED_APPS, DATABASES, and MIDDLEWARE?",
        options: ["urls.py", "wsgi.py", "settings.py", "models.py"],
        correct: ["c"],
        explanation: "`settings.py` is the central configuration file holding database credentials, middleware lists, and installed apps.",
        type: "mcq",
        difficulty: 1,
        tags: ["django", "settings"]
      },
      {
        prompt: "What Django ORM method allows you to evaluate queries lazily until records are actually evaluated?",
        options: [
          "QuerySet evaluation is lazy by default",
          "lazy_eval()",
          "delay()",
          "eval_later()"
        ],
        correct: ["a"],
        explanation: "Django QuerySets are lazy. Query creation does not trigger database hits until you iterate, slice, or evaluate them.",
        type: "mcq",
        difficulty: 3,
        tags: ["django", "orm"]
      },
      {
        prompt: "What is Django's default database engine when a new project is created?",
        options: ["PostgreSQL", "SQLite", "MySQL", "MongoDB"],
        correct: ["b"],
        explanation: "Django projects initialize with SQLite out of the box because it is file-based and requires zero configuration.",
        type: "mcq",
        difficulty: 1,
        tags: ["django", "database"]
      },
      {
        prompt: "What Django feature triggers automated signals or notifications across models upon database actions?",
        options: ["Signals (django.db.models.signals)", "Triggers", "Alerts", "Observers"],
        correct: ["a"],
        explanation: "Django's signal dispatcher allows decoupled applications to get notified when actions occur (e.g. pre_save, post_save).",
        type: "mcq",
        difficulty: 3,
        tags: ["django", "signals"]
      },
      {
        prompt: "In Django, how are URL path endpoints mapped to view classes or functions?",
        options: ["In settings.py", "In urls.py using path() or re_path()", "In models.py", "In views.py using decorators"],
        correct: ["b"],
        explanation: "Routing configurations are written inside `urls.py` files using the `path()` or `re_path()` utilities.",
        type: "mcq",
        difficulty: 1,
        tags: ["django", "routing"]
      },
      {
        prompt: "What does the ORM query method 'select_related' do?",
        options: [
          "Queries a second database",
          "Performs a SQL JOIN to pull related foreign key fields in a single database hit",
          "Sorts the QuerySet in ascending order",
          "Deletes matching related records"
        ],
        correct: ["b"],
        explanation: "`select_related` executes an SQL JOIN to fetch foreign-key relationships, preventing the N+1 database queries performance pitfall.",
        type: "mcq",
        difficulty: 4,
        tags: ["django", "orm"]
      },
      {
        prompt: "Which command creates a new application folder structure within a Django project?",
        options: ["django-admin startapp <app_name>", "python manage.py newapp <app_name>", "python manage.py createapp <app_name>", "django-admin create <app_name>"],
        correct: ["a"],
        explanation: "`startapp` (using django-admin or manage.py) creates a new application folder containing models, views, and migrations templates.",
        type: "mcq",
        difficulty: 2,
        tags: ["django", "cli"]
      },
      {
        prompt: "What occurs if you attempt to save an invalid field configuration without migrating?",
        options: [
          "Django crashes on boot with SystemCheckError",
          "The database automatically creates columns anyway",
          "Data gets silently truncated",
          "None of the above"
        ],
        correct: ["a"],
        explanation: "Django's system check framework validates model fields at startup, raising errors if fields are misconfigured.",
        type: "mcq",
        difficulty: 3,
        tags: ["django", "models"]
      },
      {
        prompt: "Which built-in Django module is utilized to manage user logins, signups, permissions, and group roles?",
        options: ["django.contrib.security", "django.contrib.auth", "django.contrib.users", "django.contrib.login"],
        correct: ["b"],
        explanation: "`django.contrib.auth` provides the core authentication system, including user models, passwords, and group permissions.",
        type: "mcq",
        difficulty: 2,
        tags: ["django", "auth"]
      },
      {
        prompt: "How do you specify class-level metadata (like database table names) in a Django Model?",
        options: ["In Meta inner class", "In Config dictionary", "Using class decorators", "In models.py global definitions"],
        correct: ["a"],
        explanation: "Inner class `Meta` is used to declare model-level metadata options, such as `db_table`, `ordering`, or `verbose_name`.",
        type: "mcq",
        difficulty: 2,
        tags: ["django", "models"]
      },
      {
        prompt: "Which ORM method returns the SQL query string generated by a QuerySet named 'qs'?",
        options: ["qs.sql()", "qs.query", "str(qs.query)", "qs.explain()"],
        correct: ["c"],
        explanation: "Converting the `qs.query` object to a string (`str(qs.query)`) returns the exact raw SQL statement Django will execute.",
        type: "mcq",
        difficulty: 3,
        tags: ["django", "orm"]
      }
    ]
  },
  'ai-ml': {
    beginner: [
      {
        prompt: "Which learning type describes training a model where each input example is paired with an explicit correct label?",
        options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Self-Supervised Learning"],
        correct: ["a"],
        explanation: "Supervised Learning relies on datasets containing both inputs and target outputs (labels) to guide optimization.",
        type: "mcq",
        difficulty: 1,
        tags: ["basics", "supervised"]
      },
      {
        prompt: "Which evaluation metric checks the overall percentage of correct predictions?",
        options: ["Precision", "Recall", "Accuracy", "F1-Score"],
        correct: ["c"],
        explanation: "Accuracy is the ratio of correct predictions to the total count of test samples.",
        type: "mcq",
        difficulty: 1,
        tags: ["metrics", "basics"]
      },
      {
        prompt: "What occurs when a model performs exceptionally well on training files, but fails to generalize on unseen test files?",
        options: ["Underfitting", "Overfitting", "Gradient Explosion", "Dimensionality Bias"],
        correct: ["b"],
        explanation: "Overfitting happens when a model learns the training noise, matching details too closely and losing generalization capabilities.",
        type: "mcq",
        difficulty: 1,
        tags: ["basics", "overfitting"]
      },
      {
        prompt: "Which of the following algorithm is commonly used for Linear Regression optimization?",
        options: ["Gradient Descent", "Decision Trees", "K-Means Clustering", "Naïve Bayes"],
        correct: ["a"],
        explanation: "Gradient Descent is the iterative optimization algorithm used to minimize the cost/loss function in regression.",
        type: "mcq",
        difficulty: 1,
        tags: ["regression", "basics"]
      },
      {
        prompt: "What does the 'K' represent in the K-Means clustering algorithm?",
        options: ["The number of iterations", "The number of clusters to form", "The kernel multiplier", "The scale factor"],
        correct: ["b"],
        explanation: "In K-Means, 'K' is a user-defined parameter representing the exact count of clusters/centroids to identify.",
        type: "mcq",
        difficulty: 1,
        tags: ["unsupervised", "basics"]
      },
      {
        prompt: "What is the purpose of splitting data into train, validation, and test subsets?",
        options: [
          "To speed up training cycles",
          "To secure model files from hackers",
          "To optimize hyperparameters and measure generalization accuracy on unseen data",
          "To save disk storage"
        ],
        correct: ["c"],
        explanation: "Splitting ensures hyperparameters are tuned on a validation set and generalizability is evaluated independently on the test set.",
        type: "mcq",
        difficulty: 2,
        tags: ["evaluation", "basics"]
      },
      {
        prompt: "Which regression metric measures the average absolute difference between predicted and actual values?",
        options: ["MAE (Mean Absolute Error)", "MSE (Mean Squared Error)", "RMSE", "R-Squared"],
        correct: ["a"],
        explanation: "MAE calculates the average of the absolute differences, giving equal weight to all error magnitudes.",
        type: "mcq",
        difficulty: 1,
        tags: ["metrics", "regression"]
      },
      {
        prompt: "What is a major limitation of using only accuracy as a metric for highly imbalanced datasets?",
        options: [
          "It is slow to calculate",
          "It can be misleadingly high even if a model completely fails to identify the minority class",
          "It only works for numerical data",
          "It throws mathematical overflow errors"
        ],
        correct: ["b"],
        explanation: "On highly imbalanced datasets (e.g. 99% class A), a naive model predicting class A always achieves 99% accuracy while proving useless for minority class detection.",
        type: "mcq",
        difficulty: 2,
        tags: ["evaluation", "metrics"]
      },
      {
        prompt: "Which of these is an example of an unsupervised learning task?",
        options: ["Image classification", "Spam email filtering", "Customer grouping/clustering", "Stock price prediction"],
        correct: ["c"],
        explanation: "Clustering does not require pre-labeled classes; it infers groupings from similarities in the input features.",
        type: "mcq",
        difficulty: 1,
        tags: ["unsupervised", "basics"]
      },
      {
        prompt: "What is the goal of feature scaling in pre-processing pipelines?",
        options: [
          "To compress images",
          "To normalize feature magnitudes, preventing columns with large ranges from skewing optimization",
          "To delete empty entries",
          "To increase data complexity"
        ],
        correct: ["b"],
        explanation: "Scaling (like standardizing or min-max scaling) ensures all features occupy proportional numeric ranges, optimizing optimization convergence speeds.",
        type: "mcq",
        difficulty: 2,
        tags: ["preprocessing", "basics"]
      },
      {
        prompt: "Which parameter controls the size of steps taken during gradient descent optimization?",
        options: ["Batch size", "Learning rate", "Epoch limit", "Regularization factor"],
        correct: ["b"],
        explanation: "The learning rate (or step size) scales the gradient step, determining how aggressively parameters are adjusted.",
        type: "mcq",
        difficulty: 1,
        tags: ["optimization", "basics"]
      },
      {
        prompt: "What is a 'Confusion Matrix' in classification assessment?",
        options: [
          "A grid showing actual versus predicted classifications across all classes",
          "An algorithm that mixes up data",
          "A model training interface",
          "A mathematical error code list"
        ],
        correct: ["a"],
        explanation: "A Confusion Matrix maps True Positives, False Positives, True Negatives, and False Negatives, detailing classification errors.",
        type: "mcq",
        difficulty: 2,
        tags: ["classification", "metrics"]
      },
      {
        prompt: "Which statistical theorem serves as the core foundation for Naïve Bayes classifiers?",
        options: ["Central Limit Theorem", "Bayes' Theorem", "Pythagorean Theorem", "Taylor Series"],
        correct: ["b"],
        explanation: "Naïve Bayes relies on Bayes' Theorem to calculate conditional probabilities for class assignments.",
        type: "mcq",
        difficulty: 1,
        tags: ["classification", "math"]
      },
      {
        prompt: "Why is the Naïve Bayes classifier referred to as 'Naïve'?",
        options: [
          "Because it is basic",
          "Because it assumes absolute independence between all input features, which is rarely true in reality",
          "Because it does not require training",
          "None of the above"
        ],
        correct: ["b"],
        explanation: "It is called 'naïve' because it makes the simplifying assumption that features are conditionally independent given the class label.",
        type: "mcq",
        difficulty: 2,
        tags: ["classification", "theory"]
      },
      {
        prompt: "Which of the following is an example of a classification task?",
        options: ["Predicting housing values", "Forecasting temperature trends", "Detecting fraudulent transactions (Fraud vs. Safe)", "Calculating user session times"],
        correct: ["c"],
        explanation: "Fraud detection assigns samples to discrete categorical classes, representing a classification task rather than regression.",
        type: "mcq",
        difficulty: 1,
        tags: ["basics", "classification"]
      },
      {
        prompt: "What algorithm constructs multiple decision trees and aggregates their predictions to improve accuracy?",
        options: ["Support Vector Machines", "Random Forest", "Logistic Regression", "K-Nearest Neighbors"],
        correct: ["b"],
        explanation: "Random Forest is an ensemble method that trains numerous decision trees and takes majority votes for classification (or averages for regression).",
        type: "mcq",
        difficulty: 2,
        tags: ["ensemble", "basics"]
      },
      {
        prompt: "What does a cost or loss function represent in model training?",
        options: [
          "The dollar expense of cloud computing instances",
          "A mathematical penalty measuring the distance between model predictions and actual ground-truth labels",
          "The count of deleted features",
          "The model training time"
        ],
        correct: ["b"],
        explanation: "Loss functions measure prediction inaccuracy. The goal of training is to adjust parameters to minimize this cost.",
        type: "mcq",
        difficulty: 1,
        tags: ["theory", "loss"]
      },
      {
        prompt: "Which of these algorithms can handle both linear and non-linear classification tasks using kernels?",
        options: ["Linear Regression", "Support Vector Machines (SVM)", "K-Means", "Naïve Bayes"],
        correct: ["b"],
        explanation: "SVM can apply the 'kernel trick' to map low-dimensional, non-linearly separable inputs into higher-dimensional spaces where they are separable.",
        type: "mcq",
        difficulty: 2,
        tags: ["classification", "svm"]
      },
      {
        prompt: "What is the primary objective of Principal Component Analysis (PCA)?",
        options: [
          "To clean up missing cells",
          "To reduce dimensionality while preserving maximum variance",
          "To train deep networks faster",
          "To classify text inputs"
        ],
        correct: ["b"],
        explanation: "PCA is a linear dimensionality reduction method that projects high-dimensional data onto orthogonal directions (principal components) of maximum variance.",
        type: "mcq",
        difficulty: 2,
        tags: ["dimensionality", "pca"]
      },
      {
        prompt: "Which classification evaluation metric is defined as True Positives divided by the sum of True Positives and False Negatives?",
        options: ["Precision", "Recall (Sensitivity)", "Accuracy", "Specificity"],
        correct: ["b"],
        explanation: "Recall (or Sensitivity) measures the model's ability to identify all positive cases: TP / (TP + FN).",
        type: "mcq",
        difficulty: 2,
        tags: ["metrics", "evaluation"]
      }
    ],
    intermediate: [
      {
        prompt: "Which activation function outputs values constrained within the range (-1, 1)?",
        options: ["Sigmoid", "ReLU", "Tanh (Hyperbolic Tangent)", "Softmax"],
        correct: ["c"],
        explanation: "The Tanh activation function maps inputs to an S-shaped curve between -1 and 1, making it zero-centered.",
        type: "mcq",
        difficulty: 2,
        tags: ["activation", "deep-learning"]
      },
      {
        prompt: "What optimizer scales learning rates per parameter based on historical gradient values (e.g. tracking moving averages of squared gradients)?",
        options: ["Classic SGD", "Momentum SGD", "Adam (Adaptive Moment Estimation)", "Gradient Ascent"],
        correct: ["c"],
        explanation: "Adam combines Momentum and RMSProp, maintaining moving averages of both gradients and squared gradients.",
        type: "mcq",
        difficulty: 3,
        tags: ["optimizers", "deep-learning"]
      },
      {
        prompt: "Which regularization method adds a penalty term proportional to the absolute values of the weights (L1 regularization)?",
        options: ["Ridge Regression", "Lasso Regression", "Dropout", "Batch Normalization"],
        correct: ["b"],
        explanation: "Lasso Regression applies L1 regularization, which can shrink unimportant weights to exactly zero, producing sparse models.",
        type: "mcq",
        difficulty: 3,
        tags: ["regularization", "lasso"]
      },
      {
        prompt: "What is the purpose of Batch Normalization in deep network architectures?",
        options: [
          "To shuffle the train files",
          "To normalize activations of intermediate layers during training, reducing internal covariate shift",
          "To compress weights",
          "To prevent database overflow"
        ],
        correct: ["b"],
        explanation: "Batch Normalization normalizes inputs to each layer per mini-batch, stabilizing and accelerating training.",
        type: "mcq",
        difficulty: 3,
        tags: ["deep-learning", "batch-norm"]
      },
      {
        prompt: "Which neural network layer structure is optimized for spatial correlation tasks (like image classification)?",
        options: ["Fully Connected", "Recurrent Layer", "Convolutional Layer (CNN)", "Embedding Layer"],
        correct: ["c"],
        explanation: "CNNs use shared weight sliding filters to capture spatial patterns (edges, shapes) across visual grids.",
        type: "mcq",
        difficulty: 2,
        tags: ["cnn", "architecture"]
      },
      {
        prompt: "Which activation function is most appropriate for the final output layer of a multi-class classification task?",
        options: ["ReLU", "Sigmoid", "Softmax", "Tanh"],
        correct: ["c"],
        explanation: "Softmax normalizes outputs into a probability distribution summing to 1.0, representing multi-class confidence ratings.",
        type: "mcq",
        difficulty: 2,
        tags: ["activation", "classification"]
      },
      {
        prompt: "In training deep networks, what is 'Early Stopping' used for?",
        options: [
          "Aborting training when computing budget expires",
          "Halting training when validation loss stops improving, avoiding overfitting",
          "Clearing RAM allocations",
          "Saving model checkpoints"
        ],
        correct: ["b"],
        explanation: "Early Stopping monitors validation error. If it starts to increase while training error drops, training halts to prevent overfitting.",
        type: "mcq",
        difficulty: 2,
        tags: ["training", "overfitting"]
      },
      {
        prompt: "What does a pooling layer (like MaxPooling) do in a CNN?",
        options: [
          "Increases input dimensions",
          "Downsamples feature maps to reduce spatial dimensions and computation size",
          "Applies non-linear activations",
          "Saves intermediate model weights"
        ],
        correct: ["b"],
        explanation: "MaxPooling extract maximum values from sub-grids, shrinking feature dimensions while retaining principal activations.",
        type: "mcq",
        difficulty: 2,
        tags: ["cnn", "architecture"]
      },
      {
        prompt: "Which algorithm family is designed to process temporal, sequential inputs (like text or speech logs)?",
        options: ["CNNs", "RNNs (Recurrent Neural Networks)", "SVMs", "PCA"],
        correct: ["b"],
        explanation: "RNNs carry hidden state vectors across sequence steps, making them ideal for sequential inputs.",
        type: "mcq",
        difficulty: 2,
        tags: ["rnn", "architecture"]
      },
      {
        prompt: "What issue do LSTMs (Long Short-Term Memory) resolve compared to classic vanilla RNNs?",
        options: [
          "Slow learning rates",
          "Vanishing and exploding gradients on long-range dependencies",
          "Large model footprints",
          "High floating-point calculation demands"
        ],
        correct: ["b"],
        explanation: "LSTMs use gated cell states (input, forget, output gates) to preserve gradient flow over long input sequences.",
        type: "mcq",
        difficulty: 3,
        tags: ["lstm", "rnn"]
      },
      {
        prompt: "Which neural network loss function is standard for binary classification tasks?",
        options: ["Mean Squared Error (MSE)", "Binary Cross-Entropy", "Categorical Cross-Entropy", "Huber Loss"],
        correct: ["b"],
        explanation: "Binary Cross-Entropy measures mismatch probabilities for binary outputs (0 or 1).",
        type: "mcq",
        difficulty: 2,
        tags: ["loss-functions", "classification"]
      },
      {
        prompt: "What is 'Data Augmentation' in computer vision pipelines?",
        options: [
          "Deleting corrupted files",
          "Artificially expanding dataset sizes by applying transformations (crops, rotations, flips) to training images",
          "Downloading more pictures",
          "Multiplying pixel values"
        ],
        correct: ["b"],
        explanation: "Data Augmentation applies random geometry/color alterations to images, preventing models from overfitting to static viewpoints.",
        type: "mcq",
        difficulty: 2,
        tags: ["preprocessing", "cnn"]
      },
      {
        prompt: "Which optimizer includes a momentum term to accelerate gradient descent down steep valleys, bypassing oscillations?",
        options: ["SGD with Momentum", "RMSProp", "Standard AdaGrad", "None of the above"],
        correct: ["a"],
        explanation: "Momentum accumulates a fraction of past gradient vectors, adding velocity to speed up updates in low-curvature directions.",
        type: "mcq",
        difficulty: 3,
        tags: ["optimizers", "training"]
      },
      {
        prompt: "Which activation function is defined as f(x) = max(0, x)?",
        options: ["Sigmoid", "Tanh", "ReLU", "GELU"],
        correct: ["c"],
        explanation: "The Rectified Linear Unit (ReLU) outputs zero for any negative input, and outputs the input itself for positive values.",
        type: "mcq",
        difficulty: 1,
        tags: ["activation", "basics"]
      },
      {
        prompt: "What is a 'hyperparameter' in machine learning?",
        options: [
          "A parameter updated during training cycles",
          "A configuration setting specified before training begins that controls the learning process (e.g. learning rate)",
          "A value calculated by loss functions",
          "None of the above"
        ],
        correct: ["b"],
        explanation: "Hyperparameters are external settings (like learning rate, batch size, or layer counts) that define training parameters and cannot be directly optimized by standard backpropagation.",
        type: "mcq",
        difficulty: 2,
        tags: ["training", "basics"]
      },
      {
        prompt: "What does 'Backpropagation' calculate?",
        options: [
          "Model training speeds",
          "The gradients of the loss function with respect to the network weights, layer-by-layer backwards",
          "Input feature distributions",
          "Class prediction rates"
        ],
        correct: ["b"],
        explanation: "Backpropagation applies the calculus chain rule to calculate gradients of loss relative to weights, enabling gradient descent updates.",
        type: "mcq",
        difficulty: 3,
        tags: ["backpropagation", "math"]
      },
      {
        prompt: "Which regularization method randomly sets a percentage of neuron activations to zero during each training step?",
        options: ["L1 Regularization", "L2 Regularization", "Dropout", "ElasticNet"],
        correct: ["c"],
        explanation: "Dropout deactivates random nodes during training iterations, preventing neurons from co-adapting and developing fragile representations.",
        type: "mcq",
        difficulty: 2,
        tags: ["regularization", "dropout"]
      },
      {
        prompt: "What metric is calculated as the harmonic mean of Precision and Recall?",
        options: ["Accuracy", "ROC-AUC", "F1-Score", "Recall Rate"],
        correct: ["c"],
        explanation: "F1-Score is the harmonic mean of precision and recall, balancing both metrics on imbalanced binary tasks.",
        type: "mcq",
        difficulty: 2,
        tags: ["metrics", "evaluation"]
      },
      {
        prompt: "What does the 'learning rate decay' technique involve?",
        options: [
          "Aborting training when the model stops learning",
          "Gradually reducing the learning rate as training epochs advance to fine-tune final parameter weights",
          "Scaling features",
          "Increasing batch sizes"
        ],
        correct: ["b"],
        explanation: "Decaying learning rates starts with fast progress steps and narrows step sizes later to settle cleanly in local loss minima.",
        type: "mcq",
        difficulty: 2,
        tags: ["training", "optimization"]
      },
      {
        prompt: "Which statistical problem does the vanishing gradient issue cause?",
        options: [
          "Layers train too quickly",
          "Gradients approach zero, leaving weights in shallow/early layers of deep networks virtually unchanged",
          "Loss values become infinite",
          "Model parameters overflow memory allocations"
        ],
        correct: ["b"],
        explanation: "In deep networks, backpropagating through squashing functions (like sigmoid) repeatedly multiplies small values, causing early-layer updates to freeze.",
        type: "mcq",
        difficulty: 3,
        tags: ["gradients", "deep-learning"]
      }
    ],
    advanced: [
      {
        prompt: "What mathematical mechanism underpins Transformer models, allowing elements in sequences to rank relative importance of other items?",
        options: ["Recurrent hidden cell gates", "Self-Attention (Scaled Dot-Product)", "Convolutional filters", "Markov chain matrices"],
        correct: ["b"],
        explanation: "Self-Attention calculates similarity weights across Query, Key, and Value vectors to associate sequence positions.",
        type: "mcq",
        difficulty: 4,
        tags: ["transformers", "attention"]
      },
      {
        prompt: "In Generative Adversarial Networks (GANs), which two sub-networks compete in a zero-sum game?",
        options: [
          "Encoder and Decoder",
          "Generator and Discriminator",
          "Attention block and Feedforward block",
          "Actor and Critic"
        ],
        correct: ["b"],
        explanation: "The Generator synthesizes fake samples, while the Discriminator tries to distinguish real dataset samples from generator fakes.",
        type: "mcq",
        difficulty: 4,
        tags: ["gans", "generative"]
      },
      {
        prompt: "What does 'RAG' stand for in Generative AI systems?",
        options: [
          "Retrieval-Augmented Generation",
          "Random Attribute Grouping",
          "Recursive Attention Grid",
          "Refined Activation Gradient"
        ],
        correct: ["a"],
        explanation: "Retrieval-Augmented Generation (RAG) fetches relevant reference data from external indices before prompting LLMs for answers.",
        type: "mcq",
        difficulty: 4,
        tags: ["rag", "llms"]
      },
      {
        prompt: "Which method is a parameter-efficient fine-tuning (PEFT) technique that inserts low-rank decomposition matrices into model layers?",
        options: ["RLHF", "LoRA (Low-Rank Adaptation)", "Quantization", "Gradient Clipping"],
        correct: ["b"],
        explanation: "LoRA freezes base weights and trains small low-rank parameter adjustments, saving massive GPU computing memory during LLM updates.",
        type: "mcq",
        difficulty: 5,
        tags: ["fine-tuning", "lora"]
      },
      {
        prompt: "What training workflow aligns LLM outputs with human guidelines regarding safety and helpfulness?",
        options: ["LoRA", "RLHF (Reinforcement Learning from Human Feedback)", "Self-Supervised Pre-training", "Tokenization"],
        correct: ["b"],
        explanation: "RLHF compiles human preferences into reward models, applying PPO reinforcement cycles to align model outputs.",
        type: "mcq",
        difficulty: 5,
        tags: ["rlhf", "alignment"]
      },
      {
        prompt: "In Transformer architectures, what is the purpose of 'Positional Encodings'?",
        options: [
          "To identify output categories",
          "To inject token sequence order information since self-attention processes inputs in parallel without sequence awareness",
          "To normalize activations",
          "To restrict sequence sizes"
        ],
        correct: ["b"],
        explanation: "Transformers process words in parallel, lacking sequential awareness. Positional Encodings inject vectors representing sequence distances.",
        type: "mcq",
        difficulty: 4,
        tags: ["transformers", "architecture"]
      },
      {
        prompt: "What does model quantization accomplish?",
        options: [
          "Increases model depth",
          "Converts high-precision weights (FP32) to lower-precision formats (FP16, INT8) to reduce model sizes and speed up inference",
          "Duplicates weights to enhance accuracy",
          "Splits datasets into buckets"
        ],
        correct: ["b"],
        explanation: "Quantization packs float representations into compact integers or half-precision floats, reducing disk/memory demands and accelerating compute times.",
        type: "mcq",
        difficulty: 4,
        tags: ["optimization", "inference"]
      },
      {
        prompt: "Which architecture is standard for modern diffusion-based image generation models (like Stable Diffusion)?",
        options: ["U-Net paired with Attention layers", "Simple MLP", "Vanilla RNN", "Decision Forest"],
        correct: ["a"],
        explanation: "Stable Diffusion uses a U-Net layout to predict and subtract noise iteratively, using cross-attention for text guidance.",
        type: "mcq",
        difficulty: 5,
        tags: ["diffusion", "generative"]
      },
      {
        prompt: "What is the primary objective of Contrastive Learning in self-supervised modeling?",
        options: [
          "To classify samples into 1000 categories",
          "To train models to pull similar pairs close in embedding spaces and push dissimilar pairs far apart",
          "To speed up gradient descent steps",
          "To predict the next word"
        ],
        correct: ["b"],
        explanation: "Contrastive Learning forces models to recognize representations by mapping positive transformations close and negative comparisons far away.",
        type: "mcq",
        difficulty: 5,
        tags: ["self-supervised", "theory"]
      },
      {
        prompt: "What does the term 'temperature' control in LLM response generation?",
        options: [
          "The CPU hardware heat limits",
          "The randomness/creativity of token sampling distributions",
          "The maximum token sequence limits",
          "The vector dimension scales"
        ],
        correct: ["b"],
        explanation: "Temperature scales logit values before Softmax. Higher temperatures smooth probabilities, raising output creativity and randomness.",
        type: "mcq",
        difficulty: 3,
        tags: ["llms", "inference"]
      },
      {
        prompt: "Which of these is a standard vector search database commonly used to implement RAG?",
        options: ["Pinecone", "SQLite", "Redis", "All of the above"],
        correct: ["a"],
        explanation: "Pinecone, Milvus, and Weaviate are specialized vector databases designed for fast cosine or Euclidean similarity lookups on embedding arrays.",
        type: "mcq",
        difficulty: 3,
        tags: ["rag", "databases"]
      },
      {
        prompt: "What represents 'hallucination' in LLM operations?",
        options: [
          "The model outputting text in binary",
          "The model generating factual-sounding but incorrect, fabricated information",
          "The server crashing on long inputs",
          "The model outputting responses too slowly"
        ],
        correct: ["b"],
        explanation: "Hallucination describes LLMs fabricating false details with high linguistic confidence due to predictive pattern matching limitations.",
        type: "mcq",
        difficulty: 3,
        tags: ["llms", "behavior"]
      },
      {
        prompt: "Which neural network layer handles multi-head attention calculations in parallel?",
        options: ["MultiHeadAttention", "Linear Layer", "LayerNorm", "None of the above"],
        correct: ["a"],
        explanation: "Modern deep libraries declare MultiHeadAttention layers which project queries, keys, and values across parallel heads simultaneously.",
        type: "mcq",
        difficulty: 4,
        tags: ["transformers", "architecture"]
      },
      {
        prompt: "What is 'tokenization' in natural language processing (NLP)?",
        options: [
          "Securing APIs with keys",
          "Slicing input text strings into discrete atomic units (tokens) representing words, subwords, or characters",
          "Translating texts",
          "None of the above"
        ],
        correct: ["b"],
        explanation: "Tokenization maps raw text inputs into lists of integer IDs representing subword vocabularies compatible with network embeddings.",
        type: "mcq",
        difficulty: 3,
        tags: ["nlp", "preprocessing"]
      },
      {
        prompt: "In reinforcement learning, what does the policy function (denoted as \u03c0) define?",
        options: [
          "The server security rule set",
          "The mapping function determining an agent's actions given specific environmental states",
          "The cumulative discount rates",
          "The reward allocation values"
        ],
        correct: ["b"],
        explanation: "The policy \u03c0(a|s) defines the probability of selecting action 'a' given state 's' to guide agent operations.",
        type: "mcq",
        difficulty: 5,
        tags: ["reinforcement-learning", "math"]
      },
      {
        prompt: "What is the key advantage of FlashAttention compared to classic attention implementations?",
        options: [
          "It improves model accuracy scores",
          "It optimizes IO read/writes between GPU SRAM and HBM memory, accelerating attention computations and saving RAM footprint",
          "It uses fewer parameters",
          "It supports multilingual inputs"
        ],
        correct: ["b"],
        explanation: "FlashAttention optimizes hardware memory page IO tiling to process attention matrix loops without materializing intermediate attention grids.",
        type: "mcq",
        difficulty: 5,
        tags: ["transformers", "optimization"]
      },
      {
        prompt: "Which of the following describes Mixture of Experts (MoE) architectures?",
        options: [
          "Models trained by multiple engineers",
          "Models containing parallel expert networks where a routing gating layer activates only select subsets of experts per token",
          "Models that use different datasets",
          "Models run across CPU networks"
        ],
        correct: ["b"],
        explanation: "MoE models maintain sparse parameters by routing inputs to specialized feed-forward experts, keeping computation costs low.",
        type: "mcq",
        difficulty: 5,
        tags: ["moe", "architecture"]
      },
      {
        prompt: "What does the 'Perplexity' metric measure in language modeling evaluation?",
        options: [
          "The model generation speed",
          "How confused/uncertain a model is when predicting the next token in text samples",
          "The memory size of weights",
          "The training loss averages"
        ],
        correct: ["b"],
        explanation: "Perplexity is the exponentiated cross-entropy loss. Lower perplexity means the model is more certain of its sequence predictions.",
        type: "mcq",
        difficulty: 4,
        tags: ["metrics", "llms"]
      },
      {
        prompt: "What is the purpose of Layer Normalization (LayerNorm) in Transformers?",
        options: [
          "To clip gradient scales",
          "To normalize inputs across features for each individual sample, stabilizing deep sequence layers",
          "To scale learning rates",
          "To delete duplicate words"
        ],
        correct: ["b"],
        explanation: "LayerNorm normalizes activations across a single sample's hidden features, working better than BatchNorm on variable length sequences.",
        type: "mcq",
        difficulty: 4,
        tags: ["transformers", "architecture"]
      },
      {
        prompt: "What does 'Gradient Clipping' prevent during model training?",
        options: [
          "Vanishing gradients",
          "Exploding gradients by scaling gradients downward if their norm exceeds a specified threshold",
          "Slow learning rates",
          "Overfitting"
        ],
        correct: ["b"],
        explanation: "Gradient Clipping caps gradient values before weights updates, preventing extremely large steps from corrupting model states.",
        type: "mcq",
        difficulty: 3,
        tags: ["training", "optimization"]
      }
    ]
  },
  cloud: {
    beginner: [
      {
        prompt: "Which cloud service model offers absolute raw hardware hosting (VMs, storage disks, networking) where developers manage OS and runtimes?",
        options: ["IaaS", "PaaS", "SaaS", "FaaS"],
        correct: ["a"],
        explanation: "Infrastructure as a Service (IaaS) delivers raw hardware nodes (e.g. AWS EC2, GCP Compute Engine).",
        type: "mcq",
        difficulty: 1,
        tags: ["basics", "models"]
      },
      {
        prompt: "What is an Availability Zone (AZ) in public cloud architecture?",
        options: [
          "A countries' political boundary",
          "One or more distinct, physical data centers equipped with redundant power, networking, and cooling within a region",
          "A virtual private subnet",
          "A pricing bracket"
        ],
        correct: ["b"],
        explanation: "AZs are isolated physical structures within cloud regions designed to provide failure isolation.",
        type: "mcq",
        difficulty: 1,
        tags: ["infrastructure", "basics"]
      },
      {
        prompt: "Which cloud storage class is best suited for files that must be accessed immediately with high performance?",
        options: ["Cold Storage (Archive)", "Hot Storage (Standard Object/Block)", "Nearline Storage", "Glacier Storage"],
        correct: ["b"],
        explanation: "Standard (Hot) storage offers low latency, high throughput access for active app operations.",
        type: "mcq",
        difficulty: 1,
        tags: ["storage", "basics"]
      },
      {
        prompt: "What does the abbreviation 'VPC' represent in cloud networking?",
        options: [
          "Virtual Private Cloud",
          "Variable Port Controller",
          "Verified Proxy Connection",
          "Virtual Public Container"
        ],
        correct: ["a"],
        explanation: "A Virtual Private Cloud (VPC) is an isolated private network partition on public cloud physical fabrics.",
        type: "mcq",
        difficulty: 1,
        tags: ["networking", "basics"]
      },
      {
        prompt: "Which type of database model stores data in tables containing rows and columns?",
        options: ["NoSQL (Document)", "Relational Database (RDBMS)", "Graph Database", "Key-Value Store"],
        correct: ["b"],
        explanation: "Relational Databases (like PostgreSQL or MySQL) structure data in tables with strictly enforced schemas.",
        type: "mcq",
        difficulty: 1,
        tags: ["databases", "basics"]
      },
      {
        prompt: "What cloud feature automatically scales virtual server counts up or down based on incoming CPU load?",
        options: ["Load Balancer", "Auto-scaling Group", "CDN", "VPC Router"],
        correct: ["b"],
        explanation: "Auto-scaling groups add or remove server nodes dynamically to match real-time workload requirements.",
        type: "mcq",
        difficulty: 1,
        tags: ["scaling", "basics"]
      },
      {
        prompt: "What does the 'SaaS' acronym represent?",
        options: [
          "System as a Service",
          "Software as a Service",
          "Storage as an Asset",
          "Serverless as a Service"
        ],
        correct: ["b"],
        explanation: "Software as a Service (SaaS) delivers fully realized apps managed entirely by providers (e.g. Google Workspace, Slack).",
        type: "mcq",
        difficulty: 1,
        tags: ["basics", "models"]
      },
      {
        prompt: "What service routes global domain names (DNS) in AWS?",
        options: ["AWS Route 53", "AWS VPC", "AWS Direct Connect", "AWS CloudFront"],
        correct: ["a"],
        explanation: "AWS Route 53 is the primary managed domain name routing system.",
        type: "mcq",
        difficulty: 1,
        tags: ["dns", "basics"]
      },
      {
        prompt: "What represents 'serverless' computing?",
        options: [
          "Running software without any underlying physical computers",
          "A model where cloud providers automatically manage server resources and billing is tied strictly to active execution times",
          "Using only local desktop files",
          "None of the above"
        ],
        correct: ["b"],
        explanation: "Serverless (like FaaS) abstracts server management, automatically scaling resources and charging only for executed computation.",
        type: "mcq",
        difficulty: 1,
        tags: ["serverless", "basics"]
      },
      {
        prompt: "What is the primary function of a Content Delivery Network (CDN) in cloud setups?",
        options: [
          "To translate database SQL files",
          "To cache static assets at edge servers close to users globally, lowering access latencies",
          "To encrypt VM folders",
          "To scale CPU cores"
        ],
        correct: ["b"],
        explanation: "CDNs replicate static resources (images, JS, CSS) to points of presence (PoP) closer to users, improving load speeds.",
        type: "mcq",
        difficulty: 1,
        tags: ["cdn", "basics"]
      },
      {
        prompt: "Which public cloud service represents Google Cloud's core virtual machine product?",
        options: ["Google Compute Engine", "Google App Engine", "Google Cloud Storage", "Google Cloud Run"],
        correct: ["a"],
        explanation: "Google Compute Engine (GCE) delivers virtual machine instances (IaaS) running on Google structures.",
        type: "mcq",
        difficulty: 1,
        tags: ["vms", "basics"]
      },
      {
        prompt: "What does an Elastic Load Balancer (ELB) do?",
        options: [
          "Scales server hard drives",
          "Distributes incoming application traffic across multiple target servers to prevent single-node overload",
          "Encrypts network packets",
          "Routes domains"
        ],
        correct: ["b"],
        explanation: "Load Balancers act as traffic routers, distributing network packets evenly across groups of server nodes.",
        type: "mcq",
        difficulty: 1,
        tags: ["networking", "basics"]
      },
      {
        prompt: "What is the purpose of Identity and Access Management (IAM) in cloud architectures?",
        options: [
          "To verify website styles",
          "To define who has access, what permissions they hold, and what actions they can perform on cloud resources",
          "To measure server temperature",
          "To speed up database lookups"
        ],
        correct: ["b"],
        explanation: "IAM controls security access, establishing policies that regulate resource visibility and administrative permissions.",
        type: "mcq",
        difficulty: 1,
        tags: ["security", "basics"]
      },
      {
        prompt: "Which model describes AWS's role regarding safety, versus the customer's role (Shared Responsibility Model)?",
        options: [
          "AWS is responsible for security OF the cloud, while the customer is responsible for security IN the cloud",
          "AWS is responsible for all code",
          "The customer handles everything",
          "None of the above"
        ],
        correct: ["a"],
        explanation: "AWS secures the global physical infrastructure (of the cloud), while customers secure their applications, keys, configurations, and data (in the cloud).",
        type: "mcq",
        difficulty: 2,
        tags: ["security", "basics"]
      },
      {
        prompt: "Which storage type represents AWS's primary managed object storage product?",
        options: ["AWS EBS", "AWS EFS", "AWS S3", "AWS Glacier"],
        correct: ["c"],
        explanation: "Amazon Simple Storage Service (S3) is the primary scalable object storage service.",
        type: "mcq",
        difficulty: 1,
        tags: ["storage", "basics"]
      },
      {
        prompt: "What cloud pricing model is best for temporary development servers that can be terminated without warning for massive discounts?",
        options: ["On-Demand", "Reserved Instances", "Spot Instances", "Dedicated Hosts"],
        correct: ["c"],
        explanation: "Spot Instances offer idle cloud computing capacity at massive discounts, though they can be reclaimed by providers with short notices.",
        type: "mcq",
        difficulty: 2,
        tags: ["pricing", "basics"]
      },
      {
        prompt: "Which public cloud provider operates Azure?",
        options: ["Amazon Web Services", "Microsoft", "Google Cloud", "IBM"],
        correct: ["b"],
        explanation: "Azure is the primary enterprise cloud computing platform developed by Microsoft.",
        type: "mcq",
        difficulty: 1,
        tags: ["basics", "providers"]
      },
      {
        prompt: "What does standard database replication help achieve?",
        options: [
          "Data compression",
          "High availability and read performance scaling",
          "Automatic table indexing",
          "None of the above"
        ],
        correct: ["b"],
        explanation: "Replicating data databases across regions protects against single-site failures and allows queries to run on regional read-replicas.",
        type: "mcq",
        difficulty: 2,
        tags: ["databases", "ha"]
      },
      {
        prompt: "What is an IP Address used for in cloud VPCs?",
        options: [
          "To identify hardware nodes",
          "To assign unique numeric labels to devices to enable routing and communication across networks",
          "To measure data speeds",
          "To compile application codes"
        ],
        correct: ["b"],
        explanation: "IP addresses are standardized numerical labels that locate and route packets to individual devices on VPC networks.",
        type: "mcq",
        difficulty: 1,
        tags: ["networking", "basics"]
      },
      {
        prompt: "Which cloud service category represents a database fully managed by the cloud provider (like Amazon RDS)?",
        options: ["IaaS", "PaaS (or Managed Database Services)", "SaaS", "Raw Storage"],
        correct: ["b"],
        explanation: "Managed databases abstract server management and OS updates, categorizing them as platform-level (PaaS) services.",
        type: "mcq",
        difficulty: 2,
        tags: ["databases", "basics"]
      }
    ],
    intermediate: [
      {
        prompt: "What type of load balancer routes traffic based on HTTP/HTTPS layer 7 header paths and parameters?",
        options: ["Network Load Balancer (NLB)", "Application Load Balancer (ALB)", "Classic Load Balancer", "Gateway Load Balancer"],
        correct: ["b"],
        explanation: "ALBs operate at the application layer (Layer 7), enabling path-based and host-based routing decisions.",
        type: "mcq",
        difficulty: 2,
        tags: ["load-balancing", "networking"]
      },
      {
        prompt: "What does a NAT Gateway do in a cloud VPC?",
        options: [
          "Encrypts DB records",
          "Allows instances in private subnets to connect out to the internet, while preventing the internet from initiating connections back",
          "Connects two VPCs together",
          "None of the above"
        ],
        correct: ["b"],
        explanation: "Network Address Translation (NAT) Gateways mask private subnet IPs to fetch packages from public networks safely.",
        type: "mcq",
        difficulty: 2,
        tags: ["networking", "vpc"]
      },
      {
        prompt: "Which backup objective represents the maximum acceptable age of data that can be lost after a recovery event (RPO)?",
        options: ["Recovery Time Objective (RTO)", "Recovery Point Objective (RPO)", "SLA margin", "Failover threshold"],
        correct: ["b"],
        explanation: "RPO measures allowable data loss in terms of time duration (e.g. 'we must not lose more than 4 hours of updates').",
        type: "mcq",
        difficulty: 3,
        tags: ["disaster-recovery", "ha"]
      },
      {
        prompt: "In IAM security, what is the best practice for assigning permissions to automated backend server applications?",
        options: [
          "Hardcode root credentials inside server files",
          "Assign a custom IAM Role to the hosting server instance dynamically",
          "Create an admin user and save keys in environment variables",
          "Disable security checks entirely"
        ],
        correct: ["b"],
        explanation: "Assigning Roles directly to compute instances uses metadata tokens that rotate automatically, avoiding hardcoded secret keys.",
        type: "mcq",
        difficulty: 3,
        tags: ["security", "iam"]
      },
      {
        prompt: "What is Docker used for in containerized cloud setups?",
        options: [
          "To speed up CPU clock rates",
          "To package applications and all their dependencies into a standardized container image that executes consistently",
          "To scale hard disk sizes",
          "To route domains"
        ],
        correct: ["b"],
        explanation: "Docker isolates processes in light containers, ensuring they run identically in local development and production environments.",
        type: "mcq",
        difficulty: 2,
        tags: ["containers", "docker"]
      },
      {
        prompt: "Which public cloud service is Google's primary serverless container execution platform, billed down to 100ms cycles?",
        options: ["Google App Engine", "Google Compute Engine", "Google Cloud Run", "Google Kubernetes Engine"],
        correct: ["c"],
        explanation: "Google Cloud Run is a managed serverless platform that automatically scales container instances from zero based on request traffic.",
        type: "mcq",
        difficulty: 2,
        tags: ["serverless", "containers"]
      },
      {
        prompt: "What VPC element defines routing rules to determine where network traffic is directed?",
        options: ["Route Table", "Subnet mask", "Security Group", "Network ACL"],
        correct: ["a"],
        explanation: "Route Tables contain lists of destination CIDR blocks mapped to target gateways or network interfaces.",
        type: "mcq",
        difficulty: 2,
        tags: ["networking", "vpc"]
      },
      {
        prompt: "What security layer operates as a stateful firewall at the virtual server instance level?",
        options: ["Network ACL (NACL)", "Security Group", "VPC Router", "NAT Gateway"],
        correct: ["b"],
        explanation: "Security Groups are stateful firewalls that filter traffic at the instance level. Network ACLs are stateless and operate at the subnet level.",
        type: "mcq",
        difficulty: 2,
        tags: ["security", "firewalls"]
      },
      {
        prompt: "What is the primary difference between a Security Group and a Network ACL (NACL)?",
        options: [
          "Security Groups are stateful, NACLs are stateless",
          "Security Groups apply to subnets, NACLs to instances",
          "Security Groups only block traffic, NACLs only permit",
          "None of the above"
        ],
        correct: ["a"],
        explanation: "Security Groups automatically allow returning response traffic (stateful), while NACLs require explicit rule matches in both directions (stateless).",
        type: "mcq",
        difficulty: 3,
        tags: ["security", "networking"]
      },
      {
        prompt: "Which of the following describes an active-passive multi-region database configuration?",
        options: [
          "Both databases are writing data concurrently",
          "One master database receives all writes in region A, replicating data to read-only instances in region B which are promoted on failover",
          "The database is completely turned off in region B",
          "None of the above"
        ],
        correct: ["b"],
        explanation: "Active-passive configuration routes all updates to a single master location, keeping a secondary replica ready to take over in disaster events.",
        type: "mcq",
        difficulty: 3,
        tags: ["databases", "disaster-recovery"]
      },
      {
        prompt: "Which cloud service provides managed scalable file shares accessible across multiple server instances simultaneously?",
        options: ["Block Storage (AWS EBS)", "Object Storage (AWS S3)", "File Storage (AWS EFS)", "Archive Storage (Glacier)"],
        correct: ["c"],
        explanation: "File Storage (like EFS or Google Filestore) supports standard NFS mounting, allowing concurrent reads/writes from many VMs.",
        type: "mcq",
        difficulty: 2,
        tags: ["storage", "efs"]
      },
      {
        prompt: "What technology allows connection of two virtual networks (VPCs) together privately using internal cloud backbones?",
        options: ["VPC Peering", "NAT Gateway", "Internet Gateway", "VPN Client"],
        correct: ["a"],
        explanation: "VPC Peering routes packets between separate virtual networks directly, bypassing public internet gateways.",
        type: "mcq",
        difficulty: 2,
        tags: ["networking", "vpc"]
      },
      {
        prompt: "What database class is designed for highly unstructured data scaling to petabytes with dynamic schemas (e.g. DynamoDB)?",
        options: ["Relational Database (RDBMS)", "NoSQL Database", "SQL Database", "Flat files"],
        correct: ["b"],
        explanation: "NoSQL databases (like document or key-value structures) scale horizontally, trading strict relational joins for fast, dynamic writes.",
        type: "mcq",
        difficulty: 2,
        tags: ["databases", "nosql"]
      },
      {
        prompt: "What does the SLA metric represent in cloud service agreements?",
        options: [
          "System Log Array",
          "Service Level Agreement (guaranteed percentage of uptime)",
          "Security Level Authorization",
          "Serverless Launch Agency"
        ],
        correct: ["b"],
        explanation: "Service Level Agreements (SLAs) define uptime guarantees (e.g., 99.99%) that cloud providers commit to supporting.",
        type: "mcq",
        difficulty: 2,
        tags: ["metrics", "business"]
      },
      {
        prompt: "In load balancing, what is a 'Sticky Session' (session affinity)?",
        options: [
          "A session that never logouts",
          "Routing all subsequent requests from a specific user client to the identical backend server node",
          "An encrypted network packet",
          "None of the above"
        ],
        correct: ["b"],
        explanation: "Sticky Sessions bind a user's browser to one server instance, preserving in-memory session details across requests.",
        type: "mcq",
        difficulty: 3,
        tags: ["load-balancing", "scaling"]
      },
      {
        prompt: "What does 'Infrastructure as Code' (IaC) enable developers to do?",
        options: [
          "Write backend program files",
          "Define, deploy, and manage cloud physical structures using text configuration scripts (e.g. Terraform)",
          "Compile code inside virtual machines",
          "None of the above"
        ],
        correct: ["b"],
        explanation: "IaC automates architecture setups by parsing declarative script files to build reproducible server topologies.",
        type: "mcq",
        difficulty: 2,
        tags: ["iac", "terraform"]
      },
      {
        prompt: "Which public cloud service is standard for compiling and tracking system performance logs in Google Cloud?",
        options: ["Google Cloud Logging (Stackdriver)", "Google Cloud Storage", "Google BigQuery", "Google Cloud Trace"],
        correct: ["a"],
        explanation: "Google Cloud Logging compiles, filters, and retains application and infrastructure performance logs.",
        type: "mcq",
        difficulty: 2,
        tags: ["monitoring", "gcp"]
      },
      {
        prompt: "What are 'containers' compared to virtual machines?",
        options: [
          "They are larger and slower",
          "They share the host OS kernel instead of virtualizing hardware, making them extremely lightweight and fast to boot",
          "They do not use memory",
          "None of the above"
        ],
        correct: ["b"],
        explanation: "Containers package only dependencies and files, sharing OS kernels to avoid hypervisor hardware virtualization costs.",
        type: "mcq",
        difficulty: 2,
        tags: ["containers", "basics"]
      },
      {
        prompt: "Which public cloud product acts as a managed Kubernetes hosting platform in AWS?",
        options: ["AWS ECS", "AWS EKS", "AWS Fargate", "AWS Lambda"],
        correct: ["b"],
        explanation: "AWS Elastic Kubernetes Service (EKS) manages the Kubernetes control plane nodes, handling cluster nodes automatically.",
        type: "mcq",
        difficulty: 2,
        tags: ["kubernetes", "aws"]
      },
      {
        prompt: "What does the RTO metric represent in business continuity plans?",
        options: [
          "Resource Time Optimization",
          "Recovery Time Objective (maximum duration to restore systems after a disaster)",
          "Rate Limit Timeout Offset",
          "None of the above"
        ],
        correct: ["b"],
        explanation: "RTO measures target recovery speed, defining how quickly systems must be restored to operation after an outage.",
        type: "mcq",
        difficulty: 3,
        tags: ["disaster-recovery", "ha"]
      }
    ],
    advanced: [
      {
        prompt: "In Kubernetes architecture, what master component manages container scheduling onto worker nodes?",
        options: ["Kube-apiserver", "Kube-scheduler", "Etcd", "Kube-controller-manager"],
        correct: ["b"],
        explanation: "The kube-scheduler detects newly created pods and assigns them to specific worker nodes based on capacity constraints.",
        type: "mcq",
        difficulty: 4,
        tags: ["kubernetes", "architecture"]
      },
      {
        prompt: "Which cluster store holds the complete configuration and state details of a Kubernetes system?",
        options: ["Redis", "Etcd", "PostgreSQL", "InfluxDB"],
        correct: ["b"],
        explanation: "Etcd is a consistent, highly-available key-value store used as Kubernetes' backing database.",
        type: "mcq",
        difficulty: 5,
        tags: ["kubernetes", "etcd"]
      },
      {
        prompt: "In Terraform, which command parses code files and previews what cloud resources will be created or updated?",
        options: ["terraform init", "terraform plan", "terraform apply", "terraform show"],
        correct: ["b"],
        explanation: "`terraform plan` conducts comparative checks against active state registers, previewing pending creation and destruction updates.",
        type: "mcq",
        difficulty: 3,
        tags: ["terraform", "iac"]
      },
      {
        prompt: "What type of connection is established to link on-premise physical data centers to cloud VPCs over a private fiber channel?",
        options: ["IPsec VPN", "Direct Connect (or Interconnect)", "VPC Peering", "HTTPS Reverse Proxy"],
        correct: ["b"],
        explanation: "Direct Connect (AWS) or Dedicated Interconnect (GCP) establishes direct physical fiber lines to bypass public internet networks.",
        type: "mcq",
        difficulty: 4,
        tags: ["networking", "hybrid"]
      },
      {
        prompt: "Which Kubernetes resource controller ensures a specified count of pod replicas are executing consistently?",
        options: ["ReplicaSet", "Service", "Ingress", "ConfigMap"],
        correct: ["a"],
        explanation: "ReplicaSets monitor active pod populations, spawning or destroying nodes to maintain the configured count.",
        type: "mcq",
        difficulty: 4,
        tags: ["kubernetes", "replicaset"]
      },
      {
        prompt: "Which database service represents Google Cloud's highly scalable relational database offering horizontal scaling and transactional consistency globally?",
        options: ["Cloud SQL", "Cloud Spanner", "Cloud Bigtable", "Firestore"],
        correct: ["b"],
        explanation: "Cloud Spanner uses GPS and atomic clocks to deliver globally distributed ACID transactions with infinite scaling.",
        type: "mcq",
        difficulty: 5,
        tags: ["databases", "gcp"]
      },
      {
        prompt: "What is the purpose of a Terraform State file (terraform.tfstate)?",
        options: [
          "To hold user login passwords",
          "To act as a map connecting Terraform code declarations to actual deployed resources in the cloud",
          "To compile Python code",
          "To store database logs"
        ],
        correct: ["b"],
        explanation: "The state file tracks deployed resource properties, letting Terraform plan incremental changes and destroy resources safely.",
        type: "mcq",
        difficulty: 4,
        tags: ["terraform", "iac"]
      },
      {
        prompt: "What is an 'Ingress' controller in a Kubernetes cluster?",
        options: [
          "An internal database service",
          "An API object that manages external HTTP/S routing and load balancing into cluster Services",
          "A private container registry",
          "None of the above"
        ],
        correct: ["b"],
        explanation: "Ingress exposes HTTP/S routes from outside the cluster to internal services, often handling SSL termination and path routing.",
        type: "mcq",
        difficulty: 4,
        tags: ["kubernetes", "ingress"]
      },
      {
        prompt: "Which encryption key management model involves clients controlling keys while cloud providers handle security (Customer Managed Keys)?",
        options: ["AWS KMS with CMK", "Cloud KMS with CMEK", "Both of the above", "None of the above"],
        correct: ["c"],
        explanation: "Both Customer Managed Keys (CMEK/CMK) let organizations create, manage, rotate, and audit their own encryption keys on cloud KMS modules.",
        type: "mcq",
        difficulty: 4,
        tags: ["security", "kms"]
      },
      {
        prompt: "In microservices architectures, what is a 'Service Mesh' (like Istio) primarily used for?",
        options: [
          "To compile container files",
          "To manage service-to-service communication, load balancing, mutual TLS encryption, and telemetry",
          "To replicate database entries",
          "To scale compute clusters"
        ],
        correct: ["b"],
        explanation: "Service meshes deploy proxy sidecars to intercept service-to-service calls, standardizing traffic rules, encryption, and metrics.",
        type: "mcq",
        difficulty: 5,
        tags: ["architecture", "service-mesh"]
      },
      {
        prompt: "What describes a multi-region active-active database deployment?",
        options: [
          "Database instances in all active regions accept read and write actions concurrently, syncing updates bi-directionally",
          "Only one region handles write actions",
          "Data is completely isolated in separate regions",
          "None of the above"
        ],
        correct: ["a"],
        explanation: "Active-active multi-region databases accept writes in multiple locations simultaneously, requiring advanced consensus/conflict resolution rules.",
        type: "mcq",
        difficulty: 5,
        tags: ["databases", "ha"]
      },
      {
        prompt: "Which tool is standard for monitoring container performance metrics and raising system alarms?",
        options: ["Prometheus", "Terraform", "Docker Compose", "Etcd"],
        correct: ["a"],
        explanation: "Prometheus is a time-series metric scraper designed to query Kubernetes and container runtimes, triggering alerts via Alertmanager.",
        type: "mcq",
        difficulty: 4,
        tags: ["monitoring", "containers"]
      },
      {
        prompt: "What does 'gitops' describe in cloud deployment pipelines?",
        options: [
          "Managing code in Git",
          "Using Git repositories as the single source of truth for declarative infrastructure and application configurations",
          "Deleting old servers",
          "None of the above"
        ],
        correct: ["b"],
        explanation: "GitOps uses git pull requests and automated reconcilers (like ArgoCD) to deploy and match active cloud environments to configuration states in Git.",
        type: "mcq",
        difficulty: 4,
        tags: ["devops", "gitops"]
      },
      {
        prompt: "In AWS, what security service provides automated threat detection by analyzing VPC flow logs, DNS queries, and CloudTrail events?",
        options: ["AWS GuardDuty", "AWS WAF", "AWS Shield", "AWS Inspector"],
        correct: ["a"],
        explanation: "GuardDuty uses machine learning and threat intelligence to detect anomalous activity across AWS accounts, scanning logs continuously.",
        type: "mcq",
        difficulty: 4,
        tags: ["security", "aws"]
      },
      {
        prompt: "Which Kubernetes resource is used to store sensitive key-value parameters (such as passwords or API tokens) securely?",
        options: ["ConfigMap", "Secret", "StatefulSet", "ServiceAccount"],
        correct: ["b"],
        explanation: "Secrets hold base64 encoded parameters that are mounted into pods, keeping credentials separate from code images.",
        type: "mcq",
        difficulty: 3,
        tags: ["kubernetes", "security"]
      },
      {
        prompt: "In cloud economics, what does 'FinOps' represent?",
        options: [
          "Financial options trading",
          "An operational framework combining finance, engineering, and business to optimize cloud computing costs",
          "Database optimization software",
          "None of the above"
        ],
        correct: ["b"],
        explanation: "FinOps brings financial accountability to cloud spending, helping teams optimize usage, track unit economics, and reduce waste.",
        type: "mcq",
        difficulty: 3,
        tags: ["business", "finops"]
      },
      {
        prompt: "What occurs if you attempt to peer two VPCs together that have overlapping CIDR IP address blocks?",
        options: [
          "The peering fails because overlapping IP ranges would create ambiguous network routing",
          "Traffic gets automatically remapped",
          "VPCs merge into a single network",
          "None of the above"
        ],
        correct: ["a"],
        explanation: "Peering requires distinct, non-overlapping IP spaces so routers can uniquely forward packets to their destination.",
        type: "mcq",
        difficulty: 4,
        tags: ["networking", "vpc"]
      },
      {
        prompt: "Which managed AWS service handles massive scalable streaming data ingestion in real-time?",
        options: ["AWS SQS", "AWS Kinesis", "AWS SNS", "AWS Aurora"],
        correct: ["b"],
        explanation: "AWS Kinesis ingests and processes high-throughput real-time streams (logs, clickstreams, telemetry) across shards.",
        type: "mcq",
        difficulty: 4,
        tags: ["streaming", "aws"]
      },
      {
        prompt: "What describes a StatefulSet controller in a Kubernetes cluster?",
        options: [
          "A controller that does not save files",
          "A controller designed to deploy stateful applications, enforcing stable unique network IDs and persistent disk storage mappings",
          "A backup system",
          "None of the above"
        ],
        correct: ["b"],
        explanation: "StatefulSets maintain persistent identities for pods (like `database-0`, `database-1`), keeping their storage volumes attached even if pods migrate.",
        type: "mcq",
        difficulty: 5,
        tags: ["kubernetes", "statefulset"]
      },
      {
        prompt: "What is an AWS IAM Policy?",
        options: [
          "A password requirement",
          "A JSON document defining exactly what permissions are granted or denied to specific users or roles",
          "An operating system setting",
          "None of the above"
        ],
        correct: ["b"],
        explanation: "IAM Policies define permissions using declarative JSON rules (Effect, Action, Resource) to regulate cloud resources.",
        type: "mcq",
        difficulty: 3,
        tags: ["security", "iam"]
      }
    ]
  }
};

export function getProceduralQuestions(trackId: TrackSlug, level: SkillLevel): Question[] {
  const templates = TEMPLATES[trackId]?.[level] || [];
  return templates.map((tmpl, idx) => {
    const _id = `gen_${trackId}_${level}_${idx + 1}`;
    
    // Convert templates to full Question objects
    const options = tmpl.options ? tmpl.options.map((opt, oIdx) => {
      const alphabet = ['a', 'b', 'c', 'd', 'e'];
      return {
        id: alphabet[oIdx] || String(oIdx),
        text: opt
      };
    }) : undefined;

    return {
      _id,
      trackId,
      level,
      topicTags: tmpl.tags,
      type: tmpl.type,
      prompt: tmpl.prompt,
      options,
      correctOptionIds: tmpl.correct,
      difficulty: tmpl.difficulty,
      explanation: tmpl.explanation,
      version: 1,
      active: true,
      createdBy: 'procedural_generator',
      createdAt: new Date().toISOString()
    };
  });
}
