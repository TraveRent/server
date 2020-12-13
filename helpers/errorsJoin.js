module.exports = (errorsObj) => {
  let arrErrors = []
  Object.values(errorsObj)
    .forEach(({ properties }) => {
      if(properties) arrErrors.push(properties.message)
    })

  if(!arrErrors.length > 0) arrErrors.push('Please double check your input and try again...')
  return arrErrors.join(', ')
}
