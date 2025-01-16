import Link from 'next/link';
import Image from 'next/image';

interface BaseCardProps {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  href: string;
}

interface UniversityCardProps extends BaseCardProps {
  category: 'university';
  type: 'university' | 'program';
  location: 'japan' | 'overseas';
  programType?: 'mba' | 'data-science';
}

interface CertificationCardProps extends BaseCardProps {
  category: 'certification';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  certCategory: 'finance' | 'it' | 'business';
  estimatedHours: number;
  price: number;
}

interface EnglishCardProps extends BaseCardProps {
  category: 'english';
  type: 'movie' | 'news' | 'business';
  level?: 'beginner' | 'intermediate' | 'advanced';
}

type CategoryCardProps = UniversityCardProps | CertificationCardProps | EnglishCardProps;

export default function CategoryCard(props: CategoryCardProps) {
  return (
    <Link href={props.href} className="block">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative h-48">
          <Image
            src={props.imageUrl}
            alt={props.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {props.title}
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {props.description}
          </p>

          {props.category === 'university' ? (
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                props.type === 'university' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {props.type === 'university' ? '大学' : 'プログラム'}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                props.location === 'japan' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {props.location === 'japan' ? '国内' : '海外'}
              </span>
              {props.programType && (
                <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {props.programType === 'mba' ? 'MBA' : 'データサイエンス'}
                </span>
              )}
            </div>
          ) : props.category === 'certification' ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  props.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  props.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {props.difficulty.charAt(0).toUpperCase() + props.difficulty.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  props.certCategory === 'finance' ? 'bg-blue-100 text-blue-800' :
                  props.certCategory === 'it' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {props.certCategory.charAt(0).toUpperCase() + props.certCategory.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-600">
                  <span className="font-medium">{props.estimatedHours}</span> hours
                </div>
                <div className="text-gray-900 font-medium">
                  ${props.price}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                props.type === 'movie' ? 'bg-blue-100 text-blue-800' :
                props.type === 'news' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {props.type.charAt(0).toUpperCase() + props.type.slice(1)}
              </span>
              {props.level && (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  props.level === 'beginner' ? 'bg-green-100 text-green-800' :
                  props.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {props.level.charAt(0).toUpperCase() + props.level.slice(1)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
