// 在线图片搜索演示功能
class ImageSearchDemo {
    constructor() {
        this.searchHistory = [];
        this.maxHistoryItems = 10;
        this.isInitialized = false;
        this.searchPanel = null;
        this.toggleButton = null;
        
        // 防抖函数
        this.debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };
        
        this.init();
        console.log('🔍 图片搜索演示功能已初始化');
    }

    // 初始化搜索界面
    init() {
        if (this.isInitialized) {
            console.warn('搜索功能已经初始化，跳过重复初始化');
            return;
        }
        
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createSearchInterface());
        } else {
            this.createSearchInterface();
        }
    }

    // 创建搜索界面
    createSearchInterface() {
        try {
            // 首先尝试将搜索按钮添加到导航栏
            const nav = document.querySelector('nav');
            if (nav) {
                this.addToNavigation(nav);
            } else {
                // 如果没有导航栏，创建独立搜索
                this.createStandaloneSearch();
            }
            
            this.isInitialized = true;
            this.loadSearchHistory();
        } catch (error) {
            console.error('创建搜索界面失败:', error);
            // 降级到独立搜索
            this.createStandaloneSearch();
        }
    }

    // 添加搜索到导航栏
    addToNavigation(nav) {
        // 查找导航栏右侧区域
        const rightSection = nav.querySelector('.flex.items-center.space-x-4, .ml-auto, .justify-end');
        
        if (!rightSection) {
            console.warn('未找到导航栏右侧区域，使用独立搜索');
            this.createStandaloneSearch();
            return;
        }

        // 创建搜索按钮容器
        const searchContainer = document.createElement('div');
        searchContainer.className = 'relative';
        searchContainer.id = 'image-search-container';
        searchContainer.innerHTML = `
            <button id="toggle-search" class="text-gray-700 hover:text-ocean-blue transition-colors p-2 rounded-lg hover:bg-gray-100" title="图片搜索" type="button">
                <i class="fas fa-search text-lg"></i>
            </button>
        `;

        // 插入到导航栏右侧
        rightSection.parentElement.insertBefore(searchContainer, rightSection);

        // 创建搜索面板（绝对定位在导航栏下方）
        const searchPanel = document.createElement('div');
        searchPanel.id = 'image-search-panel';
        searchPanel.className = 'absolute top-full right-0 mt-2 z-50';
        searchPanel.innerHTML = this.getSearchPanelHTML('nav');
        
        searchContainer.appendChild(searchPanel);
        
        // 保存引用
        this.searchPanel = searchPanel.querySelector('#search-panel');
        this.toggleButton = searchContainer.querySelector('#toggle-search');
        
        // 绑定事件
        this.bindEvents();
    }

    // 创建独立搜索（备用方案）
    createStandaloneSearch() {
        // 移除可能存在的旧搜索容器
        const existingContainer = document.getElementById('image-search-container');
        if (existingContainer) {
            existingContainer.remove();
        }
        
        const searchContainer = document.createElement('div');
        searchContainer.id = 'image-search-container';
        searchContainer.className = 'fixed top-20 right-4 z-40';
        searchContainer.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-4 w-80 transform transition-all duration-300 translate-x-full opacity-0" id="search-panel">
                ${this.getSearchPanelContent()}
            </div>
            
            <!-- 搜索按钮 -->
            <button id="toggle-search" class="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110" title="图片搜索" type="button">
                <i class="fas fa-search"></i>
            </button>
        `;

        document.body.appendChild(searchContainer);
        
        // 保存引用
        this.searchPanel = searchContainer.querySelector('#search-panel');
        this.toggleButton = searchContainer.querySelector('#toggle-search');
        
        // 绑定事件
        this.bindEvents();
    }

    // 获取搜索面板HTML
    getSearchPanelHTML(type = 'standalone') {
        const baseClass = type === 'nav' 
            ? 'bg-white rounded-lg shadow-xl border p-4 w-80 transform transition-all duration-300 scale-95 opacity-0 pointer-events-none'
            : 'bg-white rounded-lg shadow-lg p-4 w-80 transform transition-all duration-300 translate-x-full opacity-0';
            
        return `
            <div class="${baseClass}" id="search-panel">
                ${this.getSearchPanelContent()}
            </div>
        `;
    }

    // 获取搜索面板内容
    getSearchPanelContent() {
        return `
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">图片搜索</h3>
                <button id="close-search" class="text-gray-500 hover:text-gray-700" type="button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="relative mb-4">
                <input type="text" id="search-input"
                       placeholder="搜索霞浦相关图片..."
                       class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <button id="search-btn" class="absolute right-2 top-2 text-blue-500 hover:text-blue-700" type="button">
                    <i class="fas fa-search"></i>
                </button>
            </div>
            
            <div class="mb-4">
                <div class="flex flex-wrap gap-2" id="search-tags">
                    <button class="search-tag px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors" data-query="霞浦滩涂" type="button">
                        霞浦滩涂
                    </button>
                    <button class="search-tag px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors" data-query="海鲜美食" type="button">
                        海鲜美食
                    </button>
                    <button class="search-tag px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200 transition-colors" data-query="渔民劳作" type="button">
                        渔民劳作
                    </button>
                    <button class="search-tag px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors" data-query="日出日落" type="button">
                        日出日落
                    </button>
                </div>
            </div>
            
            <div id="search-results" class="max-h-64 overflow-y-auto hidden">
                <div class="text-gray-500 text-center py-8">
                    <i class="fas fa-search text-2xl mb-2"></i>
                    <p>搜索结果将显示在这里</p>
                </div>
            </div>
            
            <div id="search-history" class="hidden">
                <h4 class="text-sm font-medium text-gray-700 mb-2">搜索历史</h4>
                <div id="history-list" class="space-y-1"></div>
            </div>
        `;
    }
    
    // 绑定事件
    bindEvents() {
        if (!this.toggleButton || !this.searchPanel) {
            console.error('搜索组件未正确初始化');
            return;
        }

        // 防抖的搜索函数
        const debouncedSearch = this.debounce((query) => {
            this.performSearch(query);
        }, 300);

        // 切换搜索面板
        this.toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleSearchPanel();
        });
        
        // 关闭搜索面板
        const closeBtn = this.searchPanel.querySelector('#close-search');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.hideSearchPanel();
            });
        }
        
        // 搜索按钮
        const searchBtn = this.searchPanel.querySelector('#search-btn');
        const searchInput = this.searchPanel.querySelector('#search-input');
        
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    this.performSearch(query);
                }
            });
            
            // 回车搜索和实时搜索
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = e.target.value.trim();
                    if (query) {
                        this.performSearch(query);
                    }
                }
            });

            // 实时搜索（防抖）
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length > 1) {
                    debouncedSearch(query);
                } else {
                    this.clearSearchResults();
                }
            });
        }
        
        // 标签搜索
        const searchTags = this.searchPanel.querySelectorAll('.search-tag');
        searchTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                const query = tag.getAttribute('data-query');
                if (searchInput) {
                    searchInput.value = query;
                }
                this.performSearch(query);
            });
        });
        
        // 点击外部关闭 - 使用更精确的逻辑
        document.addEventListener('click', (e) => {
            const searchContainer = document.getElementById('image-search-container');
            
            // 检查点击是否在搜索容器内
            if (searchContainer && !searchContainer.contains(e.target)) {
                // 检查搜索面板是否可见
                if (this.isSearchPanelVisible()) {
                    this.hideSearchPanel();
                }
            }
        });

        // ESC键关闭搜索面板
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isSearchPanelVisible()) {
                this.hideSearchPanel();
            }
        });
    }

    // 检查搜索面板是否可见
    isSearchPanelVisible() {
        if (!this.searchPanel) return false;
        
        return this.searchPanel.classList.contains('scale-100') || 
               this.searchPanel.classList.contains('translate-x-0') ||
               (this.searchPanel.classList.contains('opacity-100') && 
                !this.searchPanel.classList.contains('pointer-events-none'));
    }
    
    // 切换搜索面板
    toggleSearchPanel() {
        if (this.isSearchPanelVisible()) {
            this.hideSearchPanel();
        } else {
            this.showSearchPanel();
        }
    }
    
    // 显示搜索面板
    showSearchPanel() {
        if (!this.searchPanel) return;
        
        // 检查是否是导航栏集成版本还是独立版本
        if (this.searchPanel.classList.contains('scale-95')) {
            // 导航栏集成版本
            this.searchPanel.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
            this.searchPanel.classList.add('scale-100', 'opacity-100', 'pointer-events-auto');
        } else {
            // 独立版本
            this.searchPanel.classList.remove('translate-x-full', 'opacity-0');
            this.searchPanel.classList.add('translate-x-0', 'opacity-100');
        }
        
        // 聚焦搜索框
        setTimeout(() => {
            const searchInput = this.searchPanel.querySelector('#search-input');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }, 150);
        
        // 显示搜索历史
        this.showSearchHistory();
    }
    
    // 隐藏搜索面板
    hideSearchPanel() {
        if (!this.searchPanel) return;
        
        // 检查是否是导航栏集成版本还是独立版本
        if (this.searchPanel.classList.contains('scale-100')) {
            // 导航栏集成版本
            this.searchPanel.classList.remove('scale-100', 'opacity-100', 'pointer-events-auto');
            this.searchPanel.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
        } else {
            // 独立版本
            this.searchPanel.classList.remove('translate-x-0', 'opacity-100');
            this.searchPanel.classList.add('translate-x-full', 'opacity-0');
        }
    }

    // 清空搜索结果
    clearSearchResults() {
        const resultsContainer = this.searchPanel?.querySelector('#search-results');
        if (resultsContainer) {
            resultsContainer.classList.add('hidden');
            resultsContainer.innerHTML = `
                <div class="text-gray-500 text-center py-8">
                    <i class="fas fa-search text-2xl mb-2"></i>
                    <p>搜索结果将显示在这里</p>
                </div>
            `;
        }
    }
    
    // 执行搜索
    async performSearch(query) {
        if (!query || !this.searchPanel) return;
        
        const resultsContainer = this.searchPanel.querySelector('#search-results');
        const historyContainer = this.searchPanel.querySelector('#search-history');
        
        if (!resultsContainer) return;
        
        // 显示加载状态
        resultsContainer.classList.remove('hidden');
        resultsContainer.innerHTML = `
            <div class="text-center py-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p class="text-gray-500">正在搜索 "${query}"...</p>
            </div>
        `;
        
        // 隐藏搜索历史
        if (historyContainer) {
            historyContainer.classList.add('hidden');
        }
        
        try {
            // 模拟搜索API调用
            const results = await this.searchImages(query);
            
            if (results && results.length > 0) {
                this.displaySearchResults(results, query);
                this.addToSearchHistory(query);
            } else {
                this.displayNoResults();
            }
        } catch (error) {
            console.error('搜索失败:', error);
            this.displaySearchError();
        }
    }
    
    // 搜索图片（模拟API）
    async searchImages(query) {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
        
        // 模拟搜索结果
        const mockResults = [
            {
                id: 1,
                url: 'https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/43557910-28c6-49b9-9f40-77c6b1b3a552/image_1754559652_1_1.jpg',
                title: '霞浦滩涂日出',
                description: '金色阳光洒向滩涂，渔民劳作的美丽剪影',
                tags: ['滩涂', '日出', '摄影']
            },
            {
                id: 2,
                url: 'https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/e053fa41-2028-48ce-ab11-10f8102317c3/image_1754618396_1_1.jpg',
                title: '霞浦海鲜盛宴',
                description: '新鲜海鲜，地道做法，味蕾的极致享受',
                tags: ['海鲜', '美食', '霞浦']
            },
            {
                id: 3,
                url: 'https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/43557910-28c6-49b9-9f40-77c6b1b3a552/image_1754559652_2_1.jpg',
                title: '渔民劳作场景',
                description: '勤劳的渔民在滩涂上劳作，展现生活的美好',
                tags: ['渔民', '劳作', '生活']
            }
        ];
        
        // 根据查询词过滤结果
        const filteredResults = mockResults.filter(item => 
            item.title.includes(query) || 
            item.description.includes(query) ||
            item.tags.some(tag => tag.includes(query)) ||
            query.includes('霞浦') || query.includes('滩涂') || 
            query.includes('海鲜') || query.includes('渔民')
        );
        
        // 如果没有匹配结果，返回默认结果
        return filteredResults.length > 0 ? filteredResults : mockResults.slice(0, 2);
    }
    
    // 显示搜索结果
    displaySearchResults(images, query) {
        const resultsContainer = this.searchPanel?.querySelector('#search-results');
        if (!resultsContainer) return;
        
        resultsContainer.classList.remove('hidden');
        resultsContainer.innerHTML = `
            <div class="mb-3">
                <h4 class="text-sm font-medium text-gray-700">搜索结果 (${images.length})</h4>
            </div>
            <div class="space-y-3">
                ${images.map(image => `
                    <div class="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" 
                         onclick="imageSearchDemo.useSearchResult('${image.url}', '${image.title}', '${query}')">
                        <img src="${image.url}" alt="${image.title}" 
                             class="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjI4IiBjeT0iMjgiIHI9IjMiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwIDM2TDI4IDI4TDM2IDM2TDQ0IDI4VjQ0SDIwVjM2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'">
                        <div class="flex-1 min-w-0">
                            <h5 class="text-sm font-medium text-gray-900 truncate">${image.title}</h5>
                            <p class="text-xs text-gray-500 mt-1 line-clamp-2">${image.description}</p>
                            <div class="flex flex-wrap gap-1 mt-2">
                                ${image.tags.map(tag => `
                                    <span class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">${tag}</span>
                                `).join('')}
                            </div>
                        </div>
                        <button class="text-blue-500 hover:text-blue-700 p-1" title="使用此图片">
                            <i class="fas fa-plus text-sm"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
            <div class="mt-4 pt-3 border-t border-gray-200">
                <button onclick="imageSearchDemo.replacePageImages('${query}')" 
                        class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                    用搜索结果替换页面图片
                </button>
            </div>
        `;
    }
    
    // 显示无结果
    displayNoResults() {
        const resultsContainer = this.searchPanel?.querySelector('#search-results');
        if (!resultsContainer) return;
        
        resultsContainer.classList.remove('hidden');
        resultsContainer.innerHTML = `
            <div class="text-gray-500 text-center py-8">
                <i class="fas fa-search text-2xl mb-2"></i>
                <p>未找到相关图片</p>
                <p class="text-sm mt-1">尝试其他关键词</p>
            </div>
        `;
    }
    
    // 显示搜索错误
    displaySearchError() {
        const resultsContainer = this.searchPanel?.querySelector('#search-results');
        if (!resultsContainer) return;
        
        resultsContainer.classList.remove('hidden');
        resultsContainer.innerHTML = `
            <div class="text-red-500 text-center py-8">
                <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                <p>搜索失败</p>
                <p class="text-sm mt-1">请稍后重试</p>
            </div>
        `;
    }
    
    // 使用搜索结果
    useSearchResult(imageUrl, title, query) {
        // 这里可以实现将选中的图片应用到页面的逻辑
        console.log('使用搜索结果:', { imageUrl, title, query });
        
        // 显示通知
        this.showNotification(`已选择图片: ${title}`, 'success');
        
        // 可以在这里添加更多逻辑，比如替换页面中的某个图片
        // 例如：替换第一个找到的图片
        const firstImage = document.querySelector('img[src*="zhiyan-ai-agent"]');
        if (firstImage) {
            firstImage.src = imageUrl;
            firstImage.alt = title;
            this.showNotification(`已更新页面图片: ${title}`, 'success');
        }
        
        // 关闭搜索面板
        this.hideSearchPanel();
    }
    
    // 用搜索结果替换页面图片
    replacePageImages(query) {
        this.showNotification(`正在用 "${query}" 搜索结果更新页面图片...`, 'info');
        
        // 这里可以实现批量替换页面图片的逻辑
        // 例如：找到所有相关图片并替换
        const images = document.querySelectorAll('img[src*="zhiyan-ai-agent"]');
        let replacedCount = 0;
        
        images.forEach((img, index) => {
            // 模拟替换逻辑
            if (index < 3) { // 只替换前3张图片
                setTimeout(() => {
                    // 这里应该使用实际的搜索结果
                    img.style.opacity = '0.5';
                    setTimeout(() => {
                        img.style.opacity = '1';
                        replacedCount++;
                        if (replacedCount === Math.min(images.length, 3)) {
                            this.showNotification(`已更新 ${replacedCount} 张图片`, 'success');
                        }
                    }, 300);
                }, index * 200);
            }
        });
        
        // 关闭搜索面板
        this.hideSearchPanel();
    }
    
    // 添加到搜索历史
    addToSearchHistory(query) {
        if (!query) return;
        
        // 移除重复项并添加到开头
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        this.searchHistory.unshift(query);
        
        // 限制历史记录数量
        if (this.searchHistory.length > this.maxHistoryItems) {
            this.searchHistory = this.searchHistory.slice(0, this.maxHistoryItems);
        }
        
        // 保存到本地存储
        try {
            localStorage.setItem('imageSearchHistory', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.warn('无法保存搜索历史:', error);
        }
    }
    
    // 显示搜索历史
    showSearchHistory() {
        const historyContainer = this.searchPanel?.querySelector('#search-history');
        const historyList = this.searchPanel?.querySelector('#history-list');
        
        if (!historyContainer || !historyList) return;
        
        // 加载搜索历史
        this.loadSearchHistory();
        
        if (this.searchHistory.length > 0) {
            historyList.innerHTML = this.searchHistory.map(query => `
                <button class="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        onclick="document.getElementById('search-input').value='${query}'; imageSearchDemo.performSearch('${query}')">
                    <i class="fas fa-history text-xs mr-2"></i>${query}
                </button>
            `).join('');
            historyContainer.classList.remove('hidden');
        } else {
            historyContainer.classList.add('hidden');
        }
    }
    
    // 加载搜索历史
    loadSearchHistory() {
        try {
            const savedHistory = localStorage.getItem('imageSearchHistory');
            if (savedHistory) {
                this.searchHistory = JSON.parse(savedHistory);
            }
        } catch (error) {
            console.warn('无法加载搜索历史:', error);
            this.searchHistory = [];
        }
    }
    
    // 显示通知
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full opacity-0`;
        
        // 根据类型设置样式
        switch (type) {
            case 'success':
                notification.classList.add('bg-green-500', 'text-white');
                break;
            case 'error':
                notification.classList.add('bg-red-500', 'text-white');
                break;
            case 'warning':
                notification.classList.add('bg-yellow-500', 'text-white');
                break;
            default:
                notification.classList.add('bg-blue-500', 'text-white');
        }
        
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : type === 'warning' ? 'exclamation' : 'info'}-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.classList.remove('translate-x-full', 'opacity-0');
            notification.classList.add('translate-x-0', 'opacity-100');
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.classList.remove('translate-x-0', 'opacity-100');
            notification.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // 清理资源
    destroy() {
        const searchContainer = document.getElementById('image-search-container');
        if (searchContainer) {
            searchContainer.remove();
        }
        console.log('🔍 图片搜索演示功能已清理');
    }
}

// 全局实例
let imageSearchDemo;

// 页面加载完成后初始化 - 已禁用以避免与主搜索功能冲突
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', () => {
//         imageSearchDemo = new ImageSearchDemo();
//     });
// } else {
//     imageSearchDemo = new ImageSearchDemo();
// }

console.log('🔍 图片搜索演示模块已加载');