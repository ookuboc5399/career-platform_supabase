import { getUniversities } from '@/lib/cosmos-db';
import Link from 'next/link';
import Image from 'next/image';
import CategoryCard from '@/components/ui/CategoryCard';
import type { University } from '@/lib/cosmos-db';

export default async function CareerPage() {
  const universities = await getUniversities();

  const japanUniversities = universities.filter(
    (u) => u.location === 'japan' && u.type === 'university'
  );
  const overseasUniversities = universities.filter(
    (u) => u.location === 'overseas' && u.type === 'university'
  );
  const mbaPrograms = universities.filter(
    (u) => u.type === 'program' && u.programType === 'mba'
  );
  const dataSciencePrograms = universities.filter(
    (u) => u.type === 'program' && u.programType === 'data-science'
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">大学・プログラム</h1>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">国内大学</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {japanUniversities.map((university) => (
                <CategoryCard
                  key={university.id}
                  {...university}
                  category="university"
                  href={`/career/${university.id}`}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">海外大学</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {overseasUniversities.map((university) => (
                <CategoryCard
                  key={university.id}
                  {...university}
                  category="university"
                  href={`/career/${university.id}`}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">MBAプログラム</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mbaPrograms.map((program) => (
                <CategoryCard
                  key={program.id}
                  {...program}
                  category="university"
                  href={`/career/${program.id}`}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">データサイエンスプログラム</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataSciencePrograms.map((program) => (
                <CategoryCard
                  key={program.id}
                  {...program}
                  category="university"
                  href={`/career/${program.id}`}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
