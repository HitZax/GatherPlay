export default function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 GatherPlay - Open source social deduction games
          </div>
          
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/HitZax/GatherPlay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              GitHub
            </a>
            <button
              onClick={() => window.open('https://ko-fi.com/gatherplay', '_blank')}
              className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              ☕ Donate
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
