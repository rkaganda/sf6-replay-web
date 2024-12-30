import CFNReplayList from "./components/CFNReplay/CFNReplayList";


export default function Home() {
  return (
    <div className="grid items-center justify-items-center p-8 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="items-center w-1/2">
        <div>
            <CFNReplayList/>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
