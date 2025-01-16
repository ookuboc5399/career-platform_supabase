import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      title: 'Career Advice',
      description: 'Expert guidance for your professional growth',
      href: '/career',
      icon: '💼',
      color: 'bg-blue-500'
    },
    {
      title: 'English Learning',
      description: 'Master English for global opportunities',
      href: '/english',
      icon: '🌏',
      color: 'bg-green-500'
    },
    {
      title: 'Programming',
      description: 'Learn modern programming skills',
      href: '/programming',
      icon: '💻',
      color: 'bg-purple-500'
    },
    {
      title: 'Certifications',
      description: 'Achieve professional certifications',
      href: '/certifications',
      icon: '🎓',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Career Platform
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your comprehensive platform for professional growth, skill development, and career advancement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl`}>
                {feature.icon}
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h2>
              <p className="text-gray-300">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Why Choose Us?
            </h2>
            <ul className="space-y-4">
              {[
                'Comprehensive learning paths',
                'Expert-curated content',
                'Industry-aligned curriculum',
                'Practical skill development'
              ].map((point) => (
                <li key={point} className="flex items-center text-gray-300">
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Get Started Today
            </h2>
            <p className="text-gray-300 mb-6">
              Begin your journey towards professional excellence with our comprehensive learning platform.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { text: 'Explore Courses', href: '/programming' },
                { text: 'View Certifications', href: '/certifications' }
              ].map((button) => (
                <Link
                  key={button.text}
                  href={button.href}
                  className="bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {button.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
