require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Video = require('../models/Video');
const CodingModule = require('../models/CodingModule');
const ResourceLink = require('../models/ResourceLink');

const connectDB = require('../config/database');

/**
 * Seed the database with dummy data
 */
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    await connectDB();

    // Clear existing data and drop indexes
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Video.deleteMany({}),
      CodingModule.deleteMany({}),
      ResourceLink.deleteMany({})
    ]);
    
    // Drop existing indexes to avoid conflicts
    console.log('🔧 Dropping old indexes...');
    try {
      await Promise.all([
        Video.collection.dropIndexes(),
        CodingModule.collection.dropIndexes(),
        ResourceLink.collection.dropIndexes()
      ]);
    } catch (err) {
      console.log('No indexes to drop or already dropped');
    }

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@campus.lk',
      password: 'admin123',
      role: 'admin'
    });

    // Create sample students
    console.log('👥 Creating sample students...');
    const students = await User.create([
      {
        name: 'Ravindu Silva',
        email: 'ravindu@student.lk',
        password: 'student123',
        role: 'student',
        yearOfStudy: 2,
        department: 'Computer Science',
        preferredLanguage: 'english'
      },
      {
        name: 'Kaveesha Perera',
        email: 'kaveesha@student.lk',
        password: 'student123',
        role: 'student',
        yearOfStudy: 3,
        department: 'Software Engineering',
        preferredLanguage: 'sinhala'
      },
      {
        name: 'Thilini Fernando',
        email: 'thilini@student.lk',
        password: 'student123',
        role: 'student',
        yearOfStudy: 1,
        department: 'Information Technology',
        preferredLanguage: 'tamil'
      }
    ]);

    // Create sample videos
    console.log('🎥 Creating sample videos...');
    const videos = await Video.create([
      {
        title: 'Introduction to Data Structures and Algorithms',
        description: 'Learn the fundamentals of DSA including arrays, linked lists, and basic sorting algorithms.',
        category: 'DSA',
        language: 'english',
        videoUrl: 'https://www.youtube.com/watch?v=8hly31xKli0',
        thumbnailUrl: 'https://img.youtube.com/vi/8hly31xKli0/maxresdefault.jpg',
        duration: 3600,
        difficulty: 'beginner',
        topics: ['Arrays', 'Linked Lists', 'Sorting', 'Searching'],
        views: 150,
        downloadableFiles: [
          {
            fileName: 'DSA_Notes.pdf',
            fileUrl: '/downloads/dsa_notes.pdf',
            fileType: 'pdf'
          }
        ],
        uploadedBy: admin._id,
        isPublished: true
      },
      {
        title: 'කොම්පියුටර් ග්‍රැෆික්ස් හැඳින්වීම',
        description: 'කොම්පියුටර් ග්‍රැෆික්ස් පිළිබඳ මූලික දැනුම ලබා ගන්න. 2D සහ 3D transformations ඉගෙන ගන්න.',
        category: 'Computer Graphics',
        language: 'sinhala',
        videoUrl: 'https://www.youtube.com/watch?v=vLKn2M6kqNE',
        thumbnailUrl: 'https://img.youtube.com/vi/vLKn2M6kqNE/maxresdefault.jpg',
        duration: 2700,
        difficulty: 'intermediate',
        topics: ['2D Graphics', '3D Graphics', 'Transformations', 'OpenGL'],
        views: 98,
        uploadedBy: admin._id,
        isPublished: true
      },
      {
        title: 'கணினி வலையமைப்பு அடிப்படைகள்',
        description: 'கணினி வலையமைப்பின் அடிப்படைகளை கற்றுக்கொள்ளுங்கள். TCP/IP, OSI மாதிரி மற்றும் பல.',
        category: 'Computer Networks',
        language: 'tamil',
        videoUrl: 'https://www.youtube.com/watch?v=3QhU9jd03a0',
        thumbnailUrl: 'https://img.youtube.com/vi/3QhU9jd03a0/maxresdefault.jpg',
        duration: 4200,
        difficulty: 'beginner',
        topics: ['TCP/IP', 'OSI Model', 'Networking Basics', 'Protocols'],
        views: 75,
        uploadedBy: admin._id,
        isPublished: true
      },
      {
        title: 'Cybersecurity Fundamentals',
        description: 'Understanding basic cybersecurity concepts, threats, and protection mechanisms.',
        category: 'Cybersecurity',
        language: 'english',
        videoUrl: 'https://www.youtube.com/watch?v=inWWhr5tnEA',
        thumbnailUrl: 'https://img.youtube.com/vi/inWWhr5tnEA/maxresdefault.jpg',
        duration: 3900,
        difficulty: 'intermediate',
        topics: ['Security', 'Encryption', 'Authentication', 'Network Security'],
        views: 112,
        uploadedBy: admin._id,
        isPublished: true
      },
      {
        title: 'Figma Design Basics',
        description: 'Learn Figma from scratch. Design beautiful user interfaces and prototypes.',
        category: 'Figma',
        language: 'english',
        videoUrl: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
        thumbnailUrl: 'https://img.youtube.com/vi/FTFaQWZBqQ8/maxresdefault.jpg',
        duration: 3300,
        difficulty: 'beginner',
        topics: ['UI Design', 'Prototyping', 'Design Tools', 'UX'],
        views: 203,
        uploadedBy: admin._id,
        isPublished: true
      },
      {
        title: 'Advanced Excel Functions',
        description: 'Master Excel with advanced functions, pivot tables, and data analysis techniques.',
        category: 'Excel',
        language: 'english',
        videoUrl: 'https://www.youtube.com/watch?v=Vl0H-qTclOg',
        thumbnailUrl: 'https://img.youtube.com/vi/Vl0H-qTclOg/maxresdefault.jpg',
        duration: 2400,
        difficulty: 'advanced',
        topics: ['Excel Functions', 'Pivot Tables', 'Data Analysis', 'Formulas'],
        views: 167,
        uploadedBy: admin._id,
        isPublished: true
      },
      {
        title: 'Encryption and Decryption Algorithms',
        description: 'Deep dive into cryptographic algorithms including AES, RSA, and DES.',
        category: 'Encryption Algorithms',
        language: 'english',
        videoUrl: 'https://www.youtube.com/watch?v=NuyzuNBFWxQ',
        thumbnailUrl: 'https://img.youtube.com/vi/NuyzuNBFWxQ/maxresdefault.jpg',
        duration: 4500,
        difficulty: 'advanced',
        topics: ['AES', 'RSA', 'DES', 'Cryptography', 'Security'],
        views: 89,
        uploadedBy: admin._id,
        isPublished: true
      }
    ]);

    // Create sample coding modules
    console.log('💻 Creating sample coding modules...');
    const codingModules = await CodingModule.create([
      {
        title: 'Binary Search Implementation',
        description: 'Implement binary search algorithm and test with different inputs.',
        category: 'DSA',
        type: 'coding',
        language: 'english',
        programmingLanguage: 'javascript',
        defaultCode: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}

// Test the function
const array = [1, 3, 5, 7, 9, 11, 13, 15];
const target = 7;
console.log(binarySearch(array, target));`,
        sampleInputs: [
          {
            input: 'array: [1, 3, 5, 7, 9, 11], target: 7',
            expectedOutput: '3',
            description: 'Find element at index 3'
          },
          {
            input: 'array: [2, 4, 6, 8, 10], target: 5',
            expectedOutput: '-1',
            description: 'Element not found'
          }
        ],
        difficulty: 'intermediate',
        instructions: 'Modify the function to handle edge cases and test with various inputs.',
        completionCount: 45,
        createdBy: admin._id,
        isPublished: true
      },
      {
        title: '2D Translation Visualization',
        description: 'Visualize 2D translation transformation on a square.',
        category: 'Computer Graphics',
        type: 'visualization',
        language: 'english',
        programmingLanguage: 'javascript',
        defaultCode: `// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Original square coordinates
let square = [
  { x: 50, y: 50 },
  { x: 150, y: 50 },
  { x: 150, y: 150 },
  { x: 50, y: 150 }
];

// Translation parameters
let tx = 100;  // Translate X
let ty = 50;   // Translate Y

function translate(points, dx, dy) {
  return points.map(p => ({
    x: p.x + dx,
    y: p.y + dy
  }));
}

function drawShape(points, color) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.stroke();
}

// Draw original
drawShape(square, 'blue');

// Draw translated
const translated = translate(square, tx, ty);
drawShape(translated, 'red');`,
        sampleInputs: [
          {
            input: 'tx: 100, ty: 50',
            expectedOutput: 'Square moved right 100px, down 50px',
            description: 'Standard translation'
          }
        ],
        graphicsData: {
          shapeType: 'rectangle',
          defaultCoordinates: [
            { x: 50, y: 50 },
            { x: 150, y: 50 },
            { x: 150, y: 150 },
            { x: 50, y: 150 }
          ],
          transformations: [
            {
              type: 'translation',
              parameters: { dx: 100, dy: 50 }
            }
          ]
        },
        difficulty: 'beginner',
        instructions: 'Change the tx and ty values to see different translations.',
        completionCount: 67,
        createdBy: admin._id,
        isPublished: true
      },
      {
        title: 'RSA Encryption Algorithm',
        description: 'Implement basic RSA encryption and decryption.',
        category: 'Encryption Algorithms',
        type: 'coding',
        language: 'english',
        programmingLanguage: 'python',
        defaultCode: `# Simple RSA implementation
import math

def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a

def mod_inverse(e, phi):
    for d in range(3, phi):
        if (d * e) % phi == 1:
            return d
    raise ValueError('No modular inverse')

# Choose two prime numbers
p = 61
q = 53

# Calculate n and phi
n = p * q
phi = (p - 1) * (q - 1)

# Public key (e, n)
e = 17
d = mod_inverse(e, phi)

print(f"Public Key: ({e}, {n})")
print(f"Private Key: ({d}, {n})")

# Encrypt
message = 65
encrypted = pow(message, e, n)
print(f"Encrypted: {encrypted}")

# Decrypt
decrypted = pow(encrypted, d, n)
print(f"Decrypted: {decrypted}")`,
        sampleInputs: [
          {
            input: 'p: 61, q: 53, message: 65',
            expectedOutput: 'Encrypted and decrypted successfully',
            description: 'Basic RSA encryption'
          }
        ],
        difficulty: 'advanced',
        instructions: 'Try different prime numbers and messages.',
        completionCount: 23,
        createdBy: admin._id,
        isPublished: true
      },
      {
        title: 'Bubble Sort සිංහලෙන්',
        description: 'Bubble sort algorithm එක implement කරන්න සහ test කරන්න.',
        category: 'Sorting Algorithms',
        type: 'coding',
        language: 'sinhala',
        programmingLanguage: 'javascript',
        defaultCode: `function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}

