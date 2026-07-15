export default function Footer() {
  return (
    <footer className="sticky bottom-0 mt-auto border-t bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
        <p>© 2026 Dev Hiring Board. All rights reserved.</p>

        <div className="flex gap-4 mt-2 sm:mt-0">
          <a href="#" className="hover:text-indigo-600">
            About
          </a>
          <a href="#" className="hover:text-indigo-600">
            Contact
          </a>
          <a href="#" className="hover:text-indigo-600">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}