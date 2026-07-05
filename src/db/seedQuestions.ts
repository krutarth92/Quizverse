import { Question } from '../types';

export const SEED_QUESTIONS: Question[] = [
  // PYTHON TRACK
  {
    _id: 'py_001',
    trackId: 'python',
    level: 'beginner',
    topicTags: ['syntax', 'variables'],
    type: 'mcq',
    prompt: 'What is the output of the following Python expression?\n\n`print(type(1 / 2))`',
    options: [
      { id: 'a', text: "<class 'int'>" },
      { id: 'b', text: "<class 'float'>" },
      { id: 'c', text: "<class 'double'>" },
      { id: 'd', text: "<class 'decimal'>" }
    ],
    correctOptionIds: ['b'],
    difficulty: 1,
    explanation: 'In Python 3, the single slash division operator `/` always performs float division and returns a float, even if both operands are integers.',
    version: 1,
    active: true,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'py_002',
    trackId: 'python',
    level: 'beginner',
    topicTags: ['data-types', 'mutability'],
    type: 'multi',
    prompt: 'Which of the following built-in Python data types are mutable? (Select all that apply)',
    options: [
      { id: 'a', text: 'List' },
      { id: 'b', text: 'Tuple' },
      { id: 'c', text: 'Set' },
      { id: 'd', text: 'Dictionary' }
    ],
    correctOptionIds: ['a', 'c', 'd'],
    difficulty: 2,
    explanation: 'Lists, Sets, and Dictionaries are mutable objects in Python. Tuples are immutable; once created, their elements cannot be changed.',
    version: 1,
    active: true,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'py_003',
    trackId: 'python',
    level: 'intermediate',
    topicTags: ['scoping', 'functions'],
    type: 'code-output',
    prompt: 'Analyze the following block of Python code and determine the output:\n\n```python\nx = 10\ndef run():\n    global x\n    x = 20\n    def inner():\n        nonlocal x\n        x = 30\n    inner()\nrun()\nprint(x)\n```',
    options: [
      { id: 'a', text: '10' },
      { id: 'b', text: '20' },
      { id: 'c', text: '30' },
      { id: 'd', text: 'SyntaxError: no binding for nonlocal found' }
    ],
    correctOptionIds: ['d'],
    difficulty: 4,
    explanation: 'A nonlocal statement requires that the specified variable exists in an enclosing function scope (other than global). Since `x` is declared as `global` in `run()`, the nonlocal binding fails in `inner()` and raises a SyntaxError.',
    version: 1,
    active: true,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'py_004',
    trackId: 'python',
    level: 'intermediate',
    topicTags: ['comprehensions'],
    type: 'fill-blank',
    prompt: 'What keyword completes the generator expression to extract even values? Fill in the blank (case-insensitive, exactly one word):\n\n`evens = (x for x in range(10) ____ x % 2 == 0)`',
    correctOptionIds: ['if'],
    difficulty: 2,
    explanation: 'The `if` keyword is used in generator expressions or list comprehensions to filter items.',
    version: 1,
    active: true,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'py_005',
    trackId: 'python',
    level: 'advanced',
    topicTags: ['metaclasses', 'oop'],
    type: 'mcq',
    prompt: 'In Python, what is the default metaclass of all standard class definitions?',
    options: [
      { id: 'a', text: 'object' },
      { id: 'b', text: 'type' },
      { id: 'c', text: 'meta' },
      { id: 'd', text: 'Class' }
    ],
    correctOptionIds: ['b'],
    difficulty: 5,
    explanation: 'In Python, `type` is the default metaclass that is responsible for constructing all user-defined classes.',
    version: 1,
    active: true,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'py_006',
    trackId: 'python',
    level: 'api',
    topicTags: ['rest', 'fastapi'],
    type: 'mcq',
    prompt: 'Which HTTP method should be used to partially update an existing resource according to standard RESTful guidelines?',
    options: [
      { id: 'a', text: 'PUT' },
      { id: 'b', text: 'POST' },
      { id: 'c', text: 'PATCH' },
      { id: 'd', text: 'OPTIONS' }
    ],
    correctOptionIds: ['c'],
    difficulty: 2,
    explanation: 'PATCH is designed for making partial modifications to an existing resource, whereas PUT is traditionally used to replace an entire resource.',
    version: 1,
    active: true,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'py_007',
    trackId: 'python',
    level: 'django',
    topicTags: ['django', 'orm'],
    type: 'mcq',
    prompt: 'Which Django ORM method should you use to prevent "N+1 query" problems for foreign key relationships by performing an SQL JOIN?',
    options: [
      { id: 'a', text: 'prefetch_related' },
      { id: 'b', text: 'select_related' },
      { id: 'c', text: 'join_related' },
      { id: 'd', text: 'optimize_queries' }
    ],
    correctOptionIds: ['b'],
    explanation: '`select_related` works by creating an SQL JOIN and including the fields of the related object in the SELECT statement. `prefetch_related` does a separate lookup for each relationship and does the joining in Python, which is better for many-to-many or many-to-one relations.',
    difficulty: 4,
    version: 1,
    active: true,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  },

  // AI & MACHINE LEARNING TRACK
  {
    _id: 'ai_001',
    trackId: 'ai-ml',
    level: 'beginner',
    topicTags: ['supervised-learning', 'basics'],
    type: 'mcq',
    prompt: 'Which sub-field of Machine Learning involves training an agent to make decisions by rewarding correct actions and penalizing incorrect ones?',
    options: [
      { id: 'a', text: 'Supervised Learning' },
      { id: 'b', text: 'Unsupervised Learning' },
      { id: 'c', text: 'Reinforcement Learning' },
      { id: 'd', text: 'Self-Supervised Learning' }
    ],
    correctOptionIds: ['c'],
    difficulty: 1,
    explanation: 'Reinforcement Learning centers around agents learning to optimize their behavior in an environment to maximize cumulative reward.',
    version: 1,
    active: true,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ai_002',
    trackId: 'ai-ml',
    level: 'intermediate',
    topicTags: ['neural-networks', 'activation-functions'],
    type: 'multi',
    prompt: 'Which of the following are common activation functions used in Deep Neural Networks to introduce non-linearity? (Select all that apply)',
    options: [
      { id: 'a', text: 'ReLU (Rectified Linear Unit)' },
      { id: 'b', text: 'MSE (Mean Squared Error)' },
      { id: 'c', text: 'Sigmoid' },
      { id: 'd', text: 'GELU (Gaussian Error Linear Unit)' }
    ],
    correctOptionIds: ['a', 'c', 'd'],
    difficulty: 3,
    explanation: 'ReLU, Sigmoid, and GELU are popular activation functions. MSE is a loss function, not an activation function.',
    version: 1,
    active: true,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ai_003',
    trackId: 'ai-ml',
    level: 'advanced',
    topicTags: ['transformers', 'attention'],
    type: 'fill-blank',
    prompt: 'What structural innovation introduced in the 2017 paper "Attention Is All You Need" enables parallel sequence processing, replacing recurrent LSTM loops? (Enter the exactly matched noun, e.g. "transformer")',
    correctOptionIds: ['transformer', 'transformers', 'self-attention'],
    difficulty: 4,
    explanation: 'The Transformer architecture completely discarded recurrent structures, relying solely on Self-Attention mechanisms to process input sequences in parallel.',
    version: 1,
    active: true,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ai_004',
    trackId: 'ai-ml',
    level: 'intermediate',
    topicTags: ['overfitting', 'regularization'],
    type: 'mcq',
    prompt: 'Which technique helps prevent overfitting in a Neural Network by randomly turning off nodes during each step of the training phase?',
    options: [
      { id: 'a', text: 'Batch Normalization' },
      { id: 'b', text: 'Dropout' },
      { id: 'c', text: 'Gradient Clipping' },
      { id: 'd', text: 'L1 L2 Regularization' }
    ],
    correctOptionIds: ['b'],
    difficulty: 3,
    explanation: 'Dropout randomly deactivates selected neurons during training, forcing the network to learn redundant and robust representations.',
    version: 1,
    active: true,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ai_005',
    trackId: 'ai-ml',
    level: 'advanced',
    topicTags: ['llms', 'prompt-engineering'],
    type: 'code-output',
    prompt: 'Consider a cross-entropy loss function $L = -\\sum y_i \\log(\\hat{y}_i)$. If a neural network outputs a confidence score of 1.0 on the wrong class, what is the theoretical limit of the cross-entropy loss?',
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: '1.0' },
      { id: 'c', text: 'Infinity' },
      { id: 'd', text: 'NaN' }
    ],
    correctOptionIds: ['c'],
    difficulty: 5,
    explanation: 'When the model is completely confident in an incorrect class, the predicted probability for the correct class $\\hat{y}_{correct}$ approaches 0. Since $\\log(0)$ approaches negative infinity, the cross-entropy loss $- \\log(0)$ approaches positive infinity.',
    version: 1,
    active: true,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  },

  // CLOUD COMPUTING TRACK
  {
    _id: 'cl_001',
    trackId: 'cloud',
    level: 'beginner',
    topicTags: ['gcp', 'aws', 'basics'],
    type: 'mcq',
    prompt: 'Which of the following cloud service models represents an offering where the provider manages servers, database engines, and runtime containers, and the developer only deploys applications? (e.g. AWS Elastic Beanstalk or Heroku)',
    options: [
      { id: 'a', text: 'IaaS (Infrastructure as a Service)' },
      { id: 'b', text: 'PaaS (Platform as a Service)' },
      { id: 'c', text: 'SaaS (Software as a Service)' },
      { id: 'd', text: 'FaaS (Function as a Service)' }
    ],
    correctOptionIds: ['b'],
    difficulty: 1,
    explanation: 'Platform as a Service (PaaS) provides a managed platform where developers do not need to manage underlying servers or operating systems.',
    version: 1,
    active: true,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'cl_002',
    trackId: 'cloud',
    level: 'intermediate',
    topicTags: ['load-balancing', 'ha'],
    type: 'multi',
    prompt: 'In cloud architecture, which methods can be used to achieve High Availability (HA)? (Select all that apply)',
    options: [
      { id: 'a', text: 'Deploying resources across multiple Availability Zones (AZs)' },
      { id: 'b', text: 'Horizontal auto-scaling behind an Elastic Load Balancer' },
      { id: 'c', text: 'Deploying all servers in a single high-CPU virtualization rack' },
      { id: 'd', text: 'Setting up active-passive multi-region database failovers' }
    ],
    correctOptionIds: ['a', 'b', 'd'],
    difficulty: 3,
    explanation: 'High Availability is achieved through redundancy (multi-AZ/multi-region deployment) and load balancing. Storing resources on a single rack is a single point of failure.',
    version: 1,
    active: true,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'cl_003',
    trackId: 'cloud',
    level: 'advanced',
    topicTags: ['security', 'iam'],
    type: 'fill-blank',
    prompt: 'What security principle dictates that cloud users and automated services should only be granted the minimum necessary permissions required to perform their tasks? (Fill in the blank, exactly 4 words, e.g. "principle of least privilege")',
    correctOptionIds: ['principle of least privilege'],
    difficulty: 3,
    explanation: 'The Principle of Least Privilege (PoLP) restricts user and process permissions to only what is strictly necessary, minimizing security exposures.',
    version: 1,
    active: true,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'cl_004',
    trackId: 'cloud',
    level: 'advanced',
    topicTags: ['kubernetes', 'containers'],
    type: 'mcq',
    prompt: 'In Kubernetes, what is the smallest deployable object that can be created and managed?',
    options: [
      { id: 'a', text: 'Container' },
      { id: 'b', text: 'Pod' },
      { id: 'c', text: 'Service' },
      { id: 'd', text: 'Deployment' }
    ],
    correctOptionIds: ['b'],
    difficulty: 4,
    explanation: 'A Pod represents a single instance of a running process in your cluster, containing one or more tightly coupled containers.',
    version: 1,
    active: true,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'cl_005',
    trackId: 'cloud',
    level: 'intermediate',
    topicTags: ['serverless', 'faas'],
    type: 'mcq',
    prompt: 'What is the standard AWS serverless execution product that allows you to run code without provisioning or managing servers, billed down to millisecond increments?',
    options: [
      { id: 'a', text: 'AWS EC2' },
      { id: 'b', text: 'AWS Fargate' },
      { id: 'c', text: 'AWS Lambda' },
      { id: 'd', text: 'AWS ECS' }
    ],
    correctOptionIds: ['c'],
    difficulty: 2,
    explanation: 'AWS Lambda is the primary FaaS serverless computing service provided by Amazon Web Services.',
    version: 1,
    active: true,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  }
];
