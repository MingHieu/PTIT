import { createSignal, onMount } from 'solid-js';

const titleCache = new Map(); // In-memory cache for fetched titles

function UrlWithTitle({ url }) {
  const [title, setTitle] = createSignal('Đang tải...');

  onMount(() => {
    if (!url) return;

    if (titleCache.has(url)) {
      setTitle(titleCache.get(url));
      return;
    }

    fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
      .then(response => response.json())
      .then(data => {
        const temp = document.createElement('div');
        temp.innerHTML = data.contents.replace(/<script/g, '<meta');
        const fetchedTitle =
          temp.querySelector('title')?.innerText || 'Không có tiêu đề';

        titleCache.set(url, fetchedTitle);
        setTitle(fetchedTitle);
      })
      .catch(() => setTitle('Lỗi khi tải tiêu đề'));
  });

  return (
    <div class="w-fit flex flex-col items-center space-y-2 cursor-pointer">
      <a
        href={url}
        class="flex flex-col items-center space-y-2"
        target="_blank">
        <div class="flex items-center justify-center border rounded-lg w-16 h-16 p-3">
          <img
            src="/images/ic-url.png"
            alt="Biểu tượng URL"
            class="w-full h-full object-contain"
          />
        </div>
        <div class="font-semibold text-center text-xs max-w-20 overflow-hidden text-ellipsis line-clamp-2">
          {title()}
        </div>
      </a>
    </div>
  );
}

export default UrlWithTitle;
