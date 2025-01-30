import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewsManager from "./components/NewsManager";
import MovieManager from "./components/MovieManager";
import BusinessManager from "./components/BusinessManager";
import QuestionManager from "./components/QuestionManager";

export default function AdminEnglishPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">英語学習管理</h1>

      <Tabs defaultValue="news" className="space-y-4">
        <TabsList>
          <TabsTrigger value="news">ニュース管理</TabsTrigger>
          <TabsTrigger value="movies">映画で学ぶ</TabsTrigger>
          <TabsTrigger value="business">ビジネス英語</TabsTrigger>
          <TabsTrigger value="questions">問題管理</TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <NewsManager />
          </div>
        </TabsContent>

        <TabsContent value="movies" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <MovieManager />
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <BusinessManager />
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <QuestionManager />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
