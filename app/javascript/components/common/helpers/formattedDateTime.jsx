
export const formattedDateTime = (d = '') => {
  return (d ? new Date(d).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric',
  }) : '')
}
