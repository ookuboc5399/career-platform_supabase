import express from 'express';

const router = express.Router();

// Get career advice categories
router.get('/', (req, res) => {
  res.json({
    categories: [
      {
        id: 1,
        title: "Career Planning",
        description: "Strategic career development and goal setting",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        topics: [
          "Career Path Analysis",
          "Goal Setting",
          "Industry Trends",
          "Professional Development"
        ]
      },
      {
        id: 2,
        title: "Interview Preparation",
        description: "Master the art of job interviews",
        imageUrl: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a",
        topics: [
          "Common Interview Questions",
          "Body Language Tips",
          "Case Study Practice",
          "Salary Negotiation"
        ]
      },
      {
        id: 3,
        title: "Resume Building",
        description: "Create compelling resumes and portfolios",
        imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4",
        topics: [
          "Resume Templates",
          "Portfolio Design",
          "Achievement Highlighting",
          "Cover Letter Writing"
        ]
      }
    ]
  });
});

// Get specific career advice
router.get('/:id', (req, res) => {
  // Mock data for demonstration
  const advice = {
    id: req.params.id,
    title: "Career Planning",
    content: "Detailed career planning guidance and strategies...",
    steps: [
      {
        title: "Self Assessment",
        description: "Evaluate your skills, interests, and values"
      },
      {
        title: "Market Research",
        description: "Research industry trends and opportunities"
      },
      {
        title: "Goal Setting",
        description: "Set SMART career goals"
      },
      {
        title: "Action Planning",
        description: "Create detailed action plans"
      }
    ],
    resources: [
      {
        title: "Career Assessment Tools",
        link: "/tools/assessment"
      },
      {
        title: "Industry Reports",
        link: "/resources/reports"
      }
    ]
  };
  
  res.json(advice);
});

export default router;
