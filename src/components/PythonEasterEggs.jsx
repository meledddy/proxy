const easterEggs = [
  {
    id: 'window',
    label: 'Hidden Python-headed helper near the window',
    message: 'Tiny Python Helper Found',
  },
  {
    id: 'floor',
    label: 'Hidden Python-headed helper near the floor',
    message: 'Python Sidekick Spotted',
  },
  {
    id: 'artifact',
    label: 'Hidden Python-headed helper near the artifact corner',
    message: 'Secret Dev Friend Found',
  },
]

function PythonPerson() {
  return (
    <span className="python-person" aria-hidden="true">
      <span className="python-head">
        <span className="python-head__part python-head__part--top" />
        <span className="python-head__part python-head__part--bottom" />
      </span>
      <span className="python-person__body">
        <span className="python-person__arm python-person__arm--left" />
        <span className="python-person__arm python-person__arm--right" />
        <span className="python-person__leg python-person__leg--left" />
        <span className="python-person__leg python-person__leg--right" />
      </span>
    </span>
  )
}

function PythonEasterEggs({ onFound }) {
  return (
    <div className="python-easter-eggs" aria-label="Hidden site easter eggs">
      {easterEggs.map((egg) => (
        <button
          aria-label={egg.label}
          className={`python-egg python-egg--${egg.id}`}
          key={egg.id}
          onClick={() => onFound(egg.message)}
          title="Tiny Python-ish helper"
          type="button"
        >
          <PythonPerson />
        </button>
      ))}
    </div>
  )
}

export default PythonEasterEggs
