'use client';

import { useState, useEffect, useMemo, type ReactNode } from 'react';
import Link from 'next/link';
import {
  flattenPublishedChaptersForSearch,
  filterFlatChaptersByQuery,
  topLevelIdsForHits,
} from '@/lib/programming-chapters-flat';
import { GITHUB_TOPIC_SHORTCUTS } from '@/lib/github-chapter-topic-index';

interface SubChapter {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  status: 'draft' | 'published';
  exercises: any[];
  subChapters?: SubChapter[];
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  status: 'draft' | 'published';
  exercises: any[];
  subChapters?: SubChapter[];
}

/** 直下の「見えるセクション」数（公開チャプター + 下書きのグループ見出し［配下に公開が1件でもあるもの］） */
function countPublishedDirectSubs(items: SubChapter[] | undefined): number {
  if (!items?.length) return 0;
  return items.filter(
    (s) =>
      s.status === 'published' ||
      (s.status === 'draft' && hasPublishedInSubtree(s.subChapters))
  ).length;
}

/** ツリー内に公開ノードが1つでもあれば true（展開ボタン用。孫も含む） */
function hasPublishedInSubtree(items: SubChapter[] | undefined): boolean {
  if (!items?.length) return false;
  for (const s of items) {
    if (s.status === 'published') return true;
    if (hasPublishedInSubtree(s.subChapters)) return true;
  }
  return false;
}

/** 子セクション配下の孫チャプターを折りたたみ表示（depth に応じて有効化） */
function CollapsibleChapterSubtree({
  enabled,
  summary,
  children,
  detailsClassName = 'border border-blue-200 bg-blue-50/40 open:bg-blue-50/70',
  summaryClassName = 'text-blue-800 hover:bg-blue-100/60',
  bodyClassName = 'border-t border-blue-100',
}: {
  enabled: boolean;
  summary: string;
  children: ReactNode;
  detailsClassName?: string;
  summaryClassName?: string;
  bodyClassName?: string;
}) {
  if (!enabled) {
    return <>{children}</>;
  }
  return (
      <details className={`group mt-2 rounded-lg ${detailsClassName}`}>
      <summary className={`cursor-pointer list-none px-3 py-2.5 text-sm font-medium rounded-lg flex items-center gap-2 select-none [&::-webkit-details-marker]:hidden ${summaryClassName}`}>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-90"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {summary}
      </summary>
      <div className={`px-1 pb-2 pt-1 ${bodyClassName}`}>{children}</div>
    </details>
  );
}

function getToneByDepth(depth: number) {
  if (depth === 0) {
    return {
      rail: 'border-blue-200',
      draftCard: 'border border-blue-200 bg-blue-50/60',
      draftTitle: 'text-blue-900',
      draftDesc: 'text-blue-800/80',
      arrow: 'text-blue-500',
      subCard: 'border-blue-100 bg-white',
      badge: 'bg-blue-600 text-white',
      details: 'border border-blue-200 bg-blue-50/40 open:bg-blue-50/70',
      summary: 'text-blue-800 hover:bg-blue-100/60',
      body: 'border-t border-blue-100',
    };
  }
  if (depth === 1) {
    return {
      rail: 'border-emerald-200',
      draftCard: 'border border-emerald-200 bg-emerald-50/60',
      draftTitle: 'text-emerald-900',
      draftDesc: 'text-emerald-800/80',
      arrow: 'text-emerald-500',
      subCard: 'border-emerald-100 bg-white',
      badge: 'bg-emerald-600 text-white',
      details: 'border border-emerald-200 bg-emerald-50/40 open:bg-emerald-50/70',
      summary: 'text-emerald-800 hover:bg-emerald-100/60',
      body: 'border-t border-emerald-100',
    };
  }
  return {
    rail: 'border-violet-200',
    draftCard: 'border border-violet-200 bg-violet-50/60',
    draftTitle: 'text-violet-900',
    draftDesc: 'text-violet-800/80',
    arrow: 'text-violet-500',
    subCard: 'border-violet-100 bg-white',
    badge: 'bg-violet-600 text-white',
    details: 'border border-violet-200 bg-violet-50/40 open:bg-violet-50/70',
    summary: 'text-violet-800 hover:bg-violet-100/60',
    body: 'border-t border-violet-100',
  };
}

