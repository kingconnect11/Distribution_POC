const HomeButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2 font-semibold no-print"
      aria-label="Return to home"
    >
      <span className="text-lg">🏠</span>
      <span>Home</span>
    </button>
  );
};

export default HomeButton;
