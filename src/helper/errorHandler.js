import swal from 'sweetalert'
import { logout } from '../App';

export const handleErrors = (component, error) => {
  if (error instanceof Error && error.response) {
    swal("", error.response.data.message || "Unknown error occured", "error")
      .then(() => {
        if (error.response.status === 401) {
          logout()
        }
      })
  } else {
    swal("", error.message, "error")
      .then(() => component.refs[error.key] && component.refs[error.key].focus())
  }
}