import { useForm, type SubmitHandler } from 'react-hook-form'
import { useUser } from '../contexts/UserContext'
import { useEffect, useState } from 'react'

type LoginFormProps = {
  onSuccess: () => void
}

function LoginForm({ onSuccess }: LoginFormProps) {

  // react-hook-form setup for managing form state and validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({ defaultValues: { userName: "", password: "" } })

  const { users, actions } = useUser()
  const [formError, setFormError] = useState<string>("")
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  // Reset form fields and errors after submission
  useEffect(() => {
    if (isSubmitted) {
      reset({ userName: "", password: "" })
    }
    setIsSubmitted(false)
    setFormError("")
  }, [isSubmitted, reset])

  // Function called when form is submitted
  const onSubmit: SubmitHandler<User> = (data: User) => {
    // Check if a user exists with the entered username
    const existingUser = users.find((u) => u.userName == data.userName.trim())

    if (!existingUser) {
      setFormError("Användaren kunde inte hittas")
      return
    }

    // Check if password matches
    if (existingUser.password == data.password.trim()) {
      actions.setUser(existingUser)
      setIsSubmitted(true)
      onSuccess()
    } else {
      setFormError("Fel lösenord")
    }

    return
  }

  return (
    <div className="w-full max-w-xs">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>

        {/* Username input */}
        <div className="mb-4">
          <label className="block mb-2" >Användarnamn: </label>
          <input className='border' {...register("userName", { required: true })} />
          {errors.userName && errors.userName.type === "required" && <p className="text-red-500 text-xs italic mt-1">Vänligen ange ett användarnamn</p>}
        </div>

        {/* Password input */}
        <div className="mb-6">
          <label className="block mb-2">Lösenord: </label>
          <input type='password' className='border' id='password' {...register("password", { required: true })} />
          {errors.password && errors.password.type === "required" && <p className="text-red-500 text-xs italic mt-1">Vänligen ange ett lösenord</p>}
        </div>

        {/* Form error message */}
        <div>
          {formError && <p className="text-red-500 text-sm italic mb-3">{formError}</p>}
        </div>

        {/* Submit button */}
        <div>
          <input
            type="submit"
            value="Logga in"
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
      </form>
    </div>
  )
}

export default LoginForm
