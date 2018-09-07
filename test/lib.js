const getYYMMDD = (date) {
  const d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

const getToday = () => {
	return getYYMMDD(new Date())
}

const getTomorrow = () => {
	return getYYMMDD(new Date().getTime() + 24 * 3600 * 1000)
}
