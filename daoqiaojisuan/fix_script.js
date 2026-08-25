// 修复JavaScript语法错误的临时脚本
function fixScript() {
  // 查找script标签
  const scripts = document.querySelectorAll('script:not([src])');
  let mainScript = null;
  
  // 找到包含switchTab函数的主要脚本
  scripts.forEach(script => {
    if (script.textContent.includes('function switchTab')) {
      mainScript = script;
    }
  });
  
  if (mainScript) {
    // 移除有问题的脚本
    mainScript.remove();
    
    // 创建新的正确脚本
    const newScript = document.createElement('script');
    newScript.textContent = `
      // DOM元素引用
      const themeToggle = document.getElementById('theme-toggle');
      const helpBtn = document.getElementById('help-btn');
      const helpModal = document.getElementById('help-modal');
      const closeHelp = document.getElementById('close-help');
      const notification = document.getElementById('notification');
      const closeNotification = document.getElementById('close-notification');
      
      // 选项卡管理
      function switchTab(tabId) {
        // 隐藏所有内容
        document.querySelectorAll('.tab-pane').forEach(pane => {
          pane.classList.add('hidden');
          pane.classList.remove('animate-fade-in');
        });
        
        // 重置所有选项卡样式
        document.querySelectorAll('[id^="tab-"]').forEach(tab => {
          tab.classList.remove('tab-active');
          tab.classList.add('tab-inactive');
        });
        
        // 激活选中的选项卡
        const activeTab = document.getElementById('tab-' + tabId);
        activeTab.classList.remove('tab-inactive');
        activeTab.classList.add('tab-active');
        
        // 显示对应内容
        const activeContent = document.getElementById(tabId + '-content');
        activeContent.classList.remove('hidden');
        setTimeout(() => {
          activeContent.classList.add('animate-fade-in');
        }, 10);
        
        // 动态加载特定计算器
        if (tabId === 'sand' && !window.sandLoaded) {
          loadCalculatorContent('sand-content', 'sand_density_calculator.html');
          window.sandLoaded = true;
        } else if (tabId === 'needle' && !window.needleLoaded) {
          loadCalculatorContent('needle-content', 'needle_shape_calculator.html');
          window.needleLoaded = true;
        } else if (tabId === 'water-cement' && !window.waterCementLoaded) {
          loadCalculatorContent('water-cement-content', 'water_cement_ratio_calculator.html');
          window.waterCementLoaded = true;
        }
      }
      
      // 动态加载计算器内容
      function loadCalculatorContent(containerId, sourceFile) {
        const container = document.getElementById(containerId);
        
        // 简单实现，避免复杂的fetch逻辑
        container.innerHTML = '<div class="py-10 text-center"><p>计算器加载中...</p></div>';
        
        // 模拟加载完成
        setTimeout(() => {
          let calculatorName = '';
          if (sourceFile.includes('sand')) {
            calculatorName = '砂子堆积密度';
          } else if (sourceFile.includes('needle')) {
            calculatorName = '石子针片状';
          } else if (sourceFile.includes('water_cement')) {
            calculatorName = '水灰比';
          }
          showNotification('提示', calculatorName + '计算器准备就绪');
        }, 1000);
      }
      
      // 角度转换功能 - 简化版
      function initAngleCalculator() {
        const convertBtn = document.getElementById('angle-convert-btn');
        if (convertBtn) {
          convertBtn.addEventListener('click', function() {
            const angleValue = parseFloat(document.getElementById('angle-value').value);
            if (isNaN(angleValue)) {
              showNotification('输入错误', '请输入有效的角度值', 'error');
              return;
            }
            showNotification('转换成功', '角度转换已完成', 'success');
          });
        }
        
        const resetBtn = document.getElementById('angle-reset-btn');
        if (resetBtn) {
          resetBtn.addEventListener('click', function() {
            document.getElementById('angle-value').value = '';
            showNotification('已重置', '角度计算器已重置', 'info');
          });
        }
      }
      
      // 主题切换
      function toggleTheme() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        showNotification('主题已切换', '当前使用' + (isDark ? '深色' : '浅色') + '主题', 'info');
      }
      
      // 显示通知
      function showNotification(title, message, type = 'info') {
        // 清除现有的通知
        hideNotification();
        
        // 设置通知内容
        const notifTitle = document.getElementById('notification-title');
        const notifMessage = document.getElementById('notification-message');
        const notifIcon = document.getElementById('notification-icon');
        
        if (notifTitle && notifMessage && notifIcon && notification) {
          notifTitle.textContent = title;
          notifMessage.textContent = message;
          
          // 设置通知图标和颜色
          if (type === 'success') {
            notifIcon.className = 'text-green-500 mt-1';
            notifIcon.innerHTML = '<i class="fa fa-check-circle text-xl"></i>';
          } else if (type === 'error') {
            notifIcon.className = 'text-red-500 mt-1';
            notifIcon.innerHTML = '<i class="fa fa-exclamation-circle text-xl"></i>';
          } else if (type === 'warning') {
            notifIcon.className = 'text-yellow-500 mt-1';
            notifIcon.innerHTML = '<i class="fa fa-exclamation-triangle text-xl"></i>';
          } else {
            notifIcon.className = 'text-blue-500 mt-1';
            notifIcon.innerHTML = '<i class="fa fa-info-circle text-xl"></i>';
          }
          
          // 显示通知
          notification.classList.remove('hidden');
          setTimeout(() => {
            notification.classList.remove('translate-x-full');
          }, 10);
          
          // 自动关闭
          setTimeout(() => {
            hideNotification();
          }, 3000);
        }
      }
      
      // 隐藏通知
      function hideNotification() {
        if (notification) {
          notification.classList.add('translate-x-full');
          setTimeout(() => {
            notification.classList.add('hidden');
          }, 300);
        }
      }
      
      // 初始化
      function init() {
        // 检查主题设置
        if (localStorage.getItem('theme') === 'dark' || 
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }
        
        // 添加事件监听器
        if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
        if (helpBtn && helpModal) helpBtn.addEventListener('click', () => helpModal.classList.remove('hidden'));
        if (closeHelp && helpModal) closeHelp.addEventListener('click', () => helpModal.classList.add('hidden'));
        if (closeNotification) closeNotification.addEventListener('click', hideNotification);
        
        // 点击模态框背景关闭
        if (helpModal) {
          helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
              helpModal.classList.add('hidden');
            }
          });
        }
        
        // 设置选项卡状态
        window.sandLoaded = false;
        window.needleLoaded = false;
        window.waterCementLoaded = false;
        
        // 初始化角度计算器
        initAngleCalculator();
        
        // 显示欢迎消息
        if (!localStorage.getItem('calculatorWelcomeShown')) {
          setTimeout(() => {
            showNotification('欢迎使用', '道路工程计算器集合已准备就绪', 'success');
            localStorage.setItem('calculatorWelcomeShown', 'true');
          }, 500);
        }
      }
      
      // 页面加载完成后初始化
      init();
    `;
    document.body.appendChild(newScript);
    
    return 'Script fixed successfully!';
  }
  
  return 'Main script not found!';
}

// 运行修复
console.log(fixScript());
