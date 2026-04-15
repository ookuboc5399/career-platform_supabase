'use client';

import { useState } from 'react';
import {
  SETTINGS_BY_SCOPE,
  type SettingParameter,
  type SettingsScope,
} from '@/lib/github-enterprise-settings';

function SettingsRow({ param }: { param: SettingParameter }) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
      <td className="px-4 py-3 font-mono text-sm font-medium text-gray-900 bg-gray-50/80">
        {param.name}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{param.description}</td>
      <td className="px-4 py-3">
        <code className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
          {param.defaultValue}
        </code>
      </td>
      <td className="px-4 py-3">
        <code className="text-xs px-2 py-1 rounded bg-green-50 text-green-800 border border-green-200">
          {param.recommendedValue}
        </code>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{param.notes}</td>
    </tr>
  );
}

const SCOPE_TABS: { scope: SettingsScope; label: string; icon: string }[] = [
  { scope: 'enterprise', label: 'Enterprise', icon: '🏢' },
  { scope: 'organization', label: 'Organization', icon: '👥' },
  { scope: 'repository', label: 'Repository', icon: '📦' },
];

const CATEGORY_COLORS: Record<string, string> = {
  authentication: 'bg-blue-500',
  policy: 'bg-amber-500',
  'audit-log': 'bg-emerald-500',
  'member-permissions': 'bg-indigo-500',
  'repository-settings': 'bg-violet-500',
  webhooks: 'bg-rose-500',
  'branch-protection': 'bg-cyan-500',
  security: 'bg-red-500',
  general: 'bg-slate-500',
};

function SettingsTable({ scope }: { scope: SettingsScope }) {
  const { categories, params } = SETTINGS_BY_SCOPE[scope];
  const categoryOrder = Object.keys(categories);
  const byCategory = categoryOrder.map((cat) => ({
    key: cat,
    label: categories[cat],
    params: params.filter((p) => p.category === cat),
  }));

  return (
    <div className="space-y-8">
      {byCategory.map(({ key, label, params: catParams }) => (
        <section
          key={key}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <h2 className="px-6 py-4 bg-gray-100 border-b border-gray-200 text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                CATEGORY_COLORS[key] || 'bg-gray-500'
              }`}
            />
            {label}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[180px]">
                    パラメータ名
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    説明
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[140px]">
                    デフォルト値
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[160px]">
                    推奨値
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[220px]">
                    備考
                  </th>
                </tr>
              </thead>
              <tbody>
                {catParams.map((param) => (
                  <SettingsRow key={param.name} param={param} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

export default function GitHubEnterpriseSettingsTable() {
  const [activeTab, setActiveTab] = useState<SettingsScope>('enterprise');

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        GitHub公式のベストプラクティスに基づいた推奨値を参考にしてください。
        タブ切り替えで Enterprise / Organization / Repository の設定を確認できます。
      </p>

      {/* タブ */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1" aria-label="設定スコープ">
          {SCOPE_TABS.map(({ scope, label, icon }) => (
            <button
              key={scope}
              onClick={() => setActiveTab(scope)}
              className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === scope
                  ? 'bg-white border border-b-0 border-gray-200 text-gray-900 -mb-px'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* タブコンテンツ */}
      <SettingsTable scope={activeTab} />

      {/* 参考リンク */}
      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="font-medium text-gray-700 mb-1">参考リンク</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <a
              href="https://docs.github.com/en/enterprise-server/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GitHub Enterprise Server 管理ドキュメント
            </a>
          </li>
          <li>
            <a
              href="https://docs.github.com/en/organizations/managing-organization-settings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Organization 設定の管理
            </a>
          </li>
          <li>
            <a
              href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              リポジトリの設定と機能
            </a>
          </li>
          <li>
            <a
              href="https://docs.github.com/en/enterprise-server/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              監査ログの確認と設定
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