/** サブチャプターを任意の深さまで表示。下書きかつ配下に公開がある親はセクション見出しのみ表示 */
function NestedSubChapters({
  items,
  languageId,
  depth = 0,
  saveScrollPosition,
}: {
  items: SubChapter[];
  languageId: string;
  depth?: number;
  saveScrollPosition?: () => void;
}) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const publishedRows = sorted.filter((s) => s.status === 'published');
  const onlyDraftLeaves =
    publishedRows.length === 0 &&
    sorted.length > 0 &&
    sorted.every((s) => !s.subChapters?.length);
  let visibleIndex = 0;
  const tone = getToneByDepth(depth);
  const nextTone = getToneByDepth(depth + 1);
  return (
    <div
          className={
        depth === 0
          ? `mt-4 ml-4 border-l-2 pl-4 space-y-3 ${tone.rail}`
          : `mt-3 ml-3 border-l pl-3 space-y-3 ${tone.rail}`
      }
    >
      {sorted.map((sub) => {
        if (sub.status === 'draft' && sub.subChapters?.length && hasPublishedInSubtree(sub.subChapters)) {
          const nested = (
            <NestedSubChapters
              items={sub.subChapters}
              languageId={languageId}
              depth={depth + 1}
              saveScrollPosition={saveScrollPosition}
            />
          );
          // グループ見出し（AI Controls など）配下は常に初期折りたたみ
          const collapseGrandchildren = true;
          return (
            <div key={sub.id} className="space-y-3">
              <div
                className={
                  depth === 0
                    ? `rounded-lg px-4 py-3 ${tone.draftCard}`
                    : `rounded-md px-3 py-2.5 ${tone.draftCard}`
                }
              >
                <h4
                  className={
                    depth === 0
                      ? `text-sm font-bold tracking-tight ${tone.draftTitle}`
                      : `text-xs font-bold uppercase tracking-wide ${tone.draftTitle}`
                  }
                >
                  {sub.title}
                </h4>
                {sub.description ? (
                  <p className={`text-xs mt-1.5 leading-relaxed ${tone.draftDesc}`}>{sub.description}</p>
                ) : null}
              </div>
              <div className="ml-4 flex items-start gap-2 px-1 py-1">
                <span aria-hidden className={`mt-2 ${nextTone.arrow}`}>
                  ↳
                </span>
                <div className="min-w-0 flex-1">
                  <CollapsibleChapterSubtree
                    enabled={collapseGrandchildren}
                    summary={`「${sub.title}」のサブチャプターを表示`}
                    detailsClassName={nextTone.details}
                    summaryClassName={nextTone.summary}
                    bodyClassName={nextTone.body}
                  >
                    {nested}
                  </CollapsibleChapterSubtree>
                </div>
              </div>
            </div>
          );
        }
        if (sub.status === 'published') {
          const idx = visibleIndex;
          visibleIndex += 1;
          return (
            <div key={sub.id}>
              <div className={`rounded-lg border p-4 flex items-center justify-between shadow-sm ${tone.subCard}`}>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold shrink-0 ${tone.badge}`}
                    >
                      {idx + 1}
                    </span>
                    <h4 className="font-semibold text-slate-900">{sub.title}</h4>
                    {sub.duration && (
                      <span className="text-xs text-slate-500 ml-auto">{sub.duration}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 ml-8">{sub.description}</p>
                  <p className="text-xs text-slate-500 ml-8 mt-1">
                    演習問題: {sub.exercises?.length || 0}問
                  </p>
                </div>
                <Link
                  href={`/programming/${languageId}/chapters/${sub.id}`}
                  scroll={false}
                  onClick={saveScrollPosition}
                  className="ml-4 shrink-0 inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  学習する
                </Link>
              </div>
              {sub.subChapters && sub.subChapters.length > 0 && (
                <div className="ml-4 flex items-start gap-2 px-1 py-1">
                  <span aria-hidden className={`mt-2 ${nextTone.arrow}`}>
                    ↳
                  </span>
                  <div className="min-w-0 flex-1">
                    <CollapsibleChapterSubtree
                      enabled
                      summary={`「${sub.title}」のサブチャプターを表示`}
                      detailsClassName={nextTone.details}
                      summaryClassName={nextTone.summary}
                      bodyClassName={nextTone.body}
                    >
                      <NestedSubChapters
                        items={sub.subChapters}
                        languageId={languageId}
                        depth={depth + 1}
                        saveScrollPosition={saveScrollPosition}
                      />
                    </CollapsibleChapterSubtree>
                  </div>
                </div>
              )}
            </div>
          );
        }
        if (sub.subChapters?.length) {
          return (
            <NestedSubChapters
              key={sub.id}
              items={sub.subChapters}
              languageId={languageId}
              depth={depth}
              saveScrollPosition={saveScrollPosition}
            />
          );
        }
        return null;
      })}
      {onlyDraftLeaves && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          このレベルのセクションはすべて下書きです。管理画面で各チャプターを「公開中」にすると表示されます。
        </p>
      )}
    </div>
  );
}

export default function ProgrammingPage({ params }: { params: { id: string } }) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIdsManual, setExpandedIdsManual] = useState<Set<string>>(new Set());
  const [expandedChapterIdsManual, setExpandedChapterIdsManual] = useState<Set<string>>(new Set());
  const scrollStorageKey = `programming:${params.id}:scrollY`;

  const saveScrollPosition = () => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(scrollStorageKey, String(window.scrollY));
  };

  const fetchChapters = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/programming/chapters?languageId=${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch chapters');
      const data = await response.json();
      const published = data
        .filter((ch: Chapter) => ch.status === 'published')
        .sort((a: Chapter, b: Chapter) => a.order - b.order);
      setChapters(published);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [params.id]);

  useEffect(() => {
    if (typeof window === 'undefined' || isLoading) return;
    const saved = sessionStorage.getItem(scrollStorageKey);
    if (!saved) return;
    const y = Number(saved);
    if (Number.isFinite(y)) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: y, behavior: 'auto' });
      });
    }
    sessionStorage.removeItem(scrollStorageKey);
  }, [isLoading, scrollStorageKey]);

  useEffect(() => {
    return () => {
      if (typeof window === 'undefined') return;
      sessionStorage.setItem(scrollStorageKey, String(window.scrollY));
    };
  }, [scrollStorageKey]);

  const parentIdsWithSubs = useMemo(
    () => chapters.filter((ch) => hasPublishedInSubtree(ch.subChapters)).map((ch) => ch.id),
    [chapters]
  );
  const allChapterIds = useMemo(() => chapters.map((ch) => ch.id), [chapters]);

  useEffect(() => {
    // 初期表示は親セクション（AI Controls / Organizations など）までは見せる
    setExpandedIdsManual(new Set(parentIdsWithSubs));
  }, [parentIdsWithSubs]);
  useEffect(() => {
    // 親カードは初期表示で開く
    setExpandedChapterIdsManual(new Set(allChapterIds));
  }, [allChapterIds]);

  const flatRows = useMemo(() => flattenPublishedChaptersForSearch(chapters), [chapters]);
  const searchHits = useMemo(
    () => filterFlatChaptersByQuery(flatRows, searchQuery, params.id),
    [flatRows, searchQuery, params.id]
  );

  const displayExpanded = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return expandedIdsManual;
    const need = topLevelIdsForHits(searchHits);
    const merged = new Set(expandedIdsManual);
    need.forEach((id) => merged.add(id));
    return merged;
  }, [searchQuery, searchHits, expandedIdsManual]);
  const displayChapterExpanded = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return expandedChapterIdsManual;
    const need = topLevelIdsForHits(searchHits);
    const merged = new Set(expandedChapterIdsManual);
    need.forEach((id) => merged.add(id));
    return merged;
  }, [searchQuery, searchHits, expandedChapterIdsManual]);

  const hasAnyExpandable = parentIdsWithSubs.length > 0;
  const hasAnyChapters = chapters.length > 0;

  const toggleExpand = (id: string) => {
    setExpandedIdsManual((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAllParents = () => {
    setExpandedIdsManual(new Set(parentIdsWithSubs));
  };

  const collapseAllParents = () => {
    setExpandedIdsManual(new Set());
  };
  const toggleChapterExpand = (id: string) => {
    setExpandedChapterIdsManual((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const expandAllChapters = () => {
    setExpandedChapterIdsManual(new Set(allChapterIds));
  };
  const collapseAllChapters = () => {
    setExpandedChapterIdsManual(new Set());
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/programming"
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          戻る
        </Link>
        <h1 className="text-3xl font-bold">
          {params.id.charAt(0).toUpperCase() + params.id.slice(1)} 学習
        </h1>
        <p className="text-gray-600 mt-2">
          ステップバイステップで学習しましょう
        </p>
      </div>

      {chapters.length > 0 && (
        <div className="mb-6 space-y-4">
          <div>
            <label htmlFor="chapter-search" className="block text-sm font-medium text-gray-700 mb-1">
              チャプターを検索
            </label>
            <input
              id="chapter-search"
              type="search"
              placeholder="例: Copilot、プレミアムリクエスト、Actions、GHAS…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-xl rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              タイトル・説明・チャプター ID から部分一致します。検索中は該当セクションを自動で展開します。
            </p>
          </div>

          {params.id === 'github' && (
            <div className="rounded-lg border border-gray-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-medium text-gray-800 mb-2">よく探すトピック</p>
              <div className="flex flex-wrap gap-2">
                {GITHUB_TOPIC_SHORTCUTS.map((t) => (
                  <Link
                    key={`${t.chapterId}-${t.label}`}
                    href={`/programming/github/chapters/${t.chapterId}`}
                    scroll={false}
                    onClick={saveScrollPosition}
                    className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(hasAnyChapters || hasAnyExpandable) && (
            <div className="flex flex-wrap gap-2">
              {hasAnyChapters && (
                <>
                  <button
                    type="button"
                    onClick={expandAllChapters}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    すべてのチャプターを展開
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={collapseAllChapters}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    すべてのチャプターを折りたたむ
                  </button>
                </>
              )}
              {hasAnyChapters && hasAnyExpandable && <span className="text-gray-300">|</span>}
              {hasAnyExpandable && (
                <>
                  <button
                    type="button"
                    onClick={expandAllParents}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    すべてのセクションを展開
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={collapseAllParents}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    すべてのセクションを折りたたむ
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {searchQuery.trim() && chapters.length > 0 && (
        <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">
            検索結果（{searchHits.length} 件）
          </h2>
          {searchHits.length === 0 ? (
            <p className="text-sm text-gray-600">一致するチャプターがありません。別のキーワードを試してください。</p>
          ) : (
            <ul className="space-y-2">
              {searchHits.map((row) => (
                <li key={`${row.chapterId}-${row.breadcrumb.join('/')}`}>
                  <Link
                    href={`/programming/${params.id}/chapters/${row.chapterId}`}
                    scroll={false}
                    onClick={saveScrollPosition}
                    className="group block rounded-md border border-transparent bg-white/80 px-3 py-2 shadow-sm hover:border-blue-200"
                  >
                    <p className="text-xs font-medium text-gray-800 group-hover:text-blue-700">
                      {row.breadcrumb.join(' › ')}
                    </p>
                    {row.description ? (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{row.description}</p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid gap-4">
        {chapters.length === 0 ? (
          <div className="text-center py-12 text-gray-500">チャプターがありません</div>
        ) : (
          chapters.map((chapter) => {
            const publishedDirect = countPublishedDirectSubs(chapter.subChapters);
            const hasVisibleSubs = hasPublishedInSubtree(chapter.subChapters);
            const isExpanded = displayExpanded.has(chapter.id);
            const isChapterExpanded = displayChapterExpanded.has(chapter.id);

            return (
              <div
                key={chapter.id}
                className="rounded-xl border border-slate-300 bg-slate-50 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                          {chapter.order}. {chapter.title}
                          {publishedDirect > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                              {publishedDirect}セクション
                            </span>
                          )}
                        </h3>
                        <div className="ml-4 flex items-center gap-3 shrink-0">
                          <span className="text-sm text-slate-600">{chapter.duration}</span>
                          <button
                            type="button"
                            onClick={() => toggleChapterExpand(chapter.id)}
                            className="inline-flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900 font-semibold"
                          >
                            <svg
                              className={`w-4 h-4 transition-transform ${isChapterExpanded ? 'rotate-90' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                            {isChapterExpanded ? '閉じる' : '開く'}
                          </button>
                        </div>
                      </div>
                      {isChapterExpanded && <p className="text-slate-800 mb-4">{chapter.description}</p>}

                      {isChapterExpanded && !hasVisibleSubs && (
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-slate-600">
                            演習問題: {chapter.exercises?.length || 0}問
                          </div>
                          <Link
                            href={`/programming/${params.id}/chapters/${chapter.id}`}
                            scroll={false}
                            onClick={saveScrollPosition}
                            className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            学習を始める
                          </Link>
                        </div>
                      )}

                      {isChapterExpanded && hasVisibleSubs && (
                        <button
                          onClick={() => toggleExpand(chapter.id)}
                          className="flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900 font-semibold"
                        >
                          <svg
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {isExpanded ? 'セクションを閉じる' : 'セクションを表示'}
                        </button>
                      )}
                    </div>
                  </div>

                  {isChapterExpanded && hasVisibleSubs && isExpanded && chapter.subChapters && (
                    <NestedSubChapters
                      items={chapter.subChapters}
                      languageId={params.id}
                      saveScrollPosition={saveScrollPosition}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
