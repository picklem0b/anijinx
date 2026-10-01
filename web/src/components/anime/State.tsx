export function ErrorState({ text }: { text: string }) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-6 text-center">
      <div>
        <p className="text-lg font-semibold">Couldn’t load this</p>
        <p className="mt-1 text-sm text-white/50">{text}</p>
        <button onClick={() => window.location.reload()} className="mt-4 rounded-full bg-violet-500 px-5 py-2 text-sm font-semibold">
          Try again
        </button>
      </div>
    </div>
  )
}
