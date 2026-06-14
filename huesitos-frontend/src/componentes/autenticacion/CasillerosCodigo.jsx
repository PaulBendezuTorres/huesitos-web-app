import { useRef, useEffect } from 'react';

const CasillerosCodigo = ({
  codigo,
  setCodigo,
  timeLeft = 900,
  loading = false,
  idPrefix = 'code-input'
}) => {
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Deshabilitado si el código expiró o si está cargando
  const estaDeshabilitado = timeLeft <= 0 || loading;

  const handleInputChange = (index, value) => {
    // Solo permitir números
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) {
      const newCodigo = [...codigo];
      newCodigo[index] = '';
      setCodigo(newCodigo);
      return;
    }

    const digit = cleanValue.slice(-1);
    const newCodigo = [...codigo];
    newCodigo[index] = digit;
    setCodigo(newCodigo);

    // Mover foco al siguiente input si existe y se ingresó un dígito
    if (index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Mover foco atrás si presiona backspace en un campo vacío
    if (e.key === 'Backspace' && !codigo[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newCodigo = [...codigo];
      for (let i = 0; i < 6; i++) {
        if (pastedData[i]) {
          newCodigo[i] = pastedData[i];
        }
      }
      setCodigo(newCodigo);
      
      // Enfocar el último input rellenado o el 5
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs[focusIndex].current.focus();
    }
  };

  return (
    <div className="flex justify-between gap-1.5 sm:gap-2">
      {codigo.map((digit, idx) => (
        <input
          key={idx}
          id={`${idPrefix}-${idx}`}
          ref={inputRefs[idx]}
          type="text"
          maxLength={1}
          inputMode="numeric"
          pattern="[0-9]*"
          value={digit}
          onChange={(e) => handleInputChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={idx === 0 ? handlePaste : undefined}
          disabled={estaDeshabilitado}
          className="w-9 h-11 sm:w-10 sm:h-12 text-center text-base sm:text-lg font-bold rounded-xl border 
            border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 
            focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-950/30 focus:border-sky-400 dark:focus:border-sky-500 
            outline-none transition-all disabled:opacity-60"
        />
      ))}
    </div>
  );
};

export default CasillerosCodigo;
