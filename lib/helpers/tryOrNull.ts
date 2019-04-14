const tryOrNull = (cb: () => any) => {
  try {
    return cb()    
  } catch (e) {
    return null
  }
}