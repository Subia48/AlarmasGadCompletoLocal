module.exports = function formatearTelefono(numero) {
  if (!numero) return null;

  // quitar espacios y guiones
  let limpio = numero.replace(/[\s-]/g, "");

  // ya viene internacional
  if (limpio.startsWith("+")) {
    return limpio;
  }

  // Ecuador: 0xxxxxxxxx → +593xxxxxxxxx
  if (limpio.startsWith("0")) {
    return "+593" + limpio.slice(1);
  }

  // Ecuador sin 0: 9xxxxxxxx → +5939xxxxxxxx
  if (limpio.startsWith("9")) {
    return "+593" + limpio;
  }

  // fallback
  return limpio;
};
