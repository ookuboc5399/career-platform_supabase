import axios from 'axios';
import cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';

interface University {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  website: string;
}

const universities = [
  {
    name: '東京大学',
    url: 'https://www.u-tokyo.ac.jp/',
    location: '東京都文京区',
  },
  {
    name: '京都大学',
    url: 'https://www.kyoto-u.ac.jp/',
    location: '京都府京都市',
  },
  {
    name: '大阪大学',
    url: 'https://www.osaka-u.ac.jp/',
    location: '大阪府吹田市',
  },
  {
    name: '東北大学',
    url: 'https://www.tohoku.ac.jp/',
    location: '宮城県仙台市',
  },
  {
    name: '名古屋大学',
    url: 'https://www.nagoya-u.ac.jp/',
    location: '愛知県名古屋市',
  },
  {
    name: '九州大学',
    url: 'https://www.kyushu-u.ac.jp/',
    location: '福岡県福岡市',
  },
  {
    name: '北海道大学',
    url: 'https://www.hokudai.ac.jp/',
    location: '北海道札幌市',
  },
  {
    name: '筑波大学',
    url: 'https://www.tsukuba.ac.jp/',
    location: '茨城県つくば市',
  },
  {
    name: '早稲田大学',
    url: 'https://www.waseda.jp/',
    location: '東京都新宿区',
  },
  {
    name: '慶應義塾大学',
    url: 'https://www.keio.ac.jp/',
    location: '東京都港区',
  },
  {
    name: '立命館大学',
    url: 'https://www.ritsumei.ac.jp/',
    location: '京都府京都市',
  },
  {
    name: '同志社大学',
    url: 'https://www.doshisha.ac.jp/',
    location: '京都府京都市',
  },
  {
    name: '関西大学',
    url: 'https://www.kansai-u.ac.jp/',
    location: '大阪府吹田市',
  },
  {
    name: '明治大学',
    url: 'https://www.meiji.ac.jp/',
    location: '東京都千代田区',
  },
  {
    name: '青山学院大学',
    url: 'https://www.aoyama.ac.jp/',
    location: '東京都渋谷区',
  }
];

async function scrapeUniversity(university: typeof universities[0]): Promise<University> {
  try {
    const response = await axios.get(university.url);
    const $ = cheerio.load(response.data);

    // メタデータから説明を取得
    let description = $('meta[name="description"]').attr('content') || '';
    if (!description) {
      // メタデータがない場合は、最初の段落テキストを使用
      description = $('p').first().text().trim();
    }

    // OGP画像を取得
    let imageUrl = $('meta[property="og:image"]').attr('content') || '';
    if (!imageUrl) {
      // OGP画像がない場合は、最初の画像を使用
      imageUrl = $('img').first().attr('src') || '';
    }

    // 相対URLを絶対URLに変換
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = new URL(imageUrl, university.url).toString();
    }

    return {
      id: uuidv4(),
      name: university.name,
      description: description || `${university.name}は、${university.location}に位置する大学です。`,
      imageUrl,
      location: university.location,
      website: university.url,
    };
  } catch (error) {
    console.error(`Failed to scrape ${university.name}:`, error);
    return {
      id: uuidv4(),
      name: university.name,
      description: `${university.name}は、${university.location}に位置する大学です。`,
      imageUrl: '',
      location: university.location,
      website: university.url,
    };
  }
}

export async function scrapeUniversities(): Promise<University[]> {
  const results = await Promise.all(
    universities.map(university => scrapeUniversity(university))
  );
  return results;
}
