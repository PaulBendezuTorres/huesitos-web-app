import logo from '../assets/Logo Huesitos.png';

const AuthLeftPanel = ({
  badgeIcon,
  badgeText,
  titleMain,
  titleHighlight,
  description,
  chips = []
}) => {
  return (
    <div className="auth-left-panel">
      <div className="absolute inset-0 bg-slate-950/60 z-0" />

      {/* Marca / Logo */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-cyan-300 rounded-xl flex items-center justify-center text-white shadow-md shadow-sky-500/15">
          <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">Vet. Huesitos</span>
      </div>

      {/* Contenido centrado */}
      <div className="relative z-10 flex-1 flex flex-col justify-center space-y-6 my-auto py-8">
        <div className="inline-flex items-center gap-2 bg-sky-500/15 border border-sky-400/20 rounded-full px-3.5 py-1 text-sky-300 self-start">
          <span className="text-sm">{badgeIcon}</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase">{badgeText}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">
          {titleMain} <span className="text-sky-300">{titleHighlight}</span>
        </h2>
        <p className="text-xs leading-relaxed max-w-xs text-slate-300">
          {description}
        </p>
        
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {chips.map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[11px] text-slate-200 font-medium"
              >
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLeftPanel;
