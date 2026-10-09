import { Terminal, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-obsidian py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-500 font-mono text-sm">
            © {new Date().getFullYear()} SynthMesh Interactive. All rights reserved.
          </p>
          <p className="text-gray-600 font-mono text-xs mt-1">
            Powered by Cloudflare Edge & WebRTC.
          </p>
        </div>
        
        <div className="flex space-x-6">
          <a 
            href="https://github.com/synthmesh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
          >
            <Terminal size={18} />
            <span className="font-mono text-sm">Source</span>
          </a>
          <a 
            href="/docs" 
            className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
          >
            <FileText size={18} />
            <span className="font-mono text-sm">Docs</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
