import { useForm, type SubmitHandler } from 'react-hook-form'
import { useUser } from '../contexts/UserContext'
import { useEffect, useState } from 'react'

type RegisterFormProps = {
  onSuccess: () => void
}

function RegisterForm({ onSuccess }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({ defaultValues: { userName: "", password: "" } })

  const { users, actions } = useUser()

  const [formError, setFormError] = useState<string>("")
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  useEffect(() => {
    if (isSubmitted == true) {
      reset({ userName: "", password: "" })
      onSuccess()
    }
    setIsSubmitted(false)
    setFormError("")
  }, [isSubmitted, reset])

  const onSubmit: SubmitHandler<User> = (data: User) => {
    const _user: User = { userName: data.userName.trim(), password: data.password.trim() }
    const existingUser = users.find((u) => u.userName == _user.userName)

    if (!existingUser) {
      actions.createUser(_user)
      actions.setUser(_user)
      setIsSubmitted(true)
    } else {
      setFormError("Användarnamnet är redan taget")
      return
    }

    return
  }

  return (
    <div className="w-full max-w-xs">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>

        <div className="mb-4">
          <label className="block mb-2" >Användarnamn: </label>
          <input className='border' {...register("userName", { required: true })} />
          {errors.userName && errors.userName.type === "required" && <p className="text-red-500 text-xs italic mt-1">Vänligen ange ett användarnamn</p>}
        </div>

        <div className="mb-6">
          <label className="block mb-2">Lösenord: </label>
          <input type='password' className='border' id='password' {...register("password", { required: true })} />
          {errors.password && errors.password.type === "required" && <p className="text-red-500 text-xs italic mt-1">Vänligen ange ett lösenord</p>}
        </div>

        <div>
          {formError && <p className="text-red-500 text-sm italic mb-3">{formError}</p>}
        </div>

        <div>
          <input
            type="submit"
            value="Skapa ny användare"
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
      </form>
    </div>
  )
}

export default RegisterForm
