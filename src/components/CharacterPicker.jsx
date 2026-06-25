import { characterClasses } from '../data/characterClasses'
import PixelButton from './PixelButton'

function CharacterPicker({ selectedClass, onSelect }) {
  return (
    <div className="picker-grid picker-grid--characters">
      {characterClasses.map((characterClass) => {
        const isSelected = selectedClass === characterClass.id

        return (
          <article className="choice-card" key={characterClass.id}>
            <div className="choice-card__header">
              <span className="choice-card__icon" aria-hidden="true">
                {characterClass.icon}
              </span>
              <div>
                <h3>{characterClass.name}</h3>
                {isSelected && (
                  <span className="selected-badge">currently selected</span>
                )}
              </div>
            </div>
            <p>{characterClass.description}</p>
            <dl className="stat-list">
              {Object.entries(characterClass.stats).map(([label, value]) => (
                <div className="stat-row" key={label}>
                  <dt>{label}</dt>
                  <dd>
                    <span className="stat-row__bar" aria-hidden="true">
                      <span style={{ width: `${value * 10}%` }} />
                    </span>
                    <span>{value}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <PixelButton
              className="choice-card__action"
              onClick={() => onSelect(characterClass.id)}
              variant={isSelected ? 'secondary' : 'primary'}
            >
              {isSelected ? 'Keep class' : 'Select class'}
            </PixelButton>
          </article>
        )
      })}
    </div>
  )
}

export default CharacterPicker
