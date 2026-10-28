/** Runs before paint so `dark` class matches next-themes / localStorage (avoids banner flash). */
export function ThemeInitScript() {
  const script = `(function(){try{var k='theme';var t=localStorage.getItem(k);var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var el=document.documentElement;if(t==='dark'||(t==='system'&&d)||(!t&&d))el.classList.add('dark');else if(t==='light')el.classList.remove('dark');}catch(e){}})();`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
