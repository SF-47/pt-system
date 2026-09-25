type ExerciseChanges = {
  name: string;
  description: string;
  sets: number;
  reps: number;
  restSeconds: number;
};

type ExerciseFieldsProps = {
  idPrefix: string;
  values: Omit<ExerciseChanges, "description"> & { description: string | null };
  onChange: (changes: Partial<ExerciseChanges>) => void;
  showPlaceholders?: boolean;
};

const labelClass = "mb-1 block text-xs font-medium text-muted";
const inputClass =
  "min-h-11 w-full rounded-md border border-input-border bg-surface px-3 py-2 text-foreground transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

export default function ExerciseFields({
  idPrefix,
  values,
  onChange,
  showPlaceholders = false,
}: ExerciseFieldsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor={`${idPrefix}-name`} className={labelClass}>
          Exercise Name
        </label>
        <input
          id={`${idPrefix}-name`}
          name="name"
          required
          minLength={2}
          maxLength={100}
          value={values.name}
          onChange={(event) => onChange({ name: event.target.value })}
          placeholder={showPlaceholders ? "Example: Bench Press" : undefined}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-description`} className={labelClass}>
          Description
        </label>
        <input
          id={`${idPrefix}-description`}
          name="description"
          maxLength={500}
          value={values.description ?? ""}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder={showPlaceholders ? "Optional instructions" : undefined}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 sm:col-span-2">
        <div>
          <label htmlFor={`${idPrefix}-sets`} className={labelClass}>
            Sets
          </label>
          <input
            id={`${idPrefix}-sets`}
            name="sets"
            type="number"
            required
            min={1}
            max={100}
            value={values.sets}
            onChange={(event) => onChange({ sets: Number(event.target.value) })}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-reps`} className={labelClass}>
            Reps
          </label>
          <input
            id={`${idPrefix}-reps`}
            name="reps"
            type="number"
            required
            min={1}
            max={1000}
            value={values.reps}
            onChange={(event) => onChange({ reps: Number(event.target.value) })}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-rest`} className={labelClass}>
            Rest seconds
          </label>
          <input
            id={`${idPrefix}-rest`}
            name="restSeconds"
            type="number"
            required
            min={0}
            max={3600}
            value={values.restSeconds}
            onChange={(event) =>
              onChange({ restSeconds: Number(event.target.value) })
            }
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
