import express from 'express';

const router = express.Router();

// Get English learning resources
router.get('/', (req, res) => {
  res.json({
    categories: [
      {
        id: 1,
        title: "Business English",
        description: "Master professional English communication",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
        levels: ["Beginner", "Intermediate", "Advanced"],
        topics: [
          "Email Writing",
          "Presentation Skills",
          "Meeting Participation",
          "Negotiation Skills"
        ]
      },
      {
        id: 2,
        title: "TOEIC Preparation",
        description: "Comprehensive TOEIC test preparation",
        imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
        levels: ["500-600", "600-700", "700-800", "800+"],
        topics: [
          "Listening Comprehension",
          "Reading Comprehension",
          "Grammar Review",
          "Test Strategies"
        ]
      },
      {
        id: 3,
        title: "Daily Conversation",
        description: "Practical everyday English skills",
        imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
        levels: ["Basic", "Intermediate", "Advanced"],
        topics: [
          "Common Phrases",
          "Cultural Understanding",
          "Pronunciation",
          "Vocabulary Building"
        ]
      }
    ]
  });
});

// Get specific English learning content
router.get('/:id', (req, res) => {
  const content = {
    id: req.params.id,
    title: "Business English",
    description: "Master professional English communication",
    lessons: [
      {
        title: "Email Writing Essentials",
        content: "Learn professional email writing techniques...",
        exercises: [
          {
            type: "template",
            description: "Business email templates"
          },
          {
            type: "practice",
            description: "Email writing exercises"
          }
        ]
      },
      {
        title: "Presentation Skills",
        content: "Develop effective presentation skills...",
        exercises: [
          {
            type: "vocabulary",
            description: "Presentation terminology"
          },
          {
            type: "practice",
            description: "Presentation structure exercises"
          }
        ]
      }
    ],
    resources: [
      {
        title: "Business Email Templates",
        link: "/resources/email-templates"
      },
      {
        title: "Pronunciation Guide",
        link: "/resources/pronunciation"
      }
    ]
  };
  
  res.json(content);
});

export default router;
