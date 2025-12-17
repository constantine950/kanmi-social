export default function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div
        className="
          w-6 h-6 
          border-2 border-stone-700 
          border-t-white 
          rounded-full 
          animate-spin
        "
      />
    </div>
  );
}