// Test
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Original:", numbers);
console.log("Sorted:", bubbleSort([...numbers]));`,
        sampleInputs: [
          {
            input: '[64, 34, 25, 12, 22, 11, 90]',
            expectedOutput: '[11, 12, 22, 25, 34, 64, 90]',
            description: 'Sort කරන්න'
          }
        ],
        difficulty: 'beginner',
        instructions: 'විවිධ arrays සමග test කරන්න.',
        completionCount: 31,
        createdBy: admin._id,
        isPublished: true
      }
    ]);

    // Create sample resource links
    console.log('🔗 Creating sample resource links...');
    const resourceLinks = await ResourceLink.create([
      {
        title: 'FreeCodeCamp - Learn to Code',
        description: 'Free coding tutorials and certifications for web development, data science, and more.',
        url: 'https://www.freecodecamp.org/',
        type: 'website',
        category: 'Web Development',
        language: 'english',
        topics: ['HTML', 'CSS', 'JavaScript', 'Python', 'Web Development'],
        clicks: 45,
        addedBy: admin._id,
        isActive: true
      },
      {
        title: 'GeeksforGeeks DSA Course',
        description: 'Comprehensive data structures and algorithms course with examples.',
        url: 'https://www.geeksforgeeks.org/data-structures/',
        type: 'website',
        category: 'DSA',
        language: 'english',
        topics: ['DSA', 'Algorithms', 'Data Structures', 'Coding'],
        clicks: 78,
        addedBy: admin._id,
        isActive: true
      },
      {
        title: 'MIT OpenCourseWare - Computer Networks',
        description: 'Free MIT course materials on computer networks.',
        url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/',
        type: 'documentation',
        category: 'Computer Networks',
        language: 'english',
        topics: ['Networks', 'TCP/IP', 'Protocols', 'MIT'],
        clicks: 34,
        addedBy: admin._id,
        isActive: true
      },
      {
        title: 'OWASP Top 10 Security Risks',
        description: 'Learn about the top 10 web application security risks.',
        url: 'https://owasp.org/www-project-top-ten/',
        type: 'documentation',
        category: 'Cybersecurity',
        language: 'english',
        topics: ['Security', 'Web Security', 'OWASP', 'Best Practices'],
        clicks: 56,
        addedBy: admin._id,
        isActive: true
      },
      {
        title: 'Figma Tutorial for Beginners',
        description: 'Complete Figma tutorial from basics to advanced.',
        url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
        type: 'youtube',
        category: 'Figma',
        language: 'english',
        topics: ['Figma', 'UI Design', 'Prototyping', 'Design'],
        clicks: 92,
        addedBy: admin._id,
        isActive: true
      },
      {
        title: 'Learn OpenGL - Graphics Programming',
        description: 'In-depth tutorials on OpenGL and graphics programming.',
        url: 'https://learnopengl.com/',
        type: 'website',
        category: 'Computer Graphics',
        language: 'english',
        topics: ['OpenGL', 'Graphics', '3D Programming', 'Shaders'],
        clicks: 41,
        addedBy: admin._id,
        isActive: true
      },
      {
        title: 'Cryptography Course - Coursera',
        description: 'Stanford University cryptography course on Coursera.',
        url: 'https://www.coursera.org/learn/crypto',
        type: 'website',
        category: 'Encryption Algorithms',
        language: 'english',
        topics: ['Cryptography', 'Encryption', 'Security', 'Algorithms'],
        clicks: 28,
        addedBy: admin._id,
        isActive: true
      },
      {
        title: 'GitHub - Awesome DSA Repository',
        description: 'Curated list of DSA resources and implementations.',
        url: 'https://github.com/TheAlgorithms',
        type: 'github',
        category: 'DSA',
        language: 'multilingual',
        topics: ['DSA', 'GitHub', 'Open Source', 'Algorithms'],
        clicks: 63,
        addedBy: admin._id,
        isActive: true
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`
📊 Summary:
- Admin: 1 (email: admin@campus.lk, password: admin123)
- Students: ${students.length}
- Videos: ${videos.length}
- Coding Modules: ${codingModules.length}
- Resource Links: ${resourceLinks.length}

🔐 Test Credentials:
Admin: admin@campus.lk / admin123
Student: ravindu@student.lk / student123
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
