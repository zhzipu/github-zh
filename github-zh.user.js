// ==UserScript==
// @name         GitHub 汉化 / GitHub Chinese
// @name:zh-CN   GitHub 汉化
// @namespace    https://github.com/
// @version      1.0.0
// @description  将 GitHub 界面中的常用英文翻译为简体中文。基于本地词典，无需联网，支持动态内容与 SPA 路由切换。
// @author       -
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @run-at       document-idle
// @noframes
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  /* ===================== 开关（可在油猴菜单里切换） ===================== */
  const STORE_KEY = 'github_zh_enabled';

  const getStored = (key, def) => {
    try {
      if (typeof GM_getValue === 'function') return GM_getValue(key, def);
      const v = localStorage.getItem(key);
      return v === null ? def : JSON.parse(v);
    } catch (e) {
      return def;
    }
  };
  const setStored = (key, val) => {
    try {
      if (typeof GM_setValue === 'function') GM_setValue(key, val);
      else localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      /* ignore */
    }
  };

  let enabled = getStored(STORE_KEY, true);

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand((enabled ? '[开]' : '[关]') + ' GitHub 汉化 - 点击切换', () => {
      setStored(STORE_KEY, !enabled);
      location.reload();
    });
  }

  if (!enabled) return;

  /* ===================== 词典：精确匹配 ===================== */
  const DICT = {
    /* ---------- 顶部导航 / 全局 ---------- */
    'Pull requests': '拉取请求',
    'Pull Requests': '拉取请求',
    'Issues': '议题',
    'Marketplace': '应用市场',
    'Explore': '探索',
    'Notifications': '通知',
    'Sponsors': '赞助',
    'Discussions': '讨论',
    'Packages': '软件包',
    'Code': '代码',
    'Actions': '操作',
    'Projects': '项目',
    'Security': '安全',
    'Insights': '洞察',
    'Wiki': '百科',
    'Settings': '设置',
    'Search or jump to...': '搜索或跳转到…',
    'Search or jump to…': '搜索或跳转到…',
    'Type / to search': '输入 / 进行搜索',
    'Search GitHub': '搜索 GitHub',
    'Sign in': '登录',
    'Sign up': '注册',
    'Sign out': '退出登录',
    'Sign in to GitHub': '登录 GitHub',
    'Create an account': '创建账号',
    'Username or email address': '用户名或电子邮箱地址',
    'Password': '密码',
    'Forgot password?': '忘记密码？',
    'Home': '首页',
    'Help': '帮助',
    'Support': '支持',
    'Docs': '文档',
    'Feedback': '反馈',
    'Upgrade': '升级',
    'Feature preview': '功能预览',
    'Copy link': '复制链接',
    'Link copied': '链接已复制',
    'Your profile': '你的个人资料',
    'Your repositories': '你的仓库',
    'Your projects': '你的项目',
    'Your organizations': '你的组织',
    'Your enterprises': '你的企业',
    'Your stars': '你的星标',
    'Your gists': '你的代码片段',
    'Your sponsors': '你的赞助',

    /* ---------- 通用操作 ---------- */
    'Add': '添加',
    'Edit': '编辑',
    'Delete': '删除',
    'Remove': '移除',
    'Cancel': '取消',
    'Save': '保存',
    'Save changes': '保存更改',
    'Confirm': '确认',
    'Close': '关闭',
    'Submit': '提交',
    'Apply': '应用',
    'Update': '更新',
    'Create': '创建',
    'Copy': '复制',
    'Copied': '已复制',
    'Copy to clipboard': '复制到剪贴板',
    'Search': '搜索',
    'Filter': '筛选',
    'Filters': '筛选器',
    'Sort': '排序',
    'Clear': '清除',
    'Reset': '重置',
    'Back': '返回',
    'Next': '下一页',
    'Previous': '上一页',
    'More': '更多',
    'Loading...': '加载中…',
    'Loading…': '加载中…',
    'No results matched your search.': '没有匹配的结果。',
    'Something went wrong.': '出错了。',
    'You don’t have any notifications at this time.': '你目前没有任何通知。',
    'Done': '完成',
    'Learn more': '了解更多',
    'Show more': '显示更多',
    'Show less': '收起',
    'View all': '查看全部',
    'See all': '查看全部',
    'Refresh': '刷新',
    'Retry': '重试',
    'Download': '下载',
    'Upload': '上传',
    'Preview': '预览',
    'Write': '编写',
    'Comment': '评论',
    'Comments': '评论',

    /* ---------- 仓库页面 ---------- */
    'Go to file': '转到文件',
    'Add file': '添加文件',
    'Create new file': '创建新文件',
    'Upload files': '上传文件',
    'Find file': '查找文件',
    'Clone or download': '克隆或下载',
    'Clone': '克隆',
    'Download ZIP': '下载 ZIP',
    'Open with GitHub Desktop': '使用 GitHub Desktop 打开',
    'Local': '本地',
    'Commits': '提交',
    'commit': '提交',
    'Releases': '发行版',
    'Tags': '标签',
    'Branches': '分支',
    'Contributors': '贡献者',
    'Languages': '语言',
    'About': '关于',
    'Readme': 'README',
    'License': '许可证',
    'Activity': '活动',
    'Custom properties': '自定义属性',
    'Report repository': '举报仓库',
    'Latest commit': '最新提交',
    'History': '历史',
    'Compare': '比较',
    'Blame': '追溯',
    'Raw': '原始',
    'Copy raw contents': '复制原始内容',
    'Download raw file': '下载原始文件',
    'Edit this file': '编辑此文件',
    'Delete this file': '删除此文件',
    'Edit file': '编辑文件',
    'Preview changes': '预览更改',
    'Commit changes': '提交更改',
    'Commit message': '提交信息',
    'Extended description': '详细描述',
    'Create a new branch for this commit and start a pull request': '为此提交创建新分支并开启拉取请求',
    'No description, website, or topics provided.': '未提供描述、网站或主题。',
    'Pin': '置顶',
    'Unpin': '取消置顶',
    'Pinned': '已置顶',
    'Customize your pins': '自定义置顶项',
    'Edit Pinned Repositories': '编辑置顶仓库',
    'Forked from': '复刻自',
    'Updated': '更新于',
    'Created': '创建于',
    'Pushed': '推送于',
    'Public': '公开',
    'Private': '私有',
    'Public archive': '公开归档',
    'Archive': '归档',
    'Template': '模板',
    'Fork': '复刻',
    'Forks': '复刻',
    'Star': '星标',
    'Starred': '已星标',
    'Unstar': '取消星标',
    'Watch': '关注',
    'Watching': '已关注',
    'Unwatch': '取消关注',
    'Sponsor': '赞助',
    'Pin this repository': '置顶此仓库',
    'New repository': '新建仓库',
    'Import repository': '导入仓库',
    'New gist': '新建代码片段',
    'New organization': '新建组织',
    'New project': '新建项目',
    'Name': '名称',
    'Description': '描述',
    'Visibility': '可见性',
    'Initialize this repository with a README': '使用 README 初始化此仓库',
    'Create repository': '创建仓库',
    'Repository name': '仓库名称',
    'Owner': '所有者',

    /* ---------- 议题 ---------- */
    'New issue': '新建议题',
    'Open': '开启',
    'Closed': '已关闭',
    'Open issues': '开启的议题',
    'Closed issues': '已关闭的议题',
    'Author': '作者',
    'Labels': '标签',
    'Milestones': '里程碑',
    'Assignee': '指派给',
    'Assignees': '指派给',
    'No one assigned': '未指派',
    'No labels': '无标签',
    'No milestone': '无里程碑',
    'Close issue': '关闭议题',
    'Reopen issue': '重新开启议题',
    'Write a comment': '写评论',
    'Leave a comment': '发表评论',
    'Add your comment here...': '在此添加你的评论…',
    'Subscribe': '订阅',
    'Unsubscribe': '取消订阅',
    'Participants': '参与者',
    'Filter by label': '按标签筛选',
    'Filter by who’s assigned': '按指派人筛选',
    'Filter by assignee': '按指派人筛选',
    'Search all issues': '搜索所有议题',
    'Sort by': '排序方式',
    'Newest': '最新',
    'Oldest': '最早',
    'Most commented': '评论最多',
    'Least commented': '评论最少',
    'Recently updated': '最近更新',
    'Least recently updated': '最久未更新',
    'Best match': '最佳匹配',
    'Top': '最热',
    'edited': '已编辑',
    'pinned this issue': '置顶了这个议题',
    'referenced this issue': '引用了这个议题',

    /* ---------- 拉取请求 ---------- */
    'New pull request': '新建拉取请求',
    'Create pull request': '创建拉取请求',
    'Open pull request': '开启拉取请求',
    'Merge pull request': '合并拉取请求',
    'Confirm merge': '确认合并',
    'Squash and merge': '压缩合并',
    'Confirm squash and merge': '确认压缩合并',
    'Rebase and merge': '变基合并',
    'Confirm rebase and merge': '确认变基合并',
    'Conversation': '讨论',
    'Checks': '检查',
    'Files changed': '文件变更',
    'Review changes': '审查变更',
    'Approve': '批准',
    'Request changes': '请求修改',
    'Resolve conversation': '解决对话',
    'Resolved': '已解决',
    'Unresolve conversation': '取消解决',
    'Draft': '草稿',
    'Ready for review': '可以审查',
    'Convert to draft': '转换为草稿',
    'Merged': '已合并',
    'Merge': '合并',
    'Compare changes': '比较变更',
    'base repository': '基础仓库',
    'base branch': '基础分支',
    'head repository': '源仓库',
    'compare branch': '源分支',
    'Adding numbers to diff': '显示行号',
    'Unified': '统一视图',
    'Split': '拆分视图',
    'Jump to file': '跳转到文件',
    'Show whitespace': '显示空白字符',
    'Hide whitespace': '隐藏空白字符',
    'Load diff': '加载差异',
    'Viewed': '已查看',
    'Comment on lines': '评论该行',

    /* ---------- 个人主页 ---------- */
    'Overview': '概览',
    'Repositories': '仓库',
    'Stars': '星标',
    'Followers': '关注者',
    'Following': '正在关注',
    'Achievements': '成就',
    'Highlights': '亮点',
    'Contributions': '贡献',
    'Contribution activity': '贡献活动',
    'Activity overview': '活动概览',
    'Contribution settings': '贡献设置',
    'Follow': '关注',
    'Unfollow': '取消关注',
    'Block or Report': '屏蔽或举报',
    'Organizations': '组织',
    'joined': '加入于',
    'Edit profile': '编辑个人资料',
    'Suggestions': '推荐',
    'Popular repositories': '热门仓库',

    /* ---------- 设置页 ---------- */
    'Public profile': '公开资料',
    'Account': '账号',
    'Appearance': '外观',
    'Accessibility': '无障碍',
    'Billing and plans': '账单和套餐',
    'Emails': '邮箱',
    'Password and authentication': '密码和认证',
    'Sessions': '会话',
    'SSH and GPG keys': 'SSH 和 GPG 密钥',
    'Applications': '应用',
    'Developer settings': '开发者设置',
    'Personal access tokens': '个人访问令牌',
    'Danger Zone': '危险区域',
    'Change username': '更改用户名',
    'Delete account': '删除账号',
    'Change visibility': '更改可见性',
    'Transfer': '转移',
    'Save settings': '保存设置',
    'Preferences': '偏好设置',

    /* ---------- 代码浏览 / 其他 ---------- */
    'Active': '活跃',
    'Inactive': '不活跃',
    'All': '全部',
    'Yes': '是',
    'No': '否',
    'Enabled': '已启用',
    'Disabled': '已禁用',
    'Required': '必需',
    'Optional': '可选',
    'Read more': '阅读更多',
    'Collapse': '折叠',
    'Expand': '展开',
    'Copy permalink': '复制永久链接',
    'Permalink': '永久链接',
    'Select all': '全选',
    'Select': '选择',
    'Deselect': '取消选择',

    /* ---------- 首页动态 (Home Feed) ---------- */
    'Feed': '动态',
    'Your feed': '你的动态',
    'Your teams': '你的团队',
    'All activity': '全部动态',
    'Filter by repository': '按仓库筛选',
    'Filter by organization': '按组织筛选',
    'Filter by activity type': '按活动类型筛选',
    'Create a repository': '创建仓库',
    'Discover interesting projects and people': '发现有趣的项目和人',
    'Trending repositories': '热门仓库',
    'Top repositories': '热门仓库',
    'Recommended for you': '为你推荐',
    'Explore repositories': '探索仓库',
    'Recently visited': '最近访问',
    'Repositories you contribute to': '你参与贡献的仓库',
    'Contribution graph': '贡献图',
    'Start a new project': '开始新项目',
    'See more': '查看更多',
    'View more': '查看更多',
    'Show more activity': '显示更多动态',
    'No activity yet': '暂无动态',

    /* ---------- 通知页 (Notifications) ---------- */
    'All notifications': '全部通知',
    'Unread': '未读',
    'Read': '已读',
    'Mark as read': '标记为已读',
    'Mark as unread': '标记为未读',
    'Mark as done': '标记为完成',
    'Mark all as read': '全部标记为已读',
    'Manage notifications': '管理通知',
    'Notification settings': '通知设置',
    'You’re all caught up!': '你已经看完了所有通知！',
    'No unread notifications': '没有未读通知',
    'Group by': '分组方式',
    'Reason': '原因',
    'Filter notifications': '筛选通知',
    'Custom': '自定义',
    'Participating': '参与中',
    'Mentioned': '被提及',
    'Assigned': '被指派',
    'Review requested': '请求审查',
    'Team mentioned': '团队被提及',

    /* ---------- 仓库页补充 ---------- */
    'Use this template': '使用此模板',
    'Branch': '分支',
    'Default': '默认',
    'default': '默认',
    'Switch branches/tags': '切换分支/标签',
    'Find or create a branch...': '查找或创建分支…',
    'Filter branches/tags': '筛选分支/标签',
    'View all branches': '查看所有分支',
    'View all tags': '查看所有标签',
    'View all files': '查看所有文件',
    'No files found': '未找到文件',
    'Upload an existing file': '上传现有文件',
    'Choose your branch': '选择分支',
    'File name': '文件名',
    'Folder name': '文件夹名称',
    'Add a README': '添加 README',
    'Create a README file': '创建 README 文件',
    'Topics': '主题',
    'Resources': '资源',
    'Code of conduct': '行为准则',
    'Contributing': '贡献指南',
    'Security policy': '安全策略',
    'Report abuse': '举报滥用',
    'Star this repository': '星标此仓库',
    'Watchers': '关注者',
    'Draft a new release': '起草新发行版',
    'Create a new release': '创建新发行版',
    'Create a new tag': '创建新标签',
    'Manage releases': '管理发行版',
    'No releases published': '尚未发布任何发行版',
    'Copy path': '复制路径',
    'Open in github.dev': '在 github.dev 中打开',
    'Open in new tab': '在新标签页中打开',
    'Show original': '显示原始文件',
    'Show diff': '显示差异',
    'Source': '源码',
    'Search this repository': '搜索此仓库',
    'Symbols': '符号',
    'Outline': '大纲',
    'Go to definition': '转到定义',

    /* ---------- 议题 / PR 详情补充 ---------- */
    'Submit new issue': '提交新议题',
    'Add a title': '添加标题',
    'Enter a title': '输入标题',
    'Add a description': '添加描述',
    'Enter a description': '输入描述',
    'Close with comment': '评论并关闭',
    'Add a comment': '添加评论',
    'Delete comment': '删除评论',
    'Edit comment': '编辑评论',
    'Quote reply': '引用回复',
    'Reference in new issue': '在新议题中引用',
    'Member': '成员',
    'Collaborator': '协作者',
    'Contributor': '贡献者',
    'Timeline': '时间线',
    'Linked pull requests': '关联的拉取请求',
    'Reviewers': '审查者',
    'Requested reviewers': '已请求的审查者',
    'No reviews': '暂无审查',
    'Add your review': '添加你的审查',
    'Submit review': '提交审查',
    'Dismissed': '已驳回',
    'Approved': '已批准',
    'Commented': '已评论',
    'Changes requested': '已请求修改',
    'Review required': '需要审查',
    'Still in progress?': '仍在进行中？',
    'All checks have passed': '所有检查已通过',
    'Some checks were not successful': '部分检查未通过',
    'Delete branch': '删除分支',
    'Delete remote branch': '删除远程分支',
    'Show all reviewers': '显示所有审查者',
    'New changes since you last viewed': '自上次查看以来的新变更',

    /* ---------- 提交 / 代码浏览 ---------- */
    'Commit': '提交',
    'Browse files': '浏览文件',
    'parent': '父提交',
    'author': '作者',
    'committed': '提交于',
    'Co-authored-by': '共同作者',
    'Verified': '已验证',
    'Unverified': '未验证',

    /* ---------- Actions ---------- */
    'Workflows': '工作流',
    'All workflows': '所有工作流',
    'Create a new workflow': '创建新工作流',
    'Workflow runs': '工作流运行',
    'Success': '成功',
    'Failure': '失败',
    'Failed': '失败',
    'In progress': '进行中',
    'Queued': '排队中',
    'Cancelled': '已取消',
    'Skipped': '已跳过',
    'Re-run jobs': '重新运行作业',
    'Re-run all jobs': '重新运行所有作业',
    'Cancel workflow': '取消工作流',
    'View workflow file': '查看工作流文件',
    'Run workflow': '运行工作流',
    'Enable workflow': '启用工作流',
    'Disable workflow': '禁用工作流',
    'Artifacts': '构建产物',
    'Duration': '耗时',
    'Event': '事件',
    'Status': '状态',
    'Actor': '触发者',
    'Job': '作业',
    'Jobs': '作业',
    'Manual': '手动',

    /* ---------- 设置页补充 ---------- */
    'Profile': '个人资料',
    'Saved replies': '已保存的回复',
    'Scheduled reminders': '定时提醒',
    'Security log': '安全日志',
    'Sponsorship log': '赞助日志',
    'Moderation': '审核',
    'Change password': '更改密码',
    'Two-factor authentication': '双重身份验证',
    'Enable two-factor authentication': '启用双重身份验证',
    'Disable two-factor authentication': '禁用双重身份验证',
    'Recovery codes': '恢复代码',
    'Security keys': '安全密钥',
    'New SSH key': '新建 SSH 密钥',
    'Add SSH key': '添加 SSH 密钥',
    'Add key': '添加密钥',
    'Title': '标题',
    'Key': '密钥',
    'Primary': '主要',
    'Backup': '备用',
    'Verified email': '已验证邮箱',
    'Unverified email': '未验证邮箱',
    'Set as primary': '设为主要邮箱',
    'Remove email': '移除邮箱',
    'Add email address': '添加邮箱地址',
    'Add email': '添加邮箱',
    'Resend verification email': '重新发送验证邮件',
    'Current session': '当前会话',
    'Revoke': '撤销',
    'Revoke all': '全部撤销',
    'Authorized OAuth Apps': '已授权的 OAuth 应用',
    'Authorized GitHub Apps': '已授权的 GitHub 应用',
    'Generate new token': '生成新令牌',
    'Tokens (classic)': '令牌（经典）',
    'Fine-grained tokens': '细粒度令牌',
    'All repositories': '所有仓库',
    'Only select repositories': '仅选定仓库',
    'Expiration': '过期时间',
    'No expiration': '永不过期',
    'Generate token': '生成令牌',
    'Delete token': '删除令牌',
    'GitHub Apps': 'GitHub 应用',
    'OAuth Apps': 'OAuth 应用',
    'Default branch': '默认分支',
    'Rename': '重命名',
    'Change default branch': '更改默认分支',
    'Features': '功能',
    'Wikis': '百科',
    'Sponsorships': '赞助',
    'Sponsor button': '赞助按钮',
    'Social preview': '社交预览',
    'Upload an image': '上传图片',
    'Webhooks': 'Webhook',
    'Deploy keys': '部署密钥',
    'Pages': 'Pages',
    'Secrets and variables': '密钥和变量',
    'Delete this repository': '删除此仓库',
    'Change repository visibility': '更改仓库可见性',
    'Transfer ownership': '转移所有权',
    'Archive this repository': '归档此仓库',
    'Unarchive this repository': '取消归档此仓库',

    /* ---------- 组织 / 团队 ---------- */
    'Teams': '团队',
    'Team': '团队',
    'People': '成员',
    'Members': '成员',
    'Invite someone': '邀请成员',
    'Invite a collaborator': '邀请协作者',
    'Pending invitations': '待处理的邀请',
    'New team': '新建团队',
    'Manage': '管理',
    'Role': '角色',
    'Roles': '角色',
    'You have no teams': '你还没有团队',
    'Create new organization': '创建新组织',
    'Organization': '组织',
    'Organization name': '组织名称',
    'Billing email': '账单邮箱',
    'Contact email': '联系邮箱',
    'Free': '免费',
    'Enterprise': '企业',

    /* ---------- 搜索页 ---------- */
    'Users': '用户',
    'Advanced search': '高级搜索',
    'Search syntax tips': '搜索语法提示',
    'Search all of GitHub': '搜索整个 GitHub',
    'Search repositories': '搜索仓库',
    'Search code': '搜索代码',
    'Search issues': '搜索议题',
    'Search pull requests': '搜索拉取请求',
    'Search discussions': '搜索讨论',
    'Search users': '搜索用户',

    /* ---------- 通用补充 ---------- */
    'Toggle navigation': '切换导航',
    'Skip to content': '跳到主要内容',
    'Open menu': '打开菜单',
    'Close menu': '关闭菜单',
    'Dismiss': '忽略',
    'Undo': '撤销',
    'Redo': '重做',
    'Restore': '恢复',
    'Unarchive': '取消归档',
    'Internal': '内部',
    'None': '无',
    'Other': '其他',
    'Unknown': '未知',
    'Error': '错误',
    'Errors': '错误',
    'Warning': '警告',
    'Info': '信息',
    'Details': '详情',
    'Summary': '摘要',
    'Notes': '备注',
    'Note': '备注',
    'Tip': '提示',
    'Caution': '注意',
    'Important': '重要',
    'Are you sure?': '你确定吗？',
    'This action cannot be undone.': '此操作无法撤销。',
    'Continue': '继续',
    'Skip': '跳过',
    'Finish': '完成',
    'Get started': '开始使用',
    'Set up': '设置',
    'Configure': '配置',
    'View': '查看',
    'Public repositories': '公开仓库',
    'Private repositories': '私有仓库',
    'Search results': '搜索结果',
    'No results': '无结果',
    'Page not found': '页面未找到',
    'Take me home': '返回首页',
    'Back to GitHub': '返回 GitHub',
    'You must be signed in to continue.': '你必须登录才能继续。',

    /* ---------- 实机扫描补充：全局 / 页脚 ---------- */
    'Dashboard': '仪表盘',
    'Inbox': '收件箱',
    'Views': '视图',
    'Create view': '创建视图',
    'View options': '视图选项',
    'No saved views': '没有已保存的视图',
    'Folders': '文件夹',
    'Subscriptions': '订阅',
    'Date': '日期',
    'Type': '类型',
    'Repository': '仓库',
    'Balance': '余额',
    'Homepage': '主页',
    'Footer': '页脚',
    'Footer navigation': '页脚导航',
    'Privacy': '隐私',
    'Terms': '条款',
    'Contact': '联系',
    'Manage cookies': '管理 Cookie',
    'Do not share my personal information': '不要共享我的个人信息',
    'Register now': '立即注册',
    'Reload': '重新加载',
    'Loading': '加载中',
    'Please reload this page': '请重新加载此页面',
    'Uh oh!': '哎呀！',
    'Dismiss alert': '关闭提醒',
    'Open menu': '打开菜单',
    'Open user navigation menu': '打开用户导航菜单',
    'Open quick search dialog, type / to search': '打开快速搜索对话框，输入 / 进行搜索',

    /* ---------- 实机扫描补充：仪表盘 ---------- */
    'All issues': '所有议题',
    'All pull requests': '所有拉取请求',
    'Create issue': '创建议题',
    'Search for repositories': '搜索仓库',
    'Switch to classic dashboard': '切换到经典仪表盘',
    'Latest from our changelog': '更新日志最新内容',
    'Give dashboard feedback': '提供仪表盘反馈',
    'Give feedback': '提供反馈',
    'Send feedback': '发送反馈',
    'Send now': '立即发送',
    'How satisfied are you with this dashboard?': '你对这个仪表盘满意吗？',
    'Very dissatisfied': '非常不满意',
    'Dissatisfied': '不满意',
    'Satisfied': '满意',
    'Issue actions': '议题操作',
    'Issue options': '议题选项',
    'Pull request options': '拉取请求选项',
    'Chat with Copilot': '与 Copilot 对话',
    'Open in Copilot Chat': '在 Copilot Chat 中打开',
    'Chat commands': '聊天命令',
    'Select repositories to attach to conversation': '选择要附加到对话的仓库',
    'Ask': '提问',
    'Agent': '智能体',
    'Auto': '自动',
    'Debug': '调试',

    /* ---------- 实机扫描补充：通知页 ---------- */
    'All caught up!': '全部处理完毕！',
    'Clean up your inbox': '清理你的收件箱',
    'Mark all read notifications as done': '将所有已读通知标记为完成',
    'Search notifications': '搜索通知',
    'Notifications by date': '按日期排列的通知',
    'Switch inbox': '切换收件箱',
    'Add new filter': '添加新筛选',
    'Newest to oldest': '最新优先',
    'Oldest to newest': '最早优先',
    'Code alert': '代码警报',
    'Watched repositories': '关注的仓库',

    /* ---------- 实机扫描补充：议题 / PR 列表 ---------- */
    'Assigned to me': '指派给我',
    'Created by me': '由我创建',
    'Mentioning me': '提及我',
    'Clear filter': '清除筛选',
    'Comfortable display density': '舒适显示密度',
    'Compact display density': '紧凑显示密度',
    'Learn more about searching and filtering': '了解搜索和筛选',
    'No results matched your search': '没有匹配的结果',
    'Sort by Updated descending': '按更新时间降序排序',
    'issues and pull requests': '议题和拉取请求',
    'issue': '议题',
    'issues': '议题',
    'assignee': '指派给',
    'archived': '已归档',

    /* ---------- 实机扫描补充：设置页侧栏 ---------- */
    'AI usage': 'AI 用量',
    'Access': '访问权限',
    'Additional billing details': '附加账单信息',
    'Archives': '归档',
    'Available for hire': '可接受雇佣',
    'Billing and licensing': '账单和许可',
    'Bio': '简介',
    'Blocked users': '已屏蔽的用户',
    'Budgets and alerts': '预算与警报',
    'Cloud agent': '云端智能体',
    'Code review limits': '代码审查限制',
    'Code security': '代码安全',
    'Code, planning, and automation': '代码、规划与自动化',
    'Codespaces': 'Codespaces',
    'Company': '公司',
    'Credentials': '凭据',
    'Education benefits': '教育权益',
    'Enterprises': '企业',
    'Integrations': '集成',
    'Interaction limits': '交互限制',
    'Licensing': '许可',
    'Menu': '菜单',

    /* ---------- 实机扫描补充：通知设置 ---------- */
    'Agent sessions': '智能体会话',
    'Custom routing': '自定义路由',
    'Customize email updates': '自定义邮件更新',
    'Default notifications email': '默认通知邮箱',
    'Dependabot alerts': 'Dependabot 警报',
    'Ignored repositories': '已忽略的仓库',
    'In-product messages': '产品内消息',
    'Email': '邮箱',
    'Email, CLI': '邮件、CLI',
    'Failed workflows only': '仅失败的工作流',
    'Don\'t send': '不发送',
    'Off': '关闭',
    'On': '开启',

    /* ---------- 实机扫描补充：外观设置 ---------- */
    'Beta': '测试版',
    'Contrast': '对比度',
    'Increase contrast': '提高对比度',
    'Dark Skin Tone': '深色肤色',
    'Light Skin Tone': '浅色肤色',
    'Dark default': '深色（默认）',
    'Light default': '浅色（默认）',
    'Dark mode': '深色模式',
    'Light mode': '浅色模式',
    'Dark theme': '深色主题',
    'Light theme': '浅色主题',
    'Dark protanopia and deuteranopia': '深色（红色盲与绿色盲）',
    'Light protanopia and deuteranopia': '浅色（红色盲与绿色盲）',
    'Dark tritanopia': '深色（蓝色盲）',
    'Light tritanopia': '浅色（蓝色盲）',
    'Emoji skin tone preference': 'Emoji 肤色偏好',

    /* ---------- 实机扫描补充：仓库主页 ---------- */
    'Deployments': '部署',
    'Agents': '智能体',
    'Folders and files': '文件夹和文件',
    'Last commit message': '最近提交信息',
    'Last commit date': '最近提交日期',
    'Repository files navigation': '仓库文件导航',
    'Repository navigation': '仓库导航',
    'Open in codespace': '在 codespace 中打开',
    'Open more actions menu': '打开更多操作菜单',
    'Public repository': '公开仓库',
    'Ask Copilot about this repository': '询问 Copilot 关于此仓库',

    /* ---------- 实机扫描补充：列表页 ---------- */
    'Collapse sidebar': '折叠侧边栏',
    'Filter by author': '按作者筛选',
    'More Issue list controls': '更多议题列表控件',

    /* ---------- 议题侧栏 ---------- */
    'Milestone': '里程碑',
    'Relationships': '关联项',
    'Development': '开发',
    'None yet': '暂无',
    'Create a branch': '创建分支',
    'Link a branch': '关联分支',
    'Link a pull request': '关联拉取请求',
    'No branches or pull requests': '没有分支或拉取请求',

    /* ---------- 关闭议题原因 ---------- */
    'Close as completed': '作为已完成关闭',
    'Close as not planned': '作为未计划关闭',
    'Close as duplicate': '作为重复关闭',
    'Done, closed, fixed, resolved': '已完成、已关闭、已修复、已解决',
    'Won\'t fix, can\'t repro, stale': '不会修复、无法复现、已过期',
    'Duplicate of another issue': '与另一个议题重复',
    'Duplicate': '重复',
    'Completed': '已完成',
    'Not planned': '未计划',
    'Comment and close': '评论并关闭',
    'Reopen': '重新开启',

    /* ---------- 议题侧栏菜单 / 评论框 ---------- */
    'Customize': '自定义',
    'Open in GitHub Copilot app': '在 GitHub Copilot 应用中打开',
    'Transfer issue': '转移议题',
    'Clone issue': '克隆议题',
    'Lock conversation': '锁定讨论',
    'Unlock conversation': '解锁讨论',
    'Pin issue': '置顶议题',
    'Unpin issue': '取消置顶议题',
    'Delete issue': '删除议题',
    "You're receiving notifications because you're subscribed to this thread.": '你收到通知是因为你订阅了这个讨论串。',
    'Use Markdown to format your comment': '使用 Markdown 格式化你的评论',
    'Paste, drop, or click to add files': '粘贴、拖放或点击以添加文件',
    'Contributing guidelines': '贡献指南',
    'contributing guidelines': '贡献指南',

    /* ---------- 句子被链接拆成多个文本节点时的碎片 ---------- */
    'for this issue or link a pull request.': '来处理此议题，或关联一个拉取请求。',
    "Please follow this repository's": '请遵守此仓库的',
    'and': '和',

    /* ---------- Pulse / 洞察侧栏 ---------- */
    'Pulse': '活动概况',
    'Community': '社区',
    'Community standards': '社区规范',
    'Traffic': '流量',
    'Code frequency': '代码频率',
    'Dependency graph': '依赖关系图',
    'Network': '网络',
    'Actions usage metrics': 'Actions 用量指标',
    'Actions performance metrics': 'Actions 性能指标',
    'Period:': '周期：',
    'Merged pull requests': '已合并的拉取请求',
    'Open pull requests': '开启的拉取请求',
    'New issues': '新建议题',
    'Top committers': '提交最多的人',

    /* ---------- 状态编辑对话框（Edit status） ---------- */
    'Edit status': '编辑状态',
    "What's happening": '发生了什么',
    "What's happening?": '发生了什么？',
    'I may be slow to respond.': '我可能回复较慢。',
    'On vacation': '休假中',
    'Out sick': '病假中',
    'Working from home': '在家办公',
    'Focusing': '专注中',
    'Busy': '忙碌',
    'When others mention you, assign you, or request your review, GitHub will let them know that you have limited availability.':
      '当他人提及你、指派你或请求你审查时，GitHub 会告知他们你的可联系时间有限。',
    'Never': '从不',
    '30 minutes': '30 分钟',
    '1 hour': '1 小时',
    '4 hours': '4 小时',
    'Today': '今天',
    'This week': '本周',
    'Your status will be cleared after the selected time.': '所选时间过后，你的状态将被清除。',
    'Visible to': '可见范围',
    'Everyone': '所有人',
    'Limit status visibility to a single organization.': '将状态可见范围限制为单个组织。',
    'Clear status': '清除状态',
    'Set status': '设置状态',

    /* ---------- 贡献图（个人主页） ---------- */
    'Less': '较少',
    'Learn how we count contributions': '了解我们如何统计贡献',
    'Jan': '1月',
    'Feb': '2月',
    'Mar': '3月',
    'Apr': '4月',
    'May': '5月',
    'Jun': '6月',
    'Jul': '7月',
    'Aug': '8月',
    'Sep': '9月',
    'Oct': '10月',
    'Nov': '11月',
    'Dec': '12月',
    'Mon': '周一',
    'Tue': '周二',
    'Wed': '周三',
    'Thu': '周四',
    'Fri': '周五',
    'Sat': '周六',
    'Sun': '周日',

    /* ---------- 关注者计数（个人主页） ---------- */
    'follower': '关注者',
    'followers': '关注者',

    /* ---------- Projects：空状态与创建项目 ---------- */
    'Create your first GitHub project': '创建你的第一个 GitHub 项目',
    'Projects are a customizable, flexible tool for planning and tracking your work.':
      '项目是一个可自定义、灵活的工具，用于规划并跟踪你的工作。',
    'Create project': '创建项目',
    'Project templates': '项目模板',
    'Search templates': '搜索模板',
    'Featured': '精选',
    'Start from scratch': '从零开始',
    'Table': '表格',
    'Board': '看板',
    'Roadmap': '路线图',
    'Team planning': '团队规划',
    "Manage your team's work items, plan upcoming cycles, and understand team capacity":
      '管理团队的工作项、规划即将到来的周期，并了解团队产能',
    'Kanban': '看板',
    'Visualize the status of your project and limit work in progress':
      '可视化项目状态并限制进行中的工作数量',
    'Feature release': '功能发布',
    "Manage your team's prioritized work items when planning for a feature release":
      '在规划功能发布时，管理团队按优先级排列的工作项',
    'Bug tracker': '缺陷跟踪',
    'Track and triage your bugs': '跟踪并分类你的缺陷',
    'Iterative development': '迭代开发',
    'Plan your current and upcoming iterations as you work through your prioritized backlog of items':
      '在推进按优先级排列的待办事项时，规划当前和即将到来的迭代',
    'Product launch': '产品发布',
    'Manage work items across teams and functions when planning for a product launch':
      '规划产品发布时，跨团队和职能管理工作项',
    "Manage your team's long term plans as you plan out your roadmap":
      '制定路线图时，管理团队的长期计划',
    'Team retrospective': '团队回顾',
    'Reflect as a team what went well, what can be improved next time, and action items':
      '以团队形式回顾哪些做得好、下次可以改进什么，以及行动项'
  };

  /* 忽略大小写的次索引 */
  const DICT_LOWER = {};
  Object.keys(DICT).forEach((k) => {
    const lk = k.toLowerCase();
    if (!(lk in DICT_LOWER)) DICT_LOWER[lk] = DICT[k];
  });

  /* ===================== 词典：正则规则 ===================== */
  const TIME_UNITS = {
    second: '秒',
    minute: '分钟',
    hour: '小时',
    day: '天',
    week: '周',
    month: '个月',
    year: '年'
  };

  const TIME_AGO = /^(an?|one|\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago$/i;

  /* 月份缩写 → 数字。用于 <relative-time> 等组件在 Shadow DOM 里渲染出的日期文本 */
  const MONTH_NUM = {
    jan: '1', feb: '2', mar: '3', apr: '4', may: '5', jun: '6',
    jul: '7', aug: '8', sep: '9', oct: '10', nov: '11', dec: '12'
  };
  const MON = '(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)';
  const MONF = '(january|february|march|april|may|june|july|august|september|october|november|december)';
  const monNum = (mon) => MONTH_NUM[mon.toLowerCase()] || mon;
  const monFNum = (mon) => MONTH_NUM[mon.slice(0, 3).toLowerCase()] || mon;

  const REGEX_RULES = [
    /* 完整月份名，例如 Pulse 页的 "September 28, 2026 – October 5, 2026" */
    [
      new RegExp('^' + MONF + ' (\\d{1,2}), (\\d{4}) [-–] ' + MONF + ' (\\d{1,2}), (\\d{4})$', 'i'),
      (m, m1, d1, y1, m2, d2, y2) =>
        y1 + '年' + monFNum(m1) + '月' + d1 + '日 – ' + y2 + '年' + monFNum(m2) + '月' + d2 + '日'
    ],
    [new RegExp('^' + MONF + ' (\\d{1,2}), (\\d{4})$', 'i'), (m, mon, d, y) => y + '年' + monFNum(mon) + '月' + d + '日'],
    [new RegExp('^on ' + MON + ' (\\d{1,2}), (\\d{4})$', 'i'), (m, mon, d, y) => y + '年' + monNum(mon) + '月' + d + '日'],
    [new RegExp('^on ' + MON + ' (\\d{1,2})$', 'i'), (m, mon, d) => monNum(mon) + '月' + d + '日'],
    [new RegExp('^' + MON + ' (\\d{1,2}), (\\d{4})$', 'i'), (m, mon, d, y) => y + '年' + monNum(mon) + '月' + d + '日'],
    [new RegExp('^' + MON + ' (\\d{1,2})$', 'i'), (m, mon, d) => monNum(mon) + '月' + d + '日'],
    [new RegExp('^' + MON + ' (\\d{4})$', 'i'), (m, mon, y) => y + '年' + monNum(mon) + '月'],
    [
      TIME_AGO,
      (m, num, unit) => {
        const n = /^\d+$/.test(num) ? num : '1';
        return n + ' ' + (TIME_UNITS[unit.toLowerCase()] || unit) + '前';
      }
    ],
    [/^just now$/i, () => '刚刚'],
    [/^yesterday$/i, () => '昨天'],
    [/^last (week|month|year)$/i, (m, u) => '上' + (TIME_UNITS[u.toLowerCase()] || u)],
    [/^([\d,]+)\s+commits?$/i, '$1 次提交'],
    [/^([\d,]+)\s+branches?$/i, '$1 个分支'],
    [/^([\d,]+)\s+tags?$/i, '$1 个标签'],
    [/^([\d,]+)\s+releases?$/i, '$1 个发行版'],
    [/^([\d,]+)\s+contributors?$/i, '$1 位贡献者'],
    [/^([\d,]+)\s+(?:files? changed|changed files?)$/i, '$1 个文件变更'],
    [/^([\d,]+)\s+comments?$/i, '$1 条评论'],
    [/^([\d,]+)\s+stars?$/i, '$1 个星标'],
    [/^([\d,]+)\s+forks?$/i, '$1 个复刻'],
    [/^([\d,]+)\s+watching$/i, '$1 人关注'],
    [/^([\d,]+)\s+open$/i, '$1 个开启'],
    [/^([\d,]+)\s+closed$/i, '$1 个已关闭'],
    [/^([\d,]+)\s+added lines?$/i, '新增 $1 行'],
    [/^([\d,]+)\s+deleted lines?$/i, '删除 $1 行'],
    [/^Page (\d+) of (\d+)$/i, '第 $1 页，共 $2 页'],
    [/^([\d,]+)\s+notifications?$/i, '$1 条通知'],
    [/^([\d,]+)\s+unread$/i, '$1 条未读'],
    [/^([\d,]+)\s+results?$/i, '$1 个结果'],
    [/^([\d,]+)\s+repository results?$/i, '$1 个仓库结果'],
    [/^([\d,]+)\s+available repository results?$/i, '$1 个可用仓库结果'],
    /* Pulse 页统计 */
    [/^([\d,]+)\s+active pull requests?$/i, '$1 个进行中的拉取请求'],
    [/^([\d,]+)\s+active issues?$/i, '$1 个进行中的议题'],
    [/^([\d,]+)\s+issues? closed by ([\d,]+)\s+(?:people|person)$/i, '$2 人关闭了 $1 个议题'],
    [
      /^Excluding merges, ([\d,]+) authors? (?:has|have) pushed ([\d,]+) commits? to (.+?) and ([\d,]+) commits? to all branches\.$/i,
      '不含合并提交，$1 位作者向 $3 推送了 $2 次提交，向所有分支推送了 $4 次提交。'
    ],
    /* 状态编辑框的剩余字数 */
    [/^([\d,]+)\s+characters? remaining$/i, '还可输入 $1 个字符'],
    /* 贡献图 / 关注者计数 */
    [/^([\d,]+)\s+contributions? in the last year$/i, '过去一年共 $1 次贡献'],
    [/^([\d,]+)\s+followers?$/i, '$1 位关注者'],
    [/^([\d,]+)\s+following$/i, '$1 个正在关注']
  ];

  /* ===================== 翻译核心 ===================== */

  /**
   * 翻译一段字符串。命中返回译文（保留首尾空白），未命中返回 null。
   */
  function translateString(raw) {
    if (typeof raw !== 'string' || !raw) return null;
    const trimmed = raw.trim();
    if (!trimmed || trimmed.length > 200) return null;

    let zh = DICT[trimmed];
    if (!zh) zh = DICT_LOWER[trimmed.toLowerCase()];
    if (!zh) {
      /* GitHub 常使用弯引号 ’，词典里统一用直引号，这里归一化后重试 */
      const straight = trimmed.replace(/[\u2018\u2019]/g, "'");
      if (straight !== trimmed) zh = DICT[straight] || DICT_LOWER[straight.toLowerCase()];
    }
    if (!zh) {
      /* 剥离开头的前导符号（emoji、箭头等）后再匹配，例如 "✋ Mentioned" */
      const m = trimmed.match(/^[^\p{L}\p{N}]+/u);
      if (m) {
        const rest = trimmed.slice(m[0].length);
        const hit = DICT[rest] || DICT_LOWER[rest.toLowerCase()];
        if (hit) zh = m[0] + hit;
      }
    }
    if (!zh) {
      /* 剥离结尾的 emoji 后再匹配，例如 "Track and triage your bugs 🐛" */
      const m = trimmed.match(/[\p{Extended_Pictographic}\u200d\ufe0f]+$/u);
      if (m && m.index > 0) {
        const head = trimmed.slice(0, m.index).replace(/\s+$/, '');
        const hit = DICT[head] || DICT_LOWER[head.toLowerCase()];
        if (hit) zh = hit + ' ' + m[0];
      }
    }
    if (!zh) {
      for (let i = 0; i < REGEX_RULES.length; i++) {
        const rule = REGEX_RULES[i];
        if (rule[0].test(trimmed)) {
          zh = trimmed.replace(rule[0], rule[1]);
          break;
        }
      }
    }
    if (!zh || zh === trimmed) return null;

    const lead = raw.match(/^\s*/)[0];
    const tail = raw.match(/\s*$/)[0];
    return lead + zh + tail;
  }

  /* 完全跳过文本翻译的区域（代码、用户内容等） */
  const SKIP_TEXT_SELECTOR = [
    'script',
    'style',
    'noscript',
    'template',
    'textarea',
    'pre',
    'code',
    'kbd',
    'samp',
    'var',
    '.markdown-body',
    '.blob-code',
    '.highlight',
    '.cm-editor',
    '.CodeMirror',
    '.user-content',
    '.p-name',
    '[itemprop="name"]',
    '[data-testid="repository-name"]',
    '[data-testid="profile-name"]',
    '[contenteditable="true"]',
    '[translate="no"]',
    '.notranslate'
  ].join(',');

  /* 属性翻译时跳过的区域（比上面宽松一些） */
  const SKIP_ATTR_SELECTOR = [
    'pre',
    'code',
    '.markdown-body',
    '.blob-code',
    '.highlight',
    '.cm-editor',
    '.CodeMirror',
    '.user-content',
    '[translate="no"]',
    '.notranslate'
  ].join(',');

  /* 仓库名 / 用户名链接，避免把 "linux" 之类的名字误翻 */
  const SIMPLE_PATH_RE = /^\/([^/?#]+)(?:\/([^/?#]+))?\/?$/;
  function isNameLink(el) {
    const a = el.closest('a[href]');
    if (!a) return false;
    const href = a.getAttribute('href') || '';
    if (!SIMPLE_PATH_RE.test(href)) return false;
    const text = (a.textContent || '').trim();
    if (!text || /\s/.test(text)) return false;
    const parts = href.split('/').filter(Boolean);
    const last = parts[parts.length - 1];
    return text === last || text === parts[0];
  }

  function processTextNode(node) {
    if (!node || node.nodeType !== 3) return;
    const out = translateString(node.nodeValue);
    if (out === null) return; // 未命中，提前返回，几乎零开销
    const parent = node.parentElement;
    if (!parent) return;
    if (parent.closest(SKIP_TEXT_SELECTOR)) return;
    if (isNameLink(parent)) return;
    node.nodeValue = out;
  }

  const ATTR_NAMES = ['placeholder', 'title', 'aria-label', 'data-confirm'];
  const ATTR_SELECTOR = [
    'input[placeholder]',
    '[placeholder]',
    '[title]',
    '[aria-label]',
    '[data-confirm]',
    'input[type="submit"]',
    'input[type="button"]'
  ].join(',');

  function processAttrsIn(root) {
    const scope = (root.nodeType === 1 || root.nodeType === 11) ? root : root.parentElement;
    if (!scope) return;

    const list = [];
    if (scope.matches && scope.matches(ATTR_SELECTOR)) list.push(scope);
    if (scope.querySelectorAll) {
      const found = scope.querySelectorAll(ATTR_SELECTOR);
      for (let i = 0; i < found.length; i++) list.push(found[i]);
    }

    for (let i = 0; i < list.length; i++) {
      const el = list[i];
      if (el.closest(SKIP_ATTR_SELECTOR)) continue;

      for (let j = 0; j < ATTR_NAMES.length; j++) {
        const name = ATTR_NAMES[j];
        const val = el.getAttribute(name);
        if (!val) continue;
        const out = translateString(val);
        if (out !== null) el.setAttribute(name, out.trim());
      }

      const tag = el.tagName;
      if (tag === 'INPUT' && (el.type === 'submit' || el.type === 'button')) {
        const out = translateString(el.value);
        if (out !== null) el.value = out.trim();
      }
    }
  }

  /* ---------- Shadow DOM：<relative-time> 等组件把文本渲染在 shadow root 里 ---------- */
  const SHADOW_HOSTS = 'relative-time, time-ago, time-until, local-time';

  let observer = null;
  const OBSERVE_OPTIONS = {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['placeholder', 'title', 'aria-label', 'data-confirm']
  };
  const observedRoots = new Set();
  const pendingObserve = [];

  function observeRoot(target) {
    if (observedRoots.has(target)) return;
    observedRoots.add(target);
    if (observer) observer.observe(target, OBSERVE_OPTIONS);
    else pendingObserve.push(target);
  }

  function startObserving() {
    if (!observer) return;
    for (let i = 0; i < pendingObserve.length; i++) observer.observe(pendingObserve[i], OBSERVE_OPTIONS);
    pendingObserve.length = 0;
  }

  function processShadowRoots(root) {
    if (!root.querySelectorAll) return;
    const hosts = root.querySelectorAll(SHADOW_HOSTS);
    for (let i = 0; i < hosts.length; i++) {
      const sr = hosts[i].shadowRoot;
      if (!sr || observedRoots.has(sr)) continue;
      observeRoot(sr);
      translateTree(sr);
    }
  }

  function translateTree(root) {
    if (!root) return;

    if (root.nodeType === 3) {
      processTextNode(root);
      return;
    }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        return n.nodeValue && n.nodeValue.trim()
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });

    const pending = [];
    let n;
    while ((n = walker.nextNode())) pending.push(n);
    for (let i = 0; i < pending.length; i++) processTextNode(pending[i]);

    if (root.nodeType === 1 || root.nodeType === 11) {
      processAttrsIn(root);
      processShadowRoots(root);
    }
  }

  /* ---------- 页面标题 ---------- */
  function translateDocTitle() {
    try {
      const parts = document.title.split(' · ');
      if (parts.length < 2) return;
      const out = DICT[parts[0].trim()] || DICT_LOWER[parts[0].trim().toLowerCase()];
      if (out && out !== parts[0]) {
        parts[0] = out;
        document.title = parts.join(' · ');
      }
    } catch (e) {
      /* ignore */
    }
  }

  /* ===================== 辅助工具：导出本页未翻译的英文 ===================== */
  function collectUntranslated() {
    const found = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const t = n.nodeValue && n.nodeValue.trim();
        if (!t || t.length < 2 || t.length > 60) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let n;
    while ((n = walker.nextNode())) {
      const text = n.nodeValue.trim();
      if (!/[A-Za-z]{2}/.test(text)) continue; // 无英文
      if (/[\u4e00-\u9fa5]/.test(text)) continue; // 已含中文
      if (DICT[text] || DICT_LOWER[text.toLowerCase()]) continue; // 已收录
      if (/[./@#:_]/.test(text)) continue; // 文件名 / 路径 / 标识符
      if (/^[A-Z0-9\s-]+$/.test(text)) continue; // 全大写缩写

      const parent = n.parentElement;
      if (!parent || parent.closest(SKIP_TEXT_SELECTOR) || isNameLink(parent)) continue;

      found.add(text);
    }
    return Array.from(found).sort();
  }

  function exportUntranslated() {
    const list = collectUntranslated();
    const output = list.join('\n');
    console.log('[GitHub 汉化] 本页未翻译文本（' + list.length + ' 条）：\n' + output);
    try {
      if (typeof GM_setClipboard === 'function') GM_setClipboard(output, 'text');
      else navigator.clipboard.writeText(output);
    } catch (e) {
      /* ignore */
    }
    alert('已收集 ' + list.length + ' 条未翻译文本，已复制到剪贴板，并打印在控制台。');
  }

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('导出本页未翻译文本（用于补充词典）', exportUntranslated);
  }

  /* ===================== 启动 ===================== */
  translateTree(document.body);
  translateDocTitle();

  observer = new MutationObserver((mutations) => {
    for (let i = 0; i < mutations.length; i++) {
      const m = mutations[i];
      if (m.type === 'characterData') {
        processTextNode(m.target);
      } else if (m.type === 'childList') {
        for (let j = 0; j < m.addedNodes.length; j++) {
          const node = m.addedNodes[j];
          if (node.nodeType === 3 || node.nodeType === 1) translateTree(node);
        }
      } else if (m.type === 'attributes') {
        processAttrsIn(m.target);
      }
    }
  });

  observeRoot(document.body);
  startObserving();

  /* GitHub 是 SPA，路由切换后补一次标题 */
  ['turbo:load', 'pjax:end', 'popstate'].forEach((evt) => {
    window.addEventListener(evt, translateDocTitle, true);
  });
})();
