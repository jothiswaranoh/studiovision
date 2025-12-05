export default function Canvas() {
  return (
    <div className="flex-1 bg-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="w-full h-full min-h-[400px] border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
          <div>
            <div className="text-gray-400 text-sm mb-2">Visual Canvas</div>
            <div className="text-gray-500 text-xs">Drag blocks here to build your program</div>
          </div>
        </div>
      </div>
    </div>
  );
}
