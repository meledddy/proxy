import PixelButton from './PixelButton'

function StartScreen({ onStart }) {
  return (
    <section className="start-screen" aria-labelledby="start-title">
      <div className="start-screen__frame">
        <div className="mini-room" aria-hidden="true">
          <span className="mini-room__star mini-room__star--one">*</span>
          <span className="mini-room__star mini-room__star--two">+</span>
          <span className="mini-room__console">[]</span>
          <span className="mini-room__headphones">))</span>
          <span className="mini-room__book">/_</span>
          <span className="mini-room__pixel">#</span>
        </div>

        <p className="eyebrow">tiny creative side quest</p>
        <h1 id="start-title">Side Quest</h1>
        <p className="start-screen__subtitle">
          A small quest for a person with excellent creative taste.
        </p>
        <p className="start-screen__body">
          Collect a few tiny mood fragments, unlock a designer artifact, and
          maybe leave with a better mood.
        </p>
        <PixelButton onClick={onStart}>Start the quest</PixelButton>
        <p className="start-screen__note">
          No pressure. No login. Just a tiny interactive thing.
        </p>
      </div>
    </section>
  )
}

export default StartScreen
