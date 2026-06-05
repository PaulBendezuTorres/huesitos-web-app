const Etiqueta = ({ children, text, color = "slate" }) => {
  const colors = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    verde: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amarillo: "bg-amber-50 text-amber-700 border-amber-200",
    azul: "bg-sky-50 text-sky-700 border-sky-200",
  };

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      {children || text}
    </span>
  );
};

export default Etiqueta;