// composables/useGitHubStars.js
import { ref, onMounted } from 'vue';

export function useGitHubStars() {
  // 存储各仓库的star数
  const starCounts = ref({});
  
  // 从GitHub URL提取仓库标识（owner/repo）
  const getRepoKey = (url) => {
    if (!url || !url.includes('github.com')) return null;
    
    // 匹配 github.com/owner/repo 格式
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    return match ? `${match[1]}/${match[2]}` : null;
  };
  
  // 获取GitHub仓库的star数
  const fetchStars = async (repoKey) => {
    if (!repoKey || starCounts.value[repoKey]) return;
    
    try {
      starCounts.value[repoKey] = 'loading';
      
      // 使用GitHub API获取仓库信息
      const response = await fetch(`https://api.github.com/repos/${repoKey}`);
      
      if (!response.ok) {
        throw new Error(`GitHub API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      starCounts.value[repoKey] = data.stargazers_count;
      
    } catch (error) {
      console.error(`Failed to fetch stars for ${repoKey}:`, error);
      starCounts.value[repoKey] = 'error';
    }
  };
  
  // 批量获取多个仓库的star数
  const fetchStarsForRepos = (urls) => {
    const repoKeys = urls.map(url => getRepoKey(url)).filter(Boolean);
    repoKeys.forEach(repoKey => fetchStars(repoKey));
  };
  
  return {
    starCounts,
    getRepoKey,
    fetchStars,
    fetchStarsForRepos
  };
}