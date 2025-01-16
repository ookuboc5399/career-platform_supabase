import express from 'express';

const router = express.Router();

// Get programming learning paths
router.get('/', (req, res) => {
  res.json({
    categories: [
      {
        id: 1,
        title: "Web Development",
        description: "Master modern web development",
        imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
        tracks: [
          {
            name: "Frontend Development",
            technologies: ["HTML", "CSS", "JavaScript", "React", "Vue.js"]
          },
          {
            name: "Backend Development",
            technologies: ["Node.js", "Python", "Java", "Databases"]
          }
        ]
      },
      {
        id: 2,
        title: "Mobile Development",
        description: "Build mobile applications",
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
        tracks: [
          {
            name: "iOS Development",
            technologies: ["Swift", "SwiftUI", "iOS SDK"]
          },
          {
            name: "Android Development",
            technologies: ["Kotlin", "Android SDK", "Jetpack Compose"]
          }
        ]
      },
      {
        id: 3,
        title: "Cloud Computing",
        description: "Learn cloud technologies",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
        tracks: [
          {
            name: "AWS",
            technologies: ["EC2", "S3", "Lambda", "DynamoDB"]
          },
          {
            name: "Azure",
            technologies: ["Azure VMs", "Azure Functions", "Cosmos DB"]
          }
        ]
      }
    ]
  });
});

// Get specific programming course content
router.get('/:id', (req, res) => {
  const content = {
    id: req.params.id,
    title: "Web Development",
    description: "Comprehensive web development course",
    modules: [
      {
        title: "Frontend Fundamentals",
        topics: [
          {
            name: "HTML5 & CSS3",
            description: "Modern web markup and styling",
            projects: [
              "Personal Portfolio",
              "Responsive Landing Page"
            ]
          },
          {
            name: "JavaScript",
            description: "Interactive web programming",
            projects: [
              "Todo Application",
              "Weather Dashboard"
            ]
          }
        ]
      },
      {
        title: "Backend Development",
        topics: [
          {
            name: "Node.js & Express",
            description: "Server-side JavaScript",
            projects: [
              "REST API",
              "Authentication System"
            ]
          },
          {
            name: "Databases",
            description: "Data storage and retrieval",
            projects: [
              "Database Design",
              "CRUD Operations"
            ]
          }
        ]
      }
    ],
    resources: [
      {
        title: "Code Examples",
        link: "/resources/code"
      },
      {
        title: "Project Templates",
        link: "/resources/templates"
      }
    ]
  };
  
  res.json(content);
});

export default router;
