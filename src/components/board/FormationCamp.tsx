type FormationCampProps = {
  active?: boolean;
};

export function FormationCamp({ active = false }: FormationCampProps) {
  if (!active) return null;

  return (
    <span className="formation-camp" aria-hidden="true">
      <span className="formation-camp__banner" />
      <span className="formation-camp__crate" />
      <span className="formation-camp__ember" />
    </span>
  );
}
